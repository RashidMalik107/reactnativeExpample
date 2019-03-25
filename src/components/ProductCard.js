import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, AsyncStorage, ToastAndroid, Picker, TextInput } from 'react-native';
Global = require('../../Global');
// import RadioForm from 'react-native-simple-radio-button';

export default class ProductCard extends Component {
  state = {
    quantity: 1,
    switchCard: true,
    selectedUnit: 'rs',
    addedAmount: '',
    Check: false,
    Check1: false,
    radio_props: [],
  }
  goToPage() {
    if (this.productString == 'bundles') {
      this.navigator.navigate('Bundle', { product: this.product });
    } else if (!this.product.configurable && !this.product.promotion) {
      this.setState({ switchCard: false });
    }
  }

  componentWillMount() {
    if (!this.product.configurable && this.product.promotion) {
      this.setState({ quantity: this.max_quantity });
    }
  }

  addQuantity() {
    let quan = this.state.quantity;
    quan++;
    if (quan > this.product.max_quantity && this.product.isPromotion) {
      alert('You can only add limited quantity');
      return false;
    }
    this.setState({ quantity: quan });
  }

  subtractQuantity() {
    let quan = this.state.quantity;
    quan--;
    if (quan > 0) {
      this.setState({ quantity: quan });
    }
  }

  addToCart(productType) {
    if (this.product.isOutOfStock) {
      alert('Item out of stock');
      return false;
    }
    if (!this.product.isPromotion) {
      this.createEntryForCart(productType);
      return false;
    }
    if (productType == 'configurable') {
      debugger
      if (this.state.selectedUnit == 'rs') {
        this.product['quantity'] = (this.state.addedAmount / this.product.price).toFixed(2);
      } else if (this.state.selectedUnit == 'g') {
        this.product['quantity'] = (this.state.addedAmount / 1000).toFixed(2);
      } else {
        this.product['quantity'] = this.state.addedAmount;
      }
    } else {
      this.product['quantity'] = this.state.quantity;
    }
    this.product['customer_id'] = this.customerId;
    AsyncStorage.getItem("cart").then((value) => {
      var cart = JSON.parse(value);
      for (var item of cart) {
        if (item.productType == 'simple') {
          if (item.productId == this.product.id) {
            this.product['quantity'] = parseFloat(this.product['quantity']) + parseFloat(item.quantity);
          }
        }
      }
      AsyncStorage.getItem("authToken").then((value) => {
        httpService.postRequest('/product/checkInStockBuyableQuantity', value, this.product).then(response => {
          this.createEntryForCart(productType);
        })
          .catch(response => {
            alert(response.response.data.message);
          })
      });
    })
  }

  constructor(props) {
    super(props);

    this.product = props.product;
    this.languageString = props.language;
    this.productString = props.productString;
    this.navigator = props.navigator;
    this.customerId = props.customerId;
    this.setvalues();

  }
  setvalues() {
    console.log(this.product);
    var obj = this.state.radio_props;
    if (this.product.unit == 'Kilogram') {
      obj.push({ value: 'rs' }, { value: 'g' }, { value: this.product.unit });
    } else {
      obj.push({ value: 'rs' }, { value: this.product.unit });
    }
    this.setState({ radio_props: obj })
  }
  render() {
    return (
      <View style={styles.container}>
       
            <View onPress={() => this.goToPage()} style={styles.CardWrapper}>

              <View style={styles.imgwrapper}>
                <Image style={{ height: 140, width: 140, margin: 4 }} source={{ uri: this.product.image_url }} />
              </View>
              {this.product.isOutOfStock ? <Text>Out Of Stock</Text> : null}
              {this.product.configurable || this.productString == 'bundles' ? null :
                <Image style={styles.khulaIcon} resizeMode="contain" source={require('../images/khulaIcon.png')} />
              }
              <Text style={styles.name}>{this.product[this.languageString + 'name']} </Text>
              <Text style={styles.brand}>{this.product[this.languageString + 'brand']}</Text>
              <Text style={styles.size}>{this.product[this.languageString + 'size']}</Text>
              {
                this.productString == 'bundles' ?
                  null :
                  <Text style={styles.price}>price: Rs {this.product.market_price}</Text>
              }
              <Text style={[styles.price, styles.specialPrice]}>Hypr price: Rs {this.product.promotion ? this.product.promotion_price : this.product.price}</Text>
              <View>
                <View style={styles.quantityWrapper}>

                  <TouchableOpacity onPress={() => this.subtractQuantity()}>
                    <Image style={styles.QuantityIcon} resizeMode='contain' source={require('../images/quantity02.png')} />
                  </TouchableOpacity>

                  <Text style={styles.quantityMiddle}>{this.state.quantity}</Text>

                  <TouchableOpacity onPress={() => this.addQuantity()}>
                    <Image style={styles.QuantityIcon} resizeMode='contain' source={require('../images/quantity01.png')} />
                  </TouchableOpacity>

                </View>
              </View>

              {
                this.productString == 'bundles' ?
                  <TouchableOpacity onPress={() => this.addBundleItemstoCart()} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>{this.strings.addToCart}</Text>
                  </TouchableOpacity>
                  :
                  <TouchableOpacity onPress={() => this.addToCart('simple')} style={styles.buttonContainer}>
                    <Text style={styles.buttonText}>{this.strings.addToCart}</Text>
                  </TouchableOpacity>
              }

            </View>
           
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    width: '47%',
    padding: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imgwrapper: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#ccc',
  },
  CardWrapper: {
    padding: 5,
    marginBottom: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nameWrapper: {
    width: 150,
    height: 50,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 16,
    lineHeight: 20,
    height: 40,
    marginTop: 5,
    color: '#27213d',
    textAlign: 'center',
  },
  touchName: {
    fontSize: 16,
    color: '#474747',
  },
  touchPrice: {
    fontSize: 14,
    color: '#474747',
  },
  touchEnterAmount: {

  },
  brand: {
    fontSize: 14,
    lineHeight: 16,
    height: 15,
  },
  size: {
    fontSize: 14,
    lineHeight: 16,
    height: 15,
  },
  price: {
    fontSize: 14,
    marginTop: 10,
    color: '#474747'
  },
  specialPrice: {
    marginTop: 5,
  },
  quantityWrapper: {
    padding: 10,
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: 'center',
  },
  QuantityIcon: {
    width: 20,
    height: 20,
  },
  quantityMiddle: {
    width: 32,
    height: 25,
    fontSize: 16,
    color: '#474747',
    borderWidth: 1,
    marginLeft: 10,
    borderRadius: 2,
    marginRight: 10,
    textAlign: 'center',
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  subtractQty: {
    fontSize: 40,
  },
  checkboxControl: {
    padding: 0,
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '300',
    textAlign: 'center',
    fontFamily: 'Roboto-Regular',
  },
  checkboxBlock: {
    marginBottom: 10,
  },
  buttonContainer: {
    width: 150,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#e65400',
    paddingVertical: 10,
    backgroundColor: '#e65400',
  },
  khulaIcon: {
    top: 0,
    left: 0,
    width: 50,
    height: 44,
    position: 'absolute',
  },
  formSection: {
    marginBottom: 30,
  },
  radioButtons: {

  },
  sectionTitle: {
    fontSize: 16,
    color: '#474747',
    marginBottom: 10,
  },
  paymentMethods: {
    flexDirection: 'row',
  },
  paymentMethodsUrdu: {
    flexDirection: 'row',
  },
  paymentButtons: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  paymentButtonsLeft: {
    top: 0,
    flex: 2,
    position: 'absolute',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  paymentMethodLabel: {
    justifyContent: 'flex-start',
  },
  paymentMethodLabelRight: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
  radioLabel: {
    fontSize: 20,
    marginBottom: 6,
    color: '#757575',
  },
  backIcon: {
    marginRight: 50
  }
});
