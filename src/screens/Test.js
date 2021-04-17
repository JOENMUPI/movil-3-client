import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
    TextInput,
    ToastAndroid,
    ActivityIndicator,
    StyleSheet,
} from "react-native";
import { Icon, Avatar } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import SearchBar from '../components/SearchBar2';
import Http from '../components/Http';


const QUALIFICATION_BLANK = {
    averageScore: null,
    dateInit: '',
    dateEnd: null,
    qualificationId: 0,
    universityId: 0, 
}

const USER_BLANK = {
    img: null,
    name: '',
    lastName: ''
}

const GENERIC_ARK = { 
    data: [], 
    flag: false, 
    selected: null
}


const qualification = () => {
    const [user, setUser] = useState(USER_BLANK);
    const [universities, setUniversities] = useState(GENERIC_ARK);
    const [qualifications, setQualifications] = useState(GENERIC_ARK);
    const [qualification, setQualification] = useState(QUALIFICATION_BLANK);
    const [dateTimeFlag, setDateTimeFlag] = useState(false);
    const [searchFlag, setSearchFlag] = useState(true);

    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const getUser = async () => {
        return JSON.parse(await AsyncStorage.getItem('user'));
    }

    const handleSendbutton = () => { console.log('send');
        //(route.params) 
        //? sendPost('PUT')
        //: sendPost('POST'); 
    }

    const handlePicker = (date) => { console.log('date:', date); 
        //setUserJson({ ...userJson, date });
        setDateTimeFlag(false); 
    }

    const searchUniversities = async (value) => {
        setUniversities({ ...universities, flag: true });
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('GET', `university/search/${value}`, null, token); 
        let aux = [];
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message); 
                    aux = data.body;
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

        setUniversities({ ...universities, data: aux, flag: false });
    }

    const UniItemC = ({ item }) => (
        <View style={styles.viewRow}>
            {
                (item.img == null)
                ? <Avatar 
                    rounded
                    size="medium"
                    containerStyle={{ backgroundColor: 'lightgray' }}
                    icon={{ name: 'camera-outline', color: 'white', type: 'ionicon', size: 30 }}
                />
                : <Avatar 
                    rounded 
                    size="medium" 
                    source={{ uri: `data:image/png;base64,${post.userImg}` }}
                />
            }
            <View style={{ paddingLeft: 5, flex: 1 }}>
                <Text style={{ fontWeight: "bold", color: "gray", fontSize: 20 }}>
                    {item.name}
                </Text>
                <Text style={{ color: "gray" }}>
                    {item.description}
                </Text>    
            </View>
        </View>
    )

    const selectItem = (item) => {
        setSearchFlag(false);
        setUniversities({ ...universities, selected: item });
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => selectItem(item)}
            style={styles.inputText}
            >
            <UniItemC item={item}/>
        </TouchableOpacity>
    )

    useEffect(() => { 
        getUser().then(res => setUser(res)); 
    }, []); 
    
    return (
        <View style={styles.container}> 
            <DateTimePickerModal
                isVisible={dateTimeFlag}
                mode="date"
                onConfirm={handlePicker}
                onCancel={() => setDateTimeFlag(false)}
            />
            <SearchBar
                arrayData={universities.data}
                vissible={searchFlag}
                loadingFlag={universities.flag}
                onCancel={() => setSearchFlag(false)}
                renderItem={renderItem}
                searchF={value => searchUniversities(value)}
            />
            <View style={[ styles.viewRow, styles.header ]}>
                <Icon
                    onPress={() => console.log('goback()')} 
                    name='close-outline' 
                    color='gray' 
                    type='ionicon' 
                    size={30}
                />
                <Text style={{  fontSize: 30 }}>
                    Qualification 
                </Text>
                <TouchableOpacity
                    style={
                        /*(post.tittle.length && (post.description.length || post.img != null))
                        ? postStyles.saveButton
                        :*/ [styles.saveButton, { borderColor: 'gray' }]
                    }
                    disabled={
                        /*!(post.tittle.length && !loading && (post.description.length || post.img != null)) 
                        ? true 
                        :*/ false
                    }
                    onPress={handleSendbutton}
                    >
                    <Text 
                        style={
                            /*(post.tittle.length && (post.description.length || post.img != null))
                            ? postStyles.SaveButtonText
                            :*/ [styles.SaveButtonText, { color: 'gray' }]
                        }
                        >
                        Send
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <ScrollView>  
                    <TouchableOpacity
                        onPress={() => setSearchFlag(true)}
                        style={styles.inputText}
                        >
                        {
                            (universities.selected != null)
                            ? <UniItemC item={universities.selected}/>
                            : <Text style={{ color: 'gray' }}>
                                University... 
                            </Text>
                        }
                    </TouchableOpacity>   
                    <TouchableOpacity
                        onPress={() => setSearchFlag(true)}
                        style={styles.inputText}
                        >
                        <Text style={{ color: 'gray' }}>
                            Start date: 
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setSearchFlag(true)}
                        style={styles.inputText}
                        >
                        <Text style={{ color: 'gray' }}>
                            Finish date: 
                        </Text>
                    </TouchableOpacity> 
                    <TextInput
                        placeholder='Average score (optional)'  
                        keyboardType='numeric'
                        style={styles.inputText}
                        onChangeText={text => setQualification({ ...qualification, averageScore: text })}
                        //onEndEditing={() => refTextIput.focus()} 
                        value={qualification.averageScore}
                    />
                </ScrollView> 
            </View>
        </View>
    )
};

export default qualification;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    viewRow: {
        alignItems: "center",
        flexDirection: 'row'
    },

    header: {
        marginTop: 24,
        backgroundColor: 'white',
        padding: '2%',
        width:'100%',
        justifyContent: 'space-between',
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
        flex:1,
        paddingHorizontal: '3%',
        backgroundColor: '#f4f6fc'
    },

    inputText: {
        marginTop: 10, 
        padding: 10, 
        backgroundColor:'white', 
        borderRadius: 10, 
        color: 'gray'
    },
});