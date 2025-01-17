var mingtian = new Date();
mingtian.setDate(mingtian.getDate()+1);
var V_GUID = "" ;
var zyStoreload = false;
var dt = new Date();
var thisYear = dt.getFullYear();
var  tomorrowYear = dt.getFullYear() + 1;
var years = [];
for (var i = 2012; i <= tomorrowYear; i++)
    years.push({
        displayField : i,
        valueField : i
    });
var V_WEEKPLAN_GUID = null;
if (location.href.split('?')[1] != undefined) {
    V_WEEKPLAN_GUID = Ext.urlDecode(location.href.split('?')[1]).V_WEEKPLAN_GUID;
}
var V_PLANTYPE = null;
if (location.href.split('?')[1] != undefined) {
    V_PLANTYPE = Ext.urlDecode(location.href.split('?')[1]).V_PLANTYPE;
}
var YEAR = null;
if (location.href.split('?')[1] != undefined) {
    YEAR = Ext.urlDecode(location.href.split('?')[1]).YEAR;
}
var MONTH = null;
if (location.href.split('?')[1] != undefined) {
    MONTH = Ext.urlDecode(location.href.split('?')[1]).MONTH;
}
var WEEK = null;
if (location.href.split('?')[1] != undefined) {
    WEEK = Ext.urlDecode(location.href.split('?')[1]).WEEK;
}
var V_ORGCODE = null;
if (location.href.split('?')[1] != undefined) {
    V_ORGCODE = Ext.urlDecode(location.href.split('?')[1]).V_ORGCODE;
}
var V_DEPTCODE = null;
if (location.href.split('?')[1] != undefined) {
    V_DEPTCODE = Ext.urlDecode(location.href.split('?')[1]).V_DEPTCODE;
}
var stateData=[{ displayField:'全部', valueField:'%'},{ displayField:'编辑', valueField:'编辑'},{ displayField:'审批中', valueField:'审批中'},{ displayField:'审批通过', valueField:'审批通过'},{ displayField:'审批驳回', valueField:'审批驳回'}];
var KSTIME=null;
if(location.href.split('?')[1]!=undefined){
    KSTIME=Ext.urlDecode(location.href.split('?')[1]).KSTIME;
}

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
    // Ext.getBody().mask('<p>页面载入中...</p>');//页面笼罩效果

    var sqxzt =Ext.create("Ext.data.Store", {
        autoLoad: true,
        storeId: 'sqxzt',
        fields: ['I_ID', 'V_SOURCECODE', 'V_SOURCENAME', 'V_SOURCETABLE', 'V_SOURCEREMARK', 'I_ORDER'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'qx/PRO_DEFECT_PART_TYPE_SEL',
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
        pageSize: 100,
        autoLoad: false,
        fields: ['D_DEFECTDATE', 'V_DEFECTLIST', 'V_EQUNAME',
            'V_EQUSITE', 'V_DEPTNAME', 'V_PERNAME', 'V_IDEA',
            'V_STATENAME', 'V_SOURCENAME', 'V_SOURCEID',
            'D_INDATE', 'V_PERCODE', 'V_GUID', 'V_STATECODE',
            'V_STATECOLOR', 'V_ORDERID', 'V_EQUTYPECODE', 'V_SOURCECODE',
            'D_BE_SJ', 'D_EN_SJ', 'V_SOURCE_GRADE','WBSCODE'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'dxfile/PRO_DEFECT_PART_DATA_SEL_N',
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

    var inputPanel = Ext.create('Ext.Panel', {
        id : 'inputPanel',
        header : false,
        frame : true,
        layout : 'column',
        style: 'background-color:#FFFFFF',
        baseCls: 'my-panel-no-border',
        defaults : {
            labelAlign : 'right',
            //labelWidth : 100,
            //inputWidth : 240,
            margin : '4,0,0,0'
        },
        items : [ {
            id: 'qxzt',
            xtype: 'combo',
            store: sqxzt,
            editable: false,
            fieldLabel: '缺陷类型',
            labelWidth:70,
            width: 180,
            displayField: 'V_SOURCENAME',
            valueField: 'V_SOURCECODE',
            queryMode: 'local',
            baseCls: 'margin-bottom'
        },{
            xtype : 'button',
            text : '查询',
            margin: '5 0 5 5',
            handler : _selectOverhaulApply
        },{
            xtype: 'button',
            text: '选择',
            margin: '5 0 5 5',
            handler : Select
        } ]
    });

    var overhaulApplyPanel = Ext.create('Ext.grid.Panel', {
        id : 'overhaulApplyPanel',
        store : gridStore,
        frame : true,
        border: false,
        columnLines: true,
        /*selModel : {
         selType : 'checkboxmodel',
         mode : 'SINGLE'
         },*/
        selType: 'checkboxmodel',
        columns : [ {
            text : '序号',
            xtype : 'rownumberer',
            width : 50,
            sortable : false
        },{
            text : 'WBS编码',
            dataIndex : 'WBSCODE',
            align : 'center',
            width : 100,
            renderer : CreateGridColumnTd
        }, {
            text : '单位',
            dataIndex : 'V_DEPTNAME',
            align : 'center',
            width : 150,
            renderer : CreateGridColumnTd
        }, {
            text : '缺陷状态',
            dataIndex : 'V_STATENAME',
            align : 'center',
            width : 150,
            renderer : CreateGridColumnTd
        }, {
            text : '缺陷类型',
            dataIndex : 'V_SOURCENAME',
            align : 'center',
            width : 150,
            renderer : CreateGridColumnTd
        }, {
            text : '缺陷日期',
            dataIndex : 'D_DEFECTDATE',
            align : 'center',
            width : 150,
            renderer : CreateGridColumnTime
        }, {
            text : '缺陷明细',
            dataIndex : 'V_DEFECTLIST',
            align : 'center',
            width : 400,
            renderer : CreateGridColumnTd
        }, {
            text : '设备',
            dataIndex : 'V_EQUNAME',
            align : 'center',
            width : 150,
            renderer : CreateGridColumnTd
        }, {
            text : '设备位置',
            dataIndex : 'V_EQUSITE',
            align : 'center',
            width : 200,
            renderer : CreateGridColumnTd
        }, {
            text : '负责人',
            dataIndex : 'V_PERNAME',
            align : 'center',
            width : 150,
            renderer : CreateGridColumnTd
        }, {
            text : '处理意见',
            dataIndex : 'V_IDEA',
            align : 'center',
            renderer : CreateGridColumnTd
        }],
        listeners : {
            itemdblclick : itemclick
        },
        bbar: [{
            id: 'page',
            xtype: 'pagingtoolbar',
            dock: 'bottom',
            displayInfo: true,
            displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
            emptyMsg: '没有记录',
            store: 'gridStore'
        }]
    });

    Ext.create('Ext.container.Viewport', {
        layout : {
            type : 'border',
            regionWeights : {
                west : -1,
                north : 1,
                south : 1,
                east : -1
            }
        },
        items : [ {
            region : 'north',
            border : false,
            items : [ inputPanel]
        }, {
            region : 'center',
            layout : 'fit',
            border : false,
            items : [ overhaulApplyPanel ]
        } ]
    });

    Ext.data.StoreManager.lookup('gridStore').on('beforeload', function (store) {
        store.proxy.extraParams = {
            V_V_TYPE: Ext.getCmp('qxzt').getValue(),
            V_V_INPER: Ext.util.Cookies.get('v_personcode'),
            V_V_STATE: '10',
            V_V_PAGE: Ext.getCmp('page').store.currentPage,
            V_V_PAGESIZE: Ext.getCmp('page').store.pageSize
        }
    });

    // _init;
    // _selectOverhaulApply();
    Ext.StoreManager.lookup('sqxzt').on('load', function () {
        Ext.getCmp('qxzt').store.insert(0, {'V_SOURCECODE': '%', 'V_SOURCENAME': '全部'});
        Ext.getCmp('qxzt').select(Ext.StoreManager.lookup('sqxzt').getAt(0));
        _selectOverhaulApply();
    });
    // sqxzt.on('load',function(){
    //     Ext.ComponentManager.get("qxzt").store.insert(0,{
    //         'V_SOURCECODE':'%',
    //         'V_SOURCENAME':'全部'
    //     })
    // });
    // Ext.getCmp('qxzt').select(sqxzt.getAt(0));
});

// function _init() {
//     if(zyStoreload)
//     {
//         zyStoreload = false;
//         Ext.getBody().unmask();//去除页面笼罩
//     }
// }


function _selectOverhaulApply() {
    var gridStore = Ext.data.StoreManager.lookup('gridStore');
    gridStore.proxy.extraParams = {
        V_V_TYPE: Ext.getCmp('qxzt').getValue(),
        V_V_INPER: Ext.util.Cookies.get('v_personcode'),
        V_V_STATE: '10',
        V_V_PAGE: Ext.getCmp('page').store.currentPage,
        V_V_PAGESIZE: Ext.getCmp('page').store.pageSize

    };
    gridStore.currentPage = 1;
    gridStore.load();
}



function OnBtnSxQx() {
    var length = Ext.getCmp('overhaulApplyPanel').getSelectionModel().getSelection().length;
    if (length != 1) {
        alert('请选择一条数据进行修改');
    } else {
        var GUID = Ext.getCmp('overhaulApplyPanel').getSelectionModel().getSelection()[0].data.V_GUID;
        var owidth = window.document.body.offsetWidth - 200;
        var oheight = window.document.body.offsetHeight - 100;
        var ret = window.open(AppUrl + "page/PM_070201/index.html?V_GUID=" + GUID, '', 'height=' + oheight + ',width=' + owidth + ',top=10px,left=10px,resizable=yes');
    }
}
function createWorkorder(){

    var records = Ext.getCmp('overhaulApplyPanel').getSelectionModel().getSelection();//获取选中的数据

    if (records.length == 0) {//判断是否选中数据
        Ext.MessageBox.show({
            title: '提示',
            msg: '请选择一条数据',
            buttons: Ext.MessageBox.OK,
            icon: Ext.MessageBox.WARNING
        });
        return false;
    }


    for (i = 0; i < records.length; i++) {

        console.log("V_GUID="+records[i].data.V_GUID);
        console.log("V_EQUTYPECODE="+records[i].data.V_EQUTYPECODE);
        console.log("V_SOURCECODE="+records[i].data.V_SOURCECODE);
        if(records[i].data.V_STATECODE=='10'){
            var param="";
            try {
                var owidth = window.document.body.offsetWidth-200;
                var oheight = window.document.body.offsetHeight-100 ;
                if(url_guid!=undefined){
                    param="&&url_guid="+url_guid;
                }else{
                    param="";
                }
                var ret = window.open(AppUrl+'page/PM_090201/index.html?V_GUID='
                    + records[i].data.V_GUID + '&V_EQUTYPECODE='+records[i].data.V_EQUTYPECODE+"&V_SOURCECODE="+records[i].data.V_SOURCECODE+param, '', 'height=' + oheight + ',width=' + owidth + ',top=10px,left=10px,resizable=yes');

            } catch (e) {
                var owidth = window.document.body.offsetWidth-200;
                var oheight = window.document.body.offsetHeight-100 ;
                if(url_guid!=undefined){
                    param="&&url_guid="+url_guid;
                }else{
                    param="";
                }
                var ret = window.open(AppUrl+'page/PM_090201/index.html?V_GUID='
                    + records[i].data.V_GUID+"&V_SOURCECODE="+records[i].data.V_SOURCECODE + ''+param, '', 'height=' + oheight + ',width=' + owidth + ',top=10px,left=10px,resizable=yes');

            }
        }else{
            Ext.MessageBox.alert('操作信息', '该缺陷已下票，请重新选择！');
            return;
        }
    }




}

function CreateGridColumnTime(value, metaData, record, rowIndex, colIndex, store) {
    var time=value.split('.')[0];
    //return time;
    return '<div data-qtip="' + time + '" >' + time + '</div>';
}


function CreateGridColumnTd(value, metaData, record, rowIndex, colIndex, store) {
    return '<div data-qtip="' + value + '" >' + value + '</div>';
}



function itemclick(s, record, item, index, e, eOpts) {
    var owidth = window.document.body.offsetWidth - 200;
    var oheight = window.document.body.offsetHeight - 100;
    var ret = window.open(AppUrl + "page/PM_070301/index1.html?v_guid="
        + Ext.getStore("gridStore").getAt(index).get("V_GUID"), '', 'height=' + oheight + ',width=' + owidth + ',top=10px,left=10px,resizable=yes');
}

function Select(){
    v_wbs="";
    var seldata = Ext.getCmp('overhaulApplyPanel').getSelectionModel().getSelection();
    if (seldata.length==0) {
        Ext.Msg.alert('操作提示','请选择一条数据！');
        return false;
    }

    for (var j = 0; j < seldata.length; j++) {
        if(seldata[0].data.V_EQUNAME!=seldata[j].data.V_EQUNAME){
            alert("请选择同一设备缺陷");
            return;
        }
    }

    for (var z=0;z<seldata.length;z++){
        if(seldata[z].data.WBSCODE!=""){
            if(v_wbs==""){
                v_wbs=seldata[z].data.WBSCODE;
            }else{
                if(v_wbs!=seldata[z].data.WBSCODE){
                    alert('请选择同一条放行计划')
                    return;
                }
            }
        }
    }

    var num = 0;
    Ext.Ajax.request({
        url: AppUrl + 'cjy/PM_DEFECTTOWORKORDER_DEL',
        method: 'POST',
        async: false,
        params: {
            V_V_WEEK_GUID: V_WEEKPLAN_GUID
        },
        success: function (resp) {
            var resp = Ext.decode(resp.responseText);
            if (resp.V_INFO == 'success') {

                for (var i = 0; i < seldata.length; i++) {
                    Ext.Ajax.request({
                        url: AppUrl + 'cjy/PM_DEFECTTOWORKORDER_SET',
                        method: 'POST',
                        async: false,
                        params: {
                            V_V_DEFECT_GUID: seldata[i].data.V_GUID,
                            V_V_WEEK_GUID: V_WEEKPLAN_GUID
                        },
                        success: function (resp) {
                            var resp = Ext.decode(resp.responseText);
                            if (resp.V_INFO == 'success') {
                                num++;
                            }

                        }
                    });
                }
            }else{
                alert("子数据清除错误");
            }

        }
    });

    var V_EQUTYPECODE=seldata[0].raw.V_EQUTYPECODE;;
    var V_EQUCODE=seldata[0].raw.V_EQUCODE;
    if (num == seldata.length) {
        var owidth = window.document.body.offsetWidth - 200;
        var oheight = window.document.body.offsetHeight - 40;
        var ret = window.open(AppUrl + "page/PM_03010315/index.html?V_WEEKPLAN_GUID=" + V_WEEKPLAN_GUID +
            "&V_PLANTYPE=" + V_PLANTYPE +
            "&YEAR=" + YEAR +
            "&MONTH=" + MONTH +
            "&WEEK=" + WEEK +
            "&V_ORGCODE=" + V_ORGCODE +
            "&V_DEPTCODE=" + V_DEPTCODE+
            "&V_EQUTYPECODE=" + V_EQUTYPECODE+
            "&V_EQUCODE=" + V_EQUCODE+
            "&KSTIME="+KSTIME, '', 'height=' + oheight + ',width=' + owidth + ',top=10px,left=10px,resizable=yes');
        // window.close();
    } else {
        alert("缺陷添加错误");
    }
}

function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
function Winclose(){
    window.close();
}