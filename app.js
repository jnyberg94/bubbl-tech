gsap.registerPlugin(ScrollTrigger);

smoothScroll(".body-wrapper", ".viewport", 1.2)

// =========== mobile breakpoint =========== //

function mobileBreakpoint() {
    const theWindowWidth = window.innerWidth
    if (theWindowWidth > 850) {
        return "desktop"
    }

    if (theWindowWidth <= 850) {
        return "mobile"
    }
}

function refresher() {
    ScrollTrigger.refresh()
    windowWidth()
    mobileBreakpoint()
    showHamburger()
    //heightFunc()
    //gridHeight()
}

var prevWidth = window.innerWidth;
var refresherTimeout;

window.addEventListener("resize", function () {
    if (prevWidth != window.innerWidth) {
        prevWidth = window.innerWidth
        clearTimeout(refresherTimeout)
        refresherTimeout = setTimeout(refresher, 200)
    }
})

// ========= preloader ========== //

const preloader = gsap.timeline({ paused: true })
const html = document.querySelector("html")

gsap.set(".header-spacer", { yPercent: 100 })
gsap.set(".circle-link", { opacity: 0 })

preloader.to(".logo-container-preloader", { opacity: 1, duration: 0.8, delay: 0.5 })
    .to(".preloader", { yPercent: -100, duration: 1, delay: 0.35, ease: Expo.easeOut })
    .to(".video", { yPercent: -6.5, duration: 1 }, "<")
    .to(".header-spacer", { yPercent: 0, duration: 1, ease: Expo.easeOut }, "<")
    .to(".circle-link", { opacity: 1, duration: 0.5 }, "<+=0.2")

preloader.play()

setTimeout(() => {
    html.classList.remove("fixed-position")
}, 2450)

// ========== fullscreen menu ============  //

const menuButton = document.querySelector(".nav-hamburger")
const body = document.querySelector("body")

const hamburgerAnim = gsap.timeline({ paused: true, invalidateOnRefresh: true })

hamburgerAnim.to(".line1", {rotate: 45, 
    y: function() { return mobileBreakpoint() == 'desktop' ? 13 : 11 }, 
    duration: 0.4, 
    ease: "power.inOut"
})
.to(".line2", { rotate: -45, duration: 0.4, ease: "power.inOut" }, "<")

const spanText = (bigLinks, className) => {
    const links = document.querySelectorAll(bigLinks)

    links.forEach(link => {
        const text = link.innerText.split("")
        link.innerText = "";

        text.forEach(letter => {
            const span = document.createElement("span")
            span.className = className
            span.innerText = letter
            link.appendChild(span)
        })
    })
}

spanText(".big-links", "big-letter")

gsap.set(".big-letter", { opacity: 0, yPercent: 150 })
const bigTextAnim = gsap.timeline({ paused: true })

bigTextAnim.to(".fullscreen-menu", { yPercent: 0, duration: 0.8, ease: "power2.inOut" })
    .to(".big-letter", { yPercent: 0, stagger: 0.03, opacity: 1, duration: 0.6, ease: "power3.out" })
    .to(".secondary-links", { opacity: 1, duration: 1, ease: "power2.out" }, "<+=0.6")

gsap.set(".fullscreen-menu", { yPercent: -100 })
gsap.set(".secondary-links", { opacity: 0 })
let x = 0

menuButton.addEventListener("click", () => {
    x++

    if ((x - 1) % 2 == 0) {
        html.classList.add("fixed-position")
        hamburgerAnim.invalidate().play()
        bigTextAnim.play()
    }

    if (x % 2 == 0) {
        html.classList.remove("fixed-position")
        hamburgerAnim.reverse()
        bigTextAnim.reverse()
    }
})


// ============ nav animations ============ //

let videoWidth = window.innerWidth
let videoHeight = window.innerHeight

//mobile optimizing header video animation
function windowWidth() {
    let subtractWidth;

    if (videoWidth > 1100) {
        subtractWidth = 100
    }

    if (640 < videoWidth < 1100) {
        subtractWidth = 60
    }

    if (videoWidth < 640) {
        subtractWidth = 20
    }

    return subtractWidth
}

const videoShrink = gsap.timeline({
    scrollTrigger: {
        trigger: ".header",
        start: "top 0%",
        end: "bottom 20%",
        scrub: true,
        pin: true,
        //markers: true,
    }
})

videoShrink.to(".video-container", {
    scaleX: () => (videoWidth - windowWidth()) / videoWidth,
    scaleY: () => (videoHeight - 100) / videoHeight,
    borderRadius: "60px",
})

let videoProgress;

// just handles on load state
function showHamburger() {
    mobileBreakpoint() == "desktop" ? gsap.set(".nav-hamburger", { yPercent: -250 }) : gsap.set(".nav-hamburger", { yPercent: 0 })
}
showHamburger()

const links = document.getElementsByClassName("link")

const navAnim = gsap.timeline({ paused: true })

navAnim.to(links[0], { yPercent: -200, duration: 0.2, ease: "power2.in" })
    .to(links[1], { yPercent: -200, duration: 0.2, ease: "power2.in" }, "-=0.1")
    .to(links[2], { yPercent: -200, duration: 0.2, ease: "power2.in" }, "-=0.1")
    .to(".nav-hamburger", { yPercent: 0, duration: 0.3, ease: "power2.out" })
    .to(".logo-text-span", { xPercent: -100, duration: 0.3, ease: "power2.in" }, "<")


//main driver function
document.addEventListener("scroll", videoAnim)

function videoAnim() {
    videoProgress = videoShrink.progress()

    if (videoProgress >= 0.8) {
        if (mobileBreakpoint() == "desktop") {
            navAnim.play()
        } else {
            gsap.to(".logo-text-span", { xPercent: -100, duration: 0.4, ease: "power.inOut" })
        }
    }

    if (videoProgress < 0.8) {
        if (mobileBreakpoint() == "desktop") {
            navAnim.reverse()
        } else {
            gsap.to(".logo-text-span", { xPercent: 0, duration: 0.4, ease: "power.inOut" })
        }
    }
    return videoProgress
}

document.addEventListener("resize", () => {
    videoWidth = window.innerWidth

    if (videoWidth >= 850 && videoAnim() < 0.8) {
        gsap.set(".nav-hamburger", { yPercent: -250 })
    } else {
        gsap.set(".nav-hamburger", { yPercent: 0 })
    }
});

// =========== cursor logic =========== //


var cursor = document.querySelector(".cursor-image")
var posX = 0, posY = 0;
var mouseX = 0, mouseY = 0;

gsap.to({}, 0.016, {
    repeat: -1,
    onRepeat: function () {
        posX += (mouseX - posX) / 6
        posY += (mouseY - posY) / 6

        gsap.set(cursor, {
            css: {
                left: posX,
                top: posY,
            }
        })
    }
});

document.addEventListener("mousemove", function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY
})

const mouseDivAnim = gsap.timeline({ paused: true })

mouseDivAnim.to(cursor, { height: 200, width: 200, xPercent: -50, yPercent: -50, duration: 0.3, ease: "power.inOut", })

const video = document.querySelector(".video-container")

video.addEventListener("mouseenter", ()=>{
    mouseDivAnim.play()
})

video.addEventListener("mouseleave", ()=>{
    mouseDivAnim.reverse()
})

const circleRotation = gsap.timeline()
circleRotation.to(".circle-button", { rotation: 360, duration: 10, repeat: -1, ease: "linear" })


// ========= text highligher ======== //

spanText(".highlight", "small-letter")

gsap.from(".small-letter", {
    scrollTrigger:{
        trigger: ".large-text-section",
        start: "top 60%",
        end: "top 0%",
        scrub: 1,
        //markers: true
    }, opacity: 0.35, stagger: 0.1
})

// ========= projects section ======== //

const projectsDown = gsap.timeline({
    scrollTrigger: {
        trigger: ".notable-projects",
        start: "top 70%",
        end: "bottom 70%",
        scrub: 1.3,
        //markers: true,
    }
})

const expandableGrid = document.querySelectorAll(".expandable-grid")
const description = document.querySelectorAll(".description")

description.forEach((element) => {
    gsap.set(element, { scale: 0.9, opacity: 0.5 })
})

projectsDown.to(expandableGrid[0], { gridTemplateRows: "1fr", duration: 1.3, ease: "power.inOut" })
projectsDown.to(description[0], { scale: 1, opacity: 1, duration: 1.3 }, "<")
projectsDown.to(expandableGrid[1], { gridTemplateRows: "1fr", duration: 1.3, ease: "power.inOut" }, "<+=0.9")
projectsDown.to(description[1], { scale: 1, opacity: 1, duration: 1.3 }, "<")
projectsDown.to(expandableGrid[2], { gridTemplateRows: "1fr", duration: 1.3, ease: "power.inOut" }, "<+=0.9")
projectsDown.to(description[2], { scale: 1, opacity: 1, duration: 1.3 }, "<")

const labelContainer = document.querySelectorAll(".label-container")
const textAndIcon = document.querySelectorAll(".text-and-icon")

labelContainer.forEach((element, index) => {
    element.addEventListener("mouseover", () => {
        gsap.to(textAndIcon[index], { y: -7, duration: 0.4 })
    })
    element.addEventListener("mouseout", () => {
        gsap.to(textAndIcon[index], { y: 0, duration: 0.4 })
    })
})


// ========== counter section ========= //

const rollingCounter = gsap.timeline({
    scrollTrigger: {
        trigger: ".counter-section",
        start: "top 80%",
        end: "bottom 80%",
        //markers: true,
        invalidateOnRefresh: true,
    }
})

const numberLines = document.querySelectorAll(".number-line")
const number = document.querySelector(".height-letter")

function scrollAmount() {
    for (let i = 0; i < numberLines.length; i++) {
        const line = numberLines[i];
        rollingCounter.to(line, { y: () => line.offsetHeight - number.offsetHeight, duration: 1.8, ease: "power3.inOut" }, "<+=0.2")
    }
}
scrollAmount()

const numbersContainerWrapper = document.querySelector(".numbers-container-wrapper")

gsap.to(".numbers-container-wrapper", {
    scrollTrigger: {
        trigger: ".counter-section",
        start: "bottom 70%",
        end: "bottom 70%",
        onEnter: ()=> numbersContainerWrapper.classList.add('open'),
        //markers: true,
    }
})


// ======== research hover effect ========= //

const article = document.querySelectorAll(".article")
const readContainer = document.querySelectorAll(".read-container")

const paperHoverDesktop = gsap.matchMedia()
let moveOut;
let moveIn;
let moveIn2;
let moveOut2;


//forEach loop wouldn't work here (remove event listener didn't function)
paperHoverDesktop.add("(min-width: 850px)", () => {

    readContainer.forEach((element) => {
        gsap.set(element, { yPercent: -150 })
    })

    moveIn = function () {
        gsap.to(readContainer[0], { yPercent: 0, duration: 0.6, ease: "power2.inOut" })
    }

    moveOut = function () {
        gsap.to(readContainer[0], { yPercent: -150, duration: 0.6, ease: "power2.inOut" })
    }

    moveIn2 = function () {
        gsap.to(readContainer[1], { yPercent: 0, duration: 0.6, ease: "power2.inOut" })
    }

    moveOut2 = function () {
        gsap.to(readContainer[1], { yPercent: -150, duration: 0.6, ease: "power2.inOut" })
    }

    document.querySelector(".article1").addEventListener("mouseover", moveIn)
    document.querySelector(".article2").addEventListener("mouseover", moveIn2)

    document.querySelector(".article1").addEventListener("mouseout", moveOut)
    document.querySelector(".article2").addEventListener("mouseout", moveOut2)
})

paperHoverDesktop.add("(max-width: 850px)", () => {
    document.querySelector(".article1").removeEventListener("mouseout", moveOut)
    document.querySelector(".article2").removeEventListener("mouseout", moveOut2)
})



// =========== learn more/see more animation ========== //

const arrowUp = document.querySelectorAll(".arrow-up")
const arrowContainer = document.querySelectorAll(".arrow-container")

arrowContainer.forEach((element, index) => {
    element.addEventListener("mouseover", () => {
        gsap.to(arrowUp[index], { x: 3, y: -3, duration: 0.4 })
    })
    element.addEventListener("mouseout", () => {
        gsap.to(arrowUp[index], { x: 0, y: 0, duration: 0.4 })
    })
})



// ========= smooth scrolling =========== //

function smoothScroll(content, viewport, smoothness) {
    content = gsap.utils.toArray(content)[0];
    smoothness = smoothness || 1;
  
    gsap.set(viewport || content.parentNode, {overflow: "hidden", position: "fixed", height: "100%", width: "100%", top: 0, left: 0, right: 0, bottom: 0});
    gsap.set(content, {overflow: "visible", width: "100%"});
  
    let getProp = gsap.getProperty(content),
      setProp = gsap.quickSetter(content, "y", "px"),
      setScroll = ScrollTrigger.getScrollFunc(window),
      removeScroll = () => content.style.overflow = "visible",
      killScrub = trigger => {
        let scrub = trigger.getTween ? trigger.getTween() : gsap.getTweensOf(trigger.animation)[0]; // getTween() was added in 3.6.2
        scrub && scrub.pause();
        trigger.animation.progress(trigger.progress);
      },
      height, isProxyScrolling;
  
    function refreshHeight() {
      height = content.clientHeight;
      content.style.overflow = "visible"
      document.body.style.height = height + "px";
      return height - document.documentElement.clientHeight;
    }
  
    ScrollTrigger.addEventListener("refresh", () => {
      removeScroll();
      requestAnimationFrame(removeScroll);
    })
    ScrollTrigger.defaults({scroller: content});
    //ScrollTrigger.prototype.update = p => p; // works around an issue in ScrollTrigger 3.6.1 and earlier (fixed in 3.6.2, so this line could be deleted if you're using 3.6.2 or later)
  
    ScrollTrigger.scrollerProxy(content, {
      scrollTop(value) {
        if (arguments.length) {
          isProxyScrolling = true; // otherwise, if snapping was applied (or anything that attempted to SET the scroll proxy's scroll position), we'd set the scroll here which would then (on the next tick) update the content tween/ScrollTrigger which would try to smoothly animate to that new value, thus the scrub tween would impede the progress. So we use this flag to respond accordingly in the ScrollTrigger's onUpdate and effectively force the scrub to its end immediately.
          setProp(-value);
          setScroll(value);
          return;
        }
        return -getProp("y");
      },
      scrollHeight: () => document.body.scrollHeight,
      getBoundingClientRect() {
        return {top: 0, left: 0, width: window.innerWidth, height: window.innerHeight};
      }
    });
  
    return ScrollTrigger.create({
      animation: gsap.fromTo(content, {y:0}, {
        y: () => document.documentElement.clientHeight - height,
        ease: "none",
        onUpdate: ScrollTrigger.update
      }),
      scroller: window,
      invalidateOnRefresh: true,
      start: 0,
      end: refreshHeight,
      refreshPriority: -999,
      scrub: smoothness,
      onUpdate: self => {
        if (isProxyScrolling) {
          killScrub(self);
          isProxyScrolling = false;
        }
      },
      onRefresh: killScrub // when the screen resizes, we just want the animation to immediately go to the appropriate spot rather than animating there, so basically kill the scrub.
    });
  }



