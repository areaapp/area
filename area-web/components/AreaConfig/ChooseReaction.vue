<template>
    <v-card
        :color="color"
        class="mb-12 scrollable"
        height="65vh"
    >
        <v-container fluid>
            <v-radio-group v-model="checked" @change="updateChecked()" :mandatory="true">
                <v-col
                    :key="i"
                    v-for="(service, i) in userServices"
                    v-if="allServices[i].reactions.length"
                    align="center"
                >
                    <h1 class="subtitle-2">{{ allServices[i].displayName }}</h1>
                    <v-row
                        align="center"
                        justify="center"
                    >
                        <Reaction
                            v-for="(reaction, j) in allServices[i].reactions"
                            :key="j"
                            :background="allServices[i].background"
                            :foreground="allServices[i].foreground"
                            :icon="allServices[i].iconName"
                            :title="reaction.displayName"
                            :description="reaction.description"
                            :nooverlay="true"
                        >
                            <v-radio
                                :color="allServices[i].foreground"
                                :value="`${i}-${reaction.name}`"
                                on-icon="mdi-check-circle"
                                dark
                            />
                        </Reaction>
                    </v-row>
                </v-col>
            </v-radio-group>
        </v-container>
    </v-card>
</template>

<script>
 import Reaction from '../Reaction.vue';

 export default {

     components: {
         Reaction
     },
     props: [
         'allServices',
         'userServices',
         'value',
         'color'
     ],

     data () {
         return {
             checked: this.value
         };
     },

     methods: {
         updateChecked () {
             this.$emit('input', this.checked);
         }
     }
 };
</script>
