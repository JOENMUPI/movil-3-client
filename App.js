import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import userDetails from './src/Screen/userDetails';
import EditProfile from './src/Screen/EditProfile';
import skills from './src/Screen/skills';
import education from './src/Screen/education';
import Share from './src/Screen/Share';
import Contacts from './src/Screen/Contacts';
import Company from './src/Screen/Company';
import Experience from './src/Screen/Experience';
import CV from './src/Screen/CV';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
                <Stack.Screen name="CV" component={CV} options={{ title: "CV", headerShown: false }}></Stack.Screen>
               <Stack.Screen name="Experience" component={Experience} options={{ title: "Experience", headerShown: false }}></Stack.Screen>
              <Stack.Screen name="Company" component={Company} options={{ title: "Company", headerShown: false }}></Stack.Screen>
             <Stack.Screen name=" Contacts" component={Contacts} options={{ title: " Contacts", headerShown: false }}></Stack.Screen>
            <Stack.Screen name="Share" component={Share} options={{ title: "Share", headerShown: false }}></Stack.Screen>
           <Stack.Screen name="education" component={education} options={{ title: "education", headerShown: false }}></Stack.Screen>
          <Stack.Screen name="skills" component={skills} options={{ title: "skills", headerShown: false }}></Stack.Screen>
         <Stack.Screen name="EditProfile" component={EditProfile} options={{ title: "EditProfile", headerShown: false }}></Stack.Screen>
        <Stack.Screen name="userDetails" component={userDetails} options={{ title: "userDetails", headerShown: false }}></Stack.Screen>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
