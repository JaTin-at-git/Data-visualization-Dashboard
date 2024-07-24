import Filter from "../components/Filter.jsx";
import {useEffect, useState} from "react";
import to from "await-to-js";
import {request} from "../../requestMethods.js";
import {useLoaderData} from "react-router-dom";


export async function loadGraphData() {
    const [err, res] = await to(request.post("getGraphData", {arr: ['(', ')']}))
    if (err) throw new Response(err.response.data.message, {status: err.response.status});
    return res.data.data;
}

function Dashboard() {

    //this will store the elements including text nodes and actual select elements that forms the foundation logic
    const [queryArray, setQueryArray] = useState(["(", ")"]);
    const [pos, setPos] = useState(1); //position where current logic is suposed to be inserted
    const [off, setOff] = useState('o'); //helps determine what logics are allowed to be performed next
    const [data, setData] = useState(useLoaderData().graphData) //actual data that will be displayed in visuals

    const incrementPos = () => {
        if (pos + 1 < queryArray.length) setPos(pos + 1);
    }

    //insert a 'logic' in the queryArray
    const insert = (...data) => {
        setPos(pos + 1);
        const newQueryArray = [...queryArray.slice(0, pos), ...data, ...queryArray.slice(pos)];
        setQueryArray(newQueryArray);
    }


    //convert 'logic' to appropriate string representation and request the response from the backend
    const handleSubmit = async () => {
        const arr = [];
        const elements = document.querySelector("#queryConstruct").childNodes;
        for (const element of elements) {
            if (element.tagName === 'SPAN') {
                if (element.childNodes[0].tagName === "SELECT") {
                    const select = element.childNodes[0];
                    arr.push(`"${select.name}": ${Number(select.value) || `"${select.value}"`}`);
                } else arr.push(element.childNodes[0].textContent);
            }
        }

        //here we would need more stuff to handel
        const [err, res] = await to(request.post("getGraphData", {arr}));
        if (!err)
            setData(res.data.data);
    }


    //is used to set off values whenever pos changes
    useEffect(() => {
        let of = 'f';
        switch (queryArray[pos - 1]) {
            case '∪':
                of = 'u';
                break;
            case '∩':
                of = 'i';
                break;
            case '(':
                of = 'o';
                break;
            case '!(':
                of = 'n';
                break;
            case ')':
                of = 'c';
                break;
        }
        setOff(of);
    }, [pos]);


    return (<section className="font-roboto grow min-h-screen flex flex-col items-center bg-gray-50">
        <div className="">
            <div className="bg-white px-4 pb-6 rounded-lg border border-gray-300 shadow-sm ">
                <Filter incrementPos={incrementPos} insert={insert} off={off}/>
                <div className="flex flex-col justify-center md:flex-row gap-2 ">
                    <div id="queryConstruct"
                         className="md:w-[80%] shadow-sm flex flex-wrap items-center
                          align-middle gap-2 p-1 px-2 rounded-lg font-roboto">
                        {...queryArray.slice(0, pos).map((o) => <span>{o}</span>)}
                        <div className="animate-hideShow w-[15px] bg-red-700 h-[1.5px] relative top-3 mx-1"></div>
                        {...queryArray.slice(pos).map((o) => <span>{o}</span>)}
                    </div>
                    <button className="md:w-[10%] btn btn-primary btn-md btn-outline "
                            onClick={handleSubmit}>Submit
                    </button>
                    <div id="result">

                    </div>
                </div>
            </div>


            <div className="flex justify-center flex-wrap gap-5">
                {/*<CountryCountMap key={JSON.stringify(data.countryCounts)} data={data.countryCounts}/>*/}
                {/*<IntensityGraph key={JSON.stringify(data.intensityGroup)} data={data.intensityGroup}/>*/}
                {/*<TopicsGraph key={JSON.stringify(data.topicsDistribution)} data={data.topicsDistribution}/>*/}
                {/*<LikelihoodGraph key={JSON.stringify(data.likelihoodVsIntensity)} data={data.likelihoodVsIntensity}/>*/}
                {/*<RelevanceGraph key={JSON.stringify(data.relevance)} data={data.relevance}/>*/}
                {/*<YearsGraph key={JSON.stringify(data.yearlyCount)} data={data.yearlyCount}/>*/}
            </div>
        </div>
    </section>)
}

export default Dashboard;