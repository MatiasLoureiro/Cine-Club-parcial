# CineClub

Aplicación web para buscar películas utilizando la API de TMDB y permitir a los usuarios crear y eliminar reseñas.

## Tecnologías

### Backend

- Node.js
- Express
- Axios
- dotenv

### Frontend

- React
- Vite
- JavaScript
- CSS

## Requisitos

- Node.js instalado
- Una API Key de TMDB

## Configuración del backend

Entrar en:

backend/

Instalar dependencias:

npm install

Crear un archivo `.env`:

TMDB_API_KEY=TU_API_KEY
PORT=3001

Iniciar el servidor:

node server.js

El backend estará disponible en:

http://localhost:3001

## Configuración del frontend

Entrar en:

frontend/

Instalar dependencias:

npm install

Crear un archivo `.env`:

VITE_API_URL=http://localhost:3001

Iniciar React:

npm run dev

Vite mostrará la dirección donde está disponible el frontend.

## Funcionalidades

- Buscar películas.
- Mostrar póster, título, año y promedio CineClub.
- Ver detalle de una película.
- Ver reseñas.
- Crear reseñas.
- Eliminar reseñas.
- Calcular promedio de reseñas.
- Manejar estados de carga y errores.

## API

### Buscar películas

GET /api/movies/search?q=Matrix

### Obtener detalle

GET /api/movies/:id

### Crear reseña

POST /api/movies/:tmdbId/reviews

Campos:

- author
- score
- comment

### Eliminar reseña

DELETE /api/reviews/:reviewId