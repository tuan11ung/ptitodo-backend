import express from 'express'
import { columnValidation } from '~/validations/column.validation'
import { columnController } from '~/controllers/column.controller'

const Router = express.Router()

Router.route('/')
  .post(columnValidation.createNew, columnController.createNew)

Router.route('/:id')
  .put(columnValidation.update, columnController.update)

export const columnRoutes = Router