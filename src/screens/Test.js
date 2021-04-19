
import React, { useState } from 'react';
import {
    View,
    Text, TextInput,

    StyleSheet
} from "react-native";
import { Icon, Avatar, Button } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';

const Company = () => {
    const gotoCompany = () => {
        console.log('Delete Company');
    }
    const saveCompany = () => {
        console.log('Save Company');
    }
    const image = () => {
        console.log('Modificate Imagen');
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

            <Text style={{ fontSize: 30 }}>
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

    const List1 = ({ action1, title, title1 }) => (
        <View >
            <View style={{ alignItems: 'center', paddingTop: 10 }}>
                <Avatar 
                    onPress={action1}
                    rounded
                    size="medium"
                    containerStyle={{ backgroundColor: 'lightgray' }}
                    icon={{ name: 'camera-outline', color: 'white', type: 'ionicon', size: 40 }} 
                />
            </View>
            <View style={styles.body} >
                <TextInput style={styles.inputText}
                    placeholder={title}

                />

                <View >
                    <TextInput style={styles.inputText}
                        placeholder={title1}
                    />
                </View>

            </View>
        </View>
    )

    return (

        <View >
            <View >

                <Component
                    title="Create Company"
                    action={gotoCompany}
                    action1={saveCompany}
                />
            </View>
            <ScrollView>
                <View >

                    <List1
                        action1={image}
                        title="Name"
                        title1="Description"

                    />


                </View>

            </ScrollView>
        </View>
    )

};

export default Company;

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


});