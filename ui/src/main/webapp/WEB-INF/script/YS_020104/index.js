/**
 * Created by LL on 2017/11/10.
 */
if (location.href.split('?')[1] != undefined) {
    V_CHARGE_ID = Ext.urlDecode(location.href.split('?')[1]).V_CHARGE_ID;
}

Ext.onReady(function () {

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: false,
        pageSize: 20,
        storeId: 'gridStore',
        fields: ['V_CHARGE_ID', 'V_ORDERGUID', 'V_ORDERID', 'V_ORGNAME', 'V_DEPTNAME', 'V_EQUIP_NAME', 'V_FUNC_LOC', 'V_MATERIALNAME', 'V_UNIT',
            'V_UNITPRICE', 'V_PLANAMOUNT', 'V_PLANMONEY_MAT', 'V_ACTUALAMOUNT', 'V_ACTUALMONEY_MAT','REPAIRNAME'],
        proxy: {
            type: 'ajax',
            actionMethods: {
                read: 'POST'
            },
            url: AppUrl + 'YS/YS_CHARGE_WORKORDER_MAT_SEL',
            reader: {
                type: 'json',
                root: 'list',
                total:'total'
            },
            extraParams: {}
        }
    });

    var gridPanel = Ext.create('Ext.grid.Panel', {
        id: 'gridPanel',
        columnLines: true,
        width: '100%',
        store: gridStore,
        selType: 'rowmodel',
        autoScroll: true,
        forceFit:true,
        columns: [
            {
                xtype: 'rownumberer',
                width: 30,
                sortable: false
            },
            {
                text: '工单号',
                dataIndex: 'V_ORDERID',
                align: 'center',
                width: 120,
                renderer: left,
                summaryRenderer: function (value) {
                    return '总计:';
                }
            },
            {
                text: '厂矿',
                dataIndex: 'V_ORGNAME',
                align: 'center',
                width: 120,
                renderer: left
            }, {
                text: '作业区',
                dataIndex: 'V_DEPTNAME',
                align: 'center',
                width: 120,
                renderer: left
            },{
                text: '检修单位',
                dataIndex: 'REPAIRNAME',
                align: 'center',
                width: 180,
                renderer: left
            }, {
                text: '检修设备',
                dataIndex: 'V_EQUIP_NAME',
                align: 'center',
                width: 120,
                renderer: left
            }, {
                text: '功能位置',
                dataIndex: 'V_FUNC_LOC',
                align: 'center',
                width: 120,
                renderer: left
            },
            {
                text: '物料名称',
                dataIndex: 'V_MATERIALNAME',
                align: 'center',
                width: 120,
                renderer: left
            }, {
                text: '计量单位',
                dataIndex: 'V_UNIT',
                align: 'center',
                width: 120,
                renderer: left
            }, {
                text: '单价(元)',
                dataIndex: 'V_UNITPRICE',
                align: 'center',
                width: 120,
                renderer: rights
            }, {
                text: '计划数量',
                dataIndex: 'V_PLANAMOUNT',
                align: 'center',
                width: 120,
                renderer: right
            }, {
                text: '计划总金额(元)',
                dataIndex: 'V_PLANMONEY_MAT',
                align: 'center',
                width: 120,
                renderer: rights
            }, {
                text: '实际数量',
                dataIndex: 'V_ACTUALAMOUNT',
                align: 'center',
                width: 120,
                renderer: right
            }, {
                text: '实际总金额(元)',
                dataIndex: 'V_ACTUALMONEY_MAT',
                align: 'center',
                width: 120,
                renderer: rights
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
                    items: [{
                        xtype: 'textfield',
                        id: 'chargeId',
                        fieldLabel: '结算单号',
                        editable: false,
                        labelWidth: 90,
                        labelAlign: 'right',
                        queryMode: 'local',
                        style: 'margin:0px 0px 0px 20px',
                        width: 260
                    },{
                        xtype: 'button',
                        text: '返回',
                        icon: imgpath + '/undo.png',
                        handler: _back
                    }]
                },
                    {
                        xtype: 'panel',
                        region: 'south',
                        layout: 'column',
                        baseCls: 'my-panel-no-border',
                        items: [ {
                            xtype: 'displayfield',
                            id: 'SUM_P_MAT',
                            editable: false,
                            queryMode: 'local',
                            fieldLabel: '物料计划合计(元)',
                            labelWidth: 120,
                            width: 200,
                            value: '0.0',
                            labelAlign: 'right',
                            style: 'margin:0px 0px 0px 33px',
                            renderer: rights
                        },{
                            xtype: 'displayfield',
                            id: 'SUM_A_MAT',
                            editable: false,
                            queryMode: 'local',
                            fieldLabel: '物料实际合计(元)',
                            labelWidth: 120,
                            width: 200,
                            value: '0.0',
                            labelAlign: 'right',
                            renderer: rights
                        }]
                    }
                ]
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

    Ext.getCmp('chargeId').setValue(V_CHARGE_ID);
    _seek();
    _querySum();
});

function _seek() {
    var proxy = Ext.data.StoreManager.lookup('gridStore').getProxy();
    proxy.extraParams.V_V_CHARGE_ID = V_CHARGE_ID;
    Ext.data.StoreManager.lookup('gridStore').currentPage=1;
    Ext.data.StoreManager.lookup('gridStore').load();
}
function _querySum(){
    Ext.Ajax.request({
        url: AppUrl + 'YS/YS_CHARGE_W_MAT_TOTAL_SEL',
        async: false,
        method: 'POST',
        params: {
            'V_V_CHARGE_ID': V_CHARGE_ID
        },
        success: function (resp) {
            var data = Ext.decode(resp.responseText);
            if (data.RET=="success") {
                Ext.getCmp('SUM_P_MAT').setValue(data.RET1);
                Ext.getCmp('SUM_A_MAT').setValue(data.RET2);
            }
        }
    });
}
function _back(){
    window.close();
}
function left(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:left;";
    return value;
}
function right(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:right;";
    return value;
}
function rights(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:right;";
    return Ext.util.Format.number(value, '0.00');

}
