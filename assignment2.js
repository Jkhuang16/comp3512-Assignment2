import config from './data-minifed.json' with { type: 'json' };

document.addEventListener("DOMContentLoaded", () => {


    //Swapping different views
    function showView(selectedView) {
        // Hide all the views except homeview (homeview is starting page)
        const views = document.querySelectorAll(".view");
        for (let eachView of views) {
            eachView.classList.add("hidden");
        }

        // Reveal the view that is clicked
        const revealView = document.querySelector("#" + selectedView);
        revealView.classList.remove("hidden");
    }

    //Adding Event Listeners to header navigation bar for LOGO, HOME, BROWSE, CART
    document.querySelector("#linklogo").addEventListener("click", () => {
        showView("homeview");
    });
    //HOME view
    document.querySelector("#linkhome").addEventListener("click", () => {
        showView("homeview");
    });
    //BROWSE view
    document.querySelector("#linkbrowse").addEventListener("click", () => {
        showView("browseview");
    });
    //SHOPPING CART view
    document.querySelector("#linkcart").addEventListener("click", () => {
        showView("shoppingcartview");
    });

    //About Us Dialog/Popup - Adding popup and close
    const aboutBtn = document.querySelector("#about");

    document.querySelector("#linkabout").addEventListener("click", () => {
        aboutBtn.showModal();
    });

    document.querySelector("#closeabout").addEventListener("click", () => {
        aboutBtn.close();
    });


    //Target HTML element of id=products
    const productSquare = document.querySelector("#products");
    //Gets products from config
    const products = config.products

    console.log(products);

    //looping through products from config
    for(let eachProduct of products){
        //Main cards
        const card = document.createElement("div");
        card.classList.add("product-card");

        //Title
        const title = document.createElement("p");
        title.textContent = eachProduct.title;

        //Price to 2 decimal points
        const price = document.createElement("p");
        price.textContent = "$" + eachProduct.price.toFixed(2);

        //Thumbnail image
        const img = document.createElement("img");
        img.src = eachProduct.thumbnail
        img.dataset.id = eachProduct.id;

        //Add to Cart button
        const btn = document.createElement("button");
        btn.textContent = "+";
        btn.dataset.id = eachProduct.id;

        //Adding details to each card
        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(price);
        card.appendChild(btn);

        //Adding each card into productSquare
        productSquare.appendChild(card);
    }

    //Using delegation to handle click events for productSquare
    productSquare.addEventListener("click", (e) => {
        //Verify user has clicked on image 
        if (e.target && e.target.nodeName === "IMG") {
            const clickedId = e.target.dataset.id;
            alert("Clicked product ID: " + clickedId);
        }

        //Verify user has clicked on a button
        if (e.target && e.target.nodeName === "BUTTON") {
            const clickedId = e.target.dataset.id;
            alert("Add to cart product ID: " + clickedId);
        }
    });
})