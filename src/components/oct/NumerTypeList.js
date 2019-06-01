/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Spin } from 'antd';
import { DEPARTMENTLEVEL } from '../../config/enums';
import HiatmpAuthorized from '../Authorized/HiatmpAuthorized';
import { ADDDEPT, UPDATEDEPT, DELETEDEPT } from '../../config/authconstant';
import styles from '../AccountManage/AccountInfo.less';
import DeviceUpload from './DeviceUpload';

class NumberTypeList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      DeviceUploadVisible: false, // 警员信息选择窗口
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  onPoliceInfoSelect = (police) => {
    const { form } = this.props;
    this.setState({ DeviceUploadVisible: false });
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

  showDeviceUpload = () => {
    this.setState({ DeviceUploadVisible: true });
  }

  render() {
    const { codeList, loading, excel } = this.props;
    const { DeviceUploadVisible } = this.state;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '序号',
        width: '5%',
        render: (text, record, index) => `${index + 1}`,
        align: 'center',
      }, {
        title: '所属路段',
        width: '10%',
        dataIndex: 'roadname',
        key: 'roadname',
        align: 'center',
      }, {
        title: '设备编号',
        width: '10%',
        dataIndex: 'deviceid',
        key: 'deviceid',
        align: 'center',
      }, {
        title: '设备位置',
        width: '23%',
        dataIndex: 'devicepos',
        key: 'devicepos',
        align: 'center',
      }, {
        title: '星期',
        width: '5%',
        dataIndex: '',
        key: '',
        align: 'center',
      }, {
        title: '总流量',
        width: '8%',
        dataIndex: 'cpn_total',
        key: 'cpn_total',
        align: 'center',
      }, {
        title: '川A车辆',
        width: '8%',
        dataIndex: 'cpn_sc_a',
        key: 'cpn_sc_a',
        align: 'center',
      }, {
        title: '省内异地',
        width: '4%',
        dataIndex: 'cpn_sc_not_a',
        key: 'cpn_sc_not_a',
        align: 'center',
      }, {
        title: '省外异地',
        width: '4%',
        dataIndex: 'cpn_not_sc',
        key: 'cpn_not_sc',
        align: 'center',
      }, {
        title: '川A出租',
        width: '4%',
        dataIndex: 'cpn_taix',
        key: 'cpn_taix',
        align: 'center',
      }, {
        title: '未识别',
        width: '5%',
        dataIndex: 'cpn_not',
        key: 'cpn_not',
        align: 'center',
      }, {
        title: '统计时段',
        width: '10%',
        dataIndex: 'platedate',
        key: 'platedate',
        align: 'center',
      }];
    const expandedRowRender = () => {
      const column = [
        { title: '时间段', dataIndex: 'platetime', key: 'platetime' },
        { title: '总流量', dataIndex: 'cpn_total', key: 'cpn_total' },
        { title: '川A车辆', dataIndex: 'cpn_sc_a', key: 'cpn_sc_a' },
        { title: '省内异地', dataIndex: 'cpn_sc_not_a', key: 'cpn_sc_not_a' },
        { title: '省外异地', dataIndex: 'cpn_not_sc', key: 'cpn_not_sc' },
        { title: '川A出租', dataIndex: 'cpn_taix', key: 'cpn_taix' },
      ];
      return (
        <Table
          columns={columns}
          dataSource={resultlist}
          pagination={false}
        />
      );
    };
    const {
      // loading,
      resultlist,
      pagination,
      onPageChange,
      onAdd,
      onDownload,
      onView,
      selectedKeys,
      changeSelected,
      currentId,
    } = this.props;
    // const rowSelection = {
    //   selectedRowKeys: selectedKeys,
    //   onChange: (selectedRowKeys) => {
    //     changeSelected(selectedRowKeys);
    //   },
    // };

    const ids = selectedKeys.join(',');
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={14}>
                <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ margin: '0 5px' }} disabled={(excel == null) || (!excel)} onClick={onDownload}><i className="table-right icon iconfont icon-export" />
                  批量导出
                </Button>
              </Col>
            </Row>
          </div>
          <Table
            className="components-table-demo-nested"
            columns={columns}
            rowClassName={
              (record, index) => {
                if (record.id === currentId) {
                  return 'selectedRow';
                } else {
                  return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                }
              }}
            // loading={loading}
            dataSource={resultlist}
            // rowSelection={rowSelection}
            pagination={pagination}
            expandedRowRender={expandedRowRender}
            onChange={onPageChange}
            onRow={(record) => {
              return {
                // onClick: () => onView(record),
              };
            }}
            locale={{ emptyText: '暂无数据' }}
            scroll={{ y: 550 }}
            rowKey="id"
          />
        </div>
        <div style={{ display: loading ? '' : 'none' }} className={styles.loadingDiv}>
          <Spin style={{ display: loading ? '' : 'none' }} tip="请稍候..." />
        </div>
        <DeviceUpload
          visible={DeviceUploadVisible}
          onClose={() => { this.setState({ DeviceUploadVisible: false }); }}
          onOk={this.onPoliceInfoSelect}
        />
      </div>
    );
  }
}
NumberTypeList.prototypes = {
  // loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  resultlist: PropTypes.array,
  selectedKeys: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  changeSelected: PropTypes.func,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  currentId: PropTypes.string,
  onDownload: PropTypes.func,
};
export default Form.create()(NumberTypeList);
