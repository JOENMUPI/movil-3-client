import React, { useState, useEffect } from 'react';
import {
    View,
    Text, 
    RefreshControl,
    ActivityIndicator,
    ToastAndroid,
    ScrollView,
    StyleSheet
} from "react-native";
import { Icon, Avatar } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';

import Http from '../components/Http';
import ModalListC from '../components/modalList';


const ENTERPRISE_BLANK = {
    name: 'name',
    description: 'des',
    img: null,
    id: 0,
    userId: 0
}


const seeEnterprise = ({ navigation, route }) => { 
    const [loading, setLoading] = useState({ loading: false, first: true }); 
    const [enterprise, setEnterprise] = useState(ENTERPRISE_BLANK);
    const [me, setMe] = useState({}); 

    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const getMe = async () => {
        return JSON.parse(await AsyncStorage.getItem('user'));
    }

    const refresh = () => {
        getEnterprise().then(res => { 
            setEnterprise(res);
            setLoading({ first: false, loading: false }); 
        });
    }

    const callBackEnterprise = (type, data) => { 
        setEnterprise(data);
        route.params.callback(type, data);
    }

    const getEnterprise = async () => {   
        setLoading({ ...loading, loading: true })
        const id = route.params.enterpriseId;
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('GET', `enterprise/${id}`, null, token);
    
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message); 
                    return data.body;

                case 'Fail':
                    data.body.errors.forEach(element => {
                        toast(element.text);
                    });
                    return ENTERPRISE_BLANK;
                    
                default:
                    Alert.alert(data.typeResponse, data.message);
                    return ENTERPRISE_BLANK;
            }
        } 
    }



    useEffect(() => {  
        getMe().then(res => { 
            setMe(res);
        });

        refresh(); 
    }, []);

    return (
        <View style={styles.container}>
            {
                (loading.loading && loading.first)
                ? <ActivityIndicator size="large" color="#00ff00" />
                : <ScrollView
                    contentContainerStyle={{ width: '100%'  }}    
                    refreshControl={
                        <RefreshControl
                            refreshing={loading.loading}
                            onRefresh={refresh}
                        />
                    }
                    >
                    <View style={styles.viewLinesItem}> 
                        { 
                            (enterprise.img == null)
                            ? <Avatar 
                                rounded
                                size="xlarge"
                                containerStyle={{ backgroundColor: 'lightgray' }}
                                icon={{ name: 'camera-outline', color: 'white', type: 'ionicon', size: 100 }} 
                            />
                            : <Avatar 
                                rounded 
                                source={{ uri: `data:image/png;base64,${enterprise.img}` }}
                                size="xlarge" 
                            />
                        }
                        <View style={[ styles.viewRow, styles.viewEditIcon ]}>
                            <View>
                                <Text style={styles.name}>
                                    {enterprise.name}
                                </Text>
                                <Text style={[ styles.tittleItem, { fontWeight: 'normal' } ]}>
                                    {enterprise.description}
                                </Text>
                            </View>
                            {
                                (enterprise.userId != me.id)
                                ? null
                                : <Icon
                                    containerStyle={{ paddingRight: '5%' }}
                                    onPress={() => navigation.navigate('Enterprise', { data: enterprise, callback: callBackEnterprise.bind(this) })}
                                    name='pencil'
                                    color='gray'
                                    type='ionicon' 
                                    size={30}
                                />
                            }
                        </View>
                    </View>
                </ScrollView>
            }
        </View>
    )
};

export default seeEnterprise;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 24,
        height:'100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#f4f6fc',
    },

    viewEditIcon: {
        justifyContent: 'space-between', 
        paddingLeft: '3%' 
    },

    viewLinesItem: {
        paddingLeft: '3%',
        paddingTop: '2%'
    },


    tittleItem: { 
        color:'gray', 
        fontWeight: 'bold', 
        fontSize: 20 
    },

    name: {
        fontWeight: "bold", 
        fontSize: 30, 
    },

    viewRow: {
        flexDirection: 'row',
        alignItems: "center"
    },
});