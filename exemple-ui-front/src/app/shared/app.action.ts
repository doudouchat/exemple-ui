export class Authenticate {
    static readonly type = '[App] Authenticate';
    constructor(public application: string, public password: string) { }
}
