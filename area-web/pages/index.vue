<template>
    <div>
        <Success />
    </div>
</template>

<script>
 import Success from '../components/Success.vue';

 export default {
     data () {
         return {
             title: 'My Areas'
         };
     },

     components: {
         Success
     },

     computed: {
         userAreas () {
             return this.$store.state.user.areas;
         }
     },

     mounted () {
         this.title = `My areas (${this.userAreas.length})`;
         this.$store.commit('setTitle', this.title);
     }
 };
</script>
