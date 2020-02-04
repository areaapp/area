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
                <div class="px-6">
                    <v-divider></v-divider>
                </div>
                <v-flex class="pa-3">
                    <v-col class="justify-space-around">
                        <v-switch
                            v-model="darkTheme"
                            hide-details
                            inset
                            label="Toggle dark theme"
                        >
                        </v-switch>
                        <v-btn
                            v-on:click="signout"
                            block
                            class="error"
                        >
                            <v-icon>mdi-exit-run</v-icon>
                            Sign out
                        </v-btn>
                    </v-col>
                </v-flex>
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
                 this.$store.dispatch('setDarkTheme', value);
             }
         },

         title () {
             return this.$store.state.pageTitle;
         },

         theme () {
             return this.$vuetify.theme.dark ? 'dark' : 'light';
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

     watch: {
         darkTheme (val) {
             this.$vuetify.theme.isDark = val;
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
