'use client'
import {FC, useEffect, useState} from "react";
import { todoType } from "@/types/todoType";
import Todo from "./todo";
import AddTodo from "./addTodo";
import { addTodo, deleteTodo, editTodo, toggleTodo, getData } from "@/actions/todoActions";

interface Props {
    todos: todoType[]
}

const Todos: FC<Props> = ({todos: initialTodos}) => {
    const [todoItems, setTodoItems] = useState<todoType[]>(initialTodos)

    useEffect(() => {
        const eventSource = new EventSource('/api/realtime')

        eventSource.onmessage = async (event) => {
            if (event.data === '' || event.data.includes('heartbeat')) return
            console.log('Otrzymano powiadomienie z bazy: ', event.data)
            const freshTodos = await getData()
            setTodoItems(freshTodos)
        }
        eventSource.onerror = (err) => {
            console.error('EventSource error:', err)
        }
        return () => eventSource.close()
    }, [])

    const createTodo = async (text: string) => {
        if (!text.trim()) return
        await addTodo(text)
        const updated = await getData()
        setTodoItems(updated)
    }

    const changeTodoText = async (id: number, text: string) => {
        await editTodo(id, text)
        const updated = await getData()
        setTodoItems(updated)
    }

    const toggleIsTodoDone = async (id: number) => {
        await toggleTodo(id)
        const updated = await getData()
        setTodoItems(updated)
    }

    const deleteTodoItem = async (id: number) => {
        await deleteTodo(id)
        const updated = await getData()
        setTodoItems(updated)
    }

    return (
        <main className="flex mx-auto max-w-xl w-full min-h-screen flex-col items-center p-16">
            <div className="text-5xl font-medium">To-Do app</div>
            <div className="w-full flex flex-col mt-8 gap-2">
                {todoItems.map((todo) => (
                    <Todo
                        key={todo.id}
                        todo={todo}
                        changeTodoText={changeTodoText}
                        toggleIsTodoDone={toggleIsTodoDone}
                        deleteTodoItem={deleteTodoItem}
                    />
                ))}
            </div>
            <AddTodo createTodo={createTodo} />
        </main>
    )
}

export default Todos