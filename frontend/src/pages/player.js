// React Modules
import React from "react";
// Bootstrap Module
import { Col, Container, Row } from "react-bootstrap";
//Router Module
import { Link } from "react-router-dom";
//stylesheet
import './player.css';

class Player extends React.Component {
    constructor() {
        super();
        this.videodata = {};
        this.State = {
            slidervalue: 0
        };
    }
    reset = (id1,id2) => {
        this.video = document.getElementById(id1);
        this.audio = document.getElementById(id2);
        this.video.preload = "1%";
        this.audio.preload = "1%";
        this.video.currentTime = 0;
        this.audio.currentTime = 0;
        this.updateval();
        this.video.pause();
    }
    retval = () => {
        try {
            return this.state.slidervalue;
        }
        catch (TypeError) {
            return 0;
        }
    }
    changetime = () => {
        var value = document.getElementById("mySlider").value;
        this.video.currentTime = (value*this.video.duration)/100;
        this.audio.currentTime = (value*this.audio.duration)/100;
        this.video.pause();
        this.updateval();
    }
    updateval = () => {
        try {
            var value = document.getElementById("mySlider").value;
            this.setState({ slidervalue: value });
            var progress = document.getElementById("slidereffect");
            progress.style.width = (this.step * value).toString()+"px";
        }
        catch (TypeError) {
            console.log("state not initialized!");
        }
    }
    plus30 = () => {
        if( this.video.currentTime+30 >= this.video.duration  ){
            this.video.currentTime = this.video.duration;
            this.audio.currentTime = this.audio.duration;
        }
        else{
            this.video.currentTime += 30;
            this.audio.currentTime += 30;
        }
        this.updateval();
    }
    minus30 = () => {
        if( this.video.currentTime-30 <= 0  ){
            this.video.currentTime = 0;
            this.audio.currentTime = 0;
        }
        else{
            this.video.currentTime -= 30;
            this.audio.currentTime -= 30;
        }
        this.updateval();
    }
    toggle = () => {
        var play = document.getElementById("playpause");
        if( this.playstate === 1 ){
            this.playstate = 0;
            play.src = require("../icons/play.png");
            this.video.pause();
        }
        else {
            this.playstate = 1;
            play.src = require("../icons/pause.png");
            this.video.play();
        }
    }
    render() {
        return (
            <div className="Wrapper">
                <Container fluid>
                    <Row className="info">
                        <Col xs={1} className="logo-container">
                            <Link to={"/"} >
                                <img className="logo" src={require("../icons/backarrow.png")} />
                            </Link>
                        </Col>
                        <Col xs={10} className="title">
                            {sessionStorage.getItem("title")}
                        </Col>
                        <Col sx={1} className="logo-container">
                            <Link to="/settings" >
                                <img src={require("../icons/settings.png")} className="logo" />
                            </Link>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <div className="videocontainer">
                                <video id="videoplayer" className="videoplayer">
                                    <source id="source" src={sessionStorage.getItem('path')} type={()=>{
                                        return "video/"+sessionStorage.getItem('type');
                                    }} />
                                </video>
                                <video id="audioplayer" className="audioplayer" style={{display:"none"}}>
                                    <source id="asource" src={sessionStorage.getItem('pathaudio')} type="video/webm" />
                                </video>
                            </div>
                        </Col>
                    </Row>
                    <Row className="controls">
                        <Col xs={4} sm={3} md={2}>
                            <button className="clearbtn" onClick={this.minus30}>
                                <img className="logo" src={require("../icons/rewind.png")} />
                            </button>
                            <button className="clearbtn" onClick={this.toggle}>
                                <img className="logo" id="playpause" src={require("../icons/pause.png")} />
                            </button>
                            <button className="clearbtn" onClick={this.plus30}>
                                <img className="logo" src={require("../icons/forward.png")} />
                            </button>
                        </Col>
                        <Col xs={7} sm={8} md={9}>
                            <Row>
                                <Col xs={12}>
                                    <div className="slidereffect" id="slidereffect"></div>
                                    <div class="slidecontainer" id="slidercontainer">
                                        <input type="range" min="0" max="100" class="slider" id="mySlider" onChange={this.changetime} />
                                    </div>
                                </Col>
                            </Row>
                        </Col>
                        <Col xs={1}>
                            <button className="clearbtn">
                                <img className="logo" src={require("../icons/setting.png")} />
                            </button>
                        </Col>
                    </Row>

                </Container>
                <Container fluid >

                </Container>
            </div>
        );
    }
    componentDidMount() {
        this.maxsize = 0;
        this.playstate = 1;
        new ResizeObserver( (entries) => {
            entries.forEach(entry => {
                this.maxsize = entry.contentRect.width;
                this.setstep();
            });
        }).observe(document.getElementById('slidercontainer'));
        document.getElementById("mySlider").value = 0;
        this.video = document.getElementById("videoplayer");
        this.audio = document.getElementById('audioplayer');
        this.audiosource = document.getElementById('asource').src;
        this.video.ontimeupdate = () => {
            if(this.video.currentTime/this.video.duration !== NaN){
                document.getElementById("mySlider").value = (this.video.currentTime/this.video.duration)*100;
                this.updateval();
                if( this.video.currentTime === this.video.duration ){
                    this.audio.currentTime = this.audio.duration;
                    this.toggle();
                }
            }
        }
        this.video.addEventListener("pause", () => {
            if(this.audiosource != ""){
                this.audio.pause();
            }
        });
        this.video.addEventListener("play", () => {
            if(this.audiosource != ""){
                this.audio.play();
            }
        });
        this.video.oncanplay = () => {
            if(this.playstate == 1){
                this.video.play();
                if(this.audiosource != ""){
                    this.audio.play();
                }
            }
        }
        this.audio.ontimeupdate = () => {
            if( ((this.audio.currentTime-this.video.currentTime)*100) / this.video.currentTime > 5 ){
                while(((this.audio.currentTime-this.video.currentTime)*100) / this.video.currentTime > 5){
                    this.audio.currentTime -= 0.01;
                }
                this.video.pause();
            }
        }
        if(sessionStorage.getItem('remote') === '0'){
            this.video.play();
        }
        else if( sessionStorage.getItem('remote') !== '0' ){
            if(sessionStorage.getItem('remote') === '1' ){
                this.videodata = JSON.parse(sessionStorage.getItem('videodata'));
                sessionStorage.setItem('path',this.videodata['1080p'][0]);
                sessionStorage.setItem('pathaudio',this.videodata['1080p'][1]);
                this.reset('videoplayer','audioplayer');
            }
            else if( sessionStorage.getItem('remote') === '2' ){

            }
        }
    }
    setstep(){
        this.step = this.maxsize/100;
        this.updateval();
    }
}
// Export Player Module
export default Player;
