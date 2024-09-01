import { Lucia } from 'lucia';
import { D1Adapter } from '@lucia-auth/adapter-sqlite';

import type { D1Database } from '@nuxthub/core';
import type { DatabaseUser } from './userDB';

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: "user",
    session: "session"
  });
  
  return new Lucia(adapter, {
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
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: Omit<DatabaseUser, "id">
  }
}