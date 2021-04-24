import React, { useState, useEffect } from 'react'; 
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Switch,
    ActivityIndicator,
    Alert,
    ToastAndroid,
    ScrollView,
    RefreshControl,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon, Avatar } from 'react-native-elements';

import Http from '../components/Http';
import SearchBar from '../components/SearchBar2';




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
    const [offers, setOffers] = useState([]);
    const [search, setSearch] = useState({ data: [], flag: false });
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

    const searchData = async (value) => {
        setSearch({ ...search, flag: true });
        const token = await AsyncStorage.getItem('token'); 
        let data;
        let aux = [];
        
        (enterprise)
        ? data = await Http.send('GET', `enterprise/search/${value}`, null, token)
        : data = await Http.send('GET', `user/search/${value}`, null, token);
        
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

        setSearch({ data: aux, flag: false });
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

    const getOffers = async () => { 
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('GET', 'offer', null, token); 
        
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');

        } else { 
            switch(data.typeResponse) {
                case 'Success': 
                    toast(data.message); 
                    setOffers(data.body); 
                    
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

    const selectItem = (item) => {
        (enterprise)
        ? navigation.navigate('SeeEnterprise', { enterpriseId: item.id })
        : navigation.navigate('UserProfile', { userId: item.id });
        
        setSearchBar(false);
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => selectItem(item)}
            style={homeStyles.inputText}
            >
            <View style={homeStyles.viewRow}>
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
                        source={{ uri: `data:image/png;base64,${item.img}` }}
                    />
                }
                <View style={homeStyles.viewTittleItem}>
                    <Text style={homeStyles.tittleItem}>
                        {
                            (enterprise)
                            ? item.name
                            : `${item.name} ${item.lastName}`
                        }
                    </Text>
                    <Text style={{ color: "gray" }}>
                        {item.description}
                    </Text>    
                </View>
            </View>
        </TouchableOpacity>
    )

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
                        <Text style={[ homeStyles.tittlePost, { color: 'gray' } ]}>
                            {post.userName} {post.userLastName}
                        </Text>
                        <Text style={homeStyles.tittlePost}>
                            {post.tittle}
                        </Text>
                        <View style={homeStyles.viewRow}>
                            <Text style={{ color: 'gray' }}>
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
                                    <Text style={{ color: 'gray', paddingLeft: '1%' }}>
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
                    <Text style={{ color: 'gray' }}>
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

    const OfferItemC = ({ post }) => (
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
                        <Text style={[ homeStyles.tittlePost, { color: 'gray' } ]}>
                            {post.userName} {post.userLastName}
                        </Text>
                        <Text style={homeStyles.tittlePost}>
                            {post.tittle}
                        </Text>
                        <View style={homeStyles.viewRow}>
                            <Text style={{ color: 'gray' }}>
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
                                    <Text style={{ color: 'gray', paddingLeft: '1%' }}>
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
                    <Text style={{ color: 'gray' }}>
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
        </View>
    ) 

    const refresh =() => {
        getPost().then(res => { 
            setPosts(res);
            setLoading({ first: false, loading: false });
            getOffers();
        });
    }

    useEffect(() => {  
        getMe().then(res => setMe(res)); 
        refresh();
    }, []);

    return (
        <View style={homeStyles.container}>
            <SearchBar
                arrayData={search.data}
                vissible={searchBar}
                loadingFlag={search.flag}
                onCancel={() => setSearchBar(false)}
                renderItem={renderItem}
                searchF={value => searchData(value)}
            />
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
                    <Text style={{ color: 'gray' }}>
                        Search
                    </Text>
                    <Icon name='search-outline' color='gray' type='ionicon' size={20}/>
                </TouchableOpacity>
                <TouchableWithoutFeedback onPress={() => setEnterprise(!enterprise)} >
                    <View style={homeStyles.viewRow}>
                        <Text style={{ color: 'gray' }}>
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
                            (enterprise)
                            ? offers.map((offer, index) => (
                                <View>{/*<PostItemC
                                    key={index}
                                    post={offer}
                                />*/}</View>
                            ))
                            : posts.map((post, index) => (   
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

    viewTittleItem: {
        paddingLeft: 5, 
        flex: 1
    },

    tittleItem: {
        fontWeight: "bold", 
        color: "gray", 
        fontSize: 20
    },

    inputText: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        color: 'gray'
    },
});