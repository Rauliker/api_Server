import { Court } from "src/court/court.entity";
import { ReservationStatus } from "src/reservationStatus/reservationStatus.entity";
import { User } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reservations)
  user: User;

  @ManyToOne(() => Court, (court) => court.reservations)
  court: Court;

  @Column({ type: 'date' })
  date: Date;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @ManyToOne(() => ReservationStatus)
  status: ReservationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
