<script lang="ts" setup>
  import { getPotentialUser, like, getPhotos } from 'sdk';
  import { Gender, LookingFor, getAge, Districts, PhotoType } from 'types';
  import { ref, onMounted, watch } from 'vue';
  import VSliderView from './VSliderView.vue';

  const userId = useRouteParams<string>('userId');
  const name = ref('');
  const age = ref(18);
  const gender = ref(Gender.Male);
  const lookingFor = ref(LookingFor.Room);
  const bio = ref('');
  const likedUserId = ref('');
  
  const address = ref('');
  const district = ref(Districts.Bemowo);
  const price = ref(1000);
  const description = ref('');

  const isShowProfile = ref(true);
  const isMatch = ref(false);
  const matchNotification = ref('у вас случился метч');
  const isAllProfilesShowed = ref(true);
  const allProfilesShowed = ref('Вы просмотрели все профили');

  const photos = ref<{profilePhoto: string[]; roomPhoto: string[]}>({profilePhoto: [], roomPhoto: []});

  watch(isMatch, (newValue) => {
    if (newValue) {
      setTimeout(() => {
        isMatch.value = false;
      }, 1000);
    }
  });
  
  watch(name, (newValue) => {
    if(newValue === ''){
      isAllProfilesShowed.value = true;
    } else {
      isAllProfilesShowed.value = false;
    }
  });

  const loadUser = async () => {
    try {
      const potentialData = await getPotentialUser(userId.value);
      if (potentialData.profile != undefined && potentialData.room != undefined) {
          isShowProfile.value = false;

          name.value = potentialData.profile.name || '';
          age.value = getAge(potentialData.profile.dateofbirth);
          gender.value = potentialData.profile.gender || Gender.Other;
          lookingFor.value = potentialData.profile.lookingFor || LookingFor.Room;
          bio.value = potentialData.profile.bio || '';
          
          likedUserId.value = potentialData.profile.id;

          address.value = potentialData.room.address;
          district.value = potentialData.room.district;
          price.value = potentialData.room.price;
          description.value = potentialData.room.description;

          const profilePhotos = await getPhotos(potentialData.profile.id, PhotoType.Profile);
          const roomPhotos = await getPhotos(potentialData.profile.id, PhotoType.Room);
          photos.value = { profilePhoto: profilePhotos, roomPhoto: roomPhotos };

      } else if(potentialData.profile != undefined && potentialData.room == undefined) {
          name.value = potentialData.profile.name || '';
          age.value = getAge(potentialData.profile.dateofbirth);
          gender.value = potentialData.profile.gender || Gender.Other;
          lookingFor.value = potentialData.profile.lookingFor || LookingFor.Room;
          bio.value = potentialData.profile.bio || '';
          
          isShowProfile.value = true;
          address.value = '';

          likedUserId.value = potentialData.profile.id;
          const profilePhotos = await getPhotos(potentialData.profile.id, PhotoType.Profile);
          photos.value = { profilePhoto: profilePhotos, roomPhoto: [] };
      } else {
          name.value = '';
      }
    } catch (err) {
      console.error(err);
    }
  };

  onMounted(async () => {
    await loadUser();
  });

  const likeUser = async () => {
    try {
      photos.value = { profilePhoto: [], roomPhoto: [] };

      isMatch.value = await like(userId.value, likedUserId.value);
      await loadUser();
    } catch (err) {
      console.error(err);
    }
  };

  const nextUser = async () => {
    try {
      photos.value = { profilePhoto: [], roomPhoto: [] };

      await loadUser();
    } catch (err) {
      console.error(err);
    }
  };
</script>

<template>
  <div v-if="isAllProfilesShowed">
    <section class="hero has-text-centered">
      <div class="hero-body">
        <p class="title">{{ allProfilesShowed }}</p>
      </div>
    </section>
  </div>
  <div v-else>
    <div v-if="isMatch" class="notification is-success">{{ matchNotification }}</div>
    <div class="container">
      <template v-if="address === '' || isShowProfile">
        <VSliderView
          :photos="photos.profilePhoto"
        />
      </template>
      <template v-else>
        <VSliderView
          :photos="photos.roomPhoto"
        />
      </template>
      <div class="buttons-wrapper">
        <button class="button full-height" @click="nextUser">👎</button>
        <div class="spacer">
          <div v-if="isShowProfile === false">
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
                <div class="buttons-right">
                  <button @click="isShowProfile = true">Показать профиль</button>
                </div>
              </div>
            </div>
          </div>
          <div v-else>
            <div class="card">
              <div class="card-content">
                <div class="media">
                  <div class="media-content">
                    <p class="title is-4">{{ name }}</p>
                    <p class="subtitle is-6 mn-0">{{ gender }}, {{ age }} years</p> 
                    <p class="subtitle is-6 my-0">Looking for {{ lookingFor }}</p>
                  </div>
                </div>
                <div class="content">
                  {{ bio }}
                </div>
                <div v-if="address !== ''">
                  <div class="buttons-right">
                    <button @click="isShowProfile = false">Показать комнату</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <button class="button full-height" @click="likeUser">❤️‍🔥</button>
      </div>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}
.buttons-wrapper {
  display: flex;
  align-items: center;
}
.full-height {
  min-height: 100%; 
}
.spacer {
  flex-grow: 1;
}
</style>