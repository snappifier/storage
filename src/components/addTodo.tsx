'use client'

import { ChangeEvent, FC, useState } from "react";

interface Props {
    createTodo: (value: string) => void
}

const AddTodo: FC<Props> = ({createTodo}) => {
    const [input, setInput] = useState("")

    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
        setInput(e.target.value)
    }

    const handleAdd = async () => {
        createTodo(input)
        setInput("")
    }

    return (
        <div className="w-full flex gap-1 mt-2">
            <input
                type="text"
                className="w-full px-2 py-1 border border-gray-200 rounded outline-none"
                onChange={handleInput}
                value={input}
            />
            <button
                className="flex items-center justify-center bg-green-600 text-green-50 rounded px-2 h-9 w-14 py-1"
                onClick={handleAdd}
            >
                Add
            </button>
        </div>
    )
}

export default AddTodo