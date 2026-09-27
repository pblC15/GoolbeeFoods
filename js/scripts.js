(function () {
    "use strict";

    /* ---------- Menu mobile ---------- */
    var toggle = document.querySelector(".menu-toggle");
    var mobileMenu = document.querySelector("#submenu");

    if (toggle && mobileMenu) {
        toggle.addEventListener("click", function () {
            var isOpen = toggle.classList.toggle("is-open");
            mobileMenu.classList.toggle("is-open", isOpen);
            toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
        });

        mobileMenu.querySelectorAll("a").forEach(function (link) {
            link.addEventListener("click", function () {
                toggle.classList.remove("is-open");
                mobileMenu.classList.remove("is-open");
                toggle.setAttribute("aria-expanded", "false");
            });
        });
    }

    /* ---------- Carrossel "Especial do Dia" (vanilla, sem Bootstrap) ---------- */
    var carousel = document.querySelector(".carousel");
    if (carousel) {
        var inner = carousel.querySelector(".carousel-inner");
        var items = Array.prototype.slice.call(carousel.querySelectorAll(".carousel-item"));
        var prevBtn = carousel.querySelector(".carousel-control-prev");
        var nextBtn = carousel.querySelector(".carousel-control-next");
        var dotsWrap = carousel.querySelector(".carousel-dots");
        var current = 0;
        var total = items.length;
        var autoplayId = null;
        var AUTOPLAY_MS = 6000;

        /* Cria os indicadores (bolinhas) dinamicamente */
        var dots = [];
        if (dotsWrap && total > 0) {
            items.forEach(function (item, index) {
                var dot = document.createElement("button");
                dot.type = "button";
                dot.setAttribute("aria-label", "Ir para o slide " + (index + 1));
                dot.addEventListener("click", function () {
                    goTo(index);
                    restartAutoplay();
                });
                dotsWrap.appendChild(dot);
                dots.push(dot);
            });
        }

        function update() {
            if (!inner) return;
            inner.style.transform = "translateX(-" + (current * 100) + "%)";
            dots.forEach(function (dot, index) {
                dot.classList.toggle("is-active", index === current);
            });
        }

        function goTo(index) {
            if (total === 0) return;
            current = (index + total) % total;
            update();
        }

        function next() {
            goTo(current + 1);
        }

        function prev() {
            goTo(current - 1);
        }

        function startAutoplay() {
            if (total < 2) return;
            autoplayId = window.setInterval(next, AUTOPLAY_MS);
        }

        function stopAutoplay() {
            if (autoplayId) {
                window.clearInterval(autoplayId);
                autoplayId = null;
            }
        }

        function restartAutoplay() {
            stopAutoplay();
            startAutoplay();
        }

        if (nextBtn) {
            nextBtn.addEventListener("click", function (e) {
                e.preventDefault();
                next();
                restartAutoplay();
            });
        }
        if (prevBtn) {
            prevBtn.addEventListener("click", function (e) {
                e.preventDefault();
                prev();
                restartAutoplay();
            });
        }

        /* Pausa o autoplay quando o usuário está interagindo/olhando */
        carousel.addEventListener("mouseenter", stopAutoplay);
        carousel.addEventListener("mouseleave", startAutoplay);

        /* Suporte a swipe em telas de toque */
        var touchStartX = null;
        inner && inner.addEventListener("touchstart", function (e) {
            touchStartX = e.touches[0].clientX;
            stopAutoplay();
        }, { passive: true });
        inner && inner.addEventListener("touchend", function (e) {
            if (touchStartX === null) return;
            var deltaX = e.changedTouches[0].clientX - touchStartX;
            if (Math.abs(deltaX) > 40) {
                deltaX < 0 ? next() : prev();
            }
            touchStartX = null;
            startAutoplay();
        }, { passive: true });

        update();
        startAutoplay();
    }

})();
