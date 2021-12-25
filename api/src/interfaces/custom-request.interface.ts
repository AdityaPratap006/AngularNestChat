import { Request } from 'express';
import { User } from '../user/model/interfaces/user.interface';

export interface CustomRequest extends Request {
  user?: User;
}
