import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

export function utcDayRange(now = new Date()) {
    const start = new Date(now);
    start.setUTCHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setUTCDate(end.getUTCDate() + 1);
    return { start: start.toISOString(), end: end.toISOString() };
}

export async function cleanupTodayTransactions() {
    const envPath = resolve(__dirname, '../../.env');
    if (existsSync(envPath)) loadEnvFile(envPath);

    const projectUrl = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!projectUrl || !key) {
        throw new Error('Cleanup requires SUPABASE_URL and SUPABASE_SECRET_KEY (or SUPABASE_SERVICE_ROLE_KEY).');
    }

    const { start, end } = utcDayRange();
    const url = new URL('/rest/v1/transactions', projectUrl);
    url.searchParams.set('created_at', `gte.${start}`);
    url.searchParams.append('created_at', `lt.${end}`);
    const headers: Record<string, string> = { apikey: key, Prefer: 'count=exact' };
    // Legacy service_role JWTs also need the Authorization header.
    if (!key.startsWith('sb_secret_')) headers.Authorization = `Bearer ${key}`;

    async function request(method: 'HEAD' | 'DELETE') {
        let response: Response;
        try {
            response = await fetch(url, { method, headers, signal: AbortSignal.timeout(20_000) });
        } catch {
            throw new Error(`Supabase cleanup ${method} failed: connection error or timeout.`);
        }
        if (!response.ok) {
            // Do not print response bodies or credentials into test reports.
            throw new Error(`Supabase cleanup ${method} failed (HTTP ${response.status}). Check credentials, Data API access, and table permissions.`);
        }
        const total = response.headers.get('content-range')?.split('/')[1];
        if (!total || !/^\d+$/.test(total)) {
            throw new Error(`Supabase cleanup ${method}: exact row count unavailable.`);
        }
        return Number(total);
    }

    const before = await request('HEAD');
    console.log(`[cleanup] UTC range: ${start} <= created_at < ${end}; found ${before} transactions.`);
    const deleted = await request('DELETE');
    const remaining = await request('HEAD');
    console.log(`[cleanup] Deleted ${deleted} transactions (related items cascade); remaining: ${remaining}.`);
    if (remaining !== 0) throw new Error('Cleanup incomplete: transactions remain in the UTC day range.');
}

if (require.main === module) {
    cleanupTodayTransactions().catch(error => {
        console.error(error.message);
        process.exitCode = 1;
    });
}
