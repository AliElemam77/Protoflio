import AppRouter from "./routes/AppRouter";
import CustomCursor from "./components/commen/CustomCursor";
import { PortfolioProvider } from "./context/PortfolioContext";

function App() {
  return (
    <PortfolioProvider>
      <CustomCursor />
      <AppRouter />
    </PortfolioProvider>
  );
}

export default App;
