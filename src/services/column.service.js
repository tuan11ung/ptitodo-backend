/* eslint-disable no-useless-catch */
import { columnModel } from '~/models/column.model'
import { boardModel } from '~/models/board.model'

const createNew = async (reqBody) => {
  try {
    const newColumn = {
      ...reqBody
    }
    const createdColumn = await columnModel.createNew(newColumn)

    // Lay ra id cua column moi
    const getNewColumn = await columnModel.findOneById(createdColumn.insertedId)

    if (getNewColumn) {
      // Xu ly cau truc data o day truoc khi tra du lieu ve
      getNewColumn.cards = []

      // Cap nhat mang columnOrderIds trong collection boards
      await boardModel.pushColumnOrderIds(getNewColumn)
    }

    return getNewColumn
  } catch (error) {
    throw error
  }
}

const update = async (columnId, reqBody) => {
  try {
    const updatedData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedColumn = await columnModel.update(columnId, updatedData)

    return updatedColumn
  } catch (error) {
    throw error
  }
}

export const columnService = {
  createNew,
  update
}