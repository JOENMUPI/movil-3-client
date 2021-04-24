import React, { useState, useEffect } from 'react';
import {
    View,
    Text, 
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    ToastAndroid,
    Alert,
    ScrollView,
    StyleSheet
} from "react-native";
import { Icon } from 'react-native-elements'
import AsyncStorage from '@react-native-community/async-storage';
import DateTimePickerModal from "react-native-modal-datetime-picker";

import BasicSearchBar from '../components/SearchBar';
import Http from '../components/Http';

const OFFER_BLANK = {
    tittle: '',
    description: '',
    dateExp: null,
    price: null, 
    jobId: 0,
    enterpriseId: 0
}

const Offer = ({ navigation, route }) => { 
    const [offer, setOffer] = useState(OFFER_BLANK);
    const [jobs, setJobs] = useState({ data: route.params.jobs, selected: {} });
    const [searchFlag, setSearchFlag] = useState(false);
    const [dateTimeFlag, setDateTimeFlag] = useState(false);
    const [descriptionFlag, setDescriptionFlag] = useState(false);
    const [loading, setLoading] = useState(false);

    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const checkDate = () => {  
        const now = new Date(); 
        let aux;

        (route.params.data) 
        ? aux = new Date(offer.dateExp)
        : aux = offer.dateExp;

        if(aux.getFullYear() < now.getFullYear()) {
            return false;
        
        } else { 
            if(aux.getMonth() < now.getMonth() && aux.getFullYear() == now.getFullYear()) {
                return false;
            
            } else { 
                if(aux.getDate() <= now.getDate() && aux.getMonth() == now.getMonth()) {
                    return false;
                
                } else {
                    return true;
                }
            }
        }
    }

    const modeEdit = () => {
        if(route.params.data) {
            (route.params.data.price)
            ? setOffer({ ...route.params.data, price: route.params.data.price.toString() })
            : setOffer(route.params.data);
        }
    }

    const handleSendbutton = () => { 
        if(!checkDate()) { 
            Alert.alert('Hey!', 'Only future dates allowed!');
        
        } else {
            (route.params.data) 
            ? sendOffer('PUT')
            : sendOffer('POST');
        }
    }

    const handlePicker = (date) => { 
        setOffer({ ...offer, dateExp: date });
        setDateTimeFlag(false); 
    }

    const onPressItemSearchBar = (item) => {
        setSearchFlag(false);
        setOffer({ ...offer, jobId: item.id });
        setJobs({ ...jobs, selected: item }); 
    }

    const sendOffer = async (type) => { 
        setLoading(true);
        const token = await AsyncStorage.getItem('token');
        let jsonAux = { ...offer, enterpriseId: route.params.enterpriseId, price: parseFloat(offer.price) };
        
        if (type != 'POST') {
            jsonAux = { ...jsonAux, oldjobId: route.params.data.universityId }
        }

        const data = await Http.send(type, 'offer', jsonAux, token);
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message); 
                    (route.params.data) 
                    ? route.params.callback('update', { ...offer, job: jobs.selected })
                    : route.params.callback('create', { ...data.body, job: jobs.selected });
                    
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

    useEffect(() => { 
        modeEdit();    
    }, []); 

    return (
        <View style={styles.container}> 
            <BasicSearchBar
                arrayData={jobs.data}
                vissible={searchFlag}
                onCancel={() => setSearchFlag({ ...searchFlag, basic: false })}
                onPressItem={onPressItemSearchBar.bind(this)}
            />
            <DateTimePickerModal
                isVisible={dateTimeFlag}
                mode="date"
                onConfirm={handlePicker}
                onCancel={() => setDateTimeFlag(false)}
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
                    {
                        (route.params.data)
                        ? 'Edit offer'
                        : 'New offer'
                    }
                </Text>
                <TouchableOpacity
                    onPress={handleSendbutton}
                    style={
                        (route.params.data) 
                        ? (offer.tittle.length && offer.description.length) && 
                            (  
                                offer.tittle != route.params.data.tittle 
                                || offer.description != route.params.data.description
                                || offer.dateExp != route.params.data.dateExp
                                || offer.price != route.params.data.price
                                || offer.jobId != route.params.data.jobId
                            ) 
                        ? styles.saveButton
                        : [styles.saveButton, { borderColor: 'gray' }]
                        : (offer.tittle.length && offer.description.length && offer.dateExp != null && offer.jobId > 0)
                        ? styles.saveButton
                        : [styles.saveButton, { borderColor: 'gray' }]
                    }
                    disabled={
                        (route.params.data) 
                        ? (offer.tittle.length && offer.description.length && !loading) && 
                            (  
                                offer.tittle != route.params.data.tittle 
                                || offer.description != route.params.data.description
                                || offer.dateExp != route.params.data.dateExp
                                || offer.price != route.params.data.price
                                || offer.jobId != route.params.data.jobId
                            ) 
                        ? false
                        : true
                        : (offer.tittle.length && offer.description.length && offer.dateExp != null && offer.jobId > 0 && !loading)
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
                                ? (offer.tittle.length && offer.description.length) && 
                                    (  
                                        offer.tittle != route.params.data.tittle 
                                        || offer.description != route.params.data.description
                                        || offer.dateExp != route.params.data.dateExp
                                        || offer.price != route.params.data.price
                                        || offer.jobId != route.params.data.jobId
                                    ) 
                                ? styles.SaveButtonText
                                : [styles.SaveButtonText, { color: 'gray' }]
                                : (offer.tittle.length && offer.description.length && offer.dateExp != null && offer.jobId > 0)
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
                    <TextInput
                        placeholder='Tittle'  
                        style={styles.inputText}
                        onChangeText={text => setOffer({ ...offer, tittle: text })}
                        value={offer.tittle}
                    />
                    <TouchableOpacity
                        onPress={() => setSearchFlag(true)}
                        style={styles.inputText}
                        >
                        <Text style={{ color: 'gray' }}>
                            Job: {jobs.selected.description} 
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setDateTimeFlag(true)}
                        style={styles.inputText}
                        >
                        <Text style={{ color: 'gray' }}>
                            Expiration date: {
                                (offer.dateExp == null)
                                ? null
                                : (offer.dateExp.toString().indexOf('Z') != -1)
                                ? offer.dateExp.toString().split('T')[0]
                                : offer.dateExp.toString().split(' ').splice(1,3).join('-')
                            }
                        </Text>
                    </TouchableOpacity>
                    <TextInput
                        placeholder='Salary ($)'  
                        keyboardType='numeric'
                        style={styles.inputText}
                        onChangeText={text => setOffer({ ...offer, price: text })}
                        value={offer.price}
                    />  
                    <TextInput
                        placeholder='Description'  
                        multiline
                        onEndEditing={() => setDescriptionFlag(false)}
                        onFocus={() => setDescriptionFlag(true)}
                        style={styles.inputText}
                        onChangeText={text => setOffer({ ...offer, description: text })}
                        value={offer.description}
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

export default Offer;

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

    TextAreabutton: {
        backgroundColor: '#1e90ff', 
        alignItems: 'center', 
        borderRadius: 5, 
        padding: 15, 
        marginTop: 10
    },
});