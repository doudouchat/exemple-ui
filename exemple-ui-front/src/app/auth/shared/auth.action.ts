export class Authenticate {
  static readonly type = '[Auth] Authenticate';
  constructor(public username: string, public password: string) { }
}

export class Logout {
  static readonly type = '[Auth] Logout';
}
