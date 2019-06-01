import React from 'react';
import PropTypes from 'prop-types';
import { Link, Route, Switch, Redirect } from 'dva/router';
import DocumentTitle from 'react-document-title';
import styles from './SingalLayout.less';
import NotFound from '../routes/Exception/404';


class SingalLayout extends React.PureComponent {
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.array,
  };

  getChildContext() {
    const { location, getRouteData } = this.props;
    return { location,
      breadcrumbNameMap: getRouteData('SingalLayout') };
  }

  getPageTitle() {
    const { getRouteData, location } = this.props;
    const { pathname } = location;
    let title = '管控5.8';
    getRouteData('SingalLayout').forEach((item) => {
      if (item.path === pathname) {
        title = `${item.name}`;
      }
    });
    return title;
  }

  render() {
    const { getRouteData } = this.props;

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          <Switch>
            {getRouteData('SingalLayout').map(item => (
              <Route
                exact={item.exact}
                key={`1${item.path}`}
                path={item.path}
                component={item.component}
              />
            ))}
            <Redirect exact from="/" to="/view" />
            <Route component={NotFound} />
          </Switch>
        </div>
      </DocumentTitle>
    );
  }
}

export default SingalLayout;
