import React, { Component } from 'react';
import AliceCarousel from 'react-alice-carousel';
import { ReactMic } from 'react-mic';
import EasyTimer from '../../../../../node_modules/easytimer.js';
import RecorderService from '../../../../services/RecorderService';
import './Recorder.css';

const recService = new RecorderService();



class Recorder extends Component {
    constructor(props) {
        super(props);
        this.state = {
            recording: '',
            drawingImg: [],
            index: 0,
            drawingId: 0,
            id: 0,
            interval: 5000,
            autoPlay: false,
            recoderBox: false,
            showPlayButton: true,
            timer: new EasyTimer(),
            timeValues: ""
        };
        this.tick = this.tick.bind(this);

    }

    componentDidMount() {
        this._getDrawingImages();
    }

    startRecording = (index, val) => {
        this._initTimer();
        let id = 0;
        if (val.rid) {
            id = val.rid
        }
        this.setState({
            record: true,
            index: index,
            drawingId: val.did,
            id: id,
            recoderBox: true
        });
    }

    _initTimer() {
        let { timer } = this.state;
        timer.start();
        timer.addEventListener("secondsUpdated", this.tick);
    }

    tick(e) {
        let { timer } = this.state;
        const timeValues = timer.getTimeValues().toString();
        this.setState({ timeValues: timeValues });
    }

    stopRecording = (index, val) => {
        this.setState({
            record: false,
            index: index,
            recoderBox: false,
            timer: new EasyTimer()
        });

    }

    _addRecording = (recording) => {
        const body = {
            drawingId: this.state.drawingId,
            recording: recording,
            id: this.state.id
        };



        recService.addUpdateRecording(body)
            .then(data => {
                this.setState({
                    id: 0
                })

            }).catch(err => {
                console.log('xxx xxxxxxx xxxxxxxxxx ', err);

            });
    }

    onData(recordedBlob) {
    }

    onStop = (recordedBlob) => {
        var reader = new FileReader();
        reader.readAsDataURL(recordedBlob.blob);
        reader.onloadend = () => {
            let base64data = reader.result;
            this._addRecording(base64data);
        }
    }

    _getDrawingImages = () => {
        // const eventId = JSON.parse(localStorage.getItem('event')).eventId;
        const recorder = JSON.parse(localStorage.getItem('RECORDER'));
        if (recorder.data) {
            this.setState({
                drawingImg: recorder.data.body,
            });
        }
        // recService.getRecordingWithDrawing(eventId)
        //     .then(data => {
        //         console.log('xxxxxxxxxxxxxx data is get drawing xxxxxxx record ', data);

        //         this.setState({
        //             drawingImg: data.data.body,
        //         });

        //         console.log("x x x x", this.state.drawingImg);


        //     }).catch(err => {
        //         console.log('xxxxxxxxxxxxxx err is trt ', err);
        //     });
    }

    playAudio = (aud) => {
        this.audio.src = aud;
        this.audio.play();
        this.setState({
            showPlayButton: !this.state.showPlayButton
        });
    }

    pauseAudio = (aud) => {
        this.audio.pause();
        this.setState({
            showPlayButton: !this.state.showPlayButton
        });
    }

    _getDuration = (aud) => {
        let audio = new Audio();
        audio.src = aud;
        const durationP = new Promise(resolve =>
            audio.addEventListener('loadedmetadata', () => {
                if (audio.duration === Infinity) {
                    audio.currentTime = Number.MAX_SAFE_INTEGER
                    audio.ontimeupdate = () => {
                        audio.ontimeupdate = null
                        resolve(audio.duration)
                        audio.currentTime = 0
                    }
                }
                else
                    resolve(audio.duration);
            })
        )
        return durationP

    }

    getImgSrc = (img) => {
        let imgSrc = img.replace('{"', "").replace('"}', "");
        return imgSrc;
    }

    handleAutoPlay = (val) => {
        if (this.state.autoPlay === true) {
            let rec = this.state.drawingImg[val.item];
            if (rec.recording) {

                this._getDuration(rec.recording)
                    .then(res => {
                        let time = res * 1000;

                        this.setState({
                            interval: time,
                        });

                        this.playAudio(rec.recording);


                    }).catch(err => {
                        console.log('x xxxxxxx xxxxxx err is ', err);
                    })
            } else {
                this.setState({
                    interval: 2000,
                });
            }
        }

    }

    getValues = (val) => {
        this.state.index = val.item;
        this.handleAutoPlay(val);
    }

    slideShow = () => {
        this._getDrawingImages();
        let firstSlide = this.state.drawingImg[0];
        //    console.log('XXXX XXXXXXXX XXXXXXXX DURATION IS ', firstSlide);
        if (firstSlide.recording) {
            this._getDuration(firstSlide.recording)
                .then(res => {
                    let time = res * 1000;

                    this.setState({
                        interval: time,
                    });

                    // this.slider.interval = time;


                    this.playAudio(firstSlide.recording);
                    this.setState({
                        index: 0,
                        autoPlay: true
                    });
                }).catch(err => {
                    console.log('eeeeerrrrrrrr xxxxxxxxxxxx ', err);
                });
        } else {
            this.setState({
                index: 0,
                interval: 2000,
                autoPlay: true,
            });
        }

    }

    render() {
        return (
            <div className="recoder-box">


                <div className="recored_wave">
                    <ReactMic
                        record={this.state.record}
                        className={"sound-wave " + (this.state.recoderBox == false ? 'hidden' : '')}
                        onStop={this.onStop}
                        onData={this.onData}
                        strokeColor="#000000"
                    />
                </div>

                <audio ref={(audio) => { this.audio = audio }} src=""></audio>

                <AliceCarousel className="rec-slider" responsive={{
                    0: { items: 1 },
                    600: { items: 1 },
                    1024: { items: 1 },
                }}
                    ref={slider => { this.slider = slider }}
                    autoPlayInterval={this.state.interval}
                    autoPlay={this.state.autoPlay}
                    duration={1000}
                    startIndex={this.state.index}
                    fadeOutAnimation={false}
                    mouseDragEnabled={false}
                    playButtonEnabled={false}
                    onSlideChanged={this.getValues}
                    showSlideIndex={true}
                    stopAutoPlayOnHover={false}

                >
                    {
                        this.state.drawingImg.map((value, index) =>

                            (

                                <div className="recording_drawing" key={index} data-id={value.did}>
                                    <img src={this.getImgSrc(value.img)} />

                                    <div className="drawing-btn text-center">
                                        {
                                            this.state.recoderBox ? (
                                                <div className="inline-group recorder-btn">
                                                    <button className="btn button btn-danger btn-lg" onClick={this.stopRecording.bind(this, index, value)}>Stop</button>
                                                    <span style={{ color: 'white' }}>
                                                        {' ' + this.state.timeValues}</span>
                                                </div>
                                            ) : (

                                                    <div>

                                                        {
                                                            value.recording ? (
                                                                <div className="inline-group recorder-btn">

                                                                    <div className="inline-group recorder-btn">
                                                                        {
                                                                            this.state.showPlayButton ? (
                                                                                <button className="btn button btn-success btn-lg" onClick={this.playAudio.bind(this, value.recording)}>Play</button>
                                                                            ) : (
                                                                                    <button className="btn button btn-warning btn-lg" onClick={this.pauseAudio.bind(this, value.recording)}>Pause</button>
                                                                                )
                                                                        }


                                                                    </div>

                                                                    <button onClick={this.startRecording.bind(this, index, value)} className="btn button btn-success btn-lg" >Re-Record</button>
                                                                </div>

                                                            ) : (
                                                                    <div className="inline-group recorder-btn">

                                                                        <button onClick={this.startRecording.bind(this, index, value)} className="btn button btn-success btn-lg" >Record</button>
                                                                    </div>

                                                                )
                                                        }
                                                        <div className="inline-group recorder-btn">
                                                            <button onClick={this.slideShow.bind(this)} className="btn button btn-success btn-lg">Play Slideshow</button>
                                                        </div>
                                                    </div>

                                                )
                                        }

                                    </div>
                                </div>


                            )

                        )
                    }

                </AliceCarousel>
            </div>
        );
    }
}

export default Recorder;
