import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venueName: string;

  @Column()
  location: string;

  @Column()
  pricePerHour: number;

  @Column()
  category: string; 

  @Column('float')
  rating: number;

  @Column()
  image: string;
}
