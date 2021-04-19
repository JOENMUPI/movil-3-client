import { Alert } from 'react-native';
import * as Contacts from 'expo-contacts';

const getConTacts  = async () => {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status != 'granted') {
        Alert.alert(
            'Error', 
            'Sorry, we need camera roll permissions to make this work!',
            { cancelable: false }
        );
    
    } else {
        const { data } = await Contacts.getContactsAsync({
            fields: [Contacts.Fields.PhoneNumbers],
        });

        if (data.length > 0) {
            return data;
        }
    }

    return [];
}

export default {
    getConTacts
}