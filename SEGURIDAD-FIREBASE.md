# Seguridad de Glow & Crunch — Guía Firebase

Esta guía explica cómo quedó la seguridad nueva de la app y los 3 pasos que
faltan por hacer **en la consola de Firebase** (no se pueden hacer desde el código).

---

## 1. Cómo funciona ahora el modo admin (sin PIN, sin trucos)

**Antes (inseguro):** 5 dedos / 5 clics + PIN escrito en el código. Cualquiera
que abriera "Inspeccionar" podía ver el PIN y entrar.

**Ahora (seguro):** el admin es un **rol guardado en la base de datos**, no en la app.

1. Entra a [Firebase Console](https://console.firebase.google.com) → proyecto `glow-y-crunch`
   → **Firestore Database**.
2. Abre la colección `usuarios` y el documento de **tu correo** (el que usas con Google).
3. Agrega un campo nuevo:
   - Campo: `rol`
   - Tipo: `string`
   - Valor: `admin`
4. Guarda. Cierra sesión en la app y vuelve a entrar con Google: verás un
   **botón de corona** arriba a la derecha. Ese es tu panel admin.

Si alguien abre "Inspeccionar" e intenta ponerse `rol: "admin"` desde su
computadora, **Firestore lo rechaza en el servidor** con las reglas del paso 2.
El rol nunca viaja ni se decide en el navegador.

---

## 2. Reglas de Firestore (cópialas tal cual)

Firebase Console → Firestore Database → **Reglas** → pega esto → **Publicar**:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ¿La persona que pide es admin? Se mira en el SERVIDOR, no en el navegador.
    function isAdmin() {
      return request.auth != null
        && request.auth.token.email != null
        && exists(/databases/$(database)/documents/usuarios/$(request.auth.token.email))
        && get(/databases/$(database)/documents/usuarios/$(request.auth.token.email)).data.rol == "admin";
    }

    // Cada usuario solo lee/crea/edita SU documento, y JAMÁS puede tocarse el rol.
    match /usuarios/{correo} {
      allow read: if isAdmin() || (request.auth != null && request.auth.token.email == correo);
      allow create: if request.auth != null && request.auth.token.email == correo
                    && !("rol" in request.resource.data);
      allow update: if isAdmin()
                    || (request.auth != null && request.auth.token.email == correo
                        && !("rol" in request.resource.data));
      allow delete: if isAdmin();
    }

    // Menú, banners y configuración: todos leen, SOLO admin escribe.
    match /menu/{id}    { allow read: if true; allow write: if isAdmin(); }
    match /banners/{id} { allow read: if true; allow write: if isAdmin(); }
    match /config/{id}  { allow read: if true; allow write: if isAdmin(); }

    // Mesas: todos las ven; los clientes solo pueden cambiar estado/cliente/desde
    // (para reservar); sillas, número y demás solo el admin.
    match /mesas/{id} {
      allow read: if true;
      allow create, delete: if isAdmin();
      allow update: if isAdmin()
        || (request.auth != null
            && request.resource.data.diff(resource.data).affectedKeys()
                 .hasOnly(["estado", "cliente", "desde"]));
    }

    // Reservas: cualquier usuario con sesión crea la suya; solo admin las maneja.
    match /reservas/{id} {
      allow read: if isAdmin();
      allow create: if request.auth != null;
      allow update, delete: if isAdmin();
    }
  }
}
```

> Con estas reglas, aunque alguien modifique la app con "Inspeccionar", el
> servidor solo le deja: ver el menú, crear su usuario, reservar mesas. Nada más.

---

## 3. App Check (anti-hackeo del backend)

App Check hace que Firebase **solo acepte peticiones de tu app real**. Si alguien
copia tus llaves y las usa desde otra página o desde código suelto, Firebase lo bloquea.

### Pasos (5 minutos):

1. Firebase Console → **App Check** (menú lateral, sección "Compilación").
2. En tu app web, toca **Registrar** → elige **reCAPTCHA v3**.
3. Te pedirá registrar el sitio en reCAPTCHA: pon tu dominio
   (el de GitHub Pages / Netlify / donde tengas la página).
4. Copia la **clave de sitio** (empieza con `6L...`).
5. En `index.html`, busca esta línea (está arriba, junto a la config de Firebase):

   ```js
   const APPCHECK_SITE_KEY = "";
   ```

   y pega tu clave:

   ```js
   const APPCHECK_SITE_KEY = "6Lxxxxxxxxxxxxxxxxxxxx";
   ```

6. De vuelta en App Check → **APIs** → activa **"Aplicar" (Enforce)** en
   **Cloud Firestore** y **Authentication**.

¡Listo! Desde ese momento, cualquier intento de hablar con tu backend desde
fuera de tu app es rechazado automáticamente.

> Consejo: primero pega la clave, prueba que la app siga funcionando un par de
> días, y DESPUÉS activa "Aplicar". Así no te quedas fuera por accidente.

---

## 4. Cosas extra recomendadas

- **Dominios autorizados:** Firebase Console → Authentication → Settings →
  *Authorized domains*. Deja solo tu dominio real (y `localhost` para pruebas).
- **No compartas la cuenta Google que tiene rol admin.** Si otra persona del
  equipo necesita admin, agrégale `rol: "admin"` a SU correo en Firestore.
- **Las llaves del código (apiKey, etc.) no son secretas** — la seguridad real
  son las reglas del paso 2 + App Check del paso 3. Por eso el orden importa.
- **Revisa el uso:** Firebase Console → Usage, por si ves picos raros de lecturas.

---

## Resumen de lo que cambió en la app

| Antes | Ahora |
|---|---|
| PIN `chontes` visible en el código | Sin PIN: rol `admin` guardado en Firestore |
| Entrar con 5 dedos o 5 clics (truco conocido) | Botón corona que solo aparece si el servidor confirma tu rol |
| Sin App Check | App Check listo: solo falta pegar tu clave reCAPTCHA v3 |
| Cualquiera podía intentar escribir en la base | Reglas de Firestore que bloquean todo lo que no seas tú |
