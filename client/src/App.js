// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import CgpaCalculator from './components/Home'; 
import AdminDashboard from './components/AdminDasboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/home" element={<CgpaCalculator />} />
                <Route path="/admin" element={<AdminDashboard />}/>
            </Routes>
        </Router>
    );
}

export default App;
