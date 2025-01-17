/**
 * Created by LL on 2017/11/8.
 */
var sid;
Ext.onReady(function () {
    var yeararr = [];
    for (var i = 2014; i <= new Date().getFullYear() + 1; i++) {
        yeararr.push({
            "code": i,
            "name": i
        });
    }

    var yearStore = Ext.create("Ext.data.Store", {
        autoLoad: true,
        storeId: 'yearStore',
        data: yeararr,
        fields: ['code', 'name'],
        proxy: {
            type: 'memory',
            async: false,
            render: {
                type: 'json'
            }
        }
    });

    var montharr = [];
    for (var i = 1; i <= 12; i++) {
        montharr.push({
            "code": i,
            "name": i
        });
    }

    var monthStore = Ext.create("Ext.data.Store", {
        autoLoad: true,
        storeId: 'monthStore',
        data: montharr,
        fields: ['code', 'name'],
        proxy: {
            type: 'memory',
            async: false,
            render: {
                type: 'json'
            }
        }
    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: false,
        pageSize: 20,
        storeId: 'gridStore',
        fields: ['I_ID', 'I_YEAR', 'I_MONTH', 'VCH_DEPTCODE2', 'VCH_DEPTCODE_CK', 'VCH_CHARGECODE', 'VCH_DEPTNAME2', 'VCH_DEPTNAME_CK', 'VCH_CHARGENAME','VCH_DEPTNAME_GS',
            'F_MONEY_PRIMARYBUD_YEAR', 'F_MONEY_BUD_YEAR', 'F_MONEY_BUD', 'F_MONEY_FACT', 'F_MONEY_MARGIN', 'F_MONEY_BUD_TOTAL', 'F_MONEY_YEAR', 'F_MONEY_MARGIN_TOTAL'],
        proxy: {
            type: 'ajax',
            actionMethods: {
                read: 'POST'
            },
            url: AppUrl + 'YS/ys_report_charge_otherDept_sel',
            reader: {
                type: 'json',
                root: 'list',
                total: 'total'

            },
            extraParams: {}
        }
    });

    var gridStore2 = Ext.create('Ext.data.Store', {
        autoLoad: false,
        pageSize: 20,
        storeId: 'gridStore2',
        fields: ['VCH_DEPTCODE2', 'VCH_CHARGECODE', 'VCH_DEPTNAME2', 'VCH_CHARGENAME', 'F_MONEY_PRIMARYBUD_YEAR', 'F_MONEY_BUD_YEAR',
            'F_MONEY_BUD', 'F_MONEY_FACT', 'F_MONEY_MARGIN', 'F_MONEY_BUD_TOTAL', 'F_MONEY_YEAR', 'F_MONEY_MARGIN_TOTAL','VCH_DEPTNAME_GS'],
        proxy: {
            type: 'ajax',
            actionMethods: {
                read: 'POST'
            },
            url: AppUrl + 'YS/ys_report_charge_c_otherD_sel',
            reader: {
                type: 'json',
                root: 'list',
                total: 'total'

            },
            extraParams: {}
        }
    });


    var gridPanel = Ext.create('Ext.grid.Panel', {
        id: 'gridPanel',
        columnLines: true,
        width: '100%',
        store: gridStore,
        autoScroll: true,
        forceFit: true,
        columns: [
            {
                xtype: 'rownumberer',
                width: 35,
                sortable: false
            },
            {
                text: '费用名称 ',
                width: 120,
                dataIndex: 'VCH_CHARGENAME',
                align: 'left',
                xtype: 'templatecolumn',
                tpl: '<a style="cursor:pointer;">{VCH_CHARGENAME}</a>',
                id: 'costName'
            },{
                text: '所属部门',
                dataIndex: 'VCH_DEPTNAME_GS',
                align: 'center',
                width: 120,
                renderer: left
            },
            {
                text: '标准年预算(万元)',
                dataIndex: 'F_MONEY_PRIMARYBUD_YEAR',
                align: 'center',
                width: 120,
                renderer: right
            },
            {
                text: '执行年预算(万元)',
                dataIndex: 'F_MONEY_BUD_YEAR',
                align: 'center',
                width: 120,
                renderer: right
            },
            {
                text: '月预算(万元)',
                dataIndex: 'F_MONEY_BUD',
                align: 'center',
                width: 120,
                renderer: right
            },
            {
                text: '月实际(万元)',
                dataIndex: 'F_MONEY_FACT',
                align: 'center',
                width: 120,
                renderer: right
            }, {
                text: '月差异(超+降-)(万元)',
                dataIndex: 'F_MONEY_MARGIN',
                align: 'center',
                width: 150,
                renderer: rendValueColor
            }, {
                text: '月累计预算(万元)',
                dataIndex: 'F_MONEY_BUD_TOTAL',
                align: 'center',
                width: 120,
                renderer: right
            }, {
                text: '累计实际(万元)',
                dataIndex: 'F_MONEY_YEAR',
                align: 'center',
                width: 120,
                summaryType: 'sum',
                renderer: right
            }, {
                text: '预算余额(万元)',
                dataIndex: 'F_MONEY_MARGIN_TOTAL',
                align: 'center',
                width: 120,
                renderer: right
            }
        ],
        listeners: {
            itemclick: function (aa, record, item, index, e, eOpts) {
                sid = record.raw.VCH_CHARGECODE;
                Ext.getCmp('dialog').show();
                _querygrid2();
            }
        },
        dockedItems: [
            {
                xtype: 'panel',
                frame: true,
                layout: 'vbox',
                defaults: {
                    style: 'margin:10px 0px 0px 5px'
                },
                items: [{
                    xtype: 'panel',
                    region: 'north',
                    layout: 'column',
                    baseCls: 'my-panel-no-border',
                    items: [{
                        xtype: 'combo',
                        id: 'year',
                        store: 'yearStore',
                        fieldLabel: '年 份',
                        labelAlign: 'right',
                        editable: false,
                        labelWidth: 90,
                        width: 200,
                        value: new Date().getFullYear(),
                        queryMode: 'local',
                        style: ' margin:10px 0px 20px -8px',
                        displayField: 'name',
                        valueField: 'code'
                    }, {
                        xtype: 'combo',
                        id: 'month',
                        store: 'monthStore',
                        fieldLabel: '月 份',
                        labelAlign: 'right',
                        editable: false,
                        labelWidth: 90,
                        width: 200,
                        value: new Date().getMonth() + 1,
                        queryMode: 'local',
                        style: ' margin:10px 0px 20px 7px',
                        displayField: 'name',
                        valueField: 'code'

                    }, {
                        xtype: 'button',
                        text: '查 询',
                        icon: imgpath + '/search.png',
                        style: ' margin:10px 0px 20px 5px',
                        handler: _queryGrid
                    }
                    ]
                },{
                    xtype: 'panel',
                    region: 'south',
                    layout: 'column',
                    baseCls: 'my-panel-no-border',
                    items: [ {
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_PRI_YEAR',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '标准年预算(万元)',
                        labelWidth: 120,
                        width: 200,
                        value: '0.0',
                        labelAlign: 'right',
                        style: 'margin:-10px 0px 0px 25px',
                        renderer: right
                    },{
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_BUD_YEAR',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '执行年预算(万元)',
                        labelWidth: 120,
                        width: 200,
                        value: '0.0',
                        labelAlign: 'right',
                        style: 'margin:-10px 0px 0px 8px',
                        renderer: right
                    }, {
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_BUD',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '月预算(万元)',
                        value: '0.0',
                        labelWidth: 120,
                        width: 200,
                        labelAlign: 'right',
                        style: 'margin:-10px 0px 0px 3px',
                        renderer: right
                    }, {
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_FACT',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '月实际(万元)',
                        value: '0.0',
                        labelWidth: 120,
                        width: 200,
                        labelAlign: 'right',
                        style: 'margin:-10px 0px  0px 55px',
                        renderer: right
                    }]
                }, {
                    xtype: 'panel',
                    region: 'south',
                    layout: 'column',
                    baseCls: 'my-panel-no-border',
                    items: [ {
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_MARGIN',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '月差异（超+降-）(万元)',
                        value: '0.0',
                        labelWidth: 130,
                        width: 200,
                        labelAlign: 'right',
                        style: 'margin:0px 0px 0px 47px',
                        renderer: rendValueColor
                    }, {
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_BUD_TOTAL',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '月累计预算(万元)',
                        value: '0.0',
                        labelWidth: 120,
                        width: 200,
                        labelAlign: 'right',
                        style: 'margin:0px 0px 0px -17px',
                        renderer: right
                    },{
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_YEAR',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '累计实际(万元)',
                        value: '0.0',
                        labelWidth: 120,
                        width: 200,
                        labelAlign: 'right',
                        style: 'margin:0px 0px 0px 17px',
                        renderer: right
                    },{
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_MARGIN_TOTAL',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '预算余额(万元)',
                        value: '0.0',
                        labelWidth: 120,
                        width: 200,
                        labelAlign: 'right',
                        style: 'margin:0px 0px 0px 57px',
                        renderer: right
                    }]
                }]
            }],
        bbar: ["->",
            {
                xtype: 'pagingtoolbar',
                store: gridStore,
                dock: 'bottom',
                displayInfo: true,
                displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
                emptyMsg: '没有记录'
            }]

    });

    var gridPanel2 = Ext.create('Ext.grid.Panel', {
        id: 'gridPanel2',
        columnLines: true,
        width: '100%',
        region: 'center',
        store: gridStore2,
        autoScroll: true,
        columns: [
            {
                xtype: 'rownumberer',
                width: 35,
                sortable: false
            }, {
                text: '费用名称',
                dataIndex: 'VCH_CHARGENAME',
                align: 'center',
                width: 180,
                renderer: left
            },
            {
                text: '厂矿',
                dataIndex: 'VCH_DEPTNAME2',
                align: 'center',
                width: 120,
                renderer: left
            },{
                text: '所属部门',
                dataIndex: 'VCH_DEPTNAME_GS',
                align: 'center',
                width: 120,
                renderer: left
            },
            {
                text: '标准年预算(万元)',
                dataIndex: 'F_MONEY_PRIMARYBUD_YEAR',
                align: 'center',
                width: 120,
                renderer: right
            },
            {
                text: '执行年预算(万元)',
                dataIndex: 'F_MONEY_BUD_YEAR',
                align: 'center',
                width: 120,
                renderer: right
            },
            {
                text: '月预算(万元)',
                dataIndex: 'F_MONEY_BUD',
                align: 'center',
                width: 120,
                renderer: right
            },
            {
                text: '月实际(万元)',
                dataIndex: 'F_MONEY_FACT',
                align: 'center',
                width: 120,
                renderer: right
            }, {
                text: '月差异(超+降-)(万元)',
                dataIndex: 'F_MONEY_MARGIN',
                align: 'center',
                width: 150,
                renderer: rendValueColor
            }, {
                text: '月累计预算(万元)',
                dataIndex: 'F_MONEY_BUD_TOTAL',
                align: 'center',
                width: 120,
                renderer: right
            }, {
                text: '累计实际(万元)',
                dataIndex: 'F_MONEY_YEAR',
                align: 'center',
                width: 120,
                renderer: right
            }, {
                text: '预算余额(万元)',
                dataIndex: 'F_MONEY_MARGIN_TOTAL',
                align: 'center',
                width: 120,
                renderer: right
            }
        ],
        dockedItems: [
            {
                xtype: 'panel',
                frame: true,
                layout: 'vbox',
                defaults: {
                    style: 'margin:10px 0px 0px 5px'
                },
                items: [{
                    xtype: 'panel',
                    region: 'north',
                    layout: 'column',
                    baseCls: 'my-panel-no-border',
                    items: [ {
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_PRI_YEAR2',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '标准年预算(万元)',
                        labelWidth: 120,
                        width: 200,
                        value: '0.0',
                        labelAlign: 'right',
                        style: 'margin:10px 0px 0px 25px',
                        renderer: right
                    },{
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_BUD_YEAR2',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '执行年预算(万元)',
                        labelWidth: 120,
                        width: 200,
                        value: '0.0',
                        labelAlign: 'right',
                        style: 'margin:10px 0px 0px 8px',
                        renderer: right
                    }, {
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_BUD2',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '月预算(万元)',
                        value: '0.0',
                        labelWidth: 120,
                        width: 200,
                        labelAlign: 'right',
                        style: 'margin:10px 0px 0px 3px',
                        renderer: right
                    }, {
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_FACT2',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '月实际(万元)',
                        value: '0.0',
                        labelWidth: 120,
                        width: 200,
                        labelAlign: 'right',
                        style: 'margin:10px 0px  0px 55px',
                        renderer: right
                    }]
                }, {
                    xtype: 'panel',
                    region: 'south',
                    layout: 'column',
                    baseCls: 'my-panel-no-border',
                    items: [ {
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_MARGIN2',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '月差异（超+降-）(万元)',
                        value: '0.0',
                        labelWidth: 130,
                        width: 200,
                        labelAlign: 'right',
                        style: 'margin:0px 0px 0px 47px',
                        renderer: rendValueColor
                    }, {
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_BUD_TOTAL2',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '月累计预算(万元)',
                        value: '0.0',
                        labelWidth: 120,
                        width: 200,
                        labelAlign: 'right',
                        style: 'margin:0px 0px 0px -17px',
                        renderer: right
                    },{
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_YEAR2',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '累计实际(万元)',
                        value: '0.0',
                        labelWidth: 120,
                        width: 200,
                        labelAlign: 'right',
                        style: 'margin:0px 0px 0px 17px',
                        renderer: right
                    },{
                        xtype: 'displayfield',
                        id: 'SUM_MONEY_MARGIN_TOTAL2',
                        editable: false,
                        queryMode: 'local',
                        fieldLabel: '预算余额(万元)',
                        value: '0.0',
                        labelWidth: 120,
                        width: 200,
                        labelAlign: 'right',
                        style: 'margin:0px 0px 0px 57px',
                        renderer: right
                    }]
                }]
            }],
        bbar: ["->",
            {
                xtype: 'pagingtoolbar',
                store: gridStore2,
                dock: 'bottom',
                displayInfo: true,
                displayMsg: '显示第{0}条到第{1}条记录,一共{2}条',
                emptyMsg: '没有记录'
            }]

    });


    var dialog = Ext.create('Ext.window.Window', {
        id: 'dialog',
        title: '<div align="center">厂矿费用情况明细表</div>',
        width: 950,
        height: 600,
        modal: true,
        plain: true,
        closable: true,
        closeAction: 'close',
        model: true,
        layout: 'border',
        frame: true,
        items: [{
            region: 'center',
            layout: 'fit',
            border: false,
            items: [gridPanel2]
        }]
    });


    Ext.create('Ext.container.Viewport', {
        layout: {
            type: 'border',
            regionWeights: {
                west: -1,
                north: 1,
                south: 1,
                east: -1
            }
        },
        items: [{
            region: 'center',
            layout: 'fit',
            border: false,
            items: [gridPanel]
        }]
    });

});
function _queryGrid(){
    _seek();
    _querySum();
}

function _seek() {
    var proxy = Ext.data.StoreManager.lookup('gridStore').getProxy();
    proxy.extraParams.V_I_YEAR = Ext.getCmp('year').getValue();
    proxy.extraParams.V_I_MONTH = Ext.getCmp('month').getValue();
    Ext.data.StoreManager.lookup('gridStore').currentPage = 1;
    Ext.data.StoreManager.lookup('gridStore').load();
}
function _querySum(){
    Ext.Ajax.request({
        url: AppUrl + 'YS/YS_REPORT_C_OTHERD_TOTAL_SEL',
        async: false,
        method: 'POST',
        params: {
            'V_I_YEAR':  Ext.getCmp('year').getValue(),
            'V_I_MONTH': Ext.getCmp('month').getValue()
        },
        success: function (resp) {
            var data = Ext.decode(resp.responseText);
            if (data.RET=="success") {
                Ext.getCmp('SUM_MONEY_PRI_YEAR').setValue(data.RET1);
                Ext.getCmp('SUM_MONEY_BUD_YEAR').setValue(data.RET2);
                Ext.getCmp('SUM_MONEY_BUD').setValue(data.RET3);
                Ext.getCmp('SUM_MONEY_FACT').setValue(data.RET4);
                Ext.getCmp('SUM_MONEY_MARGIN').setValue(data.RET5);
                Ext.getCmp('SUM_MONEY_BUD_TOTAL').setValue(data.RET6);
                Ext.getCmp('SUM_MONEY_YEAR').setValue(data.RET7);
                Ext.getCmp('SUM_MONEY_MARGIN_TOTAL').setValue(data.RET8);
            }
        }
    });
}
function  _querygrid2(){
    _grid();
    _querySum2();
}
function _querySum2(){
    Ext.Ajax.request({
        url: AppUrl + 'YS/YS_REPORT_CHARGE_C_O_TOTAL_SEL',
        async: false,
        method: 'POST',
        params: {
            'V_I_YEAR':  Ext.getCmp('year').getValue(),
            'V_I_MONTH': Ext.getCmp('month').getValue(),
            'V_CHARGECODE':sid
        },
        success: function (resp) {
            var data = Ext.decode(resp.responseText);
            if (data.RET=="success") {
                Ext.getCmp('SUM_MONEY_PRI_YEAR2').setValue(data.RET1);
                Ext.getCmp('SUM_MONEY_BUD_YEAR2').setValue(data.RET2);
                Ext.getCmp('SUM_MONEY_BUD2').setValue(data.RET3);
                Ext.getCmp('SUM_MONEY_FACT2').setValue(data.RET4);
                Ext.getCmp('SUM_MONEY_MARGIN2').setValue(data.RET5);
                Ext.getCmp('SUM_MONEY_BUD_TOTAL2').setValue(data.RET6);
                Ext.getCmp('SUM_MONEY_YEAR2').setValue(data.RET7);
                Ext.getCmp('SUM_MONEY_MARGIN_TOTAL2').setValue(data.RET8);
            }
        }
    });
}
function _grid() {
    var proxy = Ext.data.StoreManager.lookup('gridStore2').getProxy();
    proxy.extraParams.V_I_YEAR = Ext.getCmp('year').getValue();
    proxy.extraParams.V_I_MONTH = Ext.getCmp('month').getValue();
    proxy.extraParams.V_CHARGECODE = sid;
    Ext.data.StoreManager.lookup('gridStore2').currentPage = 1;
    Ext.data.StoreManager.lookup('gridStore2').load();
}

function left(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:left;";
    return value;
}
function right(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:right;";
    return Ext.util.Format.number(value, '0.00');

}
function rendValueColor(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:right;";
    if (value <= 0) {
        return '<a style="color:red">' + Ext.util.Format.number(value, '0.00') + '</a>'
    } else {
        return '<a style="color:black" >' + Ext.util.Format.number(value, '0.00') + '</a>'
    }
}