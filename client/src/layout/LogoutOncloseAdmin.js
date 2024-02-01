import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { adminLogout } from '../redux/adminSlice';


const LogoutOncloseAdmin = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleLogout = () => {
            dispatch(adminLogout());
        };

        window.addEventListener('beforeunload', handleLogout);

        return () => {
            window.removeEventListener('beforeunload', handleLogout);
        };
    }, [dispatch]);

    return null;
};

export default LogoutOncloseAdmin;
