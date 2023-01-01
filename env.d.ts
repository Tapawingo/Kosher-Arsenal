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
declare module globalThis { }

/* Fix typescripting for heroicons */
declare module '@heroicons/*';