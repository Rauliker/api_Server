import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class ReservationStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}