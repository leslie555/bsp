import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import { Icon } from 'antd';
import styles from './Box.less';

const style = {
  minWidth: '140px',
  height: '100%',
  margin: '0 auto',
  cursor: 'move',
  textAlign: 'left',
};

const boxSource = {
  beginDrag(props) {
    const { menuId, menuName } = props;
    return {
      menuId,
      menuName,
      name: menuName,
    };
  },
};
/* eslint-disable   react/destructuring-assignment  */
@DragSource(props => props.type, boxSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Box extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    menuName: PropTypes.string.isRequired,
    isDropped: PropTypes.bool.isRequired,
  };

  render() {
    const { menuName, isDropped, isDragging, connectDragSource } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    return isDragging || isDropped ? (
      <div className={styles.boxgray}>
        <span title="已被选择">
          <Icon type="pushpin-o" /> {menuName}
        </span>
      </div>
    ) : (
      connectDragSource(
        <div style={{ ...style, opacity }} className={styles.boxhover}>
          {menuName}
        </div>
      )
    );
  }
}
