import { describe, expect, it } from "vitest";
import { validateTransition } from "./workflow";

const complete = { activeProforma: true, activeCommercialInvoice: true, activeBillOfLading: true, bankCleared: true };
describe("bloqueios do fluxo de importação", () => {
  it("exige Proforma ativa antes da aprovação", () => expect(() => validateTransition("QUOTATION", "APPROVAL", { ...complete, activeProforma: false })).toThrow("Proforma ativa"));
  it("exige Commercial Invoice ativa antes do embarque", () => expect(() => validateTransition("PRODUCTION", "SHIPMENT", { ...complete, activeCommercialInvoice: false })).toThrow("Commercial Invoice ativa"));
  it("exige BL ativo antes do desembaraço", () => expect(() => validateTransition("PORT", "CUSTOMS_CLEARANCE", { ...complete, activeBillOfLading: false })).toThrow("BL ativo"));
  it("exige baixa bancária antes da finalização", () => expect(() => validateTransition("BANK_CLOSING", "COMPLETED", { ...complete, bankCleared: false })).toThrow("baixa bancária"));
  it("impede saltos de etapa", () => expect(() => validateTransition("QUOTATION", "SHIPMENT", complete)).toThrow("Transição inválida"));
  it("aceita a transição seguinte quando requisitos estão presentes", () => expect(() => validateTransition("PORT", "CUSTOMS_CLEARANCE", complete)).not.toThrow());
});
