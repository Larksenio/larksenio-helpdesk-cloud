# Larksenio HelpDesk Cloud

Larksenio HelpDesk Cloud es una aplicación web full stack para la gestión de tickets de soporte técnico.  
El proyecto fue desarrollado con Angular, Node.js, Express, PostgreSQL y Prisma, con enfoque en arquitectura cloud, autenticación JWT y despliegue profesional.

## Objetivo del proyecto

Este proyecto fue creado como parte de mi portafolio profesional para demostrar habilidades como desarrollador full stack, integrando frontend, backend, base de datos relacional, autenticación, API REST y preparación para despliegue en la nube.

## Tecnologías utilizadas

### Frontend

- Angular
- TypeScript
- HTML
- CSS
- Angular Router
- Reactive communication with HTTP Client

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- JWT Authentication
- BcryptJS

### Base de datos

- PostgreSQL
- Neon PostgreSQL Cloud

### Herramientas

- Git
- GitHub
- Postman
- Visual Studio Code

## Funcionalidades principales

- Login de administrador
- Autenticación con JWT
- Protección de rutas privadas
- Dashboard con estadísticas reales
- Creación de tickets
- Listado de tickets
- Detalle de tickets
- Actualización de estado y prioridad
- Eliminación de tickets para administrador
- Conexión a base de datos PostgreSQL en la nube
- Separación entre frontend y backend

## Arquitectura del proyecto

```txt
Usuario
  ↓
Frontend Angular
  ↓
API REST Node.js + Express
  ↓
Prisma ORM
  ↓
PostgreSQL Cloud - Neon

Estructura del proyecto
larksenio-helpdesk-cloud/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   │   ├── config/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── index.ts
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── guards/
│   │   │   ├── models/
│   │   │   ├── pages/
│   │   │   └── services/
│   │   └── environments/
│   └── package.json
│
└── README.md
Variables de entorno del backend

Crear un archivo .env dentro de la carpeta backend tomando como referencia .env.example.
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:4200

DATABASE_URL="postgresql://USER:PASSWORD@HOST.neon.tech/neondb?sslmode=require"

JWT_SECRET="your_secret_key_here"

Instalación y ejecución local
1. Clonar el repositorio

git clone https://github.com/Larksenio/larksenio-helpdesk-cloud.git
cd larksenio-helpdesk-cloud
2. Instalar backend
cd backend
npm install
npx prisma generate
npm run dev
El backend se ejecuta en:
http://localhost:3001
3. Instalar frontend
En otra terminal:
cd frontend
npm install
ng serve
El frontend se ejecuta en:
http://localhost:4200
Endpoints principales
Autenticación
POST /api/auth/register-admin
POST /api/auth/login
GET  /api/auth/me
Tickets
POST   /api/tickets
GET    /api/tickets
GET    /api/tickets/stats
GET    /api/tickets/:id
PATCH  /api/tickets/:id
DELETE /api/tickets/:id

Aprendizajes del proyecto

Durante el desarrollo de esta aplicación se implementaron conceptos importantes de desarrollo full stack:

Consumo de APIs REST desde Angular
Protección de rutas con JWT
Manejo de roles de usuario
Conexión con PostgreSQL Cloud
Uso de Prisma ORM
Separación de responsabilidades entre frontend y backend
Manejo de variables de entorno
Preparación para despliegue cloud
Autor

Desarrollado por Larksenio como proyecto full stack para portafolio profesional.