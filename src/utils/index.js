import { getStorage } from "@/common/config";
import dayjs from "uview-ui/libs/util/dayjs";
import store from "@/store";
import { extractTree } from "@/common";
import { getModelList } from "@/config/api";
import { getFormConfig } from "@/api/mongoApi/form";
/**
 * 根据模块id获取菜单
 * @param {String} moduleId 模块id
 * @returns {Object} 菜单对象
 */
export function getMenuByModuleId(moduleId) {
  const menuList = getStorage("_MenuList").reduce((pre, cur) => {
    if (cur.children) pre.push(...cur.children);
    return pre;
  }, []);
  return menuList.find(item => item.moduleId === moduleId);
}
/**
 * 根据模块id获取权限
 * @param {String} id id
 * @param {String} type 类型
 * @returns {Object} 权限对象
 */
export function getPermission(id, type) {
  const menu = getMenuByModuleId(id);
  if (type === "module" && !menu) return null;

  let itemId = type === "module" ? menu.id : id;
  const permissionList = getStorage("_PermissionList");
  return permissionList.find(item => item.itemId === itemId);
}

export function isTableField(field) {
  const reg = new RegExp(/tableField[0-9]{3}$/);
  return reg.test(field);
}
export async function getHashTable() {
  let hashTable = {};
  const treeList = [
    { treeName: "organizeTree", childField: "children" },
    { treeName: "userTree", childField: "children" },
    { treeName: "roleTree", childField: "roleList" },
  ];
  for (let i = 0; i < treeList.length; i++) {
    const { treeName, childField } = treeList[i];
    const data = await store.dispatch(
      "base/get" + treeName.slice(0, 1).toUpperCase() + treeName.slice(1)
    );
    hashTable[treeName] = extractTree(data, {
      defaultValue: {},
      childField,
      filterFn: (item, { get }) => (get()[item.id] = item),
    });
  }
  return hashTable;
}
// 获取树节点的全名
export async function getFullNameByIdAndTree(treeName, id) {
  if (!id) return "";
  // 从 hashTable 中获取对应的树节点
  const hashTable = await getHashTable();
  const tree = hashTable[treeName] || {};
  // 将传入的列数据的 value 属性按照逗号分隔为数组
  const ids = (id + "").split(",");
  // 使用 reduce 方法遍历 ids 数组，获取每个 id 对应的树节点的全名，并将非空的全名保存在 fullNameArr 数组中
  const fullNameArr = ids.reduce((acc, id) => {
    // 从树中获取对应的树节点数据
    const data = tree[id];
    // 如果树节点不存在，则不添加到 fullNameArr 数组中
    if (!data) return acc;
    // 获取fullName，若 fullName 为空，则不添加到 fullNameArr 数组中
    const fullName = data.fullName || "";
    if (fullName) acc.push(fullName);
    return acc;
  }, []);
  // 将 fullNameArr 数组中的元素用逗号连接成一个字符串，并返回
  return fullNameArr.filter(Boolean).join(",");
}
// 获取时间格式
export function value2DateFormat(value, format = "YYYY-MM-DD HH:mm") {
  // 毫秒 长度是13位
  if (!value) return "";

  if (isTimestamp(value)) {
    let formatValue = dayjs(Number(value)).format(
      format.replace(/yyyy/, "YYYY").replace(/dd/, "DD")
    );
    // 如果HH:mm是00:00,则返回YYYY-MM-DD
    if (formatValue.indexOf("00:00") > -1) {
      formatValue = formatValue.split(" ")[0];
    }
    return formatValue;
  }

  // 如果是字符串的时间格式且HH:mm是00:00,则返回YYYY-MM-DD
  const date = new Date(value);
  if (!isNaN(date.getTime()) && (value + "").indexOf("00:00") > -1) {
    value = value.split(" ")[0];
  }
  return value;
}
// 判断是否是时间戳
export function isTimestamp(value) {
  const isInteger = Number.isInteger(value) || (typeof value === "string" && /^\d+$/.test(value));
  if (!isInteger) {
    return false;
  }
  const timestamp = parseInt(value, 10);
  const timestampLength = value.toString().length;

  if (timestampLength !== 10 && timestampLength !== 13) {
    return false;
  }

  const date = new Date(timestampLength === 10 ? timestamp * 1000 : timestamp);
  return !isNaN(date.getTime());
}
export function isChildrenVModel(vModel) {
  return new RegExp(/tableField[0-9]{3}.\w*$/).test(vModel);
}
/**
 * 获取联动下拉框的 option
 * @param linkageQuery 联动查询参数
 * @param props 联动下拉框的 props
 * @param formData 表单数据
 * @returns {Promise<*|*[]>} 联动下拉框的 option
 */
export async function getLinkOptions({ linkageQuery, props, formData }) {
  let query = uni.$u.deepClone(linkageQuery);
  const { filter, functionId, showField } = query;

  // 遍历筛选条件，如果是自定义类型，则将值转换成数组，否则将表单数据的值转换成字符串并存入数组
  filter.forEach(item => {
    item.value = [item.type === "custom" ? `${item.value}` : `${formData[item.value] || ""}`];
    item.type = "custom";
  });

  // 构建查询参数并获取模型列表数据
  try {
    const res = await getModelList(functionId, { ...query, filter });
    const option = res.data.list
      .flatMap(item => {
        if (showField.includes(".")) {
          // 如果是子表字段，则遍历子表数组并取出子表字段的值
          const [field1, field2] = showField.split(".");
          const array = item[field1]
            .flatMap(row => {
              if (row[field2]) {
                const field = value2DateFormat(row[field2]);
                return {
                  [props.label]: field,
                  [props.value]: field,
                };
              }
            })
            .filter(item => item != null);
          return array;
        } else {
          // 如果不是子表字段，则直接取出字段的值
          const field = item[showField];
          if (field) {
            const label = value2DateFormat(field);
            return {
              [props.label]: label,
              [props.value]: label,
            };
          }
        }
      })
      .filter((item, index, self) => {
        // 过滤掉重复的 option
        return (
          item &&
          self.findIndex(
            other =>
              other[props.label] === item[props.label] && other[props.value] === item[props.value]
          ) === index
        );
      });
    return option;
  } catch (err) {
    console.log(err);
    uni.$u.toast("加载数据失败，请重试");
    return [];
  }
}
/**
 * 获取函数下拉框的 option
 * @param functionField 函数字段
 * @param functionId 函数id
 * @param props 下拉框的 props
 * @returns {Promise<*|*[]>} 功能的option
 */
export async function getFunctionOption({ functionField, functionId, props }) {
  const query = { pageSize: 1000 };
  try {
    const res = await getModelList(functionId, query);
    let options = [];
    if (isChildrenVModel(functionField)) {
      const [field1, field2] = functionField.split(".");
      options = res.data.list.reduce((pre, cur) => {
        const value = (cur[field1] || [])
          .map(item => {
            let fieldValue = item[field2] ? item[field2] + "" : "";
            fieldValue = value2DateFormat(fieldValue);
            return {
              [props.label]: fieldValue,
              [props.value]: fieldValue,
            };
          })
          .filter(item => item[props.label] !== undefined);
        // 去重
        value.forEach(item => {
          if (
            item[props.label] &&
            !pre.some(preItem => preItem[props.label] === item[props.label])
          ) {
            pre.push(item);
          }
        });
        return pre;
      }, []);
    } else {
      options = res.data.list.reduce((pre, cur) => {
        let value = cur[functionField] ? cur[functionField] + "" : "";
        if (value && !pre.some(preItem => preItem[props.label] === value)) {
          value = value2DateFormat(value);
          pre.push({
            [props.label]: value,
            [props.value]: value,
          });
        }
        return pre;
      }, []);
    }
    return options;
  } catch (err) {
    console.log(err);
    // 显示报错信息
    uni.$u.toast("加载数据失败，请重试");
    return [];
  }
}

/**
 * 获取关联组件的 column
 * @param functionId
 * @param showTableField
 * @returns {Promise<*[]>}
 */
export async function getAssociationColumn(functionId, showTableField) {
  const result = await getFormConfig(functionId);
  const { fields = [], columnList = [] } = JSON.parse(result.data.columnData);
  let column = [];
  // 兼容新数据
  if (fields.length) {
    column = fields.flatMap(o => {
      const { __config__, __vModel__: vModel } = o;
      const { label } = __config__;
      if (!o.__vModel__) return [];
      const unAuth =
        showTableField.length && !showTableField.some(({ __vModel__ }) => __vModel__ === vModel);

      if (unAuth) return [];
      return { name: vModel, label };
    });
  }
  // 兼容旧数据
  if (columnList.length) {
    column = columnList.flatMap(o => {
      const unAuth =
        showTableField.length && !showTableField.some(({ __vModel__ }) => __vModel__ === o.prop);

      if (unAuth) return [];
      return { name: o.prop, label: o.label };
    });
  }

  column.length && column.unshift({ type: "selection", width: 50 });
  return column;
}
