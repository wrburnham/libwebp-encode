import React from 'react';
import WebPConvertForm from './WebPConvertForm';
import 'typeface-roboto';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

// ciao
function App() {
/*
  loadImage('test/resources/grapes1.jpg')
    .then(image => encode(image, 100, function(result) {
      canvasConverted.src = URL.createObjectURL(new Blob([result], {type: "image/webp"}));
*/
/*
async function loadImage(src) {
  // Load image
  const imgBlob = await fetch(src).then(resp => resp.blob());
  const img = await createImageBitmap(imgBlob);
  // Make canvas same size as image
  const canvas = this.refs.canvasOriginal;
  canvas.width = img.width;
  canvas.height = img.height;
  // Draw image onto canvas
  const ctx = canvas.getContext('2d');
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, img.width, img.height);
}
*/


  return (
    <div className="App">
      <WebPConvertForm/>
      <ToastContainer autoClose={2500}/>
    </div>
  );
}

export default App;
