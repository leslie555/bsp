/**
 * Created by Administrator on 2018/7/12.
 * 设备分组统计查询最左侧的单选组
 */
/* eslint-disable */
import { Row, Tree, Table, Radio, Input } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';
import styles from '../menuManage/MenuManageList.less';
// const TreeNode2 = Tree.TreeNode;
const RadioGroup = Radio.Group;


class DeviceGroupStaList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedKeys: ['0'], // 展开节点
      value: 1,
    };

  }

  componentWillMount() {
  }

  componentDidMount() {
  }
  
  onExpend = (expandedKeys, epNode) => {
    this.setState({ expandedKeys });
  };

  // 最左侧的单选组的选中事件
  radioChange = (e) => {
    this.setState({
      value: e.target.value,
    });
    console.log(this.props);
    const value = e.target.value;
    const { onChange } = this.props; 
    onChange(value);
  }

  render() {
    const { currentId, onChange, } = this.props;
    const radioStyle = {
      display: 'block',
      height: '45px',
      lineHeight: '45px',
      paddingLeft: '40px',
    };
    // 最左侧的单选组的选中事件
    // radioChange = (e) => {
    //   console.log(this.props);
    //   const value = e.target.value;
    //   onChange(value);
    //   console.log('radio checked', e.target.value);
    //   this.setState({
    //     value: e.target.value,
    //   });
    // }
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className={styles.menuList}>
            <Row type="flex" justify="space-around" align="middle" className={styles.header}>统计查询</Row>
            <Row>
              <RadioGroup onChange={this.radioChange} value={this.state.value}>
                <Radio id="q1" style={radioStyle} value="0">采集设备统计</Radio>
                <Radio id="q2" style={radioStyle} value="1">机动车月均车速统计</Radio>
                <Radio id="q3" style={radioStyle} value="2">高峰期机动车通行效率</Radio>
                <Radio id="q4" style={radioStyle} value="3">早晚高峰断面流量统计</Radio>
                <Radio id="q5" style={radioStyle} value="4">日均机动车出行总数统计</Radio>
                <Radio id="q6" style={radioStyle} value="5">机动车日均出行频率统计</Radio>
                <Radio id="q7" style={radioStyle} value="6">机动车省内省外出行量统计</Radio>
              </RadioGroup>
              {/* <Table
                columns={columns}
                style={{ cursor: 'pointer' }}
                rowClassName={
                  (record, index) => {
                    if (record.id === currentId) {
                      return 'selectedRow';
                    } else {
                      return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                    }
                  }}
                dataSource={querylist}
                onRow={(record) => {
                  return {
                    // onClick: () => onView(record),
                  };
                }}
                locale={{ emptyText: '暂无数据' }}
                scroll={{ y: 550 }}
                rowKey="id"
              /> */}
          </Row>
          </div>
        </div>
      </div>
    );
  }
}
DeviceGroupStaList.propTypes = {
  menuList: PropTypes.array,
};
DeviceGroupStaList.defaultProps = {
  expandedKeys:['0'],
  menuList: [],
};
export default DeviceGroupStaList;