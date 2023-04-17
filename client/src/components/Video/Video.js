import React, { useContext, useEffect, useState, useRef } from "react";
import VideoContext from "../../context/VideoContext";
import "./Video.css";
import Options from "../options/Options";
import { Card, Modal, Button, Input, notification, Avatar, message } from "antd";
import Man from "../../assests/man.svg";
import VideoIcon from "../../assests/video.svg";
import { io } from "socket.io-client";
import VideoOff from "../../assests/video-off.svg";
// import Profile from "../../assests/profile.svg";
import Msg_Illus from "../../assests/msg_illus.svg";
import Msg from "../../assests/msg.svg";
import ScreenShare from '../../assests/share_screen.svg'
import { UserOutlined, MessageOutlined } from "@ant-design/icons";
import { socket } from "../../context/VideoState";
import Editor from "./Editor";
// import Editor1 from "./editor1";
import codeLogo3 from "../../assests/codeLogo3.png";
import codeLogo1 from "../../assests/codeLogo1.png";
import codeLogo2 from "../../assests/codeLogo2.png"
import codeLogo4 from "../../assests/codeLogo4.png"




// const socket = io()
const { Search } = Input;
const Video = () => {
  const {
    call,
    callAccepted,
    myVideo,
    userVideo,
    stream,
    name,
    setName,
    callEnded,
    me,
    callUser,
    leaveCall,
    answerCall,
    sendMsg: sendMsgFunc,
    msgRcv,
    chat,
    setChat,
    userName,
    myVdoStatus,
    screenShare,
    fullScreen,
    handleScreenSharing,
    userVdoStatus,
    updateVideo,
    myMicStatus,
    userMicStatus,
    updateMic,
    setMessage,
    message,
    otherUser
  } = useContext(VideoContext);

  const [sendMsg, setSendMsg] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  // const [messageReceived, setMessageReceived] = useState("");

  // const sendMessage = () => {
  //   socket.emit("send_message", { message ,to:otherUser});
  // };

  // useEffect(() => {
  //   socket.on("receive_message", (data) => {
  //     setMessageReceived(data.message);
  //   });
  // }, [socket]);
  socket.on("msgRcv", ({ name, msg: value, sender }) => {
    let msg = {};
    msg.msg = value;
    msg.type = "rcv";
    msg.sender = sender;
    msg.timestamp = Date.now();
    setChat([...chat, msg]);
  });

  const dummy = useRef();

  useEffect(() => {
    if (dummy?.current) dummy.current.scrollIntoView({ behavior: "smooth" });
  }, [chat]);

  const showModal = (showVal) => {
    setIsModalVisible(showVal);
  };

  const onSearch = (value) => {
    if (value && value.length) sendMsgFunc(value);
    setSendMsg("");
  };

  useEffect(() => {
    if (msgRcv.value && !isModalVisible) {
      notification.open({
        message: "",
        description: `${msgRcv.sender}: ${msgRcv.value}`,
        icon: <MessageOutlined style={{ color: "#108ee9" }} />,
      });
    }
  }, [msgRcv]);

  return (
  

    <div className="grid">

    <div className="video-grid">
   
     
    <div className="video-flex">
    <div className="name" style={{textAlign:"center" ,height:"90px",width:"300px" ,alignItems:"center"}}>
    {/* <h1 style={{textAlign:"center"}}>CodeMeet</h1> */}
    
    <img src={codeLogo4} alt="logo" 
    style={{height:"90px", objectFit:"cover"}}
    />
      </div>
    <div className="flexx">

      {stream ? (
        <div
          style={{ textAlign: "center" }}
          className="card"
          id={callAccepted && !callEnded ? "video1" : "video3"}
        >
          <div >
            <h3 style={{zIndex:"5" ,position:"absolute" ,padding:"1vh"}}>
              {/* {myVdoStatus && name} */}
              You
              </h3>
          </div>
          <div className="video-avatar-container">
            <video
              playsInline
              muted
              onClick={fullScreen}
              ref={myVideo}
              autoPlay
              className="video-active"
              style={{
                opacity: `${myVdoStatus ? "1" : "0"}`,
              }}
            />

            <Avatar
              style={{
                backgroundColor: "#116",
                position: "absolute",
                opacity: `${myVdoStatus ? "-1" : "2"}`,
              }}
              size={98}
              icon={!name && <UserOutlined />}
            >
              {name}
            </Avatar>
          </div>

          <div className="iconsDiv">
            <div
              className="icons"
              onClick={() => {
                updateMic();
              }}
              tabIndex="0"
            >
              <i
                className={`fa fa-microphone${myMicStatus ? "" : "-slash"}`}
                style={{ transform: "scaleX(-1)" }}
                aria-label={`${myMicStatus ? "mic on" : "mic off"}`}
                aria-hidden="true"
              ></i>
            </div>

            {callAccepted && !callEnded && (
              <div
                className="icons"
                onClick={() => {
                  setIsModalVisible(!isModalVisible);
                }}
                tabIndex="0"
                >
                <img src={Msg} alt="chat icon" />
              </div>
            )}
            <Modal
              title="Chat"
              footer={null}
              visible={isModalVisible}
              onOk={() => showModal(false)}
              onCancel={() => showModal(false)}
              style={{ maxHeight: "100px" }}
            >
              {chat.length ? (
                <div className="msg_flex">
                  {chat.map((msg) => (
                    <div
                    className={msg.type === "sent" ? "msg_sent" : "msg_rcv"}
                    >
                      {msg.msg}
                    </div>
                  ))}
                  <div ref={dummy} id="no_border"></div>
                </div>
              ) : (
                <div className="chat_img_div">
                  <img src={Msg_Illus} alt="msg_illus" className="img_illus" />
                </div>
              )}
              <Search
                placeholder="your message"
                allowClear
                className="input_msg"
                enterButton="Send "
                onChange={(e) => setSendMsg(e.target.value)}
                value={sendMsg}
                size="large"
                onSearch={onSearch}
                />
            </Modal>
            {callAccepted && !callEnded && (
              <div
              className="icons"
              onClick={() => handleScreenSharing()} 
              tabIndex="0"
              >
                <img src={ScreenShare} alt="share screen" />
              </div>
            )}

            <div className="icons" onClick={() => updateVideo()} tabIndex="0">
              {myVdoStatus ? (
                <img src={VideoIcon} alt="video on icon" />
              ) : (
                <img src={VideoOff} alt="video off icon" />
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="bouncing-loader">
          <div></div>
          <div></div>
          <div></div>
        </div>
      )}

      {callAccepted && !callEnded && userVideo && (
        <div className="card2" style={{ textAlign: "center" }} id="video2">
          <div>
            <h3 style={{zIndex:"5" ,position:"absolute" ,paddingLeft:"2vh"}}>{userVdoStatus && (call.name || userName)}</h3>
          </div>
           

          <div className="video-avatar-container">
            <video
              playsInline
              ref={userVideo}             
              onClick={fullScreen}
              autoPlay
              className="video-active"
              style={{
                opacity: `${userVdoStatus ? "1" : "0"}`,
              }}
              />

            <Avatar
              style={{
                backgroundColor: "#116",
                position: "absolute",
                opacity: `${userVdoStatus ? "-1" : "2"}`,
              }}
              size={98}
              icon={!(userName || call.name) && <UserOutlined />}
              >
              {userName || call.name}
            </Avatar>
            {!userMicStatus && (
              <i
                style={{
                  position: "absolute",
                  top: "0",
                  left: "0",
                  padding: "0.3rem",
                  backgroundColor: "#fefefebf",
                }}
                className="fad fa-volume-mute fa-2x"
                aria-hidden="true"
                aria-label="microphone muted"
                ></i>
                )}
          </div>
        </div>
      )}
    </div>
    </div>
    </div>
    <div>

    <Options />
      {<Editor />}
    </div>
    </div>
  );
};

export default Video;
