import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Generated,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  @Generated('uuid')
  id: string;

  @Column({ length: 500 })
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updated_at: Date;

  @BeforeInsert()
  setCreatedAt() {
    if (!this.created_at) {
      this.created_at = new Date();
    }
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updated_at = new Date();
  }
}
