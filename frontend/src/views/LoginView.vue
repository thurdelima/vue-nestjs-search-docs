<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { login, snackbar, snackbarText, snackbarColor } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)

const isFormValid = computed(() => {
  return email.value.includes('@') && password.value.length >= 6
})

const handleLogin = async () => {
  if (!isFormValid.value) return

  loading.value = true
  try {
    await login(email.value, password.value)
  } catch (error) {
    // Error já tratado no composable
  } finally {
    loading.value = false
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4" lg="3">
        <v-card>
          <v-card-title class="text-h5 text-center pa-4">
            Search Docs
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="handleLogin">
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
              <v-btn
                type="submit"
                color="primary"
                block
                size="large"
                :loading="loading"
                :disabled="!isFormValid"
                class="mt-4"
              >
                Entrar
              </v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions class="justify-center pb-4">
            <v-btn variant="text" @click="goToRegister">
              Não tem conta? Registre-se
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

