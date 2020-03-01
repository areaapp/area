'use strict'

const axios = require('axios');
const querystring = require('querystring');

module.exports = {
    authType: 'none',
    name: 'openweathermap',
    displayName: 'OpenWeatherMap',
    description: 'OpenWeatherMap is an online service that provides weather data.',
    baseUrl: 'https://openweathermap.org/',
    iconName: 'weather-partly-cloudy',
    foreground: '#ffffff',
    background: '#505050'
}
