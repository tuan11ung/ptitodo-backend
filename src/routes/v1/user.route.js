import express from 'express'
import { userValidation } from '~/validations/user.validation'
import { userController } from '~/controllers/user.controller'
import { authMiddleware } from '~/middlewares/authMiddleware'

const Router = express.Router()

Router.route('/register')
  .post(userValidation.createNew, userController.createNew)

Router.route('/login')
  .post(userValidation.login, userController.login)

// Router.route('/:id')
//   .get(userController.getDetails)

Router.route('/logout')
  .delete(userController.logout)

Router.route('/refresh_token')
  .get(userController.refreshToken)

Router.route('/update')
  .put(authMiddleware.isAuthorized, userValidation.update, userController.update)

export const userRoutes = Router