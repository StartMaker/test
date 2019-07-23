import "core-js/modules/es6.regexp.constructor";
import "core-js/modules/es6.regexp.replace";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import React from 'react';
import Tooltip from '@beisen-phoenix/tooltip';
import Input from '@beisen-phoenix/search';
import { ChrysanthemumLoading } from '@beisen-phoenix/loading';
import { NoData } from '@beisen-phoenix/icon';
import classNames from 'classnames';
import './index.css';

var Search =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Search, _React$Component);

  function Search(props) {
    var _this;

    _classCallCheck(this, Search);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Search).call(this));

    _this.onChange = function (e) {};

    _this.onClick = function (item) {
      var onClick = _this.props.onClick;
      onClick(item);
    };

    _this.getHighlightText = function (text, value) {
      return text.replace(new RegExp(value), function ($0) {
        return $0 ? "<span class=\"department-search-highlight\">".concat($0, "</span>") : '';
      });
    };

    _this.state = {// showClose: false
    };
    return _this;
  }

  _createClass(Search, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          searchValue = _this$props.searchValue,
          onChange = _this$props.onChange,
          searchList = _this$props.searchList,
          loading = _this$props.loading,
          multi = _this$props.multi;
      return React.createElement("div", {
        className: "department-search"
      }, React.createElement(Input, {
        prefix: "Search",
        placeholder: "\u641C\u7D22",
        value: searchValue,
        onChange: onChange
      }));
    }
  }]);

  return Search;
}(React.Component);

export { Search as default };
;