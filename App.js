import React from 'react';
import { AppRegistry, StyleSheet, ScrollView } from 'react-native';
import { DrawerItems,DrawerNavigator } from 'react-navigation';
import Splash from './src/components/Splash';
import Login from './src/components/Login';
import Product from './src/components/Product';

const Drawer = DrawerNavigator(
  {
    Product: {
      path: '/Product',
      screen: Product
    },
    Login: {
      path: '/Login',
      screen: Login
    },
    Splash: {
      path: '/',
      screen: Splash,
      navigationOptions: ({navigation}) => ({
        drawerLockMode: 'locked-closed'
      })
    },
  },
  {
    initialRouteName: 'Splash',
    drawerPosition: 'left',
    backBehavior: 'none',
    contentComponent: props => {
      var propsCopy = Object.assign({}, props);
      return (
        <ScrollView><DrawerItems {...propsCopy} /></ScrollView>
      )
    },
    contentOptions: {
      activeTintColor: 'orange',
      style: {
      },
      labelStyle: {
        fontSize: 20,
      }
    }
  }
)

const styles = StyleSheet.create({ });
AppRegistry.registerComponent('testExample', () => Drawer);
