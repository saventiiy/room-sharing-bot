<script lang="ts" setup>
  import { postEvent } from '@tma.js/sdk';
  import { Profile, Districts } from '../../../../packages/types/src';
  import { useTextareaAutosize } from '@vueuse/core';
  import { getTimestamp } from 'firebase-utils';
  import { useMainButton } from '@/composables/useMainButton';
  import { type MainButtonConfig } from '@/composables/useMainButton';

  const adress = ref('');
  const district = ref(Districts.Bemowo);
  const price = ref('1000');
  const { textarea, input: description } = useTextareaAutosize();

  const isValid = computed(() => {
    return !!(
      adress.value.length > 0 &&
      description.value &&
      description.value.length > 0 &&
      district.value &&
      price.value.length > 0
    );
  });

  const mainButtonOptions = computed<MainButtonConfig>(() => ({
    text: adress.value,
    is_active: isValid.value,
  }));

  const userId = useRouteParams<string>('userId');

  useMainButton(mainButtonOptions, async () => {
    try {
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
            <input class="input" type="text" v-model="adress" />
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
              <p class="title is-4">{{ adress }}</p>
              <p class="subtitle is-6">{{ district }}, {{ price }} zl</p>
            </div>
          </div>
          <div class="content">
            <template v-if="description">{{ description }}</template>
            <template v-else>
              <span class="is-italic is-danger">
                Добавьте информацию о комнате
              </span>
            </template>
          </div>
        </div>
      </div>
    </div>
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
