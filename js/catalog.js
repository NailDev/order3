document.addEventListener("DOMContentLoaded", function () {
  const productsPerPage = 20;
  const productItems = document.querySelectorAll(".catalog_item");
  const totalProducts = productItems.length;
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  let currentPage = 1;

  const paginationContainer = document.querySelector(".b-pagination__list");

  function renderPagination() {
    paginationContainer
      .querySelectorAll(".pagination-page, .dots")
      .forEach((el) => el.parentElement.remove());

    const pages = getVisiblePages(currentPage, totalPages);

    const nextArrow = document.querySelector(".b-pagination__list-item--next");

    pages.forEach((p) => {
      const li = document.createElement("li");
      li.classList.add("b-pagination__list-item");

      if (p === "...") {
        li.innerHTML = `<span class="dots">...</span>`;
      } else {
        li.innerHTML = `<a href="#" class="b-pagination__link pagination-page" data-page="${p}">${p}</a>`;
      }

      if (p === currentPage) {
        li.classList.add("b-pagination__list-item--active");
      }

      paginationContainer.insertBefore(li, nextArrow);
    });

    addPaginationEvents();
    updateArrows();
  }

  function getVisiblePages(current, total) {
    const pages = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, "...", total);
      } else if (current >= total - 3) {
        pages.push(1, "...", total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, "...", current - 1, current, current + 1, "...", total);
      }
    }

    return pages;
  }

  function showPage(page) {
    productItems.forEach((item) => (item.style.display = "none"));
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;

    for (let i = startIndex; i < endIndex && i < totalProducts; i++) {
      productItems[i].style.display = "block";
    }

    currentPage = page;
    renderPagination();
  }

  function updateArrows() {
    const prevButton = document.getElementById("prev-page");
    const nextButton = document.getElementById("next-page");

    prevButton.parentElement.classList.toggle(
      "b-pagination__list-item--disabled",
      currentPage === 1
    );
    nextButton.parentElement.classList.toggle(
      "b-pagination__list-item--disabled",
      currentPage === totalPages
    );
  }

  function addPaginationEvents() {
    document.querySelectorAll(".pagination-page").forEach((link) => {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        const page = parseInt(this.getAttribute("data-page"));
        if (page !== currentPage) showPage(page);
      });
    });
  }

  document.getElementById("prev-page").addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage > 1) showPage(currentPage - 1);
  });

  document.getElementById("next-page").addEventListener("click", function (e) {
    e.preventDefault();
    if (currentPage < totalPages) showPage(currentPage + 1);
  });

  showPage(1);
});
