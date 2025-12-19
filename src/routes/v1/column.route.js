import express from 'express'
import { columnValidation } from '~/validations/column.validation'
import { columnController } from '~/controllers/column.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, columnValidation.createNew, columnController.createNew)

Router.route('/:id')
  .put(authMiddleware.isAuthorized, columnValidation.update, columnController.update)
  .delete(authMiddleware.isAuthorized, columnValidation.deleteItem, columnController.deleteItem)

export const columnRoutes = Router