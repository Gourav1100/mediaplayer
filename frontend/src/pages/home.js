// React Modules
import React from 'react';
// Bootstrap Modules
import { Container, Row, Col } from 'react-bootstrap';
// import router module
import { useNavigate } from "react-router-dom";
// User Modules
import Cheader from '../header/cheader';
import Cfooter from "../footer/cfooter";
// stylesheet
import './home.css';

class Homepage extends React.Component {
    constructor() {
        super();
        sessionStorage.clear();
        sessionStorage.setItem('pathaudio',"");
    }
    youtube_parser = (id) => {
        var url = document.getElementById(id).value;
        var regExp = /youtu(?:.*\/v\/|.*v\=|\.be\/)([A-Za-z0-9_\-]{11})/;
        var match = url.match(regExp);
        return ( match !== null && match[1].length === 11 ) ? match[1] : false;
    }
    setyoutubeenv = (id) => {
        var title = this.youtubedetails.channelTitle + " : " + this.youtubedetails.title ;
        var description = this.youtubedetails.description;
        sessionStorage.setItem('title',title);
        sessionStorage.setItem('description',description);
        sessionStorage.setItem("type",'mp4');
        sessionStorage.setItem("remote",1);
        sessionStorage.setItem('path',document.getElementById(id));
        sessionStorage.setItem('id',this.youtube_parser('url'));
        const xhttp = new XMLHttpRequest();
        xhttp.addEventListener('load', () => {
            console.log(xhttp.readyState);
            if ( xhttp.readyState === 4 && xhttp.status === 200 ){
                sessionStorage.setItem('videodata',xhttp.responseText);
                console.log("accepted, now loading");
                // redirect
                this.props.navigate('/player');
            }
        });
        xhttp.open('GET','http://localhost:6900/youtube?v='+sessionStorage.getItem('id'));
        xhttp.send();
    }
    parse_url = () => {
        var youtube_flag = this.youtube_parser('url');
        if( youtube_flag !== false ){
            var youtube_vid = youtube_flag;
            var xhttp = new XMLHttpRequest();
            xhttp.addEventListener('load', () => {
                if( xhttp.responseText !== "404" ){
                    this.youtubedetails = JSON.parse(xhttp.responseText).items[0].snippet;
                    console.log("loading...");
                    this.setyoutubeenv('url');
                }
                else{
                    console.log("Internal Server Error");
                }
            });
            xhttp.open('GET','https://YoutubeDetailReporter.gauravbidhuri.repl.co/id='+youtube_vid);
            xhttp.send();
        }
        else if( this.magnetparse('url') ){
            // url contains torrent magnet link

        }
        else{
            // other type of url
        }
    }
    magnetparse = (id) => {
        let magnet = document.getElementById(id).value;
        var regex = /magnet:([?&]([a-z]{2}=([a-zA-Z:0-9.%-])*))*/gi;
        return ( ( magnet.match( regex ) !== null && magnet.match( regex ).length === 1 ) ? true : false );
    }
    urlparse = (id) => {
        let url = document.getElementById(id).value;
        var regex = /((([a-zA-Z0-9])*)[.]){0,1}([A-Za-z0-9]*)[.]([a-z]+)/gi;
        return ( ( url.match(regex) !== null && url.match(regex).length === 1 ) ? true : false );
    }
    toggledisable = (id1,id2) => {
        var from = document.getElementById(id2);
        var element = document.getElementById(id1);
        if( from != null && element !== null &&  from.value !== '' ){
            element.disabled = false;
        }
        else if(element !== null){
            element.disabled = true;
        }
    }
    handledrop = (evnt) => {
        var data = evnt.dataTransfer;
        var files = data.files;
        document.getElementById('file').files = files;
        this.playfile();
    }
    disable = (id) => {
        document.getElementById(id).disabled = true;
    }
    playfile = () => {
        // extract Data to use in DOM
        var file = document.getElementById('file').files[0].path;
        var type = "";
        var filename = document.getElementById('file').files[0].name;
        for( var i = 0; i < file.length; i++ ){
            type += file[i];
            if( file[i] === '.' ){
                type = "";
            }
        }
        // set session vairables
        sessionStorage.setItem("path","file://"+file);
        sessionStorage.setItem("title",filename);
        sessionStorage.setItem("type",type);
        sessionStorage.setItem("remote",0);
        // redirect
        this.props.navigate('/player');
    }
    render(){
        return (
            <>
                <Cheader />
                <div className='wrapper' id="dropcontainer">
                    <Container fluid>
                        <div className="formbody">
                            <form>
                                <div id='upload'>
                                    <div className='uploadinfo'>
                                        Choose File / Drop File
                                    </div>
                                    <label for={'file'} className='uploadbtn'>
                                        <img src={require('../icons/upload.png')} className='uploadfile' />
                                    </label>
                                    <input type={'file'} id="file" className='file' onChange={this.playfile} />
                                </div>
                            </form>
                        </div>
                        <div className="formbody">
                            <form id="urlsubmitter">
                                <div clasName="uploadInfo">
                                    <Container>
                                        <Row className='urlinfo'>
                                            <Col>
                                                Enter url / magnet link
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md={9} className="urlcontainer">
                                                <input type='text' id="url" className='url' onChange={ () => {
                                                        if( this.urlparse('url') || this.magnetparse('url') )
                                                            this.toggledisable('submiturl','url');
                                                        else
                                                            this.disable('submiturl');
                                                    }} placeholder="Enter URL or magnet link here..." />
                                            </Col>
                                            <Col md={3} className='urlcontainer'>
                                                <button id='submiturl' className='submiturl' disabled>
                                                    Play
                                                </button>
                                            </Col>
                                        </Row>
                                    </Container>
                                </div>
                            </form>
                        </div>
                    </Container>
                </div>
                <Cfooter />
            </>
        );
    }
    componentDidMount() {
        var dropContainer = document.getElementById('dropcontainer');
        ;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropContainer.addEventListener(eventName, (envt) => {
                envt.preventDefault();
            } , false)
        })
        dropContainer.addEventListener('drop',this.handledrop,false);
        var form = document.getElementById('urlsubmitter');
        ;['submit'].forEach( eventName => {
            form.addEventListener(eventName, (envt) => {
                envt.preventDefault();
            },false);
        } )
        form.addEventListener('submit',this.parse_url,false);
    }
}
function Home(props){
    let navigate = useNavigate();
    return <Homepage {...props} navigate={navigate} />
}
// export module
export default Home;
