<template>
    <v-card
        class="ma-4 pa-2 d-flex flex-column"
        :color="background"
        min-height="270"
        min-width="270"
        max-width="270"
        max-height="270"
    >
        <v-row class="px-2 mb-n2" v-if="slot">
            <v-spacer></v-spacer>
            <slot></slot>
        </v-row>
        <v-container fluid>
            <v-row class="pa-2">
                <v-chip x-small :color="foreground" :text-color="background">action</v-chip>
                <v-spacer></v-spacer>
                <v-icon right small>mdi-{{ icon }}</v-icon>
            </v-row>
            <v-row class="px-2">
                <span class="subtitle-2 text-left">{{ title }}</span>
            </v-row>
        </v-container>
        <v-card-subtitle>{{ description }}</v-card-subtitle>
        <v-spacer></v-spacer>
        <v-card-actions>
            <v-row justify="center">
                <v-icon :color="foreground">mdi-arrow-down-drop-circle</v-icon>
            </v-row>
        </v-card-actions>
    </v-card>
</template>

<script>
 export default {
     props: [
         'foreground',
         'background',
         'title',
         'description',
         'icon'
     ],

     computed: {
         slot () {
             return !!this.$slots.default;
         }
     }
 }
</script>
