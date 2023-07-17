/**
 * 全局变量名称
 */
let globName = {
    //用户OpenId
    OPENID_CACHE: 'userOpenId',
    // 投票标识
    VOTE_TAG: 'vote-',
    HIDE_ID: [],
    // 分享投票有效期，48小时
    SHARE_TIME: (hour) => new Date().getTime() + hour * 60 * 60 * 1000,
    APP_ICON: "https://kindoucloud.com:8011/api/file/Image/systemicon/5gxy/20230202_98f3dc8c270543548da9f6b8a8293af4.png",
    // 按钮权限字符串
    BTN_AUTH: {
        DELETE: 'btn_remove',
        ADD: 'btn_add',
        EDIT: 'btn_edit'
    },
    COMMON_NUM: 3,
    // 需要默认显示的图标ID; 学院活动、教室信息录入、产品建议、打卡签到、教室申请流程、test
    DEFAULT_SHOW_ID: [
        'dd02b2f7aa9a433bba2bb77e2e8e9463',
        'ee4e209fe19745c983da5b6cb90c32b0',
        'd6211f2c2cd74f35a0e7b5c438d93d39',
        '4791c2e64bf14cc5b7225a51553ca84c',
        '26b624ca17f74643aa9568b05b43b411',
    ]
};

// 需要隐藏的图标ID
globName.HIDE_ID = [];
export default globName;
