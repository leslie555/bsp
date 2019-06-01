/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Spin, notification } from 'antd';
import styles from '../AccountManage/AccountInfo.less';
// import CellectionReportListSelect from './common/cellectionReportListSelect';
import { TRAFFIC, DIRECTION } from '../../config/enums';
import ModalWord from './collectionReportModal';
import FileUpload from './common/FileUpload';

class CollectionReportList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false, // 详细信息选择窗口
      detailLoading: false, // 按钮是否加载loading效果
      UploadVisible: false, // 批量导入
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  // 上传文件弹框的确定按钮
  onPoliceInfoSelect = (police) => {
    const { form } = this.props;
    this.setState({ UploadVisible: false });
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

  // 批量导入
  showDeviceUpload = () => {
    this.setState({ UploadVisible: true });
  }

  handleSave() {
    this.setState({ modalVisible: true });
  }

  render() {
    const {
      codeList,
      loading,
      devicelistsum,
      imgvideo,
      getImgVideo,
      enumList,
      resultlist,
      pagination,
      onDownload,
      currentId,
      onPageChange,
      menuList,
      expandedKeys,
      devicelist,
      dispatch,
      loadings,
    } = this.props;
    const { deviceid } = resultlist;
    const { modalVisible, detailLoading, UploadVisible } = this.state;
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '设备编号',
        dataIndex: 'deviceid',
        key: 'deviceid',
        align: 'center',
        width: '9%',
      },
      {
        title: '质量评价指标',
        children: [
          {
            title: '车辆图像捕获率≥95%',
            dataIndex: 'ratio_buhuo',
            key: 'ratio_buhuo',
            align: 'center',
            width: '9%',
          },
          {
            title: '号牌识别准确率≥95%',
            dataIndex: 'ratio_shibie',
            key: 'ratio_shibie',
            align: 'center',
            width: '9%',
          },

          {
            title: '事件监测准确率≥95%',
            dataIndex: 'ratio_shijian',
            key: 'ratio_shijian',
            align: 'center',
            width: '9%',
          },
          {
            title: '无牌率<5%',
            dataIndex: 'ratio_wupai',
            key: 'ratio_wupai',
            align: 'center',
            width: '9%',
          },
          {
            title: '上传率>95%',
            dataIndex: 'ratio_shangchuan',
            key: 'ratio_shangchuan',
            align: 'center',
            width: '9%',
          },
          {
            title: '流量过车差异率<5%',
            dataIndex: 'ratio_chayi',
            key: 'ratio_chayi',
            align: 'center',
            width: '9%',
          },
          {
            title: '速度异常率<1%',
            dataIndex: 'ratio_sudu',
            key: 'ratio_sudu',
            align: 'center',
            width: '9%',
          },
          {
            title: '非号牌规则率<5%',
            dataIndex: 'ratio_feihaopai',
            key: 'ratio_feihaopai',
            align: 'center',
            width: '9%',
          },
        ],
      },
      {
        title: '检测日期',
        width: '9%',
        dataIndex: 'checkdate',
        key: 'checkdate',
        align: 'center',
      },
    ];
    const FileUploadprops = {
      name: 'file',
      action: '/HiatmpPro/bsp/devicecheck/excelToData',
      showUploadList: true,
      accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
      downloadTemplate: '/HiatmpPro/bsp/devicecheck/downloadModel',
      width: '60%',
    };
    const modalProps = {
      menuList,
      devicelist,
      expandedKeys,
      dispatch,
      loadings,
      onClose: () => {
        this.setState({ modalVisible: false });
      },
      devicelistsum,
      columns,
    };
    return (
      <div className="outline-out">
        <div className="outline-inner">
          <div className="outline-inner-padding">
            <Row>
              <Col span={18}>
                <div>搜索结果 共<span className="allNumLight">{pagination.total}</span> 条</div>
              </Col>
              {/* <Col span={2}>
                <Button type="primary" onClick={() => this.handleSave()}>生成报告</Button>
              </Col> */}
              <Col span={2}>
                <Button type="primary" onClick={this.showDeviceUpload}>批量导入</Button>
              </Col>
              <Col span={2}>
                <Button type="primary" onClick={onDownload}>导出excel</Button>
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
            // loading={loading}
            // rowSelection={rowSelection}
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
          {modalVisible ? <ModalWord {...modalProps} /> : null}
        </div>
        <div style={{ display: loading ? '' : 'none' }} className={styles.loadingDiv}>
          <Spin style={{ display: loading ? '' : 'none' }} tip="请稍候..." />
        </div>
        <FileUpload
          visible={UploadVisible}
          onClose={() => { this.setState({ UploadVisible: false }); }}
          onOk={this.onPoliceInfoSelect}
          onChange={this.onChange}
          {...FileUploadprops}
        />
      </div>
    );
  }
}
CollectionReportList.prototypes = {
  // loading: PropTypes.bool,
  enumList: PropTypes.array.isRequired,
  resultlist: PropTypes.array,
  pagination: PropTypes.object,
  onPageChange: PropTypes.func,
  onView: PropTypes.func,
  currentId: PropTypes.string,
};
export default Form.create()(CollectionReportList);
