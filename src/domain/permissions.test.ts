import { describe, expect, it } from "vitest";
import { can } from "./permissions";

describe("RBAC", () => {
  it("reserva exclusão e reabertura ao Administrador", () => {
    expect(can("ADMIN", "demand:delete")).toBe(true); expect(can("ADMIN", "process:reopen")).toBe(true);
    expect(can("OPERATOR", "demand:delete")).toBe(false); expect(can("OPERATOR", "process:reopen")).toBe(false);
  });
  it("permite ao Operador editar e substituir documentos", () => { expect(can("OPERATOR", "finance:write")).toBe(true); expect(can("OPERATOR", "document:replace")).toBe(true); });
  it("mantém Visitante somente em consulta e download", () => { expect(can("VISITOR", "document:download")).toBe(true); expect(can("VISITOR", "process:write")).toBe(false); });
});
