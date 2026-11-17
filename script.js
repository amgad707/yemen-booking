// بيانات تجريبية للفنادق والمطاعم (تقدر تعدلها وتضيف عليها بسهولة)
const places = [
    {
        id: 1,
        name: "فندق موفنبيك صنعاء",
        city: "صنعاء",
        type: "فندق",
        price: "80$ / ليلة",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
    },
    {
        id: 2,
        name: "مطعم الحمراء السياحي",
        city: "صنعاء",
        type: "مطعم",
        price: "متوسط 15$ للشخص",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"
    },
    {
        id: 3,
        name: "فندق كورال عدن",
        city: "عدن",
        type: "فندق",
        price: "70$ / ليلة",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"
    },
    {
        id: 4,
        name: "مطعم البغدادي للمأكولات البحرية",
        city: "المكلا",
        type: "مطعم",
        price: "متوسط 12$ للشخص",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"
    }
];

const placesGrid = document.getElementById("placesGrid");
const searchInput = document.getElementById("searchInput");
const cityFilter = document.getElementById("cityFilter");
const typeFilter = document.getElementById("typeFilter");

// دالة لعرض البطاقات في الصفحة
function displayPlaces(list) {
    placesGrid.innerHTML = "";
    list.forEach(place => {
        placesGrid.innerHTML += `
            <div class="card">
                <img src="${place.image}" alt="${place.name}">
                <div class="card-body">
                    <span class="badge">${place.city} - ${place.type}</span>
                    <h4>${place.name}</h4>
                    <p class="price">${place.price}</p>
                    <button class="btn-primary" onclick="openModal('${place.name}')">احجز الآن</button>
                </div>
            </div>
        `;
    });
}

// دالة الفلترة والبحث
function filterPlaces() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCity = cityFilter.value;
    const selectedType = typeFilter.value;

    const filtered = places.filter(place => {
        const matchName = place.name.toLowerCase().includes(searchText);
        const matchCity = selectedCity === "all" || place.city === selectedCity;
        const matchType = selectedType === "all" || place.type === selectedType;
        return matchName && matchCity && matchType;
    });

    displayPlaces(filtered);
}

searchInput.addEventListener("input", filterPlaces);
cityFilter.addEventListener("change", filterPlaces);
typeFilter.addEventListener("change", filterPlaces);

// التحكم بنافذة الحجز
let currentPlace = "";
function openModal(placeName) {
    currentPlace = placeName;
    document.getElementById("modalTitle").innerText = "حجز في: " + placeName;
    document.getElementById("bookingModal").style.display = "flex";
}

function closeModal() {
    document.getElementById("bookingModal").style.display = "none";
}

// عند إرسال نموذج الحجز
document.getElementById("bookingForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;
    const date = document.getElementById("bookingDate").value;

    alert(`تم استلام طلب حجزك بنجاح!\nالمكان: ${currentPlace}\nالاسم: ${name}\nالتاريخ: ${date}\nسنتواصل معك على: ${phone}`);
    closeModal();
    this.reset();
});

// تشغيل العرض أول ما تفتح الصفحة
displayPlaces(places);