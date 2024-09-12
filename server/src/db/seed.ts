import dayjs from 'dayjs'
import { client, db } from '.'
import { goalCompletions, goals } from './schema'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const result = await db
    .insert(goals)
    .values([
      { title: 'Wake up earlier', desiredWeeklyFrequency: 5 },
      { title: 'Working out', desiredWeeklyFrequency: 3 },
      { title: 'Meditate', desiredWeeklyFrequency: 1 },
      { title: 'Yoga pratice', desiredWeeklyFrequency: 3 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: startOfWeek.toDate() },
    { goalId: result[1].id, createdAt: startOfWeek.add(2, 'days').toDate() },
  ])
}

seed().finally(() => {
  client.end()
})
