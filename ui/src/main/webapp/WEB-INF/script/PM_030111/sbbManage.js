/**
 * Created by lxm on 2017/8/14.
 */
var date = new Date();
var dt = new Date();
var thisYear = dt.getFullYear();
var years = [];
var weeks = [];
var months = [];
for (var i = 1; i <= 6; i++) weeks.push({displayField: i, valueField: i});

for (var i = 2014; i <= thisYear + 1; i++) years.push({displayField: i, valueField: i});

for (var i = 1; i <= 12; i++) months.push({displayField: i, valueField: i});

var yearStore = Ext.create("Ext.data.Store", {
    storeId: 'yearStore',
    fields: ['displayField', 'valueField'],
    data: years,
    proxy: {
        type: 'memory',
        reader: {type: 'json'}
    }
});
var monthStore = Ext.create("Ext.data.Store", {
    storeId: 'monthStore',
    fields: ['displayField', 'valueField'],
    data: months,
    proxy: {
        type: 'memory',
        reader: {type: 'json'}
    }
});
var weekStore = Ext.create("Ext.data.Store", {
    storeId: 'weekStore',
    fields: ['displayField', 'valueField'],
    data: weeks,
    proxy: {
        type: 'memory',
        reader: {type: 'json'}
    }
});
var ckstore = Ext.create("Ext.data.Store", {
    autoLoad: true,
    storeId: 'ckstore',
    fields: ['V_SAP_WORK', 'V_SAP_JHGC', 'V_DEPTNAME', 'V_DEPTCODE_UP', 'V_DEPTCODE', 'V_SAP_YWFW', 'V_SAP_DEPT'],
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
            'V_V_DEPTCODE': Ext.util.Cookies.get('v_deptcode'),
            'V_V_DEPTCODENEXT': '%',
            'V_V_DEPTTYPE': '基层单位'
        }
    }
});
var ztstore = Ext.create("Ext.data.Store", {
    autoLoad: true,
    storeId: 'ztstore',
    fields: ['V_BASECODE', 'V_BASENAME'],
    proxy: {
        type: 'ajax',
        async: false,
        url: AppUrl + 'lxm/pro_pm_basedic_zy',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'list'
        },
        extraParams: {
            'V_V_PLAN': 'PLAN/WORK'
        }
    }
});

var zyqstore = Ext.create("Ext.data.Store", {
    autoLoad: false,
    storeId: 'zyqstore',
    fields: ['V_SAP_WORK', 'V_SAP_JHGC', 'V_DEPTNAME', 'V_DEPTCODE_UP', 'V_DEPTCODE', 'V_SAP_YWFW', 'V_SAP_DEPT'],
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
var zyStore = Ext.create("Ext.data.Store", {
    autoLoad: false,
    storeId: 'zyStore',
    fields: ['V_MAJOR_CODE', 'V_MAJOR_NAME'],
    proxy: {
        type: 'ajax',
        async: false,
        url: AppUrl + 'PM_01/PM_04_PROJECT_MAJOR_SEL',
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
// var url_guid='';
// var url_deptcode;
// var url_zy;
// if (location.href.split('?')[1] != undefined) {
//     url_guid = Ext.urlDecode(location.href.split('?')[1]).v_guid_dx;
//     url_deptcode = Ext.urlDecode(location.href.split('?')[1]).v_deptcode;
//     url_zy = Ext.urlDecode(location.href.split('?')[1]).v_specialty;
// }
var panel = Ext.create('Ext.form.Panel', {
    id: 'panellow',
    region: 'north',
    // height: 100,
    defaults: {
        style: 'margin:5px 0px 5px 5px'
        , labelAlign: 'right'
    },
    layout: 'column',
    frame: true,
    items: [
        {
            id: 'year', xtype: 'combo', labelWidth: 80, fieldLabel: '年份',
            // margin:'5px 0px 5px 5px',
            // labelAlign:'right',
            store: yearStore, displayField: 'displayField', valueField: 'valueField',
            value: '', editable: false, queryMode: 'local'
        },
        {
            id: 'month', store: monthStore, xtype: 'combo', fieldLabel: '月份',
            // margin:'5px 0px 5px 5px',
            value: '', labelWidth: 80,
            // labelAlign:'right',
            editable: false,
            displayField: 'displayField', valueField: 'valueField'
        },
        {
            id: 'week', store: weekStore, xtype: 'combo', fieldLabel: '周',
            // margin:'5px 0px 5px 5px',
            value: '', labelWidth: 80,
            // labelAlign:'right',
            editable: false,
            displayField: 'displayField', valueField: 'valueField'
        },
        // {xtype : 'displayfield', id : 'zks', fieldLabel : '本周开始时间', labelWidth : 80, width:243,labelAlign : 'right'},
        // {xtype : 'displayfield', id : 'zjs', fieldLabel : '本周结束时间', labelWidth : 80, width:243,labelAlign : 'right'},
        {
            id: 'ck',
            xtype: 'combo',
            store: ckstore,
            editable: false,
            fieldLabel: '厂矿',
            labelWidth: 80,
            displayField: 'V_DEPTNAME',
            valueField: 'V_DEPTCODE',
            queryMode: 'local'
            // ,margin:'5px 0px 5px 5px'
            //, baseCls: 'margin-bottom'
        }, {
            id: 'zyq',
            xtype: 'combo',
            store: zyqstore,
            editable: false,
            fieldLabel: '作业区',
            labelWidth: 80,
            displayField: 'V_DEPTNAME',
            valueField: 'V_DEPTCODE',
            queryMode: 'local'
            // ,margin:'5px 0px 5px 5px'
            // ,baseCls: 'margin-bottom'
        }, {
            xtype: 'combo',
            id: 'sblx',
            fieldLabel: '设备类型',
            editable: false,
            labelWidth: 80,
            displayField: 'V_EQUTYPENAME',
            valueField: 'V_EQUTYPECODE',
            store: sblxStore,
            queryMode: 'local'
            // ,margin:'5px 0px 5px 5px'
            , listConfig: {
                mixWidth: 120
            }
        },
        {
            xtype: 'combo',
            id: 'sbmc',
            fieldLabel: '设备名称',
            editable: false,
            labelAlign: 'right',
            labelWidth: 80,
            displayField: 'V_EQUNAME',
            valueField: 'V_EQUCODE',
            store: sbmcStore,
            queryMode: 'local'
            // ,margin:'5px 0px 5px 5px'
        }, {
            id: 'zy',
            xtype: 'combo',
            store: zyStore,
            editable: false,
            fieldLabel: '专业',
            labelWidth: 80,
            displayField: 'V_MAJOR_CODE',
            valueField: 'V_MAJOR_NAME',
            queryMode: 'local'
            // ,margin:'5px 0px 5px 5px'
            // baseCls: 'margin-bottom'
        },
        // {
        //     id: 'zt',
        //     xtype: 'combo',
        //     store: ztstore,
        //     editable: false,
        //     fieldLabel: '状态',
        //     labelWidth: 80,
        //   //  hidden:true,
        //     displayField: 'V_BASENAME',
        //     valueField: 'V_BASECODE',
        //     queryMode: 'local'
        //     // ,margin:'5px 0px 5px 5px'
        //     // baseCls: 'margin-bottom'
        // },
        {
            id: 'seltext',
            xtype: 'textfield',
            width: 158,
            emptyText: '检修明细模糊搜索'
            , margin: '5px 0px 5px 90px'
        }, {
            id: 'query',
            xtype: 'button',
            icon: imgpath + '/search.png',
            text: '查询',
            width: 65,
            handler: QueryGrid
            // ,margin:'5px 0px 5px 50px'
        }, {
            xtype: 'button',
            text: '导出excel',
            style: ' margin: 5px 0px 5px 5px',
            icon: imgpath + '/excel.gif',
            width: 85,
            listeners: {
                click: OnClickExcelButton
            }}
            ,{
            xtype: 'button',
            text: '导入excel',
            style: ' margin: 5px 0px 5px 5px',
            icon: imgpath + '/grid.png',
            width: 85,
            listeners: {
                click: OnClickDrExcelButton
            }
        }
    ]
});
Ext.onReady(function () {
    Ext.QuickTips.init();
    var gridStore = Ext.create("Ext.data.Store", {
        autoLoad: false,
        storeId: 'gridStore',
        pageSize: 20,
        fields: [
            'I_ID',
            'V_GUID',
            'V_YEAR',
            'V_MONTH',
            'V_WEEK',
            'V_ORGCODE',
            'V_ORGNAME',
            'V_DEPTCODE',
            'V_DEPTNAME',
            'V_EQUTYPECODE',
            'V_EQUTYPENAME',
            'V_EQUCODE',
            'V_EQUNAME',
            'V_REPAIRMAJOR_CODE',
            'V_CONTENT',
            'V_ENDTIME',
            'V_STARTTIME',
            'V_HOUR',
            'V_REPAIRDEPT_CODE',
            'V_REPAIRDEPT_NAME',
            'V_MANNAME',
            'V_TEL',
            'V_INDATE',
            'V_INPER',
            'V_INPERNAME',
            'V_FLOWCODE',
            'V_FLOWORDER',
            'V_FLOWTYPE',
            'V_ORDER',
            'V_BZ',
            'V_JHMX_GUID',
            'V_OTHERPLAN_GUID',
            'V_OTHERPLAN_TYPE',
            'V_WEEKID',
            'V_STATE',
            'V_WORKFLAG_NAME',
            'V_STATENAME',
            'DRSIGN'
        ],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'dxfile/PM_03_PLAN_WEEK_SEL2',
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

    var grid = Ext.create('Ext.grid.Panel', {
        region: 'center',
        width: '100%',
        store: gridStore,
        id: 'grid',
        height: 260,
        style: 'margin:0px 0px 5px 0px',
        //autoScroll: true,
        columnLines: true,
        columns: [
            {
                xtype: 'rownumberer',
                text: '序号',
                width: 50,
                align: 'center'
            },
            {text: '计划状态', width: 200, dataIndex: 'V_STATENAME', align: 'center', renderer: dataCss},
            {
                text: '工单详情',
                dataIndex: 'V_ORDERID',
                width: 150,
                align: 'center',
                renderer: function (value, metaData, record) {
                    return '<a href="#" onclick="OnClickGrid(\'' + record.data.V_GUID + '\')">' + '工单详情' + '</a>';
                }
            },
            {text: '设备名称', width: 200, dataIndex: 'V_EQUNAME', align: 'center', renderer: dataCss},
            {text: '专业', width: 200, dataIndex: 'V_REPAIRMAJOR_CODE', align: 'center', renderer: dataCss},
            {text: '检修内容', width: 200, dataIndex: 'V_CONTENT', align: 'center', renderer: dataCss},
            {text: '计划停机日期', width: 200, dataIndex: 'V_STARTTIME', align: 'center', renderer: rendererTime},
            {text: '计划竣工日期', width: 200, dataIndex: 'V_ENDTIME', align: 'center', renderer: rendererTime},
            {text: '计划工期', width: 200, dataIndex: 'V_HOUR', align: 'center', renderer: dataCss},
            {text: '厂矿', width: 200, dataIndex: 'V_ORGNAME', align: 'center', renderer: dataCss},
            {text: '车间名称', width: 200, dataIndex: 'V_DEPTNAME', align: 'center', renderer: dataCss},
            {text: '录入人', width: 200, dataIndex: 'V_INPERNAME', align: 'center', renderer: dataCss}
            , {text: '录入时间', width: 200, dataIndex: 'V_INDATE', align: 'center', renderer: rendererTime}
            ,{text:'导入标示符',align:'center',width:150,dataIndex:'DRSIGN',hidden:true}
        ]
        , bbar: [{
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
        //id: "id",
        layout: 'border',
        //frame:true,
        height: 600,
        //border:false,
        items: [panel, grid]
    });

    Ext.getCmp('week').select(getWeekOfMonth());
    ckstore.on("load", function () {
        // if(url_deptcode!=undefined){
        //     Ext.getCmp("ck").select(url_deptcode.substring(0,4));
        // }else{
        Ext.data.StoreManager.lookup('ckstore').insert(0, {V_DEPTNAME: '全部', V_DEPTCODE: '%'});
        Ext.getCmp("ck").select(ckstore.getAt(0));
        // }


    });
    // ztstore.on("load", function () {
    //     Ext.getCmp("zt").select(ztstore.getAt(0));
    // });

    Ext.ComponentManager.get("ck").on("change", function () {
        Ext.ComponentManager.get('zyq').getStore().removeAll();
        zyqstore.load({
            params: {
                V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode'),
                V_V_DEPTCODE: Ext.getCmp('ck').getValue(),
                V_V_DEPTCODENEXT: Ext.util.Cookies.get('v_deptcode'),
                V_V_DEPTTYPE: '[主体作业区]'
            }
        });
    });

    zyqstore.on("load", function () {
        // if(url_deptcode!=undefined){
        //     Ext.data.StoreManager.lookup('zyqstore').insert(0,{V_DEPTNAME:'全部',V_DEPTCODE:'%'});
        //     Ext.getCmp("zyq").select(url_deptcode);
        // }else{
        Ext.data.StoreManager.lookup('zyqstore').insert(0, {V_DEPTNAME: '全部', V_DEPTCODE: '%'});
        Ext.getCmp("zyq").select(zyqstore.getAt(0));
        // }
    });

    Ext.getCmp('zyq').on('change', function () {
        Ext.data.StoreManager.lookup('sblxStore').load({
            params: {
                V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode'),
                V_V_DEPTCODENEXT: Ext.getCmp('zyq').getValue()
            }
        });

    });

    Ext.getCmp('sblx').on('change', function () {
        Ext.data.StoreManager.lookup('sbmcStore').load({
            params: {
                v_v_personcode: Ext.util.Cookies.get('v_personcode'),
                v_v_deptcodenext: Ext.getCmp('zyq').getValue(),
                v_v_equtypecode: Ext.getCmp('sblx').getValue()
            }
        });
    });
    //设备类型加载监听
    Ext.data.StoreManager.lookup('sblxStore').on('load', function () {
        Ext.getCmp("sblx").select('%');
    });
    //设备名称加载监听
    Ext.data.StoreManager.lookup('sbmcStore').on('load', function () {
        Ext.getCmp("sbmc").select(Ext.data.StoreManager.lookup('sbmcStore').getAt(0));
        QueryGrid();
    });
    zyStore.load({
        params: {}
    });
    Ext.data.StoreManager.lookup('zyStore').on('load', function () {
        Ext.data.StoreManager.lookup('zyStore').insert(0, {V_MAJOR_CODE: '全部', V_MAJOR_NAME: '%'});
        // if(url_zy!=undefined){
        //     Ext.getCmp('zy').select(url_zy);
        // }else{
        Ext.getCmp('zy').select(Ext.data.StoreManager.lookup('zyStore').getAt(0));

        // }

    });
    // Ext.getCmp('zks').setValue(getWeekStartDate());
    // Ext.getCmp('zjs').setValue(getWeekEndDate());
    Ext.getCmp('year').on('select', function () {
        //     Ext.getCmp('zks').setValue(getWeekStartDate());
        //     Ext.getCmp('zjs').setValue(getWeekEndDate());
        QueryGrid();
    });
    Ext.getCmp('month').on('select', function () {
        //     Ext.getCmp('zks').setValue(getWeekStartDate());
        //     Ext.getCmp('zjs').setValue(getWeekEndDate());
        QueryGrid();
    });
    Ext.getCmp('week').on('select', function () {
        //     Ext.getCmp('zks').setValue(getWeekStartDate());
        //     Ext.getCmp('zjs').setValue(getWeekEndDate());
        QueryGrid();
    });
    Ext.data.StoreManager.lookup('gridStore').on('beforeload', function (store) {
        store.proxy.extraParams = {
            V_V_YEAR: Ext.getCmp('year').getValue(),
            V_V_MONTH: Ext.getCmp('month').getValue(),
            V_V_WEEK: Ext.getCmp('week').getValue(),
            V_V_ORGCODE: Ext.getCmp('ck').getValue(),
            V_V_DEPTCODE: Ext.getCmp('zyq').getValue(),
            V_V_ZY: Ext.getCmp('zy').getValue(),
            V_V_EQUTYPE: Ext.getCmp('sblx').getValue(),
            V_V_EQUCODE: Ext.getCmp('sbmc').getValue(),
            V_V_CONTENT: Ext.getCmp('seltext').getValue() == "" ? "%" : Ext.getCmp('seltext').getValue(),
            V_V_FLOWTYPE: 'WORK',
            V_V_STATE: '30,31',//审批完成，已下票
            V_V_PAGE: Ext.getCmp('page').store.currentPage,
            V_V_PAGESIZE: Ext.getCmp('page').store.pageSize
        }
    });
    var drfilepanel=Ext.create("Ext.form.Panel",{
        id:'drfilepanel',
        border:false,
        region:'north',
        frame: true,
        height:45,
        layout: 'column',
        defaults : {
            style : 'margin:5px 0px 5px 5px',
            labelAlign : 'right'
        },
        items:[
            // {xtype:'combobox',id:'fjtype',store:ftypeStore,queryMode:'local',fieldLabel:'附件类型',valueField:'ID',displayField:'FNAME',width:260,labelAlign:'right',labelWidth:80,style:'margin:5px 2px 5px 5px',listeners:{select:function(){querymxfj(mx_code);}}},
            {
                xtype : 'filefield',
                id : 'upload',
                name : 'upload',
                fieldLabel : '文件上传',
                labelAlign:'right',
                width : 300,
                msgTarget : 'side',
                allowBlank : true,
                anchor : '100%',
                buttonText : '浏览....',
                // regex:/\.(xls|xlsx)$/,
                // regexText : "请上传Excel文档",
                style : ' margin: 20px 0px 20px 8px'
            // ,validator:function(value){
            //         // 文件类型判断
            //         if(value!=" ") {
            //             var arrType = value.split('.');
            //             var docType = arrType[arrType.length - 1].toLowerCase();
            //             if (docType == "xlsx" || docType == "xls") {
            //                 return true;
            //             }
            //             else {
            //                 return Ext.Msg.alert("提示", '文件类型必须为.xls或者.xlsx的excel文件');
            //             }
            //         }
            //     }
            }, {
                xtype : 'button',
                width : 60,
                text : '上传',
                style : ' margin: 20px 0px 20px 8px',
                handler : function () {
                    var drfilepan = Ext.getCmp('drfilepanel');
                    if(Ext.getCmp('upload').getValue()==''||Ext.getCmp('upload').getValue()==null||Ext.getCmp('upload').getValue()==undefined){
                        Ext.Msg.alert('提示信息', '请选择要的上传文件');
                        return;
                    }
                    else{
                        var arrType=Ext.getCmp('upload').getValue().split('.');
                        var docType = arrType[arrType.length - 1].toLowerCase();
                        if(docType == "xlsx" || docType == "xls"){
                            drfilepan.submit({
                                url: AppUrl + 'turntime/sbbImporteWeekExcel',
                                async: false,
                                method: 'POST',
                                params : {

                                    V_LOCKPER:Ext.util.Cookies.get('v_personcode'),
                                    V_LOCKPERNAME:Ext.util.Cookies.get('v_personname2')

                                },
                                success : function(fp, o) {
                                    if(o.result.success){
                                       Ext.getCmp('fjWindow').close();
                                       alert(o.result.RET);
                                       QueryGrid();
                                    }else{
                                        Ext.getCmp('fjWindow').close();
                                        alert(o.result.RET);
                                        QueryGrid();
                                    }
                                },
                                failure: function (fp, o) {
                                    if(o.result.success){
                                        Ext.getCmp('fjWindow').close();
                                        alert(o.result.RET);
                                        QueryGrid();
                                    }else{
                                        Ext.getCmp('fjWindow').close();
                                        alert(o.result.RET);
                                        QueryGrid();
                                    }
                                }
                            });
                        }
                        else {
                            return Ext.Msg.alert("提示", '文件类型必须为.xls或者.xlsx的excel文件');
                        }

                    }
                }
            }]
    });
    var fjWindow=Ext.create("Ext.window.Window",{
        id:'fjWindow',
        width:450,
        height:120,
        title:'附件导入窗口',
        frame:true,
        layout:'fit',
        closeAction:'hit',
        items:[drfilepanel]
    })
});



//第几周
function getWeekOfMonth() {//周一为起始
    var w = date.getDay() == 0 ? 7 : date.getDay();//星期
    var d = date.getDate();//日期

    var week = Math.ceil((d + 7 - w) / 7);//向上取整

    if (week == getWeeks()) {//为最后周
        if (date.getMonth() + 1 == 12) {//为最后月，月份年份均变化
            Ext.getCmp('year').select(date.getFullYear() + 1);
            Ext.getCmp('month').select(1);
        } else {//月份变化
            Ext.getCmp('year').select(date.getFullYear());
            Ext.getCmp('month').select(date.getMonth() + 2);
        }
        return 1;
    } else {
        Ext.getCmp('year').select(date.getFullYear());
        Ext.getCmp('month').select(date.getMonth() + 1);
        return week + 1;
    }

}

//当前月有几周
function getWeeks() {
    var str = date;
    var year = str.getFullYear();
    var month = str.getMonth() + 1;
    var lastday = new Date(year, month, 0);

    var w = lastday.getDay() == 0 ? 7 : lastday.getDay();//星期
    var d = lastday.getDate();//日期

    return Math.ceil((d + 7 - w) / 7);//向上取整

}



function QueryGrid() {
    Ext.getCmp('page').store.currentPage = 1;
    Ext.data.StoreManager.get('gridStore').load();
}


//月共几天
function getDaysOfMonth(year, month) {
    var month = parseInt(month, 10);
    var d = new Date(year, month, 0);
    return d.getDate();
}

// //本周开始时间
// function getWeekStartDate() {
//     var year=Ext.getCmp('year').getValue();
//     var month=Ext.getCmp('month').getValue();
//     var week=Ext.getCmp('week').getValue();
//     var dat=new Date(year,month-1,1);
//     var day=dat.getDay();
//     var date=dat.getDate()+(week-1)*7;
//     var hao=dat.getDate();
//     var days=getDaysOfMonth(year,month-1);//上月有几天
//     if(day==0){
//         day=7;
//     }
//     if(date<day){
//         hao=date+days-day+1;
//     }else{
//         hao=date-day+1;
//     }
//     var yue=dat.getMonth();
//     if(date<day){
//         yue=yue-1;
//     }
//     var nian=dat.getFullYear();
//     if(yue<0){
//         nian=nian-1;
//         yue=yue+12;
//     }
//     if(hao>getDaysOfMonth(year,month)){
//         hao=hao-getDaysOfMonth(year,month);
//         yue=yue+1;
//     }
//     if(yue>11){
//         nian==nian+1;
//     }
//     return nian+"-"+(yue+1)+"-"+hao;
// }
// //本周结束时间
// function getWeekEndDate(){
//     var year=Ext.getCmp('year').getValue();
//     var month=Ext.getCmp('month').getValue();
//     var week=Ext.getCmp('week').getValue();
//     var dat=new Date();
//     var dat=new Date(year,month-1,1);
//     var day=dat.getDay();
//     var date=dat.getDate()+(week-1)*7;
//     var hao=dat.getDate();
//     var days=getDaysOfMonth(year,month);//本月有几天
//     if(day==0){
//         day=7;
//     }
//     hao=date+(7-day);
//     var yue=dat.getMonth();
//     if(hao>days){
//         hao=hao-days;
//         yue=yue+1;
//     }
//     var nian=dat.getFullYear();
//     if(yue>11){
//         yue=yue-12;
//         nian=nian+1;
//     }
//     return nian+"-"+(yue+1)+"-"+hao;
// }
function _preViewProcess(businessKey) {

    var ProcessInstanceId = '';
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
            if (data.msg == 'Ok') {
                ProcessInstanceId = data.InstanceId;
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

function OnClickGrid(V_GUID) {
    var owidth = window.screen.availWidth;
    var oheight = window.screen.availHeight - 50;
    window.open(AppUrl + 'page/PM_0301030901/index.html?v_guid='
        + V_GUID, '', 'height=' + oheight + 'px,width= ' + owidth + 'px,top=50px,left=100px,resizable=yes');
}

function OnClickOtherGrid(otherguid, othertype) {
    var owidth = window.screen.availWidth;
    var oheight = window.screen.availHeight - 50;
    if (othertype == "") {
        alert('此计划没有关联项');
        return;
    }
    if (othertype == "MONTH") {
        window.open(AppUrl + 'page/PM_03010309/month_detail.html?monthguid='
            + otherguid, '', 'height=' + oheight + 'px,width= ' + owidth + 'px,top=50px,left=100px,resizable=yes');
    }
    if (othertype == "YEAR") {
        alert('该条计划关联年计划');
    }
}

function OnClickExcelButton() {
    var V_V_ORGCODE = Ext.getCmp('ck').getValue() == '%' ? '0' : Ext.getCmp('ck').getValue();
    var V_V_DEPTCODE = Ext.getCmp('zyq').getValue() == '%' ? '0' : Ext.getCmp('zyq').getValue();
    var V_V_ZY = Ext.getCmp('zy').getValue() == '%' ? '0' : Ext.getCmp('zy').getValue();
    var V_V_EQUTYPE = Ext.getCmp('sblx').getValue() == '%' ? '0' : Ext.getCmp('sblx').getValue();
    var V_V_EQUCODE = Ext.getCmp('sbmc').getValue() == '%' ? '0' : Ext.getCmp('sbmc').getValue();
    document.location.href = AppUrl + 'excel/ZJHSBBGL_EXCEL?V_V_YEAR=' + Ext.getCmp('year').getValue()
        + '&V_V_MONTH=' + Ext.getCmp('month').getValue()
        + '&V_V_WEEK=' + Ext.getCmp('week').getValue()
        + '&V_V_ORGCODE=' + V_V_ORGCODE
        + '&V_V_DEPTCODE=' + V_V_DEPTCODE
        + '&V_V_ZY=' + V_V_ZY
        + '&V_V_EQUTYPE=' + V_V_EQUTYPE
        + '&V_V_EQUCODE=' + V_V_EQUCODE
        + '&V_V_CONTENT=' + Ext.getCmp('seltext').getValue()
        + '&V_V_FLOWTYPE=WORK'
        + '&V_V_STATE=30,31';

}

function OnClickDrExcelButton(){
    Ext.getCmp('fjWindow').show();
}
function Atleft(value, metaData) {
    metaData.style = 'text-align: left';
    return '<div data-qtip="' + value + '" >' + value + '</div>';
}
function rendererTime(value, metaData,record, rowIndex, colIndex, store) {
    if(record.get('DRSIGN')=="1") {
        metaData.style = "background-color: yellow";
    }
    return '<div data-qtip="' + value.split(".")[0] + '" >' + value.split(".")[0] + '</div>';
}
function dataCss(value, metaData, record, rowIndex, colIndex, store){
    if(record.get('DRSIGN')=="1") {
        metaData.style = "background-color: yellow;text-align: left;";
        // return '<div  data-qtip="' + value + '" >' + value + '</div>';
        return '<div data-qtip="' + value + '" >' + value + '</div>';
    } else{
        metaData.style = 'text-align: left';
        // return '<div  data-qtip="' + value + '" >' + value + '</div>';
        return '<div data-qtip="' + value + '" >' + value + '</div>';
    }
}