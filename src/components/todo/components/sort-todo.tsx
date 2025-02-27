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
import {ShowOnly, SortBy, SortGroupBy} from "@/components/todo/model/todo-model";

export default function SortTodo() {
    const [groupByDates, setGroupByDates] = useState(true)
    const [sortBy, setSortBy] = useState<SortBy | string>('date_asc')
    const [sortGroupBy, setSortGroupBy] = useState<SortGroupBy | string>('asc')
    const [, setFilterTodo] = useAtom(filterTodoState)
    const [showOnly, setShowOnly] = useState<ShowOnly | string>('all')

    useEffect(() => {
        const showOnlyLocalStore = window.localStorage.getItem("showOnly") ?? 'all';
        const groupByDatesLocalStore = (window.localStorage.getItem("groupByDates") ?? "true") === "true";
        const sortByGroupLocalStore = window.localStorage.getItem("sortGroupBy") ?? 'asc';
        const sortByLocalStore = window.localStorage.getItem("sortBy") ?? 'date_asc';

        setShowOnly(showOnlyLocalStore)
        setGroupByDates(groupByDatesLocalStore)
        setSortGroupBy(sortByGroupLocalStore)
        setSortBy(sortByLocalStore)
        setFilterTodo({
            showOnly,
            groupByDates: groupByDatesLocalStore,
            sortGroupBy: sortByGroupLocalStore,
            sortBy: sortByLocalStore
        })
    }, []);

    useEffect(() => {
        window.localStorage.setItem("groupByDates", String(groupByDates));
        window.localStorage.setItem("sortGroupBy", String(sortGroupBy));
        window.localStorage.setItem("sortBy", sortBy);
        window.localStorage.setItem("showOnly", showOnly);

        setFilterTodo({showOnly, groupByDates, sortGroupBy: sortGroupBy, sortBy: sortBy})
    }, [groupByDates, sortGroupBy, sortBy, showOnly])

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
                <DropdownMenuLabel>Show Only</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                <DropdownMenuRadioGroup value={showOnly} onValueChange={setShowOnly}>
                    <DropdownMenuRadioItem value="all">All</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="completed">Completed</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="inprogress">Inprogress</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup><DropdownMenuSeparator/>
                <DropdownMenuSeparator/>
                {groupByDates &&
                    <><DropdownMenuRadioGroup value={sortGroupBy} onValueChange={setSortGroupBy}>
                        <DropdownMenuLabel>Sort Group By</DropdownMenuLabel>
                        <DropdownMenuRadioItem value="asc">Ascending</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="desc">Descending</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup><DropdownMenuSeparator/></>
                }
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