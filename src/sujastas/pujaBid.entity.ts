import { User } from 'src/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Puja } from './puja.entity';

@Entity('puja_bids') // Nombre de la tabla
export class PujaBid {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Puja, (puja) => puja.pujas, { onDelete: 'CASCADE' })
  puja: Puja;

  @ManyToOne(() => User, (user) => user.pujaBids)
  user: User;

  @Column({ default: false })
  iswinner: boolean;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  email_user: string;
}
