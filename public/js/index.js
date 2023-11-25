document.addEventListener('DOMContentLoaded', function () {
    scrollToTop();
    loginBtn();
})
function loginBtn() {
    document.querySelector('#btn-login').addEventListener('click', function () {
        window.location.href = 'login.html';
        localStorage.clear();
    });
}

  function scrollToTop() {
      document.querySelector('#btn-backtotop').addEventListener('click', function () {
          window.scrollTo({
              top: 0,
              left: 0,
              behavior: 'smooth'
          });
      });
  }
  document.addEventListener('DOMContentLoaded', function () {
    const URL = 'http://localhost:3005';
    const comentariosList = document.getElementById('comment_list');
    const comentarioForm = document.getElementById('commentForm');

    function cargarComentarios() {
        //Lo puse manualmente pero igualmente están en el localStorage si se ingresa como admin
        const accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzAwOTI5MzYyfQ.BHfwAWKuJr3vE0c_LypLw1KZuVxqf6HiaUUZMUgBOVw';
    
        const data = {
            username: 'admin',
            password: 'admin'
        };
    
        fetch(`${URL}/listaComentarios`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'access-token': accessToken,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la solicitud: ${response.status}`);
                }
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    return response.json();
                } else {
                    return {};
                }
            })
            .then(comentarios => renderizarComentarios(comentarios))
            .catch(error => {
                console.error('Error al cargar comentarios:', error);
                comentariosList.innerHTML = '<p>Error al cargar comentarios.</p>';
            });
    }
    

    function renderizarComentarios(comentarios) {
        comentariosList.innerHTML = comentarios.map(comentario => {
            const fechaComentario = new Date(comentario.created_at);
            const fechaLocalString = fechaComentario.toLocaleString();

            return `
                <div class="card mb-3 bg-dark">
                    <div class="card-body text-white">
                        <h5 class="card-title">${comentario.name}</h5>
                        <p class="card-text">${comentario.comment_text}</p>
                        <small class="text-warning">${fechaLocalString}</small>
                    </div>
                </div>
            `;
        }).join('');
    }

    function agregarComentario(event) {
        event.preventDefault();
    
        const name = document.getElementById('name').value;
        const comment_text = document.getElementById('comment_text').value;
    
        const currentDate = new Date();
        const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");

        //Lo puse manualmente pero igualmente están en el localStorage si se ingresa como admin
        const data = {
            name,
            comment_text,
            created_at: formattedDate,
            username: "admin",
            password: "admin"
        };
    
        fetch(`${URL}/agregarComentario`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "access-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWF0IjoxNzAwOTI5MzYyfQ.BHfwAWKuJr3vE0c_LypLw1KZuVxqf6HiaUUZMUgBOVw",
            },
            body: JSON.stringify(data),
        })
            .then(response => response.json())
            .then(result => {
                console.log(result.message);
                cargarComentarios();
            });
    }

    cargarComentarios();
    comentarioForm.addEventListener('submit', agregarComentario);
});
