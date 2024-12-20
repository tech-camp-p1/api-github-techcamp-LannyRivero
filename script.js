const APIURL = 'https://api.github.com/users/';

// elementos
let form = document.getElementById('form');
let search = document.getElementById('search');
let main = document.getElementById('main');

// funcion para obtener Datos del usuario desde la API
async function getUser(username) {
    try {
      const response = await fetch(`${APIURL}${username}`); //solicitud HTTP a la API de GitHub     
      if (!response.ok) {
        if (response.status === 404) {
          createErrorCard(`El usuario "${username}" no se encuentra en GitHub.`);
        } 
        return;
      }      
      let data = await response.json();// convierte la respuesta JSON en un objeto JavaScript.

      createUserCard(data);
      getRepository(username); // Llamada para obtener los repositorios

    } catch (err) {
      createErrorCard('A ocurrido un error inesperado.');
      console.error(err);
    }
  }

// Función para obtener los repositorios del usuario
async function getRepository(username) {
  try {
    let response = await fetch(`${APIURL}${username}/repos?sort=created&per_page=5`);//solicitud a la API de GitHub para obtener los repositorios del usuario ordenados por fecha de creación y limitando la cantidad a 5 (per_page=5)
    
    if (!response.ok) {
      createErrorCard('Problema al recuperar los repositorios.');
      return;
    }
    
    let repository = await response.json(); // convierte la respuesta JSON en un objeto JavaScript.
    addReposCard(repository);
  } catch (err) {
    createErrorCard('Se produjo un error inesperado al obtener los repositorios.');
    console.error(err);
  }
}

// Función para crear la tarjeta del usuario
function createUserCard(user) {
  let cardHTML = `
    <div class="card">
      <img src="${user.avatar_url}" alt="${user.name}" class="avatar">
      <div class="user-info">
        <h2>${user.name || user.login}</h2>
        <p>${user.bio || 'Bio no disponible.'}</p>
        <ul>
          <li><strong>${user.followers}</strong> Seguidores</li>
          <li><strong>${user.following}</strong> Siguiendo</li>
          <li><strong>${user.public_repos}</strong> Repositorios</li>
        </ul>
        <div id="repos"></div>
      </div>
    </div>
  `;

  main.innerHTML = cardHTML;
}

// Función para agregar los repositorios a la tarjeta
function addReposCard(repos) {
  const reposEl = document.getElementById('repos');
  repos.forEach(repo => {
    const repoEl = document.createElement('a');
    repoEl.classList.add('repo');
    repoEl.href = repo.html_url;
    repoEl.target = '_blank';
    repoEl.textContent = repo.name;
    reposEl.appendChild(repoEl);
  });
}

// Función para crear una tarjeta de error
function createErrorCard(message) {
  let cardHTML = `
    <div class="card">
      <h1>${message}</h1>
    </div>
  `;
  main.innerHTML = cardHTML;
}

// Evento del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();

  let user = search.value.trim();

  if (user) {
    getUser(user);
    search.value = '';
  }
});
