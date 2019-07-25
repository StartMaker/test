## Department 部门选择组件
>- 提供：单选/多选
>- 使用时需提供固定宽高的容器，建议宽高，单选：`340*420`，多选(组件最小宽度)：`640*420`；已设置内边距。
>- example中的带阴影容器为测试容器，不包含在本组件内

### API

| 参数 | 说明 | 类型 | 默认值 | 是否必传 | 备注 |
| --- | --- | :---: | :---: | :---: | --- |
| onSearchChange | 搜索框中值变化时的回调，参数为输入框的value | `async function` | 无 | 是 | 该回调函数应该return一个`Promise`对象，异步返回的数据为department对象组成的数组 |
| onExpand | 树形组件中，部门展开的回调；当被展开的部门无子部门数据时会调用该函数，参数为department对象 | `async function` | 无 | 是 | 该回调函数应该return一个`Promise`对象，异步返回的数据为department对象组成的数组 |
| onCancel | 『取消』按钮点击时的回调 | `function` | 无 | 是 | 多选时才会用到 |
| onSubmit | 『确定』按钮点击时的回调，参数为选中的部门 | `function` | 无 | 是 | 单选时参数为dep对象，多选时为dep对象组成的数组 |
| treeData | 初始传入的树形组件数据 | `array` | [ ] | 是 | 该数据为department对象组成的一维数组 |
| tableData | 默认选中的数据 | `array` | [ ] | 否 | 该数据为department对象组成的一维数组 |
| multi | 是否多选 | `boolean` | `false` | 否 | 根据该值确认显示单选或者多选组件 |
| leftTitle | 可选组织的标题 | `string` | `可选组织` | 否 | 多选时才会用到 |
| rightTitle | 已选组织的标题 | `string` | `已选组织` | 否 | 多选时才会用到 |showDisableCheck
| maxCount | 多选时的最大可选数 | `number` | 99 | 否 | 多选时才会用到，最大值为200 |
| showDisableCheck | 是否显示「显示停用」勾选框 | `boolean` | true | 否 | 如果配置为false，则勾选框不会显示，并且展示的数据将不包含“已停用”的部门 |
| expandLevel | 树形组件默认展开的层级 | `number` | 2 | 否 | 实际展开效果同时取决与treeData数据中是否有相应层级的数据 |
| columns | 自定义配置已选列表 | `array` | `组织名称` `上级组织` `包含下级` | 否 | table使用了antd组件，columns的配置可参考 [antd文档](https://ant.design/components/table-cn/) |

### 相关示例

###### department对象格式
```
{
  departmentId: '组织id',
  departmentName: '组织名称',
  parentDepartmentId: '父级组织id',
  departmentStatus: '组织状态(是否已停用)',
  parentDepartmentName: '父级组织名称',
  withSub: '是否包含下级',
  withSubEnable: '是否有勾选包含下级的权限',
  hasChildrenEnable: '是否包含未停用的子级',
  hasChildrenDisabled: '是否包含已停用的子级'
}
```
---
###### dep对象格式
```
{
  departmentId: '组织id',
  departmentName: '组织名称',
  withSub: '是否包含下级'
}
```
---
###### 自定义columns示例，以下为其中一列的配置
```
<!-- 注：自定义columns时需要配置className，以控制每一列显示样式 -->
{
  title: '组织名称',
  dataIndex: 'departmentName',
  key: 'departmentName',
  className: 'department-table-name',
  render: (value, node) => {
    const { departmentStatus } = node;
    value += departmentStatus ? '' : '(已停用)';
    return (
      <Tooltip title={value} showOverflowTooltip={true}>
        <span className="department-table-text">{value}</span>
      </Tooltip>
    );
  }
}
```
---
###### onSearchChange回调
```
onSearchChange = value => {
  return new Promise((resolve, reject) => {
    const list = this.getSearchData()
    resolve(list);
  })
}
```
---
###### onExpand回调
```
onExpand = department => {
  return new Promise((resolve, reject) => {
    const tree = this.getSubTreeData(department)
    resolve(tree);
  })
}
```