<template>
  <div class="font-sans text-gray-900 bg-white min-h-screen">
    <Header />
    <main class="pt-24 pb-16">
      <div class="container mx-auto px-4">
        <div class="mb-12">
          <h1 class="text-4xl font-extrabold text-gray-900 mb-4">Blog AutoRemates</h1>
          <p class="text-xl text-gray-600 max-w-3xl">
            Guías, consejos y todo lo que necesitas saber sobre remates de autos, subastas y cómo vender o comprar tu vehículo en Chile.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink
            v-for="post in posts"
            :key="post.path || post._path"
            :to="getPostPath(post)"
            class="bg-white rounded-xl overflow-hidden shadow hover:shadow-lg transition-all border border-gray-100 group block"
          >
            <div class="h-48 bg-gray-100 overflow-hidden">
              <img
                v-if="post.image"
                :src="post.image.startsWith('http') ? post.image : (post.image.startsWith('/') ? siteUrl + post.image : post.image)"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div v-else class="w-full h-full bg-gradient-to-br from-brand-orange/10 to-orange-100 flex items-center justify-center">
                <span class="text-4xl text-brand-orange/30 font-bold">AR</span>
              </div>
            </div>
            <div class="p-6">
              <span class="text-xs font-bold text-brand-orange uppercase mb-2 block">Blog</span>
              <h2 class="text-xl font-bold mb-2 group-hover:text-brand-orange transition-colors">
                {{ post.title || post.path }}
              </h2>
              <p class="text-gray-500 text-sm line-clamp-2">{{ post.description || '' }}</p>
              <span class="text-brand-orange font-semibold text-sm mt-4 inline-block group-hover:underline">Leer más →</span>
            </div>
          </NuxtLink>
        </div>

        <div v-if="posts.length === 0" class="text-center py-16 text-gray-500">
          <p>No hay artículos publicados aún.</p>
          <NuxtLink to="/" class="text-brand-orange font-semibold mt-4 inline-block">Volver al inicio</NuxtLink>
        </div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

const { data: postsData } = await useAsyncData('blog-list', () => {
  return $fetch('/api/blog')
}, { default: () => [] })
const posts = computed(() => postsData.value ?? [])

function getPostPath (post) {
  const p = (post.path || post._path || '').toString()
  return p || '/blog'
}
const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://autoremates.cl'

useSeoMeta({
  title: 'Blog | AutoRemates Chile - Guías sobre remates de autos',
  description: 'Guías y consejos sobre remates de autos, subastas, cómo vender y comprar vehículos en Chile. AutoRemates.',
  ogUrl: siteUrl + '/blog'
})
</script>
