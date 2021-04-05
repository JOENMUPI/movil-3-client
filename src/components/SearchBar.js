import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { SearchBar } from 'react-native-elements';


const SearchBarC = ({ arrayData, vissible, onCancel, onPressItem }) => { 
    const [data, setData] = useState(arrayData); 
    const [value, setValue] = useState('');

    const searchItems = text => {
        const newData = arrayData.filter(item => {
            const itemData = `${item.tittle.toUpperCase()}`;
            const textData = text.toUpperCase();

            return itemData.indexOf(textData) > -1;
        });

        setData(newData);
        setValue(text);
    };

    const renderItem = ({ item }) => (
        <View style={styles.viewItem}>
            <TouchableOpacity 
                onPress={() => { onPressItem(item); setData([]); setValue(''); }}
                style={styles.item}
                >
                <View style={styles.viewText}>
                    <Text style={styles.textItem}>{item.tittle}</Text>
                </View>
            </TouchableOpacity>
        </View>
    )
    
    return (
        <Modal 
            animationType="slide"
            transparent
            visible={vissible}
            onRequestClose={() => { onCancel(); setData([]); setValue(''); }}
            style={styles.modal}
            >
            <SearchBar
                inputContainerStyle={styles.white}
                inputStyle={styles.white}
                containerStyle={styles.containesSearch}
                placeholder="Write a country"
                onChangeText={searchItems}
                value={value}
            />
            {
                (data.length < 1 && value != '') 
                ? <Text style={styles.textMessage}>
                    Nothing found with "{value}"
                </Text>
                : null
            }
            <FlatList
                style = {styles.list}
                data={data}
                renderItem={renderItem}
                keyExtractor={item => item.id.toString()}
            />
        </Modal>
    )
}

export default SearchBarC;

export const styles = StyleSheet.create({
    viewItem: {
        padding: 10,
        width: '100%',
        backgroundColor: '#f4f6fc',
    },

    list: {
        paddingTop: 10, 
        paddingHorizontal: 16, 
        backgroundColor: '#f4f6fc'
    },

    viewText: {
        flexDirection: "row", 
        alignItems: 'center'
    },

    textMessage: {
        padding: 20,
        backgroundColor: '#f4f6fc', 
        fontSize: 25, 
        color: 'gray', 
        textAlign: "center"
    },

    textItem: {
        fontWeight: "bold", 
        color: "gray", 
        fontSize: 30
    },

    modal: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
    },

    white: {
        backgroundColor:'white'
    },

    containesSearch: {
        backgroundColor: 'white', 
        borderWidth: 1, 
        borderRadius: 5
    },

    item: {
        paddingVertical: 5,
        backgroundColor: 'white' , 
        borderRadius:20, 
        alignItems: 'center', 
        justifyContent: 'space-between' 
    },
});