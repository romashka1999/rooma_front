import { io, Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io-client/build/typed-events";

const { RTCPeerConnection, RTCSessionDescription } = window;

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

class PeerConnectionSession {
  constructor(
    public readonly socket: Socket<DefaultEventsMap, DefaultEventsMap>,
    public readonly peerConnection: RTCPeerConnection
  ) {
    this.peerConnection.addEventListener("connectionstatechange", (event) => {
      console.log(this.peerConnection.connectionState);
      const str =
        "_on" + capitalizeFirstLetter(this.peerConnection.connectionState);
      const fn = (this as any)[str];
      fn && fn(event);
    });
    this.onCallMade();
  }

  isAlreadyCalling = false;
  getCalled = false;

  async callUser(to: any) {
    const offer = await this.peerConnection.createOffer();
    await this.peerConnection.setLocalDescription(
      new RTCSessionDescription(offer)
    );

    this.socket.emit("call-user", { offer, to });
  }

  joinRoomToServer(roomId: string) {
    this.socket.emit("joinRoomToServer", roomId);
  }

  onNewMemberInRoomToClient(callback: any) {
    this.socket.on("newMemberInRoomToClient", (socketId: string) => {
      callback(socketId);
    });
  }

  onCallMade() {
    this.socket.on("call-made", async (data) => {
      console.log("call-made :>> ", data);
      if (this.getCalled) {
        const confirmed = window.confirm(
          `User "Socket: ${data.socket}" wants to call you. Do accept this call?`
        );

        if (!confirmed) {
          this.socket.emit("reject-call", {
            from: data.socket,
          });

          return;
        }
      }

      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.offer)
      );
      const answer = await this.peerConnection.createAnswer();
      await this.peerConnection.setLocalDescription(
        new RTCSessionDescription(answer)
      );

      this.socket.emit("make-answer", {
        answer,
        to: data.socket,
      });
      this.getCalled = true;
    });
  }

  onAnswerMade(callback: any) {
    this.socket.on("answer-made", async (data) => {
      await this.peerConnection.setRemoteDescription(
        new RTCSessionDescription(data.answer)
      );

      if (!this.isAlreadyCalling) {
        callback(data.socket);
        this.isAlreadyCalling = true;
      }
    });
  }

  onTrack(callback: any) {
    this.peerConnection.ontrack = function ({ streams: [stream] }) {
      callback(stream);
    };
  }
}

export const createPeerConnectionContext = () => {
  const peerConnection = new RTCPeerConnection({
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  });

  const socketUrl = "http://192.168.90.28:4001/rooms";
  const socket = io(socketUrl);

  return new PeerConnectionSession(socket, peerConnection);
};
