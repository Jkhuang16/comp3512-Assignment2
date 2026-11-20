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
    document.querySelector("#linkLogo").addEventListener("click", () => {
        showView("homeView");
    });
    //HOME view
    document.querySelector("#linkHome").addEventListener("click", () => {
        showView("homeView");
    });
    //BROWSE view
    document.querySelector("#linkBrowse").addEventListener("click", () => {
        showView("browseView");
    });
    //SHOPPING CART view
    document.querySelector("#linkCart").addEventListener("click", () => {
        showView("shoppingCartView");
    });

    //About Us Dialog/Popup - Adding popup and close
    const aboutBtn = document.querySelector("#about");

    document.querySelector("#linkAbout").addEventListener("click", () => {
        aboutBtn.showModal();
    });

    document.querySelector("#closeAbout").addEventListener("click", () => {
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
            //  {"id": 1,}
            const clickedId = Number(e.target.dataset.id); 
            const match = products.find(p => p.id === clickedId);
            if (match) {
                //Show single product information
                showSingleProduct(match);
                showView("singleProductView");
            }
        }

        //Verify user has clicked on a button
        if (e.target && e.target.nodeName === "BUTTON") {
            const clickedId = e.target.dataset.id;
            alert("Add to cart product ID: " + clickedId);
        }
    });

    function showSingleProduct(product) {
        //show singleView and remove any children elements to only show a single product at a time, otherwise kept showing multiple items
        const singleView = document.querySelector("#singleProductView");
        //google says replaceChildren() is better way of doing innerHTML = "" to clear old products
        singleView.replaceChildren(); 

        //Main product imagge
        const image = document.createElement("img");
        image.src = product.images[0];
        image.alt = product.title;

        //Product title
        const title = document.createElement("h2");
        title.textContent = product.title;

        //Price
        const price = document.createElement("p");
        price.textContent = "$" + product.price.toFixed(2);
        
        //SKU 
        const sku = document.createElement("p");
        sku.textContent = "SKU: " + product.sku 
        
        //Ratings

        //Tags - need to be displayed as pills or boxes
        // const tagsElement = document.createElement("p");
        // const tag = product.tags;
        // for(let eachTag of tags){
        //     const box = document.createElement
        // }
        // tags.textContent = product.tags;

        //Product desciption
        const productDescription = document.createElement("p");
        productDescription.textContent = product.description;
    


        // Append to singleProductView
        singleView.appendChild(image);
        singleView.appendChild(title);
        singleView.appendChild(price);
        singleView.appendChild(sku);
        // singleView.appendChild(tags);
        singleView.appendChild(productDescription);
    }
    


})