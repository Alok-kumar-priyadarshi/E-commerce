import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function ProtectedRoute({children , allowedRole}){
    const {isAuthenticated , role} = useAuth()

    if(!isAuthenticated){
        alert("You need to login to access this page")
        return <Navigate to="/login" />
    }

    if(allowedRole && role !== allowedRole){
        alert("You don't have permission to access this page")
        return <Navigate to="/login" />
    }

    return children
}