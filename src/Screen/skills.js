
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";
import { Icon, } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';

const skills = () => {
    const gotoSkill = () => {
        console.log('hi skill');
    }
    const EditSkill = () => {
        console.log('Edit item');
    }
    const EditSkills = () => {
        console.log('Edit go item');
    }

    const [vissiblePassFlag] = useState(false);

    const Array = ["comer",
        "hola",
        "buena", "PASTA"
    ];
    const SkillsArray = ["hablar", "XD", "planchar"];
    const Component = ({ title, action }) => (
        <View style={styles.Header}  >


            <Text >
                {title}
            </Text>
            <Icon

                name='add-outline'
                color='gray'
                type='ionicon'
                size={30}
                checked={vissiblePassFlag}
                onPress={action}
            />

        </View>

    )

    const List1 = ({ action1, }) => (
        <View>
            {
                Array.map((item, index,) => (
                    <View
                        key={index}
                        style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}
                    >
                        <TouchableOpacity
                            style={{ width: '70%' }}
                            onPress={action1}
                        >
                            <Text style={{ fontSize: 15 }}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                        <Icon
                            onPress={action1}
                            name='pencil-outline'
                            color='gray'
                            type='ionicon'
                            size={15}
                        />
                    </View>
                ))
            }
        </View>

    )
    const List2 = ({ action2 }) => (
        <View>
            {
                SkillsArray.map((item, index,) => (
                    <View
                        key={index}
                        style={{ flexDirection: "row", justifyContent: "space-between", alignItems: 'center' }}
                    >
                        <TouchableOpacity
                            style={{ width: '70%' }}
                            onPress={action2}
                        >
                            <Text style={{ fontSize: 15 }}>
                                {item}
                            </Text>
                        </TouchableOpacity>
                        <Icon
                            onPress={action2}
                            name='pencil-outline'
                            color='gray'
                            type='ionicon'
                            size={15}
                        />
                    </View>
                ))
            }
        </View>

    )
    return (

        <View >
            <View  >

                <Component style={styles.textInput}
                    title="Skills"
                    action={gotoSkill}


                />
            </View>
            <ScrollView>
                <View >

                    <List1
                        action1={EditSkill}
                    />
                    <List2
                        action2={EditSkills}
                    />

                </View>

            </ScrollView>
        </View>
    )

};

export default skills;

const styles = StyleSheet.create({
    MainContainer: {
        flex: 1,
        margin: 10

    },
    Header: {

        marginTop: 24,
        backgroundColor: 'white',
        padding: '2%',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingHorizontal: 10,
        flexDirection: 'row',

    },

    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
    Name: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        height: 45,
        width: 320,
        color: '#000',
        paddingLeft: 18,
    },
    TextStyle: {
        fontSize: 55,


    }


});