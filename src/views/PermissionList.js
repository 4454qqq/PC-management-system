import React from "react";
import { Table, Typography, Card, Divider, Row, Col } from "antd";
const { Title } = Typography;

const PermissionList = () => {
  const columns = [
    {
      title: "角色",
      dataIndex: "role",
      key: "role",
      render: (text) => <strong>{text}</strong>, // 强调角色文字
    },
    {
      title: "权限描述",
      dataIndex: "description",
      key: "description",
      render: (text) => <span style={{ wordBreak: "break-word" }}>{text}</span>, // 长文本自动换行
    },
  ];

  const roles = [
    {
      _id: "1",
      role: "admin",
      description:
        "执行审核列表卡片的通过、拒绝、删除。可以删除audit的权限",
    },
    {
      _id: "2",
      role: "audit",
      description: "只可以执行审核列表卡片的通过、拒绝。",
    },
  ];

  return (
    <div style={{ padding: "20px", backgroundColor: "#f9f9f9" }}>
      {/* Main Content Wrapper */}
      <Row justify="center">
        <Col xs={24} sm={22} md={18} lg={16}>
          <Card
            style={{
              borderRadius: "12px",
              boxShadow: "0 4px 16px rgba(0, 0, 0, 0.1)",
              marginBottom: "20px",
            }}
          >
            <Title level={3} style={{ color: "#333", textAlign: "center" }}>
              角色的权限说明
            </Title>
            <Divider style={{ margin: "10px 0" }} />
            <Table
              dataSource={roles}
              columns={columns}
              rowKey="_id"
              pagination={false} // 删除底部的分页器
              bordered
              style={{
                borderRadius: "8px",
                backgroundColor: "#fff",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default PermissionList;
