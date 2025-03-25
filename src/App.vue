<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { client, getEndpoint, getProjectId, getProjectName } from '@/lib/appwrite'
import { AppwriteException } from 'appwrite'
import AppwriteSvg from '@/assets/appwrite.svg'
import VueSvg from '@/assets/vue.svg'

const detailHeight = ref(0)
const logs = ref([])
const status = ref('idle')
const showLogs = ref(false)
const detailsRef = ref(null)

const updateHeight = () => {
  if (detailsRef.value) {
    requestAnimationFrame(() => {
      detailHeight.value = detailsRef.value.clientHeight
    })
  }
}

onMounted(() => {
  updateHeight()
  window.addEventListener('resize', updateHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateHeight)
})

const sendPing = async () => {
  if (status.value === 'loading') return
  status.value = 'loading'
  try {
    const result = await client.ping()
    logs.value.unshift({
      date: new Date(),
      method: 'GET',
      path: '/v1/ping',
      status: 200,
      response: JSON.stringify(result),
    })
    status.value = 'success'
  } catch (err) {
    logs.value.unshift({
      date: new Date(),
      method: 'GET',
      path: '/v1/ping',
      status: err instanceof AppwriteException ? err.code : 500,
      response: err instanceof AppwriteException ? err.message : 'Something went wrong',
    })
    status.value = 'error'
  }
  showLogs.value = true
  await nextTick()
  updateHeight()
}
</script>

<template>
  <main
    class="checker-background flex flex-col items-center p-5"
    :style="{ marginBottom: `${detailHeight}px` }"
  >
    <div class="mt-25 flex w-full max-w-[40em] items-center justify-center lg:mt-34">
      <div
        class="rounded-[25%] border border-[#19191C0A] bg-[#F9F9FA] p-3 shadow-[0px_9.36px_9.36px_0px_hsla(0,0%,0%,0.04)]"
      >
        <div
          class="rounded-[25%] border border-[#FAFAFB] bg-white p-5 shadow-[0px_2px_12px_0px_hsla(0,0%,0%,0.03)] lg:p-9"
        >
          <img alt="Vue logo" :src="VueSvg" class="h-14 w-14" width="{56}" height="{56}" />
        </div>
      </div>
      <div
        :style="{ opacity: status === 'success' ? 1 : 0 }"
        class="flex w-38 items-center transition-opacity duration-2500"
      >
        <div
          class="to-[rgba(253, 54, 110, 0.15)] h-[1px] flex-1 bg-gradient-to-l from-[#f02e65]"
        ></div>
        <div
          class="icon-check flex h-5 w-5 items-center justify-center rounded-full border border-[#FD366E52] bg-[#FD366E14] text-[#FD366E]"
        ></div>
        <div
          class="to-[rgba(253, 54, 110, 0.15)] h-[1px] flex-1 bg-gradient-to-r from-[#f02e65]"
        ></div>
      </div>

      <div
        class="rounded-[25%] border border-[#19191C0A] bg-[#F9F9FA] p-3 shadow-[0px_9.36px_9.36px_0px_hsla(0,0%,0%,0.04)]"
      >
        <div
          class="rounded-[25%] border border-[#FAFAFB] bg-white p-5 shadow-[0px_2px_12px_0px_hsla(0,0%,0%,0.03)] lg:p-9"
        >
          <img
            alt="Appwrite logo"
            :src="AppwriteSvg"
            class="h-14 w-14"
            width="{56}"
            height="{56}"
          />
        </div>
      </div>
    </div>

    <section class="mt-12 flex h-52 flex-col items-center">
      <div v-if="status === 'loading'">
        <div class="flex flex-row gap-4">
          <div role="status">
            <svg
              aria-hidden="true"
              class="h-5 w-5 animate-spin fill-[#FD366E] text-gray-200 dark:text-gray-600"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span class="sr-only">Loading...</span>
          </div>
          <span>Waiting for connection...</span>
        </div>
      </div>
      <div v-if="status === 'success'">
        <h1 class="text-2xl font-light text-[#2D2D31]">Congratulations!</h1>
      </div>
      <div v-if="status !== 'success' && status !== 'loading'">
        <h1 class="font-[Poppins, arial, sans-serf] text-2xl font-light text-[#2D2D31]">
          Check connection
        </h1>
      </div>
      <p class="mt-2 mb-8">
        <span v-if="status === 'success'">You connected your app successfully.</span>
        <span v-if="status === 'error' || status === 'idle'"
          >Send a ping to verify the connection</span
        >
      </p>

      <button
        @click="sendPing"
        class="cursor-pointer rounded-md bg-[#FD366E] px-2.5 py-1.5"
        :style="{ visibility: status === 'loading' ? 'hidden' : 'visible' }"
      >
        <span class="text-white">Send a ping</span>
      </button>
    </section>

    <div class="grid grid-rows-3 gap-7 lg:grid-cols-3 lg:grid-rows-none">
      <div class="flex h-full w-72 flex-col gap-2 rounded-md border border-[#EDEDF0] bg-white p-4">
        <h2 class="text-xl font-light text-[#2D2D31]">Edit your app</h2>
        <p>
          Edit
          <code class="rounded-sm bg-[#EDEDF0] p-1">app/page.js</code> to get started with building
          your app.
        </p>
      </div>
      <a href="https://cloud.appwrite.io" target="_blank" rel="noopener noreferrer">
        <div
          class="flex h-full w-72 flex-col gap-2 rounded-md border border-[#EDEDF0] bg-white p-4"
        >
          <div class="flex flex-row items-center justify-between">
            <h2 class="text-xl font-light text-[#2D2D31]">Go to console</h2>
            <span class="icon-arrow-right text-[#D8D8DB]"></span>
          </div>
          <p>Navigate to the console to control and oversee the Appwrite services.</p>
        </div>
      </a>

      <a href="https://appwrite.io/docs" target="_blank" rel="noopener noreferrer">
        <div
          class="flex h-full w-72 flex-col gap-2 rounded-md border border-[#EDEDF0] bg-white p-4"
        >
          <div class="flex flex-row items-center justify-between">
            <h2 class="text-xl font-light text-[#2D2D31]">Explore docs</h2>
            <span class="icon-arrow-right text-[#D8D8DB]"></span>
          </div>
          <p>Discover the full power of Appwrite by diving into our documentation.</p>
        </div>
      </a>
    </div>

    <aside class="fixed bottom-0 flex w-full cursor-pointer border-t border-[#EDEDF0] bg-white">
      <details :open="showLogs" ref="detailsRef" class="w-full">
        <summary
          class="flex w-full flex-row justify-between p-4 marker:content-none"
          @click="updateHeight"
        >
          <div class="flex gap-2">
            <span class="font-semibold">Logs</span>
            <div v-if="logs.length > 0" class="flex items-center rounded-md bg-[#E6E6E6] px-2">
              <span class="font-semibold">{{ logs.length }}</span>
            </div>
          </div>
          <div class="icon">
            <span class="icon-cheveron-down" aria-hidden="true"></span>
          </div>
        </summary>
        <div class="flex w-full flex-col lg:flex-row">
          <div class="flex flex-col border-r border-[#EDEDF0]">
            <div class="border-y border-[#EDEDF0] bg-[#FAFAFB] px-4 py-2 text-[#97979B]">
              Project
            </div>
            <div class="grid grid-cols-2 gap-4 p-4">
              <div class="flex flex-col">
                <span class="text-[#97979B]">Endpoint</span>
                <span class="truncate">{{ getEndpoint() }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[#97979B]">Project-ID</span>
                <span class="truncate">{{ getProjectId() }}</span>
              </div>
              <div class="flex flex-col">
                <span class="text-[#97979B]">Project name</span>
                <span class="truncate">{{ getProjectName() }}</span>
              </div>
            </div>
          </div>
          <div class="flex-grow">
            <table class="w-full">
              <thead>
                <tr class="border-y border-[#EDEDF0] bg-[#FAFAFB] text-[#97979B]">
                  <template v-if="logs.length > 0">
                    <td class="w-52 py-2 pl-4">Date</td>
                    <td>Status</td>
                    <td>Method</td>
                    <td class="hidden lg:table-cell">Path</td>
                    <td class="hidden lg:table-cell">Response</td>
                  </template>
                  <template v-else>
                    <td class="py-2 pl-4">Logs</td>
                  </template>
                </tr>
              </thead>
              <tbody>
                <template v-if="logs.length > 0">
                  <tr v-for="log in logs" :key="log.date">
                    <td class="py-2 pl-4 font-[Fira_Code]">
                      {{
                        new Date(log.date).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: 'numeric',
                          hour12: true,
                        })
                      }}
                    </td>
                    <td>
                      <div
                        :class="
                          log.status > 400
                            ? 'bg-[#FF453A3D] text-[#B31212]'
                            : 'bg-[#10B9813D] text-[#0A714F]'
                        "
                        class="w-fit rounded-sm px-1"
                      >
                        {{ log.status }}
                      </div>
                    </td>
                    <td>{{ log.method }}</td>
                    <td class="hidden lg:table-cell">{{ log.path }}</td>
                    <td class="hidden font-[Fira_Code] lg:table-cell">
                      {{ log.response }}
                    </td>
                  </tr>
                </template>
                <template v-else>
                  <tr>
                    <td class="py-2 pl-4 font-[Fira_Code]">There are no logs to show</td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </aside>
  </main>
</template>
