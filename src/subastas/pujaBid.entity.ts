import { User } from 'src/users/users.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Puja } from './subastas.entity';

@Entity('puja_bids') // Nombre de la tabla
export class PujaBid {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Puja, (puja) => puja.pujas, { onDelete: 'CASCADE' })
  puja: Puja;

  @ManyToOne(() => User, (user) => user.pujaBids, { onDelete: 'CASCADE' })
  user: User;

  @Column({ default: false })
  iswinner: boolean;

  @Column('decimal', { precision: 10, scale: 2 })
  amount: number;

  @Column()
  email_user: string;
  @Column({ default: false })
  is_auto: boolean;
  @Column({ default: 0 })
  max_auto_bid: number;
  @Column({ default: 0 })
  increment: number;
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP'})
  fecha: Date;
}
