<template>
    <!-- @TODO make preview image non-mutable (size) and be behind all other elements -->
    <img :src="'src' + loadout.getpreview()" alt="loadoutpreview" class="h-5/6">
</template>

<script lang="ts">
    import Icon from './icon.vue'
    import pinia from "@/store";
    import { storeToRefs } from 'pinia'
    import { useArsenalStore } from '@/stores/arsenal';

    export default {
        name: 'preview',

        setup(props) {
            const store = useArsenalStore(pinia);
            const { loadout } = storeToRefs(store);

            return { loadout };
        },
    }
</script>