import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {createBrowserRouter, RouterProvider,} from "react-router-dom";
import "./index.css";
import Root from "./pages/Root.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";
import StartPage from "./pages/StartPage.jsx";
import Dashboard, {loadGraphData} from "./pages/Dashboard.jsx";
import {getFilters} from "./components/Filter.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root/>,
        errorElement: <ErrorPage/>,
        children: [
            {
                path: "/",
                element: <StartPage/>
            }, {
                path: "dashboard",
                loader: async function () {
                    const filters = await getFilters();
                    const graphData = await loadGraphData();
                    return {filters, graphData}
                },
                element: <Dashboard/>,
            }
        ]
    },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router}/>
    </React.StrictMode>
);