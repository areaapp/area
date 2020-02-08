<template>
    <v-layout column>
        <v-card v-for="service in services" class="secondary pa-4 my-2">
            <v-card-title>
                <span class="accent--text">{{ service.displayName }}</span>
                <v-spacer />
                <div v-if="userServices[service.name]">
                    <v-chip
                        class="ma-2"
                        :color="service.background"
                        :text-color="service.foreground"
                        small
                    >
                        <v-avatar left>
                            <v-icon small>mdi-{{ service.iconName }}</v-icon>
                        </v-avatar>
                        {{ userServices[service.name].email }}
                    </v-chip>
                    <v-tooltip bottom>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                icon
                                color="accent"
                                v-on="on"
                                v-on:click="editMode(service.name)"
                            >
                                <v-icon>mdi-settings</v-icon>
                            </v-btn>
                        </template>
                        <span>Settings</span>
                    </v-tooltip>
                </div>
                <v-btn
                    v-else
                    color="primary"
                    v-on:click="addService(service.name)"
                >
                    Add <v-icon right>mdi-plus-circle</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-subtitle class="accent--text">{{ service.description }}</v-card-subtitle>
            <v-expansion-panels>
                <v-expansion-panel :style="{ background: $vuetify.theme.themes[theme].background }">
                    <v-expansion-panel-header>Actions ({{ service.actions.length }})</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-card v-for="action in service.actions" :color="service.background" class="my-2">
                            <v-card-title :style="`color: ${service.foreground}`">
                                <v-icon :color="service.foreground" class="mr-2">mdi-{{ service.iconName }}</v-icon>
                                {{ action.displayName }}
                            </v-card-title>
                            <v-card-subtitle :style="`color: ${service.foreground}`">
                                {{ action.description }}
                            </v-card-subtitle>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel :style="{ background: $vuetify.theme.themes[theme].background }">
                    <v-expansion-panel-header>REactions ({{ service.reactions.length }})</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-card v-for="action in service.reactions" :color="service.background" :style="`color: ${service.foreground}`" class="my-2">
                            <v-card-title>
                                <v-icon :color="service.foreground" class="mr-2">mdi-{{ service.iconName }}</v-icon>
                                {{ action.displayName }}
                            </v-card-title>
                            <v-card-subtitle>{{ action.description }}</v-card-subtitle>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card>
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
                            color="error"
                            class="ma-4"
                            v-on:click="deleteService(editService)"
                        >
                            Delete {{ editService }} service<v-icon right>mdi-delete</v-icon>
                        </v-btn>
                    </v-row>
                </v-container>
            </v-sheet>
        </v-bottom-sheet>
    </v-layout>
</template>

<script>
 export default {
     data () {
         return {
             title: 'Services',
             edit: false,
             editService: null
         };
     },

     methods: {
         editMode (serviceName) {
             this.edit = true;
             this.editService = serviceName;
         },

         addService (serviceName) {
             this.$store.commit('userAction/setAction', 'addService');
             this.$store.commit('userAction/setUrl', this.$nuxt.$route.path);
             this.$router.push(`/auth/oauth/${serviceName}/redirect`);
         },

         async deleteService (serviceName) {
             await this.$store.dispatch('user/deleteService', serviceName);
             this.edit = false;
         }
     },

     computed: {
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
         this.title = `Services (${Object.keys(this.services).length})`;
         this.$store.commit('setTitle', this.title);
     }
 };
</script>
