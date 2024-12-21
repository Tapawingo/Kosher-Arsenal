# Version 2.2.0 Backlog
- [ ] API V2
  - [X] Loadout Repository
  - [X] LoadoutCategory Repository
  - [X] LoadoutItem Repository
  - [X] LoadoutContributor Repository
  - [X] Loadouts API
    - [X] Test Loadouts API
  - [X] User Repository
  - [X] User API
    - [ ] Test User API
  - [X] Auth API
    - [ ] Test Auth API
  - [X] Buylist Repository
  - [X] buylist API
    - [ ] Test buylist API
  - [X] Tag Repository
  - [X] Tag API
    - [ ] Test Tag API
  - [ ] collection API [NEXT UPDATE]
    - [ ] Test collection API [NEXT UPDATE]

- [ ] New Database Structure
  - [X] New table `loadout`
  - [X] New table `loadout_contributor`
  - [X] New table `loadout_category`
  - [X] New table `loadout_item`
  - [ ] Migrate `buylist` into `buylist` and `buylist_item`
  - [ ] migrate `user_meta` into `user_profile`
  - [ ] migrate `loadouts` into `loadout`, `loadout_contributor`, `loadout_category` and `loadout_item`

- [ ] API V2 Frontend Implementation
  - [ ] Create util to migrate existing loadouts to the new structure, also save the existing loadouts to json incase something goes wrong
  - [ ] Create util that gets run periodically and delete unused images from the R2 bucket
  - [ ] Create new models (classes) for the loadouts
  - [ ] Create getters for the arsenalStore that converts loadout data to their respective classes
  - [ ] Make use of new V2 API
  - [ ] Add Captcha to user sign up and sign in
  - [ ] Require email verification to create loadouts and collections
  - [ ] Add image background removal option: https://www.npmjs.com/package/@imgly/background-removal

- [ ] General Cleanup
  - [ ] Move contents of `content` to `assets` or `public` and delete it
  - [ ] Completly delete old `classes` directory
  - [ ] Remove old example and test files (`example-data.json`, `example-loadout.json`, `example_m653_preview.webp`)
  - [ ] Complete SEO by adding a `schema.org`, `sitemap.xml`, `robots.txt`

- [ ] General Frontend
  - [ ] Add delete button next to upload field in modals
  - [ ] Add general UI Components to replace @nuxt/ui components
  - [ ] Add Styles for signin and signup pages
  - [ ] Fix item preview scaling
  - [ ] Add "Login with/Signup with" thirdparty providers. (google, etc.)

- [ ] General security
  - [ ] Add auditing logs
  - [ ] Add IP tracking of users (to detect new logins and warn the user)
  - [ ] Remove verbose backend errors (don't send the user specific database errors, instead log them)
  - [ ] The audit log should email me with sever errors
  - [ ] Add Terms of Use, Terms and Conditions etc. also add consent boxes [GDPR]
  - [ ] Add captcha for login and signup
  - [ ] Add "forget me" functionality (delete user) [GDPR]
  - [ ] Make sure profiles and loadouts aren't crawlable [GDPR]
  - [ ] Add "Export Data" functionality (dump all data held by the user) [GDPR]
  - [ ] Consent to cookies (literally only color mode cookie) [GDPR]
  - [ ] Encrypt data at rest (?) (does this apply to all data or only sensitive data?) [GDPR]


## Loadout schemas
### Loadout
```SQL
CREATE TABLE loadout (
    id          TEXT          PRIMARY KEY,
    title       VARCHAR(255)  NOT NULL,
    description VARCHAR(1024) NOT NULL,
    preview     TEXT          NOT NULL,
    owner       INT           NOT NULL,
    visibility  BIGINT        NOT NULL,
    created_at  TIMESTAMP     NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP     NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner) REFERENCES user(id) ON DELETE CASCADE
);
```
### Loadout_Contributor
```SQL
CREATE TABLE loadout_contributor (
    id         TEXT PRIMARY KEY,
    loadout_id INT  NOT NULL,
    user_id    INT  NOT NULL,
    FOREIGN KEY (loadout_id) REFERENCES loadout(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    UNIQUE (loadout_id, user_id)
);
```
### Loadout_Category
```SQL
CREATE TABLE loadout_category (
    id         TEXT PRIMARY KEY,
    loadout_id TEXT NOT NULL,
    item_id    TEXT,
    position   INT  NOT NULL DEFAULT 0,
    icon       TEXT NOT NULL,
    title      TEXT NOT NULL,
    FOREIGN KEY(loadout_id) REFERENCES loadout(id),
    FOREIGN KEY(item_id) REFERENCES loadout_item(id)
);
```
### Loadout_Item
```SQL
CREATE TABLE loadout_item (
    id          TEXT PRIMARY KEY,
    category_id TEXT NOT NULL,
    loadout_id  TEXT NOT NULL,
    position    INT,
    title       TEXT NOT NULL,
    description TEXT NOT NULL,
    preview     TEXT,
    FOREIGN KEY(category_id) REFERENCES loadout_category(id)
);
```

## User Schemas
### User
```SQL
CREATE TABLE IF NOT EXISTS user (
    id             TEXT NOT NULL PRIMARY KEY,
    email          TEXT NOT NULL UNIQUE DEFAULT 'unset',
    email_verified INT  NOT NULL        DEFAULT 0,
    username       TEXT NOT NULL UNIQUE,
    password       TEXT NOT NULL,
    salt           TEXT NOT NULL
)
```

### Email Verification Token
```SQL
CREATE TABLE IF NOT EXISTS email_verification_token (
    id      TEXT NOT NULL PRIMARY KEY,
    expires INT  NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
)
```

### Password Reset Token
```SQL
CREATE TABLE IF NOT EXISTS password_reset_token (
    id      TEXT NOT NULL PRIMARY KEY,
    expires INT  NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
)
```

### Session
```SQL
CREATE TABLE IF NOT EXISTS session (
    id         TEXT NOT NULL PRIMARY KEY,
    expires_at INT  NOT NULL,
    user_id    TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
)
```

### User Profile
```SQL
CREATE TABLE IF NOT EXISTS user_profile (
    user_id      TEXT NOT NULL PRIMARY KEY,
    display_name TEXT NOT NULL,
    biography    TEXT NOT NULL,
    avatar       TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
)
```

### User Setting
```SQL
CREATE TABLE IF NOT EXISTS user_setting (
    user_id TEXT NOT NULL,
    setting TEXT NOT NULL,
    value   TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    PRIMARY KEY (user_id, setting),
    UNIQUE (user_id, setting)
)
```

## Buylists
### Buylist
```SQL
CREATE TABLE IF NOT EXISTS buylist (
    id TEXT PRIMARY KEY,
    owner TEXT NOT NULL,
    loadout_id TEXT NOT NULL,
    visbility INT DEFAULT 2,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (loadout_id) REFERENCES loadout(id) ON DELETE CASCADE
);
```

### Buylist Item
```SQL
CREATE TABLE IF NOT EXISTS buylist_item (
    id TEXT NOT NULL PRIMARY KEY,
    item_id TEXT NOT NULL,
    buylist_id TEXT NOT NULL,
    owned INT,
    store TEXT,
    price TEXT,
    store_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    price_updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (buylist_id) REFERENCES buylist(id) ON DELETE CASCADE,
    FOREIGN KEY (item_id) REFERENCES loadout_item(id) ON DELETE CASCADE,
    UNIQUE (loadout_id, buylist_id)
);
```

## Tags
### Tag
```SQL
CREATE TABLE IF NOT EXISTS tag (
    label TEXT NOT NULL PRIMARY KEY UNIQUE,
    type INT NOT NULL
)
```

### Tag Loadout Relation
```SQL
CREATE TABLE IF NOT EXISTS tag_loadout_relation (
    tag_label TEXT NOT NULL,
    loadout_id TEXT NOT NULL,
    FOREIGN KEY (tag_label) REFERENCES tag(label) ON DELETE CASCADE,
    FOREIGN KEY (loadout_id) REFERENCES loadouts(id) ON DELETE CASCADE,
    PRIMARY KEY (tag_label, loadout_id)
)
```

## API V2
### Loadouts
```haskell
GET    /api/v2/loadouts
POST   /api/v2/loadouts
GET    /api/v2/loadouts/:loadout_id
DELETE /api/v2/loadouts/:loadout_id
PATCH  /api/v2/loadouts/:loadout_id
GET    /api/v2/user/:id/loadouts
```

### Previews
```haskell
PUT    /api/v2/loadouts/preview
DELETE /api/v2/loadouts/preview
```

### Categories
```haskell
GET    /api/v2/loadouts/:id/categories
POST   /api/v2/loadouts/:id/categories
GET    /api/v2/loadouts/:id/categories/:category_id
DELETE /api/v2/loadouts/:id/categories/:category_id
PATCH  /api/v2/loadouts/:id/categories/:category_id
```

### Items
```haskell
GET    /api/v2/loadouts/:id/items?category_id=
POST   /api/v2/loadouts/:id/items/?category_id=
GET    /api/v2/loadouts/:id/items/:item_id
DELETE /api/v2/loadouts/:id/items/:item_id
PATCH  /api/v2/loadouts/:id/items/:item_id
```

### Contributors
```haskell
GET    /api/v2/loadouts/:id/contributors
POST   /api/v2/loadouts/:id/contributors
DELETE /api/v2/loadouts/:id/contributors/:user_id
```

### User
```haskell
GET    /api/v2/user
DELETE /api/v2/user
PATCH  /api/v2/user/:id/mail
GET    /api/v2/user/:id/profile
GET    /api/v2/user/:username/profile
PATCH  /api/v2/user/:id/profile
GET    /api/v2/user/setting
PATCH  /api/v2/user/setting
PUT    /api/v2/user/avatar
DELETE /api/v2/user/avatar
```

### Auth
```haskell
POST   /api/v2/auth/signin
POST   /api/v2/auth/signout
POST   /api/v2/auth/signup
PATCH  /api/v2/auth/password/:token
POST   /api/v2/auth/password/reset
GET    /api/v2/auth/email/:token
POST   /api/v2/auth/email/send
```

### Buylist
```haskell
GET    /api/v2/user/:id/buylists
GET    /api/v2/user/buylists
GET    /api/v2/loadouts/:id/buylists
GET    /api/v2/loadouts/:id/buylist
GET    /api/v2/items/:id/buylist
PATCH  /api/v2/buylists/:id/item/:item_id
DELETE /api/v2/buylists/:id/item/:item_id
PATCH  /api/v2/buylists/:id
DELETE /api/v2/buylists/:id
```

### Tag
```haskell
GET    /api/v2/tags/:label
GET    /api/v2/tags/top
GET    /api/v2/loadouts/:id/tags
POST   /api/v2/loadouts/:id/tags
```