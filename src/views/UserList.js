import React, { useEffect, useState } from "react";
import {
  Button,
  Table,
  Drawer,
  Input,
  Space,
  FloatButton,
  Form,
  Row,
  Col,
  Select,
  message,
  Typography,
  Divider,
  Card
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { api } from "../util";
import cookie from "react-cookies";

const { Search } = Input;
const { Option } = Select;
const { Title } = Typography;

const RequestStatus = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const UserList = () => {
  const [searchText, setSearchText] = useState("");
  const [managerList, setManagerList] = useState([]);
  const [open, setOpen] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [requestStatus, setRequestStatus] = useState(RequestStatus.IDLE);

  const [form] = Form.useForm();
  const role = cookie.load("role");

  const columns = [
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      align: "center", 
    },
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      render: (text, record) => {
        if (role === "superAdmin") {
          return (
            <Select
              defaultValue={text}
              style={{ width: 120, borderRadius: 4, boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)" }}
              onChange={(value) => handleEditRole(record._id, value)}
              disabled={disabled}
              
            >
              {/* 通过改变handleEditRole中的value来向后端发起请求 */}
              <Option value="admin">管理员</Option>  
              <Option value="audit">审核人员</Option>
            </Select>
          );
        } else {
          return <span>{text}</span>; 
        }
      },
      align: "center", 
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {role === "superAdmin" && (
            <Button
              type="link"
              style={{ padding: 0, fontSize: 14 }}
              onClick={() => handleEdit()}
            >
              编辑
            </Button>
          )}
          <Button
            type="link"
            style={{ padding: 0, fontSize: 14, color: "#f5222d" }}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Space>
      ),
      align: "center", 
    },
  ];


  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          searchContent: searchText,
          role: role,
        };
        const response = await api.get("/auditManagement/adminUser", {
          params,
        });
        setManagerList(response.data);
        setRequestStatus(RequestStatus.SUCCESS);
      } catch (error) {
        setRequestStatus(RequestStatus.ERROR);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [searchText]);

  const handleSearchChange = (value) => {
    setSearchText(value);
  };

  const onFinish = async (values) => {
    onClose();
    try {
      const response = await api.post("/auditManagement/addUser", values);
      message.success("用户添加成功");
      window.location.reload();
    } catch (error) {
      message.error(error.response.data.message);
    }
  };

  const handleDelete = async (record) => {
    try {
      await api
        .delete(`/auditManagement/deleteUser/${record._id}`)
        .then(() => {
          message.success("删除成功");
          window.location.reload();
        });
    } catch (error) {
      message.error("删除失败");
    }
  };

  const handleEdit = () => {
    setDisabled(!disabled);
  };

  const handleEditRole = async (id, value) => {
    try {
      await api
        .put(`/auditManagement/editUser/${id}`, { role: value })
        .then(() => {
          message.success("角色修改成功");
        });
    } catch (error) {
      message.error("角色修改失败");
    }
  };

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
      <Row justify="center">
        <Col xs={24} sm={22} md={18} lg={16}>
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              marginBottom: "20px",
            }}
          >
            <Title level={3} style={{ textAlign: "center", color: "#333" }}>
              用户管理
            </Title>
            <Divider />
            <Space direction="vertical" style={{ width: "100%" }}>
              <Search
                placeholder="输入用户名进行搜索"
                allowClear
                enterButton
                size="large"
                onSearch={handleSearchChange}
                style={{ width: "100%", marginBottom: "20px" }}
              />
              <FloatButton
                type="primary"
                size="large"
                icon={<PlusOutlined />}
                onClick={() => setOpen(true)}
                style={{ position: "absolute", right: 40, bottom: 30 }}
              />
              <Typography.Text
                style={{
                  position: "absolute",
                  right: 33,
                  bottom: 0, // Adjust this value for spacing
                  fontSize: "14px",
                  color: "#333",
                }}
              >
                添加信息
              </Typography.Text>
            </Space>

            <Table
              columns={columns}
              dataSource={managerList}
              rowKey="_id"
              pagination={{
                pageSize: 5,
                showSizeChanger: false,
                position: ["bottomCenter"],
              }}
              bordered
            />
          </Card>
        </Col>
      </Row>

      <Drawer
        title="添加人员信息"
        placement="left"
        onClose={onClose}
        open={open}
        width="30%"
        extra={
          <Space>
            <Button type="primary" onClick={() => form.submit()}>
              提交
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" onFinish={onFinish} form={form}>
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input placeholder="请输入用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: "请输入密码" }]}
          >
            <Input placeholder="请输入密码" />
          </Form.Item>

          <Form.Item
            name="role"
            label="角色"
            rules={[{ required: true, message: "请选择角色" }]}
          >
            <Select placeholder="请选择角色">
              {role === "superAdmin" && (
                <Option value="admin">管理员</Option>
              )}
              <Option value="audit">审核人员</Option>
            </Select>
          </Form.Item>
        </Form>

      </Drawer>
    </div>
  );
};

export default UserList;
