import { Court } from "src/court/court.entity";
import { ReservationStatus } from "src/reservationStatus/reservationStatus.entity";
import { User } from "src/users/users.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

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

  @ManyToOne(() => ReservationStatus, { nullable: false })
  status: ReservationStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
