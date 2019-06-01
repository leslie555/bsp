/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Spin, Row, Col, Table, Icon, Button, message, Tree, Modal, Input } from 'antd';
import styles from '../AccountManage/AccountInfo.less';
import DeviceSelect from './common/DeviceSelect';
import FileUpload from './common/FileUpload';
import { addDeviceToGroup } from '../../services/octDeviceGroup';

const FormItem = Form.Item;

class GroupDevice extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceSelectVisible: false, // 设备信息选择窗口
      fileUploadVisible: false, // 上传窗口
      // expandedKeys: ['0'], // 展开节点
      // selectedKeys: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    // this.setState({
    //   selectedKeys: nextProps.idarr,
    //   isall: nextProps.isAll,
    // });
  }

  onSelectChange = (deviceid) => {
    const { changeSelected } = this.props;
    changeSelected(deviceid);
  }

  // 全选
  selectAll = (e) => {
    const { selectAll } = this.props;
    selectAll(e.target.name);
  }

  render() {
    const {
      flag,
      enumList,
      roadtree,
      devicelistsum,
      selectedKeys,
      isAll,
      form,
      onPageChange,
      All,
      loadings,
      Dpagination,
      devicelist,
      nodeInfo,
      dispatch,
    } = this.props;
    const {
      deviceSelectVisible,
      fileUploadVisible,
    } = this.state;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
      style: { height: '30px' },
    };
    const { getFieldDecorator } = form;
    // 列表
    const columns = [
      {
        title: '设备id',
        width: '30%',
        dataIndex: 'deviceid',
        key: 'deviceid',
        align: 'center',
      },
      {
        title: '设备名称',
        width: '70%',
        dataIndex: 'devicename',
        key: 'devicename',
        align: 'center',
      },
    ];
    const rowSelection = {
      selectedRowKeys: selectedKeys,
      onChange: this.onSelectChange,
    };
    const ids = selectedKeys.join(',');
    // console.log('ids:', ids);
    console.log('selectedKeys:', selectedKeys.length);
    console.log('devicelist:', devicelist.length);
    return (
      <div>
        <div>
          分组设备 共<span className="allNumLight">{devicelist.length}</span> 个
          <Button type="primary" name={All()} onClick={(e) => this.selectAll(e)} style={{ margin: '5px 5px', visibility: flag === '2' ? 'hidden' : 'visible' }}><i className="table-right icon iconfont " />{All()}</Button>
          <span style={{ visibility: flag === '2' ? 'hidden' : 'visible' }}>已选择<span className="allNumLight">{selectedKeys.length}</span>个设备</span>
        </div>
        <Table
          rowKey="deviceid"
          columns={columns}
          loading={loadings}
          // scroll={{ y: 550 }}
          dataSource={devicelist}
          pagination={Dpagination}
          onChange={onPageChange}
          rowSelection={rowSelection}
          locale={{ emptyText: '暂无数据' }}
          rowClassName={
            (record, index) => {
              return index % 2 === 0 ? 'tableoddRow' : 'tableeevenRow';
            }}
          onRow={(record) => {
            return {
              // onClick: () => onView(record),
            };
          }}
        />
        <div style={{ display: loadings ? '' : 'none' }} className={styles.loadingDiv}>
          <Spin style={{ display: loadings ? '' : 'none' }} tip="请稍候..." />
        </div>
      </div>
    );
  }
}
GroupDevice.prototypes = {
  groupinfo: PropTypes.object,
};

export default Form.create()(GroupDevice);
