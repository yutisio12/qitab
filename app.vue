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
        root: {
          style: {
            backgroundColor: '#f87171',
            borderColor: '#f87171'
          },
          onMouseenter: (e) => {
            e.target.style.backgroundColor = 'red'
            e.target.style.borderColor = 'red'
          },
          onMouseleave: (e) => {
            e.target.style.backgroundColor = '#f87171'
            e.target.style.borderColor = '#f87171'
          }
        }
      },
      pcAcceptButton: {
        root: {
          style: {
            backgroundColor: '#22c55e',
            borderColor: '#22c55e',
            color: 'white'
          },
          onMouseenter: (e) => {
            e.target.style.backgroundColor = '#16a34a'
            e.target.style.borderColor = '#16a34a'
          },
          onMouseleave: (e) => {
            e.target.style.backgroundColor = '#22c55e'
            e.target.style.borderColor = '#22c55e'
          }
        }
      },
    }"
    style="text-align: center;"
  ></ConfirmDialog>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>