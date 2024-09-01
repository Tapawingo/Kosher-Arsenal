import type { EventHandler, EventHandlerRequest } from 'h3'

export const defineWrappedResponseHandler = <T extends EventHandlerRequest, D> (
  handler: EventHandler<T, D>
): EventHandler<T, D> =>
  defineEventHandler<T>(async event => {
    try {
      const response = await handler(event)
            
      const db = hubDatabase();
      
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

      return { response }
    } catch (err) { return { err } }
  })

/* Declare a loadout interface */
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