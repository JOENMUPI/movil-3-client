import React, { useState, useEffect } from 'react'; 
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Switch,
    ToastAndroid,
    ActivityIndicator,
    TouchableWithoutFeedback,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon, Avatar, Image } from 'react-native-elements';
import ImagePicker from '../components/ImagePicker';
import Http from '../components/Http';


const CAMERA_ICON = { 
    name: 'camera-outline', 
    color: 'white', 
    type: 'ionicon', 
    size: 30
}

const POST_BLANK = {
    description: '',
    tittle: '',
    img: null,
    commentFlag: true,
    connectFlag: false, 
}

const USER_BLANK = {
    img: null,
    name: '',
    lastName: ''
}

const Home = ({ navigation, route }) => { 
    const [user, setUser] = useState(USER_BLANK);
    const [post, setPost] = useState(POST_BLANK);
    const [descriptionFlag, setDescriptionFlag] = useState(false);
    const [loading, setLoading] = useState(false);

    let refTextIput = '';

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

    const getpost = () => {
        if(route.params) {
            return route.params.post;
        } else {
            return POST_BLANK;
        }
    }

    const finishOp = () => {
        setPost(POST_BLANK);
        setLoading(false);
        navigation.goBack();
    }

    const handlepressIconImage = async () => {
        const img = await ImagePicker.getImage(); 
        
        if(img == null) {
            return;
        }

        setPost({ ...post, img });
    }

    const deleteImg = () => {
        toast('Image removed...');
        setPost({ ...post, img: null });
    }

    const handleSendbutton = () => {
        (route.params) 
        ? sendPost('PUT')
        : sendPost('POST'); 
    }

    const sendPost = async (mode) => {   
        setLoading(true);
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send(mode, `post`, post, token); 
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message);
                    if(route.params) {
                        route.params.callback(post);
                    }

                    finishOp();
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
        getUser().then(res => setUser(res)); 
        setPost(getpost());
    }, []);

    return (
        <View style={postStyles.container}>
            <View style={[ postStyles.viewRow, postStyles.header ]}>
                <Icon
                    onPress={finishOp} 
                    name='close-outline' 
                    color='gray' 
                    type='ionicon' 
                    size={30}
                />
                <Icon
                    onPress={handlepressIconImage}
                    name='image-outline' 
                    color='gray' 
                    type='ionicon' 
                    size={30}
                />
                <Text style={postStyles.textHeader}>
                    {
                        (route.params)
                        ? 'Edit Post'
                        : 'New post'
                    } 
                </Text>
                <TouchableOpacity
                    style={
                        (route.params) 
                        ? (
                            (post.tittle.length && (post.description.length || post.img != null))
                            && (
                                post.tittle != route.params.post.tittle 
                                || post.img != route.params.post.img
                                || post.description != route.params.post.description
                                || post.connectFlag != route.params.post.connectFlag
                                || post.commentFlag != route.params.post.commentFlag
                            ) 
                        ) 
                        ? postStyles.saveButton
                        : [postStyles.saveButton, { borderColor: 'gray' }]
                        : ((post.tittle.length && (post.description.length || post.img != null)))
                        ? postStyles.saveButton
                        : [postStyles.saveButton, { borderColor: 'gray' }]
                    }
                    disabled={
                        (route.params)
                        ? (post.tittle.length && !loading && (post.description.length || post.img != null)) 
                        && (
                            post.tittle != route.params.post.tittle 
                            || post.img != route.params.post.img
                            || post.description != route.params.post.description
                            || post.connectFlag != route.params.post.connectFlag
                            || post.commentFlag != route.params.post.commentFlag
                        ) 
                        ? false
                        : true
                        : !(post.tittle.length && !loading && (post.description.length || post.img != null)) 
                        ? true 
                        : false
                    }
                    onPress={handleSendbutton}
                    >
                    <Text 
                        style={
                            (route.params) 
                            ? (
                                (post.tittle.length && (post.description.length || post.img != null))
                                && (
                                    post.tittle != route.params.post.tittle 
                                    || post.img != route.params.post.img
                                    || post.description != route.params.post.description
                                    || post.connectFlag != route.params.post.connectFlag
                                    || post.commentFlag != route.params.post.commentFlag
                                )
                            ) 
                            ? postStyles.SaveButtonText 
                            : [postStyles.SaveButtonText, { color: 'gray' }]
                            : ((post.tittle.length && (post.description.length || post.img != null)))
                            ? postStyles.SaveButtonText
                            : [postStyles.SaveButtonText, { color: 'gray' }]
                        }
                        >
                        {
                            (route.params)
                            ? 'Edit'
                            : 'Send' 
                        }
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={postStyles.body}>
                {
                    (loading)
                    ? <View style={postStyles.loadingView}>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                    : <ScrollView>
                        <View style={postStyles.viewRow}>
                            {
                                (user.img == null)
                                ? <Avatar 
                                    rounded
                                    size="medium"
                                    containerStyle={postStyles.avatarContainer}
                                    icon={CAMERA_ICON} 
                                    onPress={() => navigation.navigate('UserProfile')}
                                />
                                : <Avatar 
                                    rounded 
                                    size="medium" 
                                    source={{ uri: `data:image/png;base64,${user.img}` }}
                                    onPress={() => navigation.navigate('UserProfile')}
                                />
                            }
                            <View>
                                <Text style={postStyles.nameText}>
                                    {`${user.name} ${user.lastName}`} 
                                </Text>
                                <View style={postStyles.viewRow}>
                                    <View style={postStyles.button}>
                                        <TouchableWithoutFeedback 
                                            onPress={() => setPost({ ...post, connectFlag: !post.connectFlag }) }
                                            >
                                            <View style={postStyles.viewRow}>
                                                <Text style={postStyles.SaveButtonText}>
                                                    Only connect:
                                                </Text>
                                                <Switch
                                                    onValueChange={() => setPost({ ...post, connectFlag: !post.connectFlag })}
                                                    value={post.connectFlag}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                    <View style={postStyles.button}>
                                        <TouchableWithoutFeedback 
                                            onPress={() => setPost({ ...post, commentFlag: !post.commentFlag })}
                                            >
                                            <View style={postStyles.viewRow}>
                                                <Text style={postStyles.SaveButtonText}>
                                                    Commentary:
                                                </Text>
                                                <Switch
                                                    onValueChange={() => setPost({ ...post, commentFlag: !post.commentFlag })}
                                                    value={post.commentFlag}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    </View>
                                </View>
                            </View>
                        </View> 
                        <TextInput
                            placeholder='Tittle post'  
                            style={postStyles.inputText}
                            onChangeText={text => setPost({ ...post, tittle: text })}
                            onEndEditing={() => refTextIput.focus()} 
                            value={post.tittle}
                        />
                        
                        <TextInput
                            ref={input => refTextIput = input}
                            placeholder='More text'  
                            style={postStyles.inputText}
                            multiline
                            onFocus={() => setDescriptionFlag(true)}
                            onChangeText={text => setPost({ ...post, description: text })}
                            onEndEditing={() => setDescriptionFlag(false)} 
                            value={post.description}
                        /> 
                        {
                            (!descriptionFlag) 
                            ? null 
                            : <TouchableOpacity style={postStyles.TextAreabutton}>
                                <Text style={postStyles.textButton}>
                                    Finish editing
                                </Text>
                            </TouchableOpacity>    
                        } 
                        {
                            (post.img == null)
                            ? null 
                            : <Image
                                onLongPress={deleteImg}
                                source={{ uri: `data:image/png;base64,${post.img}` }}
                                style={{ borderRadius: 10, width: '100%', height: 300, resizeMode: 'contain', marginTop: 10 }}
                            />
                        }         
                    </ScrollView>
                }
            </View> 
        </View>
    )
}

export default Home

const postStyles = StyleSheet.create({
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

    body: {
        flex:1,
        paddingHorizontal: '3%',
        backgroundColor: '#f4f6fc'
    },

    loadingView: {
        alignItems: 'center', 
        justifyContent:'center', 
        flex: 1
    },

    saveButton: {
        padding: '2%',
        paddingVertical: '3%',
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: '5%',
        borderColor: '#3465d9',  
    },

    button: {
        marginLeft: '2%', 
        padding: '2%',
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#3465d9',  
    },

    SaveButtonText: {
        fontWeight: "bold",
        color: '#3465d9',
    },

    avatarContainer: {
        backgroundColor: 'lightgray'
    },

    viewRow: {
        alignItems: "center",
        flexDirection: 'row'
    },

    textHeader: {
        fontSize: 30
    },

    textButton: {
        color: 'white' 
    },

    TextAreabutton: {
        backgroundColor: '#1e90ff', 
        alignItems: 'center', 
        borderRadius: 5, 
        padding: 15, 
        marginTop: 10
    },

    inputText: {
        marginTop: 10, 
        paddingVertical: 10, 
        paddingHorizontal: 5, 
        backgroundColor:'white', 
        borderRadius: 10, 
        color: 'gray'
    },

    nameText: {
        paddingLeft: '2%',
        fontSize: 20,
        fontWeight: 'bold'
    },
});