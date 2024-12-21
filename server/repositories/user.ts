import { D1Database } from "@nuxthub/core";
import { isWithinExpirationDate } from "oslo";
import { alphabet, generateRandomString } from "oslo/crypto";
import { ArsenalUser, ArsenalUserSerialized } from "~/models/ArsenalUser.model";
import { ArsenalUserProfileSerialized } from "~/models/ArsenalUserProfile.model";
import { ArsenalUserSettingSerialized } from "~/models/ArsenalUserSetting.model";
import mailer from 'nodemailer';

import passwordMail from '../data/passwordMail.html'
import verificationMail from '../data/verificationMail.html'
import { object, string, ValidationError } from "yup";
import { generateId } from "lucia";

export default class UserRepository {
    private readonly db: D1Database;

    constructor (db: D1Database) {
        this.db = db;

        this._createTable();
    }

    /**
     * Get usder by ID
     * @param userId ID of user to fetch
     * @returns User
     */
    async getById(userId: string): Promise<ArsenalUserSerialized | null> {
        return await this.db.prepare(`
            SELECT
                id AS userId,
                email,
                email_verified AS emailVerified,
                username
            FROM user
            WHERE id = ?1
        `).bind(
            userId
        ).first<ArsenalUserSerialized>();
    }

    /**
     * Get user by username
     * @param username Username of user
     * @returns User
     */
    async getByUsername(username: string): Promise<ArsenalUserSerialized | null> {
        return await this.db.prepare(`
            SELECT
                id AS userId,
                email,
                email_verified AS emailVerified,
                username
            FROM user
            WHERE username = ?1
        `).bind(
            username
        ).first<ArsenalUserSerialized>();
    }

    /**
     * Get user by email
     * @param email Email of user
     * @returns User
     */
    async getByEmail(email: string): Promise<ArsenalUserSerialized | null> {
        return await this.db.prepare(`
            SELECT
                id AS userId,
                email,
                email_verified AS emailVerified,
                username
            FROM user
            WHERE email = ?1
        `).bind(
            email
        ).first<ArsenalUserSerialized>();
    }

    /**
     * Retrieves a user's profile from the user's ID
     * @param userId ID of user to get profile for
     */
    async getProfileById(userId: string): Promise<ArsenalUserProfileSerialized | null> {
        return await this.db.prepare(`
            SELECT
                user_profile.user_id as userId,
                user_profile.display_name as displayName,
                user_profile.biography,
                user_profile.avatar,
                user.username
            FROM user_profile
            INNER JOIN user ON user.id = user_profile.user_id
            WHERE user_profile.id = ?1 
            COLLATE NOCASE
        `).bind(
            userId
        ).first<ArsenalUserProfileSerialized>();
    }

    /**
     * Retrieves a user's profile from the user's Username
     * @param username Username of user to get profile for
     */
    async getProfileByUsername(username: string): Promise<ArsenalUserProfileSerialized | null> {
        return await this.db.prepare(`
            SELECT
                user_profile.user_id as userId,
                user_profile.display_name as displayName,
                user_profile.biography,
                user_profile.avatar,
                user.username
            FROM user_profile
            INNER JOIN user ON user.id = user_profile.user_id
            WHERE user.username = ?1 
            COLLATE NOCASE
        `).bind(
            username
        ).first<ArsenalUserProfileSerialized>();
    }

    /**
     * Get a user's settings and preferences
     * @param userId ID of user to get settings for
     * @returns An array of settings
     */
    async getSettingsById(userId: string): Promise<ArsenalUserSettingSerialized[]> {
        return (await this.db.prepare(`
            SELECT
                user_setting.user_id as userId,
                user_setting.setting,
                user_setting.value
            FROM user_setting
            WHERE user_id = ?1
        `).bind(
            userId
        ).all<ArsenalUserSettingSerialized>()).results;
    }

    /**
     * Update a user's settings
     * @param userId ID of user to update settings for
     * @param settings Array of settings to update
     */
    async updateSettings(userId: string, setting: string, value: any): Promise<any> {
        return await this.db.prepare(`
            INSERT INTO user_setting (user_id, setting, value)
            VALUES (?1, ?2, ?3)
            ON CONFLICT (user_id, setting) DO UPDATE
            SET value = ?3
        `).bind(
            userId,
            setting,
            value
        ).run();
    }

    /**
     * Update a user's profile
     * @param userId ID of user to update settings for
     * @param profileData New profile data
     */
    async updateProfile(userId: string, profileData: ArsenalUserProfileSerialized) {
        return await this.db.prepare(`
            INSERT INTO user_profile (user_id, display_name, biography, avatar)
            VALUES(?1, ?2, ?3, ?4)
            ON CONFLICT (user_id) DO UPDATE
            SET display_name = ?2, biography = ?3, avatar = ?4
        `).bind(
            userId,
            profileData.displayName,
            profileData.biography,
            profileData.avatar
        ).run();
    }

    /**
     * Create a new user
     * @param user Data of user to create
     */
    async createUser(username: string, password: string, email: string): Promise<any> {
        const userId = generateId(15);
        const salt = generateId(13);
        const hashedPassword = await new WebCryptoHash().hash(password, salt);

        const user = new ArsenalUser({
            id: userId,
            username: username,
            email: email,
            emailVerified: 0
        }).serialize();

        await this.db.prepare(`
            INSERT INTO user 
            (id, username, email, password, salt) 
            VALUES (?1, ?2, ?3, ?4, ?5)
        `).bind(
            user.id,
            user.username,
            user.email,
            hashedPassword,
            salt
        ).run();

        return user;
    }

    /**
     * Validate user sign in
     * @param username
     * @param password 
     * @returns True if user sign in is valid
     */
    async validateUserSignIn(username: string, password: string): Promise<ArsenalUserSerialized> {
        const existingUser = await this.db.prepare(`
            SELECT
                id,
                username,
                email,
                email_verified AS emailVerified,
                password,
                salt
            FROM user 
            WHERE username = ?
        `).bind(
            username
        ).first<ArsenalUserSerialized & { password: string, salt: string }>();
    
        if(!existingUser) throw createError({
            message: 'Incorrect username or password',
            statusCode: 400
        });

        if (!await new WebCryptoHash().verify(
            existingUser.password,
            password,
            existingUser.salt
        )) throw createError({
            message: 'Incorrect username or password',
            statusCode: 400
        });

        return existingUser;
    }

    /**
     * Generate password change token
     * @param userId ID of user to create token for
     * @returns Password Change token
     */
    async getPasswordToken(userId: string): Promise<string> {
        const EXPIRES_IN = 1000 * 60 * 60 * 2; // 2 hours

        const storedUserTokens = await this.db.prepare(`
            SELECT * FROM password_reset_token WHERE user_id = ?1
        `).bind(
            userId
        ).all<DatabasePasswordToken>();

        if (storedUserTokens.results.length > 0) {
            const reusableStoredToken = storedUserTokens.results.find((token: DatabasePasswordToken) => {
                return isWithinExpirationDate(new Date(Number(token.expires) - EXPIRES_IN / 2));
            });

            if (reusableStoredToken) return reusableStoredToken.id;
        }

        const token = generateRandomString(63, alphabet('a-z', '0-9'));
        await this.db.prepare(`
            INSERT INTO password_reset_token
            (id, expires, user_id)
            VALUES (?1, ?2, ?3)
        `).bind(
            token,
            new Date().getTime() + EXPIRES_IN,
            userId
        ).run();

        return token;
    }

    /**
     * Generate email verification token
     * @param userId ID of user to create token for
     * @returns Email verification token
     */
    async getVerificationToken(userId: string): Promise<string> {
        const EXPIRES_IN = 1000 * 60 * 60 * 48; // 48 hours

        const storedUserTokens = await this.db.prepare(`
            SELECT * FROM email_verification_token WHERE user_id = ?1
        `).bind(
            userId
        ).all<DatabasePasswordToken>();

        if (storedUserTokens.results.length > 0) {
            const reusableStoredToken = storedUserTokens.results.find((token: DatabasePasswordToken) => {
                return isWithinExpirationDate(new Date(Number(token.expires) - EXPIRES_IN / 2));
            });

            if (reusableStoredToken) return reusableStoredToken.id;
        }

        const token = generateRandomString(63, alphabet('a-z', '0-9'));
        await this.db.prepare(`
            INSERT INTO email_verification_token
            (id, expires, user_id)
            VALUES (?1, ?2, ?3)
        `).bind(
            token,
            new Date().getTime() + EXPIRES_IN,
            userId
        ).run();

        return token;
    }

    /**
     * Update mail address for user account
     * @param userId ID of user to update mail address for
     * @param mail New mail address
     */
    async updateMail(userId: string, mail: string): Promise<any> {
        return await this.db.prepare(`
            UPDATE user
            SET email = ?1, email_verified = 0
            WHERE id = ?1
        `).bind(
            userId,
            mail.toLowerCase()
        ).run();
    }

    /**
     * Send email verification mail
     * @param user User to send mail to
     * @param token Email verification token
     */
    async sendVerificationMail(user: ArsenalUserSerialized, token: string) {
        const transporter = this._createTransporter();
        const mailContent = replacePlaceholder(verificationMail, {
            'USERNAME': user.username,
            'TOKEN': token
        });

        let mail = {
            from: process.env.MAIL_ADDRESS,
            to: user.email,
            subject: 'Email Verification',
            html: mailContent
        };
        
        transporter.sendMail(mail, (error) => {
            if (error) {
                console.error(error);
                throw createError({
                    message: "Failed to send mail",
                    statusCode: 500
                });
            }
        });
    }

    /**
     * Send a password change email
     * @param user User to send mail to
     * @param token Password change token
     */
    async sendPasswordMail(user: ArsenalUserSerialized, token: string) {
        const transporter = this._createTransporter();
        const mailContent = replacePlaceholder(passwordMail, {
            'USERNAME': user.username,
            'TOKEN': token
        });

        let mail = {
            from: process.env.MAIL_ADDRESS,
            to: user.email,
            subject: 'Account password reset',
            html: mailContent
        };
    
        transporter.sendMail(mail, (error) => {
            if (error) {
                console.error(error);
                throw createError({
                    message: "Failed to send mail",
                    statusCode: 500
                });
            }
        });
    }

    /**
     * Validates a Password reset token
     * @param token The token to validate
     * @returns User ID
     */
    async validatePasswordResetToken (token: string): Promise<string> {
        let storedToken = await this.db.prepare(`
            SELECT 
                user_id AS userId,
                expires
            FROM password_reset_token 
            WHERE id = ?1
        `).bind(
            token
        ).first<{ userId: string, expires: string }>();

        if (!storedToken) throw createError({
            message: 'Invalid Token',
            statusCode: 400
        });

        await this.db.prepare(`
            DELETE FROM password_reset_token WHERE id = ?1
        `).bind(
            token
        ).run();
      
        const tokenExpires = Number(storedToken.expires);
        if (!isWithinExpirationDate(new Date(tokenExpires))) {
            throw createError({
                message: 'Token is expired',
                statusCode: 400
            });
        }
      
        return storedToken.userId;
    };

    /**
     * Validates a Email verification token
     * @param token The token to validate
     * @returns User ID
     */
    async validateVerificationToken(token: string): Promise<string> {
        let storedToken = await this.db.prepare(`
            SELECT 
                user_id AS userId,
                expires
            FROM email_verification_token 
            WHERE id = ?1
        `).bind(
            token
        ).first<{ userId: string, expires: string }>();

        if (!storedToken) throw createError({
            message: 'Invalid Token',
            statusCode: 400
        });

        await this.db.prepare(`
            DELETE FROM email_verification_token WHERE id = ?1
        `).bind(
            token
        ).run();
      
        const tokenExpires = Number(storedToken.expires);
        if (!isWithinExpirationDate(new Date(tokenExpires))) {
            throw createError({
                message: 'Token is expired',
                statusCode: 400
            });
        }
      
        return storedToken.userId;
    };

    /**
     * Update password for user account
     * @param userId ID of user to update password for
     * @param password Password to set
     */
    async updatePassword(userId: string, password: string) {
        const salt = generateId(13);
        const hashedPassword = await new WebCryptoHash().hash(password, salt);

        return await this.db.prepare(`
            UPDATE user 
            SET password = ?2, salt = ?3 
            WHERE id = ?1
        `).bind(
            userId,
            hashedPassword,
            salt
        ).run();
    }

    /**
     * Set the state of email verified
     * @param userId ID of user to set email verified state for
     * @param state state to set
     */
    async setEmailVerified(userId: string, state: boolean): Promise<any> {
        return await this.db.prepare(`
            UPDATE user 
            SET email_verified = ?2
            WHERE id = ?1
        `).bind(
            userId,
            state ? 1 : 0
        ).run();
    }

    async validateProfileBody(body: any) {
        try {
            await object({
                userId: string().required('Missing User ID'),
                displayName: string().required('Missing Display Name'),
                username: string().required('Missing Username'),
                biography: string().required('Missing Biography'),
                avatar: string().required('Missing Avatar')
            }).validate(body);

            return true;
          } catch (e: any) {
            console.warn(e);

            if (e instanceof ValidationError) {
                throw createError({
                    message: e.message,
                    statusCode: 400
                });
            } else {
                throw createError({
                    message: e,
                    statusCode: 400
                });
            }
        }
    }

    /**
     * Delete a user account
     * @param userId ID of user account to delete
     */
    async deleteUser(userId: string) {
        try {
            /* Delete sessions */
            this.db.prepare(`
                DELETE FROM user_session WHERE user_id = ?1
            `).bind(userId).run();
    
            /* Delete buylists */
            this.db.prepare(`
                DELETE FROM buylist WHERE user_id = ?1
            `).bind(userId).run();
    
            /* Delete collections */
            this.db.prepare(`
                DELETE FROM collection WHERE user_id = ?1
            `).bind(userId).run();
    
            /* Delete Loadouts */
            this.db.prepare(`
                DELETE FROM loadout WHERE owner = ?1
            `).bind(userId).run();
    
            /* Delete User */
            this.db.prepare(`
                DELETE FROM user WHERE id = ?1
            `).bind(userId).run();
        } catch (e: any) {
            throw createError({
                message: 'Failed to delete user',
                statusCode: 500
            });
        }
    }

    /**
     * Creates table if it doesn't exist
     * @private
     */
    private _createTable() {
        try {
            this.db.prepare(`
                CREATE TABLE IF NOT EXISTS user (
                    id TEXT NOT NULL PRIMARY KEY,
                    email TEXT NOT NULL UNIQUE,
                    email_verified INT NOT NULL DEFAULT 0,
                    username TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    salt TEXT NOT NULL
                );

                CREATE TABLE IF NOT EXISTS email_verification_token (
                    id TEXT NOT NULL PRIMARY KEY,
                    expires INTEGER NOT NULL,
                    user_id TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS password_reset_token (
                    id TEXT NOT NULL PRIMARY KEY,
                    expires INTEGER NOT NULL,
                    user_id TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS session (
                    id TEXT NOT NULL PRIMARY KEY,
                    expires_at INTEGER NOT NULL,
                    user_id TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS user_profile (
                    user_id TEXT NOT NULL PRIMARY KEY,
                    display_name TEXT NOT NULL,
                    biography TEXT NOT NULL,
                    avatar TEXT NOT NULL,
                    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
                );

                CREATE TABLE IF NOT EXISTS user_setting (
                    user_id TEXT NOT NULL,
                    setting TEXT NOT NULL,
                    value TEXT,
                    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
                    PRIMARY KEY (user_id, setting),
                    UNIQUE (user_id, setting)
                )
            `).run();
        } catch (e: any) {
            console.error(e);
            throw createError({
                message: 'Something went wrong',
                statusCode: 500
            });
        }
    }

    /**
     * Create a mail transporter
     * @returns mail transporter
     */
    private _createTransporter() {
        /* Log in to mail service */
        return mailer.createTransport({
            service: 'gmail',
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.MAIL_ADDRESS,
                pass: process.env.MAIL_PASSWORD
            }
        });
    }
}

/**
 * Replace placeholder values in a string (on the format {{ PLACEHOLDER }}) with data
 * @param htmlString String to search
 * @param data An object with key-value pairs to replace placeholders
 * @returns string with replaced placeholders
 */
const replacePlaceholder = (htmlString: string, data: { [key: string]: string }): string => {
    const regex = /{{\s*(\w+)\s*}}/g;

    return htmlString.replace(regex, (match, varName: string) => {
        if (varName in data) {
            return data[varName];
        } else {
            return match;
        }
    });
}