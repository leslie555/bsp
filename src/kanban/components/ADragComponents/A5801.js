/**
 * 5.8需求
 * 当前时刻两小时之内的待审核警情数
 * Created by jzy on 2018/8/9 .
 */
import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, notification } from 'antd';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Card.less';
import ExtractedCard from './ExtractedCard';
import { THEMES } from '../../config/constant';

export class A5801 extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/getEventCount2Audit',
      payload: {},
    });
  }

  onClickHander = () => {
    const { handleAcomponentClick, event2AuditCount } = this.props;
    if (event2AuditCount?.url) {
      const page = { data: { url: event2AuditCount?.url, menuName: '警情' } };
      handleAcomponentClick(page);
    } else {
      notification.warning({ message: '未提供链接地址.' });
    }
  };

  render() {
    const { bigStyle, event2AuditCount, themeId } = this.props;
    const num = event2AuditCount?.count2audit || 0;

    const cardleftClass = classNames({
      [styles.cardStyle2]: bigStyle === 'big',
      [styles.aSmallcardStyle2]: bigStyle != 'big',
      [styles.hoverpointer]: bigStyle === 'big',
      [styles.smallPointerBGColor]: bigStyle != 'big',
    });
    const bg = `url('/HiatmpPro/kanban/acomponent${
      themeId == THEMES.dark ? '' : '1'
    }1.png') no-repeat center`;

    return (
      <div title="点击跳转详情页面" className={styles.normal}>
        {ExtractedCard(
          cardleftClass,
          '待审核警情数',
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

A5801.propTypes = {
  handleAcomponentClick: PropTypes.func,
};
A5801.defaultProps = {
  handleAcomponentClick: () => {},
};

export default connect(({ user }) => ({
  event2AuditCount: user.event2AuditCount,
  themeId: user?.userTheme?.themeId,
}))(A5801);
