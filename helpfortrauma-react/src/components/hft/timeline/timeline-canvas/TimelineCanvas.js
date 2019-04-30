import React, { Component } from 'react';
import { Button, Modal } from 'react-bootstrap';
import HorizontalTimeline from 'react-horizontal-timeline';
import { Link } from 'react-router-dom';
import './TimelineCanvas.css';

import AuthService from '../../../../services/AuthService';
import DCanvasService from '../../../../services/DCanvasService';
import EventService from '../../../../services/EventService';

const Auth = new AuthService();
const event = new EventService();
const DCanvasSer = new DCanvasService();

class TimelineCanvas extends Component {

    constructor(props) {
        super(props);
        this.state = {
            curIdx: 0,
            prevIdx: -1,
            loading: true,
            events: [],
            eventButton: 'Create',
            before: false,
            eventIdForDel: '',
            showModal: false,
            showModalDialog: false,
        }
        this.open = this.open.bind(this);
        this.close = this.close.bind(this);
        this.openDialog = this.openDialog.bind(this);


        this.addEventVo = this.addEventVo.bind(this);
        this.getAllEvent = this.getAllEvent.bind(this);
        this.getDateFormat = this.getDateFormat.bind(this);
        this.confirmBtn = this.confirmBtn.bind(this);
        this.closeDialog = this.closeDialog.bind(this);

    }

    componentDidMount() {
        this.checkAuth();
        this.getAllEvent();
    }

    checkAuth = () => {
        if (!Auth.loggedIn()) {
            this.props.history.push('/login')
        }
    }

    getAllEvent = () => {
        event.getEventsById(event.getProfile().id)
            .then(res => {
                this.setState({ events: res.data.body.reverse(), loading: false });
            }).catch(err => {
                console.log('xxxxxxx xxxxxxxxxxxx xxxxxxxxxxxxxx error from comp ', err);
            });
    }

    openAddEvent() {

        this.setState({

            id: '',
            name: '',
            age: '',
            description: '',
            eventTitleHd: 'Add Event',
            eventButton: 'Create',
            year: 'y',
            months: 'm',
            womb: 'w'

        });
        this.open();


    }

    openEditEvent(event) {
        this.setState({
            id: event.id,
            name: event.name,
            year: event.age_year == 0 ? '' : event.age_months,
            months: event.age_months == 0 ? '' : event.age_months,
            before: event.before_birth,
            description: event.description,
            eventTitleHd: 'Update Event',
            eventButton: 'Update',
        });
        this.open();
    }

    _downloadPdf(eventId) {
        DCanvasSer.getDrawingPdf(eventId);
    }

    addEventVo() {
        const eventVo = {
            'id': this.refs.id.value,
            'usrid': event.getProfile().id,
            'name': this.refs.name.value,
            'year': this.state.before ? 0 : this.refs.year.value,
            'months': this.state.before ? 0 : this.refs.months.value,
            'before': this.state.before,
            'description': this.refs.description.value
        }


        console.log('xxxxxxx xxxxxxx xxxxxxxx event is ', eventVo);

        event.addEvent(eventVo)
            .then(data => {
                this.resetCheckBox();
                this.getAllEvent();
                this.close();
            }).catch(err => {
                console.log('xxxxx xxxxx ', err);
            });
    }

    _deleteEventById(id) {
        event.deleteEventById(id)
            .then(res => {
                this.getAllEvent();
                this.closeDialog();
            }).catch(err => {
                console.log('xxxxxxxxxx xxxxxxxxx err from com ' + err)
            });
    }

    confirmBtn() {
        this._deleteEventById(this.state.eventIdForDel);
    }
    closeDialog() {
        this.setState({ showModalDialog: false, eventIdForDel: '' });
    }

    open() {
        this.setState({ showModal: true });
    }

    close() {
        this.setState({ before: false, showModal: false });
    }
    resetCheckBox = () => {
        this.setState({
            brfore: false
        });
    }
    handleInputChange = (e) => {
        this.setState({
            before: e.target.checked
        }, function () {
            if (this.state.before) {
                this.refs.year.value = '';
                this.refs.months.value = '';
            }
        });
    }
    openDialogEvent(id) {
        this.setState({ eventIdForDel: id })
        this.openDialog();
    }
    openDialog() {
        this.setState({ showModalDialog: true });
    }

    launchCnavs(event) {
        localStorage.setItem('event', JSON.stringify({
            eventId: event.id,
            eventTitle: event.name
        }));
    }

    getDateFormat(date) {
        const eventDate = new Date(date)
        const month = eventDate.getMonth() + 1;
        const day = eventDate.getDate();
        const year = eventDate.getFullYear();
        return month + "/" + day + "/" + year;

    }

    render() {
        if (this.state.loading) {
            return '...loading';
        }
        const { curIdx, prevIdx, events } = this.state;
        const curStatus = events[curIdx];
        return (
            <div>
                <div>
                    <div className="col-md-3 trauma-timeline-sidebar-wrapper">
                        <div className="contents">
                            <div className="nav-side-menu margin-35">
                                <i className="fa fa-bars fa-2x toggle-btn" data-toggle="collapse" data-target="#menu-content"></i>

                                <div className="menu-list">
                                    <p>Utilize the list below to help you recall events that may have happened in your life. Add the event to your trauma timeline as you recall it.</p>

                                    <ul id="menu-content" className="menu-content collapse out">

                                        <li data-toggle="collapse" data-target="#products" className="collapsed">
                                            <a href="javascript:void(0)"><i className="fa fa-globe fa-lg"></i> Natural Disasters <span className="arrow"></span></a>
                                        </li>
                                        <ul className="sub-menu collapse" id="products">
                                            <li><a href="javascript:void(0)">CSS3 Animation</a></li>
                                            <li><a href="javascript:void(0)">General</a></li>

                                        </ul>


                                        <li data-toggle="collapse" data-target="#service" className="collapsed">
                                            <a href="javascript:void(0)"><i className="fa fa-globe fa-lg"></i> Physical <span className="arrow"></span></a>
                                        </li>
                                        <ul className="sub-menu collapse" id="service">
                                            <li>New Service 1</li>
                                            <li>New Service 2</li>
                                            <li>New Service 3</li>
                                        </ul>


                                        <li data-toggle="collapse" data-target="#new" className="collapsed">
                                            <a href="javascript:void(0)"><i className="fa fa-globe fa-lg"></i> Emotional <span className="arrow"></span></a>
                                        </li>
                                        <ul className="sub-menu collapse" id="new">
                                            <li>New New 1</li>
                                            <li>New New 2</li>
                                            <li>New New 3</li>
                                        </ul>

                                        <li data-toggle="collapse" data-target="#medical" className="collapsed">
                                            <a href="javascript:void(0)"><i className="fa fa-globe fa-lg"></i> Medical <span className="arrow"></span></a>
                                        </li>
                                        <ul className="sub-menu collapse" id="medical">
                                            <li>New New 1</li>
                                            <li>New New 2</li>
                                            <li>New New 3</li>
                                        </ul>

                                        <li data-toggle="collapse" data-target="#caregiver" className="collapsed">
                                            <a href="javascript:void(0)"><i className="fa fa-globe fa-lg"></i> Caregiver <span className="arrow"></span></a>
                                        </li>
                                        <ul className="sub-menu collapse" id="caregiver">
                                            <li>New New 1</li>
                                            <li>New New 2</li>
                                            <li>New New 3</li>
                                        </ul>

                                        <li data-toggle="collapse" data-target="#sexual" className="collapsed">
                                            <a href="javascript:void(0)"><i className="fa fa-globe fa-lg"></i> Caregiver <span className="arrow"></span></a>
                                        </li>
                                        <ul className="sub-menu collapse" id="sexual">
                                            <li>New New 1</li>
                                            <li>New New 2</li>
                                            <li>New New 3</li>
                                        </ul>



                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="timeline-white col-md-9">
                        <div className="col-md-12">
                            <div className="content_place">
                                {/* Bounding box for the Timeline */}
                                {
                                    this.state.events.length > 0 ? (
                                        <div>
                                            <div
                                                style={{
                                                    width: "100%",
                                                    height: "100px",
                                                    margin: "0 auto",
                                                    marginTop: "20px",
                                                    fontSize: "15px"
                                                }}
                                            >


                                                <HorizontalTimeline
                                                    styles={{
                                                        background: "#f8f8f8",
                                                        foreground: "#1A79AD",
                                                        outline: "#dfdfdf"
                                                    }}
                                                    index={this.state.curIdx}
                                                    indexClick={index => {
                                                        const curIdx = this.state.curIdx;
                                                        this.setState({ curIdx: index, prevIdx: curIdx });
                                                    }}
                                                    values={events.map(x => x.created)}
                                                />
                                            </div>
                                            <div className="">
                                                <h1 className="text-left font-35"><span > {curStatus.name}</span>,
                                        <span>Age: {curStatus.age_year}</span></h1>
                                                <h4 className="text-left"> -Event Added
                                        {this.getDateFormat(curStatus.created)}
                                                </h4>
                                                <h4 className="text-left"> {curStatus.name}

                                                </h4>
                                            </div>
                                            <div className="row margin-35">
                                                <div className="btn-group mr-2">
                                                    <button type="button" className="btn btn-primary" onClick={this.openAddEvent.bind(this)}>
                                                        <span className="glyphicon glyphicon-plus"></span> Add Event To Timeline
                                            </button>
                                                </div>

                                                <div className="btn-group mr-2">


                                                    <button type="button" className="btn btn-warning">
                                                        <Link to={'/drawing-canvas'} target='_blank' onClick={this.launchCnavs.bind(this, curStatus)} ><span className="icon-span"> <i className="far fa-pencil-paintbrush"></i> Open Graphic Narrative</span>

                                                        </Link>
                                                    </button>


                                                </div>
                                                <div className="btn-group mr-2">
                                                    <button type="button" className="btn btn-success" onClick={this.openEditEvent.bind(this, curStatus)}>
                                                        <i className="fa fa-pencil-square-o"></i> Edit Event
                                            </button>
                                                </div>
                                                <div className="btn-group mr-2">
                                                    <button type="button" className="btn btn-danger" onClick={this.openDialogEvent.bind(this, curStatus.id)}>
                                                        <i className="fal fa-trash-alt"></i> Delete Event
                                            </button>
                                                </div>


                                                <div className="btn-group mr-2">
                                                    <button type="button" className="btn btn-primary">Reply</button>
                                                </div>
                                                <div className="btn-group mr-2">
                                                    <button type="button" onClick={this._downloadPdf.bind(this, curStatus.id)} className="btn btn-dark">Download Pdf</button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                            <div className="btn-group mr-2">
                                                <button type="button" className="btn btn-primary" onClick={this.openAddEvent.bind(this)}>
                                                    <span className="glyphicon glyphicon-plus"></span> Add Event To Timeline
                                            </button>
                                            </div>
                                        )
                                }

                                <div className="row margin-35">
                                    <div className="card">

                                        <div className="card-body">
                                            <h5 className="card-title">My Safe Place</h5>
                                            <p className="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>

                                        </div>
                                    </div>
                                </div>
                                <Modal show={this.state.showModal} onHide={this.close}>
                                    <Modal.Header closeButton>
                                        <Modal.Title>{this.state.eventTitleHd}</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <div className="rowcol-md-10 " align="center">
                                            <div className="form-group">
                                                <input type="hidden" className="form-control" defaultValue={this.state.id} name="id" ref="id" />

                                                <input type="text" required="required" className="form-control validate" placeholder="Name of the event" defaultValue={this.state.name} name="name" ref="name" />
                                            </div>


                                            <div>

                                                <div className="col-md-12"><label className="pull-left">Age:</label></div>
                                                <div className="form-group col-sm-4 myfield">
                                                    <input type="number" required="required" className="form-control validate" placeholder="Years" defaultValue={this.state.year} name="year" ref="year" />
                                                </div>
                                                <div className="form-group col-sm-4">
                                                    <input type="number" required="required" className="form-control validate" placeholder="Months" defaultValue={this.state.months} name="months" ref="months" />
                                                </div>
                                                <div className="form-group col-sm-4 mycheck">
                                                    <label> Before Birth &nbsp; &nbsp; <input name="before" type="checkbox" checked={this.state.before} onChange={this.handleInputChange.bind(this)} /></label>
                                                </div>
                                            </div>
                                            <div className="">
                                                <textarea className="form-control" name="description" placeholder="Description" ref="description" id="description" defaultValue={this.state.description}></textarea>
                                            </div>
                                        </div>
                                    </Modal.Body>
                                    <Modal.Footer>

                                        <button type="button" className="btn btn-danger" onClick={this.close}>Close</button>
                                        <button type="button" className="btn btn-success" onClick={this.addEventVo}>{this.state.eventButton}</button>
                                    </Modal.Footer>
                                </Modal>

                                <Modal className="static-modal-confirm" show={this.state.showModalDialog} onHide={this.closeDialog}>

                                    <Modal.Body>

                                        <Modal.Title>Are you sure ?</Modal.Title>
                                    </Modal.Body>

                                    <Modal.Footer>
                                        <Button onClick={this.closeDialog} bsStyle="warning">Cancel</Button>
                                        <Button onClick={this.confirmBtn} bsStyle="primary">Proceed</Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default TimelineCanvas;
