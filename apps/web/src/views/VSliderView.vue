<script lang="ts" setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
  photos: Array<String>
});

const defaultPhoto = "https://firebasestorage.googleapis.com/v0/b/roomsharebot.appspot.com/o/851550b70f917bb.png?alt=media&token=63f3de4b-dee3-4079-8f80-88a79e2f34fe"

const currentPhotoIndex = ref(0);

const nextPhoto = () => {
  currentPhotoIndex.value = (currentPhotoIndex.value + 1) % props.photos.length;
};

const prevPhoto = () => {
  currentPhotoIndex.value = (currentPhotoIndex.value - 1 + props.photos.length) % props.photos.length;
};
</script>

<template>
  <div class="slider">
    <template v-if="photos && photos.length > 0">
      <div class="slide" v-for="(photo, index) in photos" :key="index" :class="{ active: index === currentPhotoIndex }">
      <figure class="image is-flex is-align-items-center is-justify-content-center is-4by3">
        <img :src="photo" alt="Slide"/>
      </figure>
    </div>
    </template>
    <template v-else>
      <figure class="image is-flex is-align-items-center is-justify-content-center is-4by3">
        <img :src="defaultPhoto" alt="Slide"/>
      </figure>
    </template>

    <template v-if="photos!.length > 1">
      <div class="controls">
      <button @click="prevPhoto">&lt;</button>
      <button @click="nextPhoto">&gt;</button>
    </div>
    </template>
  </div>   
</template>

<style scoped>
.image img {
  object-fit: cover;
}

.slide {
  display: none;
}

.slide.active {
  display: block;
}

.controls {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
}

button {
  background-color: transparent;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
}
</style>
