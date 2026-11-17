// ضع رقم واتساب إدارة الحجوزات هنا (مفتاح اليمن 967 + الرقم بدون صفر)
const ADMIN_WHATSAPP = "967776575785";

const places = [
    {
        id: 1,
        name: "فندق موفنبيك صنعاء",
        city: "صنعاء",
        type: "فندق",
        price: "80$ / ليلة",
        address: "حي حدة، شارع بيروت، صنعاء",
        description: "فندق 5 نجوم يوفر إقامة فاخرة وإطلالة مميزة على العاصمة مع غرف مجهزة بالكامل وخدمة غرف على مدار الساعة.",
        features: ["واي فاي مجاني", "إفطار مشمول", "مواقف سيارات", "نادي رياضي"],
        mapUrl: "https://maps.google.com/?q=15.3262,44.1910",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600"
    },
    {
        id: 2,
        name: "مطعم الحمراء السياحي",
        city: "صنعاء",
        type: "مطعم",
        price: "متوسط 15$ للشخص",
        address: "شارع حدة، جولة المصباحي، صنعاء",
        description: "يقدم أشهى المأكولات اليمنية التقليدية والعربية في أجواء عائلية راقية وجلسات خاصة.",
        features: ["قسم خاص للعائلات", "توصيل طلبات", "جلسات خارجية", "واي فاي"],
        mapUrl: "https://maps.google.com/?q=15.3350,44.1950",
        image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600"
    },
    {
        id: 3,
        name: "فندق كورال عدن",
        city: "عدن",
        type: "فندق",
        price: "70$ / ليلة",
        address: "خور مكسر، بالقرب من الكورنيش، عدن",
        description: "إقامة مريحة بالقرب من ساحل أبين والمطار، مثالي لرجال الأعمال والعائلات.",
        features: ["قريب من البحر", "تكييف مركزي", "واي فاي مجاني", "مطعم داخلي"],
        mapUrl: "https://maps.google.com/?q=12.8050,45.0360",
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600"
    },
    {
        id: 4,
        name: "مطعم البغدادي للمأكولات البحرية",
        city: "المكلا",
        type: "مطعم",
        price: "متوسط 12$ للشخص",
        address: "الديس، شارع الستين، المكلا",
        description: "أسماك طازجة يومياً من بحر العرب تُحضّر على الطريقة الحضرمية الأصيلة.",
        features: ["أسماك طازجة", "جلسات عائلية", "توصيل سريع"],
        mapUrl: "https://maps.google.com/?q=14.5425,49.1242",
        image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600"
    }
];

const placesGrid = document.getElementById("placesGrid");
const searchInput = document.getElementById("searchInput");
const cityFilter = document.getElementById("cityFilter");
const typeFilter = document.getElementById("typeFilter");

// عرض البطاقات
function displayPlaces(list) {
    placesGrid.innerHTML = "";
    list.forEach(place => {
        placesGrid.innerHTML += `
            <div class="card">
                <img src="${place.image}" alt="${place.name}">
                <div class="card-body">
                    <span class="badge">${place.city} - ${place.type}</span>
                    <h4>${place.name}</h4>
                    <p style="font-size: 13px; color: #666;">📍 ${place.address}</p>
                    <p class="price">${place.price}</p>
                    <div class="card-actions">
                        <button class="btn-secondary" onclick="openDetailsModal(${place.id})">التفاصيل</button>
                        <button class="btn-primary" style="flex: 1;" onclick="openBookingModal('${place.name}')">احجز الآن</button>
                    </div>
                </div>
            </div>
        `;
    });
}

// الفلترة والبحث
function filterPlaces() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCity = cityFilter.value;
    const selectedType = typeFilter.value;

    const filtered = places.filter(place => {
        const matchName = place.name.toLowerCase().includes(searchText) || place.address.toLowerCase().includes(searchText);
        const matchCity = selectedCity === "all" || place.city === selectedCity;
        const matchType = selectedType === "all" || place.type === selectedType;
        return matchName && matchCity && matchType;
    });

    displayPlaces(filtered);
}

searchInput.addEventListener("input", filterPlaces);
cityFilter.addEventListener("change", filterPlaces);
typeFilter.addEventListener("change", filterPlaces);

// نافذة التفاصيل
function openDetailsModal(id) {
    const place = places.find(p => p.id === id);
    if (!place) return;

    document.getElementById("detailImage").src = place.image;
    document.getElementById("detailBadge").innerText = `${place.city} - ${place.type}`;
    document.getElementById("detailName").innerText = place.name;
    document.getElementById("detailAddress").innerText = "📍 العنوان: " + place.address;
    document.getElementById("detailDesc").innerText = place.description;
    document.getElementById("detailPrice").innerText = place.price;
    document.getElementById("detailMapLink").href = place.mapUrl;

    const featuresContainer = document.getElementById("detailFeatures");
    featuresContainer.innerHTML = place.features.map(f => `<span class="feature-tag">✓ ${f}</span>`).join("");

    document.getElementById("detailBookBtn").onclick = function() {
        closeDetailsModal();
        openBookingModal(place.name);
    };

    document.getElementById("detailsModal").style.display = "flex";
}

function closeDetailsModal() {
    document.getElementById("detailsModal").style.display = "none";
}

// نافذة الحجز
let currentPlace = "";
function openBookingModal(placeName) {
    currentPlace = placeName;
    document.getElementById("modalTitle").innerText = "حجز في: " + placeName;
    document.getElementById("bookingModal").style.display = "flex";
}

function closeBookingModal() {
    document.getElementById("bookingModal").style.display = "none";
}

// إرسال الحجز إلى واتساب
document.getElementById("bookingForm").addEventListener("submit", function(e) {
    e.preventDefault();
    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;
    const date = document.getElementById("bookingDate").value;
    const guests = document.getElementById("guestsCount").value;

    const message = `مرحباً، أرغب بتأكيد حجز جديد عبر منصة *وجهتي اليمن*:%0A` +
                    `🏨 *المكان:* ${currentPlace}%0A` +
                    `👤 *الاسم:* ${name}%0A` +
                    `📱 *رقم الجوال:* ${phone}%0A` +
                    `📅 *التاريخ:* ${date}%0A` +
                    `👥 *العدد (أشخاص/غرف):* ${guests}`;

    const whatsappUrl = `https://wa.me/${ADMIN_WHATSAPP}?text=${message}`;
    window.open(whatsappUrl, "_blank");

    closeBookingModal();
    this.reset();
});

displayPlaces(places);