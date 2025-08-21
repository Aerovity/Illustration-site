import crypto from 'crypto';

/**
 * Generate HMAC hash for Chatbase identity verification
 * @param userId - Unique identifier for the user
 * @returns HMAC hash for identity verification
 */
export function generateChatbaseHMAC(userId: string): string {
  const secret = process.env.CHATBASE_SECRET_KEY;
  
  if (!secret) {
    throw new Error('CHATBASE_SECRET_KEY environment variable is not set');
  }
  
  return crypto.createHmac('sha256', secret).update(userId).digest('hex');
}

/**
 * Initialize Chatbase with identity verification
 * This function should be called on the client side when a user is authenticated
 * @param userId - Unique identifier for the user
 * @param userHash - HMAC hash generated on the server
 */
export function initializeChatbaseWithAuth(userId: string, userHash: string): void {
  if (typeof window !== 'undefined' && (window as any).chatbase) {
    (window as any).chatbase('config', {
      userId: userId,
      userHash: userHash
    });
  }
}

declare global {
  interface Window {
    chatbase: any;
  }
}