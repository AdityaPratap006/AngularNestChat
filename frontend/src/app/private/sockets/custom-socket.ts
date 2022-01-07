import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket, SocketIoConfig } from 'ngx-socket-io';
import { tokenGetter } from 'src/app/utils/token-getter';

const config: SocketIoConfig = {
  url: 'http://localhost:3000',
  options: {
    transportOptions: {
      polling: {
        extraHeaders: {
          authorization: tokenGetter(),
        },
      },
    },
  },
};

@Injectable({ providedIn: 'root' })
export class CustomSocket extends Socket {
  constructor() {
    super(config);
  }
}
