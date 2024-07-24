function LogicalButton({title, symbol, insert, offTriggers, off}) {

    const handleClick = () => {
        insert(...symbol.split(" ").map(c => c));
    }


    return (<button disabled={offTriggers.includes(off)} onClick={handleClick} title={title}
                    className="w-10 h-10 border-2 border-black disabled:text-gray-500 disabled:border-gray-300 shadow-sm  text-nowrap disabled:bg-neutral-200
                    disabled:hover:scale-100 text-gray-600 px-2 rounded-lg hover:scale-[102%] transition-all active:scale-100">
        {symbol}
    </button>)

}

export default LogicalButton;