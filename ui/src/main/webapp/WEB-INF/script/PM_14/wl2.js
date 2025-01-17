﻿var V_ORDERGUID = null;
var V_GUID = null;
if (location.href.split('?')[1] != undefined) {
	V_ORDERGUID = Ext.urlDecode(location.href.split('?')[1]).V_ORDERGUID;
	V_GUID = Ext.urlDecode(location.href.split('?')[1]).V_GUID;
}
var GridModel = Ext.create('Ext.selection.RowModel', {});
Ext
	.onReady(function() {
		Ext.QuickTips.init();
		var firstStore, secondStore, thirdStore;

		var activityStore = Ext.create('Ext.data.Store', {
			id : 'activityStore',
			autoLoad : true,
			fields : [ 'V_ACTIVITY' ],
			proxy : {
				type : 'ajax',
				// url: '/No41070102/PRO_PM_WORKORDER_ET_ACTIVITY',
				url : APP + '/ModelSelect',
				actionMethods : {
					read : 'POST'
				},
				extraParams : {
					// V_V_ORDERGUID: V_ORDERGUID
					parName : [ 'V_V_ORDERGUID' ],
					parType : [ 's' ],
					parVal : [ V_ORDERGUID ],
					proName : 'PRO_PM_WORKORDER_ET_ACTIVITY',
					cursorName : 'V_CURSOR'
				},
				reader : {
					type : 'json',
					root : 'list'
				}
			}
		});

		var KCPlantStore = Ext.create('Ext.data.Store', {
			id : 'KCPlantStore',
			autoLoad : true,
			fields : [ 'V_DEPTNAME', 'V_SAP_JHGC' ],
			proxy : {
				type : 'ajax',
				url : APP + '/ModelSelect',
				// url: '/No4106/PRO_BASE_DEPT_VIEW_ROLE',
				actionMethods : {
					read : 'POST'
				},
				extraParams : {
					parName : [ 'V_V_PERSONCODE', 'V_V_DEPTCODE',
						'V_V_DEPTCODENEXT', 'V_V_DEPTTYPE' ],
					parType : [ 's', 's', 's', 's' ],
					parVal : [ Ext.util.Cookies.get("v_personcode"),
						Ext.util.Cookies.get("v_orgCode"),
						Ext.util.Cookies.get("v_deptcode"), "[基层单位]" ],
					proName : 'PRO_BASE_DEPT_VIEW_ROLE',
					cursorName : 'V_CURSOR'
				},
				reader : {
					type : 'json',
					root : 'list'
				}
			}
		});

		var KCSectionStore = Ext.create('Ext.data.Store', {
			id : 'KCSectionStore',
			autoLoad : false,
			fields : [ 'V_DEPTNAME', 'V_SAP_DEPT' ],
			proxy : {
				type : 'ajax',
				url : APP + '/ModelSelect',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'list'
				}
			}
		});
		var kfSectionStore = Ext.create('Ext.data.Store', {
			id : 'kfSectionStore',
			autoLoad : false,
			fields : [ 'I_FROM_ID', 'FROM_NAME' ],
			proxy : {
				type : 'ajax',
				url : APP + '/ModelSelect',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'list'
				}
			}
		});

		var gridStore = Ext.create('Ext.data.Store', {
			id : 'gridStore',
			autoLoad : false,
			fields : [ 'MAT_NO', 'MAT_DESC', 'UNIT', 'PLAN_PRICE',
				'DICTNAME', 'BEIJIANPORPERTY', 'MAT_GROUP',
				'MAT_OLD_NO', 'DAYS' ],
			proxy : {
				type : 'ajax',
				async : false,
				url : APP + 'mm/WS_MMToXLReadMaterailService',
				actionMethods : {
					read : 'POST'
				},

				reader : {
					type : 'json',
					root : 'list'
				}
			}
		});

		var YZJStore = Ext.create('Ext.data.Store',
			{
				id : 'YZJStore',
				autoLoad : true,
				fields : [ 'V_CODE', 'V_NAME', 'V_TYPE', 'V_UNIT',
					'V_SETSITE', 'V_MEMO', 'I_ID' ],
				proxy : {
					type : 'ajax',
					async : false,
					url : 'GetYZJList',
					actionMethods : {
						read : 'POST'
					},
					extraParams : {
						V_V_EQUCODE : Ext.urlDecode(location.href
							.split('?')[1]).V_EQUIP_NO,
						V_V_DEPTCODE : Ext.urlDecode(location.href
							.split('?')[1]).V_DEPTCODE,
						V_V_STATUS : '在备'
					},
					reader : {
						type : 'json',
						root : 'list'
					}
				}
			});

		var JPStore = Ext
			.create(
			'Ext.data.Store',
			{
				id : 'JPStore',
				autoLoad : true,
				fields : [ 'V_MATERIALCODE', 'V_MATERIALNAME',
					'V_UNIT', 'V_SPEC', 'I_NUMBER',
					'I_PRICE', 'I_MONEY', 'I_ID' ],
				proxy : {
					type : 'ajax',
					async : false,
					url : APP + '/ModelSelect',
					// url: 'PRO_PM_WORKORDER_JIP_VIEW',
					actionMethods : {
						read : 'POST'
					},
					extraParams : {
						parName : [ 'V_V_EQUIP_NO', 'V_I_FLAG' ],
						parType : [ 's' ],
						parVal : [
							Ext.urlDecode(location.href
								.split('?')[1]).V_EQUIP_NO,
							'1' ],
						proName : 'PRO_PM_WORKORDER_JIP_VIEW',
						cursorName : 'V_CURSOR'
					},
					reader : {
						type : 'json',
						root : 'list'
					}
				}
			});

		var KCStore = Ext.create('Ext.data.Store', {
			id : 'KCStore',
			autoLoad : false,
			fields : [ 'VCH_SPAREPART_CODE', 'VCH_SPAREPART_NAME',
				'VCH_TYPE', 'VCH_UNIT', 'PRICE', 'ABLECOUNT',
				'VCH_FROMNAME', 'ID' ],
			proxy : {
				type : 'ajax',
				async : false,
				url : APP + 'mm/GetDepartKC_storeid',
				actionMethods : {
					read : 'POST'
				},
				reader : {
					type : 'json',
					root : 'list'
				}
			}
		});

		var tab = Ext.create('Ext.tab.Panel', {
			id : 'tabpanel',
			xtype : 'tabpanel',
			height : "100%",
			width : "100%",
			activeTab : 0,
			listeners : {
				beforerender : addTab
			}
		});

		function addTab() {

			Ext.ComponentManager.get("tabpanel").add({
				title : '库存',
				items : [ {
					xtype : 'hidden',
					value : 1
				} ],
				dockedItems : [ {
					xtype : 'gridpanel',
					id : 'gridKC',
					autoScroll : true,
					columnLines : true,
					width : 300,
					height : window.screen.height * 4 / 5 - 400,
					store : KCStore,
					listeners : {
						itemclick : OnClickKCGrid
					},
					columns : [ {
						xtype : 'rownumberer',
						text : '序号',
						align : 'center',
						width : 40
					}, {
						text : '库房名称',
						dataIndex : 'VCH_FROMNAME',
						align : 'center',
						renderer : AddFloat
					}, {
						text : '物料编码',
						dataIndex : 'VCH_SPAREPART_CODE',
						align : 'center',
						renderer : AddFloat
					}, {
						text : '物料描述',
						dataIndex : 'VCH_SPAREPART_NAME',
						align : 'center',
						renderer : AddFloat
					}, {
						text : '规格型号',
						dataIndex : 'VCH_TYPE',
						align : 'center',
						renderer : AddFloat
					}, {
						text : '计量单位',
						dataIndex : 'VCH_UNIT',
						align : 'center'
					}, {
						text : '单价',
						dataIndex : 'PRICE',
						align : 'center',
						renderer : AddRight
					}, {
						text : '库存数量',
						dataIndex : 'ABLECOUNT',
						align : 'center',
						renderer : AddFloat
					}, {
						text : '库存ID',
						dataIndex : 'ID',
						align : 'center',
						renderer : AddFloat
					} ],
					dockedItems : [ {
						xtype : 'panel',
						layout : 'column',
						items : [ {
							xtype : 'combo',
							id : 'selKCPlant',
							fieldLabel : '厂矿',
							editable : false,
							store : KCPlantStore,
							labelAlign : 'right',
							labelWidth : 30, // queryMode: 'local',
							displayField : 'V_DEPTNAME',
							valueField : 'V_SAP_JHGC',
							style : 'margin:5px 0 0 10px',
							queryMode : 'local'
						}, {
							xtype : 'combo',
							id : 'selKCSection',
							fieldLabel : '作业区',
							editable : false,
							store : KCSectionStore,
							labelAlign : 'right',
							labelWidth : 60, // queryMode: 'local',
							displayField : 'V_DEPTNAME',
							valueField : 'V_SAP_DEPT',
							style : 'margin:5px 0 0 10px',
							queryMode : 'local'
						}, {
							xtype : 'combo',
							id : 'kfSection',
							fieldLabel : '库房',
							editable : false,
							store : kfSectionStore,
							labelAlign : 'right',
							labelWidth : 60, // queryMode: 'local',
							displayField : 'FROM_NAME',
							valueField : 'I_FROM_ID',
							style : 'margin:5px 0 0 10px',
							queryMode : 'local'
						}, {
							xtype : 'combo',
							id : 'selKCActi',
							editable : false,
							store : activityStore,
							labelAlign : 'right',
							labelWidth : 30, // queryMode: 'local',
							displayField : 'V_ACTIVITY',
							valueField : 'V_ACTIVITY',
							style : 'margin:5px 0 0 10px'
						}, {
							xtype : 'textfield',
							id : 'KCmatCode',
							emptyText : '按物料编码搜索',
							width : 100,
							style : 'margin:5px 0 0 10px'
						}, {
							xtype : 'textfield',
							id : 'KCmatName',
							emptyText : '按物料名称搜索',
							width : 100,
							style : 'margin:5px 0 0 10px'
						}, {
							xtype : 'textfield',
							id : 'KWMName',
							emptyText : '按库位码搜索',
							width : 100,
							hidden : true,
							style : 'margin:5px 0 0 10px'
						}, {
							xtype : 'textfield',
							id : 'ggxh',
							emptyText : '按规格型号搜索',
							width : 100,
							style : 'margin:5px 0 0 10px'
						}, {
							xtype : 'button',
							text : '查询',
							icon : '../../Themes/gif/search.png',
							style : 'margin:5px 0 0 10px',
							listeners : {
								click : OnClickKCRefreshButton
							}
						} ]
					} ]
				} ]
			});

			Ext.ComponentManager
				.get("tabpanel")
				.add(
				{
					title : '预装件',
					items : [ {
						xtype : 'hidden',
						value : 2
					} ],
					dockedItems : [ {
						xtype : 'panel',
						items : [ {
							xtype : 'gridpanel',
							id : 'gridYZJ',
							store : YZJStore,
							columnLines : true,
							autoScroll : true,
							width : 500,
							height : window.screen.height * 4 / 5 - 400,
							selModel : GridModel,
							listeners : {
								itemclick : OnClickYZJGrid
							},
							columns : [ {
								xtype : 'rownumberer',
								text : '序号',
								align : 'center',
								width : 40
							}, {
								text : '预装件编码',
								dataIndex : 'V_CODE',
								align : 'center',
								renderer : AddFloat,
								width : 100
							}, {
								text : '预装件名称',
								dataIndex : 'V_NAME',
								align : 'center',
								renderer : AddFloat
							}, {
								text : '预装件型号',
								dataIndex : 'V_TYPE',
								align : 'center',
								renderer : AddFloat
							}, {
								text : '预装件单位',
								dataIndex : 'V_UNIT',
								align : 'center',
								renderer : AddFloat
							}, {
								text : '安装位置',
								dataIndex : 'V_SETSITE',
								align : 'center',
								renderer : AddFloat
							}, {
								text : '备注',
								dataIndex : 'V_MEMO',
								align : 'center',
								renderer : AddFloat
							} ],
							dockedItems : [ {
								xtype : 'panel',
								layout : 'column',
								height : 35,
								items : [
									{
										xtype : 'combo',
										id : 'selYZJActi',
										editable : false,
										store : activityStore,
										labelAlign : 'right',
										labelWidth : 30, // queryMode:
										// 'local',
										displayField : 'V_ACTIVITY',
										valueField : 'V_ACTIVITY',
										style : 'margin:5px 0 0 10px'
									},
									{
										xtype : 'button',
										text : '刷新',
										icon : '../../Themes/gif/table_refresh.png',
										style : 'margin:5px 0 0 10px',
										listeners : {
											click : OnClickZYJRefreshButton
										}
									} ]
							} ]
						} ]
					} ]
				});
			Ext.ComponentManager.get("tabpanel").add({
				title : '机旁选择',
				items : [ {
					xtype : 'hidden',
					value : 3
				} ],
				dockedItems : [ {
					xtype : 'gridpanel',
					autoScroll : true,
					width : 500,
					height : window.screen.height * 4 / 5 - 400,
					id : 'gridJP',
					store : JPStore,
					listeners : {
						itemclick : OnClickJPGrid
					},
					columns : [ {
						xtype : 'rownumberer',
						text : '序号',
						align : 'center',
						width : 40
					}, {
						text : '物料编码',
						dataIndex : 'V_MATERIALCODE',
						align : 'center',
						renderer : AddFloat
					}, {
						text : '物料描述',
						dataIndex : 'V_MATERIALNAME',
						align : 'center',
						renderer : AddFloat
					}, {
						text : '单位',
						dataIndex : 'V_UNIT',
						align : 'center'
					}, {
						text : '规格型号',
						dataIndex : 'V_SPEC',
						align : 'center',
						renderer : AddFloat
					}, {
						text : '机旁暂存数量',
						dataIndex : 'I_NUMBER',
						align : 'center',
						renderer : AddFloat
					}, {
						text : '单价',
						dataIndex : 'I_PRICE',
						align : 'center',
						renderer : AddRight
					}, {
						text : '金额',
						dataIndex : 'I_MONEY',
						align : 'center',
						renderer : AddFloat
					} ],
					dockedItems : [ {
						xtype : 'panel',
						layout : 'column',
						height : 35,
						items : [ {
							xtype : 'combo',
							id : 'selJPActi',
							editable : false,
							store : activityStore,
							labelAlign : 'right',
							labelWidth : 30, // queryMode: 'local',
							displayField : 'V_ACTIVITY',
							valueField : 'V_ACTIVITY',
							style : 'margin:5px 0 0 10px'
						}, {
							xtype : 'button',
							text : '刷新',
							icon : '../../Themes/gif/table_refresh.png',
							style : 'margin:5px 0 0 10px',
							listeners : {
								click : OnClickRefreshButton
							}
						} ]
					} ]
				} ]
			});

			Ext.ComponentManager.get("tabpanel").add({
				title : '物料主数据',
				items : [ {
					xtype : 'hidden',
					value : 0
				} ],
				dockedItems : [ {
					xtype : 'panel',
					layout : 'column',
					items : [ {
						xtype : 'textfield',
						fieldLabel : '物料编码',
						id : 'matCode',
						labelAlign : 'right',
						labelWidth : 60
					}, {
						xtype : 'textfield',
						fieldLabel : '物料名称',
						id : 'matDesc',
						labelAlign : 'right',
						labelWidth : 60
					}, {
						xtype : 'combo',
						fieldLabel : '物资类别',
						id : 'selType',
						editable : false,
						store : [ [ '材料', '材料' ], [ '备件', '备件' ] ],
						labelAlign : 'right',
						labelWidth : 60
					}, {
						xtype : 'combo',
						fieldLabel : '工序',
						id : 'selActivity',
						editable : false,
						store : activityStore,
						labelAlign : 'right',
						labelWidth : 30, // queryMode: 'local',
						displayField : 'V_ACTIVITY',
						valueField : 'V_ACTIVITY'
					}, {
						xtype : 'button',
						text : '查询',
						icon : '../../Themes/gif/search.png',
						width : 60,
						margin : '0px 0px 0px 10px',
						listeners : {
							click : loadQuery
						}
					} ]
				}, {
					xtype : 'gridpanel',
					id : 'grid',
					store : gridStore,
					columnLines : true,
					autoScroll : true,
					width : 500,
					height : window.screen.height * 4 / 5 - 400,
					columns : [ {
						text : '物料编码',
						id : 'codeClick',
						dataIndex : 'MAT_NO',
						width : 100,
						align : 'center',
						renderer : AddFloat
					}, {
						text : '物料描述',
						dataIndex : 'MAT_DESC',
						width : 160,
						align : 'center',
						renderer : AddFloat
					}, {
						text : '单位',
						dataIndex : 'UNIT',
						width : 40,
						align : 'center'
					}, {
						text : '计划价',
						dataIndex : 'PLAN_PRICE',
						width : 60,
						align : 'center',
						renderer : AddRight
					}, {
						text : '规格型号',
						dataIndex : 'MAT_OLD_NO',
						width : 80,
						align : 'center',
						renderer : AddFloat
					} ],
					listeners : {
						itemclick : BackItem
					}
				} ]
			});

			Ext.ComponentManager.get("tabpanel").setActiveTab(0);
		}

		function loadQuery() {
			if (Ext.getCmp('matCode').getValue() == '') {
				Ext.MessageBox.alert('操作信息', '物料编码不能为空');
			} else {
				gridStore.proxy.extraParams.x_code = Ext.getCmp('matCode')
					.getValue();
				gridStore.proxy.extraParams.x_name = Ext.getCmp('matDesc')
					.getValue();
				gridStore.proxy.extraParams.x_type = Ext.getCmp('selType')
					.getValue();
				Ext.ComponentManager.get('grid').getStore().load();
			}
		}

		function BackItem(aa, record, item, index, e, eOpts) {
			var matCode = record.data.MAT_NO;
			var matDesc = record.data.MAT_DESC;
			var unit = record.data.UNIT;
			var price = record.data.PLAN_PRICE;
			var matgon = record.data.MAT_OLD_NO;
			var acti = Ext.getCmp('selActivity').getValue();

			var threeParams = matCode + '^' + matDesc + '^' + unit + '^'
				+ price + '^' + matgon + '^' + acti;
			window.parent.OnClickMatCodeText(threeParams);
		}

		function OnClickYZJGrid(pp, record, item, index, e, eOpts) {
			var acti = Ext.getCmp('selYZJActi').getValue();
			var matCode = record.data.V_CODE;
			var matDesc = record.data.V_NAME;
			var matgon = record.data.V_TYPE;
			var unit = record.data.V_UNIT;
			var typeID = record.data.I_ID;
			var memo = record.data.V_MEMO;

			var moreParams = acti + '^' + matCode + '^' + matDesc + '^'
				+ matgon + '^' + unit + '^' + typeID + '^' + memo;
			window.parent.OnClickYZJText(moreParams);

			Ext.getCmp('gridYZJ').getStore().load();
		}

		function OnClickJPGrid(pp, record, item, index, e, eOpts) {
			var acti = Ext.getCmp('selJPActi').getValue();
			var matCode = record.data.V_MATERIALCODE;
			var matDesc = record.data.V_MATERIALNAME;
			var matgon = record.data.V_SPEC;
			var unit = record.data.V_UNIT;
			var price = record.data.I_PRICE;
			var numb = record.data.I_NUMBER;
			var money = record.data.I_MONEY;
			var typeID = record.data.I_ID;

			var moreParams = acti + '^' + matCode + '^' + matDesc + '^'
				+ matgon + '^' + unit + '^' + price + '^' + numb + '^'
				+ money + '^' + typeID;
			window.parent.OnClickJPText(moreParams);

			Ext.getCmp('gridJP').getStore().load();
		}

		function OnClickKCGrid(pp, record, item, index, e, eOpts) {
			var acti = Ext.getCmp('selKCActi').getValue();
			var matCode = record.data.VCH_SPAREPART_CODE;
			var matDesc = record.data.VCH_SPAREPART_NAME;
			var matgon = record.data.VCH_TYPE;
			var unit = record.data.VCH_UNIT;
			var price = record.data.PRICE;
			var typeID = record.data.ID;

			var moreParams = Ext.String.trim(acti) + '^'
				+ Ext.String.trim(matCode) + '^'
				+ Ext.String.trim(matDesc) + '^'
				+ Ext.String.trim(matgon) + '^' + Ext.String.trim(unit)
				+ '^' + Ext.String.trim(price) + '^'
				+ Ext.String.trim(typeID);
			window.parent.OnClickKCText(moreParams);

		}

		function OnClickRefreshButton() {
			Ext.getCmp('gridJP').getStore().load();
		}

		function OnClickZYJRefreshButton() {
			Ext.getCmp('gridYZJ').getStore().load();
		}
		var filter = function(record, id) {
			var ggxh = Ext.getCmp('ggxh').getValue();
			if (ggxh == '' || ggxh == null) {
				return true;
			} else {
				if (record.get("VCH_TYPE")
					&& Ext.util.Format
						.lowercase(record.get("VCH_TYPE")).indexOf(
						Ext.util.Format.lowercase(ggxh)) >= 0)
					return true;
				else
					return false;
			}
		};
		var onStoreLoad = function(store, records, options) {
			store.filterBy(filter);
		};
		function OnClickKCRefreshButton() {
			// public string GetDepartKC_storeid(int number, string code,
			// string name, string sap_plantcode, string sap_departcode,
			// string storeplace,string i_from_id)
			Ext.data.StoreManager.get('KCStore').load({
				params : {
					number : '1000',
					code : Ext.getCmp('KCmatCode').getValue(),
					name : Ext.getCmp('KCmatName').getValue(),
					sap_plantcode : Ext.getCmp('selKCPlant').getValue(),
					sap_departcode : Ext.getCmp('selKCSection').getValue(),
					kumvalue : Ext.getCmp('KWMName').getValue(),
					i_from_id : Ext.getCmp('kfSection').getValue()
				}
			});
			Ext.data.StoreManager.lookup('KCStore').on("load", onStoreLoad);
		}

		function AddFloat(value, metaData, record, rowIndex, colIndex,
						  store, view) {
			return '<div data-qtip="' + value + '" >' + value + '</div>';
		}

		function AddRight(value, metaData, record, rowIndex, colIndex,
						  store, view) {
			return '<div style="text-align:right;" data-qtip="' + value
				+ '" >' + value + '</div>';
		}

		activityStore.on('load', function() {
			Ext.getCmp('selActivity').select(activityStore.getAt(0));
			Ext.getCmp('selYZJActi').select(activityStore.getAt(0));
			Ext.getCmp('selJPActi').select(activityStore.getAt(0));
			Ext.getCmp('selKCActi').select(activityStore.getAt(0));
		});

		Ext.create('Ext.container.Viewport', {
			items : [ tab ]
		});

		Ext.ComponentManager.get('selType').select('材料');

		Ext.data.StoreManager.get('kfSectionStore').load({
			params : {
				parName : [],
				parType : [],
				parVal : [],
				proName : 'pro_mm_store_dic',
				cursorName : 'V_CURSOR'
			}
		});

		Ext.data.StoreManager
			.get('KCPlantStore')
			.on(
			'load',
			function() {
				Ext.getCmp('selKCPlant').select(
					Ext.data.StoreManager.get(
						'KCPlantStore').getAt(0));

				var plantCode = '';

				Ext.Ajax
					.request({
						url : APP + '/ModelSelect',
						async : false,
						method : 'post',
						params : {
							parName : [ 'V_V_SAP_JHGC' ],
							parType : [ 's' ],
							parVal : [ Ext.getCmp(
								'selKCPlant')
								.getValue() ],
							proName : 'PRO_BASE_DEPT_SAP_JHGC',
							cursorName : 'V_CURSOR'
						},
						success : function(response) {
							plantCode = Ext.JSON
								.decode(response.responseText).list[0].V_DEPTCODE;

							Ext.data.StoreManager
								.get('KCSectionStore')
								.load(
								{
									params : {
										parName : [
											'V_V_PERSONCODE',
											'V_V_DEPTCODE',
											'V_V_DEPTCODENEXT',
											'V_V_DEPTTYPE' ],
										parType : [
											's',
											's',
											's',
											's' ],
										parVal : [
											Ext.util.Cookies
												.get("v_personcode"),
											plantCode,
											Ext.util.Cookies
												.get("v_deptcode"),
											"[主体作业区]" ],
										proName : 'PRO_BASE_DEPT_VIEW_ROLE',
										cursorName : 'V_CURSOR'
									}
								});
						}
					});

			});

		Ext.data.StoreManager.get('KCSectionStore').on('load', function() {
			Ext.getCmp('selKCSection').select(KCSectionStore.getAt(0));
		});
		Ext.data.StoreManager.get('kfSectionStore').on('load', function() {
			Ext.getCmp('kfSection').select(kfSectionStore.getAt(0));
		});

		Ext
			.getCmp('selKCPlant')
			.on(
			'change',
			function() {
				Ext.ComponentManager.get('selKCSection')
					.getStore().removeAll();

				Ext.Ajax
					.request({
						url : APP + '/ModelSelect',
						async : false,
						method : 'post',
						params : {
							parName : [ 'V_V_SAP_JHGC' ],
							parType : [ 's' ],
							parVal : [ Ext.getCmp(
								'selKCPlant')
								.getValue() ],
							proName : 'PRO_BASE_DEPT_SAP_JHGC',
							cursorName : 'V_CURSOR'
						},
						success : function(response) {
							plantCode = Ext.JSON
								.decode(response.responseText).list[0].V_DEPTCODE;

							Ext.data.StoreManager
								.get('KCSectionStore')
								.load(
								{
									params : {
										parName : [
											'V_V_PERSONCODE',
											'V_V_DEPTCODE',
											'V_V_DEPTCODENEXT',
											'V_V_DEPTTYPE' ],
										parType : [
											's',
											's',
											's',
											's' ],
										parVal : [
											Ext.util.Cookies
												.get("v_personcode"),
											plantCode,
											Ext.util.Cookies
												.get("v_deptcode"),
											"[主体作业区]" ],
										proName : 'PRO_BASE_DEPT_VIEW_ROLE',
										cursorName : 'V_CURSOR'
									}
								});
						}
					});
			});

	});
