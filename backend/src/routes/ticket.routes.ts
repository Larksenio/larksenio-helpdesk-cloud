import { Router, Response } from "express";
import { prisma } from "../config/prisma";
import {
  verifyToken,
  verifyAdmin,
  AuthenticatedRequest,
} from "../middlewares/auth.middleware";
import { TicketPriority, TicketStatus } from "@prisma/client";

const router = Router();

// Crear ticket
router.post("/", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { title, description, priority } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        message: "Título y descripción son obligatorios",
      });
    }

    const ticket = await prisma.ticket.create({
      data: {
        title,
        description,
        priority: priority || TicketPriority.MEDIUM,
        userId: req.user!.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return res.status(201).json({
      message: "Ticket creado correctamente",
      ticket,
    });
  } catch (error) {
    console.error("Error al crear ticket:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
});

// Listar tickets
router.get("/", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === "ADMIN";

    const tickets = await prisma.ticket.findMany({
      where: isAdmin ? {} : { userId: req.user!.id },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: true,
      },
    });

    return res.json({
      message: "Tickets obtenidos correctamente",
      total: tickets.length,
      tickets,
    });
  } catch (error) {
    console.error("Error al obtener tickets:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
});

// Estadísticas de tickets
router.get("/stats", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const isAdmin = req.user?.role === "ADMIN";

    const whereCondition = isAdmin ? {} : { userId: req.user!.id };

    const total = await prisma.ticket.count({
      where: whereCondition,
    });

    const open = await prisma.ticket.count({
      where: {
        ...whereCondition,
        status: TicketStatus.OPEN,
      },
    });

    const inProgress = await prisma.ticket.count({
      where: {
        ...whereCondition,
        status: TicketStatus.IN_PROGRESS,
      },
    });

    const resolved = await prisma.ticket.count({
      where: {
        ...whereCondition,
        status: TicketStatus.RESOLVED,
      },
    });

    const closed = await prisma.ticket.count({
      where: {
        ...whereCondition,
        status: TicketStatus.CLOSED,
      },
    });

    return res.json({
      message: "Estadísticas obtenidas correctamente",
      stats: {
        total,
        open,
        inProgress,
        resolved,
        closed,
      },
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
});

// Obtener ticket por ID
router.get("/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        comments: true,
      },
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket no encontrado",
      });
    }

    const isOwner = ticket.userId === req.user!.id;
    const isAdmin = req.user?.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "No tienes permiso para ver este ticket",
      });
    }

    return res.json({
      message: "Ticket obtenido correctamente",
      ticket,
    });
  } catch (error) {
    console.error("Error al obtener ticket:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
});

// Actualizar ticket
router.patch("/:id", verifyToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { title, description, status, priority } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({
        message: "ID inválido",
      });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
    });

    if (!ticket) {
      return res.status(404).json({
        message: "Ticket no encontrado",
      });
    }

    const isOwner = ticket.userId === req.user!.id;
    const isAdmin = req.user?.role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "No tienes permiso para editar este ticket",
      });
    }

    const updatedTicket = await prisma.ticket.update({
      where: { id },
      data: {
        title,
        description,
        status,
        priority,
      },
    });

    return res.json({
      message: "Ticket actualizado correctamente",
      ticket: updatedTicket,
    });
  } catch (error) {
    console.error("Error al actualizar ticket:", error);

    return res.status(500).json({
      message: "Error interno del servidor",
    });
  }
});

// Eliminar ticket solo como administrador
router.delete(
  "/:id",
  verifyToken,
  verifyAdmin,
  async (req: AuthenticatedRequest, res: Response) => {
    try {
      const id = Number(req.params.id);

      if (isNaN(id)) {
        return res.status(400).json({
          message: "ID inválido",
        });
      }

      const ticket = await prisma.ticket.findUnique({
        where: { id },
      });

      if (!ticket) {
        return res.status(404).json({
          message: "Ticket no encontrado",
        });
      }

      await prisma.ticketComment.deleteMany({
        where: {
          ticketId: id,
        },
      });

      await prisma.ticket.delete({
        where: { id },
      });

      return res.json({
        message: "Ticket eliminado correctamente",
      });
    } catch (error) {
      console.error("Error al eliminar ticket:", error);

      return res.status(500).json({
        message: "Error interno del servidor",
      });
    }
  }
);

export default router;