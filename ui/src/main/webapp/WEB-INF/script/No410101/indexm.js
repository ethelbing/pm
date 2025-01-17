var LODOP="";
var idGroup=[];
var orderID="";


$(function () {
    loadPageInfo();
});

function DefaultPrintSettings() {
    try{
        LODOP = getLodop(document.getElementById('LODOP'), document.getElementById('LODOP_EM'));
        LODOP.SET_LICENSES("鞍山市新安杰系统集成有限公司", "559677661718684777294958093190", "", "");

        LODOP.PRINT_INIT("gongdan");
        var strBodyStyle="<style> " +
            " body, td, th { " +
            "    font-size: 10pt;  letter-spacing:0.1mm; " +
            "} " +
            ".outbox {  border: 1.5pt solid #000;}  " +
            ".border_r_b {"+
            "     border-right-width: 1.5pt;"+
            "     border-bottom-width: 1.5pt;"+
            "     border-right-style: solid;"+
            "     border-bottom-style: solid;"+
            "     border-right-color: #000;"+
            "     border-bottom-color: #000;"+
            "}"+
            " .border_r {"+
            "     border-right-width: 1.5pt;"+
            "     border-right-style: solid;"+
            "     border-right-color: #000;"+
            " }"+
            " .border_b {"+
            "   border-bottom-width: 1.5pt;"+
            "   border-bottom-style: solid;"+
            "   border-bottom-color: #000;"+
            " }"+
            " .Ttable td {"+
            "     height: 4mm;"+
            " }"+
            " .PageNext {"+
            "     page-break-after: always;"+
            " }</style>";

        LODOP.SET_PRINT_PAGESIZE(2, 2100, 2970, 'A4 横向');

        for(var i=0 ;i< idGroup.length;i++){
            var strFormHtml = strBodyStyle + $("#"+idGroup[i]).html() ;
            LODOP.ADD_PRINT_HTML("30","15","100%","95%" ,strFormHtml);
            LODOP.NewPage();
        }

    }
    catch(e){
        $("#exception").show();
    }
}


function Print() {
    try{
        DefaultPrintSettings();
        LODOP.PRINT();
    }catch(e){
        $("#exception").show();
    }
}

function Preview() {
    try{
        DefaultPrintSettings();
        LODOP.PREVIEW();
    }catch(e){
        $("#exception").show();
    }
}



function loadPageInfo() {

    var argument = [];

    $.each(window.opener.selectID, function (index, items) {
        argument.push(items);
    });


    $.each(argument, function (index, item) {

        var max = 0;
        var cur_material_index = 0;
        var cur_max_material = 15;
        var cur_max_operation = 0;
        var max_operation = 0;

        var result = [], base = [], operate = [], operateFill = [], marial = [], marialFill = [], check = [], fiish = [];
        loadTaskGrid(item).success(function (respTask) {
            loadMatList(item).success(function (respMat) {
                max = Math.ceil((respTask.list.length + respMat.list.length) / 20);
                if (max == 0) {
                    max = 1;
                }
                max_operation = respTask.list.length;
                $.each(respTask, function (indexTask, itemTask) {
                });
                $.each(respMat, function (indexMat, itemMat) {
                    itemMat.sid = indexMat + 1;
                });
                $.ajax({
                    url: AppUrl + 'WorkOrder/PRO_PM_WORKORDER_GET',
                    type: 'post',
                    async: false,
                    data: {
                        V_V_ORDERGUID : item
                    },
                    dataType: "json",
                    traditional: true,
                    success: function (resp) {
                        orderID = resp.list[0].V_ORDERID;
                        for (var x = 0; x < max; x++) {
                            result.push('   <div id="'+index.toString()+x.toString()+'">');
                            result.push('    <div style="height: 17cm;">');
                            result.push('      <table class="outbox" width="1000"  border="0" align="left" cellpadding="0" cellspacing="0">');
                            result.push('        <tr>');
                            result.push('        <td valign="top">');
                            result.push('            <table class="Ttable" width="100%" border="0" cellspacing="0" cellpadding="0">');
                            result.push('                <tr>');
                            result.push('                    <td colspan="2" class="border_r_b">');
                            result.push('                        <b>① 基本信息栏</b>');
                            result.push('                    </td>');
                            result.push('                    <td width="220" rowspan="6" align="center" class="border_r_b">');

                            result.push('      <table  border="0" align="center" cellpadding="0" cellspacing="0">');
                            result.push('                        <tr><td><b>检修类型：</b></td><td><b>');
                            result.push(resp.list[0].V_ORDER_TYP_TXT);
                            result.push('                        &nbsp;</b></td>');
                            result.push('                        </tr><tr>');
                            result.push('                        <td><b>工&nbsp;单&nbsp;号：</b></td><td><b>');
                            result.push(resp.list[0].V_ORDERID);
                            result.push('                       &nbsp;</b></td>');
                            result.push('                        </tr><tr>');

                            result.push('                        <td><b>检修单位：</b></td><td><b>');
                            result.push(resp.list[0].V_DEPTNAMEREPARIR);
                            result.push('                         &nbsp;</b></td></tr>');
                            result.push(' <tr rowspan="2">');
                            result.push(' <td colspan="2" style="vertical-align: top;text-align:left;"><b>工单描述：</b><b>');
                            result.push('&nbsp;&nbsp;&nbsp;'+descBill(resp.list[0].V_SHORT_TXT));
                            result.push('&nbsp;</b></td>');
                            result.push(' </tr>');
                            result.push(' </table>');

                            result.push('                    </td>');
                            result.push('                    <td colspan="4" class="border_b">');
                            result.push('                        <b>② 任务信息栏</b>');
                            result.push('                    </td>');
                            result.push('                </tr>');
                            result.push('                <tr>');
                            result.push('                    <td width="100" align="center" class="border_r_b">');
                            result.push('                        工厂单位');
                            result.push('                    </td>');
                            result.push('                    <td width="140" class="border_r_b">');
                            result.push('                        <span>');
                            result.push(resp.list[0].V_ORGNAME);
                            result.push('                        </span>');
                            result.push('                        &nbsp;');
                            result.push('                    </td>');
                            result.push('                    <td align="center" class="border_r_b">');
                            result.push('                        创建人');
                            result.push('                    </td>');
                            result.push('                    <td width="60" align="center" class="border_r_b">');
                            result.push('                        <span>');
                            result.push(resp.list[0].V_ENTERED_BY);
                            result.push('</span>');
                            result.push('</td>');
                            result.push('                    <td width="70" align="center" class="border_r_b">');
                            result.push('                        创建日期');
                            result.push('                    </td>');
                            result.push('                    <td width="100" align="center" class="border_b">');
                            result.push('                        <span>');
                            var s1, st1;
                            if(resp.list[0].D_ENTER_DATE!=''){
                                s1 = resp.list[0].D_ENTER_DATE;
                                st1 = [];
                                st1 = s1.split(' ');
                            }else{
                                s1 =new Date();
                                st1 = [];
                                st1 = s1.split(' ');
                            }
                            result.push(st1[0]);
                            result.push('</span>');
                            result.push('                    </td>');
                            result.push('                </tr>');
                            result.push('                <tr>');
                            result.push('                    <td align="center" class="border_r_b">');
                            result.push('                        作业区');
                            result.push('                    </td>');
                            result.push('                    <td class="border_r_b">');
                            result.push('                        <span>');
                            result.push(resp.list[0].V_DEPTNAME);
                            result.push('</span>');
                            result.push('                        &nbsp;');
                            result.push('                    </td>');
                            result.push('                    <td align="center" class="border_r_b">');
                            result.push('                        <span style="value-align: center;">计划开始时间</span>');
                            result.push('                    </td>');
                            result.push('                    <td align="left" colspan="3" class="border_b">');
                            result.push('<span>');
                            result.push(resp.list[0].D_START_DATE);
                            result.push('</span>');
                            result.push('                        &nbsp;');
                            result.push('                    </td>');
                            result.push('                </tr>');
                            result.push('                <tr>');
                            result.push('                    <td align="center" class="border_r_b">');
                            result.push('                        设备名称');
                            result.push('                    </td>');
                            result.push('                    <td class="border_r_b">');
                            result.push('                        <span>');
                            result.push(resp.list[0].V_EQUIP_NAME);
                            result.push('</span>');
                            result.push('                        &nbsp;');
                            result.push('                    </td>');
                            result.push('                    <td align="center" class="border_r_b">');
                            result.push('                        <span style="value-align: center;">计划完成时间</span>');
                            result.push('                    </td>');
                            result.push('                    <td align="left" colspan="3" class="border_b">');
                            result.push('<span>');
                            result.push(resp.list[0].D_FINISH_DATE);
                            result.push('</span>');
                            result.push('                        &nbsp;');
                            result.push('                    </td>');
                            result.push('                </tr>');
                            result.push('                <tr>');
                            result.push('                    <td align="center" class="border_r_b">');
                            result.push('                        设备编号');
                            result.push('                    </td>');
                            result.push('                    <td class="border_r_b">');
                            result.push('                        <span>');
                            result.push(resp.list[0].V_EQUIP_NO);
                            result.push('</span>');
                            result.push('                        &nbsp;');
                            result.push('                    </td>');
                            result.push('                    <td align="center" class="border_r_b">');
                            result.push('                        <span style="value-align: center;">实际开始时间</span>');
                            result.push('                    </td>');
                            result.push('                    <td align="left" colspan="3" class="border_b">');
                            result.push('<span>');
                            result.push(resp.list[0].D_FACT_START_DATE);
                            result.push('&nbsp;</span>');
                            result.push('                    </td>');
                            result.push('                </tr>');
                            result.push('                <tr>');
                            result.push('                    <td align="center" class="border_r_b">');
                            result.push('                        功能位置');
                            result.push('                    </td>');
                            result.push('                    <td class="border_r_b">');
                            result.push('                        <span>');
                            result.push(resp.list[0].V_EQUSITENAME);
                            result.push('</span>');
                            result.push('</td>');
                            result.push('                    <td align="center" class="border_r_b">');
                            result.push('                        <span style="value-align: center;">实际完成时间</span>');
                            result.push('                    </td>');
                            result.push('                    <td align="left" colspan="3" class="border_b">');
                            result.push('<span>');
                            result.push(resp.list[0].D_FACT_FINISH_DATE);
                            result.push('&nbsp;</span>');
                            result.push('</td>');
                            result.push('                </tr>');
                            result.push('            </table>');
                            result.push('            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="Ttable">');
                            result.push('                <tr>');
                            result.push('                    <td colspan="11" class="border_b">');
                            result.push('                        <b>③ 任务细节</b>');
                            result.push('                    </td>');
                            result.push('                </tr>');
                            result.push('                <tr>');
                            result.push('                    <td width="40" align="center" class="border_r_b">');
                            result.push('                        工序<br />');
                            result.push('                        编号');
                            result.push('                    </td>');
                            result.push('                    <td width="200" align="center" valign="top" class="border_r_b">');
                            result.push('                        工作中心<br />');
                            result.push('                    </td>');
                            result.push('                    <td  width="250"  align="center" valign="top" class="border_r_b">');
                            result.push('                        工序内容<br />');
                            result.push('                    </td>');
                            result.push('                    <td width="40" align="center" class="border_r_b">');
                            result.push('                        定额<br />');
                            result.push('                        时间');
                            result.push('                    </td>');
                            result.push('                    <td width="40" align="center" class="border_r_b">');
                            result.push('                        定额<br />');
                            result.push('                        人数');
                            result.push('                    </td>');
                            result.push('                    <td width="40" align="center" class="border_r_b">');
                            result.push('                        实际<br />');
                            result.push('                        时间');
                            result.push('                    </td>');
                            result.push('                    <td width="40" align="center" class="border_r_b">');
                            result.push('                        实际<br />');
                            result.push('                        人数');
                            result.push('                    </td>');
                            result.push('                    <td width="100" align="center" valign="top" class="border_r_b">');
                            result.push('                        机具<br />');
                            result.push('                    </td>');
                            result.push('                    <td width="100" align="center" valign="top" class="border_r_b">');
                            result.push('                        工具<br />');
                            result.push('                    </td>');
                            result.push('                    <td width="100" align="center" valign="top" class="border_r_b">');
                            result.push('                        工艺技术要求<br />');
                            result.push('                    </td>');
                            result.push('                    <td width="100" align="center" valign="top" class="border_b">');
                            result.push('                        安全措施要求<br />');
                            result.push('                    </td>');
                            result.push('                </tr>');

                            if (respTask.list != "") {
                                for (var i = x * 15; i < max_operation; i++) {

                                    if (i < 15 * (x + 1)) {
                                        result.push('             <tr>');
                                        result.push('                <td class="border_r_b" align="center">');
                                        result.push(respTask.list[i].V_ACTIVITY==""?"&nbsp;":respTask.list[i].V_ACTIVITY);
                                        result.push('</td>');
                                        result.push('                <td class="border_r_b" align="center">');
                                        result.push(respTask.list[i].V_WORK_CENTER==""?"&nbsp;":descBill(respTask.list[i].V_WORK_CENTER));
                                        result.push('</td>');
                                        result.push('                <td class="border_r_b" align="left">');
                                        result.push(respTask.list[i].V_DESCRIPTION==""?"&nbsp;":descBill(respTask.list[i].V_DESCRIPTION));
                                        result.push('</td>');
                                        result.push('                <td class="border_r_b" align="right">');
                                        result.push(respTask.list[i].I_WORK_ACTIVITY==""?"&nbsp;":respTask.list[i].I_WORK_ACTIVITY);
                                        result.push('&nbsp;</td>');
                                        result.push('                <td class="border_r_b" align="right">');
                                        result.push(respTask.list[i].I_DURATION_NORMAL==""?"&nbsp;":respTask.list[i].I_DURATION_NORMAL);
                                        result.push('&nbsp;</td>');
                                        result.push('                    <td class="border_r_b" align="right">');
                                        result.push(respTask.list[i].I_ACTUAL_TIME==""?"&nbsp;":respTask.list[i].I_ACTUAL_TIME);
                                        result.push('&nbsp;</td>');
                                        result.push('                    <td class="border_r_b" align="right">');
                                        result.push(respTask.list[i].I_NUMBER_OF_PEOPLE==""?"&nbsp;":respTask.list[i].I_NUMBER_OF_PEOPLE);
                                        result.push('&nbsp;</td>');

                                        result.push('                <td width="90" class="border_r_b" align="left">');
                                        result.push(respTask.list[i].V_DESCRIPTION==""?"&nbsp;":descBill(respTask.list[i].V_JJ_NAME));
                                        result.push('&nbsp;</td>');

                                        result.push('                <td width="90" class="border_r_b" align="left">');
                                        result.push(respTask.list[i].V_DESCRIPTION==""?"&nbsp;":descBill(respTask.list[i].V_GJ_NAME));
                                        result.push('&nbsp;</td>');

                                        result.push('                <td width="90" class="border_r_b" align="left">');
                                        result.push(respTask.list[i].V_DESCRIPTION==""?"&nbsp;":descBill(respTask.list[i].V_JSQY_NAME));
                                        result.push('&nbsp;</td>');

                                        result.push('                <td width="90" class="border_r_b" align="left">');
                                        result.push(respTask.list[i].V_DESCRIPTION==""?"&nbsp;":descBill(respTask.list[i].V_AQSC_NAME));
                                        result.push('&nbsp;</td>');

                                        result.push('            </tr>');
                                    }

                                    cur_max_material--;
                                    cur_max_operation++;
                                }
                            }
                            result.push('            </table>');
                            result.push('            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="Ttable">');
                            result.push('                <tr>');
                            result.push('                    <td colspan="10" class="border_b">');
                            result.push('                        <b>④ 物料信息</b>');
                            result.push('                    </td>');
                            result.push('                </tr>');
                            result.push('                <tr>');
                            result.push('                    <td width="35" align="center" class="border_r_b">');
                            result.push('                        序号');
                            result.push('                    </td>');
                            result.push('                    <td width="35" align="center" class="border_r_b">');
                            result.push('                        工序');
                            result.push('                    </td>');
                            result.push('                    <td width="120" align="center" class="border_r_b">');
                            result.push('                        物料编码');
                            result.push('                    </td>');
                            result.push('                    <td width="440" align="center" class="border_r_b">');
                            result.push('                        物料描述');
                            result.push('                    </td>');
                            result.push('                    <td width="30" align="center" class="border_r_b">');
                            result.push('                        单位');
                            result.push('                    </td>');
                            result.push('                    <td width="70" align="center" class="border_r_b">');
                            result.push('                        计划数量');
                            result.push('                    </td>');
                            result.push('                    <td width="100" align="center" class="border_r_b">');
                            result.push('                        计划总金额');
                            result.push('                    </td>');
                            result.push('                    <td width="70" align="center" class="border_r_b">');
                            result.push('                        实际数量');
                            result.push('                    </td>');
                            result.push('                    <td width="100" align="center" class="border_r_b">');
                            result.push('                        实际总金额');
                            result.push('                    </td>');
                            result.push('                    <td width="100" align="center" class="border_b">');
                            result.push('                        备注');
                            result.push('                    </td>');
                            result.push('                 </tr>');

                            if (1) {
                                for (var i = 0; i < cur_max_material; i++) {

                                    result.push('                 <tr>');

                                    if (cur_material_index < respMat.list.length) {
                                        result.push('                 <td class="border_r_b" align="center">');
                                        result.push(cur_material_index + 1);
                                        result.push('</td>');
                                        result.push('                 <td class="border_r_b" align="center">');
                                        result.push(respMat.list[cur_material_index].V_ACTIVITY==""?"&nbsp;":respMat.list[cur_material_index].V_ACTIVITY);
                                        result.push('</td>');
                                        result.push('                 <td class="border_r_b" align="center">');
                                        result.push(respMat.list[cur_material_index].V_MATERIALCODE==""?"&nbsp;":respMat.list[cur_material_index].V_MATERIALCODE);
                                        result.push('</td>');
                                        result.push('                 <td class="border_r_b" align="left">');
                                        result.push(descBilldesc(respMat.list[cur_material_index].V_MATERIALNAME)==""?"&nbsp;":descBilldesc(respMat.list[cur_material_index].V_MATERIALNAME));
                                        result.push('</td>');
                                        result.push('                 <td class="border_r_b"  align="center">');
                                        result.push(respMat.list[cur_material_index].V_UNIT==""?"&nbsp;":respMat.list[cur_material_index].V_UNIT);
                                        result.push('</td>');
                                        result.push('                 <td class="border_r_b" align="right">');
                                        result.push(respMat.list[cur_material_index].I_PLANAMOUNT==""?"&nbsp;":respMat.list[cur_material_index].I_PLANAMOUNT);
                                        result.push('&nbsp;</td>');
                                        result.push('                 <td class="border_r_b" align="right">');
                                        result.push(respMat.list[cur_material_index].F_PLANMONEY==""?"&nbsp;":respMat.list[cur_material_index].F_PLANMONEY);
                                        result.push('&nbsp;</td>');
                                        result.push('                 <td class="border_r_b" align="right">');
                                        result.push(respMat.list[cur_material_index].I_ACTUALAMOUNT==""?"&nbsp;":respMat.list[cur_material_index].I_ACTUALAMOUNT);
                                        result.push('&nbsp;</td>');
                                        result.push('                 <td class="border_r_b" align="right">');
                                        result.push(respMat.list[cur_material_index].F_ACTUALMONEY==""?"&nbsp;":respMat.list[cur_material_index].F_ACTUALMONEY);
                                        result.push('&nbsp;</td>');
                                        result.push('                 <td class="border_b" align="left">');
                                        result.push(respMat.list[cur_material_index].V_MEMO==""?"&nbsp;":respMat.list[cur_material_index].V_MEMO);
                                        result.push('</td>');
                                    }
                                    else {
                                        result.push('                 <td class="border_r_b">');
                                        result.push('&nbsp;');
                                        result.push('</td>');
                                        result.push('                 <td class="border_r_b">');
                                        result.push('&nbsp;');
                                        result.push('</td>');
                                        result.push('                 <td class="border_r_b">');
                                        result.push('&nbsp;');
                                        result.push('</td>');
                                        result.push('                 <td class="border_r_b">');
                                        result.push('&nbsp;');
                                        result.push('</td>');
                                        result.push('                 <td class="border_r_b">');
                                        result.push('&nbsp;');
                                        result.push('</td>');
                                        result.push('                 <td class="border_r_b">');
                                        result.push('&nbsp;');
                                        result.push('</td>');
                                        result.push('                 <td class="border_r_b">');
                                        result.push('&nbsp;');
                                        result.push('</td>');
                                        result.push('                 <td class="border_r_b">');
                                        result.push('&nbsp;');
                                        result.push('</td>');
                                        result.push('                 <td class="border_r_b">');
                                        result.push('&nbsp;');
                                        result.push('</td>');
                                        result.push('                 <td class="border_b">');
                                        result.push('&nbsp;');
                                        result.push('</td>');
                                    }
                                    result.push('                 </tr>');
                                    cur_material_index++;
                                }
                            }

                            result.push('            <table width="100%" border="0" cellpadding="0" cellspacing="0" class="Ttable">');
                            result.push('                <tr>');
                            result.push('                    <td colspan="3" class="border_b">');
                            result.push('                        <b>⑤ 验收栏</b>');
                            result.push('                    </td>');
                            result.push('                </tr>');
                            result.push('                <tr>');
                            result.push('                    <td width="280" class="border_r_b">');
                            result.push('验收日期：');
                            result.push(resp.list[0].D_DATE_ACP);
                            result.push('</td>');
                            result.push('                    <td class="border_r_b">');
                            result.push('提前/逾期时间：');
                            result.push(resp.list[0].I_OTHERHOUR);
                            result.push('</td>');
                            result.push('                    <td width="405" class="border_b">');
                            result.push('逾期原因：');
                            result.push(resp.list[0].V_OTHERREASON);
                            result.push('</td>');
                            result.push('                </tr>');
                            result.push('                <tr>');
                            result.push('                    <td class="border_r_b">');
                            result.push('检修方说明：');
                            result.push(resp.list[0].V_REPAIRCONTENT);
                            result.push('</td>');
                            result.push('                    <td class="border_r_b">');
                            result.push('检修方签字：');
                            result.push(resp.list[0].V_REPAIRSIGN);
                            result.push('</td>');
                            result.push('                    <td class="border_b">');
                            result.push('检修人员：');
                            result.push(resp.list[0].V_REPAIRPERSON);
                            result.push('</td>');
                            result.push('                </tr>');
                            result.push('                <tr>');
                            result.push('                    <td class="border_r_b">');
                            result.push('岗位签字：');
                            result.push(resp.list[0].V_POSTMANSIGN);
                            result.push('</td>');
                            result.push('                    <td class="border_r_b">');
                            result.push('点检员验收意见：');
                            result.push(resp.list[0].V_CHECKMANCONTENT);
                            result.push('</td>');
                            result.push('                    <td class="border_b">');
                            result.push('点检员签字：');
                            result.push(resp.list[0].V_CHECKMANSIGN);
                            result.push('</td>');
                            result.push('                    </tr>');
                            result.push('               <tr>');
                            result.push('                    <td class="border_r">');
                            result.push('作业区验收：');
                            result.push(resp.list[0].V_WORKSHOPCONTENT);
                            result.push('</td>');
                            result.push('                    <td class="border_r">');
                            result.push('库管员签字：');
                            result.push(resp.list[0].V_WORKSHOPSIGN);
                            result.push('</td>');
                            result.push('                    <td>');
                            result.push('部门签字：');
                            result.push(resp.list[0].V_DEPTSIGN);
                            result.push('</td>');
                            result.push('                </tr>');
                            result.push('            </table>');
                            result.push('        </td>');
                            result.push('        </tr>');
                            result.push('      </table>');
                            result.push('    </div>');
                            result.push('    </div>');
                            if (x + 1 < max || index + 1 <= argument.length) {
                                idGroup.push(index.toString()+x.toString());
                            }

                            cur_max_material = 15;
                            cur_max_operation = 0;

                            $("#yesprint").append(result.join(""));
                            result = [];
                        }
                    }
                });
            });
        });
    });
}


function loadTaskGrid(id) {
    var object = $.ajax({
        url: AppUrl + 'zdh/PRO_PM_WORKORDER_ET_OPERATIONS',
        type: 'post',
        async: false,
        data: {
            V_V_ORDERGUID : id
        },
        dataType: "json",
        traditional: true
    });
    return object;
}

function loadMatList(id) {
    var object = $.ajax({
        url: AppUrl + 'zdh/PRO_PM_WORKORDER_SPARE_VIEW',
        type: 'post',
        async: false,
        data: {
            V_V_ORDERGUID :id
        },
        dataType: "json",
        traditional: true
    });
    return object;
}


function NowDate() {

    var s, d = "";

    d = new Date();

    //d.setDate(nowDay);
    var year = d.getFullYear().toString();
    var month = (d.getMonth() + 1).toString();
    var date = (d.getDate()).toString();

    s = year + "-" + month + "-" + date;

    return s;

}


function NowTime() {
    var s, d = "";

    d = new Date();


    var year = d.getHours();
    var month = d.getMinutes();
    var date = d.getSeconds();

    s = year + ":" + month + ":" + date;

    return s;
}

function descBill(content){
    var temp = [];
    for(var i=0;i<content.length;i++){
        if(i<70){
            temp.push(content.charAt(i));
        }
    }

    return temp.join("");
}

function descBilldesc(content){
    var temp = [];
    for(var i=0;i<content.length;i++){
        if(i<30){
            temp.push(content.charAt(i));
        }
    }

    return temp.join("");
}

function descBilldescN(content){
    var temp = [];
    for(var i=0;i<content.length;i++){
        if(i<20){
            temp.push(content.charAt(i));
        }
    }

    return temp.join("");
}

function subDesc(content,count){
    var temp = [];
    for(var i=0;i<content.length;i++){
        temp.push(content.charAt(i));
        if(i!=0&&i%count==0){
            temp.push("<br/>");
        }
    }

    return temp.join("");
}

function rowspan(x,max_operation){
    if(x==0){
        return max_operation;
    }else{
        return max_operation - x*20
    }


}

function GetBillMatByOrder(){
    $.ajax({
        url:APP + '/WS_EquipGetBillMaterialByOrderService',
        type: 'post',
        async: false,
        data: {
            orderid:orderID,
            V_V_ORDERGUID:id
        },
        dataType: "json",
        traditional: true
    });
}

function btnAnZhuang(){
    location.href = AppUrl + "resources/install_lodop32.exe";
}