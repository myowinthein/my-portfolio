export function handleSwitchValue(value) {
  const body = document.body;
  if (value) {
    localStorage.setItem("theme-color", "dark");
    body.classList.add("dark");
    body.classList.remove("light");
  } else {
    localStorage.setItem("theme-color", "light");
    body.classList.add("light");
    body.classList.remove("dark");
  }
}

