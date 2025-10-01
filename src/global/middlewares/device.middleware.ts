// import { Injectable, NestMiddleware } from '@nestjs/common';
// import { Request, Response, NextFunction } from 'express';
// import * as useragent from 'useragent';

// @Injectable()
// export class DeviceMiddleware implements NestMiddleware {
//   use(req: Request, _res: Response, next: NextFunction) {
//     const agent = useragent.parse(req.headers['user-agent']);
//     req['device'] = {
//       ip: req.ip || req.connection.remoteAddress,
//       agent: `${agent.family} ${agent.major}.${agent.minor}.${agent.patch}`,
//     };
//     next();
//   }
// }
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as useragent from 'useragent';

@Injectable()
export class DeviceMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const userAgentString = req.headers['user-agent'] || 'unknown';
    const agent = useragent.parse(userAgentString);

    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.socket.remoteAddress;

    req['device'] = {
      ip: ip,
      agent: `${agent.family} ${agent.major}.${agent.minor}.${agent.patch}`,
      os: agent.os.toString(),           // qo‘shimcha: operatsion tizim
      device: agent.device.toString(),   // qo‘shimcha: qurilma turi
    };

    next();
  }
}
