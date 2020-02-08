<template>
    <v-layout column>

    </v-layout>
</template>

<script>
 export default {
     data () {
         return {
             title: 'Settings'
         };
     },

     mounted () {
         this.$store.commit('setTitle', this.title);
     }
 }
</script>
