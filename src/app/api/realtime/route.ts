import {NextResponse} from 'next/server'
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

let client: postgres.Sql | null = null;

export async function GET() {
    if (!client) {
        client = postgres(connectionString);
    }
    const stream = new ReadableStream({
        async start(controller) {


            await client!.listen('todo_changes', (payload) => {
                try {
                    controller.enqueue(`data: ${payload}\n\n`)
                } catch (err) {
                    console.error('SSE listen error:', err)
                }
            })

            const keepAlive = setInterval(() => {
                try {
                    controller.enqueue(': heartbeat\n\n')
                } catch {
                    clearInterval(keepAlive)
                }
            }, 25000)
            return () => {
                clearInterval(keepAlive)
            }
        }
    })
    return new NextResponse(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
        }
    })
}