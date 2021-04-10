import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import SignUp from './src/screens/signUp';
import SignIn from './src/screens/signIn';
import Home from './src/screens/home';
import Test from './src/screens/Test';
import Tabs from './src/screens/tabs';
import UserProfile from './src/screens/userProfile';
import Post from './src/screens/post';
import SeePost from './src/screens/seePost';
import Connect from './src/screens/connect';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">  
        <Stack.Screen name="Test" component={Test} options={{ title: "Test", headerShown: false }}></Stack.Screen> 
        <Stack.Screen name="Post" component={Post} options={{ title: "Post", headerShown: false }}></Stack.Screen> 
        <Stack.Screen name="Connect" component={Connect} options={{ title: "Connect", headerShown: false }}></Stack.Screen> 
        <Stack.Screen name="SeePost" component={SeePost} options={{ title: "See Post", headerShown: false }}></Stack.Screen> 
        <Stack.Screen name="UserProfile" component={UserProfile} options={{ title: "User Profile", headerShown: false }}></Stack.Screen>   
        <Stack.Screen name="Tabs" component={Tabs} options={{ title: "Tabs", headerShown: false }}></Stack.Screen> 
        <Stack.Screen name="SignIn" component={SignIn} options={{ title: "Sign In", headerShown: false }}></Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUp} options={{ title: "Sign Up", headerShown: false }}></Stack.Screen>
        <Stack.Screen name="Home" component={Home} options={{ title: "Home", headerShown: false }}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

