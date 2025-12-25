export const inviteUserToBoardSocket = (socket) => {
  console.log('a user connected')
  // Lang nghe su kien ma client emit len
  socket.on('FE_USER_INVITED_TO_BOARD', (invitation) => {
    // Emit nguoc lai mot su kien ve cho moi client khac (ngoai tru user gui request) roi FE se check
    socket.broadcast.emit('BE_USER_INVITED_TO_BOARD', invitation)
  })
}