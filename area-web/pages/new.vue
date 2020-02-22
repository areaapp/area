<template>
    <div>
        <v-stepper
            v-model="stepper"
            :vertical="vertical"
            :alt-labels="altLabels"
            class="secondary"
        >
            <template>
                <v-stepper-header>
                    <template v-for="n in steps">
                        <v-stepper-step
                            :key="`${n}-step`"
                            :complete="stepper > n"
                            :step="n"
                        >
                            <span class="accent--text">Step {{ n }}</span>
                        </v-stepper-step>

                        <v-divider
                            v-if="n !== steps"
                            :key="n"
                            class="tertiary"
                        />
                    </template>
                </v-stepper-header>

                <v-stepper-items>
                    <v-stepper-content step="1">
                        <h1 class="title mb-2">Choose an action:</h1>
                        <v-card
                            class="mb-12 scrollable"
                            height="50vh"
                            color="grey lighten-3"
                        >
                            <v-container fluid>
                                <v-radio-group v-model="radioAction" :mandatory="true">
                                    <v-col
                                        :key="i"
                                        v-for="(service, i) in services"
                                        v-if="allServices[i].actions.length"
                                        align="center"
                                    >
                                        <h1 class="subtitle-2 primary--text">{{ allServices[i].displayName }}</h1>
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
                                                :description="action.description">
                                                <v-radio
                                                    :color="allServices[i].foreground"
                                                    :value="action"
                                                    on-icon="mdi-check-circle"
                                                >
                                                </v-radio>
                                            </Action>
                                        </v-row>
                                    </v-col>
                                </v-radio-group>
                            </v-container>
                        </v-card>
                        <v-row class="justify-center">
                            <v-btn
                                @click="nextStep(1)"
                                color="primary"
                            >
                                Continue
                            </v-btn>
                        </v-row>
                    </v-stepper-content>
                    <v-stepper-content step="2">
                        <h1 class="title mb-2">Choose a reaction:</h1>
                        <v-card
                            class="mb-12 scrollable"
                            height="50vh"
                            color="grey lighten-3"
                        >
                            <v-container fluid>
                                <v-radio-group v-model="radioReaction" :mandatory="true">
                                    <v-col
                                        :key="i"
                                        v-for="(service, i) in services"
                                        v-if="allServices[i].reactions.length"
                                        align="center"
                                    >
                                        <h1 class="subtitle-2 primary--text">{{ allServices[i].displayName }}</h1>
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
                                                :description="reaction.description">
                                                <v-radio
                                                    :color="allServices[i].foreground"
                                                    :value="reaction"
                                                    on-icon="mdi-check-circle"
                                                >
                                                </v-radio>
                                            </Reaction>
                                        </v-row>
                                    </v-col>
                                </v-radio-group>
                            </v-container>
                        </v-card>
                        <v-row class="justify-center">
                            <v-btn
                                @click="nextStep(2)"
                                color="primary"
                            >
                                Continue
                            </v-btn>
                        </v-row>
                    </v-stepper-content>
                    <v-stepper-content step="3">
                        <h1 class="title mb-2">Configure your area:</h1>
                        <v-card
                            class="mb-12 scrollable"
                            height="50vh"
                            color="grey lighten-3"
                        >
                            <v-container fluid>
                                <p>{{ radioAction }}</p>
                                <p>{{ radioReaction }}</p>
                            </v-container>
                        </v-card>
                        <v-row class="justify-center">
                            <v-btn
                                @click="nextStep(3)"
                                color="primary"
                            >
                                Continue
                            </v-btn>
                        </v-row>
                    </v-stepper-content>
                </v-stepper-items>
            </template>
        </v-stepper>
    </div>
</template>

<script>
 import Action from '../components/Action.vue';
 import Reaction from '../components/Reaction.vue';

 export default {
     components: {
         Action,
         Reaction
     },
     data () {
         return {
             title: 'Create a new area',
             stepper: 1,
             steps: 3,
             vertical: false,
             altLabels: false,
             editable: true,
             radioAction: null,
             radioReaction: null
         };
     },

     computed: {
         theme () {
             return this.$vuetify.theme.dark ? 'dark' : 'light';
         },

         services () {
             return this.$store.state.user.services;
         },

         allServices () {
             return this.$store.state.services;
         }
     },

     watch: {
         steps (val) {
             if (this.stepper > val) {
                 this.stepper = val;
             }
         },

         vertical () {
             this.stepper = 2;
             requestAnimationFrame(() => { this.stepper = 1; });
         }
     },

     mounted () {
         this.$store.commit('setTitle', this.title);
     },

     methods: {
         onInput (val) {
             this.steps = parseInt(val);
         },

         nextStep (n) {
             if (n === this.steps) {
                 this.stepper = 1;
             } else {
                 this.stepper = n + 1;
             }
         }
     }
 };
</script>
