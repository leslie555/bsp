/**
 * Created by cherry on 2018/8/29.
 */
import React from 'react';
import PropTypes from 'prop-types';

class HiatmpAuthorized extends React.Component {
  render() {
    const { codeList, noMatch, code, children } = this.props;
    const authorized = codeList.includes(code) ? children : noMatch;
    return (
      <span>
        { authorized }
      </span>
    );
  }
}
HiatmpAuthorized.prototypes = {
  codeList: PropTypes.array,
  code: PropTypes.string,
};
export default HiatmpAuthorized;
