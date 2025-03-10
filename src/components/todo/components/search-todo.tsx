'use client';
import {ReactNode, useState} from "react";
import {Search, X} from "lucide-react";
import {useSearchTodos} from "@/components/todo/state/todo-state-hook";
import {Badge} from "@/components/ui/badge";
import {Button} from "@/components/ui/button";
import {useAtom} from "jotai/index";
import {filterTodoState} from "@/components/todo/state/todo-state";
import SortTodo from "@/components/todo/components/sort-todo";

export default function SearchTodo() {

    const {searchTodos} = useSearchTodos()
    const [loading, setLoading] = useState(false)
    const [filterState, setFilterState] = useAtom(filterTodoState)

    const search = (searchText: string) => {
        setLoading(true);
        const delayDebounceFn = setTimeout(async () => {
            if (searchText || "" === searchText) {
                await searchTodos(searchText)
                setLoading(false)
            }
        }, 150);

        // Cleanup timeout to prevent any memory issues
        return () => clearTimeout(delayDebounceFn);
    }

    return (
        <div className="w-full md:max-w-2xl flex flex-col justify-center items-center">
            <div className="bg-white rounded flex flex-row justify-center items-center w-full gap-4 h-10 pr-[0.99px]">
                <Search className="text-gray-800 ml-2"/>
                <input type="text" placeholder="Search..."
                       onInput={e => search((e.target as HTMLInputElement).value)}
                       className="-ml-3 bg-white bg-transparent rounded border-none outline-0 w-full  text-gray-800 h-full"/>

                <div role="status" className="ml-2 w-6 h-6">
                    {loading &&
                        <>
                            <svg aria-hidden="true"
                                 className="w-6 h-6 text-gray-300 animate-spin fill-green-500"
                                 viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                    fill="currentColor"/>
                                <path
                                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                    fill="currentFill"/>
                            </svg>
                            <span className="sr-only">Loading...</span></>}
                </div>

                <SortTodo/>

            </div>
            <div className="flex w-full flex-wrap gap-2 mt-3">
                {!filterState.groupByDates &&
                    <BadgeAction onClick={() => {
                        setFilterState(prev => ({...prev, groupByDates: !prev.groupByDates}));
                    }}>
                        GroupByDates : {filterState.groupByDates ? "true" : "false"}
                    </BadgeAction>
                }
                {(filterState.groupByDates && filterState.sortGroupBy !== "asc") &&
                    <BadgeAction onClick={() => {
                        setFilterState(prev => ({...prev, sortGroupBy: 'asc'}));
                    }}>SortGroupBy: {filterState.sortGroupBy}</BadgeAction>
                }
                {(filterState.showOnly !== "all") &&
                    <BadgeAction onClick={() => {
                        setFilterState(prev => ({...prev, showOnly: 'all'}));
                    }}>ShowOnly: {filterState.showOnly}</BadgeAction>
                }
                {(filterState.sortBy !== "date_asc") &&
                    <BadgeAction onClick={() => {
                        setFilterState(prev => ({...prev, sortBy: 'date_asc'}));
                    }}>SortBy: {filterState.sortBy}</BadgeAction>
                }
            </div>
        </div>
    )
}


function BadgeAction(props: {
    onClick?: () => void,
    children: ReactNode
}) {
    return <Badge className="bg-black hover:bg-black/80 inline-flex shadow-md items-center justify-center text-white">
        <div className="flex -mt-[0.75px] flex-1 pr-2 justify-center items-center">
            {props.children}
        </div>
        <div className="flex justify-center items-center">
            <Button variant="link"
                    onClick={props.onClick}
                    className="border-l border-white rounded-none p-2 pl-4 h-0 w-0">
                <X className="text-white scale-100 bg-black/60 rounded-xl"/></Button>
        </div>
    </Badge>;
}