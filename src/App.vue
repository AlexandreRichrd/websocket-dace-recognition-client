<template>
  <div>
    <ModaleName @hideModale="hideModale" @validate="validate" v-if="isModale"/>
    <CameraCapture />
    <h3>WebSocket Client</h3>
    
    <div v-if="isConnected">Connected</div>
    <div v-else>Disconnected</div>
    <input type="file" @change="handleFileUpload">
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useWebSocket } from './composable/useWebSocket';
import ModaleName from './components/ModaleName.vue';
import CameraCapture from './components/CameraCapture.vue';

const { isConnected, messages, sendImageWithMetadata } = useWebSocket('ws://localhost:8765');
const selectedFile = ref<File | null>(null);
const isModale = ref(false);
const name = ref('');

const hideModale = () => {
    isModale.value = false;
}

const validate = (value: string) => {
    name.value = value;
    isModale.value = false;
    if (selectedFile.value)

    sendImageWithMetadata(selectedFile.value, name.value).then(() => {
      console.log('Image sent');
      console.log(selectedFile.value);
    }).catch((error) => {
      console.error('Error sending image:', error);
    });
}

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files?.length) return;

  selectedFile.value = input.files[0];
  isModale.value = true;
}

// const handleFileUpload = (event: Event) => {
//   const input = event.target as HTMLInputElement;
//   if (!input.files?.length) return;

//   selectedFile.value = input.files[0];
//   sendBinaryData(selectedFile.value).then(() => {
//     console.log('Image sent');
//     console.log(selectedFile.value);
//   }).catch((error) => {
//     console.error('Error sending image:', error);
//   });
// }


</script>
