import { Court } from "src/court/court.entity";
import { User } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

// Definir un enum para los estados de la reserva
export enum ReservationStatusEnum {
  CREATED = 'created',
  FINISHED= 'finished',
  REJECTED = 'rejected'
}

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reservations, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @ManyToOne(() => Court, (court) => court.reservations, { nullable: false, onDelete: "CASCADE" })
  court: Court;

  @Column({ type: 'date', nullable: false })
  date: Date;

  @Column({ type: 'time', nullable: false })
  startTime: string;

  @Column({ type: 'time', nullable: false })
  endTime: string;

  @Column({
    type: 'enum',
    enum: ReservationStatusEnum,
    default: ReservationStatusEnum.CREATED,
  })
  status: ReservationStatusEnum;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
