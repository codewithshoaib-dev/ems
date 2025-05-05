import { useEffect, useState } from "react";
import api from "../../api/api";
import { endpoints } from "../../api/endpoints";

export default function Profile() {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        api.get(endpoints.user)
            .then(res => setProfile(res.data))
            .catch(console.error);
    }, []);
    console.log(profile)

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            {profile ? (
                <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md w-full">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">User Profile</h2>
                    <div className="space-y-3 text-gray-700">
                        <div>
                            <span className="font-semibold">Username:</span> {profile[0].username}
                        </div>
                        <div>
                            <span className="font-semibold">Email:</span> {profile.email}
                        </div>
                        <div>
                            <span className="font-semibold">Role:</span> {profile.role}
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-center text-gray-500 text-lg">Loading Profile...</p>
            )}
        </div>
    );
}
