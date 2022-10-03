import express, { Express, NextFunction, Request, Response } from "express"
import { transports, format, createLogger } from "winston"
// import Router from "express-promise-router"
// import "@types/express"

const app: Express = express()

/**
 * Application configuration.
 */
;["PORT"].forEach((key) => {
  if (process.env[key] === undefined) {
    console.error(`Environment variable ${key} is required`)
    process.exit(1)
  }
})
const PORT: string = process.env.PORT
const LOG_LEVEL: string = process.env.LOG_LEVEL || "info"

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
 * Routes
 */
app.use(express.json())

app.get("/", (req: Request, res: Response) => {
  res.json("Hello World")
})

// The INFO logger runs before routes to log the request before being handled.
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`)
  next()
})

// ROUTES
app.use(express.static("public"))
// app.use("/", createDefaultRouter())

// The ERROR logger catches any errors in the routes.
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
