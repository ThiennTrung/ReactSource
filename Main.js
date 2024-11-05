import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert,Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const LoginScreen = () => {
    const [token, SetToken] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [Time_checkin, setTimeCheckin] = useState('');
    const [Time_checkOut, setTimeCheckOut] = useState('');

    useEffect(() => {
        loadInfo();
        AutoLogin();
    }, []);

    const AutoLogin = () => {
        if (username && password){
            GetTonken();

            if (token){
                get_day_status(token);
            }
        }
    }

    const handleCheckin = async () => {
        if (username && password)
        {
          try {
            if(token){
                const response = await fetch('https://ddc.fis.vn/fis0/api/checkin_all', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer ' +  token
                },
                body: JSON.stringify({
                  "deviceId": "44FE74B1-3842-4B54-82B9-74857BD1603A",
                  "deviceName": "iPhone14,5",
                  "ssid": "FIS.HCM",
                  "ipGateway": "10.86.156.1",
                  "type": 0,
                  "dataPrivate": "UAzgZA7VPPcX82D1sRFgR/ux7ReWWnJVPFgdyMGDGnQttOMBGCElhL8R0vctR0iZ\r\n1/uhGMAlR8TBeNTOL7fm70JQ7Pjk1RA5wbRtVIrVDJCuD6gi4GMvqDe4FtKF70E1\r\njqkJCO4STzLYtB+A8kCfZ3K5OtnUMc+K9h5hjou6k/s=",
                  "isCheckDevice": true
                }),
                });
                const json = await response.json();
                // console.log(json)
                Alert.alert('Successful', json.message);
                }
          } catch (error) {
              Alert.alert('error', `${error}`);
          }
        } 
        else
        {
          Alert.alert('Error', 'Please enter both username and password.');
        }
    };
    const handleCheckout = async () => {
      if (username && password)
      {
        try {
          if(token){
              const response = await fetch('https://ddc.fis.vn/fis0/api/checkout_all', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization' : 'Bearer ' +  token
              },
              body: JSON.stringify({
                "deviceId": "44FE74B1-3842-4B54-82B9-74857BD1603A",
                "deviceName": "iPhone14,5",
                "ssid": "FIS.HCM",
                "ipGateway": "10.86.156.1",
                "type": 0,
                "dataPrivate": "UAzgZA7VPPcX82D1sRFgR/ux7ReWWnJVPFgdyMGDGnQttOMBGCElhL8R0vctR0iZ\r\n1/uhGMAlR8TBeNTOL7fm70JQ7Pjk1RA5wbRtVIrVDJCuD6gi4GMvqDe4FtKF70E1\r\njqkJCO4STzLYtB+A8kCfZ3K5OtnUMc+K9h5hjou6k/s=",
                "isCheckDevice": true
              }),
              });
              const json = await response.json();
              // console.log(json)
              Alert.alert('Successful', json.message);
              }
        } catch (error) {
            Alert.alert('error', `${error}`);
        }
      } 
      else
      {
        Alert.alert('Error', 'Please enter both username and password.');
      }
  };
    const SaveAccount = async () => {
        if (username && password)
        {
          try {
            await AsyncStorage.setItem('username', username);
            await AsyncStorage.setItem('password', password);
            Alert.alert('Success', 'Saved');
        } catch (error)
        {
            console.log(error);
        }
        }else {
          Alert.alert('Error', 'Please enter both username and password.');
        }
    }
    const loadInfo = async () => {
        try {
        const savedUsername = await AsyncStorage.getItem('username');
        const savedPassword = await AsyncStorage.getItem('password');

        if (savedUsername && savedPassword) {
            setUsername(savedUsername);
            setPassword(savedPassword);
        }
        } catch (error) {
        console.log('Failed to load:', error);
        }
    };

    const GetTonken = async () => {
        try {
          const response = await fetch('https://ddc.fis.vn/fis0/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
            username,
            password,
            }),
            });
            const json = await response.json();
            console.log(json.data.token)
            if (json.resultCode == 1){
              SetToken(json.data.token);
            }
        
        } catch (error) {
            console.log(error)
        }
    };

    const get_day_status = async(tonken) => {
        try {
              const response = await fetch('https://ddc.fis.vn/fis0/api/get_day_status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization' : 'Bearer ' +  token
                },
                });
                const json = await response.json();
                if (json.resultCode == 1)
                {
                  const checkin = new Date(String(json.data.checkinTime).replace('Z','')).toLocaleTimeString("vi-VN");
                  const checkout = new Date(String(json.data.checkoutTime).replace('Z','')).toLocaleTimeString("vi-VN");
                  setTimeCheckin(checkin ?  checkin : 'N/A');
                  setTimeCheckOut(checkout ?  checkout : 'N/A');
                }
                
            } catch (error) {
                console.log(error)
            }
    }

    
  return (
    <View style={styles.container}>

       <View>
       <Text style={styles.title}>In: {Time_checkin}</Text>
       <Text style={styles.title}>Out: {Time_checkOut}</Text>
       </View>
      

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
        autoCapitalize="none"
        placeholderTextColor="#aaa"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      <View style = {{flexDirection :'row'}}>
        <TouchableOpacity style={styles.button} onPress={SaveAccount}>
        <Text style={styles.buttonText}>Save</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCheckin}>
        <Text style={styles.buttonText}>Checkin</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleCheckout}>
        <Text style={styles.buttonText}>Checkout</Text>
      </TouchableOpacity>

        </View>
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#f2f2f2',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
    color: '#333',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  button: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 5
    
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
});

export default LoginScreen;
