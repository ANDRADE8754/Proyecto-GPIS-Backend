import cors from "cors";
import express from "express";
import morgan from "morgan";

import categoryRoutes from "./routes/category.routes.js";
import conversationRoutes from "./routes/conversation.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import messageRoutes from "./routes/message.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import productRoutes from "./routes/product.routes.js";
import ratingRoutes from "./routes/rating.routes.js";
import roleRoutes from "./routes/role.routes.js";
import userRoutes from "./routes/user.routes.js";

// Corregido el nombre del archivo (singular en lugar de plural)
import appealRoutes from "./routes/appeal.routes.js";
import incidenceRoutes from "./routes/incidence.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

import expressWs from "express-ws";
import { swaggerSpec, swaggerUi } from "./config/swagger.js";
import { authenticateToken } from "./middlewares/auth.middleware.js";
import { metodos } from "./sockets/sockets.js";
import { setWssInstance } from "./utils/websocket-emitter.js";

const app = express();
const wsInstance = expressWs(app);

// Inicializar el WebSocket emitter global
setWssInstance(wsInstance.getWss());

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// Rutas
app.use("/users", userRoutes);
app.use("/roles", authenticateToken, roleRoutes);
app.use("/categories", categoryRoutes);
app.use("/products", productRoutes);
app.use("/conversations", authenticateToken, conversationRoutes);
app.use("/messages", authenticateToken, messageRoutes);
app.use("/notifications", authenticateToken, notificationRoutes);
app.use("/favorites", authenticateToken, favoriteRoutes);
app.use("/ratings", authenticateToken, ratingRoutes);

// También corregido aquí
app.use("/incidences", authenticateToken, incidenceRoutes);
app.use("/appeals", authenticateToken, appealRoutes);
app.use("/reports", authenticateToken, reportsRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/uploads", express.static("uploads"));

// Health check endpoint para Docker/Kubernetes
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.ws("/", (ws, req) => metodos(ws, req, wsInstance.getWss()));

export default app;
