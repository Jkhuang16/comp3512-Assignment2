import config from './data-minifed.json' with { type: 'json' };

document.addEventListener("DOMContentLoaded", () => {

    const shoppingCart = [];
    let itemsInCart = 0;
    let cartDollarValue = 0;

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
    const products = config.products;

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

    //Displaying Single Product View using mostly JS and minimal HTML
    function showSingleProduct(product) {
        //show singleView and remove any children elements to only show a single product at a time, otherwise kept showing multiple items
        const singleView = document.querySelector("#singleProductView");
        //google says replaceChildren() is better way of doing innerHTML = "" to clear old products
        singleView.replaceChildren();

        //Main product imagge(first one in array)
        const image = document.createElement("img");
        image.src = product.images[0];
        image.alt = product.title;

        // Append image to singleProductView
        singleView.appendChild(image);
        // Append product details to singleProductView
        singleView.appendChild(createSingleProductDetails(product));
        //Append Add to Cart button and box
        singleView.appendChild(createCart(product));
        //Append specifications box
        singleView.appendChild(createSpecifications(product));
        //append reviews box
        singleView.appendChild(createReviews(product));
    }

    //Function to create all details required for a single product and returning them as singleProductsDetails to be appended to singleProductView
    function createSingleProductDetails(product) {
        const singleProductsDetails = document.createElement("div");

        //Product title
        const title = document.createElement("h3");
        title.textContent = product.title;
        //Price
        const price = document.createElement("p");
        price.textContent = "$" + product.price.toFixed(2);

        //SKU 
        const sku = document.createElement("p");
        sku.style.fontSize = "70%";
        sku.textContent = "SKU: " + product.sku 
        
        //Calling createRating function to create stars 
        const rating = document.createElement("p");
        rating.textContent = "Rating: " + createRating(product.rating) + " " + product.rating;

        //Tags - need to be displayed as pills or boxes
        const tagsElement = document.createElement("div");
        tagsElement.classList.add("tags")
        for (let eachTag of product.tags) {
            const box = document.createElement("div");
            box.classList.add("tag");
            box.textContent = eachTag
            tagsElement.appendChild(box);
        }

        //Stock of product
        const stock = document.createElement("div");
        if(product.stock > 0){
            stock.textContent = "In Stock: " + product.stock;
        } else {
            stock.textContent = "Out of Stock - Sorry";
        }

        //Product desciption
        const productDescription = document.createElement("p");
        productDescription.id = "singleProductDescription";
        productDescription.textContent = product.description;

        //Creating array of all elements to be added to singleProductsDetails and adding them
        const singleProductViewElements = [title, price, sku, rating, tagsElement, stock, productDescription];
        for(let eachElement of singleProductViewElements){
            singleProductsDetails.appendChild(eachElement);
        }

        return singleProductsDetails;
    }
    

    //One cart item function
    function CartItem(id, name, price, quantity){
      this.id = id;
      this.name = name;
      this.price = price;
      this.quantity = quantity;
   }

    //Function to add product to cart
    function createCart(product){
        //main cart container
        const cart = document.createElement("div");

        const quantityLabel = document.createElement("label");
        quantityLabel.textContent = "Quantity ";
        //quantity input type is number and defaulted to 1
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.min = 1;
        quantityInput.value = 1;
        //creating add to cart button
        const addToCartBtn = document.createElement("button");
        addToCartBtn.textContent = "+ Add to Cart";

        //add to cart button event listener and adding quantity, price, total items 
        addToCartBtn.addEventListener("click", () =>{
            let addedQuantity = Number(quantityInput.value);
            //check if item is in shopping cart to prevent duplicate items in cart
            let foundItem = null;
            for(let eachItem of shoppingCart){
                if(eachItem.id == product.id){
                    foundItem = eachItem;
                    break;
                }
            }
            //if item in cart, increase quantity respectively, otherwise create item and add
            if(foundItem){
                foundItem.quantity += addedQuantity;
            } else{
                const newItem = new CartItem(product.id, product.title, product.price, addedQuantity);
                shoppingCart.push(newItem);
            }

            //increse items and dollar value - a running global variable
            itemsInCart += addedQuantity;
            cartDollarValue += product.price * addedQuantity;

        })
        cart.appendChild(quantityLabel);
        cart.appendChild(quantityInput);
        cart.appendChild(addToCartBtn);
        
        return cart;
    } //End of createCart

    //function to create specifications box
    //weight(lbs), dimensions(cm), warranty, shipping, return policy
    function createSpecifications(product){
        const specBox = document.createElement("div");

        const weight = document.createElement("p");
        weight.textContent = "Weight: " + product.weight + "lbs";

        const dimensions = document.createElement("p");
        dimensions.textContent = `Width: ${product.dimensions.width} Height: ${product.dimensions.height} Depth: ${product.dimensions.depth}`;
        
        const warranty = document.createElement("p");
        warranty.textContent = "Warranty: " + product.warrantyInformation;

        const shippingInfo = document.createElement("p");
        shippingInfo.textContent = "Shipping: " + product.shippingInformation;

        const returnPolicy = document.createElement("p");
        returnPolicy.textContent = "Return Policy: " + product.returnPolicy;

        //adding all specification elements and appending to main specBox
        const specElements = [weight, dimensions, warranty, shippingInfo, returnPolicy];
        for(let eachItem of specElements){
            specBox.appendChild(eachItem);
        }
        return specBox;
    }

    //function to create reviews box
    //rating(stars), comment, date(in time order, reviewer name in scrollable list)
    // "reviews": [
    //     {
    //       "rating": 3,
    //       "comment": "Would not recommend!",
    //       "date": "2025-04-30T09:41:02.053Z",
    //       "reviewerName": "Eleanor Collins",
    //       "reviewerEmail": "eleanor.collins@x.dummyjson.com"
    //     }
    function createReviews(product){
        const reviewBox = document.createElement("div");

        for (let eachItem of product.reviews) {
            const commentBox = document.createElement("div");
            const reviewerDetails = document.createElement("h4");
            reviewerDetails.textContent = `${eachItem.reviewerName} Email: ${eachItem.reviewerEmail}`;
            
            const date = document.createElement("p");
            const getDate = new Date(eachItem.date);
            const formattedDate = new Intl.DateTimeFormat("En-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            }).format(getDate);
            date.textContent = formattedDate;

            //Calling createRating function to create stars for each reviewer
            const rating = document.createElement("p");
            rating.textContent = "Rating: " + createRating(eachItem.rating) + " " + eachItem.rating;

            const comment = document.createElement("p");
            comment.textContent = eachItem.comment;
            comment.style.fontSize = "80%";

            commentBox.appendChild(reviewerDetails);
            commentBox.appendChild(date);
            commentBox.appendChild(rating);
            commentBox.appendChild(comment)

            reviewBox.appendChild(commentBox);
        }
        return reviewBox;

    }

    //function to create tab system to display specifications or reviews
    function createTabs(product){
        const tabs = document.createElement("div");


    }

    function createRating(rating) {
        const ratingRounded = Math.round(rating);
        let stars = "";
        for (let i = 0; i < 5; i++) {
            if (i < ratingRounded) {
                stars += "★"
            } else {
                stars += "☆";
            }
        }
        return stars;
    }


    

})