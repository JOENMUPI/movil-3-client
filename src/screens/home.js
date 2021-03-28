import React, { useState, useEffect } from 'react'; 
import { 
    View, 
    Text, 
} from 'react-native';

const Home = ({ navigation, route }) => { 
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
                <Text>Home (working..)</Text>
            </View> 
        </View>
    )
}

export default Home