import React, { useState, useContext, useEffect, useRef, useCallback } from "react";
import { Input, Button, Tooltip, Modal, message } from "antd";
import Phone from "../../assests/phone.gif";
import Teams from "../../assests/teams.mp3";
import * as classes from "./Options.module.css";
import { CopyToClipboard } from "react-copy-to-clipboard";
import VideoContext from "../../context/VideoContext";
import Hang from "../../assests/hang.svg";
import {
  TwitterIcon,
  TwitterShareButton,
  WhatsappShareButton,
  WhatsappIcon,
  FacebookIcon,
  FacebookShareButton,
} from "react-share";
import {
  UserOutlined,
  CopyOutlined,
  InfoCircleOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { socket } from "../../context/VideoState";

const Options = () => {
  const [idToCall, setIdToCall] = useState("");
  const [callId, setCallId] = useState("Enter code to call");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const Audio = useRef();
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
    otherUser,
    setOtherUser,
    leaveCall1,
    room,
        setRoom,
        joinRoom,
        // message,
        // messageReceived,
        setMessage,
        // setMessageReceived,
  } = useContext(VideoContext);
  
  useEffect(() => {
    if (isModalVisible) {
      Audio?.current?.play();
    } else Audio?.current?.pause();
  }, [isModalVisible]);

  const showModal = (showVal) => {
    setIsModalVisible(showVal);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    leaveCall1();
    window.location.reload();
  };
  useEffect(() => {
    if (call.isReceivingCall && !callAccepted) {
      setIsModalVisible(true);
      setOtherUser(call.from);
    } else setIsModalVisible(false);
  }, [call.isReceivingCall]);

  // const calljoin = ()=>{
  //   // if (name.length) callUser(idToCall);
  //   // else message.error("Please enter your name to call!");
  //   joinRoom();
  //   console.log(room ,'joiiiined');
  // }
  // var x=me;
  //  const copyC=(event)=>{
  //   message.success("Code copied successfully!");
   
  //   setRoom((x));
  //   // joinRoom();
  //   console.log('this is 2' ,room);

  //  }
  //  const copyC1=(event)=>{
   
  //   setRoom((x));
  //   joinRoom();
  //   console.log('this is 1' ,room);

  //  }
  // const callset=(event)=>{
  //   setIdToCall(event.target.value) 
  //   setRoom(event.target.value);
  //   console.log('this is 3' ,room);
  //   }
  return (
    <div className={classes.options}>
      <div style={{ marginBottom: "0.5rem" }}>
        <h2>Your Name</h2>
        <Input
          size="large"
          placeholder="Your name"
          prefix={<UserOutlined />}
          maxLength={15}
          suffix={<small>{name.length}/15</small>}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            localStorage.setItem("name", e.target.value);
          }}
          className={classes.inputgroup}
        />

        <div className={classes.share_options}>
          <CopyToClipboard text={me}>
            <Button
              type="primary"
              icon={<CopyOutlined />}
              className={classes.btn}
              tabIndex="0"
              onClick={(event)=>{
                message.success("Code copied successfully!");
                setCallId(me);}}
            
            >
              Copy Room code
            </Button>
          </CopyToClipboard>

          <div className={classes.share_social}>
            <WhatsappShareButton
              url={`https://interviewapp-o3fbihuwj-rishuraj2401.vercel.app/`}
              title={`Join this meeting with the given code "${me}"\n`}
              separator="Link: "
              className={classes.share_icon}
            >
              <WhatsappIcon size={26} round />
            </WhatsappShareButton>
            <FacebookShareButton
              url={`https://interviewapp-o3fbihuwj-rishuraj2401.vercel.app/`}
              title={`Join this meeting with the given code "${me}"\n`}
              className={classes.share_icon}
            >
              <FacebookIcon size={26} round />
            </FacebookShareButton>
            <TwitterShareButton
              url={`https://interviewapp-o3fbihuwj-rishuraj2401.vercel.app/`}
              title={`Join this meeting with the given code  "${me}"\n`}
              className={classes.share_icon}
            >
              <TwitterIcon size={26} round className={classes.share_border} />
            </TwitterShareButton>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: "0.5rem" }}>
        <h2>Enter Room Code</h2>

        <Input
          placeholder={callId}
          size="large"
          className={classes.inputgroup}
          value={idToCall}
          onChange={(e) => {setIdToCall(e.target.value) } }
          style={{ marginRight: "0.5rem", marginBottom: "0.5rem" }}
          prefix={<UserOutlined className="site-form-item-icon" />}
          suffix={
            <Tooltip title="Enter code of the other user">
              <InfoCircleOutlined style={{ color: "rgba(0,0,0,.45)" }} />
            </Tooltip>
          }
        />

        {callAccepted && !callEnded ? (
          <Button
            variant="contained"
            onClick={leaveCall}
            className={classes.hang}
            tabIndex="0"
          >
            <img src={Hang} alt="hang up" style={{ height: "15px" }} />
            &nbsp; Leave
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<PhoneOutlined />}
            onClick={() => {
              if (name.length) {callUser(idToCall) ;}
              else message.error("Please enter your name to call!");
            }}

            // onClick={calljoin}
            // onClickCapture={calljoin}
            // onKeyUp={calljoin}
            // onKeyUpCapture={calljoin}
            className={classes.btn}
            tabIndex="0"
          >
            Join
          </Button>
         )} 
      </div>

      {call.isReceivingCall && !callAccepted && (
        <>
          <audio src={Teams} loop ref={Audio} />
          <Modal
            title="Room Invite"
            visible={isModalVisible}
            onOk={() => showModal(false)}
            onCancel={handleCancel}
            footer={null}
          >
            <div style={{ display: "flex", justifyContent: "space-around" , backgroundColor: "blue" ,}}>
              <h1>
                {call.name} is inviting to join Room:{" "}
                {/* <img
                  src={Phone}
                  alt="phone ringing"
                  className={classes.phone}
                  style={{ display: "inline-block" }}
                /> */}
              </h1>
            </div>
            <div className={classes.btnDiv}>
              <Button
                variant="contained"
                className={classes.answer}
                color="#29bb89"
                icon={<PhoneOutlined />}
                onClick={() => {
                  answerCall();
                  Audio.current.pause();
                }}
                tabIndex="0"
              >
                Accept Invite
              </Button>
              <Button
                variant="contained"
                className={classes.decline}
                icon={<PhoneOutlined />}
                onClick={() => {
                  setIsModalVisible(false);
                  Audio.current.pause();
                }}
                tabIndex="0"
              >
                Decline Invite
              </Button>
            </div>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Options;
