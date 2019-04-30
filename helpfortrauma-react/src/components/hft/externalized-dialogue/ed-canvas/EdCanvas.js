import React, { Component } from 'react'
import { Button, Modal } from 'react-bootstrap';
import PmService from '../../../../services/PmService';
import './EdCanvas.css'
const PmApi = new PmService();

export default class EdCanvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      loading: true,
      dialogVo: {},
      mocakArr: [],
      rowToEdit: -1
    }
  }

  componentDidMount() {
    this.getFonts();
  }

  closDialogueModal = () => {
    this.setState({
      showModal: false
    });
  }

  openaDialogueModal = () => {
    this.setState({
      showModal: true,
      dialogVo: this.state.rowToEdit == -1 ? {} : this.state.dialogVo
    });
  }

  addDialogue = () => {
    let arr = this.state.mocakArr;
    if (this.state.rowToEdit == -1) {
      this.setState({
        mocakArr: [...arr, this.state.dialogVo]
      }, function () {
        this.closDialogueModal();
      });
    } else {
      arr.splice(this.state.rowToEdit, 1, this.state.dialogVo);
      this.setState({
        mocakArr: arr
      }, function () {
        this.closDialogueModal();
      });
    }
  }

  handleChange = (e) => {
    this.state.dialogVo[e.target.id] = e.target.value;
    console.log(this.state.dialogVo);
    if (e.target.id == 'color') {
      this.setState({
        fontColor: e.target.value
      })
    }

    if (e.target.id == 'font') {
      this.setState({
        fontFamily: e.target.value
      })
    }
  }

  handleFontTypeChange = (e) => {
    const result = this.state.fontsClone.filter(font => font.category == e.target.value);
    this.setState({
      fonts: result
    });
  }

  getTitle = (e) => {
    console.log('xxxx xxxxxxx ', e);

  }

  removeDialogue = (index) => {
    this.state.mocakArr.splice(index, 1);
    this.setState({
      mocakArr: [...this.state.mocakArr]
    });
  }

  editDialogue = (index, row) => {
    this.setState({
      dialogVo: row,
      rowToEdit: index,
    }, function () {
      this.openaDialogueModal();
    })
  }

  getFonts = () => {
    PmApi.getFonts()
      .then(res => {
        this.setState({
          fonts: res.data.items
        }, function () {
          console.log(this.state.fonts);
          this.setState({
            fontsClone: this.state.fonts,
            loading: false
          })
        });
      }).catch(err => {

      });
  }


  render() {
    if (this.state.loading) {
      return 'loading....';
    }
    return (
      <div>
        <div className="col-md-12 p-sidebar padd-right-0">
          <div className="col-md-3 sidebar text-center pad-top-15 padd-left-0 padd-right-0">

            <div className="col-xs-2 padd-right-0 back-gr">

              <ul className="nav nav-tabs tabs-left">
                <li className="active"><a href="#dialogue" data-toggle="tab"><i className="fa fa-hand-o-up" aria-hidden="true"></i></a></li>
                <li><a href="#profile" data-toggle="tab"><i className="fa fa-user-circle" aria-hidden="true"></i></a></li>
                <li><a href="#font" data-toggle="tab"><i className="fa fa-font" aria-hidden="true"></i></a></li>
                <li><a href="#settings" data-toggle="tab"><i className="fa fa-info-circle" aria-hidden="true"></i></a></li>
                <li><a href="#download" data-toggle="tab"><i className="fa fa-download" aria-hidden="true"></i></a></li>
                <li><a href="#save" data-toggle="tab"><i className="fa fa-floppy-o" aria-hidden="true"></i></a></li>
              </ul>
            </div>
            <div className="col-xs-10 tab-cont">
              <div className="tab-content">
                <div className="tab-pane active" id="dialogue">
                  <div className="spacer"></div>

                  <div className="form-group">
                    <button className="button btn btn-warning btn-full">Dialogue</button>
                  </div>

                  <div className="dialogues form-group">
                    {
                      this.state.mocakArr && this.state.mocakArr.map((row, index) =>
                        <div key={index} className="form-group" className="dialogue-list">
                          <div style={{ "cursor": "pointer" }} onClick={this.getTitle.bind(this)}>
                            <h4>{row.title}</h4>
                          </div>
                          <div>
                            <button onClick={this.editDialogue.bind(this, index, row)} className="button btn btn-sm btn-primary btn-space"><i className="fal fa-pencil" aria-hidden="true"></i></button>
                            <button onClick={this.removeDialogue.bind(this, index)} className="button btn btn-sm btn-primary btn-space"><i className="fa fa-trash" aria-hidden="true"></i>
                            </button>
                          </div>
                        </div>
                      )
                    }
                  </div>

                  <div className="form-group">
                    <button onClick={this.openaDialogueModal} className="button btn btn-warning btn-full">New Dialogue</button>
                  </div>

                </div>
                <div className="tab-pane" id="profile">
                  <span>Profile</span>
                </div>

                <div className="tab-pane pick-font" id="font">

                  <span>font</span>

                </div>

                <div className="tab-pane" id="settings">
                  <div className="spacer"></div>
                  <div className="form-group">
                    <button className="button btn btn-warning btn-full">Info</button>
                  </div>
                  <div className="form-group">
                    <h3>Add your parts to the map. The center circle is the “SELF". Adjust the map as your parts change or become more aligned with your “Self”.</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="clearfix"></div>
          </div>
          <div className='col-md-9'>
                    
          </div>
        </div>

        <div className="modal-dialogue">
          <Modal className="static-modal-confirm" show={this.state.showModal} onHide={this.closDialogueModal}>

            <Modal.Body>
              <div className="form-group">
                <input type="text" id="title" placeholder={'Give a name to the feeling, part or voice'} onChange={this.handleChange.bind(this)} defaultValue={this.state.dialogVo.title} />
              </div>
              <div className="form-group">
                <h3 style={{ "color": this.state.fontColor, "fontFamily": this.state.fontFamily }}>Select a font and color</h3>
              </div>
              <div className="form-group">
                <select className="form-control" defaultValue="none" onChange={this.handleFontTypeChange.bind(this)}>
                  <option value="none" disabled>Select Font Type</option>
                  <option value="serif">Serif</option>
                  <option value="sans-serif">Sans Serif</option>
                  <option value="display">Display</option>
                  <option value="handwriting">Handwriting</option>
                  <option value="monospace">Monospace</option>
                </select>
              </div>

              <div className="form-group">
                <div className="col-md-9 padding-0">
                  <select className="form-control" defaultValue={this.state.dialogVo.font} id="font" onChange={this.handleChange.bind(this)}>
                    <option value="none" disabled>Select Font</option>
                    {
                      this.state.fonts && this.state.fonts.map((font, index) =>
                        <option key={index} value={font.family} style={{ "fontFamily": font.family, "cursor": "pointer" }} >{font.family}</option>
                      )
                    }
                  </select>
                </div>
                <div className="col-md-3 colorPick">
                  <input type="color" id="color" value={this.state.dialogVo.color} placeholder={'Give a name to the feeling, part or voice'} onChange={this.handleChange.bind(this)} />
                </div>
              </div>
            </Modal.Body>

            <Modal.Footer>
              <Button onClick={this.closDialogueModal} bsStyle="warning">Cancel</Button>
              <Button onClick={this.addDialogue.bind(this)} bsStyle="primary">Add</Button>
            </Modal.Footer>
          </Modal>
        </div>

      </div>
    )
  }
} 
