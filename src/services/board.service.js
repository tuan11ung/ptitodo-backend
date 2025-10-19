import { slugify } from "~/utils/formatters"
import { boardModel } from "~/models/board.model"
import { boardController } from "~/controllers/board.controller"

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
        console.log(createdBoard)  
 
        // Lay ban ghi sau khi goi
        const getNewBoard = await boardModel.findOneById(createdBoard.insertedId)
        console.log(getNewBoard)

        return getNewBoard
    } catch (error) {
        throw error
    }
}

export const boardService = {
    creatNew
}