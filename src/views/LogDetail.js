import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from "../util";

function TravelLogDetail() {
    const { logId } = useParams();

    const [logs, setLogs] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get(`/auditManagement/findLog/${logId}`);
                setLogs(response.data);
                setError(null); // 清除之前的错误
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("加载日志失败，请稍后再试。");
            }
        };
        fetchData();
    }, [logId]);


    // 时间格式化显示
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    if (error) {
        return <div style={{ padding: '20px' }}><p style={{ color: 'red' }}>{error}</p></div>;
    }

    return (
        <div style={pageStyle}>
            <div style={contentStyle}>
                <h1 style={titleStyle}>{logs.title || '加载中...'}</h1>
                <div style={infoStyle}>
                    <p><strong style={labelStyle}>内容:</strong> {logs.content || '暂无内容'}</p>
                    <p><strong style={labelStyle}>编辑时间:</strong> {formatDate(logs.editTime) || '暂无时间'}</p>
                    <p><strong style={labelStyle}>状态:</strong> {logs.state || '未知状态'}</p>
                    <p><strong style={labelStyle}>地点:</strong> {logs.destination || '未知地点'}</p>
                </div>

                <div style={mediaSectionStyle}>
                    <h2 style={sectionTitleStyle}>图片:</h2>
                    {logs.imagesUrl && logs.imagesUrl.length > 0 ? (
                        <div style={imageContainerStyle}>
                            {logs.imagesUrl.map((url, index) => (
                                <img
                                    key={index}
                                    src={url}
                                    alt={`Image ${index}`}
                                    style={imageStyle}
                                    onError={(e) => {
                                        e.target.src = 'path/to/default-image.jpg'; // 替换为默认图片路径
                                    }}
                                />
                            ))}
                        </div>
                    ) : (
                        <p style={noContentStyle}>暂无图片</p>
                    )}
                </div>

                <div style={mediaSectionStyle}>
                    <h2 style={sectionTitleStyle}>视频:</h2>
                    {logs.videosUrl && logs.videosUrl.length > 0 ? (
                        logs.videosUrl.map((url, index) => (
                            <video
                                key={index}
                                controls
                                style={videoStyle}
                            >
                                <source src={url} type="video/mp4" />
                                您的浏览器不支持视频播放。
                            </video>
                        ))
                    ) : (
                        <p style={noContentStyle}>暂无视频</p>
                    )}
                </div>
            </div>
        </div>
    );
}

// CSS 样式
const pageStyle = {
    padding: '30px',
    maxWidth: '1000px',
    margin: '0 auto',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
};

const contentStyle = {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '30px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    marginBottom: '30px',
};

const titleStyle = {
    fontSize: '28px',
    color: '#333',
    marginBottom: '20px',
    borderBottom: '2px solid #eee',
    padding: '0 0 15px 0',
};

const infoStyle = {
    marginBottom: '25px',
};

const labelStyle = {
    fontSize: '16px',
    color: '#555',
    marginRight: '5px',
};

const mediaSectionStyle = {
    marginBottom: '30px',
};

const sectionTitleStyle = {
    fontSize: '22px',
    color: '#444',
    marginBottom: '15px',
    fontWeight: '600',
};

// 图片容器样式
const imageContainerStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    marginBottom: '20px'
};

const imageStyle = {
    width: 'calc(33.333% - 20px)', // 每行显示3张图片
    height: 'auto',
    borderRadius: '8px',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer'
};

imageStyle[':hover'] = {
    transform: 'scale(1.05)'
};

const videoStyle = {
    width: '300px',
    height: 'auto',
    objectFit: 'cover',
    borderRadius: '8px',
    margin: '10px 0',
    boxShadow: '0 3px 10px rgba(0, 0, 0, 0.1)',
};

const noContentStyle = {
    color: '#888',
    fontSize: '16px',
    fontStyle: 'italic',
    textAlign: 'center',
    margin: '20px 0',
};

export default TravelLogDetail;