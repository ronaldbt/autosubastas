<template>
  <div class="font-sans text-gray-900 bg-white min-h-screen">
    <Header />
    <main class="pt-24 pb-16">
      <article v-if="article" class="container mx-auto px-4 max-w-3xl">
        <nav class="mb-8" aria-label="Breadcrumb">
          <NuxtLink to="/blog" class="inline-flex items-center gap-2 text-brand-orange font-semibold hover:underline">
            <ArrowLeft :size="18" />
            Volver al blog
          </NuxtLink>
        </nav>

        <header class="mb-10">
          <h1 class="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 leading-tight">
            {{ article.title }}
          </h1>
          <p v-if="article.date" class="text-sm text-gray-500 mb-4">
            Publicado el {{ formatDate(article.date) }}
          </p>
          <p v-if="article.description" class="text-xl text-gray-600 leading-relaxed">
            {{ article.description }}
          </p>
        </header>

        <div
          class="blog-article prose prose-lg prose-slate max-w-none
            prose-headings:font-extrabold prose-headings:text-gray-900 prose-headings:tracking-tight
            prose-h2:text-2xl prose-h2:mt-12 prose-h2:mb-4 prose-h2:pb-2 prose-h2:border-b prose-h2:border-gray-200
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-h3:text-brand-orange
            prose-p:leading-relaxed prose-p:mb-4 prose-p:text-gray-700
            prose-ul:my-6 prose-ul:list-disc prose-ul:pl-6 prose-li:my-2 prose-li:marker:text-brand-orange
            prose-ol:my-6 prose-ol:list-decimal prose-ol:pl-6
            prose-strong:text-gray-900 prose-strong:font-bold"
        >
          <ContentRenderer v-if="article.body" :value="article" />
          <div v-else-if="article.content" class="blog-content" v-html="article.content" />
        </div>

        <footer class="mt-12 pt-8 border-t border-gray-200">
          <NuxtLink to="/blog" class="text-brand-orange font-semibold hover:underline">
            ← Ver todos los artículos
          </NuxtLink>
        </footer>
      </article>

      <div v-else class="container mx-auto px-4 max-w-3xl text-center py-16">
        <p class="text-gray-500 mb-4">Artículo no encontrado</p>
        <NuxtLink to="/blog" class="text-brand-orange font-semibold hover:underline">Volver al blog</NuxtLink>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ArrowLeft } from 'lucide-vue-next'
import Header from '~/components/Header.vue'
import Footer from '~/components/Footer.vue'

const route = useRoute()
const path = route.path
const apiSlug = Array.isArray(route.params.slug) ? route.params.slug.join('/') : (route.params.slug || '')

const { data: articleData } = await useAsyncData(`blog-${path}`, () => {
  if (!apiSlug) return null
  return $fetch(`/api/blog/${apiSlug}`)
}, { default: () => null })
const article = computed(() => articleData.value)

const config = useRuntimeConfig()
const siteUrl = config.public.siteUrl || 'https://autoremates.cl'

function formatDate (dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
}

useSeoMeta({
  title: () => article.value?.title ? `${article.value.title} | Blog AutoRemates Chile` : 'Blog AutoRemates',
  description: () => article.value?.description || 'Artículo del blog de AutoRemates Chile. Remates y subastas de autos.',
  ogTitle: () => article.value?.title ? `${article.value.title} | AutoRemates Chile` : 'Blog AutoRemates',
  ogDescription: () => article.value?.description || '',
  ogType: 'article',
  ogUrl: () => siteUrl + route.path,
  ogImage: () => article.value?.image ? (article.value.image.startsWith('http') ? article.value.image : siteUrl + article.value.image) : siteUrl + '/subasta.png',
  ogImageAlt: () => article.value?.title ? `${article.value.title} - AutoRemates` : 'AutoRemates Chile',
  articlePublishedTime: () => article.value?.date || undefined,
  articleAuthor: () => article.value?.author || 'AutoRemates Chile',
  twitterCard: 'summary_large_image',
  twitterTitle: () => article.value?.title ? `${article.value.title} | AutoRemates` : 'Blog AutoRemates',
  twitterDescription: () => article.value?.description || '',
  twitterImage: () => article.value?.image ? (article.value.image.startsWith('http') ? article.value.image : siteUrl + article.value.image) : siteUrl + '/subasta.png'
})

useHead(() => {
  const a = article.value
  const scripts = a ? [{
    type: 'application/ld+json',
    children: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: a.title,
      description: a.description,
      image: a.image ? (a.image.startsWith('http') ? a.image : siteUrl + a.image) : siteUrl + '/subasta.png',
      datePublished: a.date,
      dateModified: a.dateModified || a.date,
      author: { '@type': 'Organization', name: a.author || 'AutoRemates Chile', url: siteUrl },
      publisher: { '@type': 'Organization', name: 'AutoRemates Chile', logo: { '@type': 'ImageObject', url: siteUrl + '/favicon-256.png' } },
      mainEntityOfPage: { '@type': 'WebPage', '@id': siteUrl + route.path }
    })
  }] : []
  return {
    link: [{ rel: 'canonical', href: siteUrl + route.path }],
    script: scripts
  }
})
</script>

<style scoped>
.blog-article :deep(h2) {
  font-size: 1.5rem;
  font-weight: 800;
  margin-top: 3rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #e5e7eb;
  color: #111827;
}
.blog-article :deep(h3) {
  font-size: 1.25rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 0.75rem;
  color: #FF6B35;
}
.blog-article :deep(ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin: 1.5rem 0;
}
.blog-article :deep(ul li) {
  margin: 0.5rem 0;
}
.blog-article :deep(ul li::marker) {
  color: #FF6B35;
}
.blog-article :deep(ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin: 1.5rem 0;
}
.blog-article :deep(ol li) {
  margin: 0.5rem 0;
}
.blog-article :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.75;
  color: #374151;
}
.blog-article :deep(strong) {
  font-weight: 700;
  color: #111827;
}
</style>
