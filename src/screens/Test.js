import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Modal,
    StyleSheet,
} from "react-native";
import { Avatar, CheckBox, Icon } from 'react-native-elements'

const PASS_BLANK = { old: { text: '', flag: false }, new: { text: '', flag: false } }

const EditProfile = () => {
    const [pass, setPass] = useState(PASS_BLANK);
    const [modal, setModal] = useState(false);

    let passInput = '';

    return (
        <View style={styles.container}>
            <Modal 
                animationType="slide"
                transparent
                visible={modal}
                onRequestClose={() => setModal(false)}
                >
                <View style={styles.modal}>
                    <View style={styles.viewModal}> 
                        <View style={{ alignItems:'center' }}>
                            <Text style={styles.tittleModal}>
                                Change password
                            </Text>
                            <Text style={{ color: 'gray' }}>
                                The password must be uppercase, lowercase, special character and greater than 8 characters!
                            </Text>
                        </View>
                        <View style={[ styles.viewInputPass, styles.viewRow ]}>
                            <TextInput
                                style={{ width: '70%' }}
                                placeholder="Old Password"
                                autoCapitalize="none"
                                autoFocus
                                secureTextEntry={!pass.old.flag}
                                value={pass.old.text}
                                blurOnSubmit={false}
                                onChangeText={text => setPass({ ...pass, old: { ...pass.old, text } })}
                                onSubmitEditing={() => passInput.focus()}
                            />
                            <CheckBox    
                                checkedIcon={<Icon name='eye-outline' color='white' type='ionicon' size={20} />}
                                uncheckedIcon={<Icon name='eye-off-outline' color='grey' type='ionicon' size={20} />}
                                checked={pass.old.flag}
                                onPress={() => setPass({ ...pass, old: { ...pass.old, flag: !pass.old.flag } })}
                            />                  
                        </View>
                        <View style={[ styles.viewInputPass, styles.viewRow ]}>
                            <TextInput
                                ref={ref => passInput = ref}
                                style={{ width: '70%' }}
                                placeholder="New Password"
                                autoCapitalize="none"
                                secureTextEntry={!pass.new.flag}
                                value={pass.new.text}
                                onChangeText={text => setPass({ ...pass, new: { ...pass.new, text } })}
                                onSubmitEditing={() => setPass(PASS_BLANK)}
                            />
                            <CheckBox
                                checkedIcon={<Icon name='eye-outline' color='white' type='ionicon' size={20} />}
                                uncheckedIcon={<Icon name='eye-off-outline' color='grey' type='ionicon' size={20} />}
                                checked={pass.new.flag}
                                onPress={() => setPass({ ...pass, new: { ...pass.new, flag: !pass.new.flag } })}
                            />
                        </View> 
                        <TouchableOpacity 
                            style={styles.button}
                            onPress={() => setPass(PASS_BLANK)}
                            >
                            <Text style={styles.buttonText}>
                                Change Pass
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <View style={[styles.header, { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }]}>
                <Icon
                    onPress={() => console.log('goback')}
                    name='close-outline'
                    color='gray'
                    type='ionicon'
                    size={30}
                />
                <Text style={{ fontSize: 20 }}>
                    Edit user 
                </Text>
                <TouchableOpacity
                    style={{ borderWidth: 1, borderColor: 'gray', borderRadius: 10, padding: '2%' }}
                    onPress={() => console.log('savedata')}
                    >
                    <Text style={{ fontWeight: 'bold', color: 'gray' }}>
                        Save edit
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.body}>
                <ScrollView>
                    <View
                        style={styles.avatarView}>
                        <Avatar size='xlarge' source={require('../../assets/fondo1.png')} />
                    </View>
                    <View style={{ marginHorizontal: '3%' }}>
                        <View style={styles.viewTextInput}>
                            <View/>
                            <TextInput
                                placeholder="Name"
                            />
                        </View>
                        <View style={styles.viewTextInput}>
                            <TextInput
                                placeholder="Last name"
                            />
                        </View>
                        <View style={styles.viewTextInput}>
                            <TextInput
                                placeholder="description"
                            />
                        </View>
                        <TouchableOpacity
                            onPress={() => console.log('searchbar country')}
                            style={[styles.button, { width: '50%' }]}
                            >
                            <Text style={styles.buttonText}>
                                Country
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => setModal(true)}
                            style={[styles.button, { width: '50%' }]}
                            >
                            <Text style={styles.buttonText}>
                                Password
                            </Text>
                        </TouchableOpacity>
                    </View>
                
                </ScrollView>
            </View>
        </View>
    )
};

export default EditProfile;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white', 
        flex: 1 
    },

    viewRow: {
        justifyContent: 'space-between', 
        flexDirection: 'row', 
        alignContent: 'center'
    },

    modal: {  
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },

    header: {
        marginTop: 24,
        backgroundColor: 'white',
        padding: '2%',
        width:'100%',
        justifyContent: 'space-between',
    },

    viewModal: {
        margin: '5%',
        backgroundColor: "white",
        borderRadius: 10,
        padding: '5%',
        width: '50%',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

    body: {
        flex: 1,
        backgroundColor: '#f4f6fc'
    },

    button: { 
        marginTop:'5%',
        width: "100%",
        height: 40,
        backgroundColor: "#3465d9",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 5, 
    },

    buttonText: {
        color: "white", 
        fontSize: 15, 
        fontWeight: "bold" 
    },

    tittleModal: { 
        fontSize: 20, 
        fontWeight: 'bold' 
    },

    viewTextInput: {
        marginTop: '2%', 
        padding: '3%', 
        backgroundColor: 'white', 
        borderRadius: 5 
    },

    viewInputPass: {
        marginTop: '5%', 
        paddingHorizontal: '10%', 
        backgroundColor: 'lightgray', 
        borderRadius: 5 
    },

    avatarView: {
        paddingTop: '3%',
        justifyContent: "center",
        alignItems: 'center',
    }
});