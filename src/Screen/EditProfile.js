import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    StyleSheet,
} from "react-native";
import { Avatar, Button, Divider, CheckBox, Icon, } from 'react-native-elements'

const EditProfile = () => {
    const [vissiblePassFlag, setVissiblePassFlag] = useState(false);




    return (

        <View>
            <View style={{
                marginTop: 24,
                backgroundColor: 'white',
                padding: '2%',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: "center",
                paddingHorizontal: 10,
                flexDirection: 'row'
            }}>
                <Icon

                    name='close-outline'
                    color='gray'
                    type='ionicon'
                    size={30}
                />

                <Text style={{ fontSize: 20 }}>Edit resentation </Text>
                <Icon

                    name='save'
                    color='gray'
                    type='ionicon'
                    size={30}
                />

            </View>

            <View
                style={{
                    height: 300,
                    width: 350,
                    borderRadius: 5,
                    justifyContent: "center",
                    alignItems: 'center',
                }}>
                <Avatar size={200} source={require('../image/images.png')} />
            </View>

            <View>
                <TextInput
                    placeholder="Name"
                    placeholderTextColor="#888"
                    style={styles.Name}
                />
                <TextInput
                    placeholder="Apellido"
                    placeholderTextColor="#888"
                    style={styles.Apellido}

                />
            </View>
            <View style={{ flexDirection: 'column', paddingHorizontal: 100, paddingTop: 10 }}>
                <TouchableOpacity>
                    <Button
                        title="Pais"
                        type="outline"

                    />

                </TouchableOpacity>
            </View>
            <View style={{ paddingHorizontal: 100, paddingTop: 5 }}>
                <TouchableOpacity>
                    <Button style={styles.Button}
                        title="Password"
                        type="outline"
                    />
                </TouchableOpacity>
            </View >

            <View >
                <View style={styles.CheckBox} >
                    <TextInput
                        placeholder="Old Password"
                        autoCapitalize="none"
                        style={styles.OldPassword}



                    />
                    <View >
                        <CheckBox
                            checkedIcon={<Icon name='eye-outline' color='gold' type='ionicon' size={20} />}
                            uncheckedIcon={<Icon name='eye-off-outline' color='grey' type='ionicon' size={20} />}
                            checked={vissiblePassFlag}
                            onPress={() => setVissiblePassFlag(!vissiblePassFlag)}
                        />
                    </View>
                </View>
            </View>
            <View style={styles.CheckBox}>
                <TextInput

                    placeholder="New Password"
                    autoCapitalize="none"
                    style={styles.NewPassword}
                />
                <CheckBox
                    checkedIcon={<Icon name='eye-outline' color='gold' type='ionicon' size={20} />}
                    uncheckedIcon={<Icon name='eye-off-outline' color='grey' type='ionicon' size={20} />}
                    checked={vissiblePassFlag}
                    onPress={() => setVissiblePassFlag(!vissiblePassFlag)}
                />
            </View>

        </View>

    )
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    Apellido: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        height: 45,
        width: 320,
        color: '#000',
        paddingLeft: 18,
    },
    OldPassword: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        height: 45,
        width: 320,
        color: '#000',
        paddingLeft: 18,
    },
    NewPassword: {
        backgroundColor: '#f0f0f0',
        borderRadius: 8,
        height: 45,
        width: 320,
        color: '#000',
        paddingLeft: 18,
    },
    CheckBox: {
        flexDirection: 'row',
        height: 45,

        justifyContent: "center",
        alignItems: "center",
        marginTop: 3,
        borderRadius: 4,


    },

});