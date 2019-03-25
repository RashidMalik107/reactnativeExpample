import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage, Image, TouchableOpacity, Modal, ToastAndroid, Alert } from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';
Global = require('../../Global');

export default class Header extends Component {
    state = {

    }
    navigator = {};

    constructor(props) {
        super(props);
        this.navigator = props.navigator;
    }

    logout() {
        AsyncStorage.setItem('loggedIn', 'false');
        this.navigator.navigate('Login');
    }

    showLoginAlert() {
        Alert.alert(
            'Alert',
            'Are you sure you want to logout?',
            [
                { text: 'Yes', onPress: () => this.logout() },
            ],
            { cancelable: true }
        )
    }

    selectedOption(id, value) {
        if (id == 0) {
            this.markUnsuccessfulVisit();
        }
        else if (id == 1) {
            this.navigator.navigate('Help')
        } else if (id == 2) {
            this.showLoginAlert()
        }
    }


    render() {
        return (
            <View>
                <View style={styles.headerBar}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.navigator.navigate('DrawerOpen')} style={styles.menuContainer}>
                            <Image style={[styles.hamburgerButton]} resizeMode="contain" source={require('../images/menu-icon.png')} />
                        </TouchableOpacity>

                        <Image style={styles.logo} source={require('../images/logo.png')} resizeMode="contain" />

                        <ModalDropdown
                            options={['Mark', 'Help', 'signOut']}
                            onSelect={(idx, value) => this.selectedOption(idx, value)}
                            style={styles.dropdownBlock}
                            textStyle={styles.textStyle}
                            dropdownStyle={{ width: 160, height: 130 }}
                            dropdownTextStyle={{ paddingHorizontal: 15, paddingVertical: 8, fontSize: 18 }}
                        >
                            <View style={styles.menuButton}></View>
                        </ModalDropdown>

                    </View>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    headerBar: {
        borderTopRightRadius: 4,
        borderBottomRightRadius: 4
    },

    // -------- Modal Styling -----

    modalContainer: {
    },
    modalWrapper: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    modalinnerWrapper: {
        margin: 10,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    capturedimgHolder: {
        position: 'relative',
        display: 'flex',
        alignContent: 'center',
    },
    CapturedimgCross: {
        top: 3,
        right: 8,
        position: 'absolute',
    },
    CapturedimgCrosstext: {
        textAlign: 'center',
        color: '#e65400',
        fontSize: 35,
        lineHeight: 38,
    },
    textStyle: {
        color: '#e65400',
    },
    capturedimg: {
        position: 'relative',
        height: 150,
        width: '100%',
        marginBottom: 15,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
    },
    topContent: {
        marginBottom: 25,
        paddingHorizontal: 25,
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#474747'
    },
    modalAddress: {
        fontSize: 16,
        color: '#474747'
    },

    buttonHolder: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modelbtnReject: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        alignItems: "center",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: '#e65400',
        width: '50%',
        borderBottomLeftRadius: 8,
    },
    modelbtnAccept: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        alignItems: "center",
        backgroundColor: "#e65400",
        width: '50%',
        borderTopWidth: 1,
        borderTopColor: '#e65400',
        borderBottomRightRadius: 8,
    },

    // -------- Modal Styling -----


    header: {
        height: 65,
        paddingHorizontal: 15,
        paddingVertical: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "rgba(0,0,0,0.1)",
        borderBottomLeftRadius: 14,
        borderBottomRightRadius: 14,

    },
    logo: {
        width: 80,
    },
    title: {
        fontSize: 25,
        color: '#e65400'
    },

    captureImageHolder: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        width: '75%',
    },
    logout: {
        right: 0,
        position: 'absolute',
        color: '#e65400',
        width: 67,
        paddingRight: 28,
    },
    menuContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    menuButton: {
        width: 30,
        justifyContent: "center",
        alignItems: "center",
        height: 38,
        width: 38,
        backgroundColor: '#e65400',
        marginTop: 2,
        marginBottom: 2,
        borderRadius: 100,
    },
    hamburgerButton: {
        width: 30,
        height: 30,
        justifyContent: "center",
        alignItems: "center",
    },
    mainmenu: {
        paddingBottom: 8,
    },
    editStatusRow: {
        padding: 15,
        margin: 15,
        flexDirection: 'row',
        borderRadius: 3,
        backgroundColor: '#e65400',
    },
    editOrderNum: {
        width: '48%',
        alignSelf: 'flex-start',
        color: '#fff',
    },
    actionBtn: {
        width: '48%',
        alignSelf: 'flex-end',
        textAlign: 'right',
        color: '#fff',
    }
});
