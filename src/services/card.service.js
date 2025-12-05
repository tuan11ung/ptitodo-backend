/* eslint-disable no-useless-catch */
import { cardModel } from '~/models/card.model'
import { columnModel } from '~/models/column.model'

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

export const cardService = {
  createNew
}