package org.building.pm.controller;

/**
 * Created by cxy on 2019/1/24.
 */

import org.apache.poi.hssf.usermodel.*;
import org.building.pm.service.CxyService;
import org.building.pm.service.LxmService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.security.NoSuchAlgorithmException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("/app/pm/cxy")
public class CxyController {
    @Autowired
    private CxyService cService;

    @RequestMapping(value = "/BASE_ROLETOTABLE_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> BASE_ROLETOTABLE_SEL(
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_ROLECODE") String V_V_ROLECODE,
            @RequestParam(value = "V_V_UPCODE") String V_V_UPCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.BASE_ROLETOTABLE_SEL(V_V_DEPTCODE, V_V_ROLECODE,V_V_UPCODE);
        List<Map<String, Object>> lxmlist = (List) data.get("list");
        result.put("list", lxmlist);
        result.put("success", true);
        return result;
    }

    //通过月计划的GUID查询对应周计划
    @RequestMapping(value = "/PRO_PM_03_PLAN_WEEK_BY_MONTHGUID", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_03_PLAN_WEEK_BY_MONTHGUID(@RequestParam(value = "V_V_OTHERPLAN_GUID") String V_V_OTHERPLAN_GUID,

                                                        HttpServletRequest request,
                                                        HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();


        HashMap data = cService.PRO_PM_03_PLAN_WEEK_BY_MONTHGUID(V_V_OTHERPLAN_GUID);
        return data;
    }

    @RequestMapping(value = "/PRO_BASE_FAULT_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_BASE_FAULT_SEL(HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_BASE_FAULT_SEL();
        List<Map<String, Object>> list = (List) data.get("list");
        result.put("list", list);
//        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "PRO_PM_STANDARD_GX_BOM_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_STANDARD_GX_BOM_SEL(@RequestParam(value = "V_V_PERSONCODE") String V_V_PERSONCODE,
                                                          @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                          @RequestParam(value = "V_V_REPAIR_CODE") String V_V_REPAIR_CODE,
                                                          @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                         HttpServletRequest request)
            throws SQLException {

        return cService.PRO_PM_STANDARD_GX_BOM_SEL(V_V_PERSONCODE,V_V_DEPTCODE,V_V_REPAIR_CODE,V_V_EQUTYPE);
    }

    @RequestMapping(value = "PM_STANDARD_GX_BOM_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_STANDARD_GX_BOM_SET(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                      @RequestParam(value = "V_V_SPCODE") String V_V_SPCODE,
                                                          @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                          @RequestParam(value = "V_V_NUM") String V_V_NUM,
                                                      @RequestParam(value = "V_V_INPUTER") String V_V_INPUTER,
                                                      HttpServletRequest request)
            throws SQLException {

        return cService.PM_STANDARD_GX_BOM_SET(V_V_GUID,V_V_SPCODE,V_V_EQUCODE,V_V_NUM,V_V_INPUTER);
    }

    @RequestMapping(value = "SAP_PM_EQU_BOM_FOR_JX_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> SAP_PM_EQU_BOM_FOR_JX_SEL(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                      HttpServletRequest request)
            throws SQLException {

        return cService.SAP_PM_EQU_BOM_FOR_JX_SEL(V_V_GUID);
    }

    @RequestMapping(value = "/PRO_STANDARD_DATA_BY_TYPE_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_STANDARD_DATA_BY_TYPE_SEL(@RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                           @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
                                                           @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
                                                           HttpServletRequest request) throws SQLException {

        return cService.PRO_STANDARD_DATA_BY_TYPE_SEL(V_V_EQUTYPE,V_V_PAGE, V_V_PAGESIZE);
    }

    @RequestMapping(value = "PRO_WORKORDER_STANDARD_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_WORKORDER_STANDARD_SET(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                      @RequestParam(value = "V_V_ORDERID") String V_V_ORDERID,
                                                      @RequestParam(value = "V_V_INPUTER") String V_V_INPUTER,
                                                      HttpServletRequest request)
            throws SQLException {

        return cService.PRO_WORKORDER_STANDARD_SET(V_V_GUID,V_V_ORDERID,V_V_INPUTER);
    }

    @RequestMapping(value = "/PM_1405_FAULT_ITEM_DATA_SET_NEW", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_1405_FAULT_ITEM_DATA_SET_NEW(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                         @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                         @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                         @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                         @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                         @RequestParam(value = "V_V_EQUCHILD_CODE") String V_V_EQUCHILD_CODE,
                                                         @RequestParam(value = "V_V_FAULT_GUID") String V_V_FAULT_GUID,
                                                         @RequestParam(value = "V_V_FAULT_TYPE") String V_V_FAULT_TYPE,
                                                         @RequestParam(value = "V_V_FAULT_YY") String V_V_FAULT_YY,
                                                         @RequestParam(value = "V_V_FINDTIME") String V_V_FINDTIME,
                                                         @RequestParam(value = "V_V_FAULT_XX") String V_V_FAULT_XX,
                                                         @RequestParam(value = "V_V_JJBF") String V_V_JJBF,
                                                         @RequestParam(value = "V_V_FAULT_LEVEL") String V_V_FAULT_LEVEL,
                                                         @RequestParam(value = "V_V_FILE_GUID") String V_V_FILE_GUID,
                                                         @RequestParam(value = "V_V_INTIME") String V_V_INTIME,
                                                         @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                         @RequestParam(value = "V_V_IP") String V_V_IP,
                                                         @RequestParam(value = "V_V_FAULT_NAME") String V_V_FAULT_NAME,
                                                         @RequestParam(value = "V_V_FAULT_PART") String V_V_FAULT_PART,
                                                         @RequestParam(value = "V_V_FAULT_CLGC") String V_V_FAULT_CLGC,
                                                         @RequestParam(value = "V_V_FAULT_SS") String V_V_FAULT_SS,
                                                         @RequestParam(value = "V_V_FAULT_XZ") String V_V_FAULT_XZ,
                                                         @RequestParam(value = "V_V_FAULT_ZGCS") String V_V_FAULT_ZGCS,
                                                         @RequestParam(value = "V_V_FZR_CL") String V_V_FZR_CL,
                                                       @RequestParam(value = "V_V_ENDTIME") String V_V_ENDTIME,
                                                       @RequestParam(value = "V_V_REPORTER") String V_V_REPORTER,
                                                       @RequestParam(value = "V_V_FZR") String V_V_FZR,
                                                       @RequestParam(value = "V_V_STOPTIME") String V_V_STOPTIME,
                                                       @RequestParam(value = "V_V_REPAIRTIME") String V_V_REPAIRTIME,
                                                       @RequestParam(value = "V_V_REPAIRCOST") String V_V_REPAIRCOST,
                                                       @RequestParam(value = "V_V_REPROTTIME") String V_V_REPROTTIME,
                                                       @RequestParam(value = "V_V_FAULT_PASS") String V_V_FAULT_PASS,
                                                       @RequestParam(value = "V_V_CAUSEANALYSIS") String V_V_CAUSEANALYSIS,
                                                       @RequestParam(value = "V_V_REPAIR_PLAN") String V_V_REPAIR_PLAN,
                                                       @RequestParam(value = "V_V_ASSENT_CODE") String V_V_ASSENT_CODE,
                                                        HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_1405_FAULT_ITEM_DATA_SET_NEW(V_V_GUID, V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE, V_V_EQUCODE,
                V_V_EQUCHILD_CODE, V_V_FAULT_GUID, V_V_FAULT_TYPE, V_V_FAULT_YY, V_V_FINDTIME,V_V_FAULT_XX,V_V_JJBF, V_V_FAULT_LEVEL,
                V_V_FILE_GUID,V_V_INTIME,V_V_PERCODE,V_V_IP,V_V_FAULT_NAME,V_V_FAULT_PART,V_V_FAULT_CLGC,V_V_FAULT_SS,
                V_V_FAULT_XZ,V_V_FAULT_ZGCS,V_V_FZR_CL,
                V_V_ENDTIME,V_V_REPORTER,V_V_FZR,V_V_STOPTIME,V_V_REPAIRTIME,V_V_REPAIRCOST,V_V_REPROTTIME,
                V_V_FAULT_PASS,V_V_CAUSEANALYSIS,V_V_REPAIR_PLAN,V_V_ASSENT_CODE);

        String RET = (String) data.get("RET");
        String FAULTID = (String) data.get("FAULTID");

        result.put("RET", RET);
        result.put("FAULTID", FAULTID);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PRO_PM_WORKORDER_SBGZ_CREATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_SBGZ_CREATE(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                           @RequestParam(value = "V_V_PERNAME") String V_V_PERNAME,
                                                           @RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                           HttpServletRequest request,
                                                           HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_PM_WORKORDER_SBGZ_CREATE(V_V_PERCODE, V_V_PERNAME,V_V_GUID);

        List<Map<String, Object>> no4120list = (List) data.get("list");

        result.put("list", no4120list);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/MM_USER_TRENDS_INS", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> MM_USER_TRENDS_INS(@RequestParam(value = "V_V_USERID") String V_V_USERID,
                                               @RequestParam(value = "V_V_ACTIVE") String V_V_ACTIVE,
                                               @RequestParam(value = "V_V_REMARK") String V_V_REMARK,
                                               @RequestParam(value = "V_V_ACT_TYPE") String V_V_ACT_TYPE,
                                               @RequestParam(value = "V_V_IP") String V_V_IP,
                                               HttpServletRequest request,
                                               HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.MM_USER_TRENDS_INS(V_V_USERID, V_V_ACTIVE, V_V_REMARK, V_V_ACT_TYPE, V_V_IP);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/MM_USER_TRENDS_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> MM_USER_TRENDS_SEL(@RequestParam(value = "V_V_USERID") String V_V_USERID,
                                                            HttpServletRequest request,
                                                            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.MM_USER_TRENDS_SEL(V_V_USERID);

        List<Map<String, Object>> list = (List) data.get("list");

        result.put("list", list);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PRO_BASE_NEW_MENU_BYNAME_SEL", method = RequestMethod.POST)
    @ResponseBody
    public List<Map> PRO_BASE_NEW_MENU_BYNAME_SEL(
            @RequestParam(value = "IS_V_ROLECODE") String IS_V_ROLECODE,
            @RequestParam(value = "IS_V_SYSTYPE") String IS_V_SYSTYPE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_HOME_MENU") String V_V_HOME_MENU,
            @RequestParam(value = "V_V_MENUNAME") String V_V_MENUNAME)
            throws SQLException {
        List<Map> result = cService.PRO_BASE_NEW_MENU_BYNAME_SELTree(IS_V_ROLECODE, IS_V_SYSTYPE,V_V_DEPTCODE, V_V_HOME_MENU,V_V_MENUNAME);
        return result;
    }
    @RequestMapping(value = "/MM_USER_TRENDS_BYNAME_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> MM_USER_TRENDS_BYNAME_SEL(@RequestParam(value = "V_V_USERID") String V_V_USERID,
                                                  @RequestParam(value = "V_V_MENUNAME") String V_V_MENUNAME,
                                                  HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.MM_USER_TRENDS_BYNAME_SEL(V_V_USERID,V_V_MENUNAME);

        List<Map<String, Object>> list = (List) data.get("list");

        result.put("list", list);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/MM_USER_TRENDS_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> MM_USER_TRENDS_DEL(@RequestParam(value = "V_I_ID") String V_I_ID,

                                                  HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.MM_USER_TRENDS_DEL(V_I_ID);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PRO_PM_WORKORDER_FAULT_SAVE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_FAULT_SAVE(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                         @RequestParam(value = "V_V_PERNAME") String V_V_PERNAME,
                                                         @RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                         @RequestParam(value = "V_V_ORDERGUID") String V_V_ORDERGUID,
                                                         @RequestParam(value = "V_V_SHORT_TXT") String V_V_SHORT_TXT,
                                                         @RequestParam(value = "V_V_DEPTCODEREPAIR") String V_V_DEPTCODEREPAIR,
                                                         @RequestParam(value = "V_D_START_DATE") String V_D_START_DATE,
                                                         @RequestParam(value = "V_D_FINISH_DATE") String V_D_FINISH_DATE,
                                                         @RequestParam(value = "V_V_WBS") String V_V_WBS,
                                                         @RequestParam(value = "V_V_WBS_TXT") String V_V_WBS_TXT,
                                                         @RequestParam(value = "V_V_TOOL") String V_V_TOOL,
                                                         @RequestParam(value = "V_V_TECHNOLOGY") String V_V_TECHNOLOGY,
                                                         @RequestParam(value = "V_V_SAFE") String V_V_SAFE,
                                                         HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_PM_WORKORDER_FAULT_SAVE(V_V_PERCODE,V_V_PERNAME,V_V_GUID,V_V_ORDERGUID,V_V_SHORT_TXT,
                V_V_DEPTCODEREPAIR,V_D_START_DATE,V_D_FINISH_DATE,V_V_WBS,V_V_WBS_TXT,V_V_TOOL,V_V_TECHNOLOGY,V_V_SAFE);

        String list =  data.get("list").toString();

        result.put("list", list);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_14_FAULT_ITEM_DATA_UP", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_14_FAULT_ITEM_DATA_UP(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                        @RequestParam(value = "V_V_IP") String V_V_IP,
                                                        @RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                  HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_14_FAULT_ITEM_DATA_UP(V_V_PERCODE,V_V_IP,V_V_GUID);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/MM_USER_TRENDS_TABLE_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> MM_USER_TRENDS_TABLE_SEL(@RequestParam(value = "V_V_USERID") String V_V_USERID,
                                                  HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.MM_USER_TRENDS_TABLE_SEL(V_V_USERID);

        List<Map<String, Object>> list = (List) data.get("list");

        result.put("list", list);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PRO_FAULT_ITEM_DATA_GET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_FAULT_ITEM_DATA_GET(@RequestParam(value = "V_V_FAULT_GUID") String V_V_FAULT_GUID,
                                                  HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_FAULT_ITEM_DATA_GET(V_V_FAULT_GUID);

        List<Map<String, Object>> list = (List) data.get("list");

        result.put("list", list);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_14_FAULT_ITEM_DATA_INSTANCEID_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_14_FAULT_ITEM_DATA_INSTANCEID_SET(
                                                        @RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                        @RequestParam(value = "V_V_INSTANCEID") String V_V_INSTANCEID,
                                                        HttpServletRequest request,
                                                        HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_14_FAULT_ITEM_DATA_INSTANCEID_SET(V_V_GUID,V_V_INSTANCEID);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PM_14_FAULT_ITEM_DATA_GET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_14_FAULT_ITEM_DATA_GET(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                       HttpServletRequest request,
                                                       HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_14_FAULT_ITEM_DATA_GET(V_V_GUID);

        List<Map<String, Object>> list = (List) data.get("list");

        result.put("RET", list);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_14_FAULT_ITEM_DATA_STATE_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_14_FAULT_ITEM_DATA_STATE_UPDATE(
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_STATE") String V_V_STATE,
            @RequestParam(value = "V_DEFECT_STATE") String V_DEFECT_STATE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_14_FAULT_ITEM_DATA_STATE_UPDATE(V_V_PERCODE,V_V_GUID,V_V_STATE,V_DEFECT_STATE);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PM_1405_FAULT_ITEM_DATA_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_1405_FAULT_ITEM_DATA_UPDATE(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                           @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                           @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                           @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                           @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                           @RequestParam(value = "V_V_EQUCHILD_CODE") String V_V_EQUCHILD_CODE,
                                                           @RequestParam(value = "V_V_FAULT_GUID") String V_V_FAULT_GUID,
                                                           @RequestParam(value = "V_V_FAULT_TYPE") String V_V_FAULT_TYPE,
                                                           @RequestParam(value = "V_V_FAULT_YY") String V_V_FAULT_YY,
                                                           @RequestParam(value = "V_V_FINDTIME") String V_V_FINDTIME,
                                                           @RequestParam(value = "V_V_FAULT_XX") String V_V_FAULT_XX,
                                                           @RequestParam(value = "V_V_JJBF") String V_V_JJBF,
                                                           @RequestParam(value = "V_V_FAULT_LEVEL") String V_V_FAULT_LEVEL,
                                                           @RequestParam(value = "V_V_FILE_GUID") String V_V_FILE_GUID,
                                                           @RequestParam(value = "V_V_INTIME") String V_V_INTIME,
                                                           @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                           @RequestParam(value = "V_V_IP") String V_V_IP,
                                                           @RequestParam(value = "V_V_FAULT_NAME") String V_V_FAULT_NAME,
                                                           @RequestParam(value = "V_V_FAULT_PART") String V_V_FAULT_PART,
                                                           @RequestParam(value = "V_V_FAULT_CLGC") String V_V_FAULT_CLGC,
                                                           @RequestParam(value = "V_V_FAULT_SS") String V_V_FAULT_SS,
                                                           @RequestParam(value = "V_V_FAULT_XZ") String V_V_FAULT_XZ,
                                                           @RequestParam(value = "V_V_FAULT_ZGCS") String V_V_FAULT_ZGCS,
                                                           @RequestParam(value = "V_V_FZR_CL") String V_V_FZR_CL,
                                                              @RequestParam(value = "V_V_ENDTIME") String V_V_ENDTIME,
                                                              @RequestParam(value = "V_V_REPORTER") String V_V_REPORTER,
                                                              @RequestParam(value = "V_V_FZR") String V_V_FZR,
                                                              @RequestParam(value = "V_V_STOPTIME") String V_V_STOPTIME,
                                                              @RequestParam(value = "V_V_REPAIRTIME") String V_V_REPAIRTIME,
                                                              @RequestParam(value = "V_V_REPAIRCOST") String V_V_REPAIRCOST,
                                                              @RequestParam(value = "V_V_REPROTTIME") String V_V_REPROTTIME,
                                                              @RequestParam(value = "V_V_FAULT_PASS") String V_V_FAULT_PASS,
                                                              @RequestParam(value = "V_V_CAUSEANALYSIS") String V_V_CAUSEANALYSIS,
                                                              @RequestParam(value = "V_V_REPAIR_PLAN") String V_V_REPAIR_PLAN,
                                                              @RequestParam(value = "V_V_ASSENT_CODE") String V_V_ASSENT_CODE,
                                                           HttpServletRequest request,
                                                           HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_1405_FAULT_ITEM_DATA_UPDATE(V_V_GUID, V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE, V_V_EQUCODE,
                V_V_EQUCHILD_CODE, V_V_FAULT_GUID, V_V_FAULT_TYPE, V_V_FAULT_YY, V_V_FINDTIME,V_V_FAULT_XX,V_V_JJBF, V_V_FAULT_LEVEL,
                V_V_FILE_GUID,V_V_INTIME,V_V_PERCODE,V_V_IP,V_V_FAULT_NAME,V_V_FAULT_PART,V_V_FAULT_CLGC,V_V_FAULT_SS,V_V_FAULT_XZ,V_V_FAULT_ZGCS,V_V_FZR_CL,
                V_V_ENDTIME,V_V_REPORTER,V_V_FZR,V_V_STOPTIME,V_V_REPAIRTIME,V_V_REPAIRCOST,V_V_REPROTTIME,V_V_FAULT_PASS,V_V_CAUSEANALYSIS,V_V_REPAIR_PLAN,V_V_ASSENT_CODE);

        String RET = (String) data.get("RET");
        result.put("RET", RET);
        result.put("success", true);
        return result;
    }

//   @RequestMapping(value = "/PRO_BASE_FILE_ADD", method = RequestMethod.POST)
   @RequestMapping(value = "/PRO_BASE_FILE_ADD")
   @ResponseBody
//    public Map<String, Object> PRO_BASE_FILE_ADD(@RequestParam(value = "V_V_GUID") String V_V_GUID,
    public ResponseEntity<String> PRO_BASE_FILE_ADD(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                   @RequestParam(value = "V_V_FILENAME") String V_V_FILENAME,
                                                   @RequestParam(value = "V_V_FILEBLOB") MultipartFile V_V_FILEBLOB,
                                                   @RequestParam(value = "V_V_FILETYPECODE") String V_V_FILETYPECODE,
                                                   @RequestParam(value = "V_V_PLANT") String V_V_PLANT,
                                                   @RequestParam(value = "V_V_DEPT") String V_V_DEPT,
                                                   @RequestParam(value = "V_V_PERSON") String V_V_PERSON,
                                                   @RequestParam(value = "V_V_REMARK") String V_V_REMARK,
                                                   HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
       HttpHeaders responseHeaders = new HttpHeaders();

       responseHeaders.setContentType(MediaType.TEXT_HTML);
       Map<String, Object> result = cService.PRO_BASE_FILE_ADD(V_V_GUID, V_V_FILENAME, V_V_FILEBLOB.getInputStream(), V_V_FILETYPECODE, V_V_PLANT, V_V_DEPT, V_V_PERSON, V_V_REMARK);

//        String pm = (String) result.get("RET");

//        result.put("RET", pm);
//        result.put("success", true);
       String json= "{\"success\":true,\"message\":\""+result+"\"}";
//        return result;
       return new ResponseEntity<String>(json, responseHeaders, HttpStatus.OK);

    }
    //   @RequestMapping(value = "/PRO_BASE_FILE_ADD", method = RequestMethod.POST)
    @RequestMapping(value = "/PRO_BASE_FILE_ADD2")
    @ResponseBody
//    public Map<String, Object> PRO_BASE_FILE_ADD(@RequestParam(value = "V_V_GUID") String V_V_GUID,
    public ResponseEntity<String> PRO_BASE_FILE_ADD2(@RequestParam(value = "V_V_GUID2") String V_V_GUID,
                                                    @RequestParam(value = "V_V_FILENAME2") String V_V_FILENAME,
                                                    @RequestParam(value = "V_V_FILEBLOB2") MultipartFile V_V_FILEBLOB,
                                                    @RequestParam(value = "V_V_FILETYPECODE2") String V_V_FILETYPECODE,
                                                    @RequestParam(value = "V_V_PLANT2") String V_V_PLANT,
                                                    @RequestParam(value = "V_V_DEPT2") String V_V_DEPT,
                                                    @RequestParam(value = "V_V_PERSON2") String V_V_PERSON,
                                                    @RequestParam(value = "V_V_REMARK2") String V_V_REMARK,
                                                    HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        HttpHeaders responseHeaders = new HttpHeaders();

        responseHeaders.setContentType(MediaType.TEXT_HTML);
        Map<String, Object> result = cService.PRO_BASE_FILE_ADD(V_V_GUID, V_V_FILENAME, V_V_FILEBLOB.getInputStream(), V_V_FILETYPECODE, V_V_PLANT, V_V_DEPT, V_V_PERSON, V_V_REMARK);

//        String pm = (String) result.get("RET");

//        result.put("RET", pm);
//        result.put("success", true);
        String json= "{\"success\":true,\"message\":\""+result+"\"}";
//        return result;
        return new ResponseEntity<String>(json, responseHeaders, HttpStatus.OK);

    }
    @RequestMapping(value = "/PRO_BASE_NEW_MENU_SELNEW", method = RequestMethod.POST)
    @ResponseBody
    public List<Map> PRO_BASE_NEW_MENU_SELNEW(
            @RequestParam(value = "IS_V_ROLECODE") String IS_V_ROLECODE,
            @RequestParam(value = "IS_V_PID") String IS_V_PID)
            throws SQLException {
        List<Map> result = cService.PRO_BASE_NEW_MENU_SELNEW(IS_V_ROLECODE, IS_V_PID);
        return result;
    }

    @RequestMapping(value = "/PM_WORKORDER_TO_FAULT_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_WORKORDER_TO_FAULT_SEL(@RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                         @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                         @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
                                                         @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
                                                         @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
                                                        HttpServletRequest request,
                                                        HttpServletResponse response) throws Exception {
//        Map<String, Object> result = new HashMap<String, Object>();

        Map result = cService.PM_WORKORDER_TO_FAULT_SEL(V_V_ORGCODE,V_V_DEPTCODE,V_V_YEAR,V_V_PAGE,V_V_PAGESIZE);

//        List<Map<String, Object>> list = (List) data.get("list");

//        result.put("list", list);
//        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PM_WORKORDER_FAULT_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_WORKORDER_FAULT_SET(
            @RequestParam(value = "V_V_FAULT_GUID") String V_V_FAULT_GUID,
            @RequestParam(value = "V_V_WORKORDER_ORDERID") String V_V_WORKORDER_ORDERID,
            @RequestParam(value = "V_V_INPER_CODE") String V_V_INPER_CODE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_WORKORDER_FAULT_SET(V_V_FAULT_GUID,V_V_WORKORDER_ORDERID,V_V_INPER_CODE);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PRO_PM_07_DEPTEQU_PER_DROP", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_07_DEPTEQU_PER_DROP(@RequestParam(value = "V_V_PERSONCODE") String V_V_PERSONCODE,
                                @RequestParam(value = "V_V_DEPTCODENEXT") String V_V_DEPTCODENEXT,
                                @RequestParam(value = "V_V_EQUTYPECODE") String V_V_EQUTYPECODE) throws Exception {
        Map map = cService.PRO_PM_07_DEPTEQU_PER_DROP(V_V_PERSONCODE, V_V_DEPTCODENEXT, V_V_EQUTYPECODE);
        return map;
    }

    @RequestMapping(value = "/PRO_SAP_EQU_VIEW", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_SAP_EQU_VIEW(@RequestParam(value = "V_V_PERSONCODE") String V_V_PERSONCODE,
                                @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                @RequestParam(value = "V_V_DEPTNEXTCODE") String V_V_DEPTNEXTCODE,
                                @RequestParam(value = "V_V_EQUTYPECODE") String V_V_EQUTYPECODE,
                                @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                HttpServletRequest request,
                                HttpServletResponse response) throws Exception {
        Map map = cService.PRO_SAP_EQU_VIEW(V_V_PERSONCODE, V_V_DEPTCODE,V_V_DEPTNEXTCODE,V_V_EQUTYPECODE,V_V_EQUCODE);
        return map;
    }

    @RequestMapping(value = "/PRO_FAULT_EQUIP_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_FAULT_EQUIP_SET(
            @RequestParam(value = "V_V_FAULTCODE") String V_V_FAULTCODE,
            @RequestParam(value = "V_V_EQUTYPECODE") String V_V_EQUTYPECODE,
            @RequestParam(value = "V_V_EQUUPCODE") String V_V_EQUUPCODE,
            @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
            @RequestParam(value = "V_V_CREATER") String V_V_CREATER,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_FAULT_EQUIP_SET(V_V_FAULTCODE,V_V_EQUTYPECODE,V_V_EQUUPCODE,V_V_EQUCODE,V_V_CREATER);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        return result;
    }
    @RequestMapping(value = "/PM_14_FAULT_ITEM_DATA_SEL_NEW", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_14_FAULT_ITEM_DATA_SEL_NEW(@RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                         @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                         @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                         @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                         @RequestParam(value = "V_V_EQUCHILD_CODE") String V_V_EQUCHILD_CODE,
                                                         @RequestParam(value = "V_V_FAULT_TYPE") String V_V_FAULT_TYPE,
                                                         @RequestParam(value = "V_V_FAULT_YY") String V_V_FAULT_YY,
                                                         @RequestParam(value = "V_V_FINDTIME_B") String V_V_FINDTIME_B,
                                                         @RequestParam(value = "V_V_FINDTIME_E") String V_V_FINDTIME_E,
                                                         HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_14_FAULT_ITEM_DATA_SEL_NEW(V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE,
                V_V_EQUCODE, V_V_EQUCHILD_CODE, V_V_FAULT_TYPE, V_V_FAULT_YY, V_V_FINDTIME_B, V_V_FINDTIME_E);
        List<Map<String, Object>> pm_1407list = (List) data.get("list");
        result.put("list", pm_1407list);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PRO_FAULT_EQUIP_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_FAULT_EQUIP_SEL(@RequestParam(value = "V_V_FAULTCODE") String V_V_FAULTCODE,
                                HttpServletRequest request,
                                HttpServletResponse response) throws Exception {
        Map map = cService.PRO_FAULT_EQUIP_SEL(V_V_FAULTCODE);
        return map;
    }

    @RequestMapping(value = "/PRO_FAULT_EQUIP_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_FAULT_EQUIP_DEL(@RequestParam(value = "V_V_FAULTCODE") String V_V_FAULTCODE,
                                                   @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                   HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_FAULT_EQUIP_DEL(V_V_FAULTCODE,V_V_EQUCODE);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PRO_PM_WORKORDER_SBGZ_CREATE_NEW", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_SBGZ_CREATE_NEW(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                            @RequestParam(value = "V_V_PERNAME") String V_V_PERNAME,
                                                            @RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                            @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                            HttpServletRequest request,
                                                            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_PM_WORKORDER_SBGZ_CREATE_NEW(V_V_PERCODE, V_V_PERNAME,V_V_GUID,V_V_EQUCODE);

        List<Map<String, Object>> list = (List) data.get("list");

        result.put("list", list);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PRO_FAULT_EQUIP_OVER", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_FAULT_EQUIP_OVER(@RequestParam(value = "V_V_FAULTCODE") String V_V_FAULTCODE,
                                                   HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_FAULT_EQUIP_OVER(V_V_FAULTCODE);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        return result;
    }

    @RequestMapping(value = "/PRO_FAULT_EQUIP_CANCEL_OVER", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_FAULT_EQUIP_CANCEL_OVER(@RequestParam(value = "V_V_FAULTCODE") String V_V_FAULTCODE,
                                                    HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_FAULT_EQUIP_CANCEL_OVER(V_V_FAULTCODE);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        return result;
    }

    @RequestMapping(value = "/PM_14_FAULT_ITEM_DATA_OVER_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_14_FAULT_ITEM_DATA_OVER_SEL(@RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                             @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                             @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                             @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                             @RequestParam(value = "V_V_EQUCHILD_CODE") String V_V_EQUCHILD_CODE,
                                                             @RequestParam(value = "V_V_FAULT_TYPE") String V_V_FAULT_TYPE,
                                                             @RequestParam(value = "V_V_FAULT_YY") String V_V_FAULT_YY,
                                                             @RequestParam(value = "V_V_FINDTIME_B") String V_V_FINDTIME_B,
                                                             @RequestParam(value = "V_V_FINDTIME_E") String V_V_FINDTIME_E,
                                                             HttpServletRequest request,
                                                             HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_14_FAULT_ITEM_DATA_OVER_SEL(V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE,
                V_V_EQUCODE, V_V_EQUCHILD_CODE, V_V_FAULT_TYPE, V_V_FAULT_YY, V_V_FINDTIME_B, V_V_FINDTIME_E);
        List<Map<String, Object>> list = (List) data.get("list");
        result.put("list", list);
//        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_WORKORDER_FAULT_OVER_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_WORKORDER_FAULT_OVER_SEL(@RequestParam(value = "V_V_FAULTCODE") String V_V_FAULTCODE,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
        Map map = cService.PM_WORKORDER_FAULT_OVER_SEL(V_V_FAULTCODE);
        return map;
    }

    @RequestMapping(value = "/PRO_PM_WORKORDER_F_SAVE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_F_SAVE(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                       @RequestParam(value = "V_V_PERNAME") String V_V_PERNAME,
                                                       @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                       @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                       @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                       @RequestParam(value = "V_V_WORKORDER_TYPE") String V_V_WORKORDER_TYPE,
                                                       @RequestParam(value = "V_V_ORDERGUID") String V_V_ORDERGUID,
                                                       @RequestParam(value = "V_V_SHORT_TXT") String V_V_SHORT_TXT,
                                                       @RequestParam(value = "V_V_DEPTCODEREPAIR") String V_V_DEPTCODEREPAIR,
                                                       @RequestParam(value = "V_D_START_DATE") String V_D_START_DATE,
                                                       @RequestParam(value = "V_D_FINISH_DATE") String V_D_FINISH_DATE,
                                                       @RequestParam(value = "V_V_WBS") String V_V_WBS,
                                                       @RequestParam(value = "V_V_WBS_TXT") String V_V_WBS_TXT,
                                                    HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {

        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_PM_WORKORDER_F_SAVE(V_V_PERCODE,V_V_PERNAME,V_V_EQUCODE,V_V_ORGCODE,V_V_DEPTCODE,
                V_V_WORKORDER_TYPE,V_V_ORDERGUID,V_V_SHORT_TXT,V_V_DEPTCODEREPAIR,V_D_START_DATE,V_D_FINISH_DATE,V_V_WBS,V_V_WBS_TXT);
        String ss = (String) data.get("RET");
        result.put("RET", ss);
        return result;
    }

    @RequestMapping(value = "/PRO_PM_WORKORDER_SBGZ_CREATE_2", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_SBGZ_CREATE_2(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                            @RequestParam(value = "V_V_PERNAME") String V_V_PERNAME,
                                                            @RequestParam(value = "V_V_ORDER_GUID") String V_V_ORDER_GUID,
                                                            HttpServletRequest request,
                                                            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_PM_WORKORDER_SBGZ_CREATE_2(V_V_PERCODE, V_V_PERNAME,V_V_ORDER_GUID);

        List<Map<String, Object>> list = (List) data.get("list");

        result.put("list", list);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PRO_PM_WORKORDER_ONLY", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_ONLY(@RequestParam(value = "V_D_ENTER_DATE_B") String V_D_ENTER_DATE_B,
                                                             @RequestParam(value = "V_D_ENTER_DATE_E") String V_D_ENTER_DATE_E,
                                                             @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                             @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                             @RequestParam(value = "V_V_DEPTCODEREPARIR") String V_V_DEPTCODEREPARIR,
                                                             @RequestParam(value = "V_V_STATECODE") String V_V_STATECODE,
                                                             @RequestParam(value = "V_EQUTYPE_CODE") String V_EQUTYPE_CODE,
                                                             @RequestParam(value = "V_EQU_CODE") String V_EQU_CODE,
                                                             @RequestParam(value = "V_DJ_PERCODE") String V_DJ_PERCODE,
                                                             @RequestParam(value = "V_V_SHORT_TXT") String V_V_SHORT_TXT,
                                                             @RequestParam(value = "V_V_BJ_TXT") String V_V_BJ_TXT,
                                                             @RequestParam(value = "V_V_ORDER_TYP") String V_V_ORDER_TYP,
                                                             @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
                                                             @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
                                                             HttpServletRequest request,
                                                             HttpServletResponse response) throws Exception {
        Map result = cService.PRO_PM_WORKORDER_ONLY(V_D_ENTER_DATE_B, V_D_ENTER_DATE_E, V_V_ORGCODE, V_V_DEPTCODE,
                V_V_DEPTCODEREPARIR, V_V_STATECODE, V_EQUTYPE_CODE, V_EQU_CODE, V_DJ_PERCODE, V_V_SHORT_TXT, V_V_BJ_TXT,V_V_ORDER_TYP,V_V_PAGE,V_V_PAGESIZE);
        return result;
    }
    @RequestMapping(value = "/PM_GET_WORKORDER_BY_FAULT", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_GET_WORKORDER_BY_FAULT(@RequestParam(value = "V_GUID") String V_GUID,
                                                     HttpServletRequest request,
                                                     HttpServletResponse response) throws Exception {
        Map result = cService.PM_GET_WORKORDER_BY_FAULT(V_GUID);
        return result;
    }
    /*事故EXCEL*/
    @RequestMapping(value = "/PM_14_EXCEL", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void PM_14_EXCEL(@RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                            @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                            @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                            @RequestParam(value = "V_V_EQUCHILD_CODE") String V_V_EQUCHILD_CODE,
                            @RequestParam(value = "V_V_FAULT_TYPE") String V_V_FAULT_TYPE,
                            @RequestParam(value = "V_V_FAULT_YY") String V_V_FAULT_YY,
                            @RequestParam(value = "V_V_FINDTIME_B") String V_V_FINDTIME_B,
                            @RequestParam(value = "V_V_FINDTIME_E") String V_V_FINDTIME_E,
                            HttpServletResponse response)
            throws //com.fasterxml.jackson.core.JsonProcessingException,
            NoSuchAlgorithmException, UnsupportedEncodingException, SQLException {

        List list = new ArrayList();

        V_V_FAULT_YY = new String(V_V_FAULT_YY.getBytes("iso-8859-1"), "utf-8");
        Map<String, Object> data = cService.PM_14_FAULT_ITEM_DATA_SEL_NEW(V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE,
                V_V_EQUCODE, V_V_EQUCHILD_CODE, V_V_FAULT_TYPE,V_V_FAULT_YY, V_V_FINDTIME_B, V_V_FINDTIME_E);
        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for(int i=0;i<=1;i++){
            sheet.setColumnWidth(i,3000);
        }
        HSSFRow row = sheet.createRow((int) 0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        HSSFCell cell = row.createCell((short) 0);
        cell.setCellValue("序号");
        cell.setCellStyle(style);

        cell = row.createCell((short) 1);
        cell.setCellValue("事故状态");
        cell.setCellStyle(style);

        cell = row.createCell((short) 2);
        cell.setCellValue("发现时间");
        cell.setCellStyle(style);

        cell = row.createCell((short) 3);
        cell.setCellValue("设备类型");
        cell.setCellStyle(style);

        cell = row.createCell((short) 4);
        cell.setCellValue("设备名称");
        cell.setCellStyle(style);

        cell = row.createCell((short) 5);
        cell.setCellValue("作业区");
        cell.setCellStyle(style);

        cell = row.createCell((short) 6);
        cell.setCellValue("部件");
        cell.setCellStyle(style);

        cell = row.createCell((short) 7);
        cell.setCellValue("故障类型");
        cell.setCellStyle(style);

        cell = row.createCell((short) 8);
        cell.setCellValue("故障原因");
        cell.setCellStyle(style);

        cell = row.createCell((short) 9);
        cell.setCellValue("故障现象");
        cell.setCellStyle(style);

        cell = row.createCell((short) 10);
        cell.setCellValue("故障等级");
        cell.setCellStyle(style);

        cell = row.createCell((short) 11);
        cell.setCellValue("解决办法");
        cell.setCellStyle(style);

        cell = row.createCell((short) 12);
        cell.setCellValue("故障名称");
        cell.setCellStyle(style);

        cell = row.createCell((short) 13);
        cell.setCellValue("故障部位");
        cell.setCellStyle(style);

        cell = row.createCell((short) 14);
        cell.setCellValue("处理过程");
        cell.setCellStyle(style);

        cell = row.createCell((short) 15);
        cell.setCellValue("损失");
        cell.setCellStyle(style);

        cell = row.createCell((short) 16);
        cell.setCellValue("性质");
        cell.setCellStyle(style);

        cell = row.createCell((short) 17);
        cell.setCellValue("整改措施");
        cell.setCellStyle(style);

        cell = row.createCell((short) 18);
        cell.setCellValue("对相关负责人的处理");
        cell.setCellStyle(style);


        if (data.size() > 0) {
            list = (List) data.get("list");


            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 1);
                Map map = (Map) list.get(i);

                row.createCell((short) 0).setCellValue(i+1);

                row.createCell((short) 1).setCellValue(map.get("V_STATENAME") == null ? "" : map.get("V_STATENAME").toString());

                row.createCell((short) 2).setCellValue(map.get("V_FINDTIME") == null ? "" : map.get("V_FINDTIME").toString());

                row.createCell((short) 3).setCellValue(map.get("V_EQUTYPENAME") == null ? "" : map.get("V_EQUTYPENAME").toString());

                row.createCell((short) 4).setCellValue(map.get("V_EQUNAME") == null ? "" : map.get("V_EQUNAME").toString());

                row.createCell((short) 5).setCellValue(map.get("V_DEPTNAME") == null ? "" : map.get("V_DEPTNAME").toString());

                row.createCell((short) 6).setCellValue(map.get("V_EQUCHILD_NAME") == null ? "" : map.get("V_EQUCHILD_NAME").toString());

                row.createCell((short) 7).setCellValue(map.get("V_TYPENAME") == null ? "" : map.get("V_TYPENAME").toString());

                row.createCell((short) 8).setCellValue(map.get("V_FAULT_YY") == null ? "" : map.get("V_FAULT_YY").toString());

                row.createCell((short) 9).setCellValue(map.get("V_FAULT_XX") == null ? "" : map.get("V_FAULT_XX").toString());

                row.createCell((short) 10).setCellValue(map.get("V_FAULT_LEVEL") == null ? "" : map.get("V_FAULT_LEVEL").toString());

                row.createCell((short) 11).setCellValue(map.get("V_JJBF") == null ? "" : map.get("V_JJBF").toString());

                row.createCell((short) 12).setCellValue(map.get("V_FAULT_NAME") == null ? "" : map.get("V_FAULT_NAME").toString());

                row.createCell((short) 13).setCellValue(map.get("V_FAULT_PART") == null ? "" : map.get("V_FAULT_PART").toString());

                row.createCell((short) 14).setCellValue(map.get("V_FAULT_CLGC") == null ? "" : map.get("V_FAULT_CLGC").toString());

                row.createCell((short) 15).setCellValue(map.get("V_FAULT_SS") == null ? "" : map.get("V_FAULT_SS").toString());

                row.createCell((short) 16).setCellValue(map.get("V_FAULT_XZ") == null ? "" : map.get("V_FAULT_XZ").toString());

                row.createCell((short) 17).setCellValue(map.get("V_FAULT_ZGCS") == null ? "" : map.get("V_FAULT_ZGCS").toString());

                row.createCell((short) 18).setCellValue(map.get("V_FZR_CL") == null ? "" : map.get("V_FZR_CL").toString());


            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                String fileName = new String("设备故障查询表.xls".getBytes("UTF-8"), "ISO-8859-1");// 设置下载时客户端Excel的名称
                response.setHeader("Content-Disposition", "attachment; filename=" + fileName);
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @RequestMapping(value = "/PM_FAULT_PLAN_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_FAULT_PLAN_SEL(@RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                             @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,

                                                             HttpServletRequest request,
                                                             HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_FAULT_PLAN_SEL(V_V_ORGCODE, V_V_DEPTCODE);
        List<Map<String, Object>> pm_1407list = (List) data.get("list");
        result.put("list", pm_1407list);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PM_FAULT_PLAN_GET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_FAULT_PLAN_GET(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                         HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_FAULT_PLAN_GET(V_V_GUID);

        List<Map<String, Object>> list = (List) data.get("list");

        result.put("RET", list);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PM_FAULT_PLAN_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_FAULT_PLAN_UPDATE(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                    @RequestParam(value = "V_V_ORGANIZATIONAL") String V_V_ORGANIZATIONAL,
                                                    @RequestParam(value = "V_V_PROGRAM") String V_V_PROGRAM,
                                                    @RequestParam(value = "V_V_WORK_TYPE") String V_V_WORK_TYPE,
                                                    @RequestParam(value = "V_V_TOOLS") String V_V_TOOLS,
                                                    @RequestParam(value = "V_V_MATERIAL") String V_V_MATERIAL,
                                                    @RequestParam(value = "V_V_PLAN") String V_V_PLAN,
                                                    @RequestParam(value = "V_V_PREVENT") String V_V_PREVENT,
                                                    HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        HashMap data = cService.PM_FAULT_PLAN_UPDATE(V_V_GUID,V_V_ORGANIZATIONAL, V_V_PROGRAM, V_V_WORK_TYPE,V_V_TOOLS, V_V_MATERIAL,V_V_PLAN, V_V_PREVENT);
        String RET = (String) data.get("RET");
        result.put("RET", RET);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_FAULT_PLAN_STATE_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_FAULT_PLAN_STATE_UPDATE(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                                  @RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                                  @RequestParam(value = "V_V_STAUTS") String V_V_STAUTS,
                                                                  HttpServletRequest request,
                                                                  HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_FAULT_PLAN_STATE_UPDATE(V_V_PERCODE,V_V_GUID,V_V_STAUTS);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_FAULT_PLAN_UP", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_FAULT_PLAN_UP(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                        @RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                        HttpServletRequest request,
                                                        HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_FAULT_PLAN_UP(V_V_PERCODE,V_V_GUID);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PM_FAULT_PLAN_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_FAULT_PLAN_SET(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                HttpServletRequest request,
                                                HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_FAULT_PLAN_SET(V_V_GUID);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PM_BUG_DATA_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_DATA_SEL(@RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                             @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                             @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                             @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                             @RequestParam(value = "V_V_EQUCHILD_CODE") String V_V_EQUCHILD_CODE,
                                                             @RequestParam(value = "V_V_FAULT_TYPE") String V_V_FAULT_TYPE,
                                                             @RequestParam(value = "V_V_FAULT_YY") String V_V_FAULT_YY,
                                                             @RequestParam(value = "V_V_FINDTIME_B") String V_V_FINDTIME_B,
                                                             @RequestParam(value = "V_V_FINDTIME_E") String V_V_FINDTIME_E,
                                                             HttpServletRequest request,
                                                             HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_DATA_SEL(V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE,
                V_V_EQUCODE, V_V_EQUCHILD_CODE, V_V_FAULT_TYPE, V_V_FAULT_YY, V_V_FINDTIME_B, V_V_FINDTIME_E);
        List<Map<String, Object>> pm_1407list = (List) data.get("list");
        result.put("list", pm_1407list);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_BUG_TYPE_ITEM_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_TYPE_ITEM_SEL(
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_TYPE_ITEM_SEL();

        List<Map<String, Object>> pm_06list = (List) data.get("list");

        result.put("list", pm_06list);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PM_BUG_DATA_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_DATA_SET(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                               @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                               @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                               @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                               @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                               @RequestParam(value = "V_V_EQUCHILD_CODE") String V_V_EQUCHILD_CODE,
                                               @RequestParam(value = "V_V_FAULT_GUID") String V_V_FAULT_GUID,
                                               @RequestParam(value = "V_V_FAULT_TYPE") String V_V_FAULT_TYPE,
                                               @RequestParam(value = "V_V_FAULT_YY") String V_V_FAULT_YY,
                                               @RequestParam(value = "V_V_FINDTIME") String V_V_FINDTIME,
                                               @RequestParam(value = "V_V_FAULT_XX") String V_V_FAULT_XX,
                                               @RequestParam(value = "V_V_JJBF") String V_V_JJBF,
                                               @RequestParam(value = "V_V_FAULT_LEVEL") String V_V_FAULT_LEVEL,
                                               @RequestParam(value = "V_V_FILE_GUID") String V_V_FILE_GUID,
                                               @RequestParam(value = "V_V_INTIME") String V_V_INTIME,
                                               @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                               @RequestParam(value = "V_V_IP") String V_V_IP,
                                               @RequestParam(value = "V_V_FAULT_NAME") String V_V_FAULT_NAME,
                                               @RequestParam(value = "V_V_FAULT_PART") String V_V_FAULT_PART,
                                               @RequestParam(value = "V_V_FAULT_CLGC") String V_V_FAULT_CLGC,
                                               @RequestParam(value = "V_V_FAULT_SS") String V_V_FAULT_SS,
                                               @RequestParam(value = "V_V_FAULT_XZ") String V_V_FAULT_XZ,
                                               @RequestParam(value = "V_V_FAULT_ZGCS") String V_V_FAULT_ZGCS,
                                               @RequestParam(value = "V_V_FZR_CL") String V_V_FZR_CL,
                                               @RequestParam(value = "V_V_ENDTIME") String V_V_ENDTIME,
                                               @RequestParam(value = "V_V_REPORTER") String V_V_REPORTER,
                                               @RequestParam(value = "V_V_FZR") String V_V_FZR,
                                               @RequestParam(value = "V_V_STOPTIME") String V_V_STOPTIME,
                                               @RequestParam(value = "V_V_REPAIRTIME") String V_V_REPAIRTIME,
                                               @RequestParam(value = "V_V_REPAIRCOST") String V_V_REPAIRCOST,
                                               @RequestParam(value = "V_V_REPROTTIME") String V_V_REPROTTIME,
                                               @RequestParam(value = "V_V_FAULT_PASS") String V_V_FAULT_PASS,
                                               @RequestParam(value = "V_V_CAUSEANALYSIS") String V_V_CAUSEANALYSIS,
                                               @RequestParam(value = "V_V_REPAIR_PLAN") String V_V_REPAIR_PLAN,
                                               @RequestParam(value = "V_V_ASSENT_CODE") String V_V_ASSENT_CODE,
                                               HttpServletRequest request,
                                               HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_DATA_SET(V_V_GUID, V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE, V_V_EQUCODE,
                V_V_EQUCHILD_CODE, V_V_FAULT_GUID, V_V_FAULT_TYPE, V_V_FAULT_YY, V_V_FINDTIME,V_V_FAULT_XX,V_V_JJBF, V_V_FAULT_LEVEL,
                V_V_FILE_GUID,V_V_INTIME,V_V_PERCODE,V_V_IP,V_V_FAULT_NAME,V_V_FAULT_PART,V_V_FAULT_CLGC,V_V_FAULT_SS,
                V_V_FAULT_XZ,V_V_FAULT_ZGCS,V_V_FZR_CL,
                V_V_ENDTIME,V_V_REPORTER,V_V_FZR,V_V_STOPTIME,V_V_REPAIRTIME,V_V_REPAIRCOST,V_V_REPROTTIME,V_V_FAULT_PASS,
                V_V_CAUSEANALYSIS,V_V_REPAIR_PLAN,V_V_ASSENT_CODE);

        String RET = (String) data.get("RET");
        String FAULTID = (String) data.get("FAULTID");

        result.put("RET", RET);
        result.put("FAULTID", FAULTID);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PM_BUG_EQUIP_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_EQUIP_SET(
            @RequestParam(value = "V_V_FAULTCODE") String V_V_FAULTCODE,
            @RequestParam(value = "V_V_EQUTYPECODE") String V_V_EQUTYPECODE,
            @RequestParam(value = "V_V_EQUUPCODE") String V_V_EQUUPCODE,
            @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
            @RequestParam(value = "V_V_CREATER") String V_V_CREATER,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_EQUIP_SET(V_V_FAULTCODE,V_V_EQUTYPECODE,V_V_EQUUPCODE,V_V_EQUCODE,V_V_CREATER);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        return result;
    }

    @RequestMapping(value = "/PRO_BASE_BUG_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_BASE_BUG_SEL(HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_BASE_BUG_SEL();
        List<Map<String, Object>> list = (List) data.get("list");
        result.put("list", list);
//        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PRO_BUG_EQUIP_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_BUG_EQUIP_SEL(@RequestParam(value = "V_V_FAULTCODE") String V_V_FAULTCODE,
                                   HttpServletRequest request,
                                   HttpServletResponse response) throws Exception {
        Map map = cService.PRO_BUG_EQUIP_SEL(V_V_FAULTCODE);
        return map;
    }
    @RequestMapping(value = "/PM_BUG_ITEM_DATA_GET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_ITEM_DATA_GET(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                         HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_ITEM_DATA_GET(V_V_GUID);

        List<Map<String, Object>> list = (List) data.get("list");

        result.put("RET", list);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PRO_BUG_EQUIP_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_BUG_EQUIP_DEL(@RequestParam(value = "V_V_FAULTCODE") String V_V_FAULTCODE,
                                                   @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                   HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_BUG_EQUIP_DEL(V_V_FAULTCODE,V_V_EQUCODE);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PM_BUG_DATA_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_DATA_DEL(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                         @RequestParam(value = "V_V_IP") String V_V_IP,
                                                         @RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                         HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();


        HashMap data = cService.PM_BUG_DATA_DEL(V_V_PERCODE, V_V_IP, V_V_GUID);

        String pm_06 = (String) data.get("RET");

        result.put("RET", pm_06);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PRO_BUG_EQUIP_OVER", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_BUG_EQUIP_OVER(@RequestParam(value = "V_V_FAULTCODE") String V_V_FAULTCODE,
                                                    HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_BUG_EQUIP_OVER(V_V_FAULTCODE);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        return result;
    }
    @RequestMapping(value = "/PRO_BUG_EQUIP_CANCEL_OVER", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_BUG_EQUIP_CANCEL_OVER(@RequestParam(value = "V_V_FAULTCODE") String V_V_FAULTCODE,
                                                           HttpServletRequest request,
                                                           HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_BUG_EQUIP_CANCEL_OVER(V_V_FAULTCODE);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        return result;
    }
    @RequestMapping(value = "/PRO_PM_WORKORDER_GZ_CREATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_GZ_CREATE(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                                @RequestParam(value = "V_V_PERNAME") String V_V_PERNAME,
                                                                @RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                                @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                                HttpServletRequest request,
                                                                HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_PM_WORKORDER_GZ_CREATE(V_V_PERCODE, V_V_PERNAME,V_V_GUID,V_V_EQUCODE);

        List<Map<String, Object>> list = (List) data.get("list");

        result.put("list", list);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PRO_PM_WORKORDER_BUG_SAVE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_BUG_SAVE(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                           @RequestParam(value = "V_V_PERNAME") String V_V_PERNAME,
                                                           @RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                           @RequestParam(value = "V_V_ORDERGUID") String V_V_ORDERGUID,
                                                           @RequestParam(value = "V_V_SHORT_TXT") String V_V_SHORT_TXT,
                                                           @RequestParam(value = "V_V_DEPTCODEREPAIR") String V_V_DEPTCODEREPAIR,
                                                           @RequestParam(value = "V_D_START_DATE") String V_D_START_DATE,
                                                           @RequestParam(value = "V_D_FINISH_DATE") String V_D_FINISH_DATE,
                                                           @RequestParam(value = "V_V_WBS") String V_V_WBS,
                                                           @RequestParam(value = "V_V_WBS_TXT") String V_V_WBS_TXT,
                                                           @RequestParam(value = "V_V_TOOL") String V_V_TOOL,
                                                           @RequestParam(value = "V_V_TECHNOLOGY") String V_V_TECHNOLOGY,
                                                           @RequestParam(value = "V_V_SAFE") String V_V_SAFE,
                                                           HttpServletRequest request,
                                                           HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_PM_WORKORDER_BUG_SAVE(V_V_PERCODE,V_V_PERNAME,V_V_GUID,V_V_ORDERGUID,V_V_SHORT_TXT,
                V_V_DEPTCODEREPAIR,V_D_START_DATE,V_D_FINISH_DATE,V_V_WBS,V_V_WBS_TXT,V_V_TOOL,V_V_TECHNOLOGY,V_V_SAFE);

        String list =  data.get("list").toString();

        result.put("list", list);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PRO_PM_WORKORDER_GZ_DL_CREATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_GZ_DL_CREATE(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                              @RequestParam(value = "V_V_PERNAME") String V_V_PERNAME,
                                                              @RequestParam(value = "V_V_ORDER_GUID") String V_V_ORDER_GUID,
                                                              HttpServletRequest request,
                                                              HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_PM_WORKORDER_GZ_DL_CREATE(V_V_PERCODE, V_V_PERNAME,V_V_ORDER_GUID);

        List<Map<String, Object>> list = (List) data.get("list");

        result.put("list", list);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PRO_PM_WORKORDER_BUG_DL_SAVE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_BUG_DL_SAVE(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                       @RequestParam(value = "V_V_PERNAME") String V_V_PERNAME,
                                                       @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                       @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                       @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                       @RequestParam(value = "V_V_WORKORDER_TYPE") String V_V_WORKORDER_TYPE,
                                                       @RequestParam(value = "V_V_ORDERGUID") String V_V_ORDERGUID,
                                                       @RequestParam(value = "V_V_SHORT_TXT") String V_V_SHORT_TXT,
                                                       @RequestParam(value = "V_V_DEPTCODEREPAIR") String V_V_DEPTCODEREPAIR,
                                                       @RequestParam(value = "V_D_START_DATE") String V_D_START_DATE,
                                                       @RequestParam(value = "V_D_FINISH_DATE") String V_D_FINISH_DATE,
                                                       @RequestParam(value = "V_V_WBS") String V_V_WBS,
                                                       @RequestParam(value = "V_V_WBS_TXT") String V_V_WBS_TXT,
                                                       HttpServletRequest request,
                                                       HttpServletResponse response) throws Exception {

        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_PM_WORKORDER_BUG_DL_SAVE(V_V_PERCODE,V_V_PERNAME,V_V_EQUCODE,V_V_ORGCODE,V_V_DEPTCODE,
                V_V_WORKORDER_TYPE,V_V_ORDERGUID,V_V_SHORT_TXT,V_V_DEPTCODEREPAIR,V_D_START_DATE,V_D_FINISH_DATE,V_V_WBS,V_V_WBS_TXT);
        String ss = (String) data.get("RET");
        result.put("RET", ss);
        return result;
    }

    @RequestMapping(value = "/PM_BUG_DATA_OVER_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_DATA_OVER_SEL(@RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                  @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                  @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                  @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                  @RequestParam(value = "V_V_EQUCHILD_CODE") String V_V_EQUCHILD_CODE,
                                                  @RequestParam(value = "V_V_FAULT_TYPE") String V_V_FAULT_TYPE,
                                                  @RequestParam(value = "V_V_FAULT_YY") String V_V_FAULT_YY,
                                                  @RequestParam(value = "V_V_FINDTIME_B") String V_V_FINDTIME_B,
                                                  @RequestParam(value = "V_V_FINDTIME_E") String V_V_FINDTIME_E,
                                                  HttpServletRequest request,
                                                  HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_DATA_OVER_SEL(V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE,
                V_V_EQUCODE, V_V_EQUCHILD_CODE, V_V_FAULT_TYPE, V_V_FAULT_YY, V_V_FINDTIME_B, V_V_FINDTIME_E);
        List<Map<String, Object>> list = (List) data.get("list");
        result.put("list", list);
//        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_BUG_DATA_UP", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_DATA_UP(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                            @RequestParam(value = "V_V_IP") String V_V_IP,
                                            @RequestParam(value = "V_V_GUID") String V_V_GUID,
                                            HttpServletRequest request,
                                            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_DATA_UP(V_V_PERCODE,V_V_IP,V_V_GUID);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_BUG_DATA_INSTANCEID_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_DATA_INSTANCEID_SET(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                        @RequestParam(value = "V_V_INSTANCEID") String V_V_INSTANCEID,
                                                        HttpServletRequest request,
                                                        HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        HashMap data = cService.PM_BUG_DATA_INSTANCEID_SET(V_V_GUID,V_V_INSTANCEID);
        String ss = (String) data.get("RET");
        result.put("RET", ss);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PRO_PM_WORKORDER_BUG_OVER_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_WORKORDER_BUG_OVER_SEL(@RequestParam(value = "V_V_FAULTCODE") String V_V_FAULTCODE,
                                               HttpServletRequest request,
                                               HttpServletResponse response) throws Exception {
        Map map = cService.PRO_PM_WORKORDER_BUG_OVER_SEL(V_V_FAULTCODE);
        return map;
    }

    @RequestMapping(value = "/PM_BUG_PLAN_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_PLAN_SEL(@RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                 @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,

                                                 HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_PLAN_SEL(V_V_ORGCODE, V_V_DEPTCODE);
        List<Map<String, Object>> pm_1407list = (List) data.get("list");
        result.put("list", pm_1407list);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_BUG_PLAN_UP", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_PLAN_UP(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                @RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                HttpServletRequest request,
                                                HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_PLAN_UP(V_V_PERCODE,V_V_GUID);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_BUG_PLAN_GET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_PLAN_GET(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                 HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_PLAN_GET(V_V_GUID);

        List<Map<String, Object>> list = (List) data.get("list");

        result.put("RET", list);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_BUG_PLAN_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_PLAN_UPDATE(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                  @RequestParam(value = "V_V_ORGANIZATIONAL") String V_V_ORGANIZATIONAL,
                                                  @RequestParam(value = "V_V_PROGRAM") String V_V_PROGRAM,
                                                  @RequestParam(value = "V_V_WORK_TYPE") String V_V_WORK_TYPE,
                                                  @RequestParam(value = "V_V_TOOLS") String V_V_TOOLS,
                                                  @RequestParam(value = "V_V_MATERIAL") String V_V_MATERIAL,
                                                  @RequestParam(value = "V_V_PLAN") String V_V_PLAN,
                                                  @RequestParam(value = "V_V_PREVENT") String V_V_PREVENT,
                                                    HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        HashMap data = cService.PM_BUG_PLAN_UPDATE(V_V_GUID,V_V_ORGANIZATIONAL, V_V_PROGRAM, V_V_WORK_TYPE,V_V_TOOLS, V_V_MATERIAL,V_V_PLAN, V_V_PREVENT);
        String RET = (String) data.get("RET");
        result.put("RET", RET);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_BUG_DATA_STATE_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_DATA_STATE_UPDATE(
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_STATE") String V_V_STATE,
            @RequestParam(value = "V_DEFECT_STATE") String V_DEFECT_STATE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_DATA_STATE_UPDATE(V_V_PERCODE,V_V_GUID,V_V_STATE,V_DEFECT_STATE);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PM_BUG_PLAN_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_PLAN_SET(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                 HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_PLAN_SET(V_V_GUID);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_BUG_ITEM_DATA_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_ITEM_DATA_UPDATE(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                      @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                      @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                      @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                      @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                      @RequestParam(value = "V_V_EQUCHILD_CODE") String V_V_EQUCHILD_CODE,
                                                      @RequestParam(value = "V_V_FAULT_GUID") String V_V_FAULT_GUID,
                                                      @RequestParam(value = "V_V_FAULT_TYPE") String V_V_FAULT_TYPE,
                                                      @RequestParam(value = "V_V_FAULT_YY") String V_V_FAULT_YY,
                                                      @RequestParam(value = "V_V_FINDTIME") String V_V_FINDTIME,
                                                      @RequestParam(value = "V_V_FAULT_XX") String V_V_FAULT_XX,
                                                      @RequestParam(value = "V_V_JJBF") String V_V_JJBF,
                                                      @RequestParam(value = "V_V_FAULT_LEVEL") String V_V_FAULT_LEVEL,
                                                      @RequestParam(value = "V_V_FILE_GUID") String V_V_FILE_GUID,
                                                      @RequestParam(value = "V_V_INTIME") String V_V_INTIME,
                                                      @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                      @RequestParam(value = "V_V_IP") String V_V_IP,
                                                      @RequestParam(value = "V_V_FAULT_NAME") String V_V_FAULT_NAME,
                                                      @RequestParam(value = "V_V_FAULT_PART") String V_V_FAULT_PART,
                                                      @RequestParam(value = "V_V_FAULT_CLGC") String V_V_FAULT_CLGC,
                                                      @RequestParam(value = "V_V_FAULT_SS") String V_V_FAULT_SS,
                                                      @RequestParam(value = "V_V_FAULT_XZ") String V_V_FAULT_XZ,
                                                      @RequestParam(value = "V_V_FAULT_ZGCS") String V_V_FAULT_ZGCS,
                                                      @RequestParam(value = "V_V_FZR_CL") String V_V_FZR_CL,
                                                      @RequestParam(value = "V_V_ENDTIME") String V_V_ENDTIME,
                                                      @RequestParam(value = "V_V_REPORTER") String V_V_REPORTER,
                                                      @RequestParam(value = "V_V_FZR") String V_V_FZR,
                                                      @RequestParam(value = "V_V_STOPTIME") String V_V_STOPTIME,
                                                      @RequestParam(value = "V_V_REPAIRTIME") String V_V_REPAIRTIME,
                                                      @RequestParam(value = "V_V_REPAIRCOST") String V_V_REPAIRCOST,
                                                      @RequestParam(value = "V_V_REPROTTIME") String V_V_REPROTTIME,
                                                      @RequestParam(value = "V_V_FAULT_PASS") String V_V_FAULT_PASS,
                                                      @RequestParam(value = "V_V_CAUSEANALYSIS") String V_V_CAUSEANALYSIS,
                                                      @RequestParam(value = "V_V_REPAIR_PLAN") String V_V_REPAIR_PLAN,
                                                       @RequestParam(value = "V_V_ASSENT_CODE") String V_V_ASSENT_CODE,
                                                      HttpServletRequest request,
                                                      HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_ITEM_DATA_UPDATE(V_V_GUID, V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE, V_V_EQUCODE,
                V_V_EQUCHILD_CODE, V_V_FAULT_GUID, V_V_FAULT_TYPE, V_V_FAULT_YY, V_V_FINDTIME,V_V_FAULT_XX,V_V_JJBF, V_V_FAULT_LEVEL,
                V_V_FILE_GUID,V_V_INTIME,V_V_PERCODE,V_V_IP,V_V_FAULT_NAME,V_V_FAULT_PART,V_V_FAULT_CLGC,V_V_FAULT_SS,V_V_FAULT_XZ,V_V_FAULT_ZGCS,V_V_FZR_CL,
                V_V_ENDTIME,V_V_REPORTER,V_V_FZR,V_V_STOPTIME,V_V_REPAIRTIME,V_V_REPAIRCOST,V_V_REPROTTIME,V_V_FAULT_PASS,V_V_CAUSEANALYSIS,V_V_REPAIR_PLAN,V_V_ASSENT_CODE);

        String RET = (String) data.get("RET");
        result.put("RET", RET);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_BUG_PLAN_STATE_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_PLAN_STATE_UPDATE(@RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                      @RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                      @RequestParam(value = "V_V_STAUTS") String V_V_STAUTS,
                                                      HttpServletRequest request,
                                                      HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_PLAN_STATE_UPDATE(V_V_PERCODE,V_V_GUID,V_V_STAUTS);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PRO_PM_WORKORDER_SAP_ISCLOSE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_SAP_ISCLOSE(@RequestParam(value = "V_V_WORKORDERID") String V_V_WORKORDERID,
                                                               HttpServletRequest request,
                                                               HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PRO_PM_WORKORDER_SAP_ISCLOSE(V_V_WORKORDERID);
        List<Map<String, Object>> list = (List) data.get("list");
        String V_INFO = (String) data.get("V_INFO");
        result.put("list", list);
        result.put("ret", V_INFO);
        return result;
    }
    @RequestMapping(value = "/PM_WORKORDER_TO_BUG_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_WORKORDER_TO_BUG_SEL(@RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                         @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                         @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
                                                         @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
                                                         @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
                                                         HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        Map result = cService.PM_WORKORDER_TO_BUG_SEL(V_V_ORGCODE,V_V_DEPTCODE,V_V_YEAR,V_V_PAGE,V_V_PAGESIZE);
        return result;
    }
    @RequestMapping(value = "/PM_WORKORDER_BUG_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_WORKORDER_BUG_SET(
            @RequestParam(value = "V_V_FAULT_GUID") String V_V_FAULT_GUID,
            @RequestParam(value = "V_V_WORKORDER_ORDERID") String V_V_WORKORDER_ORDERID,
            @RequestParam(value = "V_V_INPER_CODE") String V_V_INPER_CODE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        HashMap data = cService.PM_WORKORDER_BUG_SET(V_V_FAULT_GUID,V_V_WORKORDER_ORDERID,V_V_INPER_CODE);
        String ss = (String) data.get("RET");
        result.put("RET", ss);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PM_BUG_TYPE_ITEM_SEL_TJ", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_TYPE_ITEM_SEL_TJ(@RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                             @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                             @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                             @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                             @RequestParam(value = "V_V_EQUCHILD_CODE") String V_V_EQUCHILD_CODE,
                                                             @RequestParam(value = "V_V_FAULT_TYPE") String V_V_FAULT_TYPE,
                                                             @RequestParam(value = "V_V_FAULT_YY") String V_V_FAULT_YY,
                                                             @RequestParam(value = "V_V_FINDTIME_B") String V_V_FINDTIME_B,
                                                             @RequestParam(value = "V_V_FINDTIME_E") String V_V_FINDTIME_E,
                                                             HttpServletRequest request,
                                                             HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_TYPE_ITEM_SEL_TJ(V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE,
                V_V_EQUCODE, V_V_EQUCHILD_CODE, V_V_FAULT_TYPE, V_V_FAULT_YY, V_V_FINDTIME_B, V_V_FINDTIME_E);
        List<Map<String, Object>> list = (List) data.get("list");
        result.put("list", list);
        result.put("success", true);
        return result;
    }
    //
    @RequestMapping(value = "/PM_FAULT_BUG_MODEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_FAULT_BUG_MODEL(@RequestParam(value = "V_V_ORDERGUID") String V_V_ORDERGUID,
                                                  @RequestParam(value = "V_V_MODEL_STYLE") String V_V_MODEL_STYLE,
                                                  @RequestParam(value = "V_V_MODEL_MANE") String V_V_MODEL_MANE,
                                                  @RequestParam(value = "V_V_USERCODE") String V_V_USERCODE,
                                                  HttpServletRequest request,
                                                        HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_FAULT_BUG_MODEL(V_V_ORDERGUID,V_V_MODEL_STYLE,V_V_MODEL_MANE,V_V_USERCODE);

        String ss = (String) data.get("RET");

        result.put("RET", ss);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_FAULT_BUG_MODE_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_FAULT_BUG_MODE_SEL(@RequestParam(value = "V_V_STYLE") String V_V_STYLE,
                                                       HttpServletRequest request,
                                                       HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_FAULT_BUG_MODE_SEL(V_V_STYLE);
        List<Map<String, Object>> list = (List) data.get("list");
        result.put("list", list);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PRO_GET_DEPTEQUTYPE_PER", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_GET_DEPTEQUTYPE_PER(@RequestParam(value = "V_V_PERSONCODE") String V_V_PERSONCODE,
                                       @RequestParam(value = "V_V_DEPTCODENEXT") String V_V_DEPTCODENEXT) throws Exception {
        Map map = cService.PRO_GET_DEPTEQUTYPE_PER(V_V_PERSONCODE,V_V_DEPTCODENEXT);
        return map;
    }
    @RequestMapping(value = "/PM_FAULT_ITEM_DATA_SET_NEW", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_FAULT_ITEM_DATA_SET_NEW(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                               @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                               @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                               @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                               @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                               @RequestParam(value = "V_V_EQUCHILD_CODE") String V_V_EQUCHILD_CODE,
                                                               @RequestParam(value = "V_V_FAULT_GUID") String V_V_FAULT_GUID,
                                                               @RequestParam(value = "V_V_FAULT_TYPE") String V_V_FAULT_TYPE,
                                                               @RequestParam(value = "V_V_FAULT_YY") String V_V_FAULT_YY,
                                                               @RequestParam(value = "V_V_FINDTIME") String V_V_FINDTIME,
                                                               @RequestParam(value = "V_V_FAULT_XX") String V_V_FAULT_XX,
                                                               @RequestParam(value = "V_V_JJBF") String V_V_JJBF,
                                                               @RequestParam(value = "V_V_FAULT_LEVEL") String V_V_FAULT_LEVEL,
                                                               @RequestParam(value = "V_V_FILE_GUID") String V_V_FILE_GUID,
                                                               @RequestParam(value = "V_V_INTIME") String V_V_INTIME,
                                                               @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                               @RequestParam(value = "V_V_IP") String V_V_IP,
                                                               @RequestParam(value = "V_V_FAULT_NAME") String V_V_FAULT_NAME,
                                                               @RequestParam(value = "V_V_FAULT_PART") String V_V_FAULT_PART,
                                                               @RequestParam(value = "V_V_FAULT_CLGC") String V_V_FAULT_CLGC,
                                                               @RequestParam(value = "V_V_FAULT_SS") String V_V_FAULT_SS,
                                                               @RequestParam(value = "V_V_FAULT_XZ") String V_V_FAULT_XZ,
                                                               @RequestParam(value = "V_V_FAULT_ZGCS") String V_V_FAULT_ZGCS,
                                                               @RequestParam(value = "V_V_FZR_CL") String V_V_FZR_CL,
                                                               @RequestParam(value = "V_V_ENDTIME") String V_V_ENDTIME,
                                                               @RequestParam(value = "V_V_REPORTER") String V_V_REPORTER,
                                                               @RequestParam(value = "V_V_FZR") String V_V_FZR,
                                                               @RequestParam(value = "V_V_STOPTIME") String V_V_STOPTIME,
                                                               @RequestParam(value = "V_V_REPAIRTIME") String V_V_REPAIRTIME,
                                                               @RequestParam(value = "V_V_REPAIRCOST") String V_V_REPAIRCOST,
                                                               @RequestParam(value = "V_V_REPROTTIME") String V_V_REPROTTIME,
                                                               @RequestParam(value = "V_V_FAULT_PASS") String V_V_FAULT_PASS,
                                                               @RequestParam(value = "V_V_CAUSEANALYSIS") String V_V_CAUSEANALYSIS,
                                                               @RequestParam(value = "V_V_REPAIR_PLAN") String V_V_REPAIR_PLAN,
                                                               @RequestParam(value = "V_V_ASSENT_CODE") String V_V_ASSENT_CODE,
                                                               @RequestParam(value = "V_V_ORDERGUID") String V_V_ORDERGUID,
                                                               HttpServletRequest request,
                                                               HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_FAULT_ITEM_DATA_SET_NEW(V_V_GUID, V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE, V_V_EQUCODE,
                V_V_EQUCHILD_CODE, V_V_FAULT_GUID, V_V_FAULT_TYPE, V_V_FAULT_YY, V_V_FINDTIME,V_V_FAULT_XX,V_V_JJBF, V_V_FAULT_LEVEL,
                V_V_FILE_GUID,V_V_INTIME,V_V_PERCODE,V_V_IP,V_V_FAULT_NAME,V_V_FAULT_PART,V_V_FAULT_CLGC,V_V_FAULT_SS,
                V_V_FAULT_XZ,V_V_FAULT_ZGCS,V_V_FZR_CL,
                V_V_ENDTIME,V_V_REPORTER,V_V_FZR,V_V_STOPTIME,V_V_REPAIRTIME,V_V_REPAIRCOST,V_V_REPROTTIME,
                V_V_FAULT_PASS,V_V_CAUSEANALYSIS,V_V_REPAIR_PLAN,V_V_ASSENT_CODE,V_V_ORDERGUID);

        String RET = (String) data.get("RET");
        String FAULTID = (String) data.get("FAULTID");

        result.put("RET", RET);
        result.put("FAULTID", FAULTID);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_WORKORDER_FROM_FAULT", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_WORKORDER_FROM_FAULT(@RequestParam(value = "V_V_FAULT_GUID") String V_V_FAULT_GUID,
                                                     HttpServletRequest request,
                                                     HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_WORKORDER_FROM_FAULT(V_V_FAULT_GUID);
        List<Map<String, Object>> list = (List) data.get("list");
        result.put("list", list);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "/PM_BUG_DATA_SET_NEW", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_DATA_SET_NEW(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                               @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                               @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                               @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                               @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                               @RequestParam(value = "V_V_EQUCHILD_CODE") String V_V_EQUCHILD_CODE,
                                               @RequestParam(value = "V_V_FAULT_GUID") String V_V_FAULT_GUID,
                                               @RequestParam(value = "V_V_FAULT_TYPE") String V_V_FAULT_TYPE,
                                               @RequestParam(value = "V_V_FAULT_YY") String V_V_FAULT_YY,
                                               @RequestParam(value = "V_V_FINDTIME") String V_V_FINDTIME,
                                               @RequestParam(value = "V_V_FAULT_XX") String V_V_FAULT_XX,
                                               @RequestParam(value = "V_V_JJBF") String V_V_JJBF,
                                               @RequestParam(value = "V_V_FAULT_LEVEL") String V_V_FAULT_LEVEL,
                                               @RequestParam(value = "V_V_FILE_GUID") String V_V_FILE_GUID,
                                               @RequestParam(value = "V_V_INTIME") String V_V_INTIME,
                                               @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                               @RequestParam(value = "V_V_IP") String V_V_IP,
                                               @RequestParam(value = "V_V_FAULT_NAME") String V_V_FAULT_NAME,
                                               @RequestParam(value = "V_V_FAULT_PART") String V_V_FAULT_PART,
                                               @RequestParam(value = "V_V_FAULT_CLGC") String V_V_FAULT_CLGC,
                                               @RequestParam(value = "V_V_FAULT_SS") String V_V_FAULT_SS,
                                               @RequestParam(value = "V_V_FAULT_XZ") String V_V_FAULT_XZ,
                                               @RequestParam(value = "V_V_FAULT_ZGCS") String V_V_FAULT_ZGCS,
                                               @RequestParam(value = "V_V_FZR_CL") String V_V_FZR_CL,
                                               @RequestParam(value = "V_V_ENDTIME") String V_V_ENDTIME,
                                               @RequestParam(value = "V_V_REPORTER") String V_V_REPORTER,
                                               @RequestParam(value = "V_V_FZR") String V_V_FZR,
                                               @RequestParam(value = "V_V_STOPTIME") String V_V_STOPTIME,
                                               @RequestParam(value = "V_V_REPAIRTIME") String V_V_REPAIRTIME,
                                               @RequestParam(value = "V_V_REPAIRCOST") String V_V_REPAIRCOST,
                                               @RequestParam(value = "V_V_REPROTTIME") String V_V_REPROTTIME,
                                               @RequestParam(value = "V_V_FAULT_PASS") String V_V_FAULT_PASS,
                                               @RequestParam(value = "V_V_CAUSEANALYSIS") String V_V_CAUSEANALYSIS,
                                               @RequestParam(value = "V_V_REPAIR_PLAN") String V_V_REPAIR_PLAN,
                                               @RequestParam(value = "V_V_ASSENT_CODE") String V_V_ASSENT_CODE,
                                               @RequestParam(value = "V_V_ORDERGUID") String V_V_ORDERGUID,
                                               HttpServletRequest request,
                                               HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_DATA_SET_NEW(V_V_GUID, V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE, V_V_EQUCODE,
                V_V_EQUCHILD_CODE, V_V_FAULT_GUID, V_V_FAULT_TYPE, V_V_FAULT_YY, V_V_FINDTIME,V_V_FAULT_XX,V_V_JJBF, V_V_FAULT_LEVEL,
                V_V_FILE_GUID,V_V_INTIME,V_V_PERCODE,V_V_IP,V_V_FAULT_NAME,V_V_FAULT_PART,V_V_FAULT_CLGC,V_V_FAULT_SS,
                V_V_FAULT_XZ,V_V_FAULT_ZGCS,V_V_FZR_CL,
                V_V_ENDTIME,V_V_REPORTER,V_V_FZR,V_V_STOPTIME,V_V_REPAIRTIME,V_V_REPAIRCOST,V_V_REPROTTIME,V_V_FAULT_PASS,
                V_V_CAUSEANALYSIS,V_V_REPAIR_PLAN,V_V_ASSENT_CODE,V_V_ORDERGUID);

        String RET = (String) data.get("RET");
        String FAULTID = (String) data.get("FAULTID");

        result.put("RET", RET);
        result.put("FAULTID", FAULTID);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_WORKORDER_FROM_BUG", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_WORKORDER_FROM_BUG(@RequestParam(value = "V_V_FAULT_GUID") String V_V_FAULT_GUID,
                                                       HttpServletRequest request,
                                                       HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_WORKORDER_FROM_BUG(V_V_FAULT_GUID);
        List<Map<String, Object>> list = (List) data.get("list");
        result.put("list", list);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_WORKORDER_FAULT_GL_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_WORKORDER_FAULT_GL_SEL(@RequestParam(value = "V_WORKORDER_GUID") String V_WORKORDER_GUID,

                                                         HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_WORKORDER_FAULT_GL_SEL(V_WORKORDER_GUID);

        String num = (String) data.get("num");

        result.put("num", num);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_WORKORDER_BUG_GL_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_WORKORDER_BUG_GL_SEL(@RequestParam(value = "V_WORKORDER_GUID") String V_WORKORDER_GUID,

                                                         HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_WORKORDER_BUG_GL_SEL(V_WORKORDER_GUID);

        String num = (String) data.get("num");

        result.put("num", num);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_WORKORDER_FAULT_GL_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_WORKORDER_FAULT_GL_DEL(@RequestParam(value = "V_WORKORDER_GUID") String V_WORKORDER_GUID,
                                                         @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                         HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_WORKORDER_FAULT_GL_DEL(V_WORKORDER_GUID,V_V_PERCODE);

        String V_INFO = (String) data.get("V_INFO");

        result.put("RET", V_INFO);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_WORKORDER_BUG_GL_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_WORKORDER_BUG_GL_DEL(@RequestParam(value = "V_WORKORDER_GUID") String V_WORKORDER_GUID,
                                                         @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                         HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_WORKORDER_BUG_GL_DEL(V_WORKORDER_GUID,V_V_PERCODE);

        String V_INFO = (String) data.get("V_INFO");

        result.put("RET", V_INFO);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_WORKORDER_GL_STATUS_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_WORKORDER_GL_STATUS_SEL(@RequestParam(value = "V_V_ORDERGUID") String V_V_ORDERGUID,

                                                         HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_WORKORDER_GL_STATUS_SEL(V_V_ORDERGUID);

        String V_INFO = (String) data.get("V_INFO");

        result.put("V_INFO", V_INFO);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_FAULT_DATA_TJ_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_FAULT_DATA_TJ_SEL(@RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                    @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                    @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                    @RequestParam(value = "V_V_EQUNAME") String V_V_EQUNAME,
                                                    @RequestParam(value = "V_V_FINDTIME_B") String V_V_FINDTIME_B,
                                                    @RequestParam(value = "V_V_FINDTIME_E") String V_V_FINDTIME_E,
                                                    @RequestParam(value = "V_V_LOSTMONEY") String V_V_LOSTMONEY,
                                                       HttpServletRequest request,
                                                       HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_FAULT_DATA_TJ_SEL(V_V_ORGCODE,V_V_DEPTCODE,V_V_EQUTYPE,V_V_EQUNAME,V_V_FINDTIME_B,V_V_FINDTIME_E,V_V_LOSTMONEY);
        List<Map<String, Object>> list = (List) data.get("list");
        result.put("list", list);
        result.put("success", true);
        return result;
    }
    @RequestMapping(value = "/PM_BUG_DATA_TJ_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_BUG_DATA_TJ_SEL(@RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                    @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                    @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                    @RequestParam(value = "V_V_EQUNAME") String V_V_EQUNAME,
                                                    @RequestParam(value = "V_V_FINDTIME_B") String V_V_FINDTIME_B,
                                                    @RequestParam(value = "V_V_FINDTIME_E") String V_V_FINDTIME_E,
                                                    @RequestParam(value = "V_V_LOSTMONEY") String V_V_LOSTMONEY,
                                                    HttpServletRequest request,
                                                    HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = cService.PM_BUG_DATA_TJ_SEL(V_V_ORGCODE,V_V_DEPTCODE,V_V_EQUTYPE,V_V_EQUNAME,V_V_FINDTIME_B,V_V_FINDTIME_E,V_V_LOSTMONEY);
        List<Map<String, Object>> list = (List) data.get("list");
        result.put("list", list);
        result.put("success", true);
        return result;
    }
}

