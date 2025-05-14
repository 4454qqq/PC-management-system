import React, { useState, useEffect } from "react";
import {
  DownOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Row,
  Col,
  Dropdown,
  Typography,
  Space,
  Pagination,
  Input,
  Card,
  Button,
  Divider,
} from "antd";
import TravelLogCard from "../component/TravelLogCard";
import { api } from "../util";

const { Search } = Input;

const items = [
  { key: "1", label: "待审核" },
  { key: "2", label: "已通过" },
  { key: "3", label: "未通过" },
  { key: "4", label: "全部" },
];

const RequestStatus = {
  IDLE: "IDLE",
  PENDING: "PENDING",
  SUCCESS: "SUCCESS",
  ERROR: "ERROR",
};

const TravelLogList = () => {
  const [selectState, setSelectState] = useState(""); // 状态选择
  const [searchText, setSearchText] = useState(""); // 搜索文本
  const [travelLogs, setTravelLogs] = useState(null); // 存储旅行日志数据
  const [currentPage, setCurrentPage] = useState(1); // 当前页
  const [pageSize] = useState(4); // 每页显示4条待审核的内容
  const [requestStatus, setRequestStatus] = useState(RequestStatus.IDLE);

  const startIndex = (currentPage - 1) * pageSize; // 计算起始索引
  const endIndex = currentPage * pageSize; // 计算结束索引
  const currentData = travelLogs?.slice(startIndex, endIndex); // 获取当前页的数据

  // 状态改变函数
  const handleStateChange = (index, state, instruction) => {
    const newTravelLogs = [...travelLogs];
    newTravelLogs[index].state = state;
    newTravelLogs[index].instruction = instruction;
    setTravelLogs(newTravelLogs);
  };

  // 删除日志函数
  const handleDelete = (index) => {
    const id = travelLogs[index]._id;
    const updateLogs = travelLogs.filter((log) => log._id !== id);
    setTravelLogs(updateLogs);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          state: selectState,
          searchContent: searchText,
        };
        const response = await api.get("/auditManagement/travelLogs", {
          params,
        });
        setTravelLogs(response.data);
        setRequestStatus(RequestStatus.SUCCESS);
      } catch (error) {
        setRequestStatus(RequestStatus.ERROR);
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [searchText, selectState]); // 依赖于搜索文本和状态选择

  const onSearch = async (value) => {
    setSearchText(value);
  };

  const handleSelectState = (item) => {
    const selectedItem = items.find((state) => state.key === item.key);
    setSelectState(selectedItem ? selectedItem.label : "");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: "20px 40px", backgroundColor: "#f9f9f9" }}>
      {/* 搜索和下拉框部分 */}
      <Row justify="space-between" align="middle" style={{ marginBottom: "20px" }}>
        <Col>
          <Dropdown
            menu={{
              items,
              selectable: true,
              onClick: handleSelectState,
            }}
            placement="bottomLeft"
          >
            <Typography.Link style={{ fontSize: 16 }}>
              <Space>
                {selectState ? selectState : "选择审核状态"}
                <DownOutlined />
              </Space>
            </Typography.Link>
          </Dropdown>
        </Col>
        <Col>
          <Search
            placeholder="搜索游记"
            onSearch={onSearch}
            enterButton
            allowClear
            size="large"
            style={{ width: "200px" }}
            prefix={<SearchOutlined />}
          />
        </Col>
      </Row>

      {/* 旅行日志内容显示部分 */}
      <Row gutter={[24, 24]}>
        {requestStatus === RequestStatus.SUCCESS &&
          currentData?.map((log, index) => (
            <Col span={24} key={index}>
              <Card
                style={{
                  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  padding: "16px",
                }}
              >
                <TravelLogCard
                  logs={log}
                  index={index}
                  setTravelLogs={handleStateChange}
                  onDelete={handleDelete}
                />
              </Card>
            </Col>
          ))}
      </Row>

      {/* 分页部分 */}
      {requestStatus === RequestStatus.SUCCESS && (
        <Pagination
          current={currentPage}
          pageSize={pageSize}
          total={travelLogs?.length}
          onChange={handlePageChange}
          style={{
            textAlign: "center",
            marginTop: "20px",
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "8px",
          }}
        />
      )}
    </div>
  );
};

export default TravelLogList;
