import React, { Component } from 'react'
import './index.css';

export default class MemeGenerator extends Component {
	constructor() {
		super();
		this.state = {
			topText: "",
			bottomText: "",
			randomImg: "https://i.imgflip.com/9ehk.jpg",
			allMemeImgs: [],
			darkText: false
		}
		this.handleChange = this.handleChange.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleDownLoad = this.handleDownLoad.bind(this)
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
		//generate a random image by using random number
		const randomMemeImg = this.state.allMemeImgs[randomNumber].url;
		//assign randomMemeImg to randomImg
		this.setState({
			randomImg: randomMemeImg
		})
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
					<img src={this.state.randomImg} alt="" />
					<h2 className={this.state.darkText ? 'top dark' : 'top light'}>{this.state.topText}</h2>
					<h2 className={this.state.darkText ? 'bottom dark' : 'bottom light'}>{this.state.bottomText}</h2>
				</div>
				{/* <a href="#" onClick={this.handleDownLoad} download>Click here to download</a> */}
			</div>
		)
	}
}

