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
          <p v-if="metaDescription" class="text-xl text-gray-600 leading-relaxed">
            {{ metaDescription }}
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

// Título SEO: 50–60 caracteres recomendado. Solo título del artículo, sin sufijo largo.
const metaTitle = computed(() => {
  const t = article.value?.title
  if (!t) return 'Blog AutoRemates'
  const max = 60
  return t.length > max ? t.slice(0, max - 3) + '...' : t
})

// Meta description: siempre específica del artículo, 150–160 caracteres.
const metaDescription = computed(() => {
  const d = article.value?.description
  const str = typeof d === 'string' ? d : (d && typeof d === 'object' ? String(d.value ?? d.content ?? d.text ?? '') : '')
  const fallback = article.value?.title
    ? `${article.value.title}. Guía y consejos en el blog de AutoRemates Chile.`
    : 'Artículo del blog AutoRemates Chile. Remates y subastas de autos.'
  const s = (str && str !== '[object Object]' ? str : fallback).trim()
  return s.length > 160 ? s.slice(0, 157) + '...' : s
})

function formatDate (dateStr) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return d.toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
}

useSeoMeta({
  title: () => metaTitle.value,
  description: () => metaDescription.value,
  ogTitle: () => metaTitle.value,
  ogDescription: () => metaDescription.value,
  ogType: 'article',
  ogUrl: () => siteUrl + route.path,
  ogImage: () => article.value?.image ? (article.value.image.startsWith('http') ? article.value.image : siteUrl + article.value.image) : siteUrl + '/subasta.png',
  ogImageAlt: () => article.value?.title ? `${article.value.title} - AutoRemates` : 'AutoRemates Chile',
  articlePublishedTime: () => article.value?.date || undefined,
  articleAuthor: () => article.value?.author || 'AutoRemates Chile',
  twitterCard: 'summary_large_image',
  twitterTitle: () => metaTitle.value,
  twitterDescription: () => metaDescription.value,
  twitterImage: () => article.value?.image ? (article.value.image.startsWith('http') ? article.value.image : siteUrl + article.value.image) : siteUrl + '/subasta.png'
})

useHead(() => {
  const a = article.value
  const descStr = typeof a?.description === 'string' ? a.description : metaDescription.value
  const scripts = []
  if (a) {
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: a.title,
        description: descStr,
        image: a.image ? (a.image.startsWith('http') ? a.image : siteUrl + a.image) : siteUrl + '/subasta.png',
        datePublished: a.date,
        dateModified: a.dateModified || a.date,
        author: { '@type': 'Organization', name: a.author || 'AutoRemates Chile', url: siteUrl },
        publisher: { '@type': 'Organization', name: 'AutoRemates Chile', logo: { '@type': 'ImageObject', url: siteUrl + '/favicon-256.png' } },
        mainEntityOfPage: { '@type': 'WebPage', '@id': siteUrl + route.path }
      })
    })
    scripts.push({
      type: 'application/ld+json',
      children: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio', item: siteUrl },
          { '@type': 'ListItem', position: 2, name: 'Blog', item: siteUrl + '/blog' },
          { '@type': 'ListItem', position: 3, name: a.title, item: siteUrl + route.path }
        ]
      })
    })
  }
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
