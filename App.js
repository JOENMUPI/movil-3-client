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
import EditUser from './src/screens/editUser';
import Qualification from './src/screens/qualification';
import Contact from './src/screens/contact';
import Enterprise from './src/screens/enterprise';
import SeeEnterprise from './src/screens/seeEnterprise';
import Offer from './src/screens/offer';
import Experience from './src/screens/experience';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SignIn">  
        <Stack.Screen name="Test" component={Test} options={{ title: "Test", headerShown: false }}></Stack.Screen>
        <Stack.Screen name="Experience" component={Experience} options={{ title: "Experience", headerShown: false }}></Stack.Screen>
        <Stack.Screen name="Offer" component={Offer} options={{ title: "Offer", headerShown: false }}></Stack.Screen>
        <Stack.Screen name="SeeEnterprise" component={SeeEnterprise} options={{ title: "SeeEnterprise", headerShown: false }}></Stack.Screen> 
        <Stack.Screen name="Enterprise" component={Enterprise} options={{ title: "Enterprise", headerShown: false }}></Stack.Screen> 
        <Stack.Screen name="Contact" component={Contact} options={{ title: "Contact", headerShown: false }}></Stack.Screen> 
        <Stack.Screen name="Qualification" component={Qualification} options={{ title: "Qualification", headerShown: false }}></Stack.Screen> 
        <Stack.Screen name="Post" component={Post} options={{ title: "Post", headerShown: false }}></Stack.Screen> 
        <Stack.Screen name="Connect" component={Connect} options={{ title: "Connect", headerShown: false }}></Stack.Screen> 
        <Stack.Screen name="EditUser" component={EditUser} options={{ title: "EditUser", headerShown: false }}></Stack.Screen> 
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

