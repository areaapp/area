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
                <v-card-title>Sign in to Area</v-card-title>
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
                                                :to="`oauth/${service.name}/redirect`"
                                                v-on="on"
                                                elevation="0"
                                                fab
                                                nuxt
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
     async asyncData ({ $axios }) {
         const data = { services: [] };
         const res = await $axios.$get('/services');

         if (res.status !== 'sucess') {
             return data;
         }

         data.services = res.data;
         return data;
     }
 };
</script>
