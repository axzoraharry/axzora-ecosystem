import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// The dashboard is designed dark-first; setting the class before React mounts
// avoids a flash of the light theme while the bundle evaluates.
document.documentElement.classList.add("dark");

createRoot(document.getElementById("root")!).render(<App />);
