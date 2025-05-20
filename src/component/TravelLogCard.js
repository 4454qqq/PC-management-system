import React, { useState } from "react";
import { Carousel, Button, Card, Flex, Typography, Drawer, Input, message, Row, Col } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import cookie from "react-cookies";
import { api } from "../util";
import { Link } from 'react-router-dom';

const { TextArea } = Input;


const buttonData = [
  { text: "转发抄袭，盗图", backgroundColor: "#F5B7B1", borderColor: "#F5B7B1" },
  { text: "虚假宣传，欺诈", backgroundColor: "#F5B7B1", borderColor: "#F5B7B1" },
  { text: "侮辱敏感性字眼", backgroundColor: "#F5B7B1", borderColor: "#F5B7B1" },
  { text: "暴力色情", backgroundColor: "#F5B7B1", borderColor: "#F5B7B1" },
];

const TravelLogCard = ({ logs, index, setTravelLogs, onDelete }) => {
  const [newState, setNewState] = useState(null);
  const [instruction, setInstruction] = useState("");
  const [open, setOpen] = useState(false);
  const userRole = cookie.load("role");

  const showDrawer = () => setOpen(true);
  const onClose = () => setOpen(false);

  const handlePassState = async (newState) => {
    setTravelLogs(index, newState);
    await api.put(`/auditManagement/stateUpdate/${logs._id}`, { state: newState });
  };

  const handleForbiddenState = (newState) => {
    setNewState(newState);
    showDrawer();
  };

  const handleSubmitInstruction = async () => {
    if (!instruction) {
      message.error("请填写拒绝理由");
      return;
    }
    setTravelLogs(index, newState, instruction);
    await api.put(`/auditManagement/stateUpdate/${logs._id}`, { state: newState, instruction });
    setInstruction("");
    onClose();
  };

  const handleDelete = async () => {
    onDelete(index);
    await api.delete(`/auditManagement/travelLogDelete/${logs._id}`);
    message.success("删除成功");
  };

  const handleButtonClick = (text) => setInstruction(instruction + text + "；");

  const imageShow = (imagesUrl) => {
    const imageStyle = {
      width: "100%",
      height: "200px",  // Set a fixed height for uniform image size
      objectFit: "cover",  // Ensure the image scales properly within the container
      borderRadius: 10,
    };

    if (imagesUrl.length > 1) {
      return (
        <Carousel style={{ width: 200, height: 200 }}>
          {imagesUrl.map((image, index) => (
            <div key={index}>
              <Link to={`/logDetail/${logs._id}`}>
                <img src={image} alt="example" style={imageStyle} />
              </Link>
            </div>
          ))}
        </Carousel>
      );
    } else {
      return (
        <div style={{ width: 200, height: 200 }}>
          <Link to={`/logDetail/${logs._id}`}>
            <img src={imagesUrl[0]} alt="LogImages" style={imageStyle} />
          </Link>
        </div>
      );
    }
  };


  return (
    <Card hoverable style={{ marginBottom: 20 }}>
      {/* 删除按钮，除audit之外都可用 */}
      {userRole !== "audit" && (
        <Flex justify="flex-end">
          <CloseOutlined style={{ fontSize: 20, color: "blue" }} onClick={handleDelete} />
        </Flex>
      )}

      <Flex justify="space-between" align="center" style={{ marginBottom: 15 }}>
        <div style={{ flex: 1 }}>
          {imageShow(logs.imagesUrl)}
        </div>

        {/* 内容的展示 */}
        <div style={{ flex: 2, marginLeft: 20 }}>
          <Typography.Title level={4}>{logs.title}</Typography.Title>
          <Typography.Paragraph ellipsis={{ rows: 3, expandable: true }}>
            {logs.content}
          </Typography.Paragraph>
          <Typography.Paragraph style={{ fontSize: 14, color: "#888" }}>
            {logs.editTime}
          </Typography.Paragraph>

          {/* 状态选择 */}
          <div style={{
            border: `2px solid ${logs.state === "待审核" ? "#ccc" : logs.state === "已通过" ? "#3498DB" : "#C0392B"}`,
            borderRadius: 5, padding: "5px 10px", textAlign: "center", display: "inline-block"
          }}>
            <Typography.Text style={{
              color: logs.state === "待审核" ? "gray" : logs.state === "已通过" ? "#3498DB" : "#C0392B"
            }}>
              {logs.state}
            </Typography.Text>
          </div>

          <Flex justify="end" direction="column" style={{ marginTop: 10 }}>
            <Button type="primary" onClick={() => handlePassState("已通过")} style={{ marginBottom: 10 }}>
              通过
            </Button>
            <Button onClick={() => handleForbiddenState("未通过")}>
              拒绝
            </Button>
          </Flex>
        </div>
      </Flex>

      {/* Drawer for rejection instructions */}
      <Drawer
        title="请填写不予通过的理由"
        placement="right"
        onClose={onClose}
        visible={open}
        width="50%"
        extra={<Button type="primary" onClick={handleSubmitInstruction}>提交</Button>}
      >
        <TextArea
          rows={4}
          value={instruction}
          onChange={(e) => setInstruction(e.target.value)}
          placeholder="请填写拒绝理由"
          style={{ marginBottom: 15 }}
        />
        <Row gutter={12}>
          {buttonData.map((button, index) => (
            <Col span={6} key={index}>
              <Button
                type="text"
                style={{
                  backgroundColor: button.backgroundColor,
                  borderColor: button.borderColor,
                  width: "100%",
                }}
                onClick={() => handleButtonClick(button.text)}
              >
                {button.text}
              </Button>
            </Col>
          ))}
        </Row>
      </Drawer>
    </Card>
  );
};

export default TravelLogCard;
