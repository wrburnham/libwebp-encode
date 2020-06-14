import React from 'react';
import WebPConvertForm from './WebPConvertForm';
import 'typeface-roboto';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

function App() {

  return (
    <div className="App">
      <WebPConvertForm/>
      <ToastContainer autoClose={2500}/>
    </div>
  );
}

export default App;
