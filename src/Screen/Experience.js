
import React, { Component, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet
} from "react-native";
import { Icon, Button } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import DatePicker from 'react-native-datepicker'
Experience = () => {
    const gotoExperience = () => {
        console.log('Delete Experience');
    }
    const saveExperience = () => {
        console.log('Save Experience');
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

    const List1 = ({ title, title1, title2, title3, title4, title5 }) => (
        <View >
            <View style={{ alignItems: 'center', paddingTop: 10 }}>

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
                <View >

                    <DatePicker
                        style={styles.inputText}

                        mode="date"
                        placeholder={title2}
                        format="YYYY-MM-DD"
                        minDate="2021-01-01"
                        maxDate="2022-12-31"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }

                        }}

                    />
                </View>

                <View  >
                    <TextInput
                        style={styles.inputText}
                        placeholder={title3}
                    />
                </View>
                <View>
                    <DatePicker
                        style={styles.inputText}

                        mode="date"
                        placeholder={title4}
                        format="YYYY-MM-DD"
                        minDate="2021-01-01"
                        maxDate="2022-12-31"
                        confirmBtnText="Confirm"
                        cancelBtnText="Cancel"
                        customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 4,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36
                            }

                        }}

                    />

                </View>
                <View >
                    <TextInput
                        style={styles.inputText}
                        placeholder={title5}
                    />
                </View>
            </View>
        </View>
    )

    return (

        <View >
            <View >

                <Component
                    title="Experience Job"
                    action={gotoExperience}
                    action1={saveExperience}
                />
            </View>
            <ScrollView>
                <View >
                    <List1
                        title="Job"
                        title1="Types Job"
                        title2="2021-04-22"
                        title3="Start Date"
                        title4="2021-11-14"
                        title5="End Date"
                    />



                </View>

            </ScrollView>
        </View>
    )

};

export default Experience;

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