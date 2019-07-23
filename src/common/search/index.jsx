import React from 'react';
import Tooltip from '@beisen-phoenix/tooltip';
import Input from '@beisen-phoenix/search';
import { ChrysanthemumLoading } from '@beisen-phoenix/loading';
import { NoData } from '@beisen-phoenix/icon';
import classNames from 'classnames';

import './index.scss';



export default class Search extends React.Component {
  constructor(props) {
    super();
    this.state = {
      // showClose: false
    };
  }

  onChange = e => {

  }

  onClick = item => {
    const { onClick } = this.props;
    onClick(item);
  }

  getHighlightText = (text, value) => {
    return text.replace(new RegExp(value), $0 => $0 ? `<span class="department-search-highlight">${$0}</span>` : '');
  }

  render() {
    const { searchValue, onChange, searchList, loading, multi } = this.props;
    return (
      <div className="department-search">
        <Input
          prefix="Search"
          placeholder="搜索"
          value={searchValue}
          onChange={onChange}
        />
        
      </div>
    );
  }
};