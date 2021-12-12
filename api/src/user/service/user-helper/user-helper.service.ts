import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';
import { CreateUserDto } from '../../model/dtos/create-user.dto';
import { LoginUserDto } from '../../model/dtos/login-user.dto';
import { User } from '../../model/interfaces/user.interface';

// scrypt is callback based so with promisify we can await it
const scryptAsync = promisify(scrypt);

@Injectable()
export class UserHelperService {
  createUserDtoToEntity(createUserDto: CreateUserDto): Observable<User> {
    const { email, username, password } = createUserDto;
    return of({
      email,
      username,
      password,
    } as User);
  }

  loginUserDtoToEnity(loginUserDto: LoginUserDto): Observable<User> {
    const { email, password } = loginUserDto;
    return of({
      email,
      password,
    } as User);
  }

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
}
