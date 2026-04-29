import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.routes";
import ticketRoutes from "./routes/ticket.routes";
import { prisma } from "./config/prisma";

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3001;

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:4200",
  })
);

app.use(express.json());

// Ruta principal
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "API de Larksenio HelpDesk Cloud funcionando correctamente",
  });
});

// Ruta de salud del servidor
app.get("/health", (req: Request, res: Response) => {
  res.json({
    status: "OK",
    service: "Larksenio HelpDesk Cloud API",
    timestamp: new Date().toISOString(),
  });
});

// Ruta para probar conexión con PostgreSQL Cloud
app.get("/api/db-test", async (req: Request, res: Response) => {
  try {
    const usersCount = await prisma.user.count();
    const ticketsCount = await prisma.ticket.count();

    res.json({
      message: "Conexión a PostgreSQL Cloud exitosa",
      database: "Neon PostgreSQL",
      users: usersCount,
      tickets: ticketsCount,
    });
  } catch (error) {
    console.error("Error al conectar con la base de datos:", error);

    res.status(500).json({
      message: "Error al conectar con la base de datos",
      error,
    });
  }
});
app.use("/api/auth", authRoutes);
app.use("/api/tickets", ticketRoutes);
app.listen(PORT, () => {
  console.log(`Servidor backend ejecutándose en http://localhost:${PORT}`);
});