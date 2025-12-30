// gsap.registerPlugin(ScrollTrigger);

// let rem = (val) =>
//   val * parseFloat(getComputedStyle(document.documentElement).fontSize);

// window.addEventListener("resize", () => {
//   ScrollTrigger.refresh();
// });

// // Create a timeline
// const tl = gsap.timeline({
//   scrollTrigger: {
//     trigger: ".integrated",
//     // Convert 10rem to pixels
//     start: `top ${rem(10)}px`,
//     // Convert 120rem to pixels
//     end: `+=${rem(120)}`,
//     scrub: 1,
//     pin: true,
//     invalidateOnRefresh: true,
//     // markers: true, // Turn this ON to see if the markers finally appear!
//   },
// });

// // Select all cards
// const cards = gsap.utils.toArray(".prompt_card");

// // Loop through cards to animate them 1 by 1
// cards.forEach((card, index) => {
//   tl.fromTo(
//     card,
//     // STATE 1: Start (Hidden below)
//     {
//       y: -100,
//       opacity: 0,
//     },
//     // STATE 2: Middle (Fully visible/Active)
//     {
//       y: 0,
//       opacity: 1,
//       duration: 2,
//       onStart: () => card.classList.add("active_prompt"),
//       onReverseComplete: () => card.classList.remove("active_prompt"),
//     }
//   ).to(
//     card,
//     // STATE 3: End (Slide up and Fade out)
//     {
//       y: rem((index + 1) * 7),
//       opacity: 1,
//       duration: 1,
//       onStart: () => card.classList.remove("active_prompt"),
//       onReverseComplete: () => card.classList.add("active_prompt"),
//     },
//     "+=5" // This creates a "pause" where the card stays visible
//   );
// });

const header = document.querySelector(".header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    header.classList.add("scrolled");
  } else {
    header.classList.remove("scrolled");
  }
});

const menu_btn = document.querySelector(".mobile_menu_btn");
const mob_menu_links = document.querySelectorAll(".mobile_nav .link");

function ToggleMobNav() {
  header.classList.toggle("header_mob");
  if (header.classList.contains("header_mob")) {
    menu_btn.innerHTML = "close";
  } else {
    menu_btn.innerHTML = "menu";
  }
}

menu_btn.addEventListener("click", ToggleMobNav);

mob_menu_links.forEach((link) => {
  link.addEventListener("click", ToggleMobNav);
});

const faq_item = document.querySelectorAll(".faq_item");

faq_item.forEach((item, index) => {
  item.addEventListener("click", () => {
    faq_item.forEach((i, idx) => {
      if (index === idx) return;
      i.classList.remove("faq_open");
    });

    item.classList.toggle("faq_open");
  });
});
