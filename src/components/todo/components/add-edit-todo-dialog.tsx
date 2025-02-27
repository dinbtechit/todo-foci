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
import {Textarea} from "@/components/ui/textarea";

interface AddDialogProps {
    trigger?: React.ReactNode,
    open?: boolean,
    onCloseDialog: (isOpen: boolean) => void
    todo?: Todo
}

export function AddEditTodoDialog({trigger, open, onCloseDialog, todo}: AddDialogProps) {
    /*  const [open, setOpen] = useState(false);*/
    const [loading, setLoading] = useState(false);
    const {updateTodo} = useUpdateTodos();
    const {addTodo} = useAddTodos();
    const [title, setTitle] = useState('')
    const [desc, setDesc] = useState('')
    const [dueDate, setDueDate] = useState<Date | null>(null)
    const [formError, setFormError] = useState<{
        titleError?: string,
        descError?: string,
        dueDateError?: string
    } | null>(null);


    useEffect(() => {
        if (todo?.title) {
            setTitle(todo.title);
        }
        if (todo?.description) {
            setDesc(todo.description);
        }
        if (todo?.dueDate) {
            setDueDate(new Date(todo?.dueDate));
        }
        if (open) {
            onCloseDialog(true);
        }
    }, [todo, todo?.dueDate, todo?.description, todo?.title]);

    const isValidDate = (date: Date | null | undefined) => {
        return date instanceof Date && !isNaN(date as unknown as number);
    }

    const resetForm = () => {
        setTitle('')
        setDesc('')
        setDueDate(null)
    }

    const validate = () => {
        // Validate
        let valid = true
        if (!dueDate || !isValidDate(dueDate) || dueDate < new Date()) {
            setDueDate(null)
            setFormError(prevState => {
                return {
                    ...prevState,
                    dueDateError: 'Due Date should be in the future'
                }
            });
            valid = false
        } else {
            setFormError(prevState => {
                return {
                    ...prevState,
                    dueDateError: ''
                }
            });
        }

        if (!title) {
            setFormError(prevState => {
                return {
                    ...prevState,
                    titleError: 'Title is required',
                }
            });
            valid = false
        } else {
            setFormError(prevState => {
                return {
                    ...prevState,
                    titleError: ''
                }
            });
        }

        return valid;
    }

    const submit = async () => {
        setLoading(true);

        if (!validate()) {
            setLoading(false);
            return;
        } else {
            //Reset the error
            setFormError({
                dueDateError: '', titleError: ''
            });
        }
        try {
            // If todo exists, update it
            if (todo && dueDate) {
                console.log('updating...')
                console.log(desc)
                await updateTodo({id: todo.id, title: title, description: desc, dueDate: dueDate})
                resetForm()
                onCloseDialog(false)
                setLoading(false)
                return;
            }

            // If todo doesn't exist, add it
            if (dueDate) {
                await addTodo(title, desc, dueDate);
                resetForm()
                onCloseDialog(false)
                setLoading(false);
            }
        } catch (err) {
            // TODO display error on dialog
            console.error(err);
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
        <Dialog open={open} onOpenChange={onCloseDialog}>
            <DialogTrigger asChild>
                {trigger ?? open ?? <Button className="w-320 rounded-2xl text-white font-semibold text-lg">
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
                            maxLength={50}
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
                    <Label htmlFor="desc" className="text-left">
                        Description
                    </Label>
                    <div className="col-span-3">
                        <Textarea id="desc"
                                  maxLength={200}
                                  rows={5}
                                  value={desc}
                                  className="w-full"
                                  onInput={(e) => setDesc(e.currentTarget.value)}
                                  placeholder="Type your message here."/>

                        {formError?.descError &&
                            <div className="text-sm text-red-500 mt-2">{formError?.descError}</div>}
                    </div>
                </div>


                <div className="grid grid-cols-3 items-start gap-4">
                    <Label htmlFor="title" className="text-left">
                        Due Date
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
