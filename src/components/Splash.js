import React, { Component } from 'react';
import { View, Text, StyleSheet, Platform, AsyncStorage, Image, PermissionsAndroid, Linking, Alert, ActivityIndicator, NetInfo, navigator } from 'react-native';

export default class Splash extends Component {

  state = {
    isloading: true,
  }

  constructor(props) {
    super(props);
  }
  componentWillMount() {
    setTimeout(() => { this.props.navigation.navigate('Login') }, 3000)
  }

  render() {

    return (
      <View style={styles.wrapper}>
        <View style={styles.logoContainer}>
          <Image style={styles.logo} source={require('../images/logo.png')} resizeMode="contain" />
        </View>
        <View style={styles.subtitleWrapper}>
          <Text style={styles.subtitle}>POWERED BY SHOPDEV </Text>
        </View>
        {
          this.state.isloading ?
            <View style={{ paddingTop: 50 }}>
              <ActivityIndicator size="large" color="#e7552e" />
            </View>
            : null
        }
      </View>
    );
  }
}


const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: 'white',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  title: {
    color: 'orange',
    fontSize: 35,
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#e7552e',
    fontWeight: '200',
    paddingBottom: 20
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center'
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  logo: {
    width: 200,
    height: 200
  },
});
