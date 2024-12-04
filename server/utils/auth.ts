import { Lucia, Session } from 'lucia';
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

export async function validateSession(luciaSession: Session | null, lucia: ReturnType<typeof initializeLucia>) {
  /* Check if user is logged in */
  if (!luciaSession) {
    throw createError({
      message: 'Unauthenticated User',
      statusCode: 403
    });
  }

  /* Validate session */
  const { session, user } = await lucia.validateSession(luciaSession.id);
  if (!session) throw createError({
    message: 'Unauthenticated User',
    statusCode: 403
  });

  return { session, user };
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