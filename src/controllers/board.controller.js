import { StatusCodes } from "http-status-codes";
import { boardService } from "~/services/board.service"

const createNew = async (req, res, next) => {
    try {
        //Dieu huong du lieu sang tang Service
        const createdBoard = await boardService.creatNew(req.body)

        res.status(StatusCodes.CREATED).json(createdBoard)
    } catch (error) {
        next(error)
    }
}

export const boardController = {
    createNew
}

