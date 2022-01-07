import { UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { AuthService } from 'src/auth/service/auth.service';
import { User } from 'src/user/model/interfaces/user.interface';
import { UserService } from 'src/user/service/user/user.service';

@WebSocketGateway({
  cors: [
    'http://localhost:4200',
    'http://localhost:3000',
    'https://hoppscotch.io',
  ],
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  users: Record<string, string> = {};

  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  @SubscribeMessage('message')
  async handleMessage(socket: Socket) {
    return 'Hello World';
  }

  async handleConnection(socket: Socket, ...args: any[]) {
    try {
      const {
        handshake: {
          headers: { authorization: authToken },
        },
      } = socket;
      const decodedToken = await this.authService.verifyJwt(authToken);
      const user: User = await this.userService.getOne(decodedToken.user.id);

      if (!user) {
        throw new Error('user not found');
      } else {
        this.users[`user-${user.id}`] = user.username;
        this.server.emit('message', JSON.stringify(this.users));
      }
    } catch (error) {
      this.disconnect(socket);
    }
  }

  handleDisconnect(client: Socket) {
    this.disconnect(client);
  }

  private disconnect(socket: Socket) {
    socket.emit('Error', new UnauthorizedException());
    socket.disconnect();
  }
}
