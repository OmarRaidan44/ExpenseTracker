import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import AddExpenseScreen from '../screens/AddExpenseScreen';
import * as SplashScreen from 'expo-splash-screen';

const Stack = createNativeStackNavigator();

// Keep the splash screen visible while we fetch resources
//SplashScreen.preventAutoHideAsync();

/* Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});*/

export default function App() {
  return (
    
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddExpense" component={AddExpenseScreen} />
      </Stack.Navigator>
    
  );
}

const theme = {
  colors: {
    primary: '#3498db',
    secondary: '#2ecc71',
    background: '#f5f5f5',
    textPrimary: '#2c3e50',
    textSecondary: '#555',
    danger: '#e74c3c',
    accent: '#9b59b6',
  },
};