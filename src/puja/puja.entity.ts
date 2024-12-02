import { Image } from 'src/imagen/imagen.entity';
import { User } from 'src/users/users.entity';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PujaBid } from './pujaBid.entity';

@Entity()
export class Puja {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.createdPujas)
  creator: User;

  @OneToMany(() => Image, (imagen) => imagen.puja)
  imagenes: Image[];

  @OneToMany(() => PujaBid, (pujaBid) => pujaBid.puja)
  pujas: PujaBid[];

  @Column()
  nombre: string;

  @Column()
  descripcion: string;

  @Column('decimal')
  pujaInicial: number;

  @Column()
  fechaFin: Date;
}
