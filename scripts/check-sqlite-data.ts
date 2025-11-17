import Database from 'better-sqlite3'

const db = new Database('./prisma/db/custom.db', { readonly: true })

console.log('📊 DATA DI SQLITE (Database Lama):\n')

const tables = ['User', 'Travel', 'Package', 'Article', 'Booking', 'Favorite', 'Video', 'Settings', 'Slider']

for (const table of tables) {
  try {
    const result = db.prepare(`SELECT COUNT(*) as count FROM ${table}`).get() as any
    console.log(`${table.padEnd(15)} : ${result.count} records`)
  } catch (error) {
    console.log(`${table.padEnd(15)} : Table tidak ada`)
  }
}

db.close()
