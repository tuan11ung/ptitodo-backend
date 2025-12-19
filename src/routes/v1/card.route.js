import express from 'express'
import { cardValidation } from '~/validations/card.validation'
import { cardController } from '~/controllers/card.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/')
  .post(authMiddleware.isAuthorized, cardValidation.createNew, cardController.createNew)

export const cardRoutes = Router