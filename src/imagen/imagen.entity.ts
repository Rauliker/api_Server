import { Puja } from 'src/subastas/subastas.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('imagenes')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Puja, (puja) => puja.imagenes,{ onDelete: 'CASCADE' })
  puja: Puja;
}
