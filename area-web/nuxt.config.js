import colors from 'vuetify/es5/util/colors';
require('dotenv').config();

const isProd = process.env.NODE_ENV === 'production';
const baseUrl = `${isProd ? process.env.PROD_BASE_URL : process.env.DEV_BASE_URL}/api`;
const apiUrl = isProd ? process.env.PROD_API_URL : process.env.DEV_API_URL;
const docUrl = isProd ? process.env.PROD_DOC_URL : process.env.DEV_DOC_URL;

export default {
    mode: 'universal',

    /*
    ** Headers of the page
    */
    head: {
        titleTemplate: '%s - ' + process.env.npm_package_name,
        title: 'Area',
        meta: [
            { charset: 'utf-8' },
            { name: 'viewport', content: 'width=device-width, initial-scale=1' },
            { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
        ],
        link: [
            { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
        ]
    },
    /*
    ** Customize the progress-bar color
    */
    loading: true,
    /*
    ** Global CSS
    */
    css: [
        '@/assets/main.scss'
    ],
    /*
    ** Plugins to load before mounting the App
    */
    plugins: [
        {
            src: '~/plugins/oauth.js',
            mode: 'client'
        },
        {
            src: '~/plugins/messages.js',
            mode: 'client'
        }
    ],
    /*
    ** Nuxt.js dev-modules
    */
    buildModules: [
        // Doc: https://github.com/nuxt-community/eslint-module
        '@nuxtjs/eslint-module',
        '@nuxtjs/vuetify'
    ],
    /*
    ** Nuxt.js modules
    */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/pwa',
        // Doc: https://github.com/nuxt-community/dotenv-module
        '@nuxtjs/dotenv',
        '@nuxtjs/auth',
        'cookie-universal-nuxt'
    ],

    router: {
        middleware: ['auth']
    },

    /*
    ** Axios module configuration
    ** See https://axios.nuxtjs.org/options
    */
    axios: {
        baseURL: baseUrl,
        browserUrl: baseUrl,
        prefix: baseUrl,
        proxy: true
    },

    /*
    ** Setup proxy to link area api to /api route
    */
    proxy: {
        '/api': {
            target: apiUrl,
            pathRewrite: {
                '^/api': '/'
            }
        },
        '/docs/dev': {
            target: `${docUrl}/dev`,
            pathRewrite: {
                '^/docs/dev': '/'
            }
        }
    },

    /*
    ** vuetify module configuration
    ** https://github.com/nuxt-community/vuetify-module
    */
    vuetify: {
        customVariables: ['~/assets/variables.scss'],
        theme: {
            themes: {
                light: {
                    primary: colors.lightBlue.darken1,
                    accent: '#eeeeee',
                    background: '#eeeeee',
                    secondary: '#151b2b',
                    tertiary: '#3c4154',
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3
                },
                dark: {
                    primary: colors.lightBlue.darken1,
                    accent: '#eeeeee',
                    background: '#3c4154',
                    secondary: '#151b2b',
                    tertiary: '#3c4154',
                    info: colors.teal.lighten1,
                    warning: colors.amber.base,
                    error: colors.deepOrange.accent4,
                    success: colors.green.accent3
                }
            }
        }
    },

    /*
    ** Build configuration
    */
    build: {
        /*
        ** You can extend webpack config here
        */
        extend (config, ctx) {
        }
    },

    /*
    ** Auth configuration
    */
    auth: {
        strategies: {
            local: {
                endpoints: {
                    login: {
                        url: '/auth/signin',
                        method: 'post',
                        propertyName: 'data.token'
                    },
                    user: {
                        url: '/me',
                        methode: 'get',
                        propertyName: 'data'
                    },
                    logout: false
                },
                tokenRequired: true,
                tokenName: 'Authorization',
                tokenType: 'Bearer'
            },

            oauth: {
                _scheme: 'local',
                endpoints: {
                    login: {
                        url: '/auth/oauth/signin',
                        method: 'post',
                        propertyName: 'data.token'
                    },
                    user: {
                        url: '/me',
                        methode: 'get',
                        propertyName: 'data'
                    },
                    logout: false
                },
                tokenRequired: true,
                tokenName: 'Authorization',
                tokenType: 'Bearer'
            }
        },
        redirect: {
            login: '/auth/signin',
            logout: '/auth/signin',
            home: '/',
            user: '/me'
        }
    }
};
