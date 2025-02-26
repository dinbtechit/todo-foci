import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './user';

@Entity()
@Index("IDX_TITLE", ["title"])
export class Todo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({type: 'timestamptz'})
    dueDate: Date;

    @Column({type: 'timestamptz'})
    createdAt: Date;

    @Column({default: false})
    completed: boolean;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'userId'})
    user: User;

}
