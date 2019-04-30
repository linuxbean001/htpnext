
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import '../../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import CoursesService from '../../../services/CoursesService';
import Stripe from '../../register/stripe/Stripe';
import './LiveTraining.css';


const courseApi = new CoursesService();





class LiveTraining extends React.Component {
	/* *****************************Constructor******************* */
	constructor(props) {
		super(props);

		this.state = {
			sortName: undefined
		};
		this.onSortChange = this.onSortChange.bind(this);
		this.buttonFormatter = this.buttonFormatter.bind(this);
	}


	componentDidMount() {
		this.getLiveCourses();
	}

	getLiveCourses = () => {
		courseApi.getLiveCourses()
			.then(res => {
				if (res.data.success) {
					this.setState({
						liveCourses: res.data.body
					});
				}
			}).catch(err => {
				console.log('xxxxxxxxxx xxxxxxxxx xxxxxxxxxxxx err ', err)
			});
	}

	onSortChange(sortName, sortOrder) {
		// console.info('onSortChange', arguments);
		this.setState({
			sortName
		});
	}

	buttonFormatter(cell, row) {
		return <Stripe total={row.cost__c} label={'Buy'} paymemtSuccess={this.paymemtTrue.bind(this, row)} />
	}
	
	paymemtTrue = (row, paymemtSuccess) => {
		console.log('xxxxxxxx xxxxxxxxxx paymemtSuccess ', paymemtSuccess);
		console.log('xxxxxxxx xxxxxxxxxx row ', row);
		// if(paymemtSuccess)
	}

	/* *****************************Template********************* */
	render() {
		const options = {
			sortName: this.state.sortName,
			onSortChange: this.onSortChange
		};
		return (

			<div className="LiveTraining">
				<div className="row form-group head_div">
					<div className="pull-left ">
						<span className="head_title">Live Training</span>
					</div>
				</div>
				<BootstrapTable data={this.state.liveCourses} options={options} striped hover>
					<TableHeaderColumn isKey dataSort dataField='name'>Course</TableHeaderColumn>
					<TableHeaderColumn dataSort dataField='date_s__c'>Date</TableHeaderColumn>
					<TableHeaderColumn dataSort dataField='location_address__c'>Location</TableHeaderColumn>
					<TableHeaderColumn dataSort dataField='location_city_state__c'>CityState</TableHeaderColumn>
					<TableHeaderColumn dataSort dataField='cost__c' dataFormat={this.buttonFormatter} >Register</TableHeaderColumn>
				</BootstrapTable>
			</div>

		);
	}
}

export default LiveTraining;
