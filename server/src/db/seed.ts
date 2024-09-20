import { client, db } from '.'
import { getWeekDateRange } from '../utils/date-utils'
import { goalCompletions, goals } from './schema'

import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const { firstDayOfWeek, lastDayOfWeek } = getWeekDateRange({
    timezone: 'America/Sao_Paulo',
  })

  const result = await db
    .insert(goals)
    .values([
      {
        title: 'Wake up earlier',
        desiredWeeklyFrequency: 5,
        createdAt: dayjs(firstDayOfWeek).subtract(1, 'day').toDate(),
      },
      {
        title: 'Working out',
        desiredWeeklyFrequency: 3,
        createdAt: firstDayOfWeek,
      },
      {
        title: 'Meditate',
        desiredWeeklyFrequency: 1,
        createdAt: dayjs(firstDayOfWeek).add(1, 'hour').toDate(),
      },
      {
        title: 'Yoga pratice',
        desiredWeeklyFrequency: 3,
        createdAt: dayjs(firstDayOfWeek)
          .add(3, 'days')
          .add(5, 'hours')
          .toDate(),
      },
    ])
    .returning()

  await db.insert(goalCompletions).values([
    { goalId: result[0].id, createdAt: firstDayOfWeek },
    {
      goalId: result[0].id,
      createdAt: dayjs(firstDayOfWeek).subtract(1, 'minute').toDate(),
    },
    {
      goalId: result[1].id,
      createdAt: dayjs(firstDayOfWeek).add(1, 'days').add(7, 'hours').toDate(),
    },
    {
      goalId: result[1].id,
      createdAt: dayjs(firstDayOfWeek).add(2, 'days').add(2, 'hours').toDate(),
    },
    {
      goalId: result[1].id,
      createdAt: dayjs(firstDayOfWeek).add(4, 'days').add(17, 'hours').toDate(),
    },
    {
      goalId: result[2].id,
      createdAt: dayjs(firstDayOfWeek).add(2, 'days').add(8, 'hours').toDate(),
    },
  ])
}

seed().finally(() => {
  client.end()
})
