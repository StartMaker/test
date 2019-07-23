import "core-js/modules/es6.object.assign";
import _classCallCheck from "@babel/runtime/helpers/classCallCheck";
import _createClass from "@babel/runtime/helpers/createClass";
import _possibleConstructorReturn from "@babel/runtime/helpers/possibleConstructorReturn";
import _getPrototypeOf from "@babel/runtime/helpers/getPrototypeOf";
import _inherits from "@babel/runtime/helpers/inherits";
import React from 'react';
import Search from '@beisen-phoenix/search';
import Tree from '../common/tree';
import List from '../common/list';
import Check from '../common/check';
import './index.css';

var Single =
/*#__PURE__*/
function (_React$Component) {
  _inherits(Single, _React$Component);

  function Single(props) {
    var _this;

    _classCallCheck(this, Single);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Single).call(this));

    _this.onShowDisableChange = function (props, e) {
      _this.props.onShowDisabledData(e.target.checked);
    };

    _this.onIncludSubChange = function (props, e) {
      _this.setState({
        withSub: e.target.checked
      });
    };

    _this.onSelect = function (department) {
      var withSub = _this.state.withSub;

      _this.props.onSelect(Object.assign({}, department, {
        withSub: withSub
      }));
    };

    var showDisableCheck = typeof props.showDisableCheck === 'boolean' ? props.showDisableCheck : true;
    _this.state = {
      showDisableCheck: showDisableCheck,
      withSub: true
    };
    return _this;
  }

  _createClass(Single, [{
    key: "render",
    value: function render() {
      var _this$state = this.state,
          withSub = _this$state.withSub,
          showDisableCheck = _this$state.showDisableCheck;
      var _this$props = this.props,
          treeData = _this$props.treeData,
          searchValue = _this$props.searchValue,
          searchData = _this$props.searchData,
          showDisable = _this$props.showDisable,
          treeLoading = _this$props.treeLoading,
          searchLoading = _this$props.searchLoading,
          onExpand = _this$props.onExpand,
          onSelectSibling = _this$props.onSelectSibling,
          onDoubleClick = _this$props.onDoubleClick,
          onSearchChange = _this$props.onSearchChange,
          onSelect = _this$props.onSelect;
      return React.createElement("div", {
        className: "department-single"
      }, React.createElement("div", {
        className: "department-single-hd"
      }, React.createElement(Search, {
        prefix: "Search",
        placeholder: "\u641C\u7D22",
        value: searchValue,
        onChange: onSearchChange
      })), React.createElement("div", {
        className: "department-single-bd"
      }, React.createElement("div", {
        className: "department-single-wrap"
      }, showDisableCheck && React.createElement("div", {
        className: "department-single-check"
      }, React.createElement(Check, {
        title: "\u53EF\u9009",
        label: "显示停用",
        checked: showDisable,
        onChange: this.onShowDisableChange
      })), React.createElement("div", {
        className: "department-single-tree"
      }, React.createElement(Tree, {
        treeData: treeData,
        onExpand: onExpand,
        onSelect: this.onSelect,
        loading: treeLoading // onSelectSibling={onSelectSibling}
        // onDoubleClick={onDoubleClick}
        ,
        showDisable: showDisable,
        multi: false
      }))), // 搜索关键字不为空时显示列表
      !!searchValue && React.createElement("div", {
        className: "department-single-list"
      }, React.createElement(List, {
        searchValue: searchValue,
        searchData: searchData,
        loading: searchLoading,
        onSelect: this.onSelect,
        multi: false
      }))), React.createElement("div", {
        className: "department-single-ft"
      }, React.createElement(Check, {
        label: "包含下级数据",
        checked: withSub,
        onChange: this.onIncludSubChange
      })));
    }
  }]);

  return Single;
}(React.Component);

export { Single as default };