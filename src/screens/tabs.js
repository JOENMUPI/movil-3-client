import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import Home from './home';
import Post from './post';


const Tab = createBottomTabNavigator();
const OPTION = {
    activeTintColor: 'tomato',
    inactiveTintColor: 'gray',
}

const SCREEN_OPTIONS = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch(route.name) {
            case 'Home':
                (focused)
                ? iconName = 'home'
                : iconName = 'home-outline';
                break;

            case 'Post':
                (focused)
                ? iconName = 'duplicate'
                : iconName = 'duplicate-outline';
                break;
        }
        
        return (
            <Icon
                name={iconName}
                color={color}
                type='ionicon'
                size={size}
            />
        ) 
    }
})


export default function App() {
    return (
        <Tab.Navigator   
            screenOptions={SCREEN_OPTIONS}         
            tabBarOptions={OPTION}
            >
            <Tab.Screen name="Home" component={Home}/>
            <Tab.Screen name="Post" component={Post}/>
        </Tab.Navigator>
    );
}