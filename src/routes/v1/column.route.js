import express from 'express'
import { columnValidation } from '~/validations/columnValidation'
import { columnController } from '~/controllers/column.controller'

const Router = express.Router()

Router.route('/')
  .post(columnValidation.createNew, columnController.createNew)

export const columnRoutes = Router