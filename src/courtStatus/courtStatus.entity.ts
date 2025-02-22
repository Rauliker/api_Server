import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class CourtStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}