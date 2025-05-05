import { useState } from "react";
import api from "../../api/api";
import { endpoints } from "../../api/endpoints";

export default function ManualAttendance(){
    const [datetime, setDatetime] = useState('');

    const handleSubmit = async () => {
        await api.post(endpoints.attendance.manual, {datetime} );
        alert("Logged successfully");
    };

    return ( <div>
        <h2>Log Attendance</h2>
        <input type="datetime-local" onChange={e => setDatetime(e.target.value)} />
        <button onClick={handleSubmit}>Submit</button>
    </div>
    );
}