package org.building.pm.controller;

import eu.bitwalker.useragentutils.Browser;
import eu.bitwalker.useragentutils.OperatingSystem;
import eu.bitwalker.useragentutils.UserAgent;
import org.building.pm.service.InfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


/**
 * Created by zjh on 2017/1/19.
 */

@Controller
@RequestMapping("/app/pm/info")
public class InfoController {

    @Autowired
    private InfoService infoService;
    private InfoController infoController;


    @RequestMapping(value = "/GetUserIp", method = RequestMethod.POST)
    @ResponseBody
    public String GetUserIp(HttpServletRequest request) {
        String result = request.getHeader("x-forwarded-for");

        if (result == null || result.length() == 0 || "unknown".equalsIgnoreCase(result)) {
            result = request.getHeader("Proxy-Client-IP");
        }

        if (result == null || result.length() == 0 || "unknown".equalsIgnoreCase(result)) {
            result = request.getHeader("WL-Proxy-Client-Ip");
        }

        if (result == null || result.length() == 0 || "unknown".equalsIgnoreCase(result)) {
            result = request.getRemoteAddr();
        }
        return result;
    }


    /*
     * 设备登录
     * */
    @RequestMapping(value = "login", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> login(@RequestParam(value = "UserName") String UserName,
                                     @RequestParam(value = "UserIp") String UserIp,
                                     @RequestParam(value="SS") String SS,
                                     HttpServletRequest request)
            throws  SQLException {

        UserAgent userAgent = UserAgent.parseUserAgentString(request.getHeader("User-Agent"));
        Browser browser = userAgent.getBrowser();//获取浏览器信息
        OperatingSystem os = userAgent.getOperatingSystem(); //获取操作系统信息

        String OSNAME=os.toString();
        String BROWN=browser.toString();
        String LOCALHOST=request.getRemoteHost();//客户端主机名，若失败返回客户端ip
//        String LOCALHOST="";
//        String SS="";

        Map<String, Object> result = infoService.login(UserName, UserIp, OSNAME, BROWN, LOCALHOST, SS);
        return result;
    }

    /*
     * 单点登录
     * */
    @RequestMapping(value = "login_dddl_n", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> login_dddl_n(@RequestParam(value = "USERID") String USERID,
                                     @RequestParam(value = "V_V_IP") String V_V_IP,
                                     HttpServletRequest request)
            throws  SQLException {

        Map<String, Object> result = infoService.login_dddl_n(USERID, V_V_IP);
        return result;
    }


    /*
     * 登录日志
     * */
    @RequestMapping(value = "log_text", method = RequestMethod.POST)
    @ResponseBody
    public String log_text(@RequestParam(value = "UserIp") String UserIp)
            throws SQLException {
        String result = infoService.log_text(UserIp);
        return result;
    }

    /*
     * 单点登录
     * */
    @RequestMapping(value = "login_dddl", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> login_dddl(@RequestParam(value = "LoginName") String LoginName, @RequestParam(value = "LoginType") String LoginType)
            throws SQLException {
        Map<String, Object> result = infoService.login_dddl(LoginName, LoginType);
        return result;
    }

    /*
     *通过工单号直接获取工单信息
     * */
    @RequestMapping(value = "PRO_GO", method = RequestMethod.POST)
    @ResponseBody
    public List PRO_GO(@RequestParam(value = "V_V_PERSONCODE") String V_V_PERSONCODE,
                       @RequestParam(value = "V_V_ORDERID") String V_V_ORDERID)
            throws SQLException {
        List result = infoService.PRO_GO(V_V_PERSONCODE, V_V_ORDERID);
        return result;
    }

    // 转小神探单点登陆
    @RequestMapping(value = "login_xst", method = RequestMethod.POST)
    @ResponseBody
    public String login_xst(@RequestParam(value = "V_V_LOGINNAME") String V_V_LOGINNAME,
                            @RequestParam(value = "V_V_TYPE") String V_V_TYPE)
            throws SQLException {
        String result = infoService.login_xst(V_V_LOGINNAME, V_V_TYPE);
        return result;
    }

    /*
     * 单点登录后得到其它系统url
     * */
    @RequestMapping(value = "login_getUrl", method = RequestMethod.POST)
    @ResponseBody
    public Map<String, Object> login_getUrl(@RequestParam(value = "LoginName") String LoginName)
            throws SQLException {
        Map<String, Object> result = infoService.login_getUrl(LoginName);
        return result;
    }
}
