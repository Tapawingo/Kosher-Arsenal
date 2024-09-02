import { D1Database } from "@nuxthub/core";

export const initializeDB = (db: D1Database): D1Database => {
  /* Create user table */
  db.prepare(`CREATE TABLE IF NOT EXISTS user (
    id TEXT NOT NULL PRIMARY KEY,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    salt TEXT NOT NULL
  )`).run();

  /* Create session table */
  db.prepare(`CREATE TABLE IF NOT EXISTS session (
    id TEXT NOT NULL PRIMARY KEY,
    expires_at INTEGER NOT NULL,
    user_id TEXT NOT NULL,
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

  return db;
};

export interface DatabaseUser {
  id: string;
  username: string;
  password: string;
  salt: string;
};

export interface DatabaseSession {
  id: string;
  expires_at: number;
  user_id: string;
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