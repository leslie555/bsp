/**
 * Created by cherry on 2018/7/20.
 */
import React from 'react';
import PropTypes from 'prop-types';
import { Form, Row, Col, Table, Icon, Button, InputNumber, Modal } from 'antd';
import { MAINTENAN_UNIT, SGDW, SSXM } from '../../../config/enums';

const FormItem = Form.Item;
const { confirm } = Modal;

class QueryDetaillList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true, // 是否显示修改的选项,默认显示,在项目分类统计历史记录不显示
      pagination: {
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: total => `共 ${total} 条`,
        current: 1,
        pageSize: 10,
        total: null,
        onShowSizeChange: (() => {
          setTimeout(() => {
            window.document.querySelector('.ant-pagination-options-quick-jumper input').value = '';
          }, 1000);
        }),
      },
    };
    this.getEnumValue = this.getEnumValue.bind(this);
  }

  componentDidMount() {
    const { title } = this.props;
    if (title === '项目分类统计 历史记录') {
      this.setState({
        visible: false,
      });
    }
    // const { dispatch, danweiID, query } = this.props;
    // const { pagination } = query;
    // const page = { ...pagination, current: 1 };
    // dispatch({
    //   type: 'query/gethistoryById',
    //   payload: { queryobj: { companyid: danweiID }, pagination: page },
    // });
  }

  onClose = () => {
    const { onClose } = this.props;
    onClose();
  }

  onOk = () => {
    const { onClose } = this.props;
    onClose();
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

  // 查询项目名称
  getWeiHuJianShe(enumvalue) {
    if (enumvalue == '-1') {
      return '总计';
    } else if (enumvalue == '-2' || enumvalue == '0' || enumvalue == null || enumvalue == '') {
      return '未知';
    }
    const v = this.getEnumValue(SSXM, enumvalue);
    // if (v) {
    //   return v;
    // } else {
    //   return this.getEnumValue(SGDW, enumvalue);
    // }
    return v;
  }

  // 保存建设数量
  handleSave() {
    const { form, onSave } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      // console.log(values);
      if (!err) {
        confirm({
          title: '确定要保存建设设备数量？',
          content: '保存后立即生效。',
          onOk() {
            onSave(values);
          },
          onCancel() {
          },
        });
      }
    });
  }

  render() {
    const { title, danweiID, danweiHistory, form, records, loading } = this.props;
    const { visible, pagination } = this.state;
    const columns1 = [ // 项目历史记录
      {
        title: '项目名称',
        width: '15%',
        align: 'center',
        dataIndex: 'entry_name',
        key: 'entry_name',
        render: (text) => {
          return (<span>{this.getWeiHuJianShe(text)}</span>);
        },
      }, {
        title: '建设数量',
        width: '10%',
        dataIndex: 'device_number',
        key: 'device_number',
        align: 'center',
      }, {
        title: '接入二级平台数量',
        width: '10%',
        dataIndex: 'access_device',
        key: 'access_device',
        align: 'center',
      }, {
        title: '接入综合集成数',
        width: '10%',
        dataIndex: 'access_zhjc',
        key: 'access_zhjc',
        align: 'center',
      }, {
        title: '运行正常数量',
        width: '10%',
        dataIndex: 'normal',
        key: 'normal',
        align: 'center',
      }, {
        title: '时间',
        width: '10%',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
      }];
    const columns = [ // 单条的历史记录
      {
        title: '时间',
        width: '20%',
        dataIndex: 'time',
        key: 'time',
        align: 'center',
      }, {
        title: '建设数量',
        width: '16%',
        dataIndex: 'device_number',
        key: 'device_number',
        align: 'center',
      }, {
        title: '接入综合集成数',
        width: '16%',
        dataIndex: 'access_zhjc',
        key: 'access_zhjc',
        align: 'center',
      }, {
        title: '接入二级平台数量',
        width: '16%',
        dataIndex: 'access_device',
        key: 'access_device',
        align: 'center',
      }, {
        title: '运行正常数量',
        width: '16%',
        dataIndex: 'normal',
        key: 'normal',
        align: 'center',
      }];
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    };
    const str = (
      <Row>
        <Col span={10} />
        <Col span={10}>
          <FormItem {...formItemLayout} label="设置建设数量">
            {getFieldDecorator('jianshe', {
              initialValue: records.amount1,
              rules: [{
                required: true,
                message: '输入建设数量后才能保存',
              }],
            })(
              <InputNumber style={{ marginLeft: '5px', width: '95%' }} />,
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <Button type="primary" onClick={() => this.handleSave()}><Icon type="save" />保存</Button>
        </Col>
      </Row>
    );
    const onpagechange = (page) => {
      this.setState({
        pagination: { ...pagination, current: page.current, pageSize: page.pageSize },
      });
    };

    return (
      <div className="outline-out">
        <div className="outline-inner">
          <Form className="form-outline-inner-padding">
            {visible ? str : null}
          </Form>
          <Table
            rowKey={(record, index) => {
              return `${index + 1}`;
            }}
            loading={loading}
            onChange={onpagechange}
            pagination={pagination}
            columns={visible ? columns : columns1}
            dataSource={danweiHistory}
            rowClassName={(record, index) => {
              if (
                record.entry_name == null ||
                record.entry_name == undefined
              ) {
                return 'displayNone';
              }
            }}
          />
        </div>
      </div>
    );
  }
}
QueryDetaillList.prototypes = {
};
export default Form.create()(QueryDetaillList);
