import { useEffect, useState } from "react";
import api from "../../api/api";
import  {endpoints}  from "../../api/endpoints";
import AdminDashboard from "../../pages/admin/Dashboard";
import EmployeeDashboard from "../../pages/employee/Dashboard";

export default function Dashboard() {
    const [user, setUser] = useState(null)

    useEffect(() => {
        api.get(endpoints.auth.user)
           .then(res => setUser(res.data))
           .catch(console.error);
    },[])

    if (!user) return <p>Loading dashboard...</p>;

    return (<div>
        <h1>Welcome, {user[0].username}</h1>
        {user[0].role === 'admin' || user[0].role === 'HR' ? (<AdminDashboard/>):
        (<EmployeeDashboard/>) }

    </div>
    );
}
