import { describe, test, expect, vi, beforeEach } from 'vitest'
import { addTodo, deleteTodo, editTodo, toggleTodo, getData } from '@/actions/todoActions'
import { db } from '@/db/drizzle'
import { todo } from '@/db/schema'
import { revalidatePath } from 'next/cache'

vi.mock('@/db/drizzle', () => ({
    db: {
        select: vi.fn(),
        insert: vi.fn(),
        update: vi.fn(),
        delete: vi.fn(),
    },
}))

vi.mock('next/cache', () => ({ revalidatePath: vi.fn() }))

describe('todoActions', () => {
    beforeEach(() => {
        vi.clearAllMocks()
    })

    test('getData returns all todos', async () => {
        const mockData = [
            {id: 1, text: 'buy some milk', done: false},
            {id: 2, text: 'walk the dog', done: true},
        ]
        //@ts-ignore
        db.select.mockReturnValue({
            from: vi.fn().mockResolvedValue(mockData),
        })
        const result = await getData()

        expect(result).toEqual(mockData)
        expect(db.select).toHaveBeenCalled()
    })

    test('addTodo adds new task and revalidates path', async () => {
        const text = "New task"
        //@ts-ignore
        db.insert.mockReturnValue({
            values: vi.fn().mockResolvedValue(undefined),
        })

        await addTodo(text)

        expect(db.insert).toHaveBeenCalledWith(todo)
        expect(revalidatePath).toHaveBeenCalledWith('/')
    })

    test('toggleTodo changes done status', async () => {
        const id = 5
        //@ts-ignore
        db.update.mockReturnValue({
            set: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValue(undefined),
        })

        await toggleTodo(id)

        expect(db.update).toHaveBeenCalledWith(todo)
        expect(revalidatePath).toHaveBeenCalledWith('/')
    })

    test('deleteTodo deletes a task', async () => {
        const id = 10
        //@ts-ignore
        db.delete.mockReturnValue({
            where: vi.fn().mockResolvedValue(undefined),
        })

        await deleteTodo(id)

        expect(db.delete).toHaveBeenCalledWith(todo)
        expect(revalidatePath).toHaveBeenCalledWith('/')
    })

    test("editTodo updates a task's text", async () => {
        const id = 7
        const newText = 'Updated task'
        //@ts-ignore
        db.update.mockReturnValue({
            set: vi.fn().mockReturnThis(),
            where: vi.fn().mockResolvedValue(undefined),
        })

        await editTodo(id, newText)

        expect(db.update).toHaveBeenCalledWith(todo)
        expect(revalidatePath).toHaveBeenCalledWith('/')
    })

})