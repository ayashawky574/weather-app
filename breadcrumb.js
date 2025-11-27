const navbarList = document.querySelector(".navbar-nav");
const navItem = document.querySelectorAll(".nav-item .nav-link");
const breadcrumbItem = document.getElementById("nextItem")
navbarList.addEventListener( "click" ,function (e) {
    if(e.target.classList.contains("nav-link")){
        breadcrumbItem.innerText =e.target.innerText  
    }
})