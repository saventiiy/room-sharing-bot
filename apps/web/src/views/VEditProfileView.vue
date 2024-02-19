<script lang="ts" setup>
  import { postEvent } from '@tma.js/sdk';
  import { addProfile, getProfile, getPhotos } from 'sdk';
  import { Profile, Gender, LookingFor, getAge } from 'types';
  import { useTextareaAutosize } from '@vueuse/core';
  import { getTimestamp } from 'firebase-utils';
  import dayjs from 'dayjs';
  import { useMainButton } from '@/composables/useMainButton';
  import { type MainButtonConfig } from '@/composables/useMainButton';
  import { ref, watch, computed } from 'vue';
  import VProfileCardView from './VProfileCardView.vue';
  import { uploadFile } from 'sdk';

  const userId = useRouteParams<string>('userId');
  const username = useRouteParams<string>('username');
  const name = ref('');
  const age = ref(18);
  const gender = ref(Gender.Male);
  const lookingFor = ref(LookingFor.Room);
  const { textarea, input: bio } = useTextareaAutosize();
  const searchingPointer = ref(0);
  const likes = ref<string[]>([]);
  const matches = ref<string[]>([]);
  const photos = ref<string[]>([]);

  onMounted(() => {
    watch(
      userId,
      async (newUserId) => {
        try {
          photos.value = await getPhotos(userId.value, 'profiles');
          const userProfile = await getProfile(newUserId);
          name.value = userProfile?.name || '';
          age.value = getAge(userProfile?.dateofbirth);
          gender.value = userProfile?.gender || Gender.Other;
          lookingFor.value = userProfile?.lookingFor || LookingFor.Room;
          bio.value = userProfile?.bio || '';
          searchingPointer.value = userProfile?.searchingPointer || 0;
          likes.value = userProfile?.likes || [];
          matches.value = userProfile?.matches || [];
        } catch (err) {
          console.error(err);
        }
      },
      { immediate: true },
    );
  });

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

  const file = ref<File>();

  const saveProfile = async () => {
    try {
      if (
        name.value != undefined &&
        gender.value != undefined &&
        lookingFor.value != undefined &&
        file.value != undefined
      ) {
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
            searchingPointer: searchingPointer.value,
            likes: likes.value,
            matches: matches.value,
          }),
        });
        uploadFile(file.value, file.value?.name);
        postEvent('web_app_data_send', { data: JSON.stringify(profile) });
        postEvent('web_app_close');
      }
    } catch (e) {
      console.error(e);
    }
  };

  useMainButton(mainButtonOptions, saveProfile);

  const onFileChanged = ($event: Event) => {
    const target = $event.target as HTMLInputElement;
    if (target && target.files) {
      file.value = target.files[0];
    }
  };
</script>

<template>
  <button @click="saveProfile">Save</button>
  <section class="hero is-small has-text-centered">
    <div class="hero-body">
      <p class="title">Измените профиль</p>
    </div>
  </section>
  <div class="container is-fluid">
    <div class="block">
      <input
        type="file"
        @change="onFileChanged($event)"
        accept="image/*"
        capture />
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
    <VProfileCardView
      :photos="photos"
      :name="name"
      :gender="gender"
      :age="age"
      :lookingFor="lookingFor"
      :bio="bio"
      :isProfile="true" />
    <div class="block has-text-centered">
      Вот так будет выглядеть ваш профиль для соискателей
    </div>
  </div>
</template>
