import {useState} from "react";

function Select({defaultValue, options, type, insert, off, name, i}) {

    const [value, setValue] = useState(defaultValue);

    const handleChange = (e) => {
        if (type === "query") setValue(e.target.value); else {
            insert(<Select name={name} type="query" options={options} defaultValue={e.target.value}/>)
        }
    }

    return (<select name={name} disabled={['c', 'f'].includes(off)} onChange={handleChange} value={value}
                    className={`p-1 line md:w-[150px] w-[120px] select overflow-visible select-bordered select-sm leading-none ${type==='query'?"w-[80px] md:w-[80px]":""}`}>
        <option value={defaultValue}>{defaultValue}</option>
        {options.map((op, i) => {
            return <option key={i} value={op}>{op}</option>
        })}
    </select>)
}

export default Select;