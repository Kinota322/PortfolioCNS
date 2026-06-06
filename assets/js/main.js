/* ==========================================================================
   DIGITAL PORTFOLIO - CORE INTERACTIVE JS
   Student: Nguyễn Thanh Tuấn (VNU-UET)
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initializations
    initMobileNav();
    initTabs();
    initTableSearch();
    initCarousels();
    initLightbox();
});

/**
 * Mobile Sidebar Navigation Toggle
 */
function initMobileNav() {
    const hamburgerBtn = document.getElementById("hamburger-btn");
    const sidebar = document.getElementById("sidebar");
    
    if (!hamburgerBtn || !sidebar) return;

    hamburgerBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        sidebar.classList.toggle("open");
    });

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
        if (sidebar.classList.contains("open") && !sidebar.contains(e.target) && !hamburgerBtn.contains(e.target)) {
            sidebar.classList.remove("open");
        }
    });
}

/**
 * Interactive Tab Control
 * Supports two patterns:
 * 1. [data-tab-group] wrapper with [data-tab-target] buttons
 * 2. .tab-container wrapper with [data-tab] buttons (simpler pattern)
 */
function initTabs() {
    // Pattern 1: data-tab-group
    const tabGroups = document.querySelectorAll("[data-tab-group]");
    tabGroups.forEach(group => {
        const tabButtons = group.querySelectorAll(".tab-btn");
        const tabContents = group.querySelectorAll(".tab-content");
        tabButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetTabId = btn.getAttribute("data-tab-target");
                tabButtons.forEach(b => b.classList.remove("active"));
                tabContents.forEach(c => c.classList.remove("active"));
                btn.classList.add("active");
                const targetContent = group.querySelector(`#${targetTabId}`);
                if (targetContent) targetContent.classList.add("active");
            });
        });
    });

    // Pattern 2: .tab-container with [data-tab] buttons
    const tabContainers = document.querySelectorAll(".tab-container");
    tabContainers.forEach(container => {
        const tabButtons = container.querySelectorAll(".tab-btn[data-tab]");
        if (tabButtons.length === 0) return; // already handled by pattern 1

        tabButtons.forEach(btn => {
            btn.addEventListener("click", () => {
                const targetTabId = btn.getAttribute("data-tab");

                // Deactivate all buttons in this container
                tabButtons.forEach(b => b.classList.remove("active"));
                // Deactivate all .tab-content in this container
                container.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

                // Activate clicked button and target content
                btn.classList.add("active");
                const targetContent = container.querySelector(`#${targetTabId}`);
                if (targetContent) targetContent.classList.add("active");
            });
        });
    });
}

/**
 * Academic Papers Table Search & Filter (Project 2)
 */
function initTableSearch() {
    const searchInput = document.getElementById("table-search");
    const ratingFilter = document.getElementById("table-filter-rating");
    const tableBody = document.querySelector(".searchable-table tbody");
    
    if (!tableBody || (!searchInput && !ratingFilter)) return;

    const rows = tableBody.querySelectorAll("tr");

    function filterTable() {
        const query = searchInput ? searchInput.value.toLowerCase().trim() : "";
        const rating = ratingFilter ? ratingFilter.value.toLowerCase() : "all";

        rows.forEach(row => {
            const textContent = row.textContent.toLowerCase();
            const ratingBadge = row.querySelector(".badge");
            const rowRating = ratingBadge ? ratingBadge.textContent.toLowerCase() : "";

            const matchesQuery = textContent.includes(query);
            const matchesRating = rating === "all" || rowRating.includes(rating);

            if (matchesQuery && matchesRating) {
                row.style.display = "";
            } else {
                row.style.display = "none";
            }
        });
    }

    if (searchInput) searchInput.addEventListener("input", filterTable);
    if (ratingFilter) ratingFilter.addEventListener("change", filterTable);
}

/**
 * Slideshow / Carousel (Project 1, 4 & 5)
 */
function initCarousels() {
    const carousels = document.querySelectorAll(".carousel-container");
    
    carousels.forEach(carousel => {
        const slides = carousel.querySelectorAll(".carousel-slide");
        const prevBtn = carousel.querySelector(".carousel-prev");
        const nextBtn = carousel.querySelector(".carousel-next");
        
        if (slides.length === 0) return;
        
        let currentIndex = 0;
        
        // Show first slide
        slides[0].style.display = "block";
        
        function showSlide(index) {
            slides[currentIndex].style.display = "none";
            
            // Handle wrap around
            if (index >= slides.length) {
                currentIndex = 0;
            } else if (index < 0) {
                currentIndex = slides.length - 1;
            } else {
                currentIndex = index;
            }
            
            slides[currentIndex].style.display = "block";
        }
        
        if (prevBtn) {
            prevBtn.addEventListener("click", () => showSlide(currentIndex - 1));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener("click", () => showSlide(currentIndex + 1));
        }
    });
}

/**
 * Dynamic Modal Lightbox for images magnification
 */
function initLightbox() {
    // Check if modal container already exists, otherwise create it
    let modal = document.getElementById("image-lightbox");
    if (!modal) {
        modal = document.createElement("div");
        modal.id = "image-lightbox";
        modal.className = "modal";
        modal.innerHTML = `
            <span class="modal-close" id="modal-close-btn">&times;</span>
            <img class="modal-content" id="modal-img" alt="Enlarged screenshot">
            <div class="modal-caption" id="modal-caption"></div>
        `;
        document.body.appendChild(modal);
    }

    const modalImg = document.getElementById("modal-img");
    const modalCaption = document.getElementById("modal-caption");
    const closeBtn = document.getElementById("modal-close-btn");

    // Add click listener to all zoomable images
    document.addEventListener("click", (e) => {
        const target = e.target;
        if (target.classList.contains("zoomable") || target.closest(".zoomable") || (target.tagName === "IMG" && target.closest(".gallery-item"))) {
            const img = target.tagName === "IMG" ? target : target.querySelector("img");
            if (!img) return;

            modal.style.display = "flex";
            modalImg.src = img.src;
            modalCaption.textContent = img.alt || img.getAttribute("data-caption") || "Chi tiết hình ảnh";
        }
    });

    // Close modal
    closeBtn.addEventListener("click", () => {
        modal.style.display = "none";
    });

    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });

    // ESC key closes modal
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && modal.style.display === "flex") {
            modal.style.display = "none";
        }
    });
}
