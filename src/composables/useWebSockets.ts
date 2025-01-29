/**
 * Composable to handle using web sockets
 * @param URL URL to connect to
 * @returns Func
 */
export function useWebSockets(URL: string) {
  let socket: WebSocket;

  /**
   * Creates a web socket connections and returns a promise that resolves to the connection
   * @returns Promise that resolves to a WebSocket connection
   */
  function connect(): Promise<WebSocket> {
    socket = new WebSocket(URL);

    return new Promise<WebSocket>((resolve, reject) => {
      socket.addEventListener('open', () => {
        resolve(socket);
      });

      socket.addEventListener('error', () => {
        if (socket.readyState === WebSocket.CLOSED) {
          reject(new Error('Connection closed'));
        }

        if (socket.readyState === WebSocket.CLOSING) {
          reject(new Error('Connection closing'));
        }
      });
    });
  }

  return {
    connect,
  };
}
