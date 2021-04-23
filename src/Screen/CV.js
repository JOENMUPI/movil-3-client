
import React, { useState } from 'react';
import {
    View,
    Text, TextInput,

    StyleSheet
} from "react-native";
import { Icon, Avatar, Button } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';

const CV = () => {
    const gotoCv = () => {
        console.log('Delete CV');
    }
    const saveCv = () => {
        console.log('Save CV');
    }


    const [vissiblePassFlag] = useState(false);
    const Component = ({ title, action, action1 }) => (
        <View style={styles.Header}  >
            <Icon
                name='close-outline'
                color='gray'
                type='ionicon'
                size={30}
                checked={vissiblePassFlag}
                onPress={action}
            />

            <Text style={styles.tittleList}>
                {title}
            </Text>
            <Button style={styles.saveButton}
                title="Save"
                type="outline"
                size={30}
                checked={vissiblePassFlag}
                onPress={action1}
            />

        </View>

    )

    const List1 = ({ title, title1, title2, title3, title4, title5, title6, title7, title8 }) => (
        <View >
            <View style={{ alignItems: 'center', paddingTop: 10 }}>

            </View>
            <View style={styles.body} >
                <Text style={styles.tittle}>CV title</Text>
                <TextInput style={styles.inputText}
                    placeholder={title}


                />
                <Text style={styles.tittle}>Description</Text>
                <TextInput style={styles.inputText}
                    placeholder={title1}
                />

                <Text style={styles.tittle}>Award</Text>
                <TextInput style={styles.inputText}
                    placeholder={title2}
                />
                <Text style={styles.tittle}>Skills</Text>

                <TextInput style={styles.inputText}
                    placeholder={title3}
                />
                <Text style={styles.tittle}>address Portafolio</Text>
                <TextInput style={styles.inputText}
                    placeholder={title4}
                />
                <Text style={styles.tittle}>Interests</Text>
                <TextInput style={styles.inputText}
                    placeholder={title5}
                />
                <Text style={styles.tittle}>Experience</Text>
                <TextInput style={styles.inputText}
                    placeholder={title6}
                />
                <Text style={styles.tittle}>qualification</Text>
                <TextInput style={styles.inputText}
                    placeholder={title7}
                />
                <Text style={styles.tittle}>language </Text>
                <TextInput style={styles.inputText}
                    placeholder={title8}
                />

            </View>
        </View>
    )

    return (

        <View >
            <View >

                <Component
                    title="CV"
                    action={gotoCv}
                    action1={saveCv}
                />
            </View>
            <ScrollView>
                <View >

                    <List1
                        title="CV Title"
                        title1="Description"
                        title2="Award"
                        title3="Skills"
                        title4="address Portafolio"
                        title5="Interests"
                        title6="Experience"
                        title7="qualification"
                        title8="language "
                    />


                </View>

            </ScrollView>
        </View>
    )

};

export default CV;

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

    inputText: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'white',
        borderRadius: 10,
        color: 'gray'
    },
    saveButton: {
        padding: '2%',
        paddingVertical: '3%',
        borderRadius: 10,
        borderWidth: 1,
        paddingHorizontal: '5%',
        borderColor: '#3465d9',
    },
    body: {
        flex: 1,
        paddingHorizontal: '3%',
        backgroundColor: '#f4f6fc'
    },
    tittleList: {
        fontWeight: "bold",
        fontSize: 30,
        paddingLeft: 10
    },
    tittle: {
        color: 'gray',
        fontSize: 20,
        fontWeight: 'bold'
    },


});