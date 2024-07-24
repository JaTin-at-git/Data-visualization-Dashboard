import to from "await-to-js";
import {request} from "../../requestMethods.js";
import {useLoaderData} from "react-router-dom";
import Select from "./Select.jsx";
import {VscDebugStepOver} from "react-icons/vsc";
import LogicalButton from "./LogicalButton.jsx";

export async function getFilters() {
    const [err, res] = await to(request.get("/getFilters"));
    if (err) throw new Response(err.response.data.message, {status: err.response.status});
    return res;
}


function Filter({insert, off, incrementPos}) {

    const filters = useLoaderData().filters.data.data.filters;

    const logicalButtons = [{
        title: "union", symbol: "∪", offTriggers: ['u', 'i', 'o', 'n']
    }, {title: "intersection", symbol: "∩", offTriggers: ['u', 'i', 'o', 'n']}, {
        title: "create group", symbol: "( )", offTriggers: ['c', 'f']
    }, {
        title: "logical not", symbol: "!( )", offTriggers: ['c', 'f']
    }];

    return (<div className=" flex flex-wrap m-3 ">

        <div className="w-ful w-full md:w-[30%] lg:w-[20%] mb-4 flex md:items-center md:justify-center md:align-middle">
            <div className="pr-5">
                <p className="pb-5 text-xl text-gray-600">Logical operations</p>
                <div className="grid grid-cols-3 gap-3">
                    {logicalButtons.map((o, i) => <LogicalButton offTriggers={o.offTriggers} off={off} key={i}
                                                                 title={o.title}
                                                                 symbol={o.symbol} insert={insert}/>)}
                    <button
                        onClick={incrementPos}
                        title="move to next group"
                        className=" disabled:hover:scale-100 text-gray-600 px-2 rounded-lg hover:scale-[102%] transition-all active:scale-100 flex items-center justify-center col-start-3 row-start-1 row-span-2  border border-gray-200 shadow-sm">
                        <VscDebugStepOver/>
                    </button>
                </div>
            </div>
            ̥


        </div>

        <div className="w-full md:w-[70%] lg:w-[80%]">
            <p className="pb-3 text-xl text-gray-600">Variables</p>
            <div className="flex flex-wrap gap-3">
                {Object.entries(filters).map((o, i) => <Select i={i} name={o[0]} key={i} off={off} defaultValue={o[0]}
                                                               options={o[1]}
                                                               insert={insert}/>)}
            </div>

        </div>

    </div>)

}

export default Filter;