<template>
    <div></div>
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
