import { StatusCodes } from 'http-status-codes'
import { columnService } from '~/services/column.service'

const createNew = async (req, res, next) => {
  try {
    //Dieu huong du lieu sang tang Service
    const createdcolumn = await columnService.createNew(req.body)

    res.status(StatusCodes.CREATED).json(createdcolumn)
  } catch (error) {
    next(error)
  }
}

export const columnController = {
  createNew
}

