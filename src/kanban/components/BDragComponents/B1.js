/**
 *   by jingzy on 2017/12/15 0015.
 */
import React, { Component } from 'react';
import ReactEcharts from 'echarts-for-react';
import classNames from 'classnames';

import { connect } from 'dva';
import moment from 'moment';
import { Card, DatePicker } from 'antd';
import { getBarOption } from '../Echarts/Options';
import styles from './Card.less';

export class B1 extends React.Component {
  constructor(props) {
    super(props);
    const { illegalCount } = this.props;
    this.state = {
      illegalCount,
      date: moment()
        .subtract(9, 'days')
        .format('YYYY-MM-DD'), // 获取十天前的时间
    };
  }

  onChange = date => {
    this.setState({
      // date: moment(date).format('YYYY-MM-DD'),
    });
  };

  render() {
    const { bigStyle, themeId, illigalDataByPoliceInfo } = this.props;
    const { illegalCount, date } = this.state;
    const caseExtra = (
      <div>
        <span>开始日期：</span>
        <DatePicker style={{ width: '150px' }} format="YYYY-MM-DD" onChange={this.onChange} />
      </div>
    );
    const bsytle = classNames({
      [styles.bcardStyle]: bigStyle == 'big',
      [styles.bSmallcardStyle]: bigStyle != 'big',
    });
    return (
      <div>
        <Card
          title={<span className={styles.title}>日常数据统计</span>}
          className={bsytle}
          bordered={false}
        >
          <span>
            <ReactEcharts
              option={getBarOption(illigalDataByPoliceInfo, date, themeId)}
              notMerge
              lazyUpdate
              style={bigStyle === 'big' ? { height: '280px' } : { height: '130px' }}
            />
          </span>
        </Card>
      </div>
    );
  }
}
export default connect(state => ({
  illegalCount: state.user.illegalCount,
  illigalDataByPoliceInfo: state.global.illigalDataByPoliceInfo,
  themeId: state?.user?.userTheme?.themeId,
}))(B1);
