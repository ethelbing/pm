var plantStoreLoad = false;
var PLANTCODE_IN = '';
var DEPARTCODE_IN = '';
var DJCODE_IN = '';
var DJNAME_IN = '';
var JXPLANTCODE_IN = '';
var RECFLAG_IN = '';
var BEGINDATE_IN = '';
var ENDDATE_IN = '';

Ext.onReady(function () {
    Ext.getBody().mask('<p>正在载入中...</p>');

    //厂矿
    var plantStore = Ext.create('Ext.data.Store', {
        id: 'plantStore',
        autoLoad: true,
        fields: ['V_DEPTCODE', 'V_DEPTNAME'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'PM_12/PRO_BASE_DEPT_VIEW',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            },
            extraParams: {
                IS_V_DEPTCODE: "",
                IS_V_DEPTTYPE: '[基层单位]'
            }
        },
        listeners: {
            load: function (store, records) {
                plantStoreLoad = true;
                Ext.getCmp('PLANTCODE_IN').select(store.first());
                _init();
            }
        }

    });

    //作业区
    var deptStore = Ext.create('Ext.data.Store', {
        id: 'deptStore',
        autoLoad: false,
        fields: ['V_DEPTCODE', 'V_DEPTNAME'],
        proxy: {
            type: 'ajax',
            url: AppUrl + 'PM_12/PRO_BASE_DEPT_VIEW',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            },
            extraParams: {}
        },
        listeners: {
            load: function (store, records) {
                Ext.getCmp('DEPARTCODE_IN').select(store.first());
            }
        }

    });

    //检修工单查询
    var applyListStore = Ext.create("Ext.data.Store", {
        storeId: 'applyListStore',
        autoLoad: false,
        pageSize: 200,
        fields: ['APPLY_ID', 'ORDERID', 'DJ_UQ_CODE', 'DJ_NAME', 'APPLY_PLANT', 'APPLY_PLANTNAME', 'APPLY_DEPART',
            'APPLY_DEPARTNAME', 'MEND_CONTEXT', 'PLAN_BEGINDATE', 'PLAN_ENDDATE', 'INSERTDATE', 'INSERT_USERID',
            'INSERT_USERNAME', 'REC_FLAG', 'REC_PLANT', 'REC_DEPART', 'REC_USERID', 'REC_USERNAME', 'REMARK', 'FLAG',
            'ORDER_FLAG', 'MEND_CODE', 'DJ_SERIES_CLASS', 'DJ_VOL', 'MEND_TYPE'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'mwd/PRO_DJ501_SELECTAPPLYLIST_USER',
            actionMethods: {
                read: 'POST'
            },
            extraParams: {},
            reader: {
                type: 'json',
                root: 'RET',
                total: 'total'
            }
        }

    });

    var tablePanel = Ext.create('Ext.panel.Panel', {
        id: 'tablePanel',
        region: 'north',
        layout: 'vbox',
        frame: true,
        items: [{
            xtype: 'panel',
            region: 'north',
            layout: 'column',
            baseCls: 'my-panel-no-border',
            items: [{
                id: 'PLANTCODE_IN',
                xtype: 'combo',
                store: plantStore,
                editable: false,
                fieldLabel: '申请厂矿',
                labelWidth: 80,
                width: 220,
                displayField: 'V_DEPTNAME',
                valueField: 'V_DEPTCODE',
                queryMode: 'local',
                style: ' margin: 5px 0px 5px 0px',
                labelAlign: 'right',
                listeners: {
                    change: function (field, newValue, oldValue) {
                        _selectDept();
                    }
                }
            }, {
                id: 'DEPARTCODE_IN',
                xtype: 'combo',
                store: deptStore,
                fieldLabel: '申请部门',
                labelWidth: 80,
                width: 220,
                displayField: 'V_DEPTNAME',
                valueField: 'V_DEPTCODE',
                queryMode: 'local',
                style: ' margin: 5px 0px 5px 0px',
                labelAlign: 'right'
            }, {
                xtype: 'textfield',
                id: 'DJCODE_IN',
                fieldLabel: '电机编号',
                labelWidth: 80,
                width: 220,
                style: ' margin: 5px 0px 5px 0px',
                labelAlign: 'right'
            }]
        }, {
            xtype: 'panel',
            region: 'north',
            layout: 'column',
            baseCls: 'my-panel-no-border',
            items: [{
                xtype: 'textfield',
                id: 'DJNAME_IN',
                fieldLabel: '电机名称',
                labelWidth: 80,
                width: 220,
                style: ' margin: 5px 0px 5px 0px',
                labelAlign: 'right'
            }, {
                id: 'JXPLANTCODE_IN',
                xtype: 'combo',
                store: [[Ext.util.Cookies.get("v_orgCode"),
                    Ext.util.Cookies.get("v_orgname2")]],
                fieldLabel: '检修厂矿',
                labelWidth: 80,
                width: 220,
                value: Ext.util.Cookies.get("v_orgCode"),
                displayField: 'v_orgname2',
                valueField: 'v_orgCode',
                style: ' margin: 5px 0px 5px 0px',
                labelAlign: 'right'
            }, {
                id: 'RECFLAG_IN',
                xtype: 'combo',
                store: [[0, "未接收"], [1, "已接收"]],
                fieldLabel: '接收状态',
                labelWidth: 80,
                width: 220,
                value: 0,
                displayField: 'RECFLAG_DESC',
                valueField: 'RECFLAG_CODE',
                style: ' margin: 5px 0px 5px 0px',
                labelAlign: 'right'
            }]
        }, {
            xtype: 'panel',
            region: 'north',
            layout: 'column',
            baseCls: 'my-panel-no-border',
            items: [{
                id: 'BEGINDATE_IN',
                xtype: 'datefield',
                editable: false,
                format: 'Y-m-d',
                submitFormat: 'Y-m-d',
                value: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
                fieldLabel: '起始日期',
                labelWidth: 80,
                width: 220,
                style: ' margin: 5px 0px 5px 0px',
                labelAlign: 'right'
            }, {
                id: 'ENDDATE_IN',
                xtype: 'datefield',
                editable: false,
                format: 'Y-m-d',
                submitFormat: 'Y-m-d',
                value: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
                fieldLabel: '结束日期',
                labelWidth: 80,
                width: 220,
                style: ' margin: 5px 0px 5px 0px',
                labelAlign: 'right'
            }, {
                xtype: 'button',
                text: '查询',
                style: ' margin: 5px 0px 5px 30px',
                icon: imgpath + '/search.png',
                handler: _selectApply
            }, {
                xtype: 'button',
                text: '导出Excel',
                handler: _exportExcel,
                style: ' margin: 5px 0px 5px 5px',
                icon: imgpath + '/excel.gif'
            }]
        }]
    });

    var applyGridPanel = Ext.create('Ext.grid.Panel', {
        id: 'applyGridPanel',
        store: applyListStore,
        width: '100%',
        border: false,
        columnLines: true,
        selModel: {
            selType: 'checkboxmodel',
            mode: 'SINPLE'
        },
        plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToEdit: 1
        })],
        columns: [{
            text: '申请工单号',
            dataIndex: 'ORDERID',
            align: 'center',
            flex: 1,
            renderer: atleft
        }, {
            text: '电机编号',
            dataIndex: 'DJ_UQ_CODE',
            align: 'center',
            flex: 1,
            renderer: atleft
        }, {
            text: '电机名称',
            dataIndex: 'DJ_NAME',
            align: 'center',
            flex: 1,
            renderer: atleft
        }, {
            text: '维修内容',
            dataIndex: 'MEND_CONTEXT',
            align: 'center',
            flex: 1,
            renderer: atleft
        }, {
            text: '申请厂矿',
            dataIndex: 'APPLY_PLANTNAME',
            align: 'center',
            flex: 1,
            renderer: atleft
        }, {
            text: '申请部门',
            dataIndex: 'APPLY_DEPARTNAME',
            align: 'center',
            flex: 1,
            renderer: atleft
        }, {
            text: '录入时间',
            dataIndex: 'INSERTDATE',
            align: 'center',
            flex: 1,
            renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                return Ext.util.Format.date(new Date(value), 'Y-m-d');
            }
        }, {
            text: '备注',
            dataIndex: 'REMARK',
            align: 'center',
            flex: 1,
            renderer: atleft
        }, {
            text: '详细信息',
            align: 'center',
            flex: 1,
            renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                return '<a href=javascript:dealWith(\'</a><a href="#" onclick="_viewDetail(\'' + record.data.APPLY_ID + '\',\'' + record.data.CLIENTNAME + '\')">' + '查看' + '</a>';
            }
        }],
        dockedItems: [{
            xtype: 'pagingtoolbar',
            store: applyListStore,
            dock: 'bottom',
            displayInfo: true
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
        items: [{
            region: 'north',
            border: false,
            items: [tablePanel]
        }, {
            region: 'center',
            layout: 'fit',
            border: false,
            items: [applyGridPanel]
        }]

    });

    _init();
});

//初始化
function _init() {
    if (plantStoreLoad) {

        Ext.getBody().unmask();//去除页面笼罩
    }
}

//查询作业区
function _selectDept() {
    var deptStore = Ext.data.StoreManager.lookup('deptStore');
    deptStore.proxy.extraParams = {
        'IS_V_DEPTCODE': Ext.getCmp('PLANTCODE_IN').getValue(),
        'IS_V_DEPTTYPE': '[主体作业区]'

    };
    deptStore.load();
}

function _selectApply() {
    PLANTCODE_IN = Ext.getCmp('PLANTCODE_IN').getSubmitValue();
    DEPARTCODE_IN = Ext.getCmp('DEPARTCODE_IN').getSubmitValue();
    DJCODE_IN = Ext.getCmp('DJCODE_IN').getSubmitValue();
    DJNAME_IN = Ext.getCmp('DJNAME_IN').getSubmitValue();
    JXPLANTCODE_IN = Ext.getCmp('JXPLANTCODE_IN').getSubmitValue();
    RECFLAG_IN = Ext.getCmp('RECFLAG_IN').getValue();
    BEGINDATE_IN = Ext.getCmp('BEGINDATE_IN').getSubmitValue();
    ENDDATE_IN = Ext.getCmp('ENDDATE_IN').getSubmitValue();

    var applyListStore = Ext.data.StoreManager.lookup('applyListStore');
    applyListStore.proxy.extraParams = {
        PLANTCODE_IN: PLANTCODE_IN,
        DEPARTCODE_IN: DEPARTCODE_IN,
        DJCODE_IN: DJCODE_IN,
        DJNAME_IN: DJNAME_IN,
        JXPLANTCODE_IN: JXPLANTCODE_IN,
        RECFLAG_IN: RECFLAG_IN,
        BEGINDATE_IN: BEGINDATE_IN,
        ENDDATE_IN: ENDDATE_IN
    };
    applyListStore.load();
}

function _viewDetail(APPLY_ID) {
    window.open(AppUrl + 'page/PM_1501040201/index.html?APPLY_ID=' + APPLY_ID, '', 'height=600px,width=800px,top=50px,left=100px,resizable=yes');
}

//导出Excel
function _exportExcel() {
    document.location.href = AppUrl + 'mwd/PRO_DJ501_SELECTAPPLYLIST_USER_EXCEL?PLANTCODE_IN=' + PLANTCODE_IN +
    '&DEPARTCODE_IN=' + DEPARTCODE_IN + '&DJCODE_IN=' + encodeURI(encodeURI(DJCODE_IN)) + '&DJNAME_IN=' + encodeURI(encodeURI(DJNAME_IN)) +
    '&JXPLANTCODE_IN=' + JXPLANTCODE_IN + '&RECFLAG_IN=' + RECFLAG_IN + '&BEGINDATE_IN=' + BEGINDATE_IN + '&ENDDATE_IN=' + ENDDATE_IN;
}

function atleft(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:left;";
    return '<div data-qtip="' + value + '" >' + value + '</div>';
}

function atright(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:right;";
    return value;
}
