import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import Allroutes from "./Pages/Allroutes";

function App() {
  return (
    <ChakraProvider>
      <Allroutes />
    </ChakraProvider>
  );
}

export default App;
