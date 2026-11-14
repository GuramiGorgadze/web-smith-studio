import { RouterProvider } from "react-router-dom";
import { TooltipProvider } from "@/components/ui";
import { ThemeProvider } from "@/context/ThemeContext";
import { router } from "@/routes/router";

export default function App() {
  return (
    <ThemeProvider>
      <TooltipProvider>
        <RouterProvider router={router} />
      </TooltipProvider>
    </ThemeProvider>
  );
}
