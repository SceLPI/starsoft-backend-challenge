export interface CreateOrderUseCaseParams {
  items: {
    itemId: string;
    quantity: number;
  }[];
  createdAt: Date;
}
