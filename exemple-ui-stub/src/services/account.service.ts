import crypto from 'crypto';

const accounts = new Map<string, unknown>();

export function create(account: unknown) {
    const accountId = crypto.randomUUID();
    accounts.set(accountId, account);
    return accountId;
}

export function get(accountId: string) {
    return accounts.get(accountId);
}

export function save(accountId: string, account: unknown) {
    accounts.set(accountId, account);
}

export function remove(accountId: string) {
    accounts.delete(accountId);
}