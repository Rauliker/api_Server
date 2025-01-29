import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../users/users.entity';


@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.tokens)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  token: string;

  @Column({nullable: true, })
  fcmToken: string;

  @Column()
  deviceInfo: string; 

  @Column()
  createdAt: Date;

  @Column({ nullable: true,  type: 'timestamp'})
  loggedOutAt: Date;
}
