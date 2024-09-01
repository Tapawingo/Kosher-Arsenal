import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D> (
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async event => {
    try {
      const response = await handler(event)
            
      /* Create loadout table */
      const db = hubDatabase();
      db.prepare(`CREATE TABLE IF NOT EXISTS userPreference (
        id BIGINT NOT NULL PRIMARY KEY
        user_id TEXT NOT NULL,
        key TEXT NOT NULL,
        value TEXT NOT NULL
        FOREIGN KEY (user_id) REFERENCES user(id)
      )`).run();

      return { response }
    } catch (err) { return { err } }
  })

/* Declare a loadout interface */
export interface DatabasePreference {
  id: number;
  user_id: string;
  key: string;
  value: string;
};