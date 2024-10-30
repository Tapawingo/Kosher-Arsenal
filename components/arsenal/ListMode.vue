<template>
    <div class="background"></div>
    <div class="list-container">
        <div class="panel">
            <ArsenalListCategory v-for="category in arsenalStore.loadout.categories" :category="category" />
        </div>
    </div>
    <div class="info-container">
        <div class="center-options">

            <NuxtLink to="/">
            <Icon name="material-symbols:arrow-back-2" mode="css"/><span>Return</span>
            </NuxtLink>

            <USelectMenu class="arsenal-select" :options="arsenalModeSelect" v-model="selectedArsenalMode" :ui="{option: { active: 'active' }}">
            <template #option="{ option: mode }">
                <Icon :name="mode.icon" mode="css" size="15"/>
                <span >{{ mode.label }}</span>
            </template>

            <template #label>
                <Icon :name="selectedArsenalMode.icon" class="leading"/>
                <span >{{ selectedArsenalMode.label }}</span>
            </template>
            </USelectMenu>

            <div class="arsenal-button" @click="helpIsOpen = true">
                <Icon name="material-symbols:help-outline" mode="css"/>
                Help
            </div>

        </div>
        <div class="preview">
            <img :src="arsenalStore.loadout.preview.path" alt="Preview">
        </div>
        <ArsenalInfo />
    </div>
</template>

<script setup lang="ts">
    const arsenalStore = useArsenalStore();

    /* Help button */
    const helpIsOpen = ref(false);

    /* State management for Kosher Arsenal */
    const arsenalModeSelect = ref([
        {
            label: 'Preview', 
            icon: 'material-symbols:visibility-rounded', 
            mode: ArsenalMode.view 
        },
        {
            label: 'Buylist', 
            icon: 'material-symbols:check-box', 
            mode: ArsenalMode.buylist
        }
    ]);

    const selectedArsenalMode = ref(arsenalModeSelect.value[arsenalStore.mode]);

    watch(selectedArsenalMode, () => {
        arsenalStore.setMode(selectedArsenalMode.value.mode)
    });
</script>