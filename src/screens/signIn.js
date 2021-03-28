import React, { useState } from 'react';
import { View, Text, TextInput, ToastAndroid, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { Icon } from 'react-native-elements'

import Field from '../components/Field';
import Http from '../components/Http';

import { signInStyles } from '../styles/screens/signIn';


const SignIn = ({ navigation }) => {
    const [user, setUser] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    let passInput = '';

    const submitSignIn = async () => { 
        setLoading(true);
        if(!Field.checkFields([ user.email, user.password ])) {
            Alert.alert('Empty Field', 'Please, fill the fields');
            
        } else {
            const data = await Http.send('POST', 'user/singin', user, null);
        
            if(!data) {
                Alert.alert('Fatal Error', 'No data from server...');
                
            } else { 
                switch(data.typeResponse) {
                    case 'Success':  
                        await AsyncStorage.setItem('token', data.body.token); 
                        await AsyncStorage.setItem('img', data.body.img); 
                        navigation.navigate('Tabs'); 
                        break;
                
                    case 'Fail':
                        data.body.errors.forEach(element => {
                            ToastAndroid.showWithGravity(
                                element.text,
                                ToastAndroid.SHORT,
                                ToastAndroid.TOP
                            );
                        });
                        break;

                    default:
                        Alert.alert(data.typeResponse, data.message);
                        break;
                }
            }
        }

        setLoading(false);
    }
    

    return (
        <View style={signInStyles.container}>
            <Text style={signInStyles.title}>Sign In</Text>
            <Text style={signInStyles.subtitle}>Sign In with Email and Password</Text>
            <View>
                <View style={signInStyles.section}>
                    <Icon name='at-outline' color='gray' type='ionicon' size={20} />
                    <TextInput
                        placeholder="Email"
                        autoCapitalize="none"
                        keyboardType={'email-address'}
                        blurOnSubmit={false}
                        style={signInStyles.textInput}
                        autoFocus
                        onChangeText={email => setUser({ ...user, email: email })}
                        onSubmitEditing={() => passInput.focus()}
                    />
                </View>
                <View style={signInStyles.section}>
                    <Icon name='lock-closed-outline' color='gray' type='ionicon' size={20} />
                    <TextInput
                        ref={input => passInput = input}
                        placeholder="Password"
                        autoCapitalize="none"
                        style={signInStyles.textInput}
                        secureTextEntry
                        onChangeText={password => setUser({ ...user, password: password })}
                        onSubmitEditing={submitSignIn}
                    />
                </View>
            </View>
            
            <TouchableOpacity onPress={submitSignIn} style={signInStyles.signIn}>
                {
                    (loading) 
                    ? <ActivityIndicator size="small" color="#00ff00" /> 
                    : <Text style={signInStyles.textSignIn}>Sign In</Text>
                }
            </TouchableOpacity>
            <View style={signInStyles.signUp}>
                <Text style={signInStyles.textSignUp}>
                    Don't have an account?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                    <Text 
                        style={[ signInStyles.textSignUp, { color: "#3465d9", marginLeft: 3 } ]}
                        >
                        Sign Up
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SignIn;