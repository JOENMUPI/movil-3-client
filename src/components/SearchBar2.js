import React, { useState } from 'react';
import { Text, FlatList, Modal, StyleSheet, View, ActivityIndicator, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';


const SearchBarC = ({ arrayData, vissible, onCancel, renderItem, searchF, loadingFlag }) => { 
    const [value, setValue] = useState('');
    const [prevValue, setPrevValue] = useState(null);

    
    const handleSummit = () => { 
        setPrevValue(value);
        searchF(value); 
        setValue('');
    }

    return (
        <Modal 
            animationType="slide"
            transparent
            visible={vissible}
            onRequestClose={() => { onCancel(); setValue(''); }}
            style={styles.modal}
            >
            <View style={styles.container}>
                <View style={[ styles.inputText, styles.viewText, styles.searchBar ]}> 
                    <View style={styles.viewText}>
                        <Icon name='search-outline' color='lightgray' type='ionicon' size={20}/>
                        <TextInput
                            editable={!loadingFlag}
                            autoFocus
                            placeholder={ (loadingFlag) ? prevValue : 'Write and search something!'}  
                            style={{ color: 'gray', paddingLeft: 5, width: '80%' }}
                            onChangeText={text => setValue(text)}
                            onSubmitEditing={handleSummit}
                            value={value}
                        />
                    </View>
                    <View style={styles.viewText}>
                        {
                            (!loadingFlag)
                            ? null
                            : <ActivityIndicator size="small" color="#00ff00" />  
                        }
                        {
                            !(value.length)
                            ? null
                            : (loadingFlag)
                            ? <Icon
                                containerStyle={{ paddingHorizontal: '2%' }}
                                name='close-outline' 
                                color='gray' 
                                type='ionicon' 
                                size={20} 
                            />
                            : <Icon
                                onPress={() => setValue('')} 
                                containerStyle={{ paddingHorizontal: '2%' }}
                                name='close-outline' 
                                color='gray' 
                                type='ionicon' 
                                size={20} 
                            />
                        }
                    </View>
                </View>
            </View>
            {
                (!arrayData.length)
                ? <Text style={styles.textMessage}>
                    {
                        (loadingFlag)
                        ? 'Loading...'
                        : (prevValue != null)        
                        ? `Nothing found with "${prevValue}"`
                        : 'Nothing to see? type something and hit enter!'
                    }
                </Text>
                : null     
            }
            <FlatList
                style = {styles.list}
                data={arrayData}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
            />
        </Modal>
    )
}

export default SearchBarC;

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#f4f6fc', 
        justifyContent: 'center', 
        alignItems: 'center'
    },

    searchBar: {
        width: '90%', 
        justifyContent: 'space-between'
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

    modal: {
        flex: 1,
        height: '100%',
        width: '100%',
        alignSelf: 'center',
        justifyContent: 'center',
        
    },

    inputText: {
        marginVertical: '3%', 
        paddingVertical: '2%', 
        paddingHorizontal: '1%', 
        backgroundColor:'white', 
        borderRadius: 500, 
        color: 'gray'
    },
});