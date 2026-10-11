
"use strict";

// ========================================
// 1. API CONFIGURATION
// ========================================

const API_URL = "https://api.tvmaze.com";

const movieGrid = document.getElementById("movieGrid");
const statusText = document.getElementById("status");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const sectionTitle = document.getElementById("sectionTitle");
const genreFilters = document.getElementById("genreFilters");
const loadMoreBtn = document.getElementById("loadMoreBtn");
const trendingBtn = document.getElementById("trendingBtn");
const modal = document.getElementById("movieModal");
const modalContent = document.getElementById("modalContent");

let allShows = [];
let visibleShows = [];
let pageSize = 20;
let currentMode = "popular";

// ========================================
// 2. FETCH DATA FROM TVMAZE
// ========================================

async function fetchShows(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

// ========================================
// 3. LOAD SHOWS
// ========================================

async function loadShows() {
  showStatus("Loading TV shows...");
  movieGrid.replaceChildren();
  loadMoreBtn.hidden = true;

  try {
    const data = await fetchShows("/shows?page=0");

    allShows = data.filter(show => show.image?.medium);
    visibleShows = [...allShows];

    renderGenres();
    renderShows();
  } catch (error) {
    showStatus(
      "Unable to load shows. Check your internet connection.",
      true
    );
    console.error("TVmaze API error:", error);
  }
}

// ========================================
// 4. HELPER FUNCTIONS
// ========================================

function createElement(tag, className, text) {
  const element = document.createElement(tag);

  if (className) element.className = className;
  if (text !== undefined) element.textContent = text;

  return element;
}

function showStatus(message, isError = false) {
  statusText.textContent = message;
  statusText.className = isError ? "status error" : "status";
}

// ========================================
// 5. GENRE FILTERS
// ========================================

function renderGenres() {
  genreFilters.replaceChildren();

  const genres = [
    "All Shows",
    ...new Set(allShows.flatMap(show => show.genres || []))
  ];

  genres.forEach(genre => {
    const button = createElement("button", "genre-btn", genre);

    button.type = "button";

    if (
      (genre === "All Shows" && currentMode === "popular") ||
      (genre === currentMode && currentMode !== "popular")
    ) {
      button.classList.add("active");
    }

    button.addEventListener("click", () => {
      searchInput.value = "";

      if (genre === "All Shows") {
        currentMode = "popular";
        visibleShows = [...allShows];
        sectionTitle.textContent = "Popular TV Shows";
      } else {
        currentMode = genre;
        visibleShows = allShows.filter(show =>
          (show.genres || []).includes(genre)
        );
        sectionTitle.textContent = `${genre} TV Shows`;
      }

      pageSize = 20;
      renderGenres();
      renderShows();
    });

    genreFilters.appendChild(button);
  });
}

// ========================================
// 6. DISPLAY SHOW CARDS
// ========================================

function renderShows() {
  movieGrid.replaceChildren();

  const shows = visibleShows.slice(0, pageSize);

  if (shows.length === 0) {
    showStatus("No shows found. Try another search.");
    loadMoreBtn.hidden = true;
    return;
  }

  shows.forEach(show => {
    const card = createElement("article", "movie-card");
    card.tabIndex = 0;

    const posterWrap = createElement("div", "poster-wrap");

    const poster = createElement("img", "poster");
    poster.src = show.image?.medium || "";
    poster.alt = `${show.name} poster`;
    poster.loading = "lazy";

    posterWrap.appendChild(poster);

    const ratingValue = show.rating?.average;

    posterWrap.appendChild(
      createElement(
        "div",
        "rating",
        `★ ${ratingValue ?? "N/A"}`
      )
    );

    const overlay = createElement("div", "poster-overlay");
    overlay.appendChild(
      createElement("span", "view-details", "View details ↗")
    );

    posterWrap.appendChild(overlay);

    const title = createElement(
      "h3",
      "movie-title",
      show.name
    );

    const meta = createElement("div", "movie-meta");

    const year = show.premiered
      ? show.premiered.slice(0, 4)
      : "Unknown year";

    meta.append(
      createElement(
        "span",
        "",
        show.genres?.[0] || "TV Show"
      ),
      createElement("span", "", year)
    );

    card.append(posterWrap, title, meta);

    card.addEventListener("click", () => showDetails(show));

    card.addEventListener("keydown", event => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        showDetails(show);
      }
    });

    movieGrid.appendChild(card);
  });

  showStatus(
    `Showing ${shows.length} of ${visibleShows.length} shows.`
  );

  loadMoreBtn.hidden = visibleShows.length <= pageSize;
}

// ========================================
// 7. SEARCH SHOWS
// ========================================

searchForm.addEventListener("submit", async event => {
  event.preventDefault();

  const query = searchInput.value.trim();

  if (!query) {
    searchInput.focus();
    return;
  }

  showStatus("Searching TV shows...");
  movieGrid.replaceChildren();
  loadMoreBtn.hidden = true;

  try {
    const results = await fetchShows(
      `/search/shows?q=${encodeURIComponent(query)}`
    );

    visibleShows = results
      .map(result => result.show)
      .filter(show => show.image?.medium);

    pageSize = 20;
    currentMode = "search";

    sectionTitle.textContent = `Results for "${query}"`;

    renderGenres();
    renderShows();
  } catch (error) {
    showStatus("Search failed. Please try again.", true);
    console.error(error);
  }
});

// ========================================
// 8. LOAD MORE SHOWS
// ========================================

loadMoreBtn.addEventListener("click", () => {
  pageSize += 20;
  renderShows();
});

// ========================================
// 9. SHOW DETAILS POPUP
// ========================================

function showDetails(show) {
  modalContent.replaceChildren();

  const wrapper = createElement("div", "modal-content");

  const poster = createElement("img", "modal-poster");
  poster.src = show.image?.original || show.image?.medium || "";
  poster.alt = `${show.name} poster`;

  wrapper.appendChild(poster);

  const info = createElement("div", "modal-info");

  info.appendChild(
    createElement("p", "eyebrow", "SHOW DETAILS")
  );

  info.appendChild(
    createElement("h2", "", show.name)
  );

  info.appendChild(
    createElement(
      "p",
      "modal-facts",
      `★ ${show.rating?.average ?? "N/A"} / 10`
    )
  );

  info.appendChild(
    createElement(
      "p",
      "modal-facts",
      `Genres: ${show.genres?.join(", ") || "Unknown"}`
    )
  );

  info.appendChild(
    createElement(
      "p",
      "",
      show.summary
        ? show.summary.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim()
        : "No description available."
    )
  );

  info.appendChild(
    createElement(
      "p",
      "modal-facts",
      `Premiered: ${show.premiered || "Unknown"}`
    )
  );

  info.appendChild(
    createElement(
      "p",
      "modal-facts",
      `Language: ${show.language || "Unknown"}`
    )
  );

  if (show.officialSite) {
    const link = createElement("a", "view-details", "Official website ↗");
    link.href = show.officialSite;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    info.appendChild(link);
  }

  wrapper.appendChild(info);
  modalContent.appendChild(wrapper);

  modal.hidden = false;
  document.body.classList.add("modal-open");
}

// ========================================
// 10. CLOSE POPUP
// ========================================

function closeModal() {
  modal.hidden = true;
  document.body.classList.remove("modal-open");
}

document.getElementById("closeModal")
  .addEventListener("click", closeModal);

document.getElementById("modalBackdrop")
  .addEventListener("click", closeModal);

document.addEventListener("keydown", event => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
  }
});

// ========================================
// 11. INITIALIZE
// ========================================

trendingBtn.addEventListener("click", () => {
  searchInput.value = "";
  currentMode = "popular";
  visibleShows = [...allShows];
  pageSize = 20;
  sectionTitle.textContent = "Popular TV Shows";

  renderGenres();
  renderShows();
});

loadShows();
