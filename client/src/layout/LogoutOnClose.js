import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutClient } from '../redux/clientSlice';

const LogoutOnClose = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        const handleLogout = () => {
            dispatch(logoutClient());
        };

        window.addEventListener('beforeunload', handleLogout);

        return () => {
            window.removeEventListener('beforeunload', handleLogout);
        };
    }, [dispatch]);

    return null;
};

export default LogoutOnClose;
