var yearval;
var monthval;
var orgval;
if (location.href.split('?')[1] != undefined) {
    yearval = Ext.urlDecode(location.href.split('?')[1]).V_V_YEAR;
    monthval = Ext.urlDecode(location.href.split('?')[1]).V_V_MONTH;
    orgval = Ext.urlDecode(location.href.split('?')[1]).V_V_ORGCODE;
}
//年份
var date = new Date();
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
//计划厂矿

// gridstore
var gridStore = Ext.create('Ext.data.Store', {
    id: 'gridStore',
    autoLoad: false,
    fields: ['V_DEPTCODE', 'V_DEPTNAME', 'ALLNUM', 'EXENUM', 'EXTRATE'],
    proxy: {
        type: 'ajax',
        async: false,
        url: AppUrl + 'dxfile/PM_03_MONTH_PLAN_ZYQSTAT_SEL',
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

var panel = Ext.create('Ext.panel.Panel', {
    region: 'north',
    width: '100%',
    layout: 'column',
    frame: true,
    items: [{xtype: 'label', style: ' margin: 8px 0px 5px 5px;color:red', text: '*注：执行数为生成周计划数量；执行率为执行数/审批完成的月计划总数'}]
});

var cpanel = Ext.create('Ext.grid.Panel', {
    id: 'cpanel',
    region: 'center',
    columnLines: true,
    store: 'gridStore',
    // selType: 'checkboxmodel',
    columns: [{text: '序号', align: 'center', width: 50, xtype: 'rownumberer'},
        {text: '厂矿编码', align: 'center', width: 100, dataIndex: 'V_DEPTCODE', hidden: true},
        {text: '厂矿名称', align: 'center', width: 150, dataIndex: 'V_DEPTNAME', renderer: aleft},
        {text: '月计划总数', align: 'center', width: 100, dataIndex: 'ALLNUM', renderer: aleft},
        {text: '执行数（%)', align: 'center', width: 100, dataIndex: 'EXENUM', renderer: aleft},
        {text: '执行率', align: 'center', width: 100, dataIndex: 'EXTRATE', renderer: aleft}]
});
Ext.onReady(function () {
    Ext.QuickTips.init();
    Ext.create('Ext.container.Viewport', {
        id: 'main',
        layout: 'border',
        items: [panel, cpanel]
    });


    Query();

});

function Query() {
    Ext.data.StoreManager.lookup('gridStore').load({
        params: {
            V_V_YEAR: yearval,
            V_V_MONTH: monthval,
            V_V_ORGCODE: orgval
        }
    });

}

function aleft(value, cellmeta, record, rowIndex, columnIndex, store) {
    var newval = value.substring(0, 4);
    return '<div data-qtip="' + newval + '" >' + newval + '</div>';
}
