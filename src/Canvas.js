import React from 'react';
import './Canvas.css';

class Canvas extends React.Component {
	constructor(props) {
		super(props);
		this.imgUrl = props.imgUrl;
	}

	componentDidMount() {
		const canvas = this.canvas;
		this.img.onload = function() {
  			URL.revokeObjectURL(this.src);
  			canvas.width = this.width;
  			canvas.height = this.height;
  			canvas.getContext("2d")
  				.drawImage(this, 0, 0);
  		}
  		if (this.imgUrl !== undefined && this.imgUrl !== null && this.imgUrl.trim !== "") {	  	
	  		this.img.src = this.imgUrl;
		}
	}

	render() {
		return (
			<div>
				<canvas ref={(canvas) => this.canvas = canvas}/>
				<img ref={(img) => this.img = img} className="hidden" alt="canvas backing"/>
			</div>
		)
	}
}

export default Canvas;