<template>
    <div>
        <v-snackbar v-model="snackInfo" v-if="success" color="secondary">
            {{ success.message }}
            <v-icon color="primary" right>mdi-human-greeting</v-icon>
        </v-snackbar>
    </div>
</template>

<script>
 export default {
     data () {
         return {
             title: 'My Areas',
             snackInfo: false
         };
     },

     computed: {
         errors () {
             return this.$getErrors();
         },

         success () {
             return this.$getSuccess();
         },

         userAreas () {
             return this.$store.state.user.areas;
         }
     },

     mounted () {
         this.title = `My areas (${this.userAreas.length})`;
         this.$store.commit('setTitle', this.title);

         if (this.success) {
             this.snackInfo = true;
         }
     }
 };
</script>
