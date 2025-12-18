/* eslint-disable no-useless-catch */
import { pickUser } from '~/utils/formatters'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/user.model'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
/**
 * luon phai tra ve return trong service neu khong req se die
 */

const creatNew = async (reqBody) => {
  try {
    // Kiem tra xem email da ton tai trong he thong chua
    const existedUser = await userModel.findOneByEmail(reqBody.email)
    if (existedUser) {
      throw new ApiError(
        StatusCodes.CONFLICT,
        'Email already exists'
      )
    }

    // Tao data de luu vao database
    const nameFromEmail = reqBody.email.split('@')[0]

    const newUserData = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8), // password đã được hash ở controller
      username: nameFromEmail,
      displayName: nameFromEmail,
      role: 'client',
      isActive: false,
      verifyToken: uuidv4()
    }

    const createdUser = await userModel.createNew(newUserData)

    const getNewUser = await userModel.findOneById(createdUser.insertedId)

    // Gui email xac thu cho nguoi dung

    // return tra ve du lieu
    return pickUser(getNewUser)
  } catch (error) {
    throw error
  }
}

const getDetails = async (userId) => {
  try {
    const user = await userModel.getDetails(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    }

    return user
  } catch (error) {
    throw error
  }
}

export const userService = {
  creatNew,
  getDetails
}