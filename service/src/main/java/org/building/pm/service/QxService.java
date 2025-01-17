package org.building.pm.service;

import com.mchange.v2.c3p0.ComboPooledDataSource;
import oracle.jdbc.OracleTypes;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.sql.*;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by zjh on 2017/1/22.
 */

@Service
public class QxService {
    private static final Logger logger = Logger.getLogger(QxService.class.getName());

    @Value("#{configProperties['system.copyright']}")
    private String copyright;

    @Autowired
    private ComboPooledDataSource dataSources;

    private List<HashMap> ResultHash(ResultSet rs) throws SQLException {

        List<HashMap> result = new ArrayList<HashMap>();

        ResultSetMetaData rsm = rs.getMetaData();

        int colNum = 0;

        colNum = rsm.getColumnCount();

        while (rs.next()) {
            HashMap model = new HashMap();
            for (int i = 1; i <= rsm.getColumnCount(); i++) {
                if (rsm.getColumnType(i) == 91) {
                    model.put(rsm.getColumnName(i),
                            rs.getString(i) == null ? "" : rs.getString(i)
                                    .split("\\.")[0]);
                } else {
                    if (rsm.getColumnType(i) == 2) {
                        if (rs.getString(i) == null) {
                            model.put(rsm.getColumnName(i), "");
                        } else {
                            model.put(rsm.getColumnName(i), rs.getDouble(i));
                        }
                    } else {
                        model.put(rsm.getColumnName(i),
                                rs.getString(i) == null ? "" : rs.getString(i)
                                        .toString().replaceAll("\\n", ""));
                    }
                }
            }
            result.add(model);
        }
        rs.close();

        return result;
    }

    public Map PRO_PM_07_DEPTEQUTYPE_PER(String V_V_PERSONCODE, String V_V_DEPTCODENEXT) throws SQLException {

        logger.info("begin PRO_GET_DEPTEQUTYPE_PER");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEPTEQUTYPE_PER(:V_V_PERSONCODE,:V_V_DEPTCODENEXT,:V_CURSOR)}");
            cstmt.setString("V_V_PERSONCODE", V_V_PERSONCODE);
            cstmt.setString("V_V_DEPTCODENEXT", V_V_DEPTCODENEXT);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEPTEQUTYPE_PER");
        return result;
    }

    public Map PRO_PM_07_DEPTEQU_PER_DROP(String V_V_PERSONCODE, String V_V_DEPTCODENEXT, String V_V_EQUTYPECODE) throws SQLException {

        logger.info("begin PRO_PM_07_DEPTEQU_PER_DROP");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEPTEQU_PER_DROP(:V_V_PERSONCODE,:V_V_DEPTCODENEXT,:V_V_EQUTYPECODE,:V_CURSOR)}");
            cstmt.setString("V_V_PERSONCODE", V_V_PERSONCODE);
            cstmt.setString("V_V_DEPTCODENEXT", V_V_DEPTCODENEXT);
            cstmt.setString("V_V_EQUTYPECODE", V_V_EQUTYPECODE);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEPTEQU_PER_DROP");
        return result;
    }

    public Map PRO_PM_07_DEFECT_STATE_VIEW() throws SQLException {

        logger.info("begin PRO_PM_07_DEFECT_STATE_VIEW");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECT_STATE_VIEW(:V_CURSOR)}");
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECT_STATE_VIEW");
        return result;
    }

    public Map PRO_PM_07_DEFECT_SOURCE_COUNT(String V_D_DEFECTDATE_B, String V_D_DEFECTDATE_E, String V_V_DEPTCODE,
                                             String V_V_EQUTYPECODE, String V_V_EQUCODE, String V_V_STATECODE,
                                             String V_V_DEFECTLIST, String X_PERSONCODE) throws SQLException {

        logger.info("begin PRO_PM_07_DEFECT_SOURCE_COUNT");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECT_SOURCE_COUNT(:V_D_DEFECTDATE_B,:V_D_DEFECTDATE_E,:V_V_DEPTCODE," +
                    ":V_V_EQUTYPECODE,:V_V_EQUCODE,:V_V_STATECODE,:V_V_DEFECTLIST,:X_PERSONCODE,:V_CURSOR)}");
            cstmt.setString("V_D_DEFECTDATE_B", V_D_DEFECTDATE_B);
            cstmt.setString("V_D_DEFECTDATE_E", V_D_DEFECTDATE_E);
            cstmt.setString("V_V_DEPTCODE", V_V_DEPTCODE);
            cstmt.setString("V_V_EQUTYPECODE", V_V_EQUTYPECODE);
            cstmt.setString("V_V_EQUCODE", V_V_EQUCODE);
            cstmt.setString("V_V_STATECODE", V_V_STATECODE);
            cstmt.setString("V_V_DEFECTLIST", V_V_DEFECTLIST);
            cstmt.setString("X_PERSONCODE", X_PERSONCODE);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();

            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));

        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECT_SOURCE_COUNT");
        return result;
    }

    public Map PRO_PM_07_DEFECT_VIEW_PER(String V_D_DEFECTDATE_B, String V_D_DEFECTDATE_E, String V_V_DEPTCODE,
                                         String V_V_EQUTYPECODE, String V_V_EQUCODE, String V_V_STATECODE,
                                         String V_V_SOURCECODE, String V_V_DEFECTLIST, String X_PERSONCODE, String V_V_PAGE, String V_V_PAGESIZE) throws SQLException {

        logger.info("begin PRO_PM_07_DEFECT_VIEW_PER");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        List<Map> resultList = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECT_VIEW_PER(:V_D_DEFECTDATE_B,:V_D_DEFECTDATE_E,:V_V_DEPTCODE," +
                    ":V_V_EQUTYPECODE,:V_V_EQUCODE,:V_V_STATECODE,:V_V_SOURCECODE,:V_V_DEFECTLIST,:X_PERSONCODE,:V_V_PAGE,:V_V_PAGESIZE,:V_V_SNUM,:V_CURSOR)}");
            cstmt.setString("V_D_DEFECTDATE_B", V_D_DEFECTDATE_B);
            cstmt.setString("V_D_DEFECTDATE_E", V_D_DEFECTDATE_E);
            cstmt.setString("V_V_DEPTCODE", V_V_DEPTCODE);
            cstmt.setString("V_V_EQUTYPECODE", V_V_EQUTYPECODE);
            cstmt.setString("V_V_EQUCODE", V_V_EQUCODE);
            cstmt.setString("V_V_STATECODE", V_V_STATECODE);
            cstmt.setString("V_V_SOURCECODE", V_V_SOURCECODE);
            cstmt.setString("V_V_DEFECTLIST", V_V_DEFECTLIST);
            cstmt.setString("X_PERSONCODE", X_PERSONCODE);
            cstmt.setString("V_V_PAGE", V_V_PAGE);
            cstmt.setString("V_V_PAGESIZE", V_V_PAGESIZE);
            cstmt.registerOutParameter("V_V_SNUM", OracleTypes.VARCHAR);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("total", cstmt.getObject("V_V_SNUM"));
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));


        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECT_VIEW_PER");
        return result;
    }

    //缺陷导出
    public Map PRO_PM_07_DEFECT_VIEW_PERALL(String V_D_DEFECTDATE_B, String V_D_DEFECTDATE_E, String V_V_DEPTCODE,
                                            String V_V_EQUTYPECODE, String V_V_EQUCODE, String V_V_STATECODE,
                                            String V_V_SOURCECODE, String V_V_DEFECTLIST, String X_PERSONCODE, String V_V_PAGE, String V_V_PAGESIZE) throws SQLException {

        logger.info("begin PRO_PM_07_DEFECT_VIEW_PERALL");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        List<Map> resultList = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECT_VIEW_PERALL(:V_D_DEFECTDATE_B,:V_D_DEFECTDATE_E,:V_V_DEPTCODE," +
                    ":V_V_EQUTYPECODE,:V_V_EQUCODE,:V_V_STATECODE,:V_V_SOURCECODE,:V_V_DEFECTLIST,:X_PERSONCODE,:V_V_PAGE,:V_V_PAGESIZE,:V_V_SNUM,:V_CURSOR)}");
            cstmt.setString("V_D_DEFECTDATE_B", V_D_DEFECTDATE_B);
            cstmt.setString("V_D_DEFECTDATE_E", V_D_DEFECTDATE_E);
            cstmt.setString("V_V_DEPTCODE", V_V_DEPTCODE);
            cstmt.setString("V_V_EQUTYPECODE", V_V_EQUTYPECODE);
            cstmt.setString("V_V_EQUCODE", V_V_EQUCODE);
            cstmt.setString("V_V_STATECODE", V_V_STATECODE);
            cstmt.setString("V_V_SOURCECODE", V_V_SOURCECODE);
            cstmt.setString("V_V_DEFECTLIST", V_V_DEFECTLIST);
            cstmt.setString("X_PERSONCODE", X_PERSONCODE);
            cstmt.setString("V_V_PAGE", V_V_PAGE);
            cstmt.setString("V_V_PAGESIZE", V_V_PAGESIZE);
            cstmt.registerOutParameter("V_V_SNUM", OracleTypes.VARCHAR);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("total", cstmt.getObject("V_V_SNUM"));
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));


        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECT_VIEW_PERALL");
        return result;
    }

    public Map PRO_PM_07_DEFECT_GET(String V_V_GUID) throws SQLException {

        logger.info("begin PRO_PM_07_DEFECT_GET");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECT_GET(:V_V_GUID,:V_CURSOR)}");
            cstmt.setString("V_V_GUID", V_V_GUID);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();

            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECT_GET");
        return result;
    }

    public List<Map> PRO_PM_07_DEFECT_SET_XQ(String V_V_GUID, String V_V_PERCODE, String V_V_XQYY) throws SQLException {
//        logger.info("begin PRO_PM_07_DEFECT_SET_XQ");
        List<Map> result = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(true);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECT_SET_XQ" + "(:V_V_GUID,:V_V_MENUCODE,:V_V_XQYY,:V_CURSOR)}");
            cstmt.setString("V_V_GUID", V_V_GUID);
            cstmt.setString("V_V_PERCODE", V_V_PERCODE);
            cstmt.setString("V_V_XQYY", V_V_XQYY);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.VARCHAR);
            cstmt.execute();
            Map sledata = new HashMap();
            sledata.put("V_INFO", (String) cstmt.getObject("V_CURSOR"));
            result.add(sledata);
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECT_SET_XQ");
        return result;
    }

    public Map PRO_PM_07_DEFECT_LOG_VIEW(String V_V_GUID) throws SQLException {

        logger.info("begin PRO_PM_07_DEFECT_LOG_VIEW");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECT_LOG_VIEW(:V_V_GUID,:V_CURSOR)}");
            cstmt.setString("V_V_GUID", V_V_GUID);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECT_LOG_VIEW");
        return result;
    }

    public Map PRO_PM_07_DEFECT_TJ_VIEW(String V_D_DEFECTDATE_B, String V_D_DEFECTDATE_E, String V_V_DEPTCODE2,
                                        String V_V_DEPTCODENEXT, String V_V_EQUTYPECODE, String V_V_EQUCODE,
                                        String V_V_SOURCECODE) throws SQLException {

        logger.info("begin PRO_PM_07_DEFECT_TJ_VIEW");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECT_TJ_VIEW(:V_D_DEFECTDATE_B,:V_D_DEFECTDATE_E,:V_V_DEPTCODE2," +
                    ":V_V_DEPTCODENEXT,:V_V_EQUTYPECODE,:V_V_EQUCODE,:V_V_SOURCECODE,:V_CURSOR)}");
            cstmt.setString("V_D_DEFECTDATE_B", V_D_DEFECTDATE_B);
            cstmt.setString("V_D_DEFECTDATE_E", V_D_DEFECTDATE_E);
            cstmt.setString("V_V_DEPTCODE2", V_V_DEPTCODE2);
            cstmt.setString("V_V_DEPTCODENEXT", V_V_DEPTCODENEXT);
            cstmt.setString("V_V_EQUTYPECODE", V_V_EQUTYPECODE);
            cstmt.setString("V_V_EQUCODE", V_V_EQUCODE);
            cstmt.setString("V_V_SOURCECODE", V_V_SOURCECODE);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECT_TJ_VIEW");
        return result;
    }

    public Map PRO_PM_07_DEFECT_SOURCE_VIEW() throws SQLException {

        logger.info("begin PRO_PM_07_DEFECT_SOURCE_VIEW");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECT_SOURCE_VIEW(:V_CURSOR)}");
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECT_SOURCE_VIEW");
        return result;
    }

    public Map PRO_PM_07_GET_DEPTEQU_PER(String V_V_PERSONCODE, String V_V_DEPTCODENEXT, String V_V_EQUTYPECODE) throws SQLException {

        logger.info("begin PRO_PM_07_GET_DEPTEQU_PER");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_GET_DEPTEQU_PER(:V_V_PERSONCODE,:V_V_DEPTCODENEXT,:V_V_EQUTYPECODE,:V_CURSOR)}");
            cstmt.setString("V_V_PERSONCODE", V_V_PERSONCODE);
            cstmt.setString("V_V_DEPTCODENEXT", V_V_DEPTCODENEXT);
            cstmt.setString("V_V_EQUTYPECODE", V_V_EQUTYPECODE);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_GET_DEPTEQU_PER");
        return result;
    }


    public Map PRO_PM_07_BASEDIC_LIST(String IS_V_BASETYPE) throws SQLException {

        logger.info("begin PRO_PM_07_BASEDIC_LIST");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_BASEDIC_LIST(:IS_V_BASETYPE,:V_CURSOR)}");
            cstmt.setString("IS_V_BASETYPE", IS_V_BASETYPE);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_BASEDIC_LIST");
        return result;
    }


    public Map PRO_PM_07_SAP_EQU_GET(String V_V_PERSONCODE, String V_V_DEPTCODE, String V_V_DEPTNEXTCODE,
                                     String V_V_EQUTYPECODE, String V_V_EQUCODE) throws SQLException {

        logger.info("begin PRO_PM_07_SAP_EQU_GET");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_SAP_EQU_GET(:V_V_PERSONCODE,:V_V_DEPTCODE,:V_V_DEPTNEXTCODE," +
                    ":V_V_EQUTYPECODE,:V_V_EQUCODE,:V_CURSOR)}");
            cstmt.setString("V_V_PERSONCODE", V_V_PERSONCODE);
            cstmt.setString("V_V_DEPTCODE", V_V_DEPTCODE);
            cstmt.setString("V_V_DEPTNEXTCODE", V_V_DEPTNEXTCODE);
            cstmt.setString("V_V_EQUTYPECODE", V_V_EQUTYPECODE);
            cstmt.setString("V_V_EQUCODE", V_V_EQUCODE);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_SAP_EQU_GET");
        return result;
    }

    public List<Map> PRO_PM_07_PP_DEFECT_SET(String V_I_ID, String V_V_EQUCODE, String V_V_EQUTYPE,
                                             String V_V_CHILDEQUCODE, String V_V_CLASS, String V_V_CLASSTYPE,
                                             String V_D_DEFECTDATE, String V_D_INDATE, String V_V_DESCRIPTION,
                                             String V_V_SUGGESTION, String V_V_PERSONCODE, String V_V_PERSONNAME,
                                             String V_V_DEPTCODE) throws SQLException {
//        logger.info("begin PRO_PM_07_PP_DEFECT_SET");
        List<Map> result = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(true);
            cstmt = conn.prepareCall("{call PRO_PM_07_PP_DEFECT_SET" + "(:V_I_ID,:V_V_EQUCODE,:V_V_EQUTYPE," +
                    ":V_V_CHILDEQUCODE,:V_V_CLASS,:V_V_CLASSTYPE,:V_D_DEFECTDATE,:V_D_INDATE,:V_V_DESCRIPTION," +
                    ":V_V_SUGGESTION,:V_V_PERSONCODE,:V_V_PERSONNAME,:V_V_DEPTCODE,:RET)}");
            cstmt.setString("V_I_ID", V_I_ID);
            cstmt.setString("V_V_EQUCODE", V_V_EQUCODE);
            cstmt.setString("V_V_EQUTYPE", V_V_EQUTYPE);
            cstmt.setString("V_V_CHILDEQUCODE", V_V_CHILDEQUCODE);
            cstmt.setString("V_V_CLASS", V_V_CLASS);
            cstmt.setString("V_V_CLASSTYPE", V_V_CLASSTYPE);
            cstmt.setString("V_D_DEFECTDATE", V_D_DEFECTDATE);
            cstmt.setString("V_D_INDATE", V_D_INDATE);
            cstmt.setString("V_V_DESCRIPTION", V_V_DESCRIPTION);
            cstmt.setString("V_V_SUGGESTION", V_V_SUGGESTION);
            cstmt.setString("V_V_PERSONCODE", V_V_PERSONCODE);
            cstmt.setString("V_V_PERSONNAME", V_V_PERSONNAME);
            cstmt.setString("V_V_DEPTCODE", V_V_DEPTCODE);
            cstmt.registerOutParameter("RET", OracleTypes.VARCHAR);
            cstmt.execute();
            Map sledata = new HashMap();
            sledata.put("V_INFO", (String) cstmt.getObject("RET"));
            result.add(sledata);
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_PP_DEFECT_SET");
        return result;
    }

    public List<Map> PRO_PM_07_DEFECTDESCRIBE_SET(String V_I_ID, String V_V_EQUCODE, String V_V_DESCRIPTION,
                                                  String V_V_SUGGESTION, String V_V_PERSONCODE, String V_V_PERSONNAME,
                                                  String V_V_DEPTCODE) throws SQLException {
//        logger.info("begin PRO_PM_07_DEFECTDESCRIBE_SET");
        List<Map> result = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(true);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECTDESCRIBE_SET" + "(:V_I_ID,:V_V_EQUCODE,:V_V_DESCRIPTION," +
                    ":V_V_SUGGESTION,:V_V_PERSONCODE,:V_V_PERSONNAME,:V_V_DEPTCODE,:RET)}");
            cstmt.setString("V_I_ID", V_I_ID);
            cstmt.setString("V_V_EQUCODE", V_V_EQUCODE);
            cstmt.setString("V_V_DESCRIPTION", V_V_DESCRIPTION);
            cstmt.setString("V_V_SUGGESTION", V_V_SUGGESTION);
            cstmt.setString("V_V_PERSONCODE", V_V_PERSONCODE);
            cstmt.setString("V_V_PERSONNAME", V_V_PERSONNAME);
            cstmt.setString("V_V_DEPTCODE", V_V_DEPTCODE);
            cstmt.registerOutParameter("RET", OracleTypes.VARCHAR);
            cstmt.execute();
            Map sledata = new HashMap();
            sledata.put("V_INFO", (String) cstmt.getObject("RET"));
            result.add(sledata);
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECTDESCRIBE_SET");
        return result;
    }

    public Map PRO_PM_07_DEFECTDESCRIPTION_L(String V_V_EQUCODE) throws SQLException {

        logger.info("begin PRO_PM_07_DEFECTDESCRIPTION_L");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        List<Map> resultList = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECTDESCRIPTION_L(:V_V_EQUCODE,:V_CURSOR)}");
            cstmt.setString("V_V_EQUCODE", V_V_EQUCODE);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECTDESCRIPTION_L");
        return result;
    }

    public List<Map> PRO_PM_07_DEFECT_EDIT(String V_V_GUID, String V_V_PERCODE, String V_V_DEFECTLIST) throws SQLException {
//        logger.info("begin PRO_PM_07_DEFECT_EDIT");
        List<Map> result = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(true);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECT_EDIT" + "(:V_V_GUID,:V_V_PERCODE,:V_V_DEFECTLIST,:V_CURSOR)}");
            cstmt.setString("V_I_ID", V_V_GUID);
            cstmt.setString("V_V_EQUCODE", V_V_PERCODE);
            cstmt.setString("V_V_DESCRIPTION", V_V_DEFECTLIST);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.VARCHAR);
            cstmt.execute();
            Map sledata = new HashMap();
            sledata.put("V_INFO", (String) cstmt.getObject("V_CURSOR"));
            result.add(sledata);
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECT_EDIT");
        return result;
    }

    public HashMap PRO_PM_07_WORKORDER_DEFECT(String V_V_PERNAME, String V_V_DEFECT_GUID) throws SQLException {

        logger.info("begin PRO_PM_07_WORKORDER_DEFECT");
//      logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        HashMap result = new HashMap();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(true);
            cstmt = conn.prepareCall("{call PRO_PM_07_WORKORDER_DEFECT" + "(:V_V_PERNAME,:V_V_DEFECT_GUID,:V_CURSOR)}");
            cstmt.setString("V_V_PERNAME", V_V_PERNAME);
            cstmt.setString("V_V_DEFECT_GUID", V_V_DEFECT_GUID);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();

            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_WORKORDER_DEFECT");
        return result;
    }

    public Map PRO_DEFECT_PART_TYPE_SEL() throws SQLException {

        logger.info("begin PRO_DEFECT_PART_TYPE_SEL");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        List<Map> resultList = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_DEFECT_PART_TYPE_SEL(:V_CURSOR)}");
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_DEFECT_PART_TYPE_SEL");
        return result;
    }

    public Map PRO_DEFECT_PART_DATA_SEL(String V_V_TYPE, String V_V_INPER, String V_V_STATE, String V_V_PAGE, String V_V_PAGESIZE) throws SQLException {

        logger.info("begin PRO_DEFECT_PART_DATA_SEL");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        List<Map> resultList = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_DEFECT_PART_DATA_SEL(:V_V_TYPE,:V_V_INPER,:V_V_STATE,:V_V_PAGE,:V_V_PAGESIZE,:V_V_SNUM,:V_CURSOR)}");
            cstmt.setString("V_V_TYPE", V_V_TYPE);
            cstmt.setString("V_V_INPER", V_V_INPER);
            cstmt.setString("V_V_STATE", V_V_STATE);
            cstmt.setString("V_V_PAGE", V_V_PAGE);
            cstmt.setString("V_V_PAGESIZE", V_V_PAGESIZE);
            cstmt.registerOutParameter("V_V_SNUM", OracleTypes.VARCHAR);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("total", (String) cstmt.getObject("V_V_SNUM"));
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_DEFECT_PART_DATA_SEL");
        return result;
    }

    public Map PRO_DEFECT_PART_WORKORDER_C(String V_V_PERCODE, String V_V_GUID) throws SQLException {

        logger.info("begin PRO_DEFECT_PART_WORKORDER_C");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        List<Map> resultList = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_DEFECT_PART_WORKORDER_C(:V_V_GUID,:V_V_PERCODE,:V_RETSTR,:V_CURSOR)}");
            cstmt.setString("V_V_GUID", V_V_GUID);
            cstmt.setString("V_V_PERCODE", V_V_PERCODE);
            cstmt.registerOutParameter("V_RETSTR", OracleTypes.VARCHAR);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("str", (String) cstmt.getObject("V_RETSTR"));
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_DEFECT_PART_WORKORDER_C");
        return result;
    }

    public List<Map> PRO_DEFECT_PART_WORKORDER_S(String V_V_PERCODE, String V_V_PERNAME, String V_V_GUID, String V_V_ORDERGUID, String V_V_SHORT_TXT, String V_V_DEPTCODEREPAIR,
                                                 String V_D_START_DATE, String V_D_FINISH_DATE, String V_V_WBS, String V_V_WBS_TXT, String V_V_TOOL, String V_V_TECHNOLOGY, String V_V_SAFE) throws SQLException {
        List<Map> result = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(true);
            cstmt = conn.prepareCall("{call PRO_DEFECT_PART_WORKORDER_S" + "(:V_V_PERCODE,:V_V_PERNAME,:V_V_GUID,:V_V_ORDERGUID,:V_V_SHORT_TXT,:V_V_DEPTCODEREPAIR,:V_D_START_DATE" +
                    ",:V_D_FINISH_DATE,:V_V_WBS,:V_V_WBS_TXT,:V_V_TOOL,:V_V_TECHNOLOGY,:V_V_SAFE,:V_CURSOR)}");
            cstmt.setString("V_V_PERCODE", V_V_PERCODE);
            cstmt.setString("V_V_PERNAME", V_V_PERNAME);
            cstmt.setString("V_V_GUID", V_V_GUID);
            cstmt.setString("V_V_ORDERGUID", V_V_ORDERGUID);
            cstmt.setString("V_V_SHORT_TXT", V_V_SHORT_TXT);
            cstmt.setString("V_V_DEPTCODEREPAIR", V_V_DEPTCODEREPAIR);
            cstmt.setString("V_D_START_DATE", V_D_START_DATE);
            cstmt.setString("V_D_FINISH_DATE", V_D_FINISH_DATE);
            cstmt.setString("V_V_WBS", V_V_WBS);
            cstmt.setString("V_V_WBS_TXT", V_V_WBS_TXT);
            cstmt.setString("V_V_TOOL", V_V_TOOL);
            cstmt.setString("V_V_TECHNOLOGY", V_V_TECHNOLOGY);
            cstmt.setString("V_V_SAFE", V_V_SAFE);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.VARCHAR);
            cstmt.execute();
            Map sledata = new HashMap();
            sledata.put("V_INFO", (String) cstmt.getObject("V_CURSOR"));
            result.add(sledata);
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end //        logger.info(\"begin PRO_DEFECT_PART_WORKORDER_S\");\n");
        return result;
    }

    public List<Map> PRO_DEFECT_YZJ_CREATE(String V_V_PERCODE, String V_V_MODEL_GUID) throws SQLException {
        List<Map> result = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(true);
            cstmt = conn.prepareCall("{call PRO_DEFECT_YZJ_CREATE" + "(:V_V_PERCODE,:V_V_MODEL_GUID,:V_INFO)}");
            cstmt.setString("V_V_PERCODE", V_V_PERCODE);
            cstmt.setString("V_V_MODEL_GUID", V_V_MODEL_GUID);
            cstmt.registerOutParameter("V_INFO", OracleTypes.VARCHAR);
            cstmt.execute();
            Map sledata = new HashMap();
            sledata.put("V_INFO", (String) cstmt.getObject("V_INFO"));
            result.add(sledata);
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end //        logger.info(\"begin PRO_DEFECT_YZJ_CREATE\");\n");
        return result;
    }

    public Map PRO_PM_07_DEFECT_PART_COUNT(String v_d_defectdate_b, String v_d_defectdate_e, String v_v_deptcode, String v_v_defectlist, String x_personcode) throws SQLException {
        logger.info("begin PRO_DEFECT_PART_WORKORDER_C");
        Map<String, Object> result = new HashMap<String, Object>();
        List<Map> resultList = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECT_PART_COUNT(:V_D_DEFECTDATE_B,:V_D_DEFECTDATE_E,:V_V_DEPTCODE,:V_V_DEFECTLIST,:X_PERSONCODE,:V_CURSOR)}");
            cstmt.setString("V_D_DEFECTDATE_B", v_d_defectdate_b);
            cstmt.setString("V_D_DEFECTDATE_E", v_d_defectdate_e);
            cstmt.setString("V_V_DEPTCODE", v_v_deptcode);
            cstmt.setString("V_V_DEFECTLIST", v_v_defectlist);
            cstmt.setString("X_PERSONCODE", x_personcode);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECT_PART_COUNT");
        return result;
    }

    public Map PRO_PM_07_DEFECT_PART_PER(String v_d_defectdate_b, String v_d_defectdate_e, String v_v_deptcode, String v_v_sourcecode, String v_v_defectlist, String x_personcode, String v_v_page, String v_v_pagesize) throws SQLException {
        logger.info("begin PRO_DEFECT_PART_WORKORDER_C");
        Map<String, Object> result = new HashMap<String, Object>();
        List<Map> resultList = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECT_PART_PER(:V_D_DEFECTDATE_B,:V_D_DEFECTDATE_E,:V_V_DEPTCODE,:V_V_SOURCECODE,:V_V_DEFECTLIST,:X_PERSONCODE,:V_V_PAGE,:V_V_PAGESIZE,:V_V_SNUM,:V_CURSOR)}");
            cstmt.setString("V_D_DEFECTDATE_B", v_d_defectdate_b);
            cstmt.setString("V_D_DEFECTDATE_E", v_d_defectdate_e);
            cstmt.setString("V_V_DEPTCODE", v_v_deptcode);
            cstmt.setString("V_V_SOURCECODE", v_v_sourcecode);
            cstmt.setString("V_V_DEFECTLIST", v_v_defectlist);
            cstmt.setString("X_PERSONCODE", x_personcode);
            cstmt.setString("V_V_PAGE", v_v_page);
            cstmt.setString("V_V_PAGESIZE", v_v_pagesize);
            cstmt.registerOutParameter("V_V_SNUM", OracleTypes.VARCHAR);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("total", (String) cstmt.getObject("V_V_SNUM"));
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECT_PART_COUNT");
        return result;
    }
    //缺陷跟踪查询
    public Map PRO_PM_07_DEFECT_VIEW_QXGZSEL(String V_D_DEFECTDATE_B, String V_D_DEFECTDATE_E, String V_V_DEPTCODE,
                                         String V_V_EQUTYPECODE, String V_V_EQUCODE, String V_V_STATECODE,
                                         String V_V_SOURCECODE, String V_V_DEFECTLIST, String X_PERSONCODE,String V_V_FZPERCODE, String V_V_PAGE, String V_V_PAGESIZE) throws SQLException {

        logger.info("begin PRO_PM_07_DEFECT_VIEW_QXGZSEL");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        List<Map> resultList = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECT_VIEW_QXGZSEL(:V_D_DEFECTDATE_B,:V_D_DEFECTDATE_E,:V_V_DEPTCODE," +
                    ":V_V_EQUTYPECODE,:V_V_EQUCODE,:V_V_STATECODE,:V_V_SOURCECODE,:V_V_DEFECTLIST,:X_PERSONCODE,:V_V_FZPERCODE,:V_V_PAGE,:V_V_PAGESIZE,:V_V_SNUM,:V_CURSOR)}");
            cstmt.setString("V_D_DEFECTDATE_B", V_D_DEFECTDATE_B);
            cstmt.setString("V_D_DEFECTDATE_E", V_D_DEFECTDATE_E);
            cstmt.setString("V_V_DEPTCODE", V_V_DEPTCODE);
            cstmt.setString("V_V_EQUTYPECODE", V_V_EQUTYPECODE);
            cstmt.setString("V_V_EQUCODE", V_V_EQUCODE);
            cstmt.setString("V_V_STATECODE", V_V_STATECODE);
            cstmt.setString("V_V_SOURCECODE", V_V_SOURCECODE);
            cstmt.setString("V_V_DEFECTLIST", V_V_DEFECTLIST);
            cstmt.setString("X_PERSONCODE", X_PERSONCODE);
            cstmt.setString("V_V_FZPERCODE",V_V_FZPERCODE);
            cstmt.setString("V_V_PAGE", V_V_PAGE);
            cstmt.setString("V_V_PAGESIZE", V_V_PAGESIZE);
            cstmt.registerOutParameter("V_V_SNUM", OracleTypes.VARCHAR);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("total", cstmt.getObject("V_V_SNUM"));
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));


        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECT_VIEW_QXGZSEL");
        return result;
    }

    public Map PRO_PM_07_DEFECT_VIEW_TYPQ(String V_D_DEFECTDATE_B, String V_D_DEFECTDATE_E, String V_V_DEPTCODE,
                                             String V_V_EQUTYPECODE, String V_V_EQUCODE, String V_V_STATECODE,
                                             String V_V_SOURCECODE, String V_V_DEFECTLIST, String X_PERSONCODE,String V_V_FZPERCODE, String V_V_PAGE, String V_V_PAGESIZE) throws SQLException {

        logger.info("begin PRO_PM_07_DEFECT_VIEW_TYPQ");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        List<Map> resultList = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_PM_07_DEFECT_VIEW_TYPQ(:V_D_DEFECTDATE_B,:V_D_DEFECTDATE_E,:V_V_DEPTCODE," +
                    ":V_V_EQUTYPECODE,:V_V_EQUCODE,:V_V_STATECODE,:V_V_SOURCECODE,:V_V_DEFECTLIST,:X_PERSONCODE,:V_V_FZPERCODE,:V_V_PAGE,:V_V_PAGESIZE,:V_V_SNUM,:V_CURSOR)}");
            cstmt.setString("V_D_DEFECTDATE_B", V_D_DEFECTDATE_B);
            cstmt.setString("V_D_DEFECTDATE_E", V_D_DEFECTDATE_E);
            cstmt.setString("V_V_DEPTCODE", V_V_DEPTCODE);
            cstmt.setString("V_V_EQUTYPECODE", V_V_EQUTYPECODE);
            cstmt.setString("V_V_EQUCODE", V_V_EQUCODE);
            cstmt.setString("V_V_STATECODE", V_V_STATECODE);
            cstmt.setString("V_V_SOURCECODE", V_V_SOURCECODE);
            cstmt.setString("V_V_DEFECTLIST", V_V_DEFECTLIST);
            cstmt.setString("X_PERSONCODE", X_PERSONCODE);
            cstmt.setString("V_V_FZPERCODE",V_V_FZPERCODE);
            cstmt.setString("V_V_PAGE", V_V_PAGE);
            cstmt.setString("V_V_PAGESIZE", V_V_PAGESIZE);
            cstmt.registerOutParameter("V_V_SNUM", OracleTypes.VARCHAR);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("total", cstmt.getObject("V_V_SNUM"));
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));


        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_PM_07_DEFECT_VIEW_TYPQ");
        return result;
    }

    public Map PRO_DEFECT_SOURCE_COUNT_SEL(String V_D_DEFECTDATE_B, String V_D_DEFECTDATE_E, String V_V_DEPTCODE,
                                             String V_V_EQUTYPECODE, String V_V_EQUCODE, String V_V_STATECODE,
                                             String V_V_DEFECTLIST, String X_PERSONCODE,String V_V_FZPERCODE) throws SQLException {

        logger.info("begin PRO_DEFECT_SOURCE_COUNT_SEL");
//        logger.debug("params:V_V_DEPTREPAIRCODE:" + V_V_DEPTREPAIRCODE);

        Map<String, Object> result = new HashMap<String, Object>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PRO_DEFECT_SOURCE_COUNT_SEL(:V_D_DEFECTDATE_B,:V_D_DEFECTDATE_E,:V_V_DEPTCODE," +
                    ":V_V_EQUTYPECODE,:V_V_EQUCODE,:V_V_STATECODE,:V_V_DEFECTLIST,:X_PERSONCODE,:V_V_FZPERCODE,:V_CURSOR)}");
            cstmt.setString("V_D_DEFECTDATE_B", V_D_DEFECTDATE_B);
            cstmt.setString("V_D_DEFECTDATE_E", V_D_DEFECTDATE_E);
            cstmt.setString("V_V_DEPTCODE", V_V_DEPTCODE);
            cstmt.setString("V_V_EQUTYPECODE", V_V_EQUTYPECODE);
            cstmt.setString("V_V_EQUCODE", V_V_EQUCODE);
            cstmt.setString("V_V_STATECODE", V_V_STATECODE);
            cstmt.setString("V_V_DEFECTLIST", V_V_DEFECTLIST);
            cstmt.setString("X_PERSONCODE", X_PERSONCODE);
            cstmt.setString("V_V_FZPERCODE",V_V_FZPERCODE);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();

            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));

        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end PRO_DEFECT_SOURCE_COUNT_SEL");
        return result;
    }
}
