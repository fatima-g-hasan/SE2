import { Permission, ROLE, rolePermission } from "../config/roles";
import { AuthRequest } from "../config/types";
import { NextFunction, Request, Response } from "express";
import { AuthenticationFailedException } from "../util/exceptions/http/AuthenticationException";
import { InsufficientPermissionException, InvalidRoleException } from "../util/exceptions/http/AuthorizationException";
import logger from "../util/logger";

export function hasPermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      throw new AuthenticationFailedException();
    }
    const userRole = authReq.user.role;

    if (!rolePermission[userRole]) {
      logger.error(`Invalid role: ${userRole}`);
      throw new InvalidRoleException(userRole)
    }

    if (!rolePermission[userRole].includes(permission)) {
      logger.error(`User with role ${userRole} does not have permission ${permission}`);
      throw new InsufficientPermissionException();
    }

    next();
  }
}

export function hasRole(allowedRoles: ROLE[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authReq = req as AuthRequest;
    if (!authReq.user) {
      throw new AuthenticationFailedException();
    }
    const userRole = authReq.user.role;

    if (!allowedRoles.includes(userRole)) {
      logger.error(`User with role ${userRole} does not have access to this resource`);
      throw new InsufficientPermissionException();
    }
    next();
  }
}