import { useRoutes } from "react-router-dom";

const routeConfig = [
  {
    
  }
];

function App() {
  const routes = useRoutes(routeConfig);

  return (
    <main>{routes}</main>

  );
}

export default App;
