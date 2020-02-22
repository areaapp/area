<template>
    <v-snackbar v-model="snackInfo" color="secondary">
        {{ message }}
        <v-icon color="primary" right>{{ icon }}</v-icon>
    </v-snackbar>
</template>

<script>
 export default {
     props: ['errors'],

     data () {
         return {
             message: '',
             icon: '',
             snackInfo: false
         };
     },

     mounted () {
         const success = this.$getSuccess();

         if (success && success.message) {
             this.message = success.message;
             this.icon = success.icon;
             this.snackInfo = true;
         }
     }
 };
</script>
