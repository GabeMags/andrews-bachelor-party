function formatTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function getDirectionsUrl(query) {
  const ua = navigator.userAgent || "";
  const encoded = encodeURIComponent(query);
  if (/iPhone|iPad|iPod/i.test(ua)) {
    return `https://maps.apple.com/?q=${encoded}`;
  }
  if (/Android/i.test(ua)) {
    return `geo:0,0?q=${encoded}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encoded}`;
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => { toast.hidden = true; }, 200);
  }, 1600);
}

function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => showToast("Address copied!")).catch(() => showToast("Couldn't copy"));
}

function groupScheduleByCity(schedule) {
  const groups = [];
  let currentCity = null;
  let currentGroup = null;

  schedule.forEach((item) => {
    if (item.type === "event") {
      if (item.city !== currentCity) {
        currentGroup = { city: item.city, items: [] };
        groups.push(currentGroup);
        currentCity = item.city;
      }
      currentGroup.items.push(item);
    } else if (currentGroup) {
      currentGroup.items.push(item);
    }
  });

  return groups;
}

const STATUS_LABELS = {
  confirmed: "Reservation",
  pending: "Pending reservation",
  tentative: "No reservation"
};

function statusLabelFor(status) {
  return STATUS_LABELS[status] || STATUS_LABELS.tentative;
}

function renderEventCard(item) {
  const venueText = item.venue
    ? item.venue + (item.location ? ` — ${item.location}` : "")
    : "";

  const statusKey = STATUS_LABELS[item.status] ? item.status : "tentative";
  const statusClass = `t-card-${statusKey}`;
  const statusLabelClass = `t-status-${statusKey}`;
  const statusLabel = statusLabelFor(item.status);
  const costText = item.cost > 0 ? `$${item.cost}/person` : "Free";

  const hasAddress = item.venue && item.location && !item.noDirections;
  const fullAddress = `${item.venue}, ${item.location}`;
  const directionsHtml = hasAddress
    ? `<a class="t-directions" href="${getDirectionsUrl(fullAddress)}" target="_blank" rel="noopener">📍 Directions</a>`
    : "";
  const copyHtml = hasAddress
    ? `<button class="t-directions t-copy-btn" type="button" data-copy="${fullAddress}">📋 Copy address</button>`
    : "";

  return `
    <div class="t-card ${statusClass}">
      <div class="t-header">
        <div class="t-time-group">
          <span class="t-time">${formatTime(item.start)} – ${formatTime(item.end)}</span>
          <span class="t-status ${statusLabelClass}">&bull; ${statusLabel}</span>
        </div>
        <span class="t-cost">${costText}</span>
      </div>
      <div class="t-title">${item.title}</div>
      ${venueText || directionsHtml ? `
        <div class="t-venue-row">
          ${venueText ? `<span class="t-venue">${venueText}</span>` : "<span></span>"}
          <div class="t-actions">${directionsHtml}${copyHtml}</div>
        </div>
      ` : ""}
      ${item.notes ? `<div class="t-notes">${item.notes}</div>` : ""}
    </div>
  `;
}

function renderSchedule(schedule) {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  const lastEvent = [...schedule].reverse().find((i) => i.type === "event");
  const groups = groupScheduleByCity(schedule);

  groups.forEach((group) => {
    const itemsHtml = group.items.map((item) => {
      if (item.type === "travel") {
        return `
          <div class="t-travel">
            <div class="t-rail"><span>${item.icon}</span></div>
            <div>${item.title} &middot; ${item.duration}</div>
          </div>
        `;
      }
      const isLast = item === lastEvent;
      return `
        <div class="t-event">
          <div class="t-rail">
            <div class="t-icon">${item.icon}</div>
            ${isLast ? "" : '<div class="t-line"></div>'}
          </div>
          ${renderEventCard(item)}
        </div>
      `;
    }).join("");

    const groupEl = document.createElement("div");
    groupEl.className = "city-group";
    groupEl.innerHTML = `
      <div class="city-bracket">
        <span class="city-label">${group.city}</span>
        <span class="city-brace"></span>
      </div>
      <div class="city-items">${itemsHtml}</div>
    `;
    timeline.appendChild(groupEl);
  });
}

function renderCosts(data) {
  const events = data.schedule.filter((i) => i.type === "event");
  const perAttendee = events.reduce((sum, i) => sum + (i.cost || 0), 0);
  const total = perAttendee * data.guestCount;
  const perPayingPerson = total / data.payingGuestCount;

  document.getElementById("cost-per-person").textContent = `$${Math.round(perPayingPerson).toLocaleString()}`;
  document.getElementById("cost-total").textContent = `$${total.toLocaleString()}`;

  const breakdown = document.getElementById("cost-breakdown");
  breakdown.innerHTML = "";
  events.filter((i) => i.cost > 0).forEach((item) => {
    const row = document.createElement("div");
    row.className = "cost-row";
    row.innerHTML = `
      <div class="cost-row-left">
        <span class="cost-row-icon">${item.icon}</span>
        <div>
          <div class="cost-row-title">${item.title}</div>
          <div class="cost-row-sub">${statusLabelFor(item.status)} &middot; $${item.cost * data.guestCount} total</div>
        </div>
      </div>
      <div class="cost-row-amount">$${item.cost}/person</div>
    `;
    breakdown.appendChild(row);
  });
}

function renderPayment(data) {
  const venmo = data.payment.venmo;
  const venmoLink = document.getElementById("pay-venmo");
  document.getElementById("pay-venmo-handle").textContent = venmo.handle;
  venmoLink.href = `https://venmo.com/${venmo.username}?txn=pay&note=${encodeURIComponent("Bachelor Bash")}`;
}

function renderCountdown(dateISO) {
  const el = document.getElementById("hero-countdown");
  const target = new Date(dateISO).getTime();

  function tick() {
    const diff = target - Date.now();
    if (diff <= 0) {
      el.innerHTML = `<span class="countdown-live">🥃 It's happening</span>`;
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);

    const units = days > 0 ? [[days, "days"], [hours, "hrs"]] : [[hours, "hrs"], [mins, "min"]];

    el.innerHTML = units
      .map(([value, label]) => `
        <div class="countdown-unit">
          <span class="countdown-num">${value}</span>
          <span class="countdown-label">${label}</span>
        </div>
      `)
      .join("");
  }

  tick();
  setInterval(tick, 60000);
}

function renderMap(data) {
  const points = data.schedule.filter((i) => i.type === "event" && typeof i.lat === "number" && typeof i.lng === "number");
  if (!points.length || typeof L === "undefined") return;

  const map = L.map("leaflet-map", { scrollWheelZoom: false });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
  }).addTo(map);

  const latlngs = points.map((item, idx) => {
    const icon = L.divIcon({
      className: "map-pin",
      html: `<div class="map-pin-circle${item.mapApprox ? " map-pin-approx" : ""}">${idx + 1}</div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13]
    });
    const label = item.mapApprox ? `${item.venue} (approx. location)` : (item.venue || "");
    L.marker([item.lat, item.lng], { icon })
      .addTo(map)
      .bindPopup(`<div class="map-popup-title">${idx + 1}. ${item.title}</div>${label}`);
    return [item.lat, item.lng];
  });

  L.polyline(latlngs, { color: "#b3792b", weight: 3, dashArray: "6 8" }).addTo(map);
  map.fitBounds(latlngs, { padding: [28, 28] });
}

function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("theme-toggle");

  function apply(theme) {
    if (theme === "dark") {
      root.setAttribute("data-theme", "dark");
      toggle.setAttribute("aria-pressed", "true");
      toggle.setAttribute("aria-label", "Switch to light mode");
    } else {
      root.removeAttribute("data-theme");
      toggle.setAttribute("aria-pressed", "false");
      toggle.setAttribute("aria-label", "Switch to dark mode");
    }
  }

  apply(localStorage.getItem("abb_theme") === "dark" ? "dark" : "light");

  toggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    localStorage.setItem("abb_theme", next);
    apply(next);
  });
}

function render(data) {
  document.getElementById("hero-title").textContent = data.title;
  document.getElementById("hero-date").textContent = data.dateDisplay;
  document.title = data.title;
  renderCountdown(data.dateISO);
  renderSchedule(data.schedule);
  renderMap(data);
  renderCosts(data);
  renderPayment(data);
}

document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  render(PARTY);

  document.getElementById("timeline").addEventListener("click", (e) => {
    const btn = e.target.closest(".t-copy-btn");
    if (btn) copyToClipboard(btn.dataset.copy);
  });
});
