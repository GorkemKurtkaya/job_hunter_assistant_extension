const mainView = document.getElementById("mainView");
const dataView = document.getElementById("dataView");
const jobDataDisplay = document.getElementById("jobDataDisplay");
const backBtn = document.getElementById("backBtn");
const dataToggle = document.getElementById("dataToggle");


dataToggle.addEventListener("change", () => {
  chrome.storage.local.set({ "dataCollectionEnabled": dataToggle.checked });
  console.log("Veri toplama:", dataToggle.checked ? "açık" : "kapalı");
});

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get(["dataCollectionEnabled"], (result) => {
    const isEnabled = result.dataCollectionEnabled === true;
    dataToggle.checked = isEnabled;
  });
});

backBtn.addEventListener("click", () => {
  dataView.style.display = "none";
  mainView.style.display = "flex";
});

document.getElementById("showData").addEventListener("click", () => {
  if (!dataToggle.checked) {
    alert("Veri toplama kapalı! Veri çekmek için toggle'ı açın.");
    return;
  }

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript({
      target: { tabId: tabs[0].id },
      function: extractJobData,
    }, (results) => {
      if (results && results[0] && results[0].result) {
        jobDataDisplay.innerHTML = formatJobData(results[0].result);
        mainView.style.display = "none";
        dataView.style.display = "flex";
      }
    });
  });
});

function extractJobData() {
  let title = "";
  const titleContainer = document.querySelector(".job-details-jobs-unified-top-card__job-title h1");
  if (titleContainer) {
    title = titleContainer.innerText.trim();
  } else {
    const titleLink = document.querySelector(".job-details-jobs-unified-top-card__job-title h1 a");
    if (titleLink) {
      title = titleLink.innerText.trim();
    } else {
      title = document.title || "";
    }
  }
  const companyContainer = document.querySelector(".job-details-jobs-unified-top-card__company-name a");
  const company = companyContainer ? companyContainer.innerText.trim() : "";
  const descriptionContainer = document.querySelector(".jobs-box__html-content");
  const description = descriptionContainer ? descriptionContainer.innerText.trim().substring(0, 7500) : "";
  const hirers = Array.from(document.querySelectorAll(".hirer-card__hirer-information")).map(hirer => {
    const name = hirer.querySelector(".jobs-poster__name strong")?.innerText || "";
    const role = hirer.querySelector(".linked-area .text-body-small")?.innerText || "";
    return { name, role };
  });

  const connections = Array.from(document.querySelectorAll('.job-details-people-who-can-help__connections-profile-card'));
  connections.forEach(card => {
    const name = card.querySelector('.job-details-people-who-can-help__connections-profile-card-title strong')?.innerText.trim() || "";
    const role = card.querySelector('.artdeco-entity-lockup__subtitle')?.innerText.trim() || "";
    if (name) {
      hirers.push({ name, role });
    }
  });

  return {
    title,
    company,
    description,
    hirers
  };
}

function formatJobData(jobData) {
  const formattedDescription = jobData.description.replace(/\n/g, '<br>');
  const hirersHtml = jobData.hirers && jobData.hirers.length > 0
    ? '<ul style="padding-left:18px;">' + jobData.hirers.map(h => `<li><b>${h.name}</b> - ${h.role}</li>`).join('') + '</ul>'
    : '<i>Bilgi yok</i>';
  return `
    <div><b>Pozisyon:</b> ${jobData.title}</div>
    <div><b>Şirket:</b> ${jobData.company}</div>
    <div style="margin:10px 0 4px 0;"><b>Açıklama:</b><br><span style="font-weight:400;">${formattedDescription}</span></div>
    <div style="margin-top:10px;"><b>İşe Alım Yapanlar:</b> ${hirersHtml}</div>
  `;
}
  