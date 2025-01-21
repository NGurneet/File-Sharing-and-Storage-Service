
# File Sharing and Storage Service

A backend system built using **Express.js** and **TypeScript** for efficient file sharing, storage, and management.

✨ **Features**
- 📂 **File Upload and Download Management** - Secure and scalable file handling.
- 📜 **API Documentation** - Auto-generated API docs using Swagger.
- 🛠️ **Modular Code Structure** - Organized codebase for easier maintenance and scalability.
- 🔒 **Secure API Endpoints** - Authentication and role-based access control with JWT.

⚙️ **Prerequisites**
- **Node.js** (version 14.x or higher)
- **npm** or **pnpm** for package management

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/NGurneet/File-Sharing-and-Storage-Service.git  
cd File-Sharing-and-Storage-Service
```

### 2. Install Dependencies

If you're using `npm`:

```bash
npm install
```

Or if you're using `pnpm`:

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create your `.env` file by copying the example file:

```bash
cp env.example.production .env
```

Update the `.env` file with your respective configurations (e.g., database URLs, JWT secret, etc.).

### 4. Run the Development Server

Start the development server with the following command:

```bash
npm run dev  
```

This will launch the server in development mode.

---

## 🗂️ Project Structure

The project is organized into the following folders for clarity and modularity:

```
app/
    common/         # Shared utilities and constants
    controllers/    # Handles API logic
    file/           # File handling services (upload, download, etc.)
    swagger/        # Swagger API documentation setup
    user/           # User management (authentication, roles, etc.)
    routes.ts       # Centralized API route definitions
config/             # Application configuration files (e.g., database, app settings)
uploads/            # Folder where files are uploaded
Dockerfile          # Docker configuration for containerizing the app
docker-compose.yml  # Docker Compose setup for running the app with all dependencies
env.example.production # Example environment configuration for production
index.ts            # Main entry point for the application
nodemon.json        # Nodemon configuration for hot-reloading
package.json        # Project metadata and scripts
pnpm-lock.yaml      # Dependency lock file (for pnpm users)
tsconfig.json       # TypeScript configuration
```

---

## 🛠️ Scripts

### Available scripts for development and production environments:

- `npm run dev` - Runs the server in development mode (with live reloading using Nodemon).
- `npm run build` - Compiles the TypeScript files to JavaScript for production.
- `npm run start` - Starts the server (in production or after building).
- `docker-compose up` - Builds and starts the app with all dependencies in Docker (requires Docker and Docker Compose installed).

---

## 📖 API Documentation

You can find the **Swagger-generated API documentation** once the server is running at the following endpoint:

```
[BASE_URL]/api-docs
```

This provides detailed descriptions of all the available API endpoints, input/output formats, and authentication requirements.

---

## 🤝 Contributing

We welcome contributions! To contribute:

1. **Fork the repository** on GitHub.
2. **Create a feature branch**:
   ```bash
   git checkout -b feature-name
   ```
3. **Commit your changes**:
   ```bash
   git commit -m "Add feature"
   ```
4. **Push your changes** to your branch:
   ```bash
   git push origin feature-name
   ```
5. **Open a pull request** on GitHub and describe the changes you’ve made.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
