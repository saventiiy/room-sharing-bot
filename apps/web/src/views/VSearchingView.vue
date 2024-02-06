<script lang="ts" setup>
  import { getPotentialUser, like } from 'sdk';
  import { Gender, LookingFor, getAge } from 'types';
  import { ref, onMounted } from 'vue';

  const userId = useRouteParams<string>('userId');
  const name = ref('');
  const age = ref(18);
  const gender = ref(Gender.Male);
  const lookingFor = ref(LookingFor.Room);
  const bio = ref('');
  const likedUserId = ref('');

  const loadUser = async () => {
    try {
      const potentialUser = await getPotentialUser(userId.value);
      console.log(potentialUser);
      if (potentialUser != undefined) {
        name.value = potentialUser.name || '';
        age.value = getAge(potentialUser.dateofbirth);
        gender.value = potentialUser.gender || Gender.Other;
        lookingFor.value = potentialUser.lookingFor || LookingFor.Room;
        bio.value = potentialUser.bio || '';
      
        likedUserId.value = potentialUser.id;
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
      await like(userId.value, likedUserId.value);
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
      <div class="media">
          <div class="media-content">
            <p class="title is-4">{{ name }}</p>
            <p class="subtitle is-6 mb-0">{{ gender }}, {{ age }} years</p>
            <p class="subtitle is-6 mb-0">{{ lookingFor }}</p>
            <p class="subtitle is-8 mn-0">{{ bio }}</p>
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