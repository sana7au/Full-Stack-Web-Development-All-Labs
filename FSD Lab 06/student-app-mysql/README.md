# Step 9: Complete CORS Student Application

This step connects an Express backend with a jQuery frontend across different origins.

### 1. Start the Backend API
In your terminal:
```powershell
cd backend
npm install
npm start
```
The backend starts at <http://localhost:3004>.

### 2. Launch the Frontend
In VS Code, open the `frontend` folder with Live Server (or open `frontend/index.html` in your browser).

### What this example demonstrates
- **Cross-Origin Requests (CORS)**: The frontend running on Live Server origin can safely query the backend API running on port `3004`.
- **AJAX GET Request**: Click **Load students** to retrieve the student roster from `/api/students`.
- **AJAX POST Request**: Fill in the form and submit. The frontend sends JSON payload with `contentType: "application/json"`.
- **Keyboard & Input Interactivity**: Press `Enter` to submit the form, and type in the search bar to filter the enrolled roster in real time.
- **Dynamic DOM Updates**: On successful submission, the newly created student is automatically refreshed in the roster.
