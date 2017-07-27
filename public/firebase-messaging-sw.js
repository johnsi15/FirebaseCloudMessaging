importScripts('https://www.gstatic.com/firebasejs/4.1.5/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.5/firebase-messaging.js');

firebase.initializeApp({
  'messagingSenderId': 'XXXXX'
})

/*
Retrieve an instance of Firebase Messaging so that it can handle background messages.
*/
const messaging = firebase.messaging();

// Tener en cuenta que esto funciona es cuando no tenemos nuestro sitio web abierto en el browser
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