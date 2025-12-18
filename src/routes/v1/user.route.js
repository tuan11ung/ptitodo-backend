import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userValidation } from '~/validations/user.validation'
import { userController } from '~/controllers/user.controller'

const Router = express.Router()

Router.route('/')
  .get((req, res) => {
    res.status(StatusCodes.OK).json({ message: 'API gets list user' })
  })
  .post(userValidation.createNew, userController.createNew)

Router.route('/:id')
  .get(userController.getDetails)

export const userRoutes = Router