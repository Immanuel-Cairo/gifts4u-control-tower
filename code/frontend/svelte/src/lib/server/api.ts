import { GATEWAY_SERVICE_API_URL } from '$app/env/private';
import type { Cookies } from '@sveltejs/kit';

/**
 * Calls the API gateway and sends the token of the logged-in user along.
 */
export function api(
	fetch: typeof globalThis.fetch,
	token: string | undefined,
	path: string,
	init: RequestInit = {}
): Promise<Response> {
	return fetch(`${GATEWAY_SERVICE_API_URL}${path}`, {
		...init,
		headers: {
			'Content-Type': 'application/json',
			...(token ? { Authorization: `Bearer ${token}` } : {})
		}
	});
}

/**
 * Reads the error message from a response body of a service or the gateway.
 */
export function errorMessage(body: unknown, fallback: string): string {
	const result = body as { errors?: { message?: string }[]; error?: { message?: string } } | null;
	return result?.errors?.[0]?.message ?? result?.error?.message ?? fallback;
}

/**
 * Removes the session cookies, used when logging out or when the token has expired.
 */
export function clearSession(cookies: Cookies): void {
	cookies.delete('token', { path: '/' });
	cookies.delete('role', { path: '/' });
}
