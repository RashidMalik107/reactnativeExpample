import React, { Component } from 'react';
import { View, Text, StyleSheet, AsyncStorage, ScrollView, Image, TouchableOpacity, BackHandler } from 'react-native';
import axios from 'axios';
Global = require('../../Global');
import Header from './Header';

export default class Product extends Component {
  state = {
    promotion: false,
    productCategories: [],
    products: [],
    token: '',
    btnSelected: -2,
    language: false,
    total: 0,
    filters: false,
    brands: [],
    search: '',
    selectedBrands: '',
    selectedSizes: '',
    refreshing: false,
    productString: 'bundles',
    showfilters: false,
    openmodal: false,
    noBundles: true,
    location_id: '',
    userData: {},
    roleId: 0,
    // product card
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
    BackHandler.addEventListener('hardwareBackPress', this.handleBack);
    this.getProductsByCategory();
  }

  createEntryForCart(productType) {
    var price = this.state.products.price;
    let obj = {
      productId: this.state.products.id,
      productName: this.state.products.name,
      urduProductName: this.state.products.urdu_name,
      quantity: this.state.quantity,
      price: parseFloat(this.state.products.price).toFixed(2),
      totalAmount: parseFloat(price * this.state.quantity).toFixed(2),
      image: this.state.products.image_url,
      sku: this.state.products.sku,
      unit: this.state.products.unit,
      configurable: false,
      promotion: this.state.products.isPromotion,
      productType: 'simple'
    };
    if (productType == 'configurable') {
      obj['configurable'] = true;
      if (this.state.addedAmount == '') {
        alert('Please enter amount');
        return false;
      }
      if (this.state.selectedUnit == 'rs') {
        var quantity = (this.state.addedAmount / price).toFixed(2);
        obj['totalAmount'] = this.state.addedAmount;
      } else if (this.state.selectedUnit == 'g') {
        var quantity = (this.state.addedAmount / 1000).toFixed(2);
        obj['totalAmount'] = (parseFloat(price) * parseFloat(quantity)).toFixed(2);
      } else {
        var quantity = this.state.addedAmount;
        obj['totalAmount'] = (parseFloat(price) * parseFloat(quantity)).toFixed(2);
      }
      obj['quantity'] = parseFloat(quantity).toFixed(2);
      if (parseFloat(quantity) > this.product.max_quantity && this.product.isPromotion) {
        alert('You can only add limited quantity');
        return false;
      }
    }
    // else if(this.product.isPromotion && !this.product.configurable){
    //   obj['quantity'] = this.state.quantity;
    //   obj['totalAmount'] = this.product.price * this.state.quantity ;
    // }
    AsyncStorage.getItem("cart").then((cartValue) => {
      let cart = JSON.parse(cartValue);
      let x = 1;
      for (let i in cart) {
        if (cart[i].productId == this.product.id && cart[i].productType == 'simple') {
          x = 0;
          if (productType == 'configurable') {
            if ((parseFloat(cart[i].quantity) + parseFloat(quantity)) > this.product.max_quantity && this.product.isPromotion) {
              alert('You can only add limited quantity');
              return false;
            }
            cart[i].quantity = parseFloat(cart[i].quantity) + parseFloat(quantity);
            cart[i].quantity = cart[i].quantity.toFixed(2);
            cart[i].totalAmount = cart[i].quantity * cart[i].price;
          } else {
            if ((parseFloat(cart[i].quantity) + parseFloat(this.state.quantity)) > this.product.max_quantity && this.product.isPromotion) {
              alert('You can only add limited quantity');
              return false;
            }
            cart[i].quantity = parseFloat(cart[i].quantity) + parseFloat(this.state.quantity);
            cart[i].totalAmount = price * cart[i].quantity;
          }
          cart[i].totalAmount = cart[i].totalAmount.toFixed(2);
        }
      }

      if (x) {
        cart.push(obj);
      }
      AsyncStorage.setItem("cart", JSON.stringify(cart));
      this.calculateSum();
      if (productType == 'configurable') {
        this.setState({ switchCard: true });
      }
      var toast = 'Added ' + this.state.quantity + ' ' + obj.productName + ' to the cart successfully';
      ToastAndroid.show(toast, ToastAndroid.SHORT);
      if (!this.product.configurable && this.product.promotion) {
        this.setState({ quantity: this.max_quantity });
      } else {
        this.setState({ quantity: 1 });
      }
    });
  }
  

  addToCart(productType) {
    if (this.state.products.isOutOfStock) {
      alert('Item out of stock');
      return false;
    }
    if (!this.state.products.isPromotion) {
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

  addBundleItemstoCart() {
    AsyncStorage.getItem("cart").then((value) => {
      let obj = {
        bundleId: this.product.id,
        productName: this.product.name,
        quantity: this.state.quantity,
        price: parseFloat(this.product.price).toFixed(2),
        totalAmount: parseFloat(this.product.price * this.state.quantity).toFixed(2),
        image: this.product.image_url,
        items: this.product.bundleItems,
        productType: 'bundle',
        discount_rate: this.product.discount_rate
      };
      let cart = JSON.parse(value);
      var flag = true;
      for (var item of cart) {
        if (item.productType == 'bundle' && item.bundleId == this.product.id) {
          flag = false;
          item['quantity'] += this.state.quantity;
          item['totalAmount'] = item['quantity'] * item['price'];
        }
      }
      if (flag) {
        cart.push(obj);
      }
      AsyncStorage.setItem("cart", JSON.stringify(cart));
      this.calculateSum();
      var toast = 'Added to the cart successfully';
      ToastAndroid.show(toast, ToastAndroid.SHORT);

    });
  }

  calculateSum() {
    let sum = 0;
    AsyncStorage.getItem("cart").then((value) => {
      var cart = JSON.parse(value);
      for (let i in cart) {
        sum = parseFloat(sum) + parseFloat(cart[i].totalAmount);
      }
      sum = parseFloat(sum).toFixed(2);
      EventEmitter.emit("updateTotalAmount", sum);
    });
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

  constructor(props) {
    super(props);
    this.product = props.product;
    this.productString = props.productString;
    this.navigator = props.navigator;
    this.customerId = props.customerId;

  }


  renderProducts() {
    return this.state.products.map(product =>
      <View style={styles.CardContainer}>
        <View onPress={() => this.goToPage()} style={styles.CardWrapper}>
          <View style={styles.imageHolder}>
            <Image style={styles.signleImage} source={{ uri: product.image_url }} />
          </View>
          {this.state.products.isOutOfStock ? <Text>Out Of Stock</Text> : null}
          {product.configurable || product.productString == 'bundles' ? null :
            <Image style={styles.khulaIcon} resizeMode="contain" source={require('../images/khulaIcon.png')} />
          }
          <Text style={styles.name}>{product.name} </Text>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.size}>{product.size}</Text>
          {
            this.state.productString == 'bundles' ?
              null :
              <Text style={styles.price}>price: Rs {product.market_price}</Text>
          }
          <Text style={[styles.price, styles.specialPrice]}>Hypr price: Rs {product.promotion ? product.promotion_price : product.price}</Text>
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
                <Text style={styles.buttonText}>Add To Cart</Text>
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={() => this.addToCart('simple')} style={styles.buttonContainer}>
                <Text style={styles.buttonText}>Add To Cart</Text>
              </TouchableOpacity>
          }

        </View>

      </View>


    )
  }
  // for get request 

  // ** make a request url 
  // ** params doesn't go in object format instead passed with the request
  // ** var reqUrl = ('/product/getProductByCategory?sales_agent_id='+this.state.userId+'&customer_id='+this.state.customerId
  //  axios.get(Global.BASE_URL + reqUrl, { headers: { 'Authorization': value } })


  // for post request
  // ** make a request url 
  // ** obj is the object to send to the server (can be any varaible)
  // ** example  var obj = {
  // sales_agent_id: this.state.userId, customer_id: this.state.customerId
  //}
  // axios.post(Global.BASE_URL + reqUrl, obj, { headers: { 'Authorization': value } })

  getProductsByCategory() {
    debugger
    // this.getProductBrandAndSizesByCategory(id, value);
    this.setState({ refreshing: true, productString: 'byCategory', products: [] });
    AsyncStorage.getItem("authToken").then((value) => {
      var reqUrl = ('/product/getProductByCategory?category_id=1' + '&dashsizes=' + this.state.selectedSizes + '&brands=' + this.state.selectedBrands + '&search=' + this.state.search + '&promotion=' + this.state.promotion + '&location_id=1')
      axios.get(Global.BASE_URL + reqUrl, { headers: { 'Authorization': value } })
        .then(response => {
          debugger
          this.setState({ products: response.data.products, refreshing: false, showfilters: true });
        })
        .catch(response => {
          debugger
          alert('Error');
        })
    })
  }

  getProductBrandAndSizesByCategory(id, value) {
    debugger
    AsyncStorage.getItem("authToken").then((value) => {
      var reqUrl = ('/product/getProductBrandAndSizesByCategory?category_id=' + id, value)
      axios.get(Global.BASE_URL + reqUrl, { headers: { 'Authorization': value } })
        .then(response => {
          debugger
          this.setState({ brands: response.data.brands, sizes: response.data.sizes });
        })
        .catch(response => {
          debugger
          alert('Error');
        })
    })
  }


  render() {
    return (
      <View style={styles.container}>
        <Header navigator={this.props.navigation} />

        <ScrollView>
          <View style={styles.productContainer}>
            {this.renderProducts()}
          </View>
        </ScrollView>

        <View style={styles.cartBottom}>
          <View style={styles.totalBill}>
            <Text style={styles.amountLabel}>Total Bill</Text>
            <Text style={styles.amountVal}>Rs. {(this.state.total)} </Text>
          </View>
          <View style={styles.cartIcon}>
            <TouchableOpacity style={styles.cartContainer} onPress={() => this.goToCartPage()}>
              <Image style={styles.cartPng}
                source={require('../images/cart-icon.png')} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

    );
  }
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    flex: 1
  },
  loader: {
    top: 10,
    alignItems: 'center'
  },
  productContainer: {
    padding: 0,
    flexDirection: 'row',
    flexGrow: 1,
    flexWrap: 'wrap',
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20
  },
  promoBanner: {
    backgroundColor: '#e7552e',
    alignItems: 'center',
    marginLeft: 20,
    marginRight: 20,
    height: 40,
    justifyContent: 'center',
  },
  bannerText: {
    color: '#fff',
    fontSize: 18,
  },
  productCategoryName: {
    margin: 5,
    color: '#666',
    fontSize: 20,
    padding: 5,
    textAlign: 'center'
  },

  cartPng: {
    marginTop: 20
  },
  cartBottom: {
    flexDirection: 'row',
    marginLeft: 5,
    marginRight: 5,
  },
  cartIcon: {
    alignItems: 'flex-start',
    height: 74,
    width: 74,
    backgroundColor: '#e7552e',
    alignItems: 'center',
    borderWidth: 2,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderColor: "rgba(0,0,0,0.1)",
    borderTopRightRadius: 14,
  },
  totalBill: {
    alignItems: 'flex-start',
    flex: 2,
    paddingRight: 20,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingLeft: 20,
    borderWidth: 2,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: "rgba(0,0,0,0.1)",
    borderTopLeftRadius: 14,
  },
  heading: {
  },
  headingText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#474747",
  },
  amountLabel: {
    color: '#27213d',
    fontSize: 14
  },
  amountVal: {
    color: '#27213d',
    fontSize: 28,
    lineHeight: 32,
  },


  topSearch: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    position: 'relative',
  },
  searchField: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginRight: 20,
    fontSize: 14,
  },
  searchFieldRtl: {
    textAlign: 'right',
    marginRight: 0,
    marginLeft: 20,
  },
  searchLeftMargin: {
    marginLeft: 0,
  },
  searchRightMargin: {
    marginRight: 0,
  },
  btnSearch: {
    position: 'absolute',
    right: 40,
    bottom: 30,
    paddingRight: 10,
    borderRightWidth: 1,
    borderColor: '#ccc',
  },
  btnSearchRtl: {
    right: 'auto',
    left: 40,
    paddingRight: 0,
    borderRightWidth: 0,
    borderColor: '#ccc',
    paddingLeft: 10,
    borderLeftWidth: 1,
  },
  noBorder: {
    left: 10,
    borderLeftWidth: 0,
  },
  noBorderRight: {
    right: 10,
    borderRightWidth: 0,
  },
  btnFilter: {
    position: 'absolute',
    right: 10,
    bottom: 30,
  },
  btnFilterRtl: {
    right: 'auto',
    left: 10,
  },
  searchIcon: {
    width: 20,
    height: 20,
  },

  btnDropdown: {
    position: 'absolute',
    right: 10,
    top: 25
  },
  filterLabel: {
    lineHeight: 35 * 0.75,
    paddingTop: 35 - (35 * 0.75),
    paddingLeft: 20
  },
  filterLabelActive: {
    color: '#474747',
    fontSize: 22,
    paddingLeft: 20,
  },
  filtersActive: {
    backgroundColor: '#fff',
    position: 'absolute',
    top: 60,
    width: '100%',
    height: 60,
    borderBottomWidth: 2,
    borderColor: '#e7552e',
    paddingTop: 10
  },
  btnDropdownActive: {
    position: 'absolute',
    top: 27,
    right: 10,
  },
  invertArrow: {
    transform: [{ rotate: '180deg' }],
  },
  buttonContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#fc5b1f',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600'
  },


  // *********************************
  CardContainer: {
    width: '47%',
    padding: 5,
    marginLeft: 5,
    marginRight: 5,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  imageHolder: {
    width: 150,
    height: 150,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: '#ccc',
  },
  signleImage: {
    margin: 4,
    width: 140,
    height: 140,
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
