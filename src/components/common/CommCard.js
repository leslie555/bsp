/**
 * 边框通用组件
 */
import React from 'react';
import PropTypes from 'prop-types';
import styles from './CommCard.less';

export default function ScsCard(props) {
  const { bordered, children, style, title, extra, modal } = props;
  if (bordered) {
    /* 包角 */
    return (
      <div
        className={`${styles.alertCard} outline-bgg outline-border outline-out`}
        style={{ padding: '1px', ...style }}
      >
        <div className="outline-inner">{children}</div>
      </div>
    );
  } else if (title) {
    /* 有title */
    return (
      <div className={`${styles.alertCard} outline-bgg outline-border`} style={style}>
        <p className={styles.pTitle}>
          <span>{title}</span>
          {extra}
        </p>
        <div style={{ padding: '14px 14px 0 14px' }}>{children}</div>
      </div>
    );
  } else {
    /* 无titile无边框,组件内部套组件的那种 */
    if (modal) {
      return (
        <div className={`${styles.alertMainCard} outline-bgg`}>
          <div style={{ padding: '5px 15px', ...style }}>{children}</div>
        </div>
      );
    }

    /* 会有滚动条右边没padding的那种情况就需要style覆盖 */
    return (
      <div className={`${styles.alertMainCard} outline-bgg`}>
        <div style={{ padding: '0 8px', ...style }}>{children}</div>
      </div>
    );
  }
}
ScsCard.propTypes = {
  bordered: PropTypes.bool, // 是否包角
  title: PropTypes.string, // 标题
  extra: PropTypes.element, // 关闭按钮
  children: PropTypes.array,
  style: PropTypes.object, // 样式 display,或者滚动条覆盖
  modal: PropTypes.bool, // 不包角，没有title那种
};
