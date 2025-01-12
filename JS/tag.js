<script>
        // Filtering Logic
        document.addEventListener("DOMContentLoaded", () => {
            const categoryButtons = document.querySelectorAll(".sortbar a");
            const gameTiles = document.querySelectorAll(".game-link");

            categoryButtons.forEach((button) => {
                button.addEventListener("click", (event) => {
                    event.preventDefault();

                    // Get the selected filter
                    const filter = button.textContent.trim().toUpperCase();

                    gameTiles.forEach((tile) => {
                        const category = tile.getAttribute("data-category").toUpperCase();

                        if (filter === "ALL") {
                            tile.style.display = "block"; // Show all tiles
                        } else {
                            tile.style.display = category === filter ? "block" : "none"; // Filter tiles
                        }
                    });

                    // Highlight the active button
                    categoryButtons.forEach((btn) => btn.classList.remove("active"));
                    button.classList.add("active");
                });
            });
        });
    </script>