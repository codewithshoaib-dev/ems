import { Outlet } from "react-router-dom";
import Header from '../components/Header';

export default function EmployeeLayout(){
    return <div className="admin-layout">
        
        <div className="main-content">
            <Header />
            <Outlet />
        </div>
    </div>
}