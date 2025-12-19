import { GONE, StatusCodes } from 'http-status-codes'
import { JwtProvider } from '~/providers/JwtProvider'
import ApiError from '~/utils/ApiError'
import 'dotenv/config'

const isAuthorized = async (req, res, next) => {
  // Lay accessToken
  const clientAccessToken = req.cookies?.accessToken

  // Check xem co ton tai hay khong
  if (!clientAccessToken) {
    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized! (token not found)'))
  }

  try {
    // Giai ma token xem hop le hay khong
    const accessTokenDecoded = await JwtProvider.verifyToken(clientAccessToken, process.env.ACCESS_TOKEN_SECRET_SIGNATURE)

    // Neu token hop le,, thi luu thong tin decoded vao req.jwtDecoded, de su dung cho cac tang phia sau
    req.jwtDecoded = accessTokenDecoded

    // Cho phep req di tiep
    next()

  } catch (error) {
    // Neu accessToken bi het han thi tra ve ma GONE
    if (error?.message?.includes('jwt expired')) {
      next(new ApiError(StatusCodes.GONE, 'Need to refresh token.'))
    }

    next(new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized!'))
  }
}

export const authMiddleware = {
  isAuthorized
}