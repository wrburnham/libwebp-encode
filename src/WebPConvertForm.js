import React from 'react';
import Canvas from './Canvas.js';
import Dropzone from 'react-dropzone';
import Container from '@material-ui/core/Container';
import Slider from '@material-ui/core/Slider';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import { toast } from 'react-toastify';

class WebPConvertForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      inputImage: null
    };
    this.handleConvert = this.handleConvert.bind(this);
  }

  handleAccepted(files) {
  	if (files.length === 0) {
      toast.error("No file specified.");
  	} else if (files.length !== 1) {
      toast.error("Cannot process multiple files.");
  	} else {
      const file = files[0];
      // todo validate file : is it a valid image?
      this.setState({inputImage: file});
      toast.info("File " + file.name + " was successfully read. Click \"Convert\" to get a WebP image.");
  	}
  }

  handleConvert() {
  	const url = URL.createObjectURL(this.state.inputImage);
  	const img = new Image();
  	img.onload = () => {
  	  URL.revokeObjectURL(url);
  	  console.log(url);
  	  const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
  	  context.drawImage(img, 0, 0);
  	  const image = context.getImageData(0, 0, img.width, img.height);
  	  console.log(image);
      this.setState({inputImage: null});
  	  toast.info("Converted");
  	}
  	img.src = url;
  }

  encode(image, quality, callback) {
    window.webp.then(function(Module) {
      const api = {
        version: Module.cwrap('version', 'number', []),
        create_buffer: Module.cwrap('create_buffer', 'number', ['number', 'number']),
        destroy_buffer: Module.cwrap('destroy_buffer', '', ['number']),
        encode: Module.cwrap('encode', '', ['number', 'number', 'number', 'number']),
        get_result_pointer: Module.cwrap('get_result_pointer', 'number', ''),
        get_result_size: Module.cwrap('get_result_size', 'number', ''),
        free_result: Module.cwrap('free_result', '', ['number']),
      };

      const p = api.create_buffer(image.width, image.height);
      
      Module.HEAP8.set(image.data, p);
      
      api.encode(p, image.width, image.height, quality);
      
      const resultPointer = api.get_result_pointer();
      const resultSize = api.get_result_size();
      const resultView = new Uint8Array(Module.HEAP8.buffer, resultPointer, resultSize);
      const result = new Uint8Array(resultView);
      
      api.free_result(resultPointer);
      api.destroy_buffer(p);

      callback(result);
	});
  }

  valuetext(value) {
    return `${value}%`;
  }

  render() {
  	const dropzoneProps = {
  	  bgcolor: 'background.default',
  	  color: 'primary.light',
  	  style: {
  	    fontWeight: 'bold', 
  	    borderWidth: '2px', 
  	    borderStyle: 'dashed',
  	    textAlign: 'center',
  	    cursor: 'pointer',
  	    marginBottom: '1rem'},
  	};
  	const marginProps = {
      style: {
      	marginBottom: '1rem',
      	marginTop: '2rem'
      }
  	};
  	const dropzoneTextProps = {
      style: {
      	paddingBottom: '1rem',
      	paddingTop: '1rem'
      }
  	};
    return (
      <Container>
        <h1>WebP Encoder</h1>
        <p>Convert an image to Google's WebP format in your web browser. No server side processing is done (all data stays on the client).</p>
        <Box {...marginProps}>
          <Dropzone onDrop={files => this.handleAccepted(files)}>
            {({getRootProps, getInputProps}) => (
              <section>
                <div {...getRootProps()}>
                  <input {...getInputProps()} />
                  <Box {...dropzoneProps}>
                    <p {...dropzoneTextProps}>Drop an image here or click to select.</p>
                  </Box>
                </div>
              </section>
            )}
          </Dropzone>
        </Box>
        <Box {...marginProps}>
          <Typography id="webp-encode-quality" gutterBottom>
            Quality (%)
          </Typography>
          <Slider
            defaultValue={80}
            getAriaValueText={this.valuetext}
            aria-labelledby="webp-encode-quality"
            step={1}
            min={0}
            max={100}
            valueLabelDisplay="auto"
          />
        </Box>
        <Box {...marginProps}>
          <Button color="primary" variant="contained" disabled={this.state.inputImage===null} onClick={this.handleConvert}>
            <p>Convert</p>
          </Button>
        </Box>
      </Container>
    );
  }
}

export default WebPConvertForm;