const themeSwitcher = document.querySelector(".theme-switcher");
const html = document.documentElement;

// Theme
const theme = () => {
  const currentTheme = localStorage.getItem("theme") || "light";
  html.setAttribute("data-theme", currentTheme);
  themeSwitcher.innerHTML =
    currentTheme === "light"
      ? `<i class="ri-sun-line"></i>`
      : `<i class="ri-moon-line"></i>`;
};

theme();

themeSwitcher.addEventListener("click", () => {
  const currentTheme = html.dataset.theme === "light" ? "dark" : "light";
  html.setAttribute("data-theme", currentTheme);
  localStorage.setItem("theme", currentTheme);

  themeSwitcher.innerHTML =
    currentTheme === "light"
      ? `<i class="ri-sun-line"></i>`
      : `<i class="ri-moon-line"></i>`;
});
