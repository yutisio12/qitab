<template>
  <Toast 
    :pt="{
      root: 'p-toast',
      message: 'p-toast-message',
      icon: 'p-toast-icon',
      summary: 'p-toast-summary',
      detail: 'p-toast-detail',
      closeButton: 'p-toast-icon-close',
      closeIcon: 'pi pi-times',
    }" 
    style="
      min-width: 25%; 
      max-width: 50%;
      background-color: white !important; 
      color: black !important;
    "
  />
  <ConfirmDialog 
    :pt="{
      root: 'p-confirm-dialog',
      header: 'p-confirm-dialog-header',
      title: 'p-confirm-dialog-title',
      icon: 'p-confirm-dialog-icon',
      content: 'p-confirm-dialog-content',
      message: 'p-confirm-dialog-message',
      footer: 'p-confirm-dialog-footer',
      mask: 'p-dialog-mask',
      pcRejectButton: {
        root: 'p-confirm-dialog-reject'
      },
      pcAcceptButton: {
        root: 'p-confirm-dialog-accept'
      },
      rejectButton: {
        root: 'p-confirm-dialog-reject'
      },
      acceptButton: {
        root: 'p-confirm-dialog-accept'
      }
    }"
    style="text-align: center;"
  ></ConfirmDialog>
  <NuxtPage />
</template>