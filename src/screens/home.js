import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react'; 
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ToastAndroid, 
    Alert, 
    ActivityIndicator, 
    Modal, 
    TextInput,
    ScrollView 
} from 'react-native';

import { Icon } from 'react-native-elements'

import Field from '../components/Field';
import Http from '../components/Http';
import SearchBar from '../components//SearchBar';

import { homeStyles } from '../styles/screens/home';


const LIST_BLANK = { id: 0, tittle: '', background: 'gray', tittleForUpdate: '', tasks: [] }

const Home = ({ navigation, route }) => { 
    const [list, setList] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [modal, setModal] = useState({ type: 'create', flag: false });
    const [searchBarFlag, setSearchBarFlag] = useState(false);
    const [loading, setLoading] = useState(false);
    const [newList, setNewList] = useState(LIST_BLANK);
    

    // Utilities
    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const changeToUpdateModel = (listItem) => {  
        setNewList({ ...listItem, tittleForUpdate: listItem.tittle, tittle: '' }); 
        setModal({ type: 'update', flag: true }); 
    }

    const changeToCreateModel = () => {
        let newListAux = newList;

        newListAux.tittle = '';
        setNewList(newListAux); 
        setModal({ type: 'create', flag: true }); 
    }

    const alertForDelete = (listItem) => {
        Alert.alert(
            "Delete",
            `Are you sure delete ${listItem.tittle}`,
            [
                { text: "Cancel", style: "cancel" }, 
                { text: "OK", onPress: () => deleteList(listItem) }
    
            ], { cancelable: false }
          );
    } 

    const callback = (item, type) => {
        let tasksAux= [];
        let listAux = [];
        let taskAux = [];

        switch(type) {
            case 'update':
                tasksAux = tasks.map(task => {
                    if(task.id == item.id) {
                        return item;
                    }
        
                    return task;
                });
        
                listAux = list.map(i => {
                    if(i.id == item.listId) {
                        taskAux = i.tasks.map(element => {
                            if(element.id == item.id) {
                                return item;
                            }
        
                            return element;
                        });
        
                        return { ...i, tasks: taskAux };
                    }
        
                    return i;
                });
                break;
            
            case 'create': 
                tasksAux = tasks;
                tasksAux.push(item);

                listAux = list.map(i => {
                    if(i.id == item.listId) {
                        taskAux = i.tasks;
                        taskAux.push(item);
        
                        return { ...i, tasks: taskAux }
                    }
        
                    return i;
                });
                break;

            case 'delete': 
                tasksAux = tasks.filter(i => i.id != item.id);

                listAux = list.map(i => {
                    if(i.id == item.listId) {
                        return {...i, tasks: i.tasks.filter(j => j.id != item.id)}
                    }
                    
                    return i;
                });
                break;
        }

        setList(listAux);
        setTasks(tasksAux); 
    }

    const List = ({ data, tittle, theme, stamp }) => {
        return (
            <View style={[ homeStyles.viewList, { allignItems: "center" } ]}>
                <TouchableOpacity 
                    onPress={() => navigation.navigate('ListDetail', { item: data, callback: callback.bind(this) })} 
                    style={{ flexDirection: "row" }}
                    >
                    <Icon 
                        name='reorder-three-outline' 
                        color={theme} 
                        type='ionicon' 
                        size={30} 
                        style={{ marginRight: 5 }}
                    />
                    <View>
                        <Text style={{ fontSize: 16 }}>
                            {tittle}
                        </Text>
                        <Text style={{ fontSize: 16, color: '#a4a4a4' }}>
                            {stamp}
                        </Text>
                    </View>
                </TouchableOpacity>
    
                <View style={{ flexDirection: "row" }}>
                    <Icon 
                        name='pencil' 
                        color='#1e90ff' 
                        type='ionicon' 
                        size={30} 
                        style={{ marginRight: 10 }}
                        onPress={() => changeToUpdateModel(data)}
                    />
                    <Icon 
                        name='trash' 
                        color='red' 
                        type='ionicon' 
                        size={30} 
                        onPress={() => alertForDelete(data)}
                    />
                </View>
            </View>
        )
    }

    // Logic
    const getTask = async (body) => { 
        let aux = [];    

        body.forEach(item => {  
            aux = aux.concat(item.tasks);
        });

        setTasks(aux);
    }

    const deleteList = async (listItem) => { 
        const data = await Http.send('DELETE', `list/${listItem.id}`, null);
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');

        } else {
            switch(data.typeResponse) {
                case 'Success': 
                    toast(data.message);
                    let auxList = list.filter(i => i.id != listItem.id);
                    
                    setList(auxList);
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

    const updateList = async () => { 
        if(!Field.checkFields([ newList.tittle ])) {
            Alert.alert('Empty Field', 'Please, write a tittle');
        
        } else {
            setLoading(true); 
            const { tittleForUpdate, ...jsonAux } = newList;
            const data = await Http.send('PUT', 'list', jsonAux);

            if(!data) {
                Alert.alert('Fatal Error', 'No data from server...');

            } else { 
                switch(data.typeResponse) { 
                    case 'Success': 
                        toast(data.message);
                        let listAux = list.map((item) => {
                            if(item.id == jsonAux.id) { return jsonAux; } 
                            else { return item }
                        });

                        setList(listAux); 
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

        setModal({ ...modal, flag: false });
    }

    const getList = async() => { 
        setLoading(true);
        const id = route.params.id;
        const data = await Http.send('GET', `list/user/${id}`, null);
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

        setLoading(false);
        return res; 
    }

    const submitNewList = async () => {
        if(!Field.checkFields([ newList.tittle ])) {
            Alert.alert('Empty Field', 'Please, write a tittle');
        
        } else {
            setLoading(true);
            const id = route.params.id;
            const data = await Http.send('POST', 'list', { ...newList, userId: id });

            if(!data) {
                Alert.alert('Fatal Error', 'No data from server...');
    
            } else {
                switch(data.typeResponse) {
                    case 'Success':  
                        toast(data.message);  
                        let newListAux = { ...newList, id: data.body.id }
                        let listAux = list;
                        
                        listAux.unshift(newListAux);
                        setList(listAux);
                        setNewList(LIST_BLANK);
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
        
        setModal({ ...modal, flag: false });
    }

    const onPressItemSearchBar = (item) => {
        navigation.navigate('TaskDetail', { item, callback: callback.bind(this) });
        setSearchBarFlag(false);
    }
    

    // Ggwp
    useEffect(() => {
        getList().then(res => { 
            setList(res);
            getTask(res);
        });
    }, []);
    

    return (  
        <View style={homeStyles.container}>
            <SearchBar
                arrayData={tasks}
                vissible={searchBarFlag}
                onPressItem={onPressItemSearchBar.bind(this)}
                onCancel={() => setSearchBarFlag(false)}
            />
            <Modal
                animationType="slide"
                transparent
                visible={modal.flag}
                onRequestClose={() => {
                    (modal.type == 'create') 
                    ? Alert.alert('New list has been canceled.')
                    : Alert.alert('Update list has been canceled.');

                    setModal({ ...modal, flag: false });
                }}
                >
                <View style={homeStyles.centeredView}>
                    <View style={homeStyles.modalView}>
                        <Text style={homeStyles.modalText}>
                            { 
                                (modal.type == 'create') 
                                ? 'New list' 
                                : `Update ${newList.tittleForUpdate}'s list` 
                            }
                        </Text>
                        <TextInput
                            placeholder="Write the list's tittle"
                            style={{
                                marginBottom: 15,
                                borderBottomColor: '#cccccc',
                                borderBottomWidth: 1
                            }}
                            autoFocus
                            onChangeText={tittle => setNewList({ ...newList, tittle: tittle })}
                            onSubmitEditing={() => {
                                (modal.type == 'create') 
                                ? submitNewList()
                                : updateList();
                            }}
                        />
                        <TouchableOpacity 
                            style={[homeStyles.button, homeStyles.buttonClose]}
                            onPress={() => {
                                (modal.type == 'create') 
                                ? submitNewList()
                                : updateList()
                            }}
                            >      
                            {
                                (loading) 
                                ? <ActivityIndicator size="small" color="#00ff00" /> 
                                : (modal.type == 'create') 
                                    ? <Text style={homeStyles.textStyle}> Create list </Text>
                                    : <Text style={homeStyles.textStyle}> Update list </Text>
                            }
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <StatusBar style="auto" />
            <View style={homeStyles.viewTittle}>
                <Text style={homeStyles.textTtittle}>
                    Welcome, {route.params.name}
                </Text>
            </View>
            <View style={homeStyles.header}>
                <Text style={{ fontSize: 24 }}>
                    Lists
                </Text>  
                
                <View style={homeStyles.buttonAdd} >
                    <Icon 
                        name='add-outline' 
                        color='#1e90ff' 
                        type='ionicon' 
                        size={30} 
                        onPress={changeToCreateModel}
                    />
                </View>
                <View style={homeStyles.buttonAdd}>
                    <Icon 
                        name='search-outline' 
                        color='#1e90ff'
                        type='ionicon' 
                        size={30} 
                        onPress={() => setSearchBarFlag(true)}
                    />   
                </View>
            </View>
            <ScrollView style={{ backgroundColor: '#f4f6fc' }}>
                { 
                    (loading) 
                    ? <ActivityIndicator size="large" color="#006aff" style={{ paddingTop: '50%' }}/>
                    : (list.length <= 0) 
                    ? <Text style={{ color:'gray', fontSize: 25, textAlign:'center', paddingTop: 20 }}>
                        User dont have list, create one!
                    </Text>
                    : list.map(listItem => (
                        <List 
                            data={listItem}
                            tittle={listItem.tittle}
                            theme={listItem.background}
                            stamp={''}
                        />
                    ))
                }
            </ScrollView>
            <View style={homeStyles.viewSecondary}>
                <TouchableOpacity
                    onPress={() => Alert.alert('Sorry!', 'This area is under maintenance')}  
                    style={homeStyles.secondary}
                    >
                    <Text style={homeStyles.textSecondary}>
                        Priority
                    </Text>
                    <Icon 
                        name='star' 
                        color='gold'
                        type='ionicon' 
                        size={30} 
                    /> 
                </TouchableOpacity>
            </View>
            <View style={homeStyles.viewSecondary}>
                <TouchableOpacity
                    onPress={() => Alert.alert('Sorry!', 'This area is under maintenance')} 
                    style={homeStyles.secondary}
                    >
                    <Text style={homeStyles.textSecondary}>
                        Stats
                    </Text>
                    <Icon 
                        name='podium-outline' 
                        color='gray'
                        type='ionicon' 
                        size={30} 
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

export default Home