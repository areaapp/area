<template>
    <div class="text-center">
        <h2>Waiting for {{ service.displayName }}...</h2>
        <v-progress-circular
            :size="70"
            :width="7"
            color="primary"
            indeterminate
        />
    </div>
</template>

<script>
 export default {
     auth: false,

     computed: {
         service () {
             return this.$store.state.services[this.serviceName];
         }
     },

     asyncData ({ params }) {
         return {
             serviceName: params.service
         };
     },

     async mounted () {
         await this.$oauthConnect();
     }
 };
</script>
