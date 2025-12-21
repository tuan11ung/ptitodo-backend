/* eslint-disable no-useless-catch */
import { date } from 'joi'
import { cardModel } from '~/models/card.model'
import { columnModel } from '~/models/column.model'
import { CloudinaryProvider } from '~/providers/CloudinaryProvider'

const createNew = async (reqBody) => {
  try {
    const newcard = {
      ...reqBody
    }
    const createdCard = await cardModel.createNew(newcard)
    const getNewCard = await cardModel.findOneById(createdCard.insertedId)

    //...
    if (getNewCard) {

      // Cap nhat mang columnOrderIds trong collection boards
      await columnModel.pushCardOrderIds(getNewCard)
    }

    return getNewCard
  } catch (error) {
    throw error
  }
}

const update = async (cardId, reqBody, cardCoverFile, userInfo) => {
  try {
    const updatedData = {
      ...reqBody,
      updatedAt: Date.now()
    }

    let updatedCard = {}

    if (cardCoverFile) {
      // TH cap nhat avatar
      const uploadResult = await CloudinaryProvider.streamUpload(cardCoverFile.buffer, 'card-covers')

      // Luu lai URL cua file anh vao db
      updatedCard = await cardModel.update(cardId, {
        cover: uploadResult.secure_url
      })
    }
    else if (updatedData.commentToAdd) {
      // Tao du lieu comment de them vao db
      const commentData = {
        ...updatedData.commentToAdd,
        commentedAt: Date.now(),
        userId: userInfo._id,
        userEmail: userInfo.email
      }
      updatedCard = await cardModel.unshiftNewComment(cardId, commentData)
    }
    else {
      // TH update thong tin chung
      updatedCard = await cardModel.update(cardId, updatedData)
    }
    
    return updatedCard
  } catch (error) {
    throw error
  }
}

export const cardService = {
  createNew,
  update
}