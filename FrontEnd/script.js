var loginLink = document.getElementById("login");
var active_category=0
const openModalButton = document.getElementById("openmodalbutton");
const modalContent = document.getElementById("modal-content");
const modalAddPhoto = document.getElementById("modal-add-photo");
// Gestion de la modal principale
const modal = document.getElementById("modal");
const closeBtn = document.querySelector(".close");

// Récupération des données depuis l'API et traitement des données JSON
fetch("http://localhost:5678/api/works")
  .then((response) => response.json())
  .then((data) => {

    data.forEach((work) => {
      displayOneWork(work);
    });

    openModalButton.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);

    window.addEventListener("mousedown", (event) => {
      if (event.target === modal) {
        closeModal();
      }
    });


    // Ajout de la modal pour l'ajout de photo

    const addPhotoButton = document.createElement("button");
    addPhotoButton.setAttribute("id", "addPhotoButton");
    addPhotoButton.textContent = "Ajout photo";
    modalContent.appendChild(addPhotoButton);
    addPhotoButton.addEventListener("click", openNewModal);

    modalAddPhoto.style.display = "none";
    const closeButton = document.createElement("span");
    closeButton.classList.add("close");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", closeModalAddPhoto);

    const addPhotoForm = document.getElementById("addPhotoForm");
    modalAddPhoto.insertBefore(closeButton, addPhotoForm);

    const newModalTitle = document.createElement("h3");
    newModalTitle.textContent = "Ajout photo";
    modalAddPhoto.insertBefore(newModalTitle, addPhotoForm);

    const newModalContentBody = document.createElement("div");
    newModalContentBody.classList.add("modal-body");
    modalAddPhoto.appendChild(newModalContentBody);

    // Ajouter un gestionnaire d'événement à la soumission du formulaire d'ajout de photo
    addPhotoForm.addEventListener("submit", handleAddPhotoFormSubmit);
   
    createReturnButton();

    checkLoginStatus();
  })
  .catch((error) => {
    console.error(
      "Une erreur s'est produite lors de la récupération des images :",
      error
    );
  });

function displayOneWork(work) {
  // Création des éléments HTML pour chaque image
  console.log("debug--------------------------------")
  const image = document.createElement("img");
  image.src = work.imageUrl;
  image.alt = work.title;

  const figcaption = document.createElement("figcaption");
  figcaption.textContent = work.title;

  const figure = document.createElement("figure");
  // Ajout des attributs aux éléments figure
  
  if (work.categoryId){
    figure.setAttribute("data-category", work.categoryId);
  }else{
    figure.setAttribute("data-category", work.category.id);
  }
  figure.setAttribute("data-image-id", work.id);

  figure.appendChild(image);
  figure.appendChild(figcaption);
  

  // Ajoutez le clone figure à la galerie normale
  document.querySelector(".gallery").appendChild(figure.cloneNode(true));

  // Création d'un clone de l'élément figure pour la galerie modale
  const modalFigure = figure.cloneNode(true);

  // Création du bouton pour l'icône de suppression
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";

  // Création de l'élément icône et ajout à l'image de la modal
  const icon = document.createElement("i");
  icon.className = "far fa-trash-can";

  // Ajout de l'icône au bouton
  deleteButton.appendChild(icon);

  // Insertion du bouton dans la figure modale
  modalFigure.insertBefore(deleteButton, modalFigure.childNodes[0]);

  const modalFigcaption = modalFigure.querySelector("figcaption");
  modalFigcaption.textContent = "éditer";

  // Ajout de la figure à la galerie modale
  document.querySelector(".modal-gallery").appendChild(modalFigure);

  filterWorks(active_category)

  deleteButton.addEventListener("click", (event) => {
    event.preventDefault();
    // Récupérer l'ID de l'image
    const imageId = modalFigure.getAttribute("data-image-id");

    // Envoyer une requête DELETE à l'API
    fetch(`http://localhost:5678/api/works/${imageId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
    .then((response) => {
      if (response.ok) {
        console.log("Image supprimée avec succès:");
        // Suppression de l'image du DOM
        modalFigure.remove();
        // Trouver et supprimer l'image de la galerie normale également
        const gallery = document.querySelector(".gallery");
        const galleryFigure = gallery.querySelector(
          `figure[data-image-id="${imageId}"]`
        );
        if (galleryFigure) {
          galleryFigure.remove();
        }
      }else{
        throw new Error("Erreur lors de la suppression de l'image");
      }
    })
    
      .catch((error) => {
        console.error(
          "Une erreur s'est produite lors de la suppression de l'image :",
          error
        );
      });
  });
}
// Fonction pour créer les boutons de filtre
function createFilterButtons() {
  const filterButtons = document.createElement("div");
  filterButtons.classList.add("filters");

  const categories = ["Tous", "Objets", "Appartements", "Hotels & restaurants"];

  categories.forEach((category, index) => {
    const button = document.createElement("button");
    button.classList.add("filter-button");
    button.setAttribute("data-category", index);
    button.textContent = category;

    button.addEventListener("click", () => {
      filterWorks(index);
    });

    filterButtons.appendChild(button);
  });

  document
    .querySelector("#portfolio")
    .insertBefore(filterButtons, document.querySelector(".gallery"));

  filterWorks(0); // Filtrage initial avec la catégorie "Tous"
}

// Fonction pour filtrer les oeuvres en fonction de la catégorie
function filterWorks(category) {
  const figures = document.querySelectorAll(".gallery figure");
  active_category=category;
  figures.forEach((figure) => {
    const figureCategory = figure.getAttribute("data-category");
    if (category === 0 || category == figureCategory) {
      figure.style.display = "block";
    } else {
      figure.style.display = "none";
    }
  });
}

// Fonction pour vérifier l'état de connexion
function checkLoginStatus() {
  const token = localStorage.getItem("token");

  if (token) {
    openModalButton.innerHTML =
      '<i class="fa-regular fa-pen-to-square"></i> modifier</button>';

    loginLink.innerHTML = '<a href="#">logout</a>';
    loginLink.addEventListener("click", () => {
      localStorage.removeItem("token");
      location.reload();
    });
  } else {
    loginLink.innerHTML = '<a href="login.html">login</a>';
  }
}

function openModal() {
  modalContent.style.display = "block";
  modal.style.display = "block";
}

function closeModal() {
  modal.style.display = "none";
}

function openNewModal() {
  modalAddPhoto.classList.remove("hidden");
  modalAddPhoto.style.display = "block";
  modalContent.style.display = "none";
}

function closeModalAddPhoto() {
  modalAddPhoto.style.display = "none";
  modalAddPhoto.classList.add("hidden");
  modal.style.display = "none";
}

function returnModalAddPhoto() {
  modalAddPhoto.style.display = "none";
  modalContent.style.display = "block";
}

// Fonction pour créer le bouton retour
function createReturnButton() {
  const returnButton = document.createElement("button");
  returnButton.classList.add("return-button");
  returnButton.innerHTML = '<i class="fa-solid fa-arrow-left-long"></i>'; // Utilisation de Font Awesome pour l'icône de fermeture

  returnButton.addEventListener("click", () => {
    returnModalAddPhoto();
  });

  const modalContent = document.getElementById("modal-add-photo");
  modalContent.insertBefore(returnButton, modalContent.firstChild);

  if (!document.querySelector(".return-button")) {
    // Création du bouton retour
  }
}

// Fonction pour gérer la soumission du formulaire d'ajout de photo
function handleAddPhotoFormSubmit(event) {
  event.preventDefault(); // Empêcher le rechargement de la page

  // Récupérer les valeurs du formulaire
  const photoTitle = document.getElementById("title").value;
  const photoFile = document.getElementById("image").files[0];
  const photoCategory = document.getElementById("category").value;

  // Créer un objet FormData et y ajouter les données du formulaire
  const formData = new FormData();
  formData.append("image", photoFile);
  formData.append("title", photoTitle);
  formData.append("category", photoCategory);
  
  // Effectuer une requête POST vers l'API pour ajouter la photo
  fetch("http://localhost:5678/api/works", {
    method: "POST",
    body: formData,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  })
    .then(function (response) {
      if (response.ok) {
        // Traiter la réponse de l'API (par exemple, afficher un message de succès)
        console.log("Photo ajoutée avec succès:", response);
        return response.json();
      } else {
        console.error("photo rejetée par le server");
      }
    }).then(function (data) {
        // Rafraîchir la galerie d'images pour afficher la nouvelle photo
      displayOneWork(data);

      // Retourner à la modal "modal-content"
      returnModalAddPhoto();
    })
    .catch((error) => {
      console.error(
        "Une erreur s'est produite lors de l'ajout de la photo :",
        error
      );
    });
}

