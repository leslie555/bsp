/**
 * 5.8需求
 * 获取当天到当前时刻警情上报数
 * Created by jzy on 2018/8/9 .
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, notification } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ExtractedCard from './ExtractedCard';
import { THEMES } from '../../config/constant';
import styles from './Card.less';

export class A5803 extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getEventReportCount',
      payload: {},
    });
  }

  render() {
    const { bigStyle, eventReportCount, themeId } = this.props;
    const num = eventReportCount?.count || 0;

    const cardleftClass = classNames({
      [styles.cardStyle2]: bigStyle === 'big',
      [styles.aSmallcardStyle2]: bigStyle != 'big',
    });
    const bg = `url('/HiatmpPro/kanban/acomponent${
      themeId == THEMES.dark ? '' : '1'
    }5.png') no-repeat center`;

    return (
      <div className={styles.normal}>
        {ExtractedCard(
          cardleftClass,
          eventReportCount?.name || '警情上报数',
          num,
          {
            background: bg,
          },
          themeId
        )}
      </div>
    );
  }
}
A5803.propTypes = {};
A5803.defaultProps = {};
export default connect(({ user }) => ({
  eventReportCount: user.eventReportCount,
  themeId: user?.userTheme?.themeId,
}))(A5803);
