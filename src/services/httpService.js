import axios from 'axios';
Global = require('../../Global');

export function getRequest(path, token) {
 return axios.get(Global.BASE_URL + path, { headers: { 'Authorization': token } })
}
export function postRequest(path, token, objectToSend) {
    return axios.post(Global.BASE_URL + path , objectToSend , { headers: { 'Authorization': token } })
}
export var PRIMARY_COLOR = '#e65400'
export var BASIC_BUTTON_STYLING = {
    color: 'red'
}
export var API_KEY = 'AIzaSyBehU3XJB9EAccnrbXWcY_yDg_rg2s-EXc'
  