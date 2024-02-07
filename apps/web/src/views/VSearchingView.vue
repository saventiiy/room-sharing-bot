<script lang="ts" setup>
  import { getPotentialUser, like } from 'sdk';
  import { Gender, LookingFor, getAge, Districts } from 'types';
  import { ref, onMounted } from 'vue';

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

  const loadUser = async () => {
    try {
      const potentialData = await getPotentialUser(userId.value);
      console.log(potentialData);

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
      } else if(potentialData.profile != undefined && potentialData.room == undefined) {
          name.value = potentialData.profile.name || '';
          age.value = getAge(potentialData.profile.dateofbirth);
          gender.value = potentialData.profile.gender || Gender.Other;
          lookingFor.value = potentialData.profile.lookingFor || LookingFor.Room;
          bio.value = potentialData.profile.bio || '';
          
          likedUserId.value = potentialData.profile.id;
      }
    } catch (err) {
      console.error(err);
    }
  };

  onMounted(() => {
    loadUser();
  });

  const likeUser = async () => {
    try {
      isMatch.value = await like(userId.value, likedUserId.value);
      loadUser();
    } catch (err) {
      console.error(err);
    }
  };

  const nextUser = async () => {
    try {
      loadUser();
    } catch (err) {
      console.error(err);
    }
  };
</script>

<template>
  <div class="container is-fluid has-text-centered">
    <div class="card-content">
      <div v-if="isMatch">
        <p class="title is-4">Поздравляю это метч {{ isMatch }}</p>
      </div>
        <div v-if="isShowProfile === false">
          <div class="media">
            <div class="media-content">
              <p class="title is-4">{{ address }}, {{ district }}</p>
              <p class="subtitle is-6 mn-0">{{ price }} zl</p>
              <p class="subtitle is-6 mn-0">{{ description }}</p>
              <div class="buttons-right">
                <button @click="isShowProfile = true">Показать профиль</button>
              </div>
            </div>
          </div>
        </div>
        <div v-else>
          <div class="media">
            <div class="media-content">
              <p class="title is-4">{{ name }}</p>
              <p class="subtitle is-6 mb-0">{{ gender }}, {{ age }} years</p>
              <p class="subtitle is-6 mb-0">{{ lookingFor }}</p>
              <p class="subtitle is-8 mn-0">{{ bio }}</p>
              <div v-if="address !== ''">
                <div class="buttons-right">
                <button @click="isShowProfile = false">Показать комнату</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="buttons-right">
      <button @click="likeUser">Лайк</button>
    </div>
    <div class="buttons-left">
      <button @click="nextUser">Следущий</button>
    </div>
  </div>
</template>