import {AppDataSource} from "@/db/db";
import {Todo} from "./entities/todo";
import {FilterTodo, ShowOnly, SortBy, SortGroupBy} from "@/components/todo/model/todo-model";
import {SelectQueryBuilder} from "typeorm";
import {User} from "@/db/entities/user";

export async function getGroupedTodos(user: User, filterTodo: FilterTodo, timezone?: string) {
    const todoRepository = AppDataSource.getRepository(Todo);
    const queryBuilder = todoRepository.createQueryBuilder('todo')
    return prepareQueryBuilder(user, queryBuilder, filterTodo, timezone);
}

export async function searchGroupTodos(user: User, query: string, {
    showOnly,
    groupByDates,
    sortGroupBy,
    sortBy
}: FilterTodo, timezone?: string) {
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
        return prepareQueryBuilder(user, queryBuilder, {sortGroupBy, sortBy, showOnly}, timezone);
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
}, timezone: string = 'UTC') {

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
        const formattedDate = new Intl.DateTimeFormat('en-US', {
            timeZone: timezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
        }).format(dueDate);

        const [month, day, year] = formattedDate.split('/');
        // Reformat into YYYY-MM-DD
        const dateKey = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        console.log('formattedDate', formattedDate)
        console.log('dateKey', dateKey)

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

