import { User } from 'src/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Puja } from './puja.entity';

@Entity()
export class PujaBid {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Puja, (puja) => puja.pujas)
  puja: Puja;

  @ManyToOne(() => User, (user) => user.pujaBids)
  user: User;

  @Column('decimal')
  amount: number; // El monto de la puja
}
