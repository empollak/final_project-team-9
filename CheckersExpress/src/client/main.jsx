import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
} from "react-router-dom";

import { LoginPage, login } from "./routes/login"
import ErrorPage from "./error-page";
import Browser from "./routes/browser";


const router = createBrowserRouter([
  {
    path: "/",
    element: <LoginPage />,
    errorElement: <ErrorPage />,
    action: login,
  },
  {
    path: "/browser",
    element: <Browser />,
    loader: async () => {
      console.log("Fetching data");
      const response = await fetch("/data", {
        method: "GET",
      });
      if (response.status !== 200) {
        console.log("Not authenticated");
        return redirect("/");
      } else {
        console.log("auth'd, code ", response.status);
        // Set up socket and also give the leaderboard data
        return { io: io(), data: await response.json() };
      }
    },
  },
]);

import "./App.css"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
