import React, {createContext, useState, useEffect} from 'react';
import api   from './api/api'

const AuthContext = createContext();

const AuthProvider = ({children}) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await api.get('api/user/');
                setUser(response.data);
                setIsAuthenticated(true);
            } catch (error) {
                setIsAuthenticated(false);
            }finally {
                setLoading(false);
            }
        };
        checkAuth();
        
    }, []);

    const login = async (username , password) => {
        try {
            const response = await api.post('auth/jwt/create/',{username, password});
            console.log(response.data)
            const token = response.data.access
            localStorage.setItem('AccessToken', token);
            const refresh = response.data.refresh
            localStorage.setItem('RefreshToken', refresh);

            setIsAuthenticated(true);
            setUser(response.data.user);
         }catch (error) {
            console.error(error);
         }

    };
    const logout = () => {
        setAccessToken('')
        setUser(null)
        setIsAuthenticated(false);
    };
    return ( <AuthContext.Provider value={{user, isAuthenticated, login , logout, loading}}>
                 {children}
             </AuthContext.Provider>
    );
}
export {AuthContext, AuthProvider};