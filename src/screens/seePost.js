import React, { useState, useEffect } from 'react'; 
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ToastAndroid,
    ActivityIndicator,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon, Avatar, Image, BottomSheet, ListItem } from 'react-native-elements';
import Http from '../components/Http';


const CAMERA_ICON = { 
    name: 'camera-outline', 
    color: 'white', 
    type: 'ionicon', 
    size: 30
}

const NEW_COMMENT_BLANK = {
    text: '', 
    flag: false
}

const SeePost = ({ navigation, route }) => { 
    const [meId, setMeId] = useState(0);
    const [user, setUser] = useState(route.params.user);
    const [post, setPost] = useState(route.params.post);
    const [commentaries, setCommentaries] = useState([]);
    const [newComment, setNewComment] = useState(NEW_COMMENT_BLANK);
    const [bottomSheetFlag, setBottomSheetFlag] = useState(false);


    const bottomSheetItems = [
        { 
            tittle: 'Edit post',
            icon: 'color-palette-outline',
            style: { paddingLeft: 5, color: 'gray' },
            iconColor: 'gray',
            onPress: () => handlePressEdit()
        },
        { 
            tittle: 'Delete post',
            icon: 'trash-outline',
            style: { paddingLeft: 5, color: 'gray' },
            iconColor: 'gray',
            onPress: () => deletePostAlert() 
        },
        { 
            tittle: 'Add reaction',
            icon: 'heart-outline',
            style: { paddingLeft: 5, color: 'gray' },
            iconColor: 'gray',
            onPress: () => console.log('add reaction') 
        },
        {
            tittle: 'Cancel',
            icon: 'close-circle-outline',
            containerStyle: { backgroundColor: 'red' },
            style: { paddingLeft: 5, color: 'white', fontWeight: 'bold' },
            iconColor: 'white',
            onPress: () => setBottomSheetFlag(false),
        },
    ];
    

    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const getMyId = async () => {
        return JSON.parse(await AsyncStorage.getItem('user')).id;
    }

    const handlePressEdit = () => {
        setBottomSheetFlag(false);
        navigation.navigate('Post', { post: post, callback: callback.bind(this) });
    }

    const callback = (post) => {
        setPost(post);
    }

    const deletePostAlert = () => {
        Alert.alert(
            'Waring', 
            `Are you sure delete ${post.tittle}?`,
            [
                { text: "Cancel", style: "cancel" }, 
                { text: "OK", onPress: () => deletePost() }
            ], { cancelable: false }
        );
    }

    const deletePost = async () => {
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('DELETE', `post/${post.id}`, null, token);
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');

        } else { 
            switch(data.typeResponse) {
                case 'Success': 
                    toast(data.message);  
                    if(route.params.callback) { 
                        route.params.callback('delete', post.id);
                    }

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

    const getComments = async () => {
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('GET', `comment/post/${post.id}`, null, token); 
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            return [];

        } else { 
            switch(data.typeResponse) {
                case 'Success': 
                    toast(data.message); 
                    return data.body; 
                    
                case 'Fail':
                    data.body.errors.forEach(element => {
                        toast(element.text);
                    });
                    return [];

                default:
                    Alert.alert(data.typeResponse, data.message);
                    return [];
            }    
        }
    }

    const sendNewComment = async () => {
        setNewComment({ ...newComment, flag: true });
        const token = await AsyncStorage.getItem('token'); 
        const jsonAux =  { text: newComment.text, parentId: null, postId: post.id }; 
        const data = await Http.send('POST', 'comment', jsonAux, token); 
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');

        } else { 
            switch(data.typeResponse) {
                case 'Success': 
                    toast(data.message); 
                    let commentariesAux = commentaries;
                    
                    commentariesAux.unshift(data.body);
                    setCommentaries(commentariesAux);
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

        setNewComment(NEW_COMMENT_BLANK);
    }

    useEffect(() => { 
        getMyId().then(res => setMeId(res));
        getComments().then(res => setCommentaries(res));
    }, []);

    return (
        <View style={seePostStyles.container}>
            <BottomSheet
                isVisible={bottomSheetFlag}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                >
                {
                    bottomSheetItems.map((item, index) => (
                        <ListItem key={index} containerStyle={item.containerStyle} onPress={item.onPress}>
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
            <View style={seePostStyles.body}>  
                <ScrollView>
                    <View style={seePostStyles.viewRow}>
                        {
                            (user.img == null)
                            ? <Avatar 
                                rounded
                                size="medium"
                                containerStyle={{ backgroundColor: 'lightgray' }}
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
                            <Text style={[ seePostStyles.tittleText, { paddingLeft: '2%' } ]}>
                                {user.name} {user.lastName}
                            </Text>
                            <Text style={seePostStyles.text}>
                                {user.email}
                            </Text>
                            <View style={seePostStyles.viewRow}>
                                <Text style={seePostStyles.text}>
                                    {
                                        (post.dateEdit != null)
                                        ? `Last edit: ${post.dateEdit}` 
                                        : post.dateCreation
                                    }       
                                </Text>
                                {
                                    (post.connectFlag)
                                    ? <Icon
                                        style={{ paddingLeft: 5 }}
                                        name='person-circle-outline' 
                                        color='gray' 
                                        type='ionicon' 
                                        size={15}
                                    />
                                    : <Icon
                                        style={{ paddingLeft: 5 }}
                                        name='earth-outline' 
                                        color='gray' 
                                        type='ionicon' 
                                        size={15}
                                    />
                                }
                                {
                                    (post.commentFalg)
                                    ? <Icon
                                        style={{ paddingLeft: 5 }}
                                        name='chatbubble-outline' 
                                        color='gray' 
                                        type='ionicon' 
                                        size={15}
                                    />
                                    : <Icon
                                        style={{ paddingLeft: 5 }}
                                        name='chatbubble-ellipses-outline' 
                                        color='gray' 
                                        type='ionicon' 
                                        size={15}
                                    />
                                } 
                            </View>
                        </View>
                    </View> 
                    <View style={[ seePostStyles.inputText, { backgroundColor: '#f4f6fc' } ]}>
                        <Text style={seePostStyles.tittleText}>
                            {post.tittle}
                        </Text>
                    </View>
                    {
                        (post.description.length == 0)
                        ? null
                        : <View style={seePostStyles.inputText}>
                            <Text>
                                {post.description}
                            </Text>
                        </View>
                    }
                    {
                        (post.img == null)
                        ? null
                        : <Image
                            source={{ uri: `data:image/png;base64,${post.img}` }}
                            style={seePostStyles.image}
                        />
                    }     
                    <View style={[seePostStyles.viewReactions, seePostStyles.topDivider]}>
                        <View style={seePostStyles.viewRow}>
                            <Icon
                                style={{ paddingHorizontal: '3%' }}
                                name='flame-outline' 
                                color='gray' 
                                type='ionicon' 
                                size={15}
                            />
                            <Text>
                                10
                            </Text>
                            <Icon
                                style={{ paddingHorizontal: '3%' }}
                                name='heart-outline' 
                                color='gray' 
                                type='ionicon' 
                                size={15}
                            />
                            <Text>
                                7
                            </Text>
                            <View style={{  marginLeft: '5%', backgroundColor:'white', borderRadius: 100 }}>
                                <Icon
                                    onPress={() => console.log('nueva reacccion')}
                                    name='add-outline' 
                                    color='gray' 
                                    type='ionicon' 
                                    size={20}
                                />
                            </View>
                        </View>
                        {
                            (!post.commentFlag)
                            ? null
                            : <View style={seePostStyles.viewRow}>
                                <Icon
                                    style={{ paddingHorizontal: 5 }}
                                    name='chatbubbles-outline' 
                                    color='gray' 
                                    type='ionicon' 
                                    size={15}
                                />
                                <Text>
                                    15
                                </Text>
                            </View>
                        }
                    </View>  
                    <Text style={[ seePostStyles.tittleText, seePostStyles.commentaryText ]}>
                        Commentary
                    </Text>
                    <View style={seePostStyles.topDivider}>
                        {
                            (!commentaries.length)
                            ? <View style={seePostStyles.viewResponse}>
                                <Text style={[ seePostStyles.tittleText, { color: 'gray' }]}>
                                    {
                                        (!post.commentFlag)
                                        ? 'This post does not allow commentsEste post no tienen'
                                        : 'Be the first to comment!'
                                    } 
                                </Text>
                            </View>
                            : (
                                commentaries.map((item, index) => ( 
                                    <View
                                        key={index} 
                                        style={[seePostStyles.viewRow, { marginVertical: '2%' }]}>
                                        <Avatar 
                                            rounded 
                                            size="medium" 
                                            source={{ uri: `data:image/png;base64,${user.img}` }}
                                            onPress={() => console.log('goto user')}
                                        />
                                        <View>
                                            <View 
                                                style={{
                                                    borderRadius: 10, 
                                                    backgroundColor: 'white', 
                                                    padding: '3%', 
                                                    marginLeft: '2%',
                                                    
                                                }}
                                                >
                                                <View style={[seePostStyles.viewRow, { justifyContent: 'space-between' }]}>
                                                    <Text style={seePostStyles.tittleText}>
                                                        {user.name} {user.lastName}
                                                    </Text>
                                                    <Icon
                                                        onPress={()=> console.log('opciones de comentario')}
                                                        name='ellipsis-vertical' 
                                                        color='gray' 
                                                        type='ionicon' 
                                                        size={15}
                                                    />
                                                </View>
                                                <View style={[seePostStyles.viewRow, { paddingBottom: 10 }]}>
                                                    <Text style={{ color: 'gray' }}>
                                                        { 
                                                            (item.dateEdit != null)
                                                            ? `${item.dateEdit} (edited)`
                                                            : item.dateCreation
                                                        }
                                                    </Text>
                                                    <Icon
                                                        style={{ marginHorizontal: '3%' }}
                                                        name='chatbubbles-outline' 
                                                        color='gray' 
                                                        type='ionicon' 
                                                        size={20}
                                                    />
                                                    <Text style={{ color:'gray' }}>
                                                        7
                                                    </Text>
                                                </View>
                                                <Text style={{ color: 'gray' }}>
                                                    {item.text}
                                                </Text>
                                            </View>  
                                            <View style={seePostStyles.viewReactions}>
                                                <View style={seePostStyles.viewRow}>
                                                    <Icon
                                                        style={{ paddingHorizontal: 5 }}
                                                        name='flame-outline' 
                                                        color='gray' 
                                                        type='ionicon' 
                                                        size={15}
                                                    />
                                                    <Text>
                                                        10
                                                    </Text>
                                                    <Icon
                                                        style={{ paddingHorizontal: 5 }}
                                                        name='heart-outline' 
                                                        color='gray' 
                                                        type='ionicon' 
                                                        size={15}
                                                    />
                                                    <Text>
                                                        7
                                                    </Text>
                                                </View>
                                            </View>  
                                        </View>
                                    </View>
                                ))
                            )
                        }
                    </View>
                </ScrollView>
            </View> 
            <View style={[ seePostStyles.viewRow, seePostStyles.footer ]}>  
                <TextInput
                    placeholder='Write a comment!'  
                    style={seePostStyles.inputComment}
                    multiline
                    onChangeText={text => setNewComment({ ...newComment, text })}
                    value={newComment.text}
                />                       
                <View style={seePostStyles.viewRow}>
                    {
                        (meId != user.id) 
                        ? null
                        : <Icon
                            onPress={() => setBottomSheetFlag(true)}
                            name='ellipsis-vertical' 
                            color='gray' 
                            type='ionicon' 
                            size={30}
                        />    
                    }    
                    <TouchableOpacity
                        style={{ paddingHorizontal: 10 }}
                        disabled={(newComment.text.length && !newComment.flag) ? false : true}
                        onPress={sendNewComment}
                        >
                        {
                            (!newComment.flag) 
                            ? <Text 
                                style={ 
                                    (newComment.text.length)
                                    ? [ seePostStyles.tittleText, { color: '#3465d9' } ]
                                    : [ seePostStyles.tittleText, { color: 'gray' } ]
                                }
                                >
                                Send
                            </Text>
                            : <ActivityIndicator style={{ paddingHorizontal: '3%' }} size="small" color="#00ff00" />
                        }   
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default SeePost

const seePostStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f4f6fc',
    },

    footer: {
        backgroundColor: 'white',
        padding: '2%',
        width:'100%',
        justifyContent: 'space-between',
    },

    body: {
        flex: 1,
        marginTop: 24,
        paddingTop: '2%',
        paddingHorizontal: '3%',
        backgroundColor: '#f4f6fc'
    },

    topDivider: {
        borderTopWidth: 1, 
        borderTopColor: 'lightgray', 
    },

    viewReactions: { 
        justifyContent: 'space-between' , 
        flexDirection: 'row', 
        marginTop: '3%', 
        paddingTop: '3%' 
    },

    image: {
        borderRadius: 10, 
        width: '100%', 
        height: 300, 
        resizeMode: 'contain', 
        marginTop: 10 
    },

    viewRow: {
        alignItems: "center",
        flexDirection: 'row'
    },

    viewResponse: {
        paddingVertical: '3%', 
        alignItems: 'center' 
    },

    tittleText: {
        fontWeight:'bold',
        fontSize: 20
    },

    commentaryText: {
        paddingTop: '3%', 
        color: 'gray'
    },

    inputComment: {
        borderRadius: 5, 
        backgroundColor: 'lightgray', 
        padding: 5, 
        width:'70%' 
    },

    inputText: {
        marginTop: 10, 
        paddingVertical: 10, 
        paddingHorizontal: 5, 
        backgroundColor:'white', 
        borderRadius: 10, 
        color: 'gray'
    },

    text: {
        paddingLeft: 5, 
        color: 'gray' 
    }
});