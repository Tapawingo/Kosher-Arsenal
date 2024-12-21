import type { User } from "lucia";

/**
 * Arsenal User profile serialized for storage
 */
export interface ArsenalUserProfileSerialized {
    userId: string;
    displayName: string;
    username: string;
    biography: string;
    avatar: string;
}

/**
 * Arsenal User Profile Options
 */
interface ArsenalUserProfileOptions {
    userId: string;
    username: string;
    displayName?: string;
    biography?: string;
    avatar?: string;
}

/**
 * User class. Password and salt is omitted.
 * @param user A complete user to construct class from or user ID to fetch.
 */
export class ArsenalUserProfile {
    userId!: string;
    displayName!: string;
    username!: string;
    biography!: string;
    avatar!: string;

    constructor (userProfile: ArsenalUserProfileOptions | string) {
        if (typeof userProfile === 'string') {
            this._fetchFromId(userProfile);
        } else {
            this.userId = userProfile.userId;
            this.username = userProfile.username;
            this.displayName = userProfile.displayName ?? userProfile.username;
            this.biography = userProfile.biography ?? '';
            this.avatar = userProfile.avatar ?? '/default_avatar.webp';
        };
    }

    /**
     * Serialize User Profile for storage
     * @returns Serialized User Profile
     */
    public serialize(): ArsenalUserProfileSerialized {
        return {
            userId: this.userId,
            displayName: this.displayName,
            username: this.username,
            biography: this.biography,
            avatar: this.avatar
        }
    }

    /**
     * Fetch user profile from API using user ID.
     * @param userId ID of user to fetch profile for
     * @private
     */
    private _fetchFromId (userId: string) {
        // @TODO Create fetch from ID function. Should update the API first.
        // asynchronus Fetch (no async for constructors)
    }
}