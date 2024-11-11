
# Windows Notification System on a Local Network using TypeScript and Socket.IO

This guide provides steps to create a Windows notification system over a local network using TypeScript and Socket.IO, allowing clients on the same network to receive real-time notifications.

## Prerequisites

1. **Install Node.js**: Ensure Node.js and npm are installed.
2. **Install TypeScript and Socket.IO**:
    ```bash
    npm install typescript socket.io socket.io-client @types/node @types/socket.io
    ```
3. **Install Toast Notification Library (for Windows)**: Use `node-notifier` to display notifications on Windows.
    ```bash
    npm install node-notifier
    ```

## Step 1: Set Up the Socket.IO Server in TypeScript

1. Create a file called `server.ts` for the Socket.IO server.
2. Implement the server logic to listen for incoming connections and broadcast notifications.

```typescript
import { Server } from "socket.io";
import * as http from "http";

const server = http.createServer();
const io = new Server(server, {
  cors: {
    origin: "*", // Allow any client on the network (adjust this if needed)
  },
});

const PORT = 3000;

io.on("connection", (socket) => {
  console.log(`Client connected: ${socket.id}`);

  // Listen for incoming notification requests from clients
  socket.on("send-notification", (message: string) => {
    console.log(`Received notification: ${message}`);

    // Broadcast notification to all connected clients
    io.emit("receive-notification", message);
  });

  socket.on("disconnect", () => {
    console.log(`Client disconnected: ${socket.id}`);
  });
});

server.listen(PORT, () => {
  console.log(\`Notification server running on http://localhost:\${PORT}\`);
});
```

## Step 2: Create a Client in TypeScript to Receive Notifications

1. In another file, create `client.ts` for the client that connects to the server and displays notifications using `node-notifier`.

```typescript
import { io } from "socket.io-client";
import notifier from "node-notifier";

const SERVER_URL = "http://localhost:3000"; // Use the server's IP address if running on different machines
const socket = io(SERVER_URL);

socket.on("connect", () => {
  console.log("Connected to notification server");

  // Send a test notification message to the server
  socket.emit("send-notification", "Hello from the client!");
});

socket.on("receive-notification", (message: string) => {
  console.log(\`Notification received: \${message}\`);

  // Display the notification using Windows toast notification
  notifier.notify({
    title: "Network Notification",
    message: message,
    sound: true, // Optional: Enable sound for notifications
  });
});

socket.on("disconnect", () => {
  console.log("Disconnected from server");
});
```

## Step 3: Compile and Run

1. **Compile TypeScript**: If you haven't already, create a `tsconfig.json` file by running `npx tsc --init`, and then compile your files.

    ```bash
    npx tsc
    ```

2. **Start the Server**: Run the compiled server script.
    ```bash
    node dist/server.js
    ```

3. **Start the Client**: Run the compiled client script. If you are on multiple machines, you can deploy `client.js` on each, using the IP address of the machine running the server.

    ```bash
    node dist/client.js
    ```

## Step 4: Testing the System

- **Broadcasting Notifications**: Any client can emit a `send-notification` event, and all connected clients (including itself) will receive the notification.
- **Cross-Device Testing**: If running on different devices, ensure the server’s IP and port are accessible across the network. Adjust `SERVER_URL` in `client.ts` accordingly (e.g., `http://192.168.1.100:3000`).

## Explanation

1. **Socket.IO Server**: The server listens for clients on the local network. When it receives a `send-notification` event, it broadcasts the notification to all clients.
2. **Client Notification Display**: The client listens for the `receive-notification` event and displays the notification with `node-notifier`, triggering a Windows toast.

This approach provides a lightweight, local-network notification system with cross-device capabilities.
