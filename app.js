// ==========================================================================
// CRM NOTA DE VENTA — MOTOR MULTI-EMPRESA PRESEA ERP
// Empresas: PASINA S.A. • PALAVERSICH S.A. • PETROBONO S.A.
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  // Estado global de la aplicación
  let currentCompanyKey = "palaversich"; // Empresa seleccionada
  let currentCompany = EMPRESAS_CONFIG[currentCompanyKey];
  
  let currentClient = null;
  let currentSelectedProduct = null;
  let currentItems = [];
  let currentCotizacion = 1450.00;

  // Datos Adicionales exclusivos de Palaversich (vienen vacíos por defecto y son obligatorios)
  let palaExtras = {
    comisionista: false,
    tipoNv: "",
    entrega: "",
    pago: ""
  };

  // ==========================================================================
  // CONFIGURACIÓN DEL SISTEMA Y GESTIÓN DE USUARIO
  // ==========================================================================
  function getSystemConfig() {
    const raw = localStorage.getItem("crm_system_config");
    let cfg = {
      usuario: "JUANLUIS",
      nombreOperador: "",
      empresas: {}
    };
    if (raw) {
      try {
        cfg = { ...cfg, ...JSON.parse(raw) };
      } catch (e) {}
    }
    return cfg;
  }

  function saveSystemConfig(cfg) {
    localStorage.setItem("crm_system_config", JSON.stringify(cfg));
  }

  function getUsuarioActivo() {
    const cfg = getSystemConfig();
    return (cfg.usuario || "JUANLUIS").trim();
  }

  function getEmpresaConfigOverride(empresaKey) {
    const sysCfg = getSystemConfig();
    return (sysCfg.empresas && sysCfg.empresas[empresaKey]) ? sysCfg.empresas[empresaKey] : {};
  }

  function actualizarUIUsuario() {
    const user = getUsuarioActivo();
    const headerUserEl = document.getElementById("header-user-name");
    if (headerUserEl) {
      headerUserEl.textContent = user.toUpperCase();
    }
  }

  // Domicilios de Entrega Presea ERP (domi_entrega_pasina.DBI)
  function getDomiciliosEntregaCliente(clienteCodigo) {
    if (!window.DOMICILIOS_ENTREGA_PASINA) return [];
    const raw = String(clienteCodigo || "").trim();
    const clean = raw.replace(/^0+/, '');
    return window.DOMICILIOS_ENTREGA_PASINA[raw] || 
           window.DOMICILIOS_ENTREGA_PASINA[clean] || 
           (parseInt(raw, 10) ? window.DOMICILIOS_ENTREGA_PASINA[String(parseInt(raw, 10))] : null) || 
           [];
  }

  // Inicializar UI con usuario configurado
  actualizarUIUsuario();

  // Referencias a Elementos DOM del Header
  const companySelect = document.getElementById("company-select");
  const headerBrandLogo = document.getElementById("header-brand-logo");
  const headerCompanyName = document.getElementById("header-company-name");
  const headerCompanySub = document.getElementById("header-company-sub");
  const headerStats = document.getElementById("header-db-stats");
  const badgeActiveEmpresa = document.getElementById("badge-active-empresa");
  const badgeHistorialEmpresa = document.getElementById("badge-historial-empresa");

  // Elementos de Navegación
  const navTabs = document.querySelectorAll(".nav-tab");
  const tabPanes = document.querySelectorAll(".tab-pane");

  // Elementos del Formulario - Cabecera
  const displayFolioNum = document.getElementById("display-folio-num");
  const inputBuscarCliente = document.getElementById("input-buscar-cliente");
  const clienteAutocomplete = document.getElementById("cliente-autocomplete");
  const clienteCuit = document.getElementById("cliente-cuit");
  const clienteDireccion = document.getElementById("cliente-direccion");
  const selectListaPrecios = document.getElementById("select-lista-precios");

  const selectCondicion = document.getElementById("select-condicion");
  const selectMoneda = document.getElementById("select-moneda");
  const groupCotizacion = document.getElementById("group-cotizacion");
  const inputCotizacion = document.getElementById("input-cotizacion");
  const inputDeposito = document.getElementById("input-deposito");
  const listaDepositos = document.getElementById("lista-depositos");
  const inputVendedor = document.getElementById("input-vendedor");

  const inputFechaEmision = document.getElementById("input-fecha-emision");
  const inputFechaEntrega = document.getElementById("input-fecha-entrega");
  const inputTransporte1 = document.getElementById("input-transporte-1");
  const listaTransporte1 = document.getElementById("lista-transporte-1");
  const groupTransporte2 = document.getElementById("group-transporte-2");
  const inputTransporte2 = document.getElementById("input-transporte-2");
  const groupTransporte3 = document.getElementById("group-transporte-3");
  const inputTransporte3 = document.getElementById("input-transporte-3");

  const transporteDomicilio = document.getElementById("transporte-domicilio");
  const clienteCreditoVal = document.getElementById("cliente-credito-val");
  const clienteSaldoVal = document.getElementById("cliente-saldo-val");
  const inputObservaciones = document.getElementById("input-observaciones");
  const badgeDecimalesInfo = document.getElementById("badge-decimales-info");

  // Elementos del Formulario - Artículos
  const inputBuscarProducto = document.getElementById("input-buscar-producto");
  const productoAutocomplete = document.getElementById("producto-autocomplete");
  const prodStockDisp = document.getElementById("prod-stock-disp");
  const labelProdPrecio = document.getElementById("label-prod-precio");
  const prodPrecio = document.getElementById("prod-precio");
  const prodCantidad = document.getElementById("prod-cantidad");
  const prodBonif = document.getElementById("prod-bonif");
  const btnAgregarItem = document.getElementById("btn-agregar-item");
  const btnCancelarEdicion = document.getElementById("btn-cancelar-edicion");
  let editingItemIndex = -1;

  const tablaItemsBody = document.getElementById("tabla-items-body");
  const totSubtotal = document.getElementById("tot-subtotal");
  const totIva = document.getElementById("tot-iva");
  const totTotal = document.getElementById("tot-total");
  const totCurrencyLabel = document.getElementById("tot-currency-label");
  const rowUsdConverted = document.getElementById("row-usd-converted");
  const totConvertedArs = document.getElementById("tot-converted-ars");

  const btnGuardarNv = document.getElementById("btn-guardar-nv");
  const btnVistaPrevia = document.getElementById("btn-vista-previa");
  const btnLimpiarForm = document.getElementById("btn-limpiar-form");

  // Paso 2: Datos Adicionales (Palaversich)
  const cardPaso2DatosAdic = document.getElementById("card-paso-2-datos-adic");
  const labelPasoArticulos = document.getElementById("label-paso-articulos");
  const chkComisionista = document.getElementById("chk-comisionista");

  // Modal Impresión Presea
  const modalImpresion = document.getElementById("modal-impresion");
  const btnCerrarModal = document.getElementById("btn-cerrar-modal");
  const btnCerrarModal2 = document.getElementById("btn-cerrar-modal-2");
  const btnImprimirAhora = document.getElementById("btn-imprimir-ahora");

  // Fechas iniciales
  const today = new Date().toISOString().split("T")[0];
  inputFechaEmision.value = today;
  inputFechaEntrega.value = today;

  // Condiciones de Venta (DB Presea)
  if (typeof condicionesDB !== 'undefined' && Array.isArray(condicionesDB)) {
    selectCondicion.innerHTML = condicionesDB.map(c => 
      `<option value="${c.codigo}">${c.nombre} (${c.dias} días)</option>`
    ).join("");
  }

  // ==========================================================================
  // 1. MOTOR DE CAMBIO DE EMPRESA (MULTI-TENANT / MODO DEMO)
  // ==========================================================================
  function setEmpresaActiva(key) {
    if (!EMPRESAS_CONFIG[key]) return;
    currentCompanyKey = key;
    currentCompany = EMPRESAS_CONFIG[key];

    // Actualizar Encabezado y Marca
    if (currentCompany.logoImg) {
      headerBrandLogo.innerHTML = `<img id="header-brand-logo-img" src="${currentCompany.logoImg}" alt="${currentCompany.nombreCorto}">`;
      headerBrandLogo.style.background = "#ffffff";
    } else {
      headerBrandLogo.textContent = currentCompany.logoLetra;
      headerBrandLogo.style.background = `linear-gradient(135deg, ${currentCompany.color}, ${currentCompany.colorHover})`;
    }
    headerCompanyName.textContent = currentCompany.nombre;
    headerCompanySub.textContent = currentCompany.subtitulo;

    // Badges en tarjetas
    badgeActiveEmpresa.textContent = currentCompany.nombreCorto;
    badgeActiveEmpresa.style.borderColor = currentCompany.color;
    badgeActiveEmpresa.style.color = currentCompany.color;
    badgeHistorialEmpresa.textContent = currentCompany.nombreCorto;
    badgeHistorialEmpresa.style.borderColor = currentCompany.color;
    badgeHistorialEmpresa.style.color = currentCompany.color;

    // Actualizar Listas de Precios disponibles o Precio Maestro (Palaversich)
    const labelLista = document.getElementById("label-lista-precios");
    if (key === 'palaversich') {
      if (labelLista) labelLista.textContent = "Precio Maestro (Palaversich)";
      selectListaPrecios.innerHTML = `
        <option value="PRECIO_1" selected>Precio 1 (Maestro de Productos)</option>
        <option value="PRECIO_2">Precio 2 (Maestro de Productos)</option>
      `;
    } else {
      if (labelLista) labelLista.textContent = "Lista de Precios";
      selectListaPrecios.innerHTML = currentCompany.listasPrecios.map(l => 
        `<option value="${l.codigo}" ${l.codigo === currentCompany.listaDefault ? 'selected' : ''}>${l.codigo} - ${l.nombre}</option>`
      ).join("");
    }

    // Actualizar Depósitos sugeridos (editable y configurable por el usuario)
    const overrides = getEmpresaConfigOverride(key);
    listaDepositos.innerHTML = currentCompany.depositosSugeridos.map(d => `<option value="${d}">`).join("");
    inputDeposito.value = (overrides.depositoDefault !== undefined && overrides.depositoDefault !== "") 
      ? overrides.depositoDefault 
      : currentCompany.depositoDefault;

    // Actualizar Transportes según la empresa
    listaTransporte1.innerHTML = currentCompany.transportesSugeridos.map(t => `<option value="${t.codigo} - ${t.nombre}">`).join("");
    inputTransporte1.value = currentCompany.transportesSugeridos[0] ? `${currentCompany.transportesSugeridos[0].codigo} - ${currentCompany.transportesSugeridos[0].nombre}` : "";
    transporteDomicilio.value = "";

    if (currentCompany.maxTransportes >= 3) {
      // Exclusivo PETROBONO: Transportes 2 y 3 visibles
      groupTransporte2.style.display = "block";
      groupTransporte3.style.display = "block";
    } else {
      groupTransporte2.style.display = "none";
      groupTransporte3.style.display = "none";
    }

    // Paso 2: Datos Adicionales (Exclusivo PALAVERSICH)
    if (cardPaso2DatosAdic) {
      if (currentCompany.tieneDatosAdicionales) {
        cardPaso2DatosAdic.style.display = "block";
        if (labelPasoArticulos) labelPasoArticulos.textContent = "Paso 3: Artículos de la Nota de Venta";
        actualizarIndicadorDatosAdicionales();
      } else {
        cardPaso2DatosAdic.style.display = "none";
        if (labelPasoArticulos) labelPasoArticulos.textContent = "Paso 2: Artículos de la Nota de Venta";
      }
    }

    // Actualizar Condiciones de Venta según la empresa activa
    const condicionesActivas = (window.getCondicionesPorEmpresa) ? window.getCondicionesPorEmpresa(currentCompanyKey) : [];
    if (condicionesActivas && condicionesActivas.length > 0) {
      selectCondicion.innerHTML = condicionesActivas.map(c => 
        `<option value="${c.codigo}">${c.nombre} (${c.dias} días)</option>`
      ).join("");
    }

    // Moneda y cotización default
    selectMoneda.value = currentCompany.monedaDefault;
    onMonedaChange();

    // Vendedor default (configurable)
    const vendedorDef = (overrides.vendedorDefault !== undefined && overrides.vendedorDefault !== "") 
      ? overrides.vendedorDefault 
      : currentCompany.vendedorDefault;
    inputVendedor.value = vendedorDef;
    if (overrides.observacionesDefault) {
      inputObservaciones.value = overrides.observacionesDefault;
    }

    const badgeConfig = document.getElementById("badge-config-empresa");
    if (badgeConfig) {
      badgeConfig.textContent = currentCompany.nombreCorto;
      badgeConfig.style.borderColor = currentCompany.color;
      badgeConfig.style.color = currentCompany.color;
    }
    const cfgEmpLabel = document.getElementById("cfg-empresa-nombre-label");
    if (cfgEmpLabel) {
      cfgEmpLabel.textContent = currentCompany.nombreCorto;
    }

    // Decimales info badge
    badgeDecimalesInfo.textContent = `* Precios de lista con ${currentCompany.decimales} decimales • Presea ERP`;

    // Límite de Crédito (exclusivo Palaversich, oculto en Pasina)
    const labelCredito = document.getElementById("label-credito-cliente");
    const wrapCredito = document.getElementById("wrap-credito-val");
    if (key === 'palaversich') {
      if (labelCredito) labelCredito.textContent = "Límite de Crédito / Saldo";
      if (wrapCredito) wrapCredito.style.display = "inline-flex";
    } else {
      if (labelCredito) labelCredito.textContent = "Saldo en Cuenta Corriente";
      if (wrapCredito) wrapCredito.style.display = "none";
    }

    // Crédito y saldo default
    clienteSaldoVal.textContent = `$ ${currentCompany.saldoDefault}`;
    clienteCreditoVal.textContent = `$ 0.00`;

    // Recalcular correlativo / folio de la Nota de Venta
    updateNextFolio();

    // Actualizar estadísticas de cabecera con tablas Presea
    const clientesList = window.getClientesPorEmpresa(currentCompanyKey);
    const prodsList = window.getProductosPorEmpresa(currentCompanyKey);
    const tablaClie = currentCompany.tablasPresea ? currentCompany.tablasPresea.clientes : "CLIENTES";
    headerStats.textContent = `${clientesList.length.toLocaleString()} Clientes (${tablaClie}) • ${prodsList.length.toLocaleString()} Artículos • Presea ERP`;

    // Limpiar selección actual si no pertenece
    limpiarFormulario(false);

    // Refrescar vistas secundarias si están activas
    const activeTab = document.querySelector(".nav-tab.active");
    if (activeTab) {
      if (activeTab.dataset.tab === "tab-historial") renderHistorial();
      if (activeTab.dataset.tab === "tab-stock") renderCatalogo();
      if (activeTab.dataset.tab === "tab-clientes") renderClientesMaestro();
    }
  }

  // Listener del Selector de Empresa
  companySelect.addEventListener("change", (e) => {
    setEmpresaActiva(e.target.value);
  });

  // ==========================================================================
  // 2. MONEDA Y COTIZACIÓN DEL DÍA (REGLA UNIVERSAL)
  // ==========================================================================
  function onMonedaChange() {
    const isUSD = (selectMoneda.value === "2");
    if (isUSD) {
      groupCotizacion.style.display = "block";
      labelProdPrecio.textContent = "Precio Unit. (USD)";
      totCurrencyLabel.textContent = "TOTAL GENERAL (USD):";
      rowUsdConverted.style.display = "flex";
    } else {
      groupCotizacion.style.display = "none";
      labelProdPrecio.textContent = "Precio Unit. ($)";
      totCurrencyLabel.textContent = "TOTAL GENERAL ($):";
      rowUsdConverted.style.display = "none";
    }
    recalcularTotales();
  }

  selectMoneda.addEventListener("change", onMonedaChange);

  inputCotizacion.addEventListener("input", (e) => {
    const val = parseFloat(e.target.value);
    if (!isNaN(val) && val > 0) {
      currentCotizacion = val;
      recalcularTotales();
    }
  });

  // ==========================================================================
  // 3. GENERACIÓN DE NUMERACIÓN / FOLIO CORRELATIVO
  // ==========================================================================
  function updateNextFolio() {
    const orders = getOrdersHistory(currentCompanyKey);
    const baseCount = orders.length;
    let nextNumStr = "";

    const overrides = getEmpresaConfigOverride(currentCompanyKey);
    const prefijo = (overrides.prefijoFolio !== undefined && overrides.prefijoFolio !== "") 
      ? overrides.prefijoFolio 
      : currentCompany.prefijoFolio;

    if (prefijo) {
      const nextSeq = currentCompany.numeroBase + baseCount;
      nextNumStr = `${prefijo}${String(nextSeq).padStart(5, '0')}`;
    } else {
      const nextSeq = currentCompany.numeroBase + baseCount;
      nextNumStr = String(nextSeq);
    }
    displayFolioNum.textContent = nextNumStr;
  }

  function getOrdersHistory(empresaKey) {
    const list = JSON.parse(localStorage.getItem(`presea_orders_${empresaKey}`) || "[]");
    return list.map(o => {
      if (!o.estado || o.estado.toLowerCase().includes("autorizar")) {
        o.estado = "INGRESADA";
      }
      return o;
    });
  }

  function saveOrdersHistory(empresaKey, orders) {
    localStorage.setItem(`presea_orders_${empresaKey}`, JSON.stringify(orders));
  }

  // ==========================================================================
  // 4. BÚSQUEDA Y AUTOCOMPLETADO DE CLIENTES (CON NAVEGACIÓN POR FLECHAS Y ENTER)
  // ==========================================================================
  let activeClientIndex = -1;

  inputBuscarCliente.addEventListener("input", (e) => {
    activeClientIndex = -1;
    const term = e.target.value.toLowerCase().trim();
    if (term.length < 2) {
      clienteAutocomplete.style.display = "none";
      return;
    }

    const clientesList = window.getClientesPorEmpresa(currentCompanyKey);
    const matches = clientesList.filter(c => 
      (c.nombre && c.nombre.toLowerCase().includes(term)) ||
      (c.codigo && String(c.codigo).includes(term)) ||
      (c.cuit && String(c.cuit).includes(term)) ||
      (c.fantasia && c.fantasia.toLowerCase().includes(term))
    ).slice(0, 15);

    if (matches.length === 0) {
      clienteAutocomplete.innerHTML = `<div class="autocomplete-item" style="color: var(--text-muted);">Sin resultados para "${term}" en ${currentCompany.nombreCorto}</div>`;
    } else {
      clienteAutocomplete.innerHTML = matches.map((c, i) => `
        <div class="autocomplete-item ${i === 0 ? 'selected' : ''}" data-code="${c.codigo}">
          <div class="title">${c.nombre} ${c.fantasia ? `<span style="font-size:11px; color:#38bdf8;">(${c.fantasia})</span>` : ''}</div>
          <div class="subtitle">
            <span><strong>Cód:</strong> ${c.codigo}</span>
            <span><strong>CUIT:</strong> ${c.cuit || 'S/D'}</span>
            <span><strong>Loc:</strong> ${c.localidad || '-'}</span>
          </div>
        </div>
      `).join("");
      activeClientIndex = 0;
    }
    clienteAutocomplete.style.display = "block";
  });

  inputBuscarCliente.addEventListener("keydown", (e) => {
    const items = clienteAutocomplete.querySelectorAll(".autocomplete-item[data-code]");
    if (clienteAutocomplete.style.display === "block" && items.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeClientIndex = (activeClientIndex + 1) % items.length;
        items.forEach((it, i) => it.classList.toggle("selected", i === activeClientIndex));
        items[activeClientIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeClientIndex = (activeClientIndex - 1 + items.length) % items.length;
        items.forEach((it, i) => it.classList.toggle("selected", i === activeClientIndex));
        items[activeClientIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        const target = (activeClientIndex >= 0 && items[activeClientIndex]) ? items[activeClientIndex] : items[0];
        if (target && target.dataset.code) {
          const clientesList = window.getClientesPorEmpresa(currentCompanyKey);
          const cliente = clientesList.find(c => String(c.codigo) === String(target.dataset.code));
          if (cliente) {
            seleccionarCliente(cliente);
          }
          clienteAutocomplete.style.display = "none";
          activeClientIndex = -1;
          enfocarSiguientePaso();
        }
      } else if (e.key === "Escape") {
        clienteAutocomplete.style.display = "none";
        activeClientIndex = -1;
      }
    }
  });

  clienteAutocomplete.addEventListener("click", (e) => {
    const item = e.target.closest(".autocomplete-item");
    if (!item || !item.dataset.code) return;

    const clientesList = window.getClientesPorEmpresa(currentCompanyKey);
    const cliente = clientesList.find(c => String(c.codigo) === String(item.dataset.code));
    if (cliente) {
      seleccionarCliente(cliente);
    }
    clienteAutocomplete.style.display = "none";
    activeClientIndex = -1;
    enfocarSiguientePaso();
  });

  function enfocarSiguientePaso() {
    if (currentCompanyKey === 'palaversich') {
      const firstRadio = document.getElementById("rad-tipo-consignacion");
      const cardPaso2 = document.getElementById("card-paso-2-datos-adic");
      if (cardPaso2) cardPaso2.scrollIntoView({ behavior: 'smooth', block: 'start' });
      if (firstRadio) firstRadio.focus();
    } else {
      inputBuscarProducto.focus();
    }
  }

  function seleccionarCliente(cliente) {
    currentClient = cliente;
    inputBuscarCliente.value = cliente.nombre;
    clienteCuit.value = cliente.cuit || "Sin CUIT registrado";

    // Domicilio oficial extraído del Maestro de Clientes (CLIENTESNV)
    if (clienteDireccion) {
      let domFiscal = (cliente.domicilio || "").trim();
      if (cliente.localidad && cliente.localidad.trim()) {
        domFiscal += (domFiscal ? ' - ' : '') + cliente.localidad.trim();
      }
      if (cliente.provincia && cliente.provincia.trim() && !domFiscal.toLowerCase().includes(cliente.provincia.trim().toLowerCase())) {
        domFiscal += `, ${cliente.provincia.trim()}`;
      }
      if (cliente.cp && cliente.cp.trim() && !domFiscal.includes(cliente.cp.trim())) {
        domFiscal += ` (CP ${cliente.cp.trim()})`;
      }
      clienteDireccion.value = domFiscal || "-";
    }

    // Asignar lista de precios del cliente si existe
    if (cliente.lista) {
      const matchedOpt = Array.from(selectListaPrecios.options).find(o => o.value === cliente.lista);
      if (matchedOpt) {
        selectListaPrecios.value = cliente.lista;
      }
    }

    // Datos de transporte del cliente
    if (cliente.transporte_nombre) {
      inputTransporte1.value = `${cliente.transporte || ''} - ${cliente.transporte_nombre}`;
    }

    // Domicilio de Entrega desde domi_entrega_pasina.DBI
    const domisEntrega = getDomiciliosEntregaCliente(cliente.codigo);
    const datalistDomi = document.getElementById("lista-domi-entrega");
    if (datalistDomi) {
      datalistDomi.innerHTML = domisEntrega.map(d => {
        const full = d.domicilio + (d.localidad ? ` - ${d.localidad}` : '') + (d.cp ? ` (CP ${d.cp})` : '');
        return `<option value="${full}">${d.codigo ? d.codigo + ': ' : ''}${d.domicilio}</option>`;
      }).join("");
    }

    if (domisEntrega.length > 0) {
      // Domicilio de entrega oficial de Presea (domi_entrega_pasina.DBI)
      const d0 = domisEntrega[0];
      const primaryDomi = d0.domicilio + (d0.localidad ? ` - ${d0.localidad}` : '');
      transporteDomicilio.value = primaryDomi;
    } else if (cliente.domicilio) {
      transporteDomicilio.value = cliente.domicilio + (cliente.localidad ? ` - ${cliente.localidad}` : '');
    } else {
      transporteDomicilio.value = "";
    }

    // Datos crediticios (Límite de crédito exclusivo Palaversich)
    if (currentCompanyKey === 'palaversich' && cliente.credito !== undefined) {
      clienteCreditoVal.textContent = `$ ${cliente.credito.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
    }
    if (cliente.saldo !== undefined) {
      clienteSaldoVal.textContent = `$ ${cliente.saldo.toLocaleString('es-AR', {minimumFractionDigits: 2})}`;
    }
  }

  // ==========================================================================
  // 5. BÚSQUEDA Y SELECCIÓN DE ARTÍCULOS (CON NAVEGACIÓN POR FLECHAS Y ENTER)
  // ==========================================================================
  let activeProductIndex = -1;

  inputBuscarProducto.addEventListener("input", (e) => {
    activeProductIndex = -1;
    const term = e.target.value.toLowerCase().trim();
    if (term.length < 2) {
      productoAutocomplete.style.display = "none";
      return;
    }

    const prodsList = window.getProductosPorEmpresa(currentCompanyKey);
    const matches = prodsList.filter(p => 
      (p.detalle && p.detalle.toLowerCase().includes(term)) ||
      (p.codigo && String(p.codigo).toLowerCase().includes(term)) ||
      (p.cod_alfa && String(p.cod_alfa).toLowerCase().includes(term))
    ).slice(0, 15);

    const isUSD = (selectMoneda.value === "2");
    const dec = currentCompany.decimales;

    if (matches.length === 0) {
      productoAutocomplete.innerHTML = `<div class="autocomplete-item" style="color: var(--text-muted);">Sin artículos encontrados</div>`;
    } else {
      productoAutocomplete.innerHTML = matches.map((p, i) => {
        let displayPrice = p.precio;
        if (isUSD) displayPrice = p.precio / currentCotizacion;
        return `
          <div class="autocomplete-item ${i === 0 ? 'selected' : ''}" data-code="${p.codigo}">
            <div class="title">${p.detalle}</div>
            <div class="subtitle">
              <span><strong>Cód:</strong> ${p.codigo}</span>
              <span><strong>Rubro:</strong> ${p.rubro || '-'}</span>
              <span style="color: ${p.stock > 0 ? '#34d399' : '#f87171'}"><strong>Stock:</strong> ${p.stock}</span>
              <span style="color: #38bdf8;"><strong>Precio:</strong> ${isUSD ? 'u$s' : '$'} ${displayPrice.toFixed(dec)}</span>
            </div>
          </div>
        `;
      }).join("");
      activeProductIndex = 0;
    }
    productoAutocomplete.style.display = "block";
  });

  inputBuscarProducto.addEventListener("keydown", (e) => {
    const items = productoAutocomplete.querySelectorAll(".autocomplete-item[data-code]");
    if (productoAutocomplete.style.display === "block" && items.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        activeProductIndex = (activeProductIndex + 1) % items.length;
        items.forEach((it, i) => it.classList.toggle("selected", i === activeProductIndex));
        items[activeProductIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        activeProductIndex = (activeProductIndex - 1 + items.length) % items.length;
        items.forEach((it, i) => it.classList.toggle("selected", i === activeProductIndex));
        items[activeProductIndex].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter") {
        e.preventDefault();
        const target = (activeProductIndex >= 0 && items[activeProductIndex]) ? items[activeProductIndex] : items[0];
        if (target && target.dataset.code) {
          const prodsList = window.getProductosPorEmpresa(currentCompanyKey);
          const prod = prodsList.find(p => String(p.codigo) === String(target.dataset.code));
          if (prod) {
            seleccionarProducto(prod);
          }
          productoAutocomplete.style.display = "none";
          activeProductIndex = -1;
        }
      } else if (e.key === "Escape") {
        productoAutocomplete.style.display = "none";
        activeProductIndex = -1;
      }
    }
  });

  productoAutocomplete.addEventListener("click", (e) => {
    const item = e.target.closest(".autocomplete-item");
    if (!item || !item.dataset.code) return;

    const prodsList = window.getProductosPorEmpresa(currentCompanyKey);
    const prod = prodsList.find(p => String(p.codigo) === String(item.dataset.code));
    if (prod) {
      seleccionarProducto(prod);
    }
    productoAutocomplete.style.display = "none";
    activeProductIndex = -1;
  });

  function seleccionarProducto(prod) {
    currentSelectedProduct = prod;
    inputBuscarProducto.value = prod.detalle;
    prodStockDisp.value = `${prod.stock} u.`;

    const isUSD = (selectMoneda.value === "2");
    const dec = currentCompany.decimales;
    
    let basePrice = prod.precio;
    if (currentCompanyKey === 'palaversich') {
      const tipoPrecio = selectListaPrecios.value;
      if (tipoPrecio === 'PRECIO_2') {
        basePrice = prod.precio_2 || prod.precio2 || prod.precio;
      } else {
        basePrice = prod.precio_1 || prod.precio1 || prod.precio;
      }
    }
    
    if (isUSD) basePrice = basePrice / currentCotizacion;

    prodPrecio.value = basePrice > 0 ? basePrice.toFixed(dec) : "0.00";
    prodCantidad.value = 1;
    prodBonif.value = "0.00";
    prodCantidad.focus();
  }

  selectListaPrecios.addEventListener("change", () => {
    if (currentSelectedProduct) {
      seleccionarProducto(currentSelectedProduct);
    }
  });

  // Permitir agregar con Enter en cantidad o precio
  [prodCantidad, prodPrecio, prodBonif].forEach(inp => {
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        btnAgregarItem.click();
      }
    });
  });

  // ==========================================================================
  // 6. AGREGAR ÍTEM A LA NOTA DE VENTA
  // ==========================================================================
  // Helper para restaurar el botón de agregar
  function resetearBotonAgregar() {
    editingItemIndex = -1;
    btnAgregarItem.className = "btn btn-primary";
    btnAgregarItem.style.background = "";
    btnAgregarItem.style.borderColor = "";
    btnAgregarItem.style.color = "";
    btnAgregarItem.style.fontWeight = "";
    btnAgregarItem.innerHTML = `<i class="fa-solid fa-plus"></i> <span id="btn-agregar-item-text">Agregar</span>`;
    if (btnCancelarEdicion) {
      btnCancelarEdicion.style.display = "none";
    }
  }

  // 6. AGREGAR O ACTUALIZAR ÍTEM EN LA NOTA DE VENTA
  // ==========================================================================
  btnAgregarItem.addEventListener("click", () => {
    if (!validarDatosAdicionalesPalaversich()) return;

    if (!currentSelectedProduct) {
      alert("Por favor busque y seleccione un artículo de la lista.");
      inputBuscarProducto.focus();
      return;
    }

    const cant = parseFloat(prodCantidad.value);
    const precio = parseFloat(prodPrecio.value);
    const bonif = parseFloat(prodBonif.value) || 0.0;

    if (isNaN(cant) || cant <= 0) {
      alert("Ingrese una cantidad válida mayor a cero.");
      prodCantidad.focus();
      return;
    }

    if (isNaN(precio) || precio < 0) {
      alert("Ingrese un precio unitario válido.");
      prodPrecio.focus();
      return;
    }

    const subtotalBruto = cant * precio;
    const subtotalNeto = subtotalBruto * (1 - (bonif / 100));

    if (editingItemIndex >= 0 && editingItemIndex < currentItems.length) {
      // Modo Edición / Modificación: Actualizar en la misma posición sin duplicar ni borrar nada
      currentItems[editingItemIndex] = {
        codigo: currentSelectedProduct.codigo,
        detalle: currentSelectedProduct.detalle,
        rubro: currentSelectedProduct.rubro || "-",
        cantidad: cant,
        precio: precio,
        bonif: bonif,
        iva: currentSelectedProduct.iva || 21.0,
        subtotal: subtotalNeto
      };
      resetearBotonAgregar();
    } else {
      // Modo Agregar: Verificar si ya existe el ítem para sumar cantidad o agregar nuevo
      const existingIndex = currentItems.findIndex(i => String(i.codigo) === String(currentSelectedProduct.codigo));
      if (existingIndex >= 0) {
        currentItems[existingIndex].cantidad += cant;
        currentItems[existingIndex].precio = precio;
        currentItems[existingIndex].bonif = bonif;
        currentItems[existingIndex].subtotal = (currentItems[existingIndex].cantidad * precio) * (1 - (bonif / 100));
      } else {
        currentItems.push({
          codigo: currentSelectedProduct.codigo,
          detalle: currentSelectedProduct.detalle,
          rubro: currentSelectedProduct.rubro || "-",
          cantidad: cant,
          precio: precio,
          bonif: bonif,
          iva: currentSelectedProduct.iva || 21.0,
          subtotal: subtotalNeto
        });
      }
    }

    renderItemsTable();
    recalcularTotales();

    // Limpiar selector de artículo
    currentSelectedProduct = null;
    inputBuscarProducto.value = "";
    prodStockDisp.value = "";
    prodPrecio.value = "";
    prodCantidad.value = 1;
    prodBonif.value = "0.00";
    inputBuscarProducto.focus();
  });

  if (btnCancelarEdicion) {
    btnCancelarEdicion.addEventListener("click", () => {
      window.cancelarEdicion();
    });
  }

  window.cancelarEdicion = function() {
    resetearBotonAgregar();
    currentSelectedProduct = null;
    inputBuscarProducto.value = "";
    prodStockDisp.value = "";
    prodPrecio.value = "";
    prodCantidad.value = 1;
    prodBonif.value = "0.00";
    renderItemsTable();
    inputBuscarProducto.focus();
  };

  // Cargar ítem al formulario para modificarlo
  window.editarItem = function(idx) {
    if (idx < 0 || idx >= currentItems.length) return;
    const item = currentItems[idx];
    editingItemIndex = idx;

    // Configurar el producto seleccionado actual
    currentSelectedProduct = {
      codigo: item.codigo,
      detalle: item.detalle,
      rubro: item.rubro || "-",
      precio: item.precio,
      iva: item.iva || 21.0,
      stock: "-"
    };

    const dec = currentCompany ? currentCompany.decimales : 2;
    inputBuscarProducto.value = `[${item.codigo}] ${item.detalle}`;
    prodStockDisp.value = "-";
    prodPrecio.value = item.precio.toFixed(dec);
    prodCantidad.value = item.cantidad;
    prodBonif.value = (item.bonif || 0).toFixed(2);

    // Cambiar estado del botón de acción
    btnAgregarItem.className = "btn btn-warning";
    btnAgregarItem.style.background = "#f59e0b";
    btnAgregarItem.style.borderColor = "#d97706";
    btnAgregarItem.style.color = "#000000";
    btnAgregarItem.style.fontWeight = "bold";
    btnAgregarItem.innerHTML = `<i class="fa-solid fa-check"></i> <span id="btn-agregar-item-text">Actualizar</span>`;

    if (btnCancelarEdicion) {
      btnCancelarEdicion.style.display = "inline-flex";
    }

    renderItemsTable();

    // Foco en la cantidad y selección para edición inmediata
    prodCantidad.focus();
    prodCantidad.select();
  };

  function renderItemsTable() {
    if (currentItems.length === 0) {
      tablaItemsBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 30px;">
            <i class="fa-solid fa-cart-arrow-down" style="font-size: 24px; opacity: 0.4; display: block; margin-bottom: 8px;"></i>
            No hay productos agregados a la Nota de Venta aún.
          </td>
        </tr>
      `;
      return;
    }

    const isUSD = (selectMoneda.value === "2");
    const currSign = isUSD ? "u$s" : "$";
    const dec = currentCompany.decimales;

    tablaItemsBody.innerHTML = currentItems.map((item, idx) => {
      const isEditing = (idx === editingItemIndex);
      const rowStyle = isEditing 
        ? `background: rgba(245, 158, 11, 0.18); outline: 1px solid rgba(245, 158, 11, 0.6); box-shadow: inset 4px 0 0 #f59e0b;` 
        : ``;

      return `
      <tr style="${rowStyle}">
        <td>
          <strong style="color: ${isEditing ? '#fbbf24' : '#cbd5e1'}; font-family: monospace;">${item.codigo}</strong>
          ${isEditing ? `<span style="font-size: 10px; background: #f59e0b; color: #000; font-weight: bold; padding: 1px 5px; border-radius: 4px; margin-left: 4px;">Editando</span>` : ''}
        </td>
        <td><span style="font-weight: 600;">${item.detalle}</span></td>
        <td><span style="font-size: 11.5px; color: #94a3b8;">${item.rubro}</span></td>
        <td style="text-align: center; font-weight: 700; ${isEditing ? 'color: #fbbf24;' : ''}">${item.cantidad}</td>
        <td style="text-align: right; font-family: monospace;">${currSign} ${item.precio.toFixed(dec)}</td>
        <td style="text-align: center;">${item.bonif > 0 ? `<span style="color: #f59e0b; font-weight: bold;">${item.bonif.toFixed(2)}%</span>` : '0%'}</td>
        <td style="text-align: right; font-weight: 700; color: #34d399; font-family: monospace;">${currSign} ${item.subtotal.toFixed(2)}</td>
        <td style="text-align: center; white-space: nowrap;">
          <button type="button" class="btn btn-warning btn-sm" onclick="window.editarItem(${idx})" style="padding: 4px 8px; border-radius: 6px; margin-right: 4px; background: rgba(245, 158, 11, 0.2); border: 1px solid rgba(245, 158, 11, 0.5); color: #fbbf24;" title="Modificar este artículo">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button" class="btn btn-danger btn-sm" onclick="window.eliminarItem(${idx})" style="padding: 4px 8px; border-radius: 6px; background: rgba(239, 68, 68, 0.2); border: 1px solid rgba(239, 68, 68, 0.5); color: #f87171;" title="Eliminar este artículo">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
      `;
    }).join("");
  }

  window.eliminarItem = function(index) {
    if (editingItemIndex === index) {
      window.cancelarEdicion();
    } else if (editingItemIndex > index) {
      editingItemIndex--;
    }
    currentItems.splice(index, 1);
    renderItemsTable();
    recalcularTotales();
  };

  // ==========================================================================
  // 7. CÁLCULO DE TOTALES (NETO, IVA, CONVERSIÓN USD)
  // ==========================================================================
  function recalcularTotales() {
    const isUSD = (selectMoneda.value === "2");
    const currSign = isUSD ? "u$s" : "$";

    const subtotal = currentItems.reduce((acc, it) => acc + it.subtotal, 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    totSubtotal.textContent = `${currSign} ${subtotal.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    totIva.textContent = `${currSign} ${iva.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    totTotal.textContent = `${currSign} ${total.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;

    if (isUSD) {
      const totalPesos = total * currentCotizacion;
      totConvertedArs.textContent = `$ ${totalPesos.toLocaleString('es-AR', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (Cotiz: $${currentCotizacion.toFixed(2)})`;
    }
  }

  // ==========================================================================
  // 8. PASO 2: DATOS ADICIONALES (EXCLUSIVO PALAVERSICH)
  // ==========================================================================
  function actualizarIndicadorDatosAdicionales() {
    const badge = document.getElementById("badge-datos-adic-status");
    const card = document.getElementById("card-paso-2-datos-adic");
    if (!badge || !card) return;

    const estaCompleto = Boolean(palaExtras.tipoNv && palaExtras.entrega && palaExtras.pago);
    if (estaCompleto) {
      card.style.borderLeft = "4px solid #10b981";
      badge.style.color = "#34d399";
      badge.innerHTML = `<i class="fa-solid fa-circle-check"></i> Paso 2 Completo (${palaExtras.tipoNv} • ${palaExtras.entrega} • ${palaExtras.pago}${palaExtras.comisionista ? ' • Comisionista' : ''})`;
    } else {
      card.style.borderLeft = "4px solid #f59e0b";
      badge.style.color = "#f59e0b";
      badge.innerHTML = `⚠️ Incompleto: Seleccione Tipo de NV, Forma de Entrega y Medio de Pago para continuar`;
    }
  }

  function validarDatosAdicionalesPalaversich() {
    if (currentCompanyKey === 'palaversich') {
      if (!palaExtras.tipoNv || !palaExtras.entrega || !palaExtras.pago) {
        const card = document.getElementById("card-paso-2-datos-adic");
        if (card) {
          card.scrollIntoView({ behavior: 'smooth', block: 'center' });
          card.style.boxShadow = "0 0 15px rgba(245, 158, 11, 0.4)";
          setTimeout(() => { card.style.boxShadow = ""; }, 1800);
        }
        alert("⚠️ ATENCIÓN: Para Palaversich S.A., los 'Datos adicionales' son el Paso 2 y deben completarse obligatoriamente antes de cargar los artículos.\n\nPor favor seleccione:\n• 1. Tipo de Nota de Venta\n• 2. Forma de Entrega\n• 3. Medio de Pago");
        return false;
      }
    }
    return true;
  }

  // Listener para capturar cualquier cambio en los radios o checkbox de Paso 2
  document.querySelectorAll('input[name="rad-tipo-nv"], input[name="rad-entrega"], input[name="rad-pago"]').forEach(r => {
    r.addEventListener("change", () => {
      const selTipo = document.querySelector('input[name="rad-tipo-nv"]:checked');
      const selEntrega = document.querySelector('input[name="rad-entrega"]:checked');
      const selPago = document.querySelector('input[name="rad-pago"]:checked');

      palaExtras.tipoNv = selTipo ? selTipo.value : "";
      palaExtras.entrega = selEntrega ? selEntrega.value : "";
      palaExtras.pago = selPago ? selPago.value : "";
      palaExtras.comisionista = chkComisionista ? chkComisionista.checked : false;

      actualizarIndicadorDatosAdicionales();
    });
  });

  if (chkComisionista) {
    chkComisionista.addEventListener("change", () => {
      palaExtras.comisionista = chkComisionista.checked;
      actualizarIndicadorDatosAdicionales();
    });
  }

  // ==========================================================================
  // 9. GUARDAR NOTA DE VENTA
  // ==========================================================================
  btnGuardarNv.addEventListener("click", () => {
    if (!currentClient) {
      alert("Error: Debe seleccionar un cliente antes de guardar la Nota de Venta.");
      inputBuscarCliente.focus();
      return;
    }

    if (currentItems.length === 0) {
      alert("Error: Ingrese al menos un artículo a la Nota de Venta.");
      inputBuscarProducto.focus();
      return;
    }

    const isUSD = (selectMoneda.value === "2");
    const subtotal = currentItems.reduce((acc, it) => acc + it.subtotal, 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;
    const nroComprobante = displayFolioNum.textContent.trim();

    const nuevaOrden = {
      empresa: currentCompanyKey,
      numero: nroComprobante,
      fecha: inputFechaEmision.value,
      fecha_entrega: inputFechaEntrega.value,
      cliente: {
        codigo: currentClient.codigo,
        nombre: currentClient.nombre,
        cuit: currentClient.cuit || "",
        domicilio: currentClient.domicilio || "",
        localidad: currentClient.localidad || ""
      },
      lista_precios: selectListaPrecios.value,
      condicion_id: selectCondicion.value,
      condicion_nombre: selectCondicion.options[selectCondicion.selectedIndex] ? selectCondicion.options[selectCondicion.selectedIndex].text : "CONTADO",
      deposito: inputDeposito.value.trim() || currentCompany.depositoDefault,
      moneda_id: selectMoneda.value,
      moneda_nombre: isUSD ? "Dólares Estadoun." : "Pesos",
      cotizacion_usd: isUSD ? currentCotizacion : 1.0,
      usuario: getUsuarioActivo(),
      vendedor: inputVendedor.value.trim(),
      transportes: {
        transporte_1: inputTransporte1.value.trim(),
        transporte_2: inputTransporte2.value.trim(),
        transporte_3: inputTransporte3.value.trim(),
        domicilio_entrega: transporteDomicilio.value.trim()
      },
      pala_extras: currentCompanyKey === 'palaversich' ? { ...palaExtras } : null,
      observaciones: inputObservaciones.value.trim(),
      items: JSON.parse(JSON.stringify(currentItems)),
      subtotal: subtotal,
      iva: iva,
      total: total,
      estado: "INGRESADA",
      fecha_creacion: new Date().toISOString()
    };

    // Guardar en el histórico de la empresa activa
    const orders = getOrdersHistory(currentCompanyKey);
    orders.unshift(nuevaOrden);
    saveOrdersHistory(currentCompanyKey, orders);

    alert(`✅ Nota de Venta ${nroComprobante} registrada exitosamente para ${currentCompany.nombreCorto}.`);
    
    // Abrir automáticamente la vista previa oficial para imprimir/ver
    abrirModalImpresion(nuevaOrden);

    // Limpiar para cargar una nueva
    limpiarFormulario(true);
  });

  // ==========================================================================
  // 10. VISTA PREVIA Y COMPROBANTE OFICIAL PRESEA
  // ==========================================================================
  btnVistaPrevia.addEventListener("click", () => {
    if (!currentClient && currentItems.length === 0) {
      // Si el form está vacío, abrir la última orden guardada si existe
      const orders = getOrdersHistory(currentCompanyKey);
      if (orders.length > 0) {
        abrirModalImpresion(orders[0]);
        return;
      }
      // Si aún no se creó ninguna orden, mostrar comprobante oficial de muestra (idéntico a NV.pdf)
      const sampleItems = [
        { codigo: "100", detalle: "RAID MMM MAX AERO 360/12 U", cantidad: 12, precio: 61.04, bonif: 8, subtotal: 732.53 },
        { codigo: "102", detalle: "BLEM ACRILICO INC.BOTELLA 900 CC", cantidad: 12, precio: 97.11, bonif: 0, subtotal: 1165.41 },
        { codigo: "780099873", detalle: "FUYI FIK AERO NUEVO ACUOSA 360 ML/12", cantidad: 24, precio: 41.79, bonif: 0, subtotal: 1003.01 }
      ];
      const sampleOrden = {
        empresa: currentCompanyKey,
        numero: displayFolioNum ? displayFolioNum.textContent.trim() : "100127312",
        fecha: inputFechaEmision.value || today,
        fecha_entrega: inputFechaEntrega.value || today,
        cliente: { codigo: "20", nombre: "DAMM ALFREDO", domicilio: "CHICLANA", localidad: "(8000) BAHIA BLANCA BUENOS AIRES", cuit: "20-12221510-6", saldo: "53947.12" },
        lista_precios: currentCompany.listaDefault,
        condicion_nombre: "CONTADO",
        deposito: currentCompany.depositoDefault,
        moneda_id: currentCompany.monedaDefault,
        moneda_nombre: currentCompany.monedaDefault === "2" ? "Dólares Estadoun." : "Pesos",
        cotizacion_usd: currentCotizacion,
        usuario: getUsuarioActivo(),
        vendedor: currentCompany.vendedorDefault,
        transportes: { transporte_1: "Retira Cobro Vendedor", domicilio_entrega: "PELLEGRINI 64 - SANTA ROSA (CP 6300)" },
        pala_extras: currentCompanyKey === 'palaversich' ? { tipoNv: 'NV Consignación', entrega: 'Retira Cliente', pago: 'Pago Cheque', comisionista: false } : null,
        observaciones: "ENTREGA SUCURSAL PELLEGRINI 64 – SANTA ROSA –",
        items: sampleItems,
        subtotal: 2900.95,
        iva: 560.46,
        total: 3229.34,
        estado: "INGRESADA"
      };
      abrirModalImpresion(sampleOrden);
      return;
    }

    const isUSD = (selectMoneda.value === "2");
    const subtotal = currentItems.reduce((acc, it) => acc + it.subtotal, 0);
    const iva = subtotal * 0.21;
    const total = subtotal + iva;

    const dummyOrden = {
      empresa: currentCompanyKey,
      numero: displayFolioNum.textContent.trim(),
      fecha: inputFechaEmision.value,
      fecha_entrega: inputFechaEntrega.value,
      cliente: currentClient || { nombre: "CLIENTE MOSTRADOR", domicilio: "-", localidad: "-", cuit: "00-00000000-0" },
      lista_precios: selectListaPrecios.value,
      condicion_nombre: selectCondicion.options[selectCondicion.selectedIndex] ? selectCondicion.options[selectCondicion.selectedIndex].text : "CONTADO",
      deposito: inputDeposito.value.trim() || currentCompany.depositoDefault,
      moneda_id: selectMoneda.value,
      moneda_nombre: isUSD ? "Dólares Estadoun." : "Pesos",
      cotizacion_usd: isUSD ? currentCotizacion : 1.0,
      usuario: getUsuarioActivo(),
      vendedor: inputVendedor.value.trim(),
      transportes: {
        transporte_1: inputTransporte1.value.trim(),
        transporte_2: inputTransporte2.value.trim(),
        transporte_3: inputTransporte3.value.trim(),
        domicilio_entrega: transporteDomicilio.value.trim()
      },
      pala_extras: currentCompanyKey === 'palaversich' ? { ...palaExtras } : null,
      observaciones: inputObservaciones.value.trim() || "-",
      items: currentItems,
      subtotal: subtotal,
      iva: iva,
      total: total,
      estado: "INGRESADA"
    };

    abrirModalImpresion(dummyOrden);
  });

  function abrirModalImpresion(orden) {
    const cfg = EMPRESAS_CONFIG[orden.empresa] || currentCompany;
    const isUSD = (orden.moneda_id === "2");
    const currSign = isUSD ? "u$s" : "$";
    const dec = cfg.decimales;

    // Membrete de la Empresa
    const printLogoImg = document.getElementById("presea-print-logo-img");
    if (printLogoImg) {
      printLogoImg.src = cfg.logoImg || "logo_palaversich.png";
      printLogoImg.alt = cfg.nombreCorto;
    }
    // Gota de agua oficial en el comprobante
    const watermarkImg = document.getElementById("presea-watermark-img");
    if (watermarkImg) {
      watermarkImg.src = cfg.logoImg || "logo_palaversich.png";
    }
    document.getElementById("presea-print-company-name").textContent = cfg.nombre;
    document.getElementById("presea-print-company-sub").textContent = cfg.subtitulo;
    document.getElementById("presea-print-company-domicilio").textContent = cfg.domicilio;
    document.getElementById("presea-print-company-cuit").textContent = cfg.cuit;

    // Folio y Fecha
    document.getElementById("presea-print-num").textContent = orden.numero;
    document.getElementById("presea-print-date").textContent = orden.fecha ? orden.fecha.split("-").reverse().join("/") : today;

    // Cotización si es USD
    const cotizLine = document.getElementById("presea-print-cotiz-line");
    if (isUSD) {
      cotizLine.style.display = "block";
      document.getElementById("presea-print-cotiz-val").textContent = orden.cotizacion_usd.toFixed(2);
    } else {
      cotizLine.style.display = "none";
    }

    // Ficha de Cliente
    document.getElementById("presea-client-nombre").textContent = orden.cliente.nombre;
    document.getElementById("presea-client-domicilio").textContent = orden.cliente.domicilio || "-";
    document.getElementById("presea-client-localidad").textContent = orden.cliente.localidad || "-";
    document.getElementById("presea-client-cuit").textContent = orden.cliente.cuit || "S/D";
    document.getElementById("presea-client-condicion").textContent = orden.condicion_nombre || "CONTADO";

    // Ocultar Lista para Palaversich
    const wrapLista = document.getElementById("voucher-wrap-lista");
    if (wrapLista) {
      if (orden.empresa === 'palaversich') {
        wrapLista.style.display = "none";
      } else {
        wrapLista.style.display = "block";
        const listaEl = document.getElementById("presea-client-lista");
        if (listaEl) listaEl.textContent = orden.lista_precios || cfg.listaDefault;
      }
    }

    document.getElementById("presea-client-deposito").textContent = orden.deposito || cfg.depositoDefault;
    document.getElementById("presea-client-moneda").textContent = orden.moneda_nombre || "Pesos";

    // Transporte(s)
    let transText = orden.transportes.transporte_1 || "-";
    if (orden.empresa === 'petrobono') {
      if (orden.transportes.transporte_2 && orden.transportes.transporte_2 !== '0') transText += ` | Chof: ${orden.transportes.transporte_2}`;
      if (orden.transportes.transporte_3 && orden.transportes.transporte_3 !== '0') transText += ` | Cist: ${orden.transportes.transporte_3}`;
    }
    document.getElementById("presea-client-transporte").textContent = transText;

    // Domicilio de entrega en el comprobante oficial
    const domiEntregaVal = (orden.transportes && orden.transportes.domicilio_entrega) || orden.domicilio_entrega || "";
    const domiEntregaEl = document.getElementById("presea-client-domi-entrega");
    const wrapDomiEntrega = document.getElementById("voucher-wrap-domi-entrega");
    if (domiEntregaVal && domiEntregaVal.trim() && domiEntregaVal.trim() !== "-") {
      if (domiEntregaEl) domiEntregaEl.textContent = domiEntregaVal.trim();
      if (wrapDomiEntrega) wrapDomiEntrega.style.display = "flex";
    } else {
      if (wrapDomiEntrega) wrapDomiEntrega.style.display = "none";
    }

    // Bloque exclusivo Palaversich
    const palaPrintBox = document.getElementById("presea-print-pala-extras");
    if (orden.pala_extras) {
      palaPrintBox.style.display = "block";
      document.getElementById("presea-client-extras-val").textContent = `${orden.pala_extras.tipoNv} | ${orden.pala_extras.entrega} | ${orden.pala_extras.pago}${orden.pala_extras.comisionista ? ' (Es Comisionista)' : ''}`;
    } else {
      palaPrintBox.style.display = "none";
    }

    // Renglones de Productos
    const tbody = document.getElementById("presea-items-tbody");
    tbody.innerHTML = (orden.items || []).map(it => `
      <tr>
        <td style="font-family: Arial, monospace; font-weight: bold;">${it.codigo}</td>
        <td><strong>${it.detalle}</strong></td>
        <td style="text-align: right; font-weight: bold;">${Number(it.cantidad).toFixed(2)}</td>
        <td style="text-align: right;">${Number(it.cantidad).toFixed(2)}</td>
        <td style="text-align: right; font-family: Arial, monospace;">${it.precio.toFixed(dec)}</td>
        <td style="text-align: right;">${it.bonif > 0 ? it.bonif.toFixed(2) + '%' : '0.00'}</td>
        <td style="text-align: right; font-weight: bold; font-family: Arial, monospace;">${it.subtotal.toFixed(2)}</td>
      </tr>
    `).join("");

    // Observaciones limpias (sin Estado, Motivo ni Facturas pendientes)
    const obsEl = document.getElementById("presea-obs-val");
    if (obsEl) {
      obsEl.textContent = (orden.observaciones && orden.observaciones.trim() && orden.observaciones.trim() !== "-")
        ? orden.observaciones.trim()
        : "Sin observaciones registradas.";
    }

    // Totales
    document.getElementById("presea-subtotal-val").textContent = orden.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById("presea-neto-val").textContent = orden.subtotal.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    document.getElementById("presea-iva-val").textContent = orden.iva.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    
    const totalCurrEl = document.getElementById("presea-total-curr");
    if (totalCurrEl) totalCurrEl.textContent = isUSD ? "Dólares" : "Pesos";
    
    document.getElementById("presea-total-val").textContent = orden.total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const cuotaEl = document.getElementById("presea-cuota-val");
    if (cuotaEl) cuotaEl.textContent = orden.total.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    const deudaEl = document.getElementById("presea-deuda-val");
    if (deudaEl) {
      deudaEl.textContent = (orden.cliente && orden.cliente.saldo) 
        ? Number(orden.cliente.saldo).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) 
        : '0.00';
    }

    // Footer: El usuario que ingresó a la app y generó esta Nota de Venta
    const userEmisor = (orden.usuario || getUsuarioActivo() || "ADMIN").toUpperCase();
    document.getElementById("presea-footer-user").textContent = userEmisor;
    const now = new Date();
    const pad = n => String(n).padStart(2, '0');
    const dateStr = `${pad(now.getDate())}/${pad(now.getMonth() + 1)}/${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
    document.getElementById("presea-footer-date").textContent = dateStr;

    modalImpresion.style.display = "flex";
  }

  // Cerrar modal de impresión
  [btnCerrarModal, btnCerrarModal2].forEach(btn => {
    btn.addEventListener("click", () => {
      modalImpresion.style.display = "none";
    });
  });

  function ejecutarImpresionLimpia() {
    const printable = document.getElementById("printable-content");
    if (!printable) {
      window.print();
      return;
    }

    let printFrame = document.getElementById("hidden-print-frame");
    if (printFrame) {
      try { printFrame.remove(); } catch(e){}
    }

    printFrame = document.createElement("iframe");
    printFrame.id = "hidden-print-frame";
    printFrame.style.position = "fixed";
    printFrame.style.top = "0";
    printFrame.style.left = "0";
    printFrame.style.width = "100%";
    printFrame.style.height = "100%";
    printFrame.style.border = "none";
    printFrame.style.zIndex = "-99999";
    printFrame.style.opacity = "0.01";
    printFrame.style.pointerEvents = "none";
    document.body.appendChild(printFrame);

    // Clonar elemento de comprobante para no afectar la pantalla
    const clone = printable.cloneNode(true);
    clone.style.display = "flex";
    clone.style.visibility = "visible";
    clone.style.opacity = "1";

    const frameDoc = printFrame.contentWindow.document;
    frameDoc.open();
    frameDoc.write(`
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="color-scheme" content="light">
        <title>Nota de Venta</title>
        <link rel="stylesheet" href="styles.css">
        <style>
          @page {
            size: A4 portrait;
            margin: 5mm 6mm;
          }
          * {
            box-sizing: border-box !important;
            text-shadow: none !important;
            box-shadow: none !important;
            color-scheme: light !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            margin: 0 !important;
            padding: 0 !important;
            width: 100% !important;
            height: auto !important;
            overflow: visible !important;
          }
          body > * {
            display: block !important;
            visibility: visible !important;
          }
          #printable-content,
          .voucher-page {
            display: flex !important;
            flex-direction: column !important;
            visibility: visible !important;
            opacity: 1 !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 270mm !important;
            height: auto !important;
            margin: 0 auto !important;
            padding: 5mm 6mm !important;
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            border: 2px solid #555555 !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
          .voucher-box {
            background: #ffffff !important;
            background-color: #ffffff !important;
            border: 2px solid #555555 !important;
          }
          .voucher-table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .voucher-table th {
            background: #e2e2e5 !important;
            background-color: #e2e2e5 !important;
            color: #000000 !important;
            border-bottom: 2px solid #555555 !important;
            font-weight: 800 !important;
          }
          .voucher-table td {
            background: #ffffff !important;
            background-color: #ffffff !important;
            color: #000000 !important;
            border-bottom: 1px solid #d4d4d8 !important;
          }
          .voucher-box-x {
            background: #555555 !important;
            background-color: #555555 !important;
            color: #ffffff !important;
            border: 1px solid #333333 !important;
          }
          .voucher-grand-total {
            background: #cccccc !important;
            background-color: #cccccc !important;
            border-top: 2px solid #666666 !important;
          }
          .voucher-page,
          .voucher-page span,
          .voucher-page div,
          .voucher-page strong,
          .voucher-page td,
          .voucher-page th,
          .v-label,
          .v-val,
          .voucher-title,
          .voucher-nro,
          .voucher-date {
            color: #000000 !important;
            text-shadow: none !important;
          }
          .voucher-box-x {
            color: #ffffff !important;
          }
          .voucher-watermark {
            opacity: 0.08 !important;
          }
        </style>
      </head>
      <body>
        ${clone.outerHTML}
      </body>
      </html>
    `);
    frameDoc.close();

    setTimeout(() => {
      try {
        printFrame.contentWindow.focus();
        printFrame.contentWindow.print();
      } catch (err) {
        console.error("Error al imprimir con iframe:", err);
        window.print();
      }
    }, 350);
  }

  btnImprimirAhora.addEventListener("click", () => {
    ejecutarImpresionLimpia();
  });

  // ==========================================================================
  // 11. LIMPIAR FORMULARIO
  // ==========================================================================
  btnLimpiarForm.addEventListener("click", () => {
    limpiarFormulario(true);
  });

  function limpiarFormulario(refreshFolio = true) {
    if (typeof resetearBotonAgregar === "function") resetearBotonAgregar();
    currentClient = null;
    currentSelectedProduct = null;
    currentItems = [];

    // Resetear Datos Adicionales para que vengan vacíos por defecto
    palaExtras = {
      comisionista: false,
      tipoNv: "",
      entrega: "",
      pago: ""
    };
    document.querySelectorAll('input[name="rad-tipo-nv"], input[name="rad-entrega"], input[name="rad-pago"]').forEach(r => r.checked = false);
    if (chkComisionista) chkComisionista.checked = false;
    actualizarIndicadorDatosAdicionales();

    inputBuscarCliente.value = "";
    clienteCuit.value = "";
    clienteDireccion.value = "";
    transporteDomicilio.value = "";
    const datalistDomi = document.getElementById("lista-domi-entrega");
    if (datalistDomi) datalistDomi.innerHTML = "";
    inputObservaciones.value = "";
    clienteSaldoVal.textContent = `$ ${currentCompany.saldoDefault}`;
    clienteCreditoVal.textContent = `$ 0.00`;

    inputBuscarProducto.value = "";
    prodStockDisp.value = "";
    prodPrecio.value = "";
    prodCantidad.value = 1;
    prodBonif.value = "0.00";

    renderItemsTable();
    recalcularTotales();

    if (refreshFolio) {
      updateNextFolio();
    }
  }

  // ==========================================================================
  // 12. PESTAÑAS: HISTORIAL, CATÁLOGO Y CLIENTES
  // ==========================================================================
  navTabs.forEach(tab => {
    tab.addEventListener("click", () => {
      navTabs.forEach(t => t.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));

      tab.classList.add("active");
      const targetPane = document.getElementById(tab.dataset.tab);
      if (targetPane) targetPane.classList.add("active");

      if (tab.dataset.tab === "tab-historial") renderHistorial();
      if (tab.dataset.tab === "tab-stock") renderCatalogo();
      if (tab.dataset.tab === "tab-clientes") renderClientesMaestro();
      if (tab.dataset.tab === "tab-config") cargarFormularioConfiguracion();
    });
  });

  // Pestaña Historial
  function renderHistorial() {
    const orders = getOrdersHistory(currentCompanyKey);
    const tbody = document.getElementById("tabla-historial-body");
    const filtro = (document.getElementById("filtro-historial").value || "").toLowerCase().trim();

    const filtered = orders.filter(o => 
      !filtro || 
      (o.numero && o.numero.toLowerCase().includes(filtro)) ||
      (o.cliente && o.cliente.nombre && o.cliente.nombre.toLowerCase().includes(filtro)) ||
      (o.usuario && o.usuario.toLowerCase().includes(filtro))
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" style="text-align: center; color: var(--text-muted); padding: 40px;">
            No hay Notas de Venta registradas para ${currentCompany.nombreCorto} aún.
          </td>
        </tr>
      `;
      return;
    }

    const isUSD = (currentCompany.monedaDefault === "2");
    const currSign = isUSD ? "u$s" : "$";

    tbody.innerHTML = filtered.map((o, idx) => `
      <tr>
        <td><strong style="color: #38bdf8; font-family: monospace;">${o.numero}</strong></td>
        <td>${o.fecha ? o.fecha.split("-").reverse().join("/") : today}</td>
        <td><strong>${o.cliente.nombre}</strong></td>
        <td style="text-align: center;">
          <span class="user-historial-badge">
            <i class="fa-solid fa-user-tie"></i> ${(o.usuario || getUsuarioActivo() || 'ADMIN').toUpperCase()}
          </span>
        </td>
        <td><span style="font-size: 11.5px; color: #94a3b8;">${o.condicion_nombre || 'Contado'}</span></td>
        <td style="text-align: center;">${(o.items || []).length} art.</td>
        <td style="text-align: right; font-weight: 700; color: #34d399; font-family: monospace;">${currSign} ${o.total.toFixed(2)}</td>
        <td style="text-align: center;">
          <span style="background: rgba(16,185,129,0.15); color: #10b981; border: 1px solid #10b981; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">
            ${o.estado || 'INGRESADA'}
          </span>
        </td>
        <td style="text-align: center;">
          <button type="button" class="btn btn-primary btn-sm" onclick="window.verHistorialNV(${idx})" style="display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-print"></i> <span>Imprimir</span>
          </button>
        </td>
      </tr>
    `).join("");
  }

  document.getElementById("filtro-historial").addEventListener("input", renderHistorial);

  window.verHistorialNV = function(idx) {
    const orders = getOrdersHistory(currentCompanyKey);
    if (orders[idx]) {
      abrirModalImpresion(orders[idx]);
    }
  };

  // Pestaña Catálogo
  function renderCatalogo() {
    const prodsList = window.getProductosPorEmpresa(currentCompanyKey);
    const tbody = document.getElementById("tabla-catalogo-body");
    const filtro = (document.getElementById("filtro-catalogo").value || "").toLowerCase().trim();

    const filtered = prodsList.filter(p => 
      !filtro ||
      (p.detalle && p.detalle.toLowerCase().includes(filtro)) ||
      (p.codigo && String(p.codigo).toLowerCase().includes(filtro)) ||
      (p.rubro && p.rubro.toLowerCase().includes(filtro))
    ).slice(0, 50);

    const isUSD = (currentCompany.monedaDefault === "2");
    const currSign = isUSD ? "u$s" : "$";
    const dec = currentCompany.decimales;

    tbody.innerHTML = filtered.map(p => `
      <tr>
        <td><strong style="color: #cbd5e1; font-family: monospace;">${p.codigo}</strong></td>
        <td><span style="font-weight: 600;">${p.detalle}</span></td>
        <td><span style="font-size: 12px; color: #94a3b8;">${p.rubro || '-'}</span></td>
        <td><span style="font-size: 11.5px; color: #64748b;">${p.subrubro || '-'}</span></td>
        <td style="text-align: right; font-weight: 700; color: ${p.stock > 0 ? '#34d399' : '#f87171'};">${p.stock}</td>
        <td style="text-align: right; font-weight: 700; font-family: monospace; color: #38bdf8;">${currSign} ${p.precio.toFixed(dec)}</td>
      </tr>
    `).join("");
  }

  document.getElementById("filtro-catalogo").addEventListener("input", renderCatalogo);

  // Pestaña Clientes
  function renderClientesMaestro() {
    const clientesList = window.getClientesPorEmpresa(currentCompanyKey);
    const tbody = document.getElementById("tabla-clientes-body");
    const filtro = (document.getElementById("filtro-clientes-maestro").value || "").toLowerCase().trim();

    const filtered = clientesList.filter(c => 
      !filtro ||
      (c.nombre && c.nombre.toLowerCase().includes(filtro)) ||
      (c.codigo && String(c.codigo).includes(filtro)) ||
      (c.cuit && String(c.cuit).includes(filtro)) ||
      (c.localidad && c.localidad.toLowerCase().includes(filtro))
    ).slice(0, 50);

    tbody.innerHTML = filtered.map(c => `
      <tr>
        <td><strong style="color: #38bdf8; font-family: monospace;">${c.codigo}</strong></td>
        <td><strong style="color: #f1f5f9;">${c.nombre}</strong></td>
        <td style="font-family: monospace;">${c.cuit || 'S/D'}</td>
        <td>${c.localidad || '-'}</td>
        <td style="font-size: 12px; color: #94a3b8;">${c.domicilio || '-'}</td>
        <td>${c.telefono || '-'}</td>
      </tr>
    `).join("");
  }

  document.getElementById("filtro-clientes-maestro").addEventListener("input", renderClientesMaestro);

  // ==========================================================================
  // 12. ATAJO F6: SELECTOR MODAL CONTEXTUAL DE CLIENTES Y ARTÍCULOS
  // ==========================================================================
  const modalF6Clientes = document.getElementById("modal-f6-clientes");
  const filtroF6Clientes = document.getElementById("filtro-f6-clientes");
  const tablaF6ClientesBody = document.getElementById("tabla-f6-clientes-body");
  const btnCerrarF6Clientes = document.getElementById("btn-cerrar-f6-clientes");
  const btnF6Cliente = document.getElementById("btn-f6-cliente");

  const modalF6Productos = document.getElementById("modal-f6-productos");
  const filtroF6Productos = document.getElementById("filtro-f6-productos");
  const tablaF6ProductosBody = document.getElementById("tabla-f6-productos-body");
  const btnCerrarF6Productos = document.getElementById("btn-cerrar-f6-productos");
  const btnF6Producto = document.getElementById("btn-f6-producto");

  let activeF6ClientIndex = -1;
  let activeF6ProductIndex = -1;

  function abrirModalF6Clientes() {
    clienteAutocomplete.style.display = "none";
    productoAutocomplete.style.display = "none";
    modalF6Clientes.classList.add("active");
    filtroF6Clientes.value = "";
    activeF6ClientIndex = -1;
    renderF6Clientes("");
    setTimeout(() => filtroF6Clientes.focus(), 80);
  }

  function cerrarModalF6Clientes() {
    modalF6Clientes.classList.remove("active");
  }

  function abrirModalF6Productos() {
    if (!validarDatosAdicionalesPalaversich()) return;
    clienteAutocomplete.style.display = "none";
    productoAutocomplete.style.display = "none";
    modalF6Productos.classList.add("active");
    filtroF6Productos.value = "";
    activeF6ProductIndex = -1;
    renderF6Productos("");
    setTimeout(() => filtroF6Productos.focus(), 80);
  }

  function cerrarModalF6Productos() {
    modalF6Productos.classList.remove("active");
  }

  if (btnF6Cliente) btnF6Cliente.addEventListener("click", abrirModalF6Clientes);
  if (btnCerrarF6Clientes) btnCerrarF6Clientes.addEventListener("click", cerrarModalF6Clientes);

  if (btnF6Producto) btnF6Producto.addEventListener("click", abrirModalF6Productos);
  if (btnCerrarF6Productos) btnCerrarF6Productos.addEventListener("click", cerrarModalF6Productos);

  function renderF6Clientes(query) {
    const list = window.getClientesPorEmpresa(currentCompanyKey);
    const q = query.toLowerCase().trim();
    const filtered = list.filter(c => 
      !q ||
      (c.nombre && c.nombre.toLowerCase().includes(q)) ||
      (c.codigo && String(c.codigo).includes(q)) ||
      (c.cuit && String(c.cuit).includes(q)) ||
      (c.localidad && c.localidad.toLowerCase().includes(q))
    ).slice(0, 30);

    if (filtered.length === 0) {
      tablaF6ClientesBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 25px; color: var(--text-muted);">Sin clientes coincidentes en ${currentCompany.nombreCorto}</td></tr>`;
      return;
    }

    tablaF6ClientesBody.innerHTML = filtered.map((c, i) => `
      <tr class="f6-client-row ${i === 0 ? 'selected-row' : ''}" data-code="${c.codigo}" style="cursor: pointer;" onclick="window.pickF6Cliente('${c.codigo}')">
        <td><strong style="color: #38bdf8; font-family: monospace;">${c.codigo}</strong></td>
        <td><strong>${c.nombre}</strong> ${c.fantasia ? `<span style="font-size: 11px; color: #94a3b8;">(${c.fantasia})</span>` : ''}</td>
        <td><span style="font-family: monospace;">${c.cuit || '-'}</span></td>
        <td>${c.localidad || '-'}</td>
        <td style="font-size: 12px; color: #94a3b8;">${c.domicilio || '-'}</td>
        <td style="text-align: center;">
          <button type="button" class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.pickF6Cliente('${c.codigo}')">
            Seleccionar
          </button>
        </td>
      </tr>
    `).join("");
    activeF6ClientIndex = 0;
  }

  window.pickF6Cliente = function(cod) {
    const list = window.getClientesPorEmpresa(currentCompanyKey);
    const cliente = list.find(c => String(c.codigo) === String(cod));
    if (cliente) {
      seleccionarCliente(cliente);
    }
    cerrarModalF6Clientes();
    enfocarSiguientePaso();
  };

  filtroF6Clientes.addEventListener("input", (e) => {
    renderF6Clientes(e.target.value);
  });

  filtroF6Clientes.addEventListener("keydown", (e) => {
    const rows = tablaF6ClientesBody.querySelectorAll(".f6-client-row");
    if (rows.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeF6ClientIndex = (activeF6ClientIndex + 1) % rows.length;
      rows.forEach((r, i) => r.classList.toggle("selected-row", i === activeF6ClientIndex));
      rows[activeF6ClientIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeF6ClientIndex = (activeF6ClientIndex - 1 + rows.length) % rows.length;
      rows.forEach((r, i) => r.classList.toggle("selected-row", i === activeF6ClientIndex));
      rows[activeF6ClientIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = (activeF6ClientIndex >= 0 && rows[activeF6ClientIndex]) ? rows[activeF6ClientIndex] : rows[0];
      if (target && target.dataset.code) {
        window.pickF6Cliente(target.dataset.code);
      }
    } else if (e.key === "Escape") {
      cerrarModalF6Clientes();
    }
  });

  function renderF6Productos(query) {
    const list = window.getProductosPorEmpresa(currentCompanyKey);
    const q = query.toLowerCase().trim();
    const isUSD = (selectMoneda.value === "2");
    const dec = currentCompany.decimales;
    const currSign = isUSD ? "u$s" : "$";

    const filtered = list.filter(p => 
      !q ||
      (p.detalle && p.detalle.toLowerCase().includes(q)) ||
      (p.codigo && String(p.codigo).toLowerCase().includes(q)) ||
      (p.rubro && p.rubro.toLowerCase().includes(q))
    ).slice(0, 30);

    if (filtered.length === 0) {
      tablaF6ProductosBody.innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 25px; color: var(--text-muted);">Sin artículos coincidentes</td></tr>`;
      return;
    }

    tablaF6ProductosBody.innerHTML = filtered.map((p, i) => {
      let displayPrice = p.precio;
      if (isUSD) displayPrice = p.precio / currentCotizacion;
      return `
        <tr class="f6-prod-row ${i === 0 ? 'selected-row' : ''}" data-code="${p.codigo}" style="cursor: pointer;" onclick="window.pickF6Producto('${p.codigo}')">
          <td><strong style="color: #38bdf8; font-family: monospace;">${p.codigo}</strong></td>
          <td><strong>${p.detalle}</strong></td>
          <td><span style="font-size: 11.5px; color: #94a3b8;">${p.rubro || '-'}</span></td>
          <td style="text-align: right; font-weight: 700; color: ${p.stock > 0 ? '#34d399' : '#f87171'}">${p.stock}</td>
          <td style="text-align: right; font-weight: 800; font-family: monospace; color: var(--warning);">${currSign} ${displayPrice.toFixed(dec)}</td>
          <td style="text-align: center;">
            <button type="button" class="btn btn-primary btn-sm" onclick="event.stopPropagation(); window.pickF6Producto('${p.codigo}')">
              Seleccionar
            </button>
          </td>
        </tr>
      `;
    }).join("");
    activeF6ProductIndex = 0;
  }

  window.pickF6Producto = function(cod) {
    const list = window.getProductosPorEmpresa(currentCompanyKey);
    const prod = list.find(p => String(p.codigo) === String(cod));
    if (prod) {
      seleccionarProducto(prod);
    }
    cerrarModalF6Productos();
  };

  filtroF6Productos.addEventListener("input", (e) => {
    renderF6Productos(e.target.value);
  });

  filtroF6Productos.addEventListener("keydown", (e) => {
    const rows = tablaF6ProductosBody.querySelectorAll(".f6-prod-row");
    if (rows.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      activeF6ProductIndex = (activeF6ProductIndex + 1) % rows.length;
      rows.forEach((r, i) => r.classList.toggle("selected-row", i === activeF6ProductIndex));
      rows[activeF6ProductIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      activeF6ProductIndex = (activeF6ProductIndex - 1 + rows.length) % rows.length;
      rows.forEach((r, i) => r.classList.toggle("selected-row", i === activeF6ProductIndex));
      rows[activeF6ProductIndex].scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = (activeF6ProductIndex >= 0 && rows[activeF6ProductIndex]) ? rows[activeF6ProductIndex] : rows[0];
      if (target && target.dataset.code) {
        window.pickF6Producto(target.dataset.code);
      }
    } else if (e.key === "Escape") {
      cerrarModalF6Productos();
    }
  });

  // Atajo global de Teclado F6 y Escape
  window.addEventListener("keydown", (e) => {
    if (e.key === "F6") {
      e.preventDefault();
      const activeEl = document.activeElement;
      if (activeEl === inputBuscarProducto || activeEl === prodPrecio || activeEl === prodCantidad || activeEl === prodBonif) {
        abrirModalF6Productos();
      } else {
        abrirModalF6Clientes();
      }
    } else if (e.key === "Escape") {
      cerrarModalF6Clientes();
      cerrarModalF6Productos();
      clienteAutocomplete.style.display = "none";
      productoAutocomplete.style.display = "none";
    }
  });

  // ==========================================================================
  // 14. GESTIÓN Y PERSISTENCIA DE CONFIGURACIÓN DEL SISTEMA
  // ==========================================================================
  function cargarFormularioConfiguracion() {
    const cfg = getSystemConfig();
    const userInp = document.getElementById("cfg-user-name");
    const fullnameInp = document.getElementById("cfg-user-fullname");
    if (userInp) userInp.value = getUsuarioActivo();
    if (fullnameInp) fullnameInp.value = cfg.nombreOperador || "";

    const overrides = getEmpresaConfigOverride(currentCompanyKey);
    const vendInp = document.getElementById("cfg-vendedor-default");
    const depInp = document.getElementById("cfg-deposito-default");
    const prefInp = document.getElementById("cfg-prefijo-folio");
    const obsInp = document.getElementById("cfg-obs-default");

    if (vendInp) vendInp.value = overrides.vendedorDefault !== undefined ? overrides.vendedorDefault : currentCompany.vendedorDefault;
    if (depInp) depInp.value = overrides.depositoDefault !== undefined ? overrides.depositoDefault : currentCompany.depositoDefault;
    if (prefInp) prefInp.value = overrides.prefijoFolio !== undefined ? overrides.prefijoFolio : (currentCompany.prefijoFolio || "");
    if (obsInp) obsInp.value = overrides.observacionesDefault !== undefined ? overrides.observacionesDefault : "";

    const cfgEmpLabel = document.getElementById("cfg-empresa-nombre-label");
    if (cfgEmpLabel) cfgEmpLabel.textContent = currentCompany.nombreCorto;

    const badgeConfig = document.getElementById("badge-config-empresa");
    if (badgeConfig) {
      badgeConfig.textContent = currentCompany.nombreCorto;
      badgeConfig.style.borderColor = currentCompany.color;
      badgeConfig.style.color = currentCompany.color;
    }
  }

  // Guardar configuración
  const btnGuardarConfig = document.getElementById("btn-guardar-config");
  if (btnGuardarConfig) {
    btnGuardarConfig.addEventListener("click", () => {
      const userInp = document.getElementById("cfg-user-name");
      const fullnameInp = document.getElementById("cfg-user-fullname");
      const nuevoUsuario = userInp ? userInp.value.trim().toUpperCase() : "JUANLUIS";

      if (!nuevoUsuario) {
        alert("⚠️ Por favor ingrese un nombre de usuario válido para la sesión.");
        if (userInp) userInp.focus();
        return;
      }

      const vendInp = document.getElementById("cfg-vendedor-default");
      const depInp = document.getElementById("cfg-deposito-default");
      const prefInp = document.getElementById("cfg-prefijo-folio");
      const obsInp = document.getElementById("cfg-obs-default");

      const cfg = getSystemConfig();
      cfg.usuario = nuevoUsuario;
      cfg.nombreOperador = fullnameInp ? fullnameInp.value.trim() : "";

      if (!cfg.empresas) cfg.empresas = {};
      cfg.empresas[currentCompanyKey] = {
        vendedorDefault: vendInp ? vendInp.value.trim() : currentCompany.vendedorDefault,
        depositoDefault: depInp ? depInp.value.trim() : currentCompany.depositoDefault,
        prefijoFolio: prefInp ? prefInp.value.trim() : (currentCompany.prefijoFolio || ""),
        observacionesDefault: obsInp ? obsInp.value.trim() : ""
      };

      saveSystemConfig(cfg);
      actualizarUIUsuario();

      // Aplicar de inmediato a la empresa activa y recalcular folio
      setEmpresaActiva(currentCompanyKey);

      // Mostrar confirmación
      const statusMsg = document.getElementById("config-status-msg");
      if (statusMsg) {
        statusMsg.style.display = "inline-flex";
        setTimeout(() => {
          statusMsg.style.display = "none";
        }, 3500);
      }
    });
  }

  // Restablecer configuración original
  const btnRestablecerConfig = document.getElementById("btn-restablecer-config");
  if (btnRestablecerConfig) {
    btnRestablecerConfig.addEventListener("click", () => {
      if (confirm("¿Desea restablecer toda la configuración a los valores por defecto del sistema?")) {
        localStorage.removeItem("crm_system_config");
        actualizarUIUsuario();
        cargarFormularioConfiguracion();
        setEmpresaActiva(currentCompanyKey);
        alert("Valores restablecidos a los parámetros originales.");
      }
    });
  }

  // Botones de cambio rápido de usuario
  document.querySelectorAll(".btn-quick-user").forEach(btn => {
    btn.addEventListener("click", () => {
      const u = btn.dataset.user;
      const userInp = document.getElementById("cfg-user-name");
      if (userInp) {
        userInp.value = u;
        userInp.focus();
      }
    });
  });

  // Clic en la pastilla de usuario en el encabezado para acceder a Configuración
  const btnHeaderUser = document.getElementById("btn-header-user");
  if (btnHeaderUser) {
    btnHeaderUser.addEventListener("click", () => {
      navTabs.forEach(t => t.classList.remove("active"));
      tabPanes.forEach(p => p.classList.remove("active"));
      const configTabBtn = document.querySelector('.nav-tab[data-tab="tab-config"]');
      const configTabPane = document.getElementById("tab-config");
      if (configTabBtn) configTabBtn.classList.add("active");
      if (configTabPane) {
        configTabPane.classList.add("active");
        cargarFormularioConfiguracion();
        const userInput = document.getElementById("cfg-user-name");
        if (userInput) {
          userInput.focus();
          userInput.select();
        }
      }
    });
  }

  // Inicializar en Palaversich
  setEmpresaActiva("palaversich");
});
