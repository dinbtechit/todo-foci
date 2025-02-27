import {Column, Entity, PrimaryGeneratedColumn} from 'typeorm';

@Entity("user")
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: 255, unique: true})
    email: string;
}
