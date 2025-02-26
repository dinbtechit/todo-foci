import {AppDataSource} from "@/db/db";
import {Todo} from "./entities/todo";
import {SortBy, SortGroupBy} from "@/components/todo/model/todo-model";
import {SelectQueryBuilder} from "typeorm";
import {User} from "@/db/entities/user";

export async function getGroupedTodos(user: User, {sortGroupBy, sortBy}: { sortGroupBy: SortGroupBy, sortBy: SortBy }) {
    const todoRepository = AppDataSource.getRepository(Todo);
    const queryBuilder = todoRepository.createQueryBuilder('todo')
    return prepareQueryBuilder(user, queryBuilder, {sortGroupBy, sortBy});
}

export async function searchGroupTodos(user: User, query: string, {groupByDates, sortGroupBy, sortBy}: {
    groupByDates: boolean,
    sortGroupBy: SortGroupBy,
    sortBy: SortBy
}) {
    const todoRepository = AppDataSource.getRepository(Todo);
    const normalizedQuery = query.replace(/'/g, '');
    // Sanitize words
    const words = normalizedQuery.split(/\s+/).filter(word => word.length > 0);
    const tsQuery = words.map(word => `${word}:*`).join(' & ');
    const likeQuery = `%${normalizedQuery}%`;
    const queryBuilder = todoRepository.createQueryBuilder('todo');
    if (words.length > 0) {
        // Combine full-text search and partial matching using OR
        queryBuilder.where(
            '(todo.title_tsvector @@ to_tsquery(:tsQuery) OR todo.title ILIKE :likeQuery)',
            {tsQuery, likeQuery, userId: user.id}
        );
    }
    if (groupByDates) {
        return prepareQueryBuilder(user, queryBuilder, {sortGroupBy, sortBy});
    }
    return prepareRegularQueryBuilder(user, queryBuilder, {sortBy})
}

async function prepareRegularQueryBuilder(user: User, queryBuilder: SelectQueryBuilder<Todo>, {sortBy}: {
    sortBy: SortBy
}) {

    queryBuilder.andWhere(`todo.userId = :userId`, {userId: user.id});

    queryBuilder.addOrderBy('todo.dueDate', 'ASC').addOrderBy('todo.title', 'ASC')
    if (sortBy === 'date_desc') {
        queryBuilder.addOrderBy('todo.dueDate', 'DESC').addOrderBy('todo.title', 'ASC')
    } else if (sortBy === 'title_asc') {
        queryBuilder.addOrderBy('todo.title', 'ASC').addOrderBy('todo.dueDate', 'ASC')
    } else if (sortBy === 'title_desc') {
        queryBuilder.addOrderBy('todo.title', 'DESC').addOrderBy('todo.dueDate', 'ASC')
    }
    return await queryBuilder.getMany();
}

async function prepareQueryBuilder(user: User, queryBuilder: SelectQueryBuilder<Todo>, {sortGroupBy, sortBy}: {
    sortGroupBy: SortGroupBy,
    sortBy: SortBy
}) {

    queryBuilder.andWhere(`todo.userId = :userId`, {userId: user.id});

    // Sort Group
    queryBuilder.orderBy("TO_CHAR(todo.dueDate, 'YYYY-MM-DD')", 'ASC')

    if (sortGroupBy === 'desc') {
        queryBuilder.orderBy("TO_CHAR(todo.dueDate, 'YYYY-MM-DD')", 'DESC')
    }

    // Sort subdate and title
    queryBuilder.addOrderBy('todo.dueDate', 'ASC').addOrderBy('todo.title', 'ASC')

    if (sortBy === 'date_desc') {
        queryBuilder.addOrderBy('todo.dueDate', 'DESC').addOrderBy('todo.title', 'ASC')
    } else if (sortBy === 'title_asc') {
        queryBuilder.addOrderBy('todo.title', 'ASC').addOrderBy('todo.dueDate', 'ASC')
    } else if (sortBy === 'title_desc') {
        queryBuilder.addOrderBy('todo.title', 'DESC').addOrderBy('todo.dueDate', 'ASC')
    }
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

