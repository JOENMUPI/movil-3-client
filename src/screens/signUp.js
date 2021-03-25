import React, { useState } from 'react';
import { View, Text, TextInput, ToastAndroid, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';

import { Icon, Avatar, CheckBox } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import * as ImagePicker from 'expo-image-picker';

import Field from '../components/Field';
import Http from '../components/Http';
import SearchBar from '../components/SearchBar';

import { signUpStyles } from '../styles/screens/signUp';


const MAX_STEP = 3;
const USER_BLANK = {
    img: null,
    name: '',
    lastName: '',
    email: '', 
    country: null,
    phoneNumber: '',
    password: '', 
}


const SignUp = ({ navigation }) => {
    const [user, setUser] = useState(USER_BLANK);
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [countryFlag, setCountryFlag] = useState(false);
    const [vissiblePassFlag, setVissiblePassFlag] = useState(false);
    const [confirmationCode, setConfirmationCode] = useState({ flag: false, data: '' });

    const countries = [
        { id: 1, tittle: 'Venezuela', code: '+58' },
        { id: 2, tittle: 'Colombia', code: '+57' },
        { id: 3, tittle: 'Mexico', code: '+52' },
        { id: 4, tittle: 'Brazil', code: '+55' },
        { id: 5, tittle: 'Canada', code: '+1' },
        { id: 6, tittle: 'Ecuador', code: '+593' },
        { id: 7, tittle: 'Cuba', code: '+53' },
        { id: 8, tittle: 'Argentina', code: '+54' },
        { id: 9, tittle: 'Chile', code: '+56' },
        { id: 10, tittle: 'Uruguay', code: '+598' },
        { id: 11, tittle: 'Volivia', code: '+591' },
        { id: 12, tittle: 'Paraguay', code: '+595' },
        { id: 13, tittle: 'Peru', code: '+51' },
        { id: 14, tittle: 'Panama', code: '+507' },
        { id: 15, tittle: 'Puerto Rico', code: '+509' },
        { id: 16, tittle: 'Costa Rica', code: '+506' },
    ];
    
    let lastNameInput = '';
    let emailInput = '';

    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const onPressItemSearchBar = (item) => { 
        setUser({ ...user, country: item });
        setCountryFlag(!countryFlag);
    }

    const openImagePickerAsync = async () => {  
        let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        
        if(permission.status != 'granted') {
            Alert.alert(
            'Error', 
            'Sorry, we need camera roll permissions to make this work!',
            { cancelable: false }
        );
        return;

        }  else {
            const imgResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
                base64: true,
            }); 
            
            if(!imgResult.cancelled) {
                setUser({ ...user, img: imgResult.uri });
            } 
        }
    }

    const handleButton = () => {
        switch(step) {
            case 1:
                (!Field.checkFields([ user.email, user.name, user.lastName ])) 
                ? Alert.alert('Empty Field', 'Please, fill the fields.')
                : checkfield('email');
                break;

            case 2:
                if(user.country == null) {
                    Alert.alert('Hey!','Select a country!');
                
                } else {
                    (!Field.checkFields([ user.phoneNumber ])) 
                    ? Alert.alert('Empty Field', 'Please, fill the fields.')
                    : setStep(step + 1);
                }
                break;
            
            case 3:
                (!Field.checkFields([ user.password ])) 
                ? Alert.alert('Error on password', 'Please, check your password.')
                : submitSignUp();
                break;
            
            default:
                Alert.alert('Error on handleButton')
                break;
        }
    }

    const handleSendCodeButton = () => {
        if(user.country == null) {
            Alert.alert('Select country');
        
        } else if(user.phoneNumber.length < 1 || user.country == null) {
            Alert.alert('Write a phone number');
        
        } else {
            checkfield('number');
        }
    }

    const handleCodeInputSumitEditing = () => {
        (confirmationCode.data.length != 4)  
        ? Alert.alert('Error', 'Code incomplete')
        : handleButton();
    }
    
    const submitSignUp = async () => {
        setLoading(true); 
        const data = await Http.send('POST', 'user/singup', user);

        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) { 
                case 'Success':  
                    await AsyncStorage.setItem("user", JSON.stringify({ email: user.email, name: user.name, id: data.body.id }));
                    navigation.navigate('Home', { email: user.email, name: user.name, id: data.body.id });
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

    const checkfield = async (type) => {
        setLoading(true); 
        const data = await Http.send('POST', `user/check/${type}`, user);
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) { 
                case 'Success':
                    toast(data.message);
                    
                    switch(type) {
                        case 'email':
                            setStep(step + 1);
                            break;

                        case 'number':
                            setConfirmationCode({ ...confirmationCode, flag: true });
                            break;
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

    return (
        <View style={signUpStyles.container}>
            <Text style={signUpStyles.title}>
                Sign Up
            </Text>
            <Text style={signUpStyles.subtitle}>
                Sign Up with Email and Password
            </Text>
            <SearchBar
                arrayData={countries}
                vissible={countryFlag}
                onCancel={() => setCountryFlag(!countryFlag)}
                onPressItem={onPressItemSearchBar.bind(this)}
            />
            {
                (step == 1)
                ? <View>
                    <View style={{ alignItems: 'center', paddingTop: 10  }}>
                        {
                            (user.img != null) 
                            ? <Avatar 
                                onPress={openImagePickerAsync} 
                                rounded 
                                source={{ uri: user.img }}
                                size="xlarge" 
                            />
                            : <Avatar 
                                onPress={openImagePickerAsync} 
                                rounded 
                                size="xlarge"
                                containerStyle={{ backgroundColor: 'lightgray' }}
                                icon={{ name: 'camera-outline', color: 'white', type: 'ionicon', size: 100 }} 
                            />
                        }
                    </View>
                    <View style={signUpStyles.section}>
                        <Icon name='person-outline' color='gray' type='ionicon' size={20} />
                        <TextInput
                            placeholder="Name"
                            blurOnSubmit={false}
                            style={signUpStyles.textInput}
                            onChangeText={text => setUser({ ...user, name: text })}
                            onSubmitEditing={() => lastNameInput.focus()}
                            value={user.name}
                        />
                    </View>
                    <View style={signUpStyles.section}>
                        <Icon name='person-outline' color='gray' type='ionicon' size={20} />
                        <TextInput
                            ref={input => lastNameInput = input}
                            placeholder="Last name"
                            blurOnSubmit={false}
                            style={signUpStyles.textInput}
                            onChangeText={lastName => setUser({ ...user, lastName: lastName })}
                            onSubmitEditing={() => emailInput.focus()}
                            value={user.lastName}
                        />
                    </View>
                    <View style={signUpStyles.section}>
                        <Icon name='at-outline' color='gray' type='ionicon' size={20} />
                        <TextInput
                            ref={input => emailInput = input}
                            placeholder="Email"
                            autoCapitalize="none"
                            keyboardType={'email-address'}
                            style={signUpStyles.textInput}
                            onChangeText={email => setUser({ ...user, email: email })}
                            onSubmitEditing={handleButton}
                            value={user.email}
                        />
                    </View>    
                </View>
                : (step == 2)
                ? <View>
                    <TouchableOpacity 
                        style={signUpStyles.section}
                        onPress={() => setCountryFlag(true)} 
                        >
                        <Icon name='flag-outline' color='gray' type='ionicon' size={20} />
                        <Text style={signUpStyles.textInput}>
                            {
                                (user.country == null)
                                ? 'Country'
                                : user.country.tittle
                            } 
                        </Text>
                    </TouchableOpacity>
                    <View style={signUpStyles.section}>
                        <Icon name='phone-portrait-outline' color='gray' type='ionicon' size={20} />
                            {   
                                (user.country != null)
                                ? <Text style={signUpStyles.textInput}>{user.country.code}</Text>
                                : null
                            }
                        <TextInput
                            placeholder="Phone number"
                            keyboardType='numeric'
                            blurOnSubmit={false}
                            style={signUpStyles.textInput}
                            onChangeText={text => setUser({ ...user, phoneNumber: text })}
                            onSubmitEditing={handleSendCodeButton}
                            value={user.phoneNumber}
                        />
                    </View>
                    {
                        (!confirmationCode.flag) 
                        ? null
                        : <View style={signUpStyles.section}>
                            <Icon name='mail-outline' color='gray' type='ionicon' size={20} />
                            <TextInput
                                placeholder="Code"
                                keyboardType='numeric'
                                maxLength={4}
                                style={signUpStyles.textInput}
                                onChangeText={text => setConfirmationCode({ ...confirmationCode, data: text })}
                                onSubmitEditing={handleCodeInputSumitEditing}
                                value={confirmationCode.data}
                            />
                        </View>
                    }
                </View>
                : <View>
                    <View style={signUpStyles.sectionForText}>
                        <Text style={signUpStyles.textInput}>
                            The password must be uppercase, lowercase, special character and greater than 8 characters!
                        </Text>
                    </View>
                    <View style={[ signUpStyles.section, { justifyContent: 'space-between' } ]}>
                        <View style={signUpStyles.viewPass}>
                            <Icon name='lock-closed-outline' color='gray' type='ionicon' size={20} />
                            <TextInput
                                placeholder="Password"
                                autoCapitalize="none"
                                blurOnSubmit={false}
                                style={signUpStyles.textInput}
                                secureTextEntry={!vissiblePassFlag}
                                onChangeText={password => setUser({ ...user, password: password })}
                                onSubmitEditing={handleButton}
                                value={user.password}
                            />
                        </View>
                        <CheckBox
                            checkedIcon={<Icon name='eye-outline' color='gold' type='ionicon' size={20}/>}
                            uncheckedIcon={<Icon name='eye-off-outline' color='grey' type='ionicon' size={20}/>}
                            checked={vissiblePassFlag}
                            onPress={() => setVissiblePassFlag(!vissiblePassFlag)}
                        />
                    </View>
                </View>
            } 
            {
                (step != 2)
                ? null
                :<TouchableOpacity
                    disabled={confirmationCode.data.length != 0}
                    onPress={handleSendCodeButton} 
                    style={
                        (step == 2 && confirmationCode.data.length == 0)
                        ? [ signUpStyles.signIn, { width: '50%' } ]
                        : [ signUpStyles.signIn, { width: '50%', backgroundColor: 'lightgray' } ]
                    }
                    >
                    {
                        (loading) 
                        ? <ActivityIndicator size="small" color="#00ff00" /> 
                        : <Text style={signUpStyles.textSignIn}>
                            Send Code
                        </Text>
                    }
                </TouchableOpacity>
            }
            <TouchableOpacity
                disabled={(step == 2 && confirmationCode.data.length != 4)}
                onPress={handleButton} 
                style={
                    (step == 2 && confirmationCode.data.length != 4)
                    ? [ signUpStyles.signIn, { backgroundColor: 'lightgray' } ]
                    : signUpStyles.signIn
                }
                >
                {
                    (loading) 
                    ? <ActivityIndicator size="small" color="#00ff00" /> 
                    : <Text style={signUpStyles.textSignIn}>
                        { 
                            (step < MAX_STEP)
                            ? 'Next'
                            : 'Sign Up'
                        }
                    </Text>
                }
            </TouchableOpacity>
            {
                (step == 1)
                ? null
                : <View style={signUpStyles.signUp}>
                    <Text style={signUpStyles.subtitle}>
                        Do you want to change something in the after step?
                    </Text>
                    <TouchableOpacity onPress={() => setStep(step - 1)}>
                        <Text style={signUpStyles.textSignUp}>
                            Go back
                        </Text>
                    </TouchableOpacity>
                </View>
            }
            <View style={signUpStyles.signUp}>
                <Text style={signUpStyles.subtitle}>
                    Already have an account?
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
                    <Text style={signUpStyles.textSignUp}>
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SignUp;