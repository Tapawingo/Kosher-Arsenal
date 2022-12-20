/// <reference types="vite/client" />

/* interfaces */
interface Tag {
  label: String;
}

interface Collection {
  id: Number;
  title: String;
}

/* Global variables */
declare module globalThis {
  var mode: Number; // 0 = Preview, 1 = Edit

  var loadout: arsenal.Loadout;
  var selectedItem: arsenal.Item | null;
  var mainCategory: arsenal.Category | null;
  var itemCategory: arsenal.Category | null;
}

/* Fix typescripting for heroicons */
declare module '@heroicons/*';