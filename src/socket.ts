import { Server } from "socket.io";



let io:Server;


export const initSocket = (server:any) => {
    io = new Server(server,{
        cors:{
            origin:"*"
        }
    })

    io.on("connection",(socket)=> {
        console.log("User Connected:",socket.id);

        socket.on("join_station",(stationId)=>{
            socket.join(stationId)
        })

        socket.on("disconnect",()=>{
            console.log("User Disconnected")
        })
    })
}

export const getIO = () => {
    if(!io) throw new Error("Socket not initialised");
    return io;
}