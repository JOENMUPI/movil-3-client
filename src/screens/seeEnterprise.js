import React, { useState, useEffect } from 'react';
import {
    View,
    Text, 
    TouchableOpacity,
    RefreshControl,
    ActivityIndicator,
    TextInput,
    ToastAndroid,
    ScrollView,
    Alert,
    Modal,
    StyleSheet
} from "react-native";
import { Icon, Avatar, ListItem, BottomSheet } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';

import Http from '../components/Http';
import ModalListC from '../components/modalList';
import SearchBar from '../components/SearchBar';


const ENTERPRISE_BLANK = {
    name: 'name',
    description: 'des',
    img: null,
    id: 0,
    userId: 0,
    countries: [],
    jobs: []
}

const MODAL_BLANK = {
    editFlag: false,
    type: '', 
    flag: false
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


const seeEnterprise = ({ navigation, route }) => { 
    const [loading, setLoading] = useState({ loading: false, first: true }); 
    const [modalList, setModalList] = useState({ tittle: '', flag: false });
    const [json, setJson] = useState({ description: '' });
    const [countries, setCountries] = useState({ countries: [], flag: false, selected: { tittle: '' } });
    const [bottomSheetFlag, setBottomSheetFlag] = useState({ flag: false, options: BSO_BLANK });
    const [modal, setModal] = useState(MODAL_BLANK);
    const [enterprise, setEnterprise] = useState(ENTERPRISE_BLANK);
    const [me, setMe] = useState({}); 

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

    const onPressItemSearchBar = (item) => { 
        let countriesAux = enterprise.countries;
        
        countriesAux.unshift(item);
        setEnterprise({ ...enterprise, countries: countriesAux });
        setCountries({ ...countries, flag: false });
        sendData('POST', 'country/enterprise', { enterpriseId: enterprise.id, countryId: item.id });
    }

    const refresh = () => {
        getEnterprise().then(res => { 
            setEnterprise(res);
            setLoading({ first: false, loading: false }); 
        });
    }

    const callBackEnterprise = (type, data) => { 
        setEnterprise(data);
        route.params.callback(type, data);
    }

    const handleAddPress = () => { 
        if (enterprise.userId != me.id) {
            Alert.alert('Sorry', "you can't create for other users");
        
        } else {
            switch(modalList.tittle) {
                case 'Countries':
                    setCountries({ ...countries, flag: true });
                    break;
    
                case 'Jobs':
                    setModal({ type: 'job', flag: true, editFlag: false });
                    break;
    
                default:
                    Alert.alert('tittle no match', `Error on handlePress "${modalList.tittle}"`);
                    break;
            }
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

    const renderItemOptions = (item) => {
        let bsoAux = BSO_BLANK;
        
        switch(modalList.tittle) {
            case 'Jobs':               
                bsoAux = handleBottomSheetOptions(
                    item.description,
                    () => { 
                        setJson({ ...item, ref: item }); 
                        setModal({ type: 'job', flag: true, editFlag: true }); 
                        setBottomSheetFlag({ ...bottomSheetFlag, flag: false }); 
                    },
                    () => {
                        deleteAlert(item.description, () => deleteJob(item));
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

    const onPressModal = () => {
        if(modal.type == 'job' && json.description.length < 1) {
            Alert.alert('Empty field', 'Fill all field pls');
        
        } else {
            let data = [];

            switch(modal.type) {
                case 'job':
                    if(modal.editFlag) {
                        data = enterprise.jobs.map(job => {
                            if(job.id == json.id) { 
                                 return json;
                            }
                
                            return job;
                        });

                        setEnterprise({ ...enterprise, jobs: data });
                        sendData('PUT', 'job', { ...json, enterpriseId: enterprise.id });
                        setModal(MODAL_BLANK);
                        setJson({ description: '' });
    
                    } else {
                       sendNewJob({ enterpriseId: enterprise.id, description: json.description });
                    }
                    break;
            }
        }
    }

    const deleteAlert = (tittle, pressOk) => {
        Alert.alert(
            'Waring', 
            `Are you sure delete ${tittle}?`,
            [
                { text: "Cancel", style: "cancel" }, 
                { text: "OK", onPress: pressOk }
            ], { cancelable: false }
        );
    }

    const deleteCountry = (item) => {
        const countriesAux = enterprise.countries.filter(i => i.id != item.id);

        setEnterprise({ ...enterprise, countries: countriesAux });
        sendData('DELETE', `country/enterprise/${enterprise.id}/${item.id}`, null);
    }

    const deleteJob = (item) => {
        const jobsAux = enterprise.jobs.filter(i => i.id != item.id);

        setEnterprise({ ...enterprise, jobs: jobsAux });
        sendData('DELETE', `job/${item.id}`, null);
    }

    const sendNewJob = async (body) => {
        setLoading({ ...loading, loading: true });
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('POST', 'job', body, token);
    
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');

        } else {
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message);
                    let aux = enterprise.jobs; console.log('body');

                    aux.unshift(data.body);
                    setEnterprise({ ...enterprise, jobs: aux });
                    setModal(MODAL_BLANK);
                    setJson({ description: '' });
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
        
        setLoading({ ...loading, loading: false });
    }

    const sendData = async (type, endpoint, body) => {
        setLoading({ ...loading, loading: true });
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send(type, endpoint, body, token);
    
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
        
        setLoading({ ...loading, loading: false });
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

    const getEnterprise = async () => {   
        setLoading({ ...loading, loading: true })
        const id = route.params.enterpriseId;
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('GET', `enterprise/${id}`, null, token);
    
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message); 
                    return data.body;

                case 'Fail':
                    data.body.errors.forEach(element => {
                        toast(element.text);
                    });
                    return ENTERPRISE_BLANK;
                    
                default:
                    Alert.alert(data.typeResponse, data.message);
                    return ENTERPRISE_BLANK;
            }
        } 
    }

    const ListItemC = ({ tittle, action, bottomDivider }) => (
        <ListItem bottomDivider={bottomDivider | false}>   
            <TouchableOpacity
                style={{ width: '100%' }}
                onPress={action}
                >
                <Text style={styles.tittleItem}>
                    {tittle}
                </Text>
            </TouchableOpacity>
        </ListItem>
    )

    const renderItemModalList = ({ item }) => ( 
        <View style={styles.viewItem}> 
            <View style={styles.item}>
                <Text style={{ fontSize: 15 }}>
                    {
                        (item.tittle)
                        ? item.tittle
                        : item.description
                    }
                </Text> 
                {
                    (enterprise.userId != me.id)
                    ? null
                    : (item.tittle)
                    ? <Icon
                        onPress={() => deleteAlert(item.tittle, () => deleteCountry(item))}
                        name='close-outline'
                        color='gray'
                        type='ionicon'
                        size={30}
                    />
                    : <Icon
                        onPress={() => renderItemOptions(item)}
                        name='ellipsis-vertical'
                        color='gray'
                        type='ionicon'
                        size={30}
                    />
                }
            </View>  
        </View>
    )

    const SeeMoreButtonC = ({ action }) => (
        <TouchableOpacity 
            onPress={action}
            style={styles.buttonSee}
            >
            <Text style={styles.buttonSeeText}>
                See more
            </Text>
        </TouchableOpacity>
    )

    useEffect(() => {  
        getMe().then(res => setMe(res));
        getCountries().then(res => setCountries({ ...countries, countries: res }));
        refresh(); 
    }, []);


    return (
        <View style={styles.container}>
            <BottomSheet
                isVisible={bottomSheetFlag.flag}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                >
                {
                    bottomSheetFlag.options.map((item, index) => (
                        <ListItem 
                            key={index}
                            containerStyle={item.containerStyle} 
                            onPress={item.onPress}
                            >
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
                    )) 
                }
            </BottomSheet>
            <SearchBar
                arrayData={countries.countries}
                vissible={countries.flag}
                onCancel={() => setCountries({ ...countries, flag: false })}
                onPressItem={onPressItemSearchBar.bind(this)}
            />
            <Modal 
                animationType="slide"
                transparent
                visible={modal.flag}
                onRequestClose={() => setModal({ ...modal, flag: false })}
                >
                <View style={styles.modal}>
                    <View style={styles.viewModal}>  
                        <View style ={{ alignItems: 'center' }}> 
                            <Text style={styles.tittleItem}>
                                {modal.type}
                            </Text>
                            {
                                (modal.type == 'job')
                                ? <TextInput
                                    placeholder={`Write a ${modal.type}!`}  
                                    onChangeText={description => setJson({ ...json, description })}
                                    onSubmitEditing={onPressModal}
                                    autoFocus
                                    value={json.description}
                                    style={styles.input}
                                />
                                : null
                            }
                            <TouchableOpacity 
                                onPress={onPressModal}
                                style={styles.button}
                                >
                                {
                                    (loading.loading)
                                    ? <ActivityIndicator size="small" color="#00ff00" />
                                    : <Text style={styles.buttonText}>
                                        Finish and send
                                    </Text>
                                }
                            </TouchableOpacity>
                        </View>  
                    </View>
                </View>
            </Modal>
            <ModalListC
                tittle={modalList.tittle}
                vissible={modalList.flag}
                addPress={handleAddPress}
                onCancel={() => setModalList({ ...modalList, flag: false })}
                renderItem={
                    (modalList.tittle == 'Countries' || modalList.tittle == 'Jobs')
                    ? renderItemModalList
                    : (modalList.tittle == 'Admins')
                    ? null// suspendido for de momment
                    : null
                } 
                data={
                    (modalList.tittle == 'Countries')
                    ? enterprise.countries
                    : (modalList.tittle == 'Jobs')
                    ? enterprise.jobs
                    : []
                }
            />
            {
                (loading.loading && loading.first)
                ? <ActivityIndicator size="large" color="#00ff00" />
                : <ScrollView
                    contentContainerStyle={{ width: '100%'  }}    
                    refreshControl={
                        <RefreshControl
                            refreshing={loading.loading}
                            onRefresh={refresh}
                        />
                    }
                    >
                    <View style={styles.viewLinesItem}> 
                        { 
                            (enterprise.img == null)
                            ? <Avatar 
                                rounded
                                size="xlarge"
                                containerStyle={{ backgroundColor: 'lightgray' }}
                                icon={{ name: 'camera-outline', color: 'white', type: 'ionicon', size: 100 }} 
                            />
                            : <Avatar 
                                rounded 
                                source={{ uri: `data:image/png;base64,${enterprise.img}` }}
                                size="xlarge" 
                            />
                        }
                        <View style={[ styles.viewRow, styles.viewEditIcon ]}>
                            <View>
                                <Text style={styles.name}>
                                    {enterprise.name}
                                </Text>
                                <Text style={[ styles.tittleItem, { fontWeight: 'normal' } ]}>
                                    {enterprise.description}
                                </Text>
                            </View>
                            {
                                (enterprise.userId != me.id)
                                ? null
                                : <Icon
                                    containerStyle={{ paddingRight: '5%' }}
                                    onPress={() => navigation.navigate('Enterprise', { data: enterprise, callback: callBackEnterprise.bind(this) })}
                                    name='pencil'
                                    color='gray'
                                    type='ionicon' 
                                    size={30}
                                />
                            }
                        </View>
                    </View>
                    {
                        (enterprise.userId == me.id && enterprise.countries.length < 1) 
                        ? <View style={styles.viewList}>
                            <Text style={styles.tittleList}>
                                Countries
                            </Text>
                            <ListItemC
                                action={() => setModalList({ flag: true, tittle: 'Countries' })}
                                tittle='Where is your company?'
                            />
                        </View>
                        : (enterprise.countries.length < 1)
                        ? null
                        : <View style={styles.viewList}>
                            <Text style={styles.tittleList}>
                                Countries
                            </Text>
                            {
                                enterprise.countries.map((item, index) => (
                                    <ListItemC
                                        key={index}
                                        bottomDivider={true}
                                        action={() => setModalList({ flag: true, tittle: 'Countries' })}
                                        tittle={item.tittle}
                                    />
                                ))
                            }
                            <SeeMoreButtonC
                                action={() => setModalList({ flag: true, tittle: 'Countries' })}
                            />
                        </View>
                    }
                    {
                        (enterprise.userId == me.id && enterprise.jobs.length < 1) 
                        ? <View style={styles.viewList}>
                            <Text style={styles.tittleList}>
                                Jobs
                            </Text>
                            <ListItemC
                                action={() => setModalList({ flag: true, tittle: 'Jobs' })}
                                tittle='Company whitout jobs?'
                            />
                        </View>
                        : (enterprise.jobs.length < 1)
                        ? null
                        : <View style={styles.viewList}>
                            <Text style={styles.tittleList}>
                                Jobs
                            </Text>
                            {
                                enterprise.jobs.map((item, index) => (
                                    <ListItemC
                                        key={index}
                                        bottomDivider={true}
                                        action={() => setModalList({ flag: true, tittle: 'Jobs' })}
                                        tittle={item.description}
                                    />
                                ))
                            }
                            <SeeMoreButtonC
                                action={() => setModalList({ flag: true, tittle: 'Jobs' })}
                            />
                        </View>
                    }
                </ScrollView>
            }
        </View>
    )
};

export default seeEnterprise;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 24,
        height:'100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#f4f6fc',
    },

    viewEditIcon: {
        justifyContent: 'space-between', 
        paddingLeft: '3%' 
    },

    modal: {  
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
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

    input: {
        borderRadius: 5, 
        backgroundColor: 'lightgray', 
        padding: 5, 
        width:'100%',
        marginVertical: '3%'
    },

    viewLinesItem: {
        paddingLeft: '3%',
        paddingTop: '2%'
    },

    buttonSeeText: {
        fontSize: 30, 
        color:'#3465d9'
    },

    buttonText: {
        color: "white", 
        fontSize: 15, 
        fontWeight: "bold" 
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

    viewItem: {
        padding: 10,
        width: '100%',
        backgroundColor: '#f4f6fc',
    },

    viewList: {
        marginTop: '3%',
        backgroundColor: 'white', 
        borderRadius: 10 
    },

    tittleList: { 
        fontWeight: "bold", 
        fontSize: 30, 
        paddingLeft: 10 
    },

    button: { 
        width: "100%",
        height: 40,
        backgroundColor: "#3465d9",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5, 
    },

    buttonSee: {
        alignItems: 'center', 
        justifyContent: "center", 
        height: 50
    },

    tittleItem: { 
        color:'gray', 
        fontWeight: 'bold', 
        fontSize: 20 
    },

    name: {
        fontWeight: "bold", 
        fontSize: 30, 
    },

    viewRow: {
        flexDirection: 'row',
        alignItems: "center"
    },
});