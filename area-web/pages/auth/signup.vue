<template>
    <v-layout
        column
        justify-center
        align-center
    >
        <v-flex
            class="align-self-stretch"
        >
            <v-card class="signup secondary" dark>
                <v-card-title>Sign up to Area</v-card-title>
                <v-card-text>
                    <Errors :errors="errors" />
                    <v-form
                        ref="signForm"
                        v-model="validForm"
                    >
                        <v-text-field
                            :rules="[rules.required, rules.userLen]"
                            v-model="username"
                            label="Username"
                            outlined
                        />
                        <v-text-field
                            :rules="[rules.required, rules.validEmail]"
                            v-model="email"
                            label="E-mail"
                            outlined
                            type="email"
                        />
                        <v-text-field
                            :rules="[rules.required]"
                            :type="showPass ? 'text' : 'password'"
                            :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                            v-model="password"
                            @click:append="showPass = !showPass"
                            label="Password"
                            outlined
                        />
                        <v-text-field
                            :rules="[rules.required, rules.passMatch]"
                            :type="showPass2 ? 'text' : 'password'"
                            :append-icon="showPass2 ? 'mdi-eye' : 'mdi-eye-off'"
                            v-model="confirmPassword"
                            @click:append="showPass2 = !showPass2"
                            label="Confirm password"
                            outlined
                        />
                        <v-layout justify-center align-center>
                            <v-flex xs10 md3 row>
                                <v-btn
                                    :disabled="!validForm"
                                    v-on:click="signup"
                                    elevation="0"
                                    color="primary"
                                    rounded
                                    block
                                >
                                    Sign up
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-form>
                    <v-flex mt-8>
                        <v-layout justify-center align-center row>
                            <v-flex class="secondary text-center" mb-n7 xs1>
                                <p>Or</p>
                            </v-flex>
                        </v-layout>
                        <v-divider />
                    </v-flex>
                </v-card-text>
                <v-card-title>Sign up with:</v-card-title>
                <v-card-text>
                    <SocialAuth :services="services" />
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
 import SocialAuth from '../../components/SocialAuth.vue';
 import Errors from '../../components/Errors.vue';

 export default {
     auth: 'guest',

     components: {
         SocialAuth,
         Errors
     },

     data () {
         return {
             title: 'Sign up',
             username: '',
             email: '',
             password: '',
             confirmPassword: '',
             showPass: false,
             showPass2: false,
             validForm: false,
             rules: {
                 required: val => !!val || 'This field is required.',
                 validEmail: val => this.validateEmail(val) || 'Invalid e-mail.',
                 passMatch: val => (this.password && val === this.password) || 'Passwords don\'t match.',
                 userLen: val => val.length >= 5 || 'Size of username must be at least 5 characters.'
             }
         };
     },

     computed: {
         services () {
             return this.$store.state.services;
         }
     },

     asyncData ({ areaErrors }) {
         return {
             errors: areaErrors || []
         };
     },

     mounted () {
         this.$store.commit('setTitle', this.title);
     },

     methods: {
         validateEmail (email) {
             if (email === undefined) {
                 return true;
             }
             const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g; // eslint-disable-line
             const res = email.match(re);
             return !!res;
         },

         async signup () {
             const data = {
                 username: this.username,
                 email: this.email,
                 password: this.password
             };
             try {
                 await this.$axios.$post('auth/signup', data);
                 await this.$auth.loginWith('local', { data });
             } catch (e) {
                 this.errors.push({
                     message: e.response.data.message
                 });
             }
         }
     }
 };
</script>
