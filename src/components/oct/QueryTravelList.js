/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, Spin } from 'antd';
import styles from '../AccountManage/AccountInfo.less';

class QueryTravelList extends React.Component {
  constructor(props) {
    super(props);
    this.getEnumValue = this.getEnumValue.bind(this);
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
    const noMatch = '';
    const authorizedProps = {
      codeList,
      noMatch,
    };
    // 列表
    const columns = [
      {
        title: '时间',
        width: 90,
        dataIndex: 'pdate',
        key: 'pdate,',
        align: 'center',
        fixed: 'left',
      }, {
        title: '川A',
        width: 90,
        dataIndex: 'ca',
        key: 'ca,',
        align: 'center',
      }, {
        title: '川B',
        width: 90,
        dataIndex: 'cb',
        key: 'cb',
        align: 'center',
      }, {
        title: '川C',
        width: 90,
        dataIndex: 'cc',
        key: 'cc,',
        align: 'center',
      }, {
        title: '川D',
        width: 90,
        dataIndex: 'cd',
        key: 'cd,',
        align: 'center',
      }, {
        title: '川E',
        width: 90,
        dataIndex: 'ce',
        key: 'ce,',
        align: 'center',
      }, {
        title: '川F',
        width: 90,
        dataIndex: 'cf',
        key: 'cf,',
        align: 'center',
      }, {
        title: '川G',
        width: 90,
        dataIndex: 'cg',
        key: 'cg,',
        align: 'center',
      }, {
        title: '川H',
        width: 90,
        dataIndex: 'ch',
        key: 'ch,',
        align: 'center',
      }, {
        title: '川J',
        width: 90,
        dataIndex: 'cj',
        key: 'cj,',
        align: 'center',
      }, {
        title: '川K',
        width: 90,
        dataIndex: 'ck',
        key: 'ck,',
        align: 'center',
      }, {
        title: '川L',
        width: 90,
        dataIndex: 'cl',
        key: 'cl,',
        align: 'center',
      }, {
        title: '川M',
        width: 90,
        dataIndex: 'cm',
        key: 'cm,',
        align: 'center',
      }, {
        title: '川N',
        width: 90,
        dataIndex: 'cn',
        key: 'cn,',
        align: 'center',
      }, {
        title: '川O',
        width: 90,
        dataIndex: 'co',
        key: 'co,',
        align: 'center',
      }, {
        title: '川P',
        width: 90,
        dataIndex: 'cp',
        key: 'cp,',
        align: 'center',
      }, {
        title: '川Q',
        width: 90,
        dataIndex: 'cq',
        key: 'cq,',
        align: 'center',
      }, {
        title: '川R',
        width: 90,
        dataIndex: 'cr',
        key: 'cr,',
        align: 'center',
      }, {
        title: '川S',
        width: 90,
        dataIndex: 'cs',
        key: 'cs,',
        align: 'center',
      }, {
        title: '川T',
        width: 90,
        dataIndex: 'ct',
        key: 'ct,',
        align: 'center',
      }, {
        title: '川U',
        width: 90,
        dataIndex: 'cu',
        key: 'cu,',
        align: 'center',
      }, {
        title: '川V',
        width: 90,
        dataIndex: 'cv',
        key: 'cv,',
        align: 'center',
      }, {
        title: '川W',
        width: 90,
        dataIndex: 'cw',
        key: 'cw,',
        align: 'center',
      }, {
        title: '川X',
        width: 90,
        dataIndex: 'cx',
        key: 'cx,',
        align: 'center',
      }, {
        title: '川Y',
        width: 90,
        dataIndex: 'cy',
        key: 'cy,',
        align: 'center',
      }, {
        title: '川Z',
        width: 90,
        dataIndex: 'cz',
        key: 'cz,',
        align: 'center',
      }, {
        title: '藏',
        width: 90,
        dataIndex: 'zang',
        key: 'zang,',
        align: 'center',
      }, {
        title: '鄂',
        width: 90,
        dataIndex: 'e',
        key: 'e,',
        align: 'center',
      }, {
        title: '甘',
        width: 90,
        dataIndex: 'gan',
        key: 'gan,',
        align: 'center',
      }, {
        title: '赣',
        width: 90,
        dataIndex: 'gan2',
        key: 'gan2,',
        align: 'center',
      }, {
        title: '桂',
        width: 90,
        dataIndex: 'gui',
        key: 'gui,',
        align: 'center',
      }, {
        title: '贵',
        width: 90,
        dataIndex: 'gui2',
        key: 'gui2,',
        align: 'center',
      }, {
        title: '黑',
        width: 90,
        dataIndex: 'hei',
        key: 'hei,',
        align: 'center',
      }, {
        title: '沪',
        width: 90,
        dataIndex: 'hu',
        key: 'hu,',
        align: 'center',
      }, {
        title: '吉',
        width: 90,
        dataIndex: 'ji',
        key: 'ji,',
        align: 'center',
      }, {
        title: '冀',
        width: 90,
        dataIndex: 'ji2',
        key: 'ji2,',
        align: 'center',
      }, {
        title: '津',
        width: 90,
        dataIndex: 'jin',
        key: 'jin,',
        align: 'center',
      }, {
        title: '晋',
        width: 90,
        dataIndex: 'jin2',
        key: 'jin2,',
        align: 'center',
      }, {
        title: '京',
        width: 90,
        dataIndex: 'jing',
        key: 'jing,',
        align: 'center',
      }, {
        title: '辽',
        width: 90,
        dataIndex: 'liao',
        key: 'liao,',
        align: 'center',
      }, {
        title: '鲁',
        width: 90,
        dataIndex: 'lu',
        key: 'lu,',
        align: 'center',
      }, {
        title: '蒙',
        width: 90,
        dataIndex: 'meng',
        key: 'meng,',
        align: 'center',
      }, {
        title: '闽',
        width: 90,
        dataIndex: 'min',
        key: 'min,',
        align: 'center',
      }, {
        title: '宁',
        width: 90,
        dataIndex: 'ning',
        key: 'ning,',
        align: 'center',
      }, {
        title: '青',
        width: 90,
        dataIndex: 'qing',
        key: 'qing,',
        align: 'center',
      }, {
        title: '琼',
        width: 90,
        dataIndex: 'qiong',
        key: 'qiong,',
        align: 'center',
      }, {
        title: '陕',
        width: 90,
        dataIndex: 'shan',
        key: 'shan,',
        align: 'center',
      }, {
        title: '苏',
        width: 90,
        dataIndex: 'su',
        key: 'su,',
        align: 'center',
      }, {
        title: '皖',
        width: 90,
        dataIndex: 'wan',
        key: 'wan,',
        align: 'center',
      }, {
        title: '湘',
        width: 90,
        dataIndex: 'xiang',
        key: 'xiang,',
        align: 'center',
      }, {
        title: '新',
        width: 90,
        dataIndex: 'xin',
        key: 'xin,',
        align: 'center',
      }, {
        title: '渝',
        width: 90,
        dataIndex: 'yu',
        key: 'yu,',
        align: 'center',
      }, {
        title: '豫',
        width: 90,
        dataIndex: 'yu2',
        key: 'yu2,',
        align: 'center',
      }, {
        title: '粤',
        width: 90,
        dataIndex: 'yue',
        key: 'yue,',
        align: 'center',
      }, {
        title: '云',
        width: 90,
        dataIndex: 'yun',
        key: 'yun,',
        align: 'center',
      }, {
        title: '浙',
        width: 90,
        dataIndex: 'zhe',
        key: 'zhe,',
        align: 'center',
      }];

    const {
      // loading,
      resultlist,
      pagination,
      onPageChange, // $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
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
            // pagination={false}*********************
            columns={columns}
            rowClassName={
              (record, index) => {
                console.log(resultlist);// $$$$$$$$$$$$$$$$$
                if (record.deviceid === currentId) {
                  return 'selectedRow';
                } else {
                  return index % 2 === 0 ? 'tableoddRow' : 'tableevenRow';
                }
              }}
            // loading={loading}
            dataSource={resultlist}
            pagination={pagination}
            onChange={onPageChange}
            onRow={(record) => {
              return {
                // onClick: () => onView(record),
              };
            }}
            locale={{ emptyText: '暂无数据' }}
            scroll={{ x: 5000, y: 400 }}
            rowKey="pdate"
          />
        </div>
        <div style={{ display: loading ? '' : 'none' }} className={styles.loadingDiv}>
          <Spin style={{ display: loading ? '' : 'none' }} tip="请稍候..." />
        </div>
      </div>
    );
  }
}
QueryTravelList.prototypes = {
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
export default Form.create()(QueryTravelList);
