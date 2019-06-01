/**
 * Created by jzy on 2018/9/14 .
 * HOC
 */

import React, { Component } from 'react';

import Analysis from './Analysis';
import SettingDarwer from '../../components/SetDrawer';

import styles from './Analysis.less';

class WarppedComponent extends Component {
  render() {
    const { user, activeKey } = this.props;

    const mapUrl = `${user.mapUrl}/HiMap/index.html`;
    return (
      <Analysis>

      </Analysis>
    );
  }
}
export default WarppedComponent;
