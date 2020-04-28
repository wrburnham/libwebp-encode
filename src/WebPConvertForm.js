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
  }

  componentDidMount() {
    this.loadWasm();
  }

  loadWasm() {
  	const path = process.env.PUBLIC_URL + '/libwebp.wasm';
  	const importObject = {
  		env: {
  		  memoryBase: 0,
  		  tableBase: 0,
  		  memory: new WebAssembly.Memory({initial: 256, maximum: 1024}),
          table: new WebAssembly.Table({initial: 256, element: 'anyfunc'}),
  		  __assert_fail: function() {
  			console.log("__assert_fail");
  		  },
  		  emscripten_resize_heap: function() {
  		  	console.log("emscripten_resize_heap");
  		  },
  		  emscripten_memcpy_big: function() {
  		  	console.log("emscripten_memcpy_big");
  		  },
  		  setTempRet0: function() {
  		  	console.log("setTempRet0");
  		  }
  		}
  	};
  	WebAssembly.instantiateStreaming(fetch(path), importObject)
  	.then(obj => {
  	  this.setState({libwebp: obj});
  	  console.log(obj);
  	});
  }

  handleAccepted(files) {
  	if (files.length === 0) {
      toast.error("No file specified.");
  	} else if (files.length !== 1) {
      toast.error("Cannot process multiple files.");
  	} else {
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        console.log(binaryStr);
      }
      const file = files[0];
      reader.readAsArrayBuffer(file);
      toast.info("File " + file.name + " was successfully read. Click \"Convert\" to get a WebP image.");
  	}
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
          <Button color="primary" variant="contained" disabled>
            <p>Convert</p>
          </Button>
        </Box>
      </Container>
    );
  }
}

export default WebPConvertForm;