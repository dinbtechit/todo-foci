import {AppDataSource} from "@/db/db";
import {Todo} from "./entities/todo";


export async function getGroupedTodos() {
    const todoRepository = AppDataSource.getRepository(Todo);

    const todos = await todoRepository
        .createQueryBuilder('todo')
        .select([
            "TO_CHAR(todo.dueDate, 'YYYY-MM-DD') AS date",
            'todo.id AS id',
            'todo.title AS title',
            'todo.completed AS completed',
            'todo.dueDate AS dueDate'
        ])
        .orderBy("TO_CHAR(todo.dueDate, 'YYYY-MM-DD')", 'ASC')
        .addOrderBy('todo.dueDate', 'ASC')
        .getRawMany();


    const groupedTodos: { date: string, todos: Todo[] }[] = [];

    todos.forEach(todo => {
        const {date, id, title, completed, duedate} = todo;
        let group = groupedTodos.find(g => g.date === date);

        if (!group) {
            group = {date, todos: []};
            groupedTodos.push(group);
        }

        group.todos.push({
            id,
            title,
            completed,
            dueDate: duedate
        } as Todo);
    });

    return groupedTodos;
}

export async function searchAndGroupTodosByDueDate(query: string) {
    const todoRepository = AppDataSource.getRepository(Todo);

    const normalizedQuery = query.replace(/'/g, '');

    // Split the query into individual words
    const words = normalizedQuery.split(/\s+/).filter(word => word.length > 0);

    // Construct a tsquery for full-text search
    const tsQuery = words.map(word => `${word}:*`).join(' & ');

    // Construct a LIKE query for partial matching
    const likeQuery = `%${normalizedQuery}%`;

    const queryBuilder = todoRepository.createQueryBuilder('todo');

    if (words.length > 0) {
        // Combine full-text search and partial matching using OR
        queryBuilder.where(
            '(todo.title_tsvector @@ to_tsquery(:tsQuery) OR todo.title ILIKE :likeQuery)',
            {tsQuery, likeQuery}
        );
    }

    queryBuilder.orderBy('todo.dueDate', 'ASC');

    const todos = await queryBuilder.getMany();

    // Group the todos by dueDate
    const groupedTodos: { date: string, todos: Todo[] }[] = [];

    todos.forEach(todo => {
        const {dueDate, id, title, completed} = todo;
        //Formatting date
        const dateKey = dueDate.toISOString().split('T')[0];

        let group = groupedTodos.find(g => g.date === dateKey);

        if (!group) {
            group = {date: dateKey, todos: []};
            groupedTodos.push(group);
        }

        group.todos.push({
            id,
            title,
            completed,
            dueDate
        } as Todo);
    });

    return groupedTodos;
}

