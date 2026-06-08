<!--
TEMPLATE — copy this into every feature folder as `context.md`. Keep it SHORT
(it's read first, every time). It is the memory that survives long breaks and
model resets. Fill in real values and delete these comments.
-->

# Feature: <name>

**What it does:** <one sentence>

**Where it lives:** `apps/<app>/src/features/<name>`

**Counterpart (the "Gegenstück"):** <e.g. "Dashboard side `broadcast` sends, this
app side reads"> — joined via `<core entity/service>`. _Nothing here, if standalone._

**Why it's built this way:** <the non-obvious decision / business reason a future
reader or model must not break, e.g. "reads are realtime because the dashboard
writes live during POS scans">

**Key files:** `api/<name>.api.ts`, `hooks/use-<name>.ts`, `components/…`

**Gotchas:** <anything easy to get wrong>
