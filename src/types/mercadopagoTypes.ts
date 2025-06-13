// Tipos para Mercado Pago

export type MercadoPagoPreferenceResponse = {
  initPoint: string;  // URL para redirigir al usuario
  sandboxInitPoint?: string;  // URL para pruebas en entorno sandbox
};

export enum MercadoPagoStatus {
  APPROVED = 'approved',
  PENDING = 'pending',
  REJECTED = 'rejected',
  IN_PROCESS = 'in_process',
  CANCELLED = 'cancelled'
}