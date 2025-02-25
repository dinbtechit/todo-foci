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
import {useState} from "react";

export default function SortTodo() {
    const [groupByDates, setGroupByDates] = useState(true)
    const [sortByDates, setSortByDates] = useState('date_asc')
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
                <DropdownMenuRadioGroup value={sortByDates} onValueChange={setSortByDates}>
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