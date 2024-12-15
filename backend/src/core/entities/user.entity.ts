import { createHmac } from 'crypto';
import { sign, verify } from 'jsonwebtoken';
import { env } from 'node:process';
import { z } from 'zod';

const ConfigSchema = z.object({
  secret: z.string().min(1),
  salt: z.string().min(1),
});

type UserConfig = z.infer<typeof ConfigSchema>;

abstract class User {
  protected readonly config: UserConfig;

  constructor() {
    this.config = ConfigSchema.parse({
      secret: `${env['JWT_SECRET']}`,
      salt: `${env['USER_SALT']}`,
    });
  }
}

type ExistingUserConstructorArgs = {
  id: string;
};

export class ExistingUser extends User {
  private _id: string;

  constructor({ id }: ExistingUserConstructorArgs) {
    super();
    this._id = id;
  }

  public signAndEncodeUserAccessToken() {
    const accessToken = sign({ sub: this._id }, this.config.secret, {
      expiresIn: 86400, // 24 hours
    });
    return accessToken;
  }

  public get id() {
    return this._id;
  }
}

export class NotExistingUser extends User {
  constructor() {
    super();
  }

  public hashPassword(notHashedPassword: string) {
    const hmac = createHmac('sha512', this.config.salt);
    hmac.update(notHashedPassword);
    return hmac.digest('hex');
  }

  public verifyAndDecodeUserAccessToken(accessToken: string): { id: string } {
    const { sub } = verify(accessToken, this.config.secret);
    if (sub && typeof sub === 'string') {
      return { id: sub };
    }
    throw "Expect a 'sub' property in jwt token payload";
  }
}
