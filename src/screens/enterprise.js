
import React, { useState, useEffect } from 'react';
import {
    View,
    Text, 
    TextInput,
    ScrollView,
    TouchableOpacity,
    ToastAndroid,
    ActivityIndicator,
    StyleSheet
} from "react-native";
import { Icon, Avatar } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import Http from '../components/Http';
import ImagePicker from '../components/ImagePicker';

const ENTERPRISE_BLANK = {
    name: '', 
    description: '', 
    img: null   
}

const Enterprise = ({ navigation, route }) => {   
    const [enterprise, setEnterprise] = useState(ENTERPRISE_BLANK);
    const [descriptionFlag, setDescriptionFlag] = useState(false);
    const [loading, setLoading] = useState(false);

    let desInput = '';

    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const getEnterprise = () => {
        if(route.params.data) {
            return route.params.data;
        
        } else {
            return ENTERPRISE_BLANK;
        }
    }

    const handleSendbutton = () => {
        (route.params.data) 
        ? sendEnterprise('PUT')
        : sendEnterprise('POST'); 
    }

    const sendEnterprise = async (mode) => {   
        setLoading(true);
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send(mode, 'enterprise', enterprise, token); 
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message); 
                    (route.params.data) 
                    ? route.params.callback('update', enterprise)
                    : route.params.callback('create', data.body);
                    
                    navigation.goBack();                   
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

    const handleImg = async () => {
        const img = await ImagePicker.getImage();
        
        setEnterprise({ ...enterprise, img });
    }

    useEffect(() => { 
        setEnterprise(getEnterprise());
    }, []);

    return (
        <View style={ styles.container }>
            <View style={[ styles.Header, styles.viewRow ]}>
                <Icon
                    name='close-outline'
                    color='gray'
                    type='ionicon'
                    size={30}
                    onPress={() => navigation.goBack()}
                />
                <Text style={styles.headerTittle}>
                    {
                        (route.params.data)
                        ? 'Edit Company'
                        : 'New Company'
                    }
                </Text>
                <TouchableOpacity 
                    onPress={handleSendbutton}
                    disabled={
                        (route.params.data)
                        ? (enterprise.name.length && enterprise.description.length && !loading) 
                        && (
                            enterprise.img != route.params.data.img
                            || enterprise.name != route.params.data.name
                            || enterprise.description != route.params.data.description
                        ) 
                        ? false
                        : true
                        : (enterprise.name.length && enterprise.description.length && !loading) 
                        ? false 
                        : true
                    }
                    style={
                        (route.params.data)
                        ? (enterprise.name.length && enterprise.description.length && !loading) 
                        && (
                            enterprise.img != route.params.data.img
                            || enterprise.name != route.params.data.name
                            || enterprise.description != route.params.data.description
                        ) 
                        ? styles.saveButton
                        : [ styles.saveButton, { borderColor: 'gray' } ]
                        : (enterprise.name.length && enterprise.description.length && !loading) 
                        ? styles.saveButton
                        : [ styles.saveButton, { borderColor: 'gray' } ]
                    }
                    >
                    {
                        (loading)
                        ? <ActivityIndicator size="small" color="#00ff00" />
                        : <Text 
                            style={
                                (route.params.data)
                                ? (enterprise.name.length && enterprise.description.length && !loading) 
                                && (
                                    enterprise.img != route.params.data.img
                                    || enterprise.name != route.params.data.name
                                    || enterprise.description != route.params.data.description
                                ) 
                                ? styles.saveButtonText
                                : [ styles.saveButtonText, { color: 'gray' } ]
                                : (enterprise.name.length && enterprise.description.length && !loading) 
                                ? styles.saveButtonText
                                : [ styles.saveButtonText, { color: 'gray' } ]
                            }
                            >
                            {
                                (route.params.data)
                                ? 'Edit '
                                : 'Send'   
                            }
                        </Text>
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <ScrollView>
                    <View style={styles.viewAvatar}>
                        {
                            (enterprise.img == null)
                            ? <Avatar 
                                onPress={handleImg}
                                rounded
                                size="xlarge"
                                containerStyle={{ backgroundColor: 'lightgray' }}
                                icon={{ name: 'camera-outline', color: 'white', type: 'ionicon', size: 100 }} 
                            />
                            : <Avatar 
                                onPress={handleImg}
                                rounded 
                                size="xlarge" 
                                source={{ uri: `data:image/png;base64,${enterprise.img}` }}
                            />  
                        }   
                    </View>
                    <TextInput 
                        style={styles.inputText}
                        blurOnSubmit={false}
                        placeholder='Name'
                        onChangeText={text => setEnterprise({ ...enterprise, name: text })}
                        value={enterprise.name}
                        onSubmitEditing={() => desInput.focus()}
                    />
                    <TextInput
                        ref={ref => desInput = ref} 
                        style={styles.inputText}
                        placeholder='Description'
                        onFocus={() => setDescriptionFlag(true)}
                        onEndEditing={() => setDescriptionFlag(false)}
                        multiline
                        onChangeText={text => setEnterprise({ ...enterprise, description: text })}
                        value={enterprise.description}
                    />
                    {
                        (!descriptionFlag) 
                        ? null 
                        : <TouchableOpacity style={styles.TextAreabutton}>
                            <Text style={{ color: 'white' }}>
                                Finish editing
                            </Text>
                        </TouchableOpacity>    
                    } 
                </ScrollView>
            </View>
        </View>       
    )
};

export default Enterprise;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },

    viewAvatar: {
        alignItems: 'center', 
        paddingTop: '2%' 
    },

    TextAreabutton: {
        backgroundColor: '#1e90ff', 
        alignItems: 'center', 
        borderRadius: 5, 
        padding: 15, 
        marginTop: 10
    },

    Header: {
        marginTop: 24,
        backgroundColor: 'white',
        padding: '3%',
        justifyContent: 'space-between',
    },

    headerTittle: {
        fontWeight: 'bold', 
        fontSize: 30
    },

    viewRow: {
        alignItems: "center",
        flexDirection: 'row',
    },

    inputText: {
        marginTop: '3%',
        padding: '3%',
        backgroundColor: 'white',
        borderRadius: 10,
        color: 'gray'
    },

    saveButton: {
        padding: '2%',
        paddingVertical: '3%',
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: '5%',
        borderColor: '#3465d9',
    },

    body: {
        flex: 1,
        paddingHorizontal: '3%',
        backgroundColor: '#f4f6fc'
    },

    saveButtonText: {
        fontWeight: "bold",
        color: '#3465d9',
    },
});