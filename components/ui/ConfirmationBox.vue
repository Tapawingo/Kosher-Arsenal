<template>
  <UModal class="arsenal-modal" v-model="confirmationBoxData._isOpen.value">
    <div class="arsenal-modal-body">
      <UFormGroup :label="confirmationBoxData._title.value">
        <p>{{ confirmationBoxData._description.value }}</p>
      </UFormGroup>
      <div class="button-group">
        <UButton :label="confirmationBoxData._cancelLabel.value" color="red" @click="confirmationBoxData._cancel()"/>
        <UButton :label="confirmationBoxData._submitLabel.value" @click="confirmationBoxData._submit()" />
      </div>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
  const confirmationBoxData = useConfirmationBox();
</script>