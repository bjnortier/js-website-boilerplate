import express, { Express, NextFunction, Request, Response } from "express"
import { transports, format, createLogger } from "winston"
import path from "path"
import { fileURLToPath } from "url"
import pg from "pg"

/**
 * Application configuration. Take the defensice approach to ensure all
 * env vars are defined. This avoid costly errors when in production
 * and a var has not been defined.
 */
;["PORT", "LOG_LEVEL", "DATABASE_URL"].forEach((key) => {
  if (process.env[key] === undefined) {
    console.error(`Environment variable ${key} is required`)
    process.exit(1)
  }
})
const PORT: string = process.env.PORT!
const LOG_LEVEL: string = process.env.LOG_LEVEL!
const DATABASE_URL: string = process.env.DATABASE_URL!
const NODE_ENV: string = process.env.NODE_ENV!
console.log(NODE_ENV)

/**
 * Logging
 */
const humanReadableFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`
})
const winstonOptions = {
  level: LOG_LEVEL.toLowerCase(),
  format: format.combine(
    format.timestamp(),
    format.json(),
    humanReadableFormat
  ),
  transports: [new transports.Console()],
}
const logger = createLogger(winstonOptions)

/**
 * Database
 */

const poolConfig: any = {
  connectionString: DATABASE_URL,
}
const pool = new pg.Pool(poolConfig)
const db = {
  query: (text: string, params = []) => pool.query(text, params),
}

/**
 * Routes. Each request is logged first. Errors are caught last.
 */
const app: Express = express()
app.use(express.json())
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
})

// Backend
app.get("/api", (req: Request, res: Response) => {
  res.json("Hello World")
})
app.get("/api/people", async (req: Request, res: Response) => {
  try {
    const result = await db.query(
      `
      SELECT *
      FROM people
      ORDER BY created_at DESC
      `
    )
    res.json(result.rows)
  } catch (e) {
    res.status(500).json("something went wrong :/")
  }
})
app.post("/api/add-contact", async (req: Request, res: Response) => {
  const validEMail = (input: string) => {
    return /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/.test(
      input
    )
  }
  const emailAddress = req.body.emailAddress
  if (!validEMail(emailAddress)) {
    res.status(400).json("invalid email address")
  } else {
    try {
      await db.query(
        `
        INSERT INTO people (contact, created_at)
        VALUES ($1, $2)
        `,
        // @ts-ignore not sure why...?
        [emailAddress, new Date()]
      )
      res.status(200).json("ok")
    } catch (e) {
      res.status(500).json("something went wrong :/")
    }
  }
})

// Frontend (in production)
if (NODE_ENV === "production") {
  app.use(express.static("dist/app"))
  app.get("*", function (req, res) {
    const filePath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      "..",
      "app",
      "index.html"
    )
    res.sendFile(filePath)
  })
}

// Errors
app.use((err: any, req: Request, _res: Response, next: NextFunction) => {
  logger.error(`${req.method} ${req.url} ${err.stack}`)
  next()
})

/**
 * Start
 */
app.listen(PORT, () => {
  logger.info(`server listening on port: ${PORT}`)
})
