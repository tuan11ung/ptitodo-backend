import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardRoutes } from './board.route'
import { columnRoutes } from './column.route'
import { cardRoutes } from './card.route'

const Router = express.Router()

//Check API v1
Router.get('/status', (req, res) => {
  res.status(StatusCodes.OK).json({ message: 'APIs V1 are ready to use' })
})

/* Board APIs */
Router.use('/boards', boardRoutes)

Router.use('/columns', columnRoutes)

Router.use('/cards', cardRoutes)

export const APIs_V1 = Router