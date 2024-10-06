const modal = document.getElementById("image-modal");
const modalImg = document.getElementById("modal-image");
const captionText = document.getElementById("image-caption");
const closeBtn = document.querySelector(".close");

const images = document.querySelectorAll(".gallery-image");
const favIcons = document.querySelectorAll(".fav-icon");
const favoritesContainer = document.getElementById('favorites');

let currentIndex = 0;
let scale = 1;  
const zoomSpeed = 0.1;  
function loadFavorites() {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    savedFavorites.forEach(fav => {
        addFavorite(fav.src, fav.alt, fav.id);
    });
}

function saveFavorite(id, src, alt) {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const favorite = { id, src, alt };
    if (!savedFavorites.some(fav => fav.id === id)) {
        savedFavorites.push(favorite);
        localStorage.setItem('favorites', JSON.stringify(savedFavorites));
    }
}

function removeFavorite(id) {
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    const updatedFavorites = savedFavorites.filter(fav => fav.id !== id);
    localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
    renderFavorites();  
}

function addFavorite(src, alt, id) {
    const favoriteItem = document.createElement('div');
    favoriteItem.classList.add('gallery-item');
    favoriteItem.innerHTML = `<img src="${src}" alt="${alt}" class="gallery-image" /><span class="fav-icon active" data-id="${id}">&#9733;</span>`;

    favoritesContainer.appendChild(favoriteItem);

    favoriteItem.querySelector('.fav-icon').addEventListener('click', () => {
        removeFavorite(id);
    });
}

function renderFavorites() {
    favoritesContainer.innerHTML = '';
    const savedFavorites = JSON.parse(localStorage.getItem('favorites')) || [];
    savedFavorites.forEach(fav => {
        addFavorite(fav.src, fav.alt, fav.id);
    });
}

favIcons.forEach(icon => {
    icon.addEventListener('click', function () {
        const imgElement = this.previousElementSibling;
        const id = this.getAttribute('data-id');
        const src = imgElement.src;
        const alt = imgElement.alt;

        if (this.classList.contains('active')) {
            this.classList.remove('active');
            removeFavorite(id);
        } else {
            this.classList.add('active');
            saveFavorite(id, src, alt);
            addFavorite(src, alt, id);  
        }
    });
});

images.forEach((image, index) => {
    image.addEventListener("click", function () {
        modal.style.display = "block";
        modalImg.src = this.src;
        captionText.textContent = this.alt;
        currentIndex = index;
    });
});

function closeModal() {
    modal.style.display = "none";
    scale = 1;  
    modalImg.style.transform = `scale(${scale})`;
    modalImg.classList.remove('zoomed-in');
}
closeBtn.onclick = closeModal;

modal.onclick = function (e) {
    if (e.target === modal) {
        closeModal();
    }
};
modalImg.onclick = function () {
    if (scale === 1) {
        scale += zoomSpeed;
        modalImg.classList.add('zoomed-in');
    } else {
        scale = 1; 
        modalImg.classList.remove('zoomed-in');
    }
    modalImg.style.transform = `scale(${scale})`;
};

document.addEventListener('keydown', function (event) {
    if (event.key === 'ArrowRight') {
        showNextImage();
    } else if (event.key === 'ArrowLeft') {
        showPrevImage();
    } else if (event.key === 'Escape') {
        closeModal();
    } else if (event.key === '+') {
        if (scale < 2) {
            scale += zoomSpeed; 
            modalImg.style.transform = `scale(${scale})`;
        }
    } else if (event.key === '-') {
        if (scale > 1) {
            scale -= zoomSpeed;  
            modalImg.style.transform = `scale(${scale})`;
        }
    }
});
function showNextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    modalImg.src = images[currentIndex].src;
    captionText.textContent = images[currentIndex].alt;
}
function showPrevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    modalImg.src = images[currentIndex].src;
    captionText.textContent = images[currentIndex].alt;
}

window.onload = loadFavorites;
