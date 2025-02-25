import {BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import {User} from './user';

@Entity()
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

    @Column({
        type: 'tsvector',
        select: false,
    })
    title_tsvector: string;


    @BeforeInsert()
    @BeforeUpdate()
    updateTitleTsvector() {
        this.title_tsvector = this.toTsvector(this.title);
    }

    private toTsvector(title: string): string {
        return `to_tsvector('english', '${title}')`;
    }
}
