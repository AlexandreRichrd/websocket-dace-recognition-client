import { ref, onMounted, onUnmounted, Ref } from 'vue';

export function useWebSocket(url: string) {
    const isConnected: Ref<boolean> = ref(false);
    const messages: Ref<string[]> = ref([]);
    let socket: WebSocket | null = null;

    function sendMessage(message: string): void {
        if (socket && isConnected.value) {
            socket.send(message);
        }
    }

    function sendBinaryData(file: Blob): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!socket || !isConnected.value) {
                reject('WebSocket is not connected.');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                if (reader.result && socket) {
                    socket.send(reader.result);
                    resolve();
                }
            };
            reader.onerror = () => reject(reader.error);
            reader.readAsArrayBuffer(file);
        });
    }

    const sendImageWithMetadata = (file: Blob, name: string): Promise<void> => {
        return new Promise((resolve, reject) => {
            if (!socket || !isConnected.value) {
                reject('WebSocket is not connected.');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const base64Image = reader.result
                const data = JSON.stringify({name, image: base64Image});
                sendMessage(data);
            };
            reader.readAsDataURL(file);
        })
    }

    onMounted(() => {
        socket = new WebSocket(url);

        socket.onopen = () => {
            isConnected.value = true;
        };

        socket.onmessage = (event: MessageEvent) => {
            messages.value.push(event.data);
        };

        socket.onclose = () => {
            isConnected.value = false;
        };

        socket.onerror = (event: Event) => {
            console.error('WebSocket error:', event);
        };
    });

    onUnmounted(() => {
        if (socket) {
            socket.close();
        }
    });

    return { isConnected, messages, sendMessage, sendBinaryData, sendImageWithMetadata };
}
