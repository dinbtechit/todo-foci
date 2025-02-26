import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {Todo} from "@/db/entities/todo";
import {User} from "@/db/entities/user";


export const AppDataSource = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'todo',
    entities: [Todo, User],
    synchronize: true,
    logging: false,
});

export async function connectDB() {
    if (!AppDataSource.isInitialized) {
        await AppDataSource.initialize();
        console.log('📦 Connected to PostgreSQL');
    }
}
