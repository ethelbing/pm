var flag = '';

//厂矿
var ckStore = Ext.create('Ext.data.Store', {
    id: 'ckStore',
    autoLoad: true,
    fields: ['_WORK', 'V_SAP_JHGC', 'V_DEPTNAME', 'V_DEPTCODE_UP', 'V_DEPTCODE', 'V_SAP_YWFW', 'V_SAP_DEPT'],
    proxy: {
        type: 'ajax',
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
    id: 'zyqStore',
    autoLoad: false,
    fields: ['V_SAP_WORK', 'V_SAP_JHGC', 'V_DEPTNAME', 'V_DEPTCODE_UP', 'V_DEPTCODE', 'V_SAP_YWFW', 'V_SAP_DEPT'],
    proxy: {
        type: 'ajax',
        url: AppUrl + 'PM_06/PRO_BASE_DEPT_VIEW_ROLE',
        actionMethods: {
            read: 'POST'
        },
        reader: {
            type: 'json',
            root: 'list'
        },
        async: false
    }
});
//设备类型
var sblxStore = Ext.create('Ext.data.Store', {
    id: 'sblxStore',
    autoLoad: false,
    fields: ['V_EQUTYPECODE', 'V_EQUTYPENAME'],
    proxy: {
        type: 'ajax',
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

var gridStore = Ext.create("Ext.data.Store", {
    autoLoad: false,
    storeId: 'gridStore',
    fields: ['V_JSYQ_CODE', 'V_JSYQ_NAME', 'V_EQUCODE', 'V_EQUNAME', 'V_EQUSITE', 'V_EQUTYPE', 'V_EQUTYPENAME'],
    proxy: {
        type: 'ajax',
        async: false,
        url: AppUrl + 'hp/HP_PRO_PM_19_JSYQ_SEL',
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
    layout: 'border',
    items: [
        {
            xtype: 'panel',
            border: false,
            region: 'north',
            layout: 'column',
            defaults: {style: {margin: '5px 0px 5px 5px'}, labelAlign: 'right'},
            frame: true,
            items: [
                {
                    xtype: 'combo',
                    id: 'ck',
                    store: ckStore,
                    queryMode: 'local',
                    valueField: 'V_DEPTCODE',
                    displayField: 'V_DEPTNAME',
                    fieldLabel: '厂矿',
                    editable: false,
                    labelWidth: 80
                },
                {
                    xtype: 'combo',
                    id: 'zyq',
                    store: zyqStore,
                    queryMode: 'local',
                    valueField: 'V_DEPTCODE',
                    displayField: 'V_DEPTNAME',
                    fieldLabel: '作业区',
                    editable: false,
                    labelWidth: 80
                },
                {
                    xtype: 'combo',
                    id: 'sblx',
                    store: sblxStore,
                    queryMode: 'local',
                    valueField: 'V_EQUTYPECODE',
                    displayField: 'V_EQUTYPENAME',
                    fieldLabel: '设备类型',
                    editable: false,
                    labelWidth: 80
                },
                {
                    xtype: 'panel',
                    frame: true,
                    width: '100%',
                    layout: 'column',
                    colspan: 6,
                    baseCls: 'my-panel-noborder',
                    style: 'margin: 5px 5px 5px 5px',
                    items: [
                        {xtype: 'textfield', fieldLabel: '技术要求名称', labelWidth: 80, id: 'jsyqname', labelAlign: 'right'},
                        {
                            xtype: 'button',
                            text: '查询',
                            handler: queryGrid,
                            icon: imgpath + '/search.png',
                            style: {margin: ' 0 0 0 10px'}
                        },
                        {
                            xtype: 'button',
                            text: '添加',
                            handler: addbtn,
                            icon: imgpath + '/add.png',
                            style: {margin: ' 0 0 0 5px'}
                        },
                        {
                            xtype: 'button',
                            text: '修改',
                            handler: editbtn,
                            icon: imgpath + '/edit.png',
                            style: {margin: ' 0 0 0 5px'}
                        },
                        {
                            xtype: 'button',
                            text: '删除',
                            handler: delbtn,
                            icon: imgpath + '/delete.png',
                            style: {margin: ' 0 0 0 5px'}
                        },
                        {
                            xtype: 'button',
                            text: '通用',
                            handler: addTYbtn,
                            icon: imgpath + '/add.png',
                            style: {margin: ' 0 0 0 5px'}
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'gridpanel', region: 'center', columnLines: true, id: 'grid', store: 'gridStore',
            selType: 'checkboxmodel',
            columns: [
                {
                    xtype: 'rownumberer', text: '序号', width: 60, align: 'center'
                },
                {
                    text: '技术要求编码',
                    align: 'center',
                    width: 150,
                    dataIndex: 'V_JSYQ_CODE',
                    renderer: atleft,
                    hidden: true,
                },
                {
                    text: '技术要求名称', align: 'center', flex: 2, dataIndex: 'V_JSYQ_NAME', renderer: atleft
                },
                {
                    text: '设备类型编码', align: 'center', width: 150, dataIndex: 'V_EQUTYPE', renderer: atleft
                },
                {
                    text: '设备类型名称', align: 'center', width: 150, dataIndex: 'V_EQUTYPENAME', renderer: atleft
                }
            ]
        }
    ]
};
var window = Ext.create('Ext.window.Window', {
    id: 'window',
    width: 320,
    height: 150,
    layout: 'vbox',
    title: '编辑',
    modal: true,//弹出窗口时后面背景不可编辑
    frame: true,
    closeAction: 'hide',
    closable: true,
    items: [{
        xtype: 'textfield',
        id: 'winjsyqcode',
        fieldLabel: '技术要求编码',
        labelAlign: 'right',
        width: 280,
        hidden: true,
        margin: '30px 0 0 0px'
    }, {
        xtype: 'textfield',
        id: 'winjsyqname',
        fieldLabel: '技术要求名称',
        labelAlign: 'right',
        width: 280,
        margin: '20px 0 0 0px'
    }],
    buttons: [{
        xtype: 'button',
        text: '保存',
        width: 40,
        handler: function () {
            save();
        }
    }, {
        xtype: 'button',
        text: '取消',
        width: 40,
        handler: function () {
            Ext.getCmp('window').hide();
        }
    }]
});


function onPageLoaded() {
    Ext.QuickTips.init();
    Ext.create('Ext.container.Viewport', Layout);
    //厂矿加载时
    Ext.data.StoreManager.lookup('ckStore').on('load', function () {
        Ext.getCmp('ck').select(Ext.data.StoreManager.lookup('ckStore').getAt(0));
        Ext.data.StoreManager.lookup('zyqStore').load({
            params: {
                'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode'),
                'V_V_DEPTCODE': Ext.getCmp('ck').getValue(),
                'V_V_DEPTCODENEXT': '%',
                'V_V_DEPTTYPE': '主体作业区'
            }
        });
    });
    //作业区加载时
    Ext.data.StoreManager.lookup('zyqStore').on('load', function () {
        Ext.getCmp('zyq').select(Ext.data.StoreManager.lookup('zyqStore').getAt(0));
        Ext.data.StoreManager.lookup('sblxStore').load({
            params: {
                V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode'),
                V_V_DEPTCODENEXT: Ext.getCmp('zyq').getValue()
            }
        });
    });
    //设备类型加载时
    Ext.data.StoreManager.lookup('sblxStore').on('load', function () {
        Ext.getCmp('sblx').select(Ext.data.StoreManager.lookup('sblxStore').first());
    });
    //厂矿选择时
    Ext.getCmp('ck').on('select', function () {
        Ext.data.StoreManager.lookup('zyqStore').load({
            params: {
                'V_V_PERSONCODE': Ext.util.Cookies.get('v_personcode'),
                'V_V_DEPTCODE': Ext.getCmp('ck').getValue(),
                'V_V_DEPTCODENEXT': '%',
                'V_V_DEPTTYPE': '主体作业区'
            }
        });
    });
    //作业区选择时
    Ext.getCmp('zyq').on('select', function () {
        Ext.data.StoreManager.lookup('sblxStore').load({
            params: {
                V_V_PERSONCODE: Ext.util.Cookies.get('v_personcode'),
                V_V_DEPTCODENEXT: Ext.getCmp('zyq').getValue()
            }
        });
    });
}

function atleft(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:left;";
    return '<div data-qtip="' + value + '" >' + value + '</div>';
}

function queryGrid() {
    Ext.data.StoreManager.lookup('gridStore').load({
        params: {
            V_V_JSYQ_NAME: Ext.getCmp('jsyqname').getValue(),
            V_V_EQUTYPE: Ext.getCmp('sblx').getValue(),
        }
    });
}

function addbtn() {
    flag = 'insert';
    Ext.getCmp('winjsyqcode').setReadOnly(true);
    Ext.getCmp('winjsyqcode').setValue(Ext.data.IdGenerator.get('uuid').generate());
    Ext.getCmp('winjsyqname').setValue('');

    Ext.getCmp('window').show();
}

function addTYbtn() {
    flag = 'insert';
    Ext.getCmp('winjsyqcode').setReadOnly(true);
    Ext.getCmp('winjsyqcode').setValue(Ext.data.IdGenerator.get('uuid').generate());
    Ext.getCmp('winjsyqname').setValue('');
    Ext.getCmp('window').show();
}

function editbtn() {
    var seldata = Ext.getCmp('grid').getSelectionModel().getSelection();
    flag = 'edit';
    if (seldata.length != 1) {
        Ext.Msg.alert("操作信息", "请选择一条数据进行修改！");
        return false;
    }
    Ext.getCmp('winjsyqcode').setReadOnly(true);
    Ext.getCmp('winjsyqcode').setValue(seldata[0].data.V_JSYQ_CODE);
    Ext.getCmp('winjsyqname').setValue(seldata[0].data.V_JSYQ_NAME);
    Ext.getCmp('window').show();

}

function delbtn() {
    var seldata = Ext.getCmp('grid').getSelectionModel().getSelection();
    if (seldata.length == 0) {
        Ext.Msg.alert("操作信息", "请至少选择一条数据进行删除！");
        return false;
    }//对所选进行排查，至少选择一个
    for (var i = 0; i < seldata.length; i++) {
        Ext.Ajax.request({
            url: AppUrl + 'pm_19/PRO_PM_19_JSYQ_DEL',
            method: 'POST',
            async: false,
            params: {
                V_V_JSYQ_CODE: seldata[i].data.V_JSYQ_CODE
            },
            success: function (ret) {
                var resp = Ext.JSON.decode(ret.responseText);

            }
        });
    }
    queryGrid();
}

function save() {
    if (flag == 'insert') {
        Ext.Ajax.request({
            url: AppUrl + 'hp/HP_PRO_PM_19_JSYQ_EDIT',
            method: 'POST',
            async: false,
            params: {
                V_V_JSYQ_CODE: Ext.getCmp('winjsyqcode').getValue(),
                V_V_JSYQ_NAME: Ext.getCmp('winjsyqname').getValue(),
                V_V_EQUCODE: '',
                V_V_EQUNAME: '',
                V_V_EQUSITE: '',
                V_V_EQUTYPE: Ext.getCmp('sblx').getValue() == '%' ? 'TY' : Ext.getCmp('sblx').getValue(),
                V_V_EQUTYPENAME: Ext.getCmp('sblx').getValue() == '%' ? 'TY' : Ext.getCmp('sblx').getRawValue()
            },
            success: function (ret) {
                var resp = Ext.JSON.decode(ret.responseText);
                Ext.getCmp('window').hide();
                queryGrid();
            }
        });
    } else {
        Ext.Ajax.request({
            url: AppUrl + 'hp/HP_PRO_PM_19_JSYQ_EDIT',
            method: 'POST',
            async: false,
            params: {
                V_V_JSYQ_CODE: Ext.getCmp('winjsyqcode').getValue(),
                V_V_JSYQ_NAME: Ext.getCmp('winjsyqname').getValue(),
                V_V_EQUCODE: '',
                V_V_EQUNAME: '',
                V_V_EQUSITE: '',
                V_V_EQUTYPE: Ext.getCmp('sblx').getValue() == '%' ? 'TY' : Ext.getCmp('sblx').getValue(),
                V_V_EQUTYPENAME: Ext.getCmp('sblx').getValue() == '%' ? 'TY' : Ext.getCmp('sblx').getRawValue()
            },
            success: function (ret) {
                var resp = Ext.JSON.decode(ret.responseText);
                Ext.getCmp('window').hide();
                queryGrid();
            }
        });
    }
}

function renderFont(value, metaData) {
    metaData.style = 'text-align: left';
    return value;
}

Ext.onReady(onPageLoaded);
