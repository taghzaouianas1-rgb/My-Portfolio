// Cursor Glow
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

// Scroll Reveal Animation
const reveals = document.querySelectorAll(".section");

const revealOnScroll = () => {
  const trigger = window.innerHeight * 0.85;

  reveals.forEach((section) => {
    const top = section.getBoundingClientRect().top;

    if (top < trigger) {
      section.classList.add("active");
    }
  });
};

reveals.forEach((section) => {
  section.classList.add("reveal");
});

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// Navbar Background
const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", () => {
  if (window.scrollY > 80) {
    navbar.style.background = "rgba(18,18,22,.92)";
    navbar.style.padding = "14px 30px";
    navbar.style.boxShadow = "0 15px 40px rgba(0,0,0,.35)";
  } else {
    navbar.style.background = "rgba(18,18,22,.70)";
    navbar.style.padding = "18px 35px";
    navbar.style.boxShadow = "none";
  }
});

// Magnetic Buttons
const buttons = document.querySelectorAll(".btn");

buttons.forEach((btn) => {

  btn.addEventListener("mousemove", (e) => {

    const rect = btn.getBoundingClientRect();

    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;

  });

  btn.addEventListener("mouseleave", () => {
    btn.style.transform = "translate(0,0)";
  });

});

// Card Hover Glow
const cards = document.querySelectorAll(".card");

cards.forEach(card => {

  card.addEventListener("mousemove", e => {

    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.background = `
    radial-gradient(circle at ${x}px ${y}px,
    rgba(123,97,255,.15),
    #121216 55%)
    `;

  });

  card.addEventListener("mouseleave", () => {

    card.style.background = "#121216";

  });

});

// Smooth Fade Hero
window.addEventListener("load", () => {

  const hero = document.querySelector(".hero");

  hero.animate([
    {
      opacity: 0,
      transform: "translateY(40px)"
    },
    {
      opacity: 1,
      transform: "translateY(0)"
    }
  ], {
    duration: 1000,
    easing: "ease-out",
    fill: "forwards"
  });

});