
const iconMenuElement = document.querySelector('.header-menu-icons');
const headerMenu = document.querySelector('.header-menu')
let isMenuOpen = false;
let mobileMenuDOM;



const createMobileMenu = () => {
  mobileMenuDOM = document.createElement('div')
  mobileMenuDOM.classList.add('mobile-menu')
  mobileMenuDOM.append(headerMenu.querySelector('ul').cloneNode(true)) //it s a copy, we don't change the initial list
  headerMenu.append(mobileMenuDOM)
  mobileMenuDOM.addEventListener("click", evt => evt.stopPropagation()) // do not close the mobile window if click on it
}

function closeMenu(e) {
  mobileMenuDOM.classList.remove("show")
}


const openMenu = () => {
    if (mobileMenuDOM) {
      // if already exists I only add class show
    } else {
      createMobileMenu();
    }
    mobileMenuDOM.classList.add("show");
}


const toggleMenu = (e) => {
  e.stopPropagation() // avoid activate event on the window that closes the menu.
  if (isMenuOpen) {
    closeMenu()
  } else {
    openMenu(e)
  }
  isMenuOpen = !isMenuOpen
  console.log(isMenuOpen)
}

iconMenuElement.addEventListener('click', toggleMenu)


window.addEventListener('click', (e) => {
  if (isMenuOpen) {
    toggleMenu(e);
  }
} )
