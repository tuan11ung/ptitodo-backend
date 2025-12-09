import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/board.validation'
import { boardController } from '~/controllers/board.controller'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'API gets list board' })
  })
  .post(boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(boardController.getDetails)
  .put(boardValidation.update, boardController.update)

Router.route('/support/moving-card')
  .put(boardValidation.moveCardToOtherColumn, boardController.moveCardToOtherColumn)

export const boardRoutes = Router