'use client';
import {Button} from "@/components/ui/button";
import {ListFilterPlus} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {useEffect} from "react";
import {useAtom} from "jotai";
import {filterTodoState} from "@/components/todo/state/todo-state";

export default function SortTodo() {
    const [filterTodo, setFilterTodo] = useAtom(filterTodoState)

    useEffect(() => {
        const showOnlyLocalStore = window.localStorage.getItem("showOnly") ?? 'all';
        const groupByDatesLocalStore = (window.localStorage.getItem("groupByDates") ?? "true") === "true";
        const sortByGroupLocalStore = window.localStorage.getItem("sortGroupBy") ?? 'asc';
        const sortByLocalStore = window.localStorage.getItem("sortBy") ?? 'date_asc';

        setFilterTodo({
            showOnly: showOnlyLocalStore,
            groupByDates: groupByDatesLocalStore,
            sortGroupBy: sortByGroupLocalStore,
            sortBy: sortByLocalStore
        })
    }, []);

    useEffect(() => {
        window.localStorage.setItem("groupByDates", String(filterTodo.groupByDates));
        window.localStorage.setItem("sortGroupBy", String(filterTodo.sortGroupBy));
        window.localStorage.setItem("sortBy", filterTodo.sortBy);
        window.localStorage.setItem("showOnly", filterTodo.showOnly);

    }, [filterTodo])

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button className="bg-black/95 hover:bg-gray-800/90">
                    <ListFilterPlus className="text-white"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Filter Settings</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuCheckboxItem checked={filterTodo.groupByDates}
                                          onSelect={() => setFilterTodo(prev => ({
                                              ...prev,
                                              groupByDates: !prev.groupByDates
                                          }))}>
                    Group By Dates
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator/>
                <DropdownMenuLabel>Show Only</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuRadioGroup value={filterTodo.showOnly}
                                        onValueChange={(value) => setFilterTodo(prev => ({
                                            ...prev,
                                            showOnly: value
                                        }))}>
                    <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="inprogress">InProgress</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup><DropdownMenuSeparator/>
                {filterTodo.groupByDates &&
                    <><DropdownMenuRadioGroup value={filterTodo.sortGroupBy}
                                              onValueChange={(value) => setFilterTodo(prev => ({
                                                  ...prev,
                                                  sortGroupBy: value
                                              }))}>
                        <DropdownMenuLabel>Sort Group By</DropdownMenuLabel>
                        <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup><DropdownMenuSeparator/></>
                }
                <DropdownMenuRadioGroup value={filterTodo.sortBy}
                                        onValueChange={(value) => setFilterTodo(prev => ({
                                            ...prev,
                                            sortBy: value
                                        }))}>
                    <DropdownMenuLabel>Sort By Dates {filterTodo.groupByDates && '(Within Group)'}</DropdownMenuLabel>
                    <DropdownMenuRadioItem value="date_asc">Ascending</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="date_desc">Descending</DropdownMenuRadioItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuLabel>Sort By Title {filterTodo.groupByDates && '(Within Group)'}</DropdownMenuLabel>
                    <DropdownMenuRadioItem value="title_asc">Ascending</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="title_desc">Descending</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}