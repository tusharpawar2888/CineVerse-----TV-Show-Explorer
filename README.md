# CineVerse --- TV Show Explorer

CineVerse is a responsive TV-show discovery website built with **HTML,
CSS, and vanilla JavaScript**. It fetches show information from the free
[TVmaze API](https://www.tvmaze.com/api) and displays posters, ratings,
genres, premiere years, and additional details.

## Features

-   **TV show catalogue:** Fetches shows from TVmaze and displays those
    with available posters.
-   **Search:** Search for shows by title using the TVmaze search
    endpoint.
-   **Genre filters:** Filter the loaded catalogue by genre.
-   **Show cards:** View show posters, ratings, genres, and premiere
    years.
-   **Details popup:** View a show's summary, rating, genres, premiere
    date, language, and official website when available.
-   **Load more:** Reveal additional shows from the catalogue already
    loaded in the browser.
-   **Responsive styling:** Uses the existing CSS layout to adapt the
    interface to different screen sizes.
-   **Error handling:** Displays messages when API requests fail.

## Technologies

-   HTML5
-   CSS3
-   JavaScript (ES6+)
-   Fetch API
-   TVmaze REST API

No API key, package manager, or backend server is required.

## Project structure

Keep the following files in the same directory:

``` text
CineVerse/
├── index.html
├── style.css
├── script.js
└── README.md
```

The HTML must contain the element IDs used by `script.js`, including
`movieGrid`, `status`, `searchForm`, `searchInput`, `sectionTitle`,
`genreFilters`, `loadMoreBtn`, `trendingBtn`, `movieModal`, and
`modalContent`. It must also include the modal close button with ID
`closeModal` and the backdrop with ID `modalBackdrop`.

## Run locally

1.  Download or clone the project into a folder.
2.  Confirm that `index.html`, `style.css`, and `script.js` are in the
    same folder.
3.  Open the folder in Visual Studio Code.
4.  Install the **Live Server** extension if it is not already
    installed.
5.  Right-click `index.html` and select **Open with Live Server**.
6.  Ensure you have an internet connection.

You can also use another local web server. Running through a local
server is recommended instead of opening the HTML file directly.

## API endpoints used

The project uses the public TVmaze API:

### Load the catalogue

``` text
https://api.tvmaze.com/shows?page=0
```

The application loads the first page of shows and filters out entries
that do not have a medium-size poster image.

### Search shows

``` text
https://api.tvmaze.com/search/shows?q=breaking%20bad
```

The search term is URL-encoded by JavaScript before it is sent to the
API.

TVmaze API documentation: <https://www.tvmaze.com/api>

## How the JavaScript works

1.  **Fetch data:** `fetchShows()` sends a request to TVmaze and checks
    whether the response was successful.
2.  **Load the catalogue:** `loadShows()` retrieves the first catalogue
    page and stores the results in `allShows`.
3.  **Filter genres:** `renderGenres()` creates genre buttons based on
    the loaded data.
4.  **Render cards:** `renderShows()` creates DOM elements for each show
    and adds poster, rating, title, genre, and year information.
5.  **Search:** The search form calls the TVmaze search endpoint and
    displays matching results.
6.  **Show details:** Selecting a card opens a popup with more
    information about that show.
7.  **Close the popup:** The close button, backdrop, and Escape key
    dismiss the popup.

## Troubleshooting

-   **Shows do not load:** Check your internet connection and open the
    browser developer tools (`F12` → **Console**).
-   **Search fails:** Confirm that the TVmaze API is reachable and try
    again.
-   **Posters are missing:** Some shows do not have image data; the
    application filters out shows without a medium image when loading
    the initial catalogue.
-   **CORS or network error:** Try running the page with Live Server and
    check whether a browser extension, firewall, or network policy is
    blocking requests.
-   **No response from the API:** Retry later; the service or network
    may be temporarily unavailable.

## Notes and limitations

-   This project displays **TV shows**, not a complete catalogue of
    movies.
-   The initial catalogue is loaded from `shows?page=0`. The **Load
    more** button reveals more results from that already-loaded list; it
    does not request another API page.
-   Genre filters operate on the catalogue loaded in the browser.
-   Search results are fetched separately from TVmaze.
-   Ratings and show details depend on the data supplied by TVmaze and
    may be missing for some entries.
-   The project is frontend-only and does not store user accounts or
    data.

## Credits

Show data and images are provided by [TVmaze](https://www.tvmaze.com/)
through its public API. Please review the [TVmaze API documentation and
terms](https://www.tvmaze.com/api) before using the service in a public
or commercial deployment.
