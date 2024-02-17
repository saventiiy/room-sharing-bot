<script lang="ts" setup>
  import { getMatched } from 'sdk';
  import { getAge } from 'types';
  import { ref, onMounted } from 'vue';
  import type { PotentialData } from 'types';
  import VProfileCardView from './VProfileCardView.vue';

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

  const photos = [
    { url: "https://disgustingmen.com/wp-content/uploads/2021/06/kerouac_l_min.jpeg"},
    { url: "https://avatars.mds.yandex.net/get-kinopoisk-image/1704946/871cba08-800e-4c77-8123-ab768799f680/220x330" },
    { url: "https://artifex.ru/wp-content/uploads/2020/10/%D0%94%D0%B6%D0%B5%D0%BA-%D0%9A%D0%B5%D1%80%D1%83%D0%B0%D0%BA-%D0%A4%D0%BE%D1%82%D0%BE-4.jpeg"}
  ];

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
        <VProfileCardView
          :photos="photos"
          :name="data.profile.name"
          :gender="data.profile.gender"
          :age="getAge(data.profile.dateofbirth)"
          :lookingFor="data.profile.lookingFor"
          :bio="data.profile.bio"
          :isProfile="true"
        />
      </div>
      <template v-if="data.room">
        <VProfileCardView
          :photos="photos"
          :address="data.room.address"
          :district="data.room.district"
          :price="data.room.price"
          :description="data.room.description"
          :isProfile="false"
        />
      </template>
    </div>
  </div>
</template>
