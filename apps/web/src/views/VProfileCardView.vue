<script lang="ts" setup>
 import { Districts, Gender, LookingFor } from 'types';
 import VSliderView from './VSliderView.vue';

 const props = defineProps({
  photos: Array<String>,
  name: String,
  gender: Gender,
  age: String,
  lookingFor: LookingFor,
  bio: String,
  isProfile: Boolean,
  address: String,
  district: Districts,
  price: Number,
  description: String,
  username: String
 });
</script>

<template>
    <div class="block">
        <div class="card">
        <div class="card-image">
          <VSliderView
            :photos="photos"
          />
        </div>
        <template v-if="isProfile">
            <div class="card-content">
                <div class="media">
                <div class="media-content">
                    <p class="title is-4">{{ name }}</p>
                    <p class="subtitle is-6">{{ gender }}, {{ age }} years</p>
                    <p class="subtitle is-6" v-if="username"> Вы можете написать пользователю <a :href="'https://t.me/' + username">{{ username }}</a></p>
                </div>
                </div>
                <div class="content">
                <p class="subtitle is-6 my-0">Looking for {{ lookingFor }}</p>
                <template v-if="bio">{{ bio }}</template>
                <template v-else>
                    <span class="is-italic is-danger">
                    Добавьте информацию «О себе»
                    </span>
                </template>
                </div>
        </div>
        </template>
        <template v-else>
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">{{ address }} {{ district }}</p>
                    <p class="subtitle is-6 mn-0">{{ price }} zl</p> 
                  </div>
                </div>
                <div class="content">
                  {{ description }}
                </div>
              </div>
            </div>
        </template>
        </div>
    </div>
</template>

<style scoped>
.image img {
  object-fit:cover;
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