import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TextInput, Button, TouchableOpacity, StatusBar, Alert, AsyncStorage, ToastAndroid, Keyboard, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import axios from 'axios';
Global = require('../../Global');

export default class Login extends Component {
    state = {
        username: '',
        password: '',
        role_id: ['2', '10'],
    }

    loginUSerData() {
        var obj = this.state;
        this.setState({ status: true });
        axios.post(Global.BASE_URL + '/auth/signin', obj).then(response => {
            this.setState({ status: false });

            if (response.data.user) {
                AsyncStorage.setItem("loggedIn", 'true');
                AsyncStorage.setItem("authToken", response.data.token);
                AsyncStorage.setItem("userData", JSON.stringify(response.data.user));

                Keyboard.dismiss();
                ToastAndroid.show('Logged in successfully', ToastAndroid.SHORT);
                this.props.navigation.navigate('Product')
                
            }
        })
            .catch(response => {
                this.setState({ status: true });
                AsyncStorage.setItem('loggedIn', 'true');
                ToastAndroid.show(response.response.data.message, ToastAndroid.SHORT)
            })
    }

    constructor(props) {
        super(props);

    }

    render() {
        return (
            <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>

                <StatusBar barStyle="light-content" />
                <View style={styles.logoContainer}>
                    <Image style={styles.logo} source={require('../images/logo.png')} resizeMode="contain" />
                </View>
                <View style={styles.loginContainer}>

                    <TextInput
                        style={styles.input}
                        autoCorrect={false}
                        returnKeyType="next"
                        autoCapitalize="none"
                        keyboardType="email-address"
                        placeholderTextColor="#474747"
                        placeholder="User Name"
                        underlineColorAndroid="transparent"
                        onChangeText={(text) => this.setState({ username: text })}
                    />

                    <TextInput
                        underlineColorAndroid="transparent"
                        placeholder="Password"
                        placeholderTextColor="#474747"
                        secureTextEntry returnKeyType="go"
                        style={styles.input}
                        onChangeText={(text) => this.setState({ password: text })}
                    />

                    {this.state.status ?
                        <ActivityIndicator size="large" color={'#e7552e'} />
                        :
                        <TouchableOpacity
                            onPress={() => this.loginUSerData()}
                            style={styles.buttonContainer}>
                            <Text style={styles.buttonText}>LogIn</Text>
                        </TouchableOpacity>
                    }
                </View>
            </KeyboardAvoidingView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    logoContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    logo: {
        width: 200,
        height: 200
    },
    title: {
        color: '#474747',
        opacity: 0.9,
        fontSize: 20
    },
    loginContainer: {
        paddingHorizontal: 40
    },
    input: {
        height: 50,
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 20,
        marginBottom: 15,
        color: '#474747',
        fontSize: 18,
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 18,
        lineHeight: 22,
    },
    buttonContainer: {
        backgroundColor: '#e7552e',
        paddingVertical: 15,
        width: 200,
        height: 50,
        alignSelf: 'center',
        marginTop: 20,
    },
    loader: {
        top: 10,
        alignItems: 'center'
    },
    langSwitch: {
        paddingTop: 20,
        paddingLeft: 40,
        paddingRight: 40,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    langSwitchText: {
        textAlign: 'right',
        fontSize: 20
    },
    forgotPwd: {
        textAlign: 'center',
        marginBottom: 30
    }
});
