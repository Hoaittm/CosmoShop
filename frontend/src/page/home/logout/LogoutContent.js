import { useNavigate } from "react-router-dom";
import UserContext from "../../../context/UserContext";
import { useContext, useEffect } from "react";

const LogoutContent =()=>{
    const { setUser} = useContext(UserContext);
    const navigate = useNavigate();
    useEffect(() => {
        setUser("");
        navigate("/")
    })
    return (
        <div>
            <h1>Logout</h1>
        </div>
    )
}
export default LogoutContent;