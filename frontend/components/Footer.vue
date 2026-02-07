<template>
  <footer class="bg-gray-900 text-gray-300 py-16">
    <div class="container mx-auto px-4">
      <div class="grid md:grid-cols-4 gap-12 mb-12">
        
        <div class="col-span-1 md:col-span-1">
          <div class="flex items-center gap-2 mb-6">
            <div class="bg-brand-orange text-white p-1.5 rounded">
              <Car :size="20" />
            </div>
            <span class="text-xl font-bold text-white">RematAuto</span>
          </div>
          <p class="text-sm leading-relaxed mb-6 text-gray-400">
            El primer remate online de autos en Chile con inspección profesional incluida. Seguridad, rapidez y transparencia.
          </p>
          <div class="flex gap-4">
            <a href="#" class="hover:text-brand-orange transition-colors">
              <Instagram :size="20" />
            </a>
            <a href="#" class="hover:text-brand-orange transition-colors">
              <Facebook :size="20" />
            </a>
            <a href="#" class="hover:text-brand-orange transition-colors">
              <Youtube :size="20" />
            </a>
          </div>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Para Vendedores</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="#" class="hover:text-white transition-colors">Vender mi Auto</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Cómo Funciona</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Comisiones</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Preguntas Frecuentes</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Para Compradores</h4>
          <ul class="space-y-3 text-sm">
            <li><a href="#" class="hover:text-white transition-colors">Comprar en Remate</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Próximos Remates</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Inspección Pre-Compra</a></li>
            <li><a href="#" class="hover:text-white transition-colors">Paquetes de Inspección</a></li>
          </ul>
        </div>

        <div>
          <h4 class="text-white font-bold mb-6">Contacto</h4>
          <ul class="space-y-4 text-sm">
            <li class="flex items-start gap-3">
              <MapPin :size="18" class="text-brand-orange mt-0.5" />
              <span>Av. Apoquindo 4500, Las Condes,<br/>Santiago, Chile</span>
            </li>
            <li class="flex items-center gap-3">
              <Phone :size="18" class="text-brand-orange" />
              <span>+56 9 8765 4321</span>
            </li>
            <li class="flex items-center gap-3">
              <Mail :size="18" class="text-brand-orange" />
              <span>contacto@rematauto.cl</span>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© 2024 RematAuto Chile SpA. Todos los derechos reservados.</p>
        <div class="flex gap-6 mt-4 md:mt-0">
          <a href="#" class="hover:text-gray-300">Términos y Condiciones</a>
          <a href="#" class="hover:text-gray-300">Política de Privacidad</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import { Car, Instagram, Facebook, Youtube, Mail, Phone, MapPin } from 'lucide-vue-next'
</script>