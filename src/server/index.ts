import express, { Express, NextFunction, Request, Response } from "express"
import { transports, format, createLogger } from "winston"
// import Router from "express-promise-router"
// import "@types/express"

const app: Express = express()

/**
 * Application configuration. Take the defensice approach to ensure all
 * env vars are defined. This avoid costly errors when in production
 * and a var has not been defined.
 */
;["PORT", "LOG_LEVEL"].forEach((key) => {
  if (process.env[key] === undefined) {
    console.error(`Environment variable ${key} is required`)
    process.exit(1)
  }
})
const PORT: string = process.env.PORT!
const LOG_LEVEL: string = process.env.LOG_LEVEL!

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
 * Routes. Each request is logged first. Errors are caught last.
 */
app.use(express.json())

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
})

app.get("/api", (req: Request, res: Response) => {
  res.json("Hello World")
})

app.use(express.static("public"))
// app.use("/", createDefaultRouter())

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
