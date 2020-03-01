<template>
    <div>
        <v-card class="secondary pa-4 my-2">
            <v-card-title>
                <span class="accent--text">{{ title }}</span>
                <v-icon v-if="configured" color="primary" right>mdi-check-decagram</v-icon>
                <v-spacer />
                <div v-if="configured">
                    <v-chip
                        v-if="email"
                        :color="background"
                        :text-color="foreground"
                        class="ma-2"
                        small
                    >
                        <v-avatar left>
                            <v-icon small>mdi-{{ icon }}</v-icon>
                        </v-avatar>
                        {{ email }}
                    </v-chip>
                    <v-tooltip
                        v-if="!noedit"
                        bottom
                    >
                        <template v-slot:activator="{ on }">
                            <v-btn
                                v-on="on"
                                v-on:click="$emit('editMode', name)"
                                icon
                                color="accent"
                            >
                                <v-icon>mdi-settings</v-icon>
                            </v-btn>
                        </template>
                        <span>Settings</span>
                    </v-tooltip>
                </div>
                <v-btn
                    v-else
                    v-on:click="$emit('addService', name)"
                    color="primary"
                >
                    Add <v-icon right>mdi-plus-circle</v-icon>
                </v-btn>
            </v-card-title>
            <v-card-subtitle class="accent--text mt-4">{{ description }}</v-card-subtitle>
            <v-expansion-panels>
                <v-expansion-panel :style="{ background: themeBg }">
                    <v-expansion-panel-header>Actions ({{ actions.length }})</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-card v-for="(action, j) in actions" :key="j" :color="background" class="my-2">
                            <v-card-title :style="`color: ${foreground}`">
                                <v-icon :color="foreground" class="mr-2">mdi-{{ icon }}</v-icon>
                                {{ action.displayName }}
                            </v-card-title>
                            <v-card-subtitle :style="`color: ${foreground}`">
                                {{ action.description }}
                            </v-card-subtitle>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
                <v-expansion-panel :style="{ background: themeBg }">
                    <v-expansion-panel-header>REactions ({{ reactions.length }})</v-expansion-panel-header>
                    <v-expansion-panel-content>
                        <v-card v-for="(reaction, j) in reactions" :key="j" :color="background" :style="`color: ${foreground}`" class="my-2">
                            <v-card-title>
                                <v-icon :color="foreground" class="mr-2">mdi-{{ icon }}</v-icon>
                                {{ reaction.displayName }}
                            </v-card-title>
                            <v-card-subtitle>{{ reaction.description }}</v-card-subtitle>
                        </v-card>
                    </v-expansion-panel-content>
                </v-expansion-panel>
            </v-expansion-panels>
        </v-card>
    </div>
</template>

<script>
 export default {
     props: [
         'name',
         'title',
         'icon',
         'description',
         'email',
         'configured',
         'actions',
         'reactions',
         'background',
         'foreground',
         'themeBg',
         'noedit'
     ]
 };
</script>
