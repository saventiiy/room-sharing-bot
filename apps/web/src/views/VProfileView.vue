<script lang="ts" setup>
  import { postEvent } from '@tma.js/sdk';
  import { addProfile, saveMultiplePhotosForProfile } from 'sdk';
  import { Profile, Gender, LookingFor, PhotoType } from 'types';
  import { useTextareaAutosize } from '@vueuse/core';
  import { getTimestamp } from 'firebase-utils';
  import dayjs from 'dayjs';
  import { useMainButton } from '@/composables/useMainButton';
  import { type MainButtonConfig } from '@/composables/useMainButton';
  import VProfileCardView from './VProfileCardView.vue';

  const name = ref('');
  const age = ref(18);
  const gender = ref(Gender.Male);
  const lookingFor = ref(LookingFor.Room);
  const { textarea, input: bio } = useTextareaAutosize();
  const photos = ref<string[]>([]);
  const files = ref<File[]>([]);

  const isValid = computed(() => {
    return !!(
      files.value.length > 0 &&
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

  const userId = useRouteParams<string>('userId');
  const username = useRouteParams<string>('username');

  useMainButton(mainButtonOptions, async () => {
    try {
      const profile = await addProfile({
        userId: userId.value,
        profile: new Profile({
          id: userId.value,
          username: username.value,
          name: name.value,
          gender: gender.value,
          photos: [],
          bio: bio.value,
          dateofbirth: getTimestamp(dayjs().subtract(age.value, 'year')),
          lookingFor: lookingFor.value,
          searchingPointer: 0,
          likes: [],
          matches: [],
        }),
      });
      await saveMultiplePhotosForProfile(userId.value, PhotoType.Profile, files.value);
      postEvent('web_app_data_send', { data: JSON.stringify(profile) });
      postEvent('web_app_close');
    } catch (e) {
      console.error(e);
    }
  });
  const onFileChanged = ($event: Event) => {
    const target = $event.target as HTMLInputElement;
    if (target && target.files) {
      for (let i = 0; i < target.files.length; i++) {
        files.value.push(target.files[i]);
        photos.value.push(URL.createObjectURL(target.files[i]));
      }
    }
  };
</script>

<template>
  <section class="hero is-small has-text-centered">
    <div class="hero-body">
      <p class="title">Заполните ваш профиль</p>
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
        <label class="label">Добавьте фотографии профиля</label>
        <input
        type="file"
        @change="onFileChanged($event)"
        accept="image/*"
        capture 
        multiple
        />
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
    <VProfileCardView
      :photos="photos"
      :name="name"
      :gender="gender"
      :age="age"
      :lookingFor="lookingFor"
      :bio="bio"
      :isProfile="true"
    />
    <div class="block has-text-centered">
      Вот так будет выглядеть ваш профиль для соискателей
    </div>
  </div>
</template>