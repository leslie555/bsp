/**
 * Created by DELL on 2018-7-4.
 */

import React from 'react';
import { message } from 'antd';
import { connect } from 'dva';
import List from '../components/KeyCodeManage/KeyCodeList';
import Info from '../components/KeyCodeManage/KeyCodeInfo';

class KeyCodeManage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      keycodeinfovisible: false,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({ type: 'keycodemanage/query' });
  }

  render() {
    const { keycodemanage } = this.props;
    const {
      keycodelist,
      recordInfo,
    } = keycodemanage;
    const { keycodeinfovisible } = this.state;
    // 列表组件用到的props
    const keycodelistprops = {
      keycodelist,
      onEdit: (record) => {
        this.setState({
          keycodeinfovisible: true,
        });
        dispatch({ type: 'keycodemanage/updateTableList', payload: { recordInfo: record } });
      },
    };// info用到的props
    const keycodeinfoprops = {
      keycodeinfovisible,
      recordInfo,
      onCloseModal: () => {
        this.setState({ keycodeinfovisible: false });
      },
      onUpdateRecord: (currentkey, beforeRecord) => {
        if (currentkey == beforeRecord.hotkey) {
          this.setState({
            keycodeinfovisible: false,
          });
          return;
        }
        dispatch({ type: 'keycodemanage/update', payload: { currentkey, beforeRecord } }).then((data) => {
          console.log(currentkey);
          console.log(beforeRecord);
          if (data && data.result) {
            if (data.flag === 1) {
              message.info(`${data.info}需重新打开【${beforeRecord.pagename}】页面使其生效。`);
              this.setState({
                keycodeinfovisible: false,
              });
              dispatch({ type: 'keycodemanage/query', payload: {} });
            } else {
              message.info(data.info);
            }
          }
        });
      },
    };
    const { dispatch } = this.props;
    return (
      <div>
        <List {...keycodelistprops} />
        <Info {...keycodeinfoprops} />
      </div>
    );
  }
}
function mapStateToProps({ keycodemanage }) {
  return { keycodemanage };
}

export default connect(mapStateToProps)(KeyCodeManage);
