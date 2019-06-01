/**
 * 获取当天到当前时刻视频巡检总量
 * Created by jzy on 2018/8/9 .
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, notification } from 'antd';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import styles from './Card.less';
import ExtractedCard from './ExtractedCard';
import { THEMES } from '../../config/constant';

export class A5802 extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getVedioPatrolCount',
      payload: {},
    });
  }

  render() {
    const {
      bigStyle,
      vedioPatrolCount: { name, count },
      themeId,
    } = this.props;
    const num = count || 0;

    const cardleftClass = classNames({
      [styles.cardStyle2]: bigStyle === 'big',
      [styles.aSmallcardStyle2]: bigStyle != 'big',
    });
    const bg = `url('/HiatmpPro/kanban/acomponent${
      themeId == THEMES.dark ? '' : '1'
    }3.png') no-repeat center`;

    return (
      <div className={styles.normal}>
        {ExtractedCard(
          cardleftClass,
          name || '视频巡检总量',
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
A5802.propTypes = {};
A5802.defaultProps = {};
export default connect(({ user }) => ({
  vedioPatrolCount: user.vedioPatrolCount,
  themeId: user?.userTheme?.themeId,
}))(A5802);
