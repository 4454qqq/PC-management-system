import React, { useState } from "react";
import { Form, Input, Button, message, Typography, Checkbox, Modal } from "antd";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { api } from "../util";
import cookie from "react-cookies";

const { Title } = Typography;
const LoginPage = ({ handleLogin }) => {
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false); // 控制Modal显示（隐私条款）
  const handleSubmit = async (values) => {
    if (!values.remember) {
      message.error("请先同意隐私条款！");
      return;
    }

    try {
      const response = await api.post("/auditManagement/login", values);
      message.success(response.data.message);
      let expireDate = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);//保存userId到cookie24个小时
      cookie.save("userId", response.data.userId, {
        expires: expireDate,
        path: "/",
      });
      //调用APP.js的handleLogin回调
      handleLogin(response.data.user);
    } catch (error) {
      console.error(error);
      message.error(error?.response?.data?.message || "登录失败");
    }
  };

  return (
    <div className="login-background">
      <div className="login-box">
        <Title
          level={3}
          style={{
            textAlign: "center",
            marginBottom: "20px",
            color: "rgb(94, 98, 115)",
          }}
        >
          404_Not_found_Group
        </Title>

        <Form
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: false }}
          //ononFinish是Ant Design Form 组件的一个预设属性，用于处理表单提交成功的回调
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: "请输入用户名！" }]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Username"
              style={{ fontSize: "18px" }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "请输入密码！" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Password"
              style={{ fontSize: "18px" }}
            />
          </Form.Item>

          <Form.Item name="remember" valuePropName="checked">
            <div style={{ display: "flex", alignItems: "center", marginBottom: "10px" }}>
              <Checkbox />
              <span style={{ marginLeft: 8, fontSize: "16px" }}>
                我已阅读并同意
                <span
                  onClick={() => setModalVisible(true)}
                  style={{
                    color: "#1890ff",
                    marginLeft: 4,
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  隐私条款
                </span>
              </span>
            </div>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ fontSize: "16px", width: "100%" }}
            >
              Enter
            </Button>
          </Form.Item>
        </Form>

        {/* Modal 弹出框内容 */}
        <Modal
          title="隐私条款"
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
        >
          <p>欢迎使用本系统！以下是我们的隐私条款：</p>
          <p>
            本系统将收集您的登录信息用于身份验证，不会向任何第三方泄露。
            您的信息将用于提供更好的服务体验，并在法律允许范围内处理和存储。
          </p>
          <p>
            使用本系统即表示您同意我们按照相关法律法规和本条款约定使用您的信息。
          </p>
        </Modal>
      </div>
    </div>
  );
};

export default LoginPage;
