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

  // Datos Adicionales exclusivos de Palaversich
  let palaExtras = {
    comisionista: false,
    tipoNv: "NV Consignacion",
    entrega: "Retira Cliente",
    pago: "Pago Cheque"
  };

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
  const groupDatosAdicionalesBtn = document.getElementById("group-datos-adicionales-btn");
  const btnAbrirDatosAdicionales = document.getElementById("btn-abrir-datos-adicionales");

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

  // Modal Datos Adicionales (Palaversich)
  const modalDatosAdicionales = document.getElementById("modal-datos-adicionales");
  const btnCerrarDatosAdic = document.getElementById("btn-cerrar-datos-adic");
  const btnGuardarDatosAdic = document.getElementById("btn-guardar-datos-adic");
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

    // Actualizar Listas de Precios disponibles
    selectListaPrecios.innerHTML = currentCompany.listasPrecios.map(l => 
      `<option value="${l.codigo}" ${l.codigo === currentCompany.listaDefault ? 'selected' : ''}>${l.codigo} - ${l.nombre}</option>`
    ).join("");

    // Actualizar Depósitos sugeridos (pero editable por el usuario)
    listaDepositos.innerHTML = currentCompany.depositosSugeridos.map(d => `<option value="${d}">`).join("");
    inputDeposito.value = currentCompany.depositoDefault;

    // Actualizar Transportes según la empresa
    listaTransporte1.innerHTML = currentCompany.transportesSugeridos.map(t => `<option value="${t.codigo} - ${t.nombre}">`).join("");
    inputTransporte1.value = currentCompany.transportesSugeridos[0] ? `${currentCompany.transportesSugeridos[0].codigo} - ${currentCompany.transportesSugeridos[0].nombre}` : "";
    transporteDomicilio.value = currentCompany.transportesSugeridos[0] ? currentCompany.transportesSugeridos[0].domicilio : "";

    if (currentCompany.maxTransportes >= 3) {
      // Exclusivo PETROBONO: Transportes 2 y 3 visibles
      groupTransporte2.style.display = "block";
      groupTransporte3.style.display = "block";
    } else {
      groupTransporte2.style.display = "none";
      groupTransporte3.style.display = "none";
    }

    // Botón Datos Adicionales (Exclusivo PALAVERSICH)
    if (currentCompany.tieneDatosAdicionales) {
      groupDatosAdicionalesBtn.style.display = "flex";
    } else {
      groupDatosAdicionalesBtn.style.display = "none";
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

    // Vendedor default
    inputVendedor.value = currentCompany.vendedorDefault;

    // Decimales info badge
    badgeDecimalesInfo.textContent = `* Precios de lista con ${currentCompany.decimales} decimales • Presea ERP`;

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

    if (currentCompany.prefijoFolio) {
      const nextSeq = currentCompany.numeroBase + baseCount;
      nextNumStr = `${currentCompany.prefijoFolio}${String(nextSeq).padStart(5, '0')}`;
    } else {
      const nextSeq = currentCompany.numeroBase + baseCount;
      nextNumStr = String(nextSeq);
    }
    displayFolioNum.textContent = nextNumStr;
  }

  function getOrdersHistory(empresaKey) {
    return JSON.parse(localStorage.getItem(`presea_orders_${empresaKey}`) || "[]");
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
          inputBuscarProducto.focus();
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
    inputBuscarProducto.focus();
  });

  function seleccionarCliente(cliente) {
    currentClient = cliente;
    inputBuscarCliente.value = cliente.nombre;
    clienteCuit.value = cliente.cuit || "Sin CUIT registrado";

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
      transporteDomicilio.value = cliente.transporte_domicilio || "";
    }

    // Datos crediticios
    if (cliente.credito !== undefined) {
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
    if (isUSD) basePrice = prod.precio / currentCotizacion;

    prodPrecio.value = basePrice > 0 ? basePrice.toFixed(dec) : "0.00";
    prodCantidad.value = 1;
    prodBonif.value = "0.00";
    prodCantidad.focus();
  }

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
  btnAgregarItem.addEventListener("click", () => {
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

    const subtotalBruto = cant * precio;
    const subtotalNeto = subtotalBruto * (1 - (bonif / 100));

    // Verificar si ya existe el ítem para sumar cantidad
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

  function renderItemsTable() {
    if (currentItems.length === 0) {
      tablaItemsBody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 30px;">
            No hay productos agregados a la Nota de Venta aún.
          </td>
        </tr>
      `;
      return;
    }

    const isUSD = (selectMoneda.value === "2");
    const currSign = isUSD ? "u$s" : "$";
    const dec = currentCompany.decimales;

    tablaItemsBody.innerHTML = currentItems.map((item, idx) => `
      <tr>
        <td><strong style="color: #cbd5e1; font-family: monospace;">${item.codigo}</strong></td>
        <td><span style="font-weight: 600;">${item.detalle}</span></td>
        <td><span style="font-size: 11.5px; color: #94a3b8;">${item.rubro}</span></td>
        <td style="text-align: center; font-weight: 700;">${item.cantidad}</td>
        <td style="text-align: right; font-family: monospace;">${currSign} ${item.precio.toFixed(dec)}</td>
        <td style="text-align: center;">${item.bonif > 0 ? `<span style="color: #f59e0b; font-weight: bold;">${item.bonif.toFixed(2)}%</span>` : '0%'}</td>
        <td style="text-align: right; font-weight: 700; color: #34d399; font-family: monospace;">${currSign} ${item.subtotal.toFixed(2)}</td>
        <td style="text-align: center;">
          <button type="button" class="btn btn-danger btn-sm" onclick="window.eliminarItem(${idx})" style="padding: 4px 8px; border-radius: 6px;" title="Eliminar ítem">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </td>
      </tr>
    `).join("");
  }

  window.eliminarItem = function(index) {
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
  // 8. MODAL DE DATOS ADICIONALES (EXCLUSIVO PALAVERSICH)
  // ==========================================================================
  btnAbrirDatosAdicionales.addEventListener("click", () => {
    chkComisionista.checked = palaExtras.comisionista;
    
    const radTipo = document.querySelector(`input[name="rad-tipo-nv"][value="${palaExtras.tipoNv}"]`);
    if (radTipo) radTipo.checked = true;

    const radEntrega = document.querySelector(`input[name="rad-entrega"][value="${palaExtras.entrega}"]`);
    if (radEntrega) radEntrega.checked = true;

    const radPago = document.querySelector(`input[name="rad-pago"][value="${palaExtras.pago}"]`);
    if (radPago) radPago.checked = true;

    modalDatosAdicionales.style.display = "flex";
  });

  btnCerrarDatosAdic.addEventListener("click", () => {
    modalDatosAdicionales.style.display = "none";
  });

  btnGuardarDatosAdic.addEventListener("click", () => {
    palaExtras.comisionista = chkComisionista.checked;
    const selTipo = document.querySelector('input[name="rad-tipo-nv"]:checked');
    if (selTipo) palaExtras.tipoNv = selTipo.value;

    const selEntrega = document.querySelector('input[name="rad-entrega"]:checked');
    if (selEntrega) palaExtras.entrega = selEntrega.value;

    const selPago = document.querySelector('input[name="rad-pago"]:checked');
    if (selPago) palaExtras.pago = selPago.value;

    modalDatosAdicionales.style.display = "none";
    alert(`✔ Datos adicionales actualizados:\n${palaExtras.tipoNv} | ${palaExtras.entrega} | ${palaExtras.pago}${palaExtras.comisionista ? ' (Es Comisionista)' : ''}`);
  });

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
      estado: "A Autorizar",
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
      // Si el form está vacío, abrir la última orden guardada
      const orders = getOrdersHistory(currentCompanyKey);
      if (orders.length > 0) {
        abrirModalImpresion(orders[0]);
        return;
      }
      alert("Cargue un cliente y al menos un artículo para generar la vista previa.");
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
      estado: "A AUTORIZAR"
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
    document.getElementById("presea-client-lista").textContent = orden.lista_precios || cfg.listaDefault;
    document.getElementById("presea-client-deposito").textContent = orden.deposito || cfg.depositoDefault;
    document.getElementById("presea-client-moneda").textContent = orden.moneda_nombre || "Pesos";

    // Transporte(s)
    let transText = orden.transportes.transporte_1 || "-";
    if (orden.empresa === 'petrobono') {
      if (orden.transportes.transporte_2 && orden.transportes.transporte_2 !== '0') transText += ` | Chof: ${orden.transportes.transporte_2}`;
      if (orden.transportes.transporte_3 && orden.transportes.transporte_3 !== '0') transText += ` | Cist: ${orden.transportes.transporte_3}`;
    }
    document.getElementById("presea-client-transporte").textContent = transText;

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
        <td style="font-family: monospace; font-weight: bold;">${it.codigo}</td>
        <td><strong>${it.detalle}</strong></td>
        <td style="text-align: right; font-weight: bold;">${it.cantidad}</td>
        <td style="text-align: right;">${it.cantidad}</td>
        <td style="text-align: right; font-family: monospace;">${currSign} ${it.precio.toFixed(dec)}</td>
        <td style="text-align: right;">${it.bonif > 0 ? it.bonif.toFixed(2) + '%' : '0.00%'}</td>
        <td style="text-align: right; font-weight: bold; font-family: monospace;">${currSign} ${it.subtotal.toFixed(2)}</td>
      </tr>
    `).join("");

    // Totales
    document.getElementById("presea-estado-val").textContent = orden.estado || "A AUTORIZAR";
    document.getElementById("presea-obs-val").textContent = orden.observaciones || "-";
    document.getElementById("presea-subtotal-val").textContent = `${currSign} ${orden.subtotal.toFixed(2)}`;
    document.getElementById("presea-neto-val").textContent = `${currSign} ${orden.subtotal.toFixed(2)}`;
    document.getElementById("presea-iva-val").textContent = `${currSign} ${orden.iva.toFixed(2)}`;
    document.getElementById("presea-total-val").textContent = `${currSign} ${orden.total.toFixed(2)}`;

    // Footer
    document.getElementById("presea-footer-user").textContent = (orden.vendedor || "OPERADOR").toUpperCase();
    document.getElementById("presea-footer-date").textContent = new Date().toLocaleString('es-AR');

    modalImpresion.style.display = "flex";
  }

  // Cerrar modal de impresión
  [btnCerrarModal, btnCerrarModal2].forEach(btn => {
    btn.addEventListener("click", () => {
      modalImpresion.style.display = "none";
    });
  });

  btnImprimirAhora.addEventListener("click", () => {
    window.print();
  });

  // ==========================================================================
  // 11. LIMPIAR FORMULARIO
  // ==========================================================================
  btnLimpiarForm.addEventListener("click", () => {
    limpiarFormulario(true);
  });

  function limpiarFormulario(refreshFolio = true) {
    currentClient = null;
    currentSelectedProduct = null;
    currentItems = [];

    inputBuscarCliente.value = "";
    clienteCuit.value = "";
    clienteDireccion.value = "";
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
      (o.cliente && o.cliente.nombre && o.cliente.nombre.toLowerCase().includes(filtro))
    );

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="8" style="text-align: center; color: var(--text-muted); padding: 40px;">
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
        <td><span style="font-size: 11.5px; color: #94a3b8;">${o.condicion_nombre || 'Contado'}</span></td>
        <td style="text-align: center;">${(o.items || []).length} art.</td>
        <td style="text-align: right; font-weight: 700; color: #34d399; font-family: monospace;">${currSign} ${o.total.toFixed(2)}</td>
        <td style="text-align: center;">
          <span style="background: rgba(245,158,11,0.15); color: #f59e0b; border: 1px solid #f59e0b; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 700;">
            ${o.estado || 'A Autorizar'}
          </span>
        </td>
        <td style="text-align: center;">
          <button type="button" class="btn btn-primary btn-sm" onclick="window.verHistorialNV(${idx})" style="display: inline-flex; align-items: center; gap: 6px;">
            <i class="fa-solid fa-file-lines"></i> <span>Ver</span>
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
    inputBuscarProducto.focus();
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

  // Inicializar en Palaversich
  setEmpresaActiva("palaversich");
});
