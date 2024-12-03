import { Localidad } from 'src/localidad/localidad.entity';
import { Provincia } from 'src/provincia/provinvia.entity';
import { Puja } from 'src/puja/puja.entity';
import { PujaBid } from 'src/puja/pujaBid.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryColumn()
  email: string;

  @Column()
  username: string;

  @Column()
  password: string;

  @Column({ default: 2 })
  role: number;


  @Column({ default: false })
  banned: boolean;

  @Column({ nullable: true, type: 'decimal', precision: 10, scale: 2 }) // Almacena hasta 10 dígitos en total, 2 de ellos decimales
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
}
