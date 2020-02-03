<template>
    <v-layout
        column
        justify-center
        align-center
    >
        <v-flex
            class="align-self-stretch"
        >
            <v-card class="headline">
                <v-card-title>Sign up to Area</v-card-title>
                <v-card-text>
                    <v-text-field
                        label="Username"
                        outlined
                    />
                    <v-text-field
                        label="E-mail"
                        outlined
                    />
                    <v-text-field
                        label="Password"
                        outlined
                    />
                    <v-text-field
                        label="Confirm password"
                        outlined
                    />
                    <v-layout justify-center align-center>
                        <v-flex xs3 row>
                            <v-btn
                                elevation="0"
                                color="primary"
                                rounded
                                block
                            >
                                Sign up
                            </v-btn>
                        </v-flex>
                    </v-layout>
                    <v-flex mt-8>
                        <v-layout justify-center align-center row>
                            <v-flex class="grey darken-3 text-center" mb-n7 xs1>
                                <p>Or</p>
                            </v-flex>
                        </v-layout>
                        <v-divider />
                    </v-flex>
                </v-card-text>
                <v-card-title>Sign up with:</v-card-title>
                <v-card-text>
                    <v-layout justify-center>
                        <v-flex xs6>
                            <v-layout justify-space-around>
                                <div v-for="service in services">
                                    <v-tooltip top>
                                        <template v-slot:activator="{ on }">
                                            <v-btn
                                                :color="service.background"
                                                elevation="0"
                                                fab
                                                v-on="on"
                                                v-on:click="redirectToOauth(service.name)"
                                            >
                                                <v-icon :color="service.foreground">mdi-star</v-icon>
                                            </v-btn>
                                        </template>
                                        <span>Sign up with {{ service.displayName }}</span>
                                    </v-tooltip>
                                </div>
                            </v-layout>
                        </v-flex>
                    </v-layout>
                </v-card-text>
                <v-card-actions>
                    <v-layout justify-center>
                        <p class="font-weight-light body-2">
                            Already a member ? <nuxt-link class="link-light" to="/auth/signin">Sign in now</nuxt-link>
                        </p>
                    </v-layout>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
 export default {
     auth: 'guest',

     async asyncData ({ $axios, $auth }) {
         const resServices = await $axios.$get('/services');

         console.log('logged:', $auth.loggedIn);

         if (resServices.status !== 'success') {
             return { services: [] };
         }

         return {
             services: resServices.data
         };
     },

     methods: {
         redirectToOauth (service) {
             this.$store.commit('userAction/setAction', 'signin');
             this.$store.commit('userAction/setUrl', this.$nuxt.$route.path);
             this.$router.push(`oauth/${service}/redirect`);
         }
     }
 };
</script>
