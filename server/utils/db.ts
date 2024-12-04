import { D1Database } from "@nuxthub/core";

export const dateToSQL = (date: Date) => {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

export const initializeDB = (db: D1Database): D1Database => {
  /* Create user table */
  db.prepare(`CREATE TABLE IF NOT EXISTS user (
    id TEXT NOT NULL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE DEFAULT 'unset',
    email_verified INT NOT NULL DEFAULT 0,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    salt TEXT NOT NULL
  )`).run();

  db.prepare(`CREATE TABLE IF NOT EXISTS email_verification_token (
    id TEXT NOT NULL PRIMARY KEY,
    expires INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
  )`).run();

  db.prepare(`CREATE TABLE IF NOT EXISTS password_reset_token (
    id TEXT NOT NULL PRIMARY KEY,
    expires INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
  )`).run();

  /* Create session table */
  db.prepare(`CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
  )`).run();

  /* Create user meta table */
  db.prepare(`CREATE TABLE IF NOT EXISTS user_meta (
    user_id TEXT NOT NULL PRIMARY KEY,
    display_name TEXT NOT NULL,
    biography TEXT NOT NULL,
    avatar TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
  )`).run();

  /* Create loadout table */
  db.prepare(`CREATE TABLE IF NOT EXISTS loadouts (
    id TEXT NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    owner TEXT NOT NULL,
    collaborators JSON NOT NULL,
    preview JSON NOT NULL,
    tags JSON NOT NULL,
    visibility BIGINT NOT NULL,
    collections JSON NOT NULL,
    categories JSON NOT NULL,
    FOREIGN KEY (owner) REFERENCES user(id)
  )`).run();

  /* Create user settings table */
  db.prepare(`CREATE TABLE IF NOT EXISTS user_setting (
    user_id TEXT NOT NULL,
    setting TEXT NOT NULL,
    value TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    PRIMARY KEY (user_id, setting),
    UNIQUE (user_id, setting)
  )`).run();

  /* Create buylist table */
  db.prepare(`CREATE TABLE IF NOT EXISTS buylist (
    user_id TEXT NOT NULL,
    loadout_id TEXT NOT NULL,
    item_id TEXT NOT NULL PRIMARY KEY UNIQUE,
    owned INT,
    store TEXT,
    price TEXT,
    FOREIGN KEY (user_id) REFERENCES user(id),
    FOREIGN KEY (loadout_id) REFERENCES loadouts(id)
  )`).run();

  /* Create collection table */
  db.prepare(`CREATE TABLE IF NOT EXISTS collection (
    id TEXT NOT NULL PRIMARY KEY UNIQUE,
    user_id TEXT NOT NULL,
    loadouts TEXT NOT NULL,
    preview TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(id)
  )`).run();

  /* Create collection_loadout_relation table */
  // db.prepare('DROP TABLE collection_loadout_relation').run();
  db.prepare(`CREATE TABLE IF NOT EXISTS collection_loadout_relation (
    collection_id TEXT NOT NULL,
    loadout_id TEXT NOT NULL,
    FOREIGN KEY (collection_id) REFERENCES collection(id),
    FOREIGN KEY (loadout_id) REFERENCES loadouts(id),
    PRIMARY KEY (collection_id, loadout_id)
  )`).run();

  /* Create tag table */
  // db.prepare('DROP TABLE tag').run();
  db.prepare(`CREATE TABLE IF NOT EXISTS tag (
    label TEXT NOT NULL PRIMARY KEY UNIQUE,
    type INT NOT NULL
  )`).run();

  /* create tag_loadout_relation */
  // db.prepare('DROP TABLE tag_loadout_relation').run();
  db.prepare(`CREATE TABLE IF NOT EXISTS tag_loadout_relation (
    tag_label TEXT NOT NULL,
    loadout_id TEXT NOT NULL,
    FOREIGN KEY (tag_label) REFERENCES tag(label) ON DELETE CASCADE,
    FOREIGN KEY (loadout_id) REFERENCES loadouts(id) ON DELETE CASCADE,
    PRIMARY KEY (tag_label, loadout_id)
  )`).run();

  return db;
};

export interface DatabaseUser {
  id: string;
  email: string;
  email_verified: number;
  username: string;
  password: string;
  salt: string;
};

export interface DatabaseEmailToken {
  id: string;
  expires: number;
  user_id: string;
}

export interface DatabasePasswordToken {
  id: string;
  expires: number;
  user_id: string;
}

export interface DatabaseSession {
  id: string;
  expires_at: number;
  user_id: string;
};

export interface DatabaseUserMeta {
  user_id: string;
  display_name: string;
  biography: string;
  avatar: string;
};

export interface DatabaseLoadout {
  id: string,
  title: string,
  description: string,
  owner: string,
  collaborators: string,
  preview: string,
  tags: string,
  visibility: number,
  collections: string,
  categories: string
};

export interface DatabaseUserSetting {
  user_id: string;
  setting: string;
  value: string | null;
};

export interface DatabaseBuylistItem {
  user_id: string;
  loadout_id: string;
  item_id: string;
  owned: 0 | 1;
  store: string;
  price: string;
};