// 1. Register ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 2. Create the animation
gsap.to(".box", {
    // These are the properties to animate
    x: 300,
    rotation: 360,
    scale: 1.5,
    borderRadius: "50%",
    duration: 2,

    // 3. Add ScrollTrigger
    scrollTrigger: {
        trigger: ".animation-section", // We pin the whole section, not just the box
        start: "top top",              // Start pinning when the section hits the top
        end: "+=2000",                 // Stay pinned for 2000px of scrolling
        scrub: 1,                      // Smoothly links animation to scroll
        pin: true,                     // THIS is what locks the scroll
        markers: true,                 // Highly recommended to see how the pinning works
        anticipatePin: 1      // Adds visual indicators (turn off for production!)
    }
});