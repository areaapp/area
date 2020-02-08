<template>
    <v-app
        :style="{ background: $vuetify.theme.themes[theme].background }"
    >
        <v-navigation-drawer
            v-model="drawer"
            fixed
            app
            class="secondary elevation-0 accent--text"
            dark
        >
            <v-flex class="py-4">
                <v-row class="justify-center">
                    <AreaLogo />
                    <p class="text-center subtitle-2 font-weight-regular">
                        An automation tool to connect your applications
                    </p>
                </v-row>
            </v-flex>
            <v-list>
                <v-list-item
                    v-for="(item, i) in items"
                    :key="i"
                    :to="item.to"
                    router
                    exact
                >
                    <v-list-item-action>
                        <v-icon class="primary--text">
                            {{ item.icon }}
                        </v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                        <v-list-item-title v-text="item.title" />
                    </v-list-item-content>
                </v-list-item>
            </v-list>
            <template
                v-if="$auth.loggedIn"
                v-slot:append
            >
                <v-row class="justify-center my-5">
                    <v-btn class="primary--text" color="normal" light>
                        Create a new area <v-icon right>mdi-plus-circle</v-icon>
                    </v-btn>
                </v-row>
                <div class="px-6">
                    <v-divider></v-divider>
                </div>
                <v-col>
                    <v-flex class="pa-3">
                        <v-row class="px-4" align="center">
                            <v-avatar color="primary" class="mr-3">
                                <!-- <img :src="avatar" :alt="user.username" /> -->
                                <span class="accent--text healine font-weight-bold text-capitalize">
                                    {{ user.username[0] }}
                                </span>
                            </v-avatar>
                            <v-col>
                                <v-row>
                                    <span class="caption font-weight-bold">{{ user.username }}</span>
                                </v-row>
                                <v-row>
                                    <span class="caption mr-2">
                                        3
                                        <v-icon x-small>mdi-puzzle</v-icon>
                                    </span>
                                    <span class="caption">
                                        13
                                        <v-icon x-small>mdi-vector-square</v-icon>
                                    </span>
                                </v-row>
                            </v-col>
                        </v-row>
                        <v-row class="py-4 justify-center">
                            <v-switch
                                v-model="darkTheme"
                                hide-details
                                inset
                                label="Toggle dark theme"
                                color="primary"
                                class="accent--text"
                            >
                            </v-switch>
                        </v-row>
                        <v-row class="ma-4">
                            <v-btn
                                v-on:click="signout"
                                block
                                small
                                class="error"
                            >
                                <v-icon small>mdi-exit-run</v-icon>
                                Sign out
                            </v-btn>
                        </v-row>
                    </v-flex>
                </v-col>
            </template>
        </v-navigation-drawer>
        <v-app-bar
            class="secondary"
            fixed
            app
            flat
            dark
        >
            <v-app-bar-nav-icon class="accent--text" @click.stop="drawer = !drawer" />
            <v-spacer></v-spacer>
            <v-toolbar-title>{{ title }}</v-toolbar-title>
            <v-spacer></v-spacer>
        </v-app-bar>
        <v-content>
            <v-container>
                <nuxt />
            </v-container>
        </v-content>
    </v-app>
</template>

<script>
 import AreaLogo from '../components/AreaLogo.vue';

 export default {
     components: {
         AreaLogo
     },

     data () {
         return {
             drawer: true
         };
     },

     computed: {
         darkTheme: {
             get () {
                 return this.$store.state.darkTheme;
             },

             set (value) {
                 this.$vuetify.theme.isDark = value;
                 this.$store.dispatch('setDarkTheme', value);
             }
         },

         title () {
             return this.$store.state.pageTitle;
         },

         theme () {
             return this.$vuetify.theme.dark ? 'dark' : 'light';
         },

         user () {
             if (this.$auth.loggedIn) {
                 return this.$auth.user;
             }
             return null;
         },

         items () {
             if (!this.$auth.loggedIn) {
                 return [
                     {
                         icon: 'mdi-login-variant',
                         title: 'Sign in',
                         to: '/auth/signin'
                     },
                     {
                         icon: 'mdi-login-variant',
                         title: 'Sign up',
                         to: '/auth/signup'
                     }
                 ];
             }
             return [
                 {
                     icon: 'mdi-apps',
                     title: 'Home',
                     to: '/'
                 },
                 {
                     icon: 'mdi-puzzle',
                     title: 'Services',
                     to: '/services'
                 },
                 {
                     icon: 'mdi-settings',
                     title: 'Settings',
                     to: '/settings'
                 }
             ]
         }
     },

     mounted () {
         this.$vuetify.theme.isDark = this.darkTheme;
     },

     methods: {
         async signout () {
             await this.$auth.logout();
         }
     }
 };
</script>
