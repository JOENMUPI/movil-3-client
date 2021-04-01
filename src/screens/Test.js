import React, { useState, useEffect } from 'react'; 
import { View, StyleSheet, Text, Button } from 'react-native';
import { BottomSheet, ListItem } from 'react-native-elements';

const KeyboardAvoidingComponent = () => {
  const [isVisible, setIsVisible] = useState(false);
  
  const list = [
    { title: 'Edit post' },
    { title: 'Delete post' },
    { title: 'Add reaction' },
    {
      title: 'Cancel',
      containerStyle: { backgroundColor: 'red' },
      titleStyle: { color: 'white' },
      onPress: () => setIsVisible(false),
    },
  ];
  
  return (
    <View style={{ marginTop: 24 }}>
      <Button 
        
        title='test'
        onPress={() => setIsVisible(!isVisible)} 
      >
        
      </Button>
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{ backgroundColor: 'rgba(0.5, 0.25, 0, 0.2)' }}
        >
        {
          list.map((l, i) => (
            <ListItem key={i} containerStyle={l.containerStyle} onPress={l.onPress}>
              <ListItem.Content>
                <ListItem.Title style={l.titleStyle}>{l.title}</ListItem.Title>
              </ListItem.Content>
            </ListItem>
          ))
        }
      </BottomSheet>
    </View>
    
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around"
  },
  header: {
    fontSize: 36,
    marginBottom: 48
  },
  textInput: {
    height: 40,
    borderColor: "#000000",
    borderBottomWidth: 1,
    marginBottom: 36
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12
  }
});

export default KeyboardAvoidingComponent;
