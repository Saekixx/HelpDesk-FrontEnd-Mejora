import { AuthProvider } from "./context/AuthProvider";
import { AppRouter } from "./router/AppRouter";

export const App = () => {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
};

export default App;
