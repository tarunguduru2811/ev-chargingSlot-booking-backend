import app from "./app";
import http from "http"
import { initSocket } from "./socket";

const PORT = 5000;
const server = http.createServer(app)

initSocket(server)

server.listen(PORT,()=>{
    console.log(`Server Running on port ${PORT}`)
})