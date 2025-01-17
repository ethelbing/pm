var V_FLOWCODE = '';
var V_MONTHPLAN_GUID = null;
if (location.href.split('?')[1] != undefined) {
    V_MONTHPLAN_GUID = Ext.urlDecode(location.href.split('?')[1]).V_GUID;
}
var YEAR = null;
if (location.href.split('?')[1] != undefined) {
    YEAR = Ext.urlDecode(location.href.split('?')[1]).YEAR;
}
var MONTH = null;
if (location.href.split('?')[1] != undefined) {
    MONTH = Ext.urlDecode(location.href.split('?')[1]).MONTH;
}
var V_ORGCODE = null;
if (location.href.split('?')[1] != undefined) {
    V_ORGCODE = Ext.urlDecode(location.href.split('?')[1]).V_ORGCODE;
}
var V_DEPTCODE = null;
if (location.href.split('?')[1] != undefined) {
    V_DEPTCODE = Ext.urlDecode(location.href.split('?')[1]).V_DEPTCODE;
}
var V_JXMX_CODE = null;
var V_JXGX_CODE = null;
var V_PLANCODE = null;
var V_PLANTYPE = null;
var date = new Date();
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
//厂矿
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
//作业区
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

//施工方式
var sgfsStore = Ext.create("Ext.data.Store", {
    storeId: 'sgfsStore',
    fields: ['ID', 'V_BH','V_SGFS','V_LX'],
    autoLoad: true,
    proxy: {
        type: 'ajax',
        async: false,
        url: AppUrl + 'PM_03/PM_03_PLAN_SGFS_SEL',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'list'
        }
    }
});
Ext.data.StoreManager.lookup('sgfsStore').on('load',function(){
    Ext.getCmp('sgfs').select( Ext.data.StoreManager.lookup('sgfsStore').getAt(0));
});
var editPanel = Ext.create('Ext.form.Panel', {
    id: 'editPanel',
    region: 'center',
    layout: 'border',
    frame: true,
    border: false,
    width: '100%',
    baseCls: 'my-panel-no-border',
    items: [
        {
            xtype: 'panel',
            layout: 'vbox',
            region: 'center',
            defaults: {labelAlign: 'right'},
            frame: true,
            border: false,
            //baseCls: 'my-panel-no-border',
            margin: '0 0 0 0',
            autoScroll: true,
            items: [
                {
                    layout: 'hbox',
                    defaults: {labelAlign: 'right'},
                    frame: true,
                    border: false,
                    baseCls: 'my-panel-no-border',
                    items: [
                        {
                            xtype: 'button',
                            text: '计划选择',
                            margin: '10 0 10 90',
                            icon: imgpath + '/add.png',
                            handler: jhSelect
                        },
                        {
                            xtype: 'button',
                            text: '模型选择',
                            margin: '10 0 10 10',
                            icon: imgpath + '/add.png',
                            handler: mxSelect
                        },
                        {
                            xtype: 'button',
                            text: '保存',
                            width: 60,
                            icon: imgpath + '/saved.png',
                            margin: '10px 20px 0px 10px',
                            handler: OnButtonSaveClick
                        },
                        {
                            xtype: 'button',
                            text: '重新上报',
                            margin: '10 0 10 10',
                            icon: imgpath + '/001.gif',
                            handler: reStart
                        },
                        {
                            xtype: 'button',
                            text: '关闭',
                            width: 60,
                            icon: imgpath + '/cross.png',
                            margin: '10px 20px 0px 10px',
                            handler: OnButtonCancelClick
                        }]
                },
                {
                    layout: 'hbox',
                    defaults: {labelAlign: 'right'},
                    frame: true,
                    border: false,
                    baseCls: 'my-panel-no-border',
                    items: [
                        {
                            xtype: 'combo',
                            id: 'year',
                            fieldLabel: '年份',
                            editable: false,
                            margin: '10 0 5 5',
                            labelWidth: 80,
                            width: 280,
                            displayField: 'displayField',
                            valueField: 'valueField',
                            value: '',
                            store: yearStore,
                            queryMode: 'local'
                        },
                        {
                            xtype: 'combo',
                            id: 'month',
                            fieldLabel: '月份',
                            editable: false,
                            margin: '10 0 5 5',
                            labelWidth: 70,
                            width: 255,
                            displayField: 'displayField',
                            valueField: 'valueField',
                            value: '',
                            store: monthStore,
                            queryMode: 'local'
                        }
                    ]
                },
                {
                    layout: 'hbox',
                    defaults: {labelAlign: 'right'},
                    frame: true,
                    border: false,
                    baseCls: 'my-panel-no-border',
                    items: [
                        {
                            xtype: 'combo',
                            id: 'ck',
                            fieldLabel: '计划厂矿',
                            editable: false,
                            margin: '5 0 5 5',
                            labelWidth: 80,
                            width: 280,
                            value: '',
                            displayField: 'V_DEPTNAME',
                            valueField: 'V_DEPTCODE',
                            store: ckStore,
                            queryMode: 'local'
                        },
                        {
                            xtype: 'combo',
                            id: 'zyq',
                            fieldLabel: '作业区',
                            editable: false,
                            margin: '5 0 5 5',
                            labelWidth: 70,
                            width: 255,
                            value: '',
                            displayField: 'V_DEPTNAME',
                            valueField: 'V_DEPTCODE',
                            store: zyqStore,
                            queryMode: 'local'
                        }
                    ]
                },
                {
                    layout: 'hbox',
                    defaults: {labelAlign: 'right'},
                    frame: true,
                    border: false,
                    baseCls: 'my-panel-no-border',
                    items: [
                        {
                            xtype: 'combo',
                            id: 'zy',
                            fieldLabel: '专业',
                            editable: false,
                            margin: '5 0 5 5',
                            labelWidth: 80,
                            width: 280,
                            value: '',
                            displayField: 'V_BASENAME',
                            valueField: 'V_SPECIALTYCODE',
                            store: zyStore,
                            queryMode: 'local'
                        },
                        {
                            xtype: 'combo',
                            id: 'sblx',
                            fieldLabel: '设备类型',
                            editable: false,
                            margin: '5 0 5 5',
                            labelWidth: 70,
                            width: 255,
                            value: '',
                            displayField: 'V_EQUTYPENAME',
                            valueField: 'V_EQUTYPECODE',
                            store: sblxStore,
                            queryMode: 'local'
                        }
                    ]
                },
                {
                    layout: 'hbox',
                    defaults: {labelAlign: 'right'},
                    frame: true,
                    border: false,
                    baseCls: 'my-panel-no-border',
                    items: [

                        {
                            xtype: 'numberfield',
                            id: 'expectage',
                            fieldLabel: '预计寿命',
                            labelAlign: 'right',
                            margin: '5 0 5 5',
                            labelWidth: 80,
                            width: 280,
                            value: 0
                        },{
                            xtype: 'numberfield',
                            id: 'repairper',
                            fieldLabel: '维修人数',
                            labelAlign: 'right',
                            margin: '5 0 5 5',
                            labelWidth: 70,
                            width: 255,
                            value: 0
                        }
                    ]
                },{
                    layout: 'hbox',
                    defaults: {labelAlign: 'right'},
                    frame: true,
                    border: false,
                    baseCls: 'my-panel-no-border',
                    items: [

                        {
                            xtype: 'combo',
                            id: 'sbmc',
                            fieldLabel: '设备名称',
                            editable: false,
                            labelAlign: 'right',
                            margin: '5 0 5 5',
                            labelWidth: 80,
                            width: 280,
                            value: '',
                            displayField: 'V_EQUNAME',
                            valueField: 'V_EQUCODE',
                            store: sbmcStore,
                            queryMode: 'local'
                        },
                        {
                            xtype: 'textfield',
                            id: 'maindefect',
                            fieldLabel: '主要缺陷',
                            labelAlign: 'right',
                            margin: '5 0 5 5',
                            labelWidth: 70,
                            width: 255
                        }
                    ]
                },
                {layout: 'hbox',
                    defaults: {labelAlign: 'right'},
                    frame: true,
                    border: false,
                    baseCls: 'my-panel-no-border',
                    items:[
                        {
                            xtype : 'combo',
                            id : "sgfs",
                            store: sgfsStore,
                            editable : false,
                            queryMode : 'local',
                            fieldLabel : '施工方式',
                            margin: '5 0 5 5',
                            displayField: 'V_SGFS',
                            valueField: 'V_BH',
                            labelWidth: 80,
                            width: 280,
                            labelAlign : 'right'
                        },
                        {
                            xtype:'checkboxfield',
                            boxLabel:'施工准备是否已落实',
                            id : 'iflag',
                            inputValue:1,
                            uncheckedValue:0,
                            margin: '5 0 5 30'
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    id: 'jxnr',
                    fieldLabel: '检修内容',
                    labelAlign: 'right',
                    margin: '5 0 5 5',
                    labelWidth: 80,
                    width: 540,
                    value: ''
                },
                {
                    layout: 'hbox',
                    defaults: {labelAlign: 'right'},
                    frame: true,
                    border: false,
                    baseCls: 'my-panel-no-border',
                    items: [
                        {
                            xtype: 'datefield',
                            id: 'jhtgdate',
                            format: 'Y-m-d',
                            fieldLabel: '计划停工时间',
                            editable: false,
                            labelAlign: 'right',
                            margin: '5 0 5 5',
                            labelWidth: 80,
                            width: 280,
                            value: ''
                        },
                        {
                            xtype: 'combo',
                            id: 'jhtghour',
                            fieldLabel: '小时',
                            editable: false,
                            margin: '5 0 5 5',
                            labelWidth: 55,
                            width: 137,
                            value: '',
                            displayField: 'displayField',
                            valueField: 'valueField',
                            store: hourStore,
                            queryMode: 'local'
                        },
                        {
                            xtype: 'combo',
                            id: 'jhtgminute',
                            fieldLabel: '分钟',
                            editable: false,
                            margin: '5 0 5 5',
                            labelWidth: 30,
                            width: 112,
                            value: '',
                            displayField: 'displayField',
                            valueField: 'valueField',
                            store: minuteStore,
                            queryMode: 'local'
                        }
                    ]
                },
                {
                    layout: 'hbox',
                    defaults: {labelAlign: 'right'},
                    frame: true,
                    border: false,
                    baseCls: 'my-panel-no-border',
                    items: [
                        {
                            xtype: 'datefield',
                            id: 'jhjgdate',
                            format: 'Y-m-d',
                            fieldLabel: '计划竣工时间',
                            editable: false,
                            labelAlign: 'right',
                            margin: '5 0 5 5',
                            labelWidth: 80,
                            width: 280,
                            value: ''
                        },
                        {
                            xtype: 'combo',
                            id: 'jhjghour',
                            fieldLabel: '小时',
                            editable: false,
                            margin: '5 0 5 5',
                            labelWidth: 55,
                            width: 137,
                            value: '0',
                            displayField: 'displayField',
                            valueField: 'valueField',
                            store: hourStore,
                            queryMode: 'local'
                        },
                        {
                            xtype: 'combo',
                            id: 'jhjgminute',
                            fieldLabel: '分钟',
                            editable: false,
                            margin: '5 0 5 5',
                            labelWidth: 30,
                            width: 112,
                            value: '0',
                            displayField: 'displayField',
                            valueField: 'valueField',
                            store: minuteStore,
                            queryMode: 'local'
                        }
                    ]
                },
                {
                    xtype: 'textfield',
                    id: 'jhgshj',
                    fieldLabel: '计划工时合计',
                    labelAlign: 'right',
                    margin: '5 0 5 5',
                    labelWidth: 80,
                    width: 280,
                    value: ''
                },
                {
                    xtype: 'textarea',
                    id: 'bz',
                    fieldLabel: '备注',
                    margin: '5 0 10 5',
                    labelWidth: 80,
                    width: 540,
                    height: 80,
                    value: ''
                }
            ]
        }
    ]
});
function pageLoadInfo() {
    /*if(YEAR==null||YEAR==''){
     Ext.getCmp('year').setValue(new Date().getFullYear());
     }else{
     Ext.getCmp('year').setValue(YEAR);
     }
     if(MONTH==null||MONTH==''){
     Ext.getCmp('month').setValue(new Date().getMonth()+1);
     }else{
     Ext.getCmp('month').setValue(MONTH);
     }*/
    Ext.data.StoreManager.lookup('ckStore').on('load', function () {
        /*if(V_ORGCODE==null||V_ORGCODE==''){
         Ext.getCmp('ck').select(Ext.data.StoreManager.lookup('ckStore').getAt(0));
         }else{
         var index = Ext.data.StoreManager.lookup('ckStore').findBy(function(record, id){
         return record.get('V_DEPTCODE')==V_ORGCODE;
         });
         if(index==-1){
         Ext.getCmp('ck').select(Ext.data.StoreManager.lookup('ckStore').getAt(0));
         }else{
         Ext.getCmp('ck').select(V_ORGCODE);
         }
         }*/
        Ext.data.StoreManager.lookup('zyqStore').load({
            params: {
                'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode'),
                'V_V_DEPTCODE': Ext.getCmp('ck').getValue(),
                'V_V_DEPTCODENEXT': '%',
                'V_V_DEPTTYPE': '主体作业区'
            }
        });
    });
    Ext.getCmp('ck').on('change', function () {
        Ext.data.StoreManager.lookup('zyqStore').load({
            params: {
                'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode'),
                'V_V_DEPTCODE': Ext.getCmp('ck').getValue(),
                'V_V_DEPTCODENEXT': '%',
                'V_V_DEPTTYPE': '主体作业区'
            }
        });
    });
    Ext.data.StoreManager.lookup('zyqStore').on('load', function () {
        /*if(V_DEPTCODE==null||V_DEPTCODE==''){
         Ext.getCmp('zyq').select(Ext.data.StoreManager.lookup('zyqStore').getAt(0));
         }else{
         var index =Ext.data.StoreManager.lookup('zyqStore').findBy(function(record, id){
         return record.get('V_DEPTCODE')==V_DEPTCODE;
         });
         if(index==-1){
         Ext.getCmp('zyq').select(Ext.data.StoreManager.lookup('zyqStore').getAt(0));
         }else{
         Ext.getCmp('zyq').select(V_DEPTCODE);
         }
         }*/
        //加载专业
        Ext.data.StoreManager.lookup('zyStore').load({
            params: {
                V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode'),
                V_V_DEPTNEXTCODE: Ext.getCmp('zyq').getValue()
            }
        });
        //加载设备类型
        Ext.data.StoreManager.lookup('sblxStore').load({
            params: {
                V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode'),
                V_V_DEPTCODENEXT: Ext.getCmp('zyq').getValue()
            }
        });
    });
    //作业区改变
    Ext.getCmp('zyq').on('change', function () {
        Ext.data.StoreManager.lookup('zyStore').load({
            params: {
                V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode'),
                V_V_DEPTNEXTCODE: Ext.getCmp('zyq').getValue()
            }
        });
        Ext.data.StoreManager.lookup('sblxStore').load({
            params: {
                V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode'),
                V_V_DEPTCODENEXT: Ext.getCmp('zyq').getValue()
            }
        });
    });
    //设备类型改变
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
        //Ext.getCmp("sblx").select(Ext.data.StoreManager.lookup('sblxStore').getAt(0));
        Ext.data.StoreManager.lookup('sbmcStore').load({
            params: {
                v_v_personcode: Ext.util.Cookies.get('v_personcode'),
                v_v_deptcodenext: Ext.getCmp('zyq').getValue(),
                v_v_equtypecode: Ext.getCmp('sblx').getValue()
            }
        });
    });
    //设备名称加载监听
    Ext.data.StoreManager.lookup('sbmcStore').on('load', function () {
        //Ext.getCmp("sbmc").select(Ext.data.StoreManager.lookup('sbmcStore').getAt(0));
    });
    Ext.data.StoreManager.lookup('zyStore').on('load', function () {
        //Ext.getCmp("zy").select(Ext.data.StoreManager.lookup('zyStore').getAt(0));
    });
    /*Ext.getCmp('jhtgdate').setValue(new Date()); 		//编辑窗口计划停工时间默认值
     Ext.getCmp('jhtghour').select(Ext.data.StoreManager.lookup('hourStore').getAt(0));
     Ext.getCmp('jhtgminute').select(Ext.data.StoreManager.lookup('minuteStore').getAt(0));
     Ext.getCmp('jhjgdate').setValue(new Date());       //编辑窗口计划竣工时间默认值
     Ext.getCmp('jhjghour').select(Ext.data.StoreManager.lookup('hourStore').getAt(0));
     Ext.getCmp('jhjgminute').select(Ext.data.StoreManager.lookup('minuteStore').getAt(0));*/
}
Ext.onReady(function () {
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [editPanel]
    });
    pageLoadInfo();
    Ext.Ajax.request({
        url: AppUrl + 'PM_03/PRO_PM_03_PLAN_MONTH_GET',
        method: 'POST',
        async: false,
        params: {
            V_V_MONTHPLAN_GUID: V_MONTHPLAN_GUID
        },
        success: function (resp) {
            var resp = Ext.decode(resp.responseText);
            if (resp.list.length == 1) {
                V_JXGX_CODE = resp.list[0].V_JXGX_CODE;      //检修工序编码
                V_JXMX_CODE = resp.list[0].V_JXMX_CODE;      //检修模型编码
                V_FLOWCODE = resp.list[0].V_FLOWCODE;        //流动编码
                var V_YEARPLAN_CODE = resp.list[0].V_YEARPLAN_CODE; //年计划编码
                var V_QUARTERPLAN_CODE = resp.list[0].V_QUARTERPLAN_CODE;//季度计划编码
                var V_YEAR_PLANNAME = resp.list[0].V_YEAR_PLANNAME;        //年计划名称
                var V_QUARTER_PLANNAME = resp.list[0].V_QUARTER_PLANNAME;   //计划计划名称
                var V_HOUR = resp.list[0].V_HOUR;
                var V_BZ = resp.list[0].V_BZ;
                V_YEAR = resp.list[0].V_YEAR;                 //年
                V_MONTH = resp.list[0].V_MONTH;            //季度
                V_ORGCODE = resp.list[0].V_ORGCODE;          //厂矿编码
                V_DEPTCODE = resp.list[0].V_DEPTCODE;        //作业区编码
                var V_REPAIRMAJOR_CODE = resp.list[0].V_REPAIRMAJOR_CODE;        //专业编码
                var V_EQUTYPECODE = resp.list[0].V_EQUTYPECODE;        //设备类型编码
                var V_EQUCODE = resp.list[0].V_EQUCODE;        //设备名称编码
                var V_CONTENT = resp.list[0].V_CONTENT;        //检修内容
                var V_JXMX_NAME = resp.list[0].V_MX_NAME;      //检修模型名称
                var V_STARTTIME = resp.list[0].V_STARTTIME;     //开始时间
                var V_STARTTIME_DATE = V_STARTTIME.split(" ")[0];
                var V_STARTTIME_HOUR = V_STARTTIME.split(" ")[1].split(":")[0];
                var V_STARTTIME_MINUTE = V_STARTTIME.split(" ")[1].split(":")[1];
                var V_ENDTIME = resp.list[0].V_ENDTIME;         //结束时间
                var V_ENDTIME_DATE = V_ENDTIME.split(" ")[0];
                var V_ENDTIME_HOUR = V_ENDTIME.split(" ")[1].split(":")[0];
                var V_ENDTIME_MINUTE = V_ENDTIME.split(" ")[1].split(":")[1];

                Ext.getCmp('year').select(V_YEAR); //年
                Ext.getCmp('month').select(V_MONTH);  //月
                Ext.getCmp('ck').select(V_ORGCODE);  //厂矿编码
                Ext.getCmp('zyq').select(V_DEPTCODE);  //作业区编码
                Ext.getCmp('zy').select(V_REPAIRMAJOR_CODE);  //专业编码
                Ext.getCmp('sblx').select(V_EQUTYPECODE);  //设备类型编码
                Ext.getCmp('sbmc').select(V_EQUCODE);  //设备名称编码
                Ext.getCmp('jxnr').setValue(V_CONTENT);  //检修内容
                Ext.getCmp('jhtgdate').setValue(V_STARTTIME_DATE);  //停工时间
                Ext.getCmp('jhtghour').select(V_STARTTIME_HOUR);  //停工时间小时
                Ext.getCmp('jhtgminute').select(V_STARTTIME_MINUTE);  //停工时间分钟
                Ext.getCmp('jhjgdate').setValue(V_ENDTIME_DATE);  //竣工时间
                Ext.getCmp('jhjghour').select(V_ENDTIME_HOUR);  //竣工时间小时
                Ext.getCmp('jhjgminute').select(V_ENDTIME_MINUTE);  //竣工时间分钟
                Ext.getCmp('jhgshj').setValue(V_HOUR);  //竣工时间分钟
                Ext.getCmp('bz').setValue(V_BZ);  //竣工时间分钟

                Ext.getCmp('maindefect').setValue(resp.list[0].V_MAIN_DEFECT);  //主要缺陷
                Ext.getCmp('expectage').setValue(resp.list[0].V_EXPECT_AGE);  //预计寿命
                Ext.getCmp('repairper').setValue(resp.list[0].V_REPAIR_PER);  //维修人数

                //2018-11-21
                Ext.getCmp('sgfs').select(data.list[0].V_SGWAY);
                Ext.getCmp('iflag').setValue(data.list[0].V_FLAG);
                if (V_YEARPLAN_CODE != '') {
                    V_PLANCODE = V_YEARPLAN_CODE;
                    V_PLANTYPE = 'YEAR';
                } else if (V_QUARTERPLAN_CODE != '') {
                    V_PLANCODE = V_QUARTERPLAN_CODE;
                    V_PLANTYPE = 'QUARTER';
                }
            }
        }
    });
});
function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}
function reStart() {
    Ext.Ajax.request({
        url: AppUrl + 'PM_03/PRO_PM_03_PLAN_MONTH_SEND',
        method: 'POST',
        async: false,
        params: {
            V_V_GUID: V_MONTHPLAN_GUID,
            V_V_ORGCODE: Ext.getCmp('ck').getValue(),
            V_V_DEPTCODE: Ext.getCmp('zyq').getValue(),
            V_V_FLOWCODE: V_FLOWCODE,
            V_V_PLANTYPE: 'MONTH',
            V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode')
        },
        success: function (resp) {
            var resp = Ext.decode(resp.responseText).list[0];
            if (resp.V_INFO == '成功') {
                window.opener.OnPageLoad();
                window.opener.QueryGrid();

                window.close();
            }

        }
    });
}
function jhSelect() {
    var owidth = window.document.body.offsetWidth - 200;
    var oheight = window.document.body.offsetHeight - 100;
    var ret = window.open(AppUrl + 'page/PM_03010211/index.html?V_V_YEAR=' + Ext.getCmp('year').getValue()
        + '&V_V_ORGCODE=' + Ext.getCmp('ck').getValue()
        + '&V_V_DEPTCODE=' + Ext.getCmp('zyq').getValue()
        + '&V_V_EQUTYPE=' + Ext.getCmp('sblx').getValue()
        + '&V_V_EQUCODE=' + Ext.getCmp('sbmc').getValue()
        + '&V_V_ZY=' + Ext.getCmp('zy').getValue()
        + '&V_V_JXNR=' + Ext.getCmp('jxnr').getValue()
        , '', 'height=' + oheight + ',width=' + owidth + ',top=100px,left=100px,resizable=yes');
}
function mxSelect() {
    var owidth = window.document.body.offsetWidth - 200;
    var oheight = window.document.body.offsetHeight - 100;
    var ret = window.open(AppUrl + 'page/PM_03010212/index.html?V_ORGCODE=' + Ext.getCmp('ck').getValue()
        + '&V_DEPTCODE=' + Ext.getCmp('zyq').getValue()
        + '&V_EQUTYPE=' + Ext.getCmp('sblx').getValue()
        + '&V_EQUCODE=' + Ext.getCmp('sbmc').getValue(), '', 'height=' + oheight + ',width=' + owidth + ',top=100px,left=100px,resizable=yes');
}
function getReturnJHXZ(retdata, type) {
    Ext.Ajax.request({
        url: AppUrl + 'PM_03/PM_03_PLAN_CHOOSE_SEL',
        method: 'POST',
        async: false,
        params: {
            V_V_GUID: retdata,
            V_V_PLANTYPE: type
        },
        success: function (ret) {
            var resp = Ext.decode(ret.responseText);
            if (resp.list.length > 0) {
                var V_ORGCODE = resp.list[0].V_ORGCODE;
                var V_DEPTCODE = resp.list[0].V_DEPTCODE;
                var V_EQUTYPE = resp.list[0].V_EQUTYPECODE;
                var V_EQUCODE = resp.list[0].V_EQUCODE;
                var V_REPAIRMAJOR_CODE = resp.list[0].V_REPAIRMAJOR_CODE;
                var V_HOUR = resp.list[0].V_HOUR;
                var V_CONTENT = resp.list[0].V_CONTENT;
                var V_BZ = resp.list[0].V_BZ;

                var V_STARTTIME = resp.list[0].V_STARTTIME;     //开始时间
                var V_STARTTIME_DATE = V_STARTTIME.split(" ")[0];
                var V_STARTTIME_HOUR = V_STARTTIME.split(" ")[1].split(":")[0];
                var V_STARTTIME_MINUTE = V_STARTTIME.split(" ")[1].split(":")[1];
                var V_ENDTIME = resp.list[0].V_ENDTIME;         //结束时间
                var V_ENDTIME_DATE = V_ENDTIME.split(" ")[0];
                var V_ENDTIME_HOUR = V_ENDTIME.split(" ")[1].split(":")[0];
                var V_ENDTIME_MINUTE = V_ENDTIME.split(" ")[1].split(":")[1];
                V_PLANCODE = resp.list[0].V_PLANCODE;
                V_PLANTYPE = resp.list[0].V_PLANTYPE;

                Ext.getCmp('ck').select(V_ORGCODE);
                Ext.getCmp('zyq').select(V_DEPTCODE);
                Ext.getCmp("zy").select(V_REPAIRMAJOR_CODE);
                Ext.getCmp("sblx").select(V_EQUTYPE);
                Ext.getCmp("sbmc").select(V_EQUCODE);
                Ext.getCmp('jxnr').setValue(V_CONTENT);  //检修内容
                Ext.getCmp('jhgshj').setValue(V_HOUR);  //计划工时合计
                //Ext.getCmp('bz').setValue(V_BZ);  //备注


                Ext.getCmp('jhtgdate').setValue(V_STARTTIME_DATE);  //停工时间
                Ext.getCmp('jhtghour').select(V_STARTTIME_HOUR);  //停工时间小时
                Ext.getCmp('jhtgminute').select(V_STARTTIME_MINUTE);  //停工时间分钟
                Ext.getCmp('jhjgdate').setValue(V_ENDTIME_DATE);  //竣工时间
                Ext.getCmp('jhjghour').select(V_ENDTIME_HOUR);  //竣工时间小时
                Ext.getCmp('jhjgminute').select(V_ENDTIME_MINUTE);  //竣工时间分钟

            }

        }
    });
}
function getReturnMXXZ(retdata) {
    Ext.Ajax.request({
        url: AppUrl + 'PM_03/PM_03_JXMX_DATA_MXCODE_SEL',
        method: 'POST',
        async: false,
        params: {
            V_V_MX_CODE: retdata
        },
        success: function (ret) {
            var resp = Ext.decode(ret.responseText);
            var V_ORGCODE = resp.list[0].V_ORGCODE;
            var V_DEPTCODE = resp.list[0].V_DEPTCODE;
            var V_EQUTYPE = resp.list[0].V_EQUTYPE;
            var V_EQUCODE = resp.list[0].V_EQUCODE;
            var V_REPAIRMAJOR_CODE = resp.list[0].V_REPAIRMAJOR_CODE;
            var V_HOUR = resp.list[0].V_HOUR;
            var V_CONTENT = resp.list[0].V_JXGX_NR;
            var V_BZ = resp.list[0].V_BZ;

            Ext.getCmp('ck').select(V_ORGCODE);  //厂矿编码
            Ext.getCmp('zyq').select(V_DEPTCODE);  //作业区编码
            Ext.getCmp('zy').select(V_REPAIRMAJOR_CODE);  //专业编码
            Ext.getCmp('sblx').select(V_EQUTYPE);  //设备类型编码
            Ext.getCmp('sbmc').select(V_EQUCODE);  //设备名称编码
            Ext.getCmp('jxnr').setValue(V_CONTENT);  //检修内容
            Ext.getCmp('jhgshj').setValue(V_HOUR);  //计划工时合计
            Ext.getCmp('bz').setValue(V_BZ);  //备注
        }
    });
}

function OnButtonSaveClick() {
    //计划停工时间
    var jhtghour = Ext.getCmp('jhtghour').getValue();
    var jhtgminute = Ext.getCmp('jhtgminute').getValue();
    var jhtgTime = Ext.Date.format(Ext.ComponentManager.get("jhtgdate").getValue(), 'Y-m-d') + " " + jhtghour + ":" + jhtgminute + ':00';
    //计划竣工时间
    var jhjghour = Ext.getCmp('jhjghour').getValue();
    var jhjgminute = Ext.getCmp('jhjgminute').getValue();
    var jhjgTime = Ext.Date.format(Ext.ComponentManager.get("jhjgdate").getValue(), 'Y-m-d') + " " + jhjghour + ":" + jhjgminute + ':00';
    //计划类型（年/季度）
    var V_YEARPLAN_CODE = "";
    var V_QUARTERPLAN_CODE = "";
    if (V_PLANTYPE == 'YEAR') {
        V_YEARPLAN_CODE = V_PLANCODE;
    } else if (V_PLANTYPE == 'QUARTER') {
        V_QUARTERPLAN_CODE = V_PLANCODE;
    }
    //模型
    V_JXMX_CODE = guid();
    //保存
    Ext.Ajax.request({
        url: AppUrl + 'basic/PRO_PM_03_PLAN_MONTH_SET',
        method: 'POST',
        params: {
            V_V_INPER: Ext.util.Cookies.get('v_personcode'),               //人员cookies                                    //人员编码
            V_V_GUID: V_MONTHPLAN_GUID == '' ? '%' : V_MONTHPLAN_GUID,                         //季度计划guid                                                      //计划GUID
            V_V_YEAR: Ext.getCmp('year').getValue(),                        //年份                                            //年份
            V_V_MONTH: Ext.getCmp('month').getValue(),                     //月份                                           //年份
            V_V_ORGCODE: Ext.getCmp('ck').getValue(),                        //厂矿                                              //厂矿
            V_V_DEPTCODE: Ext.getCmp('zyq').getValue(),                      //作业区
            V_V_EQUTYPECODE: Ext.getCmp('sblx').getValue(),                  //设备类型                                              //设备类型编码
            V_V_EQUCODE: Ext.getCmp('sbmc').getValue(),                     //设备名称
            V_V_REPAIRMAJOR_CODE: Ext.getCmp('zy').getValue(),              //检修专业
            V_V_CONTENT: Ext.getCmp('jxnr').getValue(),                     //检修内容
            V_V_STARTTIME: jhtgTime,                                       //开始时间
            V_V_ENDTIME: jhjgTime,                                          //结束时间
            V_V_OTHERPLAN_GUID: '',//V_JXGX_CODE,                                  //检修工序编码
            V_V_OTHERPLAN_TYPE: '',//V_JXMX_CODE,                                  //检修模型编码
            V_V_JHMX_GUID: '',                                          //检修标准
            V_V_HOUR: Ext.getCmp('jhgshj').getValue(),
            V_V_BZ: Ext.getCmp('bz').getValue(),
            V_V_MAIN_DEFECT: Ext.getCmp('maindefect').getValue(),//主要缺陷
            V_V_EXPECT_AGE: Ext.getCmp('expectage').getValue(),//预计寿命
            V_V_REPAIR_PER: Ext.getCmp('repairper').getValue(),//维修人数
            V_V_SGWAY: Ext.getCmp('sgfs').getValue(),  //施工方式
            V_V_SGWAYNAME: Ext.getCmp('sgfs').getDisplayValue(),  //施工方式名称
            V_V_FLAG: Ext.getCmp('iflag').getValue()==false?Ext.getCmp('iflag').uncheckedValue:Ext.getCmp('iflag').inputValue//施工准备是否已落实 (1)是 (0)否
        },
        success: function (ret) {
            var resp = Ext.decode(ret.responseText);
            if (resp.V_INFO == '成功') {
                Ext.Msg.alert('操作信息', '保存成功');

            } else {
                Ext.Msg.alert('操作信息', '保存失败');
            }

        }
    });
}
function OnButtonSaveClickOld() {
    //获取流动编码
    var V_FLOWCODE = "";
    Ext.Ajax.request({
        method: 'POST',
        async: false,
        url: AppUrl + 'basic/PM_03_FLOWCODE_SEL',
        params: {
            V_V_PLANTYPE: 'MONTH',                                                //计划类型
            V_V_ORGCODE: Ext.getCmp('ck').getValue(),                            //厂矿
            V_V_DEPTCODE: Ext.getCmp('zyq').getValue(),                          //作业区
            V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode')              //人员编码cookies
        },
        success: function (resp) {
            V_FLOWCODE = Ext.decode(resp.responseText).list[0].V_INFO;
        }
    });
    //计划停工时间
    var jhtghour = Ext.getCmp('jhtghour').getValue();
    var jhtgminute = Ext.getCmp('jhtgminute').getValue();
    var jhtgTime = Ext.Date.format(Ext.ComponentManager.get("jhtgdate").getValue(), 'Y-m-d') + " " + jhtghour + ":" + jhtgminute;
    //计划竣工时间
    var jhjghour = Ext.getCmp('jhjghour').getValue();
    var jhjgminute = Ext.getCmp('jhjgminute').getValue();
    var jhjgTime = Ext.Date.format(Ext.ComponentManager.get("jhjgdate").getValue(), 'Y-m-d') + " " + jhjghour + ":" + jhjgminute;
    //计划类型（年/季度）
    var V_YEARPLAN_CODE = "";
    var V_QUARTERPLAN_CODE = "";
    if (V_PLANTYPE == 'YEAR') {
        V_YEARPLAN_CODE = V_PLANCODE;
    } else if (V_PLANTYPE == 'QUARTER') {
        V_QUARTERPLAN_CODE = V_PLANCODE;
    }
    //模型
    V_JXMX_CODE = guid();
    //保存
    Ext.Ajax.request({
        url: AppUrl + 'basic/PRO_PM_03_PLAN_MONTH_SET',
        method: 'POST',
        params: {
            V_V_INPER: Ext.util.Cookies.get('v_personcode'),               //人员cookies                                    //人员编码
            V_V_MONTHPLAN_GUID: V_MONTHPLAN_GUID,                         //季度计划guid                                                      //计划GUID
            V_V_YEAR: Ext.getCmp('year').getValue(),                        //年份                                            //年份
            V_V_MONTH: Ext.getCmp('month').getValue(),                     //月份                                           //年份
            V_V_ORGCODE: Ext.getCmp('ck').getValue(),                        //厂矿                                              //厂矿
            V_V_DEPTCODE: Ext.getCmp('zyq').getValue(),                      //作业区
            V_V_EQUTYPECODE: Ext.getCmp('sblx').getValue(),                  //设备类型                                              //设备类型编码
            V_V_EQUCODE: Ext.getCmp('sbmc').getValue(),                     //设备名称
            V_V_REPAIRMAJOR_CODE: Ext.getCmp('zy').getValue(),              //检修专业
            V_V_CONTENT: Ext.getCmp('jxnr').getValue(),                     //检修内容
            V_V_STARTTIME: jhtgTime,                                       //开始时间
            V_V_ENDTIME: jhjgTime,                                          //结束时间
            V_V_FLOWCODE: V_FLOWCODE,                                      //计划流程编码
            V_V_JXGX_CODE: V_JXGX_CODE,                                  //检修工序编码
            V_V_JXMX_CODE: V_JXMX_CODE,                                  //检修模型编码
            V_V_JXBZ_CODE: '',                                          //检修标准
            V_V_REPAIRDEPT_CODE: '',                                   //检修中心编码-----检修单位
            V_V_YEARPLAN_CODE: V_YEARPLAN_CODE,                          //年计划编码
            V_V_QUARTERPLAN_CODE: V_QUARTERPLAN_CODE,                     //季度计划编码
            V_V_HOUR: Ext.getCmp('jhgshj').getValue(),
            V_V_BZ: Ext.getCmp('bz').getValue(),
            V_V_MAIN_DEFECT: Ext.getCmp('maindefect').getValue(),//主要缺陷
            V_V_EXPECT_AGE: Ext.getCmp('expectage').getValue(),//预计寿命
            V_V_REPAIR_PER: Ext.getCmp('repairper').getValue(),//维修人数
            V_V_SGWAY: Ext.getCmp('sgfs').getValue(),  //施工方式
            V_V_SGWAYNAME: Ext.getCmp('sgfs').getDisplayValue(),  //施工方式名称
            V_V_FLAG: Ext.getCmp('iflag').getValue()==false?Ext.getCmp('iflag').uncheckedValue:Ext.getCmp('iflag').inputValue//施工准备是否已落实 (1)是 (0)否
        },
        success: function (ret) {
            var resp = Ext.decode(ret.responseText);
            if (resp.V_INFO == '成功') {
                //检修模型管理
                Ext.Ajax.request({
                    method: 'POST',
                    async: false,
                    url: AppUrl + 'basic/PM_1917_JXMX_DATA_SET',
                    params: {
                        V_V_JXMX_CODE: V_JXMX_CODE,
                        V_V_JXMX_NAME: Ext.getCmp('sbmc').getRawValue(),
                        V_V_ORGCODE: Ext.getCmp('ck').getValue(),
                        V_V_DEPTCODE: Ext.getCmp('zyq').getValue(),
                        V_V_EQUTYPECODE: Ext.getCmp('sblx').getValue(),
                        V_V_EQUCODE: Ext.getCmp('sbmc').getValue(),
                        V_V_EQUCODE_CHILD: '%',
                        V_V_REPAIRMAJOR_CODE: Ext.getCmp('zy').getValue(),
                        V_V_BZ: Ext.getCmp('bz').getValue(),
                        V_V_HOUR: Ext.getCmp('jhgshj').getValue(),
                        V_V_IN_PER: Ext.util.Cookies.get('v_personcode'),
                        V_V_IN_DATE: Ext.util.Format.date(new Date(), 'Y-m-d')
                    },
                    success: function (response) {
                        var resp = Ext.decode(response.responseText);
                        //检修工序管理
                        Ext.Ajax.request({
                            url: AppUrl + 'pm_19/PM_1917_JXGX_DATA_SET',
                            method: 'POST',
                            async: false,
                            params: {
                                V_V_JXGX_CODE: V_JXGX_CODE,
                                V_V_JXGX_NAME: "月计划检修工序",
                                V_V_JXGX_NR: Ext.getCmp('jxnr').getValue(),
                                V_V_GZZX_CODE: '',
                                V_V_JXMX_CODE: resp.list[0].V_INFO,
                                V_V_ORDER: '1',//排序
                                V_V_PERNUM: '0',//检修额定人数
                                V_V_PERTIME: Ext.util.Format.date(new Date(), 'Y-m-d')//检修额定时间
                            },
                            success: function (ret) {
                            }
                        });
                    }
                });
                Ext.Msg.alert('操作信息', '保存成功');
            } else {
                Ext.Msg.alert('操作信息', '保存失败');
            }
            window.opener.query();
            window.close();
        }
    });
}
function OnButtonCancelClick() {
    window.opener.query();
    window.close();
}