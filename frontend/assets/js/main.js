// ════════════════════════════════════════════════════════════════════
//  Road Track BD — main.js  (Shared Utilities v3.0)
// ════════════════════════════════════════════════════════════════════

const API_BASE = window.location.origin;

// ─── Problem Type Labels (bilingual handled via i18n.js) ─────────────────────
const PROBLEM_LABELS = {
    broken: 'ভাঙা রাস্তা', pothole: 'বড় গর্ত', waterlogged: 'পানি জমা',
    dangerous: 'ঝুঁকিপূর্ণ', unpaved: 'কাঁচা রাস্তা', narrow: 'সংকীর্ণ রাস্তা',
    nolight: 'আলো নেই', erosion: 'মাটি ক্ষয়',
    bridge_repair: '🌉 ব্রিজ সংস্কার প্রয়োজন', bridge_new: '🌉 নতুন ব্রিজ প্রয়োজন',
    road_bridge_new: '🛣️ নতুন রাস্তা ও ব্রিজ', culvert_new: '🔧 কালভার্ট প্রয়োজন',
    culvert_repair: '🔧 কালভার্ট সংস্কার', embankment_new: '🏞️ বেড়িবাঁধ প্রয়োজন',
    embankment_repair: '🏞️ বেড়িবাঁধ সংস্কার', canal_small: '💧 ছোট খাল খনন',
    canal_large: '💧 বড় খাল খনন', under_repair: 'সংস্কার কাজ চলছে',
    tube_well_needed: '🚰 নলকূপ প্রয়োজন',  // ← NEW
    tube_well_repair: '🔧 নলকূপ মেরামত'      // ← NEW
};

const PROBLEM_LABELS_EN = {
    broken: 'Broken Road', pothole: 'Pothole', waterlogged: 'Waterlogged',
    dangerous: 'Dangerous', unpaved: 'Unpaved Road', narrow: 'Narrow Road',
    nolight: 'No Street Light', erosion: 'Soil Erosion',
    bridge_repair: '🌉 Bridge Repair Needed', bridge_new: '🌉 New Bridge Needed',
    road_bridge_new: '🛣️ New Road & Bridge', culvert_new: '🔧 Culvert Needed',
    culvert_repair: '🔧 Culvert Repair', embankment_new: '🏞️ Embankment Needed',
    embankment_repair: '🏞️ Embankment Repair', canal_small: '💧 Small Canal',
    canal_large: '💧 Large Canal', under_repair: 'Repair In Progress',
    tube_well_needed: '🚰 Tube Well Needed',
    tube_well_repair: '🔧 Tube Well Repair'
};

function getProblemLabel(type) {
    const lang = typeof getLang === 'function' ? getLang() : 'bn';
    return (lang === 'en' ? PROBLEM_LABELS_EN[type] : PROBLEM_LABELS[type]) || type;
}

const STATUS_LABELS = {
    pending: 'মেরামত বাকি', under_repair: 'সংস্কার চলছে',
    repaired: 'সংস্কার সম্পন্ন', rejected: 'বাতিল'
};
const STATUS_LABELS_EN = {
    pending: 'Pending Repair', under_repair: 'Under Repair',
    repaired: 'Repaired', rejected: 'Rejected'
};
function getStatusLabel(status) {
    const lang = typeof getLang === 'function' ? getLang() : 'bn';
    return (lang === 'en' ? STATUS_LABELS_EN[status] : STATUS_LABELS[status]) || status;
}

// ─── Map Marker Colors ────────────────────────────────────────────────────────
function getMarkerColor(r) {
    const typeColors = {
        broken: '#ff1744', pothole: '#ff1744', dangerous: '#ffd600',
        waterlogged: '#00b0ff', narrow: '#ffd600', nolight: '#ffd600',
        erosion: '#ff6d00', unpaved: '#ff6d00',
        bridge_repair: '#ff6d00', bridge_new: '#9c27b0', road_bridge_new: '#9c27b0',
        culvert_new: '#00e5ff', culvert_repair: '#00e5ff',
        embankment_new: '#795548', embankment_repair: '#795548',
        canal_small: '#00bfa5', canal_large: '#00bfa5', under_repair: '#2196f3',
        tube_well_needed: '#00bcd4', tube_well_repair: '#4fc3f7'  // ← NEW
    };
    if (r.status === 'under_repair') return '#2196f3';
    if (r.status === 'repaired') return '#00ff88';
    if (r.status === 'rejected') return '#546e7a';
    return typeColors[r.problemType] || '#ff1744';
}

// ─── Type-specific Reaction Emoji ────────────────────────────────────────────
function getReactionEmoji(problemType) {
    const waterTypes = ['waterlogged', 'canal_small', 'canal_large', 'tube_well_needed', 'tube_well_repair'];
    const bridgeTypes = ['bridge_repair', 'bridge_new', 'road_bridge_new', 'culvert_new', 'culvert_repair'];
    const earthTypes  = ['embankment_new', 'embankment_repair', 'erosion'];
    const roadTypes   = ['broken', 'pothole', 'dangerous', 'unpaved', 'narrow', 'nolight', 'under_repair'];
    if (waterTypes.includes(problemType)) return '🚰';
    if (bridgeTypes.includes(problemType)) return '🌉';
    if (earthTypes.includes(problemType)) return '⛏️';
    if (roadTypes.includes(problemType)) return '🛠️';
    return '👍';
}

function getReactionLabel(problemType) {
    const lang = typeof getLang === 'function' ? getLang() : 'bn';
    const emoji = getReactionEmoji(problemType);
    if (lang === 'en') return emoji + ' React';
    return emoji + ' রিঅ্যাক্ট';
}

// ─── Counter Animation ────────────────────────────────────────────────────────
function animateCount(id, target) {
    const el = document.getElementById(id);
    if (!el) return;
    let c = 0;
    const step = Math.max(1, Math.ceil(target / 40));
    const timer = setInterval(() => {
        c = Math.min(c + step, target);
        el.textContent = c;
        if (c >= target) clearInterval(timer);
    }, 40);
}

// ─── Time Formatting (bilingual) ──────────────────────────────────────────────
function formatTime(ts) {
    if (!ts) return '';
    const lang = typeof getLang === 'function' ? getLang() : 'bn';
    const diff = Math.floor((Date.now() - new Date(ts)) / 1000);
    if (lang === 'en') {
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
        return `${Math.floor(diff / 86400)}d ago`;
    }
    if (diff < 60) return `${diff} সেকেন্ড আগে`;
    if (diff < 3600) return `${Math.floor(diff / 60)} মিনিট আগে`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} ঘণ্টা আগে`;
    return `${Math.floor(diff / 86400)} দিন আগে`;
}

// ─── Toast Notification ───────────────────────────────────────────────────────
function showToast(msg, type = '') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.textContent = msg;
    el.className = 'toast show' + (type ? ' ' + type : '');
    el.style.display = 'block';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.display = 'none'; el.className = 'toast'; }, 4000);
}

// ─── API Helpers ──────────────────────────────────────────────────────────────
async function apiFetch(url, opts = {}) {
    const token = localStorage.getItem('rtbd_token');
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: 'Bearer ' + token } : {}),
        ...opts.headers
    };
    const fullUrl = url.startsWith('/api') ? API_BASE + url : API_BASE + '/api' + url;
    const res = await fetch(fullUrl, { ...opts, headers });
    return res.json();
}

async function apiPost(url, body) {
    return apiFetch(url, { method: 'POST', body: JSON.stringify(body) });
}

async function apiPut(url, body) {
    return apiFetch(url, { method: 'PUT', body: JSON.stringify(body) });
}

async function apiPatch(url, body) {
    return apiFetch(url, { method: 'PATCH', body: JSON.stringify(body) });
}

async function apiFormPost(url, formData) {
    const token = localStorage.getItem('rtbd_token');
    const headers = token ? { Authorization: 'Bearer ' + token } : {};
    const fullUrl = url.startsWith('/api') ? API_BASE + url : API_BASE + '/api' + url;
    const res = await fetch(fullUrl, { method: 'POST', headers, body: formData });
    return res.json();
}

// ─── Auth Helpers ─────────────────────────────────────────────────────────────
function saveAuth(token, user) {
    localStorage.setItem('rtbd_token', token);
    localStorage.setItem('rtbd_user', JSON.stringify(user));
}

function getUser() {
    try { return JSON.parse(localStorage.getItem('rtbd_user')); } catch { return null; }
}

function logout() {
    localStorage.removeItem('rtbd_token');
    localStorage.removeItem('rtbd_user');
    window.location.href = '/';
}

// ─── Socket.IO ────────────────────────────────────────────────────────────────
function initSocket(cb) {
    if (typeof io === 'undefined') return;
    const sk = io(window.location.origin, {
        transports: ['websocket', 'polling'],
        reconnection: true, reconnectionAttempts: 10, reconnectionDelay: 2000
    });
    sk.on('connect', () => { if (typeof updateLiveDot === 'function') updateLiveDot(true); });
    sk.on('disconnect', () => { if (typeof updateLiveDot === 'function') updateLiveDot(false); });
    if (cb) cb(sk);
    window._socket = sk;
    return sk;
}

function updateLiveDot(on) {
    document.querySelectorAll('.status-dot').forEach(d => {
        d.style.background = on ? 'var(--green-neon, #00ff88)' : '#ff1744';
    });
}

// ─── Profile System ───────────────────────────────────────────────────────────
function renderNavAuth() {
    const user = getUser();
    const navRight = document.getElementById('navRight');
    if (!navRight) return;

    if (user) {
        const avatarSrc = user.avatar
            ? `<img src="${user.avatar}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
            : (user.icon || '👤');
        navRight.innerHTML = `
            <div class="nav-status"><div class="status-dot"></div><span id="liveCount" data-i18n="nav.live">লাইভ</span></div>
            <button class="profile-btn" id="profileNavBtn" onclick="openProfileModal()" title="${user.name}">
                <div class="profile-avatar-mini">${avatarSrc}</div>
                <span class="profile-name-mini">${user.name.split(' ')[0]}</span>
            </button>`;
    } else {
        navRight.innerHTML = `
            <div class="nav-status"><div class="status-dot"></div><span id="liveCount" data-i18n="nav.live">লাইভ</span></div>
            <button class="nav-btn" id="authBtn" onclick="openAuthModal()" data-i18n="nav.login">প্রবেশ করুন</button>`;
    }
    if (typeof applyLang === 'function') applyLang();
}

window.showCongratsCard = function(msgLine1, msgLine2) {
    let card = document.createElement('div');
    card.className = 'modal-overlay open';
    card.style.zIndex = '99999';
    card.style.background = 'rgba(2, 10, 5, 0.95)';
    card.innerHTML = `
        <div class="modal-box" style="max-width:400px; text-align:center; padding: 3rem 2rem;">
            <div style="font-size:3.5rem;margin-bottom:15px;animation: pulse 1.5s infinite;">🎉</div>
            <h2 style="color:var(--green-neon);font-family:'Exo 2',sans-serif;font-size:1.4rem;margin-bottom:8px;">${msgLine1}</h2>
            <p style="color:var(--text-muted);font-size:0.9rem;line-height:1.6;">${msgLine2 || ''}</p>
        </div>
    `;
    document.body.appendChild(card);
    setTimeout(() => {
        card.classList.remove('open');
        setTimeout(() => card.remove(), 400);
    }, 4500);
};

window.openWhiteboxModal = function() {
    let modal = document.getElementById('whiteboxModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'whiteboxModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }
    const lang = typeof getLang === 'function' ? getLang() : 'bn';
    modal.innerHTML = `
    <div class="modal-box" style="max-width:600px;">
        <button class="modal-close" onclick="document.getElementById('whiteboxModal').classList.remove('open')">✕</button>
        <div class="modal-title" style="text-align:center;font-size:1.2rem;margin-bottom:1.5rem;border-bottom:1px solid var(--green-neon);padding-bottom:10px;">
            ${lang === 'en' ? '🔍 HOW IT WORKS' : '🔍 সিস্টেমটি কীভাবে কাজ করে?'}
        </div>
        <div style="font-family:'Noto Sans Bengali',sans-serif; line-height:1.8; color:var(--text-primary); font-size:0.95rem;">
            <div style="margin-bottom:1.5rem; background:rgba(0,255,136,0.05); padding:15px; border-radius:8px; border-left:4px solid var(--green-neon);">
                <strong style="color:var(--green-neon); display:block; margin-bottom:5px;">১. রির্পোট প্রদান (নাগরিক/স্বেচ্ছাসেবক):</strong>
                যে কোনো নাগরিক জিপিএস লোকেশনের মাধ্যমে রাস্তাঘাটের সমস্যা রিপোর্ট করতে পারেন। যা সাথে সাথেই ম্যাপে দৃশ্যমান হবে।
            </div>
            <div style="margin-bottom:1.5rem; background:rgba(0,255,136,0.05); padding:15px; border-radius:8px; border-left:4px solid var(--green-neon);">
                <strong style="color:var(--green-neon); display:block; margin-bottom:5px;">২. যাচাই ও পরিদর্শন (সরকারি কর্মকর্তা):</strong>
                প্রশাসনের দায়িত্বপ্রাপ্ত কর্মকর্তারা ম্যাপের মাধ্যমে এলাকা ভিত্তিক সমস্যার গুরুত্ব যাচাই করবেন।
            </div>
            <div style="margin-bottom:1.5rem; background:rgba(0,255,136,0.05); padding:15px; border-radius:8px; border-left:4px solid var(--green-neon);">
                <strong style="color:var(--green-neon); display:block; margin-bottom:5px;">৩. কাজ শুরু ও আপডেট (ঠিকাদার):</strong>
                ঠিকাদাররা নির্দিষ্ট সমস্যা সমাধানের দায়িত্ব নেবেন এবং কাজের অগ্রগতি (সংস্কার চলছে/সম্পন্ন) আপডেট করবেন।
            </div>
            <div style="margin-bottom:1.5rem; border:1px dashed var(--red-neon); padding:10px; border-radius:8px; background:rgba(244,42,65,0.05);">
                <strong style="color:var(--red-neon);">⚠️ ৭ দিনের নিয়ম:</strong> 
                রিপোর্ট করার ৭ দিনের মধ্যে যদি কোনো আপডেট না আসে, তবে সিস্টেম স্বয়ংক্রিয়ভাবে সেই রিপোর্ট ম্যাপ থেকে মুছে ফেলবে।
            </div>
            <p style="font-size:0.85rem; color:var(--text-muted); text-align:center; margin-top:10px;">
                জবাবদিহিতা নিশ্চিত করতে সকল ইউজারের NID তথ্য সংরক্ষিত থাকে।
            </p>
        </div>
    </div>`;
    modal.classList.add('open');
};

function openProfileModal() {
    const user = getUser();
    if (!user) { openAuthModal(); return; }
    let modal = document.getElementById('profileModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'profileModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }
    const lang = typeof getLang === 'function' ? getLang() : 'bn';
    const isFirst = user.isFirstLogin;
    const avatarHtml = user.avatar
        ? `<img src="${user.avatar}" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
        : `<span style="font-size:2.5rem;">${user.icon || '👤'}</span>`;

    modal.innerHTML = `
    <div class="modal-box" style="max-width:480px;">
        <button class="modal-close" onclick="closeProfileModal()">✕</button>
        
        <div class="modal-title" data-i18n="profile.title">${lang === 'en' ? '👤 My Profile' : '👤 আমার প্রোফাইল'}</div>
        
        <div class="auth-tabs" style="margin-bottom:15px;">
            <button class="auth-tab active" onclick="switchProfileTab('data',this)" data-i18n="profile.mydata">${lang === 'en' ? 'My Data' : 'প্রোফাইল তথ্য'}</button>
            <button class="auth-tab" onclick="switchProfileTab('reports',this);loadMyReports();" data-i18n="profile.myReports">${lang === 'en' ? 'My Reports' : 'আমার রিপোর্ট'}</button>
            <button class="auth-tab" onclick="switchProfileTab('settings',this)" data-i18n="profile.settings">${lang === 'en' ? 'Settings' : 'সেটিংস'}</button>
        </div>

        <div id="profTabData">
            <div style="text-align:center;margin-bottom:1.2rem;">
                <div class="profile-avatar-lg" id="profileAvatarLg" onclick="document.getElementById('avatarInput').click()" title="${lang === 'en' ? 'Change Avatar' : 'ছবি পরিবর্তন করুন'}">
                    ${avatarHtml}
                    <div class="profile-avatar-overlay">📷</div>
                </div>
                <input type="file" id="avatarInput" accept="image/*" style="display:none;" onchange="uploadAvatar(event)">
                <div style="font-size:0.65rem;color:var(--text-muted);margin-top:4px;" data-i18n="profile.changeAvatar">${lang === 'en' ? 'Change Avatar' : 'ছবি পরিবর্তন'}</div>
                <div style="color:var(--green-neon);font-size:0.8rem;margin-top:12px;font-family:'Noto Sans Bengali',sans-serif;">
                    ${lang === 'en' ? `Hey ${user.name.split(' ')[0]}, what types of reports or updates do you want to add today?` : `হ্যালো ${user.name.split(' ')[0]}, আজ কি কোনো নতুন রিপোর্ট বা আপডেট যোগ করতে চান?`}
                </div>
            </div>
            <div style="display:flex;gap:6px;align-items:center;margin-bottom:14px;background:rgba(0,255,136,0.03);border:1px solid var(--glass-border);border-radius:8px;padding:10px 14px;">
                <span style="font-size:1.2rem;">${user.icon || '👤'}</span>
                <span style="font-size:0.8rem;color:var(--green-neon);">${user.role}</span>
                <span style="margin-left:auto;font-size:0.72rem;color:var(--text-muted);">${lang === 'en' ? 'Reports:' : 'রিপোর্ট:'} <strong style="color:var(--green-neon);" id="profileReportCount">—</strong></span>
            </div>
        </div>

        <div id="profTabReports" style="display:none; max-height:300px; overflow-y:auto; padding-right:5px;">
            <div id="myReportsList" style="color:var(--text-muted);font-size:0.8rem;text-align:center;padding:2rem;">${lang === 'en' ? 'Loading...' : 'লোড হচ্ছে...'}</div>
        </div>

        <div id="profTabSettings" style="display:none; max-height:400px; overflow-y:auto; padding-right:5px;">
            <div class="form-group" style="margin-bottom:14px;">
                <label data-i18n="profile.name">${lang === 'en' ? 'Your Name' : 'আপনার নাম'}</label>
                <input type="text" id="profileNameInput" value="${user.name}" style="background:rgba(0,255,136,0.03);border:1px solid var(--glass-border);border-radius:6px;padding:10px 14px;color:var(--text-primary);font-family:'Noto Sans Bengali',sans-serif;font-size:0.85rem;outline:none;width:100%;">
            </div>
            <div style="display:flex; gap:10px; margin-bottom:14px;">
                <div class="form-group" style="flex:1;">
                    <label data-i18n="auth.nid">${lang === 'en' ? 'National ID (NID)' : 'জাতীয় পরিচয়পত্র (NID)'}</label>
                    <input type="text" id="profileNidInput" value="${user.nid || ''}" style="background:rgba(255,255,255,0.02);border:1px solid var(--glass-border);border-radius:6px;padding:8px;color:var(--text-primary);font-size:0.8rem;width:100%;">
                </div>
                <div class="form-group" style="flex:1;">
                    <label data-i18n="auth.occ">${lang === 'en' ? 'Occupation' : 'পেশা'}</label>
                    <input type="text" id="profileJobInput" value="${user.job || ''}" style="background:rgba(255,255,255,0.02);border:1px solid var(--glass-border);border-radius:6px;padding:8px;color:var(--text-primary);font-size:0.8rem;width:100%;">
                </div>
            </div>
            <div class="form-group" style="margin-bottom:14px;">
                <label data-i18n="auth.address">${lang === 'en' ? 'Address' : 'ঠিকানা'}</label>
                <input type="text" id="profileAddressInput" value="${user.address || ''}" style="background:rgba(255,255,255,0.02);border:1px solid var(--glass-border);border-radius:6px;padding:8px;color:var(--text-primary);font-size:0.8rem;width:100%;">
            </div>
            <button onclick="saveProfile()" style="width:100%;padding:12px;background:linear-gradient(135deg,var(--green-dark),#005a40);border:1px solid var(--green-neon);border-radius:8px;color:var(--green-neon);font-family:'Noto Sans Bengali',sans-serif;font-size:0.9rem;font-weight:600;cursor:pointer;transition:all 0.3s;box-shadow:var(--glow-green);margin-bottom:20px;" onmouseover="this.style.background='var(--green-neon)';this.style.color='var(--bg-deep)'" onmouseout="this.style.background='linear-gradient(135deg,var(--green-dark),#005a40)';this.style.color='var(--green-neon)'" data-i18n="profile.save">${lang === 'en' ? 'Save' : 'সংরক্ষণ করুন'}</button>

            <div style="background:rgba(255,23,68,0.05);border:1px solid rgba(255,23,68,0.2);padding:15px;border-radius:8px;margin-bottom:10px;">
                <h4 style="color:#ff1744;font-size:0.9rem;margin-bottom:6px;">Danger Zone</h4>
                <p style="color:var(--text-muted);font-size:0.75rem;margin-bottom:12px;">Deleting your profile is permanent and will withdraw you from total point scores, but anonymize past reports.</p>
                <button onclick="deleteProfile()" style="width:100%;padding:10px;background:none;border:1px solid #ff1744;border-radius:6px;color:#ff1744;font-size:0.82rem;cursor:pointer;transition:all 0.3s;" onmouseover="this.style.background='#ff1744';this.style.color='#fff'" onmouseout="this.style.background='none';this.style.color='#ff1744'" data-i18n="profile.delProf">${lang === 'en' ? '🚨 Delete Profile' : '🚨 প্রোফাইল মুছুন'}</button>
            </div>
            
            <button onclick="logout()" style="width:100%;padding:10px;background:rgba(255,23,68,0.08);border:1px solid rgba(255,23,68,0.3);border-radius:8px;color:#ff1744;font-family:'Noto Sans Bengali',sans-serif;font-size:0.82rem;cursor:pointer;transition:all 0.3s;" onmouseover="this.style.background='rgba(255,23,68,0.2)'" onmouseout="this.style.background='rgba(255,23,68,0.08)'" data-i18n="profile.logout">${lang === 'en' ? 'Log Out' : 'লগআউট করুন'}</button>
        </div>
    </div>`;

    modal.classList.add('open');
    modal.onclick = (e) => { if (e.target === modal) closeProfileModal(); };

    apiFetch('/api/volunteers/' + user.id).then(d => {
        const el = document.getElementById('profileReportCount');
        if (el && d.success) el.textContent = d.data.reportCount || 0;
    }).catch(() => {});
}

window.saveProfile = async function() {
    const name = document.getElementById('profileNameInput').value.trim();
    const nid = document.getElementById('profileNidInput').value.trim();
    const job = document.getElementById('profileJobInput').value.trim();
    const address = document.getElementById('profileAddressInput').value.trim();
    if (!name) return showToast('নাম প্রদান করুন', 'error');

    try {
        const d = await apiFetch('/api/auth/profile', {
            method: 'PUT',
            body: JSON.stringify({ name, nid, job, address })
        });
        if (d.success) {
            saveAuth(localStorage.getItem('token'), d.user);
            showToast('✅ প্রোফাইল আপডেট করা হয়েছে');
        } else showToast(d.message || 'ব্যর্থ হয়েছে', 'error');
    } catch(e) { showToast('সার্ভার সমস্যা', 'error'); }
};

window.switchProfileTab = function(tab, btn) {
    const pTabs = btn.parentElement.querySelectorAll('.auth-tab');
    pTabs.forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('profTabData').style.display = tab === 'data' ? 'block' : 'none';
    document.getElementById('profTabReports').style.display = tab === 'reports' ? 'block' : 'none';
    document.getElementById('profTabSettings').style.display = tab === 'settings' ? 'block' : 'none';
};

window.loadMyReports = async function() {
    try {
        const d = await apiFetch('/api/reports/me/list');
        const list = document.getElementById('myReportsList');
        if (!d.success || d.data.length === 0) {
            list.innerHTML = '<div style="text-align:center;padding:1rem;">কোনো রিপোর্ট নেই</div>';
            return;
        }
        list.innerHTML = d.data.map(r => `
            <div id="myrep-${r._id}" style="background:var(--bg-panel);border:1px solid var(--glass-border);border-radius:8px;padding:12px;margin-bottom:10px;display:flex;justify-content:space-between;align-items:center;">
                <div>
                   <div style="color:var(--green-neon);font-size:0.85rem;font-weight:bold;">${r.roadName}</div>
                   <div style="font-size:0.7rem;color:var(--text-muted);">${new Date(r.createdAt || r.timestamp).toLocaleDateString()}</div>
                </div>
                <!-- Trash Delete Post -->
                <button onclick="deleteMyReport('${r._id}')" style="background:rgba(255,23,68,0.1);border:1px solid #ff1744;border-radius:5px;cursor:pointer;padding:6px;transition:all 0.2s;" title="Delete Post">🗑️</button>
            </div>
        `).join('');
    } catch(e) {
        document.getElementById('myReportsList').innerHTML = 'লোড ব্যর্থ';
    }
};

window.deleteMyReport = async function(id) {
    const lang = typeof getLang === 'function' ? getLang() : 'bn';
    if (!confirm(lang === 'en' ? 'Are you sure you want to delete this report permanently?' : 'আপনি কি নিশ্চিত?')) return;
    try {
        const d = await apiFetch('/api/reports/' + id, { method: 'DELETE' });
        if (d.success) {
            showToast('✅ মুছে ফেলা হয়েছে');
            const el = document.getElementById('myrep-' + id);
            if (el) el.remove();
        } else showToast(d.message, 'error');
    } catch(e) { showToast('সার্ভার সমস্যা', 'error'); }
};

window.deleteProfile = async function() {
    const lang = typeof getLang === 'function' ? getLang() : 'bn';
    if (!confirm(lang === 'en' ? '🚨 Absolute Warning: This drops your profile permanently. Are you sure?' : '🚨 আপনি কি নিশ্চিত প্রোফাইল মুছতে চান?')) return;
    try {
        const d = await apiFetch('/api/auth/profile', { method: 'DELETE' });
        if (d.success) {
            showToast('✅ Profile deleted permanently.');
            logout();
        } else showToast(d.message, 'error');
    } catch(e) { showToast('Failure', 'error'); }
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) modal.classList.remove('open');
}

async function saveProfile() {
    const nameInput = document.getElementById('profileNameInput');
    if (!nameInput) return;
    const name = nameInput.value.trim();
    if (!name) { showToast(typeof t === 'function' ? 'নাম দিতে হবে' : 'Name required', 'error'); return; }
    try {
        const d = await apiPatch('/api/auth/profile', { name });
        if (d.success) {
            saveAuth(d.token, d.user);
            showToast('✅ ' + (typeof getLang === 'function' && getLang() === 'en' ? 'Profile saved' : 'প্রোফাইল সংরক্ষিত হয়েছে'));
            closeProfileModal();
            renderNavAuth();
        } else {
            showToast(d.message || 'সমস্যা হয়েছে', 'error');
        }
    } catch (e) {
        showToast('সার্ভার সমস্যা', 'error');
    }
}

async function uploadAvatar(event) {
    const file = event.target.files[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('avatar', file);
    try {
        const d = await apiFormPost('/api/auth/avatar', fd);
        if (d.success) {
            const user = getUser();
            user.avatar = d.avatar;
            localStorage.setItem('rtbd_user', JSON.stringify(user));
            showToast('✅ ছবি আপডেট হয়েছে');
            openProfileModal(); // refresh modal
            renderNavAuth();
        } else showToast(d.message || 'আপলোড ব্যর্থ', 'error');
    } catch (e) { showToast('সার্ভার সমস্যা', 'error'); }
}

// ─── Shared Auth Modal (injected into all pages) ──────────────────────────────
function openAuthModal() {
    const user = getUser();
    if (user) { openProfileModal(); return; }
    let modal = document.getElementById('authModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'authModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }
    const lang = typeof getLang === 'function' ? getLang() : 'bn';
    modal.innerHTML = `
    <div class="modal-box">
        <button class="modal-close" onclick="document.getElementById('authModal').classList.remove('open')">✕</button>
        <div class="modal-title" data-i18n="auth.title">${lang === 'en' ? '🔐 Account Access' : '🔐 অ্যাকাউন্টে প্রবেশ'}</div>
        <div class="auth-tabs">
            <button class="auth-tab active" id="tabLogin" onclick="switchAuthTab('login',this)" data-i18n="auth.login">${lang === 'en' ? 'Login' : 'লগইন'}</button>
            <button class="auth-tab" id="tabReg" onclick="switchAuthTab('register',this)" data-i18n="auth.register">${lang === 'en' ? 'New Account' : 'নতুন অ্যাকাউন্ট'}</button>
        </div>
        <div id="loginFormModal">
            <div class="form-group"><label data-i18n="auth.phone">${lang === 'en' ? 'Phone' : 'ফোন নম্বর'}</label><input type="tel" id="loginPhone" placeholder="01XXXXXXXXX"></div>
            <div class="form-group"><label data-i18n="auth.password">${lang === 'en' ? 'Password' : 'পাসওয়ার্ড'}</label><input type="password" id="loginPass" placeholder="••••••"></div>
            <button class="submit-btn" onclick="doLogin()" data-i18n="auth.doLogin">${lang === 'en' ? 'Sign In' : 'লগইন করুন'}</button>
        </div>
        <div id="registerFormModal" style="display:none;">
            <div class="form-group"><label data-i18n="auth.name">${lang === 'en' ? 'Full Name' : 'পূর্ণ নাম'}</label><input type="text" id="regName" placeholder="${lang === 'en' ? 'Your name' : 'আপনার নাম'}"></div>
            <div class="form-group"><label data-i18n="auth.phone">${lang === 'en' ? 'Phone' : 'ফোন নম্বর'}</label><input type="tel" id="regPhone" placeholder="01XXXXXXXXX"></div>
            <div class="form-group"><label data-i18n="auth.password">${lang === 'en' ? 'Password' : 'পাসওয়ার্ড'}</label><input type="password" id="regPass" placeholder="${lang === 'en' ? 'Min 6 characters' : 'কমপক্ষে ৬ অক্ষর'}"></div>
            <div class="form-group"><label data-i18n="auth.nid">${lang === 'en' ? 'National ID (NID)' : 'জাতীয় পরিচয়পত্র (NID)'}</label><input type="text" id="regNid" placeholder="${lang === 'en' ? 'NID Number' : 'NID নম্বর'}"></div>
            <div style="display:flex; gap:10px;">
                <div class="form-group" style="flex:1;"><label data-i18n="auth.occ">${lang === 'en' ? 'Occupation' : 'পেশা'}</label><input type="text" id="regJob" placeholder="${lang === 'en' ? 'Your Occupation' : 'আপনার পেশা'}"></div>
                <div class="form-group" style="flex:1;"><label data-i18n="auth.address">${lang === 'en' ? 'Address' : 'ঠিকানা'}</label><input type="text" id="regAddress" placeholder="${lang === 'en' ? 'District & Area' : 'জেলা ও এলাকা'}"></div>
            </div>
            <div class="form-group"><label data-i18n="auth.role">${lang === 'en' ? 'Role' : 'ভূমিকা'}</label>
                <select id="regRole" style="background:#020a05;border:1px solid var(--glass-border);border-radius:6px;padding:10px 14px;color:var(--text-primary);font-family:'Noto Sans Bengali',sans-serif;outline:none;width:100%;">
                    <option value="স্বেচ্ছাসেবক">${lang === 'en' ? 'Volunteer' : 'স্বেচ্ছাসেবক'}</option>
                    <option value="ঠিকাদার">${lang === 'en' ? 'Contractor' : 'ঠিকাদার'}</option>
                    <option value="সরকারিকর্মকর্তা">${lang === 'en' ? 'Govt. Official' : 'সরকারি কর্মকর্তা'}</option>
                </select>
            </div>
            <button class="submit-btn" onclick="doRegister()" data-i18n="auth.doRegister">${lang === 'en' ? 'Register' : 'নিবন্ধন করুন'}</button>
        </div>
    </div>`;
    modal.classList.add('open');
    modal.onclick = (e) => { if (e.target === modal) modal.classList.remove('open'); };
}

function switchAuthTab(tab, btn) {
    document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('loginFormModal').style.display = tab === 'login' ? 'block' : 'none';
    document.getElementById('registerFormModal').style.display = tab === 'register' ? 'block' : 'none';
}

async function doLogin() {
    const phone = document.getElementById('loginPhone').value.trim();
    const pass = document.getElementById('loginPass').value;
    if (!phone || !pass) { showToast('ফোন ও পাসওয়ার্ড দিন', 'error'); return; }
    try {
        const d = await apiPost('/api/auth/login', { phone, password: pass });
        if (d.success) {
            saveAuth(d.token, d.user);
            document.getElementById('authModal').classList.remove('open');
            showToast('✅ লগইন সফল হয়েছে — ' + d.user.name);
            renderNavAuth();
        } else showToast(d.message || 'লগইন ব্যর্থ', 'error');
    } catch (e) { showToast('সার্ভার সমস্যা', 'error'); }
}

async function doRegister() {
    const name = document.getElementById('regName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const pass = document.getElementById('regPass').value;
    const role = document.getElementById('regRole').value;
    const nid = document.getElementById('regNid').value.trim();
    const job = document.getElementById('regJob').value.trim();
    const address = document.getElementById('regAddress').value.trim();
    
    if (!name || !phone || !pass) { showToast('নাম, ফোন ও পাসওয়ার্ড দিন', 'error'); return; }
    try {
        const d = await apiPost('/api/auth/register', { name, phone, password: pass, role, nid, job, address });
        if (d.success) {
            saveAuth(d.token, d.user);
            document.getElementById('authModal').classList.remove('open');
            showToast('✅ নিবন্ধন সফল হয়েছে!');
            renderNavAuth();
        } else showToast(d.message || 'নিবন্ধন ব্যর্থ', 'error');
    } catch (e) { showToast('সার্ভার সমস্যা', 'error'); }
}

// ─── Injected Global Styles ───────────────────────────────────────────────────
const _globalStyle = document.createElement('style');
_globalStyle.textContent = `
@keyframes slideUp{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
@keyframes markerPulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.4);opacity:0.6;}}
@keyframes fadeIn{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}

/* Language Toggle */
.lang-toggle{display:flex;align-items:center;gap:4px;padding:4px 8px;border:1px solid var(--glass-border);border-radius:20px;background:rgba(0,255,136,0.04);}
.lt-btn{background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:0.7rem;font-family:'Exo 2',sans-serif;letter-spacing:1px;padding:2px 4px;border-radius:3px;transition:all 0.2s;}
.lt-btn.active{color:var(--green-neon);background:rgba(0,255,136,0.1);}
.lt-sep{color:var(--glass-border);font-size:0.7rem;}

/* Profile Button in Nav */
.profile-btn{display:flex;align-items:center;gap:8px;padding:5px 12px;background:rgba(0,255,136,0.06);border:1px solid var(--glass-border);border-radius:20px;cursor:pointer;transition:all 0.25s;color:var(--text-primary);}
.profile-btn:hover{border-color:var(--green-neon);background:rgba(0,255,136,0.12);}
.profile-avatar-mini{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--green-dark),#004d38);border:1px solid var(--green-neon);display:flex;align-items:center;justify-content:center;font-size:0.9rem;overflow:hidden;flex-shrink:0;}
.profile-name-mini{font-size:0.75rem;font-family:'Noto Sans Bengali',sans-serif;color:var(--green-neon);max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}

/* Profile Modal */
.profile-welcome-banner{background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.2);border-radius:10px;padding:14px;text-align:center;margin-bottom:1rem;animation:fadeIn 0.5s ease;}
.profile-avatar-lg{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--green-dark),#004d38);border:2px solid var(--green-neon);display:flex;align-items:center;justify-content:center;margin:0 auto 6px;cursor:pointer;position:relative;overflow:hidden;box-shadow:var(--glow-green);transition:all 0.3s;}
.profile-avatar-lg:hover .profile-avatar-overlay{opacity:1;}
.profile-avatar-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:1.5rem;opacity:0;transition:opacity 0.2s;}

/* Modal base (if not already in page) */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.8);z-index:2000;display:none;align-items:center;justify-content:center;backdrop-filter:blur(6px);}
.modal-overlay.open{display:flex;}
.modal-box{background:#021008;border:1px solid var(--green-neon);border-radius:16px;padding:2rem;max-width:500px;width:90%;position:relative;box-shadow:var(--glow-green);animation:slideUp 0.3s ease;max-height:90vh;overflow-y:auto;}
.modal-close{position:absolute;top:14px;right:14px;background:none;border:1px solid var(--glass-border);border-radius:4px;color:var(--text-muted);width:28px;height:28px;cursor:pointer;font-size:0.9rem;transition:all 0.2s;}
.modal-close:hover{border-color:var(--red-neon);color:var(--red-neon);}
.modal-title{font-family:'Exo 2',sans-serif;font-size:0.9rem;letter-spacing:2px;color:var(--green-neon);text-transform:uppercase;margin-bottom:1rem;}
.auth-tabs{display:flex;margin-bottom:1.5rem;border:1px solid var(--glass-border);border-radius:6px;overflow:hidden;}
.auth-tab{flex:1;padding:8px;text-align:center;cursor:pointer;font-size:0.78rem;font-family:'Noto Sans Bengali',sans-serif;color:var(--text-muted);transition:all 0.2s;background:transparent;border:none;}
.auth-tab.active{background:rgba(0,255,136,0.1);color:var(--green-neon);}
.form-group{display:flex;flex-direction:column;gap:6px;margin-bottom:12px;}
.form-group label{font-size:0.68rem;letter-spacing:1px;color:var(--text-muted);text-transform:uppercase;font-family:'Exo 2',sans-serif;}
.submit-btn{width:100%;padding:13px;background:linear-gradient(135deg,var(--green-dark),#005a40);border:1px solid var(--green-neon);border-radius:8px;color:var(--green-neon);font-family:'Noto Sans Bengali',sans-serif;font-size:0.9rem;font-weight:600;cursor:pointer;transition:all 0.3s;box-shadow:var(--glow-green);margin-top:4px;}
.submit-btn:hover{background:var(--green-neon);color:var(--bg-deep);transform:translateY(-2px);}
.submit-btn:disabled{opacity:0.5;cursor:not-allowed;transform:none;}

/* Toast */
.toast{position:fixed;bottom:30px;right:30px;padding:12px 20px;background:rgba(2,10,5,0.97);border:1px solid var(--green-neon);border-radius:8px;color:var(--green-neon);font-size:0.82rem;z-index:9999;display:none;animation:slideUp 0.3s ease;box-shadow:var(--glow-green);font-family:'Noto Sans Bengali',sans-serif;max-width:320px;}
.toast.error{border-color:var(--red-neon);color:var(--red-neon);box-shadow:var(--glow-red);}
`;
document.head.appendChild(_globalStyle);