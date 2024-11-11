
# Local Network Video Chat Application using Next.js and NestJS

This guide demonstrates how to create a video chat application on a local network using Next.js for the front end and NestJS for the back end. The application utilizes WebRTC for peer-to-peer video communication and Socket.IO for signaling.

## Prerequisites
- **Node.js**: Ensure Node.js and npm are installed.
- **Dependencies**: Express, Socket.IO, and WebRTC will be used.

## Step 1: Set up the NestJS Server for Signaling

1. **Initialize a NestJS Project**
   ```bash
   nest new video-chat-server
   cd video-chat-server
   ```

2. **Install Dependencies**
   ```bash
   npm install @nestjs/websockets socket.io @nestjs/platform-express
   ```

3. **Create a Gateway**
   In the `src` directory, create `video.gateway.ts` to handle Socket.IO events. This gateway will manage WebRTC signaling (SDP and ICE candidates) for peers in a specific room.

   ```typescript
   import {
     SubscribeMessage,
     WebSocketGateway,
     WebSocketServer,
     OnGatewayConnection,
     OnGatewayDisconnect,
   } from '@nestjs/websockets';
   import { Server, Socket } from 'socket.io';

   @WebSocketGateway(3001, { cors: true })
   export class VideoGateway implements OnGatewayConnection, OnGatewayDisconnect {
     @WebSocketServer() server: Server;

     handleConnection(client: Socket) {
       console.log(`Client connected: ${client.id}`);
     }

     handleDisconnect(client: Socket) {
       console.log(`Client disconnected: ${client.id}`);
     }

     @SubscribeMessage('joinRoom')
     handleJoinRoom(client: Socket, room: string): void {
       client.join(room);
       client.to(room).emit('userConnected', client.id);
     }

     @SubscribeMessage('signal')
     handleSignal(client: Socket, data: { room: string; payload: any }) {
       client.to(data.room).emit('signal', data.payload);
     }
   }
   ```

4. **Register the Gateway**
   Register `VideoGateway` in `app.module.ts`.

   ```typescript
   import { Module } from '@nestjs/common';
   import { VideoGateway } from './video.gateway';

   @Module({
     providers: [VideoGateway],
   })
   export class AppModule {}
   ```

5. **Run the NestJS Server**
   ```bash
   npm run start
   ```
   This will start the signaling server on port 3001.

## Step 2: Set Up the Next.js Client

1. **Initialize a Next.js Project**
   ```bash
   npx create-next-app video-chat-client
   cd video-chat-client
   ```

2. **Install Dependencies**
   ```bash
   npm install socket.io-client
   ```

3. **Create the Video Chat UI and Client Logic**
   Add the following code in `pages/index.tsx`:

   ```typescript
   import { useEffect, useRef, useState } from 'react';
   import io from 'socket.io-client';

   const socket = io('http://localhost:3001');

   const Home = () => {
     const [isConnected, setIsConnected] = useState(false);
     const localVideoRef = useRef<HTMLVideoElement>(null);
     const remoteVideoRef = useRef<HTMLVideoElement>(null);
     const peerConnectionRef = useRef<RTCPeerConnection | null>(null);

     useEffect(() => {
       socket.emit('joinRoom', 'video-room');

       socket.on('signal', async (data) => {
         if (data.sdp) {
           await peerConnectionRef.current?.setRemoteDescription(new RTCSessionDescription(data.sdp));
           if (data.sdp.type === 'offer') {
             const answer = await peerConnectionRef.current?.createAnswer();
             await peerConnectionRef.current?.setLocalDescription(answer!);
             socket.emit('signal', { room: 'video-room', payload: { sdp: answer } });
           }
         } else if (data.candidate) {
           await peerConnectionRef.current?.addIceCandidate(new RTCIceCandidate(data.candidate));
         }
       });

       return () => {
         socket.disconnect();
       };
     }, []);

     const startCall = async () => {
       const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
       if (localVideoRef.current) {
         localVideoRef.current.srcObject = localStream;
       }

       const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
       peerConnectionRef.current = new RTCPeerConnection(configuration);

       localStream.getTracks().forEach(track => peerConnectionRef.current?.addTrack(track, localStream));

       peerConnectionRef.current.onicecandidate = (event) => {
         if (event.candidate) {
           socket.emit('signal', { room: 'video-room', payload: { candidate: event.candidate } });
         }
       };

       peerConnectionRef.current.ontrack = (event) => {
         if (remoteVideoRef.current) {
           remoteVideoRef.current.srcObject = event.streams[0];
         }
       };

       const offer = await peerConnectionRef.current.createOffer();
       await peerConnectionRef.current.setLocalDescription(offer);
       socket.emit('signal', { room: 'video-room', payload: { sdp: offer } });
     };

     return (
       <div>
         <video ref={localVideoRef} autoPlay muted style={{ width: '45%', border: '1px solid black' }} />
         <video ref={remoteVideoRef} autoPlay style={{ width: '45%', border: '1px solid black' }} />
         <button onClick={startCall} disabled={isConnected}>Start Call</button>
       </div>
     );
   };

   export default Home;
   ```

## Explanation of Key Components

1. **NestJS (Signaling Server)**: Handles signaling events between peers for SDP and ICE candidates.
2. **Next.js (Client)**: Sets up the WebRTC connection for video streaming.

## Step 3: Run and Test the Application

1. **Start the NestJS Server**
   ```bash
   cd video-chat-server
   npm run start
   ```

2. **Start the Next.js Client**
   ```bash
   cd video-chat-client
   npm run dev
   ```

3. **Testing**: Open in different browser windows or devices on the same network at `http://<server-ip>:3000`.
