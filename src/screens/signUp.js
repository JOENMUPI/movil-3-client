import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    ToastAndroid, 
    TouchableOpacity, 
    Alert, 
    ActivityIndicator,
} from 'react-native';

import { Icon, Avatar, CheckBox } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';

import Field from '../components/Field';
import Http from '../components/Http';
import ImagePicker from '../components/ImagePicker';
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
    const [phoneNumber, setPhoneNumber] = useState({ flag: false, data: '' });
    const [confirmationCode, setConfirmationCode] = useState({ flag: false, data: '' });
    const [countries, setCountries] = useState([]);
    
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
        setPhoneNumber({ ...phoneNumber, flag: true });
    }

    const pressAvatar = async() => {
        const img = await ImagePicker.getImage();

        if(img == null) {
            return;
        }
        
        setUser({ ...user, img });
    }

    const checkPass = () => {
        let capitalLetter = false;
        let lowercaseLetter = false;
        let number = false;
        let specialLetter = false;
        
        if(user.password.length >= 8) {		
            for(let i = 0; i < user.password.length; i++) { 
                if(user.password.charCodeAt(i) > 64 && user.password.charCodeAt(i) < 91) {
                    capitalLetter = true;
                
                } else if(user.password.charCodeAt(i) > 96 && user.password.charCodeAt(i) < 123) {
                    lowercaseLetter = true;
                
                } else if(user.password.charCodeAt(i) > 47 && user.password.charCodeAt(i) < 58) {
                    number = true;
                
                } else {
                    specialLetter = true;
                }
            } 
        }

        (capitalLetter && lowercaseLetter && specialLetter && number) 
        ? setStep(step + 1)
        : Alert.alert('Hey!', 'Password does not meet requirements');
    }

    const handleButton = async () => {
        switch(step) {
            case 1:
                (!Field.checkFields([ user.email, user.name, user.lastName ])) 
                ? Alert.alert('Empty Field', 'Please, fill the fields.')
                : checkfield('email', null);
                break;

            case 2:
                (!Field.checkFields([ user.password ])) 
                ? Alert.alert('Error on password', 'Please, check your password.')
                : checkPass();
                break;
            
            case 3:
                checkfield('code', await AsyncStorage.getItem('token'));
                break;
            
            default:
                Alert.alert('Error on handleButton')
                break;
        }
    }

    const handleSendCodeButton = () => {
        if(user.country == null) {
            Alert.alert('Select country');
        
        } else if(phoneNumber.data.length < 1) {
            Alert.alert('Write a phone number');
        
        } else {
            checkfield('number', null);
        }
    }

    const handlePhoneNumberInputChangeText = (text) => {
        const userAux = { ...user, phoneNumber: user.country.code.concat(text) }     
        
        setUser(userAux);
        setPhoneNumber({ ...phoneNumber, data: text });
    }

    const handleCodeInputSumitEditing = () => {
        (confirmationCode.data.length != 4)  
        ? Alert.alert('Error', 'Code incomplete')
        : handleButton();
    }

    const handleCodeInputChangeText = (text) => { 
        (text.length > 0) 
        ? setPhoneNumber({ ...phoneNumber, flag: false })
        : setPhoneNumber({ ...phoneNumber, flag: true });
        
        setConfirmationCode({ ...confirmationCode, data: text })
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
    
    const submitSignUp = async () => {
        setLoading(true); 
        const data = await Http.send('POST', 'user/singup', user, null);

        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) { 
                case 'Success':  
                    toast(data.message);
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

        setLoading(false);
    }

    const checkfield = async (type, token) => {
        setLoading(true); 
        let bodyAux;
        
        (token != null) 
        ? bodyAux = { code: confirmationCode.data, phoneNumber: user.phoneNumber }
        : bodyAux = { phoneNumber: user.phoneNumber, email: user.email }
        
        const data = await Http.send('POST', `user/check/${type}`, bodyAux, token);
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) { 
                case 'Success':
                    toast(data.message);
                    
                    switch(type) {
                        case 'code':
                            submitSignUp();
                            break;   

                        case 'email':
                            setStep(step + 1);
                            break;

                        case 'number': 
                            await AsyncStorage.setItem("token", data.body.token);
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
        
        if(type != 'code') {
            setLoading(false);
        }
    }


    useEffect(() => {
        getCountries().then(res => setCountries(res));
    }, []);


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
                                onPress={pressAvatar} 
                                rounded 
                                source={{ uri: `data:image/png;base64,${user.img}` }}
                                size="xlarge" 
                            />
                            : <Avatar 
                                onPress={pressAvatar} 
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
                            containerStyle={signUpStyles.eye}
                            checkedIcon={<Icon name='eye-outline' color='gold' type='ionicon' size={20}/>}
                            uncheckedIcon={<Icon name='eye-off-outline' color='grey' type='ionicon' size={20}/>}
                            checked={vissiblePassFlag}
                            onPress={() => setVissiblePassFlag(!vissiblePassFlag)}
                        />
                    </View>
                </View>
                : <View>
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
                            ? <Text style={signUpStyles.code}>{user.country.code}</Text>
                            : null
                        }
                    <TextInput
                        editable={phoneNumber.flag}
                        maxLength={10}
                        placeholder="Phone number"
                        keyboardType='numeric'
                        blurOnSubmit={false}
                        style={signUpStyles.textInput}
                        onChangeText={handlePhoneNumberInputChangeText}
                        onSubmitEditing={handleSendCodeButton}
                        value={phoneNumber.data}
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
                            autoFocus
                            style={signUpStyles.textInput}
                            onChangeText={handleCodeInputChangeText}
                            onSubmitEditing={handleCodeInputSumitEditing}
                            value={confirmationCode.data}
                        />
                    </View>
                }
            </View>
            } 
            {
                (step != 3)
                ? null
                :<TouchableOpacity
                    disabled={confirmationCode.data.length != 0}
                    onPress={handleSendCodeButton} 
                    style={
                        (step == 3 && confirmationCode.data.length == 0)
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
                disabled={(step == 3 && confirmationCode.data.length != 4)}
                onPress={handleButton} 
                style={
                    (step == 3 && confirmationCode.data.length != 4)
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
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text style={signUpStyles.textSignUp}>
                        Sign In
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default SignUp;