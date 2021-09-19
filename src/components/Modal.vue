<template>
  <div class="modal-backdrop">
    <slot name="body"> </slot>
  </div>
</template>

<script>
export default {
  name: 'Modal',
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;

  align-items: center;
  z-index: 10;
}
</style>
