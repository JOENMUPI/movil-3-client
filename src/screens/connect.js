import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    ToastAndroid,
    StyleSheet,
    Alert,
    ActivityIndicator
} from "react-native";
import { Avatar, Icon, ListItem } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import Http from '../components/Http';
import ModalListC from '../components/modalList';

const Connect = ({ navigation, route }) => {
    const [connect, setConnect] = useState({ petitions: [], connect: [] });
    const [modalList, setModalList] = useState(false);
    const [loading, setLoading] = useState(false);

    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const deleteConnectAlert = (item) => {
        Alert.alert(
            'Waring', 
            `Are you sure delete ${item.name} ${item.lastName} from connect?`,
            [
                { text: "Cancel", style: "cancel" }, 
                { text: "OK", onPress: () => deleteConnect(item) }
            ], { cancelable: false }
        );
    }

    const getConnects = async () => {   
        setLoading(true)
        const token = await AsyncStorage.getItem('token'); 
        const me = JSON.parse(await AsyncStorage.getItem('user'));
        const data = await Http.send('GET', 'connect', null, token);
    
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            let res = { connect: [], petitions: [] };
            
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message);
                    let connectAux = [];
                    let petitions = []; 
                     
                    data.body.forEach(item => { 
                        if (item.petitionState) { 
                            connectAux.push(item);

                        } else { 
                            if(item.userObj == me.id) {
                                petitions.push(item)
                            }   
                        }
                    });
                     
                    res = { connect: connectAux, petitions }                 
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

    const sendResponseRequest = async (type, item) => {   
        const token = await AsyncStorage.getItem('token');
        let data;
        
        (type == 'DELETE') 
        ? data = await Http.send(type, `connect/${item.id}`, null, token)
        : data = await Http.send(type, 'connect', { id: item.id }, token);
    
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
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
        } 
    }

    const handleOptionsRequestConnect = (editFlag, request) => {
        const petitions = connect.petitions.filter(i => i.id != request.id);
        const newConnect = connect.connect;
        
        if(editFlag) {
            newConnect.push(request);
            sendResponseRequest('PUT', request);
        
        } else {
            sendResponseRequest('DELETE', request)
        }

        setConnect({ connect: newConnect, petitions });
    }

    const deleteConnect = (conn) => {
        let requestsAux = connect.connect.filter(i => i.id != conn.id);

        setConnect({ ...connect, connect: requestsAux });
        sendResponseRequest('DELETE', conn);
    }

    const ButtonOptionC = ({ tittle, onPress }) => (
        <TouchableOpacity
            style={[ styles.button, styles.viewRow, { justifyContent: 'space-between' } ]}
            onPress={onPress}
            >
            <Text style={styles.tittle}>
                {tittle}
            </Text>
            <Icon    
                name='chevron-forward-outline'
                color='gray'
                type='ionicon'
                size={20}
            />
        </TouchableOpacity>
    )

    const handleAvatarIconRenderItem = (item) => {
        setModalList(false);
        navigation.navigate('UserProfile', { userId: item.id });
    }

    const renderItemConnect = ({ item }) => ( 
        <View style={styles.viewItem}> 
            <View style={styles.item}>
                <View style={styles.viewRow}>
                    {
                        (item.img != null)
                        ? <Avatar 
                            onPress={() => handleAvatarIconRenderItem(item)}
                            rounded 
                            source={{ uri: `data:image/png;base64,${item.img}` }}
                            size="medium" 
                        />
                        : <Avatar 
                            onPress={() => handleAvatarIconRenderItem(item)}
                            rounded
                            size="medium"
                            containerStyle={{ backgroundColor: 'lightgray' }}
                            icon={{ name: 'camera-outline', color: 'white', type: 'ionicon', size: 100 }} 
                        />
                    }
                    <View style={{ paddingLeft: 10 }}>
                        <Text style={styles.tittle}>
                            {item.name} {item.lastName} 
                        </Text>  
                    </View>    
                </View>
                <Icon
                    onPress={() => deleteConnectAlert(item)}
                    name='close-outline'
                    color='gray' 
                    type='ionicon' 
                    size={30}
                />
            </View>
        </View>
    )

    useEffect(() => { 
        getConnects().then(res => {
            setConnect(res);
            setLoading(false);
        });
    }, []);

    return (
        <View style={styles.container}>
            <ModalListC
                tittle='Connects'
                vissible={modalList}
                addPress={() => Alert.alert('Sorry', 'option not available')}
                onCancel={() => setModalList(false)}
                data={connect.connect}
                renderItem={renderItemConnect}
            />
            <ScrollView>
                <ButtonOptionC
                    onPress={() => setModalList(true)}
                    tittle='Connects'
                />
                <ButtonOptionC
                    onPress={() => console.log('perra')}
                    tittle='contact (working...)'
                />
                <View style={styles.viewList}>
                    <View style={[ styles.viewRow, { justifyContent: 'space-between', paddingEnd: '3%' }]}>
                        <Text style={[styles.tittleList]}>
                            request connect
                        </Text>
                        <Icon
                            onPress={() => 
                                getConnects().then(res => {
                                    setConnect(res);
                                    setLoading(false);
                                })
                            }
                            name='refresh-outline'
                            color='gray' 
                            type='ionicon' 
                            size={20}
                        />
                    </View>
                    {
                        (loading)
                        ? <ActivityIndicator size="large" color="#00ff00" />
                        : (connect.petitions.length < 1)
                        ? <View style={styles.modal}>
                            <Text style={styles.tittle}>
                                No pending requests
                            </Text>
                        </View> 
                        : connect.petitions.map((item, index) => (
                            <ListItem 
                                key={index} 
                                bottomDivider
                                >
                                <ListItem.Content>
                                    <View style={styles.viewRow}> 
                                        <View style={styles.viewRow}>
                                            {
                                                (item.img != null)
                                                ? <Avatar 
                                                    onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
                                                    rounded 
                                                    source={{ uri: `data:image/png;base64,${item.img}` }}
                                                    size="medium" 
                                                />
                                                : <Avatar 
                                                    onPress={() => navigation.navigate('UserProfile', { userId: item.id })}
                                                    rounded
                                                    size="medium"
                                                    containerStyle={{ backgroundColor: 'lightgray' }}
                                                    icon={{ name: 'camera-outline', color: 'white', type: 'ionicon', size: 100 }} 
                                                />
                                            }
                                            <View style={{ paddingLeft: 10 }}>
                                                <Text style={styles.tittle}>
                                                    {item.name} {item.lastName} 
                                                </Text>  
                                            </View>
                                        </View>      
                                        <View style={[styles.viewRow, { flex: 1, justifyContent:'flex-end' }]}>
                                            <Icon
                                                onPress={() => handleOptionsRequestConnect(true, item)}
                                                containerStyle={{ paddingHorizontal: '5%' }}
                                                name='checkmark-outline'
                                                color='gray' 
                                                type='ionicon' 
                                                size={30}
                                            />
                                            <Icon
                                                onPress={() => handleOptionsRequestConnect(false, item)}
                                                name='close-outline'
                                                color='gray' 
                                                type='ionicon' 
                                                size={30}
                                            />
                                        </View>
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

export default Connect;

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
        borderRadius: 10 
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
        justifyContent: "center",
        alignItems: "center",
    },

    header: {
        
        backgroundColor: 'white',
        padding: '2%',
        width:'100%',
        justifyContent: 'space-between',
    },

    viewModal: {
        margin: '5%',
        backgroundColor: "white",
        borderRadius: 10,
        padding: '5%',
        width: '50%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    button: { 
        marginTop:'3%',
        borderRadius: 5, 
        padding: '2%', 
        backgroundColor: 'white'
    },

    buttonText: {
        color: "white", 
        fontSize: 15, 
        fontWeight: "bold" 
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

    viewTextInput: {
        marginTop: '2%', 
        padding: '3%', 
        backgroundColor: 'white', 
        borderRadius: 5 
    },

    viewInputPass: {
        marginTop: '5%', 
        paddingHorizontal: '10%', 
        backgroundColor: 'lightgray', 
        borderRadius: 5 
    },

    avatarView: {
        paddingTop: '3%',
        justifyContent: "center",
        alignItems: 'center',
    }
});