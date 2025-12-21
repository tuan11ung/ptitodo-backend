/* eslint-disable no-useless-catch */
import { pickUser } from '~/utils/formatters'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { userModel } from '~/models/user.model'
import bcryptjs from 'bcryptjs'
import { v4 as uuidv4 } from 'uuid'
import 'dotenv/config'
import { JwtProvider } from '~/providers/JwtProvider'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'
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

const login = async (reqBody) => {
  try {
    const existedUser = await userModel.findOneByEmail(reqBody.email)
    if (!existedUser) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        'Account not found!'
      )
    }

    if (!bcryptjs.compareSync(reqBody.password, existedUser.password)) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Email or Password is incorrect!')
    }

    const userInfo = {
      _id: existedUser._id,
      email: existedUser.email
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      process.env.ACCESS_TOKEN_LIFE
      // 5
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
      process.env.REFRESH_TOKEN_LIFE
      // 15
    )

    return { accessToken, refreshToken, ...pickUser(existedUser) }

  } catch (error) {
    throw error
  }
}

// const getDetails = async (userId) => {
//   try {
//     const user = await userModel.getDetails(userId)
//     if (!user) {
//       throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
//     }

//     return user
//   } catch (error) {
//     throw error
//   }
// }

const refreshToken = async (clientRefreshToken) => {
  try {
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE
    )

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      process.env.ACCESS_TOKEN_LIFE
      // 5
    )

    return { accessToken }
  } catch (error) {
    throw error
  }
}

const update = async (userId, reqBody, userAvatarFile) => {
  try {
    const existedUser = await userModel.findOneById(userId)
    if (!existedUser) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!')
    let updatedUser = {
    }

    if (reqBody.current_password && reqBody.new_password) {
      // TH Update password
      if (!bcryptjs.compareSync(reqBody.current_password, existedUser.password)) {
        throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Your Current Password is incorrect!')
      }
      // Neu current pass dung thi hash new password va day vao db
      updatedUser = await userModel.update(userId, {
        password: bcryptjs.hashSync(reqBody.new_password, 8)
      })
    }
    else if (userAvatarFile) {
      // TH cap nhat avatar
      const uploadResult = await CloudinaryProvider.streamUpload(userAvatarFile.buffer, 'users')

      // Luu lai URL cua file anh vao db
      updatedUser = await userModel.update(existedUser._id, {
        avatar: uploadResult.secure_url
      })
    }
    else { // TH Update nhung thong tin chung nhu displayName
      updatedUser = await userModel.update(userId, reqBody)
    }

    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

export const userService = {
  creatNew,
  login,
  refreshToken,
  update
  // getDetails
}