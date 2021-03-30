import React, { useState, useEffect } from 'react'; 
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView,
    Alert,
    StyleSheet,
    ToastAndroid,
    ActivityIndicator
} from 'react-native';

import { Icon, ListItem, Avatar } from 'react-native-elements';
import AsyncStorage from '@react-native-community/async-storage';

import Http from '../components/Http';

const ACTIVITIES_BASE = [
    {
        id: 4,
        tittle: 'Tittle',
        description: 'description',
        img: 'images',
        reactions: [ { type: 'happy-outline', num: 10 }, { type: 'at-outline', num: 5 } ]
    }, 
    {
        id: 5,
        tittle: 'Tittle2',
        description: 'description2',
        img: 'images2',
        reactions: [ { type: 'at-outline', num: 10 }, { type: 'eye-outline', num: 5 } ]
    },
    {
        id: 6,
        tittle: 'Tittle3',
        description: 'description3',
        img: 'images3',
        reactions: [ { type: 'finger-print-outline', num: 10 }, { type: 'at-outline', num: 5 } ]
    }
]

const EXPERIENCE_BASE = [
    {
        id: 4,
        job: 'job',
        enterprise: 'enterprise',
        typeJob: 'full', 
        dateInit: '2017',
        dateEnd: '2020',
        img: 'images-enterprise',
    },
    {
        id: 1,
        job: 'job2',
        enterprise: 'enterprise2',
        typeJob: 'half time', 
        dateInit: '2020',
        dateEnd: null,
        img: 'images-enterprise',
    }, 
    {
        id: 2,
        job: 'job3',
        enterprise: 'enterprise3',
        typeJob: 'half time', 
        dateInit: '2015',
        dateEnd: '2016',
        img: 'images-enterprise',
    }, 
]

const QUALIFICATION_BASE = [
    {   
        qualification: 'Engeneer',
        university: 'Universidad Rafael Urdaneta',
        dateInit: '2017',
        dateEnd: '2020',
        img: 'images-university',
    },
    {
        qualification: 'Psicology',
        university: 'Universidad Rafael Urdaneta',
        dateInit: '2020',
        dateEnd: null,
        img: 'images-university',
    },
]


const IDIOMS_BASE = [
    { id: 1, name: 'Spanish', lvl: 'basic' },
    { id: 2, name: 'English', lvl: 'native' },
    { id: 3, name: 'French', lvl: 'basic' },
]

const AWARDS_BASE = [
    { description: 'Award 1', date: '2020' },
    { description: 'Award 2',   date: '2017' },
    { description: 'Award 3', date: '2015' },
]

const SKILLS_BASE = [
    { description: 'Skill 1' },
    { description: 'Skill 2' },
    { description: 'Skill 3' },
]

const USER_BASE = {
    img: null,
    name: 'name',
    lastName: 'LastName',
    email: 'email@gmail.com',
    country: 'venezuela',
    skills: null,
    awards: null,
    idioms: [],
    qualifications: [],
    experiences: [],
    activities: []
}

const UserProfile = ({ navigation, route }) => { 
    const [user, setUser] = useState(USER_BASE);
    const [loading, setLoading] = useState(false);

    const toast = (message) => { 
        ToastAndroid.showWithGravity(
            message,
            ToastAndroid.SHORT,
            ToastAndroid.TOP
        );
    }

    const getUser = async () => {   
        setLoading(true);
        const id = route.params.userId;
        const token = await AsyncStorage.getItem('token'); 
        const data = await Http.send('Get', `user/${id}`, null, token);
    
        if(!data) {
            Alert.alert('Fatal Error', 'No data from server...');
            
        } else { 
            switch(data.typeResponse) {
                case 'Success':
                    toast(data.message);
                    let userAux
                    
                    (route.params.userId != 'me')
                    ? userAux = data.body
                    : userAux = { 
                        ...JSON.parse(await AsyncStorage.getItem('user'))

                    }
                    
                    return test(userAux);

                case 'Fail':
                    data.body.errors.forEach(element => {
                        toast(element.text);
                    });

                    return {}
                    
                default:
                    Alert.alert(data.typeResponse, data.message);
                    return {}
            }
        } 
    }

    const ListItemWithImgC = ({img, tittle, line2, line3 }) => (
        <View style={userDetailStyles.viewRow}>
            <ListItem.Content >
                <TouchableOpacity style={[userDetailStyles.viewRow, userDetailStyles.fill]}>
                    <Avatar 
                        rounded
                        size="medium"
                        containerStyle={{ backgroundColor: 'lightgray' }}
                        icon={{ name: 'camera-outline', color: 'white', type: 'ionicon', size: 40 /* img */ }} 
                    />
                    <View>
                        <View style={userDetailStyles.viewLinesItem}>
                            <Text style={userDetailStyles.tittleItem}>
                                {tittle} 
                            </Text>
                            {line2}
                            {line3}  
                        </View>
                    </View>
                </TouchableOpacity>      
            </ListItem.Content>
        </View>
    )

    const line2ActivityQualification = (description) => (
        <Text style={userDetailStyles.text}>
            {description}
        </Text>
    )

    const line3Activity = (reactions) => (
        <View style={userDetailStyles.viewRow}>
            {
                reactions.map((reaction, index) => (
                    <View
                        key={index} 
                        style={userDetailStyles.viewReaction}>
                        <Icon name={reaction.type} color='gray' type='ionicon' size={15} />
                        <Text style={userDetailStyles.text}>
                            {reaction.num}
                        </Text>
                    </View>
                ))
            }
        </View>
    )

    const line2Experience = (enterprise, typeJob) => (
        <Text style={userDetailStyles.text}>
            {enterprise} - {typeJob}
        </Text>
    )
        // aqui hay q procesar el timeStamp q le llegara...
    const line3ExperienceQualification = (dateInit, dateEnd) => ( 
        <Text style={userDetailStyles.text}>
            {dateInit} - {(dateEnd != null) ? dateEnd : 'Actually'}
        </Text>
    )

    const SeeMoreButtonC = ({ action }) => (
        <TouchableOpacity 
            onPress={action}
            style={userDetailStyles.buttonSee}
            >
            <Text style={userDetailStyles.buttonSeeText}>
                See more
            </Text>
        </TouchableOpacity>
    )

    const ListItemC = ({ tittle, line2, action }) => (
        <TouchableOpacity
            style={userDetailStyles.fill}
            onPress={action}
            >
            <Text style={userDetailStyles.tittleItem}>
                {tittle}
            </Text>
            {line2}
        </TouchableOpacity>
    )

    const line2IdiomAward = (text) => (
        <Text style={userDetailStyles.text}>
            {text}
        </Text>
    )

    const gotoUserActivities = () => {
        console.log('hi activities');
    }

    const gotoUserLanguages = () => {
        console.log('hi idioms');
    }

    const gotoUserExperiences = () => {
        console.log('hi experiences');
    }

    const gotoUserQualifications = () => {
        console.log('hi qualifications');
    }

    const gotoawards = () => {
        console.log('hi awards');
    }

    const gotoSkill = () => {
        console.log('hi skill');
    }

    useEffect(() => {
        getUser().then(res => { 
            setUser(res);
            setLoading(false); 
        }); 
    }, []);

    const test = (userAux) => {
        return { 
            ...userAux, 
            experiences: EXPERIENCE_BASE,
            idioms: IDIOMS_BASE,
            skills: SKILLS_BASE,
            awards: AWARDS_BASE,
            activities: ACTIVITIES_BASE,
            qualifications: QUALIFICATION_BASE,
            description: 'hi, i am a description. inserted with a function test...' 
        }; 
    }
    
    return (
        <View style={userDetailStyles.container}>
            {
                (loading)
                ? <ActivityIndicator size="large" color="#00ff00" />
                : <ScrollView style={userDetailStyles.fill}>
                    <View style={userDetailStyles.viewLinesItem}>
                        {
                            (user.img == null)
                            ? <Avatar 
                                rounded
                                size="xlarge"
                                containerStyle={{ backgroundColor: 'lightgray' }}
                                icon={{ name: 'camera-outline', color: 'white', type: 'ionicon', size: 100 }} 
                            />
                            : <Avatar 
                                rounded 
                                source={{ uri: `data:image/png;base64,${user.img}` }}
                                size="xlarge" 
                            />
                        }
                        <Text style={userDetailStyles.name}>
                            {user.name} {user.lastName}
                        </Text>
                        <Text style={userDetailStyles.tittleItem}>
                            {user.email}
                        </Text>
                        <Text style={userDetailStyles.tittleItem}>
                            {user.country} - 10 connect
                        </Text>
                    </View>
                    {
                        (user.description == null)
                        ? null
                        : <View style={[ userDetailStyles.viewList, userDetailStyles.viewLinesItem ]}>
                            <Text style={userDetailStyles.tittleItem}>
                                Description
                            </Text>
                            <Text style={userDetailStyles.text}>
                                {user.description}
                            </Text>
                        </View>
                    }
                    { 
                        (user.activities.length < 1) 
                        ? null
                        : <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                Activities
                            </Text>
                            {
                                user.activities.map((item, index) => (
                                    <ListItem 
                                        key={index} 
                                        bottomDivider
                                        >
                                        <ListItemWithImgC 
                                            img={item.img}
                                            tittle={item.tittle}
                                            line2={line2ActivityQualification(item.description)}
                                            line3={line3Activity(item.reactions)}
                                        />
                                    </ListItem>
                                ))
                            }
                            <SeeMoreButtonC
                                action={gotoUserActivities}
                            />
                        </View>
                    }
                    { 
                        (user.qualifications.length < 1)
                        ? null
                        : <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                Qualifications
                            </Text>
                            {
                                user.qualifications.map((item, index) => (
                                    <ListItem 
                                        key={index} 
                                        bottomDivider
                                        >
                                        <ListItemWithImgC 
                                            img={item.img}
                                            tittle={item.university}
                                            line2={line2ActivityQualification(item.qualification)}
                                            line3={line3ExperienceQualification(item.dateInit, item.dateEnd)}
                                        />
                                    </ListItem>
                                ))
                            }
                            <SeeMoreButtonC
                                action={gotoUserQualifications}
                            />
                        </View> 
                    } 
                    { 
                        (user.experiences.length < 1)
                        ? null
                        : <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                Experiences
                            </Text>
                            {
                                user.experiences.map(item => (
                                    <ListItem 
                                        key={item.id} 
                                        bottomDivider
                                        >
                                        <ListItemWithImgC 
                                            img={item.img}
                                            tittle={item.job}
                                            line2={line2Experience(item.enterprise, item.typeJob)}
                                            line3={line3ExperienceQualification(item.dateInit, item.dateEnd)}
                                        />
                                    </ListItem>
                                ))
                            }
                            <SeeMoreButtonC
                                action={gotoUserExperiences}
                            />
                        </View> 
                    }
                    { 
                        (user.idioms.length < 1)
                        ? null
                        : <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                Idioms
                            </Text>
                            {
                                user.idioms.map(item => (
                                    <ListItem key={item.id} bottomDivider>
                                        <ListItemC
                                            tittle={item.name}
                                            line2={line2IdiomAward(item.lvl)}
                                        />
                                    </ListItem>
                                ))
                            }
                            <SeeMoreButtonC
                                action={gotoUserLanguages}
                            />
                        </View>
                    }
                    {
                        (user.awards == null)
                        ? null
                        : <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                Awards
                            </Text>
                            {
                                user.awards.map((item, index) => (
                                    <ListItem key={index} bottomDivider>
                                        <ListItemC
                                            tittle={item.description}
                                            line2={line2IdiomAward(item.date)}
                                        />
                                    </ListItem>
                                ))
                            }
                            <SeeMoreButtonC
                                action={gotoawards} 
                            />
                        </View>
                    }
                    {
                        (user.skills == null)
                        ? null
                        : <View style={userDetailStyles.viewList}>
                            <Text style={userDetailStyles.tittleList}>
                                Skill
                            </Text>
                            {
                                user.skills.map((item, index) => (
                                    <ListItem key={index} bottomDivider>
                                        <ListItemC
                                            tittle={item.description}
                                        />
                                    </ListItem>
                                ))
                            }
                            <SeeMoreButtonC
                                action={gotoSkill}
                            />
                        </View>
                    }
                </ScrollView>
            }          
        </View> 
    )
}

export default UserProfile

const userDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 24,
        height:'100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#f4f6fc',
    },

    viewList: {
        marginTop: 10,
        backgroundColor: 'white', 
        borderRadius: 10 
    },

    buttonSee: {
        alignItems: 'center', 
        justifyContent: "center", 
        height: 50
    },

    buttonSeeText: {
        fontSize: 30, 
        color:'#3465d9'
    },

    name: {
        fontWeight: "bold", 
        fontSize: 30, 
    },

    tittleList: { 
        fontWeight: "bold", 
        fontSize: 30, 
        paddingLeft: 10 
    },

    viewLinesItem: {
        paddingLeft: 10 
    },

    fill: { 
        width: '100%' 
    },

    tittleItem: { 
        color:'gray', 
        fontWeight: "bold", 
        fontSize: 20 
    },

    viewRow: {
        flexDirection: 'row' 
    },

    viewReaction: {
        flexDirection: 'row', 
        paddingRight: 5
    },

    text: {
        color: 'gray'
    }
});