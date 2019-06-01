/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Spin, notification } from 'antd';
import styles from '../AccountManage/AccountInfo.less';
import CarRecordSelect from './common/CarRecordSelect';
import { PSFX, PLATE_TYPE, CARTYPE, NUMCOLOR } from '../../config/enums';
import { queryVehicleRecordByDetail } from '../../services/octCarRecord';

class CarRecordList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceSelectVisible: false, // 警员信息选择窗口
      entity: {}, // 选择弹框的记录
      detailLoading: false, // 按钮是否加载loading效果
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  onCarRecordInfoSelect = () => {
    this.setState({ deviceSelectVisible: false });
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

  // // 截取字符串
  // getLuDuan(value) {
  //   const { enumList } = this.props;
  //   let a = value;
  //   if (a.length > 22) {
  //     a = ''.concat(a.substr(0, 21), '...');
  //   }
  //   return a;
  // }

  showCarRecordSelect = (record) => {
    // this.setState({
    //   detailLoading: true,
    // });
    console.log(record);
    // queryVehicleRecordByDetail({ id: record.id }).then((data) => {
    //   console.log(data);
    //   if (data && data.result) {
    //     console.log(data.model);
    //     this.setState({
    //       entity: { ...record, ...data.model },
    //       deviceSelectVisible: true,
    //       detailLoading: false,
    //     });
    //   }
    // }).catch((err) => {
    //   notification.error({ message: `查询出错：${JSON.stringify(err)}` });
    //   this.setState({
    //     detailLoading: false,
    //   });
    // });
    this.setState({
      entity: { ...record },
      deviceSelectVisible: true,
      // detailLoading: false,
    });
  }

  showDeviceUpload = () => {
  }

  sorter= () => {
  }

  render() {
    const { codeList, loading } = this.props;
    const { deviceSelectVisible, entity, detailLoading } = this.state;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '序号',
        width: '3%',
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
        dataIndex: 'cap_address',
        key: 'cap_address',
        align: 'center',
      }, {
        title: '行驶方向',
        width: '7%',
        dataIndex: 'direction',
        key: 'direction',
        align: 'center',
        render: (text) => {
          // const result = text.toString();
          return (<span>{this.getEnumValue(PSFX, text)}</span>);
        },
      }, {
        title: '车道',
        width: '5%',
        dataIndex: 'laneno',
        key: 'laneno',
        align: 'center',
      }, {
        title: '车牌号码',
        width: '10%',
        dataIndex: 'ori_plate_no',
        key: 'ori_plate_no,',
        align: 'center',
      }, {
        title: '车辆类型',
        width: '6%',
        dataIndex: 'vehicle_type',
        key: 'vehicle_type,',
        align: 'center',
        render: (text) => {
          const result = text.toString();
          return (<span>{this.getEnumValue(CARTYPE, result)}</span>);
        },
      }, {
        title: '车牌颜色',
        width: '6%',
        dataIndex: 'ori_plate_color',
        key: 'ori_plate_color,',
        align: 'center',
        render: (text) => {
          return (
            <span>
              {this.getEnumValue(NUMCOLOR, text)}
            </span>
          );
        },
      }, {
        title: '过车时间',
        width: '12%',
        dataIndex: 'dcollectiondate',
        key: 'dcollectiondate,',
        align: 'center',
      }, {
        title: '记录详情查看',
        width: '8%',
        // dataIndex: 'picname1',
        // key: 'picname1',
        align: 'center',
        render: (text, record) => {
          return (
            <span>
              <Button
                shape="circle"
                icon="search"
                loading={detailLoading}
                onClick={() => this.showCarRecordSelect(record)}
              />
            </span>
          );
        },
      }];
    const {
      resultlist,
      pagination,
      onDownload,
      onDownloadPic,
      currentId,
      onPageChange,
      enumList,
    } = this.props;
    const carSelectProp = {
      enumList,
      entity,
      visible: deviceSelectVisible,
      onClose: () => { this.setState({ deviceSelectVisible: false }); },
      onOk: () => { this.onCarRecordInfoSelect(); },
    };
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
                <Button type="primary" style={{ margin: '0 5px 0 40px' }} disabled={(pagination.total == null) || (pagination.total <= 0)} onClick={onDownloadPic}><i className="table-right icon iconfont icon-export" />导出图片</Button>
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
              }}
            // // loading={loading}
            // // rowSelection={rowSelection}
            onChange={onPageChange}
            pagination={pagination}
            onRow={(record) => {
              return {
                // onClick: () => onView(record),
              };
            }}
            locale={{ emptyText: '暂无数据' }}
            scroll={{ y: 550 }}
          />
          <CarRecordSelect {...carSelectProp} />
        </div>
        <div style={{ display: loading ? '' : 'none' }} className={styles.loadingDiv}>
          <Spin style={{ display: loading ? '' : 'none' }} tip="请稍候..." />
        </div>
      </div>
    );
  }
}
CarRecordList.prototypes = {
  // loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  resultlist: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onView: PropTypes.func,
  currentId: PropTypes.string,
  onDownload: PropTypes.func,
};
export default Form.create()(CarRecordList);
