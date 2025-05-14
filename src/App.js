import React, { useState, useEffect } from "react";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Button, theme, Typography } from "antd"; // Import Typography here
import {
  HashRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import MyMenu from "./component/Menu";
import cookie from "react-cookies";
import LoginForm from "./views/LoginPage";
import PermissionList from "./views/PermissionList";
import TravelLogList from "./views/TravelLogList";
import UserList from "./views/UserList";
import { api } from "./util";
import "./App.css";

const { Header, Sider, Content } = Layout;

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const userId = cookie.load("userId");
  const roleToName = {
    superAdmin: "超级管理员",
    admin: "管理员",
    audit: "审核人员",
  };

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const params = { userId };
        const response = await api.get("/auditManagement/userInfo", { params });
        setIsLoggedIn(true);
        setUser(response.data);
        cookie.save("role", response.data.role, { path: "/" });
      } catch (error) {
        setIsLoggedIn(false);
        console.log(error);
      }
    };
    checkLoggedIn();
  }, [userId]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  if (!isLoggedIn) return <LoginForm handleLogin={handleLogin} />;

  return (
    <Router>
      <Layout style={{ minHeight: "100vh" }}>
        <Layout style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Sider
            style={{
              background: colorBgContainer,
              borderLeft: "2px solid #f0f0f0",
              transition: "all 0.3s",
            }}
          >
            <div style={{ padding: "20px", textAlign: "center" }}>
              <Typography.Title level={3} style={{ color: "#fff" }}>
                管理后台
              </Typography.Title>
            </div>
            <MyMenu isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          </Sider>

          <Layout>
            <Header
              style={{
                padding: "0 20px",
                background: colorBgContainer,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              {isLoggedIn && user && (
                <div style={{ marginLeft: "10px", fontSize: "16px" }}>
                  <span style={{ fontWeight: 500, color: "#333" }}>
                    {roleToName[user.role]}
                  </span>
                  <span style={{ margin: "0 6px", color: "#999" }}>|</span>
                  <span>{user.username}</span>
                </div>

              )}

              {isLoggedIn && (
                <Button
                  type="primary"
                  onClick={() => {
                    cookie.remove("userId");
                    cookie.remove("role");
                    setIsLoggedIn(false);
                  }}
                  style={{
                    marginLeft: "20px",
                    backgroundColor: "#ff4d4f",
                    borderColor: "#ff4d4f",
                  }}
                >
                  退出登录
                </Button>
              )}
            </Header>

            <Content
              style={{
                margin: "20px",
                padding: "24px",
                minHeight: 280,
                background: colorBgContainer,
                borderRadius: borderRadiusLG,
              }}
            >
              <Routes>
                <Route path="/" element={<Navigate to="/travelLogList" />} />
                <Route
                  path="/travelLogList"
                  element={<TravelLogList loginUser={user} />}
                />
                <Route
                  path="/permissionList"
                  element={isLoggedIn ? <PermissionList /> : <Navigate to="/login" />}
                />
                <Route
                  path="/userList"
                  element={isLoggedIn ? <UserList /> : <Navigate to="/login" />}
                />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
