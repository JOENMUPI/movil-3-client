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
import BasicSearchBar from '../components/SearchBar';
import Http from '../components/Http';


const QUALIFICATION_BLANK = {
    averageScore: null,
    dateInit: null,
    dateEnd: null,
    qualificationId: 0,
    universityId: 0, 
}

const GENERIC_ARK = { 
    data: [], 
    flag: false, 
    selected: null
}


const qualification = ({ navigation, route }) => {
    const [universities, setUniversities] = useState(GENERIC_ARK);
    const [qualifications, setQualifications] = useState(GENERIC_ARK);
    const [qualification, setQualification] = useState(QUALIFICATION_BLANK);
    const [dateTimeFlag, setDateTimeFlag] = useState({ flag: false, dateFocus: false });
    const [searchFlag, setSearchFlag] = useState({ basic: false, normal: false });
    const [loading, setLoading] = useState(false);


    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const handleSendbutton = () => { 
        (route.params.data) 
        ? sendQualification('PUT')
        : sendQualification('POST'); 
    }

    const handlePicker = (date) => { 
        (dateTimeFlag.dateFocus)
        ? setQualification({ ...qualification, dateEnd: date })
        : setQualification({ ...qualification, dateInit: date })
        
        setDateTimeFlag({ ...dateTimeFlag, flag: false }); 
    }

    const onPressItemSearchBar = (item) => {
        setSearchFlag({ ...searchFlag, basic: false });
        setQualification({ ...qualification, qualificationId: item.id });
        setQualifications({ ...qualifications, selected: item }); 
    }

    const selectItem = (item) => {
        setSearchFlag({ ...searchFlag, normal: false });
        setQualification({ ...qualification, universityId: item.id });
        setUniversities({ ...universities, selected: item });
        getQualifications(item.id);
    }

    const modeEdit = () => {
        if (route.params.data) {
            const uni = {
                id: route.params.data.universityId,
                img: route.params.data.img,
                description: route.params.data.universityDescription,
                name: route.params.data.universityName
            }

            const qualificationAux = {
                id: route.params.data.qualificationId,
                tittle: route.params.data.qualificationName,
            }

            setQualification({
                universityId: uni.id,
                qualificationId: qualificationAux.id,
                dateInit: route.params.data.dateInit,
                dateEnd: route.params.data.dateEnd,
                averageScore: route.params.data.averageScore
            });

            setUniversities({ ...universities, selected: uni });
            setQualifications({ ...qualifications, selected: qualificationAux }); 
            getQualifications(uni.id, qualificationAux);
        }
    }

    const sendQualification = async (type) => { 
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        let jsonAux = {};

        (type == 'POST')
        ? jsonAux = qualification
        : jsonAux = { 
            ...qualification, 
            oldUniversityId: route.params.data.universityId,
            oldQualificationId: route.params.data.qualificationId 
        }
        
        const data = await Http.send(type, 'qualification/user', jsonAux, token); 
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) {
                case 'Success': 
                    toast(data.message);
                    let aux = {
                        universityId: universities.selected.id,
                        img: universities.selected.img,
                        universityDescription: universities.selected.description,
                        universityName:  universities.selected.name,
                        qualificationId: qualifications.selected.id,
                        qualificationName: qualifications.selected.tittle,
                        dateInit: qualification.dateInit,
                        dateEnd: qualification.dateEnd,
                        averageScore: qualification.averageScore,
                    }

                    if(route.params.data) {
                        aux = { 
                            ...aux, 
                            ref1: route.params.data.universityId,
                            ref2: route.params.data.qualificationId 
                        };
                    }

                    (type != 'POST') 
                    ? route.params.callBack('update', aux)
                    : route.params.callBack('create', aux);
                    
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

    const getQualifications = async (id, updateMode) => {
        setQualifications({ ...qualifications, flag: true });
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('GET', `university/qualification/${id}`, null, token); 
        let aux = [];
        let selected = null

        if(updateMode) {
            selected = updateMode;
        }

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


        setQualifications({ data: aux, flag: false, selected }); 
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
            <UniItemC item={item}/>
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
                arrayData={universities.data}
                vissible={searchFlag.normal}
                loadingFlag={universities.flag}
                onCancel={() => setSearchFlag({ ...searchFlag, normal: false })}
                renderItem={renderItem}
                searchF={value => searchUniversities(value)}
            />  
            <BasicSearchBar
                 arrayData={qualifications.data}
                 vissible={searchFlag.basic}
                 onCancel={() => setSearchFlag({ ...searchFlag, basic: false })}
                 onPressItem={onPressItemSearchBar.bind(this)}
            />
            <View style={[ styles.viewRow, styles.header ]}>
                <Icon
                    onPress={() => navigation.goBack()} 
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
                        (route.params.data) 
                        ? (  
                            qualification.universityId != route.params.data.universityId 
                            || qualification.qualificationId != route.params.data.qualificationId
                            || qualification.dateInit != route.params.data.dateInit
                            || qualification.dateEnd != route.params.data.dateEnd
                            || qualification.averageScore != route.params.data.averageScore 
                        ) 
                        ? styles.saveButton
                        : [styles.saveButton, { borderColor: 'gray' }]
                        : (qualification.universityId > 0 && qualification.qualificationId > 0 && qualification.dateInit != null)
                        ? styles.saveButton
                        : [styles.saveButton, { borderColor: 'gray' }]
                    }
                    disabled={
                        (route.params.data) 
                        ? (  
                            qualification.universityId != route.params.data.universityId 
                            || qualification.qualificationId != route.params.data.qualificationId
                            || qualification.dateInit != route.params.data.dateInit
                            || qualification.dateEnd != route.params.data.dateEnd
                            || qualification.averageScore != route.params.data.averageScore 
                        ) 
                        ? false
                        : true
                        : (qualification.universityId > 0 && qualification.qualificationId > 0 && qualification.dateInit != null) 
                        ? false 
                        : true
                    }
                    onPress={handleSendbutton}
                    >
                    {
                        (loading)
                        ? <ActivityIndicator size="small" color="#00ff00" />
                        : <Text 
                            style={
                                (route.params.data) 
                                ? (  
                                    qualification.universityId != route.params.data.universityId 
                                    || qualification.qualificationId != route.params.data.qualificationId
                                    || qualification.dateInit != route.params.data.dateInit
                                    || qualification.dateEnd != route.params.data.dateEnd
                                    || qualification.averageScore != route.params.data.averageScore 
                                ) 
                                ? styles.SaveButtonText
                                : [styles.SaveButtonText, { color: 'gray' }]
                                : (qualification.universityId > 0 && qualification.qualificationId > 0 && qualification.dateInit != null)
                                ? styles.SaveButtonText
                                : [styles.SaveButtonText, { color: 'gray' }]
                            }
                            >
                            {
                                (route.params.data)
                                ? 'Edit'
                                : 'Send'
                            }
                        </Text>
                    }
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <ScrollView>  
                    <TouchableOpacity
                        onPress={() => setSearchFlag({ ...searchFlag, normal: true })}
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
                    {
                        (qualifications.flag && universities.selected != null) 
                        ? <ActivityIndicator size="small" color="#00ff00" />
                        : (qualifications.data.length || qualifications.selected != null)
                        ? <TouchableOpacity
                            onPress={() => setSearchFlag({ ...searchFlag, basic: true })}
                            style={styles.inputText}
                            >
                            <Text style={{ color: 'gray' }}>
                                qualifications: {(qualifications.selected != null) ? qualifications.selected.tittle : null} 
                            </Text>
                        </TouchableOpacity>
                        : null
                    }
                    <TouchableOpacity
                        onPress={() => setDateTimeFlag({ flag: true, dateFocus: false })}
                        style={styles.inputText}
                        >
                        <Text style={{ color: 'gray' }}>
                            Start date: {
                                (qualification.dateInit == null)
                                ? null
                                : (qualification.dateInit.toString().indexOf('Z') != -1)
                                ? qualification.dateInit.toString().split('T')[0]
                                : qualification.dateInit.toString().split(' ').splice(1,3).join('-')
                            }
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDateTimeFlag({ flag: true, dateFocus: true })}
                        style={styles.inputText}
                        >
                        <Text style={{ color: 'gray' }}>
                            Finish date: { 
                                (qualification.dateEnd == null) 
                                ? 'Actually'
                                : (qualification.dateEnd.toString().indexOf('Z') != -1)
                                ? qualification.dateEnd.toString().split('T')[0]
                                : qualification.dateEnd.toString().split(' ').splice(1,3).join('-')
                            }
                        </Text>
                    </TouchableOpacity> 
                    <TextInput
                        placeholder='Average score (optional)'  
                        keyboardType='numeric'
                        maxLength={2}
                        style={styles.inputText}
                        onChangeText={text => setQualification({ ...qualification, averageScore: text })}
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

    viewTittleItem: {
        paddingLeft: 5, 
        flex: 1
    },

    tittleItem: {
        fontWeight: "bold", 
        color: "gray", 
        fontSize: 20
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