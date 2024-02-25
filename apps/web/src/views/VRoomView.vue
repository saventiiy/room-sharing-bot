<script lang="ts" setup>
  import { Districts, Room, PhotoType } from 'types';
  import { useTextareaAutosize } from '@vueuse/core';
  import { useMainButton } from '@/composables/useMainButton';
  import { type MainButtonConfig } from '@/composables/useMainButton';
  import { addRoom, saveMultiplePhotosForProfile } from 'sdk';
  import { postEvent } from '@tma.js/sdk';
  import VProfileCardView from './VProfileCardView.vue';

  const address = ref('');
  const district = ref(Districts.Bemowo);
  const price = ref(1000);
  const { textarea, input: description } = useTextareaAutosize();

  const userId = useRouteParams<string>('userId');

  const photos = ref<string[]>([]);
  const files = ref<File[]>([]);

  const isValid = computed(() => {
    return !!(
      files.value.length > 0 &&
      address.value.length > 0 &&
      description.value &&
      description.value.length > 0 &&
      district.value &&
      price.value > 0
    );
  });

  const mainButtonOptions = computed<MainButtonConfig>(() => ({
    text: address.value,
    is_active: isValid.value,
  }));

  useMainButton(mainButtonOptions, async () => {
    try {
      const room = await addRoom({
        userId: userId.value,
        room: new Room({
          id: userId.value,
          address: address.value,
          district: district.value,
          photos: [],
          description: description.value,
          price: price.value,
          likes: []
        }),
      });
      await saveMultiplePhotosForProfile(userId.value, PhotoType.Room, files.value);
      postEvent('web_app_data_send', { data: JSON.stringify(room) });
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
        <label class="label">Адрес</label>
        <div class="control">
            <input class="input" type="text" v-model="address" />
        </div>
      </div>
      <div class="field">
        <label for="districtSelect">Выберите район: </label>
        <select id="districtSelect" v-model="district" class="custom-dropdown">
            <option v-for="district in Object.values(Districts)" :key="district" :value="district">
                {{ district }}
            </option>
        </select>
      </div>
      <div class="field">
        <label class="label">Цена(zl)</label>
        <div class="control">
          <input class="input" type="text" v-model="price" />
        </div>
      </div>
      <div class="field">
        <label class="label">Добавьте фотографии комнаты</label>
        <input
        type="file"
        @change="onFileChanged($event)"
        accept="image/*"
        capture 
        multiple
        />
      </div>
      <div class="field">
        <label class="label">Описание</label>
        <div class="control">
          <textarea ref="textarea" v-model="description" class="textarea"></textarea>
        </div>
      </div>
    </div>
    <div class="block"></div>
  </div>
  <div class="footer">
    <VProfileCardView
      :photos="photos"
      :address="address"
      :district="district"
      :price="price"
      :description="description"
      :isProfile="false"
    />
    <div class="block has-text-centered">
      Вот так будет выглядеть профиль комнаты для соискателей
    </div>
  </div>
</template>

<style scoped>
.custom-dropdown {
  font-size: 16px;
}
</style>
