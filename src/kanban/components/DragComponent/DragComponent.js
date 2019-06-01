/**
 * Created by Administrator on 2017/12/20 0020.
 */
import React, { Component } from 'react';
import { dragcomponentsB, dragcomponents4A } from '../../config/constant';
import ItemTypes from '../../layouts/ItemTypes';


export default class DragComponent extends React.Component {
  /* eslint-disable camelcase */
  /* eslint-disable import/no-dynamic-require */
  render() {
    const {
      component_id,
      componentName,
      position,
      type,
      nsize,
      index,
      handleAcomponentClick,
    } = this.props;
    const dragProps = { bigStyle: 'big', nsize, handleAcomponentClick };
    let SelectDragComponent = null;
    if (component_id && type == ItemTypes.AWORKBENCH) {
      SelectDragComponent = dragcomponents4A[component_id];
    } else if (component_id && type == ItemTypes.BWORKBENCH) {
      SelectDragComponent = dragcomponentsB[component_id];
    }
    const backgroundColor = ['blue', 'yellow', 'green', 'red'];
    return (
      <div>
        {component_id && type == ItemTypes.AWORKBENCH ? '' : ''}
        <SelectDragComponent {...dragProps} />
      </div>
    );
  }
}
