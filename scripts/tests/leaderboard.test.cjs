const assert = require("node:assert/strict")
const fs = require("node:fs")
const path = require("node:path")
const { test } = require("node:test")
const vm = require("node:vm")
const ts = require("typescript")

// Exercise the actual server actions with isolated auth and database dependencies.
const source = fs.readFileSync(path.join(__dirname, "../../lib/leaderboard.ts"), "utf8")
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText

function fixture(session = null) {
  const rows = []
  let writes = 0
  const delegate = {
    async findMany({ select, orderBy, take }) {
      assert.equal(orderBy[0].score, "desc")
      assert.equal(orderBy[1].achievedAt, "asc")
      return [...rows]
        .sort((a, b) => b.score - a.score || a.achievedAt - b.achievedAt)
        .slice(0, take)
        .map((row) => Object.fromEntries(Object.keys(select).map((key) => [key, row[key]])))
    },
    async upsert({ where, create, update }) {
      writes++
      let row = rows.find((entry) => entry.discordId === where.discordId)
      if (row) Object.assign(row, update)
      else {
        row = { id: rows.length + 1, achievedAt: new Date(), ...create }
        rows.push(row)
      }
      return { id: row.id }
    },
    async updateMany({ where, data }) {
      writes++
      const matches = rows.filter((row) => row.id === where.id && row.score < where.score.lt)
      matches.forEach((row) => Object.assign(row, data))
      return { count: matches.length }
    },
  }
  const dependencies = {
    "node:crypto": require("node:crypto"),
    zod: require("zod"),
    "@/lib/auth": { auth: async () => session },
    "@/lib/prisma": { prisma: { leaderboardEntry: delegate } },
    "@/lib/generated/prisma/enums": {
      Mascot: { VIVI: "VIVI", CICI: "CICI", DOUG: "DOUG", GIGI: "GIGI" },
    },
  }
  const exports = {}
  vm.runInNewContext(compiled, {
    exports,
    Date,
    require(name) {
      assert.ok(name in dependencies, `Unexpected dependency: ${name}`)
      return dependencies[name]
    },
  })
  return { ...exports, rows, writes: () => writes }
}

const player = { user: { id: "private-discord-id", name: "Private Discord Name" } }

test("guests can read scores but direct submissions never write", async () => {
  const game = fixture()
  assert.equal((await game.getLeaderboard()).length, 0)
  const result = await game.submitScore(100, 0)
  assert.equal(result.entryId, null)
  assert.equal(game.writes(), 0)
})

test("invalid inputs cannot create leaderboard entries", async () => {
  const game = fixture(player)
  for (const score of [0, -1, 1.5, NaN, Infinity, 2_147_483_648, "100", null]) {
    assert.equal((await game.submitScore(score, 0)).entryId, null)
  }
  for (const mascot of [-1, 4, 0.5, NaN, "0", null]) {
    assert.equal((await game.submitScore(100, mascot)).entryId, null)
  }
  assert.equal(game.writes(), 0)
})

test("names are generated once, best scores only rise, and Discord details stay private", async () => {
  const game = fixture(player)
  const first = await game.submitScore(100, 0)
  const name = first.entries[0].displayName
  assert.match(name, /^vivi[1-9]\d{4}$/)
  assert.deepEqual(Object.keys(first.entries[0]).sort(), ["displayName", "id", "score"])
  assert.equal(game.rows[0].discordId, player.user.id)
  const achievedAt = game.rows[0].achievedAt

  await game.submitScore(50, 1)
  await game.submitScore(100, 2)
  assert.equal(game.rows[0].score, 100)
  assert.equal(game.rows[0].mascot, "VIVI")
  assert.equal(game.rows[0].achievedAt, achievedAt)

  const improved = await game.submitScore(200, 3)
  assert.equal(game.rows.length, 1)
  assert.equal(game.rows[0].score, 200)
  assert.equal(game.rows[0].mascot, "GIGI")
  assert.equal(improved.entries[0].displayName, name)
  assert.equal(improved.entryId, first.entryId)
  assert.ok(!JSON.stringify(improved).includes(player.user.id))
  assert.ok(!JSON.stringify(improved).includes(player.user.name))
})

test("overlapping submissions retain the higher score", async () => {
  const game = fixture(player)
  await Promise.all([game.submitScore(500, 0), game.submitScore(100, 1)])
  assert.equal(game.rows.length, 1)
  assert.equal(game.rows[0].score, 500)
})

test("leaderboard stays at ten entries and does not highlight a player outside it", async () => {
  const game = fixture(player)
  for (let i = 0; i < 11; i++) {
    game.rows.push({
      id: i + 1, discordId: `other-${i}`, displayName: `cici${10000 + i}`,
      mascot: "CICI", score: 1000 - i, achievedAt: new Date(i),
    })
  }
  const result = await game.submitScore(10, 0)
  assert.equal(result.entries.length, 10)
  assert.equal(result.entries[0].score, 1000)
  assert.equal(result.entryId, null)
})
