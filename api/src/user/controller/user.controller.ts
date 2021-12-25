import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { Pagination } from 'nestjs-typeorm-paginate';
import { map, Observable, switchMap } from 'rxjs';
import { CreateUserDto } from '../model/dtos/create-user.dto';
import { LoginUserDto } from '../model/dtos/login-user.dto';
import { LoginResponse } from '../model/interfaces/login-response.interface';
import { User } from '../model/interfaces/user.interface';
import { UserHelperService } from '../service/user-helper/user-helper.service';
import { UserService } from '../service/user/user.service';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private userHelperService: UserHelperService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto): Observable<User> {
    return this.userHelperService
      .createUserDtoToEntity(createUserDto)
      .pipe(switchMap((user: User) => this.userService.create(user)));
  }

  @Get()
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Observable<Pagination<User>> {
    limit = limit > 100 ? 100 : limit;

    return this.userService.findAll({
      page,
      limit,
      route: 'http://localhost:3000/api/users',
    });
  }

  @Post('login')
  login(@Body() loginUserDto: LoginUserDto): Observable<LoginResponse> {
    return this.userHelperService.loginUserDtoToEnity(loginUserDto).pipe(
      switchMap((user: User) => {
        return this.userService.login(user).pipe(
          map((jwt: string) => {
            const loginResponse: LoginResponse = {
              access_token: jwt,
              token_type: 'JWT',
              expires_in: 10000,
            };
            return loginResponse;
          }),
        );
      }),
    );
  }
}
