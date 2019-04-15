var fxguid="";
var newfxguid="";
//年份
var date=new Date();
var years = [];
for (var i = date.getFullYear() - 4; i <= date.getFullYear() + 1; i++) {
    years.push({displayField: i, valueField: i});
}

Ext.onReady(function(){
    var yearStore = Ext.create("Ext.data.Store", {
        storeId: 'yearStore',
        fields: ['displayField', 'valueField'],
        data: years,
        proxy: {
            type: 'memory',
            reader: {type: 'json'}
        }
    });
    var gridStore = Ext.create('Ext.data.TreeStore', {
        id: 'gridStore',
        autoLoad: false,
        fields: ['FX_GUID', 'V_PROJECT_CODE', 'V_PROJECT_NAME', 'FX_MONEY', 'FX_CONTENT', 'V_WBS_CODE', 'V_WBS_NAME',
            'V_DATE_B', 'V_DATE_E', 'V_REPAIR_DEPT', 'V_REPAIR_DEPT_TXT', 'V_FZR', 'V_PERSONNAME'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'tree/PRO_MAINTAIN_SEL_FJ',
            actionMethods: {
                read: 'POST'
            }
        },
        reader: {
            type: 'json',
            root: 'list'
        }
        , root: {
            text: 'root',
            expanded: true
        }
    });
    var panel=Ext.create('Ext.panel.Panel',{
        id:'panel',
        region:'north',
        layout:'column',
        frame:true,
        border:false,
        items:[
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
                value: new Date().getFullYear(),
                store: yearStore,
                labelAlign: 'right',
                queryMode: 'local'
            }
            ,{
                xtype: 'button',
                text: '查询',
                icon: imgpath + '/search.png',
                handler: queryGrid
               ,style: 'margin: 5px 0px 0px 10px'

            }
            , {
                xtype: 'button',
                text: '分解',
                icon: imgpath + '/accordion_collapse.png',
                handler: _fenjie
                ,style: 'margin: 5px 0px 0px 10px'
            }
            , {
                xtype: 'button',
                text: '生成工单',
                icon: imgpath + '/accordion_collapse.png',
                handler: _workOCreate
                ,style: 'margin: 5px 0px 0px 10px'
            }
        ]
    });
    var grid=Ext.create('Ext.tree.Panel',{
        id:'grid',
        store:gridStore,
        split : true,
        stripeRows: true,
        rootVisible: false,
        useArrows: true,
        region: 'center',
        columnLines: true,
        autoScroll:true,
        viewConfig:{
            forceFit:true
        },
        columns: [
            {xtype: 'rownumberer', text: '序号', align: 'center', width: 50},
            {text: '放行唯一编码', align: 'center', width: 100, dataIndex: 'FX_GUID', hidden: true},
            {xtype: 'treecolumn', text: '工程编码', align: 'center', width: 100, dataIndex: 'V_PROJECT_CODE',renderer:atleft},
            {text: '工程名称', align: 'center', width: 150, dataIndex: 'V_PROJECT_NAME',renderer:atleft},
            {text: '年度投资（万元）', align: 'center', width: 100, dataIndex: 'FX_MONEY'},
            {text: '放行计划主要内容', align: 'center', width: 120, dataIndex: 'FX_CONTENT'},
            {text: 'WBS编码', align: 'center', width: 100, dataIndex: 'V_WBS_CODE'},
            {text: 'WBS名称', align: 'center', width: 100, dataIndex: 'V_WBS_NAME'},
            {text: '开工时间', align: 'center', width: 120, dataIndex: 'V_DATE_B',renderer:timeTurn},
            {text: '竣工时间', align: 'center', width: 150, dataIndex: 'V_DATE_E',renderer:timeTurn},
            {text: '建设单位编码', align: 'center', width: 100, dataIndex: 'V_REPAIR_DEPT', hidden: true},
            {text: '建设单位名称', align: 'center', width: 180, dataIndex: 'V_REPAIR_DEPT_TXT'},
            {text: '建设单位负责人编码', align: 'center', width: 100, dataIndex: 'V_FZR', hidden: true},
            {text: '建设单位负责人', align: 'center', width: 150, dataIndex: 'V_PERSONNAME'}
        ]
        , listeners: {
            itemClick: function (record,node ) {
                fxguid=node.data.FX_GUID;
            }
        }
    });

    var qxgridStore=Ext.create('Ext.data.Store',{
        id:'qxgridStore',
        autoLoad:false,
        fields:['V_GUID','V_DEFECTLIST','D_INDATE','V_EQUCODE','V_EQUNAME','V_YPRO_GUID'],
        proxy:{
            type:'ajax',
            async:false,
            url:AppUrl+'dxfile/PRO_BY_MAINTAIN_SEL_DEFECT',
            actionMethods:{
                read:'POST'
            },
            reader:{
                type:'json',
                root:'list'
            }
        },
        listeners: {
            load: function (store, records) {
                if(records.length==0){
                    Ext.getCmp("qxWin").close();
                    Ext.Msg.alert("提示","请先关联维修计划");

                }
            }
        }
    });
    var qxpanel=Ext.create('Ext.panel.Panel',{
        id:'qxpanel',
        frame:true,
        border:false,
        region:'north',
        layout:'column',
        items:[{
            xtype:'button',
            text:'确认返回',
            width : 80,
            icon: imgpath + '/add.png',
            handler:turnPage
        }]
    });
    var qxgrid=Ext.create('Ext.grid.Panel',{
        id:'qxgrid',
        store:qxgridStore,
        autoScroll:true,
        region:'center',
        columnLines:true,
        selModel: { //指定单选还是多选,SINGLE为单选，SIMPLE为多选
            selType: 'checkboxmodel',
            mode: 'SINGLE'
        },
        columns:[
            {text: '缺陷guid', width: 140, dataIndex: 'V_GUID', align: 'center',renderer:atCenter},
            {text: '缺陷内容', width: 200, dataIndex: 'V_DEFECTLIST', align: 'center',renderer:atCenter},
            {text: '录入时间', width: 200, dataIndex: 'D_INDATE', align: 'center',renderer:timeTurn},
            {text: '设备编码', width: 100, dataIndex: 'V_EQUCODE', align: 'center',renderer:atCenter},
            {text: '设备名称', width: 100, dataIndex: 'V_EQUNAME', align: 'center',renderer:atCenter},
            {text: '维修计划guid', width: 300, dataIndex: 'V_YPRO_GUID', align: 'center',renderer:atCenter}
        ]
        // ,listeners:{
        //     itemclick:qxgridClick()
        // }
    });
    // 关联缺陷窗口
    var qxWin=Ext.create('Ext.window.Window',{
        id:'qxWin',
        layout:'border',
        closeAction:'hide',
        width:560,
        height:450,
        items:[qxpanel,qxgrid]

    });


    Ext.create('Ext.container.Viewport',{
        id: "id",
        layout: 'border',
        items: [panel, grid]
    });

    queryGrid();
});

function timeTurn(value,metaDate,recode){
    metaDate.style = "text-align:center;";
    var val=value.toString().substr(0,10);
    return val;
}
function queryGrid(){
    Ext.data.StoreManager.lookup('gridStore').load({
        params:{
            V_V_YEAR: Ext.getCmp('nf').getValue(),
            V_UPGRID:  '-1'
        }
    });
}

function _fenjie(){
    if(fxguid==""){
        alert("请单击选择一条记录");
        return false;
    }
//放行计划创建
    Ext.Ajax.request({
        url: AppUrl + 'dxfile/PM_MAINTAIN_GET_FJGUID',
        method: 'POST',
        async: false,
        params: {
            V_GUID: 'fj',
            V_INPERCODE: Ext.util.Cookies.get('v_personcode'),
            V_INPERNAME: decodeURI(Ext.util.Cookies.get('v_personname').substring()),
            V_UPGUID:fxguid
        },
        success: function (resp) {
            var resp = Ext.decode(resp.responseText);
            if (resp.RET != '') {
                newfxguid=resp.RET;

                Ext.data.StoreManager.lookup("qxgridStore").load({
                    params:{
                        V_FXGUID:fxguid
                    }
                });
                    Ext.getCmp("qxWin").show();
            }
        }
    });

    // window.open(AppUrl+'page/PM_220106/fjAddFx.html?fxguid=' +fxguid, '', 'height=600px,width=1200px,top=50px,left=100px,resizable=no,toolbat=no,menubar=no,scrollbars=auto,location=no,status=no')
}

function atleft(value,metaDate,recode){
    metaDate.style="text-align:left";
    return value;
}
function atCenter(value,metaDate,recode){
    metaDate.style="text-align:center";
    return value;
}
// function qxgridClick(view, record, item, index, e, eOpts){
//
// //缺陷-放行关联写入
//     Ext.Ajax.request({
//         url:AppUrl + 'dxfile/MAINTAIN_BY_DEFECT_INSERT',
//         method:'POST',
//         async: false,
//         params: {
//             V_FXGUID:fxguid,
//             V_DEFECTGUID:record.data.V_GUID,
//             V_INPER:Ext.util.Cookies.get('v_personcode'),
//             V_DEPT: Ext.util.Cookies.get('v_deptcode'),
//             V_ORDCODE:Ext.util.Cookies.get('v_orgCode')
//         },
//         success: function (resp) {
//             var resp=Ext.decode(resp.responseText);
//             if(resp.RET=='SUCCESS'){
//
//             }
//         }
//     });
//
// }
function turnPage(){
    var flag=0;
    var records=Ext.getCmp("qxgrid").getSelectionModel().getSelection();
    var num=records.length;
    if(records.length == 0){
        Ext.Msg.alert("提示" ,"请选择至少一条数据");
        return false;
    }

    for(var i=0;i<num;i++){
        //缺陷-放行关联写入
        Ext.Ajax.request({
            url:AppUrl + 'dxfile/MAINTAIN_BY_DEFECT_INSERT',
            method:'POST',
            async: false,
            params: {
                V_FXGUID:newfxguid,
                V_DEFECTGUID:records[i].get('V_GUID'),
                V_INPER:Ext.util.Cookies.get('v_personcode'),
                V_DEPT: Ext.util.Cookies.get('v_deptcode'),
                V_ORDCODE:Ext.util.Cookies.get('v_orgCode')
            },
            success: function (resp) {
                var resp=Ext.decode(resp.responseText);
                if(resp.RET=='SUCCESS'){
                    flag++;
                }
            }
        });
    }
    if(num==flag){
        Ext.getCmp("qxWin").close();
        window.open(AppUrl+'page/PM_220106/fjAddFx.html?fxguid=' +fxguid+'&newguid='+newfxguid, '', 'height=600px,width=1200px,top=50px,left=100px,resizable=no,toolbat=no,menubar=no,scrollbars=auto,location=no,status=no');
    }
}

function selectGridTurn(){
    queryGrid();
}

function _workOCreate(){
    window.open(AppUrl+'page/PM_220106/fx_workorder.html?fxguid=' +fxguid, '', 'height=600px,width=1200px,top=50px,left=100px,resizable=no,toolbat=no,menubar=no,scrollbars=auto,location=no,status=no');
}