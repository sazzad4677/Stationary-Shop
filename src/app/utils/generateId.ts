import crypto from 'crypto';
export function generateId(prefix: string, userId: string): string {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '');
  const uniquePart = crypto.randomBytes(3).toString('hex').toUpperCase();
  const userIdentifier = userId.slice(-4);
  return `${prefix}-${timestamp}-${userIdentifier}-${uniquePart}`;
}