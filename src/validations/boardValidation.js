import Joi from 'joi'
import { StatusCodes } from 'http-status-codes'
import ApiError from '~/utils/ApiError'
import { BOARD_TYPES } from '~/utils/constants'

/**
 * Note: Mac dinh khong can phai custom message o phia BE vi de cho FE validate va custom message
 * BE chi can validate de DAM BAO DU LIEU CHUAN XAC, va tra ve message mac dinh tu thu vien la duoc
 * IMPORTANT: Viec validate du lieu bat buoc phai co o BE vi day la diem cuoi de luu tru du lieu vao database
 * trim() phai di kem voi strict()
 */

const createNew =
async (req, res, next) => {
  const correctCondition = Joi.object({
    title: Joi
      .string()
      .required()
      .min(3)
      .max(50)
      .trim()
      .strict(),
    description: Joi
      .string()
      .required()
      .min(3)
      .max(256)
      .trim()
      .strict(),
    type: Joi.string().valid(...Object.values(BOARD_TYPES)).required()
  })
  try {
    //set abortEarly: false de truong hop co nhieu loi validation thi tra ve tat ca
    await correctCondition.validateAsync(req.body, { abortEarly: false })
    //validate du lieu xong thi gui request di sang controller
    next()
  } catch (error) {
    next(new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, new Error(error).message))
  }
}

export const boardValidation = {
  createNew
}