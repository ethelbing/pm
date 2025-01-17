var win5;// 父窗口对象，由子窗口调用
var win;// 父窗口对象，由子窗口调用
//var ZG_GUID;
var picguidbegin;
var cmItems = [];
var V_V_FILEGUID = '';
var index = 0;
var flag = "";
var ganttdata = [];
var VSTART;
var VEND;
var mx_code;
var sign = "";
var V_V_PERSONCODE = Ext.util.Cookies.get('v_personcode');
var V_V_PERSONNAME = Ext.util.Cookies.get('v_personname');
var V_V_DEPTCODE = Ext.util.Cookies.get('v_deptcode');
Ext.define('Ext.ux.data.proxy.Ajax', {
    extend: 'Ext.data.proxy.Ajax',
    async: true,
    doRequest: function (operation, callback, scope) {
        var writer = this.getWriter(),
            request = this.buildRequest(operation);
        if (operation.allowWrite()) {
            request = writer.write(request);
        }
        Ext.apply(request, {
            async: this.async,
            binary: this.binary,
            headers: this.headers,
            timeout: this.timeout,
            scope: this,
            callback: this.createRequestCallback(request, operation, callback, scope),
            method: this.getMethod(request),
            disableCaching: false
        });
        Ext.Ajax.request(request);
        return request;
    }
});

Ext.onReady(function () {
    Ext.QuickTips.init();
    var teamStore123 = Ext.create('Ext.data.Store', {//检修工作中心
        storeId: 'teamStore123',
        autoLoad: true,
        fields: ['V_SAP_WORKNAME', 'V_SAP_WORK'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'basic/PRO_BASE_DEPTTOSAPWORKCSAT',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            },
            extraParams: {
                'V_V_DEPTREPAIRCODE': Ext.util.Cookies.get('v_deptcode')
            }
        },
        listeners: {
            load: function (store, records) {
                Ext.getCmp('jxteam').select(store.first());
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
        },
        listeners: {
            load: function (store, records) {
                Ext.getCmp('plant').select(ckStore.getAt(0));
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

    //设备类型下拉框stroe
    var sblxStore = Ext.create('Ext.data.Store', {
        id: 'sblxStore',
        autoLoad: false,
        fields: ['V_EQUTYPECODE', 'V_EQUTYPENAME'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'PM_06/PRO_GET_DEPTEQUTYPE_PER',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            }
        },
        listeners: {// 给子集下拉框赋值
            load: function (store, records) {
                Ext.getCmp('sblx').select(sblxStore.getAt(0));
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
        fields: ['V_JXGX_CODE', 'V_PERCODE_DE', 'V_PERNAME_DE', 'V_PERTYPE_DE', 'V_DE', 'V_TS'],
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
        //pageSize: 20,
        fields: ['V_MX_CODE', 'V_MX_NAME', 'V_GX_CODE', 'V_ORGCODE', 'V_DEPTCODE', 'V_EQUTYPE', 'V_EQUCODE', 'V_EQUCODE_CHILD', 'V_BZ', 'V_IN_DATE', 'V_IN_PER', 'V_REPAIRMAJOR_CODE', 'V_HOUR', 'V_MXBB_NUM'],
        proxy: {
            url: AppUrl + 'hp/PM_1917_JXMX_DATA_SEL2',
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
        //pageSize: 20,
        fields: ['V_MX_CODE', 'V_MX_NAME', 'V_JXGX_CODE', 'V_JXGX_NAME', 'V_JXGX_NR', 'V_GZZX_CODE', 'V_PERTIME', 'V_ORDER', 'V_JXBZ', 'V_JXBZ_VALUE_DOWN', 'V_JXBZ_VALUE_UP'],
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
        pageSize: 20,
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
        pageSize: 20,
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
        pageSize: 20,
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
        pageSize: 20,
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
        pageSize: 20,
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
        pageSize: 20,
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
        pageSize: 20,
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
        pageSize: 20,
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
        autoLoad: false,
        loading: false,
        pageSize: 20,
        fields: ['V_GUID', 'V_PART_NUMBER', 'V_PART_NAME', 'V_PART_CODE', 'V_MATERIAL', 'V_IMGSIZE', 'V_IMGGAP', 'V_VALUE_UP', 'V_VALUE_DOWN', 'V_REPLACE_CYC', 'V_WEIGHT', 'V_IMGCODE', 'V_CONTENT'],
        proxy: {
            url: AppUrl + 'mwd/PM_REPAIR_JS_STANDARD_SEL',
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
    // 工单明细store
    var gdmxStore = Ext.create('Ext.data.Store', {
        storeId: 'gdmxStore',
        autoLoad: false,
        loading: false,
        pageSize: 20,
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
        pageSize: 20,
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
        pageSize: 20,
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
        pageSize: 20,
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
        pageSize: 20,
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
        pageSize: 20,
        fields: ['V_PERCODE_DE', 'V_PERNAME_DE', 'V_PERTYPE_DE', 'V_DE', 'V_TS'],
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
        pageSize: 20,
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
        pageSize: 20,
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
        pageSize: 20,
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
        pageSize: 20,
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
        pageSize: 20,
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
        pageSize: 20,
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
    // 顶部查询条件(combo, button)
    var inputPanel = Ext.create('Ext.Panel', {
        id: 'inputPanel',
        title: '<div align="center">检修模型管理</div>',
        frame: true,
        border: false,
        layout: 'column',
        defaults: {
            labelAlign: 'right',
            labelWidth: 100,
            inputWidth: 140,
            style: 'margin:5px 0px 5px 10px'
        },
        items: [{
            xtype: 'combo',
            id: 'plant',
            store: ckStore,
            queryMode: 'local',
            valueField: 'V_DEPTCODE',
            displayField: 'V_DEPTNAME',
            fieldLabel: '厂矿',
            emptyText: '全部',
            editable: false,
            labelWidth: 70,
            listeners: {
                change: function (combo, records) {
                    _selectDept();
                }
            }
        }, {
            xtype: 'combo',
            id: 'dept',
            store: zyqStore,
            style: 'margin:5px 0px 5px 20px',
            queryMode: 'local',
            valueField: 'V_DEPTCODE',
            displayField: 'V_DEPTNAME',
            fieldLabel: '作业区',
            emptyText: '全部',
            editable: false,
            labelWidth: 70,
            listeners: {
                change: function (combo, records) {
                    sblxload();
                    _queryjxmx();
                    //_queryTree();
                }
            }
        },
            {
                xtype: 'combo',
                id: 'sblx',
                store: sblxStore,
                fieldLabel: '设备类型',
                labelAlign: 'right',
                editable: false,
                margin: '5 0 5 5',
                labelWidth: 75,
                width: 255,
                displayField: 'V_EQUTYPENAME',
                valueField: 'V_EQUTYPECODE',
                queryMode: 'local',
                listeners: {
                    change: function () {
                        _queryjxmx();
                        //sbmcload();
                    }
                }
            }, {
                xtype: 'panel',
                frame: true,
                width: '100%',
                layout: 'column',
                colspan: 8,
                baseCls: 'my-panel-noborder',
                style: 'margin: 5px 5px 5px 80px',
                items: [

                    {
                        xtype: 'button',
                        text: '添加模型',
                        icon: imgpath + '/add.png',
                        width: 100,
                        margin: '0px 0px 0px 5px',
                        handler: _openmanageWindow
                    }, {
                        xtype: 'button',
                        text: '修改模型',
                        icon: imgpath + '/edit.png',
                        width: 100,
                        margin: '0px 0px 0px 5px',
                        handler: _openUpdateWindow
                    }, {
                        xtype: 'button',
                        text: '删除模型',
                        icon: imgpath + '/delete1.png',
                        width: 100,
                        margin: '0px 0px 0px 5px',
                        handler: _deleteJXMX
                    }, {
                        xtype: 'button',
                        text: '添加工序',
                        icon: imgpath + '/add.png',
                        width: 100,
                        margin: '0px 0px 0px 5px',
                        handler: _addProcedureWindow
                    }, {
                        xtype: 'button',
                        text: '修改工序',
                        icon: imgpath + '/edit.png',
                        width: 100,
                        margin: '0px 0px 0px 5px',
                        handler: _editProcedureWindow
                    }, {
                        xtype: 'button',
                        text: '删除工序',
                        icon: imgpath + '/delete1.png',
                        width: 100,
                        margin: '0px 0px 0px 5px',
                        handler: _deleteProcedure
                    }, {
                        xtype: 'button',
                        text: '查看详细',
                        icon: imgpath + '/search.png',
                        width: 100,
                        margin: '0px 0px 0px 5px',
                        hidden: true,
                        handler: _procedualDetail
                    }, {
                        xtype: 'button',
                        text: '附件添加',
                        icon: imgpath + '/fj.png',
                        width: 100,
                        margin: '0px 0px 0px 5px',
                        handler: _addmxfile
                    }
                ]
            }
        ]
    });
    // 检修模型gridPanel
    var jxmxPanel = Ext.create('Ext.grid.Panel', {
        id: 'jxmxPanel',
        store: jxmxStore,
        frame: true,
        title: '检修模型',
        columnLines: true,
        border: false,
        forceFit: true,
        region: 'north',
        selModel: {
            selType: 'checkboxmodel'/*,
            mode: 'SIMPLE'//多选*/
        },
        height: '50%',
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            sortable: false
        }, {
            text: '检修模型名称',
            dataIndex: 'V_MX_NAME',
            style: 'text-align: center;',
            width: 110,
            renderer: atleft
        }, {
            text: '模型版本号',
            dataIndex: 'V_MXBB_NUM',
            style: 'text-align: center;',
            width: 120,
            renderer: atleft
        }, {
            text: '备注',
            dataIndex: 'V_BZ',
            style: 'text-align: center;',
            width: 100,
            renderer: atleft
        }],
        listeners: {
            itemclick: function (panel, record, item, index, e, eOpts) {
                _querygx(record.get('V_MX_CODE'));
                pageFunction.QueryGanttData();
            }
        },
        bbar: ['->', {
            xtype: 'pagingtoolbar',
            id: 'jxmxPanel_toolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: jxmxStore,
            width: '100%'
        }]
    });
    // 检修工序gridPanel
    var jxgxPanel = Ext.create('Ext.grid.Panel', {
        id: 'jxgxPanel',
        store: jxgxStore,
        columnLines: true,
        border: false,
        title: '检修工序',
        frame: true,
        selModel: {
            selType: 'checkboxmodel',
            mode: 'SIMPLE'//多选
        },
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
            flex: 1,
            renderer: atleft
        }, {
            text: '工序名称',
            dataIndex: 'V_JXGX_NAME',
            style: 'text-align: center;',
            flex: 1,
            renderer: atleft
        }, {
            text: '工序内容',
            dataIndex: 'V_JXGX_NR',
            style: 'text-align: center;',
            flex: 1,
            renderer: atleft
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
        }]
    });

    var ganttpanel = Ext.create('Ext.panel.Panel', {
        id: 'ganttpanel',
        editable: false,
        autoScroll: true,
        frame: true,
        layout: 'fit',
        region: 'center',
        items: []
    });

    var viewImagePanel = Ext.create("Ext.form.Panel", {
        id: 'viewImagePanel',
        editable: false,
        frame: true,
        border: false,
        region: 'center',
        items: [{
            xtype: 'box',
            id: 'browseImage2',
            autoEl: {
                width: '100%',
                height: '100%',
                tag: 'input',
                type: 'image',
                src: Ext.BLANK_IMAGE_URL,
                style: 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale); border:1px solid #bebebe; margin-left: 0px;margin-top: 0px;',
                id: 'imageBrowse2',
                name: 'imageBrowse2'
            }
        }]
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
                flex: 1,
                renderer: atleft
            }, {
                text: '上传时间',
                dataIndex: 'V_TIME',
                align: 'center',
                flex: 1,
                renderer: atleft
            }, {
                text: '上传人',
                dataIndex: 'V_PERSON',
                align: 'center',
                flex: 1,
                renderer: atleft
            }, {
                text: '下载',
                align: 'center',
                flex: 0.7,
                renderer: function (value, metaData, record, rowIndex, colIndex, store, view) {
                    return '<a href=javascript:_downloadAttach(\'' + record.data.V_GUID + '\')>下载</a>';// 超链接导出
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
        autoLoad: false,
        fields: ['V_WORKCODE', 'V_WORKNAME', 'V_WORKTYPE', 'V_DE', 'V_TIME'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'Wsy/PRO_BASE_PERSON_DE_SEL',// 无条件查询所有工种
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
    // 添加机具store
    var addjjStore = Ext.create('Ext.data.Store', {
        storeId: 'addjjStore',
        autoLoad: false,
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
            extraParams: {},
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
        autoLoad: false,
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
    var addwlStore = Ext.create('Ext.data.Store', {
        storeId: 'addwlStore',
        autoLoad: false,
        loading: false,
        pageSize: 20,
        fields: ['V_KFNAME', 'V_WLCODE', 'V_WLSM', 'V_GGXH', 'V_JLDW', 'V_PRICE', 'V_USE_NUM'],
        proxy: {
            url: AppUrl + 'Wsy/BASE_WL_SEL',
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
    // 添加安全措施store
    var addaqcsStore = Ext.create('Ext.data.Store', {
        storeId: 'addaqcsStore',
        autoLoad: false,
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
            extraParams: {},
            reader: {
                type: 'json',
                root: 'list',
                totalProperty: 'total'
            }
        }
    });
//--附件类型
    var ftypeStore = Ext.create('Ext.data.Store', {
        id: 'ftypeStore',
        autoLoad: false,
        fields: ['ID', 'FNAME', 'FTYPE'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'dxfile/FILETYPE_GETLIST',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            }
        }
    });
    Ext.data.StoreManager.lookup('ftypeStore').load({
        params: {
            SIGN: 'M'
        }
    });
    Ext.data.StoreManager.lookup('ftypeStore').on('load', function () {
        Ext.ComponentManager.get('fjtype').store.insert(0, {
            'ID': '%',
            'FNAME': '全部'
        });
        Ext.getCmp('fjtype').select(Ext.data.StoreManager.lookup('ftypeStore').data.getAt(0));
    });

    var mxfileStore = Ext.create('Ext.data.Store', {
        id: 'mxfileStore',
        autoLoad: false,
        fields: ['V_FILEGUID', 'V_FILENAME', 'V_FILETYPE', 'V_MODE_GUID', 'V_INPERCODE', 'V_INPERNAME', 'V_INTIME', 'V_TYPE'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'dxfile/PM_MODEL_FILE_SEL',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            }
        }
    });
    // 编辑弹窗gridPanel
    var editPanel = Ext.create('Ext.form.Panel', {
        id: 'editPanel',
        border: false,
        region: 'center',
        frame: true,
        autoScroll: true,
        layout: 'column',
        baseCls: 'my-panel-no-border',
        defaults: {
            labelAlign: 'right',
            labelWidth: 100,
            style: 'margin:10px 0px 0px 0px'
        },
        items: [{
            xtype: 'combo',
            id: 'WIN_ORGCODE',
            store: ckStore,
            queryMode: 'local',
            valueField: 'V_DEPTCODE',
            displayField: 'V_DEPTNAME',
            fieldLabel: '厂矿',
            emptyText: '请选择',
            editable: false,
            width: 300,
            listeners: {
                select: function () {
                    _selectDeptWin();
                }
            }
        }, {
            xtype: 'combo',
            id: 'WIN_DEPTCODE',
            store: deptStore,
            queryMode: 'local',
            valueField: 'V_DEPTCODE',
            displayField: 'V_DEPTNAME',
            fieldLabel: '作业区',
            emptyText: '请选择',
            editable: false,
            width: 300,
            listeners: {
                select: function () {
                    _selectEquType();
                }
            }
        }, {
            xtype: 'combo',
            id: 'WIN_EQUTYPECODE',
            store: eTypeStore,
            queryMode: 'local',
            valueField: 'V_EQUTYPECODE',
            displayField: 'V_EQUTYPENAME',
            fieldLabel: '设备类型',
            emptyText: '请选择',
            editable: false,
            width: 300
        }, {
            xtype: 'textfield',
            id: 'WIN_JXMX_CODE',
            fieldLabel: '检修模型编码',
            width: 300,
            hidden: true
        }, {
            xtype: 'textfield',
            id: 'WIN_JXMX_NAME',
            fieldLabel: '检修模型名称',
            width: 300
        }, {
            xtype: 'textfield',
            id: 'WIN_MXBB_NUM',
            fieldLabel: '模型版本号',
            width: 300
        }, {
            xtype: 'displayfield',
            id: 'WIN_IN_PER',
            fieldLabel: '录入人',
            width: 300
        }, {
            xtype: 'displayfield',
            id: 'WIN_IN_DATE',
            fieldLabel: '录入时间',
            width: 300
        }, {
            xtype: 'textarea',
            id: 'WIN_BZ',
            fieldLabel: '备注',
            width: 600
        }]
    });
    // 编辑弹窗Window
    var editWindow = Ext.create('Ext.window.Window', {
        id: 'editWindow',
        width: 660,
        height: 400,
        layout: 'fit',
        title: '编辑',
        modal: true,
        frame: true,
        closeAction: 'hide',
        closable: true,
        items: [editPanel],
        buttons: [{
            xtype: 'button',
            text: '保存',
            width: 40,
            handler: function () {
                _save();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                editWindow.close();
            }
        }]
    });

    var rightComboPanel = Ext.create('Ext.Panel', {
        id: 'rightComboPanel',
        layout: 'border',
        defaults: {
            border: false
        },
        items: [{
            region: 'north',
            layout: 'fit',
            height: '40%',
            items: [jxgxPanel]
        }, {
            region: 'center',
            layout: 'fit',
            items: [ganttpanel]
        }]
    });

    Ext.create('Ext.container.Viewport', {
        layout: {
            type: 'border',
            regionWeights: {
                west: -1,
                north: 1,
                south: 1,
                east: -1
            }
        },
        defaults: {
            border: false
        },
        items: [{
            region: 'north',
            items: [inputPanel]
        }, {
            region: 'west',
            layout: 'fit',
            width: 500,
            split: true,
            collapsible: true,
            header: false,
            items: [jxmxPanel]
        }, {
            region: 'center',
            layout: 'fit',
            items: [rightComboPanel]
        }]
    });

    var inputProcedurePanel = Ext.create('Ext.form.Panel', {
        id: 'inputProcedurePanel',
        region: 'north',
        padding: '10px 0px 0px 0px',
        frame: true,
        border: false,
        defaults: {
            labelAlign: 'right',
            labelWidth: 120,
            width: 300
        },
        layout: {
            type: 'table',
            columns: '2'
        },
        items: [{
            xtype: 'textfield',
            id: 'jxgxbm',
            colspan: 2,
            hidden: true,
        }, {
            xtype: 'textfield',
            id: 'V_EQUTYPE',
            colspan: 2,
            fieldLabel: '设备类型编码',
            readOnly: true,
            hidden: true,
        }, {
            xtype: 'textfield',
            id: 'V_DEPTCODE',
            colspan: 2,
            fieldLabel: '作业区编码',
            readOnly: true,
            hidden: true,
        }, {
            xtype: 'textfield',
            id: 'jxgxname',
            colspan: 2,
            fieldLabel: '检修工序名称',
            width: 340
        }, {
            xtype: 'textareafield',
            id: 'jxgxcontent',
            colspan: 2,
            fieldLabel: '检修工序内容',
            width: 340
        }, {
            xtype: 'combo',
            id: 'jxteam',
            colspan: 2,
            store: teamStore123,
            queryMode: 'local',
            valueField: 'V_SAP_WORK',
            displayField: 'V_SAP_WORKNAME',
            fieldLabel: '检修工作中心',
            width: 340,
            matchFieldWidth: false,
            editable: false
        }, {
            xtype: 'numberfield',
            id: 'jxedsj',
            colspan: 2,
            fieldLabel: '检修额定时间',
            width: 340
        }, {
            xtype: 'textfield',
            id: 'jxper',
            fieldLabel: '检修工种',
            readOnly: true,
            width: 365
        }, {
            xtype: 'button',
            text: '+',
            handler: selectJXPER,
            margin: '0px 0px 0px 3px',
            width: 25,
        }, {
            xtype: 'textfield',
            id: 'jxcar',
            fieldLabel: '检修机具',
            readOnly: true,
            width: 365
        }, {
            xtype: 'button',
            text: '+',
            handler: selectJXCAR,
            margin: '0px 0px 0px 3px',
            //handler : selectGJJJ,
            width: 25,
        }, {
            xtype: 'textfield',
            id: 'jxtool',
            fieldLabel: '检修工具',
            readOnly: true,
            width: 365
        }, {
            xtype: 'button',
            text: '+',
            handler: selectJXTOOL,
            margin: '0px 0px 0px 3px',
            width: 25,
        }, {
            xtype: 'textfield',
            id: 'jxtechnologybz',
            fieldLabel: '检修技术标准',
            readOnly: true,
            width: 365
        }, {
            xtype: 'textfield',
            id: 'jxtechnologybzd',
            hidden: true,
            fieldLabel: '检修技术标准下',
            readOnly: true
        }, {
            xtype: 'textfield',
            id: 'jxtechnologybzu',
            hidden: true,
            fieldLabel: '检修技术标准上',
            readOnly: true
        }, {
            xtype: 'textfield',
            id: 'jxtecbzguid',
            hidden: true,
            fieldLabel: '检修技术标准guid',
            readOnly: true
        }, {
            xtype: 'button',
            text: '+',
            handler: selectJXTECHNOLOGYBZ,
            margin: '0px 0px 0px 3px',
            width: 25,
        }, {
            xtype: 'textfield',
            id: 'jxsafe',
            fieldLabel: '检修安全措施',
            readOnly: true,
            width: 365
        }, {
            xtype: 'button',
            text: '+',
            handler: selectJXSAFE,
            margin: '0px 0px 0px 3px',
            width: 25,
        }, {
            xtype: 'numberfield',
            id: 'order',
            colspan: 2,
            fieldLabel: '排序',
            width: 340
        }]
    });

    var procedureButtonWin = Ext.create('Ext.window.Window', {
        id: 'procedureButtonWin',
        width: 450,
        height: 500,
        title: '工序',
        modal: true,//弹出窗口时后面背景不可编辑
        frame: true,
        layout: 'fit',
        closeAction: 'hide',
        closable: true,
        items: [inputProcedurePanel],
        buttons: [{
            xtype: 'button',
            text: '保存',
            width: 40,
            handler: function () {
                save_btn();
            }
        }, {
            xtype: 'button',
            text: '关闭',
            width: 40,
            handler: function () {
                procedureButtonWin.close();
            }
        }]
    });

    //------模型附件窗口

    var toolbar = Ext.create("Ext.form.Panel", {
        id: 'toolbar',
        border: false,
        region: 'north',
        frame: true,
        height: 45,
        layout: 'column',
        defaults: {
            style: 'margin:5px 0px 5px 5px',
            labelAlign: 'right'
        },
        items: [{
            xtype: 'combobox',
            id: 'fjtype',
            store: ftypeStore,
            queryMode: 'local',
            fieldLabel: '附件类型',
            valueField: 'ID',
            displayField: 'FNAME',
            width: 260,
            labelAlign: 'right',
            labelWidth: 80,
            style: 'margin:5px 2px 5px 5px',
            listeners: {
                select: function () {
                    querymxfj(mx_code);
                }
            }
        },
            {
                xtype: 'filefield',
                id: 'upload',
                name: 'upload',
                fieldLabel: '文件上传',
                labelAlign: 'right',
                width: 300,
                msgTarget: 'side',
                allowBlank: true,
                anchor: '100%',
                buttonText: '浏览....',
                style: ' margin: 5px 0px 5px 8px'
            }, {
                xtype: 'button',
                width: 60,
                text: '上传',
                style: ' margin: 5px 0px 5px 10px',
                handler: _insertFile
            }, {
                xtype: 'button',
                text: '刷新',
                width: 60,
                style: ' margin: 5px 0px 5px 10px',
                listeners: {
                    click: function () {
                        querymxfj(mx_code);
                    }
                }
            }, {
                xtype: 'button',
                text: '删除',
                width: 60,
                style: ' margin: 5px 0px 5px 10px',
                listeners: {click: _OnButtonDel}
            }]
    });

    var mxfilegrid = Ext.create('Ext.grid.Panel', {
        id: 'mxfilegrid',
        width: '100%',
        height: 340,
        region: 'center',
        autoScroll: true,
        columnLines: true,
        store: mxfileStore,
        style: 'text-align:center;',
        selModel: { //指定单选还是多选,SINGLE为单选，SIMPLE为多选
            selType: 'checkboxmodel',
            mode: 'SIMPLE'
        },
        columns: [{xtype: 'rownumberer', text: '序号', width: 50, align: 'center'},
            {text: '文件编码', dataIndex: 'V_FILEGUID', align: 'center', width: 50, hidden: true},
            {text: '文件名称', dataIndex: 'V_FILENAME', align: 'center', width: 160},
            {
                text: '上传时间', dataIndex: 'V_INTIME', align: 'center', width: 150,
                renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                    return value.toString().substring(0, 10);
                }
            },
            {text: '附件类型', dataIndex: 'V_TYPE', align: 'center', width: 100},
            {text: '操作', dataIndex: 'V_FILEGUID', align: 'center', width: 150, renderer: operation}
        ]
    });
    var mxfilepanel = Ext.create('Ext.panel.Panel', {
        id: 'mxfilepanel',
        region: 'center',
        width: '100%',
        layout: 'border',
        height: '100%',
        items: [toolbar, mxfilegrid]
    });
    var mxfilewin = Ext.create('Ext.window.Window', {
        id: 'mxfilewin',
        width: 820,
        height: 360,
        title: '模型附件窗口',
        //modal: true,//弹出窗口时后面背景不可编辑
        frame: true,
        layout: 'fit',
        closeAction: 'hide',
        closable: true,
        items: [mxfilepanel]
    });
});

function atleft(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:left;";
    return '<div data-qtip="' + value + '" >' + value + '</div>';
}

// 根据厂矿进行作业区联动
function _selectDept() {
    var zyqStore = Ext.data.StoreManager.lookup('zyqStore');
    zyqStore.proxy.extraParams.V_V_DEPTCODE = Ext.getCmp('plant').getValue();
    zyqStore.load();
}

//根据作业区进行设备类型联动
function sblxload() {
    var sblxStore = Ext.data.StoreManager.lookup('sblxStore');
    sblxStore.proxy.extraParams.V_V_PERSONCODE = V_V_PERSONCODE;
    sblxStore.proxy.extraParams.V_V_DEPTCODENEXT = Ext.getCmp('dept').getValue();
    sblxStore.load();
}

// 选中设备类型查询检修模型窗口
function _queryjxmx() {
    var jxmxStore = Ext.data.StoreManager.lookup('jxmxStore');
    jxmxStore.proxy.extraParams = {
        V_V_ORGCODE: Ext.getCmp('plant').getValue(),
        V_V_DEPTCODE: Ext.getCmp('dept').getValue(),
        V_V_EQUTYPE: Ext.getCmp('sblx').getValue(),
        V_V_JXMX_NAME: '%',
        V_V_PAGE: Ext.getCmp('jxmxPanel_toolbar').store.currentPage,
        V_V_PAGESIZE: Ext.getCmp('jxmxPanel_toolbar').store.pageSize
    };
    jxmxStore.load();
    _querygx(null);
}

// 点击工序查询工具
function _querygj(V_JXGX_CODE) {
    var gjStore1 = Ext.data.StoreManager.lookup('gjStore1');
    gjStore1.removeAll();
    if (V_JXGX_CODE != null) {
        gjStore1.load({
            params: {
                V_V_JXGX_CODE: V_JXGX_CODE
            }
        });
    }
}

// 点击设备树item查询子设备检修技术标准
function _queryzsbjx(sid, V_EQUTYPECODE) {
    Ext.getCmp('zsbmc').setValue(null);
    var zsbjxStore = Ext.data.StoreManager.lookup('zsbjxStore');
    zsbjxStore.removeAll();
    if (sid != null) {
        zsbjxStore.load({
            params: {
                V_V_ORGCODE: Ext.getCmp('plant').getValue(),
                V_V_DEPTCODE: Ext.getCmp('dept').getValue(),
                V_V_EQUCODE: sid,
                V_V_EQUCHILDCODE: '%',
                V_V_EQUTYPECODE: V_EQUTYPECODE
            }
        });
    }
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
}


function _viewImage(V_V_GUID, V_V_FILEGUID) {
    var url = AppUrl + 'Wsy/BASE_FILE_IMAGE_SEL?V_V_GUID=' + V_V_GUID + '&V_V_FILEGUID=' + V_V_FILEGUID;
    Ext.getCmp('browseImage2').getEl().dom.src = url;
}


function _select() {
}

function _update() {
}

// 删除检修模型
function _deleteJXMX() {
    var records = Ext.getCmp('jxmxPanel').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个检修模型!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    Ext.MessageBox.show({
        title: '请确认',
        msg: '删除',
        buttons: Ext.MessageBox.YESNO,
        icon: Ext.MessageBox.QUESTION,
        fn: function (btn) {
            if (btn == 'yes') {
                for (var i = 0; i < records.length; i++) {
                    Ext.Ajax.request({
                        url: AppUrl + 'Wsy/BASE_JXMX_DATA_DEL',
                        type: 'ajax',
                        method: 'POST',
                        async: false,
                        params: {
                            'V_V_JXMX_CODE': records[i].get('V_MX_CODE')
                        },
                        success: function (response) {
                            var data = Ext.decode(response.responseText);
                            if (data.V_INFO != null && data.V_INFO == 'SUCCESS') {
                                Ext.Msg.alert('提示信息', '删除成功');
                            } else {
                                Ext.MessageBox.show({
                                    title: '错误',
                                    msg: '删除失败',
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
                }
                _queryjxmx();
            }
        }
    });

}

function _addProcedureWindow() {//新增工序
    var records = Ext.getCmp('jxmxPanel').getSelectionModel().getSelection();
    if (records.length != 1) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个检修模型',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }

    Ext.getCmp('jxgxbm').setValue(guid());
    Ext.getCmp('V_EQUTYPE').setValue(records[0].get('V_EQUTYPE'));
    Ext.getCmp('V_DEPTCODE').setValue(records[0].get('V_DEPTCODE'));
    Ext.getCmp('jxgxname').setValue('');
    Ext.getCmp('jxgxcontent').setValue('');
    Ext.getCmp('jxedsj').setValue(1);

    Ext.getCmp('jxper').setValue('');
    Ext.getCmp('jxcar').setValue('');
    Ext.getCmp('jxtool').setValue('');
    Ext.getCmp('jxsafe').setValue('');
    Ext.getCmp('jxtechnologybz').setValue('');
    Ext.getCmp('jxtechnologybzd').setValue('');
    Ext.getCmp('jxtechnologybzu').setValue('');
    Ext.getCmp('jxtecbzguid').setValue('');

    Ext.getCmp('order').setValue(1);
    flag = 1;
    Ext.getCmp('procedureButtonWin').show();
    sign = "IN";

}

function _editProcedureWindow() {//修改工序
    var records = Ext.getCmp('jxmxPanel').getSelectionModel().getSelection();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (jxgxPanel.length != 1) {
        alert('请选择一条数据进行修改！');
        return false;
    }

    Ext.getCmp('V_EQUTYPE').setValue(records[0].get('V_EQUTYPE'));
    Ext.getCmp('V_DEPTCODE').setValue(records[0].get('V_DEPTCODE'));
    Ext.getCmp('jxgxbm').setValue(jxgxPanel[0].data.V_JXGX_CODE);
    Ext.getCmp('jxgxname').setValue(jxgxPanel[0].data.V_JXGX_NAME);
    Ext.getCmp('jxgxcontent').setValue(jxgxPanel[0].data.V_JXGX_NR);
    Ext.getCmp('jxteam').setValue(jxgxPanel[0].data.V_GZZX_CODE);
    Ext.getCmp('jxedsj').setValue(jxgxPanel[0].data.V_PERTIME);

    Ext.getCmp('jxtechnologybz').setValue(jxgxPanel[0].data.V_JXBZ_VALUE_DOWN + '~' + jxgxPanel[0].data.V_JXBZ_VALUE_UP);
    Ext.getCmp('jxtechnologybzd').setValue(jxgxPanel[0].data.V_JXBZ_VALUE_DOWN);
    Ext.getCmp('jxtechnologybzu').setValue(jxgxPanel[0].data.V_JXBZ_VALUE_UP);
    Ext.getCmp('jxtecbzguid').setValue(jxgxPanel[0].data.V_JXBZ);
    Ext.getCmp('order').setValue(jxgxPanel[0].data.V_ORDER);

    Ext.Ajax.request({
        url: AppUrl + 'pm_19/PM_1917_JXGX_BYCODE_SEL',
        method: 'POST',
        async: false,
        params: {
            V_V_JXGX_CODE: jxgxPanel[0].data.V_JXGX_CODE
        },
        success: function (ret) {
            var resp = Ext.JSON.decode(ret.responseText);
            Ext.getCmp('jxcar').setValue(resp.list[0].V_JJ_NAME);
            Ext.getCmp('jxper').setValue(resp.list[0].V_PER_NAME);
            Ext.getCmp('jxtool').setValue(resp.list[0].V_GJ_NAME);
            Ext.getCmp('jxsafe').setValue(resp.list[0].V_AQSC_NAME);
        }
    });


    flag = 0;
    sign = "UPDATE";
    Ext.getCmp('procedureButtonWin').show();

}

function _deleteProcedure() {//删除工序
    var jxmxPanel = Ext.getCmp('jxmxPanel').getSelectionModel().getSelection();
    var jxgxPanel = Ext.getCmp('jxgxPanel').getSelectionModel().getSelection();
    if (jxgxPanel.length == 0) {
        alert('请至少选择一条数据进行删除！');
        return false;
    }//对所选进行排查，至少选择一个
    Ext.MessageBox.show({
        title: '请确认',
        msg: '删除',
        buttons: Ext.MessageBox.YESNO,
        icon: Ext.MessageBox.QUESTION,
        fn: function (btn) {
            if (btn == 'yes') {
                for (var i = 0; i < jxgxPanel.length; i++) {
                    Ext.Ajax.request({
                        url: AppUrl + 'pm_19/PM_1917_JXGX_DATA_DEL',
                        method: 'POST',
                        async: true,
                        params: {
                            V_V_JXGX_CODE: jxgxPanel[i].data.V_JXGX_CODE
                        },
                        success: function (ret) {
                            var resp = Ext.JSON.decode(ret.responseText);

                        }
                    });
                }
                _querygx(jxmxPanel[0].data.V_MX_CODE);
                pageFunction.QueryGanttData();
            }
        }
    });

}

function _open() {
    Ext.getCmp('window').show();
}


// 打开新增窗口
function _openmanageWindow() {
    //var selectedNode = null;
    // selectedNode = Ext.getCmp('sblxTreePanel').getSelectionModel().selected.items[0]; // 获取当前节点
    Ext.getCmp('editPanel').getForm().reset();
    Ext.getCmp('WIN_ORGCODE').setValue(Ext.getCmp('plant').getValue());
    _selectDeptWin();
    Ext.getCmp('WIN_DEPTCODE').setValue(Ext.getCmp('dept').getValue());
    _selectEquType();
    // if (selectedNode != null) {
    //     if (selectedNode.data.depth == 2) {
    //         Ext.getCmp('WIN_EQUTYPECODE').setValue(selectedNode.data.sid);
    //         _selectEquName();
    //     }
    //     if (selectedNode.data.depth == 3) {
    //         var selectedParentNode = selectedNode.parentNode; // 获取该节点的父节点
    //         Ext.getCmp('WIN_EQUTYPECODE').setValue(selectedParentNode.data.sid);
    //         _selectEquName();
    //         Ext.getCmp('WIN_EQUCODE').setValue(selectedNode.data.sid);
    //         _selectSubEquName();
    //     }
    //     if (selectedNode.data.depth == 4) {
    //         var selectedParentNode = selectedNode.parentNode; // 获取该节点的父节点
    //         var selectedGrandParentNode = selectedParentNode.parentNode; // 获取该节点的爷节点
    //         Ext.getCmp('WIN_EQUTYPECODE').setValue(selectedGrandParentNode.data.sid);
    //         _selectEquName();
    //         Ext.getCmp('WIN_EQUCODE').setValue(selectedParentNode.data.sid);
    //         _selectSubEquName();
    //     }
    // }
    Ext.getCmp('WIN_JXMX_CODE').setValue(Ext.data.IdGenerator.get('uuid').generate());
    Ext.getCmp('WIN_IN_PER').hide();
    Ext.getCmp('WIN_IN_DATE').hide();
    Ext.getCmp('editWindow').show();
}

// 打开编辑窗口
function _openUpdateWindow() {
    var records = Ext.getCmp('jxmxPanel').getSelectionModel().getSelection();
    if (records.length != 1) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个检修模型',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    Ext.getCmp('editPanel').getForm().reset();
    Ext.getCmp('WIN_ORGCODE').setValue(records[0].data.V_ORGCODE);
    _selectDeptWin();
    Ext.getCmp('WIN_DEPTCODE').setValue(records[0].data.V_DEPTCODE);
    _selectEquType();
    Ext.getCmp('WIN_EQUTYPECODE').setValue(records[0].data.V_EQUTYPE);
    Ext.getCmp('WIN_JXMX_CODE').setValue(records[0].data.V_MX_CODE);
    Ext.getCmp('WIN_JXMX_NAME').setValue(records[0].data.V_MX_NAME);
    Ext.getCmp('WIN_BZ').setValue(records[0].data.V_BZ);
    Ext.getCmp('WIN_IN_PER').setValue(records[0].data.V_IN_PER);
    Ext.getCmp('WIN_IN_DATE').setValue(records[0].data.V_IN_DATE);
    Ext.getCmp('WIN_MXBB_NUM').setValue(records[0].data.V_MXBB_NUM);
    Ext.getCmp('WIN_IN_PER').show();
    Ext.getCmp('WIN_IN_DATE').show();
    Ext.getCmp('editWindow').show();
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

// 编辑弹窗的保存
function _save() {
    Ext.Ajax.request({
        url: AppUrl + 'hp/HP_BASE_JXMX_DATA_EDIT',
        method: 'POST',
        async: false,
        params: {
            V_V_JXMX_CODE: Ext.getCmp('WIN_JXMX_CODE').getValue(),
            V_V_JXMX_NAME: Ext.getCmp('WIN_JXMX_NAME').getValue(),
            V_V_ORGCODE: Ext.getCmp('WIN_ORGCODE').getValue(),
            V_V_DEPTCODE: Ext.getCmp('WIN_DEPTCODE').getValue(),
            V_V_EQUTYPECODE: Ext.getCmp('WIN_EQUTYPECODE').getValue(),
            V_V_REPAIRMAJOR_CODE: '',
            V_V_BZ: Ext.getCmp('WIN_BZ').getValue(),
            V_V_HOUR: '',
            V_V_IN_PER: Ext.util.Cookies.get('v_personname2'),
            V_V_IN_DATE: Ext.util.Format.date(new Date(), 'Y-m-d'),
            V_V_MXBB_NUM: Ext.getCmp('WIN_MXBB_NUM').getValue()
        },
        success: function (resp) {
            resp = Ext.decode(resp.responseText);
            if (resp.V_INFO != null && resp.V_INFO == 'SUCCESS') {
                Ext.Msg.alert("信息", "成功！");
            } else {
                Ext.Msg.alert("信息", "失败！");
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
    _queryjxmx();
    var ganttStore123 = Ext.data.StoreManager.lookup('ganttStore123');
    ganttStore123.removeAll();
    Ext.getCmp('editWindow').close();
}

function save_btn() {
    var jxmxPanel = Ext.getCmp('jxmxPanel').getSelectionModel().getSelection();

    Ext.Ajax.request({
        url: AppUrl + 'pm_19/PM_1917_JXGX_DATA_SETNEW',
        method: 'POST',
        async: false,
        params: {
            V_V_JXGX_CODE: Ext.getCmp('jxgxbm').getValue(),
            V_V_JXGX_NAME: Ext.getCmp('jxgxname').getValue(),
            V_V_JXGX_NR: Ext.getCmp('jxgxcontent').getValue(),
            V_V_GZZX_CODE: Ext.getCmp('jxteam').getValue(),
            V_V_JXMX_CODE: jxmxPanel[0].data.V_MX_CODE,
            V_V_ORDER: Ext.getCmp('order').getValue(),
            V_V_PERNUM: '',
            V_V_PERTIME: Ext.getCmp('jxedsj').getValue(),
            V_V_JXBZ: Ext.getCmp('jxtecbzguid').getValue(),
            V_V_JXBZ_VALUE_DOWN: Ext.getCmp('jxtechnologybzd').getValue(),
            V_V_JXBZ_VALUE_UP: Ext.getCmp('jxtechnologybzu').getValue(),
        },
        success: function (ret) {
            var resp = Ext.JSON.decode(ret.responseText);
            Ext.getCmp('procedureButtonWin').hide();
            _querygx(jxmxPanel[0].data.V_MX_CODE);
            pageFunction.QueryGanttData();
        }
    });
}

// 附件下载
function _downloadAttach(V_GUID) {// 导出
    var url = AppUrl + 'Wsy/downloadAttachment?V_V_GUID=' + V_GUID;
    location.href = url;
}

function _procedualDetail() {
    var jxmxPanel = Ext.getCmp('jxmxPanel').getSelectionModel().getSelection();
    if (jxmxPanel.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一个模型!',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return;
    }
    var owidth = window.document.body.offsetWidth;
    var oheight = window.document.body.offsetHeight;
    if (jxmxPanel[0].data.V_MX_CODE != null) {
        window.open(AppUrl + 'page/PM_1917/indexDetailNew.html?V_JXMX_CODE=' + jxmxPanel[0].data.V_MX_CODE + '&V_V_ORGCODE=' + Ext.getCmp('plant').getValue() + '&V_V_DEPTCODE=' + Ext.getCmp('dept').getValue(), '&random=' + Math.random(), '', 'height=' + oheight + ',width=' + owidth + ',top=10px,left=10px,resizable=yes');
    }
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
        //console.log(endtime);
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
        var records = Ext.getCmp('jxmxPanel').getSelectionModel().getSelection();
        Ext.Ajax.request({
            url: AppUrl + 'Wsy/PM_1917_JXGX_DATA_SEL',
            method: 'POST',
            async: false,
            params: {
                V_V_JXMX_CODE: records[0].data.V_MX_CODE
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
        if (record.data.VSTART != null && record.data.VEND != null) {
            startd = record.data.VSTART;
            endd = record.data.VEND;
        }
        var vleft = startd;
        var vwidth = endd - startd;

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
};

/*添加检修模型附件*/
function _addmxfile() {

    var jxmxPanel = Ext.getCmp('jxmxPanel').getSelectionModel().getSelection();
    var length = jxmxPanel.length;
    if (length != 1) {
        alert('请选择一条检修模型数据');
    } else {
        mx_code = jxmxPanel[0].data.V_MX_CODE;
        querymxfj(mx_code);
        Ext.getCmp("mxfilewin").show();
    }
}

function querymxfj(mx_code) {
    Ext.data.StoreManager.lookup('mxfileStore').load({
        params: {
            V_V_MODE_GUID: mx_code,
            V_V_TYPE: Ext.getCmp('fjtype').getValue()
        }
    });

}

function _OnButtonDel() {
    var records = Ext.getCmp('mxfilegrid').getSelectionModel().getSelection();
    if (records.length == 0) {
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一条数据',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return false;
    }
    Ext.MessageBox.show({
        title: '确认',
        msg: '你确定要删除么？',
        buttons: Ext.MessageBox.YESNO,
        icon: Ext.MessageBox.WARNING,
        fn: function (btn) {
            if (btn == 'yes') {
                var err = 0;
                for (var i = 0; i < records.length; i++) {
                    Ext.Ajax.request({
                        url: AppUrl + 'dxfile/PM_MODEL_FILE_DEL',
                        type: 'ajax',
                        mehtod: 'POST',
                        params: {
                            V_V_FILEGUID: records[i].get('V_FILEGUID')
                        },
                        success: function (resp) {
                            err++;
                            if (err == records.length) {
                                querymxfj(mx_code);
                            }
                        }
                    });
                }
            }
        }
    });
}

function operation(value, metaData, record, store) {
    metaData.style = "text-align:center";
    return '<a href="javascript:delfile(\'' + value + '\')">' + "下载" + '</a>';
}

function delfile(value) {
    window.location.href = AppUrl + 'dxfile/PM_MODEL_FILE_DOWN?V_V_FILEGUID=' + value;
}

function selectJXPER() {
    var owidth = window.document.body.offsetWidth - 200;
    var oheight = window.document.body.offsetHeight - 100;
    var ret = window.open(AppUrl + 'page/PM_191706/index.html?V_V_JXGX_CODE=' + Ext.getCmp('jxgxbm').getValue(), '', 'height=' + oheight + ',width=' + owidth + ',top=100px,left=100px,resizable=yes');
}

//回调函数,不能删
function getReturnJXPER(data) {
    var ss = "";
    for (var i = 0; i < data.length; i++) {
        ss += data[i];
    }
    Ext.getCmp('jxper').setValue(ss);
}

function selectJXCAR() {
    var owidth = window.document.body.offsetWidth - 200;
    var oheight = window.document.body.offsetHeight - 100;
    var ret = window.open(AppUrl + 'page/PM_191704/index.html?V_V_JXGX_CODE=' + Ext.getCmp('jxgxbm').getValue() + '&V_EQUTYPE=' + Ext.getCmp('V_EQUTYPE').getValue(), '', 'height=' + oheight + ',width=' + owidth + ',top=100px,left=100px,resizable=yes');
}

//回调函数,不能删
function getReturnJXCAR(data) {
    var ss = "";
    for (var i = 0; i < data.length; i++) {
        ss += data[i];
    }
    Ext.getCmp('jxcar').setValue(ss);
}

function selectJXTOOL() {
    var owidth = window.document.body.offsetWidth - 200;
    var oheight = window.document.body.offsetHeight - 100;
    var ret = window.open(AppUrl + 'page/PM_191705/index.html?V_V_JXGX_CODE=' + Ext.getCmp('jxgxbm').getValue()
        + '&V_EQUTYPE=' + Ext.getCmp('V_EQUTYPE').getValue(), '', 'height=' + oheight + ',width=' + owidth + ',top=100px,left=100px,resizable=yes');
}

//回调函数,不能删
function getReturnJXTOOL(data) {
    var ss = "";
    for (var i = 0; i < data.length; i++) {
        ss += data[i];
    }
    Ext.getCmp('jxtool').setValue(ss);
}

function selectJXTECHNOLOGYBZ() {
    var owidth = window.document.body.offsetWidth - 200;
    var oheight = window.document.body.offsetHeight - 100;
    var ret = window.open(AppUrl + 'page/PM_191713/index.html?V_V_DEPTCODE=' + Ext.getCmp('V_DEPTCODE').getValue()
        + '&V_V_EQUTYPECODE=' + Ext.getCmp('V_EQUTYPE').getValue()
        + '&V_V_ORGCODE=' + Ext.getCmp('plant').getValue(), '', 'height=' + oheight + ',width=' + owidth + ',top=100px,left=100px,resizable=yes');
}

//回调函数,不能删
function getReturnJSBZ(guid, valued, valueu) {
    Ext.getCmp('jxtechnologybz').setValue(valued + '~' + valueu);
    Ext.getCmp('jxtechnologybzd').setValue(valued);
    Ext.getCmp('jxtechnologybzu').setValue(valueu);
    Ext.getCmp('jxtecbzguid').setValue(guid);
}

function selectJXSAFE() {
    var owidth = window.document.body.offsetWidth - 200;
    var oheight = window.document.body.offsetHeight - 100;
    var ret = window.open(AppUrl + 'page/PM_191709/index.html?V_V_JXGX_CODE=' + Ext.getCmp('jxgxbm').getValue() + '&V_EQUTYPE=' + Ext.getCmp('V_EQUTYPE').getValue(), '', 'height=' + oheight + ',width=' + owidth + ',top=100px,left=100px,resizable=yes');
}

//回调函数,不能删
function getReturnJXSAFE(code, data) {
    var ss = "";
    // for(var j=0;j<code.length;j++){
    //     aqcsCodeList.push(code[j]);
    // }
    for (var i = 0; i < data.length; i++) {
        ss += data[i];
    }
    Ext.getCmp('jxsafe').setValue(ss);
}

function _insertFile() {
    if (Ext.getCmp('fjtype').getValue() == "%") {
        {
            Ext.Msg.alert('提示信息', '请选择上传附件类型');
            return
        }
    }
    if (Ext.getCmp('upload').getValue() == '' || Ext.getCmp('upload').getValue() == null || Ext.getCmp('upload').getValue() == undefined) {
        Ext.Msg.alert('提示信息', '请选择要的上传文件');
        return;
    } else {
        Ext.getCmp('toolbar').getForm().submit({
            url: AppUrl + 'dxfile/PM_MODEL_FILE_ADD',
            submitEmptyText: false,
            params: {
                V_V_MODE_GUID: mx_code,
                V_V_INPERCODE: Ext.util.Cookies.get('v_personcode'),
                V_V_INPERNAME: Ext.util.Cookies.get('v_personname2'),
                V_V_TYPE: Ext.getCmp('fjtype').getValue()
            },
            success: function (form, action) {
                querymxfj(mx_code);
            },
            failure: function (form, action) {
                alert('错误')
            }
        });
    }
}

function guid2() {
    function S6() {
        return (((1 + Math.random()) * 0x10002) | 0).toString(16).substring(1);
    }

    return (S6() + S6() + "-" + S6() + "-" + S6() + "-" + S6() + "-" + S6() + S6() + S6());
}