<template>
    <div>
        <v-row
            align="center"
            justify="center"
        >
            <Area
                v-for="(area, i) in areas"
                :key="i"
                :title="area.name"
                :lastExecution="area.last_execution"
                :theme="theme"
                :action="area.action"
                :reaction="area.reaction"
                :id="area.id"
            >
            <template v-slot:action>
                <Action
                    :foreground="services[area.action.serviceName].foreground"
                    :background="services[area.action.serviceName].background"
                    :title="area.action.displayName"
                    :description="area.action.description"
                    :icon="services[area.action.serviceName].iconName"
                    :id="area.id"
                    v-on:settings="settings(area.action, area, 'action')"
                    class="mb-n8 action"
                />
            </template>
            <template v-slot:reaction>
                <Reaction
                    :foreground="services[area.reaction.serviceName].foreground"
                    :background="services[area.reaction.serviceName].background"
                    :title="area.reaction.displayName"
                    :description="area.reaction.description"
                    :icon="services[area.reaction.serviceName].iconName"
                    v-on:settings="settings(area.reaction, area, 'reaction')"
                    class="mt-n8"
                />
            </template>
            </Area>
        </v-row>
        <v-bottom-sheet
            v-model="settingsPanel"
            v-if="selection"
        >
            <v-sheet
                :style="{ background: $vuetify.theme.themes[theme].background }"
                class="text-center pa-5 scrollable"
                height="60vh"
            >
                <v-container class="d-flex flex-column">
                    <h1 class="mb-6 headline">
                        Area "{{ selection.area.name }}" - {{ selection.type }} "{{ selection.component.displayName }}" settings
                    </h1>
                    <Errors :errors="errors" />
                    <v-col class="align-center" v-if="selection.argsNb">
                        <h3 class="subtitle my-2">Global configuration</h3>
                        <v-form v-model="settingsForm" class="pa-4">
                            <v-textarea
                                :label="prettyKey(key)"
                                v-for="(value, key) in selection.component.args"
                                v-model="settingsArgs[key]"
                                :rules="[x => !!x || `${key} is required.`]"
                                :dark="theme === 'dark'"
                                color="primary"
                                clearable
                                outlined
                                auto-grow
                                rows="1"
                                required
                            />
                            <v-btn
                                color="primary"
                                class="ma-4"
                                v-on:click="selection.type === 'action' ? updateAreaAction() : updateAreaReaction()"
                            >
                                Update<v-icon right>mdi-refresh-circle</v-icon>
                            </v-btn>
                        </v-form>
                    </v-col>
                    <v-col class="align-center justify-center" v-if="!selection.argsNb">
                        <p class="caption">No configuration available</p>
                    </v-col>
                </v-container>
            </v-sheet>
        </v-bottom-sheet>
        <Success />
    </div>
</template>

<script>
 import Success from '../components/Success.vue';
 import Area from '../components/Area.vue';
 import Action from '../components/Action.vue';
 import Reaction from '../components/Reaction.vue';
 import Errors from '../components/Errors.vue';

 export default {
     components: {
         Success,
         Action,
         Reaction,
         Area,
         Errors
     },

     data () {
         return {
             title: 'My Areas',
             selection: null,
             settingsPanel: false,
             settingsForm: false,
             settingsArgs: {},
             errors: []
         };
     },

     methods: {
         settings (component, area, type) {
             this.selection = {
                 component,
                 area,
                 type,
                 argsNb: Object.keys(component.args).length
             };
             this.settingsArgs = Object.assign({}, component.args);
             this.settingsPanel = true;
         },

         async updateAreaAction () {
             try {
                 await this.$store.dispatch('user/updateArea', {
                     id: this.selection.area.id,
                     name: this.selection.area.name,
                     action_args: this.settingsArgs,
                     reaction_args: this.selection.area.reaction.args
                 });
                 this.$store.dispatch('messages/setSuccess', {
                     message: `Action ${this.selection.area.name} successfully updated !`,
                     icon: 'mdi-vector-square'
                 });
                 this.settingsPanel = false;
             } catch (e) {
                 this.errors.push({ message: e.response.data.message });
             }
         },

         async updateAreaReaction () {
             try {
                 await this.$store.dispatch('user/updateArea', {
                     id: this.selection.area.id,
                     name: this.selection.area.name,
                     reaction_args: this.settingsArgs,
                     action_args: this.selection.area.action.args
                 });
                 this.$store.dispatch('messages/setSuccess', {
                     message: `${this.selection.area.name} successfully updated !`,
                     icon: 'mdi-vector-square'
                 });
                 this.settingsPanel = false;
             } catch (e) {
                 this.errors.push({ message: e.response.data.message });
             }
         },

         prettyKey (key) {
             return key.replace(/^\w/, c => c.toUpperCase());
         }
     },

     computed: {
         areas () {
             return this.$store.state.user.areas;
         },

         services () {
             return this.$store.state.services;
         },

         theme () {
             return this.$vuetify.theme.dark ? 'dark' : 'light';
         }
     },

     mounted () {
         this.title = `My areas (${this.areas.length})`;
         this.$store.commit('setTitle', this.title);
     }
 };
</script>
