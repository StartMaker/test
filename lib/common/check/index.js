import React from 'react';
import Checkbox from '@beisen-phoenix/checkbox';
import classNames from 'classnames';
import './index.css';
export default function Check(props) {
  var title = props.title,
      label = props.label,
      value = props.value,
      checked = props.checked,
      onChange = props.onChange;
  return React.createElement("div", {
    className: "department-check"
  }, typeof title !== 'undefined' && React.createElement("span", {
    className: "department-check-title"
  }, title), React.createElement(Checkbox, {
    label: label,
    value: value,
    checked: checked,
    onChange: onChange
  }));
}