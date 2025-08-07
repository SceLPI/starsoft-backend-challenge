export interface IDeleteOrderUseCase {
  execute(id: string): Promise<void>;
}
