const SUPABASE_URL = "https://eqjhjlmdbpkofvwwyzne.supabase.co";
const SUPABASE_KEY = "sb_publishable_42tlbQp9lwZsOD8kku_b2w_vIvorKq3";
const ADMIN_WHATSAPP = "967776575785";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let allPlaces = [];
const placesGrid = document.getElementById("placesGrid");
const searchInput = document.getElementById("searchInput");
const cityFilter = document.getElementById("cityFilter");
const typeFilter = document.getElementById("typeFilter");

// جلب الأماكن من قاعدة البيانات
async function loadPlaces() {
    placesGrid.innerHTML = "<p>جاري تحميل الأماكن...</p>";
    const { data, error } = await supabaseClient
        .from('places')
        .select('*')
        .order('id', { ascending: false });

    if (error) {
        console.error("خطأ في جلب البيانات:", error);
        placesGrid.innerHTML = "<p>حدث خطأ أثناء تحميل البيانات.</p>";
        return;
    }

    allPlaces = data || [];
    displayPlaces(allPlaces);
}

// عرض البطاقات
function displayPlaces(list) {
    placesGrid.innerHTML = "";
    if (list.length === 0) {
        placesGrid.innerHTML = "<p>لا توجد أماكن مضافة حالياً. ادخل إلى <a href='admin.html'>لوحة التحكم</a> لإضافة أول فندق أو مطعم!</p>";
        return;
    }

    list.forEach(place => {
        placesGrid.innerHTML += `
            <div class="card">
                <img src="${place.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600'}" alt="${place.name}">
                <div class="card-body">
                    <span class="badge">${place.city} - ${place.type}</span>
                    <h4>${place.name}</h4>
                    <p style="font-size: 13px; color: #666;">📍 ${place.address || ''}</p>
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

    const filtered = allPlaces.filter(place => {
        const matchName = place.name.toLowerCase().includes(searchText) || (place.address && place.address.toLowerCase().includes(searchText));
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
    const place = allPlaces.find(p => p.id === id);
    if (!place) return;

    document.getElementById("detailImage").src = place.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600';
    document.getElementById("detailBadge").innerText = `${place.city} - ${place.type}`;
    document.getElementById("detailName").innerText = place.name;
    document.getElementById("detailAddress").innerText = "📍 العنوان: " + (place.address || "غير محدد");
    document.getElementById("detailDesc").innerText = place.description || "";
    document.getElementById("detailPrice").innerText = place.price;
    document.getElementById("detailMapLink").href = place.map_url || "#";

    const featuresArray = place.features ? place.features.split(",") : [];
    const featuresContainer = document.getElementById("detailFeatures");
    featuresContainer.innerHTML = featuresArray.map(f => `<span class="feature-tag">✓ ${f.trim()}</span>`).join("");

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

// حفظ الحجز في قاعدة البيانات + فتح واتساب
document.getElementById("bookingForm").addEventListener("submit", async function(e) {
    e.preventDefault();
    const name = document.getElementById("customerName").value;
    const phone = document.getElementById("customerPhone").value;
    const date = document.getElementById("bookingDate").value;
    const guests = parseInt(document.getElementById("guestsCount").value);

    const { error } = await supabaseClient
        .from('bookings')
        .insert([{
            place_name: currentPlace,
            customer_name: name,
            customer_phone: phone,
            booking_date: date,
            guests_count: guests
        }]);

    if (error) {
        console.error("خطأ في حفظ الحجز:", error);
    }

    const message = `مرحباً، أرغب بتأكيد حجز جديد عبر منصة *وجهتي اليمن*:%0A` +
                    `🏨 *المكان:* ${currentPlace}%0A` +
                    `👤 *الاسم:* ${name}%0A` +
                    `📱 *رقم الجوال:* ${phone}%0A` +
                    `📅 *التاريخ:* ${date}%0A` +
                    `👥 *العدد (أشخاص/غرف):* ${guests}`;

    window.open(`https://wa.me/${ADMIN_WHATSAPP}?text=${message}`, "_blank");

    closeBookingModal();
    this.reset();
});

loadPlaces();