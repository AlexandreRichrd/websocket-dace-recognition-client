<template>
    <div id="modale-bg" @click.self="hideModale">
        <div class="modale">
            <div class="title">
                <div></div><h3>Entrez le nom de la personne</h3><p @click="hideModale">X</p>
            </div>
            <div class="container">

                <input type="text" v-model="inputValue">
                <button @click="validate">Valider</button>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const inputValue = ref('');

const emit = defineEmits(['hideModale', 'validate']);

const hideModale = () => {
    emit('hideModale');
}

const validate = () => {
    emit('validate', inputValue.value);
}
</script>

<style scoped>
    #modale-bg {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        background-color: rgba(80, 80, 80, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .modale {
        width: 50%;
        height: 50%;
        background-color: rgb(148, 148, 148);
        border-radius: 10px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
    .title {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 10px;
    }
    .title div {
    }
    .title h3 {
        margin: 0;
        font-size: 2em;
    }
    .title p {
        margin: 0;
        cursor: pointer;
    }

    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 0 10px;
        height: 50%;
        gap: 30%;
    }
    input {
        width: 80%;
        height: 3rem;
        font-size: 20px;
        padding: 0 10px;
    }
</style>