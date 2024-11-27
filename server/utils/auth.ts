import { Lucia } from 'lucia';
import { D1Adapter } from '@lucia-auth/adapter-sqlite';

import type { D1Database } from '@nuxthub/core';

export function initializeLucia(D1: D1Database) {
  D1 = initializeDB(D1);

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
        email: attributes.email,
        emailVerified: attributes.email_verified,
        username: attributes.username
      }
    }
  });
}

declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>;
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseUserAttributes {
  email: string;
  email_verified: number;
  username: string;
}