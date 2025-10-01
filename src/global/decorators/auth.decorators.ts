import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import {
  IS_PUBLIC_KEY,
  MODEL_NAME,
  ROLE_NAME,
} from 'src/common/types/auth.types';
import { UserRoles } from 'src/common/types/user.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Permission = (name: ModelsEnumInPrisma) => SetMetadata(MODEL_NAME, name);
export const UserRole = (...roles: UserRoles[]) => SetMetadata(ROLE_NAME, roles);

export const UserData = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request['user'];
  },
);
