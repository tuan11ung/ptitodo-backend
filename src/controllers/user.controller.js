import { StatusCodes } from 'http-status-codes'
import { userService } from '~/services/user.service'
import ms from 'ms'

const createNew = async (req, res, next) => {
  try {
    //Dieu huong du lieu sang tang Service
    const createdUser = await userService.creatNew(req.body)

    res.status(StatusCodes.CREATED).json(createdUser)
  } catch (error) {
    next(error)
  }
}

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body)

    console.log(result);
    res.cookie('accessToken', result.accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })
    res.cookie('refreshToken', result.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge: ms('14 days')
    })

    res.status(StatusCodes.CREATED).json(result)
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
  login,
  getDetails
}

