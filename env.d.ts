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
  var mainCategory: arsenal.Category;
  var itemCategory: arsenal.Category;

  /* Arsenal classes and methods */
  namespace arsenal {

    function deleteAt(array: Array, item: Object<Item>) {
      var index = array.indexOf(item);
      if (index > -1) {
        array.splice(index, 1);
      }
    }

    /* Loadout class */
    export class Loadout {
      public id: Number;
      public title: String;
      public description: String;
      public preview: String;
      public tags: Array;
      public visibility: Number; // 0 = private, 1 = unlisted, 2 = public
      public collections: Array;
      public categories: Array;

      public constructor(data: Partial<Loadout>) {
        if (!data.id) {
          throw new Error('ID must be set');
        }

        Object.assign(this, data);
      }

      /* Getters */
      public getID(): Number { return this.id };
      public getTitle(): String { return this.title };
      public getDescription(): String { return this.description };
      public getpreview(): String { return this.preview };
      public getTags(): Array { return this.tags };
      public getVisibility(): Number { return this.visibility };
      public getCollections(): Array { return this.collections };
      public getCategories(): Array { return this.categories };

      /* Setters */
      public setTitle(title: String): Void { this.title = title };
      public setDescription(description: String): Void { this.description = description };
      public setPreview(preview: String): Void { this.preview = preview };
      public AppendTag(tag: Tag | Array): Void {
        if (typeof tag === 'array') {
          this.tags.concat(tag);
        } else {
          this.tags.push(tag);
        }
      };
      public deleteTag(tag: Tag | Array) {
        if (typeof tag === 'array') {
          tag.forEach(element => {
            deleteAt(this.tags, tag);
          });
        } else {
          deleteAt(this.tags, tag);
        }
      }
      public AppendCollection(collection: Collection | Array): Void {
        if (typeof collection === 'array') {
          this.collections.concat(collection);
        } else {
          this.collections.push(collection);
        }
      };
      public deleteCollection(collection: Collection | Array) {
        if (typeof collection === 'array') {
          collection.forEach(element => {
            deleteAt(this.collections, collection);
          });
        } else {
          deleteAt(this.collections, collection);
        }
      }
      public AppendCategory(category: Category | Array): Void {
        if (typeof category === 'array') {
          this.categories.concat(category);
        } else {
          this.categories.push(category);
        }
      };
      public deleteCategory(category: Category | Array) {
        if (typeof category === 'array') {
          category.forEach(element => {
            deleteAt(this.categories, category);
          });
        } else {
          deleteAt(this.categories, category);
        }
      }

      /* Methods */
      public toJSON() {

      }

      public fromJSON() {
        
      }
    } 

    /* Category class */
    export class Category {
      public id:     Number;
      public pos:    Number;
      public icon:   String;
      public title:  String;
      public items:  Array;
      public element: HTMLElement;
    
      public constructor(data: Partial<Category>) {
        if (!data.id) {
          throw new Error('ID must be set');
        }

        Object.assign(this, data);
      }

      /* Getters */
      public getID(): Number { return this.id; }
      public getPos(): Number { return this.pos; }
      public getIcon(): String { return this.icon; }
      public getTitle(): String { return this.title; }
      public getItems(): Array { return this.items; }
      public getElement(): HTMLElement { return this.element; }

      /* Setters */
      public setPos(pos: Number): Void { this.pos = pos; }
      public setIcon(icon: String): Void { this.icon = icon; }
      public setTitle(title: String): Void { this.title = title; }
      public setItems(items: Array): Void { this.items = items; }
      public setElement(element: HTMLElement): Void { this.element = element; }
      public AppendItem(item: Item | Array): Void {
        if (typeof item === 'array') {
          this.items.concat(item);
        } else {
          this.items.push(item);
        }
      };
      public deleteItem(item: Item | Array) {
        if (typeof item === 'array') {
          item.forEach(element => {
            deleteAt(this.items, item);
          });
        } else {
          deleteAt(this.items, item);
        }
      }

    };

    /* Item class */
    export class Item {
      public id:           Number;
      public pos:          Number;
      public title:        String;
      public description:  String;
      public Preview:      String;
      public element:      HTMLElement;
      public subCategories: Array;

      public constructor(data: Partial<Item>) {
        if (!data.id) {
          throw new Error('ID must be set');
        }

        Object.assign(this, data);
      }

      /* Getters */
      public getID(): Number { return this.id; }
      public getPos(): Number { return this.pos; }
      public getTitle(): String { return this.title; }
      public getDescription(): String { return this.description; }
      public getPreview(): String { return this.preview; }
      public getElement(): HTMLElement { return this.element; }
      public getSubCategories(): Array { return this.subCategories };

      /* Setters */
      public setPos(pos: Number): Void { this.pos = pos; }
      public setTitle(title: String): Void { this.title = title; }
      public setDescription(description: String): Void { this.description = description; }
      public setPreview(preview: String): Void { this.preview = preview; }
      public setElement(element: HTMLElement): Void { this.element = element; }
      public AppendCategory(category: Category | Array): Void {
        if (typeof category === 'array') {
          this.subCategories.concat(category);
        } else {
          this.subCategories.push(category);
        }
      };
      public deleteCategory(category: Category | Array) {
        if (typeof category === 'array') {
          category.forEach(element => {
            deleteAt(this.subCategories, category);
          });
        } else {
          deleteAt(this.subCategories, category);
        }
      }
    }

  }
}