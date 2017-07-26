// Initialize Firebase
var config = {
  apiKey: "xxxxxxxxxxxxxx",
  authDomain: "notificacionesop.firebaseapp.com",
  databaseURL: "https://notificacionesop.firebaseio.com",
  projectId: "notificacionesop",
  storageBucket: "notificacionesop.appspot.com",
  messagingSenderId: "xxxxxx"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();
// Pedimos los permisos necesarios
messaging.requestPermission()
  .then(function(){
    // console.log('Tengo permisos');
  })
  .catch(function(err){
    console.log('Error o no tengo permisos')
  })

//Obtenemos el token necesario para el envio de la notifications
messaging.getToken()
  .then((token) => {
    if (token) {
      console.log(token)
      sendTokenToServer(token)
    } else {
      // you don't have permission to show notifications
      // detect whether they are blocked or not, then show your custom UI  
    }
  })
  .catch((err) => {
    // retrieving token failed, analyze the error
  })

// Cuando estamos en la misma página no envia un object como respuesta y no una notificación
messaging.onMessage(function(payload){
  // console.log('onMessage: ', payload);

  const title = payload.notification.title;
  const options = {
    body: payload.notification.body,
    icon: payload.notification.icon
  }
  // Forma nativa creamos la notificación así estemos en la misma página.
  function permiso() {  
    Notification.requestPermission();
  };

  permiso();

  if(Notification){
    if(Notification.permission == "granted"){
      // console.log('Se lanzo la notificacion')
      var notification = new Notification(title, options);

      notification.onclick = function(e) {
        e.preventDefault(); // Previene al buscador de mover el foco a la pestaña del Notification
        window.open(payload.notification.click_action, '_blank');
      }
    }
  }
});

//YOUR-SERVER-KEY
var key = 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

//YOUR-IID-TOKEN
var to = 'xxxxxxxxxxxxxxxxxxxxxxxxxxx';

var notification = {
  'title': 'Portugal vs. Denmark',
  'body': '5 to 1',
  'icon': 'http://localhost:3000/firebase-logo.png',
  'click_action': 'http://localhost:3000'
};

// const btnEnviar = document.getElementById('btnEnviar');

function enviarNotificacion(e){
  fetch('https://fcm.googleapis.com/fcm/send', {
    'method': 'POST',
    'headers': {
      'Authorization': 'key=' + key,
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify({
      'notification': notification,
      'to': to
    })
  }).then(function(response) {
    console.log(response);
  }).catch(function(error) {
    console.error(error);
  })
}

//Mas info:
/*
  https://github.com/firebase/quickstart-js/tree/master/messaging
  https://firebase.google.com/docs/cloud-messaging/js/receive?authuser=1
  https://console.firebase.google.com/u/0/project/notificacionesop/overview?hl=es-419
*/