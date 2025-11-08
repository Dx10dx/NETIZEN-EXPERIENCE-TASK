const cardContainer = document.getElementById("card-container");
const summary = document.getElementById("summary");
const countSpan = document.getElementById("count");
const likedList = document.getElementById("liked-list");

const nextBtn = document.getElementById("next-btn");
const prevBtn = document.getElementById("prev-btn");

let likedCats = [];
const totalCats = 20;
let currentCardIndex = 0;

function showCard(index) {
    const cards = Array.from(cardContainer.children);
    cards.forEach((card, i) => {
        card.style.display = i === index ? "block" : "none";
    });
}

async function loadCats() {
    for (let i = 0; i < totalCats; i++) {
        const card = document.createElement("div");
        card.classList.add("card");

        const image = document.createElement("img");
        image.src = `https://cataas.com/cat?random=${Date.now()}-${i}`;

        card.appendChild(image);
        cardContainer.appendChild(card);

        addSwipe(card, image.src);
    }
    showCard(0);
}

function addSwipe(card, imgUrl) {
    let startX, currentX;
    let isDragging = false;

    card.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    card.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX - startX;
        card.style.transform = `translateX(${currentX}px) rotate(${currentX / 15}deg)`;
    });

    card.addEventListener("touchend", () => {
        isDragging = false;
        if (currentX > 100) vote("like", card, imgUrl);
        else if (currentX < -100) vote("dislike", card);
        else card.style.transform = "";
    });
}

function vote(action, card, imgUrl) {
    if (action === "like") likedCats.push(imgUrl);

    currentCardIndex++;
    if (currentCardIndex >= totalCats) {
        showSummary();
    } else {
        showCard(currentCardIndex);
    }
}

nextBtn.onclick = () => {
    vote("like", cardContainer.children[currentCardIndex], cardContainer.children[currentCardIndex].querySelector("img").src);
};

prevBtn.onclick = () => {
    if (currentCardIndex === 0) return;
    currentCardIndex--;
    showCard(currentCardIndex);
};

function showSummary() {
    countSpan.textContent = likedCats.length;
    likedList.innerHTML = "";
    likedCats.forEach(img => {
        let i = document.createElement("img");
        i.src = img;
        likedList.appendChild(i);
    });

    cardContainer.classList.add("hidden");
    document.querySelector(".controls").classList.add("hidden");
    summary.classList.remove("hidden");
}

function restart() {
    location.reload();
}

loadCats();
