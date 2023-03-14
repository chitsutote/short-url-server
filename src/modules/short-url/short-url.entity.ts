import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import UserEntity from '../auth/user.entity';

@Entity()
export default class ShortUrl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  short_id: string;

  @Column()
  original_url: string;

  @Column({
    type: 'int',
    default: 0,
  })
  click_times: number;

  @Column({
    type: 'timestamptz',
    nullable: true,
  })
  expired_at?: Date;

  @CreateDateColumn({ type: 'timestamptz' })
  created_at: Date;

  @ManyToOne(
    type => UserEntity,
    {
      cascade: ['insert', 'update'],
      nullable: true,
    }
  )
  @JoinColumn({ name: 'user_id' })
  user?: UserEntity;
}
