import { postEvent, on } from '@tma.js/sdk';

export interface MainButtonConfig {
  is_visible?: boolean;
  is_active?: boolean;
  is_progress_visible?: boolean;
  text?: string;
  color?: string;
  text_color?: string;
}

export const useMainButton = (
  config: Ref<MainButtonConfig> = toRef({}),
  callback: () => void = () => {},
) => {
  watch(
    () => config.value,
    () => {
      postEvent(
        'web_app_setup_main_button',
        Object.assign(
          {},
          { is_visible: true, is_active: true },
          { ...config.value },
        ),
      );
    },
    { immediate: true },
  );

  const removeListener = ref<ReturnType<typeof on> | undefined>(undefined);

  onMounted(() => {
    removeListener.value = on('main_button_pressed', callback);
  });

  onBeforeUnmount(() => {
    removeListener.value && removeListener.value();
  });
};
