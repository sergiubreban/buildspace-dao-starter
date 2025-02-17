import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App.jsx";
import { ThirdwebWeb3Provider } from '@3rdweb/hooks';
import { DAOProvider } from "./context";
// import { ChakraProvider } from "@chakra-ui/react";

// Include what chains you wanna support.
// 4 = Rinkeby.
const supportedChainIds = [4];

// Include what type of wallet you want to support.
// In this case, we support Metamask which is an "injected wallet".
const connectors = {
  injected: {},
};
// Render the App component to the DOM
ReactDOM.render(
  <React.StrictMode>
    {/* <ChakraProvider> */ }
    <ThirdwebWeb3Provider
      connectors={ connectors }
      supportedChainIds={ supportedChainIds }
    >
      <DAOProvider>
        <App />
      </DAOProvider>
    </ThirdwebWeb3Provider>
    {/* </ChakraProvider> */ }
  </React.StrictMode >,
  document.getElementById("root")
);
