import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import './App.css';
import PostData from './PostData'
import Edit from './Edit';
import AllData from './AllData';
import Details from './Details'


function App() {
  return (
    <div>

      <React.Fragment>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<AllData />} />
          <Route path="/PostData" element={<PostData/>} />
          <Route path="/Edit/:tid" element={<Edit/>} />
          <Route path="/Details/:tid" element={<Details/>} />

        </Routes>

      </BrowserRouter>

    </React.Fragment>
    </div>
  
    
  );

 
}

export default App;
