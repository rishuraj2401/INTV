const express = require("express");
const app=express();
const server = require("http").createServer(app);
const cors = require("cors");
const path= require("path");
app.use(express.json());
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],

  },
});

app.use(cors());

const PORT = process.env.PORT || 3001;

// app.get("/", (req, res) => {
//   res.send("Running");
// });

io.on("connection", (socket) => {
  socket.emit("me", socket.id);
  // socket.join("me",socket.id);
  console.log(`User Connected: ${socket.id}`);


  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", {
      signal: signalData,
      from,
      name,
    });
  });

  socket.on("updateMyMedia", ({ type, currentMediaStatus }) => {
    console.log("updateMyMedia");
    socket.broadcast.emit("updateUserMedia", { type, currentMediaStatus });
  });

  socket.on("msgUser", ({ name, to, message, sender }) => {
    io.to(to).emit("msgRcv", { name,message, sender });
  });
  socket.on("join_room", (data) => {
    socket.join(data); 
    console.log(data ,'joioned');
  });

  socket.on("send_message", (data) => {
    socket.to(data.to).emit("receive_message", data);
    // console.log('mesg gaya' ,data.message);
  });


  socket.on("answerCall", (data) => {
    socket.broadcast.emit("updateUserMedia", {
      type: data.type,
      currentMediaStatus: data.myMediaStatus,
    });
    io.to(data.to).emit("callAccepted", data);
  }); 
  socket.on("endCall", ({ id }) => {
    io.to(id).emit("endCall");
  });
});
// io.on("connection", (socket) => {
  // console.log(`User Connected: ${socket.id}`);

//   socket.on("join_room", (data) => {
//     socket.join(data);
//   });

//   socket.on("send_message", (data) => {
//     socket.to(data.room).emit("receive_message", data);
//   });
// });


if ("production" == "production") {
   
 
  app.use(express.static(path.resolve(__dirname, "./client/build")));
  app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "./client/build", "index.html"))
  })
}
app.use(express.urlencoded({ extended: false }));
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
// "scripts": {
//   "test": "echo \"Error: no test specified\" && exit 1",
//   "client": "cd client && npm start",
//   "dev": "concurrently \"nodemon index.js\" \"npm run client\""
// },











// const express = require("express");
// const app = express();
// const http = require("http");
// const { Server } = require("socket.io");
// const cors = require("cors");

// app.use(cors());

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`User Connected: ${socket.id}`);

//   socket.on("join_room", (data) => {
//     socket.join(data);
//     console.log(data);
//   });

//   socket.on("send_message", (data) => {
//     socket.to(data.room).emit("receive_message", data);
//   });
// });

// server.listen(3001, () => {
//   console.log("SERVER IS RUNNING");
// });
