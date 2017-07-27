// Initialize Firebase
var config = {
  apiKey: "xxxxxxxxxxxx",
  authDomain: "notificacionesop.firebaseapp.com",
  databaseURL: "https://notificacionesop.firebaseio.com",
  projectId: "notificacionesop",
  storageBucket: "notificacionesop.appspot.com",
  messagingSenderId: "xxxxxx"
};

firebase.initializeApp(config);

const messaging = firebase.messaging();

requestPermission();

//Pedimos permiso
function requestPermission(){
  messaging.requestPermission()
    .then(function (){
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      resetUI();
      // [END_EXCLUDE]
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
}

//Si se actualiza el token 
messaging.onTokenRefresh(function(){
  messaging.getToken()
    .then(function(refreshedToken){
      console.log('Token refreshed.');
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      setTokenSentToServer(false);
      // Send Instance ID token to app server.
      sendTokenToServer(refreshedToken, 'update');
      // [START_EXCLUDE]
      // Display new Instance ID token and clear UI of all previous messages.
      resetUI();
      // [END_EXCLUDE]
    })
    .catch(function(err) {
      console.log('Unable to retrieve refreshed token ', err);
      showToken('Unable to retrieve refreshed token ', err);
    });
});

// El payload nos manda un object si estamos en la misma página entonces podemos manejar ese object
// a nuestro gusto
messaging.onMessage(function(payload){
  console.log("Message received. ", payload);
  //Mostramos el mensaje en pantalla
  appendMessage(payload);
});

// [END receive_message]
function resetUI(){
  showToken('loading...');

  // Enviamos el token como tal
  messaging.getToken()
    .then(function (currentToken){
      if(currentToken){
        sendTokenToServer(currentToken, 'create');
        // Actualizamos y enviamos el token.
        updateUIForPushEnabled(currentToken);
      }else{
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        setTokenSentToServer(false);
      }
    })
    .catch(function (err){
      console.log('An error occurred while retrieving token. ', err);
      showToken('Error retrieving Instance ID token. ', err);
      setTokenSentToServer(false);
    });
}

//Mostramoe el token en un div oculto.
function showToken(currentToken){
  // Show token in console and UI.
  var tokenElement = document.querySelector('#token');
  tokenElement.textContent = currentToken;
}

// Enviamos el token si true lo cambiamos a false y nos muestra que ya se envio el token y si no lo contrario.
function sendTokenToServer(currentToken, type){
  if(!isTokenSentToServer()){
    console.log('Sending token to server...');
    // TODO(developer): Send the current token to your server.
    setTokenSentToServer(true);
    //Enviamos el token al server.
    if(type == 'create'){
      var url = 'https://iid.googleapis.com/iid/v1/'+currentToken+'/rel/topics/newnews';
      //https://iid.googleapis.com/iid/v1/REGISTRATION_TOKEN/rel/topics/TOPIC_NAME
      suscriptionTokenApp(url);
      console.log('Createeeee')
    }else{
      var url = 'https://iid.googleapis.com/v1/web/iid/'+currentToken+':refresh'
      updateTokenApp(url)
      console.log('Updateee')
    }
  }else{
    console.log('Token already sent to server so won\'t send it again ' + 'unless it changes');
  }
}

// Validamos el token si es true o false
function isTokenSentToServer(){
  return window.localStorage.getItem('sentToServer') == 1;
}

// Guardamos 1 el localStorage para saber si el token ya se envio al server y 0 si se actualizo
function setTokenSentToServer(sent){
  window.localStorage.setItem('sentToServer', sent ? 1 : 0);
}

// Eliminos el token 
function deleteToken(){
  // Delete Instance ID token.
  // [START delete_token]
  messaging.getToken()
  .then(function(currentToken){
    messaging.deleteToken(currentToken)
      .then(function() {
        console.log('Token deleted.');
        setTokenSentToServer(false);
        deleteTokenApp(currentToken);
        // [START_EXCLUDE]
        // Once token is deleted update UI.
        resetUI();
        // [END_EXCLUDE]
      })
      .catch(function(err){
        console.log('Unable to delete token. ', err);
      });
    // [END delete_token]
  })
  .catch(function(err){
    console.log('Error retrieving Instance ID token. ', err);
    showToken('Error retrieving Instance ID token. ', err);
  });
}

//actualizamos el token 
function updateUIForPushEnabled(currentToken){
  showToken(currentToken);
}

// Mostramos el mensaje en pantalla si todo esta bien
function appendMessage(payload){
  const title = payload.notification.title;
  const options = {
    body: payload.notification.body,
    icon: payload.notification.icon
  }
  // Forma nativa
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
}

resetUI();

//YOUR-SERVER-KEY
const key = 'xxxxxxxxxxxxxx';

//YOUR-IID-TOKEN
// var to = 'dESeTiIP9jY:APA91bFzBbfU0U3MzBI-ZZkNs6-pf6J8MF6Vc8MSxH3WFsdt4kMqFC9ttJ4dLG02i1aXwQJdnef9-E3W4mNYi3uw6YsTb4xsNknLZsg1un4XMOJ_wizCESqB7LeNITs2GIezPYhVXr8w';

function suscriptionTokenApp(url){
  // console.log('Ruta ->', url);
  fetch(url, {
    'method': 'POST',
    'headers': {
      'Authorization': 'key=' + key,
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
  .then( data => console.log(data))
  .catch(function(error) {
    console.error(error);
  })
}

function updateTokenApp(url){
  fetch(url, {
    'method': 'POST',
    'headers': {
      'Authorization': 'key=' + key,
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
  .then( data => console.log(data))
  .catch(function(error) {
    console.error(error);
  })
}

function deleteTokenApp(token){  
  fetch('https://iid.googleapis.com/v1/web/iid/'+token, {
    'method': 'POST',
    'headers': {
      'Authorization': 'key=' + key,
      'Content-Type': 'application/json'
    }
  }).then(response => response.json())
  .then( data => console.log(data))
  .catch(function(error) {
    console.error(error);
  })
}

var notification = {
  'title': 'Hello world',
  'body': 'Probando notifications.....',
  'icon': 'http://localhost:3000/firebase-logo.png',
  'click_action': 'http://localhost:3000'
};

// Enviamos el mensaje via post
function enviarNotificacion(){
  // var tokenElement = document.querySelector('#token');
  // var to = tokenElement.textContent;

  //Enviarmos el mensaje por tema del server
  fetch('https://fcm.googleapis.com/fcm/send', {
    'method': 'POST',
    'headers': {
      'Authorization': 'key=' + key,
      'Content-Type': 'application/json'
    },
    'body': JSON.stringify({
      'notification': notification,
      'to': '/topics/newnews'
    })
  }).then(function(response) {
    console.log(response);
  }).catch(function(error) {
    console.error(error);
  })
}

// Ver info del token
/*fetch('https://iid.googleapis.com/iid/info/dESeTiIP9jY:APA91bFzBbfU0U3MzBI-ZZkNs6-pf6J8MF6Vc8MSxH3WFsdt4kMqFC9ttJ4dLG02i1aXwQJdnef9-E3W4mNYi3uw6YsTb4xsNknLZsg1un4XMOJ_wizCESqB7LeNITs2GIezPYhVXr8w', {
  'headers': {
      'Authorization': 'key=' + key,
      'Content-Type': 'application/json'
  },
}).then( response => response.json())
  .then( data => console.log(data))*/

//Mas info:
/*
  https://github.com/firebase/quickstart-js/tree/master/messaging
  https://firebase.google.com/docs/cloud-messaging/js/receive?authuser=1
  https://console.firebase.google.com/u/0/project/notificacionesop/overview?hl=es-419
  https://firebase.google.com/docs/cloud-messaging/js/send-multiple
  https://firebase.google.com/docs/cloud-messaging/send-message#send_messages_to_topics
  https://developers.google.com/instance-id/reference/server#get_information_about_app_instances
*/