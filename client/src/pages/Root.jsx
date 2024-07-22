import React, {useEffect} from 'react';
import {Outlet, useLocation} from "react-router-dom";
import Loader from "./Loader.jsx";


// export function generateError() {
//     throw new Response("Not Found", {status: 404});
//     return "mew";
// }

const Root = () => {

    const location = useLocation();

    useEffect(() => {
        window.scrollTo({top: 0, behavior: "smooth"})
    }, [location]);

    return (<main className="min-h-screen flex flex-col">
            <Loader/>
            <div className="grow">
                <Outlet/>
            </div>
        </main>
    );
};

export default Root;