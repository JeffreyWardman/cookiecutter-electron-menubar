import React from "react";
import { createRoot } from "react-dom/client";

export const App: React.FC = () => {
  return <div></div>;
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
