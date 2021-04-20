import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
    StyleSheet,
    Alert,
    ActivityIndicator,
    RefreshControl
} from "react-native";
import { Avatar, Icon, ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import Http from '../components/Http';

const COMPANIES_BLANK = {
    companies: [], 
    petitions: [], 
    admin: [] 
}

const Companies = ({ navigation, route }) => {
    const [companies, setCompanies] = useState(COMPANIES_BLANK);
    const [loading, setLoading] = useState({ flag: false, first: true });

    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const refresh = () => {
        getCompanies().then(res => {
            setCompanies(res);
            setLoading({ first: false, flag: false });
        });
    }

    const callbackCompanies = (type, data) => {
        let newCompanies = companies.companies;
        
        switch(type) {
            case 'create': 
                newCompanies.unshift(data);
                break;
            
            case 'update':
                newCompanies = companies.companies.map(item => {
                    if(item.id == data.id) {
                        return data;
                    }

                    return item;
                });
                break;
        }

        setCompanies({ ...companies, companies: newCompanies });
    }

    const deleteAlert = (item) => {
        Alert.alert(
            'Waring', 
            `Are you sure delete ${item.name}?`,
            [
                { text: "Cancel", style: "cancel" }, 
                { text: "OK", onPress: () => deleteCompanie(item) }
            ], { cancelable: false }
        );
    }

    const getCompanies = async () => {   
        setLoading({ ...loading, flag: true })
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('GET', 'enterprise', null, token);
    
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            let res = COMPANIES_BLANK;
            
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message); 
                    res = { ...companies, companies: data.body }                 
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

            return res;
        } 
    }

    const sendDeleteCompany = async (company) => {   
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('DELETE', `enterprise/${company.id}`, null, token);
    
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            let res = COMPANIES_BLANK;
            
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message); 
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

            return res;
        } 
    }

    const deleteCompanie = (company) => {
        const companiesAux = companies.companies.filter(i => i.id != company.id)
        setCompanies({ ...companies, companies: companiesAux });
        sendDeleteCompany(company);
    }

    useEffect(() => { 
        refresh();
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView
                refreshControl={
                    <RefreshControl
                        refreshing={loading.flag && !loading.first}
                        onRefresh={refresh}
                    />
                }
                >
                <View style={styles.viewList}>
                    <View style={{ ...styles.viewRow, justifyContent: 'space-between', paddingEnd: '3%' }}>
                        <Text style={[styles.tittleList]}>
                            My companies
                        </Text>
                        <Icon
                            onPress={() => navigation.navigate('Enterprise', { callback: callbackCompanies.bind(this) })}
                            name='add-outline'
                            color='gray' 
                            type='ionicon' 
                            size={30}
                        />
                    </View>
                    {
                        (loading.flag && loading.first)
                        ? <ActivityIndicator size="large" color="#00ff00" />
                        : (companies.companies.length < 1)
                        ? <View style={styles.modal}>
                            <Text style={styles.tittle}>
                                User without companies
                            </Text>
                        </View> 
                        : companies.companies.map((item, index) => (
                            <ListItem 
                                key={index} 
                                bottomDivider
                                >
                                <ListItem.Content>
                                    <View style={[ styles.viewRow, { width: '100%', justifyContent: 'space-between' } ]}> 
                                        <TouchableOpacity 
                                            onPress={() => navigation.navigate('SeeEnterprise', { enterpriseId: item.id, callback: callbackCompanies.bind(this) })}
                                            style={[styles.viewRow, { width: '80%' }]}
                                            >
                                            {
                                                (item.img != null)
                                                ? <Avatar 
                                                    rounded 
                                                    source={{ uri: `data:image/png;base64,${item.img}` }}
                                                    size="medium" 
                                                />
                                                : <Avatar 
                                                    rounded
                                                    size="medium"
                                                    containerStyle={{ backgroundColor: 'lightgray' }}
                                                    icon={{ name: 'camera-outline', color: 'white', type: 'ionicon', size: 40 }} 
                                                />
                                            }
                                            <View style={{ paddingLeft: 10 }}>
                                                <Text style={styles.tittle}>
                                                    {item.name}  
                                                </Text>
                                                <Text style={{ color: 'gray' }}>
                                                    {item.description}  
                                                </Text>  
                                            </View>
                                        </TouchableOpacity>
                                        <Icon
                                            onPress={() => deleteAlert(item)}
                                            name='trash-outline'
                                            color='gray' 
                                            type='ionicon' 
                                            size={30}
                                        />      
                                    </View>
                                </ListItem.Content>
                            </ListItem>
                        ))
                    }
                </View> 
            </ScrollView>
        </View>
    )
};

export default Companies;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f4f6fc', 
        flex: 1 ,
        paddingTop: '10%',
        padding: '3%'
    },

    viewList: {
        marginTop: '2%',
        backgroundColor: 'white', 
        borderRadius: 10,
        padding: '2%'
    },

    viewRow: {
        flexDirection: 'row', 
        alignItems: 'center'
    },

    viewItem: {
        padding: 10,
        width: '100%',
        backgroundColor: '#f4f6fc',
    },

    item: {
        paddingVertical: '5%',
        paddingHorizontal: '5%',
        backgroundColor: 'white' , 
        borderRadius: 10, 
        alignItems: 'center', 
        flexDirection: 'row',
        justifyContent: 'space-between' 
    },

    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    tittle: { 
        color: 'gray',
        fontSize: 20, 
        fontWeight: 'bold' 
    },

    tittleList: { 
        fontWeight: "bold", 
        fontSize: 30, 
        paddingLeft: 10 
    },

});