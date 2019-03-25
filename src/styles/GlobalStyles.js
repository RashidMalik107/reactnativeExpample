'use strict';

var React = require('react-native');

var {
  StyleSheet,
} = React;

module.exports = StyleSheet.create({
  outerCircleIcon: {
    width: 20,
    height: 20,
    borderRadius: 100/2,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircleIcon: {
    width: 13,
    height: 13,
    borderRadius: 100/2,
    backgroundColor: 'white'
  },
  alwaysred: {
    backgroundColor: 'red',
    height: 100,
    width: 100,
},
});
