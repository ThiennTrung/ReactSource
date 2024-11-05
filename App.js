import React, { useState } from 'react';
import { View, Button, TextInput, Text,StyleSheet,SafeAreaView} from 'react-native';
import LoginScreen from './Main';

const App = () => {
 
return (
  <SafeAreaView style={{ flex: 1 }}>
  <LoginScreen />
</SafeAreaView>
);
};

export default App;