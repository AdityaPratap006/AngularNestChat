import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { AuthService } from 'src/auth/service/auth.service';
import { CustomRequest } from 'src/interfaces/custom-request.interface';
import { UserService } from 'src/user/service/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async use(req: CustomRequest, _res: Response, next: NextFunction) {
    try {
      const tokenArray: string[] = req.headers.authorization?.split(' ');
      const decodedToken = await this.authService.verifyJwt(tokenArray[1]);

      // make sure that the user is not deleted, or that the props
      // or rights didn't change compared to the time when jwt was issued
      const user = await this.userService.getOne(decodedToken.user.id);

      if (!user) {
        throw new UnauthorizedException();
      }

      // add the user to the req object so we can access it later in the controllers
      req.user = user;
      next();
    } catch (error) {
      throw new UnauthorizedException('Unauthorized');
    }
  }
}
