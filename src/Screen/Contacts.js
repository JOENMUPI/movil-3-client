
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from "react-native";
import { ListItem, Avatar } from 'react-native-elements'
import { ScrollView } from 'react-native-gesture-handler';
import AvatarUrl from "../image/images.png";

const Contacts = () => {
    const List = [
        {
            name: 'Gabriel Trompiz',

            subtitle: '0414-5291958'
        },
        {
            name: 'Pedro gomez',

            subtitle: '0412-7991436'
        },
        {
            name: 'Marian Morales',

            subtitle: '0414-5291958'
        },
        {
            name: 'Daniel Larruso',

            subtitle: '0412-7991436'
        }, {
            name: 'Andrea Carrillo',

            subtitle: '0414-5291958'
        },
        {
            name: 'Carlos Mavarez',

            subtitle: '0412-7991436'
        },
        {
            name: 'Paulina ',

            subtitle: '0412-7991436'
        },
        {
            name: 'Maria Paula Gutierrez',
            subtitle: '+52 9931285482'
        }

    ]

    return (

        <View>
            <ScrollView>
                <View>
                    <Text style={styles.text}>
                        Contacts
                    </Text>
                    {
                        List.map((l, i) => (
                            <ListItem key={i} bottomDivider>
                                <Avatar source={AvatarUrl} />
                                <ListItem.Content>
                                    <ListItem.Title>{l.name}</ListItem.Title>
                                    <ListItem.Subtitle>{l.subtitle}</ListItem.Subtitle>
                                </ListItem.Content>
                            </ListItem>
                        ))
                    }
                </View>
            </ScrollView>

        </View>

    )
};

export default Contacts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },

    text: {
        flex: 1,
        marginTop: 40,
        fontSize: 25,
        textAlign: "center",
        color: "#000"
    },

});