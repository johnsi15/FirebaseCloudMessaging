importScripts('https://www.gstatic.com/firebasejs/4.1.5/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/4.1.5/firebase-messaging.js')

firebase.initializeApp({
  'messagingSenderId': 'xxxxxxxxxxxx'
})

/*
Retrieve an instance of Firebase Messaging so that it can handle background messages.
*/
const messaging = firebase.messaging();
// Cuando la página no este abierta en el navegador puede enviar la notificación por este lado.
messaging.setBackgroundMessageHandler(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const title = 'Background Message Title';
  const options = {
    body: 'Background Message body.',
    icon: 'http:localhost:3000/firebase-logo.png'
  };

  return self.registration.showNotification(title, options);
});