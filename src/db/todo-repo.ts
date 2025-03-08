import {AppDataSource} from "@/db/db";
import {Todo} from "./entities/todo";
import {FilterTodo, ShowOnly, SortBy, SortGroupBy} from "@/components/todo/model/todo-model";
import {SelectQueryBuilder} from "typeorm";
import {User} from "@/db/entities/user";

export async function getGroupedTodos(user: User, filterTodo: FilterTodo) {
    const todoRepository = AppDataSource.getRepository(Todo);
    const queryBuilder = todoRepository.createQueryBuilder('todo')
    return prepareQueryBuilder(user, queryBuilder, filterTodo);
}

export async function searchGroupTodos(user: User, query: string, {
    showOnly,
    groupByDates,
    sortGroupBy,
    sortBy
}: FilterTodo) {
    const todoRepository = AppDataSource.getRepository(Todo);
    const normalizedQuery = query.replace(/'/g, '');
    // Sanitize words
    //const words = normalizedQuery.split(/\s+/).filter(word => word.length > 0);
    //const tsQuery = words.map(word => `${word}:*`).join(' & ');
    const likeQuery = `%${normalizedQuery}%`;
    const queryBuilder = todoRepository.createQueryBuilder('todo');
    /*if (words.length > 0) {
        // Combine full-text search and partial matching using OR

    }*/
    queryBuilder.where('todo.title ILIKE :likeQuery', {likeQuery});
    if (groupByDates) {
        return prepareQueryBuilder(user, queryBuilder, {sortGroupBy, sortBy, showOnly});
    }
    return prepareRegularQueryBuilder(user, queryBuilder, {sortBy})
}

async function prepareRegularQueryBuilder(user: User, queryBuilder: SelectQueryBuilder<Todo>, {sortBy}: {
    sortBy?: SortBy
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

async function prepareQueryBuilder(user: User, queryBuilder: SelectQueryBuilder<Todo>, {
    sortGroupBy,
    sortBy,
    showOnly
}: {
    sortGroupBy: SortGroupBy, sortBy: SortBy,
    showOnly: ShowOnly
}) {

    queryBuilder.andWhere(`todo.userId = :userId`, {userId: user.id});

    if (showOnly === 'completed') {
        queryBuilder.andWhere(`todo.completed = :completed `, {completed: true});
    } else if (showOnly === 'inprogress') {
        queryBuilder.andWhere(`todo.completed = :completed `, {completed: false});
    }

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
        const {dueDate, id, title, description, completed} = todo;

        //Formatting date to localtime
        const offset = dueDate.getTimezoneOffset()
        const dueDateLocal = new Date(dueDate.getTime() - (offset * 60 * 1000))
        const dateKey = dueDateLocal.toISOString().split('T')[0];

        console.log(dueDateLocal)
        console.log(dueDate)

        let group = groupedTodos.find(g => g.date === dateKey);

        if (!group) {
            group = {date: dateKey, todos: []};
            groupedTodos.push(group);
        }

        group.todos.push({
            id,
            title,
            description,
            completed,
            dueDate
        } as Todo);
    });

    return groupedTodos;
}

