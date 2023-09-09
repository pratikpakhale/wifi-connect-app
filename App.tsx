import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  TextInput,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';

const App: React.FC = () => {
  const [loginResponse, setLoginResponse] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const callApi = async (url: string, body: string) => {
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Referer: 'http://172.16.16.16:8090/httpclient.html',
          Origin: 'http://172.16.16.16:8090',
          Host: '172.16.16.16:8090',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari/537.36',
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: body,
      });
      const result = await response.text();
      return result;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  };

  const handleLogin = useCallback(async () => {
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('password', password);

    const loginUrl = 'http://172.16.16.16:8090/login.xml';
    const requestBody = new URLSearchParams();
    requestBody.append('mode', '191');
    requestBody.append('username', username);
    requestBody.append('password', password);
    requestBody.append('a', Date.now().toString());
    requestBody.append('producttype', '0');

    try {
      const result = await callApi(loginUrl, requestBody.toString());
      setLoginResponse(result);
    } catch (error) {
      setLoginResponse('Error occurred during login.');
    }
  }, [username, password]);

  const handleLogout = async () => {
    const loginUrl = 'http://172.16.16.16:8090/logout.xml';
    const requestBody = new URLSearchParams();
    requestBody.append('mode', '193');
    requestBody.append('username', username);
    requestBody.append('a', Date.now().toString());
    requestBody.append('producttype', '0');

    try {
      const result = await callApi(loginUrl, requestBody.toString());
      setLoginResponse(result);
    } catch (error) {
      setLoginResponse('Error occurred during login.');
    }
  };

  // Automatically call login when the app starts
  useEffect(() => {
    const loadStoredCredentials = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem('username');
        const storedPassword = await AsyncStorage.getItem('password');

        if (storedUsername) {
          setUsername(storedUsername);
        }

        if (storedPassword) {
          setPassword(storedPassword);
        }
        handleLogin();
      } catch (error) {
        console.error('Error loading stored credentials:', error);
      }
    };

    loadStoredCredentials();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        maxLength={8}
        placeholder="Username"
        onChangeText={value => {
          setUsername(value);
        }}
      />
      {/* username but with not flickering input  */}
      <TextInput
        style={[styles.input]}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={value => setPassword(value)}
        maxLength={100}
      />
      <Text>
        current username : {username} | password chars: {password.length}{' '}
      </Text>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: '#2196F3', marginTop: 20}]}
        onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <View style={styles.buttonSpacing} />
      <TouchableOpacity
        style={[styles.button, {backgroundColor: '#F44336'}]}
        onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
      {loginResponse && (
        <View>
          <View style={styles.divider} />
          <Text style={styles.responseText}>{loginResponse}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: 200,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  button: {
    width: 150,
    height: 50,
    backgroundColor: 'blue',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  buttonSpacing: {
    height: 10,
  },
  divider: {
    width: '100%',
    height: 1,
    backgroundColor: 'black',
    marginVertical: 10,
  },
  responseText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
