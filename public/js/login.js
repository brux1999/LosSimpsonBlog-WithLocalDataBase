document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('#btn-register').addEventListener('click', function() {
            alert('No es posible registrar este usuario (pista: probá ingresar con "admin" en ambos campos jeje)');
    }
    );
});

document.addEventListener('DOMContentLoaded', function () {
    const loginBtn = document.getElementById('btn-login-to');
  
    loginBtn.addEventListener('click', function (event) {
      event.preventDefault();
  
      const username = document.querySelector('.flip-card__input[name="username"]').value;
      const password = document.querySelector('.flip-card__input[name="password"]').value;
  
      sendDataToServer(username, password);
    });
  
    function sendDataToServer(username, password) {
      const url = 'http://localhost:3005/login'; // URL del server
  
      const data = {
        username: username,
        password: password,
      };
    
      // Realizar la solicitud POST al servidor
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Credenciales incorrectas');
          }
          return response.json();
        })
        .then(data => {
          // Manejar el token recibido del servidor
          handleToken(data.token);
        })
        .catch(error => {
          console.error('Error al enviar la solicitud:', error);
          alert('Usuario y/o contraseña incorrectos, prueba con admin ;)');
        });
    }
  
    function handleToken(token) {

      console.log('Token recibido:', token);
  
      // Almacena el token en localStorage
      localStorage.setItem('access-token', token);

      // Almacena el usuario y la contraseña en localStorage
      localStorage.setItem('username', 'admin');
      localStorage.setItem('password', 'admin');

      window.location.href = 'index.html';

    }
  });
  