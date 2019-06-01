import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource, DropTarget } from 'react-dnd';
import { Icon, Tooltip, Badge } from 'antd';
import ItemTypes from './ItemTypes';
import { getBackgroundColor, getContainerTip } from '../utils/dragUtils';

const style = {
  border: '1px dashed gray',
  height: '2.5rem',
  width: '96%',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  padding: '0.5rem 6px',
  textAlign: 'center',
  fontSize: '16px',
  lineHeight: 'normal',
  float: 'left',
};
const dustbinSource = {
  beginDrag(props) {
    const { id, index } = props;
    return { id, index };
  },
};

/* eslint-disable   react/no-unused-prop-types */

const dustbinTarget = {
  drop(props, monitor) {
    const { onDrop } = props;
    onDrop(monitor.getItem());
  },
  canDrop(props, monitor) {
    const { lastDroppedItem = false } = props;
    return !lastDroppedItem;
  },
};
/* eslint-disable   react/destructuring-assignment */
@DropTarget(props => props.accepts, dustbinTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))
@DragSource(ItemTypes.MENU, dustbinSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
  dragDustbin: monitor.getItem(),
}))
export default class Dustbin extends Component {
  static propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    index: PropTypes.number.isRequired,
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    accepts: PropTypes.arrayOf(PropTypes.string).isRequired,
    lastDroppedItem: PropTypes.object,
    onDrop: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    id: PropTypes.any.isRequired,
    // moveDustbin: PropTypes.func.isRequired,
  };

  static defaultProps = {
    lastDroppedItem: {},
  };

  deleteMenu = () => {
    this.props.onMenuDeleteCallback(this.props.index, this.props.lastDroppedItem.name);
  };

  render() {
    const {
      accepts,
      isOver,
      canDrop,
      isDragging,
      connectDragSource,
      connectDropTarget,
      lastDroppedItem,
    } = this.props;

    const opacity = isDragging ? 0 : 1;
    const backgroundColor = getBackgroundColor(isOver, canDrop);

    return connectDropTarget(
      <div>
        <div style={{ ...style, backgroundColor, opacity }}>
          {lastDroppedItem == null ? (
            ''
          ) : (
            <Tooltip title="删除">
              <Icon
                type="minus-circle"
                style={{
                  zIndex: 10,
                  color: 'red',
                  float: 'right',
                  width: '10px',
                  height: '10px',
                  cursor: 'pointer',
                }}
                onClick={this.deleteMenu}
              />
            </Tooltip>
          )}
          <span
            style={{ width: '100px', fontSize: '17px', display: 'inline-block' }}
            className="ellipsis"
          >
            {getContainerTip(isOver, canDrop, lastDroppedItem, '请添加')}
            {lastDroppedItem && <p>{lastDroppedItem.name}</p>}
          </span>
        </div>
      </div>
    );
  }
}
