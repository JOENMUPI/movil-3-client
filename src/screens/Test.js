import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from "react-native";
import { Icon, Input, } from 'react-native-elements'

import { ScrollView } from 'react-native-gesture-handler';

const educacion = () => {
    const [vissiblePassFlag] = useState(false);

    const gotoEducation = () => {
        console.log('hi education');
    }


    const SaveEducation = () => {
        console.log('save info')
    }

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
            <Text style={styles.TextStyle} >
                {title}
            </Text>
            <Icon

                name='save'
                color='gray'
                type='ionicon'
                size={30}
                onPress={action1}
            />
        </View>
    )

    const List1 = ({ title, title1, title2, title3, title4, subtitle, subtitle1 }) => (
        <View>
            <View>
                <Text style={styles.TextStyle}>{title}</Text>

            </View>
            <View>
                <Input
                    placeholder="Uru"
                    placeholderTextColor="#888"
                    style={styles.Name}
                />
            </View>
            <View>
                <Text style={styles.TextStyle}>{title1}</Text>

            </View>
            <View>
                <Input
                    placeholder="Ingeneria"
                    placeholderTextColor="#888"
                    style={styles.Name}
                />
            </View>
            <View >
                <Text style={styles.TextStyle}>{title2}</Text>
                <Input

                    placeholder="Ciencias de Computacion"
                    placeholderTextColor="#888"

                    style={styles.Name}

                />
            </View>
            <View>
                <Text style={styles.TextStyle}>{title3}</Text>
                <Input
                    placeholder="2015"
                    placeholderTextColor="#888"
                    style={styles.Name}
                />
                <Text style={styles.TextStyle}>{title4}</Text>
                <Input
                    placeholder="2025"
                    placeholderTextColor="#888"
                    style={styles.Name}
                />
                <Text>{subtitle}</Text>
            </View>
            <View>
                <Input
                    placeholder="Nota media (Opcional)"
                    placeholderTextColor="#888"
                    style={styles.Name}
                />
            </View>
            <View>
                <Input
                    placeholder="Actividades y Grupos"
                    placeholderTextColor="#888"
                    style={styles.Name}
                />
            </View>
            <View>
                <Text>{subtitle1}</Text>
            </View>
        </View>
    )

    return (
        <View >
            <View  >
                <Component style={styles.textInput}
                    action={gotoEducation}
                    title="Educacion"
                    action1={SaveEducation}
                />
            </View>
            <ScrollView>
                <View>
                    <List1
                        title="Institucion Educativa"
                        title1="Titulacion"
                        title2="Disciplina Academica"
                        title3="Fecha de inicio"
                        title4="Fecha de fin"
                        subtitle="fecha de graduacion previsto"
                        subtitle1="Ejemplos:Equipo de futbol,coro"
                    />
                </View>
            </ScrollView>
        </View>
    )
};

export default educacion;

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
        fontSize: 16,
    }
});