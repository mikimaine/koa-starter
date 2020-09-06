import { Bristol } from 'bristol'
import palin from 'palin'
import { env } from './env'

export const logger = new Bristol()

/* istanbul ignore next */
if (env && env.LOG_LEVEL !== 'off') {
  logger.addTarget('console').withFormatter(palin, {
    rootFolderName: env.APP_NAME // Edit this to match your project folder inside env
  })
}
