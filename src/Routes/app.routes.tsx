import React from 'react';
import { Route , Routes} from 'react-router-dom';

import Dashboard from '../Pages/Dashboard';
import List from '../Pages/List';
import Layout from '../Components/Layout';

const App: React.FC =() =>(
    <Layout>
        <Routes>
            <Route path="/" element={<Dashboard/>} />
            <Route path="/list/:type" element={<List/>} />
        </Routes>
    </Layout>

);

export default App;