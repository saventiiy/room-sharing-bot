<script lang="ts" setup>
  import { getMatched } from 'sdk';
  import { Profile, Room, getAge } from 'types';
  import { ref, onMounted } from 'vue';
  import type { PotentialData } from 'types';

  const userId = useRouteParams<string>('userId');
  const dataList = ref<PotentialData[]>([]);

  onMounted(async () => {
    try {
      const potentialData = await getMatched(userId.value);
      potentialData.forEach((item) => {
        dataList.value.push(item);
      });
    } catch (err) {
      console.error(err);
    }
  });
</script>

<template>
  <div v-if="dataList.length === 0">
    <section class="hero has-text-centered">
      <div class="hero-body">
        <p class="title">У вас нет метчей</p>
      </div>
    </section>
  </div>
  <div class="container">
    <div v-for="(data, index) in dataList" :key="index" class="card m-4">
      <div v-if="data.profile">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-296x296">
                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image" />
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">{{ data.profile.name }}</p>
              <p class="subtitle is-6">{{ data.profile.gender }} {{ getAge(data.profile.dateofbirth) }}</p>
              <p class="subtitle is-6">Looking for: {{ data.profile.lookingFor }}</p>
            </div>
          </div>
          <div class="content">
            <p class="subtitle is-6"> напиши пользователю <a :href="'https://t.me/' + data.profile.username">{{ data.profile.username }}</a></p>
            <p class="subtitle is-6">{{ data.profile.bio }}</p>
          </div>
        </div>
      </div>
      <template v-if="data.room">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-296x296">
                <img src="https://bulma.io/images/placeholders/96x96.png" alt="Placeholder image" />
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">{{ data.room.address }}</p>
              <p class="subtitle is-6">{{ data.room.district }}, {{ data.room.price }} zl</p>
            </div>
          </div>
          <div class="content">
            <p class="subtitle is-6">{{ data.room.description }}</p>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
