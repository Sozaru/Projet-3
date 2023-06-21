
// checkLoginStatus();
let loginLink = document.getElementById("login");
let openModalButton = document.getElementById("openmodalbutton");

// Récupération des données depuis l'API et traitement des données JSON
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    const gallery = document.querySelector('.gallery');
    const modalGallery = document.querySelector('.modal-gallery');

    data.forEach(work => {
      // Création des éléments HTML pour chaque image
      const figure = document.createElement('figure');
      const image = document.createElement('img');
      const figcaption = document.createElement('figcaption');

      image.src = work.imageUrl;
      image.alt = work.title;

      figcaption.textContent = work.title;

      // Ajout des attributs aux éléments figure
      figure.setAttribute('data-category', work.category.name);
      figure.setAttribute('data-image-id', work.id);

      figure.appendChild(image);
      figure.appendChild(figcaption);

      gallery.appendChild(figure);

      // Création d'un clone de l'élément figure pour la galerie modale
      const modalFigure = figure.cloneNode(true);
      modalFigure.removeChild(modalFigure.querySelector('figcaption')); 
      modalGallery.appendChild(modalFigure);
    });

    createFilterButtons();
  })
  .catch(error => {
    console.error('Une erreur s\'est produite lors de la récupération des images :', error);
  });

// Fonction pour créer les boutons de filtre
function createFilterButtons() {
  const filterButtons = document.createElement('div');
  filterButtons.classList.add('filters');

  const categories = ['Tous', 'Objets', 'Appartements', 'Hotels & restaurants'];

  categories.forEach(category => {
    const button = document.createElement('button');
    button.classList.add('filter-button');
    button.setAttribute('data-category', category);
    button.textContent = category;

    button.addEventListener('click', () => {
      filterWorks(category);
    });

    filterButtons.appendChild(button);
  });

  document.querySelector('#portfolio').insertBefore(filterButtons, document.querySelector('.gallery'));

  filterWorks("Tous"); // Filtrage initial avec la catégorie "Tous"
}

// Fonction pour filtrer les oeuvres en fonction de la catégorie
function filterWorks(category) {
  const figures = document.querySelectorAll('.gallery figure');

  figures.forEach(figure => {
    const figureCategory = figure.getAttribute('data-category');

    if (category === 'Tous' || category === figureCategory) {
      figure.style.display = 'block';
    } else {
      figure.style.display = 'none';
    }
  });
}

// Fonction pour vérifier l'état de connexion
function checkLoginStatus() {
  const token = localStorage.getItem("token");

  if (token) {
    loginLink.innerHTML = '<a href="#">logout</a>';
    openModalButton.innerHTML = '<button>modifier</button>';
    loginLink.addEventListener("click", () => {
      localStorage.removeItem("token");
      location.reload();
    });
  } else {
    loginLink.innerHTML = '<a href="login.html">login</a>';
  }
}

// Gestion de la modal principale
const modal = document.getElementById('modal');
const closeBtn = document.querySelector('.close');

function openModal() {
  modal.style.display = 'block';
}

function closeModal() {
  modal.style.display = 'none';
}

openModalButton.addEventListener('click', openModal);

closeBtn.addEventListener('click', closeModal);

window.addEventListener('mousedown', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

// Ajout de la modal pour l'ajout de photo
const modalContent = document.getElementById('modal-content');
modalContent.style.display = 'block';
const addPhotoButton = document.createElement('button');
addPhotoButton.textContent = 'Ajouter une photo';
addPhotoButton.addEventListener('click', openNewModal);
modalContent.appendChild(addPhotoButton);

const modalAddPhoto = document.getElementById('modal-add-photo');
modalAddPhoto.style.display = 'none';
modalAddPhoto.addEventListener('click', closeModalAddPhoto);



const closeButton = document.createElement('span');
closeButton.classList.add('close');
closeButton.textContent = '×';
closeButton.addEventListener('click', closeModalAddPhoto);

modalAddPhoto.appendChild(closeButton);

const newModalTitle = document.createElement('h3');
newModalTitle.textContent = 'Ajouter une photo';
modalAddPhoto.appendChild(newModalTitle);

const newModalContentBody = document.createElement('div');
newModalContentBody.classList.add('modal-body');

modalContent.appendChild(newModalContentBody);


function openNewModal() {
  modalAddPhoto.classList.remove('hidden');
  modalAddPhoto.style.display = 'block';
  modalContent.style.display = 'none';
}

function closeModalAddPhoto(event) {
  const modal = event.target.closest('.modal');
  if (modal) {
    modal.remove();
  }
}

checkLoginStatus();
