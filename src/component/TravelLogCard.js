import React, { useState } from "react";
import {
  Carousel,
  Button,
  Card,
  Flex,
  Typography,
  Drawer,
  Space,
  Input,
  message,
  Row,
  Col,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import cookie from "react-cookies";
import { api } from "../util";
const { TextArea } = Input;

//定义数据按钮
const buttonData = [
  {
    text: "转发抄袭，盗图",
    backgroundColor: "#F5B7B1",
    borderColor: "#F5B7B1",
  },
  {
    text: "虚假宣传，欺诈",
    backgroundColor: "#F5B7B1",
    borderColor: "#F5B7B1",
  },
  {
    text: "侮辱敏感性字眼",
    backgroundColor: "#F5B7B1",
    borderColor: "#F5B7B1",
  },
  {
    text: "暴力色情",
    backgroundColor: "#F5B7B1",
    borderColor: "#F5B7B1",
  },
];

//logs：游记数据对象，index：游记在列表中的索引。
// setTravelLogs：更新游记列表的函数。onDelete：删除游记的函数。
const TravelLogCard = ({ logs, index, setTravelLogs, onDelete }) => {
  const [newState, setNewState] = useState(null);//存储审核状态
  const [instruction, setInstruction] = useState(""); // 存储审核意见
  const [open, setOpen] = useState(false); //控制抽屉（Drawer）的显示状态
  
  const showDrawer = () => {
    setOpen(true);
  };//打开抽屉
  const onClose = () => {
    setOpen(false);
  };//关闭抽屉

  // 从Cookie中读取用户的role（角色）
  const userRole = cookie.load("role");

  // handlePassState函数用于处理审核通过的操作。通过api间接使用axios，调用setTravelLogs更新游记列表的状态
  const handlePassState = async (newState) => {
    setTravelLogs(index, newState);
    await api
      .put(`/auditManagement/stateUpdate/${logs._id}`, {
        state: newState,
      })
      .then((response) => {
        console.log("游记状态更新成功:", response.data);
      })
      .catch((error) => {
        console.error("游记状态更新失败:", error);
      });
  };

  // 审核不通过，然后打开抽屉，进行下一步操作
  const handleForbiddenState = async (newState) => {
    setNewState(newState);
    showDrawer();
  };

  // 抽屉被打开后执行，提交拒绝理由，果拒绝理由为空，显示错误消息
  const handleSubmitInstruction = async () => {
    setTravelLogs(index, newState, instruction);
    if (instruction === "") { 
      message.error("请填写拒绝理由");
      return;
    }
    await api
      .put(`/auditManagement/stateUpdate/${logs._id}`, {
        state: newState,
        instruction: instruction,
      })
      .then((response) => {
        console.log("拒绝理由提交成功:", response.data);
      })
      .catch((error) => {
        console.error("拒绝理由提交失败:", error);
      });
    setInstruction("");
    onClose();
  };

  // 执行逻辑删除，调用onDelete更新游记列表，移除当前游记，使用api.delete向后端发送DELETE请求，删除游记
  const handleDelete = async () => {
    onDelete(index);
    await api
      .delete(`/auditManagement/travelLogDelete/${logs._id}`)
      .then((response) => {
        console.log("删除成功:", response.data);
        message.success("删除成功");
      })
      .catch((error) => {
        console.error("删除失败:", error);
        message.error("删除失败");
      });
  };

  // 拒绝理由标签选择
  const handleButtonClick = (text) => {
    setInstruction(instruction + text + "；");
  };

    //imageShow函数用于展示游记的图片。
    //如果图片数量大于1，使用Carousel组件展示轮播图。
    //如果图片数量为1，直接展示单张图片。

  const imageShow = (imagesUrl) => {
    if (imagesUrl.length > 1) {
      return (
        <Carousel style={{ width: 150, height: 150 }}>
          {imagesUrl.map((image, index) => (
            <div key={index}>
              <img
                src={image}
                alt="example"
                style={{ width: "100%", height: "100%", borderRadius: 10 }}
              />
            </div>
          ))}
        </Carousel>
      );
    } else {
      return (
        <div style={{ width: 150, height: 150 }}>
          <img
            src={imagesUrl[0]}
            alt="LogImages"
            style={{ width: "100%", height: "100%", borderRadius: 10 }}
          />
        </div>
      );
    }
  };


  return (
    <div>
      <Card
        // hoverable
        // style={{ width: '100%' }}  hoverable高亮
        styles={{ body: { padding: 20, overflow: "hidden" } }}
      >
{/* 除audit之外，其他的角色都可以将游记卡片删除，但是audit不可以 */}
        {userRole !== "audit" && (
          <Flex justify="flex-end">
            <CloseOutlined
              style={{ fontSize: "20px", color: "blue" }}
              onClick={() => {
                handleDelete();
              }}
            />
          </Flex>
        )}

        <Flex justify="space-between" align="center">
          {/* 对图片进行判断，超过一张的使用走马灯，但图片的高宽比不一致，后续需要修改 */}
          {imageShow(logs.imagesUrl)}
          <Flex vertical style={{ marginLeft: 20, flex: 5 }}>
            <Typography.Title level={3} style={{ margin: 0, padding: "4px" }}>
              {logs.title}
            </Typography.Title>
            <div
              style={{
                maxHeight: "120px",
                overflowY: "auto",
              }}
            >
              <Typography.Paragraph style={{ fontSize: 15 }}>
                {logs.content}
              </Typography.Paragraph>
            </div>
            <Flex justify="space-between" style={{ marginTop: 10 }}>
              <div style={{ marginTop: 10 }}>
                <Typography.Paragraph style={{ fontSize: 14 }}>
                  {logs.instruction ? `说明： ${logs.instruction}` : null}
                </Typography.Paragraph>
              </div>
              <Flex>
                <Button
                  type="primary"
                  style={{ marginRight: 10 }}
                  onClick={() => {
                    handlePassState("已通过");
                  }}
                >
                  通过
                </Button>
                <Button
                  onClick={() => {
                    handleForbiddenState("未通过");
                  }}
                >
                  拒绝
                </Button>
              </Flex>
            </Flex>
            <div>
              <Typography.Paragraph style={{ fontSize: 14 }}>
                {logs.editTime}
              </Typography.Paragraph>
            </div>
          </Flex>
          <Flex justify="center" align="center" style={{ flex: 1 }}>
            <div
              style={{
                width: 70,
                height: 70,
                textAlign: "center",
                border: `4px solid ${
                  logs.state === "待审核"
                    ? "#ccc"
                    : logs.state === "已通过"
                    ? "#3498DB"
                    : "#C0392B "
                }`,
                borderRadius: "0%",
                boxSizing: "border-box",
              }}
            >
              <Typography
                style={{
                  color:
                    logs.state === "待审核"
                      ? "gray"
                      : logs.state === "已通过"
                      ? "#2E86C1"
                      : "#A93226 ",
                  padding: 5,
                  marginTop: 15,
                  fontSize: 16,
                }}
              >
                {logs.state}
              </Typography>
            </div>
          </Flex>
        </Flex>
      </Card>
      <Drawer
        // title={
        //   <div style={{ fontWeight: "normal", fontSize: 14}}>
        //     请填写不予通过的理由
        //   </div>
        // }
        placement="right"
        // closable={false}
        onClose={onClose}
        open={open}
        getContainer={false}
        width={"80%"}
        extra={
          <Space>
            <Button onClick={handleSubmitInstruction} type="primary">
              提交
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 15 }}>
          {/* 必须填写 */}
          <TextArea
            rows={3}
            value={instruction}
            rules={[{ required: true, message: "此项不能为空" }]}
            onChange={(e) => setInstruction(e.target.value)}
          />
        </div>
        <Row gutter={[12, 12]}>
          {buttonData.map((button, index) => (
            <Col span={6} key={index}>
              <Button
                type="text"
                style={{
                  backgroundColor: button.backgroundColor,
                  borderColor: button.borderColor,
                  // transition：设置按钮的背景颜色和边框颜色的过渡效果，使颜色变化更加平滑。
                  // transition: "background-color 0.3s, border-color 0.3s",
                }}
                onClick={() => handleButtonClick(button.text)}
              >
                {button.text}
              </Button>
            </Col>
          ))}
        </Row>
      </Drawer>
    </div>
  );
};
export default TravelLogCard;
