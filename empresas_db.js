// ==========================================================================
// EMPRESAS_DB.JS — Base de Datos y Parámetros Multi-Empresa PRESEA ERP
// Empresas: PASINA S.A., PALAVERSICH S.A., PETROBONO S.A.
// ==========================================================================

const EMPRESAS_CONFIG = {
  pasina: {
    id: "pasina",
    nombre: "PASINA MARCELO ALEJANDRO",
    nombreCorto: "PASINA",
    subtitulo: "Distribución Mayorista",
    cuit: "20-14589632-4",
    iva: "RESPONSABLE INSCRIPTO",
    domicilio: "Aurora 3475 - Rosario, Pcia. Santa Fe",
    ingBrutos: "0916600761",
    inicioAct: "01/03/1998",
    logoLetra: "PA",
    logoImg: "logo_pasina.png",
    color: "#0284c7",
    colorHover: "#0369a1",
    prefijoFolio: "1001",
    numeroBase: 27312,
    decimales: 4,
    monedaDefault: "1", // 1 = Pesos
    listasPrecios: [
      { codigo: "LISTA_UNIC", nombre: "LISTA UNIFICADA (Default)" },
      { codigo: "LISTA_MAY", nombre: "LISTA MAYORISTA GRANDE" },
      { codigo: "LISTA_DIST", nombre: "LISTA DISTRIBUIDOR" },
      { codigo: "LISTA_ESP", nombre: "LISTA ESPECIAL CLIENTE" }
    ],
    listaDefault: "LISTA_UNIC",
    depositosSugeridos: [
      "1 - PASINA",
      "2 - DEPÓSITO 2 (CENTRAL)",
      "3 - EXPEDICIÓN ROSARIO"
    ],
    depositoDefault: "1 - PASINA",
    transportesSugeridos: [
      { codigo: "2", nombre: "Retira Cobro Vendedor", domicilio: "AURORA 3475" },
      { codigo: "1", nombre: "Transporte Propio Pasina", domicilio: "AURORA 3475" },
      { codigo: "3", nombre: "Expreso Rosario Cargas", domicilio: "SAN MARTÍN 1420" }
    ],
    maxTransportes: 1,
    tieneDatosAdicionales: false,
    vendedorDefault: "1 - Carolina Mediavilla",
    creditoLabel: "CRÉDITO DISPONIBLE: $",
    saldoDefault: "0.00",
    tablasPresea: {
      clientes: "CLIENTESPA (CLIENTESNV)",
      productos: "PRODUCTOSPA (PRODUCTOSNV)",
      condiciones: "CONDICIONESNV",
      transportes: "TRANSPORTENV",
      pedidos: "ORDENVTAPA / MORDENVTPA"
    }
  },

  palaversich: {
    id: "palaversich",
    nombre: "PALAVERSICH Y CIA. S.A.C.",
    nombreCorto: "PALAVERSICH",
    subtitulo: "Soluciones Industriales y Agroquímica",
    cuit: "30-50124896-3",
    iva: "RESPONSABLE INSCRIPTO",
    domicilio: "Chiclana 8000 - Bahía Blanca, Pcia. Buenos Aires",
    ingBrutos: "0915500823",
    inicioAct: "15/06/1985",
    logoLetra: "PV",
    logoImg: "logo_palaversich.png",
    color: "#10b981",
    colorHover: "#059669",
    prefijoFolio: "7000",
    numeroBase: 4829,
    decimales: 2,
    monedaDefault: "2", // 2 = Dólares Estadounidenses
    tieneListaPrecios: false,
    listasPrecios: [
      { codigo: "PRECIO_1", nombre: "Precio 1 (Maestro)" },
      { codigo: "PRECIO_2", nombre: "Precio 2 (Maestro)" }
    ],
    listaDefault: "PRECIO_1",
    depositosSugeridos: [
      "50 - PREPARADO",
      "1 - CASA CENTRAL BAHÍA",
      "10 - EXPEDICIÓN AGRO"
    ],
    depositoDefault: "50 - PREPARADO",
    transportesSugeridos: [
      { codigo: "0", nombre: "Sin Transporte Asignado", domicilio: "-" },
      { codigo: "1", nombre: "Expreso Pampeano", domicilio: "CHICLANA 8000" },
      { codigo: "2", nombre: "Retira Cliente en Planta", domicilio: "PLANTA BAHÍA BLANCA" }
    ],
    maxTransportes: 1,
    tieneDatosAdicionales: true,
    vendedorDefault: "1 - Asesor Comercial Agro",
    creditoLabel: "CRÉDITO CUENTA: $",
    saldoDefault: "0.0000",
    tablasPresea: {
      clientes: "CLIENTESPV",
      productos: "PRODUCTOSPV",
      condiciones: "CONDICIONESPV",
      transportes: "TRANSPORTESPV",
      pedidos: "ORDENVTAPV / MORDENVTPV"
    }
  },

  petrobono: {
    id: "petrobono",
    nombre: "PETROBONO S.A.",
    nombreCorto: "PETROBONO",
    subtitulo: "Combustibles y Derivados",
    cuit: "30-68954123-9",
    iva: "RESPONSABLE INSCRIPTO",
    domicilio: "Ruta Pcial 27 y Acc. Pedro O. - San Martín, Córdoba",
    ingBrutos: "0918800912",
    inicioAct: "10/11/2004",
    logoLetra: "PB",
    logoImg: "logo_petrobono.png",
    color: "#f97316",
    colorHover: "#ea580c",
    prefijoFolio: "",
    numeroBase: 153189,
    decimales: 2,
    monedaDefault: "1", // 1 = Pesos
    listasPrecios: [
      { codigo: "R0", nombre: "R0 - TARIFA SIDERURGIA / AGRO" },
      { codigo: "R1", nombre: "R1 - ESTACIONES BLANCAS" },
      { codigo: "R2", nombre: "R2 - MAYORISTA TRANSPORTE" },
      { codigo: "MAYORISTA_AGRO", nombre: "AGRO DIRECTO CISTERNA" }
    ],
    listaDefault: "R0",
    depositosSugeridos: [
      "1 - PLANTA SAN LORENZO",
      "2 - BASE DOCK SUD",
      "3 - PLANTA CÓRDOBA",
      "4 - TERMINAL BAHÍA"
    ],
    depositoDefault: "1 - PLANTA SAN LORENZO",
    transportesSugeridos: [
      { codigo: "3465", nombre: "Artesi Miguel (Cisterna 01)", domicilio: "SAN MARTÍN S/N" },
      { codigo: "1210", nombre: "Transportes Don Pedro SRL", domicilio: "RUTA 9 KM 280" },
      { codigo: "4501", nombre: "Logística Combustibles del Centro", domicilio: "CIRCUNVALACIÓN SUR" }
    ],
    maxTransportes: 3,
    tieneDatosAdicionales: false,
    vendedorDefault: "8 - Mesa de Operaciones Combustibles",
    creditoLabel: "LÍMITE DE CRÉDITO: $",
    saldoDefault: "19301263.00",
    tablasPresea: {
      clientes: "CLIENTESPB",
      productos: "PRODUCTOSPB",
      condiciones: "CONDICIONESPB",
      transportes: "TRANSPORTESPB",
      pedidos: "ORDENVTAPB / MORDENVTPB"
    }
  }
};

// Clientes específicos de PETROBONO para enriquecer la demo
const clientesPetrobono = [
  {
    codigo: "7093",
    nombre: "ALFREDO CARDINAL E HIJOS.",
    fantasia: "CARDINAL AGRO",
    cuit: "30-58963214-7",
    domicilio: "RUTA PCIAL 27 Y ACC. PEDRO O.",
    localidad: "SAN MARTÍN (Zona: 9)",
    telefono: "03385-498045",
    transporte: "3465",
    transporte_nombre: "Artesi Miguel",
    transporte_domicilio: "SAN MARTIN S / NUMERO",
    lista: "R0",
    credito: 19301263.00,
    saldo: 0.00
  },
  {
    codigo: "7105",
    nombre: "AGROPECUARIA EL TRÉBOL S.R.L.",
    fantasia: "EL TRÉBOL AGRO",
    cuit: "30-71025894-3",
    domicilio: "RUTA NACIONAL 33 KM 642",
    localidad: "VENADO TUERTO - SANTA FE",
    telefono: "03462-421500",
    transporte: "1210",
    transporte_nombre: "Transportes Don Pedro SRL",
    transporte_domicilio: "RUTA 9 KM 280",
    lista: "R0",
    credito: 25000000.00,
    saldo: 1420500.00
  },
  {
    codigo: "7210",
    nombre: "TRANSPORTE Y LOGÍSTICA SANTA FE S.A.",
    fantasia: "LOGÍSTICA SF",
    cuit: "30-65478912-1",
    domicilio: "AV. CIRCUNVALACIÓN 4500",
    localidad: "ROSARIO - SANTA FE",
    telefono: "0341-4568900",
    transporte: "4501",
    transporte_nombre: "Logística Combustibles del Centro",
    transporte_domicilio: "CIRCUNVALACIÓN SUR",
    lista: "R2",
    credito: 30000000.00,
    saldo: 5200000.00
  },
  {
    codigo: "7340",
    nombre: "COOPERATIVA AGRÍCOLA GANADERA DE RÍO CUARTO",
    fantasia: "COOP RÍO CUARTO",
    cuit: "30-50236987-4",
    domicilio: "SAN MARTÍN 850",
    localidad: "RÍO CUARTO - CÓRDOBA",
    telefono: "0358-4641200",
    transporte: "3465",
    transporte_nombre: "Artesi Miguel",
    transporte_domicilio: "SAN MARTIN S / NUMERO",
    lista: "MAYORISTA_AGRO",
    credito: 45000000.00,
    saldo: 0.00
  }
];

// Productos específicos de PETROBONO (Combustibles y Lubricantes)
const productosPetrobono = [
  {
    codigo: "COMB-001",
    detalle: "GASOIL GRADO 2 (DIESEL 500) X LITRO",
    rubro: "COMBUSTIBLES",
    subrubro: "DIESEL",
    precio: 1085.50,
    stock: 150000.0,
    iva: 21.0,
    cod_alfa: "GO-G2",
    cod_barras: "7790001001"
  },
  {
    codigo: "COMB-002",
    detalle: "GASOIL GRADO 3 (INFINIA DIESEL EURO) X LITRO",
    rubro: "COMBUSTIBLES",
    subrubro: "DIESEL PREMIUM",
    precio: 1298.00,
    stock: 95000.0,
    iva: 21.0,
    cod_alfa: "GO-G3",
    cod_barras: "7790001002"
  },
  {
    codigo: "COMB-003",
    detalle: "NAFTA SÚPER 95 OCTANOS X LITRO",
    rubro: "COMBUSTIBLES",
    subrubro: "NAFTAS",
    precio: 1045.00,
    stock: 120000.0,
    iva: 21.0,
    cod_alfa: "NAF-SUP",
    cod_barras: "7790001003"
  },
  {
    codigo: "COMB-004",
    detalle: "NAFTA PREMIUM 98 OCTANOS X LITRO",
    rubro: "COMBUSTIBLES",
    subrubro: "NAFTAS",
    precio: 1260.00,
    stock: 75000.0,
    iva: 21.0,
    cod_alfa: "NAF-PREM",
    cod_barras: "7790001004"
  },
  {
    codigo: "LUB-010",
    detalle: "ACEITE HELIX ULTRA 5W40 SINTÉTICO (TAMBOR 205 L)",
    rubro: "LUBRICANTES",
    subrubro: "SINTÉTICOS",
    precio: 1450000.00,
    stock: 45.0,
    iva: 21.0,
    cod_alfa: "LUB-5W40",
    cod_barras: "7790002010"
  },
  {
    codigo: "LUB-020",
    detalle: "ACEITE RIMULA R4X 15W40 DIESEL PESADO (TAMBOR 205 L)",
    rubro: "LUBRICANTES",
    subrubro: "TRANSPORTE PESADO",
    precio: 1120000.00,
    stock: 80.0,
    iva: 21.0,
    cod_alfa: "LUB-15W40",
    cod_barras: "7790002020"
  },
  {
    codigo: "QUIM-030",
    detalle: "UREA GRADO AUTOMOTRIZ (ARNOX 32) X 1000 L IBC",
    rubro: "QUÍMICOS Y DERIVADOS",
    subrubro: "UREA",
    precio: 890000.00,
    stock: 25.0,
    iva: 21.0,
    cod_alfa: "ARNOX-1000",
    cod_barras: "7790003030"
  }
];

// ==========================================================================
// CLIENTES ESPECÍFICOS DE PALAVERSICH (Semillas, Agropecuaria, Acopios)
// ==========================================================================
const clientesPalaversich = [
  {
    codigo: "7001",
    nombre: "COOPERATIVA AGRÍCOLA GANADERA DE PUAN LTDA.",
    fantasia: "COOP PUAN",
    cuit: "30-50214896-1",
    domicilio: "AV. SAN MARTÍN 350",
    localidad: "PUAN - BUENOS AIRES",
    telefono: "02923-498100",
    transporte: "1",
    transporte_nombre: "Expreso Pampeano",
    transporte_domicilio: "CHICLANA 8000",
    lista: "LISTA_01",
    credito: 150000.00,
    saldo: 0.00
  },
  {
    codigo: "7002",
    nombre: "AGROPECUARIA DEL SUR S.A.",
    fantasia: "AGRO DEL SUR",
    cuit: "30-68952147-3",
    domicilio: "RUTA NACIONAL 3 KM 690",
    localidad: "BAHÍA BLANCA - BUENOS AIRES",
    telefono: "0291-4552000",
    transporte: "2",
    transporte_nombre: "Retira Cliente en Planta",
    transporte_domicilio: "PLANTA BAHÍA BLANCA",
    lista: "LISTA_AGRO",
    credito: 280000.00,
    saldo: 12400.00
  },
  {
    codigo: "7003",
    nombre: "ESTANCIA LA PAMPEANA DE TORNQUIST S.A.",
    fantasia: "LA PAMPEANA",
    cuit: "30-54129874-9",
    domicilio: "SECCIÓN CHACRAS LOTE 14",
    localidad: "TORNQUIST - BUENOS AIRES",
    telefono: "0291-4940120",
    transporte: "1",
    transporte_nombre: "Expreso Pampeano",
    transporte_domicilio: "CHICLANA 8000",
    lista: "LISTA_01",
    credito: 95000.00,
    saldo: 0.00
  },
  {
    codigo: "7004",
    nombre: "ACOPIO Y SEMILLAS LA HUELLA S.R.L.",
    fantasia: "LA HUELLA SEMILLAS",
    cuit: "30-71124589-2",
    domicilio: "CIRCUNVALACIÓN OESTE 120",
    localidad: "CORONEL SUÁREZ - BUENOS AIRES",
    telefono: "02926-429300",
    transporte: "1",
    transporte_nombre: "Expreso Pampeano",
    transporte_domicilio: "CHICLANA 8000",
    lista: "DISTRIBUIDOR",
    credito: 350000.00,
    saldo: 45000.00
  },
  {
    codigo: "7005",
    nombre: "CAMPO & SIEMBRA DIRECTA S.R.L.",
    fantasia: "SIEMBRA DIRECTA",
    cuit: "30-70985412-8",
    domicilio: "RUTA PROVINCIAL 51 KM 715",
    localidad: "BAHÍA BLANCA - BUENOS AIRES",
    telefono: "0291-4883400",
    transporte: "2",
    transporte_nombre: "Retira Cliente en Planta",
    transporte_domicilio: "PLANTA BAHÍA BLANCA",
    lista: "LISTA_AGRO",
    credito: 180000.00,
    saldo: 0.00
  },
  {
    codigo: "7006",
    nombre: "ASOCIACIÓN DE COOPERATIVAS ARGENTINAS (ACA BAHÍA)",
    fantasia: "ACA PUERTO",
    cuit: "30-50012088-5",
    domicilio: "PUERTO ING. WHITE",
    localidad: "BAHÍA BLANCA - BUENOS AIRES",
    telefono: "0291-4598000",
    transporte: "1",
    transporte_nombre: "Expreso Pampeano",
    transporte_domicilio: "CHICLANA 8000",
    lista: "DISTRIBUIDOR",
    credito: 500000.00,
    saldo: 0.00
  }
];

// ==========================================================================
// PRODUCTOS ESPECÍFICOS DE PALAVERSICH (Semillas Forrajeras y Agroinsumos en USD)
// ==========================================================================
const productosPalaversich = [
  {
    codigo: "SEM-ALF-001",
    detalle: "ALFALFA BAR 720 (BARENBRUG) GRUPO 7 X BOLSA 25 KG",
    rubro: "SEMILLAS FORRAJERAS",
    subrubro: "ALFALFAS",
    precio: 245.00,
    stock: 850.0,
    iva: 10.5,
    cod_alfa: "BAR-720",
    cod_barras: "7798001001"
  },
  {
    codigo: "SEM-ALF-002",
    detalle: "ALFALFA BAR 900 (BARENBRUG) GRUPO 9 X BOLSA 25 KG",
    rubro: "SEMILLAS FORRAJERAS",
    subrubro: "ALFALFAS",
    precio: 260.00,
    stock: 620.0,
    iva: 10.5,
    cod_alfa: "BAR-900",
    cod_barras: "7798001002"
  },
  {
    codigo: "SEM-RYE-010",
    detalle: "RYEGRASS ANUAL TETRAPLOIDE BARINTENSO X 25 KG",
    rubro: "VERDEOS DE INVIERNO",
    subrubro: "RYEGRASS",
    precio: 85.50,
    stock: 1200.0,
    iva: 10.5,
    cod_alfa: "BAR-INTENSO",
    cod_barras: "7798001010"
  },
  {
    codigo: "SEM-RYE-020",
    detalle: "RYEGRASS PERENNE BARBOREAL X 25 KG",
    rubro: "PASTURAS PERENNES",
    subrubro: "RYEGRASS",
    precio: 115.00,
    stock: 450.0,
    iva: 10.5,
    cod_alfa: "BAR-BOREAL",
    cod_barras: "7798001020"
  },
  {
    codigo: "SEM-FES-030",
    detalle: "FESTUCA ARUNDINACEA FAWN X 25 KG",
    rubro: "PASTURAS PERENNES",
    subrubro: "GRAMÍNEAS",
    precio: 95.00,
    stock: 780.0,
    iva: 10.5,
    cod_alfa: "FEST-FAWN",
    cod_barras: "7798001030"
  },
  {
    codigo: "SEM-AGR-040",
    detalle: "AGROPIRO ALARGADO BARPAMPAS X 25 KG",
    rubro: "PASTURAS PERENNES",
    subrubro: "AGROPIRO",
    precio: 110.00,
    stock: 540.0,
    iva: 10.5,
    cod_alfa: "BAR-PAMPAS",
    cod_barras: "7798001040"
  },
  {
    codigo: "SEM-AVEN-050",
    detalle: "AVENA AMARILLA CANARIO FISCALIZADA X BOLSA 40 KG",
    rubro: "VERDEOS DE INVIERNO",
    subrubro: "AVENA",
    precio: 48.00,
    stock: 2100.0,
    iva: 10.5,
    cod_alfa: "AVE-CANARIO",
    cod_barras: "7798001050"
  },
  {
    codigo: "SEM-SOR-060",
    detalle: "SORGO FORRAJERO BMR BAR DULCE X BOLSA 20 KG",
    rubro: "VERDEOS DE VERANO",
    subrubro: "SORGOS",
    precio: 72.00,
    stock: 960.0,
    iva: 10.5,
    cod_alfa: "SOR-DULCE",
    cod_barras: "7798001060"
  },
  {
    codigo: "BIO-INO-100",
    detalle: "PACK INOCULANTE + TERAPÉUTICO CURASEMILLAS ALFALFA",
    rubro: "BIOLÓGICOS Y CURASEMILLAS",
    subrubro: "INOCULANTES",
    precio: 38.50,
    stock: 310.0,
    iva: 21.0,
    cod_alfa: "INO-ALF",
    cod_barras: "7798001100"
  },
  {
    codigo: "AGR-FER-200",
    detalle: "FERTILIZANTE FOLIAR BIO-ESTIMULANTE PASTURAS X 20 L",
    rubro: "NUTRICIÓN VEGETAL",
    subrubro: "FOLIARES",
    precio: 65.00,
    stock: 180.0,
    iva: 21.0,
    cod_alfa: "FER-PAST",
    cod_barras: "7798001200"
  }
];

// Condiciones de Venta Palaversich
const condicionesPalaversichDB = [
  { codigo: "0", nombre: "CONTADO CONTRA ENTREGA", dias: 0 },
  { codigo: "1", nombre: "CANJE CEREAL COSECHA MAYO", dias: 180 },
  { codigo: "2", nombre: "PLAZO DÓLAR LINKED 60 DÍAS", dias: 60 },
  { codigo: "3", nombre: "VALORES PAGO DIFERIDO 90 DÍAS", dias: 90 },
  { codigo: "4", nombre: "CUENTA CORRIENTE AGRO 30 DÍAS", dias: 30 }
];

// Condiciones de Venta Petrobono
const condicionesPetrobonoDB = [
  { codigo: "0", nombre: "PAGO ANTICIPADO TRANSFERENCIA", dias: 0 },
  { codigo: "1", nombre: "CUENTA CORRIENTE MAYORISTA 7 DÍAS", dias: 7 },
  { codigo: "2", nombre: "CUENTA CORRIENTE 15 DÍAS CISTERNA", dias: 15 },
  { codigo: "3", nombre: "E-CHEQ 30 DÍAS", dias: 30 }
];

// Helper global para obtener clientes según empresa activa (Maestro de Clientes CLIENTESNV)
window.getClientesPorEmpresa = function(empresaKey) {
  if (typeof clientesDB !== 'undefined' && Array.isArray(clientesDB) && clientesDB.length > 0) {
    if (empresaKey === 'petrobono' && typeof clientesPetrobono !== 'undefined') {
      return [...clientesPetrobono, ...clientesDB];
    }
    if (empresaKey === 'palaversich' && typeof clientesPalaversich !== 'undefined') {
      return [...clientesPalaversich, ...clientesDB];
    }
    return clientesDB;
  }
  return [];
};

// Helper global para obtener catálogo de productos según empresa activa
window.getProductosPorEmpresa = function(empresaKey) {
  if (empresaKey === 'petrobono') {
    return productosPetrobono;
  }
  if (empresaKey === 'palaversich') {
    return productosPalaversich;
  }
  // PASINA MARCELO ALEJANDRO: Catálogo oficial extraído de PRODUCTOSNV / PRODUCTOSPA
  return (typeof productosDB !== 'undefined' && Array.isArray(productosDB)) ? productosDB : [];
};

// Helper global para obtener condiciones de venta según empresa activa
window.getCondicionesPorEmpresa = function(empresaKey) {
  if (empresaKey === 'petrobono') {
    return condicionesPetrobonoDB;
  }
  if (empresaKey === 'palaversich') {
    return condicionesPalaversichDB;
  }
  // PASINA MARCELO ALEJANDRO: Tabla oficial extraída de CONDICIONESNV
  return (typeof condicionesPasinaDB !== 'undefined' && Array.isArray(condicionesPasinaDB)) ? condicionesPasinaDB : [];
};
