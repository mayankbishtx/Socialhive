import { Server } from "socket.io";
import type { Server as HTTPServer } from "http";
import logger from "../config/logger";
import { allowedOrigins } from "../config/cors"

const userSocketMap = new Map<string, string>();

let io: Server;

export const initSocket = (httpServer: HTTPServer): Server => {
    io = new Server(httpServer, {
        cors: {
            origin: allowedOrigins, 
            methods: ["GET", "POST"]
        },
    });

    io.on("connection", (socket) => {
        logger.info("New socket connected:" , socket.id)

        socket.on("register", (userId: string) => {
            userSocketMap.set(userId, socket.id);
            logger.info(`User ${userId} registered with socket ${socket.id}`);
        });

        socket.on("disconnect", () => {
            for (const [userId, socketId] of userSocketMap.entries()) {
                if(socketId === socket.id) {
                    userSocketMap.delete(userId);
                    logger.info(`User ${userId} disconnected`);
                    break;
                }
            }
        });
    });

    return io;
}

export const emitToUser = (userId: string, event: string, data: any): void => {
    const socketId = userSocketMap.get(userId);

    if(socketId) {
        io.to(socketId).emit(event, data);
    }
    
};