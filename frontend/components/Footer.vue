<template>
  <footer id="contacto" class="bg-gray-900 text-gray-300 py-16">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
        <!-- Logo y descripción -->
        <div class="lg:col-span-1">
          <div class="flex items-center gap-2 mb-6">
            <div class="bg-brand-orange text-white p-1.5 rounded">
              <Car :size="20" />
            </div>
            <span class="text-xl font-bold text-white">AutoRemates</span>
          </div>
          <p class="text-sm leading-relaxed mb-6 text-gray-400">
            Remate y subasta de autos online en Chile. Página de remates de autos con inspección profesional. Mejor sitio de remates de autos en Chile.
          </p>
          <div class="flex gap-4">
            <a href="https://www.instagram.com/autoremates" target="_blank" rel="noopener" class="hover:text-brand-orange transition-colors">
              <Instagram :size="20" />
            </a>
            <a href="https://www.facebook.com/autoremates" target="_blank" rel="noopener" class="hover:text-brand-orange transition-colors">
              <Facebook :size="20" />
            </a>
            <a href="https://www.youtube.com/autoremates" target="_blank" rel="noopener" class="hover:text-brand-orange transition-colors">
              <Youtube :size="20" />
            </a>
          </div>
        </div>

        <!-- Servicios: Remates por tipo y ciudad -->
        <div>
          <h4 class="text-white font-bold mb-6">Remates de Autos por Tipo</h4>
          <ul class="space-y-3 text-sm">
            <li><NuxtLink to="/remates" class="hover:text-white transition-colors">Remates de autos chocados</NuxtLink></li>
            <li><NuxtLink to="/remates" class="hover:text-white transition-colors">Remates de autos de aseguradora</NuxtLink></li>
            <li><NuxtLink to="/remates" class="hover:text-white transition-colors">Remates judiciales de autos</NuxtLink></li>
            <li><NuxtLink to="/remates" class="hover:text-white transition-colors">Remate de autos embargados</NuxtLink></li>
            <li><NuxtLink to="/remates" class="hover:text-white transition-colors">Remates de aduana autos</NuxtLink></li>
            <li><NuxtLink to="/remates" class="hover:text-white transition-colors">Remates de autos siniestrados</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Remates por Ciudad</h4>
          <ul class="space-y-3 text-sm">
            <li><NuxtLink to="/remates" class="hover:text-white transition-colors">Remates de autos Santiago</NuxtLink></li>
            <li><NuxtLink to="/remates" class="hover:text-white transition-colors">Remates de autos Concepción</NuxtLink></li>
            <li><NuxtLink to="/remates" class="hover:text-white transition-colors">Remate de autos Iquique</NuxtLink></li>
            <li><NuxtLink to="/remates" class="hover:text-white transition-colors">Remates Valparaíso</NuxtLink></li>
            <li><NuxtLink to="/remates" class="hover:text-white transition-colors">Remates La Serena</NuxtLink></li>
            <li><NuxtLink to="/remates" class="hover:text-white transition-colors">Remates Temuco</NuxtLink></li>
          </ul>
        </div>

        <!-- Recursos -->
        <div>
          <h4 class="text-white font-bold mb-6">Recursos</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="#como-funciona" class="hover:text-white transition-colors">Cómo Funciona</a></li>
            <li><NuxtLink to="/blog" class="hover:text-white transition-colors">Blog</NuxtLink></li>
            <li><a href="#faq" class="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
            <li><NuxtLink to="/registro" class="hover:text-white transition-colors">Vender mi Auto</NuxtLink></li>
            <li><NuxtLink to="/remates" class="hover:text-white transition-colors">Próximos remates de autos</NuxtLink></li>
          </ul>
        </div>

        <!-- Contacto -->
        <div>
          <h4 class="text-white font-bold mb-6">Contacto</h4>
          <ul class="space-y-4 text-sm">
            <li class="flex items-start gap-3">
              <MapPin :size="18" class="text-brand-orange mt-0.5 flex-shrink-0" />
              <span>Av. Apoquindo 4500, Las Condes, Santiago, Chile</span>
            </li>
            <li class="flex items-center gap-3">
              <Phone :size="18" class="text-brand-orange flex-shrink-0" />
              <a href="tel:+56979796841" class="hover:text-white">+56 9 7979 6841</a>
            </li>
            <li class="flex items-center gap-3">
              <Mail :size="18" class="text-brand-orange flex-shrink-0" />
              <a href="mailto:contacto@autoremates.cl" class="hover:text-white">contacto@autoremates.cl</a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
        <p>© 2026 AutoRemates Chile SpA. Todos los derechos reservados.</p>
        <div class="flex gap-6">
          <NuxtLink to="/terminos" class="hover:text-gray-300">Términos y Condiciones</NuxtLink>
          <NuxtLink to="/privacidad" class="hover:text-gray-300">Política de Privacidad</NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Car, Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-vue-next'
</script>
