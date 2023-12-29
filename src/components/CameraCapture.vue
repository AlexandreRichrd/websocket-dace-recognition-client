<template>
    <div>
        <video ref="video" autoplay style="display: none;"></video>
        <canvas ref="canvasElement" style="display: none;"></canvas>
        <h1>Bonjour {{ messages[messages.length-1] }}</h1>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { useWebSocket } from '../composable/useWebSocket';

const { sendBinaryData, messages } = useWebSocket('ws://localhost:8765');

const video = ref<HTMLVideoElement | null>(null);
const canvasElement = ref<HTMLCanvasElement | null>(null);


const captureImage = () => {
        if (video.value && canvasElement.value) {
            const context = canvasElement.value.getContext('2d');
            if (context) {
                canvasElement.value.width = video.value.videoWidth;
                canvasElement.value.height = video.value.videoHeight;
                context.drawImage(video.value, 0, 0);
                // On convertit l'image en blob
                canvasElement.value.toBlob((blob) => {
                    if (blob) {
                        sendBinaryData(blob).then(() => {
                            console.log('Image sent');
                        }).catch((error) => {
                            console.error('Error sending image:', error);
                        });
                    }
                });
            }
        }
    };

onMounted(async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try{
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (video.value) {
                video.value.srcObject = stream;
                setInterval(captureImage, 2000); // Capture toutes les 2 secondes
            }
        } catch (error) {
            console.error('Error opening video camera.', error);
        }
    }
})

onUnmounted(() => {
    if(video.value && video.value.srcObject) {
        (video.value.srcObject as MediaStream).getTracks().forEach((track) => {
            track.stop();
        })
    }

})
</script>