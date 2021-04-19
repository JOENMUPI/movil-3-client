import { Alert, } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


const getImage = async () => {  
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if(permission.status != 'granted') {
        Alert.alert(
        'Error', 
        'Sorry, we need camera roll permissions to make this work!',
        { cancelable: false }
        );

    }  else {
        const imgResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
            base64: true,
        }); 
        
        if(!imgResult.cancelled) { 
            return imgResult.base64;
        } 
    }

    return null;
}


export default {
    getImage
}