/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button } from 'antd';

class DayFrequencyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  onPoliceInfoSelect = (police) => {
    // const { form } = this.props;
    // this.setState({ DeviceUploadVisible: false });
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

  showDeviceUpload = () => {
    // this.setState({ displayName: 'block' });
  }

  render() {
    const { codeList, dayavg } = this.props;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '日期',
        width: '15%',
        dataIndex: 'collection_date',
        key: 'collection_date,',
        align: 'center',
        render: (value, row, index) => {
          const obj = {
            children: value,
            props: {},
          };
          // if (index === 0) {
          //   obj.props.rowSpan = index;
          // } else {
          //   obj.props.rowSpan = 0;
          // }
          console.log(index);
          return obj;
        },
      }, {
        title: '时间',
        width: '10%',
        dataIndex: 'ctime',
        key: 'ctime',
        align: 'center',
        render: (value, row, index) => {
          if (dayavg) {
            return value;
          } else {
            return '--';
          }
        },
      }, {
        title: '区域',
        width: '15%',
        dataIndex: 'groupname',
        key: 'groupname',
        align: 'center',
      }, {
        title: '川A籍车辆',
        width: '15%',
        dataIndex: 'scaacount',
        key: 'scaacount',
        align: 'center',
        render: (text, record) => (
          <span>
            {text} 次/日
          </span>
        ),
      }, {
        title: '非川A籍车辆',
        width: '15%',
        dataIndex: 'notscaacount',
        key: 'notscaacount',
        align: 'center',
        render: (text, record) => (
          <span>
            {text} 次/日
          </span>
        ),
      }, {
        title: '设备总数',
        width: '15%',
        dataIndex: 'alldevice',
        key: 'alldevice',
        align: 'center',
        render: (text, record) => (
          <span>
            {text} 套
          </span>
        ),
      }, {
        title: '在线数量',
        width: '15%',
        dataIndex: 'okdevice',
        key: 'okdevice',
        align: 'center',
        render: (text, record) => (
          <span>
            {text} 套
          </span>
        ),
      }];
    const {
      loading,
      excel,
      resultlist,
      onPageChange,
      onDownload,
      onAdd,
      selectedKeys,
      changeSelected,
      currentId,
    } = this.props;
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: (selectedRowKeys) => {
        changeSelected(selectedRowKeys);
      },
    };

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={14}>
                {/* <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div> */}
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
            onChange={onPageChange}
            onRow={(record) => {
              return {
                // onClick: () => onView(record),
              };
            }}
            locale={{ emptyText: '暂无数据' }}
            scroll={{ y: 550 }}
            bordered
            rowKey={(record, index) => `${record.deviceid}${index + 1}`}
          />
        </div>
      </div>
    );
  }
}
DayFrequencyList.prototypes = {
  loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  resultlist: PropTypes.array,
  selectedKeys: PropTypes.array,
  onPageChange: PropTypes.func,
  changeSelected: PropTypes.func,
  onView: PropTypes.func,
  onEdit: PropTypes.func,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  currentId: PropTypes.string,
  onDownload: PropTypes.func,
};
export default Form.create()(DayFrequencyList);
