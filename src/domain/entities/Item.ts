export class Item {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public updatedAt: Date,
    public readonly createdAt: Date,
  ) {}
}
