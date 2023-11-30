import { defineStore } from 'pinia';

export const useRuntimeConfigStore = defineStore('runtimeConfig', {
    state: () => ({
        auxiliaryBorder: false,
    }),
    actions: {
        setAuxiliaryBorder(auxiliaryBorder: boolean) {
            this.auxiliaryBorder = auxiliaryBorder;
        },
    },
});
export default useRuntimeConfigStore;
