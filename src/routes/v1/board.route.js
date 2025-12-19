import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { boardValidation } from '~/validations/board.validation'
import { boardController } from '~/controllers/board.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, (req, res) => {
    res.status(StatusCodes.OK).json({ message: 'API gets list board' })
  })
  .post(authMiddleware.isAuthorized, boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  .put(authMiddleware.isAuthorized, boardValidation.update, boardController.update)

Router.route('/support/moving-cards')
  .put(authMiddleware.isAuthorized, boardValidation.moveCardToOtherColumn, boardController.moveCardToOtherColumn)

export const boardRoutes = Router