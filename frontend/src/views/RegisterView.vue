<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { usersApi } from '@/api/users.api'
import { useAuth } from '@/composables/useAuth'
import { useSnackbar } from '@/composables/useSnackbar'

const router = useRouter()
const { login } = useAuth()
const { snackbar, snackbarText, snackbarColor, showSuccess, showError } = useSnackbar()

const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const isFormValid = computed(() => {
  return (
    email.value.includes('@') &&
    password.value.length >= 6 &&
    password.value === confirmPassword.value
  )
})

const handleRegister = async () => {
  if (!isFormValid.value) return

  loading.value = true
  try {
    await usersApi.create({
      email: email.value,
      password: password.value
    })
    showSuccess('Usuário criado com sucesso! Fazendo login...')
    setTimeout(async () => {
      await login(email.value, password.value)
    }, 1000)
  } catch (error: any) {
    showError(error.response?.data?.message || 'Erro ao criar usuário')
  } finally {
    loading.value = false
  }
}

const goToLogin = () => {
  router.push('/login')
}
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <v-card>
          <v-card-title class="text-h5 text-center pa-4">
            Criar Conta
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleRegister">
              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                required
                :rules="[
                  (v) => !!v || 'Email é obrigatório',
                  (v) => /.+@.+\..+/.test(v) || 'Email deve ser válido'
                ]"
              />
              <v-text-field
                v-model="password"
                label="Senha"
                :type="showPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                required
                :rules="[
                  (v) => !!v || 'Senha é obrigatória',
                  (v) => (v && v.length >= 6) || 'Senha deve ter no mínimo 6 caracteres'
                ]"
              />
              <v-text-field
                v-model="confirmPassword"
                label="Confirmar Senha"
                :type="showConfirmPassword ? 'text' : 'password'"
                prepend-inner-icon="mdi-lock-check"
                :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append-inner="showConfirmPassword = !showConfirmPassword"
                variant="outlined"
                required
                :rules="[
                  (v) => !!v || 'Confirmação de senha é obrigatória',
                  (v) => v === password || 'Senhas não coincidem'
                ]"
              />
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                :disabled="!isFormValid"
                class="mt-4"
              >
                Criar Conta
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center pb-4">
            <v-btn variant="text" @click="goToLogin">
              Já tem conta? Faça login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar
      v-model="snackbar"
      :color="snackbarColor"
      timeout="3000"
      location="top"
    >
      {{ snackbarText }}
    </v-snackbar>
  </v-container>
</template>

