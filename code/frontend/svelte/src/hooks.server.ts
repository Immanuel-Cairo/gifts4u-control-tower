import type { Handle } from '@sveltejs/kit/hooks';

// zorgt voor dat de login token gecheckt wordt
// Runs on the server for every request, before any load function or action.
export const handle: Handle = async ({ event, resolve }) => {
    event.locals.token = event.cookies.get('token');
    event.locals.role = event.cookies.get('role');
    return resolve(event);
};
