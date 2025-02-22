import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CourtType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}