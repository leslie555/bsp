/**
 * Created by Administrator on 2018/7/12.
 * 设备分组统计查询最右边的组件
 */
/* eslint-disable */
import { Row, Tree, Table } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styles from '../menuManage/MenuManageList.less';
const TreeNode2 = Tree.TreeNode;



class DeviceGroupStaQuery extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: ['0'], // 展开节点
    };

  }

  componentWillMount() {
  }

  componentDidMount() {
  }
  
  onExpend = (expandedKeys, epNode) => {
    this.setState({ expandedKeys });
  };


  render() {
    const {
      currentId,
      resultlist,
    } = this.props;
    const columns = [
    {
      title: '分组名称',
      width: '50%',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    }, {
      title: '分组描述',
      width: '50%',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
    }];

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className={styles.menuList}>
            <Row type="flex" justify="space-around" align="middle" className={styles.header}>当前有效的设备分组</Row>
            <Row>
              <Table
                columns={columns}
                rowClassName={
                  (record, index) => {
                    if (record.id === currentId) {
                      return 'selectedRow';
                    } else {
                      return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                    }
                  }}
                dataSource={resultlist}
                onRow={(record) => {
                  return {
                    // onClick: () => onView(record),
                  };
                }}
                locale={{ emptyText: '暂无数据' }}
                scroll={{ y: 550 }}
                rowKey="id"
              />
            </Row>
          </div>
        </div>
      </div>
    );
  }
}
DeviceGroupStaQuery.propTypes = {
  menuList: PropTypes.array,
};
DeviceGroupStaQuery.defaultProps = {
  expandedKeys:['0'],
  menuList: [],
};
export default DeviceGroupStaQuery;
