import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { scrypt, randomBytes } from 'crypto';
import { from, Observable } from 'rxjs';
import { User } from '../../user/model/interfaces/user.interface';
import { promisify } from 'util';

// scrypt is callback based so with promisify we can await it
const scryptAsync = promisify(scrypt);

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async hashPassword(password: string) {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;
    return `${buf.toString('hex')}.${salt}`;
  }

  async comparePasswords(storedPassword: string, suppliedPassword: string) {
    // split() returns array
    const [hashedPassword, salt] = storedPassword.split('.');
    // we hash the new sign-in password
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;
    // compare the new supplied password with the stored hashed password
    return buf.toString('hex') === hashedPassword;
  }

  generateJwt(user: User): Observable<string> {
    return from(this.jwtService.signAsync({ user }));
  }
}
