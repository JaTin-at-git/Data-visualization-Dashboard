import React from "react";
import {useNavigate, useRouteError} from "react-router-dom";

const ErrorPage = () => {
    const error = useRouteError();
    const navigate = useNavigate();

    console.log(error);

    return (<div className="flex flex-col justify-center align-middle items-center flex-1">
        <div>{(error && (error.status))}</div>
        <div>{(error && (error.data)) || "Opps!"}</div>
    </div>);
};

export default ErrorPage;
