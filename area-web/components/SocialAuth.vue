<template>
    <v-layout justify-center>
        <v-flex xs6>
            <v-layout justify-space-around flex-wrap>
                <v-skeleton-loader
                    ref="skeleton"
                    v-if="!loaded"
                    v-for="i in 5"
                    :key="i"
                    type="avatar"
                    class="mx-auto"
                />
                <div
                    v-for="service in services"
                    v-if="loaded && service.authType !== 'none'"
                >
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                :color="service.background"
                                v-on="on"
                                v-on:click="redirectToOauth(service.name)"
                                elevation="0"
                                fab
                            >
                                <v-icon :color="service.foreground">{{ `mdi-${service.iconName}` }}</v-icon>
                            </v-btn>
                        </template>
                        <span>Sign in with {{ service.displayName }}</span>
                    </v-tooltip>
                </div>
            </v-layout>
        </v-flex>
    </v-layout>
</template>

<script>
 export default {
     props: ['services'],

     data () {
         return {
             loaded: false
         };
     },

     mounted () {
         this.$nextTick(() => {
             this.$nuxt.$loading.start();

             setTimeout(() => {
                 this.loaded = true;
                 this.$nuxt.$loading.finish();
             }, 500);
         });
     },

     methods: {
         redirectToOauth (service) {
             this.$store.dispatch('userAction/setAction', 'signin');
             this.$store.dispatch('userAction/setFailureUrl', this.$nuxt.$route.path);
             this.$store.dispatch('userAction/setSuccessUrl', '/');
             this.$router.push(`oauth/${service}/redirect`);
         }
     }
 };
</script>
