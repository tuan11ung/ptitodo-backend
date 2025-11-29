/* eslint-disable no-useless-catch */
import { slugify } from '~/utils/formatters'
import { boardModel } from '~/models/board.model'
import ApiError from '~/utils/ApiError'
import { StatusCodes } from 'http-status-codes'

/**
 * luon phai tra ve return trong service neu khong req se die
 */

const creatNew = async (reqBody) => {
  try {
    //xu ly logic du lieu tuy dac thu du an
    const newBoard = {
      ...reqBody,
      slug: slugify(reqBody.title)
    }

    // Goi toi tang Model de xu ly luu ban ghi newBoard vao trong Database
    const createdBoard = await boardModel.createNew(newBoard)

    // Lay ban ghi sau khi goi
    const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)

    return getNewBoard
  } catch (error) {
    throw error
  }
}

const getDetails = async (boardId) => {
  try {
    const board = await boardModel.getDetails(boardId)
    if (!board) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Board not found!')
    }

    return board
  } catch (error) {
    throw error
  }
}


export const boardService = {
  creatNew,
  getDetails
}