import React from 'react';

import { Routes, Route } from 'react-router-dom';

import Signin from '../Pages/Signin';

const AuthRoutes: React.FC = () => (
    <Routes>
        <Route path='/' element={<Signin/>} />
    </Routes>
);

export default AuthRoutes;