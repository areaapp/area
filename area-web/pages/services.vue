<template>
    <v-layout column>
        <p>{{ JSON.stringify(user, null, 4) }}</p>
        <v-card v-for="service in services" class="secondary pa-4 my-2">
            <v-card-title>{{ service.displayName }}</v-card-title>
            <v-card-subtitle>{{ service.description }}</v-card-subtitle>
            <v-expansion-panels>
                <v-expansion-panel :style="{ background: $vuetify.theme.themes[theme].background }">
                    <v-expansion-panel-header>Actions</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-card v-for="action in service.actions" class="my-2" :color="service.background" :style="`color: ${service.foreground}`">
                            <v-card-title>
                                <v-icon class="mr-2" :color="service.foreground">mdi-{{ service.iconName }}</v-icon>
                                {{ action.displayName }}
                            </v-card-title>
                            <v-card-subtitle>{{ action.description }}</v-card-subtitle>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel  :style="{ background: $vuetify.theme.themes[theme].background }">
                    <v-expansion-panel-header>REactions</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-card v-for="action in service.actions" class="my-2" :color="service.background" :style="`color: ${service.foreground}`">
                            <v-card-title>
                                <v-icon class="mr-2" :color="service.foreground">mdi-{{ service.iconName }}</v-icon>
                                {{ action.displayName }}
                            </v-card-title>
                            <v-card-subtitle>{{ action.description }}</v-card-subtitle>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card>
    </v-layout>
</template>

<script>
 export default {
     data () {
         return {
             title: 'Services'
         };
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
         }
     },

     mounted () {
         this.title = `Services (${this.services.length})`;
         this.$store.commit('setTitle', this.title);
     }
 }
</script>
