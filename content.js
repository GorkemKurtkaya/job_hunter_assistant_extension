async function sendJobDataToAPI(jobData) {
  try {
    const recruiters = jobData.hirers.map(hirer => {
      if (hirer.name && hirer.role) {
        return `${hirer.name} - ${hirer.role}`;
      } else if (hirer.name) {
        return hirer.name;
      }
      return '';
    }).filter(recruiter => recruiter !== '');

    const requestData = {
      company_name: jobData.company,
      position: jobData.title,
      description: jobData.description,
      recruiters: recruiters
    };

      const response = await fetch(`${window.CONFIG.BACKEND_URL}${window.CONFIG.API_ENDPOINT}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestData)
    });

    if (response.ok) {
      console.log('✅ Başvuru verisi başarıyla kaydedildi:', requestData);
      return true;
    } else {
      console.error('❌ API hatası:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('❌ Başvuru verisi gönderilirken hata oluştu:', error);
    return false;
  }
}


async function extractJobData() {
  const isEnabled = await isDataCollectionEnabled();
  if (!isEnabled) {
    console.log('🔒 Veri toplama kapalı - veri çekilmedi');
    return null;
  }

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
  const description = descriptionContainer ? descriptionContainer.innerText.trim().substring(0, 3000) : "";
  
  const hirers = Array.from(document.querySelectorAll(".hirer-card__hirer-information")).map(hirer => {
    const name = hirer.querySelector(".jobs-poster__name strong")?.innerText || "";
    const role = hirer.querySelector(".linked-area .text-body-small")?.innerText.trim() || "";
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

function isDataCollectionEnabled() {
  return new Promise((resolve) => {
    chrome.storage.local.get(["dataCollectionEnabled"], (result) => {
      const isEnabled = result.dataCollectionEnabled === true;
      console.log('🔍 Veri toplama durumu:', isEnabled ? 'açık' : 'kapalı');
      resolve(isEnabled);
    });
  });
}

function setupDelegatedJobDataListener() {
  function isRelevantButton(el) {
    if (!el) return false;
    if (el.tagName !== 'BUTTON') return false;
    const text = (el.innerText || '').trim();
    console.log('Buton metni:', text); 
    return text === 'Uygula' || text === 'Başvuruyu gönder';
  }

  document.body.addEventListener("click", async function(e) {
    let el = e.target;
    
    const isEnabled = await isDataCollectionEnabled();
    if (!isEnabled) {
      return;
    }
    
    for (let i = 0; i < 5 && el; i++, el = el.parentElement) {
      if (isRelevantButton(el)) {
        console.log('✅ İlgili buton bulundu!'); 
        
        const jobData = await extractJobData();
        if (!jobData) {
          console.log('🔒 Veri toplama kapalı - veri çekilmedi');
          return;
        }
        
        console.log('Çekilen job data:', jobData); 
        
        const success = await sendJobDataToAPI(jobData);
        
        if (success) {
          console.log('✅ Başvuru verisi başarıyla kaydedildi:', jobData);
        } else {
          console.log('❌ Başvuru verisi kaydedilemedi:', jobData);
        }
        break;
      }
    }
  }, true);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', setupDelegatedJobDataListener);
} else {
  setupDelegatedJobDataListener();
}

console.log('🔧 LinkedIn Başvuru Eklentisi yüklendi!'); 