import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/user.service'

const createNew = async (req, res, next) => {
  try {
    //Dieu huong du lieu sang tang Service
    const createdUser = await userService.creatNew(req.body)

    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const getDetails = async (req, res, next) => {
  try {
    const userId = req.params.id
    const user = await userService.getDetails(userId)

    res.status(StatusCodes.OK).json(user)
  } catch (error) {
    next(error)
  }
}


export const userController = {
  createNew,
  getDetails
}

