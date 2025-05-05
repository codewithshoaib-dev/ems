import { useEffect, useState } from "react";
import api from "../../api/api";
import { endpoints } from "../../api/endpoints";

export default function Leave(){
    const [form, setForm] = useState({reason:'', start:'', end:'', });
    const [leaves, setLeaves] = useState([])

    const fetchleaves = () => {
        api.get(endpoints.leave.status).then(res => setLeaves(res.data));
    };
    const handleSubmit = async e => {
        e.preventDefault();
        await api.post(endpoints.leave.request, form);
        fetchleaves();
    };
    useEffect(() => {
        fetchleaves();
    }, []);

    return (
        <div>
            <h2>Request Leave</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Reason"
                       onChange={e => setForm({...form, reason: e.target.value})} />
                <input type="date" placeholder="Starting Date" onChange={e => setForm({...form, start: e.target.value})} />
                <input type="date" placeholder="Ending Date" onChange={e => setForm({...form, end: e.target.value})} />
                <button type="submit">Submit</button>
            </form>

            <h3>Your Requests</h3>
            {leaves.map((l, i) => (
                <div key={i}>{l.start} - {l.end} - {l.status}</div>
            ))}
        </div>
    );
}