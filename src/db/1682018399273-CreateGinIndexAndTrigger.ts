import {MigrationInterface, QueryRunner} from 'typeorm';

export class CreateGinIndexAndTrigger1682018399273 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Create the GIN index on the title_tsvector column (if it doesn't exist)
        await queryRunner.query(`
            CREATE INDEX IF NOT EXISTS idx_title_tsvector ON todo USING GIN (title_tsvector);
        `);

        // Step 2: Create or replace the trigger function
        await queryRunner.query(`
            CREATE OR REPLACE FUNCTION update_title_tsvector()
            RETURNS trigger AS
            $$
            BEGIN
                -- Use the 'simple' dictionary to avoid stemming
                NEW.title_tsvector := to_tsvector('simple', NEW.title);
                RETURN NEW;
            END;
            $$ LANGUAGE plpgsql;
        `);

        // Step 3: Check if the trigger exists before creating it
        await queryRunner.query(`
            DO $$
            BEGIN
                IF NOT EXISTS (
                    SELECT 1
                    FROM pg_trigger
                    WHERE tgname = 'title_tsvector_update'
                    AND tgrelid = 'todo'::regclass
                ) THEN
                    CREATE TRIGGER title_tsvector_update
                    BEFORE INSERT OR UPDATE ON todo
                    FOR EACH ROW EXECUTE FUNCTION update_title_tsvector();
                END IF;
            END $$;
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Step 1: Drop the trigger if it exists
        await queryRunner.query(`
            DROP TRIGGER IF EXISTS title_tsvector_update ON todo;
        `);

        // Step 2: Drop the function if it exists
        await queryRunner.query(`
            DROP FUNCTION IF EXISTS update_title_tsvector;
        `);

        // Step 3: Drop the index if it exists
        await queryRunner.query(`
            DROP INDEX IF EXISTS idx_title_tsvector;
        `);
    }
}