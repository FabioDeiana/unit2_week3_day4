const API_KEY = "I4Rf3ZW27ACB7DOlwbOWnK3xNBVFRAD60hiVtMSdFEkxp1hCd9yH1tRg"
const API_URL = "https://api.pexels.com/v1/search"

// Load images function
async function loadImages(query) {
  try {
    const response = await fetch(`${API_URL}?query=${query}&per_page=9`, {
      headers: {
        Authorization: API_KEY,
      },
    })

    const data = await response.json()
    displayImages(data.photos)
  } catch (error) {
    console.error("Error loading images:", error)
    alert("Failed to load images. Please try again.")
  }
}

// Display images in the grid
function displayImages(photos) {
  const grid = document.getElementById("imageGrid")
  grid.innerHTML = ""

  photos.forEach((photo) => {
    const card = createCard(photo)
    grid.appendChild(card)
  })
}

// Create a card element
function createCard(photo) {
  const col = document.createElement("div")
  col.className = "col-md-4"

  col.innerHTML = `
    <div class="card mb-4 shadow-sm">
      <img
        src="${photo.src.medium}"
        class="bd-placeholder-img card-img-top clickable"
        alt="${photo.alt}"
        data-id="${photo.id}"
        data-photographer="${photo.photographer}"
        data-url="${photo.photographer_url}"
        data-img="${photo.src.large}"
      />
      <div class="card-body">
        <h5 class="card-title clickable" data-id="${
          photo.id
        }" data-photographer="${photo.photographer}" data-url="${
    photo.photographer_url
  }" data-img="${photo.src.large}">
          ${photo.photographer}
        </h5>
        <p class="card-text">
          ${photo.alt || "Beautiful image from Pexels"}
        </p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <button type="button" class="btn btn-sm btn-outline-secondary view-btn">
              View
            </button>
            <button type="button" class="btn btn-sm btn-outline-secondary hide-btn">
              Hide
            </button>
          </div>
          <small class="text-muted">${photo.id}</small>
        </div>
      </div>
    </div>
  `

  // Add event listeners
  const hideBtn = col.querySelector(".hide-btn")
  hideBtn.addEventListener("click", () => {
    col.remove()
  })

  const viewBtn = col.querySelector(".view-btn")
  viewBtn.addEventListener("click", () => {
    openModal(photo.src.large, photo.photographer)
  })

  // Add click listeners to image and title
  const img = col.querySelector(".card-img-top")
  const title = col.querySelector(".card-title")

  ;[img, title].forEach((element) => {
    element.style.cursor = "pointer"
    element.addEventListener("click", () => {
      navigateToDetail(
        photo.id,
        photo.photographer,
        photo.photographer_url,
        photo.src.large,
        photo.alt
      )
    })
  })

  return col
}

// Navigate to detail page
function navigateToDetail(id, photographer, url, imgSrc, alt) {
  const params = new URLSearchParams({
    id: id,
    photographer: photographer,
    url: url,
    img: imgSrc,
    alt: alt || photographer,
  })

  window.location.href = `detail.html?${params.toString()}`
}

// Open modal with image
function openModal(imgSrc, photographer) {
  const modal = new bootstrap.Modal(document.getElementById("imageModal"))
  document.getElementById("modalImage").src = imgSrc
  document.getElementById("modalPhotographer").textContent = photographer
  modal.show()
}

// Event listeners
document.getElementById("loadImages").addEventListener("click", () => {
  loadImages("hamsters")
})

document.getElementById("loadSecondary").addEventListener("click", () => {
  loadImages("tigers")
})

document.getElementById("searchBtn").addEventListener("click", () => {
  const query = document.getElementById("searchInput").value.trim()
  if (query) {
    loadImages(query)
  } else {
    alert("Please enter a search term")
  }
})

document.getElementById("searchInput").addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    document.getElementById("searchBtn").click()
  }
})

// Load default images on page load
window.addEventListener("DOMContentLoaded", () => {
  loadImages("nature")
})
