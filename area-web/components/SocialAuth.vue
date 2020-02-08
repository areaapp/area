<template>
    <v-layout justify-center>
        <v-flex xs6>
            <v-layout justify-space-around flex-wrap>
                <v-skeleton-loader
                    ref="skeleton"
                    type="avatar"
                    class="mx-auto"
                    v-if="!loaded"
                    v-for="i in 5"
                    :key="i"
                ></v-skeleton-loader>
                <div
                    v-if="loaded"
                    v-for="service in services">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <v-btn
                                :color="service.background"
                                elevation="0"
                                fab
                                v-on="on"
                                v-on:click="redirectToOauth(service.name)"
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
             this.$nuxt.$loading.start()

             setTimeout(() => {
                 this.loaded = true;
                 this.$nuxt.$loading.finish()
             }, 500)
         })
     },

     methods: {
         redirectToOauth (service) {
             this.$store.commit('userAction/setAction', 'signin');
             this.$store.commit('userAction/setUrl', this.$nuxt.$route.path);
             this.$router.push(`oauth/${service}/redirect`);
         }
     }
 }
</script>
