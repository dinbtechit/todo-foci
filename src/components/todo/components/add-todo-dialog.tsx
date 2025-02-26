"use client";

import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useLoadGroupTodosByDate, useLoadTodos} from "@/components/todo/state/todo-state-hook";
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
import {FormDateTimePicker} from "@/components/ui/datetime-picker";
import {Form, FormField, FormMessage} from "@/components/ui/form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Plus} from "lucide-react";
import {useAtom} from "jotai";
import {filterTodoState} from "@/components/todo/state/todo-state";

const schema = z.object({
    title: z.string().min(1, "Title is required"),
    dueDate: z.date().refine((date) => date >= new Date(), {
        message: "Due date must be in the future",
    }),
});

type FormData = z.infer<typeof schema>;

export function AddTodoDialog() {
    const [open, setOpen] = useState(false);
    const {loadTodos} = useLoadTodos();
    const {loadTodosByDate} = useLoadGroupTodosByDate()
    const [filterTodo,] = useAtom(filterTodoState)

    const form = useForm<FormData>({
        defaultValues: {
            title: "",
            dueDate: undefined,
        },
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        form.reset()
    }, []);


    const addTodo = async (data: FormData) => {
        const response = await fetch('/api/todos', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                title: data.title,
                dueDate: data.dueDate
            }),
        });
        if (!response.ok) {
            console.error('Error creating todo');
            return;
        }
        if (filterTodo.groupByDates) {
            await loadTodosByDate();
        } else {
            await loadTodos();
        }
        form.reset()
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="w-320 rounded-2xl text-white font-semibold text-lg">
                    <Plus className="scale-150 text-white"/> Create Todo
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader className="space-y-8">
                    <DialogTitle>
                        Add Todo
                        <hr className="mt-4"/>
                    </DialogTitle>
                    <DialogDescription>Create a new Todo</DialogDescription>
                </DialogHeader>

                {/* Form Component from ShadCN */}
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(addTodo)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="title"
                            render={({field}) => (
                                <div className="grid grid-cols-3 items-start gap-4">
                                    <Label htmlFor="title" className="text-left">
                                        Title
                                    </Label>
                                    <div className="col-span-3">
                                        <Input
                                            id="title"
                                            {...field}
                                            className="w-full"
                                        />
                                        <FormMessage className="mt-2"/>
                                    </div>
                                </div>
                            )}
                        />
                        <FormDateTimePicker form={form}/>
                        <DialogFooter>
                            <Button type="submit">Create</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
