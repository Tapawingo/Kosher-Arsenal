import type { User } from "lucia";
import type { ArsenalUserProfile, ArsenalUserProfileSerialized } from "./ArsenalUserProfile.model";

/**
 * Arsenal User serialized for storage
 */
export interface ArsenalUserSerialized {
    id: string;
    username: string;
    email?: string;
    emailVerified?: number;
    profile?: ArsenalUserProfileSerialized;
}

interface ArsenalUserOptions {
    id: string;
    username: string;
    email?: string;
    emailVerified?: number;
    profile?: ArsenalUserProfile;
}

/**
 * User class. Password and salt is omitted.
 * @param user A complete user to construct class from or user ID to fetch.
 */
export class ArsenalUser {
    id: string;
    username: string;
    email?: string;
    emailVerified?: number;
    profile?: ArsenalUserProfile;

    constructor (user: ArsenalUserOptions | User | string) {
        if (typeof user === 'string') {
            const fetchedUser = this._fetchFromId(user);
            this.id = fetchedUser.id;
            this.username = fetchedUser.username;
            this.email = fetchedUser.email;
            this.emailVerified = fetchedUser.emailVerified;
        } else {
            this.id = user.id;
            this.username = user.username;
            this.email = user.email;
        };
    }

    public serialize(): ArsenalUserSerialized {
        return {
            id: this.id,
            email: this.email,
            username: this.username,
            emailVerified: this.emailVerified,
            profile: this.profile?.serialize()
        }
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