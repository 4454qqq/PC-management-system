import React, { useState, useEffect } from "react";
import {
  EditOutlined,
} from "@ant-design/icons";
import { Menu } from "antd";
import { NavLink, useNavigate } from "react-router-dom";
import cookie from "react-cookies";
import { api } from "../util";


//setIsLoggedIn更新登录状态
const App = ({ isLoggedIn, setIsLoggedIn }) => {
  const role = cookie.load("role");
  const navigate = useNavigate();

  // 退出登录处理，window.confirm弹出确认对话框，如果用户确认退出：调用api.get("/auditManagement/logout")向后端发送退出登录请求
  //调用setIsLoggedIn(false)更新登录状态为未登录。使用cookie.remove移除存储在Cookie中的userId和role，使用navigate("/")将用户重定向到首页。
  const handleLogout = async () => {
    const confirmed = window.confirm("确定要退出登录吗？");
    if (confirmed) {
      await api.get("/auditManagement/logout");
      setIsLoggedIn(false);
      cookie.remove("userId");
      cookie.remove("role");
      navigate("/"); // 重定向到首页
    }
  };

  const logout = <span onClick={handleLogout}>退出登录</span>;
  const travelLogList = <NavLink to="/travelLogList">审核列表</NavLink>;
  const roleInstruction = <NavLink to="/permissionList">角色说明</NavLink>;
  const userList = <NavLink to="/userList">用户列表</NavLink>;

  // 获取菜单项


  const getMenuItems = () => {
    const commonItems = [
      {
        key: "logout",
        icon: <EditOutlined />,
        label: logout,
      },
    ];
//admin的专用菜单
    const adminItems = [
      {
        key: "travelLogList",
        label: travelLogList,
      },
      {
        key: "roleInstruction",
        label: roleInstruction,
      },
      {
        key: "userList",
        label: userList,
      },
    ];


//audit的专用菜单
    const auditItems = [
      {
        key: "travelLogList",
        label: travelLogList,
      },
    ];

    // 根据角色返回不同的菜单项（很关键。区分audit，）
    if (role === "audit") {
      return commonItems.concat(auditItems);
    } else {
      return commonItems.concat(adminItems);
    }
  };

  return (
    <Menu
      mode="inline" // 垂直菜单
      items={getMenuItems()} // 使用 getMenuItems 函数来填充菜单项
      defaultSelectedKeys={["travelLogList"]} // 默认选中的项
      style={{ fontSize: "18px" }} // 设置字体大小为18px
    />
  );
};

export default App;
