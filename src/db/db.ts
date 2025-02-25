import 'reflect-metadata';
import {DataSource} from 'typeorm';
import {Todo} from "@/db/entities/todo";
import {User} from "@/db/entities/user";
import {CreateGinIndexAndTrigger1682018399273} from "@/db/1682018399273-CreateGinIndexAndTrigger";


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

        const queryRunner = AppDataSource.createQueryRunner();
        await queryRunner.connect();

        // Create an instance of the specific migration
        const migration = new CreateGinIndexAndTrigger1682018399273();

        // Run the `up` method of the migration
        await migration.up(queryRunner);
        console.log('📦 Connected to PostgreSQL');
    }
}
