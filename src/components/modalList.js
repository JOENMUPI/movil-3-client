import React from 'react';
import { View, Text, FlatList, Modal, StyleSheet } from 'react-native';
import { Icon } from 'react-native-elements';


const ModalListC = ({ data, vissible, onCancel, addPress, renderItem, tittle }) => ( 
    <Modal 
        animationType="slide"
        transparent
        visible={vissible}
        onRequestClose={onCancel}
        style={styles.modal}
        > 
        <View style={styles.Header}>
            <Text style={styles.tittle}>
                {tittle} 
            </Text> 
            <Icon
                name='add-outline'
                color='gray'
                type='ionicon'
                size={30}
                onPress={addPress}
            />
        </View>
        {
            !(data.length)
            ? <Text style={styles.textMessage}>
                User without {tittle}
            </Text>
            : <FlatList
                style = {styles.list}
                data={data}
                renderItem={renderItem}
                //keyExtractor={item => item.id.toString()}
            />
        }
    </Modal>
)

export default ModalListC;

export const styles = StyleSheet.create({
    tittle: { 
        fontSize: 20, 
        fontWeight:'bold' 
    },

    list: {
        paddingTop: 10, 
        paddingHorizontal: 16, 
        backgroundColor: '#f4f6fc'
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

    Header: {
        backgroundColor: 'white',
        padding: '2%',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: "center",
        paddingHorizontal: 10,
        flexDirection: 'row',
    },
});