import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { Icon, Tooltip } from 'antd';
import ItemTypes from './ItemTypes';

import { getBackgroundColor, getContainerTip } from '../utils/dragUtils';
import { dragcomponents4A } from '../config/constant';

const style = {
  height: '10rem',
  width: '16%',
  marginRight: '2%',
  marginLeft: '2%',
  marginBottom: '1rem',
  marginTop: '0.5rem',
  color: '#999',
  textAlign: 'center',
  padding: '1rem',
  fontSize: '1rem',
  lineHeight: '8rem',
  float: 'left',
};
const adustbinSource = {
  beginDrag(props) {
    const { id, index } = props;
    return {
      id,
      index,
    };
  },
};

const adustbinTarget = {
  drop(props, monitor) {
    const { onDrop } = props;
    onDrop(monitor.getItem());
  },
  canDrop(props, monitor) {
    const { lastDroppedItem = false } = props;
    return !lastDroppedItem;
  },
};

/* eslint-disable no-unused-expressions */
/* eslint-disable   react/destructuring-assignment */
/* eslint-disable   react/no-unused-prop-types */
/* eslint-disable   import/no-dynamic-require */

@DropTarget(props => props.accepts, adustbinTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
@DragSource(ItemTypes.AWORKBENCH, adustbinSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  dragDustbin: monitor.getItem(),
}))
export default class Adustbin extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    handleAcomponentClick: PropTypes.func.isRequired, // A区域点击打开tabs页面回调
    index: PropTypes.number.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
    lastDroppedItem: PropTypes.object,
    isDragging: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    lastDroppedItem: {},
  };

  deleteAWorkbench = () => {
    const { onAboxDeleteCallback } = this.props;
    onAboxDeleteCallback(this.props.index, this.props.lastDroppedItem);
  };

  render() {
    const {
      accepts,
      isOver,
      canDrop,
      isDragging,
      connectDropTarget,
      lastDroppedItem,
      index,
      handleAcomponentClick,
    } = this.props;
    const opacity = isDragging ? 0 : 1;
    const backgroundColor = getBackgroundColor(isOver, canDrop);
    let DragComponent = null;
    if (lastDroppedItem) {
      try {
        DragComponent = dragcomponents4A[lastDroppedItem];
      } catch (e) {
        console.log(` DragComponent无对应组件  lastDroppedItem:${lastDroppedItem} `);
      }
    }
    return connectDropTarget(
      <div>
        <div style={{ ...style, backgroundColor, opacity }}>
          {lastDroppedItem == null ? (
            ''
          ) : (
            <Tooltip title="删除">
              <Icon
                type="minus-circle"
                style={{ float: 'right', width: '10px', height: '10px', margin: '-13px -8px 0 0' }}
                onClick={this.deleteAWorkbench}
              />
            </Tooltip>
          )}
          {getContainerTip(isOver, canDrop, lastDroppedItem, 'A区域请添加')}
          {lastDroppedItem && (
            <div style={{ marginTop: '10px', textAlign: 'left', position: 'relative' }}>
              <DragComponent handleAcomponentClick={handleAcomponentClick} />
            </div>
          )}
        </div>
      </div>
    );
  }
}
