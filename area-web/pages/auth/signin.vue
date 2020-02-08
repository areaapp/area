<template>
    <v-layout
        column
        justify-center
        align-center
    >
        <v-flex
            class="align-self-stretch"
        >
            <v-card class="signin secondary" dark>
                <v-card-title>Sign in to Area</v-card-title>
                <v-card-text>
                    <v-alert v-for="error in errors" type="error" dismissible>
                        {{ error.message }}
                    </v-alert>
                    <v-form
                        ref="signForm"
                        v-model="validForm"
                    >
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
                        <v-layout justify-center align-center>
                            <v-flex xs10 md3 row>
                                <v-btn
                                    :disabled="!validForm"
                                    v-on:click="signin"
                                    elevation="0"
                                    color="primary"
                                    rounded
                                    block
                                >
                                    Sign in
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
                <v-card-title>Sign in with:</v-card-title>
                <v-card-text>
                    <SocialAuth :services="services" />
                </v-card-text>
                <v-card-actions>
                    <v-layout justify-center>
                        <p class="font-weight-light body-2">
                            Not a member ? <nuxt-link class="link-light" to="/auth/signin">Sign up now</nuxt-link>
                        </p>
                    </v-layout>
                </v-card-actions>
            </v-card>
        </v-flex>
    </v-layout>
</template>

<script>
 import SocialAuth from '../../components/SocialAuth.vue';

 export default {
     auth: 'guest',

     components: {
         SocialAuth
     },

     data () {
         return {
             title: 'Sign in',
             email: '',
             password: '',
             showPass: false,
             showPass2: false,
             validForm: false,
             rules: {
                 required: val => !!val || 'This field is required.'
             }
         };
     },

     computed: {
         services () {
             return this.$store.state.services;
         }
     },

     asyncData ({ query }) {
         const errors = [];

         if (query.error) {
             errors.push({
                 message: query.error
             });
         }

         return { errors };
     },

     mounted () {
         this.$store.commit('setTitle', this.title);
     },

     methods: {
         async signin () {
             const data = {
                 email: this.email,
                 password: this.password
             };
             try {
                 await this.$auth.loginWith('local', { data });
             } catch (e) {
                 this.errors.push({
                     message: e.message
                 });
             }
         }
     }
 };
</script>
