import {NavLink} from "react-router-dom";

function StartPage() {
    return <div className="h-[100dvh] flex flex-col align-middle items-center bg-green-200 justify-center">
        <div
            className="flex flex-col items-center text-3xl text-emerald-950 mb-12 underline underline-offset-4 font-monte ">
            <p>Visualization</p> <p>Dashboard</p>
        </div>
        <NavLink
            to="/dashboard"
            className="p-5 border rounded-full bg-pink-200 text-pink-950 border-black font-pa hover:scale-105 transition-all">
            Go to Dashboard
        </NavLink>
    </div>
}

export default StartPage;