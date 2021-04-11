import AsyncStorage from '@react-native-community/async-storage';
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    ToastAndroid,
    StyleSheet,
    ActivityIndicator,
    Alert
} from "react-native";
import { Avatar, CheckBox, Icon } from 'react-native-elements'

import Field from '../components/Field';
import Http from '../components/Http';
import ImagePicker from '../components/ImagePicker';
import SearchBar from '../components/SearchBar';

const PASS_BLANK = { old: { text: '', flag: false }, new: { text: '', flag: false } }

const EditUser = ({ navigation, route }) => {
    const [pass, setPass] = useState(PASS_BLANK);
    const [user, setUser] = useState(route.params.user);
    const [modal, setModal] = useState(false);
    const [countries, setCountries] = useState({ data: [], flag: false });
    const [loading, setLoading] = useState(false);

    let passInput = '';

    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const pressAvatar = async() => {
        const img = await ImagePicker.getImage();

        if(img == null) {
            return;
        }
        
        setUser({ ...user, img });
    }

    const checkPass = () => {
        (!Field.checkFields([ pass.new.text, pass.old.text ])) 
        ? Alert.alert('Hey!', 'Write on all fields!')
        : !(Field.checkPass(pass.new.text) && Field.checkPass(pass.old.text)) 
        ? Alert.alert('Hey!', 'Password does not meet requirements')
        : sendNewUser('user/pass', { newPassword: pass.new.text, oldPassword: pass.old.text });
    }

    const sendNewUser = async (type, json) => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('PUT', type, json, token);
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) { 
                case 'Success':  
                    toast(data.message);
                    if(type == 'user') {
                        route.params.callback(user);
                        await AsyncStorage.setItem('user', JSON.stringify(user));
                        await AsyncStorage.setItem('token', data.body);
                        navigation.goBack();
                    
                    } else {
                        setModal(false);
                        setPass(PASS_BLANK);
                    }
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

        setLoading(false);
    }

    const getCountries = async () => {
        const data = await Http.send('GET', 'country', null, null);
        let res = [];

        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) { 
                case 'Success':  
                    toast(data.message);
                    res = data.body;
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

        return res;
    }

    const onPressItemSearchBar = (item) => { 
        setUser({ ...user, country: item.tittle, newCountry: item });
        setCountries({ ...countries, flag: false });
    }

    useEffect(() => {
        getCountries().then(res => setCountries({ ...countries, data: res }));
    }, []);

    return (
        <View style={styles.container}>
            <SearchBar
                arrayData={countries.data}
                vissible={countries.flag}
                onCancel={() => setCountries({ ...countries, flag: false })}
                onPressItem={onPressItemSearchBar.bind(this)}
            />
            <Modal 
                animationType="slide"
                transparent
                visible={modal}
                onRequestClose={() => setModal(false)}
                >
                <View style={styles.modal}>
                    <View style={styles.viewModal}> 
                        <View style={{ alignItems:'center' }}>
                            <Text style={styles.tittleModal}>
                                Change password
                            </Text>
                            <Text style={{ color: 'gray' }}>
                                The password must be uppercase, lowercase, special character and greater than 8 characters!
                            </Text>
                        </View>
                        <View style={[ styles.viewInputPass, styles.viewRow ]}>
                            <TextInput
                                style={{ width: '70%' }}
                                placeholder="Old Password"
                                autoCapitalize="none"
                                autoFocus
                                secureTextEntry={!pass.old.flag}
                                value={pass.old.text}
                                blurOnSubmit={false}
                                onChangeText={text => setPass({ ...pass, old: { ...pass.old, text } })}
                                onSubmitEditing={() => passInput.focus()}
                            />
                            <CheckBox    
                                checkedIcon={<Icon name='eye-outline' color='white' type='ionicon' size={20} />}
                                uncheckedIcon={<Icon name='eye-off-outline' color='grey' type='ionicon' size={20} />}
                                checked={pass.old.flag}
                                onPress={() => setPass({ ...pass, old: { ...pass.old, flag: !pass.old.flag } })}
                            />                  
                        </View>
                        <View style={[ styles.viewInputPass, styles.viewRow ]}>
                            <TextInput
                                ref={ref => passInput = ref}
                                style={{ width: '70%' }}
                                placeholder="New Password"
                                autoCapitalize="none"
                                secureTextEntry={!pass.new.flag}
                                value={pass.new.text}
                                onChangeText={text => setPass({ ...pass, new: { ...pass.new, text } })}
                                onSubmitEditing={checkPass}
                            />
                            <CheckBox
                                checkedIcon={<Icon name='eye-outline' color='white' type='ionicon' size={20} />}
                                uncheckedIcon={<Icon name='eye-off-outline' color='grey' type='ionicon' size={20} />}
                                checked={pass.new.flag}
                                onPress={() => setPass({ ...pass, new: { ...pass.new, flag: !pass.new.flag } })}
                            />
                        </View> 
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={checkPass}
                            >
                            {
                                (loading)
                                ? <ActivityIndicator size="small" color="#00ff00" />
                                : <Text style={styles.buttonText}>
                                    Change Pass
                                </Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={[ styles.header, styles.viewRow ]}>
                <Icon
                    onPress={() => navigation.goBack()}
                    name='close-outline'
                    color='gray'
                    type='ionicon'
                    size={30}
                />
                <Text style={{ fontSize: 20 }}>
                    Edit user 
                </Text>
                <TouchableOpacity
                    onPress={() => sendNewUser('user', user)}
                    style={
                        (user.name.length && !loading && user.lastName.length  && user.email.length) 
                        && (
                            user.name != route.params.user.name 
                            || user.img != route.params.user.img
                            || user.description != route.params.user.description
                            || user.country != route.params.user.country
                            || user.lastName != route.params.user.lastName
                            || user.email != route.params.user.email
                        ) 
                        ? styles.saveButton
                        : [styles.saveButton, { borderColor: 'gray' }]
                    }
                    disabled={
                        (user.name.length && !loading && user.lastName.length && user.email.length) 
                        && (
                            user.name != route.params.user.name 
                            || user.img != route.params.user.img
                            || user.description != route.params.user.description
                            || user.country != route.params.user.country
                            || user.email != route.params.user.email
                            || user.lastName != route.params.user.lastName
                            
                        ) 
                        ? false
                        : true
                    }
                    >
                    {
                        (loading)
                        ? <ActivityIndicator size="small" color="#00ff00" />
                        : <Text style={
                                (user.name.length && !loading && user.lastName.length) 
                                && (
                                    user.name != route.params.user.name 
                                    || user.img != route.params.user.img
                                    || user.description != route.params.user.description
                                    || user.country != route.params.user.country
                                    || user.lastName != route.params.user.lastName
                                )  
                                ? styles.SaveButtonText
                                : [styles.SaveButtonText, { color: 'gray' }]
                            }
                            >
                            Save edit
                        </Text>
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <ScrollView>
                    <View style={styles.avatarView}>
                        <Avatar
                            onPress={() => pressAvatar()} 
                            rounded 
                            source={{ uri: `data:image/png;base64,${user.img}` }}
                            size="xlarge" 
                        />
                    </View>
                    <View style={{ marginHorizontal: '3%' }}>
                        <View style={styles.viewTextInput}>
                            <View/>
                            <TextInput
                                placeholder="Name"
                                onChangeText={name => setUser({ ...user, name })}
                                value={user.name}
                            />
                        </View>
                        <View style={styles.viewTextInput}>
                            <TextInput
                                placeholder="Last name"
                                onChangeText={lastName => setUser({ ...user, lastName })}
                                value={user.lastName}
                            />
                        </View>
                        <View style={styles.viewTextInput}>
                            <TextInput
                                placeholder="Email"
                                onChangeText={email => setUser({ ...user, email })}
                                value={user.email}
                            />
                        </View>
                        <View style={styles.viewTextInput}>
                            <TextInput
                                placeholder="description"
                                onChangeText={description => setUser({ ...user, description })}
                                value={user.description}
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => setCountries({ ...countries, flag: true })}
                            style={[ styles.viewTextInput, { paddingVertical: '4%' } ]}
                            >
                            <Text style={ {color: 'gray'} }>
                                Country: {user.country}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setModal(true)}
                            style={[styles.button, { width: '50%' }]}
                            >
                            <Text style={styles.buttonText}>
                                Password
                            </Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </View>
        </View>
    )
};

export default EditUser;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white', 
        flex: 1 
    },

    viewRow: {
        justifyContent: 'space-between', 
        flexDirection: 'row', 
        alignContent: 'center'
    },

    modal: {  
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    header: {
        marginTop: 24,
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

    saveButton: {
        padding: '2%',
        paddingVertical: '3%',
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: '5%',
        borderColor: '#3465d9',  
    },

    SaveButtonText: {
        fontWeight: "bold",
        color: '#3465d9',
    },

    body: {
        flex: 1,
        backgroundColor: '#f4f6fc'
    },

    button: { 
        marginTop:'5%',
        width: "100%",
        height: 40,
        backgroundColor: "#3465d9",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5, 
    },

    buttonText: {
        color: "white", 
        fontSize: 15, 
        fontWeight: "bold" 
    },

    tittleModal: { 
        fontSize: 20, 
        fontWeight: 'bold' 
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