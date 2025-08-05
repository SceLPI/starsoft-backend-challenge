import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('item')
export class ItemEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
}
