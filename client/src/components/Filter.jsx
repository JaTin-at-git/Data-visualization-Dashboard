import to from "await-to-js";
import {request} from "../../requestMethods.js";
import {useLoaderData} from "react-router-dom";
import Select from "./Select.jsx";
import { VscDebugStepOver } from "react-icons/vsc";
import LogicalButton from "./LogicalButton.jsx";

export async function getFilters() {
    const [err, res] = await to(request.get("/getFilters"));
    if (err) throw new Response(err.response.data.message, {status: err.response.status});
    return res;
}


function Filter({insert, off, incrementPos}) {

    const filters = useLoaderData().data.data.filters;

    const logicalButtons = [{
        title: "union", symbol: "∪", offTriggers: ['u', 'i', 'o', 'n']
    }, {title: "intersection", symbol: "∩", offTriggers: ['u', 'i', 'o', 'n']}, {
        title: "create group", symbol: "( )", offTriggers: ['c', 'f']
    }, {
        title: "logical not", symbol: "!( )", offTriggers: ['c', 'f']
    }];

    return (<div className=" grid grid-cols-12 gap-5 bg-gren-100 p-10 ">

        <div className="col-start-1 col-end-3 flex">
            {/* buttons */}

            <div className="border-r pr-5 grid grid-cols-2 gap-2 font-bold text-lg">
                {logicalButtons.map((o, i) => <LogicalButton offTriggers={o.offTriggers} off={off} key={i}
                                                             title={o.title}
                                                             symbol={o.symbol} insert={insert}/>)}
            </div>

            <button
                onClick={incrementPos}
                title="move to next group"
                className="disabled:bg-stone-200 disabled:hover:scale-100 border border-black px-2 rounded-lg hover:scale-[102%] transition-all active:scale-100">
                <VscDebugStepOver />
            </button>

        </div>

        <div className="flex col-start-3 col-end-12">
            <div className="flex flex-wrap gap-5">
                {Object.entries(filters).map((o, i) => <Select name={o[0]} key={i} off={off} defaultValue={o[0]} options={o[1]}
                                                               insert={insert}/>)}
            </div>

        </div>

    </div>)

}

export default Filter;