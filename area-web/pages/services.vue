<template>
    <v-layout column>
        <p>{{ JSON.stringify(services, null, 4) }}</p>

        <v-card v-for="service in services" class="secondary pa-4 my-2">
            <v-card-title>{{ service.displayName }}</v-card-title>
            <v-card-subtitle>{{ service.description }}</v-card-subtitle>
            <v-expansion-panels>
                <v-expansion-panel class="tertiary">
                    <v-expansion-panel-header>Actions</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        {{ service.actions }}
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel  class="tertiary">
                    <v-expansion-panel-header>REactions</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        {{ service.reactions }}
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
             title: ''
         };
     },

     computed: {
         services () {
             return this.$store.state.services;
         }
     },

     mounted () {
         this.title = `Services (${this.services.length})`;
         this.$store.commit('setTitle', this.title);
     }
 }
</script>
