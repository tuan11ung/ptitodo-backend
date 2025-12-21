import express from 'express'
import { boardValidation } from '~/validations/board.validation'
import { boardController } from '~/controllers/board.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .get(authMiddleware.isAuthorized, boardController.getBoards)
  .post(authMiddleware.isAuthorized, boardValidation.createNew, boardController.createNew)

Router.route('/:id')
  .get(authMiddleware.isAuthorized, boardController.getDetails)
  .put(authMiddleware.isAuthorized, boardValidation.update, boardController.update)

Router.route('/support/moving-cards')
  .put(authMiddleware.isAuthorized, boardValidation.moveCardToOtherColumn, boardController.moveCardToOtherColumn)

export const boardRoutes = Router