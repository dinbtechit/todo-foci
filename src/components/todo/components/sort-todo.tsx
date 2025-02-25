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
import {useEffect, useState} from "react";
import {useAtom} from "jotai";
import {filterTodoState} from "@/components/todo/state/todo-state";
import {SortBy} from "@/components/todo/model/todo-model";

export default function SortTodo() {
    const [groupByDates, setGroupByDates] = useState(true)
    const [sortBy, setSortBy] = useState<SortBy | string>('date_asc')
    const [, setFilterTodo] = useAtom(filterTodoState)

    useEffect(() => {
        const groupByDatesLocalStore = (window.localStorage.getItem("groupByDates") ?? "true") === "true";
        const sortByLocalStore = window.localStorage.getItem("sortBy") ?? 'date_asc';
        setGroupByDates(groupByDatesLocalStore)
        setSortBy(sortByLocalStore)
        setFilterTodo({groupByDates: groupByDatesLocalStore, sortBy: sortByLocalStore})
    }, []);

    useEffect(() => {
        window.localStorage.setItem("groupByDates", String(groupByDates));
        window.localStorage.setItem("sortBy", sortBy);
        setFilterTodo({groupByDates, sortBy: sortBy})
    }, [groupByDates, sortBy])

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
                <DropdownMenuCheckboxItem checked={groupByDates}
                                          onSelect={() => setGroupByDates(!groupByDates)}>
                    Group By Dates
                </DropdownMenuCheckboxItem>
                <DropdownMenuSeparator/>
                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                    <DropdownMenuLabel>Sort By Dates</DropdownMenuLabel>
                    <DropdownMenuRadioItem value="date_asc">Ascending</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="date_desc">Descending</DropdownMenuRadioItem>
                    <DropdownMenuSeparator/>
                    <DropdownMenuLabel>Sort By Title</DropdownMenuLabel>
                    <DropdownMenuRadioItem value="title_asc">Ascending</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="title_desc">Descending</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}