import React, { useState, useEffect } from 'react'; 
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Switch,
    ActivityIndicator,
    ToastAndroid,
    ScrollView,
    RefreshControl,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon, Avatar } from 'react-native-elements';

import Http from '../components/Http';


const TRACK_COLOR = { 
    false: "#767577", 
    true: "#81b0ff" 
}

const CAMERA_ICON = { 
    name: 'camera-outline', 
    color: 'white', 
    type: 'ionicon', 
    size: 20 
}

const Home = ({ navigation, route }) => { 
    const [me, setMe] = useState({ img: null });
    const [enterprise, setEnterprise] = useState(false);
    const [posts, setPosts] = useState([]);
    const [searchBar, setSearchBar] = useState(false);
    const [loading, setLoading] = useState({ loading: false, first: true });

    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const dataForSeePost = (post) => {
        return {
            user: {
                email: post.userEmail,
                name: post.userName,
                lastName: post.userLastName,
                id: post.userId,
                img: post.userImg
            },

            post: {
                id: post.id,
                tittle: post.tittle,
                description: post.description,
                img: post.img,
                dateCreation: post.dateCreation,
                dateEdit: post.dateEdit,
                connectFlag: post.connectFlag,
                commentFlag: post.commentFlag,
                comentaries: post.comentaries,
                reactions: post.reactions
            }
        }
    }
    
    getMe = async () => {
        return JSON.parse(await AsyncStorage.getItem('user'));
    }

    const getPost = async () => { 
        setLoading({ ...loading, loading: true });
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('GET', 'post', null, token); 
        
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

    const sendReaction = async (reaction, post) => { 
        const token = await AsyncStorage.getItem('token'); 
        let data; 

        (reaction.me)
        ? data = await Http.send('POST', 'reaction/post', { postId: post.id, reactionId: reaction.id }, token)
        : data = await Http.send('DELETE', `reaction/post/${post.id}/${reaction.id}`, null, token);

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

    const handleReaction = (reactionId, post) => { 
        const reactionsAux = post.reactions.map(reaction => { 
            let aux = reaction;
            
            if(reaction.id ==  reactionId) {   
                aux.me = !reaction.me;
                (aux.me)  
                ? aux = { ...aux, num: aux.num + 1 }
                : aux = { ...aux, num: aux.num - 1 }

                sendReaction(aux, post);
            }
                
            return aux;
        });

        const postsAux = posts.map(item => {
            if(item.id == post.id) {
                return { ...post, reactions: reactionsAux }
            }

            return item;
        });

        setPosts(postsAux)
    }

    const PostItemC = ({ post }) => (
        <View style={homeStyles.postView}>
            <View style={homeStyles.viewRow}>
                {
                    (post.userImg == null)
                    ? <Avatar 
                        rounded
                        size="medium"
                        containerStyle={{ backgroundColor: 'lightgray' }}
                        icon={CAMERA_ICON}
                        onPress={() => navigation.navigate('UserProfile', { userId: post.userId })} 
                    />
                    : <Avatar 
                        rounded 
                        size="medium" 
                        source={{ uri: `data:image/png;base64,${post.userImg}` }}
                        onPress={() => navigation.navigate('UserProfile', { userId: post.userId })}
                    />
                }
                <TouchableWithoutFeedback 
                    onPress={() => navigation.navigate('SeePost', dataForSeePost(post))}
                    >
                    <View style={{ paddingLeft: '2%' }}>
                        <Text style={[ homeStyles.tittlePost, homeStyles.text ]}>
                            {post.userName} {post.userLastName}
                        </Text>
                        <Text style={homeStyles.tittlePost}>
                            {post.tittle}
                        </Text>
                        <View style={homeStyles.viewRow}>
                            <Text style={homeStyles.text}>
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
                                ? <View style={homeStyles.viewRow}> 
                                    <Icon
                                        style={{ paddingLeft: 5 }}
                                        name='chatbubble-ellipses-outline' 
                                        color='gray' 
                                        type='ionicon' 
                                        size={15}
                                    />
                                    <Text style={[ homeStyles.text, { paddingLeft: '1%' } ]}>
                                        {post.comentaries}
                                    </Text>
                                </View>
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
                </TouchableWithoutFeedback>
            </View>
            <TouchableWithoutFeedback
                onPress={() => navigation.navigate('SeePost', dataForSeePost(post))}
                >
                <View style={{ marginVertical: '5%' }}>
                    <Text style={homeStyles.text}>
                        {post.description}
                    </Text>
                    {
                        (post.img == null)
                        ? null
                        : <Image
                            source={{ uri: `data:image/png;base64,${post.img}` }}
                            style={homeStyles.image}
                        /> 
                    }
                </View>
            </TouchableWithoutFeedback>
            <View style={homeStyles.viewRow}>
                {
                    post.reactions.map((item, index) => (
                        !(item.num > 0)
                        ? null
                        : <TouchableOpacity 
                            onPress={() => handleReaction(item.id, post)}
                            style={homeStyles.viewRow}
                            key={index}
                            >
                            <Icon
                                name={item.description} 
                                color={(item.me) ? '#3465d9' : 'gray'}
                                type='ionicon' 
                                size={15}
                            />
                            <Text style={(item.me) ? { color: '#3465d9' } : { color: 'gray' }}>
                                {item.num}
                            </Text>
                        </TouchableOpacity>
                    )) 
                }
            </View>
        </View>
    ) 

    const refresh =() => {
        getPost().then(res => { 
            setPosts(res);
            setLoading({ first: false, loading: false });
        });
    }

    useEffect(() => {  
        getMe().then(res => setMe(res)); 
        refresh();
    }, []);

    return (
        <View style={homeStyles.container}>
            <View style={[ homeStyles.viewRow, homeStyles.header ]}>
                {
                    (me.img == null)
                    ? <Avatar 
                        rounded
                        size="small"
                        containerStyle={homeStyles.avatarContainer}
                        icon={CAMERA_ICON} 
                        onPress={() => navigation.navigate('UserProfile', { userId: me.id })}
                    />
                    : <Avatar 
                        rounded 
                        size="small" 
                        source={{ uri: `data:image/png;base64,${me.img}` }}
                        onPress={() => navigation.navigate('UserProfile', { userId: me.id })}
                    />
                }
                <TouchableOpacity
                    style={[ homeStyles.ViewSearchBar, homeStyles.viewRow ]}
                    onPress={() => setSearchBar(true)}
                    >
                    <Text style={homeStyles.text}>
                        Search
                    </Text>
                    <Icon name='search-outline' color='gray' type='ionicon' size={20}/>
                </TouchableOpacity>
                <TouchableWithoutFeedback onPress={() => setEnterprise(!enterprise)} >
                    <View style={homeStyles.viewRow}>
                        <Text style={homeStyles.text}>
                            Mode enterprise: 
                        </Text>
                        <Switch
                            thumbColor={enterprise ? "darkcyan" : "#f4f3f4"}
                            trackColor={TRACK_COLOR}
                            onValueChange={() => setEnterprise(!enterprise)}
                            value={enterprise}
                        />
                    </View>
                </TouchableWithoutFeedback>
            </View>
            <View style={homeStyles.body}>
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
                        >
                        { 
                            posts.map((post, index) => (   
                                <PostItemC
                                    key={index}
                                    post={post}
                                />
                            ))
                        }
                    </ScrollView>
                }  
            </View>      
        </View>
    )
}

export default Home

const homeStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },

    postView: {
        marginTop: '3%', 
        padding: '2%', 
        borderRadius: 10, 
        backgroundColor: 'white'
    },  

    viewImg: {
        justifyContent:'center', 
        alignItems: 'center'
    },

    header: {
        marginTop: 24,
        backgroundColor: 'white',
        padding: '2%',
        width:'100%',
        justifyContent: 'space-between',
    },

    body: {
        flex: 1,
        paddingHorizontal: '3%',
        justifyContent: "center",
        backgroundColor: '#f4f6fc'
    },

    image: {
        borderRadius: 10, 
        width: '100%', 
        height: 300, 
        resizeMode: 'contain', 
        marginTop: 10 
    },

    ViewSearchBar: {
        backgroundColor: 'lightgray', 
        height: '100%', 
        width: '40%', 
        borderRadius: 5, 
        paddingHorizontal: '2%',
        justifyContent: 'space-between'
    },

    avatarContainer: {
        backgroundColor: 'lightgray',
    },

    viewRow: {
        alignItems: "center",
        flexDirection: 'row'
    },

    tittlePost: {
        fontSize: 20,
        fontWeight: 'bold'
    },

    text: {
        color: 'gray'
    }
});