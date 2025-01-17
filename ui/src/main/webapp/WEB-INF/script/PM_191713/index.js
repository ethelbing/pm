﻿var orgStoreLoad = false;
var deptStoreLoad = false;
var sbTypeStoreLoad = false;
var sbNameStoreLoad = false;
var V_V_EDIT_GUID = '';
var V_V_FILEGUID = '';
var index = 0;
var picguidbegin;
var sh = window.screen.height / 2 - 10;
var sw = window.screen.width / 2 + 220;

var V_V_DEPTCODE=null;
var V_V_EQUTYPE=null;
var V_V_ORGCODE=null;
var V_V_EQUCODE=null;
var V_V_EQUTYPECODE=null;
if (location.href.split('?')[1] != undefined) {
    V_V_DEPTCODE = Ext.urlDecode(location.href.split('?')[1]).V_V_DEPTCODE;
    V_V_EQUTYPE = Ext.urlDecode(location.href.split('?')[1]).V_V_EQUTYPE;
    V_V_ORGCODE = Ext.urlDecode(location.href.split('?')[1]).V_V_ORGCODE;
    V_V_EQUCODE = Ext.urlDecode(location.href.split('?')[1]).V_V_EQUCODE
    V_V_EQUTYPECODE = Ext.urlDecode(location.href.split('?')[1]).V_V_EQUTYPECODE;
}
Ext.define('Ext.ux.data.proxy.Ajax', {
    extend: 'Ext.data.proxy.Ajax',
    async: true,
    doRequest: function (operation, callback, scope) {
        var writer = this.getWriter(),
            request = this.buildRequest(operation);
        if (operation.allowWrite()) {
            request = writer.write(request);
        }
        Ext.apply(request, {
            async: this.async,
            binary: this.binary,
            headers: this.headers,
            timeout: this.timeout,
            scope: this,
            callback: this.createRequestCallback(request, operation, callback, scope),
            method: this.getMethod(request),
            disableCaching: false
        });
        Ext.Ajax.request(request);
        return request;
    }
});

Ext.onReady(function () {

    var jsStandardStore = Ext.create('Ext.data.Store', {
        id: 'jsStandardStore',
        autoLoad: false,
        fields: ['I_ID', 'V_GUID', 'V_EQUCODE', 'V_EQUNAME', 'V_BJ_IMG', 'V_PART_NUMBER', 'V_PART_NAME',
            'V_PART_CODE', 'V_MATERIAL', 'V_IMGSIZE', 'V_IMGGAP', 'V_VALUE_DOWN','V_VALUE_UP', 'V_REPLACE_CYC', 'V_WEIGHT',
            'V_IMGCODE', 'V_CONTENT', 'V_ORGCODE', 'V_ORGNAME', 'V_DEPTCODE', 'V_DEPTNAME', 'V_EQUCHILDCODE',
            'V_EQUCHILDNAME', 'V_EQUTYPECODE'],
        proxy: Ext.create("Ext.ux.data.proxy.Ajax", {
            type: 'ajax',
            async: false,
            url: AppUrl + 'hp/HP_PM_REPAIR_JS_STANDARD_SEL',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'RET'
            },
            extraParams: {
            }
        })
    });

    var jsStandardGridPanel = Ext.create('Ext.grid.Panel', {
        id: 'jsStandardGridPanel',
        store: jsStandardStore,
        width: '100%',
        region: 'west',
        border: false,
        columnLines: true,
        selModel: {
            selType: 'checkboxmodel'/*,
            mode: 'SINGLE'*/
        },
        columns: [{
            xtype: 'rownumberer',
            text: '序号',
            width: 40,
            align: 'center'
        },{
            text: '零件名称',
            dataIndex: 'V_PART_NAME',
            align: 'center',
            renderer: atleft,
            width: 200
        },{
            text: '装置名称',
            dataIndex: 'V_EQUCHILDNAME',
            align: 'center',
            renderer: atEc,
            width: 200
        }, {
            text: '允许值（下）',
            dataIndex: 'V_VALUE_DOWN',
            align: 'center',
            renderer: atright,
            width: 150
        }, {
            text: '允许值（上限）',
            dataIndex: 'V_VALUE_UP',
            align: 'center',
            renderer: atright,
            width: 150
        }]

    });

    var northpanel = Ext.create('Ext.form.Panel', {
        id: 'northpanel',
        region: 'north',
        width: '100%',
        frame: true,
        layout: 'vbox',
        items: [{
            xtype: 'panel',
            region: 'north',
            layout: 'column',
            baseCls: 'my-panel-no-border',
            items: [{
                xtype: 'textfield',
                id: 'V_V_EQUCHILDCODE',
                fieldLabel: '装置名称',
                labelWidth: 70,
                style: ' margin: 5px 0px 5px 0px',
                labelAlign: 'right'
            }, {
                xtype: 'button',
                text: '查询',
                style: ' margin: 5px 0px 5px 10px',
                icon: imgpath + '/search.png',
                handler: _select
            },{
                xtype: 'button',
                text: '选择',
                style: ' margin: 5px 0px 5px 10px',
                icon: imgpath + '/accordion_collapse.png',
                handler: _selectJS
            }]
        }]
    });



    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [jsStandardGridPanel, northpanel]

    });

    //_init();
    /*_selectEquName();*/

    Ext.data.StoreManager.lookup('jsStandardStore').proxy.extraParams = {
        'V_V_ORGCODE': V_V_ORGCODE,
        'V_V_DEPTCODE': V_V_DEPTCODE,
        'V_V_EQUTYPECODE': V_V_EQUTYPECODE

    };
    Ext.data.StoreManager.lookup('jsStandardStore').load();
});

function _init() {
    if (orgStoreLoad && deptStoreLoad && sbTypeStoreLoad && sbNameStoreLoad) {

        Ext.getBody().unmask();//去除页面笼罩
    }

}

function _select() {
    var jsStandardStore = Ext.data.StoreManager.lookup('jsStandardStore');
    jsStandardStore.proxy.extraParams = {
        'V_V_ORGCODE': V_V_ORGCODE,
        'V_V_DEPTCODE': V_V_DEPTCODE,
        'V_V_EQUTYPECODE':V_V_EQUTYPECODE

    };
    Ext.data.StoreManager.lookup('jsStandardStore').load();
}


function _selectJS(){
    var seldata = Ext.getCmp('jsStandardGridPanel').getSelectionModel().getSelection();
  if(seldata.length!=1){
      alert("请选择一条数据");
  }else{
      window.opener.getReturnJSBZ(seldata[0].data.V_GUID,seldata[0].data.V_PART_NAME,seldata[0].data.V_VALUE_DOWN,seldata[0].data.V_VALUE_UP);
      window.close();
  }
}

function atleft(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:left;";
    return '<div data-qtip="' + value + '" >' + value + '</div>';
}

function atEc(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:left;";
    if(value==''){
        return '<div data-qtip="通用" >通用</div>';
    }else{
        return '<div data-qtip="' + value + '" >' + value + '</div>';
    }

}

function atright(value, metaData, record, rowIndex, colIndex, store) {
    metaData.style = "text-align:right;";
    return value;
}