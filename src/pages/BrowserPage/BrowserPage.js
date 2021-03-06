import React, { Component, Fragment } from 'react';
import {
 Row, Col, Button, Icon,
} from 'antd';
import { string, func } from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash/get';

import {
	setCurrentApp,
	getPermission as getPermissionFromAppbase,
} from '../../batteries/modules/actions';
import { getAppPermissionsByName } from '../../batteries/modules/selectors';

import Header from '../../components/Header';
import Loader from '../../components/Loader';

class BrowserPage extends Component {
	componentDidMount() {
		const { credentials } = this.props;
		if (!credentials) {
			this.init();
		}
	}

	componentDidUpdate(prevProps) {
		const { appName, appId } = this.props;
		if (appName !== prevProps.appName || appId !== prevProps.appId) {
			this.init();
		}
	}

	init() {
		// prettier-ignore
		const {
			updateCurrentApp,
			appName,
			appId,
			getPermission,
		} = this.props;
		updateCurrentApp(appName, appId);
		getPermission(appName);
	}

	render() {
		const { appName, credentials } = this.props;

		const dejavu = {
			url: `https://${credentials}@scalr.api.appbase.io`,
			appname: appName,
		};
		const url = JSON.stringify(dejavu);
		const iframeURL = `https://opensource.appbase.io/dejavu/live/#?app=${url}&hf=false&subscribe=false`;

		return (
			<Fragment>
				<Header compact>
					<Row type="flex" justify="space-between" gutter={16}>
						<Col lg={18}>
							<h2>Browse Data</h2>

							<Row>
								<Col lg={18}>
									<p>
										This is a database view of your appbase.io app. You can
										create, edit, view and delete your data from here -{' '}
										<a
											href="https://docs.appbase.io/concepts/databrowser.html"
											target="_blank"
											rel="noopener noreferrer"
										>
											learn more
										</a>
										. <br /> <br />
										You can also do the same operations via the{' '}
										<a
											href="https://rest.appbase.io"
											target="_blank"
											rel="noopener noreferrer"
										>
											REST API
										</a>
										.
									</p>
								</Col>
							</Row>
						</Col>
						<Col
							lg={6}
							css={{
								display: 'flex',
								flexDirection: 'column-reverse',
								paddingBottom: 20,
							}}
						>
							<Button
								size="large"
								type="primary"
								href="https://appbase.io/contact/"
								target="_blank"
								rel="noopener noreferrer"
							>
								<Icon type="form" />
								Contact Us
							</Button>
							<p
								css={{
									marginTop: 20,
									fontSize: 13,
									textAlign: 'center',
									lineHeight: '20px',
								}}
							>
								Need help with your dataset?
								<br />
								We now offer paid support.
							</p>
						</Col>
					</Row>
				</Header>
				<section>
					{credentials ? (
						<iframe
							height={`${window.innerHeight - 243 || 600}px`}
							width="100%"
							title="dejavu"
							src={iframeURL}
							frameBorder="0"
						/>
					) : (
						<Loader />
					)}
				</section>
			</Fragment>
		);
	}
}

BrowserPage.propTypes = {
	appName: string.isRequired,
	appId: string.isRequired,
	credentials: string.isRequired,
	updateCurrentApp: func.isRequired,
	getPermission: func.isRequired,
};

const mapStateToProps = (state) => {
	const { username, password } = get(getAppPermissionsByName(state), 'credentials', {});
	return {
		credentials: username ? `${username}:${password}` : '',
	};
};

const mapDispatchToProps = dispatch => ({
	updateCurrentApp: (appName, appId) => dispatch(setCurrentApp(appName, appId)),
	getPermission: appId => dispatch(getPermissionFromAppbase(appId)),
});

export default connect(
	mapStateToProps,
	mapDispatchToProps,
)(BrowserPage);
