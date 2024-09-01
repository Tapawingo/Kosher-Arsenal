
export class WebCryptoHash {
    public hash = async (password: string, salt: string) => {
        const encoder = new TextEncoder();
        const keyMaterial = await crypto.subtle.importKey(
            "raw",
            encoder.encode(password),
            'PBKDF2',
            false,
            ['deriveBits', 'deriveKey']
        );

        const key = await crypto.subtle.deriveKey(
            {
                name: 'PBKDF2',
                salt: encoder.encode(salt),
                iterations: 100_000,
                hash: 'SHA-256'
            },
            keyMaterial,
            { name: 'AES-GCM', length: 256 },
            true,
            ['encrypt', 'decrypt']
        );

        const hashed = await crypto.subtle.exportKey('raw', key);
        return Buffer.from(hashed).toString('hex');
    };

    public verify = async (storedHash: string, password: string, salt: string) => {
        const hashToVerify = await this.hash(password, salt);
        return storedHash === hashToVerify;
    };
};