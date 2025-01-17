﻿QueryCheckAlertMsg = "请填写当前设备";

Ext.onReady(function() {

var selPlantstore=Ext.create('Ext.data.Store',
		{
			autoLoad : true,
			storeId : 'selPlantstore',
			fields : [ 'V_DEPTCODE', 'V_DEPTNAME' ],
			proxy : {
				type : 'ajax',
				async : false,
				url: AppUrl + 'PM_12/PRO_BASE_DEPT_VIEW',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'list'
				},
				extraParams : {
					IS_V_DEPTCODE:Ext.util.Cookies.get('v_orgCode'),
					IS_V_DEPTTYPE:'[基层单位]'
				}
			}
		});

			var selSectionstore = Ext.create('Ext.data.Store', {
				autoLoad : false,
				storeId : 'selSectionstore',
				fields : [ 'V_DEPTCODE', 'V_DEPTNAME' ],
				proxy : {
					type : 'ajax',
					async : false,
					url: AppUrl + 'PM_12/PRO_BASE_DEPT_VIEW',
					actionMethods : {
						read : 'POST'
					},
					reader : {
						type : 'json',
						root : 'list'
					}
				}
			});
			var panel = Ext
					.create(
							'Ext.panel.Panel',
							{
								id : 'panellow',
								width : '100%',
								region : 'north',
								frame : true,
								layout : 'column',
								border:false,
								//baseCls : 'my-panel-no-border',
								items : [
										{
											xtype : 'combo',
											id : "selPlant",
											store : selPlantstore,
											editable : false,
											queryMode : 'local',
											fieldLabel : '计划厂矿',
											displayField : 'V_DEPTNAME',
											valueField : 'V_DEPTCODE',
											labelWidth : 70,
											style : ' margin: 5px 0px 0px 10px',
											labelAlign : 'right'
										},
										{
											xtype : 'combo',
											id : "selSection",
											store : selSectionstore,
											editable : false,
											queryMode : 'local',
											fieldLabel : '作业区',
											displayField : 'V_DEPTNAME',
											valueField : 'V_DEPTCODE',
											labelWidth : 60,
											style : ' margin: 5px 0px 5px 10px',
											labelAlign : 'right'
										},
										{
											xtype : 'textfield',
											fieldLabel : '当前设备',
											id : 'nowDevice',
											labelAlign : 'right',
											labelWidth : 70,
											style : ' margin: 5px 0px 0px 10px',
											listeners : {
												click : {
													element : 'el',
													fn : getNowDevice
												}
											}
										},
										{
											xtype : 'hidden',
											id : 'nowDevice_Id'
										},
										{
											xtype : 'hidden',
											id : 'nowDevice_Site'
										},
										{
											xtype : 'button',
											text : '查询',
											icon : imgpath + '/search.png',
											width : 80,
											style : ' margin: 5px 0px 0px 10px',
											handler : function() {
												if (Ext.getCmp('selPlant').getValue() != ''
														&& Ext.getCmp('selPlant').getValue() != null
														&& Ext.getCmp('selSection').getValue() != ''
														&& Ext.getCmp('selSection').getValue() != null
														&& Ext.getCmp('nowDevice_Id').getValue() != ''
														&& Ext.getCmp('nowDevice_Id').getValue() != null) {
													Ext.data.StoreManager.lookup('gridStore').load({
														params : {
															A_PLANTCODE:Ext.getCmp('selPlant').getValue(),
															A_DEPARTCODE:Ext.getCmp('selSection').getValue(),
															A_EQUID:Ext.getCmp('nowDevice_Id').getValue()
														}
													});
												} else {
													Ext.Msg.alert('操作信息', QueryCheckAlertMsg);
												}
											}
										} ]
							});
			var buttonPanel = Ext
					.create(
							'Ext.panel.Panel',
							{
								id : 'buttonPanel',
								width : '100%',
								region : 'north',
								frame : true,
								layout : 'column',
								border:false,
								//baseCls : 'my-panel-no-border',
								items : [
										{
											id : 'insert',
											xtype : 'button',
											text : '添加备件',
											icon : imgpath + '/add.png',
											width : 80,
											style : ' margin: 5px 0px 5px 10px',
											listeners : {
												click : OnAddButtonClicked
											}
										},
										{
											id : 'modify',
											xtype : 'button',
											text : '修改备件',
											icon : imgpath + '/add.png',
											width : 80,
											style : ' margin: 5px 0px 0px 10px',
											listeners : {
												click : OnModifyButtonClicked
											}
										},
										{
											id : 'delete',
											xtype : 'button',
											text : '删除备件',
											icon : imgpath + '/delete1.png',
											width : 80,
											style : ' margin: 5px 0px 0px 10px',
											listeners : {
												click : OnButtonDeleteClicked
											}
										},
										{
											id : 'lookNormal',
											xtype : 'button',
											text : '查看备件标准周期量',
											icon : imgpath + '/search.png',
											width : 160,
											style : ' margin: 5px 0px 0px 10px',
											listeners : {
												click : function() {//11
													var length = Ext.getCmp('grid').getSelectionModel().getSelection().length;
													if (length != 1) {
														Ext.Msg.alert('操作信息', '请选择一条数据查看');
														return false;
													} else {
														var selectedRecord = Ext.getCmp("grid").getSelectionModel().getSelection()[0].data;
														window.open(AppUrl + "page/PM_120201010102/index.html?V_MPCODE="+ selectedRecord.BJ_ID,'', "dialogHeight:400px;dialogWidth:650px");
													}

												}
											}
										},
										{
											id : 'lookData',
											xtype : 'button',
											text : '查看备件包含物料数据',
											icon : imgpath + '/search.png',
											width : 160,
											style : ' margin: 5px 0px 0px 10px',
											listeners : {
												click : function() {
													var length = Ext.getCmp('grid').getSelectionModel().getSelection().length;
													if (length != 1) {
														Ext.Msg.alert('操作信息', '请选择一条数据查看');
														return false;
													} else {
														var selectedRecord = Ext.getCmp("grid").getSelectionModel().getSelection()[0].data;
														window.open(AppUrl + "page/PM_120201010101/index.html?V_MPCODE="+ selectedRecord.BJ_ID,'', "dialogHeight:400px;dialogWidth:1000px");
													}
												}
											}
										} ]
							});
			var grid = Ext.create('Ext.grid.Panel', {
						id : 'grid',
						region : 'center',
						columnLines : true,
						width : '100%',
						store : {
							id : 'gridStore',
							pageSize : 200,
							autoLoad : false,
							fields : [ 'BJ_ID', 'BJ_DESC', 'BJ_TYPE',
									'BJ_UNIT', 'EQU_NAME', 'BJ_REMARK',
									'PLANTNAME', 'DEPARTNAME','PRE_FLAG_DESC','PRE_FLAG' ],
							proxy : {
								type : 'ajax',
								async : false,
								url : AppUrl + 'PM_12/PRO_RUN_BJ_ALL',
								actionMethods : {
									read : 'POST'
								},
								reader : {
									type : 'json',
									root : 'list',
									total : 'total'
								}
							},
							listeners : {
								beforeload : beforeloadStore
							}
						},
						autoScroll : true,
						selType : 'checkboxmodel',
						height : 400,
						columns : [

						{
							xtype : 'rownumberer',
							text : '序号',
							width : 35,
							sortable : false
						}, {
							text : '备件编码',
							width : 130,
							dataIndex : 'BJ_ID',
							align : 'center',
							renderer : atleft
						}, {
							text : '备件描述',
							width : 150,
							dataIndex : 'BJ_DESC',
							align : 'center',
							renderer : atleft
						}, {
							text : '规格型号',
							width : 100,
							dataIndex : 'BJ_TYPE',
							align : 'center',
							renderer : atleft
						}, {
							text : '计量单位',
							width : 100,
							dataIndex : 'BJ_UNIT',
							type : 'date',
							renderer : atleft
						}, {
							text : '所属设备',
							width : 120,
							dataIndex : 'EQU_NAME',
							renderer : atleft
						}, {
							text : '预装件',
							width : 80,
							dataIndex : 'PRE_FLAG',
							renderer : function(value, cellmeta, record, rowIndex, columnIndex, store){
                                   if(value=='1'){
									   return '是';
								   }
								return '否';
							}
						}, {
							text : '所属厂矿',
							width : 110,
							dataIndex : 'PLANTNAME',
							align : 'center',
							renderer : atleft
						}, {
							text : '所属作业区',
							width : 110,
							dataIndex : 'DEPARTNAME',
							align : 'center',
							renderer : atleft
						}, {
							text : '备注',
							width : 300,
							dataIndex : 'BJ_REMARK',
							align : 'center',
							renderer : atleft
						}, {
							dataIndex : 'ID',
							hidden : true
						} ],
						bbar : [ {
							xtype : 'pagingtoolbar',
							dock : 'bottom',
							displayInfo : true,
							displayMsg : '显示第{0}条到第{1}条记录,一共{2}条',
							emptyMsg : '没有记录',
							store : 'gridStore'
						} ]
					});

			Ext.data.StoreManager.lookup('selPlantstore').on("load", function() {
				Ext.getCmp("selPlant").select(Ext.data.StoreManager.lookup('selPlantstore').getAt(0));
				Ext.data.StoreManager.lookup('selSectionstore').load({
					params : {
						IS_V_DEPTCODE:Ext.util.Cookies.get('v_orgCode'),
						IS_V_DEPTTYPE:'[主体作业区]'
					}
				});
			});
			Ext.data.StoreManager.lookup('selSectionstore').on("load", function() {
				Ext.getCmp("selSection").select(Ext.data.StoreManager.lookup('selSectionstore').getAt(0));
			});
			Ext.getCmp('selPlant').on("select", function() {
				Ext.data.StoreManager.lookup('selSectionstore').removeAll();
				Ext.data.StoreManager.lookup('selSectionstore').load({
						params : {
							IS_V_DEPTCODE:Ext.util.Cookies.get('v_orgCode'),
							IS_V_DEPTTYPE:'[主体作业区]'
						}
					});
				});

			Ext.create('Ext.window.Window', {
				width : 600,
				height : 400,
				title : '添加备件',
				layout : 'fit',
				id : 'winAdd',
				closeAction : 'hide',
				closable : true,
				items : [ {
					xtype : 'panel',
					frame : true,
					bodyStyle : 'padding:5px 5px 0',
					width : 600,
					items : [ {
						xtype : 'container',
						anchor : '100%',
						layout : 'column',
						items : [ {
							xtype : 'container',
							columnWidth : 1 / 2,
							layout : 'anchor',
							items : [ {
								xtype : 'textfield',
								fieldLabel : '备件编码',
								id : 'spareId_Add',
								labelAlign : 'top',
								anchor : '95%'
							}, {
								xtype : 'textfield',
								fieldLabel : '规格型号',
								id : 'normsType_Add',
								labelAlign : 'top',
								anchor : '95%'
							} ]
						}, {
							xtype : 'container',
							columnWidth : 1 / 2,
							layout : 'anchor',
							items : [ {
								xtype : 'textfield',
								fieldLabel : '备件描述',
								id : 'spareMore_Add',
								labelAlign : 'top',
								anchor : '100%'
							}, {
								xtype : 'textfield',
								fieldLabel : '计量单位',
								id : 'unit_Add',
								labelAlign : 'top',
								anchor : '100%'
							} ]
						},{
							xtype : 'container',
							columnWidth : 1 / 2,
							layout : 'anchor',
							items : [{
											xtype : 'combo',
											id : "pre_flag_Add",
											store : Ext.create('Ext.data.Store', {
														autoLoad : true,
														fields : [ 'PRE_FLAG', 'PRE_FLAG_DESC' ],
														data:[{'PRE_FLAG':'0','PRE_FLAG_DESC':'否'},{'PRE_FLAG':'1','PRE_FLAG_DESC':'是'}],
														proxy: {
															type: 'memory',
															reader: {
																type: 'json'
															}
														}
													}),
											editable : false,
											queryMode : 'local',
											fieldLabel : '预装件',
											value:'0',
											displayField : 'PRE_FLAG_DESC',
											valueField : 'PRE_FLAG',
											labelAlign : 'top',
											anchor : '100%'
										}]
						} ]
					}, {
						xtype : 'container',
						width : '100%',
						items : [ {
							xtype : 'textarea',
							fieldLabel : '备注',
							labelAlign : 'top',
							id : 'remarks_Add',
							height : 200,
							width : '100%'
						} ]
					}

					],

					buttons : [ {
						text : '保存',
						handler : winAddSave
					}, {
						text : '关闭',
						handler : function() {
							Ext.getCmp('winAdd').hide();
						}
					} ]
				} ]

			});

			Ext.create('Ext.window.Window', {
				width : 600,
				height : 400,
				title : '修改备件',
				id : 'winModify',
				layout : 'fit',
				closeAction : 'hide',
				closable : true,
				items : [ {
					xtype : 'panel',
					frame : true,
					bodyStyle : 'padding:5px 5px 0',
					width : 600,
					items : [ {
						xtype : 'container',
						anchor : '100%',
						layout : 'column',
						items : [ {
							xtype : 'container',
							columnWidth : 1 / 2,
							layout : 'anchor',
							items : [ {
								xtype : 'textfield',
								fieldLabel : '备件编码',
								id : 'spareId_Modify',
								labelAlign : 'top',
								anchor : '95%'
							}, {
								xtype : 'textfield',
								fieldLabel : '规格型号',
								id : 'normsType_Modify',
								labelAlign : 'top',
								anchor : '95%'
							} ]
						}, {
							xtype : 'container',
							columnWidth : 1 / 2,
							layout : 'anchor',
							items : [ {
								xtype : 'textfield',
								fieldLabel : '备件描述',
								id : 'spareMore_Modify',
								labelAlign : 'top',
								anchor : '100%'
							}, {
								xtype : 'textfield',
								id : 'unit_Modify',
								fieldLabel : '计量单位',
								labelAlign : 'top',
								anchor : '100%'
							} ]
						},{
							xtype : 'container',
							columnWidth : 1 / 2,
							layout : 'anchor',
							items : [{
											xtype : 'combo',
											id : "pre_flag_Modify",
											store :Ext.create('Ext.data.Store', {
														autoLoad : true,
														fields : [ 'PRE_FLAG', 'PRE_FLAG_DESC' ],
														data:[{'PRE_FLAG':'0','PRE_FLAG_DESC':'否'},{'PRE_FLAG':'1','PRE_FLAG_DESC':'是'}],
														proxy: {
															type: 'memory',
															reader: {
																type: 'json'
															}
														}
													}),
											editable : false,
											queryMode : 'local',
											fieldLabel : '预装件',
											displayField : 'PRE_FLAG_DESC',
											valueField : 'PRE_FLAG',
											labelAlign : 'top',
											anchor : '100%'
										}]
						} ]
					}, {
						xtype : 'container',
						width : '100%',
						items : [ {
							xtype : 'textarea',
							fieldLabel : '备注',
							id : 'remarks_Modify',
							labelAlign : 'top',
							height : 200,
							width : '100%'
						} ]
					}

					],

					buttons : [ {
						text : '保存',
						handler : winModifySave
					}, {
						text : '关闭',
						handler : function() {
							Ext.getCmp('winModify').hide();
						}
					} ]
				} ]

			});

			Ext.create('Ext.container.Viewport', {
				id : "id",
				layout : 'border',
				items : [ panel, buttonPanel, grid ]
			});
		});

function OnButtonDeleteClicked() {
	var selectModel = Ext.getCmp("grid").getSelectionModel();
	var length = Ext.getCmp('grid').getSelectionModel().getSelection().length;
	if (length == 0) {
		Ext.Msg.alert('操作信息', '请选择需要删除');
		return false;
	} else {
		var selectedRecord = Ext.getCmp("grid").getSelectionModel().getSelection();
		var i_err = 0;
		for (i = 0; i < length; i++) {
			Ext.Ajax.request({
				url: AppUrl + 'PM_12/PRO_RUN_BJ_DELETE',
				async : false,
				method : 'POST',
				params : {
					A_BJ_ID:selectModel.getSelection()[i].data.BJ_ID
				},
				success : function(resp){
					resp = Ext.decode(resp.responseText);
					if (resp.RET!= 'Success') {
						Ext.Msg.alert('操作信息', '删除失败');
						i_err++;
					}
				}
			});
		}
		if (i_err == 0) {
			Ext.Msg.alert('操作信息', '删除成功');
			Ext.data.StoreManager.lookup('gridStore').load({
				params : {
					A_PLANTCODE:Ext.getCmp('selPlant').getValue(),
					A_DEPARTCODE:Ext.getCmp('selSection').getValue(),
					A_EQUID:Ext.getCmp('nowDevice_Id').getValue()
				}
			});
		}
	}
}

function winAddSave() {
	Ext.Ajax.request({
		url: AppUrl + 'PM_12/PRO_RUN_BJ_ADD',
		method : 'POST',
		params : {
			'A_BJ_ID': Ext.getCmp('spareId_Add').getValue(),
			'A_BJ_DESC':Ext.getCmp('spareMore_Add').getValue(),
			'A_BJ_TYPE':Ext.getCmp('normsType_Add').getValue(),
			'A_BJ_UNIT':Ext.getCmp('unit_Add').getValue(),
			'A_BJ_REMARK':Ext.getCmp('remarks_Add').getValue(),
			'A_PLANTCODE':Ext.getCmp('selPlant').getValue(),
			'A_DEPARTCODE':Ext.getCmp('selSection').getValue(),
			'A_EQUID':Ext.getCmp('nowDevice_Id').getValue(),
			'A_PRE_FLAG':Ext.getCmp('pre_flag_Add').getValue()
		},
		success : function(resp) {
			resp = Ext.decode(resp.responseText);
			if (resp.RET== 'Success') {
				Ext.Msg.alert('操作信息', '录入成功');
				Ext.getCmp('spareId_Add').setValue(''),
				Ext.getCmp('spareMore_Add').setValue(''),
				Ext.getCmp('normsType_Add').setValue(''),
				Ext.getCmp('unit_Add').setValue(''),
				Ext.getCmp('remarks_Add').setValue(''),
				Ext.getCmp('winAdd').hide();
				Ext.data.StoreManager.lookup('gridStore').load({
					params : {
						A_PLANTCODE:Ext.getCmp('selPlant').getValue(),
						A_DEPARTCODE:Ext.getCmp('selSection').getValue(),
						A_EQUID:Ext.getCmp('nowDevice_Id').getValue()
					}
				});
			} else {
				Ext.Msg.alert('操作信息', '录入失败');
			}
		},
		render : {
			type : 'josn',
			root : 'list'
		}
	});
}

function OnAddButtonClicked() {
	Ext.getCmp('winAdd').show();
};
//修改后保存
function winModifySave() {
	Ext.Ajax.request({
		url: AppUrl + 'PM_12/PRO_RUN_BJ_UPDATE',
		method : 'POST',
		params : {
			'A_BJ_ID':Ext.getCmp('spareId_Modify').getValue(),
			'A_BJ_DESC':Ext.getCmp('spareMore_Modify').getValue(),
			'A_BJ_TYPE':Ext.getCmp('normsType_Modify').getValue(),
			'A_BJ_UNIT':Ext.getCmp('unit_Modify').getValue(),
			'A_BJ_REMARK':Ext.getCmp('remarks_Modify').getValue(),
			'A_PRE_FLAG':Ext.getCmp('pre_flag_Modify').getValue()
		},
		success : function(resp) {
			resp = Ext.decode(resp.responseText);
			if (resp.RET == 'Success') {
				Ext.Msg.alert('操作信息', '修改成功');
				Ext.getCmp('spareId_Modify').setValue(''),
				Ext.getCmp('spareMore_Modify').setValue(''),
				Ext.getCmp('normsType_Modify').setValue(''),
				Ext.getCmp('unit_Modify').setValue(''),
				Ext.getCmp('remarks_Modify').setValue(''),
				Ext.getCmp('winModify').hide();

				Ext.data.StoreManager.lookup('gridStore').load({
					params : {
						A_PLANTCODE:Ext.getCmp('selPlant').getValue(),
						A_DEPARTCODE:Ext.getCmp('selSection').getValue(),
						A_EQUID:Ext.getCmp('nowDevice_Id').getValue()
					}
				});
			} else {
				Ext.Msg.alert('操作信息', '修改失败');
			}
		},
		render : {
			type : 'josn',
			root : 'list'
		}
	});
}

function OnModifyButtonClicked() {
	var length = Ext.getCmp('grid').getSelectionModel().getSelection().length;
	if (length!= 1) {
		Ext.Msg.alert('操作信息', '请选择一条数据修改');
		return;
	} else {
		Ext.getCmp('winModify').show();
		var selectedRecord = Ext.getCmp("grid").getSelectionModel().getSelection()[0].data;
		Ext.getCmp('spareId_Modify').setValue(selectedRecord.BJ_ID);
		Ext.getCmp('normsType_Modify').setValue(selectedRecord.BJ_TYPE);
		Ext.getCmp('spareMore_Modify').setValue(selectedRecord.BJ_DESC);
		Ext.getCmp('unit_Modify').setValue(selectedRecord.BJ_UNIT);
		Ext.getCmp('remarks_Modify').setValue(selectedRecord.BJ_REMARK);
		Ext.getCmp('pre_flag_Modify').select(selectedRecord.PRE_FLAG);
	}
}

function beforeloadStore(store) {
	store.proxy.extraParams.A_PLANTCODE =Ext.getCmp('selPlant').getValue();
	store.proxy.extraParams.A_DEPARTCODE =Ext.getCmp('selSection').getValue();
	store.proxy.extraParams.A_EQUID =Ext.getCmp('nowDevice_Id').getValue();
}

function atleft(value, metaData, record, rowIndex, colIndex, store) {
	metaData.style = "text-align:left;";
	return value;
}
//当前设备选择
function getNowDevice(){
	window.open(AppUrl + "page/PM_090101/index.html?DEPTCODE="+Ext.getCmp('selSection').getValue(),'', "dialogHeight:400px;dialogWidth:650px");
}

function getEquipReturnValue(retdata){
	var returnValue=retdata.split('^');
	Ext.getCmp('nowDevice_Id').setValue(returnValue[0]);
	Ext.getCmp('nowDevice').setValue(returnValue[1]);
	Ext.getCmp('nowDevice_Site').setValue(returnValue[2]);
}