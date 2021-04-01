import React, { useState, useEffect } from 'react'; 
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    ToastAndroid,
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

const SeePost = ({ navigation, route }) => { 
    const [meId, setMeId] = useState(0);
    const [user, setUser] = useState(route.params.user);
    const [post, setPost] = useState(route.params.post);
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

    useEffect(() => { 
        getMyId().then(res => setMeId(res));
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
                                containerStyle={seePostStyles.avatarContainer}
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
                            <Text style={seePostStyles.nameText}>
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
                        {
                            (false)
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
                </ScrollView>
            </View> 
            <View style={[ seePostStyles.viewRow, seePostStyles.footer ]}>
                <TextInput
                    placeholder='Write a comment!'  
                    style={seePostStyles.inputComment}
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
                        disabled={ //modificar
                            !(post.tittle.length && (post.description.length || post.img != null))
                            ? true 
                            : false
                        }
                        onPress={() => console.log('sendCommentary')}
                        >
                        <Text 
                            style={ //modificar
                                (post.tittle.length && (post.description.length || post.img != null))
                                ? { color:'#3465d9', fontSize: 20 }
                                : [seePostStyles.SaveButtonText, { color: 'gray', fontSize: 20, paddingLeft: 5 }]
                            }
                            >
                            Send
                        </Text>
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

    SaveButtonText: {
        fontWeight: "bold",
        color: '#3465d9',
    },

    avatarContainer: {
        backgroundColor: 'lightgray'
    },

    viewReactions: { 
        justifyContent: 'space-between' , 
        flexDirection: 'row', 
        borderTopWidth: 1, 
        borderTopColor: 'lightgray', 
        marginTop: 10, 
        paddingTop: 10 
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

    tittleText: {
        fontWeight:'bold',
        fontSize: 20
    },

    inputComment:{
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

    nameText: {
        paddingLeft: '2%',
        fontSize: 20,
        fontWeight: 'bold'
    },

    text: {
        paddingLeft: 5, 
        color: 'gray' 
    }
});