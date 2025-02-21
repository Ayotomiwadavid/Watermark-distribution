// pages/verify-email.vue
<template>
  <div class="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
    <div class="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 class="text-center text-3xl font-extrabold text-gray-900">
        Verify your email
      </h2>
      <p class="mt-2 text-center text-sm text-gray-600">
        We've sent a verification code to
        <span class="font-medium text-blue-600">{{ email }}</span>
      </p>
    </div>

    <div class="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div class="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form class="space-y-6" @submit.prevent="verifyOTP">
          <!-- OTP Input Fields -->
          <div class="flex justify-between gap-2">
            <div v-for="i in 6" :key="i">
              <input :ref="el => otpRefs[i - 1] = el" v-model="otpDigits[i - 1]" type="text" maxlength="1"
                class="w-12 h-12 text-center text-xl font-semibold border-2 rounded-md focus:border-blue-500 focus:ring-blue-500"
                @input="handleOtpInput($event, i - 1)" @keydown="handleKeydown($event, i - 1)" @paste="handlePaste" />
            </div>
          </div>

          <!-- Error Message -->
          <div v-if="error" class="text-red-600 text-sm text-center">
            {{ error }}
          </div>

          <!-- Submit Button -->
          <div>
            <button type="submit" :disabled="isLoading || !isComplete" :class="[
              'w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white',
              isLoading || !isComplete
                ? 'bg-blue-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            ]">
              <span v-if="isLoading" class="flex items-center">
                <Icon name="lucide:loader" class="animate-spin mr-2" />
                Verifying...
              </span>
              <span v-else>Verify Email</span>
            </button>
          </div>

          <!-- Resend Code -->
          <div class="text-center">
            <p class="text-sm text-gray-600">
              Didn't receive the code?
              <button type="button" :disabled="resendTimer > 0" @click="resendCode"
                class="font-medium text-blue-600 hover:text-blue-500 disabled:text-gray-400 disabled:cursor-not-allowed">
                {{ resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend code' }}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
const email = ref('example@email.com'); // Replace with actual email from your auth state
const otpDigits = ref(Array(6).fill(''));
const otpRefs = ref([]);
const error = ref('');
const isLoading = ref(false);
const resendTimer = ref(0);

// Computed property to check if OTP is complete
const isComplete = computed(() => {
  return otpDigits.value.every(digit => digit !== '');
});

// Handle OTP input
const handleOtpInput = (event, index) => {
  const value = event.target.value;

  // Ensure only numbers are entered
  if (!/^\d*$/.test(value)) {
    otpDigits.value[index] = '';
    return;
  }

  // Move to next input if available
  if (value && index < 5) {
    otpRefs.value[index + 1]?.focus();
  }
};

// Handle backspace and arrow keys
const handleKeydown = (event, index) => {
  if (event.key === 'Backspace' && !otpDigits.value[index] && index > 0) {
    otpRefs.value[index - 1]?.focus();
  } else if (event.key === 'ArrowLeft' && index > 0) {
    otpRefs.value[index - 1]?.focus();
  } else if (event.key === 'ArrowRight' && index < 5) {
    otpRefs.value[index + 1]?.focus();
  }
};

// Handle paste event
const handlePaste = (event) => {
  event.preventDefault();
  const pastedData = event.clipboardData.getData('text');
  const numbers = pastedData.replace(/\D/g, '').slice(0, 6).split('');

  numbers.forEach((num, index) => {
    if (index < 6) {
      otpDigits.value[index] = num;
    }
  });
};

// Verify OTP
const verifyOTP = async () => {
  try {
    error.value = '';
    isLoading.value = true;
    const otp = otpDigits.value.join('');

    // Replace with your actual API call
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simulated API dela

    const email = localStorage.getItem('Email-onSignup')
    const response = await axios.post('https://watermark-distribution.onrender.com/api/user/verify-email', {
      email,
      otp
    })

    console.log(response);
    toast.success('Verified')
    navigateTo('/dashboard');
  } catch (err) {
    toast.error(err.message)
    error.value = err.message || 'Invalid verification code. Please try again.';
  } finally {
    isLoading.value = false;
  }
};

// Resend code
const resendCode = async () => {
  try {
    // Replace with your actual resend API call
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API delay

    // Start resend timer
    resendTimer.value = 60;
    const timerInterval = setInterval(() => {
      resendTimer.value--;
      if (resendTimer.value === 0) {
        clearInterval(timerInterval);
      }
    }, 1000);
  } catch (err) {
    error.value = 'Failed to resend code. Please try again.';
  }
};
</script>