import mongoose from 'mongoose'
import { env } from './env'
import { logger } from './logger'

mongoose.Promise = require('bluebird')

const MONGO_URL = env.MONGO_URL || 'mongodb://localhost/starter'

/**
 *
 */
export const connection = async () => {
  logger.debug('Connecting to database...')

  try {
    const connection = await mongoose.connect(MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    })

    logger.debug('mongo connection created')
    return connection
  } catch (err) {
    logger.debug('Error connecting to Mongo')
    logger.debug(err)
  }
}
