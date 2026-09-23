export const importStatuses = ["QUOTATION", "APPROVAL", "PAYMENT", "PRODUCTION", "SHIPMENT", "IN_TRANSIT", "PORT", "CUSTOMS_CLEARANCE", "INLAND_TRANSPORT", "BANK_CLOSING", "COMPLETED"] as const;
export type ImportStatus = (typeof importStatuses)[number];

export type ProcessFacts = {
  activeProforma: boolean;
  activeCommercialInvoice: boolean;
  activeBillOfLading: boolean;
  bankCleared: boolean;
};

const transitions: Record<ImportStatus, readonly ImportStatus[]> = {
  QUOTATION: ["APPROVAL"], APPROVAL: ["PAYMENT"], PAYMENT: ["PRODUCTION"],
  PRODUCTION: ["SHIPMENT"], SHIPMENT: ["IN_TRANSIT"], IN_TRANSIT: ["PORT"],
  PORT: ["CUSTOMS_CLEARANCE"], CUSTOMS_CLEARANCE: ["INLAND_TRANSPORT"],
  INLAND_TRANSPORT: ["BANK_CLOSING"], BANK_CLOSING: ["COMPLETED"], COMPLETED: [],
};

export function validateTransition(from: ImportStatus, to: ImportStatus, facts: ProcessFacts): void {
  if (!transitions[from].includes(to)) throw new WorkflowError(`Transição inválida: ${from} → ${to}`);
  if (to === "APPROVAL" && !facts.activeProforma) throw new WorkflowError("A aprovação exige uma Proforma ativa.");
  if (to === "SHIPMENT" && !facts.activeCommercialInvoice) throw new WorkflowError("O embarque exige uma Commercial Invoice ativa.");
  if (to === "CUSTOMS_CLEARANCE" && !facts.activeBillOfLading) throw new WorkflowError("O desembaraço exige um BL ativo.");
  if (to === "COMPLETED" && !facts.bankCleared) throw new WorkflowError("A finalização exige baixa bancária.");
}

export class WorkflowError extends Error {
  constructor(message: string) { super(message); this.name = "WorkflowError"; }
}
