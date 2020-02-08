<template>
    <v-layout></v-layout>
</template>

<script>
 export default {
     data () {
         return {
             title: 'My Areas'
         };
     },

     computed: {
         userAreas () {
             return this.$store.state.user.areas;
         }
     },

     mounted () {
         this.title = `My areas (${this.userAreas.length})`
         this.$store.commit('setTitle', this.title);
     }
 };
</script>
