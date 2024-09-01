import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D> (
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async event => {
    try {
      const response = await handler(event)
            
      const db = hubDatabase();
      
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

      return { response }
    } catch (err) { return { err } }
  })

/* Declare a user interface */
export interface DatabaseUser {
  id: string;
  username: string;
  password: string;
  salt: string;
};