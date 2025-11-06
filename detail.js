// Get URL parameters
const urlParams = new URLSearchParams(window.location.search)

// Extract data from URL
const imageId = urlParams.get("id")
const photographer = urlParams.get("photographer")
const photographerUrl = urlParams.get("url")
const imageSrc = urlParams.get("img")
const imageAlt = urlParams.get("alt")

// Function to calculate average color from image
function getAverageColor(imgSrc) {
  return new Promise((resolve) => {
    const img = new Image()
    img.crossOrigin = "Anonymous"
    img.src = imgSrc

    img.onload = function () {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
        const data = imageData.data
        let r = 0,
          g = 0,
          b = 0,
          count = 0

        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
          count++
        }

        r = Math.floor(r / count)
        g = Math.floor(g / count)
        b = Math.floor(b / count)

        resolve(`rgb(${r}, ${g}, ${b})`)
      } catch (e) {
        console.error("Error calculating color:", e)
        resolve("rgb(240, 240, 240)") // Fallback color
      }
    }

    img.onerror = function () {
      resolve("rgb(240, 240, 240)") // Fallback color
    }
  })
}

// Display image details
window.addEventListener("DOMContentLoaded", async () => {
  if (imageId && photographer && photographerUrl && imageSrc) {
    document.getElementById("detailImage").src = imageSrc
    document.getElementById("detailImage").alt = imageAlt || photographer
    document.getElementById("detailTitle").textContent =
      imageAlt || photographer
    document.getElementById("detailPhotographer").textContent = photographer
    document.getElementById("detailId").textContent = imageId
    document.getElementById("photographerLink").href = photographerUrl

    // Set background color based on image average color
    const avgColor = await getAverageColor(imageSrc)
    document.getElementById("detailBody").style.backgroundColor = avgColor

    // Adjust text color based on background brightness
    const rgb = avgColor.match(/\d+/g)
    const brightness =
      (parseInt(rgb[0]) * 299 +
        parseInt(rgb[1]) * 587 +
        parseInt(rgb[2]) * 114) /
      1000
    if (brightness < 128) {
      document.getElementById("detailBody").style.color = "white"
      document.querySelector("footer").style.color = "rgba(255, 255, 255, 0.7)"
    }
  } else {
    document.getElementById("imageDetail").innerHTML = `
      <div class="alert alert-warning" role="alert">
        No image data found. Please go back to the gallery.
      </div>
    `
  }
})
