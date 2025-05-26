# Gestión Académica Web

**Gestión Académica Web** is a Vue 3-based web application designed for academic management, enabling the administration of students, courses, careers, academic cycles, enrollments, grades, professors, and users. Built with Vuetify for the UI, Pinia for state management, and Vue Router for navigation, it supports role-based access (administrator, matriculator, professor, student) to ensure secure and efficient academic operations.

## Features

- **Role-Based Access**: Different functionalities for administrators, matriculators, professors, and students.
- **CRUD Operations**: Manage students, courses, careers, cycles, professors, and users.
- **Enrollment and Grading**: Matriculators can enroll students, and professors can manage grades.
- **Academic History**: Students can view their academic records.
- **Responsive Design**: Built with Vuetify for a seamless experience across devices.

## Tech Stack

- **Frontend**: Vue 3, Vuetify, Pinia, Vue Router
- **HTTP Client**: Axios for backend API communication
- **Build Tool**: Vite
- **Linting**: ESLint
- **CSS**: Material Design Icons (`@mdi/font`)

## Project Structure

```
src/
├── assets/                  # Global styles and resources
│   ├── main.css             # Custom CSS
├── components/              # Reusable Vue components
│   ├── ComponenteBarraNavegacion.vue
│   ├── ComponenteFormulario.vue
│   ├── ComponenteMenuLateral.vue
│   ├── ComponenteNotificacion.vue
│   ├── ComponenteTablaDatos.vue
├── router/                  # Vue Router configuration
│   ├── index.js
├── services/                # Backend API and WebSocket services
│   ├── api.js               # Axios-based API calls
│   ├── websocket.js         # WebSocket service (commented out)
├── stores/                  # Pinia stores for state management
│   ├── usuario.js           # User authentication state
├── views/                   # Main application views
│   ├── VistaAlumnos.vue
│   ├── VistaCarreras.vue
│   ├── VistaCiclos.vue
│   ├── VistaCursos.vue
│   ├── VistaEditarPerfil.vue
│   ├── VistaHistorial.vue
│   ├── VistaInicio.vue
│   ├── VistaLogin.vue
│   ├── VistaMatricula.vue
│   ├── VistaNotas.vue
│   ├── VistaOfertaAcademica.vue
│   ├── VistaProfesores.vue
│   ├── VistaRegistro.vue
│   ├── VistaUsuarios.vue
├── App.vue                  # Root component
├── main.js                  # Entry point
```

## Prerequisites

- **Node.js**: Version 16 or higher
- **Backend Server**: A Java-based backend running at `http://localhost:8080/api` (adjustable in `src/services/api.js`)

## Setup Instructions

1. **Clone the Repository**:
   ```sh
   git clone <repository-url>
   cd gestion-academica-web
   ```

2. **Install Dependencies**:
   ```sh
   npm install
   ```

3. **Configure Environment**:
   - Ensure the backend server is running at `http://localhost:8080/api`.
   - If the backend URL differs, update the `baseURL` in `src/services/api.js`.

4. **Run the Development Server**:
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (or another port if specified).

5. **Build for Production**:
   ```sh
   npm run build
   ```
   This compiles and minifies the app into the `dist/` directory.

6. **Lint the Code**:
   ```sh
   npm run lint
   ```
   Uses ESLint to check for code quality issues.

## Recommended IDE Setup

- **IDE**: [VSCode](https://code.visualstudio.com/)
- **Extension**: [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) for Vue 3 support (disable Vetur if installed).

## Usage

1. **Access the App**:
   - Open `http://localhost:5173` in your browser after starting the development server.
   - Log in using the `/login` route (handled by `VistaLogin.vue`).

2. **Roles and Navigation**:
   - **Administrator**: Access to manage students, courses, careers, cycles, professors, academic offerings, and users.
   - **Matriculator**: Access to the `/matricula` route for student enrollment.
   - **Professor**: Access to the `/notas` route for grade management.
   - **Student**: Access to the `/historial` route to view academic history.

3. **Key Features**:
   - Use the sidebar (`ComponenteMenuLateral.vue`) to navigate based on your role.
   - Manage entities via tables (`ComponenteTablaDatos.vue`) and forms (`ComponenteFormulario.vue`).
   - Receive feedback via notifications (`ComponenteNotificacion.vue`).

## Customization

- **Theme**: Modify Vuetify theme colors in `main.js` (e.g., `primary: '#1976D2'`).
- **Styles**: Add custom CSS in `src/assets/main.css`.
- **WebSocket**: Uncomment and configure `websocket.js` in `main.js` for real-time features.
- **API Endpoints**: Adjust `src/services/api.js` to match your backend routes.

## Development Notes

- **Backend Integration**: Ensure all API endpoints in `src/services/api.js` match the backend (e.g., `/api/alumnos/listar`).
- **Error Handling**: Notifications are implemented; enhance with detailed logging if needed.
- **Future Enhancements**:
  - Expand `VistaInicio.vue` for a more detailed dashboard.
  - Implement real-time updates using WebSocket.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/YourFeature`).
3. Commit your changes (`git commit -m 'Add YourFeature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.