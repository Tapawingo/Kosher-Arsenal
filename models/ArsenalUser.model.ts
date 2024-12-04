import type { User } from "lucia";

/**
 * Arsenal User serialized for storage
 */
export interface ArsenalUserSerialized {
    id: string;
    email: string;
    username: string;
    email_verified?: number;
}

/**
 * User class. Password and salt is omitted.
 * @param user A complete user to construct class from or user ID to fetch.
 */
export class ArsenalUser {
    id: string;
    email: string;
    username: string;
    email_verified?: number;

    constructor (user: ArsenalUser | User | string) {
        if (typeof user === 'string') {
            const fetchedUser = this._fetchFromId(user);
            this.id = fetchedUser.id;
            this.username = fetchedUser.username;
            this.email = fetchedUser.email;
            this.email_verified = fetchedUser.email_verified;
        } else {
            this.id = user.id;
            this.username = user.username;
            this.email = user.email;
        };
    }

    /**
     * Fetch user from API using user ID.
     * @param loadoutId ID of user to fetch
     * @private
     */
    private _fetchFromId (userId: string): ArsenalUser {
        // @TODO Create fetch from ID function. Should update the API first.
        return new ArsenalUser('');
    }
}