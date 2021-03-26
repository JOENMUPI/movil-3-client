import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Icon } from 'react-native-elements';

import Home from './home';
import UserProfile from './userProfile';

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
                        if (route.name === 'Home') {
                            (focused)
                            ? iconName = 'home'
                            : iconName = 'home-outline';
                        }
                        break;
                    case 'UserProfile':
                        if (route.name === 'UserProfile') {
                            (focused)
                            ? iconName = 'person-circle'
                            : iconName = 'person-circle-outline';
                        }
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
            <Tab.Screen name="UserProfile" component={UserProfile}/>
        </Tab.Navigator>
    );
}