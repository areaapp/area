<template>
    <v-col class="mt-10" align="center" justify="center">
        <v-avatar size="18vh">
            <img :src="userAvatar" :alt="user.username">
        </v-avatar>
        <h2 class="my-5 display-1">{{ user.username }}</h2>
        <v-row class="title my-2" align="center" justify="center">
            <span class="mr-2">{{ userServicesNb }} services</span>
            <v-icon color="primary">mdi-puzzle</v-icon>
        </v-row>
        <v-row class="title my-2" align="center" justify="center">
            <span class="mr-2">{{ userAreas.length }} areas</span>
            <v-icon color="primary">mdi-vector-square</v-icon>
        </v-row>
    </v-col>
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
     },

     computed: {
         user () {
             if (this.$auth.loggedIn) {
                 return this.$auth.user;
             }
             return null;
         },

         userAvatar () {
             return this.$store.state.user.avatar;
         },

         userServicesNb () {
             return this.$store.state.user.servicesNb;
         },

         userAreas () {
             return this.$store.state.user.areas;
         }
     }
 };
</script>
