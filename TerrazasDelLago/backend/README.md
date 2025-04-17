# 🛒 Backend - Ecommerce Terrazas del Lago

Este es el backend del proyecto de ecommerce para Terrazas del Lago (TakeAway), desarrollado con **Node.js**, **Express** y **PostgreSQL**.

---

## ⚙️ Stack y tecnologías
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT para autenticación
- Bcrypt para hash de contraseñas

---

## 📦 Requisitos
- Node.js y npm instalados
- PostgreSQL instalado y corriendo localmente

---

## 🔧 Instalación

1. Clonar el repositorio:

```bash
git clone https://github.com/usuario/proyecto.git
cd backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Crear un archivo `.env` en la raíz del backend con la siguiente configuración:

```env
DB_NAME=terrazasdb
DB_USER=postgres
DB_PASSWORD=admin
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=secreto123
```

4. Crear la base de datos en PostgreSQL:
```sql
CREATE DATABASE terrazasdb;
```

---

## 🧱 Crear tablas automáticamente

Al ejecutar el backend, Sequelize sincroniza las tablas automáticamente:

```bash
npm start
```

> Esto ejecuta `sequelize.sync()` y crea las tablas necesarias como `Users` y `Products`.

---

## 👤 Usuario administrador

### 🔐 Crear usuario admin manualmente

1. Generar un hash de la contraseña (ejemplo: `admin123`):

```js
const bcrypt = require('bcrypt');
bcrypt.hash("admin123", 10).then(console.log);
```

2. Insertar el usuario en la base de datos:

```sql
INSERT INTO "Users" (name, email, password, role, createdAt, updatedAt)
VALUES ('Admin', 'admin@admin.com', '<hash generado>', 'admin', NOW(), NOW());
```

Reemplazar `<hash generado>` con el resultado del paso anterior.

---

## ✅ Funcionalidades implementadas

### Productos (CRUD):
- [x] GET `/api/products` → Listar productos (público)
- [x] GET `/api/products/:id` → Ver un producto
- [x] POST `/api/products` → Crear producto *(solo admin)*
- [x] PUT `/api/products/:id` → Editar producto *(solo admin)*
- [x] DELETE `/api/products/:id` → Eliminar producto *(solo admin)*

### Autenticación:
- [x] POST `/api/auth/register` → Registro de usuario
- [x] POST `/api/auth/login` → Login y generación de token

### Seguridad:
- [x] Hash de contraseñas con Bcrypt
- [x] JWT para proteger rutas
- [x] Middleware de autorización por rol (`admin`, `user`)

---

## 🛡️ Middleware de autenticación y roles

Las rutas están protegidas con JWT. Solo los admins pueden crear/editar/eliminar productos. Los usuarios normales pueden ver productos.

---

## 📂 Estructura de carpetas

```
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   └── productController.js
├── middleware/
│   ├── authMiddleware.js
│   └── roleMiddleware.js
├── models/
│   ├── user.js
│   └── products.js
├── routes/
│   ├── authRoutes.js
│   └── productRoutes.js
├── src/
│   └── index.js
└── .env
```

---



---

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(10) DEFAULT 'user'
);

INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin@terrazas.com', '$2b$10$2zHfyWGaWlxqEuhfIYe8NeneN1nMDxG3xqIzQpRx1pxAVsBnhAhrS', 'admin');

