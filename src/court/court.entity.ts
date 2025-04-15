import { CourtType } from "src/courtType/courtType.entity";
import { Reservation } from "src/reservartion/reservation.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
export enum CourtStatusEnum {
  OPEN   = 'open',
  CLOSED = 'closed',
}
@Entity()
export class Court {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, default: null })
  imageUrl: string;
  @Column()
  price: number;
  
  @ManyToOne(() => CourtType)
  type: CourtType;

  @Column({
      type: 'enum',
      enum: CourtStatusEnum,
      default: CourtStatusEnum.OPEN,
    })
    status: CourtStatusEnum;
  
  @OneToMany(() => Reservation, (reservation) => reservation.court)
  reservations: Reservation[];

  @Column('json', { nullable: false })
  availability: {
    monday: string[];
    tuesday: string[];
    wednesday: string[];
    thursday: string[];
    friday: string[];
    saturday: string[]; 
    sunday: string[];
  };
}

