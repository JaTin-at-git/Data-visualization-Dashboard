import Filter from "../components/Filter.jsx";
import {useEffect, useState} from "react";
import to from "await-to-js";
import {request} from "../../requestMethods.js";

function Dashboard() {

    const [queryArray, setQueryArray] = useState(["(", ")"]);
    const [pos, setPos] = useState(1);
    const [off, setOff] = useState('o');

    const incrementPos = () => {
        if (pos + 1 < queryArray.length) setPos(pos + 1);
    }

    const insert = (...data) => {
        setPos(pos + 1);
        const newQueryArray = [...queryArray.slice(0, pos), ...data, ...queryArray.slice(pos)];
        setQueryArray(newQueryArray);
    }


    const handleSubmit = async () => {
        const arr = [];
        const elements = document.querySelector("#queryConstruct").childNodes;
        for (const element of elements) {
            if (element.tagName === 'SPAN') {
                if (element.childNodes[0].tagName === "SELECT") {
                    const select = element.childNodes[0];
                    arr.push(`"${select.name}": "${select.value}"`);
                } else arr.push(element.childNodes[0].textContent);

            }
        }
        console.log(arr);

        //here we would need more stuff to handel
        const [err, res] = await to(request.post("getFilteredResult", {arr}));
        if (err) console.log(err)
        else console.log(res);
    }


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

    return (<section className="bg-purple-50 grow min-h-screen flex flex-col items-center">
        <div className="max-w-[1000px] bg-blue-100">

            <div>
                <Filter incrementPos={incrementPos} insert={insert} off={off}/>
            </div>

            <div className="p-3">
                <h3 className="underline">Query:</h3>
                <div id="queryConstruct"
                     className="flex flex-wrap gap-2 p-1 px-2 bg-pink-300 rounded-lg text-lg font-roboto">
                    {...queryArray.slice(0, pos).map((o) => <span>{o}</span>)}
                    <div className="animate-hideShow w-[15px] bg-red-700 h-[1.5px] relative top-5 mx-1"></div>
                    {...queryArray.slice(pos).map((o) => <span>{o}</span>)}
                </div>
                <button onClick={handleSubmit}>Submit</button>
                <div id="result">

                </div>
            </div>

            <div className="flex justify-center flex-wrap gap-5">
                <div className="h-[320px] w-[320px] bg-pink-300 "></div>
                <div className="h-[320px] w-[320px] bg-pink-300 "></div>
                <div className="h-[320px] w-[320px] bg-pink-300 "></div>
            </div>
        </div>
    </section>)
}

export default Dashboard;