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
    <div v-if="name === '' && address === ''">
    <section class="hero has-text-centered">
      <div class="hero-body">
        <p class="title">Вы просмотрели все профили</p>
      </div>
    </section>
  </div>
  <div v-else>
  <div class="container">
    <div class="buttons-wrapper">
      <button class="button full-height" @click="nextUser">С</button>
      <div class="spacer">
        <div v-if="isShowProfile === false">
      <div class="card">
        <div class="card-image">
          <figure class="image is-4by3">
            <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
          </figure>
        </div>
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
        <div class="card-image">
          <figure class="image is-4by3">
            <img src="https://bulma.io/images/placeholders/1280x960.png" alt="Placeholder image">
          </figure>
        </div>
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
      <button class="button full-height" @click="likeUser">Л</button>
    </div>

    <!-- <div class="buttons is-fullwidth mt-4">
      <button class="button is-large is-half is-responsive" @click="nextUser">Следущий</button>
      <button class="button is-large is-half is-responsive" @click="likeUser">Лайк</button>
    </div> -->
  </div>
</div>
</template>

<style>

.card {
  height: 100vh;
}

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

/* .buttons.is-fullwidth {
  display: flex;
  justify-content: space-between;
}

.buttons.is-fullwidth .button {
  width: 48%;
} */
</style>