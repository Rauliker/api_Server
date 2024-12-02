import { Provincia } from 'src/provincia/provinvia.entity'; // Corrige el nombre del archivo
import { User } from 'src/users/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('localidades')
export class Localidad {
  @PrimaryGeneratedColumn()
  id_localidad: number;

  @Column()
  nombre: string;

  @ManyToOne(() => Provincia, (provincia) => provincia.localidades)
  @JoinColumn({ name: 'id_provincia' })
  provincia: Provincia;

  @OneToMany(() => User, (user) => user.localidad)
  users: User[];
}