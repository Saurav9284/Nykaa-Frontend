import "./App.css";
import { ChakraProvider } from "@chakra-ui/react";
import Allroutes from "./Pages/Allroutes";
import Navbar from "./Component/Navbar";

function App() {
  return (
    <ChakraProvider>
      <Navbar/>
      <Allroutes />
    </ChakraProvider>
  );
}

export default App;
