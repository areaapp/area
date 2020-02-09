<template>
    <v-layout column>
        <Errors :errors="errors" />
        <Service
            v-for="(service, i) in services"
            :key="i"
            :name="service.name"
            :title="service.displayName"
            :icon="service.iconName"
            :description="service.description"
            :email="userServices[service.name] ? userServices[service.name].email : null"
            :configured="userServices[service.name]"
            :actions="service.actions"
            :reactions="service.reactions"
            :background="service.background"
            :foreground="service.foreground"
            :themeBg="$vuetify.theme.themes[theme].background"
            v-on:editMode="editMode"
            v-on:addService="addService"
        />
        <v-bottom-sheet v-model="edit">
            <v-sheet
                v-if="editService"
                :style="{ background: $vuetify.theme.themes[theme].background }"
                class="text-center pa-5"
                height="200px"
            >
                <v-container class="d-flex flex-column">
                    <h1 class="mb-6">{{ services[editService].displayName }} settings</h1>
                    <v-row class="justify-center">
                        <v-btn color="primary" class="ma-4">
                            Switch account<v-icon right>mdi-account-circle</v-icon>
                        </v-btn>
                        <v-btn
                            v-on:click="deleteService(editService)"
                            color="error"
                            class="ma-4"
                        >
                            Delete {{ editService }} service<v-icon right>mdi-delete</v-icon>
                        </v-btn>
                    </v-row>
                </v-container>
            </v-sheet>
        </v-bottom-sheet>
        <v-snackbar v-model="snackInfo" v-if="success" color="secondary">
            {{ success.message }}
            <v-icon color="primary" right>mdi-check-decagram</v-icon>
        </v-snackbar>
    </v-layout>
</template>

<script>
 import Errors from '../components/Errors.vue';
 import Service from '../components/Service.vue';

 export default {
     components: {
         Errors,
         Service
     },

     data () {
         return {
             title: 'Services',
             edit: false,
             editService: null,
             snackInfo: false
         };
     },

     computed: {
         servicesNb () {
             return this.$store.state.servicesNb;
         },

         services () {
             return this.$store.state.services;
         },

         theme () {
             return this.$vuetify.theme.dark ? 'dark' : 'light';
         },

         user () {
             return this.$auth.user;
         },

         userServices () {
             return this.$store.state.user.services;
         }
     },

     asyncData ({ areaErrors, areaSuccess }) {
         return {
             errors: areaErrors || [],
             success: areaSuccess || null
         };
     },

     mounted () {
         this.title = `Services (${this.servicesNb})`;
         this.$store.commit('setTitle', this.title);

         if (this.success) {
             this.snackInfo = true;
         }
     },

     methods: {
         editMode (serviceName) {
             this.edit = true;
             this.editService = serviceName;
         },

         addService (serviceName) {
             this.$store.dispatch('userAction/setAction', 'addService');
             this.$store.dispatch('userAction/setUrl', this.$nuxt.$route.path);
             this.$router.push(`/auth/oauth/${serviceName}/redirect`);
         },

         async deleteService (serviceName) {
             await this.$store.dispatch('user/deleteService', serviceName);
             this.edit = false;
         }
     }
 };
</script>
