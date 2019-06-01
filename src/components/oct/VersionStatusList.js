/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Spin, notification } from 'antd';
import { ENUM_ILLEGAL } from '../../config/enums';
// import BreakSelect from './BreakSelect';

class VersionStatusList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false, // 详情窗口
      detailLoading: false, // 按钮是否加载loading效果
      entity: {}, // 选择弹框的记录
    };
    this.getEnumValue = this.getEnumValue.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
  }

  onBreakInfoSelect = () => {
    this.setState({ visible: false });
  }

  // 根据枚举值获取枚举名
  getEnumValue(enumtypeid, enumvalue) {
    const { enumList } = this.props;
    for (let i = 0; i < enumList.length; i += 1) {
      const enumObj = enumList[i];
      if (enumObj.enumtypeid === enumtypeid && enumObj.enumvalue === enumvalue) {
        return enumObj.enumname;
      }
    }
  }

  // 截取字符串
  getPicture(value) {
    const { enumList } = this.props;
    let a = value;
    if (a.length > 8) {
      a = ''.concat(a.substr(0, 7), '...');
    }
    return a;
  }


  showBreakSelect = (record) => {
    // console.log(record);
    this.setState({
      entity: record,
      visible: true,
    });
  };

  showDeviceUpload = () => {
  }

  render() {
    const {
      codeList,
      enumList,
      loading,
      columns,
      showV,
      ModifyConfig,
      resultlist,
      pagination,
      onPageChange,
      currentId,
    } = this.props;
    const { visible, entity, detailLoading } = this.state;

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={14}>
                <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ margin: '0 5px' }}>升级</Button>
                <Button type="primary" style={{ margin: '0 5px' }} onClick={ModifyConfig}>修改配置文件</Button>
              </Col>
            </Row>
          </div>
          <Table
            rowKey="id"
            dataSource={resultlist}
            columns={columns}
            rowClassName={
              (record, index) => {
                if (record.id === currentId) {
                  return 'selectedRow';
                } else {
                  return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                }
              }
            }
            loading={loading}
            // // rowSelection={rowSelection}
            onChange={onPageChange}
            pagination={pagination}
            onRow={(record) => {
              return {
                // onClick: () => this.onView(record),
              };
            }}
            locale={{ emptyText: '暂无数据' }}
            scroll={{ y: 550 }}
          />
        </div>
        <div style={{ display: loading ? '' : 'none' }}>
          <Spin style={{ display: loading ? '' : 'none' }} tip="请稍候..." />
        </div>
      </div>
    );
  }
}
VersionStatusList.prototypes = {
  // loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  resultlist: PropTypes.array,
  selectedKeys: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  changeSelected: PropTypes.func,
  onView: PropTypes.func,
  currentId: PropTypes.string,
  onDownload: PropTypes.func,
};
export default Form.create()(VersionStatusList);
