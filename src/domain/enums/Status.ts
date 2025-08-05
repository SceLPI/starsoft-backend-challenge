// (pendente, processando, enviado, entregue, cancelado);

export const Status = {
  PENDING: 'pendente',
  PROCESSING: 'processando',
  SENT: 'enviado',
  DELIVERED: 'entregue',
  CANCELLED: 'cancelado',
} as const;

export type Status = (typeof Status)[keyof typeof Status];
