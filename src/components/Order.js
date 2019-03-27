import React, { Component } from 'react';
import { View, Text, Modal, StyleSheet, Image, BackHandler, AsyncStorage, ScrollView, TouchableOpacity, TextInput, RefreshControl, Picker } from 'react-native';
import axios from 'axios';
Global = require('../../Global');
import DatePicker from 'react-native-datepicker';
import Header from './Header';


export default class Order extends Component {
	state = {
		orders: [],
		requestSent: false,
		language: '',
		search: '',
		refreshing: false,
		selectedStatusCheck: 'all',
		startDate: '',
		show: false,
		endDate: '',
		roleId: '',
	}
	search = '';
	page = 1;
	orderStatusId = '';

	handleBack = (() => {
		this.props.navigation.navigate('Product');
		BackHandler.removeEventListener('hardwareBackPress', this.handleBack);
		return true;
	}).bind(this)

	componentWillMount() {
		BackHandler.addEventListener('hardwareBackPress', this.handleBack);
		this.getOrders();
	}

	getOrders() {
		debugger
		if (this.state.requestSent) {
			return false;
		}
		this.setState({ refreshing: true, productString: 'byCategory', products: [] });
		AsyncStorage.getItem("authToken").then((value) => {
			var reqUrl = ('/order/getOrdersBySalesAgent?page=' + this.page + '&sales_agent_id=51' + '&search=' + this.search + '&orderStatusId=9' + '&startDate=' + this.state.startDate + '&endDate=' + this.state.endDate)
			axios.get(Global.BASE_URL + reqUrl, { headers: { 'Authorization': value } })
				.then(response => {
					debugger
					if (response.data.orders.length > 0) {
						this.page++;
					}
					debugger
					var orders = response.data.orders;
					var currentOrders = this.state.orders;
					for (var order of orders) {
						currentOrders.push(order);
					}
					this.setState({ orders: currentOrders, refreshing: false, requestSent: false });
				})
				.catch(response => {
					alert(response);
					this.setState({ refreshing: false, requestSent: false });
				})
		})
	}

	constructor(props) {
		super(props);
		this.item = props.item;

		AsyncStorage.setItem('screen', 'Orders');
		super(props);
		if (this.props.navigation.state.params == undefined || JSON.stringify(this.props.navigation.state.params) == '{}') {
			this.orderStatusId = '';
		} else {
			this.orderStatusId = this.props.navigation.state.params.orderStatus;
		}

	}
	refresh() {
		this.setState({ orders: [] });
		this.page = 1;
		this.getOrders();
	}

	renderOrders() {
		return this.state.orders.map(order => 
				
				<View style={styles.itemContainer}>
					<Text style={styles.TextCenter}>{order.name} - {order.size}</Text>

					<View style={styles.row}>
						<Text style={styles.infoLabel}>Brand: </Text>
						<Text style={styles.infoValue}>{order.brand}</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.infoLabel}>Quantity: </Text>
						<Text style={styles.infoValue}>{item.quantity}</Text>
					</View>

					<View style={styles.row}>
						<Text style={styles.infoLabel}>Price: Rs</Text>
						<Text style={styles.infoValue}>{item.price}</Text>
					</View>

				</View>
		
		)
	}

	render() {
		return (

			<ScrollView style={styles.container} refreshControl={
				<RefreshControl
					refreshing={this.state.refreshing}
					onRefresh={this.refresh.bind(this)}
				/>
			} onScroll={({ nativeEvent }) => {
				if (this.isCloseToBottom(nativeEvent)) {
					this.getOrders();
				}
			}}
				scrollEventThrottle={400}>
				<Header navigator={this.props.navigation} />
				<View style={styles.topSearch}>
					<TextInput
						style={styles.searchField}
						underlineColorAndroid="transparent"
						placeholder='Search'
						placeholderTextColor="rgba(39,33,61,0.87)"
						placeholderStyle={styles.placeholderText}
						onChangeText={(text) => this.setState({ search: text })}
						value={this.state.search}
						onSubmitEditing={() => this.searchOrders()} />

					<TouchableOpacity
						style={styles.btnSearch}
						onPress={() => this.searchOrders()}>
						<Image style={styles.searchIcon} resizeMode='contain' source={require('../images/search-icon.png')} />
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.btnFilter}
						onPress={() => this.showmodal()}>
						<Image style={styles.searchIcon} resizeMode='contain' source={require('../images/filter.png')} />
					</TouchableOpacity>

				</View>

				<View style={styles.topHeading}>
					<Text style={[styles.headingText, styles.nameTitle]}>Name</Text>
					<Text style={[styles.headingText, styles.statusTitle]}>Order Status</Text>
				</View>

				<View>
					<ScrollView>
						{this.renderOrders()}
					</ScrollView>
				</View>



			</ScrollView>
		);
	}
}


const styles = StyleSheet.create({
	filterModalUpperSection: {
		flex: 1,
	},
	modelbtnHolder: {
		paddingVertical: 15,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	modelbtnApply: {
		paddingHorizontal: 10,
		paddingVertical: 15,
		borderRadius: 3,
		marginLeft: 5,
		marginRight: 5,
		alignItems: "center",
		backgroundColor: "#e65400",
		width: 120
	},
	modelbtnCancel: {
		paddingHorizontal: 10,
		paddingVertical: 15,
		borderRadius: 3,
		marginLeft: 5,
		marginRight: 5,
		alignItems: "center",
		backgroundColor: "#fff",
		borderWidth: 1,
		borderColor: '#e65400',
		width: 120
	},
	backBar: {
		padding: 15,
		color: '#fff',
	},
	dateContainer: {
		flexDirection: "row",
	},
	statusheading: {
		fontSize: 20,
		paddingTop: 10,
		paddingLeft: 20,

	},
	input: {
		height: 50,
		backgroundColor: 'rgba(255, 255, 255,0.3)',
		paddingHorizontal: 10,
		marginBottom: 10,
		color: '#474747',
		fontSize: 18,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: '#ccc'
	},
	outerCircleIcon: {
		width: 20,
		height: 20,
		alignItems: 'center',
		borderRadius: 100 / 2,
		justifyContent: 'center',
		backgroundColor: 'orange',
	},
	innerCircleIcon: {
		width: 13,
		height: 13,
		borderRadius: 100 / 2,
		backgroundColor: 'white'
	},
	loader: {
		top: 10,
		alignItems: 'center'
	},
	container: {
		backgroundColor: 'white'
	},
	modalBlock: {
		backgroundColor: "rgba(0,0,0,0.75)",
	},
	containerModal: {
		flex: 1,
		padding: 10,
		backgroundColor: "rgba(0,0,0,0.1)",
	},
	contentsModal: {
		flex: 1,
		paddingVertical: 15,
		position: "relative",
		paddingHorizontal: 15,
		backgroundColor: "#ffffff",
	},
	closemodalBtn: {
		textAlign: 'right',
		alignSelf: 'flex-end',
		justifyContent: 'flex-end',
	},
	topHeading: {
		paddingTop: 10,
		paddingBottom: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
	},
	headingText: {
		//flex:1,
		fontSize: 20,
		width: '50%',
		color: '#474747',
	},
	nameTitle: {
		textAlign: 'center',
	},
	statusTitle: {
		paddingLeft: 0,
	},
	topSearch: {
		paddingHorizontal: 20,
		paddingVertical: 15,
		position: 'relative',
	},
	searchField: {
		marginRight: 20,
		borderColor: '#ccc',
		borderBottomWidth: 1,
	},
	btnSearch: {
		right: 40,
		bottom: 30,
		paddingRight: 10,
		position: 'absolute',
		borderRightWidth: 1,
		borderColor: '#ccc',
	},
	btnFilter: {
		right: 10,
		bottom: 30,
		position: 'absolute',
	},
	searchIcon: {
		width: 20,
		height: 20,
	},
	filterDropdown: {
		height: 50,
		marginLeft: 20,
		marginRight: 20,
		marginBottom: 10,
		borderBottomWidth: 1,
		borderColor: 'rgba(0,0,0,.8)',
	},
	btnDropdown: {
		top: 25,
		right: 10,
		position: 'absolute',
	},
	filterLabel: {
		paddingLeft: 20,
		lineHeight: 35 * 0.75,
		paddingTop: 35 - (35 * 0.75),
	},
	heading: {
		width: '50%',
		fontSize: 15,
		color: '#474747',
		paddingTop: 10,
		paddingBottom: 10,
	},
});
