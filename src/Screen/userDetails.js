import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ImageBackground,
    TextInput,
    StyleSheet,
} from 'react-native';
import { ListItem, Divider, Button } from 'react-native-elements'
import { useTheme, Avatar } from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

import BottomSheet from 'reanimated-bottom-sheet';
import Animated from 'react-native-reanimated';

const userDetails = () => {

    const [image] = useState('https://api.adorable.io/avatars/80/abott@adorable.png');
    const { colors } = useTheme();
    const list = [{
        name: 'english', lvl: 'basic',
        name: 'espanol', lvl: 'native',
        educacion: 'uru',
        award: 'jugar',
        skills: 'comer',

    }]
    return (
        <View style={styles.container}>
            <BottomSheet
                ref={this.bs}
                snapPoints={[330, 0]}
                renderContent={this.renderInner}
                renderHeader={this.renderHeader}
                initialSnap={1}
                callbackNode={this.fall}
                enabledGestureInteraction={true}
            />
            <View style={{
                margin: 20,

            }}>
                <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity onPress={() => this.bs.current.snapTo(0)}>
                        <View
                            style={{
                                height: 150,
                                width: 150,
                                borderRadius: 15,
                                justifyContent: 'flex-end',
                                alignItems: 'baseline',
                            }}>
                            <Avatar.Image size={100} source={require('../image/images.png')} />

                        </View>
                    </TouchableOpacity>
                    <ListItem style={{
                        marginTop: 10, fontSize: 18, fontWeight: 'bold', flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <ListItem.Title styl={{ flexDirection: 'column', marginTop: 10, fontSize: 20, }}>Pedro Pancho</ListItem.Title>

                    </ListItem>
                </View>
                <View>

                    <ListItem style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
                        <ListItem.Title>Ingerio de pala</ListItem.Title>
                        <Text style={{ fontWeight: "bold" }}>Help</Text>
                        <Text>uru</Text>
                        <ListItem.Subtitle Style={{ flex: 1, flexDirection: 'column' }}>HELP</ListItem.Subtitle>
                    </ListItem>

                </View>
                <View>
                    <ListItem.Title>uru</ListItem.Title>
                </View>
                <View>
                    <ListItem style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
                        <ListItem.Title>Universidad</ListItem.Title>

                    </ListItem>
                </View>
                <View>
                    <ListItem style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
                        <ListItem.Title>Venezuela</ListItem.Title>
                        <ListItem.Subtitle> 10 Contactos</ListItem.Subtitle>

                    </ListItem>
                </View>
                <View>
                    <ListItem style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>
                        <ListItem.Title>Description</ListItem.Title>

                        <Button
                            title="Connect"
                            type="solid"
                        />
                    </ListItem>
                </View>
                <View>
                    <View>
                        <ListItem.Title>Leguange</ListItem.Title>

                        {

                            list.map((l, i) => (
                                <ListItem key={i} bottomDivider>

                                    <ListItem.Content>
                                        <ListItem.Title>{l.name} {l.lvl}</ListItem.Title>
                                        <Divider style={{ backgroundColor: 'blue' }} />
                                        <Button
                                            title="See all"
                                            type="outline"
                                        />
                                    </ListItem.Content>
                                </ListItem>
                            ))
                        }
                    </View>
                    <View>
                        <ListItem.Title>Education</ListItem.Title>

                        {

                            list.map((l, i) => (
                                <ListItem key={i} bottomDivider>

                                    <ListItem.Content>
                                        <ListItem.Title>{l.educacion}</ListItem.Title>
                                        <Divider style={{ backgroundColor: 'blue' }} />
                                        <Button
                                            title="See all"
                                            type="outline"
                                        />
                                    </ListItem.Content>
                                </ListItem>
                            ))
                        }
                    </View>
                    <View>
                        <ListItem.Title>Award</ListItem.Title>

                        {
                            list.map((l, i) => (
                                <ListItem key={i} bottomDivider>

                                    <ListItem.Content>
                                        <ListItem.Title>{l.award}</ListItem.Title>
                                        <Divider style={{ backgroundColor: 'blue' }} />
                                        <Button
                                            title="See all"
                                            type="outline"
                                        />
                                    </ListItem.Content>
                                </ListItem>
                            ))
                        }
                    </View>
                    <View>
                        <ListItem.Title>Skills</ListItem.Title>

                        {
                            list.map((l, i) => (
                                <ListItem key={i} bottomDivider>

                                    <ListItem.Content>
                                        <ListItem.Title>{l.skills}</ListItem.Title>
                                        <Divider style={{ backgroundColor: 'blue' }} />
                                        <Button
                                            title="See all"
                                            type="outline"
                                        />
                                    </ListItem.Content>
                                </ListItem>
                            ))
                        }
                    </View>
                </View>
                <TouchableOpacity style={styles.commandButton} onPress={() => { }}>
                    <Text style={styles.panelButtonTitle}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default userDetails;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    commandButton: {
        padding: 15,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginTop: 10,
    },
    panel: {
        padding: 20,
        backgroundColor: '#FFFFFF',
        paddingTop: 20,
        // borderTopLeftRadius: 20,
        // borderTopRightRadius: 20,
        // shadowColor: '#000000',
        // shadowOffset: {width: 0, height: 0},
        // shadowRadius: 5,
        // shadowOpacity: 0.4,
    },
    header: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#333333',
        shadowOffset: { width: -1, height: -3 },
        shadowRadius: 2,
        shadowOpacity: 0.4,
        // elevation: 5,
        paddingTop: 20,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    panelHeader: {
        alignItems: 'center',
    },
    panelHandle: {
        width: 40,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#00000040',
        marginBottom: 10,
    },
    panelTitle: {
        fontSize: 27,
        height: 35,
    },
    panelSubtitle: {
        fontSize: 14,
        color: 'gray',
        height: 30,
        marginBottom: 10,
    },
    panelButton: {
        padding: 13,
        borderRadius: 10,
        backgroundColor: '#FF6347',
        alignItems: 'center',
        marginVertical: 7,
    },
    panelButtonTitle: {
        fontSize: 17,
        fontWeight: 'bold',
        color: 'white',
    },
    action: {
        flexDirection: 'row',
        marginTop: 10,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#f2f2f2',
        paddingBottom: 5,
    },
    actionError: {
        flexDirection: 'row',
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#FF0000',
        paddingBottom: 5,
    },
    textInput: {
        flex: 1,
        marginTop: Platform.OS === 'ios' ? 0 : -12,
        paddingLeft: 10,
        color: '#05375a',
    },
});
    
