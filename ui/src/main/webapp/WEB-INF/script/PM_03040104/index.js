

/*维修计划简版添加页面--备件修改页*/
var Guid="";
var processKey ="";
var V_STEPNAME = "";
var V_NEXT_SETP="";
var OrgCode=Ext.util.Cookies.get('v_orgCode');//"";
var OrgName=decodeURI(Ext.util.Cookies.get("v_orgname"));
var V_DEPTCODE="";
var Year="";
var fjDefect="";
var equcode="";
var equname="";
var equtype="";
var equstie="";
var DTdefectguid="";
var DTequcode="";
var SIGN="";
var DeptCode="";
var fzrPer="";
if(Ext.urlDecode(location.href.split("?")[1])!=undefined){
    Guid=Ext.urlDecode(location.href.split('?')[1]).guid==null?"":Ext.urlDecode(location.href.split('?')[1]).guid;
    Year=Ext.urlDecode(location.href.split('?')[1]).year==null?"":Ext.urlDecode(location.href.split('?')[1]).year;
    V_DEPTCODE=Ext.urlDecode(location.href.split('?')[1]).V_DEPTCODE==null?"":Ext.urlDecode(location.href.split('?')[1]).V_DEPTCODE;
    SIGN=Ext.urlDecode(location.href.split('?')[1]).sign==null?"":Ext.urlDecode(location.href.split('?')[1]).sign;
}
Ext.onReady(function(){
    Ext.getBody().mask();
// //厂矿计划数据加载
//     var ckStore = Ext.create('Ext.data.Store', {
//         autoLoad: true,
//         storeId: 'ckStore',
//         fields: ['V_DEPTCODE', 'V_DEPTNAME'],
//         proxy: {
//             type: 'ajax',
//             async: false,
//             url: AppUrl + 'PM_06/PRO_BASE_DEPT_VIEW_ROLE',
//             actionMethods: {
//                 read: 'POST'
//             },
//             reader: {
//                 type: 'json',
//                 root: 'list'
//             },
//             extraParams: {
//                 'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode'),
//                 'V_V_DEPTCODE': Ext.util.Cookies.get('v_orgCode'),
//                 'V_V_DEPTCODENEXT': '%',
//                 'V_V_DEPTTYPE': '基层单位'
//             }
//         },
//         listeners:{
//             load:function(store, records, success, eOpts){
//                 OrgCode = store.getAt(0).data.V_DEPTCODE;
//                 OrgName=store.getAt(0).data.V_DEPTNAME;
//                 // Ext.getCmp('ck').select(store.first());
//             }
//         }
//     });
    var zyqStore = Ext.create("Ext.data.Store", {
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
    var zyStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        storeId: 'zyStore',
        fields: ['V_GUID', 'V_ZYMC','V_ZYJC','V_LX','V_ORDER'],
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
        },
        listeners:{
            load:function(store,records,success,eOpts){
                Ext.getCmp("zy").setValue(store.first());
                //   QueryZyFzr();
            }
        }
    });
    var bjzyqStore=Ext.create('Ext.data.Store',{
        id:'bjzyqStore',
        autoLoad:true,
        fields: ['V_SAP_WORK', 'V_SAP_JHGC', 'V_DEPTNAME', 'V_DEPTCODE_UP', 'V_DEPTCODE', 'V_SAP_YWFW', 'V_SAP_DEPT'],
        proxy:{
            type:'ajax',
            async: false,
            url: AppUrl + 'PM_06/PRO_BASE_DEPT_VIEW_ROLE',
            actionMethods: {
                read: 'POST'
            },
            extraParams:{
                'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode'),
                'V_V_DEPTCODE': Ext.util.Cookies.get('v_orgCode'),
                'V_V_DEPTCODENEXT': '%',
                'V_V_DEPTTYPE': '主体作业区'
            },
            reader: {
                type: 'json',
                root: 'list'
            }
        }
        , listeners: {
            load: function (store, records, success, eOpts) {
                store.insert(records.length,{V_DEPTNAME:'全部',V_DEPTCODE:'%'});
                Ext.getCmp("bjzyq").setValue(store.first());
                QueryBjZyq();
                //   QueryZyFzr();
            }
        }
    });
    //不含设备的缺陷添加完成查找
    var qxGridStore=Ext.create('Ext.data.Store', {
        autoLoad: false,
        storeId: 'qxGridStore',
        fields: ['I_ID','V_DEFECTLIST','V_SOURCECODE', 'V_SOURCENAME', 'V_SOURCETABLE', 'V_SOURCEREMARK', 'V_SOURCEID',
            'D_DEFECTDATE', 'D_INDATE', 'V_PERCODE', 'V_PERNAME', 'V_ORGCODE', 'V_ORGNAME', 'V_DEPTCODE', 'V_DEPTNAME',
            'V_EQUCODE', 'V_EQUNAME', 'V_EQUSITE', 'V_EQUSITENAME', 'V_EQUTYPECODE', 'V_EQUTYPENAME', 'V_IDEA', 'V_STATECODE',
            'V_STATENAME', 'V_STATECOLOR', 'V_GUID', 'V_EQUSITE1', 'D_DATE_EDITTIME', 'V_EDIT_GUID', 'V_SOURCE_GRADE', 'V_EQUCHILDCODE',
            'V_INPERCODE', 'V_INPERNAME', 'V_BZ', 'V_REPAIRMAJOR_CODE', 'V_HOUR', 'V_FLAG','DEF_SOLVE','BJ_STUFF','PASSNUM','NOPASSNUM','DEFILENUM',
            'PASS_STATE','PASS_STATENAME'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'dxfile/PM_03_PROJECT_DEFECT_SEL_O',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            }
        }
    });
//不含设备的缺陷查找
    var dqxgridStore2 = Ext.create('Ext.data.Store', {
        autoLoad: false,
        storeId: 'dqxgridStore2',
        fields: ['I_ID', 'V_DEFECTLIST', 'V_SOURCECODE', 'V_SOURCENAME', 'V_SOURCEID',
            'D_DEFECTDATE', 'D_INDATE', 'V_PERCODE', 'V_PERNAME', 'V_DEPTCODE', 'V_EQUNAME', 'V_EQUCODE', 'V_IDEA', 'V_STATECODE',
            'V_GUID', 'V_EQUSITE', 'D_DATE_EDITTIME', 'V_EDIT_GUID', 'V_SOURCE_GRADE', 'V_EQUCHILDCODE', 'V_INPERCODE', 'V_INPERNAME',
            'V_EQUTYPECODE', 'V_ORGCODE', 'V_HOUR', 'V_BZ', 'V_REPAIRMAJOR_CODE', 'V_PROJECT_CODE', 'V_PROJECT_NAME', 'V_FLAG',
            'V_PROC_WAY'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'dxfile/PRO_PM_DEFECT_SPECIL_SEL2',
            actionMethods: {
                read: 'POST'
            },
            /* extraParams: {
                 V_DEPT_CODE:Ext.getCmp('bjzyq').getValue()//Ext.util.Cookies.get("v_deptcode")
             },*/
            reader: {
                type: 'json',
                root: 'list'
            }
        }
    });
    var fzPerStore=Ext.create("Ext.data.Store", {
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
        },
        listeners: {
            load: function (store, records, success, eOpts) {
                if( store.getAt(0)==undefined){
                    Ext.getCmp('fzPer').select(''); return;
                }else{
                    processKey = store.getProxy().getReader().rawData.RET;
                    V_STEPNAME = store.getAt(0).data.V_V_FLOW_STEPNAME;
                    V_NEXT_SETP = store.getAt(0).data.V_V_NEXT_SETP;
                    Ext.getCmp('fzPer').select(store.first());
                }

            }

        }
    });

    var fileview=Ext.create("Ext.data.Store", {
        autoLoad: false,
        id: 'fileview',
        fields: ['FILE_CODE', 'FILE_NAME', 'FILE_TYPE', 'INSERT_DATE', 'INSERT_PERSON'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'PM_07/DEFECT_UPFILE_SELECT',
            actionMethods: {
                read: 'POST'
            },
            extraParams: {
                V_GUID: fjDefect
            },
            reader: {
                type: 'json',
                root: 'list'
            }
        }
    });

    //缺陷查找
    var dqxgridStore=Ext.create('Ext.data.Store', {
        autoLoad: false,
        storeId: 'dqxgridStore',
        fields: ['I_ID','V_DEFECTLIST','V_SOURCECODE', 'V_SOURCENAME', 'V_SOURCETABLE', 'V_SOURCEREMARK', 'V_SOURCEID',
            'D_DEFECTDATE', 'D_INDATE', 'V_PERCODE', 'V_PERNAME', 'V_ORGCODE', 'V_ORGNAME', 'V_DEPTCODE', 'V_DEPTNAME',
            'V_EQUCODE', 'V_EQUNAME', 'V_EQUSITE', 'V_EQUSITENAME', 'V_EQUTYPECODE', 'V_EQUTYPENAME', 'V_IDEA', 'V_STATECODE',
            'V_STATENAME', 'V_STATECOLOR', 'V_GUID', 'V_EQUSITE1', 'D_DATE_EDITTIME', 'V_EDIT_GUID', 'V_SOURCE_GRADE', 'V_EQUCHILDCODE',
            'V_INPERCODE', 'V_INPERNAME', 'V_BZ', 'V_REPAIRMAJOR_CODE', 'V_HOUR', 'V_FLAG'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'PM_03/PRO_PM_DEFECT_DEPT_SEL_ALL',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            }
        }
    });


    var tpanel=Ext.create('Ext.form.Panel',{
        region: 'north',
        frame: false,
        border: false,
        layout: 'column',
        // height:'10%',
        autoScorll:true,
        id:'tpanel',
        titleAlign:'center',
        defaults: {labelAlign: 'right'},
        collapsible: false,
        tbar: [
            {
                xtype: 'button',
                text: '临时保存',
                margin: '0 0 5 0',
                // iconCls:'Tablesave',
                iconCls: 'buy-button',
                icon:dxImgPath + '/lsbc.png',
                handler:btnSaveProject
            },
            { xtype: 'tbseparator',baseCls:'x-toolbar-separator-horizontal', margin:'3 8 5 8' },
            {
                xtype: 'button',
                id:'startFlow',
                text: '上报',
                margin: '0 0 5 0',
                iconCls: 'buy-button',
                icon:dxImgPath + '/wlmx.png',
                handler:btnFlowStart
            }
            ,
            {
                xtype : 'combo',
                id:'fzPer',
                store:fzPerStore,
                editable : false,
                queryMode : 'local',
                fieldLabel : '负责人',
                displayField: 'V_PERSONNAME',
                valueField: 'V_PERSONCODE',
                margin:'5 5 5 10',
                labelWidth :60,
                width:170,
                labelAlign : 'right'
            }
        ]
    });
    var combpanel=Ext.create('Ext.panel.Panel',{
        id:'combpanel',
        region:'north',
        layout:'column',
        // height:'50%',
        autoScroll:true,
        collapsible: true,
        items:[
            {
                xtype: 'textfield',
                fieldLabel: '项目编码',
                id: 'ProjectCode',
                labelWidth: 60,
                width: 250,
                margin: '5 5 5 15',
                readOnly: true,
                hidden: true
            },
            {
                xtype: 'textfield',
                fieldLabel: '项目名称',
                id:'ProjectName',
                labelWidth: 60,
                width:250,
                margin:'5 5 5 15'
            }
            // ,{
            //     xtype: 'combo',
            //     id: "ck",
            //     store: ckStore,
            //     editable: false,
            //     queryMode: 'local',
            //     fieldLabel: '计划厂矿',
            //     displayField: 'V_DEPTNAME',
            //     valueField: 'V_DEPTCODE',
            //     labelWidth: 60,
            //     margin:'5 5 5 0',
            //     width: 250,
            //     hidden:true
            // }
            ,{
                xtype : 'combo',
                id : "zyq",
                store: zyqStore,
                editable : false,
                queryMode : 'local',
                fieldLabel : '计划作业区',
                margin:'5 5 5 0',
                displayField: 'V_DEPTNAME',
                valueField: 'V_DEPTCODE',
                labelWidth :80,
                width:250,
                labelAlign : 'right'
                // ,hidden:true
            },{
                xtype : 'combo',
                id : "zy",
                store: zyStore,
                editable : false,
                queryMode : 'local',
                fieldLabel : '专 业',
                margin:'5 5 5 0',
                displayField: 'V_ZYMC',
                valueField: 'V_GUID',
                width:265,
                labelWidth :75,
                labelAlign : 'right'
            },
            {
                xtype : 'datefield',
                id:'btime',
                editable : false,
                fieldLabel : '开工时间',
                margin:'5 5 5 0',
                labelWidth :60,
                width:170,
                labelAlign : 'right',
                format:'Y/m/d',
                value:new Date()
            },
            {
                xtype : 'datefield',
                id:'etime',
                editable : false,
                fieldLabel : '竣工时间',
                margin:'5 5 5 0',
                labelWidth :60,
                width:170,
                labelAlign : 'right',
                format:'Y/m/d',
                value:new Date()
            }
        ]
    });
    var textpanel=Ext.create('Ext.panel.Panel',{
        id:'textPanel',
        region:'center',
        layout:'border',
        // height:'50%',
        height:155,
        // autoScroll:true,
        collapsible: true,
        items:[{
            xtype     : 'textareafield',
            id:'qstext',
            name      : 'message',
            fieldLabel: '维修工程请示',
            margin:'5 5 5 20',
            position: 'absolute',
            width:750,
            labelWidth :50,
            height:90
        }]
    });
    //填写panel
    var toolpanel=Ext.create('Ext.panel.Panel',{
        id:'toolpanel',
        region:'north',
        layout:'border',
        height:'20%',
        items:[combpanel,textpanel]
    });


    //缺陷
    var delgrid=Ext.create('Ext.grid.Panel',{
        id:'delgrid',
        region:'center',
        columnLines:true,
        border:false,
        store: qxGridStore,
        autoScroll:true,
        columns: [
            {xtype: 'rownumberer', text: '序号', width: 50, align: 'center'},
            {text: '删除',width: 80, dataIndex: 'I_ID',  align: 'center',renderer:DelDefect},
            {text: '上传附件',width: 120, dataIndex: 'DEFILENUM',align: 'center',renderer:upfilefun},
            {text:'解决方案',width:120,dataIndex:'V_GUID',align:'center',renderer:Onjjfa},
            {text:'备件材料',width:120,dataIndex:'V_GUID',align:'center',renderer:Onbjcl},
            {text: '解决方案', width: 280, dataIndex: 'DEF_SOLVE', align: 'center', renderer: atleft},
            {text: '备件材料', width: 280, dataIndex: 'BJ_STUFF', align: 'center', renderer: atleft},
            {text: '缺陷code',width: 140, dataIndex: 'V_GUID', align: 'center',renderer:atleft,hidden:true},
            {text: '设备名称',width: 140, dataIndex: 'V_EQUCODE', align: 'center',renderer:atleft,hidden:true},
            {text: '设备名称',width: 140, dataIndex: 'V_EQUNAME', align: 'center',renderer:atleft},
            {text: '缺陷类型',width: 120, dataIndex: 'V_SOURCENAME', align: 'center',renderer:atleft,hidden:true},
            {text: '缺陷内容',width: 300, dataIndex: 'V_DEFECTLIST', align: 'center',renderer:atleft},
            {text: '缺陷日期',width: 140, dataIndex: 'D_DEFECTDATE', align: 'center',renderer:atleft}

        ]
        ,
        // plugins: [Ext.create('Ext.grid.plugin.CellEditing', {
        //     clicksToEdit: 1,
        //     listeners: {
        //         // beforeedit:function (editor, context, eOpts) {
        //         //     if(context.record.get('D_MONTH')!=date.getMonth()+1&&context.record.get('D_YEAR')==date.getFullYear()){
        //         //         alert("非本月数据无法修改");return false;
        //         //     }
        //         // },
        //         edit: OnChangeEleData
        //     }
        // })],
        height:395, //'100%',//132,
        // height:'35%',
        width: '100%',
        tbar: [
            '缺陷明细'
            ,{ xtype: 'tbfill' }
            //, { xtype: 'tbseparator',baseCls:'x-toolbar-separator-horizontal', margin:'8 8 5 8'},
            /*{
                xtype: 'button',
                text: '查看更多',
                // margin: '5 0 5 0',
                bodyStyle:'float:right;',
                icon:dxImgPath + '/search.png',
                // iconCls:'Magnifierzoomin',
                listeners:{click:OnLookMoreDefect}
            }*/
        ]
    });

    //修旧查询
    var xjpanel=Ext.create('Ext.grid.Panel', {
        id:'xjpanel',
        store:dqxgridStore2,
        region : 'west',
        split: true,
        width:540,
        autoScroll:true,
        margin:'0px',
        columnLines: true,
        border: true,
        columns: [
            {xtype: 'rownumberer', text: '序号', width: 50, align: 'center'},
            // {text: '设备名称',width: 140, dataIndex: 'V_EQUNAME', align: 'center',renderer:atleft},
            {text: '缺陷类型',width: 120, dataIndex: 'V_SOURCENAME', align: 'center',renderer:atleft},
            {text: '缺陷内容',width: 300, dataIndex: 'V_DEFECTLIST', align: 'center',renderer:atleft},
            {text: '缺陷日期',width: 140, dataIndex: 'D_DEFECTDATE', align: 'center',renderer:atleft}
        ],tbar:[
            {
                xtype: 'combo',
                id: 'bjzyq',
                store: bjzyqStore,
                fieldLabel: '作业区',
                labelAlign: 'right',
                editable: false,
                margin: '5 0 5 15',
                labelWidth: 75,
                width: 255,
                displayField: 'V_DEPTNAME',
                valueField: 'V_DEPTCODE',
                queryMode: 'local'
            }
        ],listeners:{itemclick:OnBtnAddQx}
    });
    //选择panel
    var cpanel=Ext.create('Ext.panel.Panel',{
        id:'cpanel',
        region:'center',
        layout:'border',
        items:[xjpanel,delgrid]
    });
    //添加缺陷面板
    // var tjqxgrid1 = Ext.create('Ext.grid.Panel', {
    //     id:'tjqxgrid1',
    //     store:dqxgridStore,
    //     region: "center",
    //     split: true,
    //     width:540,
    //     margin:'0px',
    //     columnLines: true,
    //     border: true,
    //     columns: [
    //         {text: '设备名称',width: 140, dataIndex: 'V_EQUNAME', align: 'center',renderer:atleft},
    //         {text: '缺陷类型',width: 120, dataIndex: 'V_SOURCENAME', align: 'center',renderer:atleft},
    //         {text: '缺陷内容',width: 300, dataIndex: 'V_DEFECTLIST', align: 'center',renderer:atleft},
    //         {text: '缺陷日期',width: 140, dataIndex: 'D_DEFECTDATE', align: 'center',renderer:atleft}
    //     ],listeners:{itemclick:OnBtnAddQx}
    // });
    // var dbtnAdd_tjqx = Ext.create('Ext.window.Window', {
    //     id: 'dbtnAdd_tjqx',
    //     width: 1100,
    //     height: 500,
    //     title: '缺陷选择',
    //     modal: true,
    //     frame: true,
    //     closeAction: 'hide',
    //     closable: true,
    //     layout: 'border',
    //     items: [tjqxgrid1]
    // });

    //解决方案窗口
    var JJFAWIN=Ext.create('Ext.window.Window',{
        id:'JJFAWIN',
        width:348,
        height:170,
        title:'解决方案',
        frame:true,
        closeAction:'hide',
        closable:true,
        layout:'vbox',
        items:[
            {
                xtype:'button',
                id:'jfsaveBtn',
                text:'确认保存',
                margin:'5 5 5 20',
                handler:saveJB
            },
            {
                xtype     : 'textareafield',
                id:'jjfa',
                grow      : true,
                name      : 'message',
                // fieldLabel: '解决方案',
                anchor    : '100%',
                margin:'5 5 5 20',
                // labelWidth :50,
                width:300,
                height:100
            }
        ]
    });
    //备件材料窗口
    var BJCLWIN=Ext.create('Ext.window.Window',{
        id:'BJCLWIN',
        width:348,
        height:170,
        title:'备件材料',
        frame:true,
        closeAction:'hide',
        closable:true,
        layout:'vbox',
        items:[
            {
                xtype:'button',
                id:'bjsaveBtn',
                text:'确认保存',
                margin:'5 5 5 20',
                handler:saveJB
            },
            {
                xtype     : 'textareafield',
                id:'bjcl',
                grow      : true,
                name      : 'message',
                // fieldLabel: '备件材料',
                anchor    : '100%',
                margin:'5 5 5 20',
                // labelWidth :50,
                width:300,
                height:100
            }
        ]
    });

    //缺陷附件上传
    var filegrid=Ext.create("Ext.grid.Panel", {
        id: 'filegrid',
        region: 'center',
        height: '100%',
        width: '100%',
        columnLines: true,
        store: fileview,
        autoScroll: true,
        margin: '10px 0px 0px 15px',
        //colspan: 3,
        columns: [
            //     {
            //     text:'附件编码',
            //     hide:true,
            //     dataIndex:'FILE_CODE'
            // },
            {
                text: '附件名称',
                flex: 0.6,
                width:340,
                id : 'fjname',
                align: 'center',
                dataIndex: "FILE_NAME"
                //renderer: _downloadRander
            }, {
                text: '操作',
                flex: 0.4,
                width:340,
                align: 'center',
                renderer: _delRander
            }]
    });
    var win=Ext.create('Ext.window.Window',{
        id: 'win',
        title: '附件添加窗口',
        closeAction: 'hide',
        layout: 'border',
        width: 880,
        height: 400,
        modal: true,
        plain: true,
        bodyPadding: 10,
        items: [{
            xtype: 'form',
            id: 'uploadFile',
            region: 'north',
            layout: 'hbox',
            fileUpload: true,
            baseCls: 'my-panel-no-border',
            items: [{
                xtype: "filefield",
                name: 'V_V_BLOB',
                id: "V_V_BLOB",
                enctype: "multipart/form-data",
                fieldLabel: "上传附件",
                fileUpload: true,
                allowBlank: false,
                labelWidth: 100,
                width: 440,
                labelStyle: 'color:red;font-weight:bold',
                margin: '5px 0px 5px 5px',
                emptyText: '请选择文件',
                buttonText: '浏览',
                invalidText: '文件格式不正确'
            }, {
                id: 'insertFilesFj2',
                xtype: 'button',
                text: '上传',
                style: ' margin: 5px 0px 0px 15px',
                handler: _upLoadFile
            }, {
                xtype: 'hidden',
                name: 'V_GUID',
                id: 'V_GUID'
            }, {
                xtype: 'hidden',
                name: 'V_FILENAME',
                id: 'V_FILENAME'
            },  {
                xtype: 'hidden',
                name: 'V_PLANT',
                id: 'V_PLANT'
            }, {
                xtype: 'hidden',
                name: 'V_DEPT',
                id: 'V_DEPT'
            }, {
                xtype: 'hidden',
                name: 'V_PERSONCODE',
                id: 'V_PERSONCODE'
            }/*, {
                xtype: 'hidden',
                name: 'V_V_REMARK',
                id: 'V_V_REMARK'
            }*/

            ]
        } ,{
            columnWidth: 1,
            height: 380,
            width: 800,
            items: filegrid
        }],
        closable: true,
        model: true
    });
    Ext.create('Ext.container.Viewport',{
        id:'main',
        layout:'border',
        items:[tpanel,toolpanel,cpanel]
    });



    Ext.data.StoreManager.lookup('zyqStore').on('load',function(){
        Ext.getCmp('zyq').select(V_DEPTCODE);
        QueryZyFzr();
        // Ext.getCmp('zyq').select(Ext.data.StoreManager.lookup('zyqStore').data.get(0));
        // CreateProjectCode();
        // QueryZyFzr();
    });


    Ext.getCmp('zy').on('select',function(){
        // CreateProjectCode();
    });
    Ext.getCmp('zyq').on('select',function(){

        QueryZyFzr();
    });
    Ext.getCmp('bjzyq').on('select',function(){
        QueryBjZyq();
    });



    pageLoad();
    //  QueryZyFzr();
    updateLoad();
});
function pageLoad(){

    QueryZYQ();
    // QueryZyFzr();
    QueryDefect();
    Ext.getBody().unmask();
}


function atleft(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:left;";
    return '<div data-qtip="' + value + '" >' + value + '</div>';
}
function atright(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:right;";
    return '<div data-qtip="' + value + '" >' + value + '</div>';
}
function timelfet(value, metaDate, record, rowIndex, colIndex, store){
    metaDate.style="text-align:center;";
    return '<div date-qtip="'+value + '" >' +value.toString().substring(0,10)+ '</div>';
}

//加载作业区下拉
function QueryZYQ(){
    Ext.data.StoreManager.lookup('zyqStore').load({
        params: {
            'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode'),
            'V_V_DEPTCODE': OrgCode,
            'V_V_DEPTCODENEXT': '%',
            'V_V_DEPTTYPE': '主体作业区'
        }
    });


}
//加载专业负责人
function QueryZyFzr(){
    var nextSprStore = Ext.data.StoreManager.lookup('fzPerStore');
    nextSprStore.proxy.extraParams = {
        V_V_ORGCODE: OrgCode, //Ext.getCmp('ck').getValue(),
        V_V_DEPTCODE:Ext.getCmp('zyq').getValue(),//Ext.util.Cookies.get('v_deptcode')
        V_V_REPAIRCODE: '',
        V_V_FLOWTYPE: 'MaintainPlan',
        V_V_FLOW_STEP: 'start',
        V_V_PERCODE: Ext.util.Cookies.get('v_personcode'),
        V_V_SPECIALTY: '',
        V_V_WHERE: ''

    };
    nextSprStore.currentPage = 1;
    nextSprStore.load();
}
//创建工程编码
/*function CreateProjectCode(){
    Ext.Ajax.request({
        url: AppUrl + '/PM_03/PRO_PM_03_PLAN_PROJECTCODE_C',
        method: 'POST',
        async: false,
        params: {
            V_V_GUID:Guid,
            V_V_YEAR:Year,
            V_V_ORGCODE:OrgCode,
            V_V_DEPTCODE:Ext.getCmp('zyq').getValue(),//Ext.util.Cookies.get('v_deptcode')
            V_V_JHLB:Ext.getCmp('jhlb').getValue(),
            V_V_ZY:Ext.getCmp('zy').getValue()
        },
        success: function (resp) {
            var resp=Ext.decode(resp.responseText);
            if(resp.V_INFO=='成功'){
                Ext.getCmp('ProjectCode').setValue(resp.V_V_PROJECT_OUT);
            }
        }
    });
}*/

//临时保存
function btnSaveProject(){
    var defguid=Ext.data.StoreManager.lookup("qxGridStore").data.items;
    if (defguid.length <= 0) {
        alert("缺陷不可以为空");
        return false;
    }
    for(var i =0;i<defguid.length;i++){
        if (defguid[i].get("DEF_SOLVE") == "") {
            alert("解决方案不可为空");
            return false;
        }
        /*if (defguid[i].get("BJ_STUFF") == "") {
            alert("备件材料不可为空");
            return false;
        }*/

    }

    if(Ext.getCmp('ProjectName').getValue()==""){
        Ext.Msg.alert("消息","项目名称不可以为空");
        return false;
    }
    if(Ext.getCmp('qstext').getValue()==""){
        Ext.Msg.alert("消息","工程请示不可以为空");
        return false;
    }
    Ext.Ajax.request({
        url: AppUrl + 'dxfile/PRO_PM_03_PLAN_YEAR_SAVE',
        method: 'POST',
        async: false,
        params: {
            V_V_GUID:Guid,
            V_V_YEAR:Year,
            V_V_MONTH:'',
            V_V_ORGCODE:OrgCode,
            V_V_ORGNAME:OrgName,
            V_V_DEPTCODE:Ext.getCmp('zyq').getValue(),//Ext.util.Cookies.get('v_deptcode')
            V_V_DEPTNAME:Ext.getCmp('zyq').rawValue,
            V_V_PORJECT_CODE:'',//Ext.getCmp('ProjectCode').getValue(),
            V_V_PORJECT_NAME:Ext.getCmp('ProjectName').getValue(),
            V_V_SPECIALTY:Ext.getCmp('zy').getValue(),
            V_V_SPECIALTYNAME:Ext.getCmp('zy').rawValue,
            V_V_SPECIALTYMANCODE:Ext.getCmp('fzPer').getValue(),
            V_V_SPECIALTYMAN:Ext.getCmp('fzPer').rawValue,
            V_V_WXTYPECODE:'',//Ext.getCmp('wxlx').getValue(),
            V_V_WXTYPENAME:'',//Ext.getCmp('wxlx').rawValue,
            V_V_CONTENT:'',//Ext.getCmp('content').getValue(),
            V_V_MONEYBUDGET:'',//Ext.getCmp('tzze').getValue(),
            V_V_REPAIRDEPTCODE:'',//Ext.getCmp('repairDept').getValue(),
            V_V_BDATE:Ext.Date.format(Ext.getCmp('btime').getValue(),'Y-m-d'),
            V_V_EDATE:Ext.Date.format(Ext.getCmp('etime').getValue(),'Y-m-d'),
            V_V_INMAN:Ext.util.Cookies.get('v_personname2'),
            V_V_INMANCODE:Ext.util.Cookies.get('v_personcode'),
            V_V_JHLB:'',//Ext.getCmp('jhlb').getValue(),
            V_V_SCLB:'',//Ext.getCmp('sclb').getValue(),
            V_V_CPZL:'',//Ext.getCmp('cpzl').getValue(),
            V_V_CPGX:'',//Ext.getCmp('cpgx').getValue(),
            V_V_SGFS:'',//Ext.getCmp('sgfs').getValue(),
            V_V_SFXJ:'',//Ext.getCmp('sfxj').getValue(),

            V_V_ZBFS:'',
            V_V_SZ:'',
            V_V_GUID_UP:'-1',
            V_V_WBS:'',
            V_V_WBS_TXT:'',
            V_V_SUMTIME:'',//Ext.getCmp('jhgs').getValue(),
            V_V_SUMDATE:'',//Ext.getCmp('jhts').getValue(),
            V_V_SPECIALTY_ZX:'',
            V_V_SPECIALTY_ZXNAME:'',
            V_V_BJF:'',//Ext.getCmp('bjf').getValue(),
            V_V_CLF:'',//Ext.getCmp('clf').getValue(),
            V_V_SGF:'',//Ext.getCmp('sgfy').getValue(),
            V_V_QSTEXT:Ext.getCmp('qstext').getValue()
            ,V_V_WXCLASS:'BJ'
        },
        success: function (resp) {
            var resp=Ext.decode(resp.responseText);
            if(resp.V_INFO=='成功'){
                // alert('保存成功！');
                //缺陷日志写入-new
                var STAT="IN";
                newDefectLog(STAT);
                //缺陷日志写入-old
                Ext.Ajax.request({
                    url: AppUrl + 'dxfile/PM_DEFECT_LOG_BY_PRO',
                    method: 'POST',
                    async: false,
                    params: {
                        V_PERCODE:Ext.util.Cookies.get('v_personcode'),
                        V_PERNAME:decodeURI(Ext.util.Cookies.get('v_personname')),
                        V_PROGUID:Guid
                    },
                    success: function (resp) {
                        var resp=Ext.decode(resp.responseText);
                        if(resp.RET=='SUCCESS'){
                            Ext.getCmp('ProjectCode').setValue(resp.V_V_PROCODE);
                            alert('保存成功！');
                            window.opener.selectGridTurn();
                            window.close();
                        }
                    }
                });
            }
        }
    });

}
//缺陷日志写入
function newDefectLog(STAT){
    var records=Ext.data.StoreManager.lookup('qxGridStore').data.items;
    if(records.length>0){
        for(var i=0;i<records.length;i++){
            var retdate= records[i].get('D_DEFECTDATE').split(" ")[0];
            var rethour=records[i].get('D_DEFECTDATE').split(" ")[1];
            var newdate=retdate.split("-")[0]+retdate.split("-")[1]+retdate.split("-")[2]+rethour.split(":")[0]+rethour.split(":")[1]+rethour.split(":")[2];

            Ext.Ajax.request({
                url: AppUrl + 'dxfile/PM_DEFECT_LOG_FROMPRO_IN',
                method: 'POST',
                async: false,
                params: {
                    V_GUID:Guid,
                    V_PERCODE:Ext.util.Cookies.get('v_personcode'),
                    V_DEPTCODE:Ext.util.Cookies.get('v_deptcode'),
                    V_ORG:Ext.util.Cookies.get('v_orgCode'),
                    V_PASS_STAT:STAT,
                    V_DEFECTGUID:records[i].get('V_GUID'),
                    V_DEF_TYPE:records[i].get('V_SOURCECODE'),
                    V_DEF_LIST:records[i].get('V_DEFECTLIST'),
                    V_DEF_DATE:newdate.toString(),//records[i].get('D_DEFECTDATE').toString(),
                    V_BJ:records[i].get('BJ_STUFF'),
                    V_SOLVE:records[i].get('DEF_SOLVE')
                },
                success: function (resp) {
                    var resp=Ext.decode(resp.responseText);
                    if(resp.RET=='SUCCESS'){
                        // alert('保存成功！');
                        // window.opener.selectGridTurn();
                        // window.close();
                    }
                }
            });
        }
    }
}
//上报
function btnFlowStart(){
    if(Ext.getCmp('fzPer').getValue()==""){
        alert("下一步审批人不可为空");
        return false;
    }
    var defguid=Ext.data.StoreManager.lookup("qxGridStore").data.items;
    if (defguid.length <= 0) {
        alert("缺陷不可以为空");
        return false;
    }
    for(var i =0;i<defguid.length;i++){
        if(defguid[i].get("BJ_STUFF")==""){
            alert("解决方案不可为空");
            return false;
        }
        if(defguid[i].get("DEF_SOLVE")==""){
            alert("备件材料不可为空");
            return false;
        }

    }
    if(Ext.getCmp('ProjectName').getValue()==""){
        Ext.Msg.alert("消息","项目名称不可以为空");
        return false;
    }
    if(Ext.getCmp('qstext').getValue()==""){
        Ext.Msg.alert("消息","工程请示不可以为空");
        return false;
    }
    Ext.Ajax.request({
        url: AppUrl + 'dxfile/PRO_PM_03_PLAN_YEAR_SAVE',
        method: 'POST',
        async: false,
        params: {
            V_V_GUID:Guid,
            V_V_YEAR:Year,
            V_V_MONTH:'',
            V_V_ORGCODE:OrgCode,
            V_V_ORGNAME:OrgName,
            V_V_DEPTCODE:Ext.getCmp('zyq').getValue(),//Ext.util.Cookies.get('v_deptcode')
            V_V_DEPTNAME:Ext.getCmp('zyq').rawValue,
            V_V_PORJECT_CODE:'',//Ext.getCmp('ProjectCode').getValue(),
            V_V_PORJECT_NAME:Ext.getCmp('ProjectName').getValue(),
            V_V_SPECIALTY:Ext.getCmp('zy').getValue(),
            V_V_SPECIALTYNAME:Ext.getCmp('zy').rawValue,
            V_V_SPECIALTYMANCODE:Ext.getCmp('fzPer').getValue(),
            V_V_SPECIALTYMAN:Ext.getCmp('fzPer').rawValue,
            V_V_WXTYPECODE:'',//Ext.getCmp('wxlx').getValue(),
            V_V_WXTYPENAME:'',//Ext.getCmp('wxlx').rawValue,
            V_V_CONTENT:'',//Ext.getCmp('content').getValue(),
            V_V_MONEYBUDGET:'',//Ext.getCmp('tzze').getValue(),
            V_V_REPAIRDEPTCODE:'',//Ext.getCmp('repairDept').getValue(),
            V_V_BDATE:Ext.Date.format(Ext.getCmp('btime').getValue(),'Y-m-d'),
            V_V_EDATE:Ext.Date.format(Ext.getCmp('etime').getValue(),'Y-m-d'),
            V_V_INMAN:Ext.util.Cookies.get('v_personname2'),
            V_V_INMANCODE:Ext.util.Cookies.get('v_personcode'),
            V_V_JHLB:'',//Ext.getCmp('jhlb').getValue(),
            V_V_SCLB:'',//Ext.getCmp('sclb').getValue(),
            V_V_CPZL:'',//Ext.getCmp('cpzl').getValue(),
            V_V_CPGX:'',//Ext.getCmp('cpgx').getValue(),
            V_V_SGFS:'',//Ext.getCmp('sgfs').getValue(),
            V_V_SFXJ:'',//Ext.getCmp('sfxj').getValue(),

            V_V_ZBFS:'',
            V_V_SZ:'',
            V_V_GUID_UP:'-1',
            V_V_WBS:'',
            V_V_WBS_TXT:'',
            V_V_SUMTIME:'',//Ext.getCmp('jhgs').getValue(),
            V_V_SUMDATE:'',//Ext.getCmp('jhts').getValue(),
            V_V_SPECIALTY_ZX:'',
            V_V_SPECIALTY_ZXNAME:'',
            V_V_BJF:'',//Ext.getCmp('bjf').getValue(),
            V_V_CLF:'',//Ext.getCmp('clf').getValue(),
            V_V_SGF:'',//Ext.getCmp('sgfy').getValue(),
            V_V_QSTEXT:Ext.getCmp('qstext').getValue()
            ,V_V_WXCLASS:'BJ'
        },
        success: function (resp) {
            var resp=Ext.decode(resp.responseText);
            if(resp.V_INFO=='成功'){
                Ext.getCmp('ProjectCode').setValue(resp.V_V_PROCODE);
                //流程发起
                Ext.Ajax.request({
                    url: AppUrl + 'Activiti/StratProcess',
                    async: false,
                    method: 'post',
                    params: {
                        parName: ["originator", "flow_businesskey", V_NEXT_SETP, "idea", "remark", "flow_code", "flow_yj", "flow_type"],
                        parVal: [Ext.util.Cookies.get('v_personcode'), Guid, Ext.getCmp('fzPer').getValue(), "请审批!", Ext.getCmp('qstext').getValue(), Ext.getCmp('ProjectCode').getValue(), "请审批！", "MaintainPlan"],
                        processKey: processKey,
                        businessKey: Guid,
                        V_STEPCODE: 'Start',
                        V_STEPNAME: V_STEPNAME,
                        V_IDEA: '请审批！',
                        V_NEXTPER: Ext.getCmp('fzPer').getValue(),
                        V_INPER: Ext.util.Cookies.get('v_personcode')
                    },
                    success: function (response) {
                        if (Ext.decode(response.responseText).ret == 'OK') {
                            //缺陷日志写入-new
                            var STAT="SB";
                            newDefectLog(STAT);
                            //缺陷日志写入-old
                            Ext.Ajax.request({
                                url: AppUrl + 'dxfile/PM_DEFECT_LOG_BY_PRO',
                                method: 'POST',
                                async: false,
                                params: {
                                    V_PERCODE:Ext.util.Cookies.get('v_personcode'),
                                    V_PERNAME:decodeURI(Ext.util.Cookies.get('v_personname')),
                                    V_PROGUID:Guid
                                },
                                success: function (resp) {
                                    var resp=Ext.decode(resp.responseText);
                                    if(resp.RET=='SUCCESS'){
                                        // alert('保存成功！');
                                        // window.opener.selectGridTurn();
                                        // window.close();
                                    }
                                }
                            });
                            Ext.Ajax.request({
                                url: AppUrl + '/PM_03/PM_03_PLAN_YEAR_STATE_SEND',
                                method: 'POST',
                                async: false,
                                params: {
                                    V_V_GUID: Guid,
                                    V_V_STATECODE: '1'
                                },
                                success: function (resp) {
                                    var resp = Ext.decode(resp.responseText);
                                    if (resp.V_INFO == 'SUCCESS') {
                                        Ext.Ajax.request({
                                            url: AppUrl + '/PM_03/PM_03_PLAN_YEAR_FLOW_LOG_SET',
                                            method: 'POST',
                                            async: false,
                                            params: {
                                                V_V_GUID: Guid,
                                                V_V_FLOWCODE: '1',
                                                V_V_FLOWNAME: '上报',
                                                V_V_IDEA: '请审批',
                                                V_V_INPERCODE: Ext.util.Cookies.get('v_personcode'),
                                                V_V_INPERNAME: Ext.util.Cookies.get('v_personname2'),
                                                V_V_NEXTPERCODE: '',
                                                V_V_NEXTPERNAME: ''
                                            },
                                            success: function (resp) {
                                                var resp = Ext.decode(resp.responseText);
                                                if (resp.V_INFO == 'SUCCESS') {
                                                    alert('上报成功！');
                                                    window.opener.selectGridTurn();
                                                    window.close();
                                                }
                                            }
                                        });
                                    }
                                }
                            });

                        } else if (Ext.decode(response.responseText).error == 'ERROR') {
                            Ext.Msg.alert('提示', '该流程发起失败！');
                        }
                    }
                });
            }

        }
    });
}
function updateLoad(){
    if(SIGN=="UPDATE"){
        Ext.Ajax.request({
            url: AppUrl + '/PM_03/PRO_PM_03_PLAN_PROJECT_SEL',
            method: 'POST',
            async: false,
            params: {
                V_V_GUID:Guid
            },
            success: function (resp) {
                var resp=Ext.decode(resp.responseText);
                if(resp.list!=null){
                    // Ext.getCmp('northPanel').setTitle(resp.list[0].V_YEAR+"年"+resp.list[0].V_ORGNAME+"大修计划编制");
                    Year=resp.list[0].V_YEAR;
                    OrgCode=resp.list[0].V_ORGCODE;
                    OrgName=resp.list[0].V_ORGNAME;
                    DeptCode=resp.list[0].V_DEPTCODE;
                    fzrPer=resp.list[0].V_SPECIALTYMANCODE;
                    //专业默认值
                    Ext.data.StoreManager.lookup('zyStore').on('load',function() {
                        if (resp.list[0].V_SPECIALTY == '') {
                            Ext.getCmp('zy').select(Ext.data.StoreManager.lookup('zyStore').getAt(0));
                        } else {
                            Ext.getCmp('zy').select(resp.list[0].V_SPECIALTY);
                        }
                    });

                    Ext.getCmp('ProjectCode').setValue(resp.list[0].V_PORJECT_CODE);
                    Ext.getCmp('ProjectName').setValue(resp.list[0].V_PORJECT_NAME);
                    Ext.getCmp("qstext").setValue(resp.list[0].V_QSTEXT);

                    if(resp.list[0].V_BDATE==''){
                        Ext.getCmp('btime').setValue(new Date());
                    }else{
                        Ext.getCmp('btime').setValue(resp.list[0].V_BDATE.split(" ")[0]);
                    }

                    if(resp.list[0].V_EDATE==''){
                        Ext.getCmp('etime').setValue(new Date());
                    }else{
                        Ext.getCmp('etime').setValue(resp.list[0].V_EDATE.split(" ")[0]);
                    }

                    if(resp.list[0].V_STATE=='99'){
                        Ext.getCmp('startFlow').show();
                        /*Ext.getCmp('agreeFlow').hide();
                        Ext.getCmp('disAgreeFlow').hide();*/
                    }else{
                        Ext.getCmp('startFlow').hide();
                        /*  Ext.getCmp('agreeFlow').show();
                          Ext.getCmp('disAgreeFlow').show();*/
                    }
                }
            }
        });
    }
}
//缺陷查看更多
function OnLookMoreDefect(){

}
function Onjjfa(value, metaDate, record, rowIndex, colIndex, store){
    // return '<a href="javascript:onJjfa(\'' + record.data.V_GUID +'\',\''+record.data.V_EQUCODE+'\')">解决方案</a>';
    // return '<button  onclick="onJjfa(\'' + record.data.V_GUID +'\',\''+record.data.V_EQUCODE+'\')">解决方案</button>';
    var id = 'jjfa'+value;
    Ext.defer(function () {
        Ext.widget('button', {
            icon:dxImgPath+'/accept.png',
            renderTo: id,
            //value: value / 100,
            height: 25,
            width: 110,
            text: '解决方案',
            margin: 'padding:10px 50px 10px 10px;',
            handler: function () {
                onJjfa(record.data.V_GUID,record.data.V_EQUCODE);
            }
        });
    }, 50);
    return Ext.String.format('<div id="{0}"></div>', id);
}
function Onbjcl(value, metaDate, record, rowIndex, colIndex, store){
    // return '<a href="javascript:onBjcl(\'' + record.data.V_GUID +'\',\''+record.data.V_EQUCODE+'\')">备件材料</a>';
    var id = 'bjcl'+value;
    Ext.defer(function () {
        Ext.widget('button', {
            icon:dxImgPath+'/accept.png',
            renderTo: id,
            //value: value / 100,
            height: 25,
            width: 110,
            text: '备件材料',
            margin:'padding:10px 50px 10px 10px;',
            handler: function () {
                onBjcl(record.data.V_GUID,record.data.V_EQUCODE);
            }
        });
    }, 50);
    return Ext.String.format('<div id="{0}"></div>', id);
}
//缺陷解决编辑
function OnChangeEleData(def_guid){

    Ext.Ajax.request({
        url:AppUrl+"dxfile/DEFECT_BY_MAINTAIN_JJFA_SEL",
        method:'POST',
        params:{
            V_DEFGUID:def_guid,//record.data.V_GUID,
            V_PRO_GUID:Guid
        },
        success:function(response){
            var resp=Ext.decode(response.responseText)
            if(resp.RET=='SUCCESS'){
                if(Ext.getCmp("jjfa")!=undefined){
                    Ext.getCmp("jjfa").setValue(resp.JJFA);
                }
                if(Ext.getCmp("bjcl")!=undefined){
                    Ext.getCmp("bjcl").setValue(resp.BJCL);
                }
            }
        }
    });
    // return '<a href="javascript:onJjfa(\'' + record.data.V_GUID +','+record.data.V_EQUCODE+'\')">解决方案</a>'+'  '+'|'+'  '+'<a href="javascript:onBjcl(\'' + record.data.V_GUID + ','+record.data.V_EQUCODE+'\')">备件材料</a>';
}
function onJjfa(defectguid,equcode){
    OnChangeEleData(defectguid);
    Ext.getCmp("JJFAWIN").show();
    DTdefectguid=defectguid;
    DTequcode=equcode;
}
function onBjcl(defectguid,equcode){
    OnChangeEleData(defectguid);
    Ext.getCmp("BJCLWIN").show();
    DTdefectguid=defectguid;
    DTequcode=equcode;
}
//解决方案+备件材料保存
function saveJB(){
    var v_jjfa="";
    var v_bjcl="";
    if(Ext.getCmp("jjfa")!=undefined){
        v_jjfa=Ext.getCmp("jjfa").getValue();
    }
    if(Ext.getCmp("bjcl")!=undefined){
        v_bjcl=Ext.getCmp("bjcl").getValue();
    }
    Ext.Ajax.request({
        url: AppUrl + 'dxfile/DEFECT_BY_MAINTAINPLAN_IN',
        method: 'POST',
        params: {
            V_PROGUID: Guid,
            V_DEFECTGUID: DTdefectguid,//defectguid,//e.context.record.data.V_GUID,
            V_INPERCODE: Ext.util.Cookies.get('v_personcode'),
            V_INDEPT: Ext.util.Cookies.get('v_deptcode'),
            V_INORG: Ext.util.Cookies.get('v_orgCode'),//decodeURI(Ext.util.Cookies.get('v_orgname').substring()),
            V_DEF_SOLVE:v_jjfa,// e.context.record.data.DEF_SOLVE,
            V_BJ_STUFF:v_bjcl,// e.context.record.data.BJ_STUFF,
            V_EQUCODE:DTequcode//equcode//e.context.record.data.V_EQUCODE
        },
        success: function (response) {
            var resp = Ext.decode(response.responseText);
            if (resp.RET == "SUCCESS") {
                QueryDefect();
                Ext.getCmp("jjfa").setValue("");
                Ext.getCmp("JJFAWIN").close();
                Ext.getCmp("bjcl").setValue("");
                Ext.getCmp("BJCLWIN").close();
                // alert("添加成功");
            }
        }
    });
}
// 设备树点击事件
// function OnClickTreeItem(store, record, item, index, e, eOpts){
//
//     if (record.data.leaf == true) {
//         equcode=record.data.id;
//         equname=record.data.text;
//         equtype=record.data.V_EQUTYPECODE;
//         equstie=record.data.V_EQUSITE;
//         QueryQxByEqu(equcode);
//         Ext.getCmp("dbtnAdd_tjqx").show();
//     }
// }
//关闭缺陷win
function winQxClose(){
    Ext.getCmp('btnAdd_tjqx').hide();
}
//删除缺陷
function DelDefect(value, metaData, record){

    var id = 'qx'+value;//metaData.record.id;

    Ext.defer(function () {
        Ext.widget('button', {
            icon:dxImgPath+'/delete.png',
            renderTo: id,
            //value: value / 100,
            height: 25,
            width: 55,
            text: '删除',
            margin:'padding:10px 50px 10px 10px;',
            handler: function () {
                _deleteDefect(record.data.V_EQUCODE,record.data.V_GUID);
            }
        });
    }, 50);
    return Ext.String.format('<div id="{0}"></div>', id);
    // return '<a href="#" onclick="_deleteDefect(\'' + record.data.V_GUID + '\')">' + '删除' + '</a>';
}
function _deleteDefect(v_equcode,DefectGuid){
    //删除缺陷关联设备
    Ext.Ajax.request({
        url: AppUrl + '/PM_03/PM_03_PLAN_YEAR_EQU_DEL',
        method: 'POST',
        async: false,
        params: {
            V_V_PLANGUID:Guid,
            V_V_EQUCODE:v_equcode
        },
        success: function (resp) {
            var resp=Ext.decode(resp.responseText);
            if(resp.V_INFO=='成功'){

            }
        }
    });
    Ext.Ajax.request({
        url: AppUrl + 'dxfile/DEFECT_BY_MAINTAINPLAN_EQU_DEL',
        method: 'POST',
        async: false,
        params: {
            V_DEFGUID:DefectGuid,
            V_PROGUID:Guid
        },
        success: function (resp) {
            var resp=Ext.decode(resp.responseText);
            if(resp.RET=='SUCCESS'){

            }else{
                alert("方案删除失败");
            }
        }
    });
    Ext.Ajax.request({
        url: AppUrl + '/PM_03/PM_03_PLAN_YEAR_DEFECT_DEL',
        method: 'POST',
        async: false,
        params: {
            V_V_PROJECT_GUID:Guid,
            V_V_DEFECT_GUID:DefectGuid
        },
        success: function (resp) {
            var resp=Ext.decode(resp.responseText);
            if(resp.V_INFO=='SUCCESS'){
                // QueryDefect();
                //修改缺陷状态
                Ext.Ajax.request({
                    url: AppUrl + 'cjy/PRO_PM_DEFECT_STATE_SET',
                    method: 'POST',
                    async: false,
                    params: {
                        V_V_GUID: DefectGuid,
                        V_V_STATECODE: '10'//未处理

                    },
                    success: function (ret) {
                        var resp = Ext.decode(ret.responseText);
                        if(resp.V_INFO=='success'){
                            QueryDefect();
                        }else{
                            alert("修改缺陷状态失败");
                        }

                    }
                });
                //写入缺陷-维修计划日志
                Ext.Ajax.request({
                    url:AppUrl+'dxfile/PROJECT_BY_DEFECT_LOG_IN',
                    method:'POST',
                    params:{
                        V_PROGUID:Guid,
                        V_DEFECTGUID:DefectGuid,
                        V_PERCODE:Ext.util.Cookies.get("v_personcode"),
                        V_DEPT:Ext.util.Cookies.get("v_deptcode"),
                        V_ORG:Ext.util.Cookies.get("v_orgCode"),
                        V_STATE:'DEL'
                    },
                    success:function (response){
                        var resp=Ext.decode(response.responseText);
                    }
                });
                //删除维修日志审批表格关联
                Ext.Ajax.request({
                    url:AppUrl+'dxfile/PM_DEFECT_LOG_FROMPRO_DEL',
                    method:'POST',
                    params:{
                        V_PROGUID:Guid,
                        V_DEFECTGUID:DefectGuid
                    },
                    success:function (response){
                        var resp=Ext.decode(response.responseText);
                        if(resp.RET=="SUCCESS"){}
                    }
                });
            }else{
                alert("删除失败");
            }
        }
    });
}
//缺陷上传附件
function upfilefun(value, metaData, record){
    metaData.style="text-align:center";
    return '<a href="javascript:upfile(\''+record.data.V_GUID+'\')">'+"数量:"+value+"|"+"上传"+'</a>'
}
function upfile(value) {
    fjDefect=value;
    Ext.data.StoreManager.lookup('fileview').load();
    Ext.getCmp('win').show();

}

function _upLoadFile() {
    var uploadFile = Ext.getCmp('uploadFile');
    var V_V_BLOB = Ext.getCmp('V_V_BLOB').getSubmitValue();
    var V_V_FILENAME = V_V_BLOB.substring(0, V_V_BLOB.indexOf('.'));

    Ext.getCmp('V_GUID').setValue(fjDefect);
    Ext.getCmp('V_V_BLOB').setValue(V_V_BLOB);
    Ext.getCmp('V_FILENAME').setValue(V_V_FILENAME);
    //  Ext.getCmp('V_TYPE').setValue(V_TYPE);
    Ext.getCmp('V_PLANT').setValue(Ext.util.Cookies.get('v_orgCode'));
    Ext.getCmp('V_DEPT').setValue(Ext.util.Cookies.get('v_deptcode'));
    Ext.getCmp('V_PERSONCODE').setValue(Ext.util.Cookies.get('v_personcode'));

    //if(uploadFile.form.isValid()){
    if (Ext.getCmp('V_V_BLOB').getValue() == '') {
        Ext.Msg.alert('错误', '请选择你要上传的文件');
        return;
    }
    Ext.MessageBox.show({
        title: '请等待',
        msg: '文件正在上传...',
        progressText: '',
        width: 300,
        progress: true,
        closable: false,
        animEl: 'loding'

    });

    uploadFile.getForm().submit({
        url: AppUrl + 'PM_07/DEFECT_UPFILE_INSERT',
        method: 'POST',
        async: false,
        waitMsg: '上传中...',
        success: function (form, action) {
            var massage=action.result.message;
            if(massage=="{list=Success}"){
                Ext.Msg.alert('成功', '上传成功');
                filequery(fjDefect);
                QueryDefect();
            }
        },
        failure: function (resp) {
            Ext.Msg.alert('错误', '上传失败');
        }

    });
    //}

}
function _delRander(a, value, metaData) {
    return '<a href="javascript:onDel(\'' + metaData.data.FILE_CODE + '\')">删除</a>';
}

function onDel(fileguid) {
    Ext.Ajax.request({
        url: AppUrl + 'PM_07/DEFECT_UPFILE_DELETE',
        method: 'POST',
        async: false,
        params: {
            V_FILECODE: fileguid
        },
        success: function (response) {
            var data = Ext.JSON.decode(response.responseText);

            if (data.list == 'Success') {
                Ext.Msg.alert('成功', '删除附件成功');
                filequery(fjDefect);
                QueryDefect();
            } else {
                Ext.MessageBox.show({
                    title: '错误',
                    msg: data.message,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                });
            }
        },
        failure: function (resp) {
            Ext.Msg.alert('提示信息', '删除失败');
        }
    });
}

function filequery(fjDefect) {
    Ext.data.StoreManager.lookup('fileview').load({
        params: {
            V_GUID: fjDefect
        }
    });
}
function QueryQxByEqu(equcode){
    Ext.data.StoreManager.lookup('dqxgridStore').load({
        params:{
            V_V_DEPTCODE:Ext.getCmp('zyq').getValue(),//Ext.util.Cookies.get('v_deptcode')
            V_V_EQUCODE:equcode,
            V_V_STATECODE:'10'
        }
    });
}
//设备保存缺陷
function OnBtnAddQx(a, record){

    Ext.Ajax.request({
        url: AppUrl + 'cjy/PM_DEFECTTOWORKORDER_SET_PD',
        method: 'POST',
        async: false,
        params: {
            V_V_DEFECT_GUID: record.data.V_GUID,
            V_V_PROJECT_GUID: Guid
        },
        success: function (resp) {
            var resp = Ext.decode(resp.responseText);
            if(resp.V_INFO=='SUCCESS'){
                //写入缺陷-维修计划日志
                Ext.Ajax.request({
                    url:AppUrl+'dxfile/PROJECT_BY_DEFECT_LOG_IN',
                    method:'POST',
                    params:{
                        V_PROGUID:Guid,
                        V_DEFECTGUID:record.data.V_GUID,
                        V_PERCODE:Ext.util.Cookies.get("v_personcode"),
                        V_DEPT:Ext.util.Cookies.get("v_deptcode"),
                        V_ORG:Ext.util.Cookies.get("v_orgCode"),
                        V_STATE:'IN'
                    },
                    success:function (response){
                        var resp=Ext.decode(response.responseText);
                    }
                });
                //修改缺陷状态
                Ext.Ajax.request({
                    url: AppUrl + 'cjy/PRO_PM_DEFECT_STATE_SET',
                    method: 'POST',
                    async: false,
                    params: {
                        V_V_GUID: record.data.V_GUID,
                        V_V_STATECODE: '50'//已计划

                    },
                    success: function (ret) {
                        var resp = Ext.decode(ret.responseText);
                        if(resp.V_INFO=='success'){
                            QueryDefect();
                            // Ext.getCmp("dbtnAdd_tjqx").close();
                            equcode="";
                            equname="";
                            equtype="";
                            equstie="";
                        }else{
                            alert("修改缺陷状态失败");
                        }

                    }
                });

                // QueryDefect();
            }else{
                alert("添加失败！")
            }
        }
    });
}
//查询已选中缺陷
function QueryDefect(){
    Ext.data.StoreManager.lookup('qxGridStore').load({
        params:{
            V_V_PROJECT_GUID:Guid
        }
    });
}
function QueryBjZyq(){
    Ext.data.StoreManager.lookup("dqxgridStore2").load({
        params:{
            V_DEPT_CODE:Ext.getCmp('bjzyq').getValue()
        }
    });
}