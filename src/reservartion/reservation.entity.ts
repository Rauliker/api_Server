import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venueId: string;

  @Column()
  userId: string;

  @Column()
  beginTime: number;

  @Column()
  endTime: number;

  @Column()
  bookingTime: number;

  @Column('int', { array: true })
  hours: number[];

  @Column()
  totalPrice: number;

  @Column()
  status: string; // You can define an enum for status if needed
}
