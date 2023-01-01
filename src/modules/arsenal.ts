export namespace arsenal {
  function deleteAt(array: Array<any>, item: any) {
    var index = array.indexOf(item);
    if (index > -1) {
      array.splice(index, 1);
    }
  }

  /* Loadout class */
  export class Loadout {
    public id: Number = -1;
    public title: String = '';
    public description: String = '';
    public preview: string = '';
    public owner: string = '';
    public collaborators: Array<string> = [];
    public tags: Array<Tag> = [];
    public visibility: Number = 2; // 0 = private, 1 = unlisted, 2 = public
    public collections: Array<Collection> = [];
    public categories: Array<Category> = [];

    public constructor(data: Partial<Loadout> = {}) {
      Object.assign(this, data);
    }

    /* Getters */
    public getID(): Number { return this.id };
    public getTitle(): String { return this.title };
    public getDescription(): String { return this.description };
    public getpreview(): string { return this.preview };
    public getTags(): Array<Tag> { return this.tags };
    public getVisibility(): Number { return this.visibility };
    public getCollections(): Array<Collection> { return this.collections };
    public getCategories(): Array<Category> { return this.categories };

    /* Setters */
    public setTitle(title: String): void { this.title = title };
    public setDescription(description: String): void { this.description = description };
    public setPreview(preview: string): void { this.preview = preview };
    public setTags(tags: Array<Tag>): void { this.tags = tags };
    public AppendTag(tag: Tag | Array<Tag>): void {
      if (tag instanceof Array) {
        this.tags = this.tags.concat(tag);
      } else {
        this.tags.push(tag);
      }
    };
    public deleteTag(tag: Tag | Array<Tag>) {
      if (tag instanceof Array) {
        tag.forEach((element: Tag) => {
          deleteAt(this.tags, element);
        });
      } else {
        deleteAt(this.tags, tag);
      }
    }
    public setCollections(collections: Array<Collection>): void { this.collections = collections };
    public AppendCollection(collection: Collection | Array<Collection>): void {
      if (collection instanceof Array) {
        this.collections = this.collections.concat(collection);
      } else {
        this.collections.push(collection);
      }
    };
    public deleteCollection(collection: Collection | Array<Collection>): void {
      if (collection instanceof Array) {
        collection.forEach((element: Collection) => {
          deleteAt(this.collections, element);
        });
      } else {
        deleteAt(this.collections, collection);
      }
    }
    public setCategories(categories: Array<Category>): void { this.categories = categories };
    public AppendCategory(category: Category | Array<Category>): void {
      if (category instanceof Array) {
        this.categories = this.categories.concat(...category);
      } else {
        this.categories.push(category);
      }
    };
    public deleteCategory(category: Category | Array<Category>): void {
      if (category instanceof Array) {
        category.forEach((element: Category) => {
          deleteAt(this.categories, element);
        });
      } else {
        deleteAt(this.categories, category);
      }
    }

    /* Methods */
    public toJSON() {
      var tags = Array.from(this.tags.map(tag => {
        return JSON.parse(`{ "label": "${tag.label}" }`)
      }));

      var collections = Array.from(this.collections.map((collection: Collection) => {
        return JSON.parse(`{ "id": ${collection.id}, "title": "${collection.title}" }`)
      }));

      var categories = Array.from(this.categories.map((category: Category) => {
        return category.toJSON()
      }));

      var loadoutJSON = {
        id: this.id,
        title: this.title,
        description: this.description,
        preview: this.preview,
        tags: tags,
        visibility: this.visibility,
        collections: collections,
        categories: categories
      };

      return loadoutJSON;
    }

    public fromJSON(jsonString: string): Loadout {
      var data: any = JSON.parse(jsonString);
      var categoriesData = data.categories;

      data.categories = []
      categoriesData.forEach((category: Category) => {
        var categoryClass = new Category();
        categoryClass.fromJSON(JSON.stringify(category));
        data.categories.push(categoryClass);
      });

      Object.assign(this, data);

      return this;
    }
  } 

  /* Category class */
  export class Category {
    public id: Number = -1;
    public pos: Number = 0;
    public icon: String = '';
    public title: String = '';
    public items: Array<Item> = [];
  
    public constructor(data: Partial<Category> = {}) {
      Object.assign(this, data);
    }

    /* Getters */
    public getID(): Number { return this.id; }
    public getPos(): Number { return this.pos; }
    public getIcon(): String { return this.icon; }
    public getTitle(): String { return this.title; }
    public getItems(): Array<Item> { return this.items; }

    /* Setters */
    public setPos(pos: Number): void { this.pos = pos; }
    public setIcon(icon: String): void { this.icon = icon; }
    public setTitle(title: String): void { this.title = title; }
    public setItems(items: Array<Item>): void { this.items = items; }
    public AppendItem(item: Item | Array<Item>): void {
      if (item instanceof Array) {
        this.items = this.items.concat(item);
      } else {
        this.items.push(item);
      }
    };
    public deleteItem(item: Item | Array<Item>) {
      if (item instanceof Array) {
        item.forEach(element => {
          deleteAt(this.items, element);
        });
      } else {
        deleteAt(this.items, item);
      }
    }

    /* Methods */
    public toJSON() {
      var items = this.items.map(item => {
        return item.toJSON()
      });

      var categoryJSON = {
        id: this.id,
        pos: this.pos,
        icon: this.icon,
        title: this.title,
        items: items,
      };

      return categoryJSON;
    }

    public fromJSON(jsonString: string): Category {
      var data: any = JSON.parse(jsonString);
      var itemsData = data.items;

      data.items = [];
      itemsData.forEach((item: Object) => {
        var itemClass = new Item();
        itemClass.fromJSON(JSON.stringify(item));
        data.items.push(itemClass);
      });

      Object.assign(this, data);

      return this;
    }
  };

  /* Item class */
  export class Item {
    public id: Number = -1;
    public pos: Number = 0;
    public title: String = '';
    public description: String = '';
    public preview: String = '';
    public categories: Array<Category> = [];

    public constructor(data: Partial<Item> = {}) {
      Object.assign(this, data);
    }

    /* Getters */
    public getID(): Number { return this.id; }
    public getPos(): Number { return this.pos; }
    public getTitle(): String { return this.title; }
    public getDescription(): String { return this.description; }
    public getPreview(): String { return this.preview; }
    public getCategories(): Array<Category> { return this.categories };

    /* Setters */
    public setPos(pos: Number): void { this.pos = pos; }
    public setTitle(title: String): void { this.title = title; }
    public setDescription(description: String): void { this.description = description; }
    public setPreview(preview: String): void { this.preview = preview; }
    public setCategories(categories: Array<Category>): void { this.categories = categories };
    public AppendCategory(category: Category | Array<Category>): void {
      if (category instanceof Array) {
        this.categories = this.categories.concat(category);
      } else {
        this.categories.push(category);
      }
    };
    public deleteCategory(category: Category | Array<Category>) {
      if (category instanceof Array) {
        category.forEach(element => {
          deleteAt(this.categories, element);
        });
      } else {
        deleteAt(this.categories, category);
      }
    }

    /* Methods */
    public toJSON() {
      var categories: Object = this.categories.map((category: Category) => {
        return category.toJSON();
      });

      var itemJSON = {
        id: this.id,
        pos: this.pos,
        title: this.title,
        description: this.description,
        preview: this.preview,
        categories: categories
      };

      return itemJSON;
    }

    public fromJSON(jsonString: string): Item {
      var data: any = JSON.parse(jsonString);
      var categoriesData = data.categories;

      data.categories = [];
      categoriesData.forEach((category: Object) => {
        var categoryClass = new Category();
        categoryClass.fromJSON(JSON.stringify(category))
        data.categories.push(categoryClass);
      });

      Object.assign(this, data);

      return this;
    }
  }
}