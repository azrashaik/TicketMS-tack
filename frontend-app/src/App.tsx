import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AllData from './AllData';
import Details from './Details';
import Edit from './Edit';
import PostData from './PostData';
import './App.css';

function App() {
  return (
   <div>
     <React.Fragment>
      <BrowserRouter>
        <Routes>

          <Route path="/" element={<AllData />} />
          <Route path="/Details/:tid" element={<Details/>} />
          <Route path="/PostData" element={<PostData/>} />

          <Route path="/Edit/:tid" element={<Edit/>} />


         
        </Routes>

      </BrowserRouter>

    </React.Fragment>
    
   </div>
  );
}

export default App;
