<script lang="ts" setup>
  import { getMatched, getPhotos } from 'sdk';
  import { getAge, LookingFor, PhotoType } from 'types';
  import { ref, onMounted } from 'vue';
  import type { PotentialData } from 'types';
  import VProfileCardView from './VProfileCardView.vue';

  const userId = useRouteParams<string>('userId');
  const dataList = ref<{potentialData: PotentialData; profilePhotos: string[]; roomPhotos: string[]}[]>([]);

  onMounted(async () => {
  try {
    const mathedList = (await getMatched(userId.value)).map(async (match) => {
      if(match){
        const profilePhotos = await getPhotos(
          match.profile!.id,
          PhotoType.Profile
        );
        const roomPhotos = await getPhotos(
          match.profile!.id,
          PhotoType.Room
        ); 
      dataList.value.push({ potentialData: { profile: match.profile, room: match.room }, profilePhotos: profilePhotos, roomPhotos: roomPhotos });
      }
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
      <div v-if="data.potentialData.profile">
        <VProfileCardView
          :photos="data.profilePhotos"
          :name="data.potentialData.profile.name"
          :gender="data.potentialData.profile.gender"
          :age="getAge(data.potentialData.profile.dateofbirth)"
          :lookingFor="data.potentialData.profile.lookingFor"
          :bio="data.potentialData.profile.bio"
          :isProfile="true"
        />
      </div>
      <template v-if="data.potentialData.room">
        <VProfileCardView
          :photos="data.roomPhotos"
          :address="data.potentialData.room.address"
          :district="data.potentialData.room.district"
          :price="data.potentialData.room.price"
          :description="data.potentialData.room.description"
          :isProfile="false"
        />
      </template>
    </div>
  </div>
</template>
