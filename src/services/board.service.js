/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/board.model'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'
import { cloneDeep } from 'lodash'
import { columnModel } from '~/models/column.model'
import { cardModel } from '~/models/card.model'

import { DEFAULT_ITEMS_PER_PAGE, DEFAULT_PAGE } from '~/utils/constants'

/**
 * luon phai tra ve return trong service neu khong req se die
 */

const creatNew = async (userId, reqBody) => {
  try {
    //xu ly logic du lieu tuy dac thu du an
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Goi toi tang Model de xu ly luu ban ghi newBoard vao trong Database
    const createdBoard = await boardModel.createNew(userId, newBoard)

    // Lay ban ghi sau khi goi
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    return getNewBoard
  } catch (error) {
    throw error
  }
}

const update = async (boardId, reqBody) => {
  try {
    const updatedData = {
      ...reqBody,
      updatedAt: Date.now()
    }
    const updatedBoard = await boardModel.update(boardId, updatedData)

    return updatedBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (userId, boardId) => {
  try {
    const board = await boardModel.getDetails(userId, boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    // Clone ra cai moi de xu ly, khong anh huong toi board ban dau
    const resBoard = cloneDeep(board)

    // Dua card ve dung column cua no
    resBoard.columns.forEach(column => {
      // Dung toString() cua JS
      column.cards = resBoard.cards.filter(card => card.columnId.toString() === column._id.toString())

      // Dung equals() cua mongodb
      // column.cards = resBoard.cards.filter(card => card.columnId.equals(column._id))
    })

    // Xoa cards khoi board ban dau
    delete resBoard.cards

    return resBoard
  } catch (error) {
    throw error
  }
}

const moveCardToOtherColumn = async (reqBody) => {
  try {
  /**
   * Khi di chuyen card sang column khac
   * B1: cap nhat lai mang cardOrderIds cua column chua no (xoa _id o mang cu)
   * B2: cap nhat mang cardOrderIds moi vao column moi
   * B3: cap nhat lai columnId cua card vua duoc keo
   * => Lam 1 API support rieng
   */
    // console.log("reqBody: ", reqBody);
    // B1
    await columnModel.update(reqBody.prevColumnId, {
      cardOrderIds: reqBody.prevCardOrderIds,
      updatedAt: Date.now()
    })

    await columnModel.update(reqBody.nextColumnId, {
      cardOrderIds: reqBody.nextCardOrderIds,
      updatedAt: Date.now()
    })

    await cardModel.update(reqBody.currentCardId, {
      columnId: reqBody.nextColumnId,
      updatedAt: Date.now()
    })

    return { updateResult: 'Successfully' }
  } catch (error) {
    throw error
  }
}

const getBoards = async (userId, page, itemsPerPage) => {
  try {
    if (!page) page = DEFAULT_PAGE
    if (!itemsPerPage) itemsPerPage = DEFAULT_ITEMS_PER_PAGE

    const results = await boardModel.getBoards(userId, parseInt(page, 10), parseInt(itemsPerPage, 10))

    return results
  } catch (error) {
    throw error
  }
}

export const boardService = {
  creatNew,
  update,
  getDetails,
  moveCardToOtherColumn,
  getBoards
}