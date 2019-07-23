import React from 'react';
import './index.css';
export default function (props) {
  var title = props.title,
      selectedCount = props.selectedCount,
      maxCount = props.maxCount;
  return React.createElement("div", {
    className: "department-count"
  }, React.createElement("span", {
    className: "department-count-title"
  }, title), React.createElement("span", {
    className: "department-count-selected"
  }, selectedCount), React.createElement("span", {
    className: "department-count-total"
  }, "/", maxCount));
}