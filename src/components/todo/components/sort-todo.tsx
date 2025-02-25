import {Button} from "@/components/ui/button";
import {ListFilterPlus} from "lucide-react";

export default function SortTodo() {
    return (
        <Button variant={'secondary'} className="text-white">
            <ListFilterPlus className="text-white"/>
        </Button>
    )
}