<script lang="ts" setup>
import { ref, defineProps } from 'vue';

const props = defineProps({
  photos: Array<String>
});

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
    <div class="slide" v-for="(photo, index) in photos" :key="index" :class="{ active: index === currentPhotoIndex }">
      <figure class="image is-flex is-align-items-center is-justify-content-center is-4by3">
        <img :src="photo.url" alt="Slide"/>
      </figure>
    </div>
    <div class="controls">
      <button @click="prevPhoto">&lt;</button>
      <button @click="nextPhoto">&gt;</button>
    </div>
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
