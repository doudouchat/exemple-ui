
export const logins = new Map<string, string>();

export function create(username: string, accountId: string) {
    logins.set(username, accountId);
}

export function exists(username: string) {
    return logins.has(username);
}

export function get(username: string) {
    return logins.get(username);
}

export function remove(username: string) {
    logins.delete(username);
}