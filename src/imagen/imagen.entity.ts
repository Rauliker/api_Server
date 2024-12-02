import { Puja } from 'src/puja/puja.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('imagenes')
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  url: string;

  @ManyToOne(() => Puja, (puja) => puja.imagenes)
  puja: Puja;
}
