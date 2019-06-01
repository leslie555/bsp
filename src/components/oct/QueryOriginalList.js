/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Spin, Tooltip } from 'antd';
import styles from '../DictionaryManage/DictionaryInfo.less';
import { DIRECTION, PSFX } from '../../config/enums';


class QueryOriginalList extends React.Component {
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

  // 截取字符串
  getPicture(value) {
    const { enumList } = this.props;
    let a = value;
    if (a.length > 2) {
      a = ''.concat(a.substr(0, 2), '');
    }
    return a;
  }

  showDeviceUpload = () => {
    // this.setState({ displayName: 'block' });
  }

  render() {
    const { codeList, loading } = this.props;
    const { DeviceUploadVisible, src } = this.state;
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
        align: 'center',
        render: (text, record, index) => `${index + 1}`,
      }, {
        title: '路段',
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
        width: '25%',
        dataIndex: 'deviceaddress',
        key: 'deviceaddress',
        align: 'center',
        render: (text) => {
          return (
            <div className={styles.textOverflow}>
              <Tooltip title={text} placement="topLeft">
                <span>{text}</span>
              </Tooltip>
            </div>
          );
        },
        // }, {
        //   title: '方向',
        //   width: '10%',
        //   dataIndex: 'direction',
        //   key: 'direction',
        //   align: 'center',
        //   render: (text) => {
        //     return (<span>{this.getEnumValue(PSFX, text)}</span>);
        //   },
      }, {
        title: '统计时间',
        width: '10%',
        dataIndex: 'detection_time',
        key: 'detection_time',
        align: 'center',
      }, {
        title: '车道',
        width: '5%',
        dataIndex: 'lane_no',
        key: 'lane_no',
        align: 'center',
      }, {
        title: '总流量',
        width: '5%',
        dataIndex: 'total_flow',
        key: 'total_flow',
        align: 'center',
      }, {
        title: '大车',
        width: '5%',
        dataIndex: 'vehicle_flow1',
        key: 'vehicle_flow1',
        align: 'center',
      },
      // {
      //   title: '中车',
      //   width: '5%',
      //   dataIndex: 'vehicle_flow2',
      //   key: 'vehicle_flow2',
      //   align: 'center',
      // },
      {
        title: '小车',
        width: '5%',
        dataIndex: 'vehicle_flow3',
        key: 'vehicle_flow3',
        align: 'center',
      }, {
        title: '其他',
        width: '5%',
        dataIndex: 'vehicle_flow_other',
        key: 'vehicle_flow_other',
        align: 'center',
      }, {
        title: '车速',
        width: '5%',
        dataIndex: 'speed',
        key: 'speed',
        align: 'center',
      }, {
        title: '占用率',
        width: '5%',
        dataIndex: 'avgshare',
        key: 'avgshare',
        align: 'center',
      }];

    const {
      // loading,
      resultlist,
      pagination,
      onPageChange,
      onAdd,
      onDownload,
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

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={14}>
                <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div>
              </Col>
              <Col span={8} style={{ textAlign: 'right' }}>
                <Button type="primary" style={{ margin: '0 5px' }} disabled={(pagination.total == null) || (pagination.total <= 0)} onClick={onDownload}><i className="table-right icon iconfont icon-export" />批量导出</Button>
              </Col>
            </Row>
          </div>
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
            loading={loading}
            dataSource={resultlist}
            // rowSelection={rowSelection}
            pagination={pagination}
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
        {/* <div style={{ display: loading ? '' : 'none' }} className={styles.loadingDiv}>
          <Spin style={{ display: loading ? '' : 'none' }} tip="请稍候..." />
        </div> */}
      </div>
    );
  }
}
QueryOriginalList.prototypes = {
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
export default Form.create()(QueryOriginalList);
