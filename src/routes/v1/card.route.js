import express from 'express'
import { cardValidation } from '~/validations/cardValidation'
import { cardController } from '~/controllers/card.controller'

const Router = express.Router()

Router.route('/')
  .post(cardValidation.createNew, cardController.createNew)

export const cardRoutes = Router