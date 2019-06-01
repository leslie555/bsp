import React from 'react';
import ProtoTypes from 'prop-types';
import { Button, Icon, Tree } from 'antd';

import Box from './Box';

import ItemTypes from './ItemTypes';
import { getMenuIcon } from '../utils/sectionPillUtils.js';

import styles from './configTree.less';

const { TreeNode } = Tree;

class LeftSecondConfigContainer extends React.Component {
  renderTreeNodes = data => {
    const { isDropped } = this.props;
    return data.map(item => {
      if (item.children && item.value.length <= 2) {
        return (
          <TreeNode
            icon={({ selected }) => getMenuIcon(item.label)}
            title={item.label}
            key={item.value}
            dataRef={item}
          >
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      } else if (item.children) {
        return (
          <TreeNode title={item.label} key={item.value} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }

      return (
        <TreeNode
          icon={
            <Box
              id={item.value}
              menuId={item.value}
              menuName={item.label}
              type={ItemTypes.MENU}
              isDropped={isDropped(item.label)}
              key={item.value}
            />
          }
          title={<span />}
          key={item.value}
          dataRef={item}
        />
      );
    });
  };

  render() {
    const { treeData } = this.props;

    return (
      <div className={styles.tree}>
        <Tree showIcon defaultExpandAll>
          {this.renderTreeNodes(treeData)}
        </Tree>
      </div>
    );
  }
}

LeftSecondConfigContainer.prototypes = {
  ContainerType: ProtoTypes.string,
};
LeftSecondConfigContainer.defaultProps = {
  ContainerType: 'right',
};
export default LeftSecondConfigContainer;
