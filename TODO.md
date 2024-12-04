# Version 1.2.0 Backlog
- [ ] Finish Loadout restructurization
  - [ ] Create table loadout, loadout_category, loadout_item (should also hold a boolean for gead DB), loadout_preview, with foreign keys linking eachother (remember ON DELETE CASCADE)
  - [ ] Create util to migrate existing loadouts to the new structure, also save the existing loadouts to json incase something goes wrong
  - [ ] Create util that gets run periodically and delete unused images from the R2 bucket
  - [ ] Create new models (classes) for the loadouts
  - [ ] Create getters for the arsenalStore that converts loadout data to their respective classes

- [ ] clean up the API (too many routes and confusing names)
  - [ ] instead of individual APIs, find where they are called and if multiple are called in the same location combine those APIs
  - [ ] Create utils for reoccuring code
  - [ ] Finish /api/user/content/[id].get.ts (This API fetches all user content for given user)

## Loadout schemas
### Loadout
```SQL
CREATE TABLE loadout (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    preview JSON,
    owner INT NOT NULL,
    visibility BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner) REFERENCES user(id) ON DELETE CASCADE
);
```
### Loadout_Contributor
```SQL
CREATE TABLE loadout_contributor (
    id SERIAL PRIMARY KEY,
    loadout_id INT NOT NULL,
    user_id INT NOT NULL,
    FOREIGN KEY (loadout_id) REFERENCES loadout(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    UNIQUE (loadout_id, user_id)
);
```
### Loadout_Category
```SQL
CREATE TABLE loadout_category (
    id TEXT PRIMARY KEY,
    loadout_id TEXT NOT NULL,
    item_id TEXT,
    position INTEGER DEFAULT 0 NOT NULL,
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    FOREIGN KEY(loadout_id) REFERENCES loadout(id),
    FOREIGN KEY(item_id) REFERENCES loadout_item(id)
);
```
### Loadout_Item
```SQL
CREATE TABLE loadout_item (
    id TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    loadout_id TEXT NOT NULL,
    position INTEGER,
    title TEXT,
    description TEXT,
    preview JSON,
    FOREIGN KEY(category_id) REFERENCES loadout_category(id)
);
```