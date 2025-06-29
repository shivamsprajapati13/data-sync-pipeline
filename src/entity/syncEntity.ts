import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CurData {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  refId: string;

  @Column()
  name: string;

  @Column('numeric')
  value: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdated: Date;
}
