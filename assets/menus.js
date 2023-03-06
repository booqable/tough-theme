const triggers = document.querySelectorAll(".list-menu__item:has(.list-submenu)");

const handleMeasure = (e) => {
  const submenu = e.target.querySelector(".list-submenu");

  const { y, height } = submenu.getBoundingClientRect();

  if (y + height > window.innerHeight) {
    submenu.classList.add("list-submenu--bottom");
  }
};

triggers.forEach((trigger) => {
  trigger.addEventListener("mouseenter", handleMeasure);
});
