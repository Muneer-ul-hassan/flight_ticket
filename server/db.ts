import { drizzle } from 'drizzle-orm/neon-serverless';
import { Pool, neonConfig } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

if (!process.env.DATABASE_URL) {
    throw new Error(
        "DATABASE_URL must be set. Did you forget to provision a database?",
    );
}

/**
 * Neon serverless functions can sometimes fail to resolve the host
 * when running in a Vercel environment. This ensures that the
 * neon driver is properly configured for serverless usage.
 */
neonConfig.fetchConnectionCache = true;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle(pool, { schema });
