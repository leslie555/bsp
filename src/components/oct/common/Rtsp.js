import { Divider, Button, Modal, Upload, message, Form, Input, Select, Row, Col, Icon, Anchor, TreeSelect, AutoComplete, Tooltip, InputNumber } from 'antd';
import React from 'react';
import PropTypes from 'prop-types';

class Rtsp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  componentWillReceiveProps(nextProps) {
    const { rtspURL } = nextProps;
    console.log(rtspURL);
  }

  render() {
    const {
      visible,
      rtspURL,
    } = this.props;
    return (
      <div
        style={{
          width: '800px',
        }}
      >
        <object
          name="vlc"
          width="750"
          height="460"
          id="vlc"
          classId="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921"
          style={{ left: '0px', top: '0px', width: '750px', height: '460px' }}
          events="True"
        >
          <param NAME="Toolbar" VALUE="-1" />
          <param NAME="ExtentWidth" VALUE="19844" />
          <param NAME="ExtentHeight" VALUE="12171" />
          <param NAME="Visible" VALUE="-1" />
          <param
            NAME="BaseURL"
            VALUE="http://20.0.58.42:8080/chengdu-webapp/videoevent/playHistoryVideoView.htm?videoUrl=rtsp://20.1.30.199/realtime.264&amp;videoType=1"
          />
          <param NAME="BackColor" VALUE="0" />
          <param NAME="FullscreenEnabled" VALUE="-1" />
          <param NAME="Branding" VALUE="-1" />
          <param name="MRL" value={rtspURL} />
          <param name="ShowDisplay" value="true" />
          <param name="AutoLoop" value="false" />
          <param name="AutoPlay" value="true" />
          <param name="Volume" value="50" />
          <param name="StartTime" value="0" />
          <param name="wmode" value="transparent" />
          <param name="quality" value="high" />
          <embed
            name="vlc"
            width="535"
            height="370"
            align="center"
            id="vlc"
            pluginspage="http://www.videolan.org"
            type="application/x-vlc-plugin"
            progid="VideoLAN.VLCPlugin.2"
            src={rtspURL}
          />
        </object>
        {/* <object classID="clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921"
         width={750} height={460} events="True">
          <param name="MRL" value={rtspURL} />
          <param name="Src" value={rtspURL} />
          <param name="ShowDisplay" value="true" />
          <param name="AutoLoop" value="false" />
          <param name="AutoPlay" value="true" />
          <param name="Volume" value="50" />
          <param name="StartTime" value="0" />
          <param name="wmode" value="transparent" />
          <param name="quality" value="high" />
          <embed
            pluginspage="http://www.videolan.org"
            type="application/x-vlc-plugin"
            progid="VideoLAN.VLCPlugin.2"
            src={rtspURL}
            width={745}
            height={455}
            align="center"
          />
        </object> */}
      </div>
    );
  }
}
Rtsp.prototypes = {
};

export default Form.create()(Rtsp);
