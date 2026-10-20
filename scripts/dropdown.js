var utils = {
  generateID: function (base) {
    return base + Math.floor(Math.random() * 999);
  },
  focusIsInside(element) {
    return element.contains(document.activeElement);
  } };


const icon = `<svg width="1em" height="1em" viewBox="0 0 24 24" aria-hidden="true">
                            <path fill="currentColor" d="M5.293 9.707l6 6c0.391 0.391 1.024 0.391 1.414 0l6-6c0.391-0.391 0.391-1.024 0-1.414s-1.024-0.391-1.414 0l-5.293 5.293-5.293-5.293c-0.391-0.391-1.024-0.391-1.414 0s-0.391 1.024 0 1.414z"></path>
                        </svg>`;
var nav = document.getElementById("site-nav");
nav.classList.add("enhanced");

var top_level_items = document.querySelectorAll("li[data-has-children]");
var dropdowns = document.querySelectorAll("li[data-has-children] > ul");
var navID = utils.generateID("nav-");

top_level_items.forEach(function (item, index) {
  const dropdown = item.querySelector(":scope > ul");
  dropdown.setAttribute("id", navID + "__ul-" + index);
  dropdown.setAttribute("hidden", "");

  let span = item.querySelector(":scope > span");
  let text = span.innerText;

  let item_dw = document.createElement("button");
  item_dw.setAttribute("aria-expanded", "false");
  item_dw.setAttribute("aria-controls", navID + "__ul-" + index);
  item_dw.innerText = text;
  // add icon to button
  item_dw.innerHTML += icon;

  span.replaceWith(item_dw);

  item_dw.addEventListener("click", function (e) {
    toggleDropdown(item_dw, dropdown);
  });

  dropdown.addEventListener(
  "keydown",
  function (e) {
    e.stopImmediatePropagation(); // so that only the list itself closes, not its parent list (in the case of 3+ levels deep nested links)
    if (e.keyCode === 27 && utils.focusIsInside(dropdown)) {
      toggleDropdown(item_dw, dropdown);
      item_dw.focus();
    }
  },
  false);

});

function toggleDropdown(dw, dropdown) {
  if (dw.getAttribute("aria-expanded") === "true") {
    dw.setAttribute("aria-expanded", "false");
    dropdown.setAttribute("hidden", "");
  } else {
    dw.setAttribute("aria-expanded", "true");
    dropdown.removeAttribute("hidden");
  }
}

function collapseDropdownsWhenTabbingOutsideNav(e) {
  let target = e.target;
  if (e.keyCode === 9 && !utils.focusIsInside(nav)) {
    dropdowns.forEach(function (dropdown) {
      dropdown.setAttribute("hidden", "");
      let btn = dropdown.parentNode.querySelector("button");
      btn.setAttribute("aria-expanded", "false");
    });
  }
}

function collapseDropdownsWhenClickingOutsideNav(e) {
  let target = e.target;
  dropdowns.forEach(function (dropdown) {
    if (!dropdown.parentNode.contains(target)) {
      dropdown.setAttribute("hidden", "");
      let btn = dropdown.parentNode.querySelector("button");
      btn.setAttribute("aria-expanded", "false");
    }
  });
}

function toggleNavigationContent(e) {
  if (navButton.getAttribute("aria-expanded") === "true") {
    navButton.setAttribute("aria-expanded", "false");

    // collapse all dropdowns when it is hidden
    dropdowns.forEach(function (dropdown) {
      dropdown.setAttribute("hidden", "");
      let btn = dropdown.parentNode.querySelector("button");
      btn.setAttribute("aria-expanded", "false");
    });
  } else {
    navButton.setAttribute("aria-expanded", "true");
  }
}

// if user tabs out of the navigation, close all open dropdowns
document.addEventListener("keyup", collapseDropdownsWhenTabbingOutsideNav);

// if user clicks anywhere outside the navigation, close all open dropdowns
window.addEventListener("click", collapseDropdownsWhenClickingOutsideNav);
