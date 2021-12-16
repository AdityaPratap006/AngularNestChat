import { Injectable } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { CreateUserDto } from '../../model/dtos/create-user.dto';
import { LoginUserDto } from '../../model/dtos/login-user.dto';
import { User } from '../../model/interfaces/user.interface';

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
}
