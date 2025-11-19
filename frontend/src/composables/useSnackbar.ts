import { ref } from 'vue'

export function useSnackbar() {
  const snackbar = ref(false)
  const snackbarText = ref('')
  const snackbarColor = ref<'success' | 'error' | 'warning' | 'info'>('success')

  const show = (text: string, color: 'success' | 'error' | 'warning' | 'info' = 'success') => {
    snackbarText.value = text
    snackbarColor.value = color
    snackbar.value = true
  }

  const showSuccess = (text: string) => show(text, 'success')
  const showError = (text: string) => show(text, 'error')
  const showWarning = (text: string) => show(text, 'warning')
  const showInfo = (text: string) => show(text, 'info')

  return {
    snackbar,
    snackbarText,
    snackbarColor,
    show,
    showSuccess,
    showError,
    showWarning,
    showInfo
  }
}

