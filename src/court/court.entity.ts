import { CourtStatus } from "src/courtStatus/courtStatus.entity";
import { CourtType } from "src/courtType/courtType.entity";
import { Reservation } from "src/reservartion/reservation.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Court {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true, default: null })
  imageUrl: string;
  
  @ManyToOne(() => CourtType)
  type: CourtType;

  @ManyToOne(() => CourtStatus)
  status: CourtStatus;

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

