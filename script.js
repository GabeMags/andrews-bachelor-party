function formatTime(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12} ${period}` : `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function renderSchedule(schedule) {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  schedule.forEach((item, idx) => {
    const isLast = idx === schedule.length - 1;

    if (item.type === "travel") {
      const row = document.createElement("div");
      row.className = "t-travel";
      row.innerHTML = `
        <div class="t-rail"><span>${item.icon}</span></div>
        <div>${item.title} &middot; ${item.duration}</div>
      `;
      timeline.appendChild(row);
      return;
    }

    const el = document.createElement("div");
    el.className = "t-event";

    const venueHtml = item.venue
      ? (item.mapUrl
          ? `<a href="${item.mapUrl}" target="_blank" rel="noopener">${item.venue}</a>`
          : item.venue) + (item.location ? ` — ${item.location}` : "")
      : "";

    const badgeClass = item.status === "confirmed" ? "badge-confirmed" : "badge-tentative";
    const badgeText = item.status === "confirmed" ? "Confirmed" : "Estimate";
    const costText = item.cost > 0 ? `$${item.cost}/person` : "Free";

    el.innerHTML = `
      <div class="t-rail">
        <div class="t-icon">${item.icon}</div>
        ${isLast ? "" : '<div class="t-line"></div>'}
      </div>
      <div class="t-card">
        <div class="t-time">${formatTime(item.start)} – ${formatTime(item.end)}</div>
        <div class="t-title">${item.title}</div>
        ${venueHtml ? `<div class="t-venue">${venueHtml}</div>` : ""}
        ${item.notes ? `<div class="t-notes">${item.notes}</div>` : ""}
        <div class="t-footer">
          <span class="badge ${badgeClass}">${badgeText}</span>
          <span class="t-cost">${costText}</span>
        </div>
      </div>
    `;
    timeline.appendChild(el);
  });
}

function renderCosts(data) {
  const events = data.schedule.filter((i) => i.type === "event");
  const perPerson = events.reduce((sum, i) => sum + (i.cost || 0), 0);
  const total = perPerson * data.guestCount;

  document.getElementById("cost-per-person").textContent = `$${perPerson}`;
  document.getElementById("cost-total").textContent = `$${total}`;
  document.getElementById("cost-guests").textContent = data.guestCount;

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
          <div class="cost-row-sub">${item.status === "confirmed" ? "Confirmed" : "Estimate"} &middot; $${item.cost * data.guestCount} total</div>
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
      el.textContent = "🥃 It's happening";
      return;
    }
    const days = Math.floor(diff / 86400000);
    const hours = Math.floor((diff % 86400000) / 3600000);
    el.textContent = days > 0 ? `${days}d ${hours}h to go` : `${hours}h to go`;
  }

  tick();
  setInterval(tick, 60000);
}

function render(data) {
  document.getElementById("hero-title").textContent = data.title;
  document.getElementById("hero-date").textContent = data.dateDisplay;
  document.getElementById("hero-location").textContent = data.location;
  document.title = data.title;
  renderCountdown(data.dateISO);
  renderSchedule(data.schedule);
  renderCosts(data);
  renderPayment(data);
}

document.addEventListener("DOMContentLoaded", () => render(PARTY));
