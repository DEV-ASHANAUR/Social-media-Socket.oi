const io = require("socket.io")(8800, {
    cors: {
        origin: "http://localhost:3000",
    }
});

let activeUsers = [];

io.on("connection", (socket) => {
    //add new user
    socket.on("new-user-add", (newUserId) => {
        //if new user not added previously
        if (!activeUsers.some((user) => user.userId === newUserId)) {
            activeUsers.push({ userId: newUserId, socketId: socket.id });
            console.log("new User Connected", activeUsers);
        }
        // send all active users to new user
        io.emit("get-users", activeUsers);
    });

    socket.on("disconnect", () => {
        // remove user 
        activeUsers = activeUsers.filter((user) => user.socketId !== socket.id);
        console.log("user disconnected", activeUsers);
        // send all active users to all users
        io.emit("get-users", activeUsers);
    });

    socket.on("send-message", (data) => {
        const { reciverId } = data;
        const user = activeUsers.find((user) => user.userId === reciverId);
        console.log("something from socket to:", reciverId);
        console.log("data", data);
        if (user) {
            io.to(user.socketId).emit("recive-message", data);
        }
    });
});


