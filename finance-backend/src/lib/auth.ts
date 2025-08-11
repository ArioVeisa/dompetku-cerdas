import { NextRequest } from "next/server";

// Helper untuk mendapatkan user ID dari session token
export function getUserIdFromToken(token: string): string | null {
  try {
    // Format token: session_userId_timestamp
    const parts = token.split('_');
    if (parts.length >= 2 && parts[0] === 'session') {
      return parts[1];
    }
    return null;
  } catch {
    return null;
  }
}

// Helper untuk mendapatkan user ID dari request
export function getUserId(req: NextRequest): string | null {
  // Cek Authorization header
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    return getUserIdFromToken(token);
  }

  // Cek query parameter (untuk development)
  const userId = req.nextUrl.searchParams.get('userId');
  if (userId) {
    return userId;
  }

  return null;
}

// Helper untuk mendapatkan user ID dengan fallback ke demo user
export function getUserIdWithFallback(req: NextRequest): string {
  const userId = getUserId(req);
  return userId || 'u1'; // Fallback ke demo user jika tidak ada
}
