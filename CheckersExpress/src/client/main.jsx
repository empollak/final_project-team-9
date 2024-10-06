import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  useLoaderData
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
      if (response.status === 401) {
        console.log("Not authenticated");
        return redirect("/");
      } else {
        console.log("auth'd, code ", response.status);
        return io();
      }
      // await fetch server data
      // if not logged in, return redirect to login
    },
  },
  // {
  //   path: "/game",
  //   element: <Game socket={socket} />,
  // }
]);

import App from "./App";
import Game from "./routes/game";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
