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
    RefreshControl,
    Modal,
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
    flag: false,
    type: ''
}

const MODAL_BLANK = { 
    flag: false, 
    commentFlag: false 
}

const SeePost = ({ navigation, route }) => {   
    const [meId, setMeId] = useState(0);
    const [user, setUser] = useState(route.params.user);
    const [post, setPost] = useState(route.params.post);
    const [commentaryFocus, setCommentaryFocus] = useState({});
    const [newComment, setNewComment] = useState(NEW_COMMENT_BLANK);
    const [commentaries, setCommentaries] = useState({ flag: false, data: [] });
    const [bottomSheetFlag, setBottomSheetFlag] = useState({ type: '', flag: false });
    const [modal, setModal] = useState(MODAL_BLANK); 
    const [loading, setLoading] = useState(false);

    let commentInput = '';

    const bottomSheetItemsOptionsPost = [
        { 
            tittle: 'Edit post',
            icon: 'color-palette-outline',
            style: { paddingLeft: 5, color: 'gray' },
            iconColor: 'gray',
            onPress: () => handlePressEditPost()
        },
        { 
            tittle: 'Delete post',
            icon: 'trash-outline',
            style: { paddingLeft: 5, color: 'gray' },
            iconColor: 'gray',
            onPress: () => deletePostAlert() 
        },
        {
            tittle: 'Cancel',
            icon: 'close-circle-outline',
            containerStyle: { backgroundColor: 'red' },
            style: { paddingLeft: 5, color: 'white', fontWeight: 'bold' },
            iconColor: 'white',
            onPress: () => setBottomSheetFlag({ ...bottomSheetFlag, flag: false }),
        },
    ];

    const bottomSheetItemsOptionComment = [
        { 
            tittle: 'Edit comment',
            icon: 'color-palette-outline',
            style: { paddingLeft: 5, color: 'gray' },
            iconColor: 'gray',
            onPress: () => handleEditComment()
        },
        { 
            tittle: 'Delete comment',
            icon: 'trash-outline',
            style: { paddingLeft: 5, color: 'gray' },
            iconColor: 'gray',
            onPress: () => deleteCommentAlert()
        },
        {
            tittle: 'Cancel',
            icon: 'close-circle-outline',
            containerStyle: { backgroundColor: 'red' },
            style: { paddingLeft: 5, color: 'white', fontWeight: 'bold' },
            iconColor: 'white',
            onPress: () => setBottomSheetFlag({ ...bottomSheetFlag, flag: false }),
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

    const handlePressEditPost = () => {
        setBottomSheetFlag({ ...bottomSheetFlag, flag: false })
        navigation.navigate('Post', { post: post, callback: callback.bind(this) });
    }

    const handleOptionComment = (item) => {
        setCommentaryFocus(item); 
        setBottomSheetFlag({ type: 'comment', flag: true });
    }

    const handleEditComment = () => {
        setBottomSheetFlag({ ...bottomSheetFlag, flag: false });
        setNewComment({ ...newComment, text: commentaryFocus.text, type: 'edit' });
        commentInput.focus();
    }

    const cancelEdit = () => {
        if(newComment.type == 'edit') {
            toast('Edit canceled');
            setNewComment(NEW_COMMENT_BLANK);
        }
    }

    const callback = (post) => {
        setPost(post);
    }

    const deletePostAlert = () => {
        setBottomSheetFlag({ bottomSheetFlag, flag: false });
        Alert.alert(
            'Waring', 
            `Are you sure delete ${post.tittle}?`,
            [
                { text: "Cancel", style: "cancel" }, 
                { text: "OK", onPress: () => deletePost() }
            ], { cancelable: false }
        );
    }

    const deleteCommentAlert = () => { 
        setBottomSheetFlag({ ...bottomSheetFlag, flag: false });
        Alert.alert(
            'Waring', 
            'Are you sure delete this comment?',
            [
                { text: "Cancel", style: "cancel" }, 
                { text: "OK", onPress: () => deleteComment() }
            ], { cancelable: false }
        );
    }

    const handleReaction = (reactionId) => { 
        const reactionsAux = post.reactions.map(reaction => { 
            let aux = reaction;
            
            if(reaction.id ==  reactionId) {   
                aux.me = !reaction.me;
                (aux.me)  
                ? aux = { ...aux, num: aux.num + 1 }
                : aux = { ...aux, num: aux.num - 1 }

                sendReaction(aux, 'post', null);
            }
                
            return aux;
        });

        setModal(MODAL_BLANK);
        setPost({ ...post, reactions: reactionsAux });
    }

    const handleCommentReaction = (reactionId, comment) => {  
        const reactionsAux = comment.reactions.map(reaction => { 
            let aux = reaction;
            
            if(reaction.id ==  reactionId) {   
                aux.me = !reaction.me;
                (aux.me)  
                ? aux = { ...aux, num: aux.num + 1 }
                : aux = { ...aux, num: aux.num - 1 }

                sendReaction(aux, 'comment', comment); 
            }
                
            return aux;
        });

        const commentariesAux = commentaries.data.map(item => {
            if(item.id == comment.id) { 
                return { ...comment, reactions: reactionsAux }
            }

            return item;
        });

        setModal(MODAL_BLANK);
        setCommentaries({ ...commentaries, data: commentariesAux});
    }

    const pressIconModal = (item) => {
        (modal.commentFlag)
        ? handleCommentReaction(item.id, commentaryFocus)
        : handleReaction(item.id);
    }

    const pressAddIconComment = (item) => {
        setCommentaryFocus(item);
        setModal({ flag: true, commentFlag: true });
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
        setCommentaries({ ...commentaries, flag: true });
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('GET', `comment/post/${post.id}`, null, token); 
        let res =  { flag: false, data: [] }

        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            return res;

        } else { 
            switch(data.typeResponse) {
                case 'Success': 
                    toast(data.message); 
                    res.data = data.body;
                    return res; 
                    
                case 'Fail':
                    data.body.errors.forEach(element => {
                        toast(element.text);
                    });
                    return res;

                default:
                    Alert.alert(data.typeResponse, data.message);
                    return res;
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
                    const  me = JSON.parse(await AsyncStorage.getItem('user'));
                    let commentariesAux = commentaries.data;
                    
                    commentariesAux.unshift({ 
                        ...data.body, 
                        userId: me.id, 
                        name: me.name,
                        lastName: me.lastName,
                        img: me.img
                    }); 

                    setPost({ ... post, commentaries: commentariesAux.length });
                    setCommentaries({ ...commentaries, data: commentariesAux });
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

    const deleteComment = async () => {
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('DELETE', `comment/${commentaryFocus.id}`, null, token);
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');

        } else { 
            switch(data.typeResponse) {
                case 'Success': 
                    toast(data.message);  
                    let commentariesAux = commentaries.data.filter(i => i.id != commentaryFocus.id);

                    setPost({ ... post, commentaries: commentariesAux.length });
                    setCommentaries({ ...commentaries, data: commentariesAux });
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

    const sendReaction = async (reaction, type, comment) => { 
        const token = await AsyncStorage.getItem('token'); 
        let data; 

        if(type == 'post') {
            (reaction.me)
            ? data = await Http.send('POST', 'reaction/post', { postId: post.id, reactionId: reaction.id }, token)
            : data = await Http.send('DELETE', `reaction/post/${post.id}/${reaction.id}`, null, token);
        
        } else {
            (reaction.me)
            ? data = await Http.send('POST', 'reaction/comment', { commentId: comment.id, reactionId: reaction.id }, token)
            : data = await Http.send('DELETE', `reaction/comment/${comment.id}/${reaction.id}`, null, token);
        }

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
    }

    const sendEditComment = async () => { 
        setNewComment({ ...newComment, flag: true });
        const token = await AsyncStorage.getItem('token'); 
        const commentAux = { ...commentaryFocus, text: newComment.text }
        const data = await Http.send('PUT', 'comment', commentAux, token);
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');

        } else {  
            switch(data.typeResponse) {
                case 'Success': 
                    toast(data.message);  
                    const commentariesAux = commentaries.data.map(item => {
                        if(item.id == commentAux.id) {
                            return commentAux;
                        }   
                        
                        return item;
                    });
        
                    setCommentaries({ ...commentaries, data: commentariesAux });
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

    const refresh = () => {
        if(post.commentFlag) {
            setLoading(true);
            getComments().then(res => { 
                setPost({ ... post, commentaries: res.data.length });
                setCommentaries(res);
                setLoading(false);
            });
        }
    }

    useEffect(() => { 
        getMyId().then(res => setMeId(res));
        refresh();
    }, []);


    return (
        <View style={seePostStyles.container}>
            <Modal
                animationType="slide"
                transparent
                visible={modal.flag}
                onRequestClose={() => setModal(MODAL_BLANK)}
                >
                <View style={seePostStyles.constainerModal}>
                    <View style={seePostStyles.modal}>
                        <Text style={[ seePostStyles.tittleText, { color: 'gray' } ]}>
                            Select a icon!
                        </Text>
                        <ScrollView>
                            {
                                post.reactions.map((item, index) => (        
                                    <Icon
                                        onPress={() => pressIconModal(item)}
                                        key={index}
                                        name={item.description}
                                        color='gray' 
                                        type='ionicon' 
                                        size={30}
                                    />
                                ))
                            }
                        </ScrollView>
                    </View>
                </View>
            </Modal>
            <BottomSheet
                isVisible={bottomSheetFlag.flag}
                containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
                >
                {
                    (bottomSheetFlag.type == 'post') 
                    ? bottomSheetItemsOptionsPost.map((item, index) => (
                        <BottomSheetItemC
                            key={index}
                            item={item}
                        />
                    ))
                    : bottomSheetItemsOptionComment.map((item, index) => (
                        <BottomSheetItemC
                            key={index}
                            item={item}
                        /> 
                    )) 
                }
            </BottomSheet>
            <ScrollView
                contentContainerStyle={seePostStyles.body}
                refreshControl={
                    <RefreshControl
                        refreshing={loading}
                        onRefresh={refresh}
                    />
                }
                >
                <View style={seePostStyles.viewRow}>
                    {
                        (user.img == null)
                        ? <Avatar 
                            rounded
                            size="medium"
                            containerStyle={{ backgroundColor: 'lightgray' }}
                            icon={CAMERA_ICON} 
                            onPress={() => navigation.navigate('UserProfile', { userId: user.id })}
                        />
                        : <Avatar 
                            rounded 
                            size="medium" 
                            source={{ uri: `data:image/png;base64,${user.img}` }}
                            onPress={() => navigation.navigate('UserProfile', { userId: user.id } )}
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
                                (post.commentFlag)
                                ? <Icon
                                    style={{ paddingLeft: 5 }}
                                    name='chatbubble-ellipses-outline' 
                                    color='gray' 
                                    type='ionicon' 
                                    size={15}
                                />
                                : <Icon
                                    style={{ paddingLeft: 5 }}
                                    name='chatbubble-outline' 
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
                        <View style={seePostStyles.addIconView}>
                            <Icon
                                onPress={() => setModal({ flag: true, commentFlag: false })}
                                name='add-outline' 
                                color='gray' 
                                type='ionicon' 
                                size={20}
                            />
                        </View>
                        {
                            (!post)
                            ? null
                            : post.reactions.map((item, index) => (
                                !(item.num > 0)
                                ? null
                                : <TouchableOpacity 
                                    onPress={() => handleReaction(item.id)}
                                    style={[seePostStyles.viewRow, { marginLeft: 10 }]}
                                    key={index}
                                    >
                                    <Icon
                                        name={item.description} 
                                        color={ (item.me) ? '#3465d9' : 'gray' } 
                                        type='ionicon' 
                                        size={15}
                                    />
                                    <Text style={ (item.me) ? { color: '#3465d9' } : { color: 'gray' } }>
                                        {item.num}
                                    </Text>
                                </TouchableOpacity>
                            )) 
                        }
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
                                {post.commentaries}
                            </Text>
                        </View>
                    }
                </View>  
                <Text style={[ seePostStyles.tittleText, seePostStyles.commentaryText ]}>
                    Commentary
                </Text>
                <View style={seePostStyles.topDivider}>
                    {
                        (commentaries.flag) 
                        ? <ActivityIndicator size="large" color="#00ff00" />
                        : (!commentaries.data.length)
                        ? <View style={seePostStyles.viewResponse}>
                            <Text style={[ seePostStyles.tittleText, { color: 'gray' }]}>
                                {
                                    (!post.commentFlag)
                                    ? 'This post does not allow comments'
                                    : 'Be the first to comment!'
                                } 
                            </Text>
                        </View>
                        : (
                            commentaries.data.map((item, index) => ( 
                                <View
                                    key={index} 
                                    style={[seePostStyles.viewRow, { marginVertical: '2%' }]}
                                    >
                                    {
                                        (item.img == null)
                                        ? <Avatar 
                                            rounded
                                            size="medium"
                                            containerStyle={{ backgroundColor: 'lightgray' }}
                                            icon={CAMERA_ICON} 
                                            onPress={() => navigation.navigate('UserProfile', { userId: item.userId })}
                                        />
                                        : <Avatar 
                                            rounded 
                                            size="medium" 
                                            source={{ uri: `data:image/png;base64,${item.img}` }}
                                            onPress={() => navigation.navigate('UserProfile', { userId: item.userId })}
                                        />
                                    }
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
                                                    {item.name} {item.lastName}
                                                </Text>
                                                {
                                                    (meId == item.userId)
                                                    ? <Icon
                                                        onPress={() => handleOptionComment(item)}
                                                        name='ellipsis-vertical' 
                                                        color='gray' 
                                                        type='ionicon' 
                                                        size={15}
                                                    />
                                                    : <Icon
                                                        onPress={()=> console.log('respuesta')}
                                                        name='chatbubble-ellipses-outline' 
                                                        color='gray' 
                                                        type='ionicon' 
                                                        size={15}
                                                    />   
                                                }
                                            </View>
                                            <View style={[seePostStyles.viewRow, { paddingBottom: 10 }]}>
                                                <Text style={{ color: 'gray' }}>
                                                    { 
                                                        (item.dateEdit != null)
                                                        ? `${item.dateEdit} (edited)`
                                                        : item.dateCreation
                                                    }
                                                </Text>
                                                {
                                                    (item.responses == 0)
                                                    ? null
                                                    : <View style={seePostStyles.viewRow}>
                                                        <Icon
                                                            style={{ marginHorizontal: '3%' }}
                                                            name='chatbubbles-outline' 
                                                            color='gray' 
                                                            type='ionicon' 
                                                            size={20}
                                                        />
                                                        <Text style={{ color:'gray' }}>
                                                            {item.responses}
                                                        </Text>
                                                    </View>
                                                }
                                            </View>
                                            <Text style={{ color: 'gray' }}>
                                                {item.text}
                                            </Text>
                                        </View>  
                                        <View style={seePostStyles.viewReactions}>
                                            <View style={seePostStyles.viewRow}>
                                                <View style={seePostStyles.addIconView}>
                                                    <Icon
                                                        onPress={() => pressAddIconComment(item)}
                                                        name='add-outline' 
                                                        color='gray' 
                                                        type='ionicon' 
                                                        size={20}
                                                    />
                                                </View> 
                                                {
                                                    item.reactions.map((rea, index) => (
                                                        !(rea.num > 0)
                                                        ? null
                                                        : <TouchableOpacity 
                                                            onPress={() => handleCommentReaction(rea.id, item)}
                                                            style={[seePostStyles.viewRow, { marginLeft: 10 }]}
                                                            key={index}
                                                            >
                                                            <Icon
                                                                name={rea.description} 
                                                                color={ (rea.me) ? '#3465d9' : 'gray' } 
                                                                type='ionicon' 
                                                                size={15}
                                                            />
                                                            <Text style={ (rea.me) ? { color: '#3465d9' } : { color: 'gray' } }>
                                                                {rea.num}
                                                            </Text>
                                                        </TouchableOpacity>
                                                    )) 
                                                }
                                            </View>
                                        </View>    
                                    </View>
                                </View>
                            ))
                        )
                    }
                </View>
            </ScrollView>
            <View style={[ seePostStyles.viewRow, seePostStyles.footer ]}>  
                <TextInput
                    ref={input => commentInput = input}
                    placeholder='Write a comment!'  
                    style={seePostStyles.inputComment}
                    editable={post.commentFlag}
                    multiline 
                    onChangeText={text => setNewComment({ ...newComment, text })}
                    onEndEditing={cancelEdit}
                    value={newComment.text}
                />                       
                <View style={seePostStyles.viewRow}>
                    {
                        (meId != user.id) 
                        ? null
                        : <Icon
                            onPress={() => setBottomSheetFlag({ type: 'post', flag: true })}
                            name='ellipsis-vertical' 
                            color='gray' 
                            type='ionicon' 
                            size={30}
                        />  
                    }    
                    <TouchableOpacity
                        style={{ paddingHorizontal: 10 }}
                        disabled={
                            (newComment.type == 'edit')
                            ? (newComment.text.length && newComment.text != commentaryFocus.text && !newComment.flag)
                            ? false
                            : true
                            : (newComment.text.length && !newComment.flag) 
                            ? false 
                            : true
                        }
                        onPress={
                            (newComment.type == 'edit')
                            ? sendEditComment
                            : sendNewComment
                        }
                        >
                        {
                            (!newComment.flag) 
                            ? <Text 
                                style={ 
                                    (newComment.type == 'edit')
                                    ? (newComment.text.length && newComment.text != commentaryFocus.text)
                                    ? [ seePostStyles.tittleText, { color: '#3465d9' } ]
                                    : [ seePostStyles.tittleText, { color: 'gray' } ]
                                    : (newComment.text.length)
                                    ? [ seePostStyles.tittleText, { color: '#3465d9' } ]
                                    : [ seePostStyles.tittleText, { color: 'gray' } ]
                                }
                                >
                                {
                                    (newComment.type == 'edit' && newComment.text.length)
                                    ? 'Edit'
                                    : 'Send'
                                }
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

    addIconView: {
        marginLeft: '5%', 
        backgroundColor:'white', 
        borderRadius: 100 
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
    },

    constainerModal: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    modal: {
        margin: '10%',
        backgroundColor: "white",
        borderRadius: 10,
        padding: '10%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    }
});