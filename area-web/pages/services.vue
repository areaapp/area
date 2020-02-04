<template>
    <div></div>
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
