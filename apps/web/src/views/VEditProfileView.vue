<script lang="ts" setup>
  import { postEvent } from '@tma.js/sdk';
  import { addProfile, getProfile } from 'sdk';
  import { Profile, Gender, LookingFor } from 'types';
  import { useTextareaAutosize } from '@vueuse/core';
  import { getTimestamp } from 'firebase-utils';
  import dayjs from 'dayjs';
  import { useMainButton } from '@/composables/useMainButton';
  import { type MainButtonConfig } from '@/composables/useMainButton';
  import { ref, watch, computed } from 'vue';
  import { Timestamp } from 'firebase/firestore';

  const userId = useRouteParams<string>('userId');

  const name = ref('');
  const age = ref(18);
  const gender = ref(Gender.Male);
  const lookingFor = ref(LookingFor.Room);
  const { textarea, input: bio } = useTextareaAutosize();

  //where i could move it?
  function calculateAge(birthdate: Timestamp) {
    const currentDate = new Date();
    const birthDate = birthdate.toDate();

    let age = currentDate.getFullYear() - birthDate.getFullYear();

    const birthMonth = birthDate.getMonth();
    const currentMonth = currentDate.getMonth();
    const birthDay = birthDate.getDate();
    const currentDay = currentDate.getDate();

    if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) {
      age--;
    }

    return age;
  }

  watch(userId, async (newUserId) => {
    try {
      const uProfile = await getProfile(newUserId);
      console.log(uProfile);
      name.value = uProfile?.name || '';
      age.value = calculateAge(uProfile?.dateofbirth);
      gender.value = uProfile?.gender || Gender.Other;
      lookingFor.value = uProfile?.lookingFor || LookingFor.Room;
      bio.value = uProfile?.bio || '';
    } catch (err) {
      console.error(err);
    }
  }, 
  { immediate: true });

  const isValid = computed(() => {
    return !!(
      name.value.length > 0 &&
      bio.value &&
      bio.value.length > 0 &&
      age.value > 0 &&
      gender.value &&
      lookingFor.value
    );
  });

  const mainButtonOptions = computed<MainButtonConfig>(() => ({
    text: name.value,
    is_active: isValid.value,
  }));


  useMainButton(mainButtonOptions, async () => {
    try {
        if(name.value != undefined && gender.value != undefined && lookingFor.value != undefined){
            const profile = await addProfile({
                userId: userId.value,
                profile: new Profile({
                name: name.value,
                gender: gender.value,
                photos: [],
                bio: bio.value,
                dateofbirth: getTimestamp(dayjs().subtract(age.value, 'year')),
                lookingFor: lookingFor.value
            })});
            postEvent('web_app_data_send', { data: JSON.stringify(profile) });
            postEvent('web_app_close');
        }
    } catch (e) {
      console.error(e);
    }
  });
</script>

<template>
  <section class="hero is-small has-text-centered">
    <div class="hero-body">
      <p class="title">Измените профиль</p>
    </div>
  </section>
  <div class="container is-fluid">
    <div class="block">
      <div class="field">
        <label class="label">Имя</label>
        <div class="control">
          <input class="input" type="text" v-model="name" />
        </div>
      </div>
      <div class="field">
        <label class="label">Возраст</label>
        <div class="control">
          <input class="input" type="number" v-model.number="age" />
        </div>
      </div>
      <div class="field">
        <label class="label">Пол</label>
        <div class="control">
          <label class="radio">
            <input
              type="radio"
              v-model="gender"
              :value="Gender.Male"
              name="answer" />
            Мужской
          </label>
          <label class="radio">
            <input
              type="radio"
              v-model="gender"
              :value="Gender.Female"
              name="answer" />
            Женский
          </label>
          <label class="radio">
            <input
              type="radio"
              v-model="gender"
              :value="Gender.Other"
              name="answer" />
            Другой
          </label>
        </div>
      </div>
      <div class="field">
        <label class="label">Ищу</label>
        <div class="control">
          <label class="radio">
            <input
              type="radio"
              v-model="lookingFor"
              :value="LookingFor.Room"
              name="lookingForAnswer" />
            Комнату
          </label>
          <label class="radio">
            <input
              type="radio"
              v-model="lookingFor"
              :value="LookingFor.Flatmate"
              name="lookingForAnswer" />
            Соседа
          </label>
        </div>
      </div>
      <div class="field">
        <label class="label">О себе</label>
        <div class="control">
          <textarea ref="textarea" v-model="bio" class="textarea"></textarea>
        </div>
      </div>
    </div>
    <div class="block"></div>
  </div>
  <div class="footer">
    <div class="block">
      <div class="card">
        <div class="card-content">
          <div class="media">
            <div class="media-left">
              <figure class="image is-48x48">
                <img
                  src="https://bulma.io/images/placeholders/96x96.png"
                  alt="Placeholder image" />
              </figure>
            </div>
            <div class="media-content">
              <p class="title is-4">{{ name }}</p>
              <p class="subtitle is-6">{{ gender }}, {{ age }} years</p>
            </div>
          </div>
          <div class="content">
            <template v-if="bio">{{ bio }}</template>
            <template v-else>
              <span class="is-italic is-danger">
                Добавьте информацию «О себе»
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
    <div class="block has-text-centered">
      Вот так будет выглядеть ваш профиль для соискателей
    </div>
  </div>
</template>