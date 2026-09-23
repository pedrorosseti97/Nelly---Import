import type { AuditAction, Prisma, PrismaClient } from "@prisma/client";

type Tx = Prisma.TransactionClient | PrismaClient;

export async function recordMutation(tx: Tx, input: {
  actorId: string; action: AuditAction; entityType: string; entityId: string;
  before?: Prisma.InputJsonValue; after?: Prisma.InputJsonValue; reason?: string;
}): Promise<void> {
  await tx.auditEvent.create({ data: input });
  if (input.after) {
    const latest = await tx.entityVersion.findFirst({ where: { entityType: input.entityType, entityId: input.entityId }, orderBy: { version: "desc" }, select: { version: true } });
    await tx.entityVersion.create({ data: { entityType: input.entityType, entityId: input.entityId, version: (latest?.version ?? 0) + 1, snapshot: input.after, createdById: input.actorId } });
  }
}
