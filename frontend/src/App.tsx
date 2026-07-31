import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.js";
import AppRoutes from "./routes/index.js";

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
