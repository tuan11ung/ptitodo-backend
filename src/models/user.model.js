import Joi from 'joi'
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators.js'
import { GET_DB } from '~/config/mongodb'
import { ObjectId } from 'mongodb'

// ROLES
const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
}

// Define Collection (name & schema)
const USER_COLLECTION_NAME = 'users'
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE).trim(),
  password: Joi.string().required().min(8).trim(),

  username: Joi.string().required().min(2).strict().trim(),
  displayName: Joi.string().required().min(2).strict().trim(),
  avatar: Joi.string().default(null),
  role: Joi.string().valid(...Object.values(USER_ROLES)).default(USER_ROLES.CLIENT),

  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),

  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

// Du lieu khong duoc phep cap nhat
const INVALID_UPDATE_FIELDS = ['_id', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

const createNew = async (data) => {
  try {
    const validatedData = await validateBeforeCreate(data)
    const createdUser = await GET_DB().collection(USER_COLLECTION_NAME).insertOne(validatedData)
    return createdUser
  } catch (error) {
    throw new Error(error)
  }
}

const findOneById = async (id) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      _id: new ObjectId(String(id))
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async (emailValue) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      email: emailValue
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}


// const getDetails = async (id) => {
//   try {
//     const result = await GET_DB().collection(USER_COLLECTION_NAME).aggregate([
//       {
//         $match: {
//           _id: new ObjectId(id),
//           _destroy: false
//         }
//       },
//       {
//         $project: {
//           password: 0,
//           verifyToken: 0
//         }
//       }
//     ]).toArray()
//     return result[0] || null
//   } catch (error) {
//     throw new Error(error)
//   }
// }

const update = async (userId, updateData) => {
  try {
    Object.keys(updateData).forEach(fieldName => {
      if (INVALID_UPDATE_FIELDS.includes(fieldName)) {
        delete updateData[fieldName]
      }
    })

    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateData },
      { returnDocument: 'after' }
    )
    return result
  } catch (error) {
    throw new Error(error)
  }
}

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  update,
  findOneById,
  findOneByEmail
  // getDetails
}