export enum ROLE {
  admin = "admin",
  user = "user",
  guest = "guest",
  manager = "manager"
};

export enum Permission {
  READ_ORDER = "read:order",
  WRITE_ORDER = "write:order",
  UPDATE_ORDER = "update:order",
  DELETE_ORDER = "delete:order",
  READ_USER = "read:user",
  WRITE_USER = "write:user",
  UPDATE_USER = "update:user",
  DELETE_USER = "delete:user",
  AUTH_LOGIN = "auth:login",
  AUTH_LOGOUT = "auth:logout"
}

type RolePermission = {
  [key in ROLE] : Permission[]
}

export const rolePermission: RolePermission = {
  [ROLE.admin]: [
    ...Object.values(Permission),
  ],
  [ROLE.user]: [
    Permission.WRITE_ORDER,
    Permission.UPDATE_ORDER,
    Permission.READ_USER,
    Permission.UPDATE_USER,
    Permission.DELETE_USER
  ],
  [ROLE.guest]: [
    Permission.WRITE_USER,
    Permission.READ_ORDER,
    Permission.AUTH_LOGIN
  ],
  [ROLE.manager]: [
    Permission.READ_ORDER,
    Permission.WRITE_ORDER,
    Permission.UPDATE_ORDER,
    Permission.DELETE_ORDER,
    Permission.READ_USER
  ]
}

export const toRole = (role: string): ROLE => {
  switch(role) {
    case ROLE.admin:
      return ROLE.admin;
    case ROLE.user:
      return ROLE.user;
    case ROLE.guest:
      return ROLE.guest;
    case ROLE.manager:
      return ROLE.manager;
    default:
      throw new Error(`Invalid role: ${role}`);
  }
}