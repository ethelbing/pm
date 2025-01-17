package org.building.pm.controller;

import javafx.application.Application;
import org.activiti.bpmn.converter.CallActivityXMLConverter;
import org.apache.poi.hssf.usermodel.*;
import org.apache.poi.hssf.util.CellRangeAddress;
import org.apache.poi.ss.util.CellUtil;
import org.building.pm.service.Dx_fileService;
import org.building.pm.webpublic.MasageClass;
import org.building.pm.webservice.MMService;
import org.codehaus.xfire.client.Client;
import org.dom4j.Document;
import org.dom4j.DocumentHelper;
import org.dom4j.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sun.misc.ExtensionInstallationException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.swing.filechooser.FileSystemView;
import java.io.*;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.security.NoSuchAlgorithmException;
import java.sql.Blob;
import java.sql.SQLException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.*;
import java.sql.Date;

@Controller
@RequestMapping("/app/pm/dxfile/")
public class Dx_fileController {
    @Autowired
    private Dx_fileService dx_fileService;

    @Value("#{configProperties['MMEqu.url']}")
    private String MMEquurl;

    @RequestMapping(value = "PM_EDUNOTOWORKORDER", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_EDUNOTOWORKORDER(@RequestParam(value = "V_EDUCODE") String V_EDUCODE,
                                                   HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        HashMap data = dx_fileService.PM_EDUNOTOWORKORDER(V_EDUCODE);
        return setPage(request, response, data);
    }

    //---附件类型查询(大修、模型）
    @RequestMapping(value = "FILETYPE_GETLIST", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> FILETYPE_GETLIST(@RequestParam(value = "SIGN") String SIGN,
                                                HttpServletRequest request,
                                                HttpServletResponse response) throws Exception {
        Map<String, Object> result = dx_fileService.FILETYPE_GETLIST(SIGN);
        return result;
    }

    //大修附件查询
    @RequestMapping(value = "PM_03_PLAN_PROJECT_FILE_SEL2", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_PLAN_PROJECT_FILE_SEL2(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_FILEGUID") String V_V_FILEGUID,
            @RequestParam(value = "V_V_FILENAME") String V_V_FILENAME,
            @RequestParam(value = "V_V_TYPE") String V_V_TYPE) throws Exception {
        Map result = dx_fileService.PM_03_PLAN_PROJECT_FILE_SEL2(V_V_GUID, V_V_FILEGUID, V_V_FILENAME, V_V_TYPE);
        return result;
    }

    /*检修模型添加附件*/
    @RequestMapping(value = "PM_MODEL_FILE_ADD", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_MODEL_FILE_ADD(
            @RequestParam(value = "upload") MultipartFile file,
            @RequestParam(value = "V_V_MODE_GUID") String V_V_MODE_GUID,
            @RequestParam(value = "V_V_INPERCODE") String V_V_INPERCODE,
            @RequestParam(value = "V_V_INPERNAME") String V_V_INPERNAME,
            @RequestParam(value = "V_V_TYPE") String V_V_TYPE
    ) throws Exception {
        String V_V_FILENAME = file.getOriginalFilename();
        InputStream V_V_BLOB = file.getInputStream();
        String V_V_FILETYPE = file.getContentType();
        Map result = dx_fileService.PM_MODEL_FILE_ADD(V_V_FILENAME, V_V_BLOB, V_V_FILETYPE, V_V_MODE_GUID, V_V_INPERCODE, V_V_INPERNAME, V_V_TYPE);
        result.put("success", true);
        return result;
    }

    /*检修模型附件下载*/
    @RequestMapping(value = "PM_MODEL_FILE_DOWN", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void PM_MODEL_FILE_DOWN(
            @RequestParam(value = "V_V_FILEGUID") String V_V_FILEGUID
            , HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        List<MasageClass> item = new ArrayList<MasageClass>();
        Map<String, Object> data = dx_fileService.PM_MODEL_FILE_DOWN(V_V_FILEGUID);
        List list = (List) data.get("list");
        Map listmap = (Map) list.get(0);
        String A_FILENAME = listmap.get("V_FILENAME").toString();
        ;
        Blob blob = (Blob) data.get("V_V_BLOB");
        InputStream in = blob.getBinaryStream();
        OutputStream out = response.getOutputStream();
        response.setContentType("application/octet-stream");

        A_FILENAME = URLDecoder.decode(A_FILENAME, "utf-8");
        response.setCharacterEncoding("UTF-8");
        response.addHeader("Content-Disposition", "attachment;filename=" + new String(A_FILENAME.getBytes("gbk"), "iso8859-1"));
        byte[] b = new byte[2048];
        int length;
        while ((length = in.read(b)) > 0) {
            out.write(b, 0, length);
        }
        // try{
        MasageClass masageClass = new MasageClass();
        masageClass.setRet(data.get(0) == null ? "" : "success");
        item.add(masageClass);

        response.setHeader("Access-Control-Allow-Origin", "*");
        response.setCharacterEncoding("UTF-8");
        response.setContentType("application/json");
        out.flush();
        in.close();
        out.close();
//        }catch(Exception e){
//            e.printStackTrace();
//        }
    }

    /*检修模型附件查询*/
    @RequestMapping(value = "PM_MODEL_FILE_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_MODEL_FILE_SEL(
            @RequestParam(value = "V_V_MODE_GUID") String V_V_MODE_GUID,
            @RequestParam(value = "V_V_TYPE") String V_V_TYPE
    ) throws Exception {

        Map result = dx_fileService.PM_MODEL_FILE_SEL(V_V_MODE_GUID, V_V_TYPE);
        return result;
    }

    /*检修模型附件删除*/
    @RequestMapping(value = "PM_MODEL_FILE_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_MODEL_FILE_DEL(
            @RequestParam(value = "V_V_FILEGUID") String V_V_FILEGUID
    ) throws Exception {

        Map result = dx_fileService.PM_MODEL_FILE_DEL(V_V_FILEGUID);
        return result;
    }

    /*检修模型附件写入大修附件*/
    @RequestMapping(value = "PM_MODEL_FILE_INSERT_DXF", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_MODEL_FILE_INSERT_DXF(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_FILEGUID") String V_V_FILEGUID,
            @RequestParam(value = "V_V_FILENAME") String V_V_FILENAME,
            @RequestParam(value = "V_V_INPERCODE") String V_V_INPERCODE,
            @RequestParam(value = "V_V_INPERNAME") String V_V_INPERNAME,
            @RequestParam(value = "V_V_TYPE") String V_V_TYPE,
            @RequestParam(value = "V_V_FILETYPE") String V_V_FILETYPE,
            @RequestParam(value = "V_V_MODE_GUID") String V_V_MODE_GUID
    ) throws Exception {

        Map result = dx_fileService.PM_MODEL_FILE_INSERT_DXF(V_V_GUID, V_V_FILEGUID, V_V_FILENAME, V_V_INPERCODE, V_V_INPERNAME, V_V_TYPE, V_V_FILETYPE, V_V_MODE_GUID);
        return result;
    }

    //   大修删除模型附件
    @RequestMapping(value = "PM_MODEL_FILE_DEL_DXF", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_MODEL_FILE_DEL_DXF(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_MODE_GUID") String V_V_MODE_GUID
    ) throws Exception {
        Map result = dx_fileService.PM_MODEL_FILE_DEL_DXF(V_V_GUID, V_V_MODE_GUID);
        return result;
    }

    //   大修查询模型附件
    @RequestMapping(value = "PM_MODEL_FILE_SEL_DXF", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_MODEL_FILE_SEL_DXF(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_MODE_GUID") String V_V_MODE_GUID
    ) throws Exception {
        Map result = dx_fileService.PM_MODEL_FILE_SEL_DXF(V_V_GUID, V_V_MODE_GUID);
        return result;
    }

    /*--2018-11-07 岗位点检 */
    @RequestMapping(value = "BASE_INSPECT_DAY_SELECT", method = RequestMethod.POST)
    @ResponseBody
    public Map BASE_INSPECT_DAY_SELECT(
            @RequestParam(value = "V_EQUCODE") String V_EQUCODE,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
//        HashMap data = dx_fileService.BASE_INSPECT_DAY_SELECT(V_EQUCODE,V_PERCODE);
//        return setPage(request,response,data);
        Map result = dx_fileService.BASE_INSPECT_DAY_SELECT(V_EQUCODE, V_PERCODE);
        return result;
    }

    @RequestMapping(value = "BASE_INSPECT_DAY_INSERT", method = RequestMethod.POST)
    @ResponseBody
    public Map BASE_INSPECT_DAY_INSERT(
            @RequestParam(value = "V_MAINGUID") String V_MAINGUID,
            @RequestParam(value = "V_EQUCODE") String V_EQUCODE,
            @RequestParam(value = "V_EQUNAME") String V_EQUNAME,
            @RequestParam(value = "V_INSPECT_UNIT_CODE") String V_INSPECT_UNIT_CODE,
            @RequestParam(value = "V_INSPECT_UNIT") String V_INSPECT_UNIT,
            @RequestParam(value = "V_INSPECT_CONTENT") String V_INSPECT_CONTENT,
            @RequestParam(value = "V_INSPECT_STANDARD") String V_INSPECT_STANDARD,
            @RequestParam(value = "V_UUID") String V_UUID,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_PERNAME") String V_PERNAME,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map result = dx_fileService.BASE_INSPECT_DAY_INSERT(V_MAINGUID, V_EQUCODE, V_EQUNAME, V_INSPECT_UNIT_CODE, V_INSPECT_UNIT, V_INSPECT_CONTENT, V_INSPECT_STANDARD, V_UUID, V_PERCODE, V_PERNAME);
        return result;
    }


    @RequestMapping(value = "BASE_INSPECT_DAY_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map BASE_INSPECT_DAY_UPDATE(
            @RequestParam(value = "V_MAINGUID") String V_MAINGUID,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_UUID") String V_UUID,
            @RequestParam(value = "V_STATE_SIGN") String V_STATE_SIGN,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map result = dx_fileService.BASE_INSPECT_DAY_UPDATE(V_MAINGUID, V_PERCODE, V_UUID, V_STATE_SIGN);
        return result;
    }

    //--获取岗检下一步班组列表
    @RequestMapping(value = "BASE_INSPECT_GETCLASS", method = RequestMethod.POST)
    @ResponseBody
    public Map BASE_INSPECT_GETCLASS(
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "DEPTCODE") String DEPTCODE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map result = dx_fileService.BASE_INSPECT_GETCLASS(V_PERCODE, DEPTCODE);
        return result;
    }

    //-获取下一步人员列表
    @RequestMapping(value = "BASE_INSPECT_GETNEXTPERSON", method = RequestMethod.POST)
    @ResponseBody
    public Map BASE_INSPECT_GETCLASS(
            @RequestParam(value = "SAP_WORK") String SAP_WORK,
            HttpServletResponse response
    ) throws Exception {
        Map result = dx_fileService.BASE_INSPECT_GETNEXTPERSON(SAP_WORK);
        return result;
    }

    //----写入write表格
    @RequestMapping(value = "BASE_INSPECT_WRITE_INSERT", method = RequestMethod.POST)
    @ResponseBody
    public Map BASE_INSPECT_WRITE_INSERT(
            @RequestParam(value = "V_MAINGUID") String V_MAINGUID,
            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
            @RequestParam(value = "V_NEXTPRECODE") String V_NEXTPRECODE,
            @RequestParam(value = "V_INCLASS") String V_INCLASS,
            @RequestParam(value = "V_NEXTCLASS") String V_NEXTCLASS,
            @RequestParam(value = "V_NCLASSNAME") String V_NCLASSNAME,
            @RequestParam(value = "V_INSPECT_RESULTE") String V_INSPECT_RESULTE,
            @RequestParam(value = "V_REQUESTION") String V_REQUESTION,
            @RequestParam(value = "V_EQUESTION") String V_EQUESTION,
            @RequestParam(value = "V_OTHER_QIUEST") String V_OTHER_QIUEST,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map result = dx_fileService.BASE_INSPECT_WRITE_INSERT(V_MAINGUID, V_INPERCODE, V_NEXTPRECODE, V_INCLASS, V_NEXTCLASS, V_NCLASSNAME, V_INSPECT_RESULTE, V_REQUESTION, V_EQUESTION, V_OTHER_QIUEST);
        return result;
    }
//----修改write表

    @RequestMapping(value = "BASE_INSPECT_WRITE_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map BASE_INSPECT_WRITE_UPDATE(
            @RequestParam(value = "V_MAINGUID") String V_MAINGUID,
            @RequestParam(value = "V_CHILDGUID") String V_CHILDGUID,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_NEXT_CLASS") String V_NEXT_CLASS,
            @RequestParam(value = "V_NEXTPERCODE") String V_NEXTPERCODE,
            @RequestParam(value = "V_INSPECT_RESULTE") String V_INSPECT_RESULTE,
            @RequestParam(value = "V_REQUESTION") String V_REQUESTION,
            @RequestParam(value = "V_EQUESTION") String V_EQUESTION,
            @RequestParam(value = "V_OTHER_QIUEST") String V_OTHER_QIUEST,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map result = dx_fileService.BASE_INSPECT_WRITE_UPDATE(V_MAINGUID, V_CHILDGUID, V_PERCODE, V_NEXT_CLASS, V_NEXTPERCODE, V_INSPECT_RESULTE, V_REQUESTION, V_EQUESTION, V_OTHER_QIUEST);
        return result;
    }

    ///--___-查询返回的write表
    @RequestMapping(value = "BASE_INSPECT_WRITE_SELECT", method = RequestMethod.POST)
    @ResponseBody
    public Map BASE_INSPECT_WRITE_SELECT(
            @RequestParam(value = "V_MAINGUID") String V_MAINGUID,
            @RequestParam(value = "V_CHILDGUID") String V_CHILDGUID,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map result = dx_fileService.BASE_INSPECT_WRITE_SELECT(V_MAINGUID, V_CHILDGUID, V_PERCODE);
        return result;
    }

    //---首页日检数量
    @RequestMapping(value = "BASE_INSPECT_WRITE_SELNUM", method = RequestMethod.POST)
    @ResponseBody
    public Map BASE_INSPECT_WRITE_SELNUM(
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map result = dx_fileService.BASE_INSPECT_WRITE_SELNUM(V_PERCODE);
        return result;
    }
    //---待办日检明细

    @RequestMapping(value = "BASE_INSPECT_SELTODOS", method = RequestMethod.POST)
    @ResponseBody
    public Map BASE_INSPECT_SELTODOS(
            @RequestParam(value = "V_CHILDGUID") String V_CHILDGUID,
            @RequestParam(value = "V_PERSON") String V_PERSON,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map result = dx_fileService.BASE_INSPECT_SELTODOS(V_CHILDGUID, V_PERSON);
        return result;
    }

    @RequestMapping(value = "BASE_INSPECT_WRITE_INSERT2", method = RequestMethod.POST)
    @ResponseBody
    public Map BASE_INSPECT_WRITE_INSERT2(
            @RequestParam(value = "V_MAINGUID") String V_MAINGUID,
            @RequestParam(value = "V_CHILDGUID") String V_CHILDGUID,
            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
            @RequestParam(value = "V_NEXTPRECODE") String V_NEXTPRECODE,
            @RequestParam(value = "V_INCLASS") String V_INCLASS,
            @RequestParam(value = "V_NEXTCLASS") String V_NEXTCLASS,
            @RequestParam(value = "V_NCLASSNAME") String V_NCLASSNAME,
            @RequestParam(value = "V_INSPECT_RESULTE") String V_INSPECT_RESULTE,
            @RequestParam(value = "V_REQUESTION") String V_REQUESTION,
            @RequestParam(value = "V_EQUESTION") String V_EQUESTION,
            @RequestParam(value = "V_OTHER_QIUEST") String V_OTHER_QIUEST,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map result = dx_fileService.BASE_INSPECT_WRITE_INSERT2(V_MAINGUID, V_CHILDGUID, V_INPERCODE, V_NEXTPRECODE, V_INCLASS, V_NEXTCLASS, V_NCLASSNAME, V_INSPECT_RESULTE, V_REQUESTION, V_EQUESTION, V_OTHER_QIUEST);
        return result;
    }

    //----周计划上报设备部
    @RequestMapping(value = "PRO_PM_03_PLAN_WEEK_SEND2", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_03_PLAN_WEEK_SEND2(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_FLOWCODE") String V_V_FLOWCODE,
            @RequestParam(value = "V_V_PLANTYPE") String V_V_PLANTYPE,
            @RequestParam(value = "V_V_PERSONCODE") String V_V_PERSONCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map test = new HashMap();

        List<Map> result = null;
        result = dx_fileService.PRO_PM_03_PLAN_WEEK_SEND2(V_V_GUID, V_V_ORGCODE, V_V_DEPTCODE, V_V_FLOWCODE, V_V_PLANTYPE, V_V_PERSONCODE);
        test.put("list", result);
        return test;
    }

    // plan report to find next person  week/month
    @RequestMapping(value = "PM_ACTIVITI_PROCESS_PER_SELSBB", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_ACTIVITI_PROCESS_PER_SELSBB(@RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                              @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                              @RequestParam(value = "V_V_REPAIRCODE") String V_V_REPAIRCODE,
                                                              @RequestParam(value = "V_V_FLOWTYPE") String V_V_FLOWTYPE,
                                                              @RequestParam(value = "V_V_FLOW_STEP") String V_V_FLOW_STEP,
                                                              @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                              @RequestParam(value = "V_V_SPECIALTY") String V_V_SPECIALTY,
                                                              @RequestParam(value = "V_V_WHERE") String V_V_WHERE,
                                                              HttpServletRequest request,
                                                              HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = dx_fileService.PM_ACTIVITI_PROCESS_PER_SELSBB(V_V_ORGCODE, V_V_DEPTCODE, V_V_REPAIRCODE, V_V_FLOWTYPE, V_V_FLOW_STEP, V_V_PERCODE, V_V_SPECIALTY, V_V_WHERE);

        List<Map<String, Object>> list = (List) data.get("list");

        String ret = (String) data.get("RET");
        result.put("RET", ret);
        result.put("list", list);
        result.put("success", true);
        return result;
    }

    //  plan report to sbb select date
    @RequestMapping(value = "PRO_PM_03_PLAN_WEEK_VIEWSBB", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_03_PLAN_WEEK_VIEWSBB(@RequestParam(value = "V_V_YEAR") String V_V_YEAR,
                                                           @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
                                                           @RequestParam(value = "V_V_WEEK") String V_V_WEEK,
                                                           @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                           @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                           @RequestParam(value = "V_V_ZY") String V_V_ZY,
                                                           @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                           @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                           @RequestParam(value = "V_V_CONTENT") String V_V_CONTENT,
                                                           @RequestParam(value = "V_V_STATE") String V_V_STATE,
                                                           @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
                                                           @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
                                                           HttpServletRequest request,
                                                           HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();


        HashMap data = dx_fileService.PRO_PM_03_PLAN_WEEK_VIEWSBB(V_V_YEAR, V_V_MONTH, V_V_WEEK, V_V_ORGCODE, V_V_DEPTCODE,
                V_V_ZY, V_V_EQUTYPE, V_V_EQUCODE, V_V_CONTENT, V_V_STATE, V_V_PAGE, V_V_PAGESIZE);
        return data;
    }

    // 上报设备部周计划数据添加
    @RequestMapping(value = "PRO_PM_03_PLAN_WEEK_SENDSBB", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_03_PLAN_WEEK_SENDSBB(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_UPSBBPER") String V_UPSBBPER,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map test = new HashMap();

        List<Map> result = null;
        result = dx_fileService.PRO_PM_03_PLAN_WEEK_SENDSBB(V_V_GUID, V_UPSBBPER);
        test.put("list", result);
        return test;
    }

    // SBB办理绑定周计划数据
    @RequestMapping(value = "PRO_PM_03_PLAN_WEEK_GET2", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_03_PLAN_WEEK_GET2(
            @RequestParam(value = "V_V_WEEKPLAN_GUID") String V_V_WEEKPLAN_GUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = dx_fileService.PRO_PM_03_PLAN_WEEK_GET2(V_V_WEEKPLAN_GUID);

        List<Map<String, Object>> pm_03list = (List) data.get("list");

        result.put("list", pm_03list);
        result.put("success", true);
        return result;
    }

    // 设备部，查询审批中和审批完成的页面
    @RequestMapping(value = "PM_03_PLAN_WEEK_SEL2", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_03_PLAN_WEEK_SEL2(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_WEEK") String V_V_WEEK,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
            @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
            @RequestParam(value = "V_V_CONTENT") String V_V_CONTENT,
            @RequestParam(value = "V_V_FLOWTYPE") String V_V_FLOWTYPE,
            @RequestParam(value = "V_V_STATE") String V_V_STATE,
            @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
            @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = dx_fileService.PM_03_PLAN_WEEK_SEL2(V_V_YEAR, V_V_MONTH, V_V_WEEK, V_V_ORGCODE, V_V_DEPTCODE,
                V_V_ZY, V_V_EQUTYPE, V_V_EQUCODE, V_V_CONTENT, V_V_FLOWTYPE, V_V_STATE, V_V_PAGE, V_V_PAGESIZE);

        List<Map<String, Object>> rlist = (List) data.get("list");
        String v_info = (String) data.get("total");
        result.put("list", rlist);
        result.put("total", v_info);
        result.put("success", true);
        return result;
    }

    // month report to sbb data
    @RequestMapping(value = "PM_03_MONTH_PLAN_BYPER_SEL2", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_03_MONTH_PLAN_BYPER_SEL2(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
            @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            @RequestParam(value = "V_V_CONTENT") String V_V_CONTENT,
            @RequestParam(value = "V_V_STATECODE") String V_V_STATECODE,
            @RequestParam(value = "V_V_PEROCDE") String V_V_PEROCDE,
            @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
            @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PM_03_MONTH_PLAN_BYPER_SEL2(V_V_YEAR, V_V_MONTH, V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE, V_V_EQUCODE, V_V_ZY, V_V_CONTENT, V_V_STATECODE, V_V_PEROCDE, V_V_PAGE, V_V_PAGESIZE);
        return result;
    }

    // month report to sbb data view   PM_03_MONTH_PLAN_SEL2
    @RequestMapping(value = "PM_03_MONTH_PLAN_SEL2", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_03_MONTH_PLAN_SEL2(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
            @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            @RequestParam(value = "V_V_CONTENT") String V_V_CONTENT,
            @RequestParam(value = "V_V_STATECODE") String V_V_STATECODE,
            @RequestParam(value = "V_V_PEROCDE") String V_V_PEROCDE,
            @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
            @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PM_03_MONTH_PLAN_SEL2(V_V_YEAR, V_V_MONTH, V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE, V_V_EQUCODE, V_V_ZY, V_V_CONTENT, V_V_STATECODE, V_V_PEROCDE, V_V_PAGE, V_V_PAGESIZE);
        return result;
    }

    //  SBB 月计划办理获取数据
    @RequestMapping(value = "PRO_PM_03_PLAN_MONTH_GET2", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_03_PLAN_MONTH_GET2(
            @RequestParam(value = "V_V_MONTHPLAN_GUID") String V_V_MONTHPLAN_GUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = dx_fileService.PRO_PM_03_PLAN_MONTH_GET2(V_V_MONTHPLAN_GUID);

        List<Map<String, Object>> pm_03list = (List) data.get("list");

        result.put("list", pm_03list);
        result.put("success", true);
        return result;
    }

    @RequestMapping(value = "INSERT_RESTARTPROC", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> INSERT_RESTARTPROC() throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        Map<String, Object> ret = dx_fileService.INSERT_RESTARTPROC();

        result.put("list", ret);
        result.put("success", true);
        return result;
    }


    /*
    CREATE BY HRB 2018/11/30
     */
    // 备件使用情况查询
    @RequestMapping(value = "PRO_SPARE_SELECT2", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_SPARE_SELECT2(@RequestParam(value = "V_D_ENTER_DATE_B") String V_D_ENTER_DATE_B,
                                                 @RequestParam(value = "V_D_ENTER_DATE_E") String V_D_ENTER_DATE_E,
                                                 @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                 @RequestParam(value = "V_V_DEPTNEXTCODE") String V_V_DEPTNEXTCODE,
                                                 @RequestParam(value = "V_EQUTYPE_CODE") String V_EQUTYPE_CODE,
                                                 @RequestParam(value = "V_EQU_CODE") String V_EQU_CODE,
                                                 @RequestParam(value = "V_V_SPARE") String V_V_SPARE,
                                                 HttpServletRequest request,
                                                 HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        HashMap data = dx_fileService.PRO_SPARE_SELECT2(V_D_ENTER_DATE_B, V_D_ENTER_DATE_E, V_V_DEPTCODE, V_V_DEPTNEXTCODE, V_EQUTYPE_CODE, V_EQU_CODE, V_V_SPARE);
        return setPage(request, response, data);
    }

    // 备件使用情况导出
    @RequestMapping(value = "/SPARESEL_EXCEL", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void SPARESEL_EXCEL(@RequestParam(value = "V_D_ENTER_DATE_B") String V_D_ENTER_DATE_B,
                               @RequestParam(value = "V_D_ENTER_DATE_E") String V_D_ENTER_DATE_E,
                               @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                               @RequestParam(value = "V_V_DEPTNEXTCODE") String V_V_DEPTNEXTCODE,
                               @RequestParam(value = "V_EQUTYPE_CODE") String V_EQUTYPE_CODE,
                               @RequestParam(value = "V_EQU_CODE") String V_EQU_CODE,
                               @RequestParam(value = "V_V_SPARE") String V_V_SPARE,
                               HttpServletRequest request,
                               HttpServletResponse response)
            throws SQLException {

        String V_V_DEPTNEXTCODE2 = V_V_DEPTNEXTCODE.equals("all") ? "%" : V_V_DEPTNEXTCODE;
        String V_EQUTYPE_CODE2 = V_EQUTYPE_CODE.equals("all") ? "%" : V_EQUTYPE_CODE;
        String V_EQU_CODE2 = V_EQU_CODE.equals("all") ? "%" : V_EQU_CODE;
        String V_V_SPARE2 = V_V_SPARE.equals("all") ? "%" : V_V_SPARE;
        List list = new ArrayList();

        Map<String, Object> data = dx_fileService.PRO_SPARE_SELECT2(V_D_ENTER_DATE_B, V_D_ENTER_DATE_E, V_V_DEPTCODE, V_V_DEPTNEXTCODE2, V_EQUTYPE_CODE2, V_EQU_CODE2, V_V_SPARE2);

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for (int i = 0; i <= 1; i++) {
            sheet.setColumnWidth(i, 3000);
        }
        HSSFRow row = sheet.createRow((int) 0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        HSSFCell cell = row.createCell((short) 0);
        cell.setCellValue("序号");
        cell.setCellStyle(style);

        cell = row.createCell((short) 1);
        cell.setCellValue("物料编码");
        cell.setCellStyle(style);

        cell = row.createCell((short) 2);
        cell.setCellValue("物料名称");
        cell.setCellStyle(style);

        cell = row.createCell((short) 3);
        cell.setCellValue("规格型号");
        cell.setCellStyle(style);

        cell = row.createCell((short) 4);
        cell.setCellValue("计量单位");
        cell.setCellStyle(style);

        cell = row.createCell((short) 5);
        cell.setCellValue("数量");
        cell.setCellStyle(style);

        cell = row.createCell((short) 6);
        cell.setCellValue("物料更换时间");
        cell.setCellStyle(style);

        cell = row.createCell((short) 7);
        cell.setCellValue("查看相关工单");
        cell.setCellStyle(style);

        if (data.size() > 0) {
            list = (List) data.get("list");


            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 1);
                Map map = (Map) list.get(i);

                row.createCell((short) 0).setCellValue(i + 1);
                row.createCell((short) 1).setCellValue(map.get("V_MATERIALCODE") == null ? "" : map.get("V_MATERIALCODE").toString());
                row.createCell((short) 2).setCellValue(map.get("V_MATERIALNAME") == null ? "" : map.get("V_MATERIALNAME").toString());
                row.createCell((short) 3).setCellValue(map.get("V_SPEC") == null ? "" : map.get("V_SPEC").toString());
                row.createCell((short) 4).setCellValue(map.get("V_UNIT") == null ? "" : map.get("V_UNIT").toString());
                row.createCell((short) 5).setCellValue(map.get("F_NUMBER") == null ? "" : map.get("F_NUMBER").toString());
                row.createCell((short) 6).setCellValue(map.get("D_FACT_FINISH_DATE") == null ? "" : map.get("D_FACT_FINISH_DATE").toString());
                row.createCell((short) 7).setCellValue(map.get("V_XGGD") == null ? "" : map.get("V_XGGD").toString());

            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + URLEncoder.encode("设备物料消耗Excel.xls", "UTF-8"));
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    // 备件使用情况工单明细查询
    @RequestMapping(value = "PRO_SPARE_SELECT_WORKORDER", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_SPARE_SELECT_WORKORDER(@RequestParam(value = "V_D_ENTER_DATE_B") String V_D_ENTER_DATE_B,
                                                          @RequestParam(value = "V_D_ENTER_DATE_E") String V_D_ENTER_DATE_E,
                                                          @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                          @RequestParam(value = "V_V_DEPTNEXTCODE") String V_V_DEPTNEXTCODE,
                                                          @RequestParam(value = "V_EQUTYPE_CODE") String V_EQUTYPE_CODE,
                                                          @RequestParam(value = "V_EQU_CODE") String V_EQU_CODE,
                                                          @RequestParam(value = "V_V_SPARE") String V_V_SPARE,
                                                          @RequestParam(value = "V_V_SAPRECODE") String V_V_SAPRECODE,
                                                          HttpServletRequest request,
                                                          HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        HashMap data = dx_fileService.PRO_SPARE_SELECT_WORKORDER(V_D_ENTER_DATE_B, V_D_ENTER_DATE_E, V_V_DEPTCODE, V_V_DEPTNEXTCODE, V_EQUTYPE_CODE, V_EQU_CODE, V_V_SPARE, V_V_SAPRECODE);
        return setPage(request, response, data);
    }


    // 备件使用情况工单明细导出
    @RequestMapping(value = "/SPARESELWORK_EXCEL", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void SPARESELWORK_EXCEL(@RequestParam(value = "V_D_ENTER_DATE_B") String V_D_ENTER_DATE_B,
                                   @RequestParam(value = "V_D_ENTER_DATE_E") String V_D_ENTER_DATE_E,
                                   @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                   @RequestParam(value = "V_V_DEPTNEXTCODE") String V_V_DEPTNEXTCODE,
                                   @RequestParam(value = "V_EQUTYPE_CODE") String V_EQUTYPE_CODE,
                                   @RequestParam(value = "V_EQU_CODE") String V_EQU_CODE,
                                   @RequestParam(value = "V_V_SPARE") String V_V_SPARE,
                                   @RequestParam(value = "V_V_SAPRECODE") String V_V_SAPRECODE,
                                   HttpServletRequest request,
                                   HttpServletResponse response)
            throws SQLException {

        String V_V_DEPTNEXTCODE2 = V_V_DEPTNEXTCODE.equals("all") ? "%" : V_V_DEPTNEXTCODE;
        String V_EQUTYPE_CODE2 = V_EQUTYPE_CODE.equals("all") ? "%" : V_EQUTYPE_CODE;
        String V_EQU_CODE2 = V_EQU_CODE.equals("all") ? "%" : V_EQU_CODE;
        String V_V_SPARE2 = V_V_SPARE.equals("K") ? "%" : V_V_SPARE;
        List list = new ArrayList();

        Map<String, Object> data = dx_fileService.PRO_SPARE_SELECT_WORKORDER(V_D_ENTER_DATE_B, V_D_ENTER_DATE_E, V_V_DEPTCODE, V_V_DEPTNEXTCODE2, V_EQUTYPE_CODE2, V_EQU_CODE2, V_V_SPARE2, V_V_SAPRECODE);

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for (int i = 0; i <= 1; i++) {
            sheet.setColumnWidth(i, 3000);
        }
        HSSFRow row = sheet.createRow((int) 0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        HSSFCell cell = row.createCell((short) 0);
        cell.setCellValue("序号");
        cell.setCellStyle(style);
        cell = row.createCell((short) 1);
        cell.setCellValue("工单号");
        cell.setCellStyle(style);
        cell = row.createCell((short) 2);
        cell.setCellValue("工单描述");
        cell.setCellStyle(style);
        cell = row.createCell((short) 3);
        cell.setCellValue("设备位置");
        cell.setCellStyle(style);
        cell = row.createCell((short) 4);
        cell.setCellValue("设备名称");
        cell.setCellStyle(style);
        cell = row.createCell((short) 5);
        cell.setCellValue("备件消耗");
        cell.setCellStyle(style);
        cell = row.createCell((short) 6);
        cell.setCellValue("委托单位");
        cell.setCellStyle(style);
        cell = row.createCell((short) 7);
        cell.setCellValue("委托人");
        cell.setCellStyle(style);
        cell = row.createCell((short) 8);
        cell.setCellValue("委托时间");
        cell.setCellStyle(style);
        cell = row.createCell((short) 9);
        cell.setCellValue("实际结束时间");
        cell.setCellStyle(style);
        cell = row.createCell((short) 10);
        cell.setCellValue("检修单位");
        cell.setCellStyle(style);
        cell = row.createCell((short) 11);
        cell.setCellValue("工单类型");
        cell.setCellStyle(style);
        cell = row.createCell((short) 12);
        cell.setCellValue("工单状态");
        cell.setCellStyle(style);

        if (data.size() > 0) {
            list = (List) data.get("list");


            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 1);
                Map map = (Map) list.get(i);

                row.createCell((short) 0).setCellValue(i + 1);
                row.createCell((short) 1).setCellValue(map.get("V_ORDERID") == null ? "" : map.get("V_ORDERID").toString());
                row.createCell((short) 2).setCellValue(map.get("V_SHORT_TXT") == null ? "" : map.get("V_SHORT_TXT").toString());
                row.createCell((short) 3).setCellValue(map.get("V_EQUSITENAME") == null ? "" : map.get("V_EQUSITENAME").toString());
                row.createCell((short) 4).setCellValue(map.get("V_EQUIP_NAME") == null ? "" : map.get("V_EQUIP_NAME").toString());
                row.createCell((short) 5).setCellValue(map.get("V_SPARE") == null ? "" : map.get("V_SPARE").toString());
                row.createCell((short) 6).setCellValue(map.get("V_DEPTNAME") == null ? "" : map.get("V_DEPTNAME").toString());
                row.createCell((short) 7).setCellValue(map.get("V_PERSONNAME") == null ? "" : map.get("V_PERSONNAME").toString());
                row.createCell((short) 8).setCellValue(map.get("D_ENTER_DATE") == null ? "" : map.get("D_ENTER_DATE").toString());
                row.createCell((short) 9).setCellValue(map.get("D_FACT_FINISH_DATE") == null ? "" : map.get("D_FACT_FINISH_DATE").toString());
                row.createCell((short) 10).setCellValue(map.get("V_DEPTNAMEREPARIR") == null ? "" : map.get("V_DEPTNAMEREPARIR").toString());
                row.createCell((short) 11).setCellValue(map.get("V_ORDER_TYP_TXT") == null ? "" : map.get("V_ORDER_TYP_TXT").toString());
                row.createCell((short) 12).setCellValue(map.get("V_STATENAME") == null ? "" : map.get("V_STATENAME").toString());

            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + URLEncoder.encode("备件使用情况工单明细表Excel.xls", "UTF-8"));
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    //  大修含返回数量的查询机具，物料，工具等数据
    @RequestMapping(value = "PRO_YEAR_PROJECT_MXUSE_SEL2", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_YEAR_PROJECT_MXUSE_SEL(
            @RequestParam(value = "V_V_PROJECT_GUID") String V_V_PROJECT_GUID,
            @RequestParam(value = "V_V_TYPE") String V_V_TYPE,
            @RequestParam(value = "V_SDATE") String V_SDATE,
            @RequestParam(value = "V_EDATE") String V_EDATE)
            throws Exception {

        Map result = dx_fileService.PRO_YEAR_PROJECT_MXUSE_SEL2(V_V_PROJECT_GUID, V_V_TYPE, V_SDATE, V_EDATE);
        return result;
    }

    // 大修返回工单明细
    @RequestMapping(value = "PRO_YEAR_PROJECT_WORKORDER_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_YEAR_PROJECT_WORKORDER_SEL(
            @RequestParam(value = "V_V_PROJECTGUID") String V_V_PROJECTGUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PRO_YEAR_PROJECT_WORKORDER_SEL(V_V_PROJECTGUID);
        return result;
    }

    // 大修返回缺陷明细
    @RequestMapping(value = "PRO_YEAR_PROJECT_DEFECT_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_YEAR_PROJECT_DEFECT_SEL(
            @RequestParam(value = "V_V_PROJECTGUID") String V_V_PROJECTGUID,
            @RequestParam(value = "V_SDATE") String V_SDATE,
            @RequestParam(value = "V_EDATE") String V_EDATE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PRO_YEAR_PROJECT_DEFECT_SEL(V_V_PROJECTGUID, V_SDATE, V_EDATE);
        return result;
    }

    // 周计划按人员查询作业区全部
    @RequestMapping(value = "PRO_PM_03_PLAN_WEEK_VIEW2", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_03_PLAN_WEEK_VIEW2(@RequestParam(value = "V_V_YEAR") String V_V_YEAR,
                                                         @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
                                                         @RequestParam(value = "V_V_WEEK") String V_V_WEEK,
                                                         @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                         @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                                         @RequestParam(value = "V_V_ZY") String V_V_ZY,
                                                         @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
                                                         @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                         @RequestParam(value = "V_V_CONTENT") String V_V_CONTENT,
                                                         @RequestParam(value = "V_V_STATE") String V_V_STATE,
                                                         @RequestParam(value = "V_V_PERSONCODE") String V_V_PERSONCODE,
                                                         @RequestParam(value = "V_V_DEPTTYPE") String V_V_DEPTTYPE,
                                                         @RequestParam(value = "V_V_INPER") String V_V_INPER,
                                                         @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
                                                         @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
                                                         HttpServletRequest request,
                                                         HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();


        HashMap data = dx_fileService.PRO_PM_03_PLAN_WEEK_VIEW2(V_V_YEAR, V_V_MONTH, V_V_WEEK, V_V_ORGCODE, V_V_DEPTCODE,
                V_V_ZY, V_V_EQUTYPE, V_V_EQUCODE, V_V_CONTENT, V_V_STATE, V_V_PERSONCODE, V_V_DEPTTYPE, V_V_INPER, V_V_PAGE, V_V_PAGESIZE);
        return data;
    }

    // 设备部驳回修改
    @RequestMapping(value = "PRO_PM_03_PLAN_WEEK_NSETSBB", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_03_PLAN_WEEK_NSETSBB(
            @RequestParam(value = "V_V_INPER") String V_V_INPER,
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_WEEK") String V_V_WEEK,

            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_EQUTYPECODE") String V_V_EQUTYPECODE,
            @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
            @RequestParam(value = "V_V_REPAIRMAJOR_CODE") String V_V_REPAIRMAJOR_CODE,

            @RequestParam(value = "V_V_CONTENT") String V_V_CONTENT,
            @RequestParam(value = "V_V_STARTTIME") String V_V_STARTTIME,
            @RequestParam(value = "V_V_ENDTIME") String V_V_ENDTIME,
            @RequestParam(value = "V_V_OTHERPLAN_GUID") String V_V_OTHERPLAN_GUID,
            @RequestParam(value = "V_V_OTHERPLAN_TYPE") String V_V_OTHERPLAN_TYPE,

            @RequestParam(value = "V_V_JHMX_GUID") String V_V_JHMX_GUID,
            @RequestParam(value = "V_V_HOUR") String V_V_HOUR,
            @RequestParam(value = "V_V_BZ") String V_V_BZ,
            @RequestParam(value = "V_V_DEFECTGUID") String V_V_DEFECTGUID,
            @RequestParam(value = "V_V_MAIN_DEFECT") String V_V_MAIN_DEFECT,
            @RequestParam(value = "V_V_EXPECT_AGE") String V_V_EXPECT_AGE,
            @RequestParam(value = "V_V_REPAIR_PER") String V_V_REPAIR_PER,

            @RequestParam(value = "V_V_PDC") String V_V_PDC,
            @RequestParam(value = "V_V_GYYQ") String V_V_GYYQ,
            @RequestParam(value = "V_V_CHANGPDC") String V_V_CHANGPDC,
            @RequestParam(value = "V_V_JXHOUR") String V_V_JXHOUR,
            @RequestParam(value = "V_V_JJHOUR") String V_V_JJHOUR,
            @RequestParam(value = "V_V_TELNAME") String V_V_TELNAME,
            @RequestParam(value = "V_V_TELNUMB") String V_V_TELNUMB,
            @RequestParam(value = "V_V_PDGG") String V_V_PDGG,
            @RequestParam(value = "V_V_THICKNESS") String V_V_THICKNESS,
            @RequestParam(value = "V_V_REASON") String V_V_REASON,
            @RequestParam(value = "V_V_EVERTIME") String V_V_EVERTIME,
            @RequestParam(value = "V_V_FLAG") String V_V_FLAG,
            @RequestParam(value = "V_V_RDEPATCODE") String V_V_RDEPATCODE,
            @RequestParam(value = "V_V_RDEPATNAME") String V_V_RDEPATNAME,
            @RequestParam(value = "V_V_SGWAY") String V_V_SGWAY,
            @RequestParam(value = "V_V_SGWAYNAME") String V_V_SGWAYNAME,
            @RequestParam(value = "V_V_OPERANAME") String V_V_OPERANAME,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PRO_PM_03_PLAN_WEEK_NSETSBB(
                V_V_INPER,
                V_V_GUID,
                V_V_YEAR,
                V_V_MONTH,
                V_V_WEEK,

                V_V_ORGCODE,
                V_V_DEPTCODE,
                V_V_EQUTYPECODE,
                V_V_EQUCODE,
                V_V_REPAIRMAJOR_CODE,

                V_V_CONTENT,
                V_V_STARTTIME,
                V_V_ENDTIME,
                V_V_OTHERPLAN_GUID,
                V_V_OTHERPLAN_TYPE,

                V_V_JHMX_GUID,
                V_V_HOUR,
                V_V_BZ,
                V_V_DEFECTGUID,
                V_V_MAIN_DEFECT,
                V_V_EXPECT_AGE,
                V_V_REPAIR_PER
                , V_V_PDC,
                V_V_GYYQ,
                V_V_CHANGPDC,
                V_V_JXHOUR,
                V_V_JJHOUR,
                V_V_TELNAME,
                V_V_TELNUMB,
                V_V_PDGG, V_V_THICKNESS, V_V_REASON, V_V_EVERTIME,
                V_V_FLAG,
                V_V_RDEPATCODE,
                V_V_RDEPATNAME,
                V_V_SGWAY,
                V_V_SGWAYNAME, V_V_OPERANAME);

        return result;
    }

    // 设备部月计划驳回修改保存
    @RequestMapping(value = "PRO_PM_03_PLAN_MONTH_SETSBB", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_03_PLAN_MONTH_SETSBB(
            @RequestParam(value = "V_V_INPER") String V_V_INPER,
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_EQUTYPECODE") String V_V_EQUTYPECODE,
            @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
            @RequestParam(value = "V_V_REPAIRMAJOR_CODE") String V_V_REPAIRMAJOR_CODE,
            @RequestParam(value = "V_V_CONTENT") String V_V_CONTENT,
            @RequestParam(value = "V_V_STARTTIME") String V_V_STARTTIME,
            @RequestParam(value = "V_V_ENDTIME") String V_V_ENDTIME,
            @RequestParam(value = "V_V_OTHERPLAN_GUID") String V_V_OTHERPLAN_GUID,
            @RequestParam(value = "V_V_OTHERPLAN_TYPE") String V_V_OTHERPLAN_TYPE,
            @RequestParam(value = "V_V_JHMX_GUID") String V_V_JHMX_GUID,
            @RequestParam(value = "V_V_HOUR") String V_V_HOUR,
            @RequestParam(value = "V_V_BZ") String V_V_BZ,
            @RequestParam(value = "V_V_MAIN_DEFECT") String V_V_MAIN_DEFECT,
            @RequestParam(value = "V_V_EXPECT_AGE") String V_V_EXPECT_AGE,
            @RequestParam(value = "V_V_REPAIR_PER") String V_V_REPAIR_PER,
            //2018-11-21
            @RequestParam(value = "V_V_SGWAY") String V_V_SGWAY,
            @RequestParam(value = "V_V_SGWAYNAME") String V_V_SGWAYNAME,
            @RequestParam(value = "V_V_FLAG") String V_V_FLAG,
            @RequestParam(value = "V_V_OPERANAME") String V_V_OPERANAME,

            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PRO_PM_03_PLAN_MONTH_SETSBB(
                V_V_INPER,
                V_V_GUID,
                V_V_YEAR,
                V_V_MONTH,
                V_V_ORGCODE,
                V_V_DEPTCODE,
                V_V_EQUTYPECODE,
                V_V_EQUCODE,
                V_V_REPAIRMAJOR_CODE,
                V_V_CONTENT,
                V_V_STARTTIME,
                V_V_ENDTIME,
                V_V_OTHERPLAN_GUID,
                V_V_OTHERPLAN_TYPE,
                V_V_JHMX_GUID,
                V_V_HOUR,
                V_V_BZ,
                V_V_MAIN_DEFECT,
                V_V_EXPECT_AGE,
                V_V_REPAIR_PER,
                V_V_SGWAY,
                V_V_SGWAYNAME,
                V_V_FLAG,
                V_V_OPERANAME);
        return result;
    }

    // 大修生成工单查询
    @RequestMapping(value = "PM_PROJECT_WORKORDER_CREATE", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PROJECT_WORKORDER_CREATE(
            @RequestParam(value = "V_V_PROJECT_GUID") String V_V_PROJECT_GUID,
            @RequestParam(value = "V_V_INPERCODE") String V_V_INPERCODE,
            HttpServletResponse response,
            HttpServletRequest request)
            throws SQLException {
        Map result = dx_fileService.PM_PROJECT_WORKORDER_CREATE(V_V_PROJECT_GUID, V_V_INPERCODE);
        return result;
    }

    @RequestMapping(value = "PM_1917_JXMX_DATA_SEL_WORKDESC", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_1917_JXMX_DATA_SEL_WORKDESC(@RequestParam(value = "V_V_MX_CODE") String V_V_MX_CODE)
            throws SQLException {
        Map result = dx_fileService.PM_1917_JXMX_DATA_SEL_WORKDESC(V_V_MX_CODE);
        return result;
    }

    @RequestMapping(value = "PRO_YEAR_PROJECT_SEL_WORK", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_YEAR_PROJECT_SEL_WORK(@RequestParam(value = "DX_GUID") String DX_GUID,
                                         @RequestParam(value = "STARTTIME") String STARTTIME,
                                         @RequestParam(value = "ENDTIME") String ENDTIME)
            throws SQLException {
        Map result = dx_fileService.PRO_YEAR_PROJECT_SEL_WORK(DX_GUID, STARTTIME, ENDTIME);
        return result;
    }

    // 大修工单施工方--工单所有检修单位
    @RequestMapping(value = "PRO_YEAR_PROJECT_REDEPT_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_YEAR_PROJECT_REDEPT_SEL(
            @RequestParam(value = "V_V_PROJECTGUID") String V_V_PROJECTGUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PRO_YEAR_PROJECT_REDEPT_SEL(V_V_PROJECTGUID);
        return result;
    }

    //大修施工方
    @RequestMapping(value = "PM_03_PLAN_REPAIR_DEPT_SEL2", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_PLAN_REPAIR_DEPT_SEL2(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PM_03_PLAN_REPAIR_DEPT_SEL2(V_V_GUID);
        return result;
    }

    //-大修 查询物资消耗
//    @RequestMapping(value = "PRO_YEAR_PROJECT_SEL_WORKGUID", method = RequestMethod.POST)
//    @ResponseBody
//    public Map PRO_YEAR_PROJECT_SEL_WORKGUID(
//            @RequestParam(value = "V_V_GUID") String V_V_GUID,
//            @RequestParam(value = "STARTTIME") String STARTTIME,
//            @RequestParam(value = "ENDTIME") String ENDTIME,
//            HttpServletRequest request,
//            HttpServletResponse response) throws Exception {
//        Map result = dx_fileService.PRO_YEAR_PROJECT_SEL_WORKGUID(V_V_GUID,STARTTIME,ENDTIME);
//        return result;
//    }
    @RequestMapping(value = "PRO_YEAR_PROJECT_SEL_WH", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_YEAR_PROJECT_SEL_WH(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "STARTTIME") String STARTTIME,
            @RequestParam(value = "ENDTIME") String ENDTIME,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map result = new HashMap();
        List listList = new ArrayList();
        List<Map> ret = new ArrayList<Map>();
        Map<String, Object> getguid = dx_fileService.PRO_YEAR_PROJECT_SEL_WORKGUID(V_V_GUID, STARTTIME, ENDTIME);

        try {
            if (!getguid.isEmpty()) {
                listList = (List) getguid.get("list");
                Map Mdate = new HashMap();
                for (int i = 0; i < getguid.size(); i++) {
                    Map map = (Map) listList.get(i);

                    Client client = new Client(new URL(MMEquurl));
                    Object[] results = client.invoke("getBillMaterialByOrder", new Object[]{map.get("V_ORDERGUID")});
                    Document doc = DocumentHelper.parseText(results[0].toString());
                    Element rootElt = doc.getRootElement();
                    Iterator iter = rootElt.elementIterator("Bill");
                    List<Map> list = new ArrayList<Map>();

                    while (iter.hasNext()) {
                        Element recordEle = (Element) iter.next();
                        Mdate.put("orderguid", map.get("V_ORDERGUID"));
                        Mdate.put("billcode", recordEle.elementTextTrim("billcode"));
                        Mdate.put("vch_sparepart_code", recordEle.elementTextTrim("vch_sparepart_code"));
                        Mdate.put("vch_sparepart_name", recordEle.elementTextTrim("vch_sparepart_name"));
                        Mdate.put("vch_type", recordEle.elementTextTrim("vch_type"));
                        Mdate.put("vch_unit", recordEle.elementTextTrim("vch_unit"));
                        Mdate.put("price", recordEle.elementTextTrim("price"));
                        Mdate.put("f_number", recordEle.elementTextTrim("f_number"));
                        Mdate.put("BillType", recordEle.elementTextTrim("BillType"));
                        ret.add(Mdate);
                    }
                }
            }
            result.put("ret", ret);
        } catch (MalformedURLException e) {
            result.put("ret", "Fail");
            e.printStackTrace();
        } catch (Exception e) {
            result.put("ret", "Fail");
            e.printStackTrace();
        }
        return result;
    }

    // 月计划厂矿执行率
    @RequestMapping(value = "PM_03_MONTH_PLAN_CKSTAT_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_MONTH_PLAN_CKSTAT_SEL(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PM_03_MONTH_PLAN_CKSTAT_SEL(V_V_YEAR, V_V_MONTH, V_V_ORGCODE);
        return result;
    }

    @RequestMapping(value = "CK_MONTH_STATE_EXCEL", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void CK_MONTH_STATE_EXCEL(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws SQLException {

        String V_ORGCODE = V_V_ORGCODE.equals("0") ? "%" : V_V_ORGCODE;
        List list = new ArrayList();

        Map<String, Object> data = dx_fileService.PM_03_MONTH_PLAN_CKSTAT_SEL(V_V_YEAR, V_V_MONTH, V_ORGCODE);

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for (int i = 0; i <= 1; i++) {
            sheet.setColumnWidth(i, 3000);
        }
        HSSFRow row = sheet.createRow((int) 0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        HSSFCell cell = row.createCell((short) 0);
        cell.setCellValue("序号");
        cell.setCellStyle(style);

        cell = row.createCell((short) 1);
        cell.setCellValue("厂矿");
        cell.setCellStyle(style);

        cell = row.createCell((short) 2);
        cell.setCellValue("总数");
        cell.setCellStyle(style);

        cell = row.createCell((short) 3);
        cell.setCellValue("执行数");
        cell.setCellStyle(style);

        cell = row.createCell((short) 4);
        cell.setCellValue("执行率（%）");
        cell.setCellStyle(style);

        if (data.size() > 0) {
            list = (List) data.get("list");


            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 1);
                Map map = (Map) list.get(i);

                row.createCell((short) 0).setCellValue(i + 1);
                row.createCell((short) 1).setCellValue(map.get("V_ORGNAME") == null ? "" : map.get("V_ORGNAME").toString());
                row.createCell((short) 2).setCellValue(map.get("ALLNUM") == null ? "" : map.get("ALLNUM").toString());
                row.createCell((short) 3).setCellValue(map.get("EXENUM") == null ? "" : map.get("EXENUM").toString());
                row.createCell((short) 4).setCellValue(map.get("EXTRATE") == null ? "" : map.get("EXTRATE").toString());

            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + URLEncoder.encode("月计划厂矿执行率Excel.xls", "UTF-8"));
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    // 周计划厂矿执行率
    @RequestMapping(value = "PM_03_WEEK_PLAN_CKSTAT_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_WEEK_PLAN_CKSTAT_SEL(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_WEEK") String V_V_WEEK,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PM_03_WEEK_PLAN_CKSTAT_SEL(V_V_YEAR, V_V_MONTH, V_V_WEEK, V_V_ORGCODE);
        return result;
    }

    @RequestMapping(value = "CK_WEEK_STATE_EXCEL", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void CK_WEEK_STATE_EXCEL(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_WEEK") String V_V_WEEK,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws SQLException {

        String V_ORGCODE = V_V_ORGCODE.equals("0") ? "%" : V_V_ORGCODE;
        List list = new ArrayList();

        Map<String, Object> data = dx_fileService.PM_03_WEEK_PLAN_CKSTAT_SEL(V_V_YEAR, V_V_MONTH, V_V_WEEK, V_ORGCODE);

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for (int i = 0; i <= 1; i++) {
            sheet.setColumnWidth(i, 3000);
        }
        HSSFRow row = sheet.createRow((int) 0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        HSSFCell cell = row.createCell((short) 0);
        cell.setCellValue("序号");
        cell.setCellStyle(style);

        cell = row.createCell((short) 1);
        cell.setCellValue("厂矿");
        cell.setCellStyle(style);

        cell = row.createCell((short) 2);
        cell.setCellValue("总数");
        cell.setCellStyle(style);

        cell = row.createCell((short) 3);
        cell.setCellValue("执行数");
        cell.setCellStyle(style);

        cell = row.createCell((short) 4);
        cell.setCellValue("执行率（%）");
        cell.setCellStyle(style);

        if (data.size() > 0) {
            list = (List) data.get("list");


            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 1);
                Map map = (Map) list.get(i);

                row.createCell((short) 0).setCellValue(i + 1);
                row.createCell((short) 1).setCellValue(map.get("V_ORGNAME") == null ? "" : map.get("V_ORGNAME").toString());
                row.createCell((short) 2).setCellValue(map.get("ALLNUM") == null ? "" : map.get("ALLNUM").toString());
                row.createCell((short) 3).setCellValue(map.get("EXENUM") == null ? "" : map.get("EXENUM").toString());
                row.createCell((short) 4).setCellValue(map.get("EXTRATE") == null ? "" : map.get("EXTRATE").toString());

            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + URLEncoder.encode("周计划厂矿执行率Excel.xls", "UTF-8"));
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }


    // 月计划作业区执行率
    @RequestMapping(value = "PM_03_MONTH_PLAN_ZYQSTAT_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_MONTH_PLAN_ZYQSTAT_SEL(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PM_03_MONTH_PLAN_ZYQSTAT_SEL(V_V_YEAR, V_V_MONTH, V_V_ORGCODE);
        return result;
    }

    // 周计划作业区执行率
    @RequestMapping(value = "PM_03_WEEK_PLAN_ZYQSTAT_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_WEEK_PLAN_ZYQSTAT_SEL(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_WEEK") String V_V_WEEK,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        HashMap data = dx_fileService.PM_03_WEEK_PLAN_ZYQSTAT_SEL(V_V_YEAR, V_V_MONTH, V_V_WEEK, V_V_ORGCODE);
        return setPage(request, response, data);
    }

    @RequestMapping(value = "ZYQ_MONTH_STATE_EXCEL", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void ZYQ_MONTH_STATE_EXCEL(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws SQLException {

        String V_ORGCODE = V_V_ORGCODE.equals("0") ? "" : V_V_ORGCODE;
        List list = new ArrayList();

        Map<String, Object> data = dx_fileService.PM_03_MONTH_PLAN_ZYQSTAT_SEL(V_V_YEAR, V_V_MONTH, V_ORGCODE);

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for (int i = 0; i <= 1; i++) {
            sheet.setColumnWidth(i, 3000);
        }
        HSSFRow row = sheet.createRow((int) 0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        HSSFCell cell = row.createCell((short) 0);
        cell.setCellValue("序号");
        cell.setCellStyle(style);

        cell = row.createCell((short) 1);
        cell.setCellValue("厂矿");
        cell.setCellStyle(style);

        cell = row.createCell((short) 2);
        cell.setCellValue("总数");
        cell.setCellStyle(style);

        cell = row.createCell((short) 3);
        cell.setCellValue("执行数");
        cell.setCellStyle(style);

        cell = row.createCell((short) 4);
        cell.setCellValue("执行率（%）");
        cell.setCellStyle(style);

        if (data.size() > 0) {
            list = (List) data.get("list");


            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 1);
                Map map = (Map) list.get(i);

                row.createCell((short) 0).setCellValue(i + 1);
                row.createCell((short) 1).setCellValue(map.get("V_DEPTNAME") == null ? "" : map.get("V_DEPTNAME").toString());
                row.createCell((short) 2).setCellValue(map.get("ALLNUM") == null ? "" : map.get("ALLNUM").toString());
                row.createCell((short) 3).setCellValue(map.get("EXENUM") == null ? "" : map.get("EXENUM").toString());
                row.createCell((short) 4).setCellValue(map.get("EXTRATE") == null ? "" : map.get("EXTRATE").toString());

            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + URLEncoder.encode("月计划作业区执行率Excel.xls", "UTF-8"));
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @RequestMapping(value = "ZYQ_WEEK_STATE_EXCEL", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void ZYQ_WEEK_STATE_EXCEL(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_WEEK") String V_V_WEEK,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws SQLException {

        String V_ORGCODE = V_V_ORGCODE.equals("0") ? "" : V_V_ORGCODE;
        List list = new ArrayList();

        Map<String, Object> data = dx_fileService.PM_03_WEEK_PLAN_ZYQSTAT_SEL(V_V_YEAR, V_V_MONTH, V_V_WEEK, V_ORGCODE);

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for (int i = 0; i <= 1; i++) {
            sheet.setColumnWidth(i, 3000);
        }
        HSSFRow row = sheet.createRow((int) 0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        HSSFCell cell = row.createCell((short) 0);
        cell.setCellValue("序号");
        cell.setCellStyle(style);

        cell = row.createCell((short) 1);
        cell.setCellValue("厂矿");
        cell.setCellStyle(style);

        cell = row.createCell((short) 2);
        cell.setCellValue("总数");
        cell.setCellStyle(style);

        cell = row.createCell((short) 3);
        cell.setCellValue("执行数");
        cell.setCellStyle(style);

        cell = row.createCell((short) 4);
        cell.setCellValue("执行率（%）");
        cell.setCellStyle(style);

        if (data.size() > 0) {
            list = (List) data.get("list");


            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 1);
                Map map = (Map) list.get(i);

                row.createCell((short) 0).setCellValue(i + 1);
                row.createCell((short) 1).setCellValue(map.get("V_DEPTNAME") == null ? "" : map.get("V_DEPTNAME").toString());
                row.createCell((short) 2).setCellValue(map.get("V_ALLNUM") == null ? "" : map.get("V_ALLNUM").toString());
                row.createCell((short) 3).setCellValue(map.get("V_EXENUM") == null ? "" : map.get("V_EXENUM").toString());
                row.createCell((short) 4).setCellValue(map.get("V_EXTRATE") == null ? "" : map.get("V_EXTRATE").toString());

            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + URLEncoder.encode("周计划作业区执行率Excel.xls", "UTF-8"));
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }


    @RequestMapping(value = "PRO_PM_DEPT_SORT", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_DEPT_SORT(
            @RequestParam(value = "V_D_ENTER_DATE_B") String V_D_ENTER_DATE_B,
            @RequestParam(value = "V_D_ENTER_DATE_E") String V_D_ENTER_DATE_E,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,

            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PRO_PM_DEPT_SORT(V_D_ENTER_DATE_B, V_D_ENTER_DATE_E, V_V_ORGCODE);
        return data;
    }

    @RequestMapping(value = "PRO_PM_ORG_SORT", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_ORG_SORT(
            @RequestParam(value = "V_D_ENTER_DATE_B") String V_D_ENTER_DATE_B,
            @RequestParam(value = "V_D_ENTER_DATE_E") String V_D_ENTER_DATE_E,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PRO_PM_ORG_SORT(V_D_ENTER_DATE_B, V_D_ENTER_DATE_E);
        return data;
    }

    @RequestMapping(value = "PRO_03_PLAN_YEAR_GET", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_03_PLAN_YEAR_GET(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_ZYCODE") String V_V_ZYCODE,
            @RequestParam(value = "V_V_CXCODE") String V_V_CXCODE,
            @RequestParam(value = "V_V_YEARNAME") String V_V_YEARNAME,
            @RequestParam(value = "V_V_PERNAME") String V_V_PERNAME,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
            @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
            @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PRO_03_PLAN_YEAR_GET(V_V_YEAR, V_V_ORGCODE, V_V_DEPTCODE,V_V_ZYCODE,V_V_CXCODE,V_V_YEARNAME,V_V_PERNAME,V_V_PERCODE,V_V_PAGE,V_V_PAGESIZE);
        return data;
    }

    @RequestMapping(value = "PRO_YEAR_TO_MONTH_GETY_BYM", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_YEAR_TO_MONTH_GETY_BYM(
            @RequestParam(value = "V_V_MONTHGUID") String V_V_MONTHGUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PRO_YEAR_TO_MONTH_GETY_BYM(V_V_MONTHGUID);
        return data;
    }


    // 计划模型修改
    @RequestMapping(value = "PM_1921_PLAN_MX_DATA_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_1921_PLAN_MX_DATA_UPDATE(
            @RequestParam(value = "V_V_MX_CODE") String V_V_MX_CODE,
            @RequestParam(value = "V_V_PERNUM") String V_V_PERNUM,
            @RequestParam(value = "V_V_LIFELONG") String V_V_LIFELONG,

            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_1921_PLAN_MX_DATA_UPDATE(V_V_MX_CODE, V_V_PERNUM, V_V_LIFELONG);
        return data;
    }

    //-年计划检修类别下拉列表
    @RequestMapping(value = "PM_YEAR_REPARI_SELECT", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_YEAR_REPARI_SELECT(
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_YEAR_REPARI_SELECT();
        return data;
    }

    // 年计划-计划模型选择
    @RequestMapping(value = "PM_PLAN_YEAR_GETMX_INSERT", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_GETMX_INSERT(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_REPAIRTYPE") String V_V_REPAIRTYPE,
            @RequestParam(value = "V_V_PLANTYPE") String V_V_PLANTYPE,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_SUNTIME") String V_V_SUNTIME,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_GETMX_INSERT(V_V_GUID, V_V_ORGCODE, V_V_DEPTCODE, V_V_REPAIRTYPE, V_V_PLANTYPE, V_V_PERCODE, V_V_YEAR, V_V_MONTH, V_V_SUNTIME);
        return data;
    }

    // 年计划查询
    @RequestMapping(value = "PM_PLAN_YEAR_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_SEL(
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_SEL(V_V_ORGCODE, V_V_DEPTCODE, V_V_PERCODE, V_V_ZY);
        return data;
    }

    // 年计划查询
    @RequestMapping(value = "PM_PLAN_YEAR_SEL_N", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_SEL_N(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_SEL_N(V_V_YEAR,V_V_ORGCODE, V_V_DEPTCODE, V_V_PERCODE, V_V_ZY);
        return data;
    }

    // 年计划查询导出
    @RequestMapping(value = "YEAR_EXPORT_EXCEL", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void YEAR_EXPORT_EXCEL(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            HttpServletRequest request,
            HttpServletResponse response) throws SQLException {

        List list = new ArrayList();

        Map<String, Object> data = dx_fileService.PM_PLAN_YEAR_SEL_N(V_V_YEAR,V_V_ORGCODE, V_V_DEPTCODE, V_V_PERCODE, V_V_ZY);

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for (int i = 0; i <= 1; i++) {
            sheet.setColumnWidth(i, 3000);
        }
        HSSFRow row = sheet.createRow((int) 0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        HSSFCell cell = row.createCell((short) 0);
        cell.setCellValue("序号");
        cell.setCellStyle(style);

        cell = row.createCell((short) 1);
        cell.setCellValue("计划状态");
        cell.setCellStyle(style);

        cell = row.createCell((short) 2);
        cell.setCellValue("项目名称");
        cell.setCellStyle(style);

        cell = row.createCell((short) 3);
        cell.setCellValue("年份");
        cell.setCellStyle(style);

        cell = row.createCell((short) 4);
        cell.setCellValue("计划停机月份");
        cell.setCellStyle(style);

        cell = row.createCell((short) 5);
        cell.setCellValue("厂矿");
        cell.setCellStyle(style);

        cell = row.createCell((short) 6);
        cell.setCellValue("车间名称");
        cell.setCellStyle(style);

        cell = row.createCell((short) 7);
        cell.setCellValue("专业");
        cell.setCellStyle(style);

        cell = row.createCell((short) 8);
        cell.setCellValue("设备名称");
        cell.setCellStyle(style);

        cell = row.createCell((short) 9);
        cell.setCellValue("检修内容");
        cell.setCellStyle(style);

        cell = row.createCell((short) 10);
        cell.setCellValue("计划工期（小时）");
        cell.setCellStyle(style);

        cell = row.createCell((short) 11);
        cell.setCellValue("检修类别");
        cell.setCellStyle(style);

        cell = row.createCell((short) 12);
        cell.setCellValue("录入人");
        cell.setCellStyle(style);

        cell = row.createCell((short) 13);
        cell.setCellValue("录入时间");
        cell.setCellStyle(style);

        if (data.size() > 0) {
            list = (List) data.get("RET");


            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 1);
                Map map = (Map) list.get(i);

                row.createCell((short) 0).setCellValue(i + 1);
                row.createCell((short) 1).setCellValue(map.get("STATENAME") == null ? "" : map.get("STATENAME").toString());
                row.createCell((short) 2).setCellValue(map.get("PRO_NAME") == null ? "" : map.get("PRO_NAME").toString());
                row.createCell((short) 3).setCellValue(map.get("V_YEAR") == null ? "" : map.get("V_YEAR").toString());
                row.createCell((short) 4).setCellValue(map.get("V_MONTH") == null ? "" : map.get("V_MONTH").toString());

                row.createCell((short) 5).setCellValue(map.get("ORGNAME") == null ? "" : map.get("ORGNAME").toString());
                row.createCell((short) 6).setCellValue(map.get("DEPTNAME") == null ? "" : map.get("DEPTNAME").toString());
                row.createCell((short) 7).setCellValue(map.get("ZYNAME") == null ? "" : map.get("ZYNAME").toString());

                row.createCell((short) 8).setCellValue(map.get("V_EQUNAME") == null ? "" : map.get("V_EQUNAME").toString());
                row.createCell((short) 9).setCellValue(map.get("REPAIRCONTENT") == null ? "" : map.get("REPAIRCONTENT").toString());

                row.createCell((short) 10).setCellValue(map.get("PLANHOUR") == null ? "" : map.get("PLANHOUR").toString());

                row.createCell((short) 11).setCellValue(map.get("REPAIRTYPENAME") == null ? "" : map.get("REPAIRTYPENAME").toString());
                row.createCell((short) 12).setCellValue(map.get("INPERNAME") == null ? "" : map.get("INPERNAME").toString());
                row.createCell((short) 13).setCellValue(map.get("INDATE") == null ? "" : map.get("INDATE").toString());

            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + URLEncoder.encode("年计划导出Excel.xls", "UTF-8"));
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    // 年计划单条数据返回
    @RequestMapping(value = "PM_PLAN_YEAR_GETONE_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_SEL(
            @RequestParam(value = "V_GUID") String V_GUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_GETONE_SEL(V_GUID);
        return data;
    }

    // 年计划添加和修改

    @RequestMapping(value = "PM_PLAN_YEAR_INSERT", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_INSERT(
            @RequestParam(value = "V_GUID") String V_GUID,
            @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
            @RequestParam(value = "V_ORGNAME") String V_ORGNAME,
            @RequestParam(value = "V_DEPTCODE") String V_DEPTCODE,
            @RequestParam(value = "V_DEPTNAME") String V_DEPTNAME,

            @RequestParam(value = "V_ZYCODE") String V_ZYCODE,
            @RequestParam(value = "V_ZYNAME") String V_ZYNAME,
            @RequestParam(value = "V_EQUCODE") String V_EQUCODE,
            @RequestParam(value = "V_EQUTYPE") String V_EQUTYPE,
            @RequestParam(value = "V_REPAIRCONTENT") String V_REPAIRCONTENT,

            @RequestParam(value = "V_PLANHOUR") String V_PLANHOUR,
            @RequestParam(value = "V_REPAIRTYPE") String V_REPAIRTYPE,
            @RequestParam(value = "V_REPAIRTYPENAME") String V_REPAIRTYPENAME,
            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
            @RequestParam(value = "V_INPERNAME") String V_INPERNAME,

            @RequestParam(value = "V_REMARK") String V_REMARK,
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_TGTIME") String V_TGTIME,
            @RequestParam(value = "V_JGTIME") String V_JGTIME,
            @RequestParam(value = "V_WXTYPECODE") String V_WXTYPECODE,
            @RequestParam(value = "V_WXTYPENAME") String V_WXTYPENAME,
            @RequestParam(value = "V_PTYPECODE") String V_PTYPECODE,
            @RequestParam(value = "V_PTYPENAME") String V_PTYPENAME,
            @RequestParam(value = "V_OLD_FLAG") String V_OLD_FLAG,

            @RequestParam(value = "V_REDEPTCODE") String V_REDEPTCODE,
            @RequestParam(value = "V_REDEPTNAME") String V_REDEPTNAME,
            @RequestParam(value = "V_PLANDAY") String V_PLANDAY,
            @RequestParam(value = "V_FZPERCODE") String V_FZPERCODE,
            @RequestParam(value = "V_FZPERNAME") String V_FZPERNAME,

            @RequestParam(value = "V_SGTYPECODE") String V_SGTYPECODE,
            @RequestParam(value = "V_SGTYPENAME") String V_SGTYPENAME,
            @RequestParam(value = "V_SCLBCODE") String V_SCLBCODE,
            @RequestParam(value = "V_SCLBNAME") String V_SCLBNAME,
            @RequestParam(value = "V_PRO_NAME") String V_PRO_NAME,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_INSERT(V_GUID, V_ORGCODE, V_ORGNAME, V_DEPTCODE, V_DEPTNAME, V_ZYCODE, V_ZYNAME, V_EQUCODE, V_EQUTYPE, V_REPAIRCONTENT,
                V_PLANHOUR, V_REPAIRTYPE, V_REPAIRTYPENAME, V_INPERCODE, V_INPERNAME, V_REMARK, V_V_YEAR, V_V_MONTH, V_TGTIME, V_JGTIME, V_WXTYPECODE, V_WXTYPENAME,
                V_PTYPECODE, V_PTYPENAME, V_OLD_FLAG, V_REDEPTCODE, V_REDEPTNAME, V_PLANDAY, V_FZPERCODE, V_FZPERNAME, V_SGTYPECODE, V_SGTYPENAME, V_SCLBCODE, V_SCLBNAME, V_PRO_NAME);
        return data;
    }

    // 年计划删除
    @RequestMapping(value = "PM_PLAN_YEAR_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_DEL(
            @RequestParam(value = "V_GUID") String V_GUID,

            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_DEL(V_GUID);
        return data;
    }

    // 年计划上报
    @RequestMapping(value = "PRO_PM_03_PLAN_YEAR_SEND", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_03_PLAN_YEAR_SEND(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_FLOWCODE") String V_V_FLOWCODE,
            @RequestParam(value = "V_V_PLANTYPE") String V_V_PLANTYPE,
            @RequestParam(value = "V_V_PERSONCODE") String V_V_PERSONCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map test = new HashMap();

        List<Map> result = null;
        result = dx_fileService.PRO_PM_03_PLAN_YEAR_SEND(V_V_GUID, V_V_ORGCODE, V_V_DEPTCODE, V_V_FLOWCODE, V_V_PLANTYPE, V_V_PERSONCODE);
        test.put("list", result);
        return test;
    }

    // 工序
    @RequestMapping(value = "BASE_OPERATION_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> BASE_OPERATION_SEL(
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_DPPTCODE") String V_DPPTCODE,
            @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
            @RequestParam(value = "V_FLAG") String V_FLAG)
            throws SQLException {
        Map<String, Object> result = dx_fileService.BASE_OPERATION_SEL(V_PERCODE, V_DPPTCODE, V_ORGCODE, V_FLAG);
        return result;
    }

    // 年计划创建guid
    @RequestMapping(value = "PM_PLAN_YEAR_GET_NEWGUID", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_GET_NEWGUID(
            @RequestParam(value = "V_GUID") String V_GUID,
            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
            @RequestParam(value = "V_INPERNAME") String V_INPERNAME,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_GET_NEWGUID(V_GUID, V_INPERCODE, V_INPERNAME);
        return data;
    }

    //年计划关联模型添加
    @RequestMapping(value = "PM_PLAN_YEAR_RE_JXMOD_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_RE_JXMOD_IN(
            @RequestParam(value = "V_GUID") String V_GUID,
            @RequestParam(value = "V_EQUCODE") String V_EQUCODE,
            @RequestParam(value = "V_MODCODE") String V_MODCODE,
            @RequestParam(value = "V_MODNAME") String V_MODNAME,
            @RequestParam(value = "V_MODBBH") String V_MODBBH,
            @RequestParam(value = "V_MODBZ") String V_MODBZ,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_RE_JXMOD_IN(V_GUID, V_EQUCODE, V_MODCODE, V_MODNAME, V_MODBBH, V_MODBZ);
        return data;
    }

    // 年计划查询相关物料、机具等信息
    @RequestMapping(value = "PRO_YEAR_PLAN_MXUSE_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_YEAR_PLAN_MXUSE_SEL(
            @RequestParam(value = "V_V_YEARGUID") String V_V_YEARGUID,
            @RequestParam(value = "V_V_TYPE") String V_V_TYPE) throws Exception {

        Map result = dx_fileService.PRO_YEAR_PLAN_MXUSE_SEL(V_V_YEARGUID, V_V_TYPE);
        return result;
    }


    //年计划关联缺陷添加
    @RequestMapping(value = "PM_PLAN_YEAR_RE_DEFECT_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_RE_DEFECT_IN(
            @RequestParam(value = "V_GUID") String V_GUID,
            @RequestParam(value = "V_DEFECTCODE") String V_DEFECTCODE,
            @RequestParam(value = "V_EQUCODE") String V_EQUCODE,
            @RequestParam(value = "V_EQUNAME") String V_EQUNAME,
            @RequestParam(value = "V_DEFECT_TYPE") String V_DEFECT_TYPE,
            @RequestParam(value = "V_DEFECT_CONTENT") String V_DEFECT_CONTENT,
            @RequestParam(value = "V_DEFECT_DATE") String V_DEFECT_DATE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_RE_DEFECT_IN(V_GUID, V_DEFECTCODE, V_EQUCODE, V_EQUNAME, V_DEFECT_TYPE, V_DEFECT_CONTENT, V_DEFECT_DATE);
        return data;
    }

    //年计划缺陷查询
    @RequestMapping(value = "PM_PLAN_YEAR_RE_DEFECT_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_RE_DEFECT_SEL(
            @RequestParam(value = "V_GUID") String V_GUID) throws Exception {

        Map result = dx_fileService.PM_PLAN_YEAR_RE_DEFECT_SEL(V_GUID);
        return result;
    }

    //年计划模型查询
    @RequestMapping(value = "PM_PLAN_YEAR_RE_JXMOD_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_RE_JXMOD_SEL(
            @RequestParam(value = "V_GUID") String V_GUID) throws Exception {

        Map result = dx_fileService.PM_PLAN_YEAR_RE_JXMOD_SEL(V_GUID);
        return result;
    }

    //年计划缺陷删除
    @RequestMapping(value = "PM_PLAN_YEAR_RE_DEFECT_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_RE_DEFECT_DEL(@RequestParam(value = "V_GUID") String V_GUID,
                                          @RequestParam(value = "V_DEFECTCODE") String V_DEFECTCODE) throws Exception {
        Map result = dx_fileService.PM_PLAN_YEAR_RE_DEFECT_DEL(V_GUID, V_DEFECTCODE);
        return result;
    }

    //年计划模型删除
    @RequestMapping(value = "PM_PLAN_YEAR_RE_JXMOD_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_RE_JXMOD_DEL(@RequestParam(value = "V_GUID") String V_GUID,
                                         @RequestParam(value = "V_MODCODE") String V_MODCODE) throws Exception {
        Map result = dx_fileService.PM_PLAN_YEAR_RE_JXMOD_DEL(V_GUID, V_MODCODE);
        return result;
    }

    //大修作业区查看上报数量
    @RequestMapping(value = "PRO_PM_YEAR_GROUPEBY_DEPT", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_YEAR_GROUPEBY_DEPT() throws Exception {

        Map result = dx_fileService.PRO_PM_YEAR_GROUPEBY_DEPT();
        return result;
    }

    //大修专业查看上报数量
    @RequestMapping(value = "PRO_PM_YEAR_GROUPEBY_ZY", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_YEAR_GROUPEBY_ZY() throws Exception {

        Map result = dx_fileService.PRO_PM_YEAR_GROUPEBY_ZY();
        return result;
    }

    //-月计划统计表1查询
    @RequestMapping(value = "PRO_MONTH_EQU_STATIS_IN_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_MONTH_EQU_STATIS_IN_SEL(@RequestParam(value = "V_EOS_GUID") String V_EOS_GUID,
                                           @RequestParam(value = "V_YEAR") String V_YEAR,
                                           @RequestParam(value = "V_MONTH") String V_MONTH,
                                           @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
                                           @RequestParam(value = "V_ORGNAME") String V_ORGNAME,
                                           @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
                                           @RequestParam(value = "V_INPERNAME") String V_INPERNAME) throws Exception {

        Map result = dx_fileService.PRO_MONTH_EQU_STATIS_IN_SEL(V_EOS_GUID, V_YEAR, V_MONTH, V_ORGCODE, V_ORGNAME, V_INPERCODE, V_INPERNAME);
        return result;
    }

    //-月计划统计表1增加
    @RequestMapping(value = "PRO_MONTH_EQU_STATIS_IN_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_MONTH_EQU_STATIS_IN_IN(@RequestParam(value = "V_EOS_GUID") String V_EOS_GUID,
                                          @RequestParam(value = "V_YEAR") String V_YEAR,
                                          @RequestParam(value = "V_MONTH") String V_MONTH,
                                          @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
                                          @RequestParam(value = "V_ORGNAME") String V_ORGNAME,
                                          @RequestParam(value = "V_EFPLAN") String V_EFPLAN,
                                          @RequestParam(value = "V_EFHOUR") String V_EFHOUR,
                                          @RequestParam(value = "V_EFACTUAL") String V_EFACTUAL,
                                          @RequestParam(value = "V_CPLAN") String V_CPLAN,
                                          @RequestParam(value = "V_CSNUM") String V_CSNUM,
                                          @RequestParam(value = "V_CCNUM") String V_CCNUM,
                                          @RequestParam(value = "V_CACT") String V_CACT,
                                          @RequestParam(value = "V_CUSEPLAN") String V_CUSEPLAN,
                                          @RequestParam(value = "V_CUSEACTUAL") String V_CUSEACTUAL,
                                          @RequestParam(value = "V_DXPFPLAN") String V_DXPFPLAN,
                                          @RequestParam(value = "V_DXPFACTUAL") String V_DXPFACTUAL,
                                          @RequestParam(value = "V_DXPFRATE") String V_DXPFRATE,
                                          @RequestParam(value = "V_DXTPLAN") String V_DXTPLAN,
                                          @RequestParam(value = "V_DXTACT") String V_DXTACT,
                                          @RequestParam(value = "V_DXTRATE") String V_DXTRATE,
                                          @RequestParam(value = "V_COPTPLAN") String V_COPTPLAN,
                                          @RequestParam(value = "V_COPTACT") String V_COPTACT,
                                          @RequestParam(value = "V_XKOPTPLAN") String V_XKOPTPLAN,
                                          @RequestParam(value = "V_XKOPTACT") String V_XKOPTACT,
                                          @RequestParam(value = "V_SJSPLAN") String V_SJSPLAN,
                                          @RequestParam(value = "V_SJSACT") String V_SJSACT,
                                          @RequestParam(value = "V_QTSPLAN") String V_QTSPLAN,
                                          @RequestParam(value = "V_QTSACT") String V_QTSACT,
                                          @RequestParam(value = "V_INERTDATE") String V_INERTDATE,
                                          @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
                                          @RequestParam(value = "V_INPERNAME") String V_INPERNAME) throws Exception {

        Map result = dx_fileService.PRO_MONTH_EQU_STATIS_IN_IN(V_EOS_GUID, V_YEAR, V_MONTH, V_ORGCODE, V_ORGNAME, V_EFPLAN, V_EFHOUR, V_EFACTUAL, V_CPLAN, V_CSNUM, V_CCNUM,
                V_CACT, V_CUSEPLAN, V_CUSEACTUAL, V_DXPFPLAN, V_DXPFACTUAL, V_DXPFRATE, V_DXTPLAN, V_DXTACT, V_DXTRATE, V_COPTPLAN, V_COPTACT, V_XKOPTPLAN, V_XKOPTACT, V_SJSPLAN,
                V_SJSACT, V_QTSPLAN, V_QTSACT, V_INERTDATE, V_INPERCODE, V_INPERNAME);
        return result;
    }

    //-月计划统计表2查询
    @RequestMapping(value = "PM_MONTH_EQU_ORG_STATIS2_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_MONTH_EQU_ORG_STATIS2_SEL(@RequestParam(value = "V_EOS_GUID") String V_EOS_GUID,
                                            @RequestParam(value = "V_YEAR") String V_YEAR,
                                            @RequestParam(value = "V_MONTH") String V_MONTH,
                                            @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
                                            @RequestParam(value = "V_ORGNAME") String V_ORGNAME,
                                            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
                                            @RequestParam(value = "V_INPERNAME") String V_INPERNAME) throws Exception {

        Map result = dx_fileService.PM_MONTH_EQU_ORG_STATIS2_SEL(V_EOS_GUID, V_YEAR, V_MONTH, V_ORGCODE, V_ORGNAME, V_INPERCODE, V_INPERNAME);
        return result;
    }

    //-月计划统计表2增加
    @RequestMapping(value = "PM_MONTH_EQU_ORG_STATIS2_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_MONTH_EQU_ORG_STATIS2_IN(@RequestParam(value = "V_MAIN_GUID") String V_MAIN_GUID,
                                           @RequestParam(value = "V_YEAR") String V_YEAR,
                                           @RequestParam(value = "V_MONTH") String V_MONTH,
                                           @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
                                           @RequestParam(value = "V_ORGNAME") String V_ORGNAME,
                                           @RequestParam(value = "V_PERCODE") String V_PERCODE,
                                           @RequestParam(value = "V_PERNAME") String V_PERNAME,
                                           @RequestParam(value = "V_DQ_PLAN") String V_DQ_PLAN,
                                           @RequestParam(value = "V_DQ_HNUM") String V_DQ_HNUM,
                                           @RequestParam(value = "V_DQ_CNUM") String V_DQ_CNUM,
                                           @RequestParam(value = "V_DQ_ACT") String V_DQ_ACT,
                                           @RequestParam(value = "V_DL_PLAN") String V_DL_PLAN,
                                           @RequestParam(value = "V_DL_ACTUAL") String V_DL_ACTUAL,
                                           @RequestParam(value = "V_GD_PLAN") String V_GD_PLAN,
                                           @RequestParam(value = "V_GD_ACT") String V_GD_ACT,
                                           @RequestParam(value = "V_DX_FPLAN") String V_DX_FPLAN,
                                           @RequestParam(value = "V_DX_FACT") String V_DX_FACT,
                                           @RequestParam(value = "V_DX_FRATE") String V_DX_FRATE,
                                           @RequestParam(value = "V_DX_TPLAN") String V_DX_TPLAN,
                                           @RequestParam(value = "V_DX_TACT") String V_DX_TACT,
                                           @RequestParam(value = "V_DX_TRATE") String V_DX_TRATE,
                                           @RequestParam(value = "V_REMARK") String V_REMARK) throws Exception {

        Map result = dx_fileService.PM_MONTH_EQU_ORG_STATIS2_IN(V_MAIN_GUID, V_YEAR, V_MONTH, V_ORGCODE, V_ORGNAME, V_PERCODE, V_PERNAME, V_DQ_PLAN, V_DQ_HNUM, V_DQ_CNUM, V_DQ_ACT,
                V_DL_PLAN, V_DL_ACTUAL, V_GD_PLAN, V_GD_ACT, V_DX_FPLAN, V_DX_FACT, V_DX_FRATE, V_DX_TPLAN, V_DX_TACT, V_DX_TRATE, V_REMARK);
        return result;
    }

    //-月计划统计表3查询
    @RequestMapping(value = "PM_MONTH_EQU_ORG_STATIS3_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_MONTH_EQU_ORG_STATIS3_SEL(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                            @RequestParam(value = "V_YEAR") String V_YEAR,
                                            @RequestParam(value = "V_MONTH") String V_MONTH,
                                            @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
                                            @RequestParam(value = "V_ORGNAME") String V_ORGNAME,
                                            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
                                            @RequestParam(value = "V_INPERNAME") String V_INPERNAME) throws Exception {

        Map result = dx_fileService.PM_MONTH_EQU_ORG_STATIS3_SEL(V_V_GUID, V_YEAR, V_MONTH, V_ORGCODE, V_ORGNAME, V_INPERCODE, V_INPERNAME);
        return result;
    }

    //-月计划统计表3增加
    @RequestMapping(value = "PM_MONTH_EQU_ORG_STATIS3_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_MONTH_EQU_ORG_STATIS3_IN(@RequestParam(value = "V_MAIN_GUID") String V_MAIN_GUID,
                                           @RequestParam(value = "V_YEAR") String V_YEAR,
                                           @RequestParam(value = "V_MONTH") String V_MONTH,
                                           @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
                                           @RequestParam(value = "V_ORGNAME") String V_ORGNAME,
                                           @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
                                           @RequestParam(value = "V_INPERNAME") String V_INPERNAME,
                                           @RequestParam(value = "V_PRO_Q_PLAN") String V_PRO_Q_PLAN,
                                           @RequestParam(value = "V_PRO_Q_ACT") String V_PRO_Q_ACT,
                                           @RequestParam(value = "V_RAMARK") String V_RAMARK) throws Exception {

        Map result = dx_fileService.PM_MONTH_EQU_ORG_STATIS3_IN(V_MAIN_GUID, V_YEAR, V_MONTH, V_ORGCODE, V_ORGNAME, V_INPERCODE, V_INPERNAME, V_PRO_Q_PLAN, V_PRO_Q_ACT, V_RAMARK);
        return result;
    }

    // 设备部月计划设备开和标准数据计划月报表统计
    @RequestMapping(value = "PM_MONTH_EQU_ORGCODE_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_MONTH_EQU_ORGCODE_SEL(@RequestParam(value = "V_YEAR") String V_YEAR,
                                        @RequestParam(value = "V_MONTH") String V_MONTH,
                                        @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
                                        @RequestParam(value = "V_PERCODE") String V_PERCODE,
                                        @RequestParam(value = "V_SIGN") String V_SIGN) throws SQLException {
        Map result = dx_fileService.PM_MONTH_EQU_ORGCODE_SEL(V_YEAR, V_MONTH, V_ORGCODE, V_PERCODE, V_SIGN);
        return result;
    }

    // MONTH 分解状态修改
    @RequestMapping(value = "PM_03_PLAN_MONTH_SIGN_UPDT", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_PLAN_MONTH_SIGN_UPDT(@RequestParam(value = "V_V_GUID") String V_V_GUID) throws SQLException {
        Map result = dx_fileService.PM_03_PLAN_MONTH_SIGN_UPDT(V_V_GUID);
        return result;
    }

    //monthStatis 03 export excel
    @RequestMapping(value = "monthStatis3", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void monthStatis3(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_YEAR") String V_YEAR,
            @RequestParam(value = "V_MONTH") String V_MONTH,
            @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
            @RequestParam(value = "V_ORGNAME") String V_ORGNAME,
            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
            @RequestParam(value = "V_INPERNAME") String V_INPERNAME,
            HttpServletRequest request,
            HttpServletResponse response) throws SQLException {

        List list = new ArrayList();
        String GUID = V_V_GUID.equals("0") ? "" : V_V_GUID;
        String[] head0 = new String[]{"序号", "单位", "年份", "月份", "产品合格率（%）"};
        String[] head1 = new String[]{"计划", "实际（%）"};
        Map<String, Object> data = dx_fileService.PM_MONTH_EQU_ORG_STATIS3_SEL(GUID, V_YEAR, V_MONTH, V_ORGCODE, V_ORGNAME, V_INPERCODE, V_INPERNAME);

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for (int i = 0; i <= 1; i++) {
            sheet.setColumnWidth(i, 3000);
        }

        HSSFFont font2 = wb.createFont();
        font2.setFontName("宋体");
        font2.setFontHeightInPoints((short) 10);
        HSSFCellStyle style2 = wb.createCellStyle();
        style2.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框
        style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框
        style2.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框
        style2.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框
        style2.setFont(font2);
        style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 左右居中
        style2.setWrapText(true); // 换行
        style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 上下居中


        HSSFRow row = sheet.createRow(0);
        HSSFCell cell = row.createCell(0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);

        row = sheet.createRow(0);


        for (int i = 0; i < head0.length; i++) {
            cell = row.createCell(i);
            cell.setCellValue(head0[i]);
            cell.setCellStyle(style2);
        }
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 4, head0.length));
        row = sheet.createRow(1);
        for (int i = 0; i < head0.length + 1; i++) {
            cell = row.createCell(i);
            cell.setCellStyle(style2);
            if (i > 3 && i < 6) {
                for (int j = 0; j < head1.length; j++) {
                    cell = row.createCell(j + 4);
                    cell.setCellValue(head1[j]);
                    cell.setCellStyle(style2);
                }
            }
        }
        for (int k = 0; k < 4; k++) {
            sheet.addMergedRegion(new CellRangeAddress(0, 1, k, k));
        }

        if (data.size() > 0) {
            list = (List) data.get("list");

            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 2);
                Map map = (Map) list.get(i);

                row.createCell((short) 0).setCellValue(i + 1);
                row.createCell((short) 1).setCellValue(map.get("ORGNAME") == null ? "" : map.get("ORGNAME").toString());
                row.createCell((short) 2).setCellValue(map.get("D_YEAR") == null ? "" : map.get("D_YEAR").toString());
                row.createCell((short) 3).setCellValue(map.get("D_MONTH") == null ? "" : map.get("D_MONTH").toString());
                row.createCell((short) 4).setCellValue(map.get("PRO_Q_PLAN") == null ? "" : map.get("PRO_Q_PLAN").toString());
                row.createCell((short) 5).setCellValue(map.get("PRO_Q_ACT") == null ? "" : map.get("PRO_Q_ACT").toString());

            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + URLEncoder.encode("设备考核指标数据计划月报表3Excel.xls", "UTF-8"));
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    // month statis2 export excel
    @RequestMapping(value = "monthStatis2", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void monthStatis2(
            @RequestParam(value = "V_EOS_GUID") String V_EOS_GUID,
            @RequestParam(value = "V_YEAR") String V_YEAR,
            @RequestParam(value = "V_MONTH") String V_MONTH,
            @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
            @RequestParam(value = "V_ORGNAME") String V_ORGNAME,
            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
            @RequestParam(value = "V_INPERNAME") String V_INPERNAME,
            HttpServletRequest request,
            HttpServletResponse response) throws SQLException {

        List list = new ArrayList();
        String GUID = V_EOS_GUID.equals("0") ? "" : V_EOS_GUID;
        String[] head = new String[]{"序号", "单位", "年份", "月份", "电气单体设备完好率", "电气单体设备完好率", "电气单体设备完好率", "电气单体设备完好率", "电网力率", "电网力率", "供电损失率（%）", "供电损失率（%）", "定修计划完成率", "定修计划完成率", "定修计划完成率", "定修时间准确率", "定修时间准确率", "定修时间准确率"};
        String[] coList1 = new String[]{"计划（%）", "在册设备数量", "可开动设备数量", "实际（%）"};
        String[] coList2 = new String[]{"计划（%）", "实际（%）"};
        String[] coList3 = new String[]{"计划", "实际"};
        String[] coList4 = new String[]{"计划项目", "实际完成项目", "定修计划完成率（%）"};
        String[] coList5 = new String[]{"计划定修时间(h)", "实际完成时间(h)", "定修时间准确率(%)"};
        int allLength = coList1.length + coList2.length + coList3.length + coList4.length + coList5.length + 4;
        Map<String, Object> data = dx_fileService.PM_MONTH_EQU_ORG_STATIS2_SEL(GUID, V_YEAR, V_MONTH, V_ORGCODE, V_ORGNAME, V_INPERCODE, V_INPERNAME);

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for (int i = 0; i <= 1; i++) {
            sheet.setColumnWidth(i, 3000);
        }

        HSSFFont font2 = wb.createFont();
        font2.setFontName("宋体");
        font2.setFontHeightInPoints((short) 10);
        HSSFCellStyle style2 = wb.createCellStyle();
        style2.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框
        style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框
        style2.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框
        style2.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框
        style2.setFont(font2);
        style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 左右居中
        style2.setWrapText(true); // 换行
        style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 上下居中


        HSSFRow row = sheet.createRow(0);
        HSSFCell cell = row.createCell(0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);

        row = sheet.createRow(0);

        for (int i = 0; i < allLength; i++) {
            cell = row.createCell(i);
            cell.setCellValue(head[i]);
            cell.setCellStyle(style2);
            if (i == 4) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 4, 7));
            }
            if (i == 5) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 8, 9));
            }
            if (i == 6) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 10, 11));
            }
            if (i == 7) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 12, 14));
            }
            if (i == 8) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 15, 17));
            }
        }

        row = sheet.createRow(1);
        for (int i = 0; i < head.length; i++) {
            cell = row.createCell(i);
            cell.setCellStyle(style2);
            if (i > 3 && i < 8) {
                for (int j = 0; j < coList1.length; j++) {
                    cell = row.createCell(j + 4);
                    cell.setCellValue(coList1[j]);
                    cell.setCellStyle(style2);
                }
            }
            if (i > 7 && i < 10) {
                for (int j = 0; j < coList2.length; j++) {
                    cell = row.createCell(j + 8);
                    cell.setCellValue(coList2[j]);
                    cell.setCellStyle(style2);
                }
            }
            if (i > 9 && i < 12) {
                for (int j = 0; j < coList3.length; j++) {
                    cell = row.createCell(j + 10);
                    cell.setCellValue(coList3[j]);
                    cell.setCellStyle(style2);
                }
            }
            if (i > 11 && i < 15) {
                for (int j = 0; j < coList4.length; j++) {
                    cell = row.createCell(j + 12);
                    cell.setCellValue(coList4[j]);
                    cell.setCellStyle(style2);
                }
            }
            if (i > 14 && i < 18) {
                for (int j = 0; j < coList5.length; j++) {
                    cell = row.createCell(j + 15);
                    cell.setCellValue(coList5[j]);
                    cell.setCellStyle(style2);
                }
            }
        }
        for (int k = 0; k < 4; k++) {
            sheet.addMergedRegion(new CellRangeAddress(0, 1, k, k));
        }
        if (data.size() > 0) {
            list = (List) data.get("list");

            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 2);
                Map map = (Map) list.get(i);

                row.createCell((short) 0).setCellValue(i + 1);
                row.createCell((short) 1).setCellValue(map.get("ORGNAME") == null ? "" : map.get("ORGNAME").toString());
                row.createCell((short) 2).setCellValue(map.get("D_YEAR") == null ? "" : map.get("D_YEAR").toString());
                row.createCell((short) 3).setCellValue(map.get("D_MONTH") == null ? "" : map.get("D_MONTH").toString());
                row.createCell((short) 4).setCellValue(map.get("DQ_EGOOD_PLAN") == null ? "" : map.get("DQ_EGOOD_PLAN").toString());
                row.createCell((short) 5).setCellValue(map.get("DQ_EGOOD_HNUM") == null ? "" : map.get("DQ_EGOOD_HNUM").toString());
                row.createCell((short) 6).setCellValue(map.get("DQ_EGOOD_CNUM") == null ? "" : map.get("DQ_EGOOD_CNUM").toString());
                row.createCell((short) 7).setCellValue(map.get("DQ_EGOOD_ACT") == null ? "" : map.get("DQ_EGOOD_ACT").toString());
                row.createCell((short) 8).setCellValue(map.get("DL_PLAN") == null ? "" : map.get("DL_PLAN").toString());
                row.createCell((short) 9).setCellValue(map.get("DL_ACTUAL") == null ? "" : map.get("DL_ACTUAL").toString());
                row.createCell((short) 10).setCellValue(map.get("GD_LOSS_PLAN") == null ? "" : map.get("GD_LOSS_PLAN").toString());
                row.createCell((short) 11).setCellValue(map.get("GD_LOSS_ACT") == null ? "" : map.get("GD_LOSS_ACT").toString());
                row.createCell((short) 12).setCellValue(map.get("DX_FINISH_PLAN") == null ? "" : map.get("DX_FINISH_PLAN").toString());
                row.createCell((short) 13).setCellValue(map.get("DX_FINISH_ACT") == null ? "" : map.get("DX_FINISH_ACT").toString());
                row.createCell((short) 14).setCellValue(map.get("DX_FINISH_RATE").equals("") ? "0" : map.get("DX_FINISH_RATE").equals("NaN") ? "0" : map.get("DX_FINISH_RATE").toString());
                row.createCell((short) 15).setCellValue(map.get("DX_TIME_PLAN") == null ? "" : map.get("DX_TIME_PLAN").toString());
                row.createCell((short) 16).setCellValue(map.get("DX_TIME_ACT") == null ? "" : map.get("DX_TIME_ACT").toString());
                row.createCell((short) 17).setCellValue(map.get("DX_TIME_RATE").equals("") ? "0" : map.get("DX_TIME_RATE").equals("NaN") ? "0" : map.get("DX_TIME_RATE").toString());

            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + URLEncoder.encode("设备考核指标数据计划月报表2Excel.xls", "UTF-8"));
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }


    // month statis1 export excel
    @RequestMapping(value = "monthStatis1", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void monthStatis1(
            @RequestParam(value = "V_EOS_GUID") String V_EOS_GUID,
            @RequestParam(value = "V_YEAR") String V_YEAR,
            @RequestParam(value = "V_MONTH") String V_MONTH,
            @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
            @RequestParam(value = "V_ORGNAME") String V_ORGNAME,
            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
            @RequestParam(value = "V_INPERNAME") String V_INPERNAME,
            HttpServletRequest request,
            HttpServletResponse response) throws SQLException {

        List list = new ArrayList();
        String GUID = V_EOS_GUID.equals("0") ? "" : V_EOS_GUID;
        String[] head = new String[]{"序号", "单位", "年份", "月份", "设备故障率", "设备故障率", "设备故障率", "采矿单体设备完好率", "采矿单体设备完好率", "采矿单体设备完好率", "采矿单体设备完好率", "可开动率", "可开动率", "定修计划完成率", "定修计划完成率", "定修计划完成率", "定修时间准确率", "定修时间准确率", "定修时间准确率", "开矿工序能耗", "开矿工序能耗", "选矿/精铁矿工序能耗", "选矿/精铁矿工序能耗", "烧结综合能耗", "烧结综合能耗", "球团综合能耗", "球团综合能耗"};
        String[] coList1 = new String[]{"计划率（%）", "故障时间(h)", "实际（%）"};
        String[] coList2 = new String[]{"计划（%）", "在册设备数量", "可开动设备数量", "实际（%）"};
        String[] coList3 = new String[]{"计划（%）", "实际（%）"};
        String[] coList4 = new String[]{"计划项目", "实际完成项目", "定修计划完成率（%）"};
        String[] coList5 = new String[]{"计划定修时间(h)", "实际完成时间(h)", "定修时间准确率(%)"};
        int[] sint = new int[]{4, 7, 11, 13, 16, 19, 21, 23, 25};
        int[] eint = new int[]{6, 10, 12, 15, 18, 20, 22, 24, 26};
        Map<String, Object> data = dx_fileService.PRO_MONTH_EQU_STATIS_IN_SEL(GUID, V_YEAR, V_MONTH, V_ORGCODE, V_ORGNAME, V_INPERCODE, V_INPERNAME);

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for (int i = 0; i <= 1; i++) {
            sheet.setColumnWidth(i, 3000);
        }

        HSSFFont font2 = wb.createFont();
        font2.setFontName("宋体");
        font2.setFontHeightInPoints((short) 10);
        HSSFCellStyle style2 = wb.createCellStyle();
        style2.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框
        style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框
        style2.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框
        style2.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框
        style2.setFont(font2);
        style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 左右居中
        style2.setWrapText(true); // 换行
        style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 上下居中


        HSSFRow row = sheet.createRow(0);
        HSSFCell cell = row.createCell(0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);

        row = sheet.createRow(0);

        for (int i = 0; i < head.length; i++) {
            cell = row.createCell(i);
            cell.setCellValue(head[i]);
            cell.setCellStyle(style2);
            if (i == 4) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 4, 6));
            }
            if (i == 5) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 7, 10));
            }
            if (i == 6) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 11, 12));
            }
            if (i == 7) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 13, 15));
            }
            if (i == 8) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 16, 18));
            }
            if (i == 9) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 19, 20));
            }
            if (i == 10) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 21, 22));
            }
            if (i == 11) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 23, 24));
            }
            if (i == 12) {
                sheet.addMergedRegion(new CellRangeAddress(0, 0, 25, 26));
            }
        }

        row = sheet.createRow(1);
        for (int i = 0; i < head.length; i++) {
            cell = row.createCell(i);
            cell.setCellStyle(style2);
            if (i > 3 && i < 7) {
                for (int j = 0; j < coList1.length; j++) {
                    cell = row.createCell(j + 4);
                    cell.setCellValue(coList1[j]);
                    cell.setCellStyle(style2);
                }
            }
            if (i > 6 && i < 11) {
                for (int j = 0; j < coList2.length; j++) {
                    cell = row.createCell(j + 7);
                    cell.setCellValue(coList2[j]);
                    cell.setCellStyle(style2);
                }
            }
            if (i > 10 && i < 13) {
                for (int j = 0; j < coList3.length; j++) {
                    cell = row.createCell(j + 11);
                    cell.setCellValue(coList3[j]);
                    cell.setCellStyle(style2);
                }
            }
            if (i > 12 && i < 16) {
                for (int j = 0; j < coList4.length; j++) {
                    cell = row.createCell(j + 13);
                    cell.setCellValue(coList4[j]);
                    cell.setCellStyle(style2);
                }
            }
            if (i > 15 && i < 19) {
                for (int j = 0; j < coList5.length; j++) {
                    cell = row.createCell(j + 16);
                    cell.setCellValue(coList5[j]);
                    cell.setCellStyle(style2);
                }
            }
            if (i > 18 && i < 21) {
                for (int j = 0; j < coList3.length; j++) {
                    cell = row.createCell(j + 19);
                    cell.setCellValue(coList3[j]);
                    cell.setCellStyle(style2);
                }
            }
            if (i > 20 && i < 23) {
                for (int j = 0; j < coList3.length; j++) {
                    cell = row.createCell(j + 21);
                    cell.setCellValue(coList3[j]);
                    cell.setCellStyle(style2);
                }
            }
            if (i > 22 && i < 25) {
                for (int j = 0; j < coList3.length; j++) {
                    cell = row.createCell(j + 23);
                    cell.setCellValue(coList3[j]);
                    cell.setCellStyle(style2);
                }
            }
            if (i > 24 && i < 27) {
                for (int j = 0; j < coList3.length; j++) {
                    cell = row.createCell(j + 25);
                    cell.setCellValue(coList3[j]);
                    cell.setCellStyle(style2);
                }
            }
        }
        for (int k = 0; k < 4; k++) {
            sheet.addMergedRegion(new CellRangeAddress(0, 1, k, k));
        }

        if (data.size() > 0) {
            list = (List) data.get("list");

            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 2);
                Map map = (Map) list.get(i);

                String DXPFINISH_PRO_RATE_V = map.get("DXT_EXACT_HOUR_RATE").equals("NaN") ? "0" : map.get("DXT_EXACT_HOUR_RATE").toString();
                row.createCell((short) 0).setCellValue(i + 1);
                row.createCell((short) 1).setCellValue(map.get("ORGNAME") == null ? "" : map.get("ORGNAME").toString());
                row.createCell((short) 2).setCellValue(map.get("D_YEAR") == null ? "" : map.get("D_YEAR").toString());
                row.createCell((short) 3).setCellValue(map.get("D_MONTH") == null ? "" : map.get("D_MONTH").toString());
                row.createCell((short) 4).setCellValue(map.get("E_FAULT_PLAN") == null ? "" : map.get("E_FAULT_PLAN").toString());
                row.createCell((short) 5).setCellValue(map.get("E_FAULT_HOUR") == null ? "" : map.get("E_FAULT_HOUR").toString());
                row.createCell((short) 6).setCellValue(map.get("E_FAULT_ACTUAL") == null ? "" : map.get("E_FAULT_ACTUAL").toString());
                row.createCell((short) 7).setCellValue(map.get("C_EQU_GOOD_PLAN") == null ? "" : map.get("C_EQU_GOOD_PLAN").toString());
                row.createCell((short) 8).setCellValue(map.get("C_EQU_GOOD_SNUM") == null ? "" : map.get("C_EQU_GOOD_SNUM").toString());
                row.createCell((short) 9).setCellValue(map.get("C_EQU_GOOD_CNUM") == null ? "" : map.get("C_EQU_GOOD_CNUM").toString());
                row.createCell((short) 10).setCellValue(map.get("C_EQU_GOOD_ACT") == null ? "" : map.get("C_EQU_GOOD_ACT").toString());
                row.createCell((short) 11).setCellValue(map.get("CUSE_OPENR_PLAN") == null ? "" : map.get("CUSE_OPENR_PLAN").toString());
                row.createCell((short) 12).setCellValue(map.get("CUSE_OPENR_ACTUAL") == null ? "" : map.get("CUSE_OPENR_ACTUAL").toString());
                row.createCell((short) 13).setCellValue(map.get("DXPFINISH_PRO_PLAN") == null ? "" : map.get("DXPFINISH_PRO_PLAN").toString());
                row.createCell((short) 14).setCellValue(map.get("DXPFINISH_PRO_ACTUAL") == null ? "" : map.get("DXPFINISH_PRO_ACTUAL").toString());
                row.createCell((short) 15).setCellValue(map.get("DXPFINISH_PRO_RATE").equals("") ? "0" : DXPFINISH_PRO_RATE_V);
                row.createCell((short) 16).setCellValue(map.get("DXT_EXACT_HOUR_PLAN") == null ? "" : map.get("DXT_EXACT_HOUR_PLAN").toString());
                row.createCell((short) 17).setCellValue(map.get("DXT_EXACT_HOUR_ACT") == null ? "" : map.get("DXT_EXACT_HOUR_ACT").toString());
                row.createCell((short) 18).setCellValue(map.get("DXT_EXACT_HOUR_RATE").equals("") ? "0" : map.get("DXT_EXACT_HOUR_RATE").equals("NaN") ? "0" : map.get("DXT_EXACT_HOUR_RATE").toString());
                row.createCell((short) 19).setCellValue(map.get("COPT_CSENERGY_PLAN") == null ? "" : map.get("COPT_CSENERGY_PLAN").toString());
                row.createCell((short) 20).setCellValue(map.get("COPT_CSENERGY_ACT") == null ? "" : map.get("COPT_CSENERGY_ACT").toString());
                row.createCell((short) 21).setCellValue(map.get("XKOPT_CSENERGY_PLAN") == null ? "" : map.get("XKOPT_CSENERGY_PLAN").toString());
                row.createCell((short) 22).setCellValue(map.get("XKOPT_CSENERGY_ACT") == null ? "" : map.get("XKOPT_CSENERGY_ACT").toString());
                row.createCell((short) 23).setCellValue(map.get("SJSYNTH_CSENERGY_PLAN") == null ? "" : map.get("SJSYNTH_CSENERGY_PLAN").toString());
                row.createCell((short) 24).setCellValue(map.get("SJSYNTH_CSENERGY_ACT") == null ? "" : map.get("SJSYNTH_CSENERGY_ACT").toString());
                row.createCell((short) 25).setCellValue(map.get("QTSYNTH_CSENERGY_PLAN") == null ? "" : map.get("QTSYNTH_CSENERGY_PLAN").toString());
                row.createCell((short) 26).setCellValue(map.get("QTSYNTH_CSENERGY_ACT") == null ? "" : map.get("QTSYNTH_CSENERGY_ACT").toString());
//
//                for(int m=0;m<27;i++){
//                    row.createCell((short) m).setCellStyle(style2);
//                }

            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + URLEncoder.encode("设备考核指标数据计划月报表1Excel.xls", "UTF-8"));
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    //月统计页sbbtab1
    @RequestMapping(value = "exportExDate01", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void exportExDate01(
            @RequestParam(value = "V_YEAR") String V_YEAR,
            @RequestParam(value = "V_MONTH") String V_MONTH,
            @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_SIGN") String V_SIGN,
            HttpServletRequest request,
            HttpServletResponse response) throws SQLException {

        List list = new ArrayList();
        String[] head = new String[]{"序号", "单位", "年份", "月份", "设备故障率", "设备故障率", "设备故障率", "采矿单体设备完好率", "采矿单体设备完好率", "采矿单体设备完好率", "采矿单体设备完好率", "可开动率", "可开动率", "定修计划完成率", "定修计划完成率", "定修计划完成率", "定修时间准确率", "定修时间准确率", "定修时间准确率", "开矿工序能耗", "开矿工序能耗", "选矿/精铁矿工序能耗", "选矿/精铁矿工序能耗", "烧结综合能耗", "烧结综合能耗", "球团综合能耗", "球团综合能耗"};
        String[] coList = new String[]{"计划率（%）", "故障时间(h)", "实际（%）", "计划（%）", "在册设备数量", "可开动设备数量", "实际（%）", "计划（%）", "实际（%）", "计划项目", "实际完成项目", "定修计划完成率（%）",
                "计划定修时间(h)", "实际完成时间(h)", "定修时间准确率(%)", "计划（%）", "实际（%）", "计划（%）", "实际（%）", "计划（%）", "实际（%）", "计划（%）", "实际（%）"};
        Map<String, Object> data = dx_fileService.PM_MONTH_EQU_ORGCODE_SEL(V_YEAR, V_MONTH, V_ORGCODE, V_PERCODE, V_SIGN);

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for (int i = 0; i <= 1; i++) {
            sheet.setColumnWidth(i, 3000);
        }

        HSSFFont font2 = wb.createFont();
        font2.setFontName("宋体");
        font2.setFontHeightInPoints((short) 10);
        HSSFCellStyle style2 = wb.createCellStyle();
        style2.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框
        style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框
        style2.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框
        style2.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框
        style2.setFont(font2);
        style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 左右居中
        style2.setWrapText(true); // 换行
        style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 上下居中


        HSSFRow row = sheet.createRow(0);
        HSSFCell cell = row.createCell(0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);

        row = sheet.createRow(0);

        for (int i = 0; i < head.length; i++) {
            cell = row.createCell(i);
            cell.setCellValue(head[i]);
            cell.setCellStyle(style2);
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 4, 6));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 7, 10));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 11, 12));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 13, 15));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 16, 18));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 19, 20));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 21, 22));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 23, 24));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 25, 26));
        }

        row = sheet.createRow(1);
        for (int i = 0; i < head.length; i++) {
            cell = row.createCell(i);
            cell.setCellStyle(style2);
            if (i > 3) {
                for (int j = 0; j < coList.length; j++) {
                    cell = row.createCell(j + 4);
                    cell.setCellValue(coList[j]);
                    cell.setCellStyle(style2);
                }
            }

        }
        for (int k = 0; k < 4; k++) {
            sheet.addMergedRegion(new CellRangeAddress(0, 1, k, k));
        }

        if (data.size() > 0) {
            list = (List) data.get("list");

            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 2);
                Map map = (Map) list.get(i);

                String DXPFINISH_PRO_RATE_V = map.get("DXT_EXACT_HOUR_RATE").equals("NaN") ? "0" : map.get("DXT_EXACT_HOUR_RATE").toString();
                row.createCell((short) 0).setCellValue(i + 1);
                row.createCell((short) 1).setCellValue(map.get("ORGNAME") == null ? "" : map.get("ORGNAME").toString());
                row.createCell((short) 2).setCellValue(map.get("D_YEAR") == null ? "" : map.get("D_YEAR").toString());
                row.createCell((short) 3).setCellValue(map.get("D_MONTH") == null ? "" : map.get("D_MONTH").toString());
                row.createCell((short) 4).setCellValue(map.get("E_FAULT_PLAN") == null ? "" : map.get("E_FAULT_PLAN").toString());
                row.createCell((short) 5).setCellValue(map.get("E_FAULT_HOUR") == null ? "" : map.get("E_FAULT_HOUR").toString());
                row.createCell((short) 6).setCellValue(map.get("E_FAULT_ACTUAL") == null ? "" : map.get("E_FAULT_ACTUAL").toString());
                row.createCell((short) 7).setCellValue(map.get("C_EQU_GOOD_PLAN") == null ? "" : map.get("C_EQU_GOOD_PLAN").toString());
                row.createCell((short) 8).setCellValue(map.get("C_EQU_GOOD_SNUM") == null ? "" : map.get("C_EQU_GOOD_SNUM").toString());
                row.createCell((short) 9).setCellValue(map.get("C_EQU_GOOD_CNUM") == null ? "" : map.get("C_EQU_GOOD_CNUM").toString());
                row.createCell((short) 10).setCellValue(map.get("C_EQU_GOOD_ACT") == null ? "" : map.get("C_EQU_GOOD_ACT").toString());
                row.createCell((short) 11).setCellValue(map.get("CUSE_OPENR_PLAN") == null ? "" : map.get("CUSE_OPENR_PLAN").toString());
                row.createCell((short) 12).setCellValue(map.get("CUSE_OPENR_ACTUAL") == null ? "" : map.get("CUSE_OPENR_ACTUAL").toString());
                row.createCell((short) 13).setCellValue(map.get("DXPFINISH_PRO_PLAN") == null ? "" : map.get("DXPFINISH_PRO_PLAN").toString());
                row.createCell((short) 14).setCellValue(map.get("DXPFINISH_PRO_ACTUAL") == null ? "" : map.get("DXPFINISH_PRO_ACTUAL").toString());
                row.createCell((short) 15).setCellValue(map.get("DXPFINISH_PRO_RATE").equals("") ? "0" : DXPFINISH_PRO_RATE_V);
                row.createCell((short) 16).setCellValue(map.get("DXT_EXACT_HOUR_PLAN") == null ? "" : map.get("DXT_EXACT_HOUR_PLAN").toString());
                row.createCell((short) 17).setCellValue(map.get("DXT_EXACT_HOUR_ACT") == null ? "" : map.get("DXT_EXACT_HOUR_ACT").toString());
                row.createCell((short) 18).setCellValue(map.get("DXT_EXACT_HOUR_RATE").equals("") ? "0" : map.get("DXT_EXACT_HOUR_RATE").equals("NaN") ? "0" : map.get("DXT_EXACT_HOUR_RATE").toString());
                row.createCell((short) 19).setCellValue(map.get("COPT_CSENERGY_PLAN") == null ? "" : map.get("COPT_CSENERGY_PLAN").toString());
                row.createCell((short) 20).setCellValue(map.get("COPT_CSENERGY_ACT") == null ? "" : map.get("COPT_CSENERGY_ACT").toString());
                row.createCell((short) 21).setCellValue(map.get("XKOPT_CSENERGY_PLAN") == null ? "" : map.get("XKOPT_CSENERGY_PLAN").toString());
                row.createCell((short) 22).setCellValue(map.get("XKOPT_CSENERGY_ACT") == null ? "" : map.get("XKOPT_CSENERGY_ACT").toString());
                row.createCell((short) 23).setCellValue(map.get("SJSYNTH_CSENERGY_PLAN") == null ? "" : map.get("SJSYNTH_CSENERGY_PLAN").toString());
                row.createCell((short) 24).setCellValue(map.get("SJSYNTH_CSENERGY_ACT") == null ? "" : map.get("SJSYNTH_CSENERGY_ACT").toString());
                row.createCell((short) 25).setCellValue(map.get("QTSYNTH_CSENERGY_PLAN") == null ? "" : map.get("QTSYNTH_CSENERGY_PLAN").toString());
                row.createCell((short) 26).setCellValue(map.get("QTSYNTH_CSENERGY_ACT") == null ? "" : map.get("QTSYNTH_CSENERGY_ACT").toString());


            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + URLEncoder.encode("设备考核指标数据计划月报表1Excel.xls", "UTF-8"));
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    //月统计页sbbtab2
    @RequestMapping(value = "exportExDate02", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void exportExDate02(
            @RequestParam(value = "V_YEAR") String V_YEAR,
            @RequestParam(value = "V_MONTH") String V_MONTH,
            @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_SIGN") String V_SIGN,
            HttpServletRequest request,
            HttpServletResponse response) throws SQLException {

        List list = new ArrayList();

        String[] head = new String[]{"序号", "单位", "年份", "月份", "电气单体设备完好率", "电气单体设备完好率", "电气单体设备完好率", "电气单体设备完好率", "电网力率", "电网力率", "供电损失率（%）", "供电损失率（%）", "定修计划完成率", "定修计划完成率", "定修计划完成率", "定修时间准确率", "定修时间准确率", "定修时间准确率"};
        String[] coList = new String[]{"计划（%）", "在册设备数量", "可开动设备数量", "实际（%）", "计划（%）", "实际（%）", "计划", "实际", "计划项目", "实际完成项目", "定修计划完成率（%）", "计划定修时间(h)", "实际完成时间(h)", "定修时间准确率(%)"};
//        String[] coList2=new String[]{"计划（%）","实际（%）"};
//        String[] coList3=new String[]{"计划","实际"};
//        String[] coList4=new String[]{"计划项目","实际完成项目","定修计划完成率（%）"};
//        String[] coList5=new String[]{"计划定修时间(h)","实际完成时间(h)","定修时间准确率(%)"};
        Map<String, Object> data = dx_fileService.PM_MONTH_EQU_ORGCODE_SEL(V_YEAR, V_MONTH, V_ORGCODE, V_PERCODE, V_SIGN);

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for (int i = 0; i <= 1; i++) {
            sheet.setColumnWidth(i, 3000);
        }

        HSSFFont font2 = wb.createFont();
        font2.setFontName("宋体");
        font2.setFontHeightInPoints((short) 10);
        HSSFCellStyle style2 = wb.createCellStyle();
        style2.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框
        style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框
        style2.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框
        style2.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框
        style2.setFont(font2);
        style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 左右居中
        style2.setWrapText(true); // 换行
        style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 上下居中


        HSSFRow row = sheet.createRow(0);
        HSSFCell cell = row.createCell(0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);

        row = sheet.createRow(0);

        for (int i = 0; i < head.length; i++) {
            cell = row.createCell(i);
            cell.setCellValue(head[i]);
            cell.setCellStyle(style2);

            sheet.addMergedRegion(new CellRangeAddress(0, 0, 4, 7));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 8, 9));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 10, 11));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 12, 14));
            sheet.addMergedRegion(new CellRangeAddress(0, 0, 15, 17));
        }
        row = sheet.createRow(1);
        for (int i = 0; i < head.length; i++) {
            cell = row.createCell(i);
            cell.setCellStyle(style2);
            if (i > 3) {
                for (int j = 0; j < coList.length; j++) {
                    cell = row.createCell(j + 4);
                    cell.setCellValue(coList[j]);
                    cell.setCellStyle(style2);
                }
            }
        }
        for (int k = 0; k < 4; k++) {
            sheet.addMergedRegion(new CellRangeAddress(0, 1, k, k));
        }
        if (data.size() > 0) {
            list = (List) data.get("list");

            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 2);
                Map map = (Map) list.get(i);

                row.createCell((short) 0).setCellValue(i + 1);
                row.createCell((short) 1).setCellValue(map.get("ORGNAME") == null ? "" : map.get("ORGNAME").toString());
                row.createCell((short) 2).setCellValue(map.get("D_YEAR") == null ? "" : map.get("D_YEAR").toString());
                row.createCell((short) 3).setCellValue(map.get("D_MONTH") == null ? "" : map.get("D_MONTH").toString());
                row.createCell((short) 4).setCellValue(map.get("DQ_EGOOD_PLAN") == null ? "" : map.get("DQ_EGOOD_PLAN").toString());
                row.createCell((short) 5).setCellValue(map.get("DQ_EGOOD_HNUM") == null ? "" : map.get("DQ_EGOOD_HNUM").toString());
                row.createCell((short) 6).setCellValue(map.get("DQ_EGOOD_CNUM") == null ? "" : map.get("DQ_EGOOD_CNUM").toString());
                row.createCell((short) 7).setCellValue(map.get("DQ_EGOOD_ACT") == null ? "" : map.get("DQ_EGOOD_ACT").toString());
                row.createCell((short) 8).setCellValue(map.get("DL_PLAN") == null ? "" : map.get("DL_PLAN").toString());
                row.createCell((short) 9).setCellValue(map.get("DL_ACTUAL") == null ? "" : map.get("DL_ACTUAL").toString());
                row.createCell((short) 10).setCellValue(map.get("GD_LOSS_PLAN") == null ? "" : map.get("GD_LOSS_PLAN").toString());
                row.createCell((short) 11).setCellValue(map.get("GD_LOSS_ACT") == null ? "" : map.get("GD_LOSS_ACT").toString());
                row.createCell((short) 12).setCellValue(map.get("DX_FINISH_PLAN") == null ? "" : map.get("DX_FINISH_PLAN").toString());
                row.createCell((short) 13).setCellValue(map.get("DX_FINISH_ACT") == null ? "" : map.get("DX_FINISH_ACT").toString());
                row.createCell((short) 14).setCellValue(map.get("DX_FINISH_RATE").equals("") ? "0" : map.get("DX_FINISH_RATE").equals("NaN") ? "0" : map.get("DX_FINISH_RATE").toString());
                row.createCell((short) 15).setCellValue(map.get("DX_TIME_PLAN") == null ? "" : map.get("DX_TIME_PLAN").toString());
                row.createCell((short) 16).setCellValue(map.get("DX_TIME_ACT") == null ? "" : map.get("DX_TIME_ACT").toString());
                row.createCell((short) 17).setCellValue(map.get("DX_TIME_RATE").equals("") ? "0" : map.get("DX_TIME_RATE").equals("NaN") ? "0" : map.get("DX_TIME_RATE").toString());

            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + URLEncoder.encode("设备考核指标数据计划月报表2Excel.xls", "UTF-8"));
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }


    //月统计页sbbtab3
    @RequestMapping(value = "exportExDate03", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void exportExDate03(
            @RequestParam(value = "V_YEAR") String V_YEAR,
            @RequestParam(value = "V_MONTH") String V_MONTH,
            @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_SIGN") String V_SIGN,
            HttpServletRequest request,
            HttpServletResponse response) throws SQLException {

        List list = new ArrayList();
        String[] head0 = new String[]{"序号", "单位", "年份", "月份", "产品合格率（%）"};
        String[] head1 = new String[]{"计划", "实际（%）"};
        Map<String, Object> data = dx_fileService.PM_MONTH_EQU_ORGCODE_SEL(V_YEAR, V_MONTH, V_ORGCODE, V_PERCODE, V_SIGN);

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for (int i = 0; i <= 1; i++) {
            sheet.setColumnWidth(i, 3000);
        }

        HSSFFont font2 = wb.createFont();
        font2.setFontName("宋体");
        font2.setFontHeightInPoints((short) 10);
        HSSFCellStyle style2 = wb.createCellStyle();
        style2.setBorderBottom(HSSFCellStyle.BORDER_THIN); //下边框
        style2.setBorderLeft(HSSFCellStyle.BORDER_THIN);//左边框
        style2.setBorderTop(HSSFCellStyle.BORDER_THIN);//上边框
        style2.setBorderRight(HSSFCellStyle.BORDER_THIN);//右边框
        style2.setFont(font2);
        style2.setAlignment(HSSFCellStyle.ALIGN_CENTER);// 左右居中
        style2.setWrapText(true); // 换行
        style2.setVerticalAlignment(HSSFCellStyle.VERTICAL_CENTER);// 上下居中

        HSSFRow row = sheet.createRow(0);
        HSSFCell cell = row.createCell(0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);

        row = sheet.createRow(0);
        for (int i = 0; i < head0.length; i++) {
            cell = row.createCell(i);
            cell.setCellValue(head0[i]);
            cell.setCellStyle(style2);
        }
        sheet.addMergedRegion(new CellRangeAddress(0, 0, 4, head0.length));
        row = sheet.createRow(1);
        for (int i = 0; i < head0.length + 1; i++) {
            cell = row.createCell(i);
            cell.setCellStyle(style2);
            if (i > 3 && i < 6) {
                for (int j = 0; j < head1.length; j++) {
                    cell = row.createCell(j + 4);
                    cell.setCellValue(head1[j]);
                    cell.setCellStyle(style2);
                }
            }
        }
        for (int k = 0; k < 4; k++) {
            sheet.addMergedRegion(new CellRangeAddress(0, 1, k, k));
        }

        if (data.size() > 0) {
            list = (List) data.get("list");

            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 2);
                Map map = (Map) list.get(i);

                row.createCell((short) 0).setCellValue(i + 1);
                row.createCell((short) 1).setCellValue(map.get("ORGNAME") == null ? "" : map.get("ORGNAME").toString());
                row.createCell((short) 2).setCellValue(map.get("D_YEAR") == null ? "" : map.get("D_YEAR").toString());
                row.createCell((short) 3).setCellValue(map.get("D_MONTH") == null ? "" : map.get("D_MONTH").toString());
                row.createCell((short) 4).setCellValue(map.get("PRO_Q_PLAN") == null ? "" : map.get("PRO_Q_PLAN").toString());
                row.createCell((short) 5).setCellValue(map.get("PRO_Q_ACT") == null ? "" : map.get("PRO_Q_ACT").toString());

            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + URLEncoder.encode("设备考核指标数据计划月报表3Excel.xls", "UTF-8"));
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    //月计划、年计划找周计划详情  PM_03_PLAN_MONTH_SEL_WEEKVIEW
    @RequestMapping(value = "PM_03_PLAN_MONTH_SEL_WEEKVIEW", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_PLAN_MONTH_SEL_WEEKVIEW(
            @RequestParam(value = "V_OTHERGRID") String V_OTHERGRID,
            @RequestParam(value = "V_TYPE") String V_TYPE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_03_PLAN_MONTH_SEL_WEEKVIEW(V_OTHERGRID, V_TYPE);
        return data;
    }

    //预装件备件信息修改
    @RequestMapping(value = "PRO_PRELOADWARECOMPONENT_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PRELOADWARECOMPONENT_SET(
            @RequestParam(value = "V_V_MODELNUMBER") String V_V_MODELNUMBER,
            @RequestParam(value = "V_V_SPCODE") String V_V_SPCODE,
            @RequestParam(value = "N_N_NUMBER") String N_N_NUMBER,
            @RequestParam(value = "V_V_SIZE") String V_V_SIZE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PRO_PRELOADWARECOMPONENT_SET(V_V_MODELNUMBER, V_V_SPCODE, N_N_NUMBER, V_V_SIZE);
        return data;
    }


    // //缺陷厂矿tab-bypersoncode
    @RequestMapping(value = "PRO_SELECT_ORG_BYPERCODE", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_SELECT_ORG_BYPERCODE(
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PRO_SELECT_ORG_BYPERCODE(V_PERCODE);
        return data;
    }

    //根据厂矿查看对应每月缺陷数量
    @RequestMapping(value = "PM_07_DEFECT_STAT", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_07_DEFECT_STAT(
            @RequestParam(value = "V_YEAR") String V_YEAR,
            @RequestParam(value = "V_CKCODE") String V_CKCODE,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_07_DEFECT_STAT(V_YEAR, V_CKCODE, V_PERCODE);
        return data;
    }

    //根据人员查询厂矿缺陷
    @RequestMapping(value = "PM_07_DEFECT_STAT_N", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_07_DEFECT_STAT_N(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE) throws Exception {
        Map data = dx_fileService.PM_07_DEFECT_STAT_N(V_V_YEAR, V_V_PERCODE);
        return data;
    }


    //周月计划添加模型
    @RequestMapping(value = "PM_1921_PLAN_IN_MX_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_1921_PLAN_IN_MX_SET(
            @RequestParam(value = "V_V_MX_NAME") String V_V_MX_NAME,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,

            @RequestParam(value = "V_V_SPECIALTY") String V_V_SPECIALTY,
            @RequestParam(value = "V_V_MENO") String V_V_MENO,
            @RequestParam(value = "V_V_INPER") String V_V_INPER,

            @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
            @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
            @RequestParam(value = "V_V_CONTEXT") String V_V_CONTEXT,

            @RequestParam(value = "V_V_JXMX_CODE") String V_V_JXMX_CODE,
            @RequestParam(value = "V_V_PERNUM") String V_V_PERNUM,
            @RequestParam(value = "V_V_LIFELONG") String V_V_LIFELONG,

            @RequestParam(value = "V_V_MAIN_DEFECT") String V_V_MAIN_DEFECT,
            @RequestParam(value = "V_V_SGWAY") String V_V_SGWAY,

            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_1921_PLAN_IN_MX_SET(V_V_MX_NAME, V_V_ORGCODE, V_V_DEPTCODE, V_V_SPECIALTY, V_V_MENO, V_V_INPER, V_V_EQUTYPE, V_V_EQUCODE, V_V_CONTEXT, V_V_JXMX_CODE, V_V_PERNUM, V_V_LIFELONG, V_V_MAIN_DEFECT, V_V_SGWAY);
        return data;
    }

    // 事故统计分析
    @RequestMapping(value = "PM_14_FAULT_ITEM_DATA_STAT", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_14_FAULT_ITEM_DATA_STAT(
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,

            @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
            @RequestParam(value = "V_V_EQUCHILD_CODE") String V_V_EQUCHILD_CODE,
            @RequestParam(value = "V_V_FAULT_TYPE") String V_V_FAULT_TYPE,

            @RequestParam(value = "V_V_FAULT_YY") String V_V_FAULT_YY,
            @RequestParam(value = "V_STAR_DATE") String V_STAR_DATE,
            @RequestParam(value = "V_END_DATE") String V_END_DATE,

            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_14_FAULT_ITEM_DATA_STAT(V_V_ORGCODE, V_V_DEPTCODE, V_V_EQUTYPE, V_V_EQUCODE, V_V_EQUCHILD_CODE, V_V_FAULT_TYPE, V_V_FAULT_YY, V_STAR_DATE, V_END_DATE);
        return data;
    }

    // 事故、故障月-设备类型统计
    @RequestMapping(value = "PM_14_FAULT_ITEM_STAT_NUM", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_14_FAULT_ITEM_STAT_NUM(
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_PERSONCODE") String V_V_PERSONCODE,

            @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
            @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
            @RequestParam(value = "V_V_EQUCHILD_CODE") String V_V_EQUCHILD_CODE,

            @RequestParam(value = "V_V_FAULT_TYPE") String V_V_FAULT_TYPE,
            @RequestParam(value = "V_V_FAULT_YY") String V_V_FAULT_YY,
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,

            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.PM_14_FAULT_ITEM_STAT_NUM(V_V_ORGCODE, V_V_DEPTCODE, V_V_PERSONCODE, V_V_EQUTYPE, V_V_EQUCODE, V_V_EQUCHILD_CODE, V_V_FAULT_TYPE, V_V_FAULT_YY, V_V_YEAR, V_V_MONTH);
        return data;
    }

    //年计划流程结束修改状态
    @RequestMapping(value = "PM_PLAN_YEAR_STATE_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_STATE_UPDATE(
            @RequestParam(value = "V_GUID") String V_GUID,
            @RequestParam(value = "V_STATE") String V_STATE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_STATE_UPDATE(V_GUID, V_STATE);
        return data;
    }

    //年计划驳回修改数据
    @RequestMapping(value = "PM_PLAN_YEAR_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_UPDATE(
            @RequestParam(value = "V_GUID") String V_GUID,
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
            @RequestParam(value = "V_ORGNAME") String V_ORGNAME,
            @RequestParam(value = "V_DEPTCODE") String V_DEPTCODE,
            @RequestParam(value = "V_DEPTNAME") String V_DEPTNAME,
            @RequestParam(value = "V_EQUTYPE") String V_EQUTYPE,
            @RequestParam(value = "V_EQUCODE") String V_EQUCODE,
            @RequestParam(value = "V_ZYCODE") String V_ZYCODE,
            @RequestParam(value = "V_ZYMANE") String V_ZYMANE,
            @RequestParam(value = "V_CONTENT") String V_CONTENT,
            @RequestParam(value = "V_TGDATE") String V_TGDATE,
            @RequestParam(value = "V_JGDATE") String V_JGDATE,
            @RequestParam(value = "V_HOUR") String V_HOUR,
            @RequestParam(value = "V_BZ") String V_BZ,
            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_UPDATE(V_GUID, V_V_YEAR, V_V_MONTH, V_ORGCODE, V_ORGNAME, V_DEPTCODE, V_DEPTNAME,
                V_EQUTYPE, V_EQUCODE, V_ZYCODE, V_ZYMANE, V_CONTENT, V_TGDATE, V_JGDATE, V_HOUR, V_BZ, V_INPERCODE);
        return data;
    }

    //年计划放行计划查询
    @RequestMapping(value = "PM_PLAN_YEAR_SEL_FX", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_SEL_FX(
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            @RequestParam(value = "V_SDATE") String V_SDATE,
            @RequestParam(value = "V_EDATE") String V_EDATE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_SEL_FX(V_V_ORGCODE, V_V_DEPTCODE, V_V_PERCODE, V_V_ZY, V_SDATE, V_EDATE);
        return data;
    }

    //年计划大修查询
    @RequestMapping(value = "PRO_PM_03_PLAN_PROJECT_BYFX", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_03_PLAN_PROJECT_BYFX(
            @RequestParam(value = "V_PRONAME") String V_PRONAME,
            @RequestParam(value = "V_ZY") String V_ZY,
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.PRO_PM_03_PLAN_PROJECT_BYFX(V_PRONAME, V_ZY, V_V_YEAR);
        return data;
    }


    //年计划大修写入关联表
    @RequestMapping(value = "YEAR_TO_PROGUID_FX_INSERT", method = RequestMethod.POST)
    @ResponseBody
    public Map YEAR_TO_PROGUID_FX_INSERT(
            @RequestParam(value = "V_YEARGUID") String V_YEARGUID,
            @RequestParam(value = "V_PROGUID") String V_PROGUID,
            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.YEAR_TO_PROGUID_FX_INSERT(V_YEARGUID, V_PROGUID, V_INPERCODE);
        return data;
    }

    // 年计划分解创建guid
    @RequestMapping(value = "PM_PLAN_YEAR_GET_FJGUID", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_GET_FJGUID(
            @RequestParam(value = "V_GUID") String V_GUID,
            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
            @RequestParam(value = "V_INPERNAME") String V_INPERNAME,
            @RequestParam(value = "V_UPGUID") String V_UPGUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_GET_FJGUID(V_GUID, V_INPERCODE, V_INPERNAME, V_UPGUID);
        return data;
    }
// 年计划fJ添加和修改

    @RequestMapping(value = "PM_PLAN_YEAR_INSERT_FJ", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_INSERT_FJ(
            @RequestParam(value = "V_GUID") String V_GUID,
            @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
            @RequestParam(value = "V_ORGNAME") String V_ORGNAME,
            @RequestParam(value = "V_DEPTCODE") String V_DEPTCODE,
            @RequestParam(value = "V_DEPTNAME") String V_DEPTNAME,

            @RequestParam(value = "V_ZYCODE") String V_ZYCODE,
            @RequestParam(value = "V_ZYNAME") String V_ZYNAME,
            @RequestParam(value = "V_EQUCODE") String V_EQUCODE,
            @RequestParam(value = "V_EQUTYPE") String V_EQUTYPE,
            @RequestParam(value = "V_REPAIRCONTENT") String V_REPAIRCONTENT,

            @RequestParam(value = "V_PLANHOUR") String V_PLANHOUR,
            @RequestParam(value = "V_REPAIRTYPE") String V_REPAIRTYPE,
            @RequestParam(value = "V_REPAIRTYPENAME") String V_REPAIRTYPENAME,
            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
            @RequestParam(value = "V_INPERNAME") String V_INPERNAME,

            @RequestParam(value = "V_REMARK") String V_REMARK,
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_TGTIME") String V_TGTIME,
            @RequestParam(value = "V_JGTIME") String V_JGTIME,
            @RequestParam(value = "V_WXTYPECODE") String V_WXTYPECODE,
            @RequestParam(value = "V_WXTYPENAME") String V_WXTYPENAME,
            @RequestParam(value = "V_PTYPECODE") String V_PTYPECODE,
            @RequestParam(value = "V_PTYPENAME") String V_PTYPENAME,
            @RequestParam(value = "V_OLD_FLAG") String V_OLD_FLAG,

            @RequestParam(value = "V_REDEPTCODE") String V_REDEPTCODE,
            @RequestParam(value = "V_REDEPTNAME") String V_REDEPTNAME,
            @RequestParam(value = "V_PLANDAY") String V_PLANDAY,
            @RequestParam(value = "V_FZPERCODE") String V_FZPERCODE,
            @RequestParam(value = "V_FZPERNAME") String V_FZPERNAME,

            @RequestParam(value = "V_SGTYPECODE") String V_SGTYPECODE,
            @RequestParam(value = "V_SGTYPENAME") String V_SGTYPENAME,
            @RequestParam(value = "V_SCLBCODE") String V_SCLBCODE,
            @RequestParam(value = "V_SCLBNAME") String V_SCLBNAME,
            @RequestParam(value = "V_PRO_NAME") String V_PRO_NAME,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_INSERT_FJ(V_GUID, V_ORGCODE, V_ORGNAME, V_DEPTCODE, V_DEPTNAME, V_ZYCODE, V_ZYNAME, V_EQUCODE, V_EQUTYPE, V_REPAIRCONTENT,
                V_PLANHOUR, V_REPAIRTYPE, V_REPAIRTYPENAME, V_INPERCODE, V_INPERNAME, V_REMARK, V_V_YEAR, V_V_MONTH, V_TGTIME, V_JGTIME, V_WXTYPECODE, V_WXTYPENAME,
                V_PTYPECODE, V_PTYPENAME, V_OLD_FLAG, V_REDEPTCODE, V_REDEPTNAME, V_PLANDAY, V_FZPERCODE, V_FZPERNAME, V_SGTYPECODE, V_SGTYPENAME, V_SCLBCODE, V_SCLBNAME, V_PRO_NAME);
        return data;
    }

    //--缺陷处理方式
    @RequestMapping(value = "DEFECT_PROCESS_WAY_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map DEFECT_PROCESS_WAY_SEL(
            @RequestParam(value = "V_DEPTCODE") String V_DEPTCODE,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.DEFECT_PROCESS_WAY_SEL(V_DEPTCODE, V_PERCODE);
        return data;
    }

    //维修计划无设备查缺陷
    @RequestMapping(value = "PRO_PM_DEFECT_SPECIL_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_DEFECT_SPECIL_SEL(
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.PRO_PM_DEFECT_SPECIL_SEL();
        return data;
    }

    // 大修从年计划选择查询
    @RequestMapping(value = "PM_PLAN_YEAR_SEL_BYWX", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_SEL_BYWX(
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            @RequestParam(value = "V_V_STATE") String V_V_STATE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_SEL_BYWX(V_V_ORGCODE, V_V_DEPTCODE, V_V_PERCODE, V_V_ZY, V_V_STATE);
        return data;
    }

    //大修放行计划查询
    @RequestMapping(value = "PM_03_PLAN_YEAR_FX_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_PLAN_YEAR_FX_SEL(
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            @RequestParam(value = "V_SDATE") String V_SDATE,
            @RequestParam(value = "V_EDATE") String V_EDATE,
            @RequestParam(value = "V_V_SPECIALTY") String V_V_SPECIALTY,
            @RequestParam(value = "V_V_DEFECT") String V_V_DEFECT,
            @RequestParam(value = "V_V_FLAG") String V_V_FLAG,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_03_PLAN_YEAR_FX_SEL(V_V_ORGCODE, V_V_DEPTCODE, V_V_PERCODE, V_V_ZY, V_SDATE, V_EDATE, V_V_SPECIALTY, V_V_DEFECT, V_V_FLAG);
        return data;
    }


    // 根据放行编码插叙放行数据
    @RequestMapping(value = "MAINTAIN_RELEASE_POSTBACK_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map MAINTAIN_RELEASE_POSTBACK_SEL(
            @RequestParam(value = "FX_GUID") String FX_GUID,
            @RequestParam(value = "V_SIGN") String V_SIGN,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.MAINTAIN_RELEASE_POSTBACK_SEL(FX_GUID, V_SIGN);
        return data;
    }


    @RequestMapping(value = "OVERHAUL_BY_MAINTAINRELEASE_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map OVERHAUL_BY_MAINTAINRELEASE_IN(
            @RequestParam(value = "V_FXGUID") String V_FXGUID,
            @RequestParam(value = "V_YEARGUID") String V_YEARGUID,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.OVERHAUL_BY_MAINTAINRELEASE_IN(V_FXGUID, V_YEARGUID, V_PERCODE);
        return data;
    }

    //维修-计划选择删除原有缺陷
    @RequestMapping(value = "PM_03_PLAN_YEAR_DEF_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_PLAN_YEAR_DEF_DEL(
            @RequestParam(value = "V_V_PROJCET_GUID") String V_V_PROJCET_GUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_03_PLAN_YEAR_DEF_DEL(V_V_PROJCET_GUID);
        return data;
    }

    //计划添加-删除原有大修设备
    @RequestMapping(value = "PM_03_PLAN_YEAR_EQU_BY_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_PLAN_YEAR_EQU_BY_DEL(
            @RequestParam(value = "V_V_PLANGUID") String V_V_PLANGUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_03_PLAN_YEAR_EQU_BY_DEL(V_V_PLANGUID);
        return data;
    }

    //计划添加-删除原有大修模型
    @RequestMapping(value = "PM_03_PLAN_YEAR_MOD_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_PLAN_YEAR_MOD_DEL(
            @RequestParam(value = "V_V_PROJECT_GUID") String V_V_PROJECT_GUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_03_PLAN_YEAR_MOD_DEL(V_V_PROJECT_GUID);
        return data;
    }

    //维修计划修旧缺陷查询
    @RequestMapping(value = "PM_03_PROJECT_DEFECT_SEL_O", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_PROJECT_DEFECT_SEL_O(
            @RequestParam(value = "V_V_PROJECT_GUID") String V_V_PROJECT_GUID) throws Exception {

        Map result = dx_fileService.PM_03_PROJECT_DEFECT_SEL_O(V_V_PROJECT_GUID);
        return result;
    }

    //放行-维修计划缺陷查询

    @RequestMapping(value = "PRO_BY_MAINTAIN_SEL_DEFECT", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_BY_MAINTAIN_SEL_DEFECT(
            @RequestParam(value = "V_FXGUID") String V_FXGUID) throws Exception {

        Map result = dx_fileService.PRO_BY_MAINTAIN_SEL_DEFECT(V_FXGUID);
        return result;
    }

    //放行-缺陷写入
    @RequestMapping(value = "MAINTAIN_BY_DEFECT_INSERT", method = RequestMethod.POST)
    @ResponseBody
    public Map MAINTAIN_BY_DEFECT_INSERT(
            @RequestParam(value = "V_FXGUID") String V_FXGUID,
            @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,
            @RequestParam(value = "V_INPER") String V_INPER,
            @RequestParam(value = "V_DEPT") String V_DEPT,
            @RequestParam(value = "V_ORDCODE") String V_ORDCODE) throws Exception {
        Map result = dx_fileService.MAINTAIN_BY_DEFECT_INSERT(V_FXGUID, V_DEFECTGUID, V_INPER, V_DEPT, V_ORDCODE);
        return result;
    }

    // 分解放行计划创建guid
    @RequestMapping(value = "PM_MAINTAIN_GET_FJGUID", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_MAINTAIN_GET_FJGUID(
            @RequestParam(value = "V_GUID") String V_GUID,
            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
            @RequestParam(value = "V_INPERNAME") String V_INPERNAME,
            @RequestParam(value = "V_UPGUID") String V_UPGUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_MAINTAIN_GET_FJGUID(V_GUID, V_INPERCODE, V_INPERNAME, V_UPGUID);
        return data;
    }

    //获取放行计划数据
    @RequestMapping(value = "PRO_MAINTAIN_REL_POST_GETONE_DATA", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_MAINTAIN_REL_POST_GETONE_DATA(
            @RequestParam(value = "V_FXGUID") String V_FXGUID) throws Exception {

        Map result = dx_fileService.PRO_MAINTAIN_REL_POST_GETONE_DATA(V_FXGUID);
        return result;
    }


    //放行计划子计划写入
    @RequestMapping(value = "MAINTAIN_RELEASE_POSTBACK_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map MAINTAIN_RELEASE_POSTBACK_IN(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "PROJECTCODE") String PROJECTCODE,
            @RequestParam(value = "PROJECTNAME") String PROJECTNAME,
            @RequestParam(value = "WBSCODE") String WBSCODE,
            @RequestParam(value = "WBSNAME") String WBSNAME,
            @RequestParam(value = "V_V_CONTENT") String V_V_CONTENT,
            @RequestParam(value = "V_V_MONEY") String V_V_MONEY,
            @RequestParam(value = "REPAIR_DEPTCODE") String REPAIR_DEPTCODE,
            @RequestParam(value = "REPAIR_DEPTNAME") String REPAIR_DEPTNAME,
            @RequestParam(value = "V_V_FZR") String V_V_FZR,
            @RequestParam(value = "V_STARTDATE") String V_STARTDATE,
            @RequestParam(value = "V_ENDDATE") String V_ENDDATE,
            @RequestParam(value = "IN_PERCODE") String IN_PERCODE,
            @RequestParam(value = "PROJECT_GUID") String PROJECT_GUID,
            @RequestParam(value = "V_UPGUID") String V_UPGUID,
            @RequestParam(value = "V_V_GUID") String V_V_GUID) throws Exception {

        Map result = dx_fileService.MAINTAIN_RELEASE_POSTBACK_IN(V_V_YEAR, V_V_MONTH, V_V_ORGCODE, V_V_DEPTCODE, PROJECTCODE,
                PROJECTNAME, WBSCODE, WBSNAME, V_V_CONTENT, V_V_MONEY, REPAIR_DEPTCODE, REPAIR_DEPTNAME, V_V_FZR, V_STARTDATE,
                V_ENDDATE, IN_PERCODE, PROJECT_GUID, V_UPGUID, V_V_GUID);
        return result;
    }

    //放行sap作业区
    @RequestMapping(value = "PRO_BASE_DEPT_SAP_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_BASE_DEPT_SAP_SEL(
            @RequestParam(value = "V_V_PERSONCODE") String V_V_PERSONCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_DEPTCODENEXT") String V_V_DEPTCODENEXT,
            @RequestParam(value = "V_V_DEPTTYPE") String V_V_DEPTTYPE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PRO_BASE_DEPT_SAP_SEL(V_V_PERSONCODE, V_V_DEPTCODE, V_V_DEPTCODENEXT, V_V_DEPTTYPE);
        return data;
    }

    //维修计划查询缺陷
    @RequestMapping(value = "PM_DEFECTTOFX_SELBYPRO", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_DEFECTTOFX_SELBYPRO(
            @RequestParam(value = "V_V_PROJECT_GUID") String V_V_PROJECT_GUID,
            @RequestParam(value = "V_V_FLAG") String V_V_FLAG,

            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_DEFECTTOFX_SELBYPRO(V_V_PROJECT_GUID, V_V_FLAG);
        return data;
    }

    //放行创建工单
//    @RequestMapping(value = "PRO_PM_WORKORDER_FX_CREATE", method = RequestMethod.POST)
//    @ResponseBody
//    public Map PRO_PM_WORKORDER_FX_CREATE(
//            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
//            @RequestParam(value = "V_V_PERNAME") String V_V_PERNAME,
//            @RequestParam(value = "V_FX_GUID") String V_FX_GUID,
////            @RequestParam(value = "V_FX_GUID") String V_FX_GUID,
//            HttpServletRequest request,
//            HttpServletResponse response) throws Exception {
//        Map data = dx_fileService.PRO_PM_WORKORDER_FX_CREATE(V_V_PERCODE, V_V_PERNAME, V_FX_GUID);
//        return data;
//    }

    //缺陷解决方案写入
    @RequestMapping(value = "DEFECT_BY_MAINTAINPLAN_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map DEFECT_BY_MAINTAINPLAN_IN(
            @RequestParam(value = "V_PROGUID") String V_PROGUID,
            @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,
            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
            @RequestParam(value = "V_INDEPT") String V_INDEPT,
            @RequestParam(value = "V_INORG") String V_INORG,
            @RequestParam(value = "V_DEF_SOLVE") String V_DEF_SOLVE,
            @RequestParam(value = "V_BJ_STUFF") String V_BJ_STUFF,
            @RequestParam(value = "V_EQUCODE") String V_EQUCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.DEFECT_BY_MAINTAINPLAN_IN(V_PROGUID, V_DEFECTGUID, V_INPERCODE, V_INDEPT, V_INORG, V_DEF_SOLVE, V_BJ_STUFF, V_EQUCODE);
        return data;
    }

    //维修计划缺陷解决方案表删除
    @RequestMapping(value = "DEFECT_BY_MAINTAINPLAN_EQU_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map DEFECT_BY_MAINTAINPLAN_EQU_DEL(
            @RequestParam(value = "V_DEFGUID") String V_DEFGUID,
            @RequestParam(value = "V_PROGUID") String V_PROGUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.DEFECT_BY_MAINTAINPLAN_EQU_DEL(V_DEFGUID, V_PROGUID);
        return data;
    }

    //无设备--维修计划缺陷解决方案表删除
    @RequestMapping(value = "DEFECT_BY_MAINTAINPLAN_UNEQU_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map DEFECT_BY_MAINTAINPLAN_UNEQU_DEL(
            @RequestParam(value = "V_DEFGUID") String V_DEFGUID,
            @RequestParam(value = "V_PROGUID") String V_PROGUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.DEFECT_BY_MAINTAINPLAN_UNEQU_DEL(V_DEFGUID, V_PROGUID);
        return data;
    }

    //维修计划保存，缺陷日志写入
    @RequestMapping(value = "PM_DEFECT_LOG_BY_PRO", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_DEFECT_LOG_BY_PRO(
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_PERNAME") String V_PERNAME,
            @RequestParam(value = "V_PROGUID") String V_PROGUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_DEFECT_LOG_BY_PRO(V_PERCODE, V_PERNAME, V_PROGUID);
        return data;
    }

    //计划添加维修计划删除原有缺陷方案
    @RequestMapping(value = "DEFECT_BY_MAINTAINPLAN_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map DEFECT_BY_MAINTAINPLAN_DEL(
            @RequestParam(value = "V_PROGUID") String V_PROGUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.DEFECT_BY_MAINTAINPLAN_DEL(V_PROGUID);
        return data;
    }

    //维修计划-新缺陷日志
    @RequestMapping(value = "PM_DEFECT_LOG_FROMPRO_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_DEFECT_LOG_FROMPRO_IN(
            @RequestParam(value = "V_GUID") String V_GUID,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_DEPTCODE") String V_DEPTCODE,

            @RequestParam(value = "V_ORG") String V_ORG,
            @RequestParam(value = "V_PASS_STAT") String V_PASS_STAT,
            @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,

            @RequestParam(value = "V_DEF_TYPE") String V_DEF_TYPE,
            @RequestParam(value = "V_DEF_LIST") String V_DEF_LIST,
            @RequestParam(value = "V_DEF_DATE") String V_DEF_DATE,
            @RequestParam(value = "V_BJ") String V_BJ,
            @RequestParam(value = "V_SOLVE") String V_SOLVE,

            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_DEFECT_LOG_FROMPRO_IN(V_GUID, V_PERCODE, V_DEPTCODE, V_ORG, V_PASS_STAT, V_DEFECTGUID, V_DEF_TYPE, V_DEF_LIST, V_DEF_DATE, V_BJ, V_SOLVE);
        return data;
    }

    // 年计划待办查找
    @RequestMapping(value = "/PM_PLAN_YEAR_GET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_PLAN_YEAR_GET(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = dx_fileService.PM_PLAN_YEAR_GET(V_V_GUID);

        List<Map<String, Object>> yearlist = (List) data.get("list");

        result.put("list", yearlist);
        result.put("success", true);
        return result;
    }

    //维修计划待办查找
    @RequestMapping(value = "/PRO_PM_03_PLAN_PROJECT_GET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_03_PLAN_PROJECT_GET(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();

        HashMap data = dx_fileService.PRO_PM_03_PLAN_PROJECT_GET(V_V_GUID);

        List<Map<String, Object>> dxfilelist = (List) data.get("list");

        result.put("list", dxfilelist);
        result.put("success", true);
        return result;
    }

    //维修计划审批页缺陷查找

    @RequestMapping(value = "PM_03_PROJECT_DEFECT_SEL_ALL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_PROJECT_DEFECT_SEL_ALL(
            @RequestParam(value = "V_V_PROJECT_GUID") String V_V_PROJECT_GUID,

            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_03_PROJECT_DEFECT_SEL_ALL(V_V_PROJECT_GUID);
        return data;
    }

    //维修计划缺陷审批详情
    @RequestMapping(value = "PM_DEFECT_LOG_FROMPRO_NEW_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_DEFECT_LOG_FROMPRO_NEW_SEL(
            @RequestParam(value = "V_PROGUID") String V_PROGUID,
            @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,

            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_DEFECT_LOG_FROMPRO_NEW_SEL(V_PROGUID, V_DEFECTGUID);
        return data;
    }

    //维修计划流程结束-修改缺陷状态
    @RequestMapping(value = "PM_DEFECT_LOG_FROMPRO_LCJS", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_DEFECT_LOG_FROMPRO_LCJS(
            @RequestParam(value = "V_PROGUID") String V_PROGUID,

            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_DEFECT_LOG_FROMPRO_LCJS(V_PROGUID);
        return data;
    }

    //维修计划关联缺陷日志
    @RequestMapping(value = "PROJECT_BY_DEFECT_LOG_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map PROJECT_BY_DEFECT_LOG_IN(
            @RequestParam(value = "V_PROGUID") String V_PROGUID,
            @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_DEPT") String V_DEPT,
            @RequestParam(value = "V_ORG") String V_ORG,
            @RequestParam(value = "V_STATE") String V_STATE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PROJECT_BY_DEFECT_LOG_IN(V_PROGUID, V_DEFECTGUID, V_PERCODE, V_DEPT, V_ORG, V_STATE);
        return data;
    }

    //工单物料日志明细
    @RequestMapping(value = "PM_WORKORDER_SPARE_LOG_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_WORKORDER_SPARE_LOG_IN(
            @RequestParam(value = "ID") String ID,
            @RequestParam(value = "ORDERGUID") String ORDERGUID,
            @RequestParam(value = "FETCHORDERGUID") String FETCHORDERGUID,
            @RequestParam(value = "ACTIVITY") String ACTIVITY,
            @RequestParam(value = "MATERIALCODE") String MATERIALCODE,
            @RequestParam(value = "MATERIALNAME") String MATERIALNAME,

            @RequestParam(value = "SPEC") String SPEC,
            @RequestParam(value = "UNIT") String UNIT,
            @RequestParam(value = "I_F_UNITPRICE") String I_F_UNITPRICE,
            @RequestParam(value = "I_I_PLANAMOUNT") String I_I_PLANAMOUNT,
            @RequestParam(value = "I_F_PLANMONEY") String I_F_PLANMONEY,
            @RequestParam(value = "I_I_ACTUALAMOUNT") String I_I_ACTUALAMOUNT,

            @RequestParam(value = "I_F_ACTUALMONEY") String I_F_ACTUALMONEY,
            @RequestParam(value = "I_V_TYPE") String I_V_TYPE,
            @RequestParam(value = "I_V_MEMO") String I_V_MEMO,
            @RequestParam(value = "I_V_SUBTYPE") String I_V_SUBTYPE,
            @RequestParam(value = "I_V_STATUS") String I_V_STATUS,
            @RequestParam(value = "I_I_ABANDONEDAMOUNT") String I_I_ABANDONEDAMOUNT,

            @RequestParam(value = "I_I_RECLAIMEDAMOUNT") String I_I_RECLAIMEDAMOUNT,
            @RequestParam(value = "I_I_FIXEDAMOUNT") String I_I_FIXEDAMOUNT,
            @RequestParam(value = "I_V_ID") String I_V_ID,
            @RequestParam(value = "KC_ID") String KC_ID,

            @RequestParam(value = "MAT_STATE") String MAT_STATE,
            @RequestParam(value = "INPERCODE") String INPERCODE,
            @RequestParam(value = "INDEPT") String INDEPT,
            @RequestParam(value = "INORG") String INORG,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_WORKORDER_SPARE_LOG_IN(ID, ORDERGUID, FETCHORDERGUID, ACTIVITY, MATERIALCODE, MATERIALNAME,
                SPEC, UNIT, I_F_UNITPRICE, I_I_PLANAMOUNT, I_F_PLANMONEY, I_I_ACTUALAMOUNT, I_F_ACTUALMONEY, I_V_TYPE, I_V_MEMO, I_V_SUBTYPE,
                I_V_STATUS, I_I_ABANDONEDAMOUNT, I_I_RECLAIMEDAMOUNT, I_I_FIXEDAMOUNT, I_V_ID, KC_ID, MAT_STATE, INPERCODE, INDEPT, INORG);
        return data;
    }

    //工单，删除物料写入日志
    @RequestMapping(value = "PM_WORKORDER_SPARE_SEL_INLOG", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_WORKORDER_SPARE_SEL_INLOG(
            @RequestParam(value = "V_I_ID") String V_I_ID,
            @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
            @RequestParam(value = "V_INDEPT") String V_INDEPT,
            @RequestParam(value = "V_ORG") String V_ORG,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_WORKORDER_SPARE_SEL_INLOG(V_I_ID, V_INPERCODE, V_INDEPT, V_ORG);
        return data;
    }

    //工单查找第一步审批人
    @RequestMapping(value = "PM_ACTIVITI_STEP_LOG_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_ACTIVITI_STEP_LOG_SEL(
            @RequestParam(value = "V_GUID") String V_GUID,
            @RequestParam(value = "V_PRO_GUID") String V_PRO_GUID,
            @RequestParam(value = "V_BEFORE_STEP") String V_BEFORE_STEP,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_ACTIVITI_STEP_LOG_SEL(V_GUID, V_PRO_GUID, V_BEFORE_STEP);
        return data;
    }

    //设备编码查找设备类型
    @RequestMapping(value = "PRO_SAP_EQU_P_SEL_TYPEC", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_SAP_EQU_P_SEL_TYPEC(
            @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PRO_SAP_EQU_P_SEL_TYPEC(V_V_EQUCODE);
        return data;
    }

    //工单物料改变写入
    @RequestMapping(value = "PRO_WORKORDER_MAT_CHANGE_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_WORKORDER_MAT_CHANGE_IN(
            @RequestParam(value = "V_WORKGUID") String V_WORKGUID,
            @RequestParam(value = "V_SIGN") String V_SIGN,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PRO_WORKORDER_MAT_CHANGE_IN(V_WORKGUID, V_SIGN);
        return data;
    }

    //工单物料是否改变查询
    @RequestMapping(value = "PRO_MAT_CHANGE_SIGN_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_MAT_CHANGE_SIGN_SEL(
            @RequestParam(value = "V_WORKGUID") String V_WORKGUID,
            @RequestParam(value = "V_SIGN") String V_SIGN,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PRO_MAT_CHANGE_SIGN_SEL(V_WORKGUID, V_SIGN);
        return data;
    }

    //工单物料状态修改
    @RequestMapping(value = "PRO_WORKORDER_MAT_CHANGE_UPD", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_WORKORDER_MAT_CHANGE_UPD(
            @RequestParam(value = "V_WORKGUID") String V_WORKGUID,
            @RequestParam(value = "V_SIGN") String V_SIGN,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PRO_WORKORDER_MAT_CHANGE_UPD(V_WORKGUID, V_SIGN);
        return data;
    }

    //工单生成新的 缺陷，原数据生成
    @RequestMapping(value = "PRO_PM_DEFECT_AUTO_NEW_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_DEFECT_AUTO_NEW_IN(
            @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_PERNAME") String V_PERNAME,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PRO_PM_DEFECT_AUTO_NEW_IN(V_DEFECTGUID, V_PERCODE, V_PERNAME);
        return data;
    }

    //放行挂链页面放行计划查询
    @RequestMapping(value = "MAINTAIN_RELEASE_BY_DEFECT_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map MAINTAIN_RELEASE_BY_DEFECT_SEL(
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            @RequestParam(value = "V_SDATE") String V_SDATE,
            @RequestParam(value = "V_EDATE") String V_EDATE,
            @RequestParam(value = "V_V_SPECIALTY") String V_V_SPECIALTY,
            @RequestParam(value = "V_V_DEFECT") String V_V_DEFECT,
            @RequestParam(value = "V_V_FLAG") String V_V_FLAG,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.MAINTAIN_RELEASE_BY_DEFECT_SEL(V_V_ORGCODE, V_V_DEPTCODE, V_V_PERCODE, V_V_ZY, V_SDATE, V_EDATE, V_V_SPECIALTY, V_V_DEFECT, V_V_FLAG);
        return data;
    }

    //查询已关联放行计划的缺陷
    @RequestMapping(value = "DEFECT_BY_MAINTAINPLAN_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map DEFECT_BY_MAINTAINPLAN_SEL(
            @RequestParam(value = "V_PROGUID") String V_PROGUID,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_DEPTCODE") String V_DEPTCODE,
            @RequestParam(value = "V_DATE") String V_DATE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.DEFECT_BY_MAINTAINPLAN_SEL(V_PROGUID, V_PERCODE, V_DEPTCODE, V_DATE);
        return data;
    }

    //维修计划审批完成且未上报查询
    @RequestMapping(value = "PRO_PROPLAN_SP_FINISH_SELECT", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PROPLAN_SP_FINISH_SELECT(
            @RequestParam(value = "V_SBSIGN") String V_SBSIGN,
            @RequestParam(value = "V_SCODE") String V_SCODE,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_ORGCODE") String V_ORGCODE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.PRO_PROPLAN_SP_FINISH_SELECT(V_SBSIGN, V_SCODE, V_PERCODE, V_ORGCODE);
        return data;
    }

    //维修计划查找缺陷
    @RequestMapping(value = "PM_DEFECT_BY_PROPASS_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_DEFECT_BY_PROPASS_SEL(
            @RequestParam(value = "V_V_PROGUID") String V_V_PROGUID,

            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.PM_DEFECT_BY_PROPASS_SEL(V_V_PROGUID);
        return data;
    }

    //缺陷跟踪明细写入
    @RequestMapping(value = "PRO_PM_07_DEFECT_LOG_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_07_DEFECT_LOG_SET(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_LOGREMARK") String V_V_LOGREMARK,
            @RequestParam(value = "V_V_FINISHCODE") String V_V_FINISHCODE,
            @RequestParam(value = "V_V_KEY") String V_V_KEY,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.PRO_PM_07_DEFECT_LOG_SET(V_V_GUID, V_V_LOGREMARK, V_V_FINISHCODE, V_V_KEY);
        return data;
    }

    //放行关联缺陷导出
    @RequestMapping(value = "MAINTAIN_DEFECT_EXCEL", method = RequestMethod.GET, produces = "application/html;charset=UTF-8")
    @ResponseBody
    public void MAINTAIN_DEFECT_EXCEL(
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            @RequestParam(value = "V_SDATE") String V_SDATE,
            @RequestParam(value = "V_EDATE") String V_EDATE,
            @RequestParam(value = "V_V_SPECIALTY") String V_V_SPECIALTY,
            @RequestParam(value = "V_V_DEFECT") String V_V_DEFECT,
            @RequestParam(value = "V_V_FLAG") String V_V_FLAG,
            HttpServletRequest request,
            HttpServletResponse response) throws SQLException {

        String V_ORGCODE = V_V_ORGCODE.equals("0") ? "%" : V_V_ORGCODE;
        String V_ZY = V_V_ZY.equals("0") ? "%" : V_V_ZY;
        String V_DEPTCODE = V_V_DEPTCODE.equals("0") ? "%" : V_V_DEPTCODE;
        String V_SPECIALTY = V_V_SPECIALTY.equals("0") ? "%" : V_V_SPECIALTY;
        String V_FLAG = V_V_FLAG.equals("0") ? "%" : V_V_FLAG;
        List list = new ArrayList();

        Map<String, Object> data = dx_fileService.MAINTAIN_RELEASE_BY_DEFECT_SEL(V_V_ORGCODE, V_DEPTCODE, V_V_PERCODE, V_ZY, V_SDATE, V_EDATE, V_SPECIALTY, V_V_DEFECT, V_FLAG);

        HSSFWorkbook wb = new HSSFWorkbook();
        HSSFSheet sheet = wb.createSheet();
        for (int i = 0; i <= 1; i++) {
            sheet.setColumnWidth(i, 3000);
        }
        HSSFRow row = sheet.createRow((int) 0);
        HSSFCellStyle style = wb.createCellStyle();
        style.setAlignment(HSSFCellStyle.ALIGN_CENTER);
        HSSFCell cell = row.createCell((short) 0);
        cell.setCellValue("序号");
        cell.setCellStyle(style);

//        cell = row.createCell((short) 1);
//        cell.setCellValue("放行计划编码");
//        cell.setCellStyle(style);

        cell = row.createCell((short) 1);
        cell.setCellValue("关联缺陷数量");
        cell.setCellStyle(style);

        cell = row.createCell((short) 2);
        cell.setCellValue("放行计划编码");
        cell.setCellStyle(style);

        cell = row.createCell((short) 3);
        cell.setCellValue("放行计划名称");
        cell.setCellStyle(style);

        cell = row.createCell((short) 4);
        cell.setCellValue("放行计划内容");
        cell.setCellStyle(style);

        cell = row.createCell((short) 5);
        cell.setCellValue("放行建设单位");
        cell.setCellStyle(style);

        cell = row.createCell((short) 6);
        cell.setCellValue("放行计划开工时间");
        cell.setCellStyle(style);

        cell = row.createCell((short) 7);
        cell.setCellValue("工程额度(万元）");
        cell.setCellStyle(style);

        cell = row.createCell((short) 8);
        cell.setCellValue("缺陷内容");
        cell.setCellStyle(style);

        if (data.size() > 0) {
            list = (List) data.get("list");


            for (int i = 0; i < list.size(); i++) {
                row = sheet.createRow((int) i + 1);
                Map map = (Map) list.get(i);

                row.createCell((short) 0).setCellValue(i + 1);
//                row.createCell((short) 1).setCellValue(map.get("V_GUID").equals(" ")  ? "" : map.get("V_GUID").toString());
                row.createCell((short) 1).setCellValue(map.get("DEFNUM").equals(" ") ? "" : map.get("DEFNUM").toString());
                row.createCell((short) 2).setCellValue(map.get("V_PROJECT_CODE").equals(" ") ? "" : map.get("V_PROJECT_CODE").toString());
                row.createCell((short) 3).setCellValue(map.get("V_PROJECT_NAME").equals(" ") ? "" : map.get("V_PROJECT_NAME").toString());
                row.createCell((short) 4).setCellValue(map.get("V_CONTENT").equals(" ") ? "" : map.get("V_CONTENT").toString());
                row.createCell((short) 5).setCellValue(map.get("V_DEPTNAME").equals(" ") ? "" : map.get("V_DEPTNAME").toString());
                row.createCell((short) 6).setCellValue(map.get("V_DATE_B").equals(" ") ? "" : map.get("V_DATE_B").toString().substring(0, 10));
                row.createCell((short) 7).setCellValue(map.get("V_MONEY").equals(" ") ? "" : map.get("V_MONEY").toString());
                row.createCell((short) 8).setCellValue(map.get("QXCONTEXT").equals(" ") ? "" : map.get("QXCONTEXT").toString());

            }
            try {
                response.setContentType("application/vnd.ms-excel;charset=UTF-8");
                response.setHeader("Content-Disposition", "attachment; filename="
                        + URLEncoder.encode("厂外申请对放行计划Excel.xls", "UTF-8"));
                OutputStream out = response.getOutputStream();

                wb.write(out);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    //月计划选择年计划查询
    @RequestMapping(value = "PM_PLAN_YEAR_BASIC_TO_MON_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_BASIC_TO_MON_SEL(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_BASIC_TO_MON_SEL(V_V_YEAR);
        return data;
    }

    //月计划填报-查询年计划单条数据
    @RequestMapping(value = "PM_PLAN_YEAR_BASIC_TOMON_GETONE", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_BASIC_TOMON_GETONE(
            @RequestParam(value = "V_YEAEGUID") String V_YEAEGUID,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_BASIC_TOMON_GETONE(V_YEAEGUID);
        return data;
    }

    //月计划创建guid
    @RequestMapping(value = "PM_03_PLAN_MONTH_CREATE", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_PLAN_MONTH_CREATE(
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.PM_03_PLAN_MONTH_CREATE(V_PERCODE, V_V_ORGCODE);
        return data;
    }

    //月计划缺陷关联写入
    @RequestMapping(value = "YEAR_TO_MONTH_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map YEAR_TO_MONTH_IN(
            @RequestParam(value = "V_YEARGUID") String V_YEARGUID,
            @RequestParam(value = "V_MONTHGUID") String V_MONTHGUID,
            @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.YEAR_TO_MONTH_IN(V_YEARGUID, V_MONTHGUID, V_DEFECTGUID, V_PERCODE);
        return data;
    }

    //年计划无缺陷时月计划缺陷内容查找
    @RequestMapping(value = "YEAR_TO_MONTH_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map YEAR_TO_MONTH_SEL(
            @RequestParam(value = "V_YEARGUID") String V_YEARGUID,
            @RequestParam(value = "V_MONTHGUID") String V_MONTHGUID,
            @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,
            @RequestParam(value = "V_PER_CODE") String V_PER_CODE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.YEAR_TO_MONTH_SEL(V_YEARGUID, V_MONTHGUID, V_DEFECTGUID, V_PER_CODE);
        return data;
    }

    //月计划保存-无缺陷年计划修改状态
    @RequestMapping(value = "YEAR_TO_MONTH_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map YEAR_TO_MONTH_UPDATE(
            @RequestParam(value = "V_YEARGUID") String V_YEARGUID,
            @RequestParam(value = "V_MONTHGUID") String V_MONTHGUID,
            @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,
            @RequestParam(value = "V_PER_CODE") String V_PER_CODE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.YEAR_TO_MONTH_UPDATE(V_YEARGUID, V_MONTHGUID, V_DEFECTGUID, V_PER_CODE);
        return data;
    }

    //月计划删除-无缺陷年计划修改状态
    @RequestMapping(value = "YEAR_TO_MONTH_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map YEAR_TO_MONTH_DEL(
            @RequestParam(value = "V_YEARGUID") String V_YEARGUID,
            @RequestParam(value = "V_MONTHGUID") String V_MONTHGUID,
            @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,
            @RequestParam(value = "V_PER_CODE") String V_PER_CODE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.YEAR_TO_MONTH_DEL(V_YEARGUID, V_MONTHGUID, V_DEFECTGUID, V_PER_CODE);
        return data;
    }

    //维修计划审批完成-上报页查询
    @RequestMapping(value = "/PRO_PM_03_PLAN_YEAR_SP_FINISH", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_03_PLAN_YEAR_SP_FINISH(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            @RequestParam(value = "V_V_WXLX") String V_V_WXLX,
            @RequestParam(value = "V_V_CONTENT") String V_V_CONTENT,
            @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
            @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE) throws Exception {

        HashMap data = dx_fileService.PRO_PM_03_PLAN_YEAR_SP_FINISH(V_V_YEAR, V_V_ORGCODE, V_V_DEPTCODE, V_V_ZY, V_V_WXLX, V_V_CONTENT, V_V_PAGE, V_V_PAGESIZE);
        return data;
    }

    //根据工单编码查找放行唯一码
    @RequestMapping(value = "MAINTAIN_TO_WORKORDER_NUM_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map MAINTAIN_TO_WORKORDER_NUM_SEL(
            @RequestParam(value = "V_WORKGUID") String V_WORKGUID) throws Exception {

        Map result = dx_fileService.MAINTAIN_TO_WORKORDER_NUM_SEL(V_WORKGUID);
        return result;
    }

    //月计划修改页-日志记录
    @RequestMapping(value = "YEAR_TO_MONTH_UPDATE2", method = RequestMethod.POST)
    @ResponseBody
    public Map YEAR_TO_MONTH_UPDATE2(
            @RequestParam(value = "V_YEARGUID") String V_YEARGUID,
            @RequestParam(value = "V_MONTHGUID") String V_MONTHGUID,
            @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,
            @RequestParam(value = "V_PER_CODE") String V_PER_CODE,
            HttpServletRequest request,
            HttpServletResponse response
    ) throws Exception {
        Map data = dx_fileService.YEAR_TO_MONTH_UPDATE2(V_YEARGUID, V_MONTHGUID, V_DEFECTGUID, V_PER_CODE);
        return data;
    }

    // 年计划审批完成查询
    @RequestMapping(value = "PM_PLAN_YEAR_SEL_SPFINISH", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_SEL_SPFINISH(
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_PLAN_YEAR_SEL_SPFINISH(V_V_ORGCODE, V_V_DEPTCODE, V_V_PERCODE, V_V_ZY);
        return data;
    }

    //    维修计划查询
    @RequestMapping(value = "PRO_PM_03_PLAN_YEAR_VIEW_TB", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_03_PLAN_YEAR_VIEW_TB(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            @RequestParam(value = "V_V_WXLX") String V_V_WXLX,
            @RequestParam(value = "V_V_CONTENT") String V_V_CONTENT,
            @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
            @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE) throws Exception {

        HashMap data = dx_fileService.PRO_PM_03_PLAN_YEAR_VIEW_TB(V_V_YEAR, V_V_ORGCODE, V_V_DEPTCODE, V_V_ZY, V_V_WXLX, V_V_CONTENT, V_V_PAGE, V_V_PAGESIZE);
        return data;
    }

    //维修计划批量上报-缺陷日志状态修改
    @RequestMapping(value = "PM_DEFECT_LOG_FROMPRO_PLIN", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_DEFECT_LOG_FROMPRO_PLIN(
            @RequestParam(value = "V_WXGUID") String V_WXGUID,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_DEPTCODE") String V_DEPTCODE,

            @RequestParam(value = "V_ORG") String V_ORG,
            @RequestParam(value = "V_PASS_STAT") String V_PASS_STAT,
            @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,

            @RequestParam(value = "V_DEF_TYPE") String V_DEF_TYPE,
            @RequestParam(value = "V_DEF_LIST") String V_DEF_LIST,
            @RequestParam(value = "V_DEF_DATE") String V_DEF_DATE,
            @RequestParam(value = "V_BJ") String V_BJ,
            @RequestParam(value = "V_SOLVE") String V_SOLVE,

            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map data = dx_fileService.PM_DEFECT_LOG_FROMPRO_PLIN(V_WXGUID, V_PERCODE, V_DEPTCODE, V_ORG, V_PASS_STAT, V_DEFECTGUID, V_DEF_TYPE, V_DEF_LIST, V_DEF_DATE, V_BJ, V_SOLVE);
        return data;
    }

    //    查找周计划填报页未处理缺陷
    @RequestMapping(value = "PRO_PM_07_DEFECT_SELECT", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_07_DEFECT_SELECT(@RequestParam(value = "V_V_STATECODE") String V_V_STATECODE,
                                                       @RequestParam(value = "X_PERSONCODE") String X_PERSONCODE,
                                                       @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
                                                       @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
                                                       HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PRO_PM_07_DEFECT_SELECT(V_V_STATECODE, X_PERSONCODE, V_V_PAGE, V_V_PAGESIZE);
        return result;
    }

    //查月计划关联缺陷
    @RequestMapping(value = "PRO_PM_07_DEFECT_SEL_RE_MONTH", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_07_DEFECT_SEL_RE_MONTH(@RequestParam(value = "V_MONTHGUID") String V_MONTHGUID,
                                                             @RequestParam(value = "V_V_STATECODE") String V_V_STATECODE,
                                                             @RequestParam(value = "X_PERSONCODE") String X_PERSONCODE,
                                                             @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
                                                             @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
                                                             HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PRO_PM_07_DEFECT_SEL_RE_MONTH(V_MONTHGUID, V_V_STATECODE, X_PERSONCODE, V_V_PAGE, V_V_PAGESIZE);
        return result;
    }

    //    周计划guid创建
    @RequestMapping(value = "PM_03_PLAN_WEEK_CREATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_03_PLAN_WEEK_CREATE(@RequestParam(value = "V_V_MONTHGUID") String V_V_MONTHGUID,
                                                      @RequestParam(value = "V_V_DEFECTGUID") String V_V_DEFECTGUID,
                                                      @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                                                      @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                      HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PM_03_PLAN_WEEK_CREATE(V_V_MONTHGUID, V_V_DEFECTGUID, V_V_ORGCODE, V_V_PERCODE);
        return result;
    }

    //    周计划缺陷关联写入
    @RequestMapping(value = "PM_DEFECTTOWEEK_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_DEFECTTOWEEK_IN(@RequestParam(value = "V_V_MONTHGUID") String V_V_MONTHGUID,
                                                  @RequestParam(value = "V_V_WEEKGUID") String V_V_WEEKGUID,
                                                  @RequestParam(value = "V_N_DEFECTGUID") String V_N_DEFECTGUID,
                                                  @RequestParam(value = "V_INPER") String V_INPER,
                                                  @RequestParam(value = "V_DEFECTSTATE") String V_DEFECTSTATE,
                                                  HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PM_DEFECTTOWEEK_IN(V_V_MONTHGUID, V_V_WEEKGUID, V_N_DEFECTGUID, V_INPER, V_DEFECTSTATE);
        return result;
    }

    //查询月计划填入周计划数据
    @RequestMapping(value = "PM_03_PLAN_WEEK_GETONE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_03_PLAN_WEEK_GETONE(@RequestParam(value = "MONGUID") String MONGUID,
                                                      @RequestParam(value = "WEEKGUID") String WEEKGUID,
                                                      HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PM_03_PLAN_WEEK_GETONE(MONGUID, WEEKGUID);
        return result;
    }

    //修改周计划缺陷状态  PM_DEFECT_RE_WEEK_UPDATE
    @RequestMapping(value = "PM_DEFECT_RE_WEEK_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_DEFECT_RE_WEEK_UPDATE(@RequestParam(value = "WEEK_GUID") String WEEK_GUID,
                                                        @RequestParam(value = "MONTH_GUID") String MONTH_GUID,
                                                        @RequestParam(value = "V_INPERCODE") String V_INPERCODE,
                                                        HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PM_DEFECT_RE_WEEK_UPDATE(WEEK_GUID, MONTH_GUID, V_INPERCODE);
        return result;
    }

    //    周计划添加页面月计划查询
    @RequestMapping(value = "/PM_03_PLAN_SEL_TOWEEK", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_03_PLAN_SEL_TOWEEK(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_QUARTER") String V_V_QUARTER,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_PLANTYPE") String V_V_PLANTYPE,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,

            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_EQUTYPE") String V_V_EQUTYPE,
            @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            @RequestParam(value = "V_V_CONTENT") String V_V_CONTENT,

            @RequestParam(value = "V_V_PEROCDE") String V_V_PEROCDE,
            @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
            @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PM_03_PLAN_SEL_TOWEEK(V_V_YEAR, V_V_QUARTER, V_V_MONTH, V_V_PLANTYPE, V_V_ORGCODE,
                V_V_DEPTCODE, V_V_EQUTYPE, V_V_EQUCODE, V_V_ZY, V_V_CONTENT,
                V_V_PEROCDE, V_V_PAGE, V_V_PAGESIZE);
        return result;
    }



    //缺陷system标识查询
    @RequestMapping(value = "PM_DEFECT_SYSTEM_SIGN_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_DEFECT_SYSTEM_SIGN_SEL(
            @RequestParam(value = "DEFECTGUID") String DEFECTGUID,
            HttpServletRequest req,
            HttpServletResponse resp) throws Exception {
        Map result = dx_fileService.PM_DEFECT_SYSTEM_SIGN_SEL(DEFECTGUID);
        return result;
    }

    //工单验收费用添加
    @RequestMapping(value = "PRO_PM_WORKORDER_MONEY_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_MONEY_UPDATE(
            @RequestParam(value = "V_WORKORDER") String V_WORKORDER,
            @RequestParam(value = "V_V_MONEY") String V_V_MONEY,
            HttpServletRequest req,
            HttpServletResponse resp) throws Exception {
        Map result = dx_fileService.PRO_PM_WORKORDER_MONEY_UPDATE(V_WORKORDER,V_V_MONEY);
        return result;
    }
    //维修计划缺陷审批状态表格，缺陷删除
    @RequestMapping(value = "PM_DEFECT_LOG_FROMPRO_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_DEFECT_LOG_FROMPRO_DEL(
            @RequestParam(value = "V_PROGUID") String V_PROGUID,
            @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,
            HttpServletRequest req,
            HttpServletResponse resp) throws Exception {
        Map result = dx_fileService.PM_DEFECT_LOG_FROMPRO_DEL(V_PROGUID,V_DEFECTGUID);
        return result;
    }

    //月计划设备关联其他缺陷查找
    @RequestMapping(value = "PRO_PM_07_DEFECT_SELECT_EQU", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_07_DEFECT_SELECT_EQU(@RequestParam(value = "V_V_STATECODE") String V_V_STATECODE,
                                                       @RequestParam(value = "X_PERSONCODE") String X_PERSONCODE,
                                                           @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                       @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
                                                       @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
                                                       HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PRO_PM_07_DEFECT_SELECT_EQU(V_V_STATECODE, X_PERSONCODE,V_V_EQUCODE, V_V_PAGE, V_V_PAGESIZE);
        return result;
    }

    //生成周计划的月计划关联缺陷标记
    @RequestMapping(value = "YEAR_TO_MONTH_CH_WEEK_SIGN", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> YEAR_TO_MONTH_CH_WEEK_SIGN(@RequestParam(value = "V_WEEKGUID") String V_WEEKGUID,
                                                           HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.YEAR_TO_MONTH_CH_WEEK_SIGN(V_WEEKGUID);
        return result;
    }

    @RequestMapping(value = "WORK_FILE_INSERT")
    @ResponseBody
    public ResponseEntity<String> WORK_FILE_INSERT(@RequestParam(value = "FIEL") MultipartFile FILE,
                                                       @RequestParam(value = "V_WORKGUID") String V_WORKGUID,
                                                       @RequestParam(value = "V_FILEGUID") String V_FILEGUID,
                                                       @RequestParam(value = "V_FILENAME") String V_FILENAME,
                                                       @RequestParam(value = "V_INTIME") String V_INTIME ,
                                                       @RequestParam(value = "V_INPER") String V_INPER ,
                                                       @RequestParam(value = "V_REMARK") String V_REMARK,
                                                       @RequestParam(value = "V_BLANK") String V_BLANK,
                                                       @RequestParam(value = "V_FROMPAGE") String V_FROMPAGE,
                                                       HttpServletRequest request,
                                                       HttpServletResponse response) throws Exception {
        HttpHeaders responseHeaders = new HttpHeaders();
        responseHeaders.setContentType(MediaType.TEXT_HTML);
        String filename=FILE.getOriginalFilename();

        Map<String, Object> result = dx_fileService.WORK_FILE_INSERT(V_WORKGUID,V_FILEGUID,filename, FILE.getInputStream(), FILE.getContentType(),V_INTIME, V_INPER, V_REMARK,V_BLANK,V_FROMPAGE);
        String list = (String) result.get("RET");
        String json= "{\"success\":true,\"message\":\""+result+"\"}";
        return new ResponseEntity<String>(json, responseHeaders, HttpStatus.OK);
    }

    //工单附件查找
    @RequestMapping(value = "WORK_FILE_SELECT", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> WORK_FILE_SELECT(@RequestParam(value = "V_WOEKGUID") String V_WOEKGUID,
                                                          @RequestParam(value="V_PERCODE") String V_PERCODE,
                                                          HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.WORK_FILE_SELECT(V_WOEKGUID,V_PERCODE);
        return result;
    }

    //工单附件删除
    @RequestMapping(value = "WORK_FILE_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> WORK_FILE_DEL(@RequestParam(value = "V_WORKGUID") String V_WORKGUID,
                                                @RequestParam(value="V_FILEGUID") String V_FILEGUID,
                                                HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.WORK_FILE_DEL(V_WORKGUID,V_FILEGUID);
        return result;
    }
    //工单附件下载
    @RequestMapping(value = "/WORK_FILE_DOWN", method = RequestMethod.GET)
    @ResponseBody
    public void WORK_FILE_DOWN_NTKO(@RequestParam(value = "V_FILEGUID") String V_FILEGUID,
                                        HttpServletRequest request,
                                        HttpServletResponse response) throws Exception {
        Map result = dx_fileService.WORK_FILE_DOWN(V_FILEGUID);


        Blob fileblob = (Blob) result.get("V_FILEBLOB");

        InputStream is = fileblob.getBinaryStream();


        OutputStream fos = response.getOutputStream();
        byte[] b = new byte[20480];
        int length;
        while ((length = is.read(b)) > 0) {
            fos.write(b, 0, length);
        }
        is.close();
        fos.close();
    }
    //维修简版查询
    @RequestMapping(value = "PRO_PM_03_PLAN_YEAR_VIEW_E", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_03_PLAN_YEAR_VIEW_E(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            @RequestParam(value = "V_V_QSTEXT") String V_V_QSTEXT,

            @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
            @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE) throws Exception {

        Map data = dx_fileService.PRO_PM_03_PLAN_YEAR_VIEW_E(V_V_YEAR, V_V_ORGCODE,V_V_DEPTCODE,V_V_ZY,V_V_QSTEXT,V_V_PAGE,V_V_PAGESIZE);
        return data;
    }

    //维修计划简版缺陷解决方案返回值
    @RequestMapping(value = "DEFECT_BY_MAINTAIN_JJFA_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> DEFECT_BY_MAINTAIN_JJFA_SEL(
            @RequestParam(value = "V_DEFGUID") String V_DEFGUID,
            @RequestParam(value = "V_PRO_GUID") String V_PRO_GUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        Map data = dx_fileService.DEFECT_BY_MAINTAIN_JJFA_SEL(V_DEFGUID, V_PRO_GUID);
        return data;
    }

    @RequestMapping(value = "PRO_PM_03_PLAN_YEAR_SAVE", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_03_PLAN_YEAR_SAVE(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_MONTH") String V_V_MONTH,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_ORGNAME") String V_V_ORGNAME,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_DEPTNAME") String V_V_DEPTNAME,
            @RequestParam(value = "V_V_PORJECT_CODE") String V_V_PORJECT_CODE,
            @RequestParam(value = "V_V_PORJECT_NAME") String V_V_PORJECT_NAME,
            @RequestParam(value = "V_V_SPECIALTY") String V_V_SPECIALTY,
            @RequestParam(value = "V_V_SPECIALTYNAME") String V_V_SPECIALTYNAME,
            @RequestParam(value = "V_V_SPECIALTYMANCODE") String V_V_SPECIALTYMANCODE,
            @RequestParam(value = "V_V_SPECIALTYMAN") String V_V_SPECIALTYMAN,
            @RequestParam(value = "V_V_WXTYPECODE") String V_V_WXTYPECODE,
            @RequestParam(value = "V_V_WXTYPENAME") String V_V_WXTYPENAME,
            @RequestParam(value = "V_V_CONTENT") String V_V_CONTENT,
            @RequestParam(value = "V_V_MONEYBUDGET") String V_V_MONEYBUDGET,
            @RequestParam(value = "V_V_REPAIRDEPTCODE") String V_V_REPAIRDEPTCODE,
            @RequestParam(value = "V_V_BDATE") String V_V_BDATE,
            @RequestParam(value = "V_V_EDATE") String V_V_EDATE,
            @RequestParam(value = "V_V_INMAN") String V_V_INMAN,
            @RequestParam(value = "V_V_INMANCODE") String V_V_INMANCODE,
            @RequestParam(value = "V_V_JHLB") String V_V_JHLB,
            @RequestParam(value = "V_V_SCLB") String V_V_SCLB,
            @RequestParam(value = "V_V_CPZL") String V_V_CPZL,
            @RequestParam(value = "V_V_CPGX") String V_V_CPGX,
            @RequestParam(value = "V_V_SGFS") String V_V_SGFS,
            @RequestParam(value = "V_V_SFXJ") String V_V_SFXJ,
            @RequestParam(value = "V_V_ZBFS") String V_V_ZBFS,
            @RequestParam(value = "V_V_SZ") String V_V_SZ,
            @RequestParam(value = "V_V_GUID_UP") String V_V_GUID_UP,
            @RequestParam(value = "V_V_WBS") String V_V_WBS,
            @RequestParam(value = "V_V_WBS_TXT") String V_V_WBS_TXT,
            @RequestParam(value = "V_V_SUMTIME") String V_V_SUMTIME,
            @RequestParam(value = "V_V_SUMDATE") String V_V_SUMDATE,
            @RequestParam(value = "V_V_SPECIALTY_ZX") String V_V_SPECIALTY_ZX,
            @RequestParam(value = "V_V_SPECIALTY_ZXNAME") String V_V_SPECIALTY_ZXNAME,
            @RequestParam(value = "V_V_BJF") String V_V_BJF,
            @RequestParam(value = "V_V_CLF") String V_V_CLF,
            @RequestParam(value = "V_V_SGF") String V_V_SGF,
            @RequestParam(value="V_V_QSTEXT") String V_V_QSTEXT,
            @RequestParam(value="V_V_WXCLASS") String V_V_WXCLASS) throws Exception {

        Map result = dx_fileService.PRO_PM_03_PLAN_YEAR_SAVE(V_V_GUID, V_V_YEAR, V_V_MONTH, V_V_ORGCODE, V_V_ORGNAME, V_V_DEPTCODE, V_V_DEPTNAME, V_V_PORJECT_CODE, V_V_PORJECT_NAME,
                V_V_SPECIALTY, V_V_SPECIALTYNAME, V_V_SPECIALTYMANCODE, V_V_SPECIALTYMAN, V_V_WXTYPECODE, V_V_WXTYPENAME, V_V_CONTENT, V_V_MONEYBUDGET, V_V_REPAIRDEPTCODE,
                V_V_BDATE, V_V_EDATE, V_V_INMAN, V_V_INMANCODE, V_V_JHLB, V_V_SCLB, V_V_CPZL, V_V_CPGX, V_V_SGFS, V_V_SFXJ, V_V_ZBFS, V_V_SZ, V_V_GUID_UP, V_V_WBS, V_V_WBS_TXT,
                V_V_SUMTIME, V_V_SUMDATE,V_V_SPECIALTY_ZX,V_V_SPECIALTY_ZXNAME,V_V_BJF,V_V_CLF,V_V_SGF,V_V_QSTEXT,V_V_WXCLASS);
        return result;
    }

    //简版维修计划导出
   @RequestMapping(value="/WXEXPORTEXCEL",method=RequestMethod.GET,produces = "application/html;charset=UTF-8")
   @ResponseBody
   public void WXEXPORTEXCEL( @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
                              @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
                              @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                              @RequestParam(value = "V_V_ZY") String V_V_ZY,
                              @RequestParam(value = "V_V_QSTEXT") String V_V_QSTEXT,
                              HttpServletResponse res,
                              HttpServletRequest req)throws SQLException{
        String ORGCODE=V_V_ORGCODE.equals("0")?"%":V_V_ORGCODE;
       String DEPTCODE=V_V_DEPTCODE.equals("0")?"%":V_V_DEPTCODE;
       String ZY=V_V_ZY.equals("0")?"%":V_V_ZY;
       List list =new ArrayList();

       Map<String, Object> data=dx_fileService.PRO_PM_03_PLAN_YEAR_VIEW_ED(V_V_YEAR,ORGCODE,DEPTCODE,ZY,V_V_QSTEXT);

       HSSFWorkbook wb=new HSSFWorkbook();
       HSSFSheet sheet = wb.createSheet();
       for (int i = 0; i <= 1; i++) {
           sheet.setColumnWidth(i, 3000);
       }
       HSSFRow row = sheet.createRow((int) 0);
       HSSFCellStyle style = wb.createCellStyle();
       style.setAlignment(HSSFCellStyle.ALIGN_CENTER);

       HSSFCell cell = row.createCell((short) 0);
       cell.setCellValue("序号");
       cell.setCellStyle(style);

       cell = row.createCell((short) 1);
       cell.setCellValue("工程状态");
       cell.setCellStyle(style);

       cell = row.createCell((short) 2);
       cell.setCellValue("工程编码");
       cell.setCellStyle(style);

       cell = row.createCell((short) 3);
       cell.setCellValue("工程名称");
       cell.setCellStyle(style);

       cell = row.createCell((short) 4);
       cell.setCellValue("专业");
       cell.setCellStyle(style);

       cell = row.createCell((short) 5);
       cell.setCellValue("工程请示内容");
       cell.setCellStyle(style);

       cell = row.createCell((short) 6);
       cell.setCellValue("开工时间");
       cell.setCellStyle(style);

       cell = row.createCell((short) 7);
       cell.setCellValue("竣工时间");
       cell.setCellStyle(style);

       cell = row.createCell((short) 8);
       cell.setCellValue("缺陷详情");
       cell.setCellStyle(style);

       if (data.size() > 0) {
           list = (List) data.get("list");


           for (int i = 0; i < list.size(); i++) {
               row = sheet.createRow((int) i + 1);
               Map map = (Map) list.get(i);

               row.createCell((short) 0).setCellValue(i + 1);
               row.createCell((short) 1).setCellValue(map.get("V_STATENAME").equals(" ") ? "" : map.get("V_STATENAME").toString());
               row.createCell((short) 2).setCellValue(map.get("V_PORJECT_CODE").equals(" ") ? "" : map.get("V_PORJECT_CODE").toString());
               row.createCell((short) 3).setCellValue(map.get("V_PORJECT_NAME").equals(" ") ? "" : map.get("V_PORJECT_NAME").toString());
               row.createCell((short) 4).setCellValue(map.get("V_SPECIALTYNAME").equals(" ") ? "" : map.get("V_SPECIALTYNAME").toString());
               row.createCell((short) 5).setCellValue(map.get("V_QSTEXT").equals(" ") ? "" : map.get("V_QSTEXT").toString());
               row.createCell((short) 6).setCellValue(map.get("V_BDATE").equals(" ") ? "" : map.get("V_BDATE").toString().substring(0, 10));
               row.createCell((short) 7).setCellValue(map.get("V_EDATE").equals(" ") ? "" : map.get("V_EDATE").toString().substring(0, 10));
               row.createCell((short) 8).setCellValue(map.get("DEFNUM").equals(" ") ? "" : map.get("DEFNUM").toString());

           }
           try {
               res.setContentType("application/vnd.ms-excel;charset=UTF-8");
               res.setHeader("Content-Disposition", "attachment; filename="
                       + URLEncoder.encode("维修计划导出Excel.xls", "UTF-8"));
               OutputStream out = res.getOutputStream();

               wb.write(out);
               out.flush();
               out.close();
           } catch (Exception e) {
               e.printStackTrace();
           }
       }
   }
    //    维修计划状态修改
    @RequestMapping(value = "PM_03_PLAN_PROJECT_STAT_SET", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_03_PLAN_PROJECT_STAT_SET(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_STATE") String V_V_STATE,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        Map data = dx_fileService.PM_03_PLAN_PROJECT_STAT_SET(V_V_GUID, V_V_STATE);
        return data;
    }

    ////月计划查找缺陷添加缺陷  PRO_PM_07_DEFECT_SEL_RE_MONTH2
    @RequestMapping(value = "PRO_PM_07_DEFECT_SEL_RE_MONTH2", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_07_DEFECT_SEL_RE_MONTH2(
            @RequestParam(value = "V_MONTHGUID") String V_MONTHGUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        Map data = dx_fileService.PRO_PM_07_DEFECT_SEL_RE_MONTH2(V_MONTHGUID);
        return data;
    }
    //    工单查询  缺陷详情
    @RequestMapping(value = "PRO_PM_DEFECT_SEL_FROM_WORK", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_DEFECT_SEL_FROM_WORK(
            @RequestParam(value = "V_WORK_GUID") String V_WORK_GUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        Map data = dx_fileService.PRO_PM_DEFECT_SEL_FROM_WORK(V_WORK_GUID);
        return data;
    }

    //缺陷查找工单
    @RequestMapping(value = "PRO_PM_WORKORDER_SEL_FROM_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_SEL_FROM_DEL(
            @RequestParam(value = "V_DEL_GUID") String V_DEL_GUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        Map data = dx_fileService.PRO_PM_WORKORDER_SEL_FROM_DEL(V_DEL_GUID);
        return data;
    }

    //放行计划查找缺陷
    @RequestMapping(value = "MAINTAIN_BY_DEFECT_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> MAINTAIN_BY_DEFECT_SEL(
            @RequestParam(value = "V_FX_GUID") String V_FX_GUID,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        Map data = dx_fileService.MAINTAIN_BY_DEFECT_SEL(V_FX_GUID);
        return data;
    }

    //放行计划查找缺陷
    @RequestMapping(value = "PRO_PM_WORKORDER_FX_CREATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_FX_CREATE(
            @RequestParam(value = "V_V_ORG_CODE") String V_V_ORG_CODE,
            @RequestParam(value = "V_PERCODE") String V_PERCODE,
            @RequestParam(value = "V_FXGUID") String V_FXGUID,
            @RequestParam(value = "V_V_DEFECTLIST") String V_V_DEFECTLIST,
            HttpServletRequest request,
            HttpServletResponse response) throws Exception {

        Map data = dx_fileService.PRO_PM_WORKORDER_FX_CREATE(V_V_ORG_CODE,V_PERCODE,V_FXGUID,V_V_DEFECTLIST);
        return data;
    }
    //工单查找缺陷
    @RequestMapping(value = "PM_DEFECT_SEL_TO_WORK", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_DEFECT_SEL_TO_WORK(@RequestParam(value = "V_V_WORKORDER_GUID") String V_V_WORKORDER_GUID,
                                                              @RequestParam(value = "V_V_FLAG") String V_V_FLAG,
                                                              HttpServletRequest request,
                                                              HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PM_DEFECT_SEL_TO_WORK(V_V_WORKORDER_GUID, V_V_FLAG);
        return result;
    }

    //周计划--备件查找
    @RequestMapping(value = "PRO_DEFECT_PART_DATA_SEL_N", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_DEFECT_PART_DATA_SEL_N(@RequestParam(value = "V_V_TYPE") String V_V_TYPE,
                                                     @RequestParam(value = "V_V_INPER") String V_V_INPER,
                                                     @RequestParam(value = "V_V_STATE") String V_V_STATE,
                                                     @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
                                                     @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,

                                                     HttpServletRequest request,
                                                     HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PRO_DEFECT_PART_DATA_SEL_N(V_V_TYPE,V_V_INPER,V_V_STATE,V_V_PAGE,V_V_PAGESIZE);
        return result;
    }

    //周计划生成工单webcode判断
    @RequestMapping(value = "PM_03_PLAN_WBS_COMPARE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_03_PLAN_WBS_COMPARE(@RequestParam(value = "V_V_GUID") String V_V_GUID,

                                                          HttpServletRequest request,
                                                          HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PM_03_PLAN_WBS_COMPARE(V_V_GUID);
        return result;
    }

    //周计划关联缺陷
    @RequestMapping(value = "PM_DEFECTTOWEEK_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_DEFECTTOWEEK_SEL(@RequestParam(value = "V_WEEKGUID") String V_WEEKGUID,

                                                      HttpServletRequest request,
                                                      HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PM_DEFECTTOWEEK_SEL(V_WEEKGUID);
        return result;
    }

    //周计划关联缺陷删除 PM_DEFECTTOWEEK_DEL
    @RequestMapping(value = "PM_DEFECTTOWEEK_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_DEFECTTOWEEK_DEL(@RequestParam(value = "V_V_WEEKGUID") String V_V_WEEKGUID,
                                                   @RequestParam(value = "DEF_GUID") String DEF_GUID,
                                                   @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                                      HttpServletRequest request,
                                                      HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PM_DEFECTTOWEEK_DEL(V_V_WEEKGUID,DEF_GUID,V_V_PERCODE);
        return result;
    }

    //周计划关联月计划写入-修改
    @RequestMapping(value = "PM_03_PLAN_WEEK_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_03_PLAN_WEEK_UPDATE(@RequestParam(value = "V_V_MONTHGUID") String V_V_MONTHGUID,
                                                   @RequestParam(value = "V_V_DEFECTGUID") String V_V_DEFECTGUID,
                                                      @RequestParam(value = "V_WEEKGUID") String V_WEEKGUID,
                                                   HttpServletRequest request,
                                                   HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PM_03_PLAN_WEEK_UPDATE(V_V_MONTHGUID,V_V_DEFECTGUID,V_WEEKGUID);
        return result;
    }
    ////清除未保存 的周计划关联缺陷 PM_DEFECTTOWEEK_DELALL_OLD
    @RequestMapping(value = "PM_DEFECTTOWEEK_DELALL_OLD", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_DEFECTTOWEEK_DELALL_OLD(@RequestParam(value = "V_V_MONTHGUID") String V_V_MONTHGUID,
                                                      @RequestParam(value = "V_V_WEEKGUID") String V_V_WEEKGUID,
                                                      @RequestParam(value = "V_INPER") String V_INPER,
                                                      @RequestParam(value="V_DEFECTSTATE") String V_DEFECTSTATE,
                                                      HttpServletRequest request,
                                                      HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PM_DEFECTTOWEEK_DELALL_OLD(V_V_MONTHGUID,V_V_WEEKGUID,V_INPER,V_DEFECTSTATE);
        return result;
    }
    //查找未关联月计划的周计划关联缺陷
    @RequestMapping(value = "PM_03_PLAN_WEEK_GET_DEF", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_03_PLAN_WEEK_GET_DEF(@RequestParam(value = "WEEKGUID") String WEEKGUID,

                                                          HttpServletRequest request,
                                                          HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PM_03_PLAN_WEEK_GET_DEF(WEEKGUID);
        return result;
    }

    //修改周计划表格中主要缺陷
    @RequestMapping(value = "PRO_PLAN_WEEK_MAINDEF_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PLAN_WEEK_MAINDEF_UPDATE(@RequestParam(value = "WEEK_GUID") String WEEK_GUID,

                                                       HttpServletRequest request,
                                                       HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PRO_PLAN_WEEK_MAINDEF_UPDATE(WEEK_GUID);
        return result;
    }
    //缺陷保存过程-状态手动添加
    @RequestMapping(value = "/PRO_PM_07_DEFECT_SET_STAT", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_07_DEFECT_SET_STAT(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                    @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE,
                                    @RequestParam(value = "V_V_PERNAME") String V_V_PERNAME,
                                    @RequestParam(value = "V_V_INPERCODE") String V_V_INPERCODE,
                                    @RequestParam(value = "V_V_INPERNAME") String V_V_INPERNAME,
                                    @RequestParam(value = "V_V_DEFECTLIST") String V_V_DEFECTLIST,
                                    @RequestParam(value = "V_V_SOURCECODE") String V_V_SOURCECODE,
                                    @RequestParam(value = "V_V_SOURCEID") String V_V_SOURCEID,
                                    @RequestParam(value = "V_D_DEFECTDATE") String V_D_DEFECTDATE,
                                    @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
                                    @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                    @RequestParam(value = "V_V_EQUCHILDCODE") String V_V_EQUCHILDCODE,
                                    @RequestParam(value = "V_V_IDEA") String V_V_IDEA,
                                    @RequestParam(value = "V_V_LEVEL") String V_V_LEVEL,
                                    @RequestParam(value = "V_V_PROWAY") String V_V_PROWAY,
                                    @RequestParam(value = "V_STATE") String V_STATE,
                                    HttpServletRequest request,
                                    HttpServletResponse response) throws Exception {
        Map result = dx_fileService.PRO_PM_07_DEFECT_SET_STAT(V_V_GUID, V_V_PERCODE,V_V_PERNAME,V_V_INPERCODE,V_V_INPERNAME,V_V_DEFECTLIST, V_V_SOURCECODE,
                V_V_SOURCEID, V_D_DEFECTDATE, V_V_DEPTCODE, V_V_EQUCODE, V_V_EQUCHILDCODE, V_V_IDEA,
                V_V_LEVEL,V_V_PROWAY,V_STATE);
        return result;
    }
    //年计划缺陷查询
    @RequestMapping(value = "PM_PLAN_YEAR_RE_DEFECT_SEL2", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_PLAN_YEAR_RE_DEFECT_SEL2(
            @RequestParam(value = "V_V_QXLX") String V_V_QXLX,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE) throws Exception {
        Map result = dx_fileService.PM_PLAN_YEAR_RE_DEFECT_SEL2(V_V_QXLX,V_V_PERCODE);
        return result;
    }

    @RequestMapping(value = "PM_DEFECTTOWORKORDER_SETDM", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_DEFECTTOWORKORDER_SETDM(
            @RequestParam(value = "V_V_DEFECTGUID") String V_V_DEFECTGUID,
            @RequestParam(value = "V_V_MONTHGUID") String V_V_MONTHGUID,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE) throws Exception {
        Map result = dx_fileService.PM_DEFECTTOWORKORDER_SETDM(V_V_DEFECTGUID,V_V_MONTHGUID,V_V_PERCODE);
        return result;
    }

    @RequestMapping(value = "PM_DEFECTTOWORKORDER_SETDW", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_DEFECTTOWORKORDER_SETDW(
            @RequestParam(value = "V_V_DEFECTGUID") String V_V_DEFECTGUID,
            @RequestParam(value = "V_V_WEEKGUID") String V_V_WEEKGUID,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE) throws Exception {
        Map result = dx_fileService.PM_DEFECTTOWORKORDER_SETDW(V_V_DEFECTGUID,V_V_WEEKGUID,V_V_PERCODE);
        return result;
    }

    @RequestMapping(value = "PM_DEFECTTOWORKORDER_SETMW", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_DEFECTTOWORKORDER_SETMW(
            @RequestParam(value = "V_V_DEFECTGUID") String V_V_DEFECTGUID,
            @RequestParam(value = "V_V_MONTHGUID") String V_V_MONTHGUID,
            @RequestParam(value = "V_V_WEEKGUID") String V_V_WEEKGUID,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE) throws Exception {
        Map result = dx_fileService.PM_DEFECTTOWORKORDER_SETMW(V_V_DEFECTGUID,V_V_MONTHGUID,V_V_WEEKGUID,V_V_PERCODE);
        return result;
    }

    @RequestMapping(value = "PM_DEFECTTOWORKORDER_DELDM", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_DEFECTTOWORKORDER_DELDM(
            @RequestParam(value = "V_V_MONTHGUID") String V_V_MONTHGUID,
            @RequestParam(value = "V_V_DEFECTGUID") String V_V_DEFECTGUID,
            @RequestParam(value = "V_V_PERCODE") String V_V_PERCODE) throws Exception {
        Map result = dx_fileService.PM_DEFECTTOWORKORDER_DELDM(V_V_MONTHGUID,V_V_DEFECTGUID,V_V_PERCODE);
        return result;
    }

    //放行生成工单缺陷表写入
    @RequestMapping(value = "MAINTAIN_BY_DEFECT_INSERT_TOWORK", method = RequestMethod.POST)
    @ResponseBody
    public Map MAINTAIN_BY_DEFECT_INSERT_TOWORK(
            @RequestParam(value = "V_FXGUID") String V_FXGUID,
            @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,
            @RequestParam(value = "V_INPER") String V_INPER,
            @RequestParam(value = "V_DEPT") String V_DEPT,
            @RequestParam(value = "V_ORDCODE") String V_ORDCODE) throws Exception {
        Map result = dx_fileService.MAINTAIN_BY_DEFECT_INSERT_TOWORK(V_FXGUID, V_DEFECTGUID, V_INPER, V_DEPT, V_ORDCODE);
        return result;
    }
    //放行计划上报人调取
    @RequestMapping(value = "PM_WX_SBTABLE_SELECT", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_WX_SBTABLE_SELECT(
            @RequestParam(value = "V_ORG") String V_ORG,
            @RequestParam(value = "V_DEPT") String V_DEPT,
            @RequestParam(value = "V_PER") String V_PER,
            @RequestParam(value = "TEMP_1") String TEMP_1,
            @RequestParam(value = "TEMP_2") String TEMP_2) throws Exception {
        Map result = dx_fileService.PM_WX_SBTABLE_SELECT(V_ORG, V_DEPT, V_PER, TEMP_1, TEMP_2);
        return result;
    }

    //是否为备件生成维修缺陷判别
    @RequestMapping(value = "PM_03_PLAN_YEAR_EQU_SELNUM", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_PLAN_YAEAR_EQU_SELNUM(
            @RequestParam(value = "V_V_PROGUID") String V_V_PROGUID) throws Exception {
        Map result = dx_fileService.PM_03_PLAN_YEAR_EQU_SELNUM(V_V_PROGUID);
        return result;
    }

    //维修查看所有类别关联缺陷详情列表
    @RequestMapping(value = "PM_03_PROJECT_DEFECT_SEL_Q", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_03_PROJECT_DEFECT_SEL_Q(
            @RequestParam(value = "V_V_PROJECT_GUID") String V_V_PROJECT_GUID) throws Exception {

        Map result = dx_fileService.PM_03_PROJECT_DEFECT_SEL_Q(V_V_PROJECT_GUID);
        return result;
    }

    //   月计划删除缺陷修改 PRO_PM_DEL_MONTH_RE_DEF
    @RequestMapping(value = "PRO_PM_DEL_MONTH_RE_DEF", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_DEL_MONTH_RE_DEF(
            @RequestParam(value = "V_V_GUID") String V_V_GUID) throws Exception {

        Map result = dx_fileService.PRO_PM_DEL_MONTH_RE_DEF(V_V_GUID);
        return result;
    }
   //工单验收-缺陷关联工单 PM_DEFECT_RE_WORK_INSERT
   @RequestMapping(value = "PM_DEFECT_RE_WORK_INSERT", method = RequestMethod.POST)
   @ResponseBody
   public Map PM_DEFECT_RE_WORK_INSERT(
           @RequestParam(value = "V_V_WGUID") String V_V_WGUID,
           @RequestParam(value = "V_DEFGUID") String V_DEFGUID) throws Exception {

       Map result = dx_fileService.PM_DEFECT_RE_WORK_INSERT(V_V_WGUID,V_DEFGUID);
       return result;
   }

    //周计划-按月计划设备查找其他缺陷
    @RequestMapping(value = "PRO_PM_07_DEFECT_SELECT_N", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_07_DEFECT_SELECT_N(@RequestParam(value = "V_V_STATECODE") String V_V_STATECODE,
                                                       @RequestParam(value = "X_PERSONCODE") String X_PERSONCODE,
                                                         @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                       @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
                                                       @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE,
                                                       HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PRO_PM_07_DEFECT_SELECT_N(V_V_STATECODE, X_PERSONCODE, V_V_EQUCODE, V_V_PAGE, V_V_PAGESIZE);
        return result;
    }

    //月计划已选择缺陷查看
    @RequestMapping(value = "YEAR_TO_MONTH_LIST", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> YEAR_TO_MONTH_LIST(@RequestParam(value = "V_MONTHGUID") String V_MONTHGUID,
                                                         @RequestParam(value = "V_PERCODE") String V_PERCODE,

                                                         HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.YEAR_TO_MONTH_LIST(V_MONTHGUID, V_PERCODE);
        return result;
    }

    //月计划缺陷关联删除
    @RequestMapping(value = "YEAR_TO_MONTH_SDEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> YEAR_TO_MONTH_SDEL(@RequestParam(value = "V_MONTH_GUID") String V_MONTH_GUID,
                                                  @RequestParam(value = "V_DEF_GUID") String V_DEF_GUID,

                                                  HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.YEAR_TO_MONTH_SDEL(V_MONTH_GUID, V_DEF_GUID);
        return result;
    }

    @RequestMapping(value = "MONTH_ADDDEF_EQUCODE_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> MONTH_ADDDEF_EQUCODE_SEL(@RequestParam(value = "V_MONTHGUID") String V_MONTHGUID,
                                                  HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.MONTH_ADDDEF_EQUCODE_SEL(V_MONTHGUID);
        return result;
    }

    @RequestMapping(value = "PM_MONTH_DEL_CHVALUE", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_MONTH_DEL_CHVALUE(@RequestParam(value = "V_MONTHGUID") String V_MONTHGUID,
                                                        HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PM_MONTH_DEL_CHVALUE(V_MONTHGUID);
        return result;
    }

    @RequestMapping(value = "PM_MONTH_OTHERDEL_STATCH", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_MONTH_OTHERDEL_STATCH(@RequestParam(value = "V_MONTHGUID") String V_MONTHGUID,
                                                    HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PM_MONTH_OTHERDEL_STATCH(V_MONTHGUID);
        return result;
    }

    @RequestMapping(value = "PM_DEFECTTOWEEK_DEL_ALL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_DEFECTTOWEEK_DEL_ALL(@RequestParam(value = "V_V_WEEKGUID") String V_V_WEEKGUID,
                                                        @RequestParam(value = "V_INPER") String V_INPER,
                                                        HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PM_DEFECTTOWEEK_DEL_ALL(V_V_WEEKGUID,V_INPER);
        return result;
    }
    //月计划其他缺陷添加设备返回值
    @RequestMapping(value = "YEAR_TO_MONTH_SDEF_EQU", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> YEAR_TO_MONTH_SDEF_EQU(@RequestParam(value = "V_YEARGUID") String V_YEARGUID,
                                                       @RequestParam(value = "V_MONTHGUID") String V_MONTHGUID,
                                                      @RequestParam(value = "V_DEFECTGUID") String V_DEFECTGUID,
                                                      @RequestParam(value = "V_PER_CODE") String V_PER_CODE,
                                                       HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.YEAR_TO_MONTH_SDEF_EQU(V_YEARGUID,V_MONTHGUID,V_DEFECTGUID,V_PER_CODE);
        return result;
    }

    //缺陷统计（设备部）
    @RequestMapping(value = "PRO_PM_07_DEF_SBBTJ_VIEW", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_07_DEF_SBBTJ_VIEW(@RequestParam(value = "V_NF") String V_NF,
                                                      @RequestParam(value = "V_YF") String V_YF,
                                                      HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PRO_PM_07_DEF_SBBTJ_VIEW(V_NF,V_YF);
        return result;
    }
    //工单类型判别
    @RequestMapping(value = "PRO_MAINTAIN_BY_DEF_SELSIGN", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_MAINTAIN_BY_DEF_SELSIGN(@RequestParam(value = "V_WORKORDER") String V_WORKORDER,
                                                        HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PRO_MAINTAIN_BY_DEF_SELSIGN(V_WORKORDER);
        return result;
    }
    //维修计划备件查询
    @RequestMapping(value = "PRO_PM_DEFECT_SPECIL_SEL2", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_DEFECT_SPECIL_SEL2(@RequestParam(value = "V_DEPT_CODE") String V_DEPT_CODE,
                                                           HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PRO_PM_DEFECT_SPECIL_SEL2(V_DEPT_CODE);
        return result;
    }

    //工单接收、返回下一步人员查找
    @RequestMapping(value = "WORKCTR_TO_PERCODE_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> WORKCTR_TO_PERCODE_SEL(@RequestParam(value = "V_V_REPAIRCODE") String V_V_REPAIRCODE,
                                                      @RequestParam(value = "V_V_EQUCODE") String V_V_EQUCODE,
                                                         HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.WORKCTR_TO_PERCODE_SEL(V_V_REPAIRCODE,V_V_EQUCODE);
        return result;
    }

    //生产写实状态修改
    @RequestMapping(value = "PP_INFORMATION_STAT_UPDT", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PP_INFORMATION_STAT_UPDT(@RequestParam(value = "V_ID") String V_ID,
                                                        @RequestParam(value = "V_STATE") String V_STATE,
                                                        @RequestParam(value = "V_DEFCODE") String V_DEFCODE,
                                                      HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PP_INFORMATION_STAT_UPDT(V_ID,V_STATE,V_DEFCODE);
        return result;
    }

    //生产写实完成处理
    @RequestMapping(value = "PP_INFORMATION_FINISH_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PP_INFORMATION_FINISH_IN(@RequestParam(value = "V_ID") String V_ID,
                                                      @RequestParam(value = "V_PERCODE") String V_PERCODE,
                                                        @RequestParam(value = "V_PERNAME") String V_PERNAME,
                                                        @RequestParam(value = "V_REMARK") String V_REMARK,
                                                      HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PP_INFORMATION_FINISH_IN(V_ID,V_PERCODE,V_PERNAME,V_REMARK);
        return result;
    }

    /*外围计划删除写入*/
    @RequestMapping(value = "PM_PLAN_PROJECT_LOG_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_PLAN_PROJECT_LOG_IN(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                        @RequestParam(value = "V_PERCODE") String V_PERCODE,
                                                        @RequestParam(value = "V_V_PERNAME") String V_V_PERNAME,
                                                        @RequestParam(value = "V_OPINION") String V_OPINION,
                                                        HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PM_PLAN_PROJECT_LOG_IN(V_V_GUID,V_PERCODE,V_V_PERNAME,V_OPINION);
        return result;
    }

    /*月计划删除写入*/
    @RequestMapping(value = "PM_PLAN_MONTH_LOG_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_PLAN_MONTH_LOG_IN(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                      @RequestParam(value = "V_PERCODE") String V_PERCODE,
                                                      @RequestParam(value = "V_PERNAME") String V_PERNAME,
                                                      @RequestParam(value = "V_OPERATION") String V_OPERATION,
                                                      HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PM_PLAN_MONTH_LOG_IN(V_V_GUID,V_PERCODE,V_PERNAME,V_OPERATION);
        return result;
    }

    /*周计划删除写入*/
    @RequestMapping(value = "PM_PLAN_WEEK_LOG_IN", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_PLAN_WEEK_LOG_IN(@RequestParam(value = "V_V_GUID") String V_V_GUID,
                                                    @RequestParam(value = "V_PERCODE") String V_PERCODE,
                                                    @RequestParam(value = "V_PERNAME") String V_PERNAME,
                                                    @RequestParam(value = "V_OPERATION") String V_OPERATION,
                                                    HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PM_PLAN_WEEK_LOG_IN(V_V_GUID,V_PERCODE,V_PERNAME,V_OPERATION);
        return result;
    }

    //缺陷跟踪负责人
    @RequestMapping(value = "PRO_DEFECT_PER_VIEW_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_DEFECT_PER_VIEW_SEL(@RequestParam(value = "V_V_DEPT") String V_V_DEPT,
                                                       @RequestParam(value="V_V_EQUTYPE") String V_V_EQUTYPE,
                                                       @RequestParam(value = "V_V_EQU") String V_V_EQU,
                                                       HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PRO_DEFECT_PER_VIEW_SEL(V_V_DEPT,V_V_EQUTYPE,V_V_EQU);
        return result;
    }

    //工单接收-厂矿下拉列表
    @RequestMapping(value = "PRO_BASE_ORG_FROMW_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_BASE_ORG_FROMW_SEL(@RequestParam(value = "WORKORDER") String WORKORDER,
                                                       HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PRO_BASE_ORG_FROMW_SEL(WORKORDER);
        return result;
    }
    //工单接收-检修单位下拉列表
    @RequestMapping(value = "PRO_BASE_DEPT_FROMW_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_BASE_DEPT_FROMW_SEL(@RequestParam(value = "WORKORDER") String WORKORDER,
                                                       HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PRO_BASE_DEPT_FROMW_SEL(WORKORDER);
        return result;
    }

    //维修计划状态下拉
    @RequestMapping(value = "PM_03_PLAN_YEAR_STATE_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_03_PLAN_YEAR_STATE_SEL(HttpServletRequest request)
            throws SQLException {
        Map<String, Object> result = dx_fileService.PM_03_PLAN_YEAR_STATE_SEL();
        return result;
    }

    //维修简版查询
    @RequestMapping(value = "PRO_PM_03_PLAN_YEAR_VIEW_Q", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_03_PLAN_YEAR_VIEW_Q(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_ZY") String V_V_ZY,
            @RequestParam(value="V_V_STATE") String V_V_STATE,
            @RequestParam(value = "V_V_QSTEXT") String V_V_QSTEXT,
            @RequestParam(value = "V_V_INMANCODE") String V_V_INMANCODE,
            @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
            @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE) throws Exception {

        Map data = dx_fileService.PRO_PM_03_PLAN_YEAR_VIEW_Q(V_V_YEAR, V_V_ORGCODE,V_V_DEPTCODE,V_V_ZY,V_V_STATE,V_V_QSTEXT,V_V_INMANCODE,V_V_PAGE,V_V_PAGESIZE);
        //V_V_INMAN,
        return data;
    }



    @RequestMapping(value = "/PRO_PM_WORKORDER_ET_SET_N", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_WORKORDER_ET_SET_N(@RequestParam(value = "V_I_ID") Double V_I_ID,
                                           @RequestParam(value = "V_V_ORDERGUID") String V_V_ORDERGUID,
                                           @RequestParam(value = "V_V_DESCRIPTION",required=false) String V_V_DESCRIPTION,
                                           @RequestParam(value = "V_I_WORK_ACTIVITY",required=false) String V_I_WORK_ACTIVITY,
                                           @RequestParam(value = "V_I_DURATION_NORMAL",required=false) String V_I_DURATION_NORMAL,
                                           @RequestParam(value = "V_V_WORK_CENTER",required=false) String V_V_WORK_CENTER,
                                           @RequestParam(value = "V_I_ACTUAL_TIME",required=false) String V_I_ACTUAL_TIME,
                                           @RequestParam(value = "V_I_NUMBER_OF_PEOPLE",required=false) String V_I_NUMBER_OF_PEOPLE,
                                           @RequestParam(value = "V_V_ID",required=false) String V_V_ID,
                                           @RequestParam(value = "V_V_GUID",required=false) String V_V_GUID,
                                           @RequestParam(value = "V_V_JXBZ",required=false) String V_V_JXBZ,
                                           @RequestParam(value = "V_V_JXBZ_VALUE_DOWN",required=false) String V_V_JXBZ_VALUE_DOWN,
                                           @RequestParam(value = "V_V_JXBZ_VALUE_UP",required=false) String V_V_JXBZ_VALUE_UP,
                                           @RequestParam(value = "V_V_CENT_DEPT",required=false) String V_V_CENT_DEPT,
                                           HttpServletRequest request,
                                           HttpServletResponse response) throws Exception {
        Map test = new HashMap();

        List<Map> result = null;
        result = dx_fileService.PRO_PM_WORKORDER_ET_SET_N(V_I_ID, V_V_ORDERGUID, V_V_DESCRIPTION,
                V_I_WORK_ACTIVITY, V_I_DURATION_NORMAL, V_V_WORK_CENTER,
                V_I_ACTUAL_TIME, V_I_NUMBER_OF_PEOPLE, V_V_ID, V_V_GUID, V_V_JXBZ, V_V_JXBZ_VALUE_DOWN, V_V_JXBZ_VALUE_UP,V_V_CENT_DEPT);
        test.put("list", result);
        return test;
    }
    //new 工序下拉
    @RequestMapping(value="PRO_PM_WORKORDER_ET_ACT_N", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_ET_ACT_N(
            @RequestParam(value = "V_V_ORDERGUID") String V_V_ORDERGUID,
            @RequestParam(value = "V_V_STEP") String V_V_STEP) throws Exception {

        Map data = dx_fileService.PRO_PM_WORKORDER_ET_ACT_N(V_V_ORDERGUID,V_V_STEP);
        return data;
    }

    //物料编辑-厂矿
    @RequestMapping(value="PRO_PM_WORK_MAT_ORG_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORK_MAT_ORG_SEL(
            @RequestParam(value = "V_V_ORDERGUID") String V_V_ORDERGUID,
            @RequestParam(value = "V_V_GXID") String V_V_GXID,
            @RequestParam(value = "V_V_STEP") String V_V_STEP) throws Exception {

        Map data = dx_fileService.PRO_PM_WORK_MAT_ORG_SEL(V_V_ORDERGUID,V_V_GXID,V_V_STEP);
        return data;
    }

    //物料编辑-作业区
    @RequestMapping(value="PRO_PM_WORK_MAT_DEPT_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORK_MAT_DEPT_SEL(
            @RequestParam(value = "V_V_ORDERGUID") String V_V_ORDERGUID,
            @RequestParam(value = "V_V_GXID") String V_V_GXID,
            @RequestParam(value = "V_V_STEP") String V_V_STEP,
            @RequestParam(value = "V_V_ORG") String V_V_ORG) throws Exception {

        Map data = dx_fileService.PRO_PM_WORK_MAT_DEPT_SEL(V_V_ORDERGUID,V_V_GXID,V_V_STEP,V_V_ORG);
        return data;
    }

    //工序物料查询
    @RequestMapping(value="PRO_PM_WORKORDER_SPARE_V_N", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_WORKORDER_SPARE_V_N(
            @RequestParam(value = "V_V_ORDERGUID") String V_V_ORDERGUID,
            @RequestParam(value = "V_V_V_ACTIVITY") String V_V_V_ACTIVITY) throws Exception {

        Map data = dx_fileService.PRO_PM_WORKORDER_SPARE_V_N(V_V_ORDERGUID,V_V_V_ACTIVITY);
        return data;
    }

    @RequestMapping(value="PM_WEEK_PLAN_CHECK_M", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PM_WEEK_PLAN_CHECK_M(
            @RequestParam(value = "V_V_WEEKGUID") String V_V_WEEKGUID) throws Exception {

        Map data = dx_fileService.PM_WEEK_PLAN_CHECK_M(V_V_WEEKGUID);
        return data;
    }

    @RequestMapping(value = "/setPage", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> setPage(HttpServletRequest req, HttpServletResponse resp, HashMap data) {
        if (data == null) {
            return data;
        }
        Map<String, Object> result = new HashMap<String, Object>();
        resp.setContentType("text/plain");
        Integer start = Integer.parseInt(req.getParameter("start"));
        Integer limit = Integer.parseInt(req.getParameter("limit"));
        Page page = new Page();
        page.setStart(start);
        page.setlimit(limit);
        List list = (List) data.get("list");
        List temp = new ArrayList();
        int total = list.size();
        int end = start + limit > total ? total : start + limit;
        for (int i = start; i < end; i++) {
            temp.add(list.get(i));
        }
        result.put("list", temp);
        result.put("total", total);
        result.put("success", true);
        return result;
    }

    public class Page {
        private int start;
        private int limit;

        public int getStart() {
            return start;
        }

        public void setStart(int start) {
            this.start = start;
        }

        public int getLimit() {
            return limit;
        }

        public void setlimit(int limit) {
            this.limit = limit;
        }

        public Integer getPage() {
            return (start / limit) + 1;
        }

    }

    @RequestMapping(value = "PRO_PM_06_PLAN_DXGC_SAVE", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_06_PLAN_DXGC_SAVE(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_ORGNAME") String V_V_ORGNAME,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_DEPTNAME") String V_V_DEPTNAME,
            @RequestParam(value = "V_V_TYPECODE") String V_V_TYPECODE,
            @RequestParam(value = "V_V_TYPEDESC") String V_V_TYPEDESC,
            @RequestParam(value = "V_V_BASECODE") String V_V_BASECODE,
            @RequestParam(value="V_V_QSTEXT") String V_V_QSTEXT) throws Exception {

        Map result = dx_fileService.PRO_PM_06_PLAN_DXGC_SAVE( V_V_YEAR,  V_V_ORGCODE, V_V_ORGNAME, V_V_DEPTCODE, V_V_DEPTNAME,V_V_TYPECODE,V_V_TYPEDESC,V_V_BASECODE,V_V_QSTEXT);
        return result;
    }

    @RequestMapping(value = "PRO_PM_06_PLAN_DXGC_VIEW_Q", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_06_PLAN_DXGC_VIEW_Q(
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_TYPECODE") String V_V_TYPECODE,
            @RequestParam(value = "V_V_BASECODE") String V_V_BASECODE
//            @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
//            @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE
    ) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        Map data = dx_fileService.PRO_PM_06_PLAN_DXGC_VIEW_Q(V_V_YEAR, V_V_ORGCODE,V_V_DEPTCODE,V_V_TYPECODE,V_V_BASECODE);

        List<Map<String, Object>> no4120list = (List) data.get("list");

        result.put("list", no4120list);
        result.put("success", true);
        //V_V_INMAN,
        return data;
    }

    @RequestMapping(value = "PRO_PM_06_PLAN_DXGC_VIEW_Q_SYS", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> PRO_PM_06_PLAN_DXGC_VIEW_Q_SYS(
            @RequestParam(value = "X_TIMELOWERLIMIT") Date X_TIMELOWERLIMIT,
            @RequestParam(value = "X_TIMEUPPERLIMIT") Date X_TIMEUPPERLIMIT,
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_TYPECODE") String V_V_TYPECODE,
            @RequestParam(value = "V_V_BASECODE") String V_V_BASECODE

//            @RequestParam(value = "V_V_PAGE") String V_V_PAGE,
//            @RequestParam(value = "V_V_PAGESIZE") String V_V_PAGESIZE
    ) throws Exception {
        Map<String, Object> result = new HashMap<String, Object>();
        Map data = dx_fileService.PRO_PM_06_PLAN_DXGC_VIEW_Q_SYS(X_TIMELOWERLIMIT,X_TIMEUPPERLIMIT,V_V_YEAR, V_V_ORGCODE,V_V_DEPTCODE,V_V_TYPECODE,V_V_BASECODE);

        List<Map<String, Object>> no4120list = (List) data.get("list");

        result.put("list", no4120list);
        result.put("success", true);
        //V_V_INMAN,
        return data;
    }

    @RequestMapping(value = "/PRO_PM_06_PLAN_DXGC_DEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_06_PLAN_DXGC_DEL(
            @RequestParam(value = "V_V_GUID") String V_V_GUID) throws Exception {

        Map result = dx_fileService.PRO_PM_06_PLAN_DXGC_DEL(V_V_GUID);
        return result;
    }

    @RequestMapping(value = "PM_06_PLAN_DXGC_EQU_SELNUM", method = RequestMethod.POST)
    @ResponseBody
    public Map PM_06_PLAN_DXGC_EQU_SELNUM(
            @RequestParam(value = "V_V_GUID") String V_V_GUID) throws Exception {
        Map result = dx_fileService.PM_06_PLAN_DXGC_EQU_SELNUM(V_V_GUID);
        return result;
    }

    @RequestMapping(value = "/PRO_PM_06_PLAN_DXGC_SEL", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_03_PLAN_PROJECT_SEL(
            @RequestParam(value = "V_V_GUID") String V_V_GUID) throws Exception {

        Map result = dx_fileService.PRO_PM_06_PLAN_DXGC_SEL(V_V_GUID);
        return result;
    }

    @RequestMapping(value = "PRO_PM_06_PLAN_DXGC_UPDATE", method = RequestMethod.POST)
    @ResponseBody
    public Map PRO_PM_06_PLAN_DXGC_UPDATE(
            @RequestParam(value = "V_V_GUID") String V_V_GUID,
            @RequestParam(value = "V_V_YEAR") String V_V_YEAR,
            @RequestParam(value = "V_V_ORGCODE") String V_V_ORGCODE,
            @RequestParam(value = "V_V_ORGNAME") String V_V_ORGNAME,
            @RequestParam(value = "V_V_DEPTCODE") String V_V_DEPTCODE,
            @RequestParam(value = "V_V_DEPTNAME") String V_V_DEPTNAME,
            @RequestParam(value = "V_V_TYPECODE") String V_V_TYPECODE,
            @RequestParam(value = "V_V_TYPEDESC") String V_V_TYPEDESC,
            @RequestParam(value = "V_V_BASECODE") String V_V_BASECODE,
            @RequestParam(value="V_V_QSTEXT") String V_V_QSTEXT) throws Exception {

        Map result = dx_fileService.PRO_PM_06_PLAN_DXGC_UPDATE( V_V_GUID, V_V_YEAR,  V_V_ORGCODE, V_V_ORGNAME, V_V_DEPTCODE, V_V_DEPTNAME,V_V_TYPECODE,V_V_TYPEDESC,V_V_BASECODE,V_V_QSTEXT);
        return result;
    }
}
