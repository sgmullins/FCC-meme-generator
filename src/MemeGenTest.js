import React, { Component } from 'react'
import './index.css';

export default class MemeGenTest extends Component {
	constructor() {
		super();
		this.state = {
			topText: "",
			bottomText: "",
			randomImg: "http://i.imgflip.com/1bij.jpg",
			allMemeImgs: [],
			darkText: false,
			isTopDragging: false,
			isBottomDragging: false,
			topY: "10%",
			topX: "50%",
			bottomX: "50%",
			bottomY: "90%",

		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.getStateObj = this.getStateObj.bind(this)
		this.handleMouseDown = this.handleMouseDown.bind(this)
		this.handleMouseMove = this.handleMouseMove.bind(this)
		this.handleMouseUp = this.handleMouseUp.bind(this)
	}
	componentDidMount() {
		fetch("https://api.imgflip.com/get_memes")
			.then(response => response.json())
			.then(response => {
				// const { memes } = response.data
				// console.log(response.data)
				this.setState({
					allMemeImgs: response.data.memes
				})
			})
	}

	handleChange(e) {
		const { name, value, type, checked } = e.target
		type === "checkbox" ?
			this.setState({ [name]: checked }) :
			this.setState({ [name]: value })
	}
	handleDownLoad(linkElement) {
		const imageToDownload = this.state.randomImg.value;
		linkElement.href = imageToDownload
	}

	handleSubmit(e) {
		e.preventDefault()
		//generate a random number to use as an index for the array
		const randomNumber = Math.floor(Math.random() * this.state.allMemeImgs.length);
		//generate a random image by using randomnumber
		const randomMemeImg = this.state.allMemeImgs[randomNumber].url;
		//assign randomMemeImg to randomImg
		this.setState({
			randomImg: randomMemeImg
		})
	}
	////Text draggining options
	getStateObj(e, type) {
		let rect = this.imageRef.getBoundingClientRect();
		const xOffset = e.clientX - rect.left;
		const yOffset = e.clientY - rect.top;
		let stateObj = {};
		if (type === "bottom") {
			stateObj = {
				isBottomDragging: true,
				isTopDragging: false,
				bottomX: `${xOffset}px`,
				bottomY: `${yOffset}px`
			}
		} else if (type === "top") {
			stateObj = {
				isTopDragging: true,
				isBottomDragging: false,
				topX: `${xOffset}px`,
				topY: `${yOffset}px`
			}
		}
		return stateObj;
	}

	handleMouseDown(e, type) {
		const stateObj = this.getStateObj(e, type);
		document.addEventListener('mousemove', (event) => this.handleMouseMove(event, type));
		this.setState({
			...stateObj
		})
	}

	handleMouseMove(e, type) {
		if (this.state.isTopDragging || this.state.isBottomDragging) {
			let stateObj = {};
			if (type === "bottom" && this.state.isBottomDragging) {
				stateObj = this.getStateObj(e, type);
			} else if (type === "top" && this.state.isTopDragging) {
				stateObj = this.getStateObj(e, type);
			}
			this.setState({
				...stateObj
			});
		}
	};

	handleMouseUp(event) {
		document.removeEventListener('mousemove', this.handleMouseMove);
		this.setState({
			isTopDragging: false,
			isBottomDragging: false
		});
	}


	render() {
		return (
			<div>
				<form className="meme-form" onSubmit={this.handleSubmit}>
					<input
						type="text"
						name="topText"
						value={this.state.topText}
						onChange={this.handleChange}
					/>
					<input
						type="text"
						name="bottomText"
						value={this.state.bottomText}
						onChange={this.handleChange}
					/>
					<label>
						<input
							type="checkbox"
							name="darkText"
							onChange={this.handleChange}
							checked={this.state.darkText}
						/> Dark Text
					</label>
					<button>Generate Meme</button>
				</form>
				<div className="meme">
					<img src={this.state.randomImg} ref={el => { this.imageRef = el }} alt="" />
					<text
						onMouseDown={event => this.handleMouseDown(event, 'top')}
						onMouseUp={event => this.handleMouseUp(event, 'top')}>
						{this.state.topText}
					</text>
					<h2 className={this.state.darkText ? 'bottom dark' : 'bottom light'}>{this.state.bottomText}</h2>
				</div>
				<a href="#" onClick={this.handleDownLoad} download>Click here to download</a>
			</div>
		)
	}
}

