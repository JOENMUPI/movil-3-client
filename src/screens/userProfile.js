import React, { useState, useEffect } from 'react'; 
import { 
    View, 
    Text, 
    TouchableOpacity, 
    ScrollView,
    StyleSheet 
} from 'react-native';

import { Icon, ListItem, Avatar } from 'react-native-elements';

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
        id: 4,
        qualification: 'Engeneer',
        university: 'Universidad Rafael Urdaneta',
        dateInit: '2017',
        dateEnd: '2020',
        img: 'images-university',
    },
    {
        id: 3,
        qualification: 'Psicology',
        university: 'Universidad Rafael Urdaneta',
        dateInit: '2020',
        dateEnd: null,
        img: 'images-university',
    },
]


const UserProfile = ({ navigation, route }) => { 
    const [activities, setActivities] = useState(ACTIVITIES_BASE);
    const [Experiences, setExperiences] = useState(EXPERIENCE_BASE);
    const [Qualifications, setQualifications] = useState(QUALIFICATION_BASE);

    const ListItemWithImgC = ({img, tittle, line2, line3 }) => (
        <View style={userDetailStyles.viewRow}>
            <ListItem.Content >
                <TouchableOpacity style={userDetailStyles.touchableItem}>
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
                reactions.map((reaction) => (
                    <View style={userDetailStyles.viewReaction}>
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

    const gotoUserActivities = () => {
        console.log('hi activities');
    }

    const gotoUserExperiences = () => {
        console.log('hi experiences');
    }

    const gotoUserQualifications = () => {
        console.log('hi qualifications');
    }
    
    return (
        <View style={userDetailStyles.container}>
            <ScrollView>
                <View style={userDetailStyles.viewList}>
                    <Text style={userDetailStyles.tittleList}>
                        Activities
                    </Text>
                    {
                        activities.map(item => (
                            <ListItem 
                                key={item.id} 
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
                <View style={userDetailStyles.viewDivider}/>
                <View style={userDetailStyles.viewList}>
                    <Text style={userDetailStyles.tittleList}>
                        Qualifications
                    </Text>
                    {
                        Qualifications.map(item => (
                            <ListItem 
                                key={item.id} 
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
                <View style={userDetailStyles.viewDivider}/>
                <View style={userDetailStyles.viewList}>
                    <Text style={userDetailStyles.tittleList}>
                        Experiences
                    </Text>
                    {
                        Experiences.map(item => (
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
            </ScrollView>
        </View> 
    )
}

export default UserProfile

export const userDetailStyles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 24,
        height:'100%',
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: '#f4f6fc',
    },

    viewDivider: { 
        backgroundColor: '#f4f6fc', 
        height:10 
    },

    viewList: {
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

    tittleList: { 
        fontWeight: "bold", 
        fontSize: 30, 
        paddingLeft: 10 
    },

    viewLinesItem: {
        paddingLeft: 10 
    },

    touchableItem: { 
        flexDirection: 'row', 
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