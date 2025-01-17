﻿//123123
Ext.onReady(function() {
			var gridStore = Ext.create('Ext.data.Store', {
				id : 'gridStore',
				autoLoad : false,
				pageSize :100,
				fields : ['MATERIALCODE','MATERIALNAME', 'UNIT','MATERIALETALON', 'F_PRICE'],
				proxy : {
					type : 'ajax',
					async : false,
					url : AppUrl + 'PM_12/PRO_RUN7124_SUPPLYMATLIST',
					actionMethods : {
						read : 'POST'
					},
					reader : {
						type : 'json',
						root : 'list'
					}
				}
			});

			var grid = Ext.create('Ext.grid.Panel', {
				id : 'grid',
				region : 'center',
				columnLines : true,
				width : '100%',
				columns : [
					     {  
							text : '物料号',
							dataIndex : 'MATERIALCODE',
							align : 'center',
							width:110,
							renderer : left
						}, {
							text : '物料描述',
							dataIndex : 'MATERIALNAME',
							align : 'center',
							flex:1,
							renderer : left
						}, {
							text : '计量单位',
							dataIndex : 'UNIT',
							align : 'center',
							width:110,
							renderer : left
						}, {
							text : '规格型号',
							dataIndex : 'MATERIALETALON',
							align : 'center',
							width:110,
							renderer : left
						}, {
							text : '计划单价',
							dataIndex : 'F_PRICE',
							align : 'center',
							width:110,
							renderer : right
						},  
						{
							text : '删除',
							align : 'center',
							xtype : 'templatecolumn',
							width:80,
							tpl : '<a style="cursor:pointer;text-decoration:underline; color:#00F">删除</a>',
							id : 'delete'
						}
						 
						],
				store : gridStore,
				autoScroll : true
			});
			var queryPanel = Ext
					.create(
							'Ext.panel.Panel',
							{
								id : 'queryPanel',
								width : '100%',
								region : 'north',
								defaults : {
									labelAlign : 'right',
									style : 'margin:3px 0px 2px 5px'
								},
								bodyPadding : 3,
								frame : true,
								layout : 'column',
								items : [
								        { id: 'supplierCode', xtype: 'displayfield', fieldLabel: '供应商编码',labelWidth:70,style : 'margin:3px 20px 2px 5px'},
								        { id: 'supplierName', xtype: 'displayfield', fieldLabel: '供应商名',labelWidth:60,style : 'margin:3px 20px 2px 5px'},
										{
											id : 'add',
											xtype : 'button',
											text : '添加物料',
											icon : imgpath+'/add.png',
											handler : function() { 
												Ext.getCmp('dialog').show();
											}
										},
										{
											id : 'equcode',
											xtype : 'hidden'
										}, {
											id : 'updateid',
											xtype : 'hidden'
										} ]
							});

			var windows = Ext.create('Ext.window.Window', {
				id : 'dialog',
				title : '添加物料',
				height : 140,
				bodyPadding : 5,
				closeAction : 'hide',
				width : 280,
				modal : true,
				frame : true,
				defaults : {
					labelWidth : 60,
					labelAlign : 'right'
				},
				items : [ {
					style:'margin:10px 0 0 0',
					id : 'V_MATERIALCODE',
					xtype : 'textfield',
					fieldLabel : '物料号'
				} 
				  ],
				
				buttons : [ {
					text : '保 存', 
					handler : btnbc,
					icon : imgpath+'/filesave.png'
				}, {
					text : '取 消',
					icon : imgpath+'/tree_dnd_no.png',
					handler : function() {
						Ext.ComponentManager.get('dialog').hide();
					}
				} ]
			});
			Ext.create('Ext.container.Viewport', {
				layout : 'border',
				items : [ queryPanel, grid ]
			});

			Ext.getCmp('supplierCode').setValue(Ext.urlDecode(location.href.split('?')[1]).SUPPLY_CODE);
			Ext.getCmp('supplierName').setValue(Ext.urlDecode(location.href.split('?')[1]).SUPPLY_NAME);
			 
			query();
			
			Ext.getCmp('delete').on('click',function(a,b,c,d){
				del(Ext.getCmp("supplierCode").getValue(),gridStore.getAt(c).get("MATERIALCODE"));
			});
			
			
			function del(V_SUPPLY_CODE,V_MATERIALCODE){
				Ext.Ajax.request({
					url : AppUrl + 'PM_12/PRO_RUN7124_DELSUPPLYMAT',
					method : 'POST',
					params : {
						V_SUPPLY_CODE:V_SUPPLY_CODE,// 供应商编码
						V_MATERIALCODE:V_MATERIALCODE // 物料号
					},
					success : function(response) {
						var resp = Ext.JSON.decode(response.responseText);
					    if(resp.OUT_RESULT=="success"){
						     Ext.Msg.alert('操作信息','删除成功');
						     query();
						} 
					}
				});
			}
		})

function btnbc() {
		if(Ext.ComponentManager.get('V_MATERIALCODE').getValue()!=null && Ext.ComponentManager.get('V_MATERIALCODE').getValue()!="" &&
		   Ext.ComponentManager.get('supplierCode').getValue()!=null && Ext.ComponentManager.get('supplierCode').getValue()!=""){
		
		Ext.Ajax.request({
			url : AppUrl + 'PM_12/PRO_RUN7124_ADDSUPPLYMAT',
			method : 'POST',
			params : {
				V_SUPPLY_CODE:Ext.ComponentManager.get('supplierCode').getValue(),  // 供应商编码
				V_MATERIALCODE:Ext.ComponentManager.get('V_MATERIALCODE').getValue() // 物料号
			},
			success : function(response) {
				var resp = Ext.JSON.decode(response.responseText);
				if(resp.OUT_RESULT =="error:ORA-02291: integrity constraint (NAPMNEW.FK_RUN_SUPP_REFERENCE_RUN_MAT) violated - parent key not found"){
					 Ext.Msg.alert('操作信息','没有相应的物料号');
				}else if(resp.OUT_RESULT=="error:ORA-00001: unique constraint (NAPMNEW.PK_RUN_SUPPLIER_MAT) violated"){
				     Ext.Msg.alert('操作信息','相应的物料号已存在');
				}else if(resp.OUT_RESULT =="success"){
				     Ext.Msg.alert('操作信息','添加成功');
				     Ext.ComponentManager.get('dialog').hide();
				     query();
				}else {
				     Ext.Msg.alert('操作信息','发生未知异常');
				}
			}
		});
		}else{
		    Ext.Msg.alert("提示","《供应商编码》与《物料号》 - 不能为空");
		}
}

function query(){
	Ext.data.StoreManager.get('gridStore').load({
		params : {
			V_SUPPLY_CODE:Ext.ComponentManager.get('supplierCode').getValue()
		}
	});
}


function left(value, metaData) {
	metaData.style = "text-align:left";
	return value;
}

function right(value, metaData) {
	metaData.style = "text-align:right";
	return value;
}
