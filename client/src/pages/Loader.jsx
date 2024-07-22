import {useNavigation} from "react-router-dom";

function Loader() {
    const navigation = useNavigation();

    return <div>
        {navigation.state === "loading" ? (
            <progress
                className="progress progress-primary absolute h-[5px]"
                style={{ "--progress-color": "#f43f5e" }}
            ></progress>
        ) : (
            ""
        )}
    </div>
}

export default Loader;