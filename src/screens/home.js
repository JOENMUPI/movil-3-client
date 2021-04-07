import React, { useState, useEffect } from 'react'; 
import { 
    View, 
    Text, 
    StyleSheet,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Switch,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Icon, Avatar } from 'react-native-elements';


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
    const [me, setMe] = useState(null);
    const [enterprise, setEnterprise] = useState(false);
    const [searchBar, setSearchBar] = useState(false);
    
    getMe = async () => {
        return JSON.parse(await AsyncStorage.getItem('user'));
    }

    useEffect(() => {
        getMe().then(res => {   
            setMe(res);
        }); 
    }, []);

    return (
        <View style={homeStyles.container}>
            <View style={[ homeStyles.viewRow, homeStyles.header ]}>
                {
                    (me == null)
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
                <Text>Home (working..)</Text>  
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

    header: {
        marginTop: 24,
        backgroundColor: 'white',
        padding: '2%',
        width:'100%',
        justifyContent: 'space-between',
    },

    body: {
        paddingTop: 10,
        justifyContent: "center",
        alignItems: "center",
        height: '100%',
        backgroundColor: '#f4f6fc'
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
        backgroundColor: 'lightgray'
    },

    viewRow: {
        alignItems: "center",
        flexDirection: 'row'
    },

    text: {
        color: 'gray'
    }
});