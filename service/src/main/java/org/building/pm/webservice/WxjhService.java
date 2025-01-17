package org.building.pm.webservice;

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

@Service
public class WxjhService {
    private static final Logger logger = Logger.getLogger(WxjhService.class.getName());

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

    public Map WebServiceLog(String V_V_SYSTEM, String V_V_GUID, String V_V_STATE, String V_V_MENO) throws SQLException {
        Map result = new HashMap();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call BASE_WEBSERVICE_LOG_INERT" + "(:V_V_SYSTEM,:V_V_GUID,:V_V_STATE,:V_V_MENO,:V_INFO)}");
            cstmt.setString("V_V_SYSTEM", V_V_SYSTEM);
            cstmt.setString("V_V_GUID", V_V_GUID);
            cstmt.setString("V_V_STATE", V_V_STATE);
            cstmt.setString("V_V_MENO", V_V_MENO);
            cstmt.registerOutParameter("V_INFO", OracleTypes.VARCHAR);
            cstmt.execute();
            result.put("pro_info", (String) cstmt.getObject("V_INFO"));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.debug("result:" + result);
        logger.info("end BASE_WEBSERVICE_LOG_INERT");
        return result;
    }

    public Map PM_DEFECT_LOG_FROMPRO_DEFECT_S(String V_V_PROJECT_GUID) throws SQLException {
        Map<String, Object> result = new HashMap<String, Object>();
        List<Map> resultList = new ArrayList<Map>();
        Connection conn = null;
        CallableStatement cstmt = null;
        try {
            conn = dataSources.getConnection();
            conn.setAutoCommit(false);
            cstmt = conn.prepareCall("{call PM_DEFECT_LOG_FROMPRO_DEFECT_S(:V_V_PROJCET_GUID,:V_CURSOR)}");
            cstmt.setString("V_V_PROJECT_GUID", V_V_PROJECT_GUID);
            cstmt.registerOutParameter("V_CURSOR", OracleTypes.CURSOR);
            cstmt.execute();
            result.put("list", ResultHash((ResultSet) cstmt.getObject("V_CURSOR")));
        } catch (SQLException e) {
            logger.error(e);
        } finally {
            cstmt.close();
            conn.close();
        }
        logger.info("end PM_DEFECT_LOG_FROMPRO_DEFECT_S");
        return result;
    }
}
