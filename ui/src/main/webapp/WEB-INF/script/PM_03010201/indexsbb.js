var date = new Date();
var V_MONTHPLAN_GUID = '';
var processKey = '';
var V_STEPNAME = '';
var V_NEXT_SETP = '';
//年份
var years = [];
for (var i = date.getFullYear() - 4; i <= date.getFullYear() + 1; i++) {
    years.push({displayField: i, valueField: i});
}
var yearStore = Ext.create("Ext.data.Store", {
    storeId: 'yearStore',
    fields: ['displayField', 'valueField'],
    data: years,
    proxy: {
        type: 'memory',
        reader: {type: 'json'}
    }
});
//月份
var months = [];
for (var i = 1; i <= 12; i++) {
    months.push({displayField: i, valueField: i});
}
var monthStore = Ext.create("Ext.data.Store", {
    storeId: 'monthStore',
    fields: ['displayField', 'valueField'],
    data: months,
    proxy: {
        type: 'memory',
        reader: {type: 'json'}
    }
});
//小时
var hours = [];
for (var i = 0; i < 24; i++) {
    if (i < 10) {
        i = '0' + i;
    } else {
        i = '' + i;
    }
    hours.push({displayField: i, valueField: i});
}
var hourStore = Ext.create("Ext.data.Store", {
    storeId: 'hourStore',
    fields: ['displayField', 'valueField'],
    data: hours,
    proxy: {
        type: 'memory',
        reader: {type: 'json'}
    }
});

//分钟
var minutes = [];
for (var i = 0; i < 60; i++) {
    if (i < 10) {
        i = '0' + i;
    } else {
        i = '' + i;
    }
    minutes.push({displayField: i, valueField: i});
}
var minuteStore = Ext.create("Ext.data.Store", {
    storeId: 'minuteStore',
    fields: ['displayField', 'valueField'],
    data: minutes,
    proxy: {
        type: 'memory',
        reader: {type: 'json'}
    }
});

Ext.define('Ext.grid.column.LineBreakColumn', {
    extend: 'Ext.grid.column.Column',
    alias: 'widget.linebreakcolumn',
    initComponent: function () {
        var me = this,
            // 定义customerRenderer变量，保存用户配置的renderer
            customerRenderer = me.renderer;
        if (customerRenderer) {
            // 如果用户配置了renderer，则限制性用户配置的renderer，然后执行默认的内容换行renderer
            me.renderer = function (value, metadata, record, rowIndex, columnIndex, store) {
                value = customerRenderer(value, metadata, record, rowIndex, columnIndex, store);
                value = me.defaultRenderer(value, metadata, record, rowIndex, columnIndex, store);
                return value;
            };
        }
        me.callParent(arguments);
    },
    defaultRenderer: function (value, metadata, record, rowIndex, columnIndex, store) {
        metadata.style = 'white-space: normal; overflow: visible; word-break: break-all;';
        return value;
    }
});
//计划厂矿
var jhckStore = Ext.create('Ext.data.Store', {
    autoLoad: true,
    storeId: 'jhckStore',
    fields: ['V_DEPTCODE', 'V_DEPTNAME'],
    proxy: {
        type: 'ajax',
        async: false,
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

//作业区
var jhzyqStore = Ext.create('Ext.data.Store', {
    autoLoad: false,
    storeId: 'jhzyqStore',
    fields: ['V_DEPTCODE', 'V_DEPTNAME'],
    proxy: {
        type: 'ajax',
        async: false,
        url: AppUrl + 'PM_06/PRO_BASE_DEPT_VIEW_ROLE',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'list'
        }
    }
});
//
var nextSprStore = Ext.create("Ext.data.Store", {
    autoLoad: false,
    storeId: 'nextSprStore',
    fields: ['V_PERSONCODE', 'V_PERSONNAME', 'V_V_NEXT_SETP', 'V_V_FLOW_STEPNAME'],
    proxy: {
        type: 'ajax',
        async: false,
        url: AppUrl + 'dxfile/PM_ACTIVITI_PROCESS_PER_SELSBB',
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
        load: function (store, records, success, eOpts) {
            processKey = store.getProxy().getReader().rawData.RET;
            if(store.getAt(0)==undefined){
                V_STEPNAME="";
                V_NEXT_SETP="";
                return;
            }else{
                V_STEPNAME = store.getAt(0).data.V_V_FLOW_STEPNAME;
                V_NEXT_SETP = store.getAt(0).data.V_V_NEXT_SETP;
                // Ext.getCmp('nextPer').select(store.first());
            }
            // Ext.getCmp('nextPer').select(store.first());
        }
    }
});

//专业
var zyStore = Ext.create('Ext.data.Store', {
    autoLoad: false,
    storeId: 'zyStore',
    fields: ['V_SPECIALTYCODE', 'V_BASENAME'],
    proxy: {
        type: 'ajax',
        async: false,
        url: AppUrl + 'basic/PRO_BASE_SPECIALTY_DEPT_SPECIN',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'list'
        }
    }
});
//设备类型
var sblxStore = Ext.create('Ext.data.Store', {
    autoLoad: false,
    storeId: 'sblxStore',
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
    }
});
//设备名称
var sbmcStore = Ext.create('Ext.data.Store', {
    autoLoad: false,
    storeId: 'sbmcStore',
    fields: ['V_EQUCODE', 'V_EQUNAME'],
    proxy: {
        type: 'ajax',
        async: false,
        url: AppUrl + 'PM_06/pro_get_deptequ_per',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'list'
        }
    }
});
var statList=[];
statList.push({V_BASECODE:'%',V_BASENAME:'全部'});
statList.push({V_BASECODE:30,V_BASENAME:'审批完成'});
statList.push({V_BASECODE:70,V_BASENAME:'设备部审批中'});
statList.push({V_BASECODE:80,V_BASENAME:'设备部审批完成'});
statList.push({V_BASECODE:90,V_BASENAME:'已分解'});
//状态
var stateStore = Ext.create('Ext.data.Store', {
    autoLoad: true,
    storeId: 'stateStore',
    fields: ['V_BASECODE', 'V_BASENAME'],
    data:statList,
    proxy: {
        type: 'memory',
        reader: {type: 'json'}
    }
    // proxy: {
    //     type: 'ajax',
    //     async: false,
    //     url: AppUrl + 'PM_03/PM_03_PLAN_STATE_SEL',
    //     actionMethods: {
    //         read: 'POST'
    //     },
    //     reader: {
    //         type: 'json',
    //         root: 'list'
    //     }
    // }
});

//页面表格信息加载
var gridStore = Ext.create('Ext.data.Store', {
    id: 'gridStore',
    pageSize: 15,
    autoLoad: false,
    fields: ['I_ID',
        'V_GUID',
        'V_MONTHPLAN_GUID',
        'V_YEAR',
        'V_MONTH',
        'V_ORGCODE',                          //厂矿
        'V_ORGNAME',
        'V_DEPTCODE',                         //作业区
        'V_DEPTNAME',
        'V_EQUTYPECODE',                     //设备类型
        'V_EQUTYPENAME',
        'V_EQUCODE',
        'V_EQUNAME',
        'V_REPAIRMAJOR_CODE',
        'V_CONTENT',
        'V_MONTHID',
        'V_STARTTIME',
        'V_ENDTIME',
        'V_HOUR',
        'V_REPAIRDEPT_CODE',
        'V_MANNAME',
        'V_TEL',
        'V_INDATE',
        'V_INPER',
        'V_PERSONNAME',
        'V_FLOWCODE',
        'V_JXMX_CODE',
        'V_JXGX_CODE',
        'V_STATUSNAME',
        'V_FLOWNAME',
        'V_INPERNAME',
        'V_STATENAME'
        ,'V_STATE',
        'V_MAIN_DEFECT',
        'V_EXPECT_AGE',
        'V_REPAIR_PER',
        'V_SBB_GUID'],
    proxy: {
        type: 'ajax',
        async: false,
        url: AppUrl + 'dxfile/PM_03_MONTH_PLAN_BYPER_SEL2',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'list',
            total: 'total'
        }
    }
});
//grid显示
function query() {
    Ext.data.StoreManager.lookup('gridStore').load();
    // _selectNextSprStore();
    /*Ext.data.StoreManager.lookup('gridStore').load({
     params: {

     V_V_YEAR: Ext.getCmp('nf').getValue(),
     V_V_MONTH: Ext.getCmp('yf').getValue(),
     V_V_ORGCODE: Ext.getCmp('jhck').getValue(),
     V_V_DEPTCODE: Ext.getCmp('jhzyq').getValue(),
     V_V_EQUTYPE: Ext.getCmp('sblx').getValue(),
     V_V_EQUCODE: Ext.getCmp('sbmc').getValue(),
     V_V_ZY:Ext.getCmp('zy').getValue(),
     V_V_PEROCDE: Ext.util.Cookies.get('v_personcode')
     }
     });*/
}

var northPanel = Ext.create('Ext.form.Panel', {
    region: 'north',
    frame: true,
    border: false,
    layout: 'column',
    //baseCls: 'my-panel-no-border',
    defaults: {labelAlign: 'right'},
    items: [
        {
            xtype: 'combo',
            id: 'nf',
            fieldLabel: '年份',
            editable: false,
            margin: '5 0 5 5',
            labelWidth: 80,
            width: 250,
            displayField: 'displayField',
            valueField: 'valueField',
            value: '',
            store: yearStore,
            labelAlign: 'right',
            queryMode: 'local'
        },
        {
            xtype: 'combo',
            id: 'yf',
            fieldLabel: '月份',
            editable: false,
            margin: '5 0 5 5',
            labelAlign: 'right',
            labelWidth: 80,
            width: 250,
            displayField: 'displayField',
            valueField: 'valueField',
            value: '',
            store: monthStore,
            queryMode: 'local'
        }, {
            xtype: 'combo',
            id: 'jhck',
            fieldLabel: '计划厂矿',
            editable: false,
            labelAlign: 'right',
            margin: '5 0 5 5',
            labelWidth: 80,
            width: 250,
            value: '',
            displayField: 'V_DEPTNAME',
            valueField: 'V_DEPTCODE',
            store: jhckStore,
            queryMode: 'local'
        },
        {
            xtype: 'combo',
            id: 'jhzyq',
            fieldLabel: '作业区',
            editable: false,
            margin: '5 0 5 5',
            labelWidth: 80,
            width: 250,
            value: '',
            displayField: 'V_DEPTNAME',
            valueField: 'V_DEPTCODE',
            store: jhzyqStore,
            labelAlign: 'right',
            queryMode: 'local'
        },
        {
            xtype: 'combo',
            id: 'sblx',
            fieldLabel: '设备类型',
            editable: false,
            margin: '5 0 5 5',
            labelWidth: 80,
            width: 250,
            value: '',
            displayField: 'V_EQUTYPENAME',
            valueField: 'V_EQUTYPECODE',
            store: sblxStore,
            labelAlign: 'right',
            queryMode: 'local'
        },
        {
            xtype: 'combo',
            id: 'sbmc',
            fieldLabel: '设备名称',
            editable: false,
            labelAlign: 'right',
            margin: '5 0 5 5',
            labelWidth: 80,
            width: 250,
            value: '',
            displayField: 'V_EQUNAME',
            valueField: 'V_EQUCODE',
            store: sbmcStore,
            queryMode: 'local'
        },
        {
            xtype: 'combo',
            id: 'zy',
            fieldLabel: '专业',
            labelAlign: 'right',
            editable: false,
            margin: '5 0 5 5',
            labelWidth: 80,
            width: 250,
            value: '',
            displayField: 'V_BASENAME',
            valueField: 'V_SPECIALTYCODE',
            store: zyStore,
            queryMode: 'local'
        }, {
            xtype: 'combo',
            id: 'state',
            fieldLabel: '状态',
            labelAlign: 'right',
            editable: false,
            margin: '5 0 5 5',
            labelWidth: 80,
            width: 250,
            value: '',
            displayField: 'V_BASENAME',
            valueField: 'V_BASECODE',
            store: stateStore,
            queryMode: 'local'
        }, {
            xtype: 'textfield',
            id: 'content',
            fieldLabel: '检修内容',
            margin: '5 0 5 5',
            labelWidth: 80,
            width: 250
        },
        // {
        //     xtype: 'combo',
        //     id: 'nextPer',
        //     labelAlign: 'right',
        //     fieldLabel: '下一步接收人',
        //     editable: false,
        //     margin: '5 0 5 5',
        //     labelWidth: 80,
        //     width: 250,
        //     value: '',
        //     displayField: 'V_PERSONNAME',
        //     valueField: 'V_PERSONCODE',
        //     store: nextSprStore,
        //     queryMode: 'local'
        // },
        // {
        //     xtype: 'displayfield',
        //     id: 'endtime',
        //     labelAlign: 'right',
        //     fieldLabel: '截止时间',
        //     readOnly: true,
        //     margin: '5 0 5 5',
        //     labelWidth: 80,
        //     width: 250,
        //     value: ''
        // },
        {
            xtype: 'panel', frame: true, width: '100%', layout: 'column', colspan: 2, baseCls: 'my-panel-noborder',style: 'margin:5px 5px 0 45px',
            items: [
        {
            xtype: 'button',
            text: '查询',
            margin: '5 0 5 45',
            icon: imgpath + '/search.png',
            handler: function () {
                query();
            }
        },
        {
            xtype: 'button',
            text: '上报(设备部)',
            margin: '5 0 5 5',
            width:120,
            icon: imgpath + '/accordion_expand.png',
            handler: OnButtonUp

        }
        ]}
    ]
});

var gridPanel = Ext.create('Ext.grid.Panel', {
    id: 'gridPanel',
    region: 'center',
    border: true,
    columnLines: true,
    store: 'gridStore',
    //selType: 'checkboxmodel',
    columns: [
        {text: '序号', align: 'center', width: 50, xtype: 'rownumberer'},
        {text: '计划状态', align: 'center', width: 100, dataIndex: 'V_STATENAME', renderer: atleft},
        {
            text: '详细',
            dataIndex: 'V_ORDERID',
            width: 80,
            align: 'center',
            renderer: function (value, metaData, record, rowIdx, colIdx, store, view) {
                // return '<a href="#" onclick="_preViewProcess(\'' + record.data.V_GUID + '\')">' + '详细' + '</a>';
                return '<a href="#" onclick="_preViewProcess(\'' + record.data.V_SBB_GUID + '\')">' + '详细' + '</a>';
            }
        },
        /*{text: '流程步骤', align: 'center', width: 150, dataIndex: 'V_FLOWNAME', renderer: rendererStep},*/
        {text: '厂矿', align: 'center', width: 100, dataIndex: 'V_ORGNAME', renderer: atleft},
        {text: '车间名称', align: 'center', width: 150, dataIndex: 'V_DEPTNAME', renderer: atleft},
        {text: '专业', align: 'center', width: 100, dataIndex: 'V_REPAIRMAJOR_CODE', renderer: atleft},
        {text: '设备名称', align: 'center', width: 100, dataIndex: 'V_EQUNAME', renderer: atleft},
        {xtype: 'linebreakcolumn', text: '检修内容', align: 'center', width: 280, dataIndex: 'V_CONTENT', renderer: atleft},
        {
            text: '计划停机日期',
            align: 'center',
            width: 200,
            dataIndex: 'V_STARTTIME',
            renderer: rendererTime/*Ext.util.Format.dateRenderer('Y-m-d H:m:s')*/
        },
        {
            text: '计划竣工日期',
            align: 'center',
            width: 200,
            dataIndex: 'V_ENDTIME',
            renderer: rendererTime/*Ext.util.Format.dateRenderer('Y-m-d H:m:s')*/
        },
        {text: '计划工期（小时）', align: 'center', width: 150, dataIndex: 'V_HOUR', renderer: atleft},

        {text: '录入人', align: 'center', width: 100, dataIndex: 'V_INPERNAME', renderer: atleft},
        {text: '主要缺陷', align: 'center', width: 100, dataIndex: 'V_MAIN_DEFECT', renderer: atleft},
        {text: '预计寿命', align: 'center', width: 100, dataIndex: 'V_EXPECT_AGE', renderer: atleft},
        {text: '维修人数', align: 'center', width: 100, dataIndex: 'V_REPAIR_PER', renderer: atleft},
        {
            text: '录入时间', align: 'center', width: 200, dataIndex: 'V_INDATE',
            renderer: rendererTime/*Ext.util.Format.dateRenderer('Y-m-d H:m:s')*/
        },
        {text:'new_guid',dataIndex:'V_SBB_GUID',hidden:true}
    ],
    bbar: ["->",
        {
            id: 'page',
            xtype: 'pagingtoolbar',
            store: gridStore,
            width: '100%',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录'
        }
    ]
});
Ext.onReady(function () {

    Ext.QuickTips.init();
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [northPanel, gridPanel]
    });
    Ext.getCmp('yf').select(getMonth());

    //计划厂矿加载监听
    Ext.data.StoreManager.lookup('jhckStore').on('load', function () {
        //  Ext.data.StoreManager.lookup('jhckStore').insert(0,{ V_DEPTCODE:'%',V_DEPTNAME:'全部'});
        Ext.getCmp('jhck').select(Ext.data.StoreManager.lookup('jhckStore').getAt(0));
        Ext.data.StoreManager.lookup('jhzyqStore').load({
            params: {
                'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode'),
                'V_V_DEPTCODE': Ext.getCmp('jhck').getValue(),
                'V_V_DEPTCODENEXT': '%',
                'V_V_DEPTTYPE': '主体作业区'
            }
        });
        // Queryendtime();
    });
    //计划作业区加载监听
    Ext.data.StoreManager.lookup('jhzyqStore').on('load', function () {

        Ext.data.StoreManager.lookup('jhzyqStore').insert(0,{ V_DEPTCODE:'%',V_DEPTNAME:'全部'});
        Ext.getCmp('jhzyq').select(Ext.data.StoreManager.lookup('jhzyqStore').getAt(0));
        // Querytime();
    });
    //计划厂矿更改时
    Ext.getCmp('jhck').on('select', function () {
        Ext.data.StoreManager.lookup('jhzyqStore').load({
            params: {
                'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode'),
                'V_V_DEPTCODE': Ext.getCmp('jhck').getValue(),
                'V_V_DEPTCODENEXT': '%',
                'V_V_DEPTTYPE': '主体作业区'
            }
        });

        query();
        // Queryendtime();
    });

    //加载专业
    Ext.data.StoreManager.lookup('zyStore').load({
        params: {
            V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode'),
            V_V_DEPTNEXTCODE: Ext.getCmp('jhzyq').getValue()
        }
    });


    //作业区改变
    Ext.getCmp('jhzyq').on('change', function () {
        Ext.data.StoreManager.lookup('zyStore').load({
            params: {
                V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode'),
                V_V_DEPTNEXTCODE: Ext.getCmp('jhzyq').getValue()
            }
        });
        Ext.data.StoreManager.lookup('sblxStore').load({
            params: {
                V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode'),
                V_V_DEPTCODENEXT: Ext.getCmp('jhzyq').getValue()
            }
        });

        query();
    });

    Ext.getCmp('sblx').on('change', function () {
        Ext.data.StoreManager.lookup('sbmcStore').load({
            params: {
                v_v_personcode: Ext.util.Cookies.get('v_personcode'),
                v_v_deptcodenext: Ext.getCmp('jhzyq').getValue(),
                v_v_equtypecode: Ext.getCmp('sblx').getValue()
            }
        });

        query();
    });
    // Ext.data.StoreManager.lookup('stateStore').load({
    //     params: {}
    // });

    //设备类型加载监听
    Ext.data.StoreManager.lookup('sblxStore').on('load', function () {
        Ext.getCmp("sblx").select(Ext.data.StoreManager.lookup('sblxStore').getAt(0));
    });
    //设备名称加载监听
    Ext.data.StoreManager.lookup('sbmcStore').on('load', function () {
        Ext.getCmp("sbmc").select(Ext.data.StoreManager.lookup('sbmcStore').getAt(0));
        query();
    });
    Ext.data.StoreManager.lookup('zyStore').on('load', function () {
        Ext.data.StoreManager.lookup('zyStore').insert(0,{V_SPECIALTYCODE:'%', V_BASENAME:'全部'});
        Ext.getCmp("zy").select(Ext.data.StoreManager.lookup('zyStore').getAt(0));
    });

    // Ext.data.StoreManager.lookup('stateStore').on('load', function () {
    Ext.getCmp("state").select('%');
    // Ext.data.StoreManager.lookup('gridStore').load();
    // });

    Ext.getCmp('nf').on('select', function () {
        // Queryendtime();
        query();
    });
    Ext.getCmp('yf').on('select', function () {
        // Queryendtime();
        query();
    });

    Ext.getCmp('sbmc').on('select', function () {
        query();
    });

    Ext.getCmp('zy').on('select', function () {
        query();
    });

    Ext.data.StoreManager.lookup('gridStore').on('beforeload', function (store) {

        store.proxy.extraParams = {
            V_V_YEAR: Ext.getCmp('nf').getValue(),
            V_V_MONTH: Ext.getCmp('yf').getValue(),
            V_V_ORGCODE: Ext.getCmp('jhck').getValue(),
            V_V_DEPTCODE: Ext.getCmp('jhzyq').getValue(),
            V_V_EQUTYPE: Ext.getCmp('sblx').getValue(),
            V_V_EQUCODE: Ext.getCmp('sbmc').getValue(),
            V_V_ZY: Ext.getCmp('zy').getValue(),
            V_V_CONTENT: Ext.getCmp('content').getValue(),
            V_V_STATECODE: Ext.getCmp('state').getValue(),
            V_V_PEROCDE: Ext.util.Cookies.get('v_personcode'),
            V_V_PAGE: Ext.getCmp('page').store.currentPage,
            V_V_PAGESIZE: Ext.getCmp('page').store.pageSize

        }
    });
    var btnpanel=Ext.create('Ext.panel.Panel',{
        id:'btnpanel',
        height:50,
        frame:true,
        region:'north',
        layout:'column',
        border:false,
        defaults:{width:50,style: 'margin:5px 0px 10px 5px',labelAlign: 'center'},
        items:[{xtype:'button',id:'chonextper',text:'确定',handler:saveOnButtonUp},
            {xtype:'button',id:'cancelbtn',text:'关闭',handler:function(){this.up("window").close()}}]
    });
    var nextperGrid=Ext.create('Ext.grid.Panel',{
        id: 'nextperGrid',
        columnLines:true,
        region:'center',
        selType: 'checkboxmodel',
        store: nextSprStore,width:147,
        // tbar:[{xtype:'button',id:'chonextper',text:'确定',handler:saveOnButtonUp},
        //     {xtype:'button',id:'cancelbtn',text:'关闭',handler:function(){this.up("window").close()}}],
        columns:[{herder:'下一步审批人',dataIndex:'V_PERSONCODE',sortable:true,align:'center',width:147,hidden:true},
            {herder:'下一步审批人',dataIndex:'V_PERSONNAME',sortable:true,align:'center',width:147}]
    });
    var nextSprWind=Ext.create('Ext.window.Window',{
        id:'nextSprWind',
        title: '下一步审批人',
        layout: 'border',width:187,
        height:200,
        modal:true,
        closeAction: 'hide',
        items:[btnpanel,nextperGrid]
    });


});

function getMonth(){
    if(date.getMonth()+1==12){
        Ext.getCmp('nf').select(date.getFullYear()+1);
        return 1;
    }else{
        var month=date.getMonth()+1;
        Ext.getCmp('nf').select(date.getFullYear());
        return month+1;
    }
}
function _selectNextSprStore() {
    var nextSprStore = Ext.data.StoreManager.lookup('nextSprStore');
    nextSprStore.proxy.extraParams = {
        V_V_ORGCODE: Ext.getCmp('jhck').getValue(),
        V_V_DEPTCODE: Ext.getCmp('jhzyq').getValue(),
        V_V_REPAIRCODE: '',
        V_V_FLOWTYPE: 'MonthPlan01',
        V_V_FLOW_STEP: 'start',
        V_V_PERCODE: Ext.util.Cookies.get('v_personcode'),
        V_V_SPECIALTY: Ext.getCmp('zy').getValue(),
        V_V_WHERE: ''

    };
    nextSprStore.currentPage = 1;
    nextSprStore.load();
}
function atleft(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:left;";
    return '<div data-qtip="' + value + '" >' + value + '</div>';
}
function rendererTime(value, metaData) {

    return '<div data-qtip="' + value.split(".")[0] + '" >' + value.split(".")[0] + '</div>';
}

function rendererStep(value, metaData, record, rowIndex, colIndex, store, view) {
    var stepValue = '';
    Ext.Ajax.request({
        url: AppUrl + 'Activiti/GetActivitiStepFromBusinessId',
        type: 'ajax',
        method: 'POST',
        async: false,
        params: {
            businessKey: record.data.V_GUID
        },
        success: function (resp) {
            var data = Ext.decode(resp.responseText);//后台返回的值
            if(data.msg == 'Ok'){
                stepValue = data.list.ActivityName;
            }else{
                stepValue = '起草';
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

    return stepValue;
}

//截止上报时间
function Queryendtime() {
    Ext.Ajax.request({
        url: AppUrl + 'PM_03/PRO_PM_PLAN_LOCKING_DATE_GET',
        method: 'POST',
        async: false,
        params: {
            V_I_YEAR: Ext.getCmp('nf').getValue(),
            V_I_MONTH: Ext.getCmp('yf').getValue(),
            V_I_WEEKNUM: '0',
            V_V_TYPE: 'M',
            V_V_DEPTCODE:Ext.getCmp('jhck').getValue()
        },
        success: function (resp) {
            var resp = Ext.decode(resp.responseText);
            if (resp.list.length != 1) {
                Ext.getCmp('endtime').setValue('未设置');
            } else {
                Ext.getCmp('endtime').setValue(resp.list[0].D_DATE_E.split('.')[0]);
            }
        }
    });
}

function _preViewProcess(businessKey)
{

    var ProcessInstanceId='';
    Ext.Ajax.request({
        url: AppUrl + 'Activiti/GetActivitiStepFromBusinessId',
        type: 'ajax',
        method: 'POST',
        async: false,
        params: {
            businessKey: businessKey
        },
        success: function (resp) {
            var data = Ext.decode(resp.responseText);//后台返回的值
            if(data.msg == 'Ok'){
                ProcessInstanceId=data.InstanceId;
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

    var owidth = window.screen.availWidth;
    var oheight =  window.screen.availHeight - 50;
    var ret = window.open(AppUrl + 'page/PM_210301/index.html?ProcessInstanceId='
        +  ProcessInstanceId, '', 'height='+ oheight +'px,width= '+ owidth + 'px,top=50px,left=100px,resizable=yes');

}


function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}


function saveOnButtonUp(){

    /* if (Ext.Date.format(new Date(Ext.getCmp('endtime').getValue()), 'Y/m/d') < Ext.Date.format(new Date(), 'Y/m/d')) {
         alert("已过上报时间，不能上报");
         return false;
     }
 */
    // if(Ext.getCmp('nextPer').getValue()==""){
    //     alert('下一步审批人不可以空，请重新选择');
    // }
    var nextper=[];
    var records = Ext.getCmp('nextperGrid').getSelectionModel().getSelection();
    if (records.length == 0) {//判断下一步审批人是否选中数据
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一条数据，下一步审批人不可为空',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return false;
    }
    // for (var i = 0; i < records.length; i++) {
    //     if (records[i].data.V_STATENAME == '审批中'|| records[i].data.V_STATENAME == '审批完成' || records[i].data.V_STATENAME == '已驳回') {
    //         Ext.Msg.alert('提升信息', '此计划状态不能上报');
    //         return false;
    //     }
    // }
    //
    //
    for(var i=0;i<records.length;i++){
       nextper.push(records[i].data.V_PERSONCODE);
    }
    var i_err = 0;
    // for (var i = 0; i < records.length; i++) {
    var records=Ext.data.StoreManager.lookup('gridStore').getProxy().getReader().rawData;
    for(var i=0;i<records.list.length;i++){
        if(records.list[i].V_STATE=="30"||records.list[i].V_STATE=="90"){
            Ext.Ajax.request({
                url: AppUrl + 'PM_03/PRO_PM_03_PLAN_MONTH_SEND2',
                method: 'POST',
                async: false,
                params: {
                    V_V_GUID: records.list[i].V_SBB_GUID,
                    V_V_ORGCODE: records.list[i].V_ORGCODE,
                    V_V_DEPTCODE: records.list[i].V_DEPTCODE,
                    V_V_FLOWCODE: records.list[i].V_FLOWCODE,
                    V_V_PLANTYPE: 'MONTH',
                    V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode')
                },
                success: function (resp) {
                    var resp = Ext.decode(resp.responseText).list[0];
                    if (resp.V_INFO != 'Fail') {

                        Ext.Ajax.request({
                            url: AppUrl + 'Activiti/StratProcessList',
                            async: false,
                            method: 'post',
                            params: {
                                parName: ["originator", "flow_businesskey", "Next_StepCode", "idea", "remark", "flow_code", "flow_yj","flow_type","zyName"],
                                parVal: [Ext.util.Cookies.get('v_personcode'), records.list[i].V_SBB_GUID, V_NEXT_SETP+'List', "请审批!", records.list[i].V_CONTENT, records.list[i].V_MONTHID, "请审批！","MonthPlan01",records.list[i].V_REPAIRMAJOR_CODE],
                                processKey: processKey,
                                businessKey: records.list[i].V_SBB_GUID,
                                V_STEPCODE: 'Start',
                                V_STEPNAME:V_STEPNAME,// nextper,
                                V_IDEA: '请审批！',
                                V_NEXTPER:nextper,// Ext.getCmp('nextPer').getValue(),
                                V_INPER: Ext.util.Cookies.get('v_personcode')
                            },
                            success: function (response) {
                                if (Ext.decode(response.responseText).ret == 'OK') {
                                    Ext.getCmp('nextSprWind').close();
                                    query();
                                } else if (Ext.decode(response.responseText).error == 'ERROR') {
                                    i_err++;
                                    Ext.Msg.alert('提示', '流程发起失败'+i_err+'条！');
                                }
                            }
                        });
                        // i_err++;
                        // if (i_err == records.length) {
                        //     query();
                        // }
                    } else {
                        Ext.Msg.alert('提示', '上报失败！');
                    }
                }
            });
        }
       // Ext.Array.erase(nextper,0,nextper.length);
    }
    // }
    Ext.Array.erase(nextper,0,nextper.length);
}



function OnButtonUp() {
    _selectNextSprStore();
    Ext.getCmp('nextSprWind').show();

}