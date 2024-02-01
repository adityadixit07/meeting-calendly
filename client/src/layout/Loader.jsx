import React from 'react';
import './loader.css'
const Loader = () => {

    return (
        <div className={`flex items-center justify-center h-[60vh] spinner`
        }>
            <div className='w-24 h-24 border-4 border-blue-500'></div>
        </div >
    );
};

export default Loader;
