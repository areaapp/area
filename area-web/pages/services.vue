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
            :noedit="$auth.user.register_source === service.name"
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
        <Success />
    </v-layout>
</template>

<script>
 import Errors from '../components/Errors.vue';
 import Success from '../components/Success.vue';
 import Service from '../components/Service.vue';

 export default {
     components: {
         Errors,
         Service,
         Success
     },

     data () {
         return {
             title: 'Services',
             edit: false,
             editService: null,
             snackInfo: false,
             errors: []
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

     mounted () {
         this.title = `Services (${this.servicesNb})`;
         this.$store.commit('setTitle', this.title);
         const errors = this.$getErrors();
         this.errors = this.errors.concat(errors);
     },

     methods: {
         editMode (serviceName) {
             this.edit = true;
             this.editService = serviceName;
         },

         async addService (serviceName) {
             if (this.services[serviceName].authType === 'oauth') {
                 this.$store.dispatch('userAction/setAction', 'addService');
                 this.$store.dispatch('userAction/setUrl', this.$nuxt.$route.path);
                 this.$router.push(`/auth/oauth/${serviceName}/redirect`);
             } else {
                 try {
                     await this.$store.dispatch('user/addService', {
                         name: serviceName
                     });
                     this.$store.dispatch('messages/setSuccess', {
                         message: `${this.services[serviceName].displayName} successfully added !`,
                         icon: 'mdi-check-decagram'
                     });
                 } catch (e) {
                     this.errors.push({
                         message: e.response.data.message
                     });
                 }
             }
         },

         async deleteService (serviceName) {
             await this.$store.dispatch('user/deleteService', serviceName);
             this.edit = false;
         }
     }
 };
</script>
