<template>
    <v-card
        :color="service.background"
    >
        <v-card-title>
            <span
                :style="{ color: service.foreground }"
            >
                {{ reaction.displayName }} - Configuration
            </span>
            <v-chip
                :color="service.foreground"
                :text-color="service.background"
                x-small
                class="mx-4"
            >
                reaction
            </v-chip>
            <v-spacer />
            <v-icon :color="service.foreground" right>mdi-{{ service.iconName }}</v-icon>
        </v-card-title>
        <v-card-text>
            <v-form v-model="form">
                <v-col>
                    <div v-for="(type, key) in reaction.params">
                        <v-combobox
                            v-if="type === 'Array'"
                            :label="prettyKey(key)"
                            v-model="config[key]"
                            :rules="[x => !!x || `${key} is required.`]"
                            :color="service.foreground"
                            multiple
                            chips
                            outlined
                            required
                            dark
                        >
                            <template v-slot:selection="data">
                                <v-chip
                                    :key="data.item"
                                    v-bind="data.attrs"
                                    color="secondary"
                                >
                                    <v-avatar
                                        :text-color="service.foreground"
                                        :color="service.background"
                                        v-text="data.item.slice(0, 1).toUpperCase()"
                                        left
                                    />
                                    {{ data.item }}
                                </v-chip>
                            </template>
                        </v-combobox>
                        <v-textarea
                            v-else
                            v-model="config[key]"
                            :label="prettyKey(key)"
                            :rules="[x => !!x || `${key} is required.`]"
                            :color="service.foreground"
                            clearable
                            outlined
                            auto-grow
                            rows="1"
                            required
                            dark
                        />
                    </div>
                </v-col>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
 export default {
     props: [
         'value',
         'service',
         'reaction'
     ],

     data () {
         return {
             form: false,
             config: this.value || {}
         };
     },

     methods: {
         prettyKey (key) {
             return key.replace(/^\w/, c => c.toUpperCase());
         }
     },

     watch: {
         form () {
             if (this.form) {
                 return this.$emit('input', this.config);
             }
             return this.$emit('input', null);
         }
     }
 };
</script>
