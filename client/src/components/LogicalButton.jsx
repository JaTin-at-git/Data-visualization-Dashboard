function LogicalButton({title, symbol, insert, offTriggers, off}) {

    const handleClick = () => {
        insert(...symbol.split(" ").map(c => c));
    }


    return (<button disabled={offTriggers.includes(off)} onClick={handleClick} title={title}
                    className="text-nowrap disabled:bg-stone-200 disabled:hover:scale-100 border border-black px-2 rounded-lg hover:scale-[102%] transition-all active:scale-100">
        {symbol}
    </button>)

}

export default LogicalButton;