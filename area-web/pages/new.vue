<template>
    <v-layout column>
    </v-layout>
</template>

<script>
 export default {
     data () {
         return {
             title: 'Create a new area'
         };
     },

     mounted () {
         this.$store.commit('setTitle', this.title);
     }
 };
</script>
