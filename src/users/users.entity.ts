import { Localidad } from 'src/localidad/localidad.entity';
import { Provincia } from 'src/provincia/provinvia.entity';
import { PujaBid } from 'src/subastas/pujaBid.entity';
import { Puja } from 'src/subastas/subastas.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Token } from '../notification/token.entity';

@Entity('users')
export class User {
  @PrimaryColumn()
  email: string;

  @Column()
  username: string;
  
  @Column()
  password: string;

  @Column({ default: "no" })
  avatar: string;

  @Column({ default: 2 })
  role: number;

  @Column({ default: false })
  banned: boolean;

  @Column({type: 'decimal', precision: 10, scale: 2,default: 0 })
  balance?: number;

  @ManyToOne(() => Provincia, (provincia) => provincia.users)
  @JoinColumn({ name: 'id_provincia' })
  provincia: Provincia;

  @ManyToOne(() => Localidad, (localidad) => localidad.users)
  @JoinColumn({ name: 'id_localidad' })
  localidad: Localidad;

  @Column()
  calle: string;
  
  @OneToMany(() => Puja, (puja) => puja.creator)
  createdPujas: Puja[];
  
  @OneToMany(() => PujaBid, (pujaBid) => pujaBid.user)
  pujaBids: PujaBid[];

  @OneToMany(() => Token, (token) => token.user)
  tokens: Token[];
}
