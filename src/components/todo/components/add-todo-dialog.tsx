"use client";

import React, {useEffect, useState} from "react";
import {useAddTodos, useUpdateTodos} from "@/components/todo/state/todo-state-hook";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Plus} from "lucide-react";
import {Todo} from "../model/todo-model";
import Loading from "@/components/ui/loading";

interface AddDialogProps {
    trigger?: React.ReactNode,
    todo?: Todo
}

export function AddTodoDialog({trigger, todo}: AddDialogProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const {updateTodo} = useUpdateTodos();
    const {addTodo} = useAddTodos();
    const [title, setTitle] = useState('')
    const [dueDate, setDueDate] = useState<Date | null>(null)
    const [formError, setFormError] = useState<{ titleError?: string, dueDateError?: string } | null>(null);


    useEffect(() => {
        if (todo?.title) {
            setTitle(todo.title);
        }
        if (todo?.dueDate) {
            setDueDate(new Date(todo?.dueDate));
        }
        if (open) {
            setOpen(true);
        }
    }, [todo?.dueDate, todo?.title]);

    function isValidDate(date: Date | null | undefined) {
        return date instanceof Date && !isNaN(date as unknown as number);
    }

    const submit = async () => {
        setLoading(true);
        // Validate
        let valid = false
        if (!dueDate || !isValidDate(dueDate) || dueDate < new Date()) {
            setDueDate(null)
            setFormError({dueDateError: 'Due Date should be in the future'});
        } else if (!title) {
            setFormError(prevState => {
                return {...prevState, titleError: 'Title is required'}
            });
            valid = false
        } else {
            setFormError(prevState => {
                return {...prevState, dueDateError: '', titleError: ''}
            });
            valid = true
        }
        if (!valid) {
            setLoading(false);
            return;
        }

        // If todo exists, update it
        if (todo && dueDate) {
            await updateTodo(todo.id, title, dueDate);
            setOpen(false);
            setLoading(false);
            return;
        }

        // If todo doesn't exist, add it
        if (dueDate) {
            await addTodo(title, dueDate);
            setOpen(false);
            setLoading(false);
        }
    };

    function formatDateToDatetimeLocal(date: Date | null | undefined) {
        if (!date || !isValidDate(date)) return;
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-based
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger ?? <Button className="w-320 rounded-2xl text-white font-semibold text-lg">
                    <Plus className="scale-150 text-white"/> Create Todo
                </Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="space-y-2">
                    <DialogTitle>
                        {todo ? 'Update Todo' : 'Add Todo'}
                        <hr className="mt-4"/>
                    </DialogTitle>
                    <DialogDescription>
                        {todo ? 'Update Todo' : 'Create a new Todo'}
                    </DialogDescription>
                </DialogHeader>


                <div className="grid grid-cols-3 items-start gap-4">
                    <Label htmlFor="title" className="text-left">
                        Title
                    </Label>
                    <div className="col-span-3">
                        <Input
                            id="title"
                            value={title}
                            onInput={(e) => setTitle(e.currentTarget.value)}
                            className="w-full"
                        />
                        {formError?.titleError &&
                            <div className="text-sm text-red-500 mt-2">{formError?.titleError}</div>}
                    </div>
                </div>


                <div className="grid grid-cols-3 items-start gap-4">
                    <Label htmlFor="title" className="text-left">
                        Title
                    </Label>
                    <div className="col-span-3">
                        <Input
                            id="dueDate"
                            type={"datetime-local"}
                            value={dueDate ? formatDateToDatetimeLocal(dueDate) : ""}
                            onChange={(e) => e.currentTarget.value ? setDueDate(new Date(e.currentTarget.value)) : setDueDate(null)}
                            className="w-full"
                        />
                        {formError?.dueDateError &&
                            <div className="text-sm text-red-500 mt-2">{formError?.dueDateError}</div>}
                    </div>
                </div>

                <DialogFooter>
                    <Button disabled={loading} onClick={() => submit()}>
                        {loading && <Loading/>} {todo ? 'Update' : 'Create'}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
}
