import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    ScrollView,
    FlatList
} from "react-native";
import { Icon } from 'react-native-elements';

const ARRAY_BASE = [
  { 
    id: 0, 
    tittle: 'comer', 
  },
  { 
    id: 1, 
    tittle: 'hola', 
  },
  { 
    id: 2, 
    tittle: 'buena',  
  },
  { 
    id: 3, 
    tittle: 'PASTA',  
  }
];

const ComponentC = () => {
    const [array, setArray] = useState(ARRAY_BASE);
    const [vissible, setVissible] = useState(true);
    
    useEffect(() => {
      console.log('actualiza');
    });

    const updateItem = (item) => {
      console.log('editando item', item);
    }

    const addNewItem = () => {
      let aux = array;

      aux.push({ id: array.length, tittle: 'add' });
      setArray(aux); 
      return aux;
    }

    const DataC = ({ data, tittle }) => (
      !(data.length) 
      ? <Text style={styles.textMessage}>
            User without {tittle}
        </Text>
      : <ScrollView>
        {
          data.map((item, index) => (
            <View
                key={index}
                style={styles.viewItem}
                >
                <View style={styles.item}>
                    <Text style={{ fontSize: 15 }}>
                        {item.tittle}
                    </Text> 
                    <Icon
                        onPress={() => updateItem(item)}
                        name='pencil-outline'
                        color='gray'
                        type='ionicon'
                        size={30}
                    />
                </View>
            </View>
          ))
        }
      </ScrollView>
    )  

    const renderItem = ({ item }) => ( 
      <View style={styles.viewItem}> 
          <View style={styles.item}>
              <Text style={{ fontSize: 15 }}>
                  {item.tittle}
              </Text> 
              <Icon
                  onPress={() => updateItem(item)}
                  name='ellipsis-vertical'
                  color='gray'
                  type='ionicon'
                  size={30}
              />
          </View>
      </View>
    )

    const Aux = ({ tittle, vissible, addAction, onCancel, dataArray }) => {
      const [data, setData] = useState(dataArray); 

      return (
        <Modal 
            animationType="slide"
            transparent
            visible={vissible}
            onRequestClose={onCancel}
            style={styles.modal}
            > 
            <View style={styles.Header}>
                <Text style={{ fontSize: 20, fontWeight:'bold' }}>
                    {tittle} 
                </Text> 
                <Icon
                    name='add-outline'
                    color='gray'
                    type='ionicon'
                    size={30}
                    onPress={() => { setData(addAction()); console.log(data);  } }
                />
            </View>
            {
                !(data.length)
                ? <Text style={styles.textMessage}>
                    User without {tittle}
                </Text>
                : <FlatList
                      style = {styles.list}
                      data={array}
                      renderItem={renderItem}
                      keyExtractor={item => item.id.toString()}
                />
            }
        </Modal>
      )
    }

    return (
      <View style={{ marginTop: 25 }} >
      <Aux
        tittle='Titulo'
        vissible={vissible}
        addAction={addNewItem}
        onCancel={() => setVissible(false)}
        dataArray={array}
      />
      <Icon
          name='add-outline'
          color='gray'
          type='ionicon'
          size={30}
          onPress={() => setVissible(true)}
      />
      </View>
    )
};

export default ComponentC;

const styles = StyleSheet.create({
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

    modal: {
      flex: 1,
      alignSelf: 'center',
      justifyContent: 'center',
    },

    textMessage: {
      padding: 20,
      backgroundColor: '#f4f6fc', 
      fontSize: 25, 
      color: 'gray', 
      textAlign: "center"
  },

    item: {
      paddingVertical: '5%',
      paddingHorizontal: '10%',
      backgroundColor: 'white' , 
      borderRadius: 10, 
      alignItems: 'center', 
      flexDirection: 'row',
      justifyContent: 'space-between' 
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