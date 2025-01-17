var V_GUID = '';
if (location.href.split('?')[1] != undefined) {
    var parameters = Ext.urlDecode(location.href.split('?')[1]);
    (parameters.V_GUID == undefined) ? V_GUID = '' : V_GUID = parameters.V_GUID;
}

var gridStore = Ext.create("Ext.data.Store", {
    autoLoad: false,
    storeId: 'gridStore',
    fields: ['V_DJ_DATE', 'V_DJ_PERNAME', 'V_CRITERION_CONTENT','V_DJ_STATE','V_DJ_ZQ','V_DJ_NR'],
    proxy: {
        type: 'ajax',
        async: false,
        url: AppUrl + 'PM_06/PM_06_DJ_DATA_SEL',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'list'
        }
    }
});

var Layout = {
    layout : 'border',
    items : [
        {
            xtype : 'panel', border : false, region : 'north', layout : 'column', frame: true,
            defaults: { style: { margin: '5px 0px 5px 5px'}, labelAlign: 'right'},
            items: [
                {xtype: 'datefield', fieldLabel: '开始时间',editable: false, labelWidth: 80,format: 'Y-m-d', value : new Date(new Date().getFullYear() + '/'
                + (new Date().getMonth() + 1) + '/' + 1),id: 'stime' },
                {xtype: 'datefield', fieldLabel: '结束时间', editable: false,labelWidth: 80,format: 'Y-m-d',value : new Date(),id: 'etime' },
                { xtype: 'button', text: '查询', handler: queryGrid,  icon: imgpath + '/search.png'}
            ]
        },
        { xtype: 'gridpanel', region: 'center',  columnLines: true, id: 'grid', store: 'gridStore',
            selType : 'checkboxmodel',
            columns: [
                { xtype: 'rownumberer', text: '序号', width: 60, align: 'center',renderer : stateStyleNum
                },
                {
                    text: '点检时间', align: 'center', width: 150, dataIndex: 'V_DJ_DATE',renderer : stateStyle
                },
                {
                    text: '点检人', align: 'center', width: 150, dataIndex: 'V_DJ_PERNAME',renderer : stateStyle
                },
                {
                    text: '点检内容', align: 'center', width: 150, dataIndex: 'V_CRITERION_CONTENT',renderer : stateStyle
                },
                {
                    text: '是否异常', align: 'center', width: 150, dataIndex: 'V_DJ_STATE',renderer : state
                },
                {
                    text: '点检周期', align: 'center', width: 150, dataIndex: 'V_DJ_ZQ',renderer : stateStyle
                },
                {
                    text: '点检描述', align: 'center', width: 150, dataIndex: 'V_DJ_NR',renderer : stateStyle
                }
            ]
        }
    ]
};



function onPageLoaded() {
    Ext.create('Ext.container.Viewport', Layout);
    queryGrid();
}

function queryGrid(){
    Ext.data.StoreManager.lookup('gridStore').load({
        params: {
            V_V_GUID : V_GUID,
            V_V_STIME : Ext.getCmp('stime').getSubmitValue()+" 00:00:00",
            V_V_ETIME : Ext.getCmp('etime').getSubmitValue()+" 23:59:59"
        }
    });
}

function renderFont(value, metaData){
    metaData.style = 'text-align: left';
    return value;
}
Ext.onReady(onPageLoaded);

function state(a,value,metaData){
    if(a == '1'){
        return '<span style = "color:red"> 异常</span>';

    }
    else{
        return '正常';
    }
}

function stateStyle(value,metaData,record){
    if(record.data.V_DJ_STATE=='1'){
        return '<span style = "color:red">'+value+'</span>';

    }
    else{
        return value;
    }
}
function stateStyleNum(value,metaData,record,rowIndex){
    if(record.data.V_DJ_STATE=='1'){
        return '<span style = "color:red">'+rowIndex+'</span>';

    }
    else{
        return rowIndex;
    }
}