import crypto from 'crypto';

const accounts = new Map<string, any>();

export function create(account: any) {
    const accountId = crypto.randomUUID();
    accounts.set(accountId, account);
    return accountId;
}

export function get(accountId: string) {
    return accounts.get(accountId);
}

export function save(accountId: string, account: any) {
    accounts.set(accountId, account);
}

export function remove(accountId: string) {
    accounts.delete(accountId);
}