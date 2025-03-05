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

  @Column('text', { nullable: true })
  hours: number[];


  @Column({ nullable: false })
  totalPrice: number;

  @Column({ nullable: false })
  status: string; 

  @Column()
  imageLink: string; 

}
