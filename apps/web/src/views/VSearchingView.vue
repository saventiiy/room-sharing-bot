<script lang="ts" setup>
  import { getPotentialUser, like } from 'sdk';
  import { Gender, LookingFor, getAge } from 'types';
  import { ref, watch } from 'vue';

  const userId = useRouteParams<string>('userId');
  const name = ref('');
  const age = ref(18);
  const gender = ref(Gender.Male);
  const lookingFor = ref(LookingFor.Room);
  const bio = ref('')  
  const likedUserId = ref('');

  const loadUser = async () => {
    try {
        const userProfile = await getPotentialUser(userId.value);
        console.log(userProfile);
        if(userProfile != undefined){
          name.value = userProfile.name || '';
          age.value = getAge(userProfile.dateofbirth);
          gender.value = userProfile.gender || Gender.Other;
          lookingFor.value = userProfile.lookingFor || LookingFor.Room;
          bio.value = userProfile.bio || '';

          likedUserId.value = userProfile.id;
        }
      } catch (err) {
        console.error(err);
      }
  };


onMounted(() => {
  console.log('Component is mounted');
});

onUpdated(() => {
  console.log('Component is updated');
});

const nextUser = async() => {
  try {
    await like(userId.value, likedUserId.value);
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
            <p class="subtitle is-6">{{ gender }}, {{ age }} years</p>
            <p class="subtitle is-6">{{ lookingFor }}</p>
            <p class="subtitle is-8">{{ bio }}</p>
          </div>
        </div>
    </div>
    <div class="buttons-right">
      <button @click="nextUser">Лайк</button>
    </div>
  </div>
</template>

<style scoped>
.subtitle {
  margin-bottom: 0 !important;
}
</style>