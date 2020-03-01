<template>
    <v-col class="mt-10" align="center" justify="center">
        <v-avatar size="18vh">
            <img :src="userAvatar" :alt="user.username">
        </v-avatar>
        <h2 class="my-5 display-1">{{ user.username }}</h2>
        <v-row class="title my-2" align="center" justify="center">
            <span class="mr-2">{{ userServicesNb }} services</span>
            <v-icon color="primary">mdi-puzzle</v-icon>
        </v-row>
        <v-row class="title my-2" align="center" justify="center">
            <span class="mr-2">{{ userAreas.length }} areas</span>
            <v-icon color="primary">mdi-vector-square</v-icon>
        </v-row>
        <v-divider class="my-6"></v-divider>
        <v-col>
            <h2 class="mb-6">Settings</h2>
            <v-container>
                <Errors :errors="errors" />
                <v-form v-model="userSettings">
                    <v-text-field
                        :rules="[x => !!x || `Invalid username`]"
                        v-model="username"
                        label="Username"
                        outlined
                        required
                    ></v-text-field>
                    <v-text-field
                        v-if="this.user.register_source === 'none'"
                        :type="showPass ? 'text' : 'password'"
                        :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                        v-model="password"
                        @click:append="showPass = !showPass"
                        label="New password"
                        outlined
                    />
                    <v-btn
                        color="primary"
                        class="ma-4"
                        v-on:click="updateUsername"
                        :disabled="!userSettings"
                    >
                        Update<v-icon right>mdi-refresh-circle</v-icon>
                    </v-btn>
                </v-form>
            </v-container>
        </v-col>
    </v-col>
</template>

<script>
 import Errors from '../components/Errors.vue';

 export default {
     components: {
         Errors
     },

     data () {
         return {
             title: 'Settings',
             userSettings: true,
             username: '',
             password: '',
             showPass: false,
             errors: []
         };
     },

     mounted () {
         this.$store.commit('setTitle', this.title);
         this.username = this.user.username;
         console.log(this.user);
     },

     methods: {
         async updateUsername () {
             if (this.username !== this.user.username) {
                 try {
                     await this.$store.dispatch('user/updateUsername', this.username);
                 } catch (e) {
                     this.errors.push({ message: e.response.data.message });
                 }
             }

             if (this.password) {
                 try {
                     await this.$store.dispatch('user/updatePassword', this.password);
                 } catch (e) {
                     this.errors.push({ message: e.response.data.message });
                 }
             }
         }
     },

     computed: {
         user () {
             if (this.$auth.loggedIn) {
                 return this.$auth.user;
             }
             return null;
         },

         userAvatar () {
             return this.$store.state.user.avatar;
         },

         userServicesNb () {
             return this.$store.state.user.servicesNb;
         },

         userAreas () {
             return this.$store.state.user.areas;
         }
     }
 };
</script>
