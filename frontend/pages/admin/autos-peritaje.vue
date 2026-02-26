<template>
  <div>
    <div class="mb-6">
      <div class="flex items-center space-x-4 mb-4">
        <button
          @click="navigateTo('/admin/autos')"
          class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft :size="24" class="text-gray-600" />
        </button>
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Peritaje del Auto</h1>
          <p class="text-gray-600 mt-2">Realiza el peritaje técnico del vehículo</p>
        </div>
      </div>
      <div v-if="autoInfo" class="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p class="text-sm text-blue-800">
          <span class="font-semibold">Vehículo:</span> {{ autoInfo.marca }} {{ autoInfo.modelo }} {{ autoInfo.anio }} - 
          <span class="font-semibold">Patente:</span> {{ autoInfo.patente || 'Sin patente' }}
        </p>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-8 bg-white rounded-lg shadow p-6">
      <!-- INFORMACIÓN GENERAL -->
      <div class="bg-gradient-to-r from-slate-50 to-slate-100 p-8 border-b border-slate-200 rounded-lg">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Información del Vehículo</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Patente *</label>
            <input 
              v-model="form.patente" 
              placeholder="Ej: ABC123" 
              required 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Marca</label>
            <input 
              v-model="form.marca" 
              placeholder="Ej: Toyota" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Modelo</label>
            <input 
              v-model="form.modelo" 
              placeholder="Ej: Corolla" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Color</label>
            <input 
              v-model="form.color" 
              placeholder="Ej: Blanco" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Propietario</label>
            <input 
              v-model="form.propietario" 
              placeholder="Nombre del propietario" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Cliente</label>
            <input 
              v-model="form.cliente" 
              placeholder="Nombre del cliente" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Teléfono</label>
            <input 
              v-model="form.telefono" 
              placeholder="+56 9 1234 5678" 
              type="tel"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Email</label>
            <input 
              v-model="form.email" 
              placeholder="cliente@email.com" 
              type="email"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Fecha del Peritaje</label>
            <input 
              v-model="form.fecha" 
              type="date" 
              :max="new Date().toISOString().split('T')[0]"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Número de Motor</label>
            <input 
              v-model="form.numeroMotor" 
              placeholder="Número de motor" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Número de Chasis</label>
            <input 
              v-model="form.numeroChasis" 
              placeholder="Número de chasis" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Número Serial</label>
            <input 
              v-model="form.numeroSerial" 
              placeholder="Número serial" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Tipo de Transporte</label>
            <select 
              v-model="form.tipoTransporte" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900"
            >
              <option value="">Seleccione</option>
              <option value="AUTOMOVIL">Automóvil</option>
              <option value="CAMIONETA">Camioneta</option>
              <option value="SUV">SUV</option>
              <option value="MOTOCICLETA">Motocicleta</option>
              <option value="CAMION">Camión</option>
              <option value="BUS">Bus</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">RUT Propietario</label>
            <input 
              v-model="form.propietarioRut" 
              placeholder="Ej: 12345678-9" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Año</label>
            <input 
              v-model.number="form.anio" 
              type="number" 
              placeholder="Ej: 2021" 
              min="1900"
              :max="new Date().getFullYear() + 1"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Procedencia</label>
            <input 
              v-model="form.procedencia" 
              placeholder="Ej: MEXICO" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Fabricante</label>
            <input 
              v-model="form.fabricante" 
              placeholder="Ej: NISSAN TRUCK & CHEVROLET CITY EXPRESS" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Tipo de Sello</label>
            <input 
              v-model="form.tipoSello" 
              placeholder="Ej: SELLO VERDE" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Combustible</label>
            <select 
              v-model="form.combustible" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900"
            >
              <option value="">Seleccione</option>
              <option value="DIESEL">Diesel</option>
              <option value="GASOLINA">Gasolina</option>
              <option value="ELECTRICO">Eléctrico</option>
              <option value="HIBRIDO">Híbrido</option>
              <option value="GAS">Gas</option>
            </select>
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Kilometraje</label>
            <input 
              v-model.number="form.kilometraje" 
              type="number" 
              placeholder="Ej: 82969" 
              min="0"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Valor Avalúo ($)</label>
            <input 
              v-model.number="form.valorAvaluo" 
              type="number" 
              placeholder="0" 
              min="0"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
        </div>
        
        <!-- Información de Revisión Técnica y Gases -->
        <div class="mt-8 p-6 bg-white rounded-xl border border-slate-200">
          <h3 class="text-xl font-bold text-slate-800 mb-6">Revisión Técnica y Gases</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Revisión Técnica -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-blue-700 border-b border-blue-200 pb-2">Revisión Técnica</h4>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Comuna</label>
                <input 
                  v-model="form.revisionTecnica_comuna" 
                  placeholder="Ej: HUECHURABA" 
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Mes</label>
                <input 
                  v-model="form.revisionTecnica_mes" 
                  placeholder="Ej: OCTUBRE" 
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Último Control</label>
                <input 
                  v-model="form.revisionTecnica_ultimoControl" 
                  type="date"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Estado</label>
                <select 
                  v-model="form.revisionTecnica_estado" 
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900"
                >
                  <option value="">Seleccione</option>
                  <option value="APROBADA">Aprobada</option>
                  <option value="RECHAZADA">Rechazada</option>
                  <option value="PENDIENTE">Pendiente</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Fecha Vencimiento</label>
                <input 
                  v-model="form.revisionTecnica_fechaVencimiento" 
                  type="date"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
            </div>
            
            <!-- Gases -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-green-700 border-b border-green-200 pb-2">Gases</h4>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Comuna</label>
                <input 
                  v-model="form.gases_comuna" 
                  placeholder="Ej: HUECHURABA" 
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Mes</label>
                <input 
                  v-model="form.gases_mes" 
                  placeholder="Ej: OCTUBRE" 
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Último Control</label>
                <input 
                  v-model="form.gases_ultimoControl" 
                  type="date"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Estado</label>
                <select 
                  v-model="form.gases_estado" 
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900"
                >
                  <option value="">Seleccione</option>
                  <option value="APROBADA">Aprobada</option>
                  <option value="RECHAZADA">Rechazada</option>
                  <option value="PENDIENTE">Pendiente</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Fecha Vencimiento</label>
                <input 
                  v-model="form.gases_fechaVencimiento" 
                  type="date"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Permiso de Circulación, SOAP, Transporte Público y Restricciones -->
        <div class="mt-8 p-6 bg-white rounded-xl border border-slate-200">
          <h3 class="text-xl font-bold text-slate-800 mb-6">Permisos, Seguros y Restricciones</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Permiso de Circulación -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-purple-700 border-b border-purple-200 pb-2">Permiso de Circulación</h4>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Información</label>
                <textarea 
                  v-model="form.permisoCirculacion_info" 
                  placeholder="Información sobre el permiso de circulación" 
                  rows="3"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                ></textarea>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Fecha Vencimiento</label>
                <input 
                  v-model="form.permisoCirculacion_fechaVencimiento" 
                  type="date"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
            </div>
            
            <!-- SOAP -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-orange-700 border-b border-orange-200 pb-2">SOAP (Seguro Obligatorio)</h4>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Estado</label>
                <select 
                  v-model="form.soap_estado" 
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900"
                >
                  <option value="">Seleccione</option>
                  <option value="VIGENTE">Vigente</option>
                  <option value="VENCIDO">Vencido</option>
                  <option value="NO_APLICA">No Aplica</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Compañía</label>
                <input 
                  v-model="form.soap_compania" 
                  placeholder="Ej: SEGUROS GENERALES SURAMERICANA S.A." 
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Fecha Inicio</label>
                <input 
                  v-model="form.soap_fechaInicio" 
                  type="date"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Fecha Vencimiento</label>
                <input 
                  v-model="form.soap_fechaVencimiento" 
                  type="date"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
            </div>
            
            <!-- Transporte Público -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-indigo-700 border-b border-indigo-200 pb-2">Transporte Público</h4>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Transporte Público</label>
                <select 
                  v-model="form.transportePublico" 
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900"
                >
                  <option value="">Seleccione</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Tipo Transporte Público</label>
                <input 
                  v-model="form.tipoTransportePublico" 
                  placeholder="Ej: NO APLICA" 
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
            </div>
            
            <!-- Restricción Vehicular -->
            <div class="space-y-4">
              <h4 class="text-lg font-semibold text-red-700 border-b border-red-200 pb-2">Restricción Vehicular</h4>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Condición</label>
                <select 
                  v-model="form.restriccionVehicular_condicion" 
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900"
                >
                  <option value="">Seleccione</option>
                  <option value="SI">Sí</option>
                  <option value="NO">No</option>
                </select>
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Comunas Puente Alto y San Bernardo</label>
                <input 
                  v-model="form.restriccionVehicular_comunasPuenteAltoSanBernardo" 
                  placeholder="Ej: NO APLICA" 
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Provincia de Santiago</label>
                <input 
                  v-model="form.restriccionVehicular_provinciaSantiago" 
                  placeholder="Ej: NO APLICA" 
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
            </div>
          </div>
        </div>
        
        <!-- Reportes y Multas -->
        <div class="mt-8 p-6 bg-white rounded-xl border border-slate-200">
          <h3 class="text-xl font-bold text-slate-800 mb-6">Reportes y Multas</h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">Reporte de Robo</label>
              <textarea 
                v-model="form.reporte_robo" 
                placeholder="Información sobre reporte de robo del vehículo" 
                rows="4"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
              ></textarea>
            </div>
            
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">Reporte de Remate</label>
              <textarea 
                v-model="form.reporte_remate" 
                placeholder="Información sobre reporte de remate del vehículo" 
                rows="4"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
              ></textarea>
            </div>
            
            <div class="space-y-2">
              <label class="block text-sm font-semibold text-slate-700">Multas</label>
              <textarea 
                v-model="form.multas" 
                placeholder="Información sobre multas del vehículo" 
                rows="4"
                class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
              ></textarea>
            </div>
          </div>
        </div>
        
        <!-- Uploader de fotos para Información del Vehículo -->
        <div class="mt-6 p-4 bg-white rounded-xl border-2 border-dashed border-blue-200">
          <label class="block text-sm font-semibold text-slate-700 mb-3">Fotografías de Información del Vehículo</label>
          <input
            type="file"
            :ref="el => sectionFileInputs['informacionVehiculo'] = el"
            @change="handleSectionFileSelect('informacionVehiculo', $event)"
            accept="image/*"
            multiple
            class="hidden"
          />
          <button
            type="button"
            @click="sectionFileInputs['informacionVehiculo']?.click()"
            class="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium mb-3"
          >
            + Agregar Fotos (máximo 10)
          </button>
          <div v-if="imagenesPorSeccion.informacionVehiculo.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <div
              v-for="(image, index) in imagenesPorSeccion.informacionVehiculo"
              :key="index"
              class="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group"
            >
              <img :src="typeof image === 'string' ? image : (image.preview || image.url || image)" :alt="`Foto ${index + 1}`" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="removeSectionImage('informacionVehiculo', index)"
                class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SISTEMA DE FRENOS -->
      <div class="bg-gradient-to-r from-red-50 to-red-100 p-8 border-b border-red-200 rounded-lg">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-red-500 to-red-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Sistema de Frenos</h2>
        </div>
        
        <!-- Imagen de referencia del sistema de frenos -->
        <div class="mb-6 flex justify-center">
          <img 
            src="/frenos_peritaje.webp" 
            alt="Diagrama del Sistema de Frenos" 
            class="max-w-full h-auto rounded-lg shadow-md border-2 border-red-200"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Eficacia Delantera (%)</label>
            <input 
              v-model.number="form.frenos_eficacia_delantera" 
              type="number" 
              min="0" 
              max="100" 
              step="0.01"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Eficacia Trasera (%)</label>
            <input 
              v-model.number="form.frenos_eficacia_trasera" 
              type="number" 
              min="0" 
              max="100" 
              step="0.01"
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Estado General</label>
            <select 
              v-model="form.frenos_estado_general" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900"
            >
              <option value="">Seleccione</option>
              <option value="BUENO">Bueno</option>
              <option value="REGULAR">Regular</option>
              <option value="MALO">Malo</option>
            </select>
          </div>
        </div>
        
        <!-- Uploader de fotos para Sistema de Frenos -->
        <div class="mt-6 p-4 bg-white rounded-xl border-2 border-dashed border-red-200">
          <label class="block text-sm font-semibold text-slate-700 mb-3">Fotografías del Sistema de Frenos</label>
          <input
            type="file"
            :ref="el => sectionFileInputs['sistemaFrenos'] = el"
            @change="handleSectionFileSelect('sistemaFrenos', $event)"
            accept="image/*"
            multiple
            class="hidden"
          />
          <button
            type="button"
            @click="sectionFileInputs['sistemaFrenos']?.click()"
            class="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium mb-3"
          >
            + Agregar Fotos (máximo 10)
          </button>
          <div v-if="imagenesPorSeccion.sistemaFrenos.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <div
              v-for="(image, index) in imagenesPorSeccion.sistemaFrenos"
              :key="index"
              class="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group"
            >
              <img :src="typeof image === 'string' ? image : (image.preview || image.url || image)" :alt="`Foto ${index + 1}`" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="removeSectionImage('sistemaFrenos', index)"
                class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- SISTEMA DE SUSPENSIÓN -->
      <div class="bg-gradient-to-r from-green-50 to-green-100 p-8 border-b border-green-200 rounded-lg">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Sistema de Suspensión</h2>
        </div>
        
        <!-- Imagen de referencia del sistema de suspensión -->
        <div class="mb-6 flex justify-center">
          <img 
            src="/suspension_peritaje.webp" 
            alt="Diagrama del Sistema de Suspensión" 
            class="max-w-full h-auto rounded-lg shadow-md border-2 border-green-200"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Delantera Izquierda</label>
            <input 
              v-model.number="form.suspension_delantera_izquierda" 
              type="number" 
              placeholder="0" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Delantera Derecha</label>
            <input 
              v-model.number="form.suspension_delantera_derecha" 
              type="number" 
              placeholder="0" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Trasera Izquierda</label>
            <input 
              v-model.number="form.suspension_trasera_izquierda" 
              type="number" 
              placeholder="0" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Trasera Derecha</label>
            <input 
              v-model.number="form.suspension_trasera_derecha" 
              type="number" 
              placeholder="0" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Diferencia Delantera</label>
            <input 
              v-model.number="form.suspension_diferencia_delantera" 
              type="number" 
              placeholder="0" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Diferencia Trasera</label>
            <input 
              v-model.number="form.suspension_diferencia_trasera" 
              type="number" 
              placeholder="0" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
            />
          </div>
          
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700">Estado General</label>
            <select 
              v-model="form.suspension_estado_general" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900"
            >
              <option value="">Seleccionar estado</option>
              <option value="BUENO">Bueno</option>
              <option value="REGULAR">Regular</option>
              <option value="MALO">Malo</option>
            </select>
          </div>
        </div>
        
        <!-- Uploader de fotos para Sistema de Suspensión -->
        <div class="mt-6 p-4 bg-white rounded-xl border-2 border-dashed border-green-200">
          <label class="block text-sm font-semibold text-slate-700 mb-3">Fotografías del Sistema de Suspensión</label>
          <input
            type="file"
            :ref="el => sectionFileInputs['sistemaSuspension'] = el"
            @change="handleSectionFileSelect('sistemaSuspension', $event)"
            accept="image/*"
            multiple
            class="hidden"
          />
          <button
            type="button"
            @click="sectionFileInputs['sistemaSuspension']?.click()"
            class="px-4 py-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium mb-3"
          >
            + Agregar Fotos (máximo 10)
          </button>
          <div v-if="imagenesPorSeccion.sistemaSuspension.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <div
              v-for="(image, index) in imagenesPorSeccion.sistemaSuspension"
              :key="index"
              class="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group"
            >
              <img :src="typeof image === 'string' ? image : (image.preview || image.url || image)" :alt="`Foto ${index + 1}`" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="removeSectionImage('sistemaSuspension', index)"
                class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CARROCERÍA -->
      <div class="bg-gradient-to-br from-purple-50 via-white to-purple-50 p-8 rounded-2xl shadow-xl border border-purple-100">
        <div class="flex items-center space-x-3 mb-8">
          <div class="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-300">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <div>
            <h2 class="text-3xl font-bold text-slate-800">Inspección de Carrocería</h2>
            <p class="text-sm text-slate-600 mt-1">Seleccione las áreas del vehículo y asigne su estado correspondiente</p>
          </div>
        </div>

        <!-- Vistas Esquemáticas del Auto -->
        <!-- Imagen Interactiva de Carrocería con Números Arrastrables -->
        <div class="mt-8 bg-white rounded-xl p-6 shadow-lg border border-slate-200">
          <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center">
            <div class="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mr-2">
              <span class="text-white text-sm font-bold">#</span>
            </div>
            Leyenda de Estados
          </h3>
          <p class="text-sm text-slate-600 mb-4">Arrastra los números (1-24) sobre la imagen para marcar las áreas del vehículo según su estado</p>
          
          <!-- Selector de Números -->
          <div class="mb-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
            <label class="block text-sm font-semibold text-slate-700 mb-2">Selecciona un número para colocar:</label>
            <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              <button
                v-for="(estado, index) in estadosCarroceria"
                :key="index + 1"
                type="button"
                @click.stop="selectedNumber = index + 1"
                :class="[
                  'estado-item flex items-center space-x-2 p-2 rounded-lg transition-all duration-200 cursor-pointer border border-slate-200 transform hover:scale-105',
                  selectedNumber === index + 1
                    ? 'bg-purple-50 border-purple-300 ring-2 ring-purple-400 shadow-md'
                    : 'bg-white hover:bg-slate-50'
                ]"
              >
                <div 
                  class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 shadow-md border-2 border-white"
                  :style="{ backgroundColor: estado.color }"
                >
                  {{ index + 1 }}
                </div>
                <span class="text-xs font-medium text-slate-700">{{ estado.label }}</span>
              </button>
            </div>
            <p class="text-xs text-slate-500 mt-3">
              Número seleccionado: <span class="font-bold">{{ selectedNumber ? `${selectedNumber} - ${estadosCarroceria[selectedNumber - 1]?.label || 'Ninguno'}` : 'Ninguno' }}</span>
            </p>
          </div>

          <!-- Contenedor de la Imagen con Números -->
          <div class="relative bg-slate-100 rounded-xl p-4 border-2 border-dashed border-slate-300">
            <div
              ref="imageContainer"
              class="relative mx-auto"
              @drop="handleDrop"
              @dragover.prevent
              @click.stop="handleImageClick"
            >
              <img
                src="/carroceria_peritaje.png"
                alt="Diagrama de Carrocería"
                class="max-w-full h-auto rounded-lg shadow-lg"
                @load="handleImageLoad"
              />
              
              <!-- Números colocados sobre la imagen -->
              <div
                v-for="(num, index) in carroceriaNumeros"
                :key="index"
                :style="{
                  position: 'absolute',
                  left: `${num.x}%`,
                  top: `${num.y}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'move',
                  zIndex: 10
                }"
                class="numero-marcador"
                draggable="true"
                @dragstart="handleDragStart($event, index)"
                @drag="handleDrag($event, index)"
                @dragend="handleDragEnd($event, index)"
                @mousedown="startDragging(index, $event)"
                @click.stop
              >
                <div
                  :style="{
                    backgroundColor: getEstadoColor(num.numero),
                    color: 'white',
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    border: '3px solid white'
                  }"
                >
                  {{ num.numero }}
                </div>
                <button
                  @click.stop="removeNumero(index)"
                  class="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  style="font-size: 10px;"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tablas Detalladas de Partes -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Tabla 1 -->
          <div class="bg-white rounded-xl p-6 shadow-lg border border-slate-200 transform hover:scale-[1.02] transition-all duration-300">
            <h3 class="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-purple-300">Partes Externas I</h3>
            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div 
                v-for="(value, key) in partesTabla1" 
                :key="key"
                class="p-3 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
                :class="{'ring-2 ring-purple-500 bg-purple-50': form.carroceria[key] && form.carroceria[key] !== ''}"
              >
                <label class="block text-sm font-semibold text-slate-700 mb-2 capitalize">{{ key.replaceAll('_', ' ') }}</label>
                <select 
                  v-model="form.carroceria[key]" 
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-sm text-slate-900"
                >
                  <option value="">Seleccionar</option>
                  <option v-for="estado in estadosCarroceria" :key="estado.value" :value="estado.value">
                    {{ estado.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Tabla 2 -->
          <div class="bg-white rounded-xl p-6 shadow-lg border border-slate-200 transform hover:scale-[1.02] transition-all duration-300">
            <h3 class="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-purple-300">Partes Externas II</h3>
            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div 
                v-for="(value, key) in partesTabla2" 
                :key="key"
                class="p-3 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
                :class="{'ring-2 ring-purple-500 bg-purple-50': form.carroceria[key] && form.carroceria[key] !== ''}"
              >
                <label class="block text-sm font-semibold text-slate-700 mb-2 capitalize">{{ key.replaceAll('_', ' ') }}</label>
                <select 
                  v-model="form.carroceria[key]" 
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-sm text-slate-900"
                >
                  <option value="">Seleccionar</option>
                  <option v-for="estado in estadosCarroceria" :key="estado.value" :value="estado.value">
                    {{ estado.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>

          <!-- Tabla 3 -->
          <div class="bg-white rounded-xl p-6 shadow-lg border border-slate-200 transform hover:scale-[1.02] transition-all duration-300">
            <h3 class="text-lg font-bold text-slate-800 mb-4 pb-2 border-b-2 border-purple-300">Partes Externas III</h3>
            <div class="space-y-3 max-h-96 overflow-y-auto">
              <div 
                v-for="(value, key) in partesTabla3" 
                :key="key"
                class="p-3 rounded-lg border border-slate-200 hover:border-purple-400 hover:bg-purple-50 transition-all duration-200"
                :class="{'ring-2 ring-purple-500 bg-purple-50': form.carroceria[key] && form.carroceria[key] !== ''}"
              >
                <label class="block text-sm font-semibold text-slate-700 mb-2 capitalize">{{ key.replaceAll('_', ' ') }}</label>
                <select 
                  v-model="form.carroceria[key]" 
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white text-sm text-slate-900"
                >
                  <option value="">Seleccionar</option>
                  <option v-for="estado in estadosCarroceria" :key="estado.value" :value="estado.value">
                    {{ estado.label }}
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Uploader de fotos para Inspección de Carrocería -->
        <div class="mt-6 p-4 bg-white rounded-xl border-2 border-dashed border-purple-200">
          <label class="block text-sm font-semibold text-slate-700 mb-3">Fotografías de Inspección de Carrocería</label>
          <input
            type="file"
            :ref="el => sectionFileInputs['inspeccionCarroceria'] = el"
            @change="handleSectionFileSelect('inspeccionCarroceria', $event)"
            accept="image/*"
            multiple
            class="hidden"
          />
          <button
            type="button"
            @click="sectionFileInputs['inspeccionCarroceria']?.click()"
            class="px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors text-sm font-medium mb-3"
          >
            + Agregar Fotos (máximo 10)
          </button>
          <div v-if="imagenesPorSeccion.inspeccionCarroceria.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <div
              v-for="(image, index) in imagenesPorSeccion.inspeccionCarroceria"
              :key="index"
              class="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group"
            >
              <img :src="typeof image === 'string' ? image : (image.preview || image.url || image)" :alt="`Foto ${index + 1}`" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="removeSectionImage('inspeccionCarroceria', index)"
                class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- CHASIS -->
      <div class="bg-gradient-to-r from-slate-50 to-slate-100 p-8 border-t border-slate-200 rounded-lg">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Inspección de Chasis</h2>
        </div>
        
        <!-- Imagen de referencia del chasis -->
        <div class="mb-6 flex justify-center">
          <img 
            src="/chasis_peritaje.webp" 
            alt="Diagrama del Chasis" 
            class="max-w-full h-auto rounded-lg shadow-md border-2 border-orange-200"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="(value, key) in form.chasis" :key="key" class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700 capitalize">{{ key.replaceAll('_', ' ') }}</label>
            <select 
              v-model="form.chasis[key]" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900"
            >
              <option value="">Seleccionar estado</option>
              <option value="BUENO">Bueno</option>
              <option value="GOLPEADO">Golpeado</option>
              <option value="DEFORMADO">Deformado</option>
              <option value="ALTERADO">Alterado</option>
            </select>
          </div>
        </div>
        
        <!-- Uploader de fotos para Chasis -->
        <div class="mt-6 p-4 bg-white rounded-xl border-2 border-dashed border-orange-200">
          <label class="block text-sm font-semibold text-slate-700 mb-3">Fotografías del Chasis</label>
          <input
            type="file"
            :ref="el => sectionFileInputs['chasis'] = el"
            @change="handleSectionFileSelect('chasis', $event)"
            accept="image/*"
            multiple
            class="hidden"
          />
          <button
            type="button"
            @click="sectionFileInputs['chasis']?.click()"
            class="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 transition-colors text-sm font-medium mb-3"
          >
            + Agregar Fotos (máximo 10)
          </button>
          <div v-if="imagenesPorSeccion.chasis.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <div
              v-for="(image, index) in imagenesPorSeccion.chasis"
              :key="index"
              class="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group"
            >
              <img :src="typeof image === 'string' ? image : (image.preview || image.url || image)" :alt="`Foto ${index + 1}`" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="removeSectionImage('chasis', index)"
                class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- LLANTAS -->
      <div class="p-8">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Estado de Neumáticos</h2>
        </div>
        
        <!-- Imagen de referencia de neumáticos -->
        <div class="mb-6 flex justify-center">
          <img 
            src="/neumaticos_peritaje.webp" 
            alt="Diagrama de Neumáticos" 
            class="max-w-full h-auto rounded-lg shadow-md border-2 border-indigo-200"
          />
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div v-for="(llanta, key) in form.llantas" :key="key" class="bg-gradient-to-r from-slate-50 to-slate-100 p-6 rounded-xl border border-slate-200 relative">
            <h3 class="font-bold text-lg text-slate-800 mb-4 capitalize flex items-center justify-between">
              <div class="flex items-center">
                <div class="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center mr-3">
                  <span class="text-white text-sm font-bold">{{ key.split('_')[0].charAt(0) }}</span>
                </div>
                {{ key.replace('_', ' ') }}
              </div>
              <!-- Indicador de Estado -->
              <div v-if="getEstadoNeumatico(llanta)" 
                   :class="getEstadoNeumatico(llanta).color" 
                   class="px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1"
                   :title="getEstadoNeumatico(llanta).descripcion">
                <span class="w-2 h-2 rounded-full" :class="getEstadoNeumatico(llanta).dotColor"></span>
                {{ getEstadoNeumatico(llanta).texto }}
              </div>
            </h3>
            
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Marca</label>
                <input 
                  v-model="form.llantas[key].marca" 
                  placeholder="Ej: Bridgestone" 
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
              
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Medida</label>
                <input 
                  v-model="form.llantas[key].medida" 
                  placeholder="Ej: 205/55R16" 
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
              </div>
              
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Profundidad (mm)</label>
                <input 
                  v-model.number="form.llantas[key].profundidad" 
                  type="number" 
                  placeholder="0" 
                  min="0"
                  step="0.1"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
                <p v-if="form.llantas[key].profundidad" class="text-xs text-slate-500 mt-1">
                  {{ getDescripcionProfundidad(form.llantas[key].profundidad) }}
                </p>
              </div>
              
              <div class="space-y-2">
                <label class="block text-sm font-semibold text-slate-700">Año Fabricación</label>
                <input 
                  v-model.number="form.llantas[key].anioFabricacion" 
                  type="number" 
                  placeholder="Ej: 2023" 
                  :min="2000"
                  :max="new Date().getFullYear()"
                  class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900" 
                />
                <p v-if="form.llantas[key].anioFabricacion && getEdadNeumatico(form.llantas[key].anioFabricacion) >= 5" 
                   class="text-xs text-red-600 font-semibold mt-1">
                  ⚠️ Vencido ({{ getEdadNeumatico(form.llantas[key].anioFabricacion) }} años)
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Uploader de fotos para Llantas -->
        <div class="mt-6 p-4 bg-white rounded-xl border-2 border-dashed border-indigo-200">
          <label class="block text-sm font-semibold text-slate-700 mb-3">Fotografías de los Neumáticos</label>
          <input
            type="file"
            :ref="el => sectionFileInputs['llantas'] = el"
            @change="handleSectionFileSelect('llantas', $event)"
            accept="image/*"
            multiple
            class="hidden"
          />
          <button
            type="button"
            @click="sectionFileInputs['llantas']?.click()"
            class="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors text-sm font-medium mb-3"
          >
            + Agregar Fotos (máximo 10)
          </button>
          <div v-if="imagenesPorSeccion.llantas.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <div
              v-for="(image, index) in imagenesPorSeccion.llantas"
              :key="index"
              class="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group"
            >
              <img :src="typeof image === 'string' ? image : (image.preview || image.url || image)" :alt="`Foto ${index + 1}`" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="removeSectionImage('llantas', index)"
                class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- INSPECCIÓN DE MOTOR -->
      <div class="bg-gradient-to-r from-amber-50 to-amber-100 p-8 border-b border-amber-200 rounded-lg">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Inspección de Motor</h2>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          <div v-for="(value, key) in form.motor" :key="key" class="space-y-2">
            <label class="block text-sm font-semibold text-slate-700 capitalize">{{ key.replaceAll('_', ' ') }}</label>
            <select 
              v-model="form.motor[key]" 
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900"
            >
              <option value="">Seleccionar estado</option>
              <option value="BUENO">Bueno</option>
              <option value="REGULAR">Regular</option>
              <option value="MALO">Malo</option>
              <option value="REQUIERE_REPARACION">Requiere Reparación</option>
              <option value="NO_FUNCIONAL">No Funcional</option>
            </select>
          </div>
        </div>

        <!-- Escaneo de Errores OBD-II -->
        <div class="mt-6 p-6 bg-white rounded-xl border-2 border-amber-200">
          <label class="block text-sm font-semibold text-slate-700 mb-3">Resultados Escáner Motor / Escaneo de Errores (OBD-II)</label>
          <textarea 
            v-model="form.escanerMotor"
            placeholder="Ingrese los códigos de error encontrados (ej: P0301, P0420, etc.) o los resultados del escaneo..."
            rows="4"
            class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm text-slate-900 resize-none"
          ></textarea>
          <p class="text-xs text-slate-500 mt-2">Ingrese los códigos de error OBD-II separados por comas o describa los resultados del escaneo</p>
        </div>

        <!-- Uploader de fotos para Motor -->
        <div class="mt-6 p-4 bg-white rounded-xl border-2 border-dashed border-amber-200">
          <label class="block text-sm font-semibold text-slate-700 mb-3">Fotografías del Motor</label>
          <input
            type="file"
            :ref="el => sectionFileInputs['motor'] = el"
            @change="handleSectionFileSelect('motor', $event)"
            accept="image/*"
            multiple
            class="hidden"
          />
          <button
            type="button"
            @click="sectionFileInputs['motor']?.click()"
            class="px-4 py-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium mb-3"
          >
            + Agregar Fotos (máximo 10)
          </button>
          <div v-if="imagenesPorSeccion.motor && imagenesPorSeccion.motor.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <div
              v-for="(image, index) in imagenesPorSeccion.motor"
              :key="index"
              class="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group"
            >
              <img :src="typeof image === 'string' ? image : (image.preview || image.url || image)" :alt="`Foto ${index + 1}`" class="w-full h-full object-cover" />
              <button
                type="button"
                @click="removeSectionImage('motor', index)"
                class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- IMÁGENES DEL PERITAJE -->
      <div class="p-8">
        <div class="flex items-center space-x-3 mb-6">
          <div class="w-10 h-10 bg-gradient-to-r from-pink-500 to-pink-600 rounded-xl flex items-center justify-center">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-slate-800">Fotografías del Peritaje</h2>
        </div>
        
        <div class="space-y-4">
          <input
            type="file"
            ref="fileInput"
            @change="handleFileSelect"
            accept="image/*"
            multiple
            class="hidden"
          />
          <button
            type="button"
            @click="$refs.fileInput.click()"
            class="px-4 py-2 border-2 border-dashed border-slate-300 rounded-xl hover:border-orange-500 transition-colors text-slate-600"
          >
            + Agregar Fotografías (máximo 20)
          </button>
          
          <div v-if="selectedImages.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="(image, index) in selectedImages"
              :key="index"
              class="relative aspect-video bg-gray-200 rounded-lg overflow-hidden group"
            >
              <img
                :src="typeof image === 'string' ? image : (image.preview || image.url || image)"
                :alt="`Foto ${index + 1}`"
                class="w-full h-full object-cover"
              />
              <button
                type="button"
                @click="removeImage(index)"
                class="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- OBSERVACIONES Y PRECIO -->
      <div class="bg-gradient-to-r from-slate-50 to-slate-100 p-8 border-t border-slate-200 rounded-lg">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 class="text-2xl font-bold text-slate-800 mb-4">Observaciones Generales</h2>
            <textarea 
              v-model="form.observaciones_generales" 
              rows="6" 
              placeholder="Ingrese observaciones adicionales sobre el estado del vehículo..."
              class="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 bg-white shadow-sm resize-none text-slate-900"
            ></textarea>
          </div>

        </div>
      </div>

      <!-- BOTÓN DE ENVÍO -->
      <div class="p-8 bg-white border-t border-slate-200 rounded-lg">
        <div v-if="pdfError" class="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
          {{ pdfError }}
        </div>
        <div class="flex items-center justify-between">
          <div class="text-sm text-slate-500">
            <p>Al enviar este formulario, confirma que ha realizado una inspección completa y precisa del vehículo.</p>
          </div>
          
          <div class="flex items-center gap-3">
            <button 
              type="button"
              @click="previewPDF"
              :disabled="isDownloadingPDF"
              class="inline-flex items-center px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              <svg v-if="isDownloadingPDF" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              {{ isDownloadingPDF ? 'Generando...' : 'Vista Previa PDF' }}
            </button>
            
            <button 
              type="button"
              @click="downloadPDF"
              :disabled="isDownloadingPDF"
              class="inline-flex items-center px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              <svg v-if="isDownloadingPDF" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              {{ isDownloadingPDF ? 'Generando PDF...' : 'Descargar PDF' }}
            </button>
            
            <button 
              type="submit" 
              :disabled="isLoading"
              class="inline-flex items-center px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-slate-400 disabled:to-slate-500 text-white font-bold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 disabled:transform-none disabled:cursor-not-allowed"
            >
              <svg v-if="isLoading" class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <svg v-else class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ isLoading ? 'Guardando...' : 'Guardar Peritaje y Asociar al Auto' }}
            </button>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, navigateTo } from 'nuxt/app'
import { useAuth } from '~/composables/useAuth'
import { ArrowLeft } from 'lucide-vue-next'
import jsPDF from 'jspdf'
import { PDF_LAYOUT, IMAGENES_PDF } from '~/utils/peritajePdfConstants'
import { loadImageFromUrl, imageToDataUrl } from '~/utils/peritajePdfUtils'
import { usePeritajePdfPreload } from '~/composables/usePeritajePdfPreload'

definePageMeta({
  layout: 'dashboard',
  middleware: ['auth', 'role'],
  allowedRoles: ['admin', 'superadmin', 'perito']
})

const route = useRoute()
const { getAuthHeaders } = useAuth()
const config = useRuntimeConfig()
const API_BASE = config.public.apiBase || 'http://localhost:5000/api'

const preload = usePeritajePdfPreload()
onMounted(() => { preload.load() })

const isLoading = ref(false)
const isDownloadingPDF = ref(false)
const pdfError = ref(null)
const selectedImages = ref([])
const fileInput = ref(null)
const autoInfo = ref(null)
const autoId = ref(null)
const peritajeId = ref(null) // ID del peritaje existente si se está editando
const selectedEstado = ref(null)
const selectedNumber = ref(null) // Número seleccionado para colocar (1-24)
const carroceriaNumeros = ref([]) // Array de números colocados: [{numero: 1, x: 50, y: 30}, ...]
const imageContainer = ref(null)
const imageDimensions = ref({ width: 0, height: 0 })
const draggingIndex = ref(null)
const dragOffset = ref({ x: 0, y: 0 })

// Imágenes por sección
const imagenesPorSeccion = ref({
  informacionVehiculo: [],
  sistemaFrenos: [],
  sistemaSuspension: [],
  inspeccionCarroceria: [],
  chasis: [],
  llantas: [],
  motor: [],
  general: []
})

// Referencias para los inputs de archivo por sección
const sectionFileInputs = ref({})

// Definir form primero
const form = reactive({
  patente: '', marca: '', modelo: '', color: '', propietario: '', propietarioRut: '', cliente: '', telefono: '',
  direccion: '', email: '', fecha: '', numeroMotor: '', numeroChasis: '', numeroSerial: '',
  tipoTransporte: '', anio: '', procedencia: '', fabricante: '', tipoSello: '', combustible: '', kilometraje: '',
  // Información de Revisión Técnica
  revisionTecnica_comuna: '', revisionTecnica_mes: '', revisionTecnica_ultimoControl: '', 
  revisionTecnica_estado: '', revisionTecnica_fechaVencimiento: '',
  // Información de Gases
  gases_comuna: '', gases_mes: '', gases_ultimoControl: '', gases_estado: '', gases_fechaVencimiento: '',
  // Permiso de Circulación
  permisoCirculacion_info: '', permisoCirculacion_fechaVencimiento: '',
  // SOAP (Seguro Obligatorio)
  soap_estado: '', soap_compania: '', soap_fechaInicio: '', soap_fechaVencimiento: '',
  // Información de Transporte Público
  transportePublico: '', tipoTransportePublico: '',
  // Restricción Vehicular
  restriccionVehicular_condicion: '', restriccionVehicular_comunasPuenteAltoSanBernardo: '', 
  restriccionVehicular_provinciaSantiago: '',
  // Reportes y Multas
  reporte_robo: '', reporte_remate: '', multas: '',
  valorAvaluo: '',
  frenos_eficacia_delantera: '', frenos_eficacia_trasera: '', frenos_diferencia_fuerza_delantera: '',
  frenos_diferencia_fuerza_trasera: '', frenos_esfuerzo: '', frenos_peso: '', frenos_total: '', frenos_estado_general: '',
  suspension_delantera_izquierda: '', suspension_delantera_derecha: '', suspension_trasera_izquierda: '',
  suspension_trasera_derecha: '', suspension_diferencia_delantera: '', suspension_diferencia_trasera: '', suspension_estado_general: '',
  carroceria: {
    // Partes externas principales
    antena: '', cocuyo_derecho: '', cocuyo_izquierdo: '', luz_media_derecha: '', luz_media_izquierda: '',
    plumillas_delanteras: '', plumilla_trasera: '', retrovisor_derecho: '', retrovisor_izquierdo: '',
    portaequipajes: '', rines: '', stop_adicional: '', espoiler_delantero: '', espoiler_trasero: '',
    boceles: '', boceles_boca_llantas: '',
    // Guardafangos y costados
    guardafango_delantero_derecho: '', guardafango_delantero_izquierdo: '',
    costado_derecho: '', costado_izquierdo: '',
    // Puertas
    puerta_delantera_derecha: '', puerta_delantera_izquierda: '',
    puerta_trasera_derecha: '', puerta_trasera_izquierda: '',
    // Vidrios de puertas
    vidrio_puerta_delantera_derecha: '', vidrio_puerta_delantera_izquierda: '',
    vidrio_puerta_trasera_derecha: '', vidrio_puerta_trasera_izquierda: '',
    vidrio_costado_derecho: '', vidrio_costado_izquierdo: '',
    // Partes principales
    capo: '', techo: '', baul: '', tapa_baul: '',
    parachoques_delantero: '', parachoques_trasero: '',
    faros_delanteros: '', farola_derecha: '', farola_izquierda: '',
    luces_traseras: '', stop_derecho: '', stop_izquierdo: '',
    // Vidrios panorámicos
    vidrio_panoramico_delantero: '', vidrio_panoramico_trasero: '',
    paral_panoramico_derecho: '', paral_panoramico_izquierdo: '',
    paral_central_derecho: '', paral_central_izquierdo: '',
    // Partes adicionales
    panel_parallamas: '', panel_trasero: '', persiana: '', babero: '',
    rompenieblas: '', tercer_stop: '',
    // Estribos
    estribo_derecho: '', estribo_izquierdo: ''
  },
  chasis: {
    estribo_derecho: '', estribo_izquierdo: '', pisos_carroceria: '', puntal_derecho: '', puntal_izquierdo: '',
    base_tijera_derecha: '', base_tijera_izquierda: '', piso_baul: '', panel_trasero: '',
    soportes_parachoques_delantero: '', soportes_parachoques_trasero: '', marcos_puertas_delanteras: '',
    marcos_puertas_traseras: '', torre_suspension_delantera_derecha: '', torre_suspension_delantera_izquierda: '',
    largueros_delanteros: '', largueros_traseros: '', marco_panoramico_delantero: '', marco_panoramico_trasero: ''
  },
  llantas: {
    delantera_derecha: { marca: '', medida: '', profundidad: '', anioFabricacion: '' },
    delantera_izquierda: { marca: '', medida: '', profundidad: '', anioFabricacion: '' },
    trasera_derecha: { marca: '', medida: '', profundidad: '', anioFabricacion: '' },
    trasera_izquierda: { marca: '', medida: '', profundidad: '', anioFabricacion: '' }
  },
  motor: {
    bloque_motor: '',
    culata: '',
    valvulas: '',
    pistones: '',
    bielas: '',
    cigueñal: '',
    sistema_refrigeracion: '',
    sistema_lubricacion: '',
    filtro_aceite: '',
    filtro_aire: '',
    correa_distribucion: '',
    cadena_distribucion: '',
    bujias: '',
    bobinas_encendido: '',
    inyectores: '',
    bomba_combustible: '',
    alternador: '',
    motor_arranque: '',
    sensor_oxigeno: '',
    catalizador: '',
    sistema_escape: ''
  },
  escanerMotor: '',
  observaciones_generales: '',
  carroceriaImagenNumeros: [] // Array de números con posiciones para la imagen de carrocería
})

// Estados de carrocería (24 estados)
const estadosCarroceria = ref([
  { value: 'BIEN', label: 'BIEN', color: '#10b981' },
  { value: 'BIEN REPA', label: 'BIEN REPA', color: '#3b82f6' },
  { value: 'BIEN REPAR POR REMOC', label: 'BIEN REPAR POR REMOC', color: '#6366f1' },
  { value: 'BUENO', label: 'BUENO', color: '#22c55e' },
  { value: 'CORROIDO', label: 'CORROIDO', color: '#f59e0b' },
  { value: 'CUARTEADO', label: 'CUARTEADO', color: '#ef4444' },
  { value: 'DESCUADRE', label: 'DESCUADRE', color: '#f97316' },
  { value: 'DESENGRAFE', label: 'DESENGRAFE', color: '#84cc16' },
  { value: 'FISURADO', label: 'FISURADO', color: '#eab308' },
  { value: 'GOLEVE', label: 'GOLEVE', color: '#14b8a6' },
  { value: 'GOLPEADO', label: 'GOLPEADO', color: '#f43f5e' },
  { value: 'MAL REPAR', label: 'MAL REPAR', color: '#dc2626' },
  { value: 'MAL REPINT', label: 'MAL REPINT', color: '#b91c1c' },
  { value: 'MALO', label: 'MALO', color: '#991b1b' },
  { value: 'NO REALIZADA', label: 'NO REALIZADA', color: '#6b7280' },
  { value: 'NO TIENE', label: 'NO TIENE', color: '#9ca3af' },
  { value: 'PINTURA MANC', label: 'PINTURA MANC', color: '#a855f7' },
  { value: 'RAYADO', label: 'RAYADO', color: '#ec4899' },
  { value: 'REGUL', label: 'REGUL', color: '#8b5cf6' },
  { value: 'REMOV', label: 'REMOV', color: '#64748b' },
  { value: 'REPINT', label: 'REPINT', color: '#06b6d4' },
  { value: 'REPINTADO PARCIAL', label: 'REPINTADO PARCIAL', color: '#0ea5e9' },
  { value: 'ROTO', label: 'ROTO', color: '#dc2626' },
  { value: 'SUMIDO', label: 'SUMIDO', color: '#f97316' }
])

// Partes organizadas en las 3 tablas (basado en la imagen)
const partesTabla1 = computed(() => {
  const keys = Object.keys(form.carroceria)
  return keys.slice(0, Math.ceil(keys.length / 3)).reduce((acc, key) => {
    acc[key] = form.carroceria[key]
    return acc
  }, {})
})

const partesTabla2 = computed(() => {
  const keys = Object.keys(form.carroceria)
  const start = Math.ceil(keys.length / 3)
  const end = Math.ceil(keys.length * 2 / 3)
  return keys.slice(start, end).reduce((acc, key) => {
    acc[key] = form.carroceria[key]
    return acc
  }, {})
})

const partesTabla3 = computed(() => {
  const keys = Object.keys(form.carroceria)
  const start = Math.ceil(keys.length * 2 / 3)
  return keys.slice(start).reduce((acc, key) => {
    acc[key] = form.carroceria[key]
    return acc
  }, {})
})

// Cargar información del auto si se proporciona autoId
const loadAutoInfo = async () => {
  const autoIdParam = route.query.autoId
  if (!autoIdParam) return

  autoId.value = autoIdParam
  try {
    const response = await $fetch(`${API_BASE}/autos/${autoIdParam}`, {
      headers: getAuthHeaders()
    })
    autoInfo.value = response
    
    // Pre-llenar campos del formulario con datos del auto
    if (response) {
      form.marca = response.marca || ''
      form.modelo = response.modelo || ''
      form.color = response.color || ''
      
      // Si el auto tiene un peritaje asociado, cargarlo
      // Puede venir como peritajeId o como objeto peritaje
      const peritajeId = response.peritajeId || response.peritaje?.id
      if (peritajeId) {
        console.log('[autos-peritaje.vue] Auto tiene peritaje asociado:', peritajeId)
        await loadPeritaje(peritajeId)
      } else if (response.peritaje) {
        // Si el peritaje viene incluido en la respuesta, cargarlo directamente
        console.log('[autos-peritaje.vue] Peritaje incluido en respuesta del auto')
        await loadPeritajeData(response.peritaje)
      }
    }
  } catch (err) {
    console.error('Error cargando auto:', err)
  }
}

// Cargar peritaje existente desde API
const loadPeritaje = async (peritajeId) => {
  try {
    console.log('[autos-peritaje.vue] Cargando peritaje desde API:', peritajeId)
    const peritaje = await $fetch(`${API_BASE}/peritajes/${peritajeId}`, {
      headers: getAuthHeaders()
    })
    
    await loadPeritajeData(peritaje)
  } catch (err) {
    console.error('[autos-peritaje.vue] Error cargando peritaje desde API:', err)
  }
}

// Cargar datos del peritaje (ya sea desde API o desde objeto)
const loadPeritajeData = async (peritaje) => {
  try {
    console.log('[autos-peritaje.vue] Cargando datos del peritaje:', peritaje)
    console.log('[autos-peritaje.vue] Imágenes por sección:', peritaje.imagenesPorSeccion)
    console.log('[autos-peritaje.vue] Imágenes generales:', peritaje.imagenes)
    
    // Llenar el formulario con los datos del peritaje
    Object.keys(form).forEach(key => {
      if (key !== 'carroceria' && key !== 'chasis' && key !== 'llantas' && key !== 'motor' && peritaje[key] !== undefined && peritaje[key] !== null) {
        form[key] = peritaje[key]
      }
    })
    
    // Llenar carroceria, chasis, llantas y motor
    if (peritaje.carroceria) {
      Object.assign(form.carroceria, peritaje.carroceria)
    }
    if (peritaje.chasis) {
      Object.assign(form.chasis, peritaje.chasis)
    }
    if (peritaje.llantas) {
      Object.assign(form.llantas, peritaje.llantas)
      // Asegurar que cada llanta tenga el campo anioFabricacion
      Object.keys(form.llantas).forEach(key => {
        if (!form.llantas[key].anioFabricacion) {
          form.llantas[key].anioFabricacion = ''
        }
      })
    }
    if (peritaje.motor) {
      Object.assign(form.motor, peritaje.motor)
    }
    
    // Cargar imágenes por sección
    if (peritaje.imagenesPorSeccion) {
      Object.keys(imagenesPorSeccion.value).forEach(seccion => {
        const imagenesDeBD = peritaje.imagenesPorSeccion[seccion] || []
        console.log(`[autos-peritaje.vue] Imágenes de BD para ${seccion}:`, imagenesDeBD)
        
        // Convertir URLs a formato con preview
        imagenesPorSeccion.value[seccion] = imagenesDeBD.map(url => {
          // Si ya es un objeto con preview, mantenerlo; si es una URL, crear objeto
          if (typeof url === 'string') {
            return {
              preview: url,
              url: url,
              isFromDB: true // Marcar que viene de la BD
            }
          }
          return url
        })
        console.log(`[autos-peritaje.vue] Imágenes cargadas para ${seccion}:`, imagenesPorSeccion.value[seccion])
      })
    } else {
      console.log('[autos-peritaje.vue] No hay imagenesPorSeccion en el peritaje')
    }
    
    // Cargar imágenes generales
    if (peritaje.imagenes && Array.isArray(peritaje.imagenes)) {
      selectedImages.value = peritaje.imagenes.map(url => {
        if (typeof url === 'string') {
          return {
            preview: url,
            url: url,
            isFromDB: true
          }
        }
        return url
      })
      console.log('[autos-peritaje.vue] Imágenes generales cargadas:', selectedImages.value)
    }
    
    // Cargar números de carrocería si existen
    if (peritaje.carroceriaImagenNumeros && Array.isArray(peritaje.carroceriaImagenNumeros)) {
      carroceriaNumeros.value = peritaje.carroceriaImagenNumeros
      form.carroceriaImagenNumeros = peritaje.carroceriaImagenNumeros
      console.log('[autos-peritaje.vue] Números de carrocería cargados:', carroceriaNumeros.value)
    }
    
    // Guardar el ID del peritaje si existe
    if (peritaje.id) {
      peritajeId.value = peritaje.id
      console.log('[autos-peritaje.vue] Peritaje ID guardado:', peritajeId.value)
    }
    
    console.log('[autos-peritaje.vue] Peritaje cargado exitosamente')
  } catch (err) {
    console.error('[autos-peritaje.vue] Error cargando datos del peritaje:', err)
  }
}

const handleFileSelect = (event) => {
  const files = Array.from(event.target.files)
  const remainingSlots = 20 - selectedImages.value.length
  
  files.slice(0, remainingSlots).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        selectedImages.value.push({
          file: file,
          preview: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  })
  
  event.target.value = ''
}

const removeImage = (index) => {
  selectedImages.value.splice(index, 1)
}

// Funciones para manejar imágenes por sección
const handleSectionFileSelect = (seccion, event) => {
  const files = Array.from(event.target.files)
  const maxImages = 10
  
  files.slice(0, maxImages - imagenesPorSeccion.value[seccion].length).forEach(file => {
    if (file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        imagenesPorSeccion.value[seccion].push({
          file: file,
          preview: e.target.result
        })
      }
      reader.readAsDataURL(file)
    }
  })
  
  event.target.value = ''
}

const removeSectionImage = (seccion, index) => {
  imagenesPorSeccion.value[seccion].splice(index, 1)
}

// Funciones para manejar la imagen interactiva de carrocería
const handleImageLoad = (event) => {
  const img = event.target
  imageDimensions.value = {
    width: img.offsetWidth,
    height: img.offsetHeight
  }
}

const handleImageClick = (event) => {
  event.preventDefault()
  event.stopPropagation()
  
  if (!selectedNumber.value) return
  
  const container = imageContainer.value
  if (!container) return
  
  const rect = container.getBoundingClientRect()
  const img = container.querySelector('img')
  if (!img) return
  
  const imgRect = img.getBoundingClientRect()
  const x = ((event.clientX - imgRect.left) / imgRect.width) * 100
  const y = ((event.clientY - imgRect.top) / imgRect.height) * 100
  
  // Agregar el número en la posición clickeada
  carroceriaNumeros.value.push({
    numero: selectedNumber.value,
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y))
  })
  
  // Guardar en el form
  form.carroceriaImagenNumeros = [...carroceriaNumeros.value]
  
  // Limpiar selección
  selectedNumber.value = null
}

const handleDrop = (event) => {
  if (!selectedNumber.value) return
  
  const container = imageContainer.value
  if (!container) return
  
  const img = container.querySelector('img')
  if (!img) return
  
  const imgRect = img.getBoundingClientRect()
  const x = ((event.clientX - imgRect.left) / imgRect.width) * 100
  const y = ((event.clientY - imgRect.top) / imgRect.height) * 100
  
  // Agregar el número en la posición donde se soltó
  carroceriaNumeros.value.push({
    numero: selectedNumber.value,
    x: Math.max(0, Math.min(100, x)),
    y: Math.max(0, Math.min(100, y))
  })
  
  // Guardar en el form
  form.carroceriaImagenNumeros = [...carroceriaNumeros.value]
  
  // Limpiar selección
  selectedNumber.value = null
}

const handleDragStart = (event, index) => {
  draggingIndex.value = index
  const num = carroceriaNumeros.value[index]
  const container = imageContainer.value
  if (!container) return
  
  const img = container.querySelector('img')
  if (!img) return
  
  const imgRect = img.getBoundingClientRect()
  dragOffset.value = {
    x: event.clientX - (imgRect.left + (num.x / 100) * imgRect.width),
    y: event.clientY - (imgRect.top + (num.y / 100) * imgRect.height)
  }
}

const handleDrag = (event, index) => {
  if (draggingIndex.value === null) return
  
  const container = imageContainer.value
  if (!container) return
  
  const img = container.querySelector('img')
  if (!img) return
  
  const imgRect = img.getBoundingClientRect()
  const x = ((event.clientX - dragOffset.value.x - imgRect.left) / imgRect.width) * 100
  const y = ((event.clientY - dragOffset.value.y - imgRect.top) / imgRect.height) * 100
  
  carroceriaNumeros.value[index].x = Math.max(0, Math.min(100, x))
  carroceriaNumeros.value[index].y = Math.max(0, Math.min(100, y))
}

const handleDragEnd = (event, index) => {
  // Guardar en el form
  form.carroceriaImagenNumeros = [...carroceriaNumeros.value]
  draggingIndex.value = null
}

const startDragging = (index, event) => {
  draggingIndex.value = index
  const num = carroceriaNumeros.value[index]
  const container = imageContainer.value
  if (!container) return
  
  const img = container.querySelector('img')
  if (!img) return
  
  const imgRect = img.getBoundingClientRect()
  dragOffset.value = {
    x: event.clientX - (imgRect.left + (num.x / 100) * imgRect.width),
    y: event.clientY - (imgRect.top + (num.y / 100) * imgRect.height)
  }
  
  const onMouseMove = (e) => {
    const x = ((e.clientX - dragOffset.value.x - imgRect.left) / imgRect.width) * 100
    const y = ((e.clientY - dragOffset.value.y - imgRect.top) / imgRect.height) * 100
    
    carroceriaNumeros.value[index].x = Math.max(0, Math.min(100, x))
    carroceriaNumeros.value[index].y = Math.max(0, Math.min(100, y))
  }
  
  const onMouseUp = () => {
    form.carroceriaImagenNumeros = [...carroceriaNumeros.value]
    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', onMouseUp)
    draggingIndex.value = null
  }
  
  document.addEventListener('mousemove', onMouseMove)
  document.addEventListener('mouseup', onMouseUp)
}

const removeNumero = (index) => {
  carroceriaNumeros.value.splice(index, 1)
  form.carroceriaImagenNumeros = [...carroceriaNumeros.value]
}

const getEstadoColor = (numero) => {
  // Obtener el color del estado correspondiente al número
  if (numero >= 1 && numero <= estadosCarroceria.value.length) {
    return estadosCarroceria.value[numero - 1].color
  }
  return '#6b7280' // Color por defecto
}

const getEstadoColorForPDF = (numero) => {
  // Convertir color hex a RGB para jsPDF
  const color = getEstadoColor(numero)
  const hex = color.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return [r, g, b]
}

const handleSubmit = async () => {
  isLoading.value = true
  try {
    const formData = new FormData()
    
    // Agregar campos del formulario
    Object.keys(form).forEach(key => {
      if (key === 'carroceria' || key === 'chasis' || key === 'llantas' || key === 'motor' || key === 'carroceriaImagenNumeros') {
        formData.append(key, JSON.stringify(form[key]))
      } else if (form[key] !== '' && form[key] !== null && form[key] !== undefined) {
        formData.append(key, form[key])
      }
    })
    
    // Asegurar que carroceriaImagenNumeros se guarde siempre (puede ser array vacío)
    if (!form.carroceriaImagenNumeros) {
      formData.append('carroceriaImagenNumeros', JSON.stringify([]))
    }

    // Agregar imágenes generales
    // Solo agregar las imágenes nuevas (que tienen .file), no las que vienen de la BD
    selectedImages.value.forEach((image) => {
      if (image.file && !image.isFromDB) {
        formData.append('imagenes', image.file)
      }
    })
    
    // Agregar imágenes por sección
    // Solo agregar las imágenes nuevas (que tienen .file), no las que vienen de la BD
    Object.keys(imagenesPorSeccion.value).forEach(seccion => {
      imagenesPorSeccion.value[seccion].forEach((image) => {
        // Solo agregar si tiene .file (imagen nueva), no si es de la BD
        if (image.file && !image.isFromDB) {
          formData.append(`imagenes_${seccion}`, image.file)
        }
      })
    })

    // Crear o actualizar peritaje
    const token = localStorage.getItem('token')
    const method = peritajeId.value ? 'PUT' : 'POST'
    const url = peritajeId.value 
      ? `${API_BASE}/peritajes/${peritajeId.value}`
      : `${API_BASE}/peritajes`
    
    console.log('[autos-peritaje.vue] Enviando peritaje:', { method, url, peritajeId: peritajeId.value })
    
    const response = await fetch(url, {
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || `Error al ${peritajeId.value ? 'actualizar' : 'crear'} el peritaje`)
    }

    const peritaje = await response.json()
    
    // Guardar el ID del peritaje si es nuevo
    if (!peritajeId.value && peritaje.id) {
      peritajeId.value = peritaje.id
    }
    
    console.log('[autos-peritaje.vue] Peritaje guardado exitosamente:', peritaje)

    // Si hay autoId, asociar el peritaje al auto
    if (autoId.value) {
      await $fetch(`${API_BASE}/autos/${autoId.value}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: {
          peritajeId: peritaje.id,
          estado: 'en_revision'
        }
      })
    }

    alert('Peritaje creado y asociado al auto exitosamente!')
    if (autoId.value) {
      navigateTo(`/admin/autos-detalle?id=${autoId.value}`)
    } else {
      navigateTo('/admin/autos')
    }
  } catch (error) {
    console.error('Error creando peritaje:', error)
    alert(error.message || 'Error al crear el peritaje')
  } finally {
    isLoading.value = false
  }
}

// Helper: obtener dimensiones de una data URL (para diagramas precargados)
const getImageDimensionsFromDataUrl = (dataUrl) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.onerror = () => reject(new Error('Error al obtener dimensiones'))
    img.src = dataUrl
  })
}

// Función para generar el PDF (reutilizable)
const generatePDF = async () => {
  try {
    // Crear el documento PDF
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = PDF_LAYOUT.margin
    const contentWidth = PDF_LAYOUT.getContentWidth(pageWidth)
    const maxHeightDiagrama = PDF_LAYOUT.maxHeightDiagrama
    const maxHeightDiagramaSmall = 40
    let yPos = margin
    let currentY = margin
    let rowStartY = margin // Variable para controlar el inicio de filas en layout de 4 columnas

    // Colores mejorados
    const primaryColor = [37, 99, 235] // blue-600
    const secondaryColor = [59, 130, 246] // blue-500
    const accentColor = [249, 115, 22] // orange-500
    const textColor = [30, 41, 59] // slate-800
    const lightGray = [241, 245, 249] // slate-100
    const borderColor = [203, 213, 225] // slate-300
    const textGray = [100, 116, 139] // slate-500

    // Función helper para rectángulo redondeado (jsPDF no tiene roundedRect nativo)
    const roundedRect = (x, y, w, h, r, mode = 'F') => {
      if (r === 0 || r < 0.5) {
        doc.rect(x, y, w, h, mode)
        return
      }
      // Dibujar rectángulo con esquinas redondeadas usando círculos
      if (mode === 'F' || mode === 'FD') {
        const fillColor = mode === 'F' ? doc.getFillColor() : doc.getDrawColor()
        doc.setFillColor(...fillColor)
        // Rectángulo central
        doc.rect(x + r, y, w - 2 * r, h, 'F')
        doc.rect(x, y + r, w, h - 2 * r, 'F')
        // Esquinas redondeadas
        doc.circle(x + r, y + r, r, 'F')
        doc.circle(x + w - r, y + r, r, 'F')
        doc.circle(x + r, y + h - r, r, 'F')
        doc.circle(x + w - r, y + h - r, r, 'F')
      }
      if (mode === 'S' || mode === 'FD') {
        // Líneas rectas
        doc.line(x + r, y, x + w - r, y)
        doc.line(x + r, y + h, x + w - r, y + h)
        doc.line(x, y + r, x, y + h - r)
        doc.line(x + w, y + r, x + w, y + h - r)
        // Esquinas redondeadas (solo borde)
        doc.setDrawColor(...doc.getDrawColor())
        doc.circle(x + r, y + r, r, 'S')
        doc.circle(x + w - r, y + r, r, 'S')
        doc.circle(x + r, y + h - r, r, 'S')
        doc.circle(x + w - r, y + h - r, r, 'S')
      }
    }

    // Función helper para agregar sección con diseño elegante
    const addSection = (title, y, color = darkBlue) => {
      // Cuadro elegante para el título con sombra sutil
      doc.setFillColor(...color)
      roundedRect(margin, y, contentWidth, 6.5, 0.8, 'F')
      
      // Línea decorativa azul brillante a la izquierda
      doc.setFillColor(...lightBlue)
      doc.rect(margin, y, 2.5, 6.5, 'F')
      
      // Texto del título
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(10.5)
      doc.setFont('helvetica', 'bold')
      doc.text(title, margin + 5, y + 4.2)
      
      // Línea decorativa debajo con gradiente simulado
      doc.setDrawColor(...borderGray)
      doc.setLineWidth(0.3)
      doc.line(margin, y + 6.5, margin + contentWidth, y + 6.5)
      
      // Línea azul sutil debajo
      doc.setDrawColor(...mediumBlue)
      doc.setLineWidth(0.2)
      doc.line(margin, y + 6.7, margin + contentWidth, y + 6.7)
      
      doc.setTextColor(...textColor)
      return y + 9
    }

    // Función helper para obtener posición de columna (4 columnas)
    const getColX = (col) => {
      const colWidth = 42
      const colSpacing = 3
      return margin + (col - 1) * (colWidth + colSpacing)
    }
    
    // Función helper para agregar campo con diseño elegante (4 columnas compactas)
    const addField = (label, value, x, y, width = 42, showEmpty = true) => {
      if (!value && value !== 0 && value !== '') {
        if (!showEmpty) return y
        value = '-'
      }
      
      const boxHeight = 6.5
      // Cuadro elegante con borde azul sutil
      doc.setFillColor(...lightGrayBg)
      roundedRect(x, y - 1.5, width, boxHeight, 0.8, 'F')
      
      // Borde superior azul para elegancia (la etiqueta va debajo, con espacio para no solaparse)
      doc.setFillColor(...mediumBlue)
      doc.rect(x, y - 1.5, width, 0.8, 'F')
      
      // Borde del cuadro
      doc.setDrawColor(...borderGray)
      doc.setLineWidth(0.2)
      roundedRect(x, y - 1.5, width, boxHeight, 0.8, 'S')
      
      // Label con espacio bajo la línea azul para que se lea bien
      doc.setTextColor(...mediumGray)
      doc.setFontSize(5.5)
      doc.setFont('helvetica', 'normal')
      doc.text(label, x + 1, y + 1.4, { maxWidth: width - 2 })
      
      // Valor del campo
      doc.setTextColor(...darkBlue)
      doc.setFontSize(7.5)
      doc.setFont('helvetica', 'bold')
      doc.text(String(value), x + 1, y + 4.6, { maxWidth: width - 2 })
      
      return y + 6.5
    }
    
    // Función helper para agregar campo en 4 columnas (retorna nueva Y)
    const addField4Col = (label, value, col, y, showEmpty = true) => {
      const x = getColX(col)
      return addField(label, value, x, y, 42, showEmpty)
    }

    // Función para agregar imágenes en grid (reducido para 2 páginas)
    const addImageGrid = async (images, y, maxWidth = contentWidth, maxHeight = 35) => {
      if (!images || images.length === 0) return y
      
      const cols = 3 // 3 columnas para imágenes más pequeñas
      const rows = Math.ceil(images.length / cols)
      const imgWidth = (maxWidth - 8) / cols
      const imgHeight = maxHeight / rows
      
      let currentY = y
      for (let i = 0; i < images.length; i++) {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = margin + (col * (imgWidth + 5))
        const yImg = currentY + (row * imgHeight)
        
        try {
          const imgUrl = typeof images[i] === 'string' 
            ? images[i] 
            : (images[i].preview || images[i].url || images[i])
          
          const img = await loadImageFromUrl(imgUrl)
          
          // Calcular dimensiones manteniendo aspecto
          const aspect = img.width / img.height
          let w = imgWidth - 2
          let h = w / aspect
          if (h > imgHeight - 2) {
            h = imgHeight - 2
            w = h * aspect
          }
          
          // Borde para la imagen
          doc.setDrawColor(...borderColor)
          doc.setLineWidth(0.5)
          roundedRect(x + 1, yImg, imgWidth - 2, imgHeight - 2, 2, 'S')
          
          // Agregar imagen
          doc.addImage(img, 'JPEG', x + 1 + (imgWidth - 2 - w) / 2, yImg + (imgHeight - 2 - h) / 2, w, h)
        } catch (error) {
          console.error('Error cargando imagen:', error)
        }
      }
      
      return y + (rows * imgHeight) + 5
    }

    // Colores elegantes para el diseño
    const darkBlue = [30, 58, 138] // blue-900
    const mediumBlue = [37, 99, 235] // blue-600
    const lightBlue = [59, 130, 246] // blue-500
    const darkGray = [51, 65, 85] // slate-700
    const mediumGray = [100, 116, 139] // slate-500
    const lightGrayBg = [241, 245, 249] // slate-100
    const borderGray = [203, 213, 225] // slate-300
    
    // HEADER ELEGANTE CON MARCA
    // Banda superior azul oscuro
    doc.setFillColor(...darkBlue)
    doc.rect(0, 0, pageWidth, 25, 'F')
    
    // Logo/Marca en el header
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(18)
    doc.setFont('helvetica', 'bold')
    doc.text('AutoRemates', margin, 18)
    
    // Subtítulo en header
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('PERITAJE TÉCNICO VEHICULAR', pageWidth - margin, 18, { align: 'right' })
    
    // Línea decorativa debajo del header
    doc.setDrawColor(...mediumBlue)
    doc.setLineWidth(0.5)
    doc.line(0, 25, pageWidth, 25)
    
    yPos = 30

    // INFORMACIÓN DEL VEHÍCULO - Diseño compacto y elegante
    yPos = addSection('INFORMACIÓN DEL VEHÍCULO', yPos)

    currentY = yPos
    rowStartY = currentY
    
    // Fila 1 - Datos principales
    currentY = Math.max(
      addField4Col('Patente', form.patente, 1, rowStartY),
      addField4Col('Marca', form.marca, 2, rowStartY),
      addField4Col('Modelo', form.modelo, 3, rowStartY),
      addField4Col('Año', form.anio, 4, rowStartY)
    )
    rowStartY = currentY
    
    // Fila 2
    currentY = Math.max(
      addField4Col('Color', form.color, 1, rowStartY),
      addField4Col('Tipo', form.tipoTransporte, 2, rowStartY),
      addField4Col('Combustible', form.combustible, 3, rowStartY),
      addField4Col('Kilometraje', form.kilometraje ? `${form.kilometraje.toLocaleString('es-CL')} km` : null, 4, rowStartY)
    )
    rowStartY = currentY
    
    // Fila 3 - Números
    currentY = Math.max(
      addField4Col('N° Motor', form.numeroMotor, 1, rowStartY),
      addField4Col('N° Chasis', form.numeroChasis, 2, rowStartY),
      addField4Col('N° Serial', form.numeroSerial, 3, rowStartY),
      addField4Col('Procedencia', form.procedencia, 4, rowStartY)
    )
    rowStartY = currentY
    
    // Fila 4
    currentY = Math.max(
      addField4Col('Fabricante', form.fabricante, 1, rowStartY),
      addField4Col('Tipo Sello', form.tipoSello, 2, rowStartY),
      addField4Col('RUT Prop.', form.propietarioRut, 3, rowStartY),
      addField4Col('Propietario', form.propietario, 4, rowStartY)
    )
    rowStartY = currentY
    
    // Fila 5 - Contacto
    currentY = Math.max(
      addField4Col('Cliente', form.cliente, 1, rowStartY),
      addField4Col('Teléfono', form.telefono, 2, rowStartY),
      addField4Col('Email', form.email, 3, rowStartY),
      addField4Col('Fecha', form.fecha ? new Date(form.fecha).toLocaleDateString('es-CL') : null, 4, rowStartY)
    )
    
    // DOCUMENTACIÓN Y PERMISOS - Sección combinada compacta
    if (form.revisionTecnica_estado || form.gases_estado || form.soap_estado || form.reporte_robo) {
      if (currentY > 240) {
        doc.addPage()
        currentY = margin
        yPos = currentY
      }
      yPos = addSection('DOCUMENTACIÓN Y PERMISOS', currentY)
      currentY = yPos
      rowStartY = currentY
      
      // Revisión Técnica y Gases en una fila
      if (form.revisionTecnica_estado || form.gases_estado) {
        currentY = Math.max(
          addField4Col('Rev. Téc. Estado', form.revisionTecnica_estado, 1, rowStartY),
          addField4Col('Rev. Téc. Venc.', form.revisionTecnica_fechaVencimiento ? new Date(form.revisionTecnica_fechaVencimiento).toLocaleDateString('es-CL') : null, 2, rowStartY),
          addField4Col('Gases Estado', form.gases_estado, 3, rowStartY),
          addField4Col('Gases Venc.', form.gases_fechaVencimiento ? new Date(form.gases_fechaVencimiento).toLocaleDateString('es-CL') : null, 4, rowStartY)
        )
        rowStartY = currentY
      }
      
      // SOAP y otros
      if (form.soap_estado || form.transportePublico) {
        currentY = Math.max(
          addField4Col('SOAP Estado', form.soap_estado, 1, rowStartY),
          addField4Col('SOAP Compañía', form.soap_compania, 2, rowStartY),
          addField4Col('SOAP Venc.', form.soap_fechaVencimiento ? new Date(form.soap_fechaVencimiento).toLocaleDateString('es-CL') : null, 3, rowStartY),
          addField4Col('Transp. Público', form.transportePublico, 4, rowStartY)
        )
        rowStartY = currentY
      }
      
      // Reportes (solo si existen, muy compacto)
      if (form.reporte_robo || form.reporte_remate || form.multas) {
        const reportes = []
        if (form.reporte_robo) reportes.push('Robo')
        if (form.reporte_remate) reportes.push('Remate')
        if (form.multas) reportes.push('Multas')
        if (reportes.length > 0) {
          currentY = addField4Col('Reportes', reportes.join(', '), 1, rowStartY)
        }
      }
    }

    yPos = currentY + 3

    // SISTEMA DE FRENOS - Compacto
    if (yPos > 250) {
      doc.addPage()
      yPos = margin
    }
    yPos = addSection('SISTEMA DE FRENOS', yPos, [220, 38, 38])

    currentY = yPos
    rowStartY = currentY
    // Fila 1
    currentY = Math.max(
      addField4Col('Efic. Del.', form.frenos_eficacia_delantera !== '' ? `${form.frenos_eficacia_delantera}%` : null, 1, rowStartY),
      addField4Col('Efic. Tras.', form.frenos_eficacia_trasera !== '' ? `${form.frenos_eficacia_trasera}%` : null, 2, rowStartY),
      addField4Col('Dif. Del.', form.frenos_diferencia_fuerza_delantera !== '' ? `${form.frenos_diferencia_fuerza_delantera}%` : null, 3, rowStartY),
      addField4Col('Dif. Tras.', form.frenos_diferencia_fuerza_trasera !== '' ? `${form.frenos_diferencia_fuerza_trasera}%` : null, 4, rowStartY)
    )
    rowStartY = currentY
    // Fila 2
    currentY = Math.max(
      addField4Col('Esfuerzo', form.frenos_esfuerzo !== '' ? `${form.frenos_esfuerzo} kg` : null, 1, rowStartY),
      addField4Col('Peso', form.frenos_peso !== '' ? `${form.frenos_peso} kg` : null, 2, rowStartY),
      addField4Col('Total', form.frenos_total !== '' ? `${form.frenos_total}%` : null, 3, rowStartY),
      addField4Col('Estado', form.frenos_estado_general, 4, rowStartY)
    )

    // Imagen por defecto de Sistema de Frenos (reducida)
    try {
      if (currentY > 250) {
        doc.addPage()
        currentY = margin
      }
      currentY += 2
      doc.setTextColor(...mediumGray)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('Diagrama:', margin, currentY)
      currentY += 3
      
      let dataUrlFrenos = preload.frenosDataUrl.value
      let aspectFrenos = 1
      if (dataUrlFrenos) {
        const dims = await getImageDimensionsFromDataUrl(dataUrlFrenos)
        aspectFrenos = dims.width / dims.height
      } else {
        const imgFrenos = await loadImageFromUrl(IMAGENES_PDF.frenos)
        dataUrlFrenos = imageToDataUrl(imgFrenos, 'image/jpeg', 0.9)
        aspectFrenos = imgFrenos.width / imgFrenos.height
      }
      const maxWidthFrenos = contentWidth
      const maxHeightFrenos = maxHeightDiagramaSmall
      let pdfWidthFrenos = maxWidthFrenos
      let pdfHeightFrenos = maxWidthFrenos / aspectFrenos
      if (pdfHeightFrenos > maxHeightFrenos) {
        pdfHeightFrenos = maxHeightFrenos
        pdfWidthFrenos = maxHeightFrenos * aspectFrenos
      }
      doc.addImage(dataUrlFrenos, 'JPEG', margin, currentY, pdfWidthFrenos, pdfHeightFrenos)
      currentY += pdfHeightFrenos + 3
    } catch (error) {
      console.error('Error cargando imagen de frenos:', error)
    }

    // Imágenes de Sistema de Frenos (compactas)
    if (imagenesPorSeccion.value.sistemaFrenos && imagenesPorSeccion.value.sistemaFrenos.length > 0) {
      if (currentY > 250) {
        doc.addPage()
        currentY = margin
      }
      currentY += 2
      doc.setTextColor(...mediumGray)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('Fotos:', margin, currentY)
      currentY += 3
      currentY = await addImageGrid(imagenesPorSeccion.value.sistemaFrenos, currentY, contentWidth, 30)
    }

    yPos = currentY + 3

    // SISTEMA DE SUSPENSIÓN - Compacto
    if (yPos > 250) {
      doc.addPage()
      yPos = margin
    }
    yPos = addSection('SISTEMA DE SUSPENSIÓN', yPos, [34, 197, 94])

    currentY = yPos
    rowStartY = currentY
    // Fila 1
    currentY = Math.max(
      addField4Col('Del. Izq.', form.suspension_delantera_izquierda !== '' ? `${form.suspension_delantera_izquierda} mm` : null, 1, rowStartY),
      addField4Col('Del. Der.', form.suspension_delantera_derecha !== '' ? `${form.suspension_delantera_derecha} mm` : null, 2, rowStartY),
      addField4Col('Tras. Izq.', form.suspension_trasera_izquierda !== '' ? `${form.suspension_trasera_izquierda} mm` : null, 3, rowStartY),
      addField4Col('Tras. Der.', form.suspension_trasera_derecha !== '' ? `${form.suspension_trasera_derecha} mm` : null, 4, rowStartY)
    )
    rowStartY = currentY
    // Fila 2
    currentY = Math.max(
      addField4Col('Dif. Del.', form.suspension_diferencia_delantera !== '' ? `${form.suspension_diferencia_delantera} mm` : null, 1, rowStartY),
      addField4Col('Dif. Tras.', form.suspension_diferencia_trasera !== '' ? `${form.suspension_diferencia_trasera} mm` : null, 2, rowStartY),
      addField4Col('Estado', form.suspension_estado_general, 3, rowStartY)
    )

    // Imagen por defecto de Sistema de Suspensión (reducida)
    try {
      if (currentY > 250) {
        doc.addPage()
        currentY = margin
      }
      currentY += 2
      doc.setTextColor(...mediumGray)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('Diagrama:', margin, currentY)
      currentY += 3
      
      let dataUrlSuspension = preload.suspensionDataUrl.value
      let aspectSuspension = 1
      if (dataUrlSuspension) {
        const dims = await getImageDimensionsFromDataUrl(dataUrlSuspension)
        aspectSuspension = dims.width / dims.height
      } else {
        const imgSuspension = await loadImageFromUrl(IMAGENES_PDF.suspension)
        dataUrlSuspension = imageToDataUrl(imgSuspension, 'image/jpeg', 0.9)
        aspectSuspension = imgSuspension.width / imgSuspension.height
      }
      const maxWidthSuspension = contentWidth
      const maxHeightSuspension = maxHeightDiagramaSmall
      let pdfWidthSuspension = maxWidthSuspension
      let pdfHeightSuspension = maxWidthSuspension / aspectSuspension
      if (pdfHeightSuspension > maxHeightSuspension) {
        pdfHeightSuspension = maxHeightSuspension
        pdfWidthSuspension = maxHeightSuspension * aspectSuspension
      }
      doc.addImage(dataUrlSuspension, 'JPEG', margin, currentY, pdfWidthSuspension, pdfHeightSuspension)
      currentY += pdfHeightSuspension + 3
    } catch (error) {
      console.error('Error cargando imagen de suspensión:', error)
    }

    // Imágenes de Sistema de Suspensión (compactas)
    if (imagenesPorSeccion.value.sistemaSuspension && imagenesPorSeccion.value.sistemaSuspension.length > 0) {
      if (currentY > 250) {
        doc.addPage()
        currentY = margin
      }
      currentY += 2
      doc.setTextColor(...mediumGray)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('Fotos:', margin, currentY)
      currentY += 3
      currentY = await addImageGrid(imagenesPorSeccion.value.sistemaSuspension, currentY, contentWidth, 30)
    }

    yPos = currentY + 3

    // CARROCERÍA - Compacto (solo campos con valores)
    if (yPos > 250) {
      doc.addPage()
      yPos = margin
    }
    yPos = addSection('INSPECCIÓN DE CARROCERÍA', yPos, [147, 51, 234])

    currentY = yPos
    const carroceriaEntries = Object.entries(form.carroceria).filter(([key, value]) => value && value !== '')
    rowStartY = currentY
    
    carroceriaEntries.forEach(([key, value], index) => {
      const col = (index % 4) + 1
      if (index > 0 && index % 4 === 0) {
        rowStartY = currentY
      }
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      const fieldY = addField4Col(label, value, col, rowStartY)
      currentY = Math.max(currentY, fieldY)
      if (currentY > 270) {
        doc.addPage()
        yPos = margin
        yPos = addSection('CARROCERÍA (Cont.)', yPos, [147, 51, 234])
        currentY = yPos
        rowStartY = currentY
      }
    })
    yPos = currentY + 3

    // Imágenes de Carrocería (compactas)
    if (imagenesPorSeccion.value.inspeccionCarroceria && imagenesPorSeccion.value.inspeccionCarroceria.length > 0) {
      if (yPos > 250) {
        doc.addPage()
        yPos = margin
      }
      yPos += 2
      doc.setTextColor(...mediumGray)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('Fotos Carrocería:', margin, yPos)
      yPos += 3
      yPos = await addImageGrid(imagenesPorSeccion.value.inspeccionCarroceria, yPos, contentWidth, 30)
    }
      
    // DIAGRAMA DE CARROCERÍA (siempre visible) y números encima si los hay
    if (yPos > 250) {
      doc.addPage()
      yPos = margin
    }
    yPos += 2
    doc.setTextColor(...mediumGray)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.text('Diagrama:', margin, yPos)
    yPos += 3
    try {
      let dataUrlCarroceria = preload.carroceriaDataUrl.value
      let imgAspect = 1
      if (dataUrlCarroceria) {
        const dims = await getImageDimensionsFromDataUrl(dataUrlCarroceria)
        imgAspect = dims.width / dims.height
      } else {
        const imgCarroceria = await loadImageFromUrl(IMAGENES_PDF.carroceria)
        dataUrlCarroceria = imageToDataUrl(imgCarroceria, 'image/png')
        imgAspect = imgCarroceria.width / imgCarroceria.height
      }
      const maxWidth = contentWidth
      const maxHeight = maxHeightDiagrama
      let pdfWidth = maxWidth
      let pdfHeight = maxWidth / imgAspect
      if (pdfHeight > maxHeight) {
        pdfHeight = maxHeight
        pdfWidth = maxHeight * imgAspect
      }
      doc.addImage(dataUrlCarroceria, 'PNG', margin, yPos, pdfWidth, pdfHeight)
      if (form.carroceriaImagenNumeros && form.carroceriaImagenNumeros.length > 0) {
        form.carroceriaImagenNumeros.forEach((num) => {
          const x = margin + (num.x / 100) * pdfWidth
          const y = yPos + (num.y / 100) * pdfHeight
          const estadoColor = getEstadoColorForPDF(num.numero)
          doc.setFillColor(...estadoColor)
          doc.circle(x, y, 3, 'F')
          doc.setDrawColor(255, 255, 255)
          doc.setLineWidth(0.5)
          doc.circle(x, y, 3, 'S')
          doc.setTextColor(255, 255, 255)
          doc.setFontSize(7)
          doc.setFont('helvetica', 'bold')
          doc.text(String(num.numero), x, y + 1, { align: 'center' })
        })
      }
      yPos += pdfHeight + 3
    } catch (e) {
      console.error('Error cargando diagrama carrocería para PDF:', e)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(...mediumGray)
      doc.text('(Diagrama no disponible)', margin, yPos + 3)
      yPos += 8
    }

    // CHASIS - Compacto (solo campos con valores)
    if (yPos > 250) {
      doc.addPage()
      yPos = margin
    }
    yPos = addSection('INSPECCIÓN DE CHASIS', yPos, [249, 115, 22])

    currentY = yPos
    const chasisEntries = Object.entries(form.chasis).filter(([key, value]) => value && value !== '')
    rowStartY = currentY
    
    chasisEntries.forEach(([key, value], index) => {
      const col = (index % 4) + 1
      if (index > 0 && index % 4 === 0) {
        rowStartY = currentY
      }
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      const fieldY = addField4Col(label, value, col, rowStartY)
      currentY = Math.max(currentY, fieldY)
      if (currentY > 270) {
        doc.addPage()
        yPos = margin
        yPos = addSection('CHASIS (Cont.)', yPos, [249, 115, 22])
        currentY = yPos
        rowStartY = currentY
      }
    })
    yPos = currentY + 3

    // Imagen por defecto de Chasis (siempre intentar mostrar diagrama)
    if (yPos > 250) {
      doc.addPage()
      yPos = margin
    }
    yPos += 2
    doc.setTextColor(...mediumGray)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.text('Diagrama:', margin, yPos)
    yPos += 3
    try {
      let dataUrlChasis = preload.chasisDataUrl.value
      let aspectChasis = 1
      if (dataUrlChasis) {
        const dims = await getImageDimensionsFromDataUrl(dataUrlChasis)
        aspectChasis = dims.width / dims.height
      } else {
        const imgChasis = await loadImageFromUrl(IMAGENES_PDF.chasis)
        dataUrlChasis = imageToDataUrl(imgChasis, 'image/jpeg', 0.9)
        aspectChasis = imgChasis.width / imgChasis.height
      }
      const maxWidthChasis = contentWidth
      const maxHeightChasis = maxHeightDiagrama
      let pdfWidthChasis = maxWidthChasis
      let pdfHeightChasis = maxWidthChasis / aspectChasis
      if (pdfHeightChasis > maxHeightChasis) {
        pdfHeightChasis = maxHeightChasis
        pdfWidthChasis = maxHeightChasis * aspectChasis
      }
      doc.addImage(dataUrlChasis, 'JPEG', margin, yPos, pdfWidthChasis, pdfHeightChasis)
      yPos += pdfHeightChasis + 3
    } catch (error) {
      console.error('Error cargando imagen de chasis para PDF:', error)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(7)
      doc.setTextColor(...mediumGray)
      doc.text('(Diagrama no disponible)', margin, yPos + 3)
      yPos += 8
    }
    
    // Imágenes de Chasis (compactas)
    if (imagenesPorSeccion.value.chasis && imagenesPorSeccion.value.chasis.length > 0) {
      if (yPos > 250) {
        doc.addPage()
        yPos = margin
      }
      yPos += 2
      doc.setTextColor(...mediumGray)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('Fotos Chasis:', margin, yPos)
      yPos += 3
      yPos = await addImageGrid(imagenesPorSeccion.value.chasis, yPos, contentWidth, 30)
    }

    // LLANTAS - Compacto
    if (yPos > 250) {
      doc.addPage()
      yPos = margin
    }
    yPos = addSection('INSPECCIÓN DE NEUMÁTICOS', yPos, [59, 130, 246])

    currentY = yPos
    const llantas = form.llantas
    const posiciones = ['delantera_derecha', 'delantera_izquierda', 'trasera_derecha', 'trasera_izquierda']
    const labels = ['Del. Der.', 'Del. Izq.', 'Tras. Der.', 'Tras. Izq.']
    
    rowStartY = currentY
    let maxY = currentY
    
    posiciones.forEach((pos, index) => {
      const llanta = llantas[pos] || {}
      const col = index + 1
      let colY = rowStartY
      
      doc.setTextColor(...mediumGray)
      doc.setFontSize(6)
      doc.setFont('helvetica', 'bold')
      doc.text(labels[index], getColX(col), colY)
      colY += 3.5
      
      colY = addField('Marca', llanta.marca, getColX(col), colY, 42)
      colY = addField('Medida', llanta.medida, getColX(col), colY, 42)
      colY = addField('Prof.', llanta.profundidad ? `${llanta.profundidad}mm` : null, getColX(col), colY, 42)
      colY = addField('Año', llanta.anioFabricacion || null, getColX(col), colY, 42)
      
      if (llanta.profundidad || llanta.anioFabricacion) {
        const estado = getEstadoNeumatico(llanta)
        if (estado) {
          colY = addField('Estado', estado.texto, getColX(col), colY, 42)
        }
      }
      
      maxY = Math.max(maxY, colY)
    })
    
    currentY = maxY
    yPos = currentY + 3

    // Imagen por defecto de Neumáticos (reducida)
    try {
      if (yPos > 250) {
        doc.addPage()
        yPos = margin
      }
      yPos += 2
      doc.setTextColor(...mediumGray)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('Diagrama:', margin, yPos)
      yPos += 3
      
      let dataUrlNeumaticos = preload.neumaticosDataUrl.value
      let aspectNeumaticos = 1
      if (dataUrlNeumaticos) {
        const dims = await getImageDimensionsFromDataUrl(dataUrlNeumaticos)
        aspectNeumaticos = dims.width / dims.height
      } else {
        const imgNeumaticos = await loadImageFromUrl(IMAGENES_PDF.neumaticos)
        dataUrlNeumaticos = imageToDataUrl(imgNeumaticos, 'image/jpeg', 0.9)
        aspectNeumaticos = imgNeumaticos.width / imgNeumaticos.height
      }
      const maxWidthNeumaticos = contentWidth
      const maxHeightNeumaticos = maxHeightDiagramaSmall
      let pdfWidthNeumaticos = maxWidthNeumaticos
      let pdfHeightNeumaticos = maxWidthNeumaticos / aspectNeumaticos
      if (pdfHeightNeumaticos > maxHeightNeumaticos) {
        pdfHeightNeumaticos = maxHeightNeumaticos
        pdfWidthNeumaticos = maxHeightNeumaticos * aspectNeumaticos
      }
      doc.addImage(dataUrlNeumaticos, 'JPEG', margin, yPos, pdfWidthNeumaticos, pdfHeightNeumaticos)
      yPos += pdfHeightNeumaticos + 3
    } catch (error) {
      console.error('Error cargando imagen de neumáticos:', error)
    }
    
    // Imágenes de Llantas (compactas)
    if (imagenesPorSeccion.value.llantas && imagenesPorSeccion.value.llantas.length > 0) {
      if (yPos > 250) {
        doc.addPage()
        yPos = margin
      }
      yPos += 2
      doc.setTextColor(...mediumGray)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('Fotos Neumáticos:', margin, yPos)
      yPos += 3
      yPos = await addImageGrid(imagenesPorSeccion.value.llantas, yPos, contentWidth, 30)
    }

    // INSPECCIÓN DE MOTOR - Compacto (solo campos con valores)
    if (yPos > 250) {
      doc.addPage()
      yPos = margin
    }
    yPos = addSection('INSPECCIÓN DE MOTOR', yPos, [245, 158, 11])

    currentY = yPos
    const motorEntries = Object.entries(form.motor).filter(([key, value]) => value && value !== '')
    rowStartY = currentY
    
    motorEntries.forEach(([key, value], index) => {
      const col = (index % 4) + 1
      if (index > 0 && index % 4 === 0) {
        rowStartY = currentY
      }
      const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
      const fieldY = addField4Col(label, value, col, rowStartY)
      currentY = Math.max(currentY, fieldY)
      if (currentY > 270) {
        doc.addPage()
        yPos = margin
        yPos = addSection('MOTOR (Cont.)', yPos, [245, 158, 11])
        currentY = yPos
        rowStartY = currentY
      }
    })
    yPos = currentY + 3

    // Escaneo de Errores OBD-II (compacto)
    if (form.escanerMotor) {
      if (yPos > 250) {
        doc.addPage()
        yPos = margin
      }
      yPos += 2
      doc.setTextColor(...mediumGray)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('Escáner OBD-II:', margin, yPos)
      yPos += 3
      doc.setFillColor(...lightGrayBg)
      roundedRect(margin, yPos, contentWidth, 20, 1, 'F')
      doc.setDrawColor(...borderGray)
      roundedRect(margin, yPos, contentWidth, 20, 1, 'S')
      doc.setTextColor(...textColor)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'normal')
      const splitText = doc.splitTextToSize(form.escanerMotor, contentWidth - 10)
      doc.text(splitText, margin + 3, yPos + 4)
      yPos += Math.min(splitText.length * 3, 20) + 3
    }

    // Imágenes de Motor (compactas)
    if (imagenesPorSeccion.value.motor && imagenesPorSeccion.value.motor.length > 0) {
      if (yPos > 250) {
        doc.addPage()
        yPos = margin
      }
      yPos += 2
      doc.setTextColor(...mediumGray)
      doc.setFontSize(7)
      doc.setFont('helvetica', 'bold')
      doc.text('Fotos Motor:', margin, yPos)
      yPos += 3
      yPos = await addImageGrid(imagenesPorSeccion.value.motor, yPos, contentWidth, 30)
    }

    // OBSERVACIONES Y RESUMEN - Compacto
    if (yPos > 250) {
      doc.addPage()
      yPos = margin
    }
    yPos = addSection('OBSERVACIONES Y VALORACIÓN', yPos)

    // Observaciones en cuadro elegante
    doc.setFillColor(...lightGrayBg)
    roundedRect(margin, yPos, contentWidth, 15, 1, 'F')
    doc.setDrawColor(...borderGray)
    roundedRect(margin, yPos, contentWidth, 15, 1, 'S')
    
    doc.setTextColor(...textColor)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    const observaciones = form.observaciones_generales || '-'
    const splitText = doc.splitTextToSize(observaciones, contentWidth - 6)
    doc.text(splitText, margin + 3, yPos + 4)
    yPos += Math.min(splitText.length * 3, 15) + 5

    // Valor Avalúo en cuadro elegante
    if (yPos > 250) {
      doc.addPage()
      yPos = margin
    }
    
    const avaluoWidth = contentWidth
    
    // Valor Avalúo
    doc.setFillColor(...lightGrayBg)
    roundedRect(margin, yPos, avaluoWidth, 18, 1, 'F')
    doc.setDrawColor(...mediumBlue)
    doc.setLineWidth(0.5)
    roundedRect(margin, yPos, avaluoWidth, 18, 1, 'S')
    
    doc.setTextColor(...mediumGray)
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('Valor Avalúo', margin + 3, yPos + 4)
    
    if (form.valorAvaluo) {
      doc.setTextColor(...darkBlue)
      doc.setFontSize(16)
      doc.setFont('helvetica', 'bold')
      doc.text(`$${parseFloat(form.valorAvaluo).toLocaleString('es-CL')}`, margin + 3, yPos + 12)
    } else {
      doc.setTextColor(...mediumGray)
      doc.setFontSize(10)
      doc.text('-', margin + 3, yPos + 12)
    }
    
    yPos += 22

    // Firma del perito elegante
    doc.setDrawColor(...borderGray)
    doc.setLineWidth(0.5)
    doc.line(margin, yPos, margin + 80, yPos)

    doc.setTextColor(...mediumGray)
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Firma del Perito', margin, yPos + 5)
    doc.text(`Fecha: ${new Date().toLocaleDateString('es-CL')}`, margin + 100, yPos + 5)

    // Pie de página elegante en todas las páginas
    const totalPages = doc.internal.pages.length - 1
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i)
      
      // Línea decorativa superior del footer
      doc.setDrawColor(...borderGray)
      doc.setLineWidth(0.3)
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15)
      
      // Fondo del footer
      doc.setFillColor(...lightGrayBg)
      doc.rect(0, pageHeight - 15, pageWidth, 15, 'F')
      
      // Marca y texto
      doc.setTextColor(...darkBlue)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.text('AutoRemates', margin, pageHeight - 8)
      
      doc.setTextColor(...mediumGray)
      doc.setFontSize(8)
      doc.setFont('helvetica', 'normal')
      doc.text('Peritaje Técnico Vehicular', margin + 35, pageHeight - 8)
      
      doc.setTextColor(...mediumGray)
      doc.setFontSize(7)
      doc.text(`Página ${i} de ${totalPages}`, pageWidth - margin, pageHeight - 8, { align: 'right' })
    }

    return doc
  } catch (error) {
    console.error('Error generando PDF:', error)
    throw error
  }
}

// Función para descargar el PDF
const downloadPDF = async () => {
  pdfError.value = null
  isDownloadingPDF.value = true
  try {
    const doc = await generatePDF()
    const filename = `peritaje-${form.patente || 'documento'}-${Date.now()}.pdf`
    doc.save(filename)
  } catch (error) {
    pdfError.value = error?.message || 'Error al generar el PDF. Por favor, intente nuevamente.'
    console.error('Error generando PDF:', error)
  } finally {
    isDownloadingPDF.value = false
  }
}

// Función para vista previa del PDF
const previewPDF = async () => {
  pdfError.value = null
  isDownloadingPDF.value = true
  try {
    const doc = await generatePDF()
    const pdfBlob = doc.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)
    const newWindow = window.open(pdfUrl, '_blank')
    if (!newWindow) {
      pdfError.value = 'Permite las ventanas emergentes para ver la vista previa del PDF.'
    }
    setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000)
  } catch (error) {
    pdfError.value = error?.message || 'Error al generar la vista previa del PDF. Por favor, intente nuevamente.'
    console.error('Error generando PDF:', error)
  } finally {
    isDownloadingPDF.value = false
  }
}

// Funciones para calcular estado de neumáticos
const getEdadNeumatico = (anioFabricacion) => {
  if (!anioFabricacion) return 0
  const anioActual = new Date().getFullYear()
  return anioActual - parseInt(anioFabricacion)
}

const getDescripcionProfundidad = (profundidad) => {
  if (!profundidad || profundidad === 0) return ''
  const prof = parseFloat(profundidad)
  if (prof > 7) return '✅ Nuevo/Excelente'
  if (prof >= 4) return '✅ Bueno'
  if (prof >= 2) return '⚠️ Regular (Precaución)'
  if (prof >= 1.6) return '🔴 Límite Legal'
  return '🔴 Peligroso (< 1.6mm)'
}

const getEstadoNeumatico = (llanta) => {
  const profundidad = parseFloat(llanta.profundidad) || 0
  const edad = getEdadNeumatico(llanta.anioFabricacion)
  
  // Si tiene más de 5 años, está vencido independientemente de la profundidad
  if (edad >= 5) {
    return {
      texto: 'Vencido',
      color: 'bg-red-100 text-red-700',
      dotColor: 'bg-red-500',
      descripcion: `Neumático vencido (${edad} años). El caucho ha perdido sus propiedades químicas. Cambio recomendado.`
    }
  }
  
  // Estados basados en profundidad
  if (profundidad > 7) {
    return {
      texto: 'Excelente',
      color: 'bg-green-100 text-green-700',
      dotColor: 'bg-green-500',
      descripcion: 'Neumático nuevo o con muy poco uso. Profundidad óptima.'
    }
  }
  
  if (profundidad >= 4) {
    return {
      texto: 'Bueno',
      color: 'bg-green-100 text-green-700',
      dotColor: 'bg-green-500',
      descripcion: 'Desgaste normal. Agarre óptimo en seco y mojado.'
    }
  }
  
  if (profundidad >= 2) {
    return {
      texto: 'Precaución',
      color: 'bg-yellow-100 text-yellow-700',
      dotColor: 'bg-yellow-500',
      descripcion: 'Estado crítico. Capacidad de evacuar agua disminuida. Planificar cambio pronto.'
    }
  }
  
  if (profundidad >= 1.6) {
    return {
      texto: 'Límite',
      color: 'bg-red-100 text-red-700',
      dotColor: 'bg-red-500',
      descripcion: 'Límite legal alcanzado. Riesgo de aquaplaning. Cambio inmediato recomendado.'
    }
  }
  
  if (profundidad > 0) {
    return {
      texto: 'Peligroso',
      color: 'bg-red-100 text-red-700',
      dotColor: 'bg-red-500',
      descripcion: 'Neumático liso. Riesgo inminente. Cambio urgente requerido.'
    }
  }
  
  return null
}

onMounted(() => {
  loadAutoInfo()
})
</script>

<style scoped>
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fadeIn {
  animation: fadeIn 0.3s ease-out;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.animate-pulse-slow {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Estilos para las áreas del auto en SVG */
svg rect {
  transition: all 0.3s ease;
}

svg rect:hover {
  filter: brightness(1.1);
  transform: scale(1.05);
}

/* Scrollbar personalizado para las tablas */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animación para las tarjetas de estado */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.estado-item {
  animation: slideIn 0.3s ease-out;
  animation-fill-mode: both;
}

.estado-item:nth-child(1) { animation-delay: 0.01s; }
.estado-item:nth-child(2) { animation-delay: 0.02s; }
.estado-item:nth-child(3) { animation-delay: 0.03s; }
.estado-item:nth-child(4) { animation-delay: 0.04s; }
.estado-item:nth-child(5) { animation-delay: 0.05s; }
.estado-item:nth-child(6) { animation-delay: 0.06s; }
</style>

