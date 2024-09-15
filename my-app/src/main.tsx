import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "@radix-ui/themes/styles.css";
import { Theme } from "@radix-ui/themes";
import { ConvexProvider, ConvexReactClient } from "convex/react";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Theme appearance="dark">
      <ConvexProvider client={convex}>
        <App />
      </ConvexProvider>
    </Theme>
  </React.StrictMode>
);
