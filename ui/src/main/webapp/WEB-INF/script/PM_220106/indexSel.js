var fxguid="";
var newfxguid="";
//年份
var date=new Date();
var years = [];
for (var i = date.getFullYear() - 4; i <= date.getFullYear() + 1; i++) {
    years.push({displayField: i, valueField: i});
}

Ext.onReady(function(){
    Ext.QuickTips.init();
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
        fields: ['FX_GUID','WORKNUM','V_PROJECT_CODE', 'V_PROJECT_NAME', 'FX_MONEY', 'FX_CONTENT', 'V_WBS_CODE', 'V_WBS_NAME',
            'V_DATE_B', 'V_DATE_E', 'V_REPAIR_DEPT', 'V_REPAIR_DEPT_TXT', 'V_FZR', 'V_PERSONNAME'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl + 'tree/PRO_MAINTAIN_SEL_WORK_FJ',
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
            {text: '放行唯一编码', align: 'center', width: 150, dataIndex: 'FX_GUID', hidden: true,renderer:atleft},
            {text: '工程编码', align: 'center', width: 150, dataIndex: 'V_PROJECT_CODE',renderer:atleft},
            {text: '工程名称', align: 'center', width: 150, dataIndex: 'V_PROJECT_NAME',renderer:atleft},
            {text:'工单数量',align:'center',width:70,dataIndex:'WORKNUM',renderer:atleft},
            {text: '年度投资（万元）', align: 'center', width: 140, dataIndex: 'FX_MONEY',renderer:atleft},
            {text: '放行计划主要内容', align: 'center', width: 150, dataIndex: 'FX_CONTENT',renderer:atleft},
            {text: 'WBS编码', align: 'center', width: 150, dataIndex: 'V_WBS_CODE',renderer:atleft},
            {text: '维修工程项目名称', align: 'center', width: 200, dataIndex: 'V_WBS_NAME',renderer:atleft},
            {text: '开工时间', align: 'center', width: 140, dataIndex: 'V_DATE_B',renderer:timeTurn},
            {text: '竣工时间', align: 'center', width: 140, dataIndex: 'V_DATE_E',renderer:timeTurn},
            {text: '建设单位编码', align: 'center', width: 150, dataIndex: 'V_REPAIR_DEPT', hidden: true,renderer:atleft},
            {text: '建设单位名称', align: 'center', width: 200, dataIndex:'V_REPAIR_DEPT_TXT',renderer:atleft},
            {text: '建设单位负责人编码', align: 'center', width: 150, dataIndex: 'V_FZR', hidden: true},
            {text: '建设单位负责人', align: 'center', width: 140, dataIndex: 'V_PERSONNAME',renderer:atleft}
        ]
        , listeners: {
            itemClick: function (record,node ) {
                fxguid=node.data.FX_GUID;
            }
        }
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
    return '<div data-qtip="' + val + '" >' + val + '</div>';
}
function queryGrid(){
    Ext.data.StoreManager.lookup('gridStore').load({
        params:{
            V_V_YEAR: Ext.getCmp('nf').getValue(),
            V_UPGRID:  '-1'
        }
    });
}



function atleft(value,metaDate,recode){
    metaDate.style="text-align:left";
    return '<div data-qtip="' + value + '" >' + value + '</div>';
}
