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
    detailHeight.value = detailsRef.value.clientHeight
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
    class="u-flex u-flex-vertical u-padding-20 u-cross-center u-gap-32 checker-background"
    :style="{ marginBottom: `${detailHeight}px` }"
  >
    <div class="connection-visual">
      <div class="outer-card">
        <div class="inner-card">
          <img :src="VueSvg" width="72" height="72" alt="Vue logo" />
        </div>
      </div>
      <div
        class="connection-line"
        :style="{ opacity: status === 'success' ? 1 : 0, transition: 'opacity 2.5s' }"
      >
        <div class="line-left"></div>
        <div
          class="u-flex u-main-center u-border-radius-circle tick-container icon-check"
          style="color: #fd366e"
        ></div>
        <div class="line-right"></div>
      </div>
      <div class="outer-card">
        <div class="inner-card">
          <img :src="AppwriteSvg" width="72" height="72" alt="Appwrite logo" />
        </div>
      </div>
    </div>

    <section
      class="u-flex u-flex-vertical u-main-center u-cross-center u-padding-16"
      style="backdrop-filter: blur(1px); height: 200px"
    >
      <div v-if="status === 'loading'" class="u-flex u-cross-center u-gap-16">
        <div class="loader is-small"></div>
        <h1 class="heading-level-7">Waiting for connection...</h1>
      </div>
      <h1 v-else class="heading-level-5">
        {{ status === 'success' ? 'Congratulations!' : 'Check connection' }}
      </h1>
      <p class="body-text-2 u-text-center">
        <span v-if="status === 'success'">You connected your app successfully.</span>
        <span v-else>Send a ping to verify the connection</span>
      </p>
      <button
        @click="sendPing"
        class="button u-margin-block-start-32"
        :style="{ visibility: status === 'loading' ? 'hidden' : 'visible' }"
      >
        <span>Send a ping</span>
      </button>
    </section>

    <nav class="u-grid">
      <ul class="u-flex u-flex-wrap u-main-center u-gap-32">
        <li class="card u-max-width-300 u-flex-vertical u-gap-8" style="--p-card-padding: 1em">
          <h2 class="heading-level-7">Edit your app</h2>
          <p class="body-text-2">
            Edit <code class="inline-code">App.vue</code> to get started with building your app
          </p>
        </li>
        <li class="card u-max-width-300" style="--p-card-padding: 1em">
          <a
            href="https://cloud.appwrite.io"
            target="_blank"
            rel="noopener noreferrer"
            class="u-flex-vertical u-gap-8"
          >
            <div class="u-flex u-main-space-between u-cross-center">
              <h2 class="heading-level-7">Head to Appwrite Cloud</h2>
              <span
                class="icon-arrow-right"
                :style="{ color: 'hsl(var(--color-neutral-15))' }"
              ></span>
            </div>
            <p class="body-text-2">Start managing your project from the Appwrite console</p>
          </a>
        </li>
        <li class="card u-max-width-300" style="--p-card-padding: 1em">
          <a
            href="https://appwrite.io/docs"
            target="_blank"
            rel="noopener noreferrer"
            class="u-flex-vertical u-gap-8"
          >
            <div class="u-flex u-main-space-between u-cross-center">
              <h2 class="heading-level-7">Explore docs</h2>
              <span
                class="icon-arrow-right"
                :style="{ color: 'hsl(var(--color-neutral-15))' }"
              ></span>
            </div>
            <p class="body-text-2">
              Discover the full power of Appwrite by diving into our documentation
            </p>
          </a>
        </li>
      </ul>
    </nav>

    <aside
      class="collapsible u-width-full-line u-position-fixed"
      style="border: 1px solid hsl(var(--color-neutral-10)); bottom: 0"
    >
      <details
        @toggle="updateHeight"
        ref="detailsRef"
        class="collapsible-wrapper u-padding-0"
        style="background-color: hsl(var(--color-neutral-0))"
        :open="showLogs"
      >
        <summary class="collapsible-button u-padding-16">
          Logs <span v-if="logs.length" class="inline-tag">{{ logs.length }}</span>
        </summary>
        <div class="collapsible-content u-flex u-flex-vertical-mobile u-cross-stretch u-padding-0">
          <div
            class="table is-table-row-medium-size u-stretch"
            :style="{ '--p-border-radius': 0, inlineSize: 'unset' }"
          >
            <div class="table-thead" :style="{ backgroundColor: 'hsl(var(--color-neutral-5))' }">
              <div class="table-row">
                <div class="table-thead-col">
                  <span class="u-color-text-offline">Project</span>
                </div>
              </div>
            </div>
            <div
              class="grid-box u-padding-16"
              :style="{
                '--grid-gap': '2rem',
                '--grid-item-size-small-screens': '10rem',
                '--grid-item-size': '10rem',
                backgroundColor: 'hsl(var(--color-neutral-0))',
              }"
            >
              <div class="u-grid u-grid-vertical u-gap-8">
                <p class="u-color-text-offline">Endpoint</p>
                <p class="body-text-2">{{ getEndpoint() }}</p>
              </div>
              <div class="u-grid u-grid-vertical u-gap-8">
                <p class="u-color-text-offline">Project ID</p>
                <p class="body-text-2">{{ getProjectId() }}</p>
              </div>
              <div class="u-grid u-grid-vertical u-gap-8">
                <p class="u-color-text-offline">Project name</p>
                <p class="body-text-2">{{ getProjectName() }}</p>
              </div>
            </div>
          </div>
          <table class="table is-table-row-small-size" :style="{ '--p-border-radius': 0, flex: 2 }">
            <thead class="table-thead" :style="{ backgroundColor: 'hsl(var(--color-neutral-5))' }">
              <tr
                class="table-row u-grid"
                :style="{ gridTemplateColumns: '3fr 2fr 2fr 2fr 5fr', minBlockSize: 'unset' }"
              >
                <template v-if="logs.length > 0">
                  <th class="table-thead-col">
                    <span class="u-color-text-offline">Date</span>
                  </th>
                  <th class="table-thead-col">
                    <span class="u-color-text-offline">Status</span>
                  </th>
                  <th class="table-thead-col">
                    <span class="u-color-text-offline">Method</span>
                  </th>
                  <th class="table-thead-col">
                    <span class="u-color-text-offline">Path</span>
                  </th>
                  <th class="table-thead-col">
                    <span class="u-color-text-offline">Response</span>
                  </th>
                </template>
                <template v-else>
                  <th class="table-thead-col" colspan="5">
                    <span class="u-color-text-offline">Logs</span>
                  </th>
                </template>
              </tr>
            </thead>

            <tbody
              class="table-tbody u-flex u-flex-vertical u-font-code u-overflow-y-auto"
              :style="{ maxHeight: '16em' }"
            >
              <template v-if="logs.length > 0">
                <tr
                  v-for="(log, index) in logs"
                  :key="index"
                  class="table-row u-grid u-height-auto"
                  :style="{ gridTemplateColumns: '3fr 2fr 2fr 2fr 5fr', minBlockSize: 'unset' }"
                >
                  <td class="table-col u-flex u-cross-center" data-title="Date">
                    <time class="text">
                      {{
                        new Date(log.date).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      }}
                    </time>
                  </td>
                  <td class="table-col u-flex u-cross-center" data-title="Status">
                    <span :class="['tag', log.status >= 400 ? 'is-warning' : 'is-success']">
                      {{ log.status }}
                    </span>
                  </td>
                  <td class="table-col u-flex u-cross-center" data-title="Method">
                    <span class="text">{{ log.method }}</span>
                  </td>
                  <td class="table-col u-flex u-cross-center" data-title="Path">
                    <span class="text">{{ log.path }}</span>
                  </td>
                  <td class="table-col u-flex u-cross-center" data-title="Response">
                    <code class="inline-code u-un-break-text u-overflow-x-auto">
                      {{ log.response }}
                    </code>
                  </td>
                </tr>
              </template>
              <template v-else>
                <tr class="table-row u-height-auto" :style="{ minBlockSize: 'unset' }">
                  <td colspan="5">
                    <p class="u-color-text-offline u-padding-16">There are no logs to show</p>
                  </td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>
      </details>
    </aside>
  </main>
</template>
