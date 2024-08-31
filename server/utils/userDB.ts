const db = hubDatabase();

/* Create user table */
db.prepare(`CREATE TABLE IF NOT EXISTS user (
  id TEXT NOT NULL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL
)`).run();

/* Create session table */
db.prepare(`CREATE TABLE IF NOT EXISTS session (
  id TEXT NOT NULL PRIMARY KEY,
  expires_at INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id)
)`).run();

/* Declare a user interface */
export interface DatabaseUser {
  id: string;
  username: string;
  password: string;
};