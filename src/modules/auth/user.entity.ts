import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import ShortUrlEntity from '../short-url/short-url.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @OneToMany(
    type => ShortUrlEntity,
    short_url => short_url.user,
  )
  short_urls: ShortUrlEntity[];
}
