import "core-js/modules/es6.regexp.constructor";
import "core-js/modules/es6.regexp.replace";
import React from 'react';
import Tooltip from '@beisen-phoenix/tooltip';
import { ChrysanthemumLoading } from '@beisen-phoenix/loading';
import { NoData } from '@beisen-phoenix/icon';
import classNames from 'classnames';
import './index.css';
export default function List(props) {
  var searchValue = props.searchValue,
      searchData = props.searchData,
      loading = props.loading,
      multi = props.multi,
      showDisable = props.showDisable,
      onSelect = props.onSelect,
      onDoubleClick = props.onDoubleClick;
  var listClass = classNames({
    'department-list': true,
    'department-list-multi': multi
  });
  return React.createElement("div", {
    className: listClass
  }, // loading
  loading ? React.createElement(ChrysanthemumLoading, null) : // 结果数量大于0时才显示列表，否则显示“空”图标
  searchData.length > 0 ? searchData.map(function (item) {
    return showDisable || item.departmentStatus ? React.createElement(ListItem, {
      key: item.departmentId,
      item: item,
      multi: multi,
      searchValue: searchValue,
      onDoubleClick: onDoubleClick,
      onSelect: onSelect
    }) : null;
  }) : // 此处是无搜索结果的“空”图标
  React.createElement("div", {
    className: "department-list-void"
  }, React.createElement(NoData, {
    className: "department-list-void-icon"
  }), React.createElement("div", {
    className: "department-list-void-title"
  }, '这里什么都没有...')));
}

function ListItem(props) {
  var item = props.item,
      searchValue = props.searchValue,
      onSelect = props.onSelect,
      _onDoubleClick = props.onDoubleClick,
      multi = props.multi;
  var selected = item.selected,
      departmentId = item.departmentId,
      departmentName = item.departmentName,
      departmentStatus = item.departmentStatus,
      parentDepartmentName = item.parentDepartmentName;
  var itemClass = classNames({
    'department-list-text': true,
    'department-list-text-multi': multi,
    'department-list-text-selected': selected
  });
  var nameText = getHighlightText(departmentName, searchValue);
  var parentText = parentDepartmentName ? "<span class=\"department-list-parent\">(".concat(parentDepartmentName, ")</span>") : '';
  var statusText = departmentStatus ? '' : '<span class="department-list-status">(已停用)</span>';
  var tooltipText = "".concat(departmentName, "(").concat(parentDepartmentName, ")(").concat(departmentStatus ? '' : '已停用', ")");
  var text = nameText + parentText + statusText;

  var onClick = function onClick(e) {
    e.stopPropagation();
    onSelect && onSelect(item, !selected, 'search');
  };

  return React.createElement("div", {
    key: departmentId,
    className: "department-list-item",
    onDoubleClick: function onDoubleClick() {
      return _onDoubleClick && _onDoubleClick(item, 'search');
    }
  }, React.createElement(Tooltip, {
    title: tooltipText,
    showOverflowTooltip: true
  }, React.createElement("div", {
    className: itemClass,
    onClick: onClick,
    dangerouslySetInnerHTML: {
      __html: text
    }
  })));
}

function getHighlightText(text, value) {
  return text.replace(new RegExp(value), function ($0) {
    return $0 ? "<span class=\"department-list-highlight\">".concat($0, "</span>") : '';
  });
}