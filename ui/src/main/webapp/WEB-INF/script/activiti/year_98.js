﻿var processKey = "";
var TaskDefinitionKey = "";
var ProcessInstanceId = '';

var cmItems = [];
var ganttdata = [];
var vStart = '';
var vEnd = '';
var stime = '';
var etime = '';
var V_STEPNAME="";
var V_NEXT_SETP="";

var dt = new Date();
var thisYear = dt.getFullYear();
var years = [];
//初始化时间参数
var today = new Date(Ext.Date.format(new Date(), 'Y-m-d'));

var Guid = "";
var cGuid = "";
if (Ext.urlDecode(location.href.split('?')[1]) != null) {
    Guid = Ext.urlDecode(location.href.split('?')[1]).V_ORDERGUID == null ? "" : Ext.urlDecode(location.href.split('?')[1]).V_ORDERGUID;
    processKey = Ext.urlDecode(location.href.split('?')[1]).ProcessDefinitionKey == null ? "" : Ext.urlDecode(location.href.split('?')[1]).ProcessDefinitionKey;
    TaskDefinitionKey = Ext.urlDecode(location.href.split('?')[1]).TaskDefinitionKey == null ? "" : Ext.urlDecode(location.href.split('?')[1]).TaskDefinitionKey;
    ProcessInstanceId = Ext.urlDecode(location.href.split('?')[1]).ProcessInstanceId == null ? "" : Ext.urlDecode(location.href.split('?')[1]).ProcessInstanceId;
}

for (var i = 2018; i <= thisYear + 1; i++) {
    years.push({displayField: i, valueField: i});
}

//小时
var hours = [];
for (var i = 0; i <= 23; i++) {
    if (i < 10) {
        i = '0' + i;
    } else {
        i = '' + i;
    }
    hours.push({displayField: i, valueField: i});
}

//分钟
var minutes = [];
for (var i = 0; i <= 59; i++) {
    if (i < 10) {
        i = '0' + i;
    } else {
        i = '' + i;
    }
    minutes.push({displayField: i, valueField: i});
}

Ext.onReady(function () {
    Ext.QuickTips.init();

    var hourStore = Ext.create("Ext.data.Store", {
        storeId: 'hourStore',
        fields: ['displayField', 'valueField'],
        data: hours,
        proxy: {
            type: 'memory',
            reader: {type: 'json'}
        }
    });

    var minuteStore = Ext.create("Ext.data.Store", {
        storeId: 'minuteStore',
        fields: ['displayField', 'valueField'],
        data: minutes,
        proxy: {
            type: 'memory',
            reader: {type: 'json'}
        }
    });

    var yearStore = Ext.create("Ext.data.Store", {
        storeId: 'yearStore',
        fields: ['displayField', 'valueField'],
        data: years,
        proxy: {
            type: 'memory',
            reader: {type: 'json'}
        }
    });

    //厂矿计划数据加载
    var ckStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        storeId: 'ckStore',
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

    //作业区加载
    var zyqStore = Ext.create('Ext.data.Store', {
        autoLoad: false,
        storeId: 'zyqStore',
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

    var cxStore = Ext.create('Ext.data.Store', {
        autoLoad: false,
        storeId: 'cxStore',
        fields: ['V_ORGCODE', 'V_DEPTCODE', 'V_CXCODE', 'V_CXNAME', 'V_FLAG'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'PM_06/PRO_PLAN_YEAR_CX_SEL',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            }
        }
    });

    var equStore = Ext.create('Ext.data.Store', {
        autoLoad: false,
        storeId: 'equStore',
        fields: ['V_EQUCODE', 'V_EQUNAME', 'V_FLAG', 'V_CXCODE'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'PM_06/PRO_YEAR_CXEQU_SEL',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            }
        }
    });

    var zyStore = Ext.create('Ext.data.Store', {
        autoLoad: false,
        storeId: 'zyStore',
        fields: ['V_GUID', 'V_ZYMC', 'V_ZYJC', 'V_LX', 'V_ORDER'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'PM_03/PM_03_PLAN_ZY_SEL',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            }
        }
    });

    var fzPerStore = Ext.create("Ext.data.Store", {
        autoLoad: false,
        storeId: 'fzPerStore',
        fields: ['V_PERSONCODE', 'V_PERSONNAME', 'V_V_NEXT_SETP', 'V_V_FLOW_STEPNAME'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'hp/PM_ACTIVITI_PROCESS_PER_SEL',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            }
        }
    });

    var gridStore = Ext.create('Ext.data.Store', {
        id: 'gridStore',
        autoLoad: false,
        fields: ['V_YEARGUID', 'V_CXCODE', 'V_CXNAME', 'V_EQUCODE', 'V_EQUNAME', 'V_EQUFLAG', 'V_COUNT',
            'V_JHTJSJ', 'V_JHJGSJ', 'V_JHGQ', 'V_GUID', 'V_ZYMC'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'PM_06/PRO_YEAR_PLAN_C_SEL',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            }
        }
    });

    var npanel = Ext.create('Ext.panel.Panel', {
        region: 'north',
        layout: 'column',
        frame: true,
        width: '100%',
        items: [{
            id: 'spyj',
            xtype: 'textfield',
            fieldLabel: '审批意见',
            labelWidth: 90,
            fieldStyle: 'background-color: #FFEBCD; background-image: none;',
            style: ' margin: 5px 0px 0px 5px',
            labelAlign: 'right',
            width: 250
        }, {
            xtype: 'combo',
            id: 'fzPer',
            store: fzPerStore,
            editable: false,
            queryMode: 'local',
            fieldLabel: '审批人',
            displayField: 'V_PERSONNAME',
            valueField: 'V_PERSONCODE',
            margin: '5 5 5 10',
            labelWidth: 60,
            labelAlign: 'right'
        },
            {xtype: 'button', style: 'margin:5px 0px 5px 5px', text: '上报', listeners: {click: OnBtnUp}},
            {xtype: 'button', style: 'margin:5px 0px 5px 5px', text: '新增设备', listeners: {click: OnBtnAddEqu}},
            {xtype: 'button', style: 'margin:5px 0px 5px 5px', text: '修改设备', listeners: {click: OnBtnSaveEqu}},
            {xtype: 'button', style: 'margin:5px 0px 5px 5px', text: '删除设备', listeners: {click: OnBtnDelEquC}},
            {xtype: 'button', style: 'margin:5px 0px 5px 5px', text: '关闭', listeners: {click: OnBtnClose}}]
    });

    var dpanel = Ext.create('Ext.panel.Panel', {
        region: 'west',
        width: '40%',
        layout: {
            type: 'table',
            columns: 2
        },
        frame: true,
        defaults: {
            style: 'margin:5px 0px 5px 5px',
            labelAlign: 'right',
            labelWidth: 100
        },
        items: [{
            xtype: 'label',
            text: '-----------------------------年计划信息----------------------------------',
            colspan: 2
        }, {
            xtype: 'textfield',
            id: 'yearName',
            fieldLabel: '年计划名称',
            width: 500,
            colspan: 2
        }, {
            xtype: 'textarea',
            id: 'njhnr',
            fieldLabel: '年计划主要内容',
            height: 60,
            width: 500,
            colspan: 2
        }, {
            id: 'year',
            store: yearStore,
            xtype: 'combo',
            fieldLabel: '年份',
            value: new Date().getFullYear() + 1,
            editable: false,
            displayField: 'displayField',
            valueField: 'valueField'
        }, {
            xtype: 'combo',
            id: "ck",
            store: ckStore,
            editable: false,
            queryMode: 'local',
            fieldLabel: '计划厂矿',
            displayField: 'V_DEPTNAME',
            valueField: 'V_DEPTCODE'
        }, {
            xtype: 'combo',
            id: "zyq",
            store: zyqStore,
            editable: false,
            queryMode: 'local',
            fieldLabel: '作业区',
            displayField: 'V_DEPTNAME',
            valueField: 'V_DEPTCODE'
        }, {
            xtype: 'combo',
            id: "cx",
            store: cxStore,
            editable: false,
            queryMode: 'local',
            fieldLabel: '产线名称',
            displayField: 'V_CXNAME',
            valueField: 'V_CXCODE'
        }, {
            xtype: 'label',
            text: '-----------------------------产线设备信息----------------------------------',
            colspan: 2
        }, {
            xtype: 'combo',
            id: "equ",
            store: equStore,
            editable: false,
            queryMode: 'local',
            fieldLabel: '设备名称',
            displayField: 'V_EQUNAME',
            valueField: 'V_EQUCODE'
        }, {
            xtype: 'combo',
            id: "zy",
            store: zyStore,
            editable: false,
            queryMode: 'local',
            fieldLabel: '专业',
            displayField: 'V_ZYMC',
            valueField: 'V_GUID'
        }, {
            xtype: 'textarea',
            id: 'jxnr',
            fieldLabel: '设备检修内容',
            height: 60,
            width: 500,
            colspan: 2
        }, {
            xtype: 'datefield',
            id: 'jhtjsj',
            fieldLabel: '计划停机时间',
            format: 'Y/m/d',
            editable: false,
            value: new Date()
        }, {
            xtype: 'combo',
            id: 'jhtjsjxs',
            fieldLabel: '小时',
            editable: false,
            value: '0',
            displayField: 'displayField',
            valueField: 'valueField',
            store: hourStore,
            queryMode: 'local'
        }, {
            xtype: 'numberfield',
            id: 'jhgq',
            value: 0,
            fieldLabel: '计划工期（小时）',
            minValue:0,
            allowBlank: false
        }]
    });

    var cgrid = Ext.create('Ext.grid.Panel', {
        id: 'grid',
        region: 'center',
        width: '100%',
        columnLines: true,
        store: gridStore,
        autoScroll: true,
        height: 400,
        selModel: {
            selType: 'checkboxmodel'
        },
        columns: [{xtype: 'rownumberer', text: '序号', width: 50, align: 'center'},
            {text: '产线', width: 160, dataIndex: 'V_CXNAME', align: 'center', renderer: atleft},
            {text: '设备名称', width: 140, dataIndex: 'V_EQUNAME', align: 'center', renderer: atleft},
            {text: '专业', width: 100, dataIndex: 'V_ZYMC', align: 'center', renderer: atleft},
            {text: '检修内容', width: 200, dataIndex: 'V_COUNT', align: 'center', renderer: atleft},
            {text: '计划开工时间', width: 140, dataIndex: 'V_JHTJSJ', align: 'center', renderer: atleft},
            {text: '计划竣工时间', width: 140, dataIndex: 'V_JHJGSJ', align: 'center', renderer: atleft},
            {text: '计划工期', width: 120, dataIndex: 'V_JHGQ', align: 'center', renderer: atleft}],
        listeners: {itemClick: OnBtnSelC}
    })

    var rpanel = Ext.create('Ext.panel.Panel', {
        id: 'rpanel',
        region: 'south',
        layout: 'border',
        frame: true,
        width: '100%',
        height: '40%',
        items: []
    })

    var cpanel = Ext.create('Ext.panel.Panel', {
        region: 'center',
        layout: 'border',
        frame: true,
        width: '60%',
        autoScroll: true,
        items: [cgrid, rpanel]
    })

    Ext.create('Ext.container.Viewport', {
        id: "id",
        layout: 'border',
        items: [npanel, dpanel, cpanel]
    });

    Ext.data.StoreManager.lookup('gridStore').on('load', function () {
        if (Ext.data.StoreManager.lookup('gridStore').data.items.length > 0) {
            cGuid = Ext.data.StoreManager.lookup('gridStore').data.items[0].data.V_GUID;
            QueryFirstData(cGuid);
        }
    })

    Ext.data.StoreManager.lookup('fzPerStore').on('load', function () {
        Ext.getCmp('fzPer').select(Ext.data.StoreManager.lookup('fzPerStore').getAt(0));
        processKey = Ext.data.StoreManager.lookup('fzPerStore').getProxy().getReader().rawData.RET;
        V_STEPNAME = Ext.data.StoreManager.lookup('fzPerStore').getAt(0).data.V_V_FLOW_STEPNAME;
        V_NEXT_SETP = Ext.data.StoreManager.lookup('fzPerStore').getAt(0).data.V_V_NEXT_SETP;
    })

    QueryEquGrid();
    OnPageLoad()
});

function OnPageLoad() {
    Ext.Ajax.request({
        url: AppUrl + 'PM_06/PRO_PLAN_YEAR_SEL_BYGUID',
        method: 'POST',
        async: false,
        params: {
            V_V_GUID: Guid
        },
        success: function (resp) {
            var resp = Ext.decode(resp.responseText);
            if (resp.list != null) {
                if (resp.list.length > 0) {
                    V_V_PERSONCODE = resp.list[0].V_INPER;
                    V_PERSONNAME = resp.list[0].V_INPERNAME;
                    V_V_ORGCODE = resp.list[0].V_ORGCODE;
                    V_V_DEPTCODE = resp.list[0].V_DEPTCODE;
                    V_V_SPECIALTY = resp.list[0].V_ZY;
                    Ext.getCmp('yearName').setValue(resp.list[0].V_YEARNAME);
                    Ext.getCmp('njhnr').setValue(resp.list[0].V_COUNT);
                    _selectTaskId();
                }
            }
        }
    });
}

function OnBtnAddEqu() {
    Ext.Ajax.request({
        url: AppUrl + '/PM_06/PRO_YEAR_PLAN_C_SAVE',
        method: 'POST',
        async: false,
        params: {
            V_V_GUID: Guid,
            V_V_CGUID: '-1',
            V_V_YEAR: Ext.getCmp("year").getValue(),
            V_V_YEARNAME: Ext.getCmp("yearName").getValue(),
            V_V_ORGCODE: Ext.getCmp("ck").getValue(),
            V_V_DEPTCODE: Ext.getCmp("zyq").getValue(),
            V_V_CXCODE: Ext.getCmp('cx').getValue(),
            V_V_EQUCODE: Ext.getCmp('equ').getValue(),
            V_V_ZYCODE: Ext.getCmp('zy').getValue(),
            V_V_JXNR: Ext.getCmp('jxnr').getValue(),
            V_V_JHTJSJ: Ext.Date.format(Ext.getCmp('jhtjsj').getValue(), 'Y-m-d') + " " + Ext.getCmp('jhtjsjxs').getValue() + ":00:00",
            V_V_JHJGSJ: "",
            V_V_JHGQ: Ext.getCmp('jhgq').getValue(),
            V_V_PERCODE: Ext.util.Cookies.get('v_personcode'),
            V_V_YEARCOUNT: Ext.getCmp("njhnr").getValue()
        },
        success: function (resp) {
            var resp = Ext.decode(resp.responseText);
            if (resp.V_INFO == 'SUCCESS') {
                QueryEquGrid();
            } else {
                alert(resp.V_INFO);
            }
        }
    });
}

function OnBtnSaveEqu() {
    Ext.Ajax.request({
        url: AppUrl + '/PM_06/PRO_YEAR_PLAN_C_SAVE',
        method: 'POST',
        async: false,
        params: {
            V_V_GUID: Guid,
            V_V_CGUID: cGuid,
            V_V_YEAR: Ext.getCmp("year").getValue(),
            V_V_YEARNAME: Ext.getCmp("yearName").getValue(),
            V_V_ORGCODE: Ext.getCmp("ck").getValue(),
            V_V_DEPTCODE: Ext.getCmp("zyq").getValue(),
            V_V_CXCODE: Ext.getCmp('cx').getValue(),
            V_V_EQUCODE: Ext.getCmp('equ').getValue(),
            V_V_ZYCODE: Ext.getCmp('zy').getValue(),
            V_V_JXNR: Ext.getCmp('jxnr').getValue(),
            V_V_JHTJSJ: Ext.Date.format(Ext.getCmp('jhtjsj').getValue(), 'Y-m-d') + " " + Ext.getCmp('jhtjsjxs').getValue() + ":00:00",
            V_V_JHJGSJ: "",
            V_V_JHGQ: Ext.getCmp('jhgq').getValue(),
            V_V_PERCODE: Ext.util.Cookies.get('v_personcode'),
            V_V_YEARCOUNT: Ext.getCmp("njhnr").getValue()
        },
        success: function (resp) {
            var resp = Ext.decode(resp.responseText);
            if (resp.V_INFO == 'SUCCESS') {
                QueryEquGrid();
            } else {
                alert(resp.V_INFO);
            }
        }
    });
}

function QueryEquGrid() {
    Ext.data.StoreManager.lookup('gridStore').load({
        params: {
            V_V_GUID: Guid
        }
    })

    Ext.getCmp('rpanel').removeAll();
    pageFunction.QueryGanttData();
}

function OnBtnDelEquC() {
    var seldata = Ext.getCmp('grid').getSelectionModel().getSelection();
    if (seldata.length == 0) {
        alert('请选择要删除的数据!');
    } else {
        var num = 0;
        for (var i = 0; i < seldata.length; i++) {
            Ext.Ajax.request({
                url: AppUrl + '/PM_06/PRO_YEAR_PLAN_C_DEL',
                method: 'POST',
                async: false,
                params: {
                    V_V_GUID: seldata[i].data.V_GUID
                },
                success: function (resp) {
                    var resp = Ext.decode(resp.responseText);
                    if (resp.V_INFO == 'SUCCESS') {
                        num++;
                    } else {
                        alert("删除失败！");
                    }
                }
            });
        }
        if (num == seldata.length) {
            QueryEquGrid();
        }
    }
}

var pageFunction = {
    /**
     * 甘特图动态渲染
     */
    CreateGantt: function () {
        cmItems = [];
        var starttime = '';
        var endtime = '';
        for (var i = 0; i < ganttdata.length; i++) {
            if (i == 0) {
                starttime = new Date(ganttdata[i].V_JHTJSJ.split(" ")[0] + " 00:00:00");
                endtime = new Date(ganttdata[i].V_JHJGSJ.split(" ")[0] + " 23:59:59");
            } else {
                if (new Date(ganttdata[i].V_JHTJSJ.split(" ")[0] + " 00:00:00") < starttime) {
                    starttime = new Date(ganttdata[i].V_JHTJSJ.split(" ")[0] + " 00:00:00");
                }
                if (new Date(ganttdata[i].V_JHJGSJ.split(" ")[0] + " 23:59:59") > endtime) {
                    endtime = new Date(ganttdata[i].V_JHJGSJ.split(" ")[0] + " 23:59:59");
                }
            }
        }
        vStart = starttime;
        vEnd = endtime;
        var vTmpDate = new Date(vStart.getFullYear(), vStart.getMonth(), vStart.getDate());
        var dateItems = [];
        var vmonth = vTmpDate.getMonth();
        var vTmpMonth;
        while (vTmpDate <= vEnd) {
            vTmpMonth = vTmpDate.getMonth();
            var vzm = '';
            if (vTmpDate.getDay() == 0 || vTmpDate.getDay() == 6) {
                vzm = 'color:#CCCCCC';
            }
            if (vTmpMonth == vmonth) {
                dateItems.push({
                    text: vTmpDate.getDate().toString(),
                    style: vzm,
                    width: 40
                });
            } else {
                var vyear = vTmpDate.getFullYear();
                if (vmonth == 11) {
                    vyear -= 1;
                }
                cmItems.push({
                    text: vyear.toString() + '年' + (vmonth + 1).toString() + '月',
                    columns: dateItems
                });
                vmonth = vTmpMonth;
                dateItems = [];
                dateItems.push({
                    text: vTmpDate.getDate().toString(),
                    style: vzm,
                    width: 40
                });
            }
            vTmpDate = new Date((vTmpDate / 1000 + 86400) * 1000);
        }
        if (vTmpMonth == vmonth) {
            cmItems.push({
                text: vTmpDate.getFullYear().toString() + '年' + (vmonth + 1).toString() + '月',
                columns: dateItems
            });
        }
        cmItems.push({
            text: '',
            width: 0,
            dataIndex: 'MYCOLOR',
            renderer: pageFunction.IndexShow
        });
        var ganttStore = Ext.create("Ext.data.Store", {
            storeId: 'ganttStore',
            fields: ['V_YEARGUID', 'V_CXCODE', 'V_CXNAME', 'V_EQUCODE', 'V_EQUNAME', 'V_EQUFLAG', 'V_COUNT',
                'V_JHTJSJ', 'V_JHJGSJ', 'V_JHGQ', 'V_GUID', 'V_ZYMC'],
            data: ganttdata,
            proxy: {
                type: 'memory',
                reader: {
                    type: 'json'
                }
            }
        });
        var ganttgrid = Ext.create('Ext.grid.Panel', {
            id: 'ganttgrid',
            store: ganttStore,
            region: 'center',
            height: 400,
            columnLines: true,
            columns: cmItems
        });
        Ext.getCmp('rpanel').add(ganttgrid);
    },
    QueryGanttData: function () {
        ganttdata = [];
        Ext.Ajax.request({
            url: AppUrl + 'PM_06/PRO_YEAR_PLAN_C_SEL',
            method: 'POST',
            async: false,
            params: {
                V_V_GUID: Guid
            },
            success: function (resp) {
                var resp = Ext.decode(resp.responseText);
                ganttdata = resp.list;
                if (resp.list.length > 0) {
                    pageFunction.CreateGantt();
                }
            }
        });
    },
    /**构造显示结构*/
    IndexShow: function (value, metaData, record) {

        stime = record.data.V_JHTJSJ;
        etime = record.data.V_JHJGSJ;
        var startd = new Date(stime.split(".0")[0].replace(/-/g, "/"));
        var endd = new Date(etime.split(".0")[0].replace(/-/g, "/"));
        if (startd < vStart) {
            startd = new Date(vStart);
        }
        if (startd > vEnd) {
            startd = new Date(vEnd);
        }
        if (endd < vStart) {
            endd = new Date(vStart);
        }
        if (endd > vEnd) {
            endd = new Date(vEnd);
        }
        if (endd < startd) {
            endd = new Date(startd);
        }
        if (endd <= today) {
            var vleft = ((startd.getTime() - vStart.getTime()) / (86400 * 1000)) * 40;
            var vwidth = ((endd.getTime() - startd.getTime()) / (86400 * 1000)) * 40;
            if (Ext.Date.getLastDateOfMonth(startd).getDate() == startd.getDate()) {
                vwidth = vwidth + 40;
            }
            if (endd.getDate() == 1) {
                vwidth = vwidth + 40;
            }
            var gtt = '<div style="left:' + vleft.toString() + 'px;height:27px;width:' + vwidth.toString() + 'px;background-color:A6FFA6;" class="sch-event" onmouseover="a1(\'' + record.data.V_GUID + '\')" onmouseout="a2(\'' + record.data.V_GUID + '\')"><div class="sch-event-inner" >' + record.data.V_EQUNAME + '</div></div><div class="lxm"  id="' + record.data.V_GUID + '" style="display:none; position:absolute; z-index:9999; border:1px solid #666;">开始时间：' + stime.split('.0')[0] + '<br>' + '结束时间：' + etime.split('.0')[0] + '<br>';
            var cont = record.data.V_COUNT.split(',');
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
        if (today <= startd) {
            var vleft = ((startd.getTime() - vStart.getTime()) / (86400 * 1000)) * 40;
            var vwidth = ((endd.getTime() - startd.getTime()) / (86400 * 1000)) * 40;
            var gtt = '<div style="left:' + vleft.toString() + 'px;height:27px;width:' + vwidth.toString() + 'px;background-color: #CC3333;" class="sch-event" onmouseover="a1(\'' + record.data.V_GUID + '\')" onmouseout="a2(\'' + record.data.V_GUID + '\')"><div  class="sch-event-inner">' + record.data.V_EQUNAME + '</div></div><div class="lxm"  id="' + record.data.V_GUID + '" style="display:none; position:absolute; z-index:9999; border:1px solid #666;">开始时间：' + stime.split('.0')[0] + '<br>' + '结束时间：' + etime.split('.0')[0] + '<br>';
            var cont = record.data.V_COUNT.split(',');
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
        if (startd < today && today < endd) {
            var nowtime2 = Ext.Date.format(new Date(), 'Y-m-d 00:00:00')
            var vleft = vleft = ((startd.getTime() - vStart.getTime()) / (86400 * 1000)) * 40;
            var vwidth1 = ((today.getTime() - startd.getTime()) / (86400 * 1000)) * 40;
            var vwidth2 = ((endd.getTime() - today.getTime()) / (86400 * 1000)) * 40;
            var vwidth = ((endd.getTime() - startd.getTime()) / (86400 * 1000)) * 40;
            if (Ext.Date.format(Ext.Date.getLastDateOfMonth(startd), 'Y-m-d') == Ext.Date.format(startd, 'Y-m-d')) {
                vwidth = vwidth + 40;
                vwidth1 = vwidth1 + 40;
            }
            if (endd.getDate() == 1) {
                vwidth = vwidth + 40;
                vwidth2 = vwidth2 + 40;
            }
            var bfb = Math.round(((vwidth1 / vwidth) * 100), 0);
            var gtt = '<div style="left:' + vleft.toString() + 'px;height:27px;width:' + vwidth.toString() + 'px;" class = "sch-event" onmouseover="a1(\'' + record.data.V_GUID + '\')" onmouseout="a2(\'' + record.data.V_GUID + '\')"><div style="width:' + vwidth1.toString() + 'px;border:0px;height:27px;margin:0px;background-color:#99CC66;" class = "sch-event">' + ' 完成度' + bfb + '%</div><div class="sch-event-inner" style="float:right;width:' + vwidth2.toString() + 'px;height:27px;border:0px;margin:0px;background-color: #CC3333;">' + record.data.V_EQUNAME + '</div></div><div class="lxm"  id="' + record.data.V_GUID + '" style="display:none; position:absolute; z-index:9999; border:1px solid #666;">开始时间：' + stime.split('.0')[0] + '<br>' + '结束时间：'
                + etime.split('.0')[0] + '<br>';
            var cont = record.data.V_COUNT.split(',');
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

function a1(id) {
    var oson = document.getElementById(id);
    with (oson) {
        oson.style.display = "block";
        oson.style.left = (window.event.clientX - 450) + 'px';
        oson.style.top = (window.event.clientY - 138) + 'px';
        oson.style.background = 'white';
    }
}

function a2(id) {
    document.getElementById(id).style.display = 'none';
}

function atleft(value, metaData) {
    metaData.style = "text-align:left;";
    return '<div data-qtip="' + value + '" >' + value + '</div>';
}

function atright(value, metaData) {
    metaData.style = "text-align:right;";
    return '<div data-qtip="' + value + '" >' + value + '</div>';
}

function OnBtnClose() {
    window.close();
    window.opener.OnButtonQuery();
}

function _selectTaskId() {
    Ext.Ajax.request({
        url: AppUrl + 'Activiti/GetTaskIdFromBusinessId',
        type: 'ajax',
        method: 'POST',
        params: {
            businessKey: Guid,
            userCode: Ext.util.Cookies.get('v_personcode')
        },
        success: function (resp) {
            var data = Ext.decode(resp.responseText);//后台返回的值
            taskId = data.taskId;
            V_STEPCODE = data.TaskDefinitionKey;
            QueryNextPer();
        },
        failure: function (response) {
            Ext.MessageBox.show({
                title: '错误',
                msg: response.responseText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    })
}

function QueryNextPer() {
    Ext.data.StoreManager.lookup('fzPerStore').load({
        params: {
            V_V_ORGCODE: V_V_ORGCODE,
            V_V_DEPTCODE: V_V_DEPTCODE,
            V_V_REPAIRCODE: '',
            V_V_FLOWTYPE: 'YearPlan',
            V_V_FLOW_STEP: V_STEPCODE,
            V_V_PERCODE: Ext.util.Cookies.get('v_personcode'),
            V_V_SPECIALTY: V_V_SPECIALTY,
            V_V_WHERE: '上报设备部'
        }
    });
}

function OnBtnUp() {
    Ext.getBody().mask('加载中，请稍后！');
    var spyj = '';
    if (Ext.getCmp('spyj').getValue() == '' || Ext.getCmp('spyj').getValue() == null) {
        spyj = '通过';
    } else {
        spyj = Ext.getCmp('spyj').getValue();
    }

    Ext.Ajax.request({
        url: AppUrl + 'Activiti/TaskComplete',
        type: 'ajax',
        method: 'POST',
        params: {
            taskId: taskId,
            idea: '通过',
            parName: [V_NEXT_SETP, "flow_yj"],
            parVal: [Ext.getCmp('fzPer').getValue(), spyj],
            processKey: processKey,
            businessKey: Guid,
            V_STEPCODE: V_STEPCODE,
            V_STEPNAME: V_STEPNAME,
            V_IDEA: '请审批！',
            V_NEXTPER: Ext.getCmp('fzPer').getValue(),
            V_INPER: Ext.util.Cookies.get('v_personcode')
        },
        success: function (response) {
            var resp = Ext.decode(response.responseText);

            if (resp.ret == '任务提交成功') {
                Ext.Ajax.request({
                    url: AppUrl + 'hp/PRO_ACTIVITI_FLOW_AGREE',
                    method: 'POST',
                    async: false,
                    params: {
                        'V_V_ORDERID': Guid,
                        'V_V_PROCESS_NAMESPACE': 'YearPlan',
                        'V_V_PROCESS_CODE': processKey,
                        'V_V_STEPCODE': V_STEPCODE,
                        'V_V_STEPNEXT_CODE': V_NEXT_SETP
                    },
                    success: function (ret) {
                        var resp = Ext.JSON.decode(ret.responseText);
                        Ext.getBody().unmask();
                        if (resp.V_INFO == 'success') {
                            window.opener.QueryTabY();
                            window.opener.QuerySum();
                            window.opener.QueryGrid();
                            window.opener.OnPageLoad();
                            window.close();
                        }
                    }
                });
            }
        },
        failure: function (response) {//访问到后台时执行的方法。
            Ext.getBody().unmask();
            Ext.MessageBox.show({
                title: '错误',
                msg: response.responseText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            })
        }
    })
}

function OnBtnSelC(s, record) {
    cGuid = record.data.V_GUID;
    Ext.Ajax.request({
        url: AppUrl + 'PM_06/PRO_YEAR_PLAN_C_SEL',
        method: 'POST',
        async: false,
        params: {
            V_V_GUID: record.data.V_GUID
        },
        success: function (resp) {
            var resp = Ext.decode(resp.responseText);
            if (resp.list != null) {
                if (resp.list.length > 0) {
                    Ext.getCmp('year').select(resp.list[0].V_YEAR);
                    Ext.getCmp('yearName').setValue(resp.list[0].V_YEARNAME);
                    Ext.getCmp('njhnr').setValue(resp.list[0].V_YEARCOUNT);
                    QueryCombo(resp.list[0]);
                    /* Ext.getCmp('ck').select(resp.list[0].V_ORGCODE);
                     Ext.getCmp('zyq').select(resp.list[0].V_DEPTCODE);
                     Ext.getCmp('cx').select(resp.list[0].V_CXCODE);
                     Ext.getCmp('zy').select(resp.list[0].V_ZY);
                     Ext.getCmp('equ').select(resp.list[0].V_EQUCODE);*/
                    Ext.getCmp('jxnr').setValue(resp.list[0].V_COUNT);
                    Ext.getCmp('jhtjsj').setValue(resp.list[0].V_JHTJSJ.split(" ")[0]);
                    if (resp.list[0].V_JHTJSJ.split(" ").length == 1) {
                        Ext.getCmp('jhtjsjxs').setValue("0");
                    } else {
                        Ext.getCmp('jhtjsjxs').setValue(resp.list[0].V_JHTJSJ.split(" ")[1].split(":")[0]);
                    }

                    Ext.getCmp('jhgq').setValue(resp.list[0].V_JHGQ);
                }
            }
        }
    });
}

function QueryFirstData(YearChildGuid) {
    Ext.Ajax.request({
        url: AppUrl + 'PM_06/PRO_YEAR_PLAN_C_SEL',
        method: 'POST',
        async: false,
        params: {
            V_V_GUID: YearChildGuid
        },
        success: function (resp) {
            var resp = Ext.decode(resp.responseText);
            if (resp.list != null) {
                if (resp.list.length > 0) {
                    Ext.getCmp('year').select(resp.list[0].V_YEAR);
                    Ext.getCmp('yearName').setValue(resp.list[0].V_YEARNAME);
                    Ext.getCmp('njhnr').setValue(resp.list[0].V_YEARCOUNT);
                    QueryCombo(resp.list[0]);
                    /* Ext.getCmp('ck').select(resp.list[0].V_ORGCODE);
                     Ext.getCmp('zyq').select(resp.list[0].V_DEPTCODE);
                     Ext.getCmp('cx').select(resp.list[0].V_CXCODE);
                     Ext.getCmp('zy').select(resp.list[0].V_ZY);
                     Ext.getCmp('equ').select(resp.list[0].V_EQUCODE);*/
                    Ext.getCmp('jxnr').setValue(resp.list[0].V_COUNT);
                    Ext.getCmp('jhtjsj').setValue(resp.list[0].V_JHTJSJ.split(" ")[0]);
                    if (resp.list[0].V_JHTJSJ.split(" ").length == 1) {
                        Ext.getCmp('jhtjsjxs').setValue("0");
                    } else {
                        Ext.getCmp('jhtjsjxs').setValue(resp.list[0].V_JHTJSJ.split(" ")[1].split(":")[0]);
                    }

                    Ext.getCmp('jhgq').setValue(resp.list[0].V_JHGQ);
                }
            }
        }
    });
}


function QueryCombo(ComboData){
    Ext.data.StoreManager.lookup('ckStore').load({
        params:{
            'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode'),
            'V_V_DEPTCODE': Ext.util.Cookies.get('v_orgCode'),
            'V_V_DEPTCODENEXT': '%',
            'V_V_DEPTTYPE': '基层单位'
        }
    })
    Ext.data.StoreManager.lookup('ckStore').on('load', function () {
        Ext.getCmp('ck').select(ComboData.V_ORGCODE);
        Ext.data.StoreManager.lookup('zyqStore').load({
            params: {
                'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode'),
                'V_V_DEPTCODE': Ext.getCmp('ck').getValue(),
                'V_V_DEPTCODENEXT': '%',
                'V_V_DEPTTYPE': '主体作业区'
            }
        });
    });

    Ext.data.StoreManager.lookup("zyqStore").on('load', function () {
        Ext.getCmp('zyq').select(ComboData.V_DEPTCODE);
        Ext.data.StoreManager.lookup('cxStore').load({
            params: {
                'V_V_ORGCODE': Ext.getCmp('ck').getValue(),
                'V_V_DEPTCODE': Ext.getCmp('zyq').getValue(),
                'V_V_CXNAME': '%'
            }
        });

    });

    Ext.data.StoreManager.lookup('cxStore').on('load', function () {
        Ext.getCmp('cx').select(ComboData.V_CXCODE);
        Ext.data.StoreManager.lookup('equStore').load({
            params: {
                V_V_CXCODE: Ext.getCmp('cx').getValue(),
                V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode'),
                V_V_DEPTCODE: Ext.getCmp('zyq').getValue()
            }
        });
    })

    Ext.data.StoreManager.lookup('equStore').on('load', function () {
        Ext.getCmp('equ').select(ComboData.V_EQUCODE);
        Ext.data.StoreManager.lookup('zyStore').load();
    });

    Ext.data.StoreManager.lookup('zyStore').on('load', function () {
        Ext.getCmp('zy').select(ComboData.V_ZY);
    });

}
