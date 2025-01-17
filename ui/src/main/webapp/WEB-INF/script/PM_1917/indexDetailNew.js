var win;// 父窗口对象，由子窗口调用
var picguidbegin;
var V_V_FILEGUID = '';
var index = 0;
var flag = "";
var V_JXMX_CODE;
var cmItems = [];
var ganttdata = [];
var VSTART;
var VEND;
var person=Ext.util.Cookies.get('v_personcode');//---V_V_DEPTCODE
if (location.href.split('?')[1] != undefined) {
    if (Ext.urlDecode(location.href.split('?')[1]) != null) {
        V_JXMX_CODE = Ext.urlDecode(location.href.split('?')[1]).V_JXMX_CODE;
        V_V_ORGCODE = Ext.urlDecode(location.href.split('?')[1]).V_V_ORGCODE;
        V_V_DEPTCODE = Ext.urlDecode(location.href.split('?')[1]).V_V_DEPTCODE;
        V_V_EQUCODE = Ext.urlDecode(location.href.split('?')[1]).V_V_EQUCODE;
        V_V_EQUTYPECODE = Ext.urlDecode(location.href.split('?')[1]).V_V_EQUTYPECODE;
    }
}
Ext.onReady(function () {

    Ext.define('I_toolsStatusStore',{
        extend:'Ext.data.Store',
        fields:['V_TOOLSTATUS_CODE','V_TOOLSTATUS_NAME'],
        data:[
            {V_TOOLSTATUS_CODE:'1',V_TOOLSTATUS_NAME:'生效'}
            ,{V_TOOLSTATUS_CODE:'0',V_TOOLSTATUS_NAME:'失效'}
        ]
    });

    var toolsStatusStore = Ext.create('I_toolsStatusStore');

    // 获取整改工单数据集
    var zggdStore = Ext.create('Ext.data.Store', { // 安全措施数据集
        id: 'zggdStore',
        autoLoad: false,
        fields: ['V_ORDERID', 'V_ORDERGUID', 'V_SHORT_TXT', 'V_EQUIP_NAME', 'V_FUNC_LOC', 'V_DEPTNAME', 'V_ENTERED_BY', 'D_ENTER_DATE', 'V_JX_DEPTNAME'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'zs/BASE_GD_BY_ZGGUID_SEL',
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 获取人工数据集
    var rgStore = Ext.create('Ext.data.Store', { // 安全措施数据集
        id: 'rgStore',
        autoLoad: false,
        fields: ['V_PERCODE_DE', 'V_PERNAME_DE', 'V_PERTYPE_DE', 'V_FUNC_LOC', 'V_ENTERED_BY', 'V_TS'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'zs/BASE_GZ_BY_ZGGUID_SEL',
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 状态下拉菜单数据集
    var statusStore = Ext.create("Ext.data.Store", {
        storeId: 'statusStore',
        fields: ["Name", "Value"],
        data: [{
            Name: '失效',
            Value: '0'
        }, {
            Name: '生效',
            Value: '1'
        }]
    });
    // 获取工具数据集
    var gjStore = Ext.create('Ext.data.Store', { // 安全措施数据集
        id: 'gjStore',
        autoLoad: false,
        fields: ['V_GJ_CODE', 'V_GJ_NAME'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'zs/BASE_GJ_BY_ZGGUID_SEL',
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 获取机具数据集
    var JjStore1 = Ext.create('Ext.data.Store', { // 安全措施数据集
        id: 'JjStore1',
        autoLoad: false,
        fields: ['V_JJ_CODE', 'V_JJ_NAME', 'V_JJ_TYPE', 'V_JJ_TS'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'zs/BASE_JJ_BY_ZGGUID_SEL',
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 厂矿store
    var ckStore = Ext.create('Ext.data.Store', {
        id: 'ckStore',
        autoLoad: true,
        fields: ['_WORK', 'V_SAP_JHGC', 'V_DEPTNAME', 'V_DEPTCODE_UP', 'V_DEPTCODE', 'V_SAP_YWFW', 'V_SAP_DEPT'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'PM_06/PRO_BASE_DEPT_VIEW_ROLE',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            },
            extraParams: {
                'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode'),
                'V_V_DEPTCODE': Ext.util.Cookies.get('v_orgCode'),
                'V_V_DEPTCODENEXT': '%',
                'V_V_DEPTTYPE': '基层单位'
            }
        }
    });
    // 作业区store
    var zyqStore = Ext.create('Ext.data.Store', {
        id: 'zyqStore',
        autoLoad: false,
        fields: ['V_SAP_WORK', 'V_SAP_JHGC', 'V_DEPTNAME', 'V_DEPTCODE_UP', 'V_DEPTCODE', 'V_SAP_YWFW', 'V_SAP_DEPT'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'PM_06/PRO_BASE_DEPT_VIEW_ROLE',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            },
            extraParams: {
                'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode'),
                'V_V_DEPTCODENEXT': '%',
                'V_V_DEPTTYPE': '主体作业区'
            }
        },
        listeners: {// 给子集下拉框赋值
            load: function (store, records) {
                Ext.getCmp('dept').select(zyqStore.getAt(0));
            }
        }
    });
    // 编辑弹窗作业区store
    var deptStore = Ext.create('Ext.data.Store', {
        id: 'deptStore',
        autoLoad: false,
        async: false,
        fields: ['V_SAP_WORK', 'V_SAP_JHGC', 'V_DEPTNAME', 'V_DEPTCODE_UP', 'V_DEPTCODE', 'V_SAP_YWFW', 'V_SAP_DEPT'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'PM_06/PRO_BASE_DEPT_VIEW_ROLE',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            },
            extraParams: {
                'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode'),
                'V_V_DEPTCODENEXT': '%',
                'V_V_DEPTTYPE': '主体作业区'
            }
        }
    });
    // 编辑弹窗设备类型store
    var eTypeStore = Ext.create('Ext.data.Store', {
        id: 'eTypeStore',
        autoLoad: false,
        async: false,
        fields: ['V_EQUTYPECODE', 'V_EQUTYPENAME', 'I_ORDER', 'I_ID'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'PM_06/PRO_GET_DEPTEQUTYPE_PER',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            },
            extraParams: {
                'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode')
            }
        }
    });
    // 编辑弹窗设备名称store
    var equNameStore = Ext.create('Ext.data.Store', {
        id: 'equNameStore',
        autoLoad: false,
        async: false,
        fields: ['V_EQUCODE', 'V_EQUNAME', 'I_ORDER', 'I_ID'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'PM_06/pro_get_deptequ_per',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            },
            extraParams: {
                'v_v_personcode': Ext.util.Cookies.get('v_personcode')
            }
        }
    });
    // 编辑弹窗子设备store
    var subequNameStore = Ext.create('Ext.data.Store', {
        id: 'subequNameStore',
        autoLoad: false,
        async: false,
        fields: ['sid', 'text'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'pm_19/PRO_SAP_PM_CHILDEQU_TREE',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            },
            extraParams: {
                'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode')
            }
        }
    });
    // 工种store1
    var gzStore1 = Ext.create('Ext.data.Store', {
        id: 'gzStore1',
        autoLoad: false,
        loading: false,
        fields: ['V_JXGX_CODE', 'V_PERCODE_DE', 'V_PERNAME_DE', 'V_PERTYPE_DE', 'V_DE', 'V_TS','V_PERNUM'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'Wsy/PRO_PM_19_WORKDE_GXSEL',// 传入工序CODE查询工种
            async: true,
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            },
            extraParams: {}
        }
    });
    // 工具store
    var gjStore1 = Ext.create('Ext.data.Store', {
        id: 'gjStore1',
        autoLoad: false,
        fields: ['V_JXGX_CODE', 'V_TOOLCODE', 'V_TOOLNAME', 'V_TOOLTYPE', 'V_TOOLPLACE', 'V_TOOLINDATE', 'V_TOOLSTATUS'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'Wsy/BASE_GJ_BYGX_SEL',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            },
            extraParams: {}
        }
    });
    // 设备树store
    var treeStore = Ext.create('Ext.data.TreeStore', {
        id: 'treeStore',
        autoLoad: false,
        fields: ['sid', 'text', 'parentid', 'V_EQUSITE']
    });
    // 空白gridStore
    var gridStore = Ext.create('Ext.data.Store', {
        storeId: 'gridStore',
        autoLoad: false,
        pageSize: 2,
        fields: ['data_'],
        data: [[' '], [' '], [' '], [' '], [' ']],// 添加五行空白数据
        proxy: {
            url: 'selectZZ.do',
            type: 'ajax',
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'ZZlist',
                totalProperty: 'total'
            }
        }
    });
    // 检修模型store
    var jxmxStore = Ext.create('Ext.data.Store', {
        storeId: 'jxmxStore',
        autoLoad: false,
        loading: false,
        pageSize: 20,
        fields: ['V_MX_CODE', 'V_MX_NAME', 'V_GX_CODE', 'V_ORGCODE', 'V_DEPTCODE', 'V_EQUTYPE', 'V_EQUCODE', 'V_EQUCODE_CHILD', 'V_BZ', 'V_IN_DATE', 'V_IN_PER', 'V_REPAIRMAJOR_CODE', 'V_HOUR', 'V_MXBB_NUM'],
        proxy: {
            url: AppUrl + 'Wsy/PM_1917_JXMX_DATA_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 检修工序store
    var jxgxStore = Ext.create('Ext.data.Store', {
        storeId: 'jxgxStore',
        autoLoad: false,
        loading: false,
        pageSize: 20,
        fields: ['V_MX_CODE', 'V_MX_NAME', 'V_JXGX_CODE', 'V_JXGX_NAME', 'V_JXGX_NR', 'V_GZZX_CODE'],
        proxy: {
            url: AppUrl + 'Wsy/PM_1917_JXGX_DATA_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 机具store
    var jjStore = Ext.create('Ext.data.Store', {
        storeId: 'jjStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_JXGX_CODE', 'V_JJ_CODE', 'V_JJ_NAME', 'V_JJ_TYPE', 'V_JJ_TS', 'V_JJ_DE'],
        proxy: {
            url: AppUrl + 'Wsy/PRO_PM_19_CARDE_GXSEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 机具信息store
    var jjxxStore = Ext.create('Ext.data.Store', {
        storeId: 'jjxxStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_CARCODE', 'V_CARNAME', 'V_DE', 'V_CARGUISUO', 'V_USE', 'V_FLAG', 'V_DRIVER_NAME'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_JXMX_JJCODE_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 安全措施store
    var aqcsStore = Ext.create('Ext.data.Store', {
        storeId: 'aqcsStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_AQCS_CODE', 'V_AQCS_NAME', 'V_EQUCODE', 'V_EQUNAME', 'V_EQUSITE', 'V_AQCS_BBH', 'V_AQ_ZYSX', 'V_AQCS_DETAIL', 'V_GX_CODE'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_AQCS_BY_GXCODE_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 安全措施预案store
    var aqcsyaStore = Ext.create('Ext.data.Store', {
        storeId: 'aqcsyaStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_AQCS_CODE', 'V_AQYA_CODE', 'V_AQYA_NAME', 'V_AQYA_DETAIL'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_AQCS_AQYA_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 安全事故案例store
    var aqsgalStore = Ext.create('Ext.data.Store', {
        storeId: 'aqsgalStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_FINDTIME', 'V_FAULT_DD', 'V_FAULT_YY', 'V_FAULT_XX', 'V_FILE_GUID'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_AQCS_FAULT_ITEM_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 安全措施整改store
    var aqcszgStore = Ext.create('Ext.data.Store', {
        storeId: 'aqcszgStore',
        autoLoad: false,
        loading: false,
        pageSize: 20,
        fields: ['V_AQCS_CODE', 'V_ZG_GUID', 'V_ZG_TIME', 'V_ZG_PLACE', 'V_ZG_PERSON', 'V_ZG_DETAIL', 'V_ZG_COST'],
        proxy: {
            url: AppUrl + 'zs/BASE_AQCS_ZG_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 安全措施附件store
    var aqcsfjStore = Ext.create('Ext.data.Store', {
        storeId: 'aqcsfjStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_GUID', 'V_FILEGUID', 'V_FILENAME', 'V_TIME', 'V_PERSON'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_FILE_CHAKAN_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 安全措施通用附件store
    var aqcsfjStore1 = Ext.create('Ext.data.Store', {
        storeId: 'aqcsfjStore1',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_GUID', 'V_FILEGUID', 'V_FILENAME', 'V_TIME', 'V_PERSON'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_FILE_CHAKAN_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 检修技术标准store
    var jxjsbzStore = Ext.create('Ext.data.Store', {
        storeId: 'jxjsbzStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_GUID', 'V_PART_NUMBER', 'V_PART_NAME', 'V_PART_CODE', 'V_MATERIAL', 'V_IMGSIZE', 'V_IMGGAP', 'V_VALUE_UP', 'V_VALUE_DOWN', 'V_REPLACE_CYC', 'V_WEIGHT', 'V_IMGCODE', 'V_CONTENT'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_JXBZ_BY_GXCODE_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 子设备检修技术标准store
    var zsbjxStore = Ext.create('Ext.data.Store', {
        storeId: 'zsbjxStore',
        autoLoad: true,
        loading: false,
        //pageSize: -1,
        fields: ['V_GUID', 'V_PART_NUMBER', 'V_PART_NAME', 'V_PART_CODE', 'V_MATERIAL', 'V_IMGSIZE', 'V_IMGGAP', 'V_VALUE_UP', 'V_VALUE_DOWN', 'V_REPLACE_CYC', 'V_WEIGHT', 'V_IMGCODE', 'V_CONTENT'],
        proxy: {
            url: AppUrl + 'Wsy/PM_REPAIR_JS_STANDARD_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {
                V_V_ORGCODE: V_V_ORGCODE,
                V_V_DEPTCODE: V_V_DEPTCODE,
                V_V_EQUCODE: V_V_EQUCODE,
                V_V_EQUCHILDCODE: '%',
                V_V_EQUTYPECODE: V_V_EQUTYPECODE
            },
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 工单明细store
    var gdmxStore = Ext.create('Ext.data.Store', {
        storeId: 'gdmxStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_ORDERGUID', 'V_ORDERID', 'D_ENTER_DATE', 'V_SHORT_TXT', 'V_ORDER_TYP', 'V_DEPTNAME', 'V_STATECODE'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_JXBZ_GD_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 缺陷明细store
    var qxmxStore = Ext.create('Ext.data.Store', {
        storeId: 'qxmxStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_GUID', 'D_DEFECTDATE', 'V_DEFECTLIST', 'V_IDEA', 'V_STATECODE'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_JXBZ_QX_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 检修机具store1
    var jxjjStore1 = Ext.create('Ext.data.Store', {
        storeId: 'jxjjStore1',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_JJ_CODE', 'V_JJ_NAME', 'V_JJ_TYPE', 'V_JJ_DE', 'V_JJ_TS'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_JJ_BYJXBZ_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 检修机具store2
    var jxjjStore2 = Ext.create('Ext.data.Store', {
        storeId: 'jxjjStore2',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_CARCODE', 'V_CARNAME', 'V_DE', 'V_CARGUISUO', 'V_USE', 'V_FLAG', 'V_DRIVER_NAME'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_JXMX_JJCODE_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 检修工具store1
    var jxgjStore1 = Ext.create('Ext.data.Store', {
        storeId: 'jxgjStore1',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_TOOLCODE', 'V_TOOLNAME', 'V_TOOLTYPE', 'V_TOOLPLACE', 'V_TOOLINDATE', 'V_TOOLSTATUS'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_GJ_BYJXBZ_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 检修工种store1
    var jxgzStore1 = Ext.create('Ext.data.Store', {
        storeId: 'jxgzStore1',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_PERCODE_DE', 'V_PERNAME_DE', 'V_PERTYPE_DE', 'V_DE', 'V_TS','V_PERNUM'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_GZ_BYJXBZ_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 历史工单store
    var lsgdStore = Ext.create('Ext.data.Store', {
        storeId: 'lsgdStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_ORDERGUID', 'V_ORDERID', 'V_ORDER_TYP_TXT', 'V_SHORT_TXT', 'D_ENTER_DATE', 'V_DEPTNAME'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_GD_BY_GXGUID_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 历史工单—工种store
    var gdgzStore = Ext.create('Ext.data.Store', {
        storeId: 'gdgzStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_PERCODE_DE', 'V_PERNAME_DE', 'V_PERTYPE_DE', 'V_DE', 'V_TS'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_GZ_BY_GDGUID_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 历史工单—工具store
    var gdgjStore = Ext.create('Ext.data.Store', {
        storeId: 'gdgjStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_GJ_CODE', 'V_GJ_NAME', 'V_GJ_TYPE'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_GJ_BY_GDGUID_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 历史工单—机具store
    var gdjjStore = Ext.create('Ext.data.Store', {
        storeId: 'gdjjStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_JJ_CODE', 'V_JJ_NAME', 'V_JJ_TYPE', 'V_JJ_TS'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_JJ_BY_GDGUID_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 物料store
    var wlStore = Ext.create('Ext.data.Store', {
        storeId: 'wlStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_JXGX_CODE', 'V_WLCODE', 'V_KFNAME', 'V_WLSM', 'V_GGXH', 'V_JLDW', 'V_PRICE', 'V_USE_NUM'],
        proxy: {
            url: AppUrl + 'Wsy/PM_1917_JXGX_WL_DATA_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 历史工单—物料store
    var gdwlStore = Ext.create('Ext.data.Store', {
        storeId: 'gdwlStore',
        autoLoad: false,
        loading: false,
        //pageSize: -1,
        fields: ['V_WLCODE', 'V_WLSM', 'V_USE_NUM'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_WL_BY_GDGUID_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });

    // 工种按钮组panel
    var gzButtonPanel = Ext.create('Ext.Panel', {
        id: 'gzButtonPanel',
        frame: true,
        region: 'north',
        border: false,
        layout: 'column',
        items: [{
            xtype: 'button',
            text: '选择并添加',
            width: 100,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/add.png',
            handler: _openAddgzWindow
        }, {
            xtype: 'button',
            text: '修改',
            width: 60,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/edit.png',
            handler: _openEditgzWindow
        }, {
            xtype: 'button',
            text: '删除',
            width: 60,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/delete1.png',
            handler: _openDeletegzWindow
        }]
    });
    // 工种gridPanel
    var gzPanel1 = Ext.create('Ext.grid.Panel', {
        id: 'gzPanel1',
        columnLines: true,
        region: 'center',
        frame: true,
        store: gzStore1,
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '工种编码',
            dataIndex: 'V_PERCODE_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种名称',
            dataIndex: 'V_PERNAME_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种类型',
            dataIndex: 'V_PERTYPE_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种定额',
            dataIndex: 'V_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种台时',
            dataIndex: 'V_TS',
            align: 'center',
            flex: 1
        }, {
            text: '工种人数',
            dataIndex: 'V_PERNUM',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'gzPanel1_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: gzStore1,
            width: '100%'
        }]
    });
    // 工种panel集合
    var gzPanel = Ext.create('Ext.Panel', {
        id: 'gzPanel',
        title: '工种',
        baseCls: 'my-panel-no-border',
        frame: true,
        layout: 'border',
        items: [gzButtonPanel, gzPanel1]
    });
    // 机具按钮组panel
    var jjButtonPanel = Ext.create('Ext.Panel', {
        id: 'jjButtonPanel',
        frame: true,
        region: 'north',
        border: false,
        layout: 'column',
        items: [{
            xtype: 'button',
            text: '选择并添加',
            width: 100,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/add.png',
            handler: _openAddjjWindow
        }, {
            xtype: 'button',
            text: '修改',
            width: 60,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/edit.png',
            handler: _openEditjjWindow
        }, {
            xtype: 'button',
            text: '删除',
            width: 60,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/delete1.png',
            handler: _openDeletejjWindow
        }]
    });
    // 机具gridPanel
    var jjPanel1 = Ext.create('Ext.grid.Panel', {
        id: 'jjPanel1',
        columnLines: true,
        frame: true,
        store: jjStore,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '车辆名称',
            dataIndex: 'V_JJ_NAME',
            align: 'center',
            flex: 1
        }, {
            text: '车辆类型',
            dataIndex: 'V_JJ_TYPE',
            align: 'center',
            flex: 1
        }, {
            text: '检修台时',
            dataIndex: 'V_JJ_TS',
            align: 'center',
            flex: 1
        }, {
            text: '车辆定额',
            dataIndex: 'V_JJ_DE',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'jjPanel1_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: jjStore,
            width: '100%'
        }],
        listeners: {
            itemclick: function (panel, record, item, index, e, eOpts) {
                _queryjjxx(record.get('V_JJ_CODE'));
            }
        }
    });
    // 机具信息gridPanel
    var jjxxPanel1 = Ext.create('Ext.grid.Panel', {
        id: 'jjxxPanel1',
        title: '机具信息',
        columnLines: true,
        frame: true,
        store: jjxxStore,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '机具编码',
            dataIndex: 'V_CARCODE',
            align: 'center',
            flex: 1
        }, {
            text: '机具名称',
            dataIndex: 'V_CARNAME',
            align: 'center',
            flex: 1
        }, {
            text: '机具定额',
            dataIndex: 'V_DE',
            align: 'center',
            flex: 1
        }, {
            text: '机具所属单位',
            dataIndex: 'V_CARGUISUO',
            align: 'center',
            flex: 1
        }, {
            text: '机具用途',
            dataIndex: 'V_USE',
            align: 'center',
            flex: 1
        }, {
            text: '机具状态',
            dataIndex: 'V_FLAG',
            align: 'center',
            flex: 1
        }, {
            text: '司机姓名',
            dataIndex: 'V_DRIVER_NAME',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'jjxxPanel1_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: jjxxStore,
            width: '100%'
        }]
    });
    // 机具panel集合
    var jjPanel = Ext.create('Ext.Panel', {
        id: 'jjPanel',
        title: '机具',
        frame: true,
        baseCls: 'my-panel-no-border',
        border: false,
        layout: 'border',
        items: [{
            region: 'north',
            layout: 'fit',
            baseCls: 'my-panel-no-border',
            items: [jjButtonPanel]
        }, {
            region: 'north',
            height: '45%',
            layout: 'fit',
            baseCls: 'my-panel-no-border',
            items: [jjPanel1]
        }, {
            region: 'center',
            layout: 'fit',
            baseCls: 'my-panel-no-border',
            items: [jjxxPanel1]
        }]
    });
    // 工具按钮组panel
    var gjButtonPanel = Ext.create('Ext.Panel', {
        id: 'gjButtonPanel',
        frame: true,
        region: 'north',
        border: false,
        layout: 'column',
        items: [{
            xtype: 'button',
            text: '选择并添加',
            width: 100,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/add.png',
            handler: _openAddgjWindow
        }, {
            xtype: 'button',
            text: '修改',
            width: 60,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/edit.png',
            handler: _openEditgjWindow
        }, {
            xtype: 'button',
            text: '删除',
            width: 60,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/delete1.png',
            handler: _openDeletegjWindow
        }]
    });
    // 工具gridPanel
    var gjPanel1 = Ext.create('Ext.grid.Panel', {
        id: 'gjPanel1',
        columnLines: true,
        frame: true,
        store: gjStore1,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '工具名称',
            dataIndex: 'V_TOOLNAME',
            align: 'center',
            flex: 1
        }, {
            text: '工具类型',
            dataIndex: 'V_TOOLTYPE',
            align: 'center',
            flex: 1
        }, {
            text: '工具存在地',
            dataIndex: 'V_TOOLPLACE',
            align: 'center',
            flex: 1
        }, {
            text: '工具入厂时间',
            dataIndex: 'V_TOOLINDATE',
            align: 'center',
            flex: 2,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {// 渲染
                var index = gjStore1.find('V_TOOLINDATE', value);
                if (index != -1) {
                    return gjStore1.getAt(index).get('V_TOOLINDATE').substring(0, 19);
                }
                return null;
            }
        }, {
            text: '工具状态',
            dataIndex: 'V_TOOLSTATUS',
            align: 'center',
            flex: 1,
            renderer : function(value, metaData, record, rowIndex, colIndex, store, view) {
                return (value != null && value != '') ? toolsStatusStore.findRecord('V_TOOLSTATUS_CODE', new RegExp('^' + value + '$')).get('V_TOOLSTATUS_NAME') : value;
            }
        }],
        bbar: [{
            id: 'gjPanel1_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: gjStore1,
            width: '100%'
        }]
    });
    // 工具panel集合
    var gjPanel = Ext.create('Ext.Panel', {
        id: 'gjPanel',
        title: '工具',
        frame: true,
        baseCls: 'my-panel-no-border',
        border: false,
        layout: 'border',
        items: [{
            region: 'north',
            layout: 'fit',
            baseCls: 'my-panel-no-border',
            items: [gjButtonPanel]
        }, {
            region: 'center',
            // height: '45%',
            layout: 'fit',
            baseCls: 'my-panel-no-border',
            items: [gjPanel1]
        }]
    });
    // 物料按钮组panel
    var wlButtonPanel = Ext.create('Ext.Panel', {
        id: 'wlButtonPanel',
        frame: true,
        region: 'north',
        border: false,
        layout: 'column',
        items: [{
            xtype: 'button',
            text: '选择并添加',
            width: 100,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/add.png',
            handler: _openAddwlWindow
        }, {
            xtype: 'button',
            text: '修改',
            width: 60,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/edit.png',
            handler: _openEditwlWindow
        }, {
            xtype: 'button',
            text: '删除',
            width: 60,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/delete1.png',
            handler: _openDeletewlWindow
        }]
    });
    // 物料表格1gridPanel
    var wlPanel1 = Ext.create('Ext.grid.Panel', {
        id: 'wlPanel1',
        columnLines: true,
        frame: true,
        region: 'center',
        //height: '45%',
        store: wlStore,
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '物料编码',
            dataIndex: 'V_WLCODE',
            align: 'center',
            flex: 1
        }, {
            text: '物料名称',
            dataIndex: 'V_WLSM',
            align: 'center',
            flex: 1
        }, {
            text: '数量',
            dataIndex: 'V_USE_NUM',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'wlPanel1_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: wlStore,
            width: '100%'
        }]
    });

    // 物料panel
    var wlPanel = Ext.create('Ext.Panel', {
        id: 'wlPanel',
        title: '物料',
        baseCls: 'my-panel-no-border',
        frame: true,
        layout: 'border',
        items: [wlButtonPanel, wlPanel1]
    });
    // 安全措施按钮组panel
    var aqcsButtonPanel = Ext.create('Ext.Panel', {
        id: 'aqcsButtonPanel',
        frame: true,
        region: 'north',
        border: false,
        layout: 'column',
        items: [{
            xtype: 'button',
            text: '选择并添加',
            width: 100,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/add.png',
            handler: _openAddaqcsWindow
        }, {
            xtype: 'button',
            text: '删除',
            width: 60,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/delete1.png',
            handler: _openDeleteaqcsWindow
        }]
    });
    // 安全措施左上gridPanel
    var aqcsPanel0 = Ext.create('Ext.grid.Panel', {
        id: 'aqcsPanel0',
        columnLines: true,
        region: 'center',
        frame: true,
        store: aqcsStore,
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '安全措施名称',
            dataIndex: 'V_AQCS_NAME',
            align: 'center',
            flex: 1
        }, {
            text: '安全措施版本号',
            dataIndex: 'V_AQCS_BBH',
            align: 'center',
            flex: 1
        } ],
        bbar: [{
            id: 'aqcsPanel1_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: aqcsStore,
            width: '100%'
        }],
        listeners: {
            itemclick: function (panel, record, item, index, e, eOpts) {
                _queryaqcsya(record.get('V_AQCS_CODE'));
                _queryaqsgal(record.get('V_AQCS_CODE'));
                _queryaqcsxq(record.get('V_AQCS_CODE'));
                _queryaqcsfj(record.get('V_AQCS_CODE'));
            }
        }
    });
    // 安全措施左上panel集合
    var aqcsPanel1 = Ext.create('Ext.Panel', {
        id: 'aqcsPanel1',
        region: 'north',
        height: '55%',
        baseCls: 'my-panel-no-border',
        frame: true,
        layout: 'border',
        items: [aqcsButtonPanel, aqcsPanel0]
    });
    // 安全措施左下formPanel
    var aqcsPanel2 = Ext.create('Ext.form.Panel', {
        id: 'aqcsPanel2',
        border: false,
        title: '安全措施详情',
        region: 'center',
        frame: true,
        autoScroll: true,
        // layout: 'column',
        defaults: {
            labelAlign: 'right',
            labelWidth: 100,
            inputWidth: 340,
            style: 'margin: 25px 30px 0px 30px'
        },
        items: [{
            xtype: 'textfield',
            id: 'V_AQCS_NAME',
            name: 'V_AQCS_NAME',
            fieldLabel: '安全措施名称',
            maxLength: 60
        }, {
            xtype: 'textareafield',
            id: 'V_AQCS_DETAIL',
            name: 'V_AQCS_DETAIL',
            fieldLabel: '安全措施明细',
            maxLength: 60
        }, {
            xtype: 'textareafield',
            id: 'V_AQ_ZYSX',
            name: 'V_AQ_ZYSX',
            fieldLabel: '安全措施注意事项',
            maxLength: 60
        }]
    });
    // 安全措施预案gridPanel
    var aqcsyaPanel = Ext.create('Ext.grid.Panel', {
        id: 'aqcsyaPanel',
        columnLines: true,
        title: '安全措施预案',
        store: aqcsyaStore,
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '预案名称',
            dataIndex: 'V_AQYA_NAME',
            align: 'center',
            flex: 1
        }, {
            text: '预案详情',
            dataIndex: 'V_AQYA_DETAIL',
            align: 'center',
            flex: 1
        }, {
            text: '附件',
            dataIndex: 'V_AQYA_DETAIL',
            align: 'center',
            flex: 1,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                return '<a href=javascript:_openAttachWindow(\'' + record.data.V_AQYA_CODE + '\')>查看</a>';
            }
        }],
        bbar: [{
            id: 'aqcsyaPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: aqcsyaStore,
            width: '100%'
        }]
    });
    // 安全事故案例gridPanel
    var aqsgalPanel = Ext.create('Ext.grid.Panel', {
        id: 'aqsgalPanel',
        columnLines: true,
        title: '安全事故案例',
        store: aqsgalStore,
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '事故发生时间',
            dataIndex: 'V_FINDTIME',
            align: 'center',
            flex: 1
        }, {
            text: '事故发生地点',
            dataIndex: 'V_FAULT_DD',
            align: 'center',
            flex: 1
        }, {
            text: '事故影响',
            dataIndex: 'V_FAULT_YY',
            align: 'center',
            flex: 1
        }, {
            text: '事故详情',
            dataIndex: 'V_FAULT_XX',
            align: 'center',
            flex: 1
        }, {
            text: '附件',
            align: 'center',
            flex: 1,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                return '<a href=javascript:_openAttachWindow(\'' + record.data.V_FILE_GUID + '\')>查看</a>';
            }
        }],
        bbar: [{
            id: 'aqsgalPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: aqsgalStore,
            width: '100%'
        }]
    });

    // 安全措施附件gridPanel
    var aqcsfjPanel = Ext.create('Ext.grid.Panel', {
        id: 'aqcsfjPanel',
        columnLines: true,
        title: '安全措施附件',
        store: aqcsfjStore,
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '附件名称',
            dataIndex: 'V_FILENAME',
            align: 'center',
            flex: 1
        }, {
            text: '上传时间',
            dataIndex: 'V_TIME',
            align: 'center',
            flex: 1
        }, {
            text: '上传人',
            dataIndex: 'V_PERSON',
            align: 'center',
            flex: 1
        }, {
            text: '附件下载',
            align: 'center',
            flex: 1,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                return '<a href=javascript:_downloadAttach(\'' + record.data.V_FILEGUID + '\')>下载</a>';// 超链接导出
            }
        }],
        bbar: [{
            id: 'aqcsfjPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: aqcsfjStore,
            width: '100%'
        }]
    });
    // 安全措施右边tab
    var tab1 = Ext.create('Ext.tab.Panel', {
        id: 'tab1',
        region: 'east',
        width: '53%',
        frame: true,
        items: [aqcsyaPanel, aqsgalPanel, aqcsfjPanel]
    });
    // 安全措施panel
    var aqcsPanel = Ext.create('Ext.Panel', {
        id: 'aqcsPanel',
        title: '安全措施',
        baseCls: 'my-panel-no-border',
        frame: true,
        layout: {
            type: 'border',
            regionWeights: {
                north: 3,
                east: 4,
                south: 1,
                west: 1
            }
        },
        items: [aqcsPanel1, aqcsPanel2, tab1]
    });
    // 已选检修技术标准按钮
    var jxjsbzButton = Ext.create('Ext.Panel', {
        id: 'jxjsbzButton',
        frame: true,
        title: '已选检修技术标准',
        region: 'north',
        border: false,
        layout: 'column',
        items: [{
            xtype: 'button',
            text: '选择并添加',
            width: 100,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/add.png',
            handler: _openAddjsbzWindow
        },{
            xtype: 'button',
            text: '删除',
            width: 60,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/delete1.png',
            handler: _openDeletejxjsbzWindow
        }]
    });
    // 已选检修技术标准gridPanel
    var jxjsbzPanel1 = Ext.create('Ext.grid.Panel', {
        id: 'jxjsbzPanel1',
        columnLines: true,
        region: 'center',
        frame: true,
        //layout:'fit',
        store: jxjsbzStore,
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '零件编号',
            dataIndex: 'V_PART_NUMBER',
            align: 'center',
            width: 80
        }, {
            text: '零件名称',
            dataIndex: 'V_PART_NAME',
            align: 'center',
            width: 80
        }, {
            text: '零件编码',
            dataIndex: 'V_PART_CODE',
            align: 'center',
            width: 80
        }, {
            text: '材料',
            dataIndex: 'V_MATERIAL',
            align: 'center',
            width: 80
        }, {
            text: '维修技术标准',
            align: 'center',
            flex: 4,
            columns: [{
                text: '图面尺寸',
                dataIndex: 'V_IMGSIZE',
                align: 'center',
                flex: 1
            }, {
                text: '图面间隙',
                dataIndex: 'V_IMGGAP',
                align: 'center',
                flex: 1
            }, {
                text: '允许值(上限)',
                dataIndex: 'V_VALUE_UP',
                align: 'center',
                flex: 1
            }, {
                text: '允许值(下限)',
                dataIndex: 'V_VALUE_DOWN',
                align: 'center',
                flex: 1
            }]
        }, {
            text: '更换周期',
            dataIndex: 'V_REPLACE_CYC',
            align: 'center',
            width: 80
        }, {
            text: '重量',
            dataIndex: 'V_WEIGHT',
            align: 'center',
            width: 80
        }, {
            text: '图号',
            dataIndex: 'V_IMGCODE',
            align: 'center',
            width: 80
        }, {
            text: '备注',
            dataIndex: 'V_CONTENT',
            align: 'center',
            width: 80
        }],
        bbar: [{
            id: 'jxjsbzPanel1_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: jxjsbzStore,
            width: '100%'
        }],
        listeners: {
            itemclick: function (panel, record, item, index, e, eOpts) {
                _querygdmx(record.get('V_GUID'));
                _queryjxjj(record.get('V_GUID'));
                _queryjxgj(record.get('V_GUID'));
                _queryjxgz(record.get('V_GUID'));
            }
        }
    });
    // 已选检修技术标准panel(技术要求左上)
    var jxjsbzPanel = Ext.create('Ext.Panel', {
        id: 'jxjsbzPanel',
        baseCls: 'my-panel-no-border',
        title:'技术要求',
        frame: true,
        layout: 'border',
        items: [jxjsbzButton, jxjsbzPanel1]
    });
    // 子设备检修技术标准按钮
    var zsbjxButton = Ext.create('Ext.Panel', {
        id: 'zsbjxButton',
        frame: true,
        region: 'north',
        border: false,
        layout: 'column',
        defaults: {
            labelAlign: 'right',
            labelWidth: 80,
            inputWidth: 140,
            style: 'margin:5px 0px 5px 10px'
        },
        items: [{
            xtype: 'textfield',
            id: 'zsbmc',
            name: 'zsbmc',
            fieldLabel: '子设备名称:',
            maxLength: 60
        }, {
            xtype: 'button',
            text: '查询',
            icon: imgpath + '/search.png',
            style: 'margin:5px 0px 5px 20px',
            width: 60,
            handler: _queryzsb
        }, {
            xtype: 'button',
            text: '添加',
            icon: imgpath + '/add.png',
            width: 60,
            handler: function () {
                var records = Ext.getCmp('zsbjxPanel1').getSelectionModel().getSelection();
                var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
                if (records.length == 0) {
                    Ext.Msg.alert('操作信息', '请选择一条零件记录');
                    return;
                }else if(jxgxPanel.length == 0){
                    Ext.Msg.alert('操作信息', '请选择一条工序');
                    return;
                }else {
                    var V_JXGX_CODE ='';
                    if(jxgxPanel[0].data.V_JXGX_CODE != null){
                    V_JXGX_CODE=jxgxPanel[0].data.V_JXGX_CODE;
                    }
                    var sum = 0;
                    for (var i = 0; i < records.length; i++) {
                        Ext.Ajax.request({
                            url: AppUrl + 'Wsy/BASE_JXBZ_BY_GXCODE_INS',
                            type: 'ajax',
                            method: 'POST',
                            async: false,
                            params: {
                                V_V_JXGX_CODE: V_JXGX_CODE,
                                V_V_JSYQ_CODE: records[i].data.V_GUID,
                                V_V_JSYQ_NAME: records[i].data.V_PART_NAME
                            },
                            success: function (response) {
                                var data = Ext.decode(response.responseText);
                                if (data.V_INFO == 'SUCCESS') {
                                    sum++;
                                }
                            },
                            failure: function (response) {
                                Ext.MessageBox.show({
                                    title: '错误',
                                    msg: response.responseText,
                                    buttons: Ext.MessageBox.OK,
                                    icon: Ext.MessageBox.ERROR
                                });
                            }
                        });
                    }
                    if (sum == records.length) {
                        Ext.Msg.alert('提示信息', '添加成功');
                    } else {
                        Ext.MessageBox.show({
                            title: '错误',
                            msg: records.length - sum + '条添加失败',
                            buttons: Ext.MessageBox.OK,
                            icon: Ext.MessageBox.ERROR
                        });
                    }
                    //_queryjxjsbz();
                    _queryzsb();
                }
            }
        }]
    });
    // 子设备检修技术标准gridPanel
    var zsbjxPanel1 = Ext.create('Ext.grid.Panel', {
        id: 'zsbjxPanel1',
        columnLines: true,
        region: 'center',
        frame: true,
        store: zsbjxStore,
        autoScroll: true,
        selModel: {
            selType: 'checkboxmodel',
            mode: 'SIMPLE'
        },
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '零件编号',
            dataIndex: 'V_PART_NUMBER',
            align: 'center',
            width: 80
        }, {
            text: '零件名称',
            dataIndex: 'V_PART_NAME',
            align: 'center',
            width: 80
        }, {
            text: '零件编码',
            dataIndex: 'V_PART_CODE',
            align: 'center',
            width: 80
        }, {
            text: '材料',
            dataIndex: 'V_MATERIAL',
            align: 'center',
            width: 80
        }, {
            text: '维修技术标准',
            align: 'center',
            flex: 4,
            columns: [{
                text: '图面尺寸',
                dataIndex: 'V_IMGSIZE',
                align: 'center',
                flex: 1
            }, {
                text: '图面间隙',
                dataIndex: 'V_IMGGAP',
                align: 'center',
                flex: 1
            }, {
                text: '允许值(上限)',
                dataIndex: 'V_VALUE_UP',
                align: 'center',
                flex: 1
            }, {
                text: '允许值(下限)',
                dataIndex: 'V_VALUE_DOWN',
                align: 'center',
                flex: 1
            }]
        }, {
            text: '更换周期',
            dataIndex: 'V_REPLACE_CYC',
            align: 'center',
            width: 80
        }, {
            text: '重量',
            dataIndex: 'V_WEIGHT',
            align: 'center',
            width: 80
        }, {
            text: '图号',
            dataIndex: 'V_IMGCODE',
            align: 'center',
            width: 80
        }, {
            text: '备注',
            dataIndex: 'V_CONTENT',
            align: 'center',
            width: 80
        }],
        bbar: [{
            id: 'zsbjxPanel1_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: zsbjxStore,
            width: '100%'
        }]
    });
    // 子设备检修技术标准panel（技术要求左下）
    var zsbjxPanel = Ext.create('Ext.Panel', {
        id: 'zsbjxPanel',
        baseCls: 'my-panel-no-border',
        region: 'center',
        frame: true,
        layout: 'border',
        items: [zsbjxButton, zsbjxPanel1]
    });
    // 工单明细gridPanel
    var gdmxPanel = Ext.create('Ext.grid.Panel', {
        id: 'gdmxPanel',
        columnLines: true,
        region: 'north',
        height: '50%',
        store: gdmxStore,
        title: '工单明细',
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '工单编号',
            dataIndex: 'V_ORDERID',
            align: 'center',
            width: 150
        }, {
            text: '工单创建日期',
            dataIndex: 'D_ENTER_DATE',
            align: 'center',
            width: 230,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {// 渲染
                var index = gdmxStore.find('D_ENTER_DATE', value);
                if (index != -1) {
                    return gdmxStore.getAt(index).get('D_ENTER_DATE').substring(0, 19);
                }
                return null;
            }
        }, {
            text: '工单检修描述',
            dataIndex: 'V_SHORT_TXT',
            align: 'center',
            width: 150
        }, {
            text: '工单类型',
            dataIndex: 'V_ORDER_TYP',
            align: 'center',
            width: 80
        }, {
            text: '检修单位',
            dataIndex: 'V_DEPTNAME',
            align: 'center',
            width: 230
        }, {
            text: '检修标准值',
            dataIndex: '',
            align: 'center',
            width: 80
        }, {
            text: '工单状态',
            dataIndex: 'V_STATECODE',
            align: 'center',
            width: 80
        }],
        bbar: [{
            id: 'gdmxPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: gdmxStore,
            width: '100%'
        }],
        listeners: {
            itemclick: function (panel, record, item, index, e, eOpts) {
                _queryqxmx(record.get('V_ORDERGUID'));
            }
        }
    });
    // 缺陷明细gridPanel
    var qxmxPanel = Ext.create('Ext.grid.Panel', {
        id: 'qxmxPanel',
        columnLines: true,
        region: 'center',
        store: qxmxStore,
        title: '缺陷明细',
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '缺陷发现日期',
            dataIndex: 'D_DEFECTDATE',
            align: 'center',
            width: 230,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {// 渲染
                var index = qxmxStore.find('D_DEFECTDATE', value);
                if (index != -1) {
                    return qxmxStore.getAt(index).get('D_DEFECTDATE').substring(0, 19);
                }
                return null;
            }
        }, {
            text: '缺陷明细',
            dataIndex: 'V_DEFECTLIST',
            align: 'center',
            width: 150
        }, {
            text: '处理意见',
            dataIndex: 'V_IDEA',
            align: 'center',
            width: 150
        }, {
            text: '缺陷状态',
            dataIndex: 'V_STATECODE',
            align: 'center',
            width: 150
        }, {
            text: '缺陷来源',
            align: 'center',
            width: 80,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                return '<a href=javascript:_openqxlyWindow(\'' + record.data.V_GUID + '\')>查看</a>';// 超链接导出
            }
        }],
        bbar: [{
            id: 'qxmxPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: qxmxStore,
            width: '100%'
        }]
    });
    // 工单、缺陷明细
    var gdqxmxPanel = Ext.create('Ext.Panel', {
        id: 'gdqxmxPanel',
        title: '工单缺陷明细',
        baseCls: 'my-panel-no-border',
        frame: true,
        layout: {
            type: 'border',
            regionWeights: {
                north: 3,
                east: 4,
                south: 1,
                west: 1
            }
        },
        items: [gdmxPanel, qxmxPanel]
    });
    // 技术要求右边tab—检修工种上面表格
    var jxgzPanel1 = Ext.create('Ext.grid.Panel', {
        id: 'jxgzPanel1',
        title: '检修工种',
        columnLines: true,
        store: jxgzStore1,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '工种编码',
            dataIndex: 'V_PERCODE_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种名称',
            dataIndex: 'V_PERNAME_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种类型',
            dataIndex: 'V_PERTYPE_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种定额',
            dataIndex: 'V_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种台时',
            dataIndex: 'V_TS',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'jxgzPanel1_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: jxgzStore1,
            width: '100%'
        }]
    });
    // 技术要求右边tab—检修机具上面gridPanel
    var jxjjPanel1 = Ext.create('Ext.grid.Panel', {
        id: 'jxjjPanel1',
        columnLines: true,
        region: 'north',
        height: '50%',
        store: jxjjStore1,
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '机具名称',
            dataIndex: 'V_JJ_NAME',
            align: 'center',
            flex: 1
        }, {
            text: '机具类型',
            dataIndex: 'V_JJ_TYPE',
            align: 'center',
            flex: 1
        }, {
            text: '机具定额',
            dataIndex: 'V_JJ_DE',
            align: 'center',
            flex: 1
        }, {
            text: '机具台时',
            dataIndex: 'V_JJ_TS',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'jxjjPanel1_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: jxjjStore1,
            width: '100%'
        }],
        listeners: {
            itemclick: function (panel, record, item, index, e, eOpts) {
                _queryjxjjxx(record.get('V_JJ_CODE'));
            }
        }
    });
    // 技术要求右边tab—检修机具下面gridPanel
    var jxjjPanel2 = Ext.create('Ext.grid.Panel', {
        id: 'jxjjPanel2',
        columnLines: true,
        region: 'center',
        store: jxjjStore2,
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '机具编码',
            dataIndex: 'V_CARCODE',
            align: 'center',
            width: 80
        }, {
            text: '机具名称',
            dataIndex: 'V_CARNAME',
            align: 'center',
            width: 80
        }, {
            text: '机具定额',
            dataIndex: 'V_DE',
            align: 'center',
            width: 80
        }, {
            text: '机具所属单位',
            dataIndex: 'V_CARGUISUO',
            align: 'center',
            width: 100
        }, {
            text: '机具用途',
            dataIndex: 'V_USE',
            align: 'center',
            width: 80
        }, {
            text: '机具状态',
            dataIndex: 'V_FLAG',
            align: 'center',
            width: 80
        }, {
            text: '司机姓名',
            dataIndex: 'V_DRIVER_NAME',
            align: 'center',
            width: 80
        }],
        bbar: [{
            id: 'jxjjPanel2_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: jxjjStore2,
            width: '100%'
        }]
    });
    // 技术要求右边tab—检修机具
    var jxjjPanel = Ext.create('Ext.Panel', {
        id: 'jxjjPanel',
        title: '检修机具',
        baseCls: 'my-panel-no-border',
        frame: true,
        layout: {
            type: 'border',
            regionWeights: {
                north: 3,
                east: 4,
                south: 1,
                west: 1
            }
        },
        items: [jxjjPanel1, jxjjPanel2]
    });
    // 技术要求右边tab—检修工具gridPanel
    var jxgjPanel1 = Ext.create('Ext.grid.Panel', {
        id: 'jxgjPanel1',
        title: '检修工具',
        columnLines: true,
        store: jxgjStore1,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '工具名称',
            dataIndex: 'V_TOOLNAME',
            align: 'center',
            flex: 1
        }, {
            text: '工具类型',
            dataIndex: 'V_TOOLTYPE',
            align: 'center',
            flex: 1
        }, {
            text: '工具存在地',
            dataIndex: 'V_TOOLPLACE',
            align: 'center',
            flex: 1
        }, {
            text: '工具入厂时间',
            dataIndex: 'V_TOOLINDATE',
            align: 'center',
            width: 230,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {// 渲染
                var index = jxgjStore1.find('V_TOOLINDATE', value);
                if (index != -1) {
                    return jxgjStore1.getAt(index).get('V_TOOLINDATE').substring(0, 19);
                }
                return null;
            }
        }, {
            text: '工具状态',
            dataIndex: 'V_TOOLSTATUS',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'jxgjPanel1_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: jxgjStore1,
            width: '100%'
        }]
    });
    // 技术要求右边tab
    var tab3 = Ext.create('Ext.tab.Panel', {
        id: 'tab3',
        title: '检修详情',
        region: 'east',
        width: '50%',
        frame: true,
        items: [gdqxmxPanel, jxgzPanel1, jxjjPanel, jxgjPanel1]
    });
    // 技术要求
    var jsyqPanel = Ext.create('Ext.Panel', {
        id: 'jsyqPanel',
        title: '技术要求',
        baseCls: 'my-panel-no-border',
        frame: true,
        layout: {
            type: 'border',
            regionWeights: {
                north: 3,
                east: 4,
                south: 1,
                west: 1
            }
        },
        items: [jxjsbzPanel]
    });
    // 维修信息按钮组panel
    var wxxxButtonPanel = Ext.create('Ext.Panel', {
        id: 'wxxxButtonPanel',
        frame: true,
        region: 'north',
        border: false,
        layout: 'column',
        items: [{
            xtype: 'button',
            text: '选择并添加',
            width: 100,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/add.png',
            handler: _openAddgdWindow
        }, {
            xtype: 'button',
            text: '修改',
            width: 60,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/edit.png',
            handler: _openEditgdWindow
        }, {
            xtype: 'button',
            text: '删除',
            width: 60,
            style: 'margin:5px 0px 5px 10px',
            icon: imgpath + '/delete1.png',
            handler: _openDeletegdWindow
        }]
    });
    // 历史工单—维修信息gridPanel
    var wxxxPanel1 = Ext.create('Ext.grid.Panel', {
        id: 'wxxxPanel1',
        columnLines: true,
        store: lsgdStore,
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '工单号',
            dataIndex: 'V_ORDERID',
            align: 'center',
            flex: 1
        }, {
            text: '工单类型',
            dataIndex: 'V_ORDER_TYP_TXT',
            align: 'center',
            flex: 1
        }, {
            text: '检修内容',
            dataIndex: 'V_SHORT_TXT',
            align: 'center',
            flex: 1
        }, {
            text: '工单创建时间',
            dataIndex: 'D_ENTER_DATE',
            align: 'center',
            flex: 1
        }, {
            text: '检修单位',
            dataIndex: 'V_DEPTNAME',
            align: 'center',
            flex: 1
        }],
        listeners: {
            itemclick: function (panel, record, item, index, e, eOpts) {
                _querygdgz(record.get('V_ORDERGUID'));
                _querygdgj(record.get('V_ORDERGUID'));
                _querygdjj(record.get('V_ORDERGUID'));
                _querygdwl(record.get('V_ORDERGUID'));
            }
        },
        bbar: [{
            id: 'wxxxPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: lsgdStore,
            width: '100%'
        }]
    });
    // 维修信息panel集合
    var wxxxPanel = Ext.create('Ext.Panel', {
        id: 'wxxxPanel',
        title: '维修信息',
        frame: true,
        baseCls: 'my-panel-no-border',
        border: false,
        layout: 'border',
        items: [/*{
            region: 'north',
            layout: 'fit',
            baseCls: 'my-panel-no-border',
            items: [wxxxButtonPanel]
        },*/ {
            region: 'center',
            // height: '45%',
            layout: 'fit',
            baseCls: 'my-panel-no-border',
            items: [wxxxPanel1]
        }]
    });
    // 历史工单—工种gridPanel
    var gdgzPanel = Ext.create('Ext.grid.Panel', {
        id: 'gdgzPanel',
        title: '工种',
        columnLines: true,
        store: gdgzStore,
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '工种编码',
            dataIndex: 'V_PERCODE_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种名称',
            dataIndex: 'V_PERNAME_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种类型',
            dataIndex: 'V_PERTYPE_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种定额',
            dataIndex: 'V_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种台时',
            dataIndex: 'V_TS',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'grid33page',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: gdgzStore,
            width: '100%'
        }]
    });
    // 历史工单—工具gridPanel
    var gdgjPanel = Ext.create('Ext.grid.Panel', {
        id: 'gdgjPanel',
        title: '工具',
        columnLines: true,
        store: gdgjStore,
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '工具编码',
            dataIndex: 'V_GJ_CODE',
            align: 'center',
            flex: 1
        }, {
            text: '工具名称',
            dataIndex: 'V_GJ_NAME',
            align: 'center',
            flex: 1
        }, {
            text: '工具类型',
            dataIndex: 'V_GJ_TYPE',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'gdgjPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: gdgjStore,
            width: '100%'
        }]
    });
    // 历史工单—机具gridPanel
    var gdjjPanel = Ext.create('Ext.grid.Panel', {
        id: 'gdjjPanel',
        title: '机具',
        columnLines: true,
        store: gdjjStore,
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '机具编码',
            dataIndex: 'V_JJ_CODE',
            align: 'center',
            flex: 1
        }, {
            text: '机具名称',
            dataIndex: 'V_JJ_NAME',
            align: 'center',
            flex: 1
        }, {
            text: '机具类型',
            dataIndex: 'V_JJ_TYPE',
            align: 'center',
            flex: 1
        }, {
            text: '台时',
            dataIndex: 'V_JJ_TS',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'gdjjPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: gdjjStore,
            width: '100%'
        }]
    });
    // 历史工单—物料
    var gdwlPanel = Ext.create('Ext.grid.Panel', {
        id: 'gdwlPanel',
        title: '物料',
        columnLines: true,
        store: gdwlStore,
        autoScroll: true,
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '物料编码',
            dataIndex: 'V_WLCODE',
            align: 'center',
            flex: 1
        }, {
            text: '物料名称',
            dataIndex: 'V_WLSM',
            align: 'center',
            flex: 1
        }, {
            text: '数量',
            dataIndex: 'V_USE_NUM',
            align: 'center',
            flex: 1
        }/*, {
            text: '删除',
            dataIndex: '',
            align: 'center',
            flex: 1,
            renderer: function (v) {
                return "<span style='margin-right:10px'><a href='#' onclick='_deleteGdwl()'>删除</a></span>";
            }
        }*/],
        bbar: [{
            id: 'gdwlPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: gdwlStore,
            width: '100%'
        }]
    });
    // 历史工单tab
    var tab4 = Ext.create('Ext.tab.Panel', {
        id: 'tab4',
        title: '历史工单',
        frame: true,
        items: [wxxxPanel, gdgzPanel, gdgjPanel, gdjjPanel, gdwlPanel]
    });
    // 右边大tab
    var tab = Ext.create('Ext.tab.Panel', {
        id: 'tab',
        frame: true,
        items: [gzPanel, jjPanel, gjPanel, wlPanel, aqcsPanel, jxjsbzPanel/*, tab4*/]
    });
    // 缺陷生命周期弹窗
    var window = Ext.create('Ext.window.Window', {
        id: 'window',
        title: '缺陷生命周期',
        height: 300,
        closeAction: 'hide',
        width: 500,
        modal: true,
        frame: true
    });
    // 查看附件弹窗
    var attachWindow = Ext.create('Ext.window.Window', {
        id: 'attachWindow',
        title: '查看附件',
        height: 520,
        closeAction: 'hide',
        width: 860,
        layout: 'fit',
        modal: true,
        frame: true,
        items: [Ext.create("Ext.grid.Panel", {
            id: 'attachPanel',
            store: aqcsfjStore1,
            columnLines: true,
            frame: true,
            columns: [{
                xtype: 'rownumberer',
                text: '序号',
                width: 40,
                sortable: false
            }, {
                text: '附件名称',
                dataIndex: 'V_FILENAME',
                align: 'center',
                flex: 1
            }, {
                text: '上传时间',
                dataIndex: 'V_TIME',
                align: 'center',
                flex: 1
            }, {
                text: '上传人',
                dataIndex: 'V_PERSON',
                align: 'center',
                flex: 1
            }, {
                text: '下载',
                align: 'center',
                flex: 0.7,
                renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                    return '<a href=javascript:_downloadAttach(\'' + record.data.V_FILEGUID + '\')>下载</a>';// 超链接导出
                }
            }],
            bbar: [{
                xtype: 'pagingtoolbar',
                dock: 'bottom',
                displayInfo: true,
                displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
                emptyMsg: '没有记录',
                store: aqcsfjStore1,
                width: '100%'
            }]
        })],
        buttons: [{
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                attachWindow.close();
            }
        }]
    });
    // 添加工种store
    var addgzStore = Ext.create('Ext.data.Store', {
        id: 'addgzStore',
        autoLoad: true,
        loading: false,
        pageSize: 20,
        fields: ['V_WORKCODE', 'V_WORKNAME', 'V_WORKTYPE', 'V_DE', 'V_TIME','V_PERNUM'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'Wsy/PRO_BASE_PERSON_DE_SEL',// 无条件查询所有工种
            async: true,
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            },
            extraParams: {}
        }
    });
    // 添加机具store
    var addjjStore = Ext.create('Ext.data.Store', {
        storeId: 'addjjStore',
        autoLoad: true,
        loading: false,
        pageSize: 20,
        fields: ['V_CARCODE', 'V_CARNAME', 'V_CARTYPE', 'V_CARGUISUO', 'V_CARINDATE', 'V_FLAG', 'V_CARINFO', 'V_DE'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_EXAMINE_CAR_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {
                V_V_CARCODE: '%',
                V_V_CARNAME: '%'
            },
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 添加工具store
    var addgjStore = Ext.create('Ext.data.Store', {
        storeId: 'addgjStore',
        autoLoad: true,
        loading: false,
        pageSize: 20,
        fields: ['V_TOOLCODE', 'V_TOOLNAME', 'V_TOOLTYPE', 'V_EQUCODE', 'V_EQUNAME', 'V_EQUSITE', 'V_TOOLPLACE', 'V_TOOLINDATE', 'V_TOOLSTATUS'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_WORK_TOOL_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });

    // 添加技术标准store
    var addjsbzStore = Ext.create('Ext.data.Store', {
        storeId: 'addjsbzStore',
        autoLoad: true,
        loading: false,
        pageSize: 20,
        fields: ['V_TOOLCODE', 'V_TOOLNAME', 'V_TOOLTYPE', 'V_EQUCODE', 'V_EQUNAME', 'V_EQUSITE', 'V_TOOLPLACE', 'V_TOOLINDATE', 'V_TOOLSTATUS'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_WORK_TOOL_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });

    // 添加物料store
    // var addwlStore = Ext.create('Ext.data.Store', {
    //     storeId: 'addwlStore',
    //     autoLoad: true,
    //     loading: false,
    //     pageSize: 20,
    //     fields: ['V_KFNAME', 'V_WLCODE', 'V_WLSM', 'V_GGXH', 'V_JLDW', 'V_PRICE', 'V_USE_NUM'],
    //     proxy: {
    //         url: AppUrl + 'Wsy/BASE_WL_SEL',
    //         type: 'ajax',
    //         async: true,
    //         actionMethods: {
    //             read: 'POST'
    //         },
    //         extraParams: {},
    //         reader: {
    //             type: 'json',
    //             root: 'list',
    //             totalProperty: 'total'
    //         }
    //     }
    // });
    var addwlStore = Ext.create('Ext.data.Store', {
        storeId: 'addwlStore',
        autoLoad: true,
        fields: ['V_SPCODE', 'V_SPNAME', 'V_SPTYPE', 'V_EQUCODE', 'V_NUMBER', 'V_SPCODE_OLD'],
        proxy: {
            url: AppUrl + 'Wsy/SEL_EQUTOWL',
            type: 'ajax',
            async: false,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {
                V_V_PERSONCODE:person,
                V_V_DEPTCODENEXT:V_V_DEPTCODE
            },
            reader: {
                type: 'json',
                root: 'list'
            }
        }
    });

    // 添加安全措施store
    var addaqcsStore = Ext.create('Ext.data.Store', {
        storeId: 'addaqcsStore',
        autoLoad: true,
        loading: false,
        pageSize: 20,
        fields: ['V_AQCS_CODE', 'V_AQCS_NAME', 'V_AQCS_BBH'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_AQCS_SEL',
            type: 'ajax',
            async: true,
            actionMethods: {
                read: 'POST'
            },
            extraParams: {
                V_V_AQCS_NAME: '%'
            },
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
    // 添加工种gridPanel
    var addgzPanel = Ext.create('Ext.grid.Panel', {
        id: 'addgzPanel',
        columnLines: true,
        border: false,
        frame: true,
        region: 'center',
        store: addgzStore,
        layout: 'fit',
        autoScroll: true,
        selModel: {
            selType: 'checkboxmodel',
            mode: 'SIMPLE'
        },
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '工种编码',
            dataIndex: 'V_WORKCODE',
            align: 'center',
            flex: 1
        }, {
            text: '工种名称',
            dataIndex: 'V_WORKNAME',
            align: 'center',
            flex: 1
        }, {
            text: '工种类型',
            dataIndex: 'V_WORKTYPE',
            align: 'center',
            flex: 1
        }, {
            text: '工种定额',
            dataIndex: 'V_DE',
            align: 'center',
            flex: 1
        }, {
            text: '台时',
            dataIndex: 'V_TIME',
            align: 'center',
            flex: 0.7
        }],
        bbar: [{
            id: 'addgzPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: addgzStore,
            width: '100%'
        }]
    });
    // 添加工种弹窗
    var addgzWindow = Ext.create('Ext.window.Window', {
        id: 'addgzWindow',
        width: 1280,
        height: 520,
        layout: 'border',
        title: '所有工种',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [addgzPanel],
        buttons: [{
            xtype: 'button',
            text: '添加',
            width: 40,
            handler: function () {
                _addgz();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                addgzWindow.close();
            }
        }],
        listeners: {
            close: function () {
                addgzStore.clearFilter();
            }
        }
    });
    // 修改工种gridPanel
    var editgzPanel = Ext.create('Ext.form.Panel', {
        id: 'editgzPanel',
        border: false,
        region: 'center',
        frame: true,
        autoScroll: true,
        layout: 'column',
        baseCls: 'my-panel-no-border',
        defaults: {
            labelAlign: 'right',
            labelWidth: 100,
            inputWidth: 200,
            style: 'margin: 25px 20px 0px 20px'
        },
        items: [{
            xtype: 'textfield',
            id: 'V_JXGX_CODE',
            name: 'V_V_JXGX_CODE',
            fieldLabel: '检修工序编码',
            hidden: true,
            maxLength: 60
        }, {
            xtype: 'textfield',
            id: 'V_PERCODE_DE',
            name: 'V_V_PERCODE_DE',
            fieldLabel: '检修工种编码',
            //            hidden: true,
            readOnly: true,
            readOnlyCls: 'x-item-disabled',
            maxLength: 60
        }, {
            xtype: 'textfield',
            id: 'V_PERNAME_DE',
            name: 'V_V_PERNAME_DE',
            fieldLabel: '检修工种名称',
            disabled: true,
            maxLength: 60
        }, {
            xtype: 'numberfield',
            id: 'V_TS',
            name: 'V_V_TS',
            fieldLabel: '检修台时',
            maxLength: 60
        }, {
            xtype: 'numberfield',
            id: 'V_DE',
            name: 'V_V_DE',
            fieldLabel: '检修定额',
            maxLength: 60
        }, {
            xtype: 'textfield',
            id: 'V_PERTYPE_DE',
            name: 'V_V_PERTYPE_DE',
            fieldLabel: '检修工种类型',
            disabled: true,
            maxLength: 60
        }, {
            xtype: 'textfield',
            id: 'V_PERCODE',
            name: 'V_V_PERCODE',
            fieldLabel: '人员编码',
            disabled: true,
            maxLength: 60
        }, {
            xtype: 'textfield',
            id: 'V_PERNAME',
            name: 'V_V_PERNAME',
            fieldLabel: '人员名称',
            disabled: true,
            maxLength: 60
        },{
            xtype: 'numberfield',
            id: 'V_PERNUM',
            name: 'V_V_PERNUM',
            fieldLabel: '工种人数',
            maxLength: 60
        }]
    });
    // 修改工种弹窗
    var editgzWindow = Ext.create('Ext.window.Window', {
        id: 'editgzWindow',
        width: 750,
        height: 300,
        layout: 'fit',
        title: '修改工种',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [editgzPanel],
        buttons: [{
            xtype: 'button',
            text: '保存',
            width: 40,
            handler: function () {
                _editgz();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                editgzWindow.close();
            }
        }]
    });
    // 删除工种gridPanel
    var deletegzPanel = Ext.create('Ext.grid.Panel', {
        id: 'deletegzPanel',
        columnLines: true,
        frame: true,
        region: 'center',
        store: gzStore1,
        layout: 'fit',
        autoScroll: true,
        selModel: {
            selType: 'checkboxmodel',
            mode: 'SIMPLE'
        },
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '工种编码',
            dataIndex: 'V_PERCODE_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种名称',
            dataIndex: 'V_PERNAME_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种类型',
            dataIndex: 'V_PERTYPE_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种定额',
            dataIndex: 'V_DE',
            align: 'center',
            flex: 1
        }, {
            text: '工种台时',
            dataIndex: 'V_TS',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'deletegzPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: gzStore1,
            width: '100%'
        }]
    });
    // 删除工种弹窗
    var deletegzWindow = Ext.create('Ext.window.Window', {
        id: 'deletegzWindow',
        width: 1280,
        height: 720,
        layout: 'border',
        title: '删除工种',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [deletegzPanel],
        buttons: [{
            xtype: 'button',
            text: '删除',
            width: 40,
            handler: function () {
                _deletegz();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                deletegzWindow.close();
            }
        }]
    });
    // 添加机具gridPanel
    var addjjPanel = Ext.create('Ext.grid.Panel', {
        id: 'addjjPanel',
        columnLines: true,
        frame: true,
        region: 'center',
        store: addjjStore,
        layout: 'fit',
        autoScroll: true,
        selModel: {
            selType: 'checkboxmodel',
            mode: 'SIMPLE'
        },
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '车辆编码',
            dataIndex: 'V_CARCODE',
            align: 'center',
            flex: 1
        }, {
            text: '车辆名称',
            dataIndex: 'V_CARNAME',
            align: 'center',
            flex: 1
        }, {
            text: '车辆类型',
            dataIndex: 'V_CARTYPE',
            align: 'center',
            flex: 1
        }, {
            text: '车辆归属',
            dataIndex: 'V_CARGUISUO',
            align: 'center',
            flex: 1
        }, {
            text: '车辆入厂时间',
            dataIndex: 'V_CARINDATE',
            align: 'center',
            flex: 1
        }, {
            text: '车辆状态',
            dataIndex: 'V_FLAG',
            align: 'center',
            flex: 1
        }, {
            text: '车辆信息',
            dataIndex: 'V_CARINFO',
            align: 'center',
            flex: 1
        }, {
            text: '车辆定额',
            dataIndex: 'V_DE',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'addjjPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: addjjStore,
            width: '100%'
        }]
    });
    // 添加机具弹窗
    var addjjWindow = Ext.create('Ext.window.Window', {
        id: 'addjjWindow',
        width: 1280,
        height: 720,
        layout: 'border',
        title: '所有机具',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [addjjPanel],
        buttons: [{
            xtype: 'button',
            text: '添加',
            width: 40,
            handler: function () {
                _addjj();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                addjjWindow.close();
            }
        }],
        listeners: {
            close: function () {
                addjjStore.clearFilter();
            }
        }
    });
    // 修改机具gridPanel
    var editjjPanel = Ext.create('Ext.form.Panel', {
        id: 'editjjPanel',
        border: false,
        region: 'center',
        frame: true,
        autoScroll: true,
        layout: 'column',
        baseCls: 'my-panel-no-border',
        defaults: {
            labelAlign: 'right',
            labelWidth: 100,
            inputWidth: 200,
            style: 'margin: 25px 20px 0px 20px'
        },
        items: [{
            xtype: 'textfield',
            id: 'V_JXGX_CODE',
            name: 'V_V_JXGX_CODE',
            fieldLabel: '检修工序编码',
            maxLength: 60,
            hidden: true
        }, {
            xtype: 'textfield',
            fieldLabel: '车辆编码',
            id: 'V_JJ_CODE',
            name: 'V_V_JJ_CODE',
            maxLength: 60,
            hidden: true
        }, {
            xtype: 'textfield',
            fieldLabel: '车辆名称',
            id: 'V_JJ_NAME',
            name: 'V_V_JJ_NAME',
            maxLength: 60,
            disabled: true
        }, {
            xtype: 'textfield',
            fieldLabel: '车辆类型',
            id: 'V_JJ_TYPE',
            name: 'V_V_JJ_TYPE',
            maxLength: 60,
            disabled: true
        }, {
            xtype: 'numberfield',
            fieldLabel: '检修台时',
            id: 'V_JJ_TS',
            name: 'V_V_JJ_TS',
            maxLength: 60
        }, {
            xtype: 'numberfield',
            fieldLabel: '车辆定额',
            id: 'V_JJ_DE',
            name: 'V_V_JJ_DE',
            maxLength: 60
        }]
    });
    // 修改机具弹窗
    var editjjWindow = Ext.create('Ext.window.Window', {
        id: 'editjjWindow',
        width: 750,
        height: 200,
        layout: 'fit',
        title: '修改机具',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [editjjPanel],
        buttons: [{
            xtype: 'button',
            text: '保存',
            width: 40,
            handler: function () {
                _editjj();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                editjjWindow.close();
            }
        }]
    });
    // 删除机具gridPanel
    var deletejjPanel = Ext.create('Ext.grid.Panel', {
        id: 'deletejjPanel',
        columnLines: true,
        frame: true,
        region: 'center',
        store: jjStore,
        layout: 'fit',
        autoScroll: true,
        selModel: {
            selType: 'checkboxmodel',
            mode: 'SIMPLE'
        },
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '车辆名称',
            dataIndex: 'V_JJ_NAME',
            align: 'center',
            flex: 1
        }, {
            text: '车辆类型',
            dataIndex: 'V_JJ_TYPE',
            align: 'center',
            flex: 1
        }, {
            text: '检修台时',
            dataIndex: 'V_JJ_TS',
            align: 'center',
            flex: 1
        }, {
            text: '车辆定额',
            dataIndex: 'V_JJ_DE',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'deletejjPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: jjStore,
            width: '100%'
        }]
    });
    // 删除机具弹窗
    var deletejjWindow = Ext.create('Ext.window.Window', {
        id: 'deletejjWindow',
        width: 1280,
        height: 720,
        layout: 'border',
        title: '删除机具',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [deletejjPanel],
        buttons: [{
            xtype: 'button',
            text: '删除',
            width: 40,
            handler: function () {
                _deletejj();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                deletejjWindow.close();
            }
        }]
    });
    // 添加工具gridPanel
    var addgjPanel = Ext.create('Ext.grid.Panel', {
        id: 'addgjPanel',
        columnLines: true,
        frame: true,
        region: 'center',
        store: addgjStore,
        layout: 'fit',
        autoScroll: true,
        selModel: {
            selType: 'checkboxmodel',
            mode: 'SIMPLE'
        },
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '工具名称',
            dataIndex: 'V_TOOLNAME',
            align: 'center',
            flex: 1
        }, {
            text: '工具类型',
            dataIndex: 'V_TOOLTYPE',
            align: 'center',
            flex: 1
        }, {
            text: '设备编码',
            dataIndex: 'V_EQUCODE',
            align: 'center',
            flex: 1
        }, {
            text: '设备名称',
            dataIndex: 'V_EQUNAME',
            align: 'center',
            flex: 1
        }, {
            text: '功能位置',
            dataIndex: 'V_EQUSITE',
            align: 'center',
            flex: 1
        }, {
            text: '工具存在地',
            dataIndex: 'V_TOOLPLACE',
            align: 'center',
            flex: 1
        }, {
            text: '工具入厂时间',
            dataIndex: 'V_TOOLINDATE',
            align: 'center',
            flex: 1
        }, {
            text: '工具状态',
            dataIndex: 'V_TOOLSTATUS',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'addgjPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: addgjStore,
            width: '100%'
        }]
    });
    // 添加工具弹窗
    var addgjWindow = Ext.create('Ext.window.Window', {
        id: 'addgjWindow',
        width: 1280,
        height: 720,
        layout: 'border',
        title: '所有工具',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [addgjPanel],
        buttons: [{
            xtype: 'button',
            text: '确定',
            width: 40,
            handler: function () {
                _addgj();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                addgjWindow.close();
            }
        }],
        listeners: {
            close: function () {
                addgjStore.clearFilter();
            }
        }
    });
    // 修改工具gridPanel
    var editgjPanel = Ext.create('Ext.form.Panel', {
        id: 'editgjPanel',
        border: false,
        region: 'center',
        frame: true,
        autoScroll: true,
        layout: 'column',
        baseCls: 'my-panel-no-border',
        defaults: {
            labelAlign: 'right',
            labelWidth: 100,
            inputWidth: 200,
            style: 'margin: 25px 20px 0px 20px'
        },
        items: [{
            xtype: 'textfield',
            id: 'V_JXGX_CODE',
            name: 'V_V_JXGX_CODE',
            fieldLabel: '检修工序编码',
            maxLength: 60,
            hidden: true
        }, {
            xtype: 'textfield',
            fieldLabel: '工具编码',
            id: 'V_TOOLCODE',
            name: 'V_V_TOOLCODE',
            maxLength: 60,
            hidden: true
        }, {
            xtype: 'textfield',
            fieldLabel: '工具名称',
            id: 'V_TOOLNAME',
            name: 'V_V_TOOLNAME',
            disabled: true,
            maxLength: 60
        }, {
            xtype: 'textfield',
            fieldLabel: '工具类型',
            id: 'V_TOOLTYPE',
            name: 'V_V_TOOLTYPE',
            maxLength: 60
        }, {
            xtype: 'textfield',
            fieldLabel: '工具存在地',
            id: 'V_TOOLPLACE',
            name: 'V_V_TOOLPLACE',
            maxLength: 60
        }, {
            xtype: 'datefield',
            fieldLabel: '工具入厂时间',
            id: 'V_TOOLINDATE',
            name: 'V_V_TOOLINDATE',
            format: 'Y-m-d H:i:s',
            submitFormat: 'Y-m-d H:i:s',
            maxLength: 60
        }, {
            xtype: 'combo',
            id: 'V_TOOLSTATUS',
            name: 'V_V_TOOLSTATUS',
            fieldLabel: '工具状态',
            store: statusStore,
            valueField: 'Value',
            displayField: 'Name',
            //            forceSelection: true,
            allowBlank: false,
            maxLength: 40
        }]
    });
    // 修改工具弹窗
    var editgjWindow = Ext.create('Ext.window.Window', {
        id: 'editgjWindow',
        width: 750,
        height: 260,
        layout: 'fit',
        title: '修改工具',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [editgjPanel],
        buttons: [{
            xtype: 'button',
            text: '保存',
            width: 40,
            handler: function () {
                _editgj();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                editgjWindow.close();
            }
        }]
    });
    // 删除工具gridPanel
    var deletegjPanel = Ext.create('Ext.grid.Panel', {
        id: 'deletegjPanel',
        columnLines: true,
        frame: true,
        region: 'center',
        store: gjStore1,
        layout: 'fit',
        autoScroll: true,
        selModel: {
            selType: 'checkboxmodel',
            mode: 'SIMPLE'
        },
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '工具名称',
            dataIndex: 'V_TOOLNAME',
            align: 'center',
            flex: 1
        }, {
            text: '工具类型',
            dataIndex: 'V_TOOLTYPE',
            align: 'center',
            flex: 1
        }, {
            text: '工具存在地',
            dataIndex: 'V_TOOLPLACE',
            align: 'center',
            flex: 1
        }, {
            text: '工具入厂时间',
            dataIndex: 'V_TOOLINDATE',
            align: 'center',
            flex: 2,
            renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {// 渲染
                var index = gjStore1.find('V_TOOLINDATE', value);
                if (index != -1) {
                    return gjStore1.getAt(index).get('V_TOOLINDATE').substring(0, 19);
                }
                return null;
            }
        }, {
            text: '工具状态',
            dataIndex: 'V_TOOLSTATUS',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'deletegjPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: gjStore1,
            width: '100%'
        }]
    });
    // 删除工具弹窗
    var deletegjWindow = Ext.create('Ext.window.Window', {
        id: 'deletegjWindow',
        width: 1280,
        height: 720,
        layout: 'border',
        title: '删除工具',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [deletegjPanel],
        buttons: [{
            xtype: 'button',
            text: '删除',
            width: 40,
            handler: function () {
                _deletegj();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                deletegjWindow.close();
            }
        }]
    });
    // 添加物料gridPanel
    var addwlPanel = Ext.create('Ext.grid.Panel', {
        id: 'addwlPanel',
        columnLines: true,
        frame: true,
        region: 'center',
        store: addwlStore,
        layout: 'fit',
        autoScroll: true,
        selModel: {
            selType: 'checkboxmodel',
            mode: 'SIMPLE'
        },
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }/*, {
            text: '库房名称',
            dataIndex: 'V_KFNAME',
            align: 'center',
            flex: 1
        }, {
            text: '物料描述',
            dataIndex: 'V_WLSM',
            align: 'center',
            flex: 1
        }, {
            text: '规格型号',
            dataIndex: 'V_GGXH',
            align: 'center',
            flex: 1
        }, {
            text: '计量单位',
            dataIndex: 'V_JLDW',
            align: 'center',
            flex: 0.7
        }, {
            text: '单价',
            dataIndex: 'V_PRICE',
            align: 'center',
            flex: 0.7
        }*/
            , {
                text: '物料编码',
                dataIndex: 'V_SPCODE',
                align: 'center',
                flex: 1
            }, {
                text: '物料描述',
                dataIndex: 'V_SPNAME',
                align: 'center',
                flex: 1
            }, {
                text: '物料数量',
                dataIndex: 'V_NUMBER',
                align: 'center',
                flex: 1
            }]
    });
    // 添加物料弹窗
    var addwlWindow = Ext.create('Ext.window.Window', {
        id: 'addwlWindow',
        width: 1280,
        height: 720,
        layout: 'border',
        title: '所有物料',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [addwlPanel],
        buttons: [{
            xtype: 'button',
            text: '添加',
            width: 40,
            handler: function () {
                _addwl();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                addwlWindow.close();
            }
        }],
        listeners: {
            close: function () {
                addwlStore.clearFilter();
            }
        }
    });

    var addjsbzWindow = Ext.create('Ext.window.Window', {
        id: 'addjsbzWindow',
        width: 1280,
        height: 720,
        layout: 'border',
        title: '所有技术标准',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [zsbjxPanel1],
        buttons: [{
            xtype: 'button',
            text: '添加',
            width: 40,
            handler: function () {
                _addjsbz();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                addjsbzWindow.close();
            }
        }]
    });

    // 修改物料gridPanel
    var editwlPanel = Ext.create('Ext.form.Panel', {
        id: 'editwlPanel',
        border: false,
        region: 'center',
        frame: true,
        autoScroll: true,
        layout: 'column',
        baseCls: 'my-panel-no-border',
        defaults: {
            labelAlign: 'right',
            labelWidth: 100,
            inputWidth: 200,
            style: 'margin: 25px 20px 0px 20px'
        },
        items: [{
            xtype: 'textfield',
            id: 'V_JXGX_CODE',
            name: 'V_V_JXGX_CODE',
            fieldLabel: '检修工序编码',
            hidden: true,
            maxLength: 60
        }, {
            xtype: 'textfield',
            id: 'V_WLCODE',
            name: 'V_V_WLCODE',
            fieldLabel: '物料编码',
            hidden: true,
            maxLength: 60
        }, {
            xtype: 'textfield',
            id: 'V_KFNAME',
            name: 'V_V_KFNAME',
            fieldLabel: '库房名称',
            disabled: true,
            maxLength: 60
        }, {
            xtype: 'textfield',
            id: 'V_WLSM',
            name: 'V_V_WLSM',
            fieldLabel: '物料描述',
            maxLength: 60
        }, {
            xtype: 'textfield',
            id: 'V_GGXH',
            name: 'V_V_GGXH',
            fieldLabel: '规格型号',
            maxLength: 60
        }, {
            xtype: 'textfield',
            id: 'V_JLDW',
            name: 'V_V_JLDW',
            fieldLabel: '计量单位',
            maxLength: 60
        }, {
            xtype: 'numberfield',
            id: 'V_PRICE',
            name: 'V_V_PRICE',
            fieldLabel: '单价',
            maxLength: 60
        }, {
            xtype: 'numberfield',
            id: 'V_USE_NUM',
            name: 'V_V_USE_NUM',
            fieldLabel: '使用数量',
            maxLength: 60
        }]
    });
    // 修改物料弹窗
    var editwlWindow = Ext.create('Ext.window.Window', {
        id: 'editwlWindow',
        width: 750,
        height: 300,
        layout: 'fit',
        title: '修改物料',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [editwlPanel],
        buttons: [{
            xtype: 'button',
            text: '保存',
            width: 40,
            handler: function () {
                _editwl();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                editwlWindow.close();
            }
        }]
    });
    // 删除物料gridPanel
    var deletewlPanel = Ext.create('Ext.grid.Panel', {
        id: 'deletewlPanel',
        columnLines: true,
        frame: true,
        region: 'center',
        store: wlStore,
        layout: 'fit',
        autoScroll: true,
        selModel: {
            selType: 'checkboxmodel',
            mode: 'SIMPLE'
        },
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '物料编码',
            dataIndex: 'V_WLCODE',
            align: 'center',
            flex: 1
        }, {
            text: '物料名称',
            dataIndex: 'V_WLSM',
            align: 'center',
            flex: 1
        }, {
            text: '数量',
            dataIndex: 'V_USE_NUM',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'deletewlPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: wlStore,
            width: '100%'
        }]
    });
    // 删除物料弹窗
    var deletewlWindow = Ext.create('Ext.window.Window', {
        id: 'deletewlWindow',
        width: 1280,
        height: 720,
        layout: 'border',
        title: '删除物料',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [deletewlPanel],
        buttons: [{
            xtype: 'button',
            text: '删除',
            width: 40,
            handler: function () {
                _deletewl();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                deletewlWindow.close();
            }
        }]
    });
    // 添加安全措施gridPanel
    var addaqcsPanel = Ext.create('Ext.grid.Panel', {
        id: 'addaqcsPanel',
        columnLines: true,
        frame: true,
        region: 'center',
        store: addaqcsStore,
        layout: 'fit',
        autoScroll: true,
        selModel: {
            selType: 'checkboxmodel',
            mode: 'SIMPLE'
        },
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '安全措施名称',
            dataIndex: 'V_AQCS_NAME',
            align: 'center',
            flex: 1
        }, {
            text: '安全措施版本号',
            dataIndex: 'V_AQCS_BBH',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'addaqcsPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: addaqcsStore,
            width: '100%'
        }]
    });
    // 添加安全措施弹窗
    var addaqcsWindow = Ext.create('Ext.window.Window', {
        id: 'addaqcsWindow',
        width: 1024,
        height: 720,
        layout: 'border',
        title: '所有安全措施',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [addaqcsPanel],
        buttons: [{
            xtype: 'button',
            text: '添加',
            width: 40,
            handler: function () {
                _addaqcs();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                addaqcsWindow.close();
            }
        }],
        listeners: {
            close: function () {
                addaqcsStore.clearFilter();
            }
        }
    });
    // 删除安全措施gridPanel
    var deleteaqcsPanel = Ext.create('Ext.grid.Panel', {
        id: 'deleteaqcsPanel',
        columnLines: true,
        frame: true,
        region: 'center',
        store: aqcsStore,
        layout: 'fit',
        autoScroll: true,
        selModel: {
            selType: 'checkboxmodel',
            mode: 'SIMPLE'
        },
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '安全措施名称',
            dataIndex: 'V_AQCS_NAME',
            align: 'center',
            flex: 1
        }, {
            text: '安全措施版本号',
            dataIndex: 'V_AQCS_BBH',
            align: 'center',
            flex: 1
        }],
        bbar: [{
            id: 'deleteaqcsPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: aqcsStore,
            width: '100%'
        }]
    });
    // 删除安全措施弹窗
    var deleteaqcsWindow = Ext.create('Ext.window.Window', {
        id: 'deleteaqcsWindow',
        width: 1280,
        height: 720,
        layout: 'border',
        title: '删除安全措施',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [deleteaqcsPanel],
        buttons: [{
            xtype: 'button',
            text: '删除',
            width: 40,
            handler: function () {
                _deleteaqcs();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                deleteaqcsWindow.close();
            }
        }]
    });
    // 删除检修技术标准gridPanel
    var deletejxjsbzPanel = Ext.create('Ext.grid.Panel', {
        id: 'deletejxjsbzPanel',
        columnLines: true,
        region: 'center',
        frame: true,
        store: jxjsbzStore,
        autoScroll: true,
        selModel: {
            selType: 'checkboxmodel',
            mode: 'SIMPLE'
        },
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '零件编号',
            dataIndex: 'V_PART_NUMBER',
            align: 'center',
            width: 80
        }, {
            text: '零件名称',
            dataIndex: 'V_PART_NAME',
            align: 'center',
            width: 80
        }, {
            text: '零件编码',
            dataIndex: 'V_PART_CODE',
            align: 'center',
            width: 80
        }, {
            text: '材料',
            dataIndex: 'V_MATERIAL',
            align: 'center',
            width: 80
        }, {
            text: '维修技术标准',
            align: 'center',
            flex: 4,
            columns: [{
                text: '图面尺寸',
                dataIndex: 'V_IMGSIZE',
                align: 'center',
                flex: 1
            }, {
                text: '图面间隙',
                dataIndex: 'V_IMGGAP',
                align: 'center',
                flex: 1
            }, {
                text: '允许值(上限)',
                dataIndex: 'V_VALUE_UP',
                align: 'center',
                flex: 1
            }, {
                text: '允许值(下限)',
                dataIndex: 'V_VALUE_DOWN',
                align: 'center',
                flex: 1
            }]
        }, {
            text: '更换周期',
            dataIndex: 'V_REPLACE_CYC',
            align: 'center',
            width: 80
        }, {
            text: '重量',
            dataIndex: 'V_WEIGHT',
            align: 'center',
            width: 80
        }, {
            text: '图号',
            dataIndex: 'V_IMGCODE',
            align: 'center',
            width: 80
        }, {
            text: '备注',
            dataIndex: 'V_CONTENT',
            align: 'center',
            width: 80
        }],
        bbar: [{
            id: 'deletejxjsbzPanel_toolbar',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: jxjsbzStore,
            width: '100%'
        }]
    });

    var ganttpanel = Ext.create('Ext.panel.Panel', {
        id: 'ganttpanel',
        editable: false,
        frame: true,
        layout: 'fit',
        autoScroll: true,
        region: 'center',
        items: []
    });

    // 检修工序gridPanel
    var jxgxPanel = Ext.create('Ext.grid.Panel', {
        id: 'jxgxPanel',
        store: jxgxStore,
        columnLines: true,
        border: false,
        frame: true,
        region: 'center',
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '检修模型名称',
            dataIndex: 'V_MX_NAME',
            style: 'text-align: center;',
            flex: 1
        }, {
            text: '工序名称',
            dataIndex: 'V_JXGX_NAME',
            style: 'text-align: center;',
            flex: 1
        }, {
            text: '工序内容',
            dataIndex: 'V_JXGX_NR',
            style: 'text-align: center;',
            flex: 1
        }],
        bbar: ['->', {
            xtype: 'pagingtoolbar',
            id: 'gpage2',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: jxgxStore,
            width: '100%'
        }],
        listeners: {
            itemclick: function (panel, record, item, index, e, eOpts) {
                _querygz();
                _queryjj();
                _querygj();
                _queryaqcs();
                _queryjxjsbz();
                _querylsgd();
                _querywl();
            }
        }
    });

    // 删除检修技术标准弹窗
    var deletejxjsbzWindow = Ext.create('Ext.window.Window', {
        id: 'deletejxjsbzWindow',
        width: 1280,
        height: 720,
        layout: 'border',
        title: '删除检修技术标准',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [deletejxjsbzPanel],
        buttons: [{
            xtype: 'button',
            text: '删除',
            width: 40,
            handler: function () {
                _deletejxjsbz();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                deletejxjsbzWindow.close();
            }
        }]
    });

    Ext.create('Ext.container.Viewport', {
        layout: {
            type: 'border',
            regionWeights: {
                north: 4,
                east: 3,
                south: 2,
                west: -1
            }
        },
        defaults: {
            border: false
        },
        items: [ {
            region: 'east',
            layout: 'fit',
            width: '60%',
            items: [tab]
        }, {
            region: 'south',
            layout: 'fit',
            height: '40%',
            items: [ganttpanel]
        }, {
            region: 'center',
            layout: 'fit',
            items: [jxgxPanel]
        }]
    });
/*    _querygz();
    _queryjj();
    _querygj();
    _queryaqcs();
    _queryjxjsbz();
    _querylsgd();
    _querywl();*/
    _querygx(V_JXMX_CODE);
    //_queryzsbjx();
    pageFunction.QueryGanttData();
});

// 打开添加工种窗口
function _openAddgzWindow() {
    var records = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }

    Ext.getCmp('addgzWindow').show();
}

// 添加选择的工种
function _addgz() {
    var gzRecords = Ext.getCmp('addgzPanel').getSelectionModel().getSelection();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (jxgxPanel.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }

    if (gzRecords.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工种!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }

    var V_JXGX_CODE='';
    if(jxgxPanel[0].data.V_JXGX_CODE != null){
    V_JXGX_CODE=jxgxPanel[0].data.V_JXGX_CODE;
    }
    var sum = 0;
    for (var i = 0; i < gzRecords.length; i++) {
        Ext.Ajax.request({
            url: AppUrl + 'Wsy/BASE_JXMX_GZ_INS',
            type: 'ajax',
            method: 'POST',
            async: false,
            params: {
                V_V_JXGX_CODE: V_JXGX_CODE,
                V_V_PERCODE_DE: gzRecords[i].data.V_WORKCODE,
                V_V_PERNAME_DE: gzRecords[i].data.V_WORKNAME,
                V_V_TS: gzRecords[i].data.V_TIME,
                V_V_DE: gzRecords[i].data.V_DE,
                V_V_PERTYPE_DE: gzRecords[i].data.V_WORKTYPE
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                    sum++;
                }
            },
            failure: function (response) {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: response.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }
    if (sum == gzRecords.length) {
        Ext.Msg.alert('提示信息', '添加成功');
        var addgzStore = Ext.data.StoreManager.lookup('addgzStore');
        addgzStore.load();
    } else {
        Ext.MessageBox.show({
            title: '错误',
            msg: gzRecords.length - sum + '条添加失败',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
    _querygz();
    Ext.getCmp('addgzWindow').close();
}

// 点击检修模型item查询工序窗口
function _querygx(V_MX_CODE) {
    var jxgxStore = Ext.data.StoreManager.lookup('jxgxStore');
    jxgxStore.removeAll();
    if (V_MX_CODE != null) {
        jxgxStore.load({
            params: {
                V_V_JXMX_CODE: V_MX_CODE
            }
        });
    }
    /*_querygz();
     _queryjj(null);
     _querygj(null);
     _queryaqcs();
     _queryjxjsbz();
     _querylsgd(null);
     _querywl();*/
}

// 打开修改工种窗口
function _openEditgzWindow() {
    var records = Ext.getCmp('gzPanel1').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工种!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var recordsData = records[0].data;
    var form = Ext.getCmp('editgzPanel').getForm();
    form.reset();
    for (var key in recordsData) {
        (form.findField(key) != null) ? form.findField(key).setValue(recordsData[key]) : '';
    }
    form.isValid();
    Ext.getCmp('editgzWindow').show();
}

// 修改工种
function _editgz() {
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    var formData = Ext.getCmp('editgzPanel');
    Ext.Ajax.request({
        url: AppUrl + 'Wsy/BASE_GX_GZ_UPD',
        method: 'POST',
        type: 'ajax',
        async: false,
        params: formData.getValues(),
        success: function (response) {
            var data = Ext.decode(response.responseText);
            if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                Ext.Msg.alert('提示信息', '修改成功');
            } else {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: '修改失败',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        },
        failure: function (response) {
            Ext.MessageBox.show({
                title: '错误',
                msg: response.responseText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    });
    _querygz();

    Ext.Ajax.request({
        url: AppUrl + 'Wsy/PM_1917_JXGX_DATA_UPERS',
        method: 'POST',
        async: false,
        params: {
            V_V_JXGX_CODE: jxgxPanel[0].data.V_JXGX_CODE,
            V_V_JXMX_CODE:V_JXMX_CODE
        },
        success: function (response) {
            var resp = Ext.decode(response.responseText);
            if (resp.V_INFO == "Success") { }
        }
    });

    Ext.getCmp('editgzWindow').close();
}

// 打开删除工种窗口
function _openDeletegzWindow() {
    var records = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    Ext.getCmp('deletegzWindow').show();
}

// 删除选择的工种
function _deletegz() {
    var gzRecords = Ext.getCmp('deletegzPanel').getSelectionModel().getSelection();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    var V_JXGX_CODE=jxgxPanel[0].data.V_JXGX_CODE;
    if (gzRecords.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工种!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var sum = 0;
    for (var i = 0; i < gzRecords.length; i++) {
        Ext.Ajax.request({
            url: AppUrl + 'Wsy/BASE_GX_GZ_DEL',
            type: 'ajax',
            method: 'POST',
            async: false,
            params: {
                'V_V_JXGX_CODE': V_JXGX_CODE,
                'V_V_PERCODE_DE': gzRecords[i].get('V_PERCODE_DE')
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                    sum++;
                }
            },
            failure: function (response) {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: response.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }
    if (sum == gzRecords.length) {
        Ext.Msg.alert('提示信息', '删除成功');
    } else {
        Ext.MessageBox.show({
            title: '错误',
            msg: gzRecords.length - sum + '条删除失败',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
    _querygz();
    Ext.getCmp('deletegzWindow').close();
}

// 打开添加机具窗口
function _openAddjjWindow() {
    var records = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    Ext.getCmp('addjjWindow').show();
}

// 添加选择的机具
function _addjj() {
    var jjrecords = Ext.getCmp('addjjPanel').getSelectionModel().getSelection();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    var V_JXGX_CODE=jxgxPanel[0].data.V_JXGX_CODE;
    if (jjrecords.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个机具!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var sum = 0;
    for (var i = 0; i < jjrecords.length; i++) {
        Ext.Ajax.request({
            url: AppUrl + 'Wsy/BASE_JXMX_JJ_INS',
            type: 'ajax',
            method: 'POST',
            async: false,
            params: {
                'V_V_JXGX_CODE': V_JXGX_CODE,
                'V_V_JJ_CODE': jjrecords[i].get('V_CARCODE'),
                'V_V_JJ_NAME': jjrecords[i].get('V_CARNAME'),
                'V_V_JJ_TYPE': jjrecords[i].get('V_CARTYPE'),
                'V_V_JJ_TS': '0',
                'V_V_JJ_DE': jjrecords[i].get('V_DE')
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                    sum++;
                }
            },
            failure: function (response) {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: response.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }
    if (sum == jjrecords.length) {
        Ext.Msg.alert('提示信息', '添加成功');
        var addjjStore = Ext.data.StoreManager.lookup('addjjStore');
        addjjStore.load();
    } else {
        Ext.MessageBox.show({
            title: '错误',
            msg: jjrecords.length - sum + '条添加失败',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
    _queryjj();
    Ext.getCmp('addjjWindow').close();
}

// 打开修改机具窗口
function _openEditjjWindow() {
    var records = Ext.getCmp('jjPanel1').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个机具!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var recordsData = records[0].data;
    var form = Ext.getCmp('editjjPanel').getForm();
    form.reset();
    for (var key in recordsData) {
        (form.findField(key) != null) ? form.findField(key).setValue(recordsData[key]) : '';
    }
    form.isValid();
    Ext.getCmp('editjjWindow').show();
}

// 修改机具
function _editjj() {
    var formData = Ext.getCmp('editjjPanel');
    Ext.Ajax.request({
        url: AppUrl + 'Wsy/BASE_GX_JJ_UPD',
        method: 'POST',
        type: 'ajax',
        async: false,
        params: formData.getValues(),
        success: function (response) {
            var data = Ext.decode(response.responseText);
            if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                Ext.Msg.alert('提示信息', '修改成功');
            } else {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: '修改失败',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        },
        failure: function (response) {
            Ext.MessageBox.show({
                title: '错误',
                msg: response.responseText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    });
    _queryjj();
    Ext.getCmp('editjjWindow').close();
}

// 打开删除机具窗口
function _openDeletejjWindow() {
    var records = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    Ext.getCmp('deletejjWindow').show();
}

// 删除选择的机具
function _deletejj() {
    var jjRecords = Ext.getCmp('deletejjPanel').getSelectionModel().getSelection();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    var V_JXGX_CODE=jxgxPanel[0].data.V_JXGX_CODE;
    if (jjRecords.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个机具!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var sum = 0;
    for (var i = 0; i < jjRecords.length; i++) {
        Ext.Ajax.request({
            url: AppUrl + 'Wsy/BASE_GX_JJ_DEL',
            type: 'ajax',
            method: 'POST',
            async: false,
            params: {
                'V_V_JXGX_CODE': V_JXGX_CODE,
                'V_V_JJ_CODE': jjRecords[i].get('V_JJ_CODE')
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                    sum++;
                }
            },
            failure: function (response) {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: response.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }
    if (sum == jjRecords.length) {
        Ext.Msg.alert('提示信息', '删除成功');
    } else {
        Ext.MessageBox.show({
            title: '错误',
            msg: jjRecords.length - sum + '条删除失败',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
    _queryjj();
    Ext.getCmp('deletejjWindow').close();
}

// 打开添加工具窗口
function _openAddgjWindow() {
    var records = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    Ext.getCmp('addgjWindow').show();
}

// 添加选择的工具
function _addgj() {
    var gjRecords = Ext.getCmp('addgjPanel').getSelectionModel().getSelection();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    var V_JXGX_CODE=jxgxPanel[0].data.V_JXGX_CODE;
    if (gjRecords.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工具!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var sum = 0;
    for (var i = 0; i < gjRecords.length; i++) {

        Ext.Ajax.request({
            url: AppUrl + 'Wsy/BASE_JXMX_GJ_INS',
            type: 'ajax',
            method: 'POST',
            async: false,
            params: {
                V_V_JXGX_CODE: V_JXGX_CODE,
                V_V_GJ_CODE: gjRecords[i].data.V_TOOLCODE,
                V_V_GJ_NAME: gjRecords[i].data.V_TOOLNAME,
                V_V_GJ_TYPE: gjRecords[i].data.V_TOOLTYPE
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                    sum++;
                }
            },
            failure: function (response) {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: response.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }
    if (sum == gjRecords.length) {
        Ext.Msg.alert('提示信息', '添加成功');
        var addgjStore = Ext.data.StoreManager.lookup('addgjStore');
        addgjStore.load();
    } else {
        Ext.MessageBox.show({
            title: '错误',
            msg: gjRecords.length - sum + '条添加失败',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
    _querygj();
    Ext.getCmp('addgjWindow').close();
}

// 打开修改工具窗口
function _openEditgjWindow() {
    var records = Ext.getCmp('gjPanel1').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工具!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var recordsData = records[0].data;
    var form = Ext.getCmp('editgjPanel').getForm();
    form.reset();
    for (var key in recordsData) {
        (form.findField(key) != null) ? form.findField(key).setValue(recordsData[key]) : '';
    }
    form.isValid();
    form.findField('V_TOOLINDATE').setValue(records[0].data.V_TOOLINDATE.substring(0, 19));
    Ext.getCmp('editgjWindow').show();
}

// 修改工具
function _editgj() {
    var formData = Ext.getCmp('editgjPanel');
    Ext.Ajax.request({
        url: AppUrl + 'Wsy/BASE_GX_GJ_UPD',
        method: 'POST',
        type: 'ajax',
        async: false,
        params: formData.getValues(),
        success: function (response) {
            var data = Ext.decode(response.responseText);
            if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                Ext.Msg.alert('提示信息', '修改成功');
            } else {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: '修改失败',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        },
        failure: function (response) {
            Ext.MessageBox.show({
                title: '错误',
                msg: response.responseText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    });
    _querygj();
    Ext.getCmp('editgjWindow').close();
}

// 打开删除工具窗口
function _openDeletegjWindow() {
    var records = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    Ext.getCmp('deletegjWindow').show();
}

// 删除选择的工具
function _deletegj() {
    var gjRecords = Ext.getCmp('deletegjPanel').getSelectionModel().getSelection();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    var V_JXGX_CODE=jxgxPanel[0].data.V_JXGX_CODE;
    if (gjRecords.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工具!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var sum = 0;
    for (var i = 0; i < gjRecords.length; i++) {
        Ext.Ajax.request({
            url: AppUrl + 'Wsy/BASE_GX_GJ_DEL',
            type: 'ajax',
            method: 'POST',
            async: false,
            params: {
                'V_V_JXGX_CODE': V_JXGX_CODE,
                'V_V_GJ_CODE': gjRecords[i].get('V_TOOLCODE')
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                    sum++;
                }
            },
            failure: function (response) {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: response.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }
    if (sum == gjRecords.length) {
        Ext.Msg.alert('提示信息', '删除成功');
    } else {
        Ext.MessageBox.show({
            title: '错误',
            msg: gjRecords.length - sum + '条删除失败',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
    _querygj();
    Ext.getCmp('deletegjWindow').close();
}

// 打开添加物料窗口
function _openAddwlWindow() {

    Ext.data.StoreManager.lookup('addwlStore').load({
        params:{
            V_V_PERSONCODE:person,
            V_V_DEPTCODENEXT:V_V_DEPTCODE
        }
    });
    Ext.getCmp('addwlPanel').reconfigure(Ext.data.StoreManager.lookup('addwlStore'));
    var records = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    Ext.getCmp('addwlWindow').show();
}

// 添加技术标准
function _addjsbz() {
    var records = Ext.getCmp('zsbjxPanel1').getSelectionModel().getSelection();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.Msg.alert('操作信息', '请选择一条零件记录');
        return;
    }else if(jxgxPanel.length == 0){
        Ext.Msg.alert('操作信息', '请选择一条工序');
        return;
    }else {
        var V_JXGX_CODE ='';
        if(jxgxPanel[0].data.V_JXGX_CODE != null){
            V_JXGX_CODE=jxgxPanel[0].data.V_JXGX_CODE;
        }
        var sum = 0;
        for (var i = 0; i < records.length; i++) {
            Ext.Ajax.request({
                url: AppUrl + 'Wsy/BASE_JXBZ_BY_GXCODE_INS',
                type: 'ajax',
                method: 'POST',
                async: false,
                params: {
                    V_V_JXGX_CODE: V_JXGX_CODE,
                    V_V_JSYQ_CODE: records[i].data.V_GUID,
                    V_V_JSYQ_NAME: records[i].data.V_PART_NAME
                },
                success: function (response) {
                    var data = Ext.decode(response.responseText);
                    if (data.V_INFO == 'SUCCESS') {
                        sum++;
                    }
                },
                failure: function (response) {
                    Ext.MessageBox.show({
                        title: '错误',
                        msg: response.responseText,
                        buttons: Ext.MessageBox.OK,
                        icon: Ext.MessageBox.ERROR
                    });
                }
            });
        }
        if (sum == records.length) {
            Ext.Msg.alert('提示信息', '添加成功');
            var zsbjxStore = Ext.data.StoreManager.lookup('zsbjxStore');
            zsbjxStore.load();
        } else {
            Ext.MessageBox.show({
                title: '错误',
                msg: records.length - sum + '条添加失败',
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
        _queryjxjsbz();
        Ext.getCmp('addjsbzWindow').close();
    }

}

// 添加选择的物料
function _addwl() {

    var wlRecords = Ext.getCmp('addwlPanel').getSelectionModel().getSelection();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    var V_JXGX_CODE=jxgxPanel[0].data.V_JXGX_CODE;
    if (wlRecords.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个物料!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var sum = 0;
    for (var i = 0; i < wlRecords.length; i++) {
        Ext.Ajax.request({
            url: AppUrl + 'Wsy/BASE_JXMX_WL_INS',
            type: 'ajax',
            method: 'POST',
            async: false,
            params: {
                V_V_JXGX_CODE: V_JXGX_CODE,
                V_V_WLCODE: wlRecords[i].data.V_SPCODE , //wlRecords[i].data.V_WLCODE,
                V_V_KFNAME: '', //wlRecords[i].data.V_KFNAME,
                V_V_WLSM: wlRecords[i].data.V_SPNAME ,//wlRecords[i].data.V_WLSM,
                V_V_GGXH:'' ,//wlRecords[i].data.V_GGXH,
                V_V_JLDW: '',// wlRecords[i].data.V_JLDW,
                V_V_PRICE: '',//wlRecords[i].data.V_PRICE,
                V_V_USE_NUM: wlRecords[i].data.V_NUMBER , //wlRecords[i].data.V_USE_NUM
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                    sum++;
                }
            },
            failure: function (response) {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: response.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }
    if (sum == wlRecords.length) {
        Ext.Msg.alert('提示信息', '添加成功');
        var addwlStore = Ext.data.StoreManager.lookup('addwlStore');
        addwlStore.load();
    } else {
        Ext.MessageBox.show({
            title: '错误',
            msg: wlRecords.length - sum + '条添加失败',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
    _querywl();
    Ext.getCmp('addwlWindow').close();
}

// 打开修改物料窗口
function _openEditwlWindow() {
    var records = Ext.getCmp('wlPanel1').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个物料!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var recordsData = records[0].data;
    var form = Ext.getCmp('editwlPanel').getForm();
    form.reset();
    for (var key in recordsData) {
        (form.findField(key) != null) ? form.findField(key).setValue(recordsData[key]) : '';
    }
    form.isValid();
    Ext.getCmp('editwlWindow').show();
}

// 修改物料
function _editwl() {
    var formData = Ext.getCmp('editwlPanel');
    Ext.Ajax.request({
        url: AppUrl + 'Wsy/BASE_GX_WL_UPD',
        method: 'POST',
        type: 'ajax',
        async: false,
        params: formData.getValues(),
        success: function (response) {
            var data = Ext.decode(response.responseText);
            if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                Ext.Msg.alert('提示信息', '修改成功');
            } else {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: '修改失败',
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        },
        failure: function (response) {
            Ext.MessageBox.show({
                title: '错误',
                msg: response.responseText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    });
    _querywl();
    Ext.getCmp('editwlWindow').close();
}

// 打开删除物料窗口
function _openDeletewlWindow() {
    var records = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    Ext.getCmp('deletewlWindow').show();
}

// 删除选择的物料
function _deletewl() {
    var wlRecords = Ext.getCmp('deletewlPanel').getSelectionModel().getSelection();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    var V_JXGX_CODE=jxgxPanel[0].data.V_JXGX_CODE;
    if (wlRecords.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个物料!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var sum = 0;
    for (var i = 0; i < wlRecords.length; i++) {
        Ext.Ajax.request({
            url: AppUrl + 'Wsy/BASE_GX_WL_DEL',
            type: 'ajax',
            method: 'POST',
            async: false,
            params: {
                'V_V_JXGX_CODE': V_JXGX_CODE,
                'V_V_WLCODE': wlRecords[i].get('V_WLCODE')
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                    sum++;
                }
            },
            failure: function (response) {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: response.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }
    if (sum == wlRecords.length) {
        Ext.Msg.alert('提示信息', '删除成功');
    } else {
        Ext.MessageBox.show({
            title: '错误',
            msg: wlRecords.length - sum + '条删除失败',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
    _querywl();
    Ext.getCmp('deletewlWindow').close();
}

// 打开添加安全措施窗口
function _openAddaqcsWindow() {
    var records = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    Ext.getCmp('addaqcsWindow').show();
}

// 添加选择的安全措施
function _addaqcs() {
    var aqcsRecords = Ext.getCmp('addaqcsPanel').getSelectionModel().getSelection();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    var V_JXGX_CODE=jxgxPanel[0].data.V_JXGX_CODE;
    if (aqcsRecords.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个安全措施!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var sum = 0;
    for (var i = 0; i < aqcsRecords.length; i++) {
        Ext.Ajax.request({
            url: AppUrl + 'Wsy/BASE_JXMX_AQCS_INS',
            type: 'ajax',
            method: 'POST',
            async: false,
            params: {
                V_V_JXGX_CODE: V_JXGX_CODE,
                V_V_AQCS_CODE: aqcsRecords[i].data.V_AQCS_CODE,
                V_V_AQCS_NAME: aqcsRecords[i].data.V_AQCS_NAME
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                    sum++;
                }
            },
            failure: function (response) {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: response.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }
    if (sum == aqcsRecords.length) {
        Ext.Msg.alert('提示信息', '添加成功');
        var addaqcsStore = Ext.data.StoreManager.lookup('addaqcsStore');
        addaqcsStore.load();
    } else {
        Ext.MessageBox.show({
            title: '错误',
            msg: aqcsRecords.length - sum + '条添加失败',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
    _queryaqcs();
    Ext.getCmp('addaqcsWindow').close();
}

// 打开删除安全措施窗口
function _openDeleteaqcsWindow() {
    var records = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    Ext.getCmp('deleteaqcsWindow').show();
}

// 删除选择的安全措施
function _deleteaqcs() {
    var aqcsRecords = Ext.getCmp('deleteaqcsPanel').getSelectionModel().getSelection();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    var V_JXGX_CODE=jxgxPanel[0].data.V_JXGX_CODE;
    if (aqcsRecords.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个安全措施!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var sum = 0;
    for (var i = 0; i < aqcsRecords.length; i++) {
        Ext.Ajax.request({
            url: AppUrl + 'Wsy/BASE_GX_AQCS_DEL',
            type: 'ajax',
            method: 'POST',
            async: false,
            params: {
                'V_V_JXGX_CODE': V_JXGX_CODE,
                'V_V_AQCS_CODE': aqcsRecords[i].get('V_AQCS_CODE')
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                    sum++;
                }
            },
            failure: function (response) {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: response.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }
    if (sum == aqcsRecords.length) {
        Ext.Msg.alert('提示信息', '删除成功');
    } else {
        Ext.MessageBox.show({
            title: '错误',
            msg: aqcsRecords.length - sum + '条删除失败',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
    _queryaqcs();
    Ext.getCmp('deleteaqcsWindow').close();
}

// 打开删除检修技术标准窗口
function _openDeletejxjsbzWindow() {
    Ext.getCmp('deletejxjsbzWindow').show();
}

// 删除选择的检修技术标准
function _deletejxjsbz() {
    var jxjsbzRecords = Ext.getCmp('deletejxjsbzPanel').getSelectionModel().getSelection();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (jxgxPanel.length == 0 ) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个检修工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    if (jxjsbzRecords.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个检修技术标准!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var V_JXGX_CODE='';
    if(jxgxPanel[0].data.V_JXGX_CODE != null){
        V_JXGX_CODE=jxgxPanel[0].data.V_JXGX_CODE;
    }
    var sum = 0;
    for (var i = 0; i < jxjsbzRecords.length; i++) {
        Ext.Ajax.request({
            url: AppUrl + 'Wsy/BASE_GX_JXBZ_DEL',
            type: 'ajax',
            method: 'POST',
            async: false,
            params: {
                'V_V_JXGX_CODE': V_JXGX_CODE,
                'V_V_JSYQ_CODE': jxjsbzRecords[i].get('V_GUID')
            },
            success: function (response) {
                var data = Ext.decode(response.responseText);
                if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                    sum++;
                }
            },
            failure: function (response) {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: response.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        });
    }
    if (sum == jxjsbzRecords.length) {
        Ext.Msg.alert('提示信息', '删除成功');
    } else {
        Ext.MessageBox.show({
            title: '错误',
            msg: jxjsbzRecords.length - sum + '条删除失败',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.ERROR
        });
    }
    _queryjxjsbz();
    Ext.getCmp('deletejxjsbzWindow').close();
}

// 打开添加工单窗口
function _openAddgdWindow() {
    var addwlStore = Ext.data.StoreManager.lookup('addwlStore');
    addwlStore.load();

    Ext.getCmp('addwlWindow').show();
}

// 打开添加技术标准窗口
function _openAddjsbzWindow() {
    var records = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    Ext.getCmp('addjsbzWindow').show();
}

/*// 添加选择的工单
function _addgd() {
}*/

// 打开修改工单窗口
function _openEditgdWindow() {
}

// 打开删除工单窗口
function _openDeletegdWindow() {
    var gxRecords = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (gxRecords.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个检修工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    Ext.getCmp('deletegdWindow').show();
}

// 删除选择的工单
function _deletegd() {
}

// 根据厂矿进行作业区联动
function _selectDept() {
    var zyqStore = Ext.data.StoreManager.lookup('zyqStore');
    zyqStore.proxy.extraParams.V_V_DEPTCODE = Ext.getCmp('plant').getValue();
    zyqStore.load();
}



// 点击设备树item查询检修模型窗口
function _queryjxmx() {
    var records = Ext.getCmp('sblxTreePanel').getSelectionModel().getSelection();
    var jxmxStore = Ext.data.StoreManager.lookup('jxmxStore');
    jxmxStore.removeAll();
    if (records.length != 0) {
        jxmxStore.load({
            params: {
                V_V_ORGCODE: Ext.getCmp('plant').getValue(),
                V_V_DEPTCODE: Ext.getCmp('dept').getValue(),
                V_V_EQUTYPE: '%',
                V_V_EQUCODE: records[0].get('sid'),
                V_V_EQUCHILD_CODE: '%',
                V_V_JXMX_NAME: '%',
                V_V_PAGE: Ext.getCmp('jxmxPanel_toolbar').store.currentPage,
                V_V_PAGESIZE: Ext.getCmp('jxmxPanel_toolbar').store.pageSize
            }
        });
    }
    _preViewImage(null);
    _querygx(null);
}

// 点击工序查询工具
function _querygj() {
    var gjStore1 = Ext.data.StoreManager.lookup('gjStore1');
    gjStore1.removeAll();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (jxgxPanel.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    if (jxgxPanel[0].data.V_JXGX_CODE != null && jxgxPanel[0].data.V_JXGX_CODE != '') {
        var V_JXGX_CODE=jxgxPanel[0].data.V_JXGX_CODE;
        gjStore1.load({
            params: {
                V_V_JXGX_CODE: V_JXGX_CODE
            }
        });
    }
}

// 点击设备树item查询子设备检修技术标准
function _queryzsbjx() {
    Ext.getCmp('zsbmc').setValue(null);
    var zsbjxStore = Ext.data.StoreManager.lookup('zsbjxStore');
    zsbjxStore.removeAll();
        zsbjxStore.load({
            params: {
                V_V_ORGCODE: V_V_ORGCODE,
                V_V_DEPTCODE: V_V_DEPTCODE,
                V_V_EQUCODE: V_V_EQUCODE,
                V_V_EQUCHILDCODE: '%',
                V_V_EQUTYPECODE: V_V_EQUTYPECODE
            }
        });

}

// 点击子设备名称按钮查询子设备检修技术标准
function _queryzsb() {
    //var records = Ext.getCmp('sblxTreePanel').getSelectionModel().getSelection();
    Ext.data.StoreManager.lookup('zsbjxStore').load({
        params: {
            V_V_ORGCODE: V_V_ORGCODE,
            V_V_DEPTCODE: V_V_DEPTCODE,
            V_V_EQUCODE: V_V_EQUCODE,
            V_V_EQUCHILDCODE: Ext.getCmp('zsbmc').getValue(),
            V_V_EQUTYPECODE: V_V_EQUTYPECODE
        }
    });
}

/*// 点击检修模型item查询工序窗口
function _querygx() {
    var jxgxStore = Ext.data.StoreManager.lookup('jxgxStore');
    jxgxStore.removeAll();
    if (V_MX_CODE != null) {
        jxgxStore.load({
            params: {
                V_V_JXMX_CODE: V_MX_CODE
            }
        });
    }
    *//*_querygz();
    _queryjj(null);
    _querygj(null);
    _queryaqcs();
    _queryjxjsbz();
    _querylsgd(null);
    _querywl();*//*
}*/

// 点击检修模型item显示网络施工图
function _preViewImage(V_MX_CODE) {
    Ext.getCmp('browseImage').getEl().dom.src = Ext.BLANK_IMAGE_URL;
    var imageStore = Ext.data.StoreManager.lookup('imageStore');
    imageStore.removeAll();
    if (V_MX_CODE != null) {
        imageStore.load({
            params: {
                'V_V_GUID': V_MX_CODE,
                'V_V_FILEGUID': ''
            }
        });
        index = 0;
        imageStore.on("load", function () {
            if (imageStore.getCount() != 0) {
                V_V_FILEGUID = imageStore.getAt(0).get('V_FILEGUID');
                var url = AppUrl + 'Wsy/BASE_FILE_IMAGE_SEL?V_V_GUID=' + V_MX_CODE + '&V_V_FILEGUID=' + V_V_FILEGUID;
                Ext.getCmp("browseImage").getEl().dom.src = url;
                picguidbegin = V_V_FILEGUID;
            }
        });
    }
}

function _viewImage(V_V_GUID, V_V_FILEGUID) {
    var url = AppUrl + 'Wsy/BASE_FILE_IMAGE_SEL?V_V_GUID=' + V_V_GUID + '&V_V_FILEGUID=' + V_V_FILEGUID;
    Ext.getCmp('browseImage2').getEl().dom.src = url;
}

// 点击工序item查询工种
function _querygz() {
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (jxgxPanel.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var gzStore1 = Ext.data.StoreManager.lookup('gzStore1');
    gzStore1.removeAll();
    if (jxgxPanel[0].data.V_JXGX_CODE != null && jxgxPanel[0].data.V_JXGX_CODE != '') {
        gzStore1.load({
            params: {
                V_V_JXGX_CODE: jxgxPanel[0].data.V_JXGX_CODE
            }
        });
    }
}

// 点击工序item查询机具
function _queryjj() {
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (jxgxPanel.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var jjStore = Ext.data.StoreManager.lookup('jjStore');
    jjStore.removeAll();
    if (jxgxPanel[0].data.V_JXGX_CODE != null && jxgxPanel[0].data.V_JXGX_CODE != '') {
        jjStore.load({
            params: {
                V_V_JXGX_CODE: jxgxPanel[0].data.V_JXGX_CODE
            }
        });
    }
    _queryjjxx(null);
}

// 点击工序item查询检修技术标准
function _queryjxjsbz() {
    var jxjsbzStore = Ext.data.StoreManager.lookup('jxjsbzStore');
    jxjsbzStore.removeAll();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (jxgxPanel.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    if (jxgxPanel[0].data.V_JXGX_CODE != null && jxgxPanel[0].data.V_JXGX_CODE != '') {
        jxjsbzStore.load({
            params: {
                V_V_GX_CODE: jxgxPanel[0].data.V_JXGX_CODE
            }
        });
    }
    _querygdmx(null);
    _queryjxjj(null);
    _queryjxgj(null);
    _queryjxgz(null);
}

// 点击工序item查询历史工单
function _querylsgd() {
    var lsgdStore = Ext.data.StoreManager.lookup('lsgdStore');
    lsgdStore.removeAll();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (jxgxPanel.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    if (jxgxPanel[0].data.V_JXGX_CODE != null && jxgxPanel[0].data.V_JXGX_CODE != '') {
        lsgdStore.load({
            params: {
                V_V_GX_GUID: jxgxPanel[0].data.V_JXGX_CODE
            }
        });
    }
    _querygdgz(null);
    _querygdgj(null);
    _querygdjj(null);
    _querygdwl(null);
}

// 点击工序item查询物料
function _querywl() {
    var wlStore = Ext.data.StoreManager.lookup('wlStore');
    wlStore.removeAll();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (jxgxPanel.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    if (jxgxPanel[0].data.V_JXGX_CODE != null && jxgxPanel[0].data.V_JXGX_CODE != '') {
        wlStore.load({
            params: {
                V_V_JXGX_CODE: jxgxPanel[0].data.V_JXGX_CODE
            }
        });
    }
}

// 点击工序item查询安全措施
function _queryaqcs() {
    var aqcsStore = Ext.data.StoreManager.lookup('aqcsStore');
    aqcsStore.removeAll();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (jxgxPanel.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个工序!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    if (jxgxPanel[0].data.V_JXGX_CODE != null && jxgxPanel[0].data.V_JXGX_CODE != '') {
        aqcsStore.load({
            params: {
                V_V_GX_CODE: jxgxPanel[0].data.V_JXGX_CODE
            }
        });
    }
    _queryaqcsya(null);
    _queryaqsgal(null);
    _queryaqcsxq(null);
    _queryaqcsfj(null);
}

// 点击安全措施item查询安全措施预案
function _queryaqcsya(V_AQCS_CODE) {
    var aqcsyaStore = Ext.data.StoreManager.lookup('aqcsyaStore');
    aqcsyaStore.removeAll();
    if (V_AQCS_CODE != null) {
        aqcsyaStore.load({
            params: {
                V_V_AQCS_CODE: V_AQCS_CODE
            }
        });
    }
}

// 点击安全措施item查询安全事故案例
function _queryaqsgal(V_AQCS_CODE) {
    var aqsgalStore = Ext.data.StoreManager.lookup('aqsgalStore');
    aqsgalStore.removeAll();
    if (V_AQCS_CODE != null) {
        aqsgalStore.load({
            params: {
                V_V_AQCS_CODE: V_AQCS_CODE
            }
        });
    }
}

// 点击安全措施item查询安全措施详情
function _queryaqcsxq(V_AQCS_CODE) {
    Ext.getCmp('V_AQCS_NAME').setValue(null);
    Ext.getCmp('V_AQCS_DETAIL').setValue(null);
    Ext.getCmp('V_AQ_ZYSX').setValue(null);
    if (V_AQCS_CODE != null) {
        Ext.Ajax.request({// 加载被修改对象
            url: AppUrl + 'Wsy/BASE_AQCS_BYCODE_SEL',
            method: 'POST',
            async: false,
            params: {
                V_V_AQCS_CODE: V_AQCS_CODE
            },
            success: function (resp) {
                resp = Ext.decode(resp.responseText);
                Ext.getCmp('V_AQCS_NAME').setValue(resp.list[0].V_AQCS_NAME);// 设备名称
                Ext.getCmp('V_AQCS_DETAIL').setValue(resp.list[0].V_AQCS_DETAIL);// 设备类型编码
                Ext.getCmp('V_AQ_ZYSX').setValue(resp.list[0].V_AQ_ZYSX);// 设备类型位置
            }
        });
    }
}

// 点击安全措施item查询安全措施附件
function _queryaqcsfj(V_AQCS_CODE) {
    var aqcsfjStore = Ext.data.StoreManager.lookup('aqcsfjStore');
    aqcsfjStore.removeAll();
    if (V_AQCS_CODE != null) {
        aqcsfjStore.load({
            params: {
                V_V_GUID: V_AQCS_CODE
            }
        });
    }
}

// 点击检修技术标准item查询工单明细
function _querygdmx(V_GUID) {
    var gdmxStore = Ext.data.StoreManager.lookup('gdmxStore');
    gdmxStore.removeAll();
    if (V_GUID != null) {
        gdmxStore.load({
            params: {
                V_V_JXBZ_GUID: V_GUID
            }
        });
    }
    _queryqxmx(null);
}

// 点击检修技术标准item查询检修机具
function _queryjxjj(V_GUID) {
    var jxjjStore1 = Ext.data.StoreManager.lookup('jxjjStore1');
    jxjjStore1.removeAll();
    if (V_GUID != null) {
        jxjjStore1.load({
            params: {
                V_V_JXBZ_GUID: V_GUID
            }
        });
    }
    _queryjxjjxx(null);
}

// 点击检修机具item查询检修机具信息
function _queryjxjjxx(V_CARCODE) {
    var jxjjStore2 = Ext.data.StoreManager.lookup('jxjjStore2');
    jxjjStore2.removeAll();
    if (V_CARCODE != null) {
        jxjjStore2.load({
            params: {
                V_V_CAR_CODE: V_CARCODE
            }
        });
    }
}

// 点击检修技术标准item查询检修工具
function _queryjxgj(V_GUID) {
    var jxgjStore1 = Ext.data.StoreManager.lookup('jxgjStore1');
    jxgjStore1.removeAll();
    if (V_GUID != null) {
        jxgjStore1.load({
            params: {
                V_V_JXBZ_GUID: V_GUID
            }
        });
    }
}

// 点击检修技术标准item查询检修工种
function _queryjxgz(V_GUID) {
    var jxgzStore1 = Ext.data.StoreManager.lookup('jxgzStore1');
    jxgzStore1.removeAll();
    if (V_GUID != null) {
        jxgzStore1.load({
            params: {
                V_V_JXBZ_GUID: V_GUID
            }
        });
    }
}

// 点击历史工单维护信息item查询历史工单工种
function _querygdgz(V_ORDERGUID) {
    var gdgzStore = Ext.data.StoreManager.lookup('gdgzStore');
    gdgzStore.removeAll();
    if (V_ORDERGUID != null) {
        gdgzStore.load({
            params: {
                V_V_ORDERGUID: V_ORDERGUID
            }
        });
    }
}

// 点击历史工单维护信息item查询历史工单工具
function _querygdgj(V_ORDERGUID) {
    var gdgjStore = Ext.data.StoreManager.lookup('gdgjStore');
    gdgjStore.removeAll();
    if (V_ORDERGUID != null) {
        gdgjStore.load({
            params: {
                V_V_ORDERGUID: V_ORDERGUID
            }
        });
    }
}

// 点击历史工单维护信息item查询历史工单机具
function _querygdjj(V_ORDERGUID) {
    var gdjjStore = Ext.data.StoreManager.lookup('gdjjStore');
    gdjjStore.removeAll();
    if (V_ORDERGUID != null) {
        gdjjStore.load({
            params: {
                V_V_ORDERGUID: V_ORDERGUID
            }
        });
    }
}

// 点击历史工单维护信息item查询历史工单物料
function _querygdwl(V_ORDERGUID) {
    var gdwlStore = Ext.data.StoreManager.lookup('gdwlStore');
    gdwlStore.removeAll();
    if (V_ORDERGUID != null) {
        gdwlStore.load({
            params: {
                V_V_ORDERGUID: V_ORDERGUID
            }
        });
    }
}

// 点击工单明细item查询缺陷明细
function _queryqxmx(V_ORDERGUID) {
    var qxmxStore = Ext.data.StoreManager.lookup('qxmxStore');
    qxmxStore.removeAll();
    if (V_ORDERGUID != null) {
        qxmxStore.load({
            params: {
                V_V_GD_GUID: V_ORDERGUID
            }
        });
    }
}

// 点击机具item查询机具信息
function _queryjjxx(V_JJ_CODE) {
    var jjxxStore = Ext.data.StoreManager.lookup('jjxxStore');
    jjxxStore.removeAll();
    if (V_JJ_CODE != null) {
        jjxxStore.load({
            params: {
                V_V_CAR_CODE: V_JJ_CODE
            }
        });
    }
}

function _select() {
}

function _manage() {
}

function _update() {
}

function _open() {
    Ext.getCmp('window').show();
}

// 打开附件窗口
function _openAttachWindow(V_ZG_GUID) {
    Ext.data.StoreManager.lookup('aqcsfjStore1').load({
        params: {
            V_V_GUID: V_ZG_GUID
        }
    });
    Ext.getCmp('attachWindow').show();
}

// 编辑窗口根据厂矿进行作业区联动
function _selectDeptWin() {
    var deptStore = Ext.data.StoreManager.lookup('deptStore');
    deptStore.removeAll();
    Ext.getCmp('WIN_DEPTCODE').setValue(null);
    _selectEquType();
    deptStore.proxy.extraParams.V_V_DEPTCODE = Ext.getCmp('WIN_ORGCODE').getValue();
    deptStore.load();
}

// 编辑窗口根据作业区进行设备类型联动
function _selectEquType() {
    var eTypeStore = Ext.data.StoreManager.lookup('eTypeStore');
    eTypeStore.removeAll();
    Ext.getCmp('WIN_EQUTYPECODE').setValue(null);
    _selectEquName();
    if (Ext.getCmp('WIN_DEPTCODE').getValue() != null) {
        eTypeStore.proxy.extraParams.V_V_DEPTCODENEXT = Ext.getCmp('WIN_DEPTCODE').getValue();
        eTypeStore.load();
    }
}

// 编辑窗口根据设备类型进行设备名称联动
function _selectEquName() {
    var equNameStore = Ext.data.StoreManager.lookup('equNameStore');
    equNameStore.removeAll();
    Ext.getCmp('WIN_EQUCODE').setValue(null);
    _selectSubEquName();
    if (Ext.getCmp('WIN_EQUTYPECODE').getValue() != null) {
        equNameStore.proxy.extraParams.v_v_deptcodenext = Ext.getCmp('WIN_DEPTCODE').getValue();
        equNameStore.proxy.extraParams.v_v_equtypecode = Ext.getCmp('WIN_EQUTYPECODE').getValue();
        equNameStore.load();
    }
}

// 编辑窗口根据设备名称进行子设备名称联动
function _selectSubEquName() {
    var subequNameStore = Ext.data.StoreManager.lookup('subequNameStore');
    subequNameStore.removeAll();
    if (Ext.getCmp('WIN_EQUCODE').getValue() != null) {
        subequNameStore.proxy.extraParams.V_V_DEPTCODE = Ext.getCmp('WIN_ORGCODE').getValue();
        subequNameStore.proxy.extraParams.V_V_DEPTNEXTCODE = Ext.getCmp('WIN_DEPTCODE').getValue();
        subequNameStore.proxy.extraParams.V_V_EQUTYPECODE = Ext.getCmp('WIN_EQUTYPECODE').getValue();
        subequNameStore.proxy.extraParams.V_V_EQUCODE = Ext.getCmp('WIN_EQUCODE').getValue();
        subequNameStore.load();
    }
}

// 缺陷来源弹窗
function _openqxlyWindow(V_GUID) {
    var owidth = window.document.body.offsetWidth - 200;
    var oheight = window.document.body.offsetHeight - 100;
    var ret = window.open(AppUrl + "page/PM_070301/index.html?v_guid=" + V_GUID, '', 'height=' + oheight + ',width=' + owidth + ',top=10px,left=10px,resizable=yes');
}

// 附件下载
function _downloadAttach(V_GUID) {// 导出
    var url = AppUrl + 'Wsy/downloadAttachment?V_V_GUID=' + V_GUID;
    location.href = url;
}

function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

var pageFunction = {
    /**
     * 甘特图动态渲染
     */
    CreateGantt: function () {
        var starttime = '';
        var endtime = '';
        var dateItems = [];
        var vzm = '';
        cmItems = [];
        vzm = 'color:#000000';

        for (var i = 0; i < ganttdata.length; i++) {
            if (ganttdata[0].V_PERTIME != null) {
                if (i == 0) {
                    starttime = '0';
                    endtime = ganttdata[0].V_PERTIME;
                    VSTART = starttime;
                    VEND = endtime;
                    ganttdata[0].VSTART = VSTART;
                    ganttdata[0].VEND = VEND;
                } else {
                    starttime = endtime;
                    endtime = parseInt(endtime) + parseInt(ganttdata[i].V_PERTIME);
                    VSTART = starttime;
                    VEND = endtime;
                    ganttdata[i].VSTART = VSTART;
                    ganttdata[i].VEND = VEND;
                }
            }
        }
        cmItems.push({
            text: '小时',
            columns: dateItems
        });
        for (var j = 1; j <= parseInt(endtime); j++) {
            dateItems.push({
                text: j,
                style: vzm,
                width: 40
            });
        }

        cmItems.push({
            text: '',
            width: 0,
            dataIndex: 'MYCOLOR',
            renderer: pageFunction.IndexShow
        });

        var ganttStore123 = Ext.create("Ext.data.Store", {
            storeId: 'ganttStore123',
            fields: ['V_MX_CODE', 'V_MX_NAME', 'V_JXGX_CODE', 'V_JXGX_NAME', 'V_JXGX_NR', 'V_GZZX_CODE', 'V_PERTIME', 'MYCOLOR', 'VSTART', 'VEND'],
            data: ganttdata,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json',
                    root: 'list'
                }
            }
        });

        var ganttGrid = Ext.create('Ext.grid.Panel', {
            id: 'ganttGrid',
            store: ganttStore123,
            region: 'center',
            columnLines: true,
            columns: cmItems
        });
        Ext.getCmp('ganttpanel').add(ganttGrid);
    },
    QueryGanttData: function () {
        if (Ext.data.StoreManager.lookup('ganttStore123') != null) {
            var ganttStore123 = Ext.data.StoreManager.lookup('ganttStore123');
            ganttStore123.removeAll();
            if (Ext.getCmp('ganttGrid') != null) {
                var ganttGrid = Ext.getCmp('ganttGrid');
                Ext.getCmp('ganttpanel').remove(ganttGrid);
            }
        }
        ganttdata = [];
        Ext.Ajax.request({
            url: AppUrl + 'Wsy/PM_1917_JXGX_DATA_SEL',
            method: 'POST',
            async: false,
            params: {
                V_V_JXMX_CODE: V_JXMX_CODE
            },
            success: function (resp) {
                resp = Ext.decode(resp.responseText);
                if (resp.list != null) {
                    ganttdata = resp.list;

                    if (resp.list.length > 0) {
                        pageFunction.CreateGantt();
                    }
                }
            }
        });
    },
    /**构造显示结构*/
    IndexShow: function (value, metaData, record) {
        var startd = '0';
        var endd = '0';
        if(record.data.VSTART != null && record.data.VEND != null){
            startd = record.data.VSTART;
            endd = record.data.VEND;
        }
        var vleft = startd;
        var vwidth = endd - startd;
        if(record.data.V_JXGX_NAME != null && record.data.V_JXGX_CODE != null) {
            var gtt = '<div style="left:' + (vleft * 40).toString() + 'px;height:21px;width:' + (vwidth * 40).toString() + 'px;background-color:A6FFA6;" class="sch-event"  ><div class="sch-event-inner" >' + record.data.V_JXGX_NAME + '</div></div><div class="lxm"  id="' + record.data.V_JXGX_CODE + '" style="display:none; position:absolute; z-index:9999; border:1px solid #666;">';

            var cont = record.data.V_JXGX_NAME;
            var contt = '内容：';
            for (var i = 0; i < cont.length; i++) {
                if (i == 0) {
                    contt = contt + cont[i] + '<br>';
                } else {
                    contt = contt + cont[i] + '<br>';
                }
            }
            gtt = gtt + contt + '</div>';
            return gtt;
        }
    }
};