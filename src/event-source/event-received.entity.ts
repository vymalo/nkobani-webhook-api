import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('events_received')
export class EventReceivedEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn()
  created!: Date;

  @Column('simple-array',{
    name: 'event_type',
  })
  eventTypes!: string[];

  @Column({ nullable: true })
  routingKey?: string;

  @Column({ nullable: true })
  exchange?: string;

  @Column('simple-enum', {
    enum: ['http', 'amqp'],
  })
  protocol: 'http' | 'amqp';
}
