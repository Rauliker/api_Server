import { Localidad } from 'src/localidad/localidad.entity';
import { User } from 'src/users/users.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('provincias')
export class Provincia {
  @PrimaryGeneratedColumn()
  id_provincia: number;

  @Column()
  nombre: string;

  @OneToMany(() => Localidad, (localidad) => localidad.provincia)
  localidades: Localidad[];

  @OneToMany(() => User, (user) => user.provincia)
  users: User[];
}
