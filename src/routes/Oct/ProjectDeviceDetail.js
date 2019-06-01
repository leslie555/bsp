import React from 'react';
import { connect } from 'dva';
import { Modal, message, Row, Col } from 'antd';
import Search from '../../components/oct/common/historysearch';
import List from '../../components/oct/common/ProjectDeviceDetailList';
import ListSelect from '../../components/oct/common/ProjectDeviceDetailSelect';
import { TRAFFIC, SSXM, MAINTENAN_UNIT, SGDW } from '../../config/enums';

const { confirm } = Modal;

class ProjectDeviceDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      currentId: '', // 当前选中行的设备Id
      detailevisible: false, // 详情模态框默认不显示
      entry: {},
      flag: '',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'octProjectDeviceDetail/queryProjectDeviceDetail',
      payload: {},
    });
    dispatch({
      type: 'octCollectionReport/querydevicegroup',
      payload: {},
    });
  }

  // 获取枚举值
  handleEnumOption(enumsid, value) {
    const options = [];
    console.log(enumsid);
    const { common } = this.props;
    const { enumList, codeList } = common;
    if (enumsid) {
      for (let i = 0; i < enumList.length; i += 1) {
        if (enumList[i].enumtypeid === (enumsid || '') && enumList[i].enumvalue === value) {
          return `${enumList[i].enumname}`;
        }
      }
    }
  }

  showdetailevisible(record) {
    const { dispatch } = this.props;
    const { name, time } = record;
    const { detailevisible, entry } = this.state;
    this.setState({
      detailevisible: true,
      entry: record,
    });
    console.log(record);
    dispatch({
      type: 'octProjectDeviceDetail/queryDetails',
      payload: {
        obj1: {
          project_id: name,
          time,
        },
        pagination: {
          current: 1,
          pageSize: 10,
          total: 0,
        },
      },
    });
  }

  render() {
    const { octProjectDeviceDetail, octCollectionReport, common, dispatch, loading } = this.props;
    const { detailevisible, entry, flag } = this.state;
    const { treeData } = octCollectionReport;
    const {
      obj1,
      pagination,
      resultlist,
      dataSource,
      // treeData,
      imglist,
      queryobj,
    } = octProjectDeviceDetail;
    const { enumList, codeList } = common;
    const { selectedKeys, currentId } = this.state;
    const myThis = this;
    const searchprops = {
      title: '采集设备检测详情',
      queryobj,
      enumList,
      dataSource,
      treeData,
      visible: false,
      onSearch: (query) => {
        const page = { ...pagination, current: 1 };
        dispatch({
          type: 'octProjectDeviceDetail/queryProjectDeviceDetail',
          payload: { queryobj: { ...queryobj, ...query }, pagination: page },
        });
      },
    };
    const listprops = {
      columns: [
        {
          title: '项目名称',
          width: '17%',
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          render: (value) => {
            if (value == 0) {
              return '未知';
            }
            return (
              <span>
                {this.handleEnumOption(SSXM, value)}
              </span>
            );
          },
        }, {
          title: '接入平台数',
          width: '17%',
          align: 'center',
          dataIndex: 'access',
          key: 'access',
        }, {
          title: '运行正常数',
          width: '17%',
          align: 'center',
          dataIndex: 'normal',
          key: 'normal',
        }, {
          title: '完全符合指标数',
          width: '17%',
          dataIndex: 'countsmall',
          key: 'countsmall',
          align: 'center',
          render: (text, record) => {
            console.log(record);
            return `${record.normal}` - `${record.bufuhe}`;
          },
        }, {
          title: '不完全符合指标数',
          width: '17%',
          dataIndex: 'bufuhe',
          key: 'bufuhe',
          align: 'center',
          render: (text, record) => {
            return <a onClick={() => this.showdetailevisible(record)}>{text}</a>;
          },
        }, {
          title: '时间',
          width: '15%',
          dataIndex: 'time',
          key: 'time',
          align: 'center',
        },
      ],
      imglist,
      pagination,
      currentId,
      resultlist,
      enumList,
      loading,
      showSet: () => {
        this.setState({
          detailevisible: true,
          flag: '1',
        });
      },
      onSearch: (value) => {
        dispatch({
          type: 'octProjectDeviceDetail/queryMenuList',
          payload: {
            value,
            pagination: { ...pagination, current: 1, pageSize: 10 },
          },
        });
      },
      onPageChange: (page) => {
        dispatch({
          type: 'octProjectDeviceDetail/queryDevice',
          payload: {
            obj1,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
        this.setState({
          selectedKeys: [],
        });
      },
      changeSelected: (keys) => {
        this.setState({
          selectedKeys: keys,
        });
      },
      onDownload: (record) => {
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/devicedetails/downloadFile';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
        inputElement.value = JSON.stringify(obj1);
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);
        console.log(inputElement.value);
        if (pagination.total < 1000) {
          formElement.submit();
          document.body.removeChild(formElement);
        } else if (pagination.total < 100000) {
          confirm({
            title: '导出确认',
            content: '由于数据量很大导出需要一定时间，确认导出？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
              formElement.submit();
              document.body.removeChild(formElement);
            },
            onCancel() {
              // alert('操作取消');
            },
          });
        } else {
          message.warning('数据大于100000条,禁止导出');
        }
      },
    };
    const ListSelectprops = {
      columns: [
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
      ],
      // title: `${this.handleEnumOption(SSXM, entry.name)}不完全符合指标详情`,
      title: `${entry.name == 0 ? '未知项目不完全符合指标详情' : `${this.handleEnumOption(SSXM, entry.name)}不完全符合指标详情`}`,
      onCancel: () => {
        this.setState({
          detailevisible: false,
          flag: '',
        });
      },
      onSave: (value) => {
        this.setState({
          detailevisible: false,
          flag: '',
        });
        dispatch({
          type: 'octProjectDeviceDetail/queryProjectDeviceDetail',
          payload: { value },
        }).then(() => { message.success('操作成功!'); });
      },
      onPageChange: (page) => {
        dispatch({
          type: 'octProjectDeviceDetail/queryDetails',
          payload: {
            obj1,
            pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
          },
        });
      },
      onDownload: () => {
        console.log(obj1);
        const formElement = document.createElement('form');
        formElement.style.display = 'display:none;';
        formElement.method = 'post';
        formElement.action = '/HiatmpPro/bsp/devicedetails/downloadFile';
        formElement.target = 'callBackTarget';
        const inputElement = document.createElement('input');
        inputElement.type = 'hidden';
        inputElement.name = 'params';
        inputElement.value = JSON.stringify(obj1);
        formElement.appendChild(inputElement);
        document.body.appendChild(formElement);
        console.log(inputElement.value);
        if (pagination.total < 1000) {
          formElement.submit();
          document.body.removeChild(formElement);
        } else if (pagination.total < 100000) {
          confirm({
            title: '导出确认',
            content: '由于数据量很大导出需要一定时间，确认导出？',
            okText: '确定',
            cancelText: '取消',
            onOk() {
              formElement.submit();
              document.body.removeChild(formElement);
            },
            onCancel() {
              // alert('操作取消');
            },
          });
        } else {
          message.warning('数据大于100000条,禁止导出');
        }
      },
      detailevisible,
      dispatch,
      entry,
      dataSource,
      pagination,
      flag,
      obj1,
    };
    return (
      <div>
        <Row>
          <Col span={24} style={{ width: '100%', paddingTop: '0' }}>
            <Search {...searchprops} />
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ width: '100%', paddingTop: '0' }}>
            <List {...listprops} />
          </Col>
        </Row>
        {detailevisible ? <ListSelect {...ListSelectprops} /> : null}
      </div>
    );
  }
}
function mapStateToProps({ octProjectDeviceDetail, octCollectionReport, common, loading }) {
  return ({
    octProjectDeviceDetail,
    octCollectionReport,
    common,
    loading: loading.models.octProjectDeviceDetail,
  });
}
export default connect(mapStateToProps)(ProjectDeviceDetail);
