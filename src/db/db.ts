import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {Todo} from "@/db/entities/todo";
import {User} from "@/db/entities/user";

const databaseHost = process.env.DATABASE_HOST ?? 'localhost';
const databasePort = Number(process.env.DATABASE_PORT) ?? 5431;

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: databaseHost,
    port: databasePort,
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
