import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet
} from "react-native";
import { Icon, Avatar } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import SearchBar from '../components/SearchBar2';
import Http from '../components/Http';


const EXPERIENCE_BLANK = {
    job: '',
    typeJob: '',
    dateInit: null,
    dateEnd: null,
    enterpriseId: 0,
    enterprise: { name: '', img: null }
}

const Experience = ({ navigation, route }) => { 
    const [experience, setExperience] = useState(EXPERIENCE_BLANK);
    const [search, setSearch] = useState({ data: [], flag: false });
    const [dateTimeFlag, setDateTimeFlag] = useState({ flag: false, dateFocus: false });
    const [searchFlag, setSearchFlag] = useState(false);
    const [loading, setLoading] = useState(false);


    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const hanbleDate = (date) => {
        if (date.toString().indexOf('Z') != -1) {
            return date.toString().split('T')[0];

        } else {
            return date.toString().split(' ').splice(1,3).join('-'); 
        }
    }

    const handlePicker = (date) => { 
        (dateTimeFlag.dateFocus)
        ? setExperience({ ...experience, dateEnd: date })
        : setExperience({ ...experience, dateInit: date })
        
        setDateTimeFlag({ ...dateTimeFlag, flag: false }); 
    }

    const modeEdit = () => {
        if(route.params.data) {
            setExperience(route.params.data);
        } 
    }

    const checkDate = () => {  
        if (experience.dateEnd == null) {
            return true;
            
        } else {
            const dateInit = new Date(experience.dateInit); 
            const dateEnd = new Date(experience.dateEnd);
            
            if(dateEnd.getFullYear() < dateInit.getFullYear()) {
                return false;
            
            } else { 
                if(dateEnd.getMonth() < dateInit.getMonth() && dateEnd.getFullYear() == dateInit.getFullYear()) {
                    return false;
                
                } else { 
                    if(dateEnd.getDate() <= dateInit.getDate() && dateEnd.getMonth() == dateInit.getMonth()) {
                        return false;
                    
                    } else {
                        return true;
                    }
                }
            }
        }
    }

    const handleSendbutton = () => { 
        if(new Date(experience.dateInit) > new Date()) {
            Alert.alert('Hey!', 'Start date > present, this is impossible!');

        } else if(!checkDate()) { 
            Alert.alert('Hey!', 'Start date > end date, this is impossible!');
        
        } else {
            (route.params.data) 
            ? sendExpereince('PUT')
            : sendExperience('POST');
        }
    }

    const selectItem = (item) => {
        setExperience({ ...experience, enterpriseId: item.id, enterprise: item });
        setSearchFlag(false);
    }

    const sendExperience = async (type) => {
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        const { enterprise, ...body } = experience;
        const data = await Http.send(type, 'experience', body, token);
    
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else {
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message); 
                    (route.params.data) 
                    ? route.params.callback('update', experience)
                    : route.params.callback('create', { ...data.body, enterprise });
                    
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

    const searchCompanies = async (value) => {
        setSearch({ ...search, flag: true });
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('GET', `enterprise/search/${value}`, null, token); 
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

        setSearch({ data: aux, flag: false });
    }

    const EnterpriseItemC = ({ item }) => (
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
                    source={{ uri: `data:image/png;base64,${item.img}` }}
                />
            }
            <View style={styles.viewTittleItem}>
                <Text style={styles.tittleItem}>
                    {item.name}
                </Text>
                <Text style={{ color: "gray" }}>
                    {item.description}
                </Text>    
            </View>
        </View>
    )

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => selectItem(item)}
            style={styles.inputText}
            >
            <EnterpriseItemC item={item}/>
        </TouchableOpacity>
    )

    useEffect(() => {
        modeEdit();    
    }, []); 

    return (
        <View style={styles.container}>
            <DateTimePickerModal
                isVisible={dateTimeFlag.flag}
                mode="date"
                onConfirm={handlePicker}
                onCancel={() => setDateTimeFlag({ ...dateTimeFlag, flag: false })}
            />
            <SearchBar
                arrayData={search.data}
                vissible={searchFlag}
                loadingFlag={search.flag}
                onCancel={() => setSearchFlag(false)}
                renderItem={renderItem}
                searchF={value => searchCompanies(value)}
            />
            <View style={[ styles.viewRow, styles.header ]}>
                <Icon
                    onPress={() => navigation.goBack()} 
                    name='close-outline' 
                    color='gray' 
                    type='ionicon' 
                    size={30}
                />
                <Text style={{ fontSize: 30 }}>
                    {    
                        (route.params.data)
                        ? 'Edit experience'
                        : 'New experience'
                    }
                </Text>
                <TouchableOpacity
                    onPress={handleSendbutton}
                    style={
                        (route.params.data) 
                        ? (experience.dateInit != null && experience.job.length && experience.typeJob.length && experience.enterpriseId != 0) 
                            && (  
                                experience.dateInit != route.params.data.dateInit 
                                || experience.dateEnd != route.params.data.dateEnd
                                || experience.job != route.params.data.job
                                || experience.typeJob != route.params.data.typeJob
                                || experience.enterpriseId != route.params.data.enterpriseId
                            ) 
                        ? styles.saveButton
                        : [styles.saveButton, { borderColor: 'gray' }]
                        : (experience.dateInit != null && experience.job.length && experience.typeJob.length && experience.enterpriseId != 0)
                        ? styles.saveButton
                        : [styles.saveButton, { borderColor: 'gray' }]
                    }
                    disabled={
                        (route.params.data) 
                        ? (
                            experience.dateInit != null 
                            && experience.job.length 
                            && experience.typeJob.length 
                            && experience.enterpriseId != 0 
                            && !loading
                        ) && (  
                            experience.dateInit != route.params.data.dateInit 
                            || experience.dateEnd != route.params.data.dateEnd
                            || experience.job != route.params.data.job
                            || experience.typeJob != route.params.data.typeJob
                            || experience.enterpriseId != route.params.data.enterpriseId
                        ) 
                        ? false
                        : true
                        : (
                            experience.dateInit != null 
                            && experience.job.length 
                            && experience.typeJob.length 
                            && experience.enterpriseId != 0 
                            && !loading
                        )
                        ? false 
                        : true
                    } 
                    >
                    {
                        (loading)
                        ? <ActivityIndicator size="small" color="#00ff00" />
                        : <Text 
                            style={
                                (route.params.data) 
                                ? (
                                    experience.dateInit != null 
                                    && experience.job.length 
                                    && experience.typeJob.length 
                                    && experience.enterpriseId != 0
                                    ) && (  
                                        experience.dateInit != route.params.data.dateInit 
                                        || experience.dateEnd != route.params.data.dateEnd
                                        || experience.job != route.params.data.job
                                        || experience.typeJob != route.params.data.typeJob
                                        || experience.enterpriseId != route.params.data.enterpriseId
                                    ) 
                                ? styles.SaveButtonText
                                : [styles.SaveButtonText, { color: 'gray' }]
                                : (
                                    experience.dateInit != null 
                                    && experience.job.length 
                                    && experience.typeJob.length 
                                    && experience.enterpriseId != 0
                                )
                                ? styles.SaveButtonText
                                : [styles.SaveButtonText, { color: 'gray' }]
                            }
                            >
                            {
                                (route.params.data)
                                ? 'Edit'
                                : 'Save' 
                            }
                        </Text>
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <ScrollView>
                    <TouchableOpacity
                        onPress={() => setSearchFlag(true)}
                        style={styles.inputText}
                        >
                        {
                            (experience.enterprise.id)
                            ? <EnterpriseItemC item={experience.enterprise}/>
                            : <Text style={{ color: 'gray' }}>
                                Enterprise...  
                            </Text>
                        }
                    </TouchableOpacity>
                    <TextInput
                        placeholder='Job (name)'  
                        style={styles.inputText}
                        onChangeText={text => setExperience({ ...experience, job: text })}
                        value={experience.job}
                    />
                    <TextInput
                        placeholder='Workday'  
                        style={styles.inputText}
                        onChangeText={text => setExperience({ ...experience, typeJob: text })}
                        value={experience.typeJob}
                    />
                    <TouchableOpacity
                        onPress={() => setDateTimeFlag({ dateFocus: false, flag: true })}
                        style={styles.inputText}
                        >
                        <Text style={{ color: 'gray' }}>
                            Start date: {(experience.dateInit != null) ? hanbleDate(experience.dateInit) : null} 
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDateTimeFlag({ dateFocus: true, flag: true })}
                        style={styles.inputText}
                        >
                        <Text style={{ color: 'gray' }}>
                            End date: {(experience.dateEnd != null) ? hanbleDate(experience.dateEnd) : 'Not yet.'} 
                        </Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    )
};

export default Experience;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    header: {
        marginTop: 24,
        backgroundColor: 'white',
        padding: '2%',
        width:'100%',
        justifyContent: 'space-between',
    },

    viewRow: {
        alignItems: "center",
        flexDirection: 'row'
    },

    inputText: {
        marginTop: 10,
        padding: 10,
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

    viewTittleItem: {
        paddingLeft: 5, 
        flex: 1
    },

    tittleItem: {
        fontWeight: "bold", 
        color: "gray", 
        fontSize: 20
    },
});