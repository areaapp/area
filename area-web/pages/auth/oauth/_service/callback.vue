<template>
    <div class="text-center">
        <h2>Connection to {{ service.displayName }} in progress...</h2>
        <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
        ></v-progress-circular>
    </div>
</template>

<script>
 export default {
     auth: false,

     asyncData ({ params }) {
         return {
             serviceName: params.service
         };
     },

     computed: {
         service () {
             return this.$store.state.services[this.serviceName];
         }
     },

     async mounted () {
         await this.$oauthConnect();
     }
 };
</script>
