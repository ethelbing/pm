var V_V_PERSONCODE = Ext.util.Cookies.get('v_personcode');
var V_V_CKTYPE = '';
var V_EQUTYPECODE = '';
var V_EQUTYPENAME = '';
var V_ORDERGUID = '';
var V_V_ORGCODE = '';
var V_V_DEPTCODE = '';
var V_V_SPECIALTY = '';
var V_PERSONCODE = '';
var taskId = '';
var V_STEPCODE = '';
var V_PERSONNAME ='';
var V_STEPNAME="";
var V_NEXT_SETP="";
var nextper=[];
var ProcessInstanceId = '';
if (location.href.split('?')[1] != undefined) {
    var parameters = Ext.urlDecode(location.href.split('?')[1]);
    (parameters.V_ORDERGUID == undefined) ? V_ORDERGUID = '' : V_ORDERGUID = parameters.V_ORDERGUID;
    (parameters.ProcessInstanceId == ProcessInstanceId) ? ProcessInstanceId = "" : ProcessInstanceId = parameters.ProcessInstanceId;
}

var orgLoad = false;
var equTypeLoad = false;
var basedicLoad = false;

Ext.onReady(function () {
    Ext.getBody().mask('<p>页面载入中...</p>');

   /* var nextSprStore = Ext.create("Ext.data.Store", {
        autoLoad: false,
        storeId: 'nextSprStore',
        fields: ['V_PERSONCODE', 'V_PERSONNAME', 'V_V_NEXT_SETP', 'V_V_FLOW_STEPNAME'],
        proxy: {
            type: 'ajax',
            async: false,
            url: AppUrl +  'dxfile/PM_ACTIVITI_PROCESS_PER_SELSBB',
            actionMethods: {
                read: 'POST'
            },
            reader: {
                type: 'json',
                root: 'list'
            },
            extraParams: {}
        },
        listeners: {
            load: function (store, records, success, eOpts) {
                var list = [];
                if(store.getAt(0) !=null){
                    processKey = store.getProxy().getReader().rawData.RET;
                    V_STEPNAME = store.getAt(0).data.V_V_FLOW_STEPNAME;
                    V_NEXT_SETP = store.getAt(0).data.V_V_NEXT_SETP;
                    Ext.getCmp('nextPer').select(store.first());
                }
            }
        }
    });*/

    var inputPanel = Ext.create('Ext.form.Panel', {
        id: 'inputPanel',
        region: 'north',
        padding: '10px 0px 0px 0px',
        baseCls: 'my-panel-no-border',
        style: 'background-color:#FFFFFF',
        frame: true,
        //border:false,
        items: [{
            xtype: 'fieldset',
            height: 500,
            width: 540,
            style: 'margin-left:10px;',
            defaults: {
                frame: true,
                baseCls: 'my-panel-no-border',
                style: 'margin-top:12px'
            },
            items: [{
                layout: 'column',
                defaults: {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    width: 250
                },
                items: [{
                    id: 'year',
                    readOnly: true,
                    allowBlank: false,
                    fieldLabel: '年份',
                    labelWidth: 90
                }, {
                    readOnly: true,
                    id: 'month',
                    fieldLabel: '月份',
                    allowBlank: false,
                    labelWidth: 90
                }]
            }, {
                layout: 'column',
                defaults: {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    width: 250
                },
                items: [{
                    id: 'ck',
                    readOnly: true,
                    allowBlank: false,
                    fieldLabel: '计划厂矿',
                    labelWidth: 90
                }, {
                    readOnly: true,
                    id: 'zyq',
                    fieldLabel: '作业区',
                    allowBlank: false,
                    labelWidth: 90
                }]
            }, {
                layout: 'column',
                defaults: {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    width: 250
                },
                items: [{
                    id: 'zy',
                    readOnly: true,
                    allowBlank: false,
                    fieldLabel: '专业',
                    labelWidth: 90
                }, {
                    readOnly: true,
                    id: 'sblx',
                    fieldLabel: '设备类型',
                    allowBlank: false,
                    labelWidth: 90
                }]
            }, {
                layout: 'column',
                defaults: {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    width: 250,
                    readOnly: true
                },
                items: [{
                    id: 'sbmc',
                    allowBlank: false,
                    fieldLabel: '设备名称',
                    labelWidth: 90
                }, {
                    id: 'fqr',
                    allowBlank: false,
                    fieldLabel: '发起人',
                    labelWidth: 90
                }]
            }, {
                layout: 'hbox',
                defaults: {
                    labelAlign: 'right',
                    width: 250,
                    readOnly: true
                },
                items: [{
                    xtype: 'textfield',
                    id: 'sgfs',
                    allowBlank: false,
                    fieldLabel: '施工方式',
                    labelWidth: 90
                }, {
                    xtype:'checkboxfield',
                    boxLabel:'施工准备是否已落实',
                    margin:'5 0 0 35',
                    id : 'iflag',
                    inputValue:1,
                    uncheckedValue:0
                }]
            },{
                layout: 'column',
                defaults: {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    width: 250,
                    readOnly: true
                },
                items: [{
                    id: 'fqsj',
                    allowBlank: false,
                    fieldLabel: '发起时间',
                    labelWidth: 90
                }]
            }, {
                layout: 'column',
                items: [{
                    readOnly: true,
                    xtype: 'textarea',
                    id: 'jxnr',
                    fieldLabel: '检修内容',
                    labelAlign: 'right',
                    labelWidth: 90,
                    width: 500
                }]
            }, {
                layout: 'column',
                items: [{
                    xtype: 'textfield',
                    readOnly: true,
                    id: 'jhtgsj',
                    labelAlign: 'right',
                    allowBlank: false,
                    fieldLabel: '计划停工时间',
                    labelWidth: 90,
                    width: 250
                }]
            }, {
                layout: 'column',
                items: [{
                    xtype: 'textfield',
                    readOnly: true,
                    id: 'jhjgsj',
                    labelAlign: 'right',
                    allowBlank: false,
                    fieldLabel: '计划竣工时间',
                    labelWidth: 90,
                    width: 250
                }]
            }, {
                layout: 'column',
                defaults: {
                    xtype: 'textfield',
                    labelAlign: 'right',
                    width: 250,
                    readOnly: true
                },
                items: [{
                    id: 'jhgshj',
                    allowBlank: false,
                    fieldLabel: '计划工时合计',
                    labelWidth: 90
                },
                    {
                        readOnly:true,
                        id: 'gx',
                        allowBlank: false,
                        fieldLabel: '工序',
                        labelWidth: 90
                    }]
            }, {
                layout: 'column',
                items: [{
                    readOnly: true,
                    xtype: 'textarea',
                    id: 'bz',
                    fieldLabel: '备注',
                    labelAlign: 'right',
                    labelWidth: 90,
                    width: 500
                }]
            }]
        }]
    });

    var buttonPanel = Ext.create('Ext.panel.Panel', {
        id: 'buttonPanel',
        layout: 'column',
        region: 'north',
        padding: '0 0 0 0',
        height: 30,
        style: 'margin-bottom:1px',
        frame: true,
        baseCls: 'my-panel-no-border',
        items: [
           /* {
            id: 'nextPer',
            xtype: 'combo',
            store: nextSprStore,
            fieldLabel: '下一步接收人',
            editable: false,
            labelWidth: 80,
            displayField: 'V_PERSONNAME',
            valueField: 'V_PERSONCODE',
            queryMode: 'local',
            //baseCls: 'margin-bottom',
            fieldStyle: 'background-color: #FFEBCD; background-image: none;',
            style: ' margin: 5px 0px 0px 5px',
            labelAlign: 'right',
            width: 200
        }, */
            {
            id: 'spyj',
            xtype: 'textfield',
            fieldLabel: '审批意见',
            labelWidth: 90,
            //baseCls: 'margin-bottom',
            fieldStyle: 'background-color: #FFEBCD; background-image: none;',
            style: ' margin: 5px 0px 0px 5px',
            labelAlign: 'right',
            width: 250
        }, {
            xtype: 'button',
            text: '同意',
            style: ' margin: 5px 20px 0px 20px',
            icon: imgpath + '/saved.png',
            handler: _agree
        }
        // , {
        //     xtype: 'button',
        //     text: '驳回',
        //     style: ' margin: 5px 20px 0px 0px',
        //     icon: imgpath + '/cross.png',
        //     handler: _reject
        // }
        ]
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
            region: 'north',
            border: false,
            items: [buttonPanel]
        }, {
            region: 'center',
            //layout: 'fit',
            border: false,
            items: [inputPanel]
        }]
    });

    _init();
});

function _selectTaskId() {
    Ext.Ajax.request({
        url: AppUrl + 'Activiti/GetTaskIdFromBusinessId',
        type: 'ajax',
        method: 'POST',
        params: {
            businessKey: V_ORDERGUID,
            userCode: Ext.util.Cookies.get('v_personcode')

        },
        success: function (resp) {
            var data = Ext.decode(resp.responseText);//后台返回的值
            taskId = data.taskId;
            V_STEPCODE = data.TaskDefinitionKey;
            // _selectNextPer();
        },
        failure: function (response) {
            Ext.MessageBox.show({
                title: '错误',
                msg: response.responseText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    })
}

//原下一步审批人查找
/*function _selectNextPer() {
    var nextSprStore = Ext.data.StoreManager.lookup('nextSprStore');
    nextSprStore.proxy.extraParams = {
        V_V_ORGCODE: V_V_ORGCODE,
        V_V_DEPTCODE: V_V_DEPTCODE,
        V_V_REPAIRCODE: '',
        V_V_FLOWTYPE: 'MonthPlan01',
        V_V_FLOW_STEP:V_STEPCODE,
        V_V_PERCODE: Ext.util.Cookies.get('v_personcode'),
        V_V_SPECIALTY: V_V_SPECIALTY,
        V_V_WHERE: '通过'
    };
    nextSprStore.currentPage = 1;
    nextSprStore.load();
}*/

function _init() {
    Ext.Ajax.request({
        url: AppUrl + 'dxfile/PRO_PM_03_PLAN_MONTH_GET2',
        type: 'ajax',
        method: 'POST',
        params: {
            'V_V_MONTHPLAN_GUID': V_ORDERGUID
        },
        success: function (response) {
            var data = Ext.decode(response.responseText);
            if (data.list != null) {
                V_V_ORGCODE = data.list[0].V_ORGCODE;
                V_V_DEPTCODE = data.list[0].V_DEPTCODE;
                V_V_SPECIALTY = data.list[0].V_REPAIRMAJOR_CODE;
                V_PERSONNAME = data.list[0].V_INPERNAME;
                V_PERSONCODE = data.list[0].V_INPER;
                //alert(V_PERSONCODE);
                Ext.getCmp('year').setValue(data.list[0].V_YEAR);
                Ext.getCmp('month').setValue(data.list[0].V_MONTH);
                Ext.getCmp('ck').setValue(data.list[0].V_ORGNAME);
                Ext.getCmp('zyq').setValue(data.list[0].V_DEPTNAME);
                Ext.getCmp('zy').setValue(data.list[0].V_REPAIRMAJOR_CODE);
                Ext.getCmp('sblx').setValue(data.list[0].V_EQUTYPENAME);
                Ext.getCmp('sbmc').setValue(data.list[0].V_EQUNAME);
                Ext.getCmp('fqr').setValue(data.list[0].V_INPERNAME);
                Ext.getCmp('fqsj').setValue(data.list[0].V_INDATE.substring(0, 19));
                Ext.getCmp('jxnr').setValue(data.list[0].V_CONTENT);
                Ext.getCmp('jhtgsj').setValue(data.list[0].V_STARTTIME.substring(0, 19));
                Ext.getCmp('jhjgsj').setValue(data.list[0].V_ENDTIME.substring(0, 19));
                Ext.getCmp('jhgshj').setValue(data.list[0].V_HOUR);
                Ext.getCmp('bz').setValue(data.list[0].V_BZ);

                //2018-11-21
                Ext.getCmp('sgfs').setValue(data.list[0].V_SGWAYNAME);
                Ext.getCmp('iflag').setValue(data.list[0].V_FLAG);
                Ext.getCmp('gx').setValue(data.list[0].V_OPERANAME);
                //  _selectNextPer();
                _selectTaskId();
                Ext.getBody().unmask();
            }
        },
        failure: function (response) {
            Ext.MessageBox.show({
                title: '错误',
                msg: response.responseText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            });
        }
    });
}
//下一步审批人
function _selectNextPer(){
    var i_err = 0;
    Ext.Ajax.request({
        url: AppUrl + 'dxfile/PM_ACTIVITI_PROCESS_PER_SELSBB',
        method: 'POST',
        async: false,
        params: {
            V_V_ORGCODE: V_V_ORGCODE,
            V_V_DEPTCODE: V_V_DEPTCODE,
            V_V_REPAIRCODE: '',
            V_V_FLOWTYPE: 'MonthPlan01',
            V_V_FLOW_STEP:V_STEPCODE,
            V_V_PERCODE: Ext.util.Cookies.get('v_personcode'),
            V_V_SPECIALTY: V_V_SPECIALTY,
            V_V_WHERE: '通过'
        },
        success: function (resp) {
            var resp = Ext.decode(resp.responseText);
            processKey = resp.RET;
            if (resp.list.length != 0) {
                for (var i = 0; i < resp.list.length; i++) {
                    nextper.push(resp.list[i].V_PERSONCODE);
                    V_STEPNAME = resp.list[i].V_V_FLOW_STEPNAME;
                    V_NEXT_SETP = resp.list[i].V_V_NEXT_SETP;
                }
            } else {
                alert('没有下一步审批人，无法上报')
            }
        }
    });
}
function _agree() {
    _selectNextPer();
    var spyj = '';
    if (Ext.getCmp('spyj').getValue() == '' || Ext.getCmp('spyj').getValue() == null) {
        spyj = '审批通过';
    } else {
        spyj = Ext.getCmp('spyj').getValue();
    }

    Ext.Ajax.request({
        url: AppUrl + 'Activiti/TaskCompleteHQ',
        type: 'ajax',
        method: 'POST',
        params: {
            taskId: taskId,
            idea: '通过',
            parName: ["Next_StepCode", "flow_yj"],
            // parVal: [Ext.getCmp('nextPer').getValue(), spyj],
            parVal: [V_NEXT_SETP + 'List', spyj],
            // processKey: processKey,
            // businessKey: V_ORDERGUID,
            // V_STEPCODE: V_STEPCODE,
            // V_STEPNAME: V_STEPNAME,
            // V_IDEA: '请审批！',
            V_NEXTPER: nextper
            // ,V_INPER: Ext.util.Cookies.get('v_personcode')
        },
        success: function (response) {
            var resp = Ext.decode(response.responseText);
            if (resp.ret == '任务提交成功') {
                Ext.Ajax.request({
                    url: AppUrl + 'hp/PRO_ACTIVITI_FLOW_AGREE',
                    method: 'POST',
                    async: false,
                    params: {
                        'V_V_ORDERID': V_ORDERGUID,
                        'V_V_PROCESS_NAMESPACE': 'MonthPlan01',
                        'V_V_PROCESS_CODE': processKey,
                        'V_V_STEPCODE': V_STEPCODE,
                        'V_V_STEPNEXT_CODE': V_NEXT_SETP
                    },
                    success: function (ret) {
                        var resp = Ext.JSON.decode(ret.responseText);
                        if (resp.V_INFO == 'success') {
                            Ext.Array.erase(nextper,0,nextper.length);
                            window.opener.QueryTabY();
                            window.opener.QuerySum();
                            window.opener.QueryGrid();
                            window.close();
                            window.opener.OnPageLoad();
                        }
                    }
                });
            } else {
                Ext.MessageBox.alert('提示', '任务提交失败');
            }
        },
        failure: function (response) {//访问到后台时执行的方法。
            Ext.MessageBox.show({
                title: '错误',
                msg: response.responseText,
                buttons: Ext.MessageBox.OK,
                icon: Ext.MessageBox.ERROR
            })
        }
    })
}

function _reject() {
    var spyj = '';
    if (Ext.getCmp('spyj').getValue() == '' || Ext.getCmp('spyj').getValue() == null) {
        spyj = '审批驳回';
    } else {
        spyj = Ext.getCmp('spyj').getValue();
    }
    var Assignee='';
    Ext.Ajax.request({
        url: AppUrl + 'Activiti/InstanceState',
        method: 'POST',
        async: false,
        params: {
            instanceId: ProcessInstanceId
        },
        success: function (ret) {
            var resp = Ext.JSON.decode(ret.responseText);
            Assignee=resp.list[0].Assignee;
        }
    });
    if(Assignee!=''){
        Ext.Ajax.request({
            url: AppUrl + 'Activiti/TaskComplete',
            type: 'ajax',
            method: 'POST',
            params: {
                taskId: taskId,
                idea: '不通过',
                parName: ['fqrxg', "flow_yj"],
                parVal: [Assignee, spyj],
                processKey: processKey,
                businessKey: V_ORDERGUID,
                V_STEPCODE: 'fqrxg',
                V_STEPNAME: '发起人修改',
                V_IDEA: '不通过',
                V_NEXTPER: Assignee,
                V_INPER: Ext.util.Cookies.get('v_personcode')
            },
            success: function (response) {
                var resp = Ext.decode(response.responseText);
                if (resp.ret == '任务提交成功') {
                    Ext.Ajax.request({
                        //url: AppUrl + 'zdh/PRO_WO_FLOW_AGREE',
                        url: AppUrl + 'hp/PRO_ACTIVITI_FLOW_AGREE',
                        method: 'POST',
                        async: false,
                        params: {
                            'V_V_ORDERID': V_ORDERGUID,
                            'V_V_PROCESS_NAMESPACE': 'MonthPlan01',
                            'V_V_PROCESS_CODE': processKey,
                            'V_V_STEPCODE': V_STEPCODE,
                            'V_V_STEPNEXT_CODE': 'fqrxg'
                        },
                        success: function (ret) {
                            var resp = Ext.JSON.decode(ret.responseText);
                            if (resp.V_INFO == 'success') {
                                window.opener.QueryTabY();
                                window.opener.QuerySum();
                                window.opener.QueryGrid();
                                window.close();
                                window.opener.OnPageLoad();
                            }
                        }
                    });
                } else {
                    Ext.MessageBox.alert('提示', '任务提交失败');
                }
            },
            failure: function (response) {//访问到后台时执行的方法。
                Ext.MessageBox.show({
                    title: '错误',
                    msg: response.responseText,
                    buttons: Ext.MessageBox.OK,
                    icon: Ext.MessageBox.ERROR
                })
            }
        })
    }else{
        alert("发起人信息错误，无法驳回");
    }
}

function _close() {
    window.close();
}
