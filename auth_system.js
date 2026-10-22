// ==========================================================================
// AUTH_SYSTEM.JS — CONTROL DE ACCESO, LOGIN Y AISLAMIENTO MULTI-EMPRESA
// Aislamiento total: Palaversich S.A. y Pasina S.A.
// ==========================================================================

(function() {
  'use strict';

  // Base de Usuarios autorizados del sistema
  const AUTH_USERS = [
    // --- PALAVERSICH Y CIA. S.A.C. ---
    {
      username: "CARLOS",
      nombre: "Carlos Ilarraz",
      empresa: "palaversich",
      vendedor: "4",
      role: "Asesor Comercial (Vend. 4)",
      passwords: ["123", "1234", "pala123", "carlos", "carlos123"],
      email: "carlos.ilarraz@palaversich.com"
    },
    {
      username: "FERNANDO",
      nombre: "Fernando Bato",
      empresa: "palaversich",
      vendedor: "7",
      role: "Asesor Comercial (Vend. 7)",
      passwords: ["123", "1234", "pala123", "fernando", "fernando123"],
      email: "fernando.bato@palaversich.com"
    },
    {
      username: "FERNANDO5",
      nombre: "Fernando Bato",
      empresa: "palaversich",
      vendedor: "5",
      role: "Asesor Comercial (Vend. 5)",
      passwords: ["123", "1234", "pala123", "fernando5"],
      email: "fernando5.bato@palaversich.com"
    },
    {
      username: "JUANCRUZ",
      nombre: "Juan Cruz Illia",
      empresa: "palaversich",
      vendedor: "12",
      role: "Asesor Comercial (Vend. 12)",
      passwords: ["123", "1234", "pala123", "juancruz"],
      email: "juancruz.illia@palaversich.com"
    },
    {
      username: "BRUNO",
      nombre: "Bruno Salemi",
      empresa: "palaversich",
      vendedor: "11",
      role: "Asesor Comercial (Vend. 11)",
      passwords: ["123", "1234", "pala123", "bruno"],
      email: "bruno.salemi@palaversich.com"
    },
    {
      username: "EMANUEL",
      nombre: "Emanuel Molina",
      empresa: "palaversich",
      vendedor: "13",
      role: "Asesor Técnico (Vend. 13)",
      passwords: ["123", "1234", "pala123", "emanuel", "molina"],
      email: "emanuel.molina@palaversich.com"
    },
    {
      username: "MARTIN",
      nombre: "Martín Díaz",
      empresa: "palaversich",
      vendedor: "3",
      role: "Asesor Comercial (Vend. 3)",
      passwords: ["123", "1234", "pala123", "martin"],
      email: "martin.diaz@palaversich.com"
    },
    {
      username: "SEBASTIAN",
      nombre: "Sebastián Romero",
      empresa: "palaversich",
      vendedor: "1",
      role: "Asesor Comercial (Vend. 1)",
      passwords: ["123", "1234", "pala123", "sebastian"],
      email: "sebastian.romero@palaversich.com"
    },
    {
      username: "PABLO",
      nombre: "Pablo Gallardo",
      empresa: "palaversich",
      vendedor: "6",
      role: "Asesor Comercial (Vend. 6)",
      passwords: ["123", "1234", "pala123", "pablo"],
      email: "pablo.gallardo@palaversich.com"
    },
    {
      username: "EDUARDO",
      nombre: "Eduardo Montiel",
      empresa: "palaversich",
      vendedor: "8",
      role: "Asesor Comercial (Vend. 8)",
      passwords: ["123", "1234", "pala123", "eduardo"],
      email: "eduardo.montiel@palaversich.com"
    },
    {
      username: "JOSE",
      nombre: "José Ignacio Maggio",
      empresa: "palaversich",
      vendedor: "10",
      role: "Asesor Comercial (Vend. 10)",
      passwords: ["123", "1234", "pala123", "jose"],
      email: "jose.maggio@palaversich.com"
    },
    {
      username: "JUANCARO",
      nombre: "Juan Caro",
      empresa: "palaversich",
      vendedor: "2",
      role: "Asesor Comercial (Vend. 2)",
      passwords: ["123", "1234", "pala123", "juancaro"],
      email: "juan.caro@palaversich.com"
    },
    {
      username: "CAROLINA",
      nombre: "Carolina Mediavilla",
      empresa: "palaversich",
      vendedor: "",
      role: "Ventas Palaversich",
      passwords: ["123", "1234", "pala123", "carolina"],
      email: "carolina.mediavilla@palaversich.com"
    },
    {
      username: "PALAVERSICH",
      nombre: "Operador Palaversich S.A.",
      empresa: "palaversich",
      vendedor: "",
      role: "Ventas Palaversich",
      passwords: ["123", "1234", "pala123", "palaversich"],
      email: "ventas@palaversich.com"
    },

    // --- PASINA MARCELO ALEJANDRO ---
    {
      username: "PASINA",
      nombre: "Operador Pasina S.A.",
      empresa: "pasina",
      vendedor: "",
      role: "Ventas Pasina",
      passwords: ["123", "1234", "pasina123", "pasina"],
      email: "ventas@pasina.com"
    },
    {
      username: "MARCELO",
      nombre: "Marcelo Alejandro Pasina",
      empresa: "pasina",
      vendedor: "",
      role: "Dirección Pasina",
      passwords: ["123", "1234", "pasina123", "marcelo"],
      email: "marcelo@pasina.com"
    },
    {
      username: "ADMBAHIA",
      nombre: "Administración Bahía",
      empresa: "pasina",
      vendedor: "",
      role: "Administración Pasina",
      passwords: ["123", "1234", "pasina123", "admbahia"],
      email: "admbahia@pasina.com"
    },
    {
      username: "VENTASPASINA",
      nombre: "Asesor Comercial Pasina",
      empresa: "pasina",
      vendedor: "",
      role: "Ventas Pasina",
      passwords: ["123", "1234", "pasina123", "ventas"],
      email: "ventas@pasina.com"
    },
    {
      username: "OPERADOR",
      nombre: "Operador de Emisión Pasina",
      empresa: "pasina",
      vendedor: "",
      role: "Operador Logística Pasina",
      passwords: ["123", "1234", "pasina123", "operador"],
      email: "operador@pasina.com"
    },

    // --- ADMINISTRACIÓN GENERAL (Acceso Central Multi-Empresa) ---
    {
      username: "MELANI",
      nombre: "Melani Grandi",
      empresa: "admin",
      vendedor: "",
      role: "Administración Central",
      passwords: ["123", "1234", "admin123", "melani"],
      email: "melani@empresa.com"
    },
    {
      username: "JUANLUIS",
      nombre: "Juan Luis",
      empresa: "admin",
      vendedor: "",
      role: "Administración Central",
      passwords: ["123", "1234", "admin123", "juanluis", "juan"],
      email: "juanluis@empresa.com"
    },
    {
      username: "ADMIN",
      nombre: "Administrador del Sistema",
      empresa: "admin",
      vendedor: "",
      role: "Administrador General",
      passwords: ["123", "1234", "admin123", "admin"],
      email: "admin@empresa.com"
    }
  ];

  window.AUTH_USERS = AUTH_USERS;

  // Sesión activa
  const SESSION_KEY = "crm_auth_session";

  function getAuthSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  function setAuthSession(user) {
    const sessionObj = {
      id: user.username.toLowerCase(),
      username: user.username.toUpperCase(),
      nombre: user.nombre || user.username,
      empresa: user.empresa, // 'palaversich', 'pasina', o 'admin'
      vendedor: user.vendedor || '',
      role: user.role || 'Usuario',
      email: user.email || `${user.username.toLowerCase()}@empresa.com`,
      loginTime: new Date().toISOString()
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionObj));

    // Sincronizar también con crm_system_config para retrocompatibilidad
    try {
      let cfg = JSON.parse(localStorage.getItem("crm_system_config") || "{}");
      cfg.usuario = sessionObj.username;
      cfg.nombreOperador = sessionObj.nombre;
      cfg.vendedorNumero = sessionObj.vendedor;
      localStorage.setItem("crm_system_config", JSON.stringify(cfg));
    } catch (e) {}

    return sessionObj;
  }

  function clearAuthSession() {
    localStorage.removeItem(SESSION_KEY);
  }

  // Validar credenciales
  function validarCredenciales(username, password) {
    if (!username) return null;
    const cleanUser = String(username).trim().toUpperCase();
    const cleanPass = String(password || "").trim();

    const userFound = AUTH_USERS.find(u => u.username.toUpperCase() === cleanUser);
    if (!userFound) {
      // Si el usuario no está en la lista predefinida pero ingresó clave 123 o 1234
      if (cleanPass === "123" || cleanPass === "1234") {
        const isPasina = cleanUser.includes("PASINA");
        return {
          username: cleanUser,
          nombre: cleanUser,
          empresa: isPasina ? "pasina" : "palaversich",
          vendedor: "",
          role: isPasina ? "Usuario Pasina" : "Usuario Palaversich",
          email: `${cleanUser.toLowerCase()}@${isPasina ? 'pasina.com' : 'palaversich.com'}`
        };
      }
      return null;
    }

    // Comprobar contraseña
    const acceptedPasswords = [
      ...(userFound.passwords || []),
      "123",
      "1234",
      userFound.username.toLowerCase()
    ];

    const passMatch = acceptedPasswords.some(p => p.toLowerCase() === cleanPass.toLowerCase());
    if (passMatch) {
      return userFound;
    }
    return null;
  }

  // Aplicar aislamiento estricto de empresa según el perfil
  function aplicarAislamientoEmpresa(session) {
    if (!session) return;
    const empresa = session.empresa; // 'palaversich', 'pasina' o 'admin'
    const switcher = document.querySelector(".company-switcher-container");
    const companySelect = document.getElementById("company-select");

    if (empresa === "palaversich") {
      // 1. Ocultar completamente el selector de empresa
      if (switcher) switcher.style.setProperty("display", "none", "important");
      if (companySelect) companySelect.value = "palaversich";

      // 2. Título de pestaña del navegador
      document.title = "Ingreso de Nota de Venta • Palaversich y Cía. S.A.C.";

      // 3. Forzar cambio a Palaversich si la función global existe
      if (typeof window.setEmpresaActivaGlobal === "function") {
        window.setEmpresaActivaGlobal("palaversich");
      }

      // 4. Adaptar configuración para que no mencione a Pasina
      const configGroupPala = document.getElementById("cfg-group-vendedor-palaversich");
      if (configGroupPala) configGroupPala.style.display = "block";

    } else if (empresa === "pasina") {
      // 1. Ocultar completamente el selector de empresa
      if (switcher) switcher.style.setProperty("display", "none", "important");
      if (companySelect) companySelect.value = "pasina";

      // 2. Título de pestaña del navegador
      document.title = "Ingreso de Nota de Venta • Pasina Marcelo Alejandro";

      // 3. Forzar cambio a Pasina si la función global existe
      if (typeof window.setEmpresaActivaGlobal === "function") {
        window.setEmpresaActivaGlobal("pasina");
      }

      // 4. Ocultar opciones exclusivas de Palaversich en configuración
      const configGroupPala = document.getElementById("cfg-group-vendedor-palaversich");
      if (configGroupPala) configGroupPala.style.display = "none";

    } else {
      // Administrador Central: tiene acceso multi-empresa
      if (switcher) switcher.style.setProperty("display", "flex", "important");
      const targetEmp = (companySelect && companySelect.value) ? companySelect.value : (window.currentCompanyKey || "palaversich");
      if (companySelect) companySelect.value = targetEmp;
      if (typeof window.setEmpresaActivaGlobal === "function") {
        window.setEmpresaActivaGlobal(targetEmp);
      }
      document.title = targetEmp === 'pasina' 
        ? "Ingreso de Nota de Venta • Pasina Marcelo Alejandro (Admin)" 
        : "Ingreso de Nota de Venta • Palaversich y Cía. S.A.C. (Admin)";
      const configGroupPala = document.getElementById("cfg-group-vendedor-palaversich");
      if (configGroupPala) configGroupPala.style.display = (targetEmp === 'palaversich') ? "block" : "none";
    }

    // Actualizar datos del usuario en UI
    actualizarBadgesUsuarioUI(session);

    // Notificar a Chat System sobre el cambio de sesión
    if (window.SGChat && typeof window.SGChat.setUser === "function") {
      window.SGChat.setUser(session);
    }
  }

  function actualizarBadgesUsuarioUI(session) {
    const headerUserName = document.getElementById("header-user-name");
    if (!headerUserName || !session) return;

    if (session.empresa === "palaversich" && session.vendedor) {
      headerUserName.innerHTML = `<span style="font-weight: 800;">${session.username}</span> <span style="font-size: 11px; color: var(--warning); opacity: 0.95;">(VEND. ${session.vendedor})</span>`;
    } else if (session.empresa === "pasina") {
      headerUserName.innerHTML = `<span style="font-weight: 800;">${session.username}</span> <span style="font-size: 11px; color: #38bdf8; opacity: 0.95;">(PASINA)</span>`;
    } else {
      headerUserName.innerHTML = `<span style="font-weight: 800;">${session.username}</span> <span style="font-size: 11px; color: #10b981; opacity: 0.95;">(ADMIN)</span>`;
    }
  }

  // Mostrar / Ocultar pantalla de login
  function mostrarPantallaLogin() {
    const modal = document.getElementById("modal-login");
    if (!modal) return;
    modal.style.display = "flex";
    modal.classList.add("active");

    const userInp = document.getElementById("login-username");
    const passInp = document.getElementById("login-password");
    const errorAlert = document.getElementById("login-error-alert");

    if (errorAlert) errorAlert.style.display = "none";
    if (passInp) passInp.value = "";
    if (userInp) {
      setTimeout(() => userInp.focus(), 100);
    }
  }

  function ocultarPantallaLogin() {
    const modal = document.getElementById("modal-login");
    if (!modal) return;
    modal.style.display = "none";
    modal.classList.remove("active");
  }

  // Ejecutar login
  function ejecutarLogin() {
    const userInp = document.getElementById("login-username");
    const passInp = document.getElementById("login-password");
    const errorAlert = document.getElementById("login-error-alert");
    const errorText = document.getElementById("login-error-text");

    const u = userInp ? userInp.value.trim() : "";
    const p = passInp ? passInp.value.trim() : "";

    if (!u) {
      if (errorAlert && errorText) {
        errorText.textContent = "Por favor ingrese su nombre de usuario.";
        errorAlert.style.display = "flex";
      }
      if (userInp) userInp.focus();
      return;
    }

    const auth = validarCredenciales(u, p);
    if (!auth) {
      if (errorAlert && errorText) {
        errorText.textContent = "Usuario o contraseña incorrectos. Verifique sus credenciales.";
        errorAlert.style.display = "flex";
      }
      if (passInp) {
        passInp.value = "";
        passInp.focus();
      }
      return;
    }

    // Éxito: Guardar sesión y aislar empresa
    const session = setAuthSession(auth);
    ocultarPantallaLogin();
    aplicarAislamientoEmpresa(session);

    // Iniciar siempre en la pestaña de Ingreso de Nota de Venta
    if (typeof window.ejecutarCambioPestana === "function") {
      window.ejecutarCambioPestana("tab-nueva-nv");
    } else {
      const tabNvBtn = document.querySelector('.nav-tab[data-tab="tab-nueva-nv"]');
      if (tabNvBtn) tabNvBtn.click();
    }
  }

  // Cerrar sesión
  function cerrarSesionUsuario() {
    const session = getAuthSession();
    const nombre = session ? session.username : "usuario";
    if (confirm(`¿Desea cerrar la sesión de ${nombre}?`)) {
      clearAuthSession();
      if (window.SGChat && typeof window.SGChat.setUser === "function") {
        window.SGChat.setUser(null);
      }
      mostrarPantallaLogin();
    }
  }

  // Acceso Rápido para testing
  function loginRapido(username, password) {
    const userInp = document.getElementById("login-username");
    const passInp = document.getElementById("login-password");
    if (userInp) userInp.value = username;
    if (passInp) passInp.value = password || "123";
    ejecutarLogin();
  }

  function toggleLoginQuickAccounts() {
    const body = document.getElementById("login-quick-body");
    const chevron = document.getElementById("login-quick-chevron");
    if (!body) return;
    if (body.style.display === "none" || body.style.display === "") {
      body.style.display = "block";
      if (chevron) chevron.style.transform = "rotate(180deg)";
    } else {
      body.style.display = "none";
      if (chevron) chevron.style.transform = "rotate(0deg)";
    }
  }

  function toggleLoginPasswordVisibility() {
    const passInp = document.getElementById("login-password");
    const eyeIcon = document.getElementById("icon-eye-password");
    if (!passInp || !eyeIcon) return;
    if (passInp.type === "password") {
      passInp.type = "text";
      eyeIcon.className = "fa-solid fa-eye-slash";
    } else {
      passInp.type = "password";
      eyeIcon.className = "fa-solid fa-eye";
    }
  }

  // Exponer API global
  window.CRMAuth = {
    getAuthSession,
    setAuthSession,
    clearAuthSession,
    validarCredenciales,
    aplicarAislamientoEmpresa,
    mostrarPantallaLogin,
    ocultarPantallaLogin,
    ejecutarLogin,
    cerrarSesionUsuario,
    loginRapido,
    toggleLoginQuickAccounts,
    toggleLoginPasswordVisibility,
    AUTH_USERS
  };

  window.ejecutarLogin = ejecutarLogin;
  window.cerrarSesionUsuario = cerrarSesionUsuario;
  window.loginRapido = loginRapido;
  window.toggleLoginQuickAccounts = toggleLoginQuickAccounts;
  window.toggleLoginPasswordVisibility = toggleLoginPasswordVisibility;

  // Verificación al cargar la ventana
  document.addEventListener("DOMContentLoaded", () => {
    const session = getAuthSession();
    if (!session) {
      mostrarPantallaLogin();
    } else {
      aplicarAislamientoEmpresa(session);
      if (typeof window.ejecutarCambioPestana === "function") {
        window.ejecutarCambioPestana("tab-nueva-nv");
      }
    }
  });

})();
