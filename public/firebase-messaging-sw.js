// public/firebase-messaging-sw.js

// Importar librerías Firebase compat
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js');

// Inicializar Firebase
firebase.initializeApp({
  apiKey: "AIzaSyB1Vunc7y7Q0wJAzuiaM0OjP0oGbL1EuF0",
  authDomain: "comisiones-y-reservas.firebaseapp.com",
  projectId: "comisiones-y-reservas",
  storageBucket: "comisiones-y-reservas.appspot.com",
  messagingSenderId: "81169424089",
  appId: "1:81169424089:web:b2696236be1bde26c328c8",
  measurementId: "G-VRNNMB02E5"
});

// Instancia de messaging
const messaging = firebase.messaging();

// ------------------------
// Recibir mensajes en background
// ------------------------
messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Mensaje recibido en background:', payload);

  // Extraer tipo y detalles de notificación si vienen en data
  const tipo = payload.data?.tipo || "Tarea de reserva";
  const mensaje = payload.notification?.body || payload.data?.mensaje || "";

  const notificationTitle = `${tipo}`;
  const notificationOptions = {
    body: mensaje,
    icon: '/logo192.png',
    badge: '/logo192.png', // Opcional
    data: {
      url: payload.data?.url || '/', // URL a abrir al click
      reservaId: payload.data?.reservaId || null
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// ------------------------
// Click en notificación
// ------------------------
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  const url = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});


