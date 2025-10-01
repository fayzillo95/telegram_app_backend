import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from 'src/common/types/auth.types';
import { UserRoles } from 'src/common/types/user.types';

@Injectable()
export class RoleAuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const roles: UserRoles[] | undefined = this.reflector.get<UserRoles[]>(
      'roles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const user = request['user'];

    if (!user || !user.role) {
      throw new ForbiddenException('Foydalanuvchi roli aniqlanmadi');
    }

    if (roles.includes(user.role) || user.role === UserRoles.ADMIN) {
      return true;
    }

    throw new ForbiddenException("Sizda ushbu sahifaga kirish huquqi yo'q");
  }
}
