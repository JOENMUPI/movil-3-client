import React from 'react'; 
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Alert, 
    ScrollView 
} from 'react-native';

import { Icon } from 'react-native-elements';

const UserProfile = ({ navigation, route }) => { 
    return (
        <View style={{ marginTop: 24, backgroundColor: 'green', flex: 1 }}>
            <View 
                style={{ 
                    height:'100%',
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: 'gold',
                }}
                >
                <Text>UserProfile</Text>
            </View>
        </View>
    )
}

export default UserProfile