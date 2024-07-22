import {useState} from "react";

function Select({defaultValue, options, type, insert, off, name}) {

    const [value, setValue] = useState(defaultValue);

    const handleChange = (e) => {
        if (type === "query") setValue(e.target.value);
        else {
            insert(<Select name={name} type="query" options={options} defaultValue={e.target.value}/>)
        }
    }

    return (<select name={name} disabled={['c', 'f'].includes(off)} onChange={handleChange} value={value}
                    className="w-[150px] rounded-lg bg-pink-50 p-1">
        <option value={defaultValue}>{defaultValue}</option>
        {options.map((op, i) => {
            return <option key={i} value={op}>{op}</option>
        })}
    </select>)
}

export default Select;