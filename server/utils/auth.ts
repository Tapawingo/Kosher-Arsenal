import { Lucia } from 'lucia';
import { D1Adapter } from '@lucia-auth/adapter-sqlite';

import type { DatabaseUser } from './userDB';

const db = hubDatabase();

const adapter = new D1Adapter(db, {
  user: "user",
  session: "session"
});

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: !import.meta.dev /* Determines if the session is httpOnly */
    }
  },
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username
    }
  }
});

declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUser, "id">
  }
}