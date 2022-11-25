<template>
  <main class="bg-stone-400 bg-grid-pattern-light dark:bg-stone-900 dark:bg-grid-pattern-dark bg-grid-40 h-screen w-screen flex overflow-hidden">
    <div class="basis-1/3 flex">
      <Icons context="main" />
      <Panel context="main" />
    </div>

    <div class="basis-3/4 flex">

    </div>

    <div class="basis-1/3 flex">
      <Panel context="item" />
      <Icons context="item" />
    </div>
  </main>
</template>

<script lang="ts">
  import { getGlobalThis } from '@vue/shared';
  import Icons from '../components/editor/Icons.vue'
  import Panel from '../components/editor/panel.vue'

  export default {
    name: 'editor',
    components: {
      Icons,
      Panel
    },
    methods: {
    },
    data () {
      /* Setup */
      globalThis.mode = 1; // Set to edit mode

      /* Create Loadout */
      globalThis.loadout = new arsenal.Loadout({
        id: 0,
        title: "example loadout",
        description: "This is an example loadout",
        tags: [{label: 'Example Tag'} as Tag],
        visibility: 1
      });

      /* Add example categories and items */
      globalThis.loadout.AppendCategory([
        new globalThis.arsenal.Category({
          id: 0, 
          pos: 0,
          icon: '/assets/img/editor/icon_unknown.png',
          title: 'Example category 1',
          items: [
            new globalThis.arsenal.Item({
              id: 0,
              pos: 1,
              title: 'Example Item 1',
              description: 'This is example item 1',
              subCategories: [
                new globalThis.arsenal.Category({
                  id: 0,
                  pos: 0,
                  icon: '/assets/img/editor/icon_unknown.png',
                  title: 'Example sub category 1',
                  items: [
                    new globalThis.arsenal.Item({
                      id: 1,
                      pos: 0,
                      title: 'Example Sub Item 1',
                      description: 'This is example sub item 1'
                    }),
                    new globalThis.arsenal.Item({
                      id: 2,
                      pos: 1,
                      title: 'Example Sub Item 2',
                      description: 'This is example sub item 2'
                    })
                  ]
                })
              ]
            }),
            new globalThis.arsenal.Item({
              id: 1,
              pos: 1,
              title: 'Example Item 2',
              description: 'This is example item 1',
              subCategories: [
                new globalThis.arsenal.Category({
                  id: 0,
                  pos: 0,
                  icon: '/assets/img/editor/icon_unknown.png',
                  title: 'Example sub category 1',
                  items: [
                    new globalThis.arsenal.Item({
                      id: 1,
                      pos: 0,
                      title: 'Example Sub Item 1',
                      description: 'This is example sub item 1'
                    }),
                    new globalThis.arsenal.Item({
                      id: 2,
                      pos: 1,
                      title: 'Example Sub Item 2',
                      description: 'This is example sub item 2'
                    })
                  ]
                }),
                new globalThis.arsenal.Category({
                  id: 1,
                  pos: 0,
                  icon: '/assets/img/editor/icon_unknown.png',
                  title: 'Example sub category 1',
                  items: [
                    new globalThis.arsenal.Item({
                      id: 1,
                      pos: 0,
                      title: 'Example Sub Item 1',
                      description: 'This is example sub item 1'
                    })
                  ]
                })
              ]
            })
          ]
        })
      ]);

      return {
      }
    }
  }
</script>