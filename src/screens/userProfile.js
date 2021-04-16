import React, { useState, useEffect } from 'react'; 
import { 
    ActivityIndicator, 
    Alert,
    Modal,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    ToastAndroid,
    TouchableOpacity, 
    RefreshControl,
    View
} from 'react-native';

import { Icon, ListItem, Avatar, Image, BottomSheet } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import Http from '../components/Http';
import ModalListC from '../components/modalList';

const EXPERIENCE_BASE = [
    {
        id: 4,
        job: 'job',
        enterprise: 'enterprise',
        typeJob: 'full', 
        dateInit: '2017',
        dateEnd: '2020',
        img: 'images-enterprise',
    },
    {
        id: 1,
        job: 'job2',
        enterprise: 'enterprise2',
        typeJob: 'half time', 
        dateInit: '2020',
        dateEnd: null,
        img: 'images-enterprise',
    }, 
    {
        id: 2,
        job: 'job3',
        enterprise: 'enterprise3',
        typeJob: 'half time', 
        dateInit: '2015',
        dateEnd: '2016',
        img: 'images-enterprise',
    }, 
]

const QUALIFICATION_BASE = [
    {   
        qualification: 'Engeneer',
        university: 'Universidad Rafael Urdaneta',
        dateInit: '2017',
        dateEnd: '2020',
        img: 'images-university',
    },
    {
        qualification: 'Psicology',
        university: 'Universidad Rafael Urdaneta',
        dateInit: '2020',
        dateEnd: null,
        img: 'images-university',
    },
]

const USER_BASE = {
    img: null,
    name: 'name',
    lastName: 'LastName',
    email: 'email@gmail.com',
    country: 'venezuela',
    skills: [],
    awards: [],
    interest: [],
    idioms: [],
    qualifications: [],
    experiences: [],
    activities: []
}

const BSO_BLANK = [
    { 
        tittle: 'Edit',
        icon: 'color-palette-outline',
        style: { paddingLeft: 5, color: 'gray' },
        iconColor: 'gray',
        onPress: () => {}
    },
    { 
        tittle: 'Delete',
        icon: 'trash-outline',
        style: { paddingLeft: 5, color: 'gray' },
        iconColor: 'gray',
        onPress: () => {}
    },
    {
        tittle: 'Cancel',
        icon: 'close-circle-outline',
        containerStyle: { backgroundColor: 'red' },
        style: { paddingLeft: 5, color: 'white', fontWeight: 'bold' },
        iconColor: 'white',
        onPress: () => {}
    }
];

const USER_JSON_BLANK = {
    description: '', 
    date: '' 
}

const LANGUAGES_BLANK = {
    data: [], 
    options: [],
}

const UserProfile = ({ navigation, route }) => { 
    const [user, setUser] = useState(USER_BASE);
    const [me, setMe] = useState({ id: 0 });
    const [userJson, setUserJson] = useState(USER_JSON_BLANK);
    const [languages, setLanguages] = useState(LANGUAGES_BLANK);
    const [newLanguage, setNewLanguage] = useState({ description: '' });
    const [newLvl, setNewLvl] = useState({ description: '' });
    const [loading, setLoading] = useState({ loading: false, first: true });
    const [modalList, setModalList] = useState({ tittle: '', flag: false });
    const [modal, setModal] = useState({ type: '', flag: false, editFlag: false });
    const [bottomSheetFlag, setBottomSheetFlag] = useState({ flag: false, options: BSO_BLANK });
    const [dateTimeFlag, setDateTimeFlag] = useState(false);

    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const getMe = async () => {
        return JSON.parse(await AsyncStorage.getItem('user'));
    }

    const postCallback = (type, postid) => {
        let postAux = [];
        
        switch(type) {
            case 'update':
                postAux = user.activities.map(item => {
                    if(postid == item.id) {
                        return item;
                    
                    } else {
                        return taskItem;
                    }
                });
                break;
            case 'delete':
                postAux = user.activities.filter(i => i.id != postid);
                break;
            
            default:
                Alert.alert('Error on type of callback');
                break;
        }

        setUser({ ...user, activities: postAux });
    }

    const getUser = async () => {   
        setLoading({ ...loading, loading: true });
        const userId = route.params.userId;
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('GET', `user/${userId}`, null, token);
    
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message);               
                    return test(data.body);

                case 'Fail':
                    data.body.errors.forEach(element => {
                        toast(element.text);
                    });

                    return {}
                    
                default:
                    Alert.alert(data.typeResponse, data.message);
                    return {}
            }
        } 
    }

    const getIdioms = async () => {   
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('GET', `language`, null, token);
    
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message);            
                    let options = [];  
                    let dataAux = []; 
                    const cancel = {
                        tittle: 'Cancel',
                        icon: 'close-circle-outline',
                        containerStyle: { backgroundColor: 'red' },
                        style: { paddingLeft: 5, color: 'white', fontWeight: 'bold' },
                        iconColor: 'white',
                        onPress: () => setBottomSheetFlag({ ...bottomSheetFlag, flag: false })
                    }  

                    data.body.data.forEach(item => {
                        dataAux.push({
                            tittle: item.description,
                            style: { color: 'gray' },
                            onPress: () => {
                                setNewLanguage(item);
                                setBottomSheetFlag({ ...bottomSheetFlag, flag: false });
                            }
                        }); 
                    });
                    
                    data.body.lvl.forEach(item => { 
                        options.push({
                            tittle: item.description,
                            style: { color: 'gray' },
                            onPress: () => {
                                setNewLvl(item);
                                setBottomSheetFlag({ ...bottomSheetFlag, flag: false });
                            }
                        }); 
                    });

                    dataAux.push(cancel);
                    options.push(cancel);
                    setLanguages({ ...languages, data: dataAux, options });
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

    const sendConnect = async () => {   
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('Post', 'connect', { userObjId: user.id }, token);
    
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message);
                    setUser({ ...user, myConnect: true });                 
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

    const updateUserJson = async (type, dataP) => {
        setLoading({ ...loading, loading: true });
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('PUT', `user/field/${type}`, { data: dataP }, token);
    
        (!data) 
        ? Alert.alert('Fatal Error', 'No data from server...') 
        : basicResponse(data);
        
        setLoading({ ...loading, loading: false });
    }

    const sendData = async (type, endpoint,body) => {
        setLoading({ ...loading, loading: true });
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send(type, endpoint, body, token);
    
        (!data) 
        ? Alert.alert('Fatal Error', 'No data from server...') 
        : basicResponse(data);
        
        setLoading({ ...loading, loading: false });
    } 

    const basicResponse = (data) => {
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

    const BottomSheetItemC = ({ item }) => ( 
        <ListItem containerStyle={item.containerStyle} onPress={item.onPress}>
            <ListItem.Content>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Icon
                        name={item.icon}
                        color={item.iconColor} 
                        type='ionicon' 
                        size={30}
                    />
                    <ListItem.Title style={item.style}>{item.tittle}</ListItem.Title>
                </View>
            </ListItem.Content>
        </ListItem>
    )

    const IconOption = ({ item }) => (
        <Icon
            onPress={() => renderItemOptions(item)}
            name='ellipsis-vertical'
            color='gray'
            type='ionicon'
            size={30}
        />
    )

    const renderItemSkill = ({ item }) => ( 
        <View style={userDetailStyles.viewItem}> 
            <View style={userDetailStyles.item}>
                <Text style={{ fontSize: 15 }}>
                    {item.description}
                </Text> 
                <IconOption item={item}/>
            </View>
        </View>
    )

    const renderItemAward = ({ item }) => ( 
        <View style={userDetailStyles.viewItem}> 
            <View style={userDetailStyles.item}>
                <View>
                    <Text style={{ fontSize: 15 }}>
                        {item.description}
                    </Text>
                    <Text style={{ fontSize: 15, color: 'gray' }}>
                        {item.date}
                    </Text>
                </View>
                <IconOption item={item}/>
            </View>
        </View>
    )

    const renderItemIdiom = ({ item }) => ( 
        <View style={userDetailStyles.viewItem}> 
            <View style={userDetailStyles.item}>
                <View>
                    <Text style={{ fontSize: 15 }}>
                        {item.name}
                    </Text>
                    <Text style={{ fontSize: 15, color: 'gray' }}>
                        {item.lvl}
                    </Text>
                </View>
                <IconOption item={item}/>
            </View>
        </View>
    )

    const ListItemWithImgC = ({ img, tittle, line2, line3, onPress }) => ( 
        <View style={userDetailStyles.viewRow}> 
            <ListItem.Content >
                <TouchableOpacity
                    onPress={onPress} 
                    style={[userDetailStyles.viewRow, userDetailStyles.fill]}
                    >
                    {
                        (img == null)
                        ? <Avatar 
                            rounded 
                            source={{ uri: `data:image/png;base64,${user.img}` }}
                            size="medium" 
                        />
                        : <Image
                            source={{ uri: `data:image/png;base64,${img}` }}
                            containerStyle={{ borderRadius: 5, width: 55, height: 55, resizeMode: 'contain', marginTop: 10 }}
                        />
                    }
                    <View>
                        <View style={userDetailStyles.viewLinesItem}>
                            <Text style={userDetailStyles.tittleItem}>
                                {tittle} 
                            </Text>
                            {line2}
                            {line3}  
                        </View>
                    </View>
                </TouchableOpacity>      
            </ListItem.Content>
        </View>
    )

    const line2Activity = (dateCreation, dateEdit) => (
        <Text style={userDetailStyles.text}>
            {
                (dateEdit != null)
                ? `Last edit: ${dateEdit}`
                : dateCreation
            }
        </Text>
    )

    const line3Activity = (reactions, commentaries, commentFlag) => (
        <View style={[ userDetailStyles.viewRow, { justifyContent: 'space-between' } ]}>
            {
                (!commentFlag)
                ? null
                : <View style={userDetailStyles.viewRow}>
                    <Icon name='chatbubbles-outline' color='gray' type='ionicon' size={15} />
                    <Text style={userDetailStyles.text}>
                        {commentaries}
                    </Text>
                </View>
            }
            <View style={userDetailStyles.viewRow}>
                { 
                    reactions.map((reaction, index) => ( 
                        !(reaction.num > 0)
                        ? null
                        : <View
                            key={index} 
                            style={userDetailStyles.viewReaction}>
                            <Icon name={reaction.description} color='gray' type='ionicon' size={15} />
                            <Text style={userDetailStyles.text}>
                                {reaction.num}
                            </Text>
                        </View>
                    ))
                }
            </View> 
        </View>
    )

    const line2Experience = (enterprise, typeJob) => (
        <Text style={userDetailStyles.text}>
            {enterprise} - {typeJob}
        </Text>
    )

    const line2Qualification = (description) => (
        <Text style={userDetailStyles.text}>
            {description}
        </Text>
    )
    
        // aqui hay q procesar el timeStamp q le llegara...
    const line3ExperienceQualification = (dateInit, dateEnd) => ( 
        <Text style={userDetailStyles.text}>
            {dateInit} - {(dateEnd != null) ? dateEnd : 'Actually'}
        </Text>
    )

    const SeeMoreButtonC = ({ action }) => (
        <TouchableOpacity 
            onPress={action}
            style={userDetailStyles.buttonSee}
            >
            <Text style={userDetailStyles.buttonSeeText}>
                See more
            </Text>
        </TouchableOpacity>
    )

    const ListItemC = ({ tittle, line2, action }) => (
        <TouchableOpacity
            style={userDetailStyles.fill}
            onPress={action}
            >
            <Text style={userDetailStyles.tittleItem}>
                {tittle}
            </Text>
            {line2}
        </TouchableOpacity>
    )

    const line2IdiomAward = (text) => (
        <Text style={userDetailStyles.text}>
            {text}
        </Text>
    )

    const gotoUserActivities = () => {
        console.log('hi activities');
    }

    const gotoUserExperiences = () => {
        console.log('hi experiences');
    }

    const gotoUserQualifications = () => {
        console.log('hi qualifications');
    }

    const handleAddPress = () => { 
        switch(modalList.tittle) {
            case 'Awards':
                setModal({ type: 'award', flag: true, editFlag: false });
                break;

            case 'Idioms':
                setModal({ type: 'idiom', flag: true, editFlag: false });
                break;
                
            case 'Skills':
                setModal({ type: 'skill', flag: true, editFlag: false });
                break;

            case 'Interests':
                setModal({ type: 'interest', flag: true, editFlag: false });
                break;

            default:
                Alert.alert('tittle no match', `Error on handlePress "${modalList.tittle}"`);
                break;
        }
    }

    const handleBottomSheetOptions = ( tittle, editFunction, deleteFunction) => {
        return bottomSheetFlag.options.map(bso => { 
            let aux = bso;

            if(/Edit|Delete/.test(bso.tittle)) { 
                if(/Edit/.test(aux.tittle)) { 
                    aux.tittle = `Edit ${tittle}`;
                    aux.onPress = editFunction;   
                
                } else { 
                    aux.tittle = `Delete ${tittle}`; 
                    aux.onPress = deleteFunction; 
                }

            } else {
                aux.onPress = () => setBottomSheetFlag({ ...bottomSheetFlag, flag: false });
            }

            return aux;
        });
    }

    const onPressModal = () => {
        if((modal.type == 'skill' || modal.type == 'interest') && userJson.description.length < 1
            || modal.type == 'award' && (userJson.description.length < 1 || userJson.date.length < 1)) {
            Alert.alert('Empty field', 'Fill all field pls');
        
        } else {
            let data = [];

            switch(modal.type) {
                case 'skill':
                    if(modal.editFlag) {
                        data = user.skills.map(skill => {
                            let skillAux = skill;
                
                            if(skill.description == userJson.ref) { 
                                skillAux.description = userJson.description;
                            }
                
                            return skillAux;
                        });
        
                    } else {
                        data = user.skills;
                        data.unshift({ description: userJson.description });
                    }

                    setUser({ ...user, skills: data });
                    updateUserJson('skill', data);
                    break;

                case 'interest': 
                    if(modal.editFlag) {
                        data = user.interest.map(interest => {
                            let interestAux = interest;
                
                            if(interest.description == userJson.ref) { 
                                interestAux.description = userJson.description;
                            }
                
                            return interestAux;
                        });
        
                    } else { 
                        data = user.interest;
                        data.unshift({ description: userJson.description });
                    }

                    setUser({ ...user, interest: data });
                    updateUserJson('interest', data);
                    break;

                case 'award':
                    if(modal.editFlag) {
                        data = user.awards.map(award => {
                            let awardAux = award;
                
                            if(award == userJson.ref) { 
                                awardAux.description = userJson.description;
                                awardAux.date = userJson.date;
                            }
                
                            return awardAux;
                        });
        
                    } else {
                        const date = userJson.date.toString().split(':')[0];
                        
                        data = user.awards;
                        data.unshift({ description: userJson.description, date });
                    }

                    setUser({ ...user, awards: data });
                    updateUserJson('award', data);
                    break;
                
                case 'idiom':
                    if(modal.editFlag) {
                        data = user.interest.map(interest => {
                            let interestAux = interest;
                
                            if(interest.description == userJson.ref) { 
                                interestAux.description = userJson.description;
                            }
                
                            return interestAux;
                        });

                        //updateUserJson('interest', data); update idiom!!!!!!
                    
                    } else { 
                        data = user.idioms;
                        data.unshift({
                            name: newLanguage.description,
                            id: newLanguage.id,
                            lvlId: newLvl.id,
                            lvl: newLvl.description,
                        });    
                         
                        sendData('POST', 'language', { languageId: newLanguage.id, levelId: newLvl.id });
                    }

                    setNewLanguage({ description: '' });
                    setNewLvl({ description: '' });
                    setUser({ ...user, idioms: data });
                    break;
            }

            setModal({ ...modal, flag: false, editFlag: false });
            setUserJson(USER_JSON_BLANK);
        }
    }

    const deleteSkill = (skillObj) => {
        const skills = user.skills.filter(i => i != skillObj);

        setUser({ ...user, skills });
        updateUserJson('skill', skills);
    }

    const deleteAward = (awardObj) => {
        const awards = user.awards.filter(i => i != awardObj);

        setUser({ ...user, awards });
        updateUserJson('award', awards);
    }

    const deleteIdiom = (idiomObj) => {
        const idioms = user.idioms.filter(i => i != idiomObj);

        setUser({ ...user, idioms });
        //updateUserJson('award', awards); delete el idiom
    }

    const deleteInterest = (Obj) => {
        const interest = user.interest.filter(i => i != Obj);

        setUser({ ...user, interest });
        updateUserJson('interest', interest);
    }

    const renderItemOptions = (item) => {
        let bsoAux = BSO_BLANK;
        
        switch(modalList.tittle) {
            case 'Awards':               
                bsoAux = handleBottomSheetOptions(
                    item.description,
                    () => { 
                        setUserJson({ ...item, ref: item }); 
                        setModal({ type: 'award', flag: true, editFlag: true }); 
                        setBottomSheetFlag({ ...bottomSheetFlag, flag: false }); 
                    },
                    () => {
                        deleteAward(item);
                        setBottomSheetFlag({ ...bottomSheetFlag, flag: false });
                    }
                );
                break;

            case 'Idioms':
                bsoAux = handleBottomSheetOptions(
                    item.description,
                    () => { 
                        setNewLanguage({ id: item.id, description: item.name });
                        setNewLvl({ id: item.lvlId, description: item.lvl });
                        setModal({ type:'idiom', flag: true, editFlag: true }); 
                        setBottomSheetFlag({ ...bottomSheetFlag, flag: false }); 
                    },
                    () => {
                        deleteSkill(item);
                        setBottomSheetFlag({ ...bottomSheetFlag, flag: false });
                    }
                );
                break;

            case 'Skills': 
                bsoAux = handleBottomSheetOptions(
                    item.description,
                    () => { 
                        setUserJson({ ...item, ref: item.description }); 
                        setModal({ type:'skill', flag: true, editFlag: true }); 
                        setBottomSheetFlag({ ...bottomSheetFlag, flag: false }); 
                    },
                    () => {
                        deleteSkill(item);
                        setBottomSheetFlag({ ...bottomSheetFlag, flag: false });
                    }
                );
                break;

            case 'Interests': 
                bsoAux = handleBottomSheetOptions(
                    item.description,
                    () => { 
                        setUserJson({ ...item, ref: item.description }); 
                        setModal({ type:'interest', flag: true, editFlag: true }); 
                        setBottomSheetFlag({ ...bottomSheetFlag, flag: false }); 
                    },
                    () => {
                        deleteInterest(item);
                        setBottomSheetFlag({ ...bottomSheetFlag, flag: false });
                    }
                );
                break;
                
            default:
                Alert.alert('tittle no match', `Error on renderItemOptions "${modalList.tittle}"`);
                break;
        } 
        
        setBottomSheetFlag({ options: bsoAux, flag: true });
    }

    const callBack = (newUser) => {
        setUser(newUser);
    }

    const refresh = () => {
        getUser().then(res => {  
            setUser(res);
            setLoading({ first: false, loading: false }); 
        });
    }

    useEffect(() => { 
        getMe().then(res => { 
            setMe(res);
            if(res.id == route.params.userId) {
                getIdioms();
            }
        });

        refresh(); 
    }, []);

    const test = (userAux) => {
        return { 
            ...userAux, 
            experiences: EXPERIENCE_BASE,
            qualifications: QUALIFICATION_BASE
        }; 
    }

    const handlePicker = (date) => { 
        setUserJson({ ...userJson, date });
        setDateTimeFlag(false); 
    }

    
    return (
        <View style={userDetailStyles.container}>
            <DateTimePickerModal
                isVisible={dateTimeFlag}
                mode="date"
                onConfirm={handlePicker}
                onCancel={() => setDateTimeFlag(false)}
            />
            <Modal 
                animationType="slide"
                transparent
                visible={modal.flag}
                onRequestClose={() => setModal({ ...modal, flag: false })}
                >
                <View style={userDetailStyles.modal}>
                    <View style={userDetailStyles.viewModal}>  
                        <View style ={{ alignItems: 'center' }}> 
                            <Text style={userDetailStyles.tittleItem}>
                                {modal.type}
                            </Text>
                            {
                                (modal.type == 'skill' || modal.type == 'interest')
                                ? <TextInput
                                    placeholder={`Write a ${modal.type}!`}  
                                    onChangeText={description => setUserJson({ ...userJson, description })}
                                    onSubmitEditing={onPressModal}
                                    autoFocus
                                    value={userJson.description}
                                    style={userDetailStyles.input}
                                />
                                : (modal.type == 'award')
                                ? <View style={{ width: '100%' }}>
                                    <TextInput
                                        placeholder={`Write a ${modal.type}!`}  
                                        onChangeText={description => setUserJson({ ...userJson, description })}
                                        autoFocus
                                        value={userJson.description}
                                        style={userDetailStyles.input}
                                    />
                                    <TouchableOpacity
                                        style={[ userDetailStyles.input, { paddingVertical: '7%' }]}
                                        onPressIn={() => setDateTimeFlag(true)}
                                        >
                                        <Text style={userDetailStyles.text}>
                                            Date: {userJson.date.toString().split(':')[0]} 
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                : (modal.type == 'idiom')
                                ? <View style={{ width: '100%' }}>
                                    <TouchableOpacity
                                        style={[ userDetailStyles.input, { paddingVertical: '7%' }]}
                                        onPressIn={() => setBottomSheetFlag({ options: languages.data, flag: true })}
                                        >
                                        <Text style={userDetailStyles.text}>
                                            Language: {newLanguage.description}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[ userDetailStyles.input, { paddingVertical: '7%' }]}
                                        onPressIn={() => setBottomSheetFlag({ options: languages.options, flag: true })}
                                        >
                                        <Text style={userDetailStyles.text}>
                                            Level: {newLvl.description}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                : null
                            }
                            <TouchableOpacity 
                                onPress={onPressModal}
                                style={userDetailStyles.button}
                                >
                                {
                                    (loading.loading)
                                    ? <ActivityIndicator size="small" color="#00ff00" />
                                    : <Text style={userDetailStyles.buttonText}>
                                        Finish and send
                                    </Text>
                                }
                            </TouchableOpacity>
                        </View>  
                    </View>
                </View>
            </Modal>
            <BottomSheet
                isVisible={bottomSheetFlag.flag}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                >
                {
                    bottomSheetFlag.options.map((item, index) => (
                        <BottomSheetItemC
                            key={index}
                            item={item}
                        /> 
                    )) 
                }
            </BottomSheet>
            <ModalListC
                tittle={modalList.tittle}
                vissible={modalList.flag}
                addPress={handleAddPress}
                onCancel={() => setModalList({ ...modalList, flag: false })}
                renderItem={
                    (modalList.tittle == 'Skills' || modalList.tittle == 'Interests')
                    ? renderItemSkill
                    : (modalList.tittle == 'Awards')
                    ? renderItemAward
                    : (modalList.tittle == 'Idioms')
                    ? renderItemIdiom
                    : null
                }
                
                data={
                    (modalList.tittle == 'Skills')
                    ? user.skills
                    : (modalList.tittle == 'Interests')
                    ? user.interest
                    : (modalList.tittle == 'Awards')
                    ? user.awards
                    : (modalList.tittle == 'Idioms')
                    ? user.idioms
                    : []
                }
            />
            {
                (loading.loading && loading.first)
                ? <ActivityIndicator size="large" color="#00ff00" />
                : <ScrollView 
                    refreshControl={
                        <RefreshControl
                            refreshing={loading.loading}
                            onRefresh={refresh}
                        />
                    }
                    contentContainerStyle={userDetailStyles.fill}
                    >
                    <View style={[ userDetailStyles.viewLinesItem, { paddingTop: '2%' } ]}>
                        { 
                            (user.img == null)
                            ? <Avatar 
                                rounded
                                size="xlarge"
                                containerStyle={{ backgroundColor: 'lightgray' }}
                                icon={{ name: 'camera-outline', color: 'white', type: 'ionicon', size: 100 }} 
                            />
                            : <Avatar 
                                rounded 
                                source={{ uri: `data:image/png;base64,${user.img}` }}
                                size="xlarge" 
                            />
                        }
                        <View style={[ userDetailStyles.viewRow, userDetailStyles.viewEditIcon ]}>
                            <View>
                                <Text style={userDetailStyles.name}>
                                    {user.name} {user.lastName}
                                </Text>
                                <Text style={userDetailStyles.tittleItem}>
                                    {user.email}
                                </Text>
                                <Text style={userDetailStyles.tittleItem}>
                                    {user.country} - {user.connectNum} Connects
                                </Text>
                            </View>
                            {
                                (user.connect)
                                ? null
                                : (user.id != me.id)
                                ? (user.myConnect)
                                ? null
                                : <TouchableOpacity
                                    onPress={sendConnect} 
                                    style={userDetailStyles.buttonConnect}
                                    >
                                    <Text style={{ color: 'gray', fontWeight: 'bold' }}>
                                        Connect
                                    </Text>
                                </TouchableOpacity>
                                : <Icon
                                    containerStyle={{ paddingRight: '5%' }}
                                    onPress={() => navigation.navigate('EditUser', { user: user, callback: callBack.bind(this) })}
                                    name='pencil'
                                    color='gray'
                                    type='ionicon' 
                                    size={30}
                                />
                            }
                        </View>
                    </View>
                    {
                        (user.description == null)
                        ? null
                        : <View style={[ userDetailStyles.viewList, userDetailStyles.viewLinesItem ]}>
                            <View style={[ userDetailStyles.viewRow, userDetailStyles.viewEditIcon ]}>
                                <Text style={userDetailStyles.tittleItem}>
                                    Description
                                </Text>
                            </View>
                            <Text style={userDetailStyles.text}>
                                {user.description}
                            </Text>
                        </View>
                    }
                    {
                        (user.activities.length < 1) 
                        ? null
                        : <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                Activities
                            </Text>
                            {
                                user.activities.map((item, index) => (
                                    <ListItem 
                                        key={index} 
                                        bottomDivider
                                        >
                                        <ListItemWithImgC 
                                            onPress={() => navigation.navigate('SeePost', { user, post: item, callback: postCallback.bind(this) })}
                                            img={item.img}
                                            tittle={item.tittle}
                                            line2={line2Activity(item.dateCreation, item.dateEdit)}
                                            line3={line3Activity(item.reactions, item.commentaries, item.commentFlag)}
                                        />
                                    </ListItem>
                                ))
                            }
                            <SeeMoreButtonC
                                action={gotoUserActivities}
                            />
                        </View>
                    }
                    { 
                        (user.qualifications.length < 1)
                        ? null
                        : <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                Qualifications
                            </Text>
                            {
                                user.qualifications.map((item, index) => (
                                    <ListItem 
                                        key={index} 
                                        bottomDivider
                                        >
                                        <ListItemWithImgC 
                                            img={item.img}
                                            tittle={item.university}
                                            line2={line2Qualification(item.qualification)}
                                            line3={line3ExperienceQualification(item.dateInit, item.dateEnd)}
                                        />
                                    </ListItem>
                                ))
                            }
                            <SeeMoreButtonC
                                action={gotoUserQualifications}
                            />
                        </View> 
                    } 
                    { 
                        (user.experiences.length < 1)
                        ? null
                        : <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                Experiences
                            </Text>
                            {
                                user.experiences.map(item => (
                                    <ListItem 
                                        key={item.id} 
                                        bottomDivider
                                        >
                                        <ListItemWithImgC 
                                            img={item.img}
                                            tittle={item.job}
                                            line2={line2Experience(item.enterprise, item.typeJob)}
                                            line3={line3ExperienceQualification(item.dateInit, item.dateEnd)}
                                        />
                                    </ListItem>
                                ))
                            }
                            <SeeMoreButtonC
                                action={gotoUserExperiences}
                            />
                        </View> 
                    }
                    { 
                        (user.idioms.length < 1)
                        ? <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                Idioms
                            </Text>
                            <ListItem>
                                <ListItemC
                                    action={() => setModalList({ tittle: 'Idioms', flag: true })}
                                    tittle='No have Idiom? Write one!'
                                />
                            </ListItem>
                        </View>
                        : <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                idioms
                            </Text>
                            {
                                user.idioms.map(item => (
                                    <ListItem key={item.id} bottomDivider>
                                        <ListItemC
                                            action={() => setModalList({ tittle: 'Idioms', flag: true })}
                                            tittle={item.name}
                                            line2={line2IdiomAward(item.lvl)}
                                        />
                                    </ListItem>
                                ))
                            } 
                            <SeeMoreButtonC
                                action={()=> setModalList({ tittle: 'Idioms', flag: true })}
                            />
                        </View>
                    }
                    {
                        (user.id == me.id && user.awards.length < 1)
                        ? <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                Awards
                            </Text>
                            <ListItem>
                                <ListItemC
                                    action={() => setModalList({ tittle: 'Awards', flag: true })}
                                    tittle='No have award? Write one!'
                                />
                            </ListItem>
                        </View>
                        : (user.awards.length < 1)
                        ? null
                        : <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                Awards
                            </Text>
                            {
                                user.awards.map((item, index) => (
                                    <ListItem key={index} bottomDivider>
                                        <ListItemC
                                            action={() => setModalList({ tittle: 'Awards', flag: true })}
                                            tittle={item.description}
                                            line2={line2IdiomAward(item.date)}
                                        />
                                    </ListItem>
                                ))
                            }
                            <SeeMoreButtonC
                                action={()=> setModalList({ tittle: 'Awards', flag: true })}
                            />
                        </View>
                    }
                    { 
                        (user.id == me.id && user.skills.length < 1)
                        ? <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                Skills
                            </Text>
                            <ListItem>
                                <ListItemC
                                    action={() => setModalList({ tittle: 'Skills', flag: true })}
                                    tittle='No have skill? Write one!'
                                />
                            </ListItem>
                        </View>
                        : (user.skills.length < 1)
                        ? null
                        : <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                Skills
                            </Text>
                            {
                                user.skills.map((item, index) => (
                                    <ListItem key={index} bottomDivider>
                                        <ListItemC
                                            action={()=> setModalList({ tittle: 'Skills', flag: true })}
                                            tittle={item.description}
                                        />
                                    </ListItem>
                                ))
                            }
                            <SeeMoreButtonC
                                action={()=> setModalList({ tittle: 'Skills', flag: true })}
                            />
                        </View>
                        }
                        { 
                            (user.id == me.id && user.interest.length < 1)
                            ? <View style={userDetailStyles.viewList}>
                                <Text style={userDetailStyles.tittleList}>
                                    Interests
                                </Text>
                                <ListItem>
                                    <ListItemC
                                        action={() => setModalList({ tittle: 'Interests', flag: true })}
                                        tittle='No have interest? Write one!'
                                    />
                                </ListItem>
                            </View>
                            : (user.interest.length < 1)
                            ? null
                            : <View style={userDetailStyles.viewList}>
                                <Text style={userDetailStyles.tittleList}>
                                    Interests
                                </Text>
                                {
                                    user.interest.map((item, index) => (
                                        <ListItem key={index} bottomDivider>
                                            <ListItemC
                                                action={()=> setModalList({ tittle: 'Interests', flag: true })}
                                                tittle={item.description}
                                            />
                                        </ListItem>
                                    ))
                                }
                                <SeeMoreButtonC
                                    action={()=> setModalList({ tittle: 'Interests', flag: true })}
                                />
                            </View>
                        }
                </ScrollView>
            }          
        </View> 
    )
}

export default UserProfile

const userDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 24,
        height:'100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#f4f6fc',
    },

    viewList: {
        marginTop: 10,
        backgroundColor: 'white', 
        borderRadius: 10 
    },

    buttonSee: {
        alignItems: 'center', 
        justifyContent: "center", 
        height: 50
    },

    buttonSeeText: {
        fontSize: 30, 
        color:'#3465d9'
    },

    name: {
        fontWeight: "bold", 
        fontSize: 30, 
    },

    tittleList: { 
        fontWeight: "bold", 
        fontSize: 30, 
        paddingLeft: 10 
    },

    viewLinesItem: {
        paddingLeft: 10 
    },

    fill: { 
        width: '100%' 
    },

    tittleItem: { 
        color:'gray', 
        fontWeight: "bold", 
        fontSize: 20 
    },

    viewRow: {
        flexDirection: 'row',
        alignItems: 'center' 
    },

    viewEditIcon: {
        justifyContent: 'space-between', 
        paddingRight: '3%' 
    },

    viewReaction: {
        flexDirection: 'row', 
        paddingRight: 5
    },

    text: {
        color: 'gray'
    },

    viewItem: {
        padding: 10,
        width: '100%',
        backgroundColor: '#f4f6fc',
    },

    modal: {  
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    input: {
        borderRadius: 5, 
        backgroundColor: 'lightgray', 
        padding: 5, 
        width:'100%',
        marginVertical: '3%'
    },

    button: { 
        width: "100%",
        height: 40,
        backgroundColor: "#3465d9",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5, 
    },

    buttonConnect: { 
        padding: '3%', 
        borderWidth: 1, 
        borderColor: 'gray', 
        borderRadius: 10 
    },

    buttonText: {
        color: "white", 
        fontSize: 15, 
        fontWeight: "bold" 
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

    item: {
        paddingVertical: '5%',
        paddingHorizontal: '5%',
        backgroundColor: 'white' , 
        borderRadius: 10, 
        alignItems: 'center', 
        flexDirection: 'row',
        justifyContent: 'space-between' 
    },
});