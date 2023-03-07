import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from './Components/Layout';
import Home from './Pages/Home';
import About from './Pages/About';
import Invent from './Pages/Invent';
import { FourOhFour } from "./Pages/404";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="invent" element={<Invent />} />
          <Route path="*" element={<FourOhFour />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
