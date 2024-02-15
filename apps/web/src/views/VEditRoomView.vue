<script lang="ts" setup>
  import { Districts, Room } from 'types';
  import { useTextareaAutosize } from '@vueuse/core';
  import { useMainButton } from '@/composables/useMainButton';
  import { type MainButtonConfig } from '@/composables/useMainButton';
  import { addRoom, getRoom } from 'sdk';
  import { postEvent } from '@tma.js/sdk';
  import VProfileCardView from './VProfileCardView.vue';

  const userId = useRouteParams<string>('userId');
  const address = ref('');
  const district = ref(Districts.Bemowo);
  const price = ref(1000);
  const { textarea, input: description } = useTextareaAutosize();

  onMounted(() => {
    watch(userId, async (newUserId) => {
      try {
        const roomProfile = await getRoom(newUserId);
        address.value = roomProfile?.address || '';
        district.value = roomProfile?.district || Districts.Bemowo;
        price.value = roomProfile?.price || 1000;
        description.value = roomProfile?.description || '';
      } catch (err) {
        console.error(err);
      }
    }, 
    { immediate: true });  
  });

  const isValid = computed(() => {
    return !!(
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
      postEvent('web_app_data_send', { data: JSON.stringify(room) });
      postEvent('web_app_close');
    } catch (e) {
      console.error(e);
    }
  });
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