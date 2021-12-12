import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { UserEntity } from '../../model/entities/user.entity';
import { User } from '../../model/interfaces/user.interface';
import { Repository } from 'typeorm';
import { UserHelperService } from '../user-helper/user-helper.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private userHelperService: UserHelperService,
  ) {}

  create(newUser: User): Observable<User> {
    return this.mailExists(newUser.email).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          return this.hashPassword(newUser.password).pipe(
            switchMap((hashedPassword) => {
              // overwrite the user password with hash
              newUser.password = hashedPassword;

              return from(this.userRepository.save(newUser)).pipe(
                switchMap((user: User) => this.findOne(user.id)),
              );
            }),
          );
        } else {
          throw new ConflictException('Email already in use');
        }
      }),
    );
  }

  findAll(options: IPaginationOptions): Observable<Pagination<User>> {
    return from(paginate<UserEntity>(this.userRepository, options));
  }

  // TODO: Refactor to use JWT
  login(user: User): Observable<boolean> {
    return from(this.findByEmail(user.email)).pipe(
      switchMap((foundUser: User) => {
        if (!foundUser) throw new NotFoundException('user not found');

        return this.validatePassword(user.password, foundUser.password).pipe(
          switchMap((matches) => {
            if (!matches)
              throw new UnauthorizedException(
                'login failed, wrong credentials',
              );

            return this.findOne(foundUser.id).pipe(mapTo(true));
          }),
        );
      }),
    );
  }

  private mailExists(email: string): Observable<boolean> {
    return from(this.userRepository.findOne({ email })).pipe(
      map((user: User) => {
        if (user) {
          return true;
        }

        return false;
      }),
    );
  }

  private hashPassword(password: string): Observable<string> {
    return from(this.userHelperService.hashPassword(password));
  }

  private findOne(id: number): Observable<User> {
    return from(this.userRepository.findOne({ id }));
  }

  // Also returns the password
  private findByEmail(email: string): Observable<User> {
    return from(
      this.userRepository.findOne(
        { email },
        { select: ['id', 'email', 'username', 'password'] },
      ),
    );
  }

  private validatePassword(
    password: string,
    storedPassword: string,
  ): Observable<boolean> {
    return from(
      this.userHelperService.comparePasswords(storedPassword, password),
    );
  }
}
