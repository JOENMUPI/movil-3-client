import React, { useState, useEffect } from 'react';
import { 
    View, 
    Alert, 
    Text, 
    FlatList, 
    RefreshControl, 
    ActivityIndicator, 
    ToastAndroid,
    StyleSheet, 
    TouchableOpacity,
    Linking
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import Contacts from '../components/Contact';
import Http from '../components/Http';

const Contact = ({ navigation }) => { 
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState({ first: true, flag: false });


    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }
    
    const refresh = () => {
        setLoading({ ...loading, flag: true });
        Contacts.getConTacts().then(res => { 
            setData(res);   
            setLoading({ first: false, flag: false });
        });
    }

    const checkNum = (item) => {
        let num = item.phoneNumbers[0].number.toString().split(' ');
        
        num = num.toString().match(/(\d+)/g);
        if(num.length < 2) {
            Alert.alert('Sorry!', 'Unknown format');
            
        } else {
            let aux = '';
            
            for(let i = 1; i < num.length; i ++) {
                aux = aux.concat(num[i]);
            }

            (aux.length != 10) 
            ? Alert.alert('Sorry!', 'Unknown format')
            : seacrhNum(aux, item.phoneNumbers[0].number);
        }
    }

    const sendSMS = async (num) => {
        await Linking.openURL(
            `sms:${num}?body=Hello!. You have been invited to join the LinkedIn clone! ✔` +
            '\nDownload the application at this link: https://expo.io/artifacts/d95bfaf3-4261-4192-bd95-ac4f58062e66 '
        );
    }

    const alertContact = (num) => {
        Alert.alert(
            'Hey!', 
            "This contact doesn't have a FakedIn account, do you want to share the download link?",
            [
                { text: "NO", style: "cancel" }, 
                { text: "YES", onPress: () => sendSMS(num) }
            ], { cancelable: false }
        );
    }

    const seacrhNum = async (num, realNum) => {
        setLoading({ ...loading, flag: true });
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('GET', `user/num/search/${num}`, null, token); 
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message); 
                    (data.body)
                    ? navigation.navigate('UserProfile', { userId: data.body.id })
                    : alertContact(realNum);
                    break;

                case 'Fail':
                    data.body.errors.forEach(element => {
                        toast(element.text);
                    });
                    break;
                    
                default:
                    Alert.alert(data.typeResponse, data.message);
                    break;
            }
        }

        setLoading({ ...loading, flag: false });
    }

    const renderItem = ({ item }) => (   
        <TouchableOpacity
            onPress={() => checkNum(item)} 
            style={styles.item}
            >
            <Text>
                {item.name} 
            </Text>
            <Text style={{ color: 'gray' }}>
                {item.phoneNumbers[0].number}
            </Text>
        </TouchableOpacity>  
    )

    useEffect(() => { 
        refresh();
    }, []);
    
    return (    
        <View style={styles.container}>
            <View style={styles.Header}>
                <Text style={styles.tittle}>
                    Contacts 
                </Text> 
            </View>
            {
                (loading.flag)
                ? <ActivityIndicator size="large" color="#00ff00" />
                : !(data.length)
                ? <Text style={styles.textMessage}>
                    User without Contacts
                </Text>
                : <FlatList
                    refreshControl={
                        <RefreshControl
                            refreshing={loading.flag && !loading.first}
                            onRefresh={refresh}
                        />
                    }
                    style = {styles.list}
                    data={data}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            }
        </View>
    )
}

export default Contact;

export const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white', 
        flex: 1 ,
    },

    item: {
        marginTop: '3%',
        padding: '5%',
        backgroundColor: 'white' , 
        borderRadius: 10, 
        alignItems: 'center', 
        flexDirection: 'row',
        justifyContent: 'space-between' 
    },

    tittle: { 
        fontSize: 30, 
        fontWeight:'bold' 
    },

    list: {
        paddingTop: 10, 
        paddingHorizontal: 16, 
        backgroundColor: '#f4f6fc'
    },

    textMessage: {
        padding: 20,
        backgroundColor: '#f4f6fc', 
        fontSize: 25, 
        color: 'gray', 
        textAlign: "center",
        height: '100%'
    },

    Header: {
        marginTop: 24,
        backgroundColor: 'white',
        padding: '2%',
        width: '100%',
        justifyContent: 'center',
        alignItems: "center",
        paddingHorizontal: '5%',
    },
});