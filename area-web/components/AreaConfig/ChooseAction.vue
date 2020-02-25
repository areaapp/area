<template>
    <v-card
        :color="color"
        class="mb-12 scrollable"
        height="50vh"
    >
        <v-container fluid>
            <v-radio-group v-model="checked" @change="updateChecked()" :mandatory="true">
                <v-col
                    :key="i"
                    v-for="(service, i) in userServices"
                    v-if="allServices[i].actions.length"
                    align="center"
                >
                    <h1 class="subtitle-2">{{ allServices[i].displayName }}</h1>
                    <v-row
                        align="center"
                        justify="center"
                    >
                        <Action
                            v-for="(action, j) in allServices[i].actions"
                            :key="j"
                            :background="allServices[i].background"
                            :foreground="allServices[i].foreground"
                            :icon="allServices[i].iconName"
                            :title="action.displayName"
                            :description="action.description"
                            :nooverlay="true"
                        >
                            <v-radio
                                :color="allServices[i].foreground"
                                :value="`${i}-${action.name}`"
                                on-icon="mdi-check-circle"
                            />
                        </Action>
                    </v-row>
                </v-col>
            </v-radio-group>
        </v-container>
    </v-card>
</template>

<script>
 import Action from '../Action.vue';

 export default {

     components: {
         Action
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
