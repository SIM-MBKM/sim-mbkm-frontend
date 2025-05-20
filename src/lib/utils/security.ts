import * as crypto from 'crypto';


export class LaravelCompatibleSecurity {
  private readonly key: string;
  
  /**
   * Constructor
   * @param key - The encryption key (APP_KEY from Laravel)
   */
  constructor(key: string) {
    // Remove base64: prefix if present
    this.key = key.startsWith("base64:") ? key.substring(7) : key;
  }

  /**
   * Generate hash of key exactly like Laravel does
   * @returns Hex string of the hash
   */
  private hashKey(): string {
    return crypto.createHash('sha256').update(this.key).digest('hex');
  }

  /**
   * PHP-style serialization for string values
   * @param value - Value to serialize
   * @returns Serialized string in PHP format
   */
  private phpSerialize(value: string): string {
    return `s:${value.length}:"${value}";`;
  }

  /**
   * PHP-style unserialization for string values
   * @param serialized - Serialized PHP string
   * @returns Unserialized string value
   */
  private phpUnserialize(serialized: string): string {
    // Basic validation
    if (!serialized.startsWith('s:')) {
      throw new Error('Not a serialized string');
    }

    // Extract length and content
    const matches = serialized.match(/^s:(\d+):"(.*?)";$/);
    if (!matches || matches.length < 3) {
      throw new Error('Invalid serialized format');
    }

    const length = parseInt(matches[1], 10);
    const content = matches[2];

    // Validate length
    if (content.length !== length) {
      throw new Error(`Content length mismatch, expected ${length}, got ${content.length}`);
    }

    return content;
  }


  /**
   * Generate an access key with timestamp in the format key@timestamp
   * Exactly matches Laravel and Go implementations
   * @returns Encrypted access key
   */
  public generateAccessKey(): string {
    // Format: key@timestamp (Unix timestamp in seconds)
    const timestamp = Math.floor(Date.now() / 1000);
    const value = `${this.key}@${timestamp}`;
    
    // Encrypt the formatted value
    return this.encrypt(value);
  }

  /**
   * Validate an access key and check if it's still valid
   * @param encryptedKey - The encrypted access key
   * @param maxAgeSeconds - Maximum age in seconds (optional, default: 3600)
   * @returns Object with validation result and timestamp information
   */
  public validateAccessKey(encryptedKey: string, maxAgeSeconds: number = 3600): {
    valid: boolean;
    timestamp?: number;
    age?: number;
    message?: string;
  } {
    try {
      // Decrypt the access key
      const decrypted = this.decrypt(encryptedKey);
      
      // Check if the format is correct (key@timestamp)
      const parts = decrypted.split('@');
      if (parts.length !== 2) {
        return { valid: false, message: 'Invalid access key format' };
      }
      
      // Extract key and timestamp
      const [key, timestampStr] = parts;
      const timestamp = parseInt(timestampStr, 10);
      
      // Check if the timestamp is valid
      if (isNaN(timestamp)) {
        return { valid: false, message: 'Invalid timestamp' };
      }
      
      // Check if the key matches
      if (key !== this.key) {
        return { valid: false, message: 'Key mismatch' };
      }
      
      // Check if the key is still valid based on age
      const now = Math.floor(Date.now() / 1000);
      const age = now - timestamp;
      
      if (age > maxAgeSeconds) {
        return { 
          valid: false, 
          timestamp,
          age,
          message: `Access key expired (age: ${age}s, max: ${maxAgeSeconds}s)` 
        };
      }
      
      // All checks passed
      return { 
        valid: true,
        timestamp,
        age
      };
    } catch (error) {
      return { 
        valid: false, 
        message: `Failed to validate access key: ${error instanceof Error ? error.message : String(error)}` 
      };
    }
  }

  /**
   * Encrypt a value exactly like Laravel does
   * @param value - Value to encrypt (string)
   * @returns Encrypted string (double base64 encoded)
   */
  public encrypt(value: string): string {
    try {
      // 1. Generate key hash in hex (same as Laravel)
      const keyHex = this.hashKey();
      // 2. Generate IV from first 16 chars of key hash (same as Laravel)
      const ivHex = keyHex.substring(0, 16);

      // 3. Serialize the value using PHP format (same as Laravel)
      const serialized = this.phpSerialize(value);

      // 4. Convert hex strings to ASCII bytes (exactly as PHP does)
      // Take first 32 ASCII bytes of keyHex for the key
      const keyBytes = Buffer.from(keyHex.substring(0, 32), 'utf8');
      
      // Take all 16 ASCII bytes of ivHex for the IV
      const ivBytes = Buffer.from(ivHex, 'utf8');

      // 5. Create cipher and encrypt data
      const cipher = crypto.createCipheriv('aes-256-cbc', keyBytes, ivBytes);
      
      // 6. Encrypt with PKCS7 padding (same as Laravel)
      let encrypted = cipher.update(Buffer.from(serialized, 'utf8'));
      encrypted = Buffer.concat([encrypted, cipher.final()]);
      
      // 7. Base64 encode the encrypted value (same as Laravel)
      const base64Value = encrypted.toString('base64');
      
      // 8. Base64 encode again (Laravel does this too)
      const doubleEncodedValue = Buffer.from(base64Value, 'utf8').toString('base64');

      return doubleEncodedValue;
    } catch (error) {
      throw new Error(`Encryption error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Decrypt a value exactly like Laravel does
   * @param encryptedValue - Double base64 encoded encrypted value
   * @returns Decrypted string
   */
  public decrypt(encryptedValue: string): string {
    try {
      // 1. Generate key hash in hex (same as Laravel)
      const keyHex = this.hashKey();

      // 2. Generate IV from first 16 chars of key hash (same as Laravel)
      const ivHex = keyHex.substring(0, 16);

      // 3. First base64 decode
      const decoded = Buffer.from(encryptedValue, 'base64').toString('utf8');
      
      // 4. Second base64 decode
      const ciphertext = Buffer.from(decoded, 'base64');

      // 5. Convert hex strings to ASCII bytes (exactly as PHP does)
      // Take first 32 ASCII bytes of keyHex for the key
      const keyBytes = Buffer.from(keyHex.substring(0, 32), 'utf8');
      
      // Take all 16 ASCII bytes of ivHex for the IV
      const ivBytes = Buffer.from(ivHex, 'utf8');

      // 6. Create decipher
      const decipher = crypto.createDecipheriv('aes-256-cbc', keyBytes, ivBytes);
      
      // 7. Decrypt data
      let decrypted = decipher.update(ciphertext);
      decrypted = Buffer.concat([decrypted, decipher.final()]);
      
      // 8. Convert to string
      const decryptedString = decrypted.toString('utf8');
      // 9. Unserialize
      try {
        const unserialized = this.phpUnserialize(decryptedString);
        return unserialized;
      } catch  {
        // If unserialization fails, return the raw decrypted string
        
        return decryptedString;
      }
    } catch (error) {
      throw new Error(`Decryption error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

/**
 * Create a new instance of LaravelCompatibleSecurity
 * @param key - The encryption key (APP_KEY from Laravel)
 * @returns A new LaravelCompatibleSecurity instance
 */
export function createLaravelSecurity(key: string): LaravelCompatibleSecurity {
  return new LaravelCompatibleSecurity(key);
}