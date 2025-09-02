const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

// Inicializar Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function enviar() {
  try {
    const tokens = [
      "e_ePFnG70SWRCf_N49ULMY:APA91bH93rKfyB9sqvx4ULWFdJo-a_ekzerOoDrYC8NwWMv3SOSdRKgzkGMnDMp2wEEp-IRz39pRliofG9UwY5lYZ0tGO_Fua7XeQ4NyDvWN9oAcP4QDnSI"
    ];

    if (!tokens.length) {
      console.log("No hay tokens para enviar la notificación.");
      return;
    }

    const message = {
      tokens,
      notification: {
        title: "Prueba FCM",
        body: "¡Mensaje enviado correctamente!",
      },
    };

    // Usar getMessaging() en la nueva versión
    const messaging = admin.getMessaging();
    const response = await messaging.sendMulticast(message);

    console.log(`Notificaciones enviadas: ${response.successCount}, fallidas: ${response.failureCount}`);
    response.responses.forEach((r, idx) => {
      if (!r.success) console.error(`Error token[${idx}]:`, r.error);
    });

  } catch (err) {
    console.error("Error enviando notificación:", err);
  }
}

enviar();
