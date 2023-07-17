//定制页菜单配置
const classPage = [
  {
    type: 0,
    fullName: "尚美点评",
    icon: "iconfont JDCloud-application9",
    id: "class-list",
    urlAddress: "/subPages/custom/class/class-list",
  },
  {
    type: 0,
    fullName: "比赛评分",
    icon: "iconfont JDCloud-application15",
    id: "sport-grouping",
    urlAddress: "/subPages/custom/class/sport-grouping",
  },
  {
    type: 0,
    fullName: "智慧听评课",
    icon: "iconfont JDCloud-application2",
    id: "evaluation-classes",
    urlAddress: "/subPages/custom/courses/evaluate/index",
  },
  {
    type: 0,
    imageUrl: "",
    fullName: "课程研讨",
    icon: "iconfont JDCloud-kechengguanli",
    id: "course-discussion",
    urlAddress: "/subPages/custom/discuss/activity/index",
  },
];
export default {
  fullName: "定制页",
  id: "custom",
  icon: "iconfont JDCloud-shoucang",
  children: [...classPage],
};
