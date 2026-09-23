export const roles = ["ADMIN", "OPERATOR", "VISITOR"] as const;
export type Role = (typeof roles)[number];

export type Permission =
  | "demand:read" | "demand:write" | "demand:delete"
  | "process:read" | "process:write" | "process:reopen"
  | "document:read" | "document:download" | "document:replace"
  | "finance:read" | "finance:write" | "approval:decide"
  | "user:manage";

const grants: Record<Role, ReadonlySet<Permission>> = {
  ADMIN: new Set<Permission>(["demand:read", "demand:write", "demand:delete", "process:read", "process:write", "process:reopen", "document:read", "document:download", "document:replace", "finance:read", "finance:write", "approval:decide", "user:manage"]),
  OPERATOR: new Set<Permission>(["demand:read", "demand:write", "process:read", "process:write", "document:read", "document:download", "document:replace", "finance:read", "finance:write"]),
  VISITOR: new Set<Permission>(["demand:read", "process:read", "document:read", "document:download", "finance:read"]),
};

export function can(role: Role, permission: Permission): boolean {
  return grants[role].has(permission);
}

export function requirePermission(role: Role, permission: Permission): void {
  if (!can(role, permission)) throw new AuthorizationError(permission);
}

export class AuthorizationError extends Error {
  constructor(public readonly permission: Permission) {
    super(`Permissão necessária: ${permission}`);
    this.name = "AuthorizationError";
  }
}
