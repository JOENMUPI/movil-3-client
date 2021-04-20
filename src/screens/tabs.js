import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';
import Home from './home';
import Post from './post';
import Connect from './connect';
import Companies from './companies';


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
            case 'Connect':
                (focused)
                ? iconName = 'people-circle'
                : iconName = 'people-circle-outline';
                break;
            case 'Companies':
                (focused)
                ? iconName = 'business'
                : iconName = 'business-outline';
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
            <Tab.Screen name="Connect" component={Connect}/>
            <Tab.Screen name="Post" component={Post}/>
            <Tab.Screen name="Companies" component={Companies}/>
        </Tab.Navigator>
    );
}