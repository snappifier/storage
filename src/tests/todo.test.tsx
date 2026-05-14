import {describe, test, expect, vi} from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'
import Todo from "../components/todo"
import type {todoType} from '@/types/todoType'

const mockTodo: todoType = {
    id: 1,
    text: "Test task",
    done: false
}

const mockProps = {
    todo: mockTodo,
    changeTodoText: vi.fn(),
    toggleIsTodoDone: vi.fn(),
    deleteTodoItem: vi.fn(),
}

describe('Todo component', () => {
    test('renders todo text and unchecked checkbox', () => {
        render(<Todo {...mockProps} />)
        expect(screen.getByDisplayValue("Test task")).toBeInTheDocument()
        expect(screen.getByRole('checkbox')).not.toBeChecked()
    })

    test('calls toggleIsTodoDone when checkbox is clicked', () => {
        render(<Todo {...mockProps} />)
        const checkbox = screen.getByRole('checkbox')
        fireEvent.click(checkbox)

        expect(mockProps.toggleIsTodoDone).toHaveBeenCalledWith(1)
    })

    test('shows line-through when todo is done', () => {
        const doneTodo = {...mockTodo, done: true}
        render(<Todo {...mockProps} todo={doneTodo} />)

        const input = screen.getByDisplayValue('Test task')
        expect(input).toHaveClass('line-through')
    })

})