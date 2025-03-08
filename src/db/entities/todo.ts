import {Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './user';

@Entity("todo")
@Index("IDX_TITLE", ["title"])
export class Todo {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    title: string;

    @Column({nullable: true})
    description: string;

    @Column({type: 'timestamp without time zone'})
    dueDate: Date;

    @Column({default: false})
    completed: boolean;

    @Column({type: 'timestamp without time zone'})
    createdAt: Date;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'userId'})
    user: User;

}
