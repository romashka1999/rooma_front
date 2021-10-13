import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/ui/Button";
import { createPeerConnectionContext } from "../utils/peer-video-connection";

const senders = [];

declare global {
  interface Document {
    mozCancelFullScreen?: () => Promise<void>;
    msExitFullscreen?: () => Promise<void>;
    webkitExitFullscreen?: () => Promise<void>;
    mozFullScreenElement?: Element;
    msFullscreenElement?: Element;
    webkitFullscreenElement?: Element;
  }

  interface HTMLElement {
    msRequestFullscreen?: () => Promise<void>;
    mozRequestFullscreen?: () => Promise<void>;
    webkitRequestFullscreen?: () => Promise<void>;
  }
}

const peerVideoConnection = createPeerConnectionContext();

const Room = () => {
  const { roomId } = useParams<{ roomId: string }>();

  // const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
  const [userMediaStream, setUserMediaStream] = useState(null);
  // const [displayMediaStream, setDisplayMediaStream] = useState(null);
  // const [startTimer, setStartTimer] = useState(false);
  // const [isFullScreen, setFullScreen] = useState(false);

  const localVideo = useRef<any>(null);
  const remoteVideo = useRef<any>(null);
  const mainRef = useRef<HTMLElement | any>(null);

  useEffect(() => {
    const createMediaStream = async () => {
      if (!userMediaStream) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { min: 200, ideal: 1920 },
            height: { min: 200, ideal: 1080 },
            aspectRatio: { ideal: 1.7777777778 },
          },
          audio: true,
        });

        console.log(`stream`, stream);

        if (localVideo) {
          console.log("localVideo chaseta");
          localVideo.current.srcObject = stream;
        }

        stream.getTracks().forEach((track) => {
          senders.push(
            peerVideoConnection.peerConnection.addTrack(track, stream)
          );
        });

        setUserMediaStream(stream as any);
      }
    };

    createMediaStream();
  }, [userMediaStream]);

  useEffect(() => {
    peerVideoConnection.joinRoomToServer(roomId);

    peerVideoConnection.onNewMemberInRoomToClient((newSocketId: string) => {
      console.log(`newSocketId`, newSocketId);
      // setConnectedUsers((val: string[]) => {
      //   return [...val, newSocketId];
      // });
      peerVideoConnection.onCallMade();
    });

    peerVideoConnection.onAnswerMade((socket: any) =>
      peerVideoConnection.callUser(socket)
    );

    peerVideoConnection.onTrack((stream: any) => {
      console.log(`remoteVideoStream`, stream);
      remoteVideo.current.srcObject = stream;
    });
  }, []);

  // function fullScreen() {
  //   setFullScreen(true);
  //   const elem = mainRef.current;
  //   if (elem === null) return;
  //   if (elem.requestFullscreen) {
  //     elem.requestFullscreen();
  //   } else if (elem.msRequestFullscreen) {
  //     elem.msRequestFullscreen();
  //   } else if (elem.mozRequestFullScreen) {
  //     elem.mozRequestFullScreen();
  //   } else if (elem.webkitRequestFullscreen) {
  //     elem.webkitRequestFullscreen();
  //   }
  // }

  // function cancelFullScreen() {
  //   if (document.exitFullscreen) {
  //     document.exitFullscreen();
  //   } else if (document.mozCancelFullScreen) {
  //     document.mozCancelFullScreen();
  //   } else if (document.webkitExitFullscreen) {
  //     document.webkitExitFullscreen();
  //   } else if (document.msExitFullscreen) {
  //     document.msExitFullscreen();
  //   }
  // }

  // function handleFullScreen(isFullScreen: boolean) {
  //   setFullScreen(isFullScreen);
  //   if (isFullScreen) {
  //     fullScreen();
  //   } else {
  //     cancelFullScreen();
  //   }
  // }

  return (
    <main ref={mainRef} className="w-full bg-gray-600">
      <Button
        text={"call user"}
        onClick={() => peerVideoConnection.callUser(1)}
      />
      <div className="flex flex-col sm:flex-row bg-red-400">
        <video ref={remoteVideo} autoPlay className="sm:w-1/2 w-full" />
        <video ref={localVideo} autoPlay muted className="sm:w-1/2 w-full" />
      </div>
    </main>
  );
};

export default Room;
