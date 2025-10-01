import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Device = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.device;
  },
);
