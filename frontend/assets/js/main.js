




window.onerror = function(msg, url, line, col, error) {
    console.error("SYS_CRASH:", { msg, url, line, col, error });
    
};
window.onunhandledrejection = function(event) {
    console.error("SYS_UNHANDLED_PROMISE:", event.reason);
};

const API_BASE = window.location.origin;


const PROBLEM_COLORS = {
    broken: '#ff1744', pothole: '#ff1744', dangerous: '#ffd600',
    waterlogged: '#00b0ff', narrow: '#ffd600', nolight: '#ffd600',
    erosion: '#ff6d00', unpaved: '#ff6d00',
    bridge_repair: '#ff6d00', bridge_new: '#9c27b0', road_bridge_new: '#9c27b0',
    culvert_new: '#00e5ff', culvert_repair: '#00e5ff',
    embankment_new: '#795548', embankment_repair: '#795548',
    canal_small: '#00bfa5', canal_large: '#00bfa5', under_repair: '#2196f3',
    tube_well_needed: '#00bcd4', tube_well_repair: '#4fc3f7',
    railway_repair: '#ff6d00', railway_new: '#9c27b0', railway_station_new: '#9c27b0',
    bus_station_repair: '#ff6d00', bus_station_new: '#9c27b0',
    opinion: '#00f2ff'
};


const PROBLEM_LABELS = {
    broken: '<i class="fa-solid fa-road-circle-exclamation"></i> ভাঙা রাস্তা', pothole: '<i class="fa-solid fa-road-spikes"></i> বড় গর্ত', waterlogged: '<i class="fa-solid fa-water"></i> পানি জমা',
    dangerous: '<i class="fa-solid fa-triangle-exclamation"></i> ঝুঁকিপূর্ণ', unpaved: '<i class="fa-solid fa-road"></i> কাঁচা রাস্তা', narrow: '<i class="fa-solid fa-compress"></i> সংকীর্ণ রাস্তা',
    nolight: '<i class="fa-regular fa-lightbulb"></i> আলো নেই', erosion: '<i class="fa-solid fa-hill-rockslide"></i> মাটি ক্ষয়',
    bridge_repair: '<i class="fa-solid fa-bridge-circle-exclamation"></i> ব্রিজ সংস্কার প্রয়োজন', bridge_new: '<i class="fa-solid fa-bridge"></i> নতুন ব্রিজ প্রয়োজন',
    road_bridge_new: '<i class="fa-solid fa-bridge-water"></i> নতুন রাস্তা ও ব্রিজ', culvert_new: '<i class="fa-solid fa-wrench"></i> কালভার্ট প্রয়োজন',
    culvert_repair: '<i class="fa-solid fa-screwdriver-wrench"></i> কালভার্ট সংস্কার', embankment_new: '<i class="fa-solid fa-mound"></i> বেড়িবাঁধ প্রয়োজন',
    embankment_repair: '<i class="fa-solid fa-trowel"></i> বেড়িবাঁধ সংস্কার', canal_small: '<i class="fa-solid fa-water"></i> ছোট খাল খনন',
    canal_large: '<i class="fa-solid fa-water"></i> বড় খাল খনন', under_repair: '<i class="fa-solid fa-person-digging"></i> সংস্কার কাজ চলছে',
    tube_well_needed: '<i class="fa-solid fa-faucet-drip"></i> নলকূপ প্রয়োজন',
    tube_well_repair: '<i class="fa-solid fa-wrench"></i> নলকূপ মেরামত',
    railway_repair: '<i class="fa-solid fa-train-tram"></i> রেললাইন মেরামত',
    railway_new: '<i class="fa-solid fa-train"></i> নতুন রেললাইন',
    railway_station_new: '<i class="fa-building-shield"></i> নতুন রেল স্টেশন',
    bus_station_repair: '<i class="fa-solid fa-bus"></i> বাস স্টেশন মেরামত',
    bus_station_new: '<i class="fa-solid fa-building"></i> নতুন বাস স্টেশন',
    opinion: '<i class="fa-regular fa-comments"></i> জনমতামত'
};

const PROBLEM_LABELS_EN = {
    broken: '<i class="fa-solid fa-road-circle-exclamation"></i> Broken Road', pothole: '<i class="fa-solid fa-road-spikes"></i> Pothole', waterlogged: '<i class="fa-solid fa-water"></i> Waterlogged',
    dangerous: '<i class="fa-solid fa-triangle-exclamation"></i> Dangerous', unpaved: '<i class="fa-solid fa-road"></i> Unpaved Road', narrow: '<i class="fa-solid fa-compress"></i> Narrow Road',
    nolight: '<i class="fa-regular fa-lightbulb"></i> No Street Light', erosion: '<i class="fa-solid fa-hill-rockslide"></i> Soil Erosion',
    bridge_repair: '<i class="fa-solid fa-bridge-circle-exclamation"></i> Bridge Repair Needed', bridge_new: '<i class="fa-solid fa-bridge"></i> New Bridge Needed',
    road_bridge_new: '<i class="fa-solid fa-bridge-water"></i> New Road & Bridge', culvert_new: '<i class="fa-solid fa-wrench"></i> Culvert Needed',
    culvert_repair: '<i class="fa-solid fa-screwdriver-wrench"></i> Culvert Repair', embankment_new: '<i class="fa-solid fa-mound"></i> Embankment Needed',
    embankment_repair: '<i class="fa-solid fa-trowel"></i> Embankment Repair', canal_small: '<i class="fa-solid fa-water"></i> Small Canal',
    canal_large: '<i class="fa-solid fa-water"></i> Large Canal', under_repair: '<i class="fa-solid fa-person-digging"></i> Repair In Progress',
    tube_well_needed: '<i class="fa-solid fa-faucet-drip"></i> Tube Well Needed',
    tube_well_repair: '<i class="fa-solid fa-wrench"></i> Tube Well Repair',
    railway_repair: '<i class="fa-solid fa-train-tram"></i> Railway Repair',
    railway_new: '<i class="fa-solid fa-train"></i> New Railway',
    railway_station_new: '<i class="fa-building-shield"></i> New Railway Station',
    bus_station_repair: '<i class="fa-solid fa-bus"></i> Bus Station Repair',
    bus_station_new: '<i class="fa-solid fa-building"></i> New Bus Station',
    opinion: '<i class="fa-regular fa-comments"></i> Public Opinion'
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


function getMarkerColor(r) {
    if (r.problemType === 'opinion') return '#00f2ff';
    if (r.status === 'under_repair') return '#2196f3';
    if (r.status === 'repaired') return '#00ff88';
    if (r.status === 'rejected') return '#546e7a';
    return PROBLEM_COLORS[r.problemType] || '#ff1744';
}


function getReactionEmoji(problemType) {
    const waterTypes = ['waterlogged', 'canal_small', 'canal_large', 'tube_well_needed', 'tube_well_repair'];
    const bridgeTypes = ['bridge_repair', 'bridge_new', 'road_bridge_new', 'culvert_new', 'culvert_repair'];
    const earthTypes  = ['embankment_new', 'embankment_repair', 'erosion'];
    const roadTypes   = ['broken', 'pothole', 'dangerous', 'unpaved', 'narrow', 'nolight', 'under_repair'];
    if (problemType === 'opinion') return '<i class="fa-regular fa-lightbulb"></i>';
    if (waterTypes.includes(problemType)) return '<i class="fa-solid fa-droplet"></i>';
    if (bridgeTypes.includes(problemType)) return '<i class="fa-solid fa-bridge"></i>';
    if (earthTypes.includes(problemType)) return '<i class="fa-solid fa-hammer"></i>';
    if (roadTypes.includes(problemType)) return '<i class="fa-solid fa-helmet-safety"></i>';
    return '<i class="fa-solid fa-thumbs-up"></i>';
}

function getReactionLabel(problemType) {
    const lang = typeof getLang === 'function' ? getLang() : 'bn';
    const emoji = getReactionEmoji(problemType);
    if (lang === 'en') return emoji + ' React';
    return emoji + ' রিঅ্যাক্ট';
}


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


function showToast(msg, type = '') {
    const el = document.getElementById('toast');
    if (!el) return;
    el.innerHTML = msg;
    el.className = 'toast show' + (type ? ' ' + type : '');
    el.style.display = 'block';
    clearTimeout(el._t);
    el._t = setTimeout(() => { el.style.display = 'none'; el.className = 'toast'; }, 4000);
}


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


function saveAuth(token, user) {
    localStorage.setItem('rtbd_token', token);
    localStorage.setItem('rtbd_user', JSON.stringify(user));
}

function getUser() {
    try { 
        let u = JSON.parse(localStorage.getItem('rtbd_user'));
        if (u && typeof u.icon === 'string') {
            if (u.icon === '🤝') u.icon = '<i class="fa-solid fa-handshake"></i>';
            if (u.icon === '🏗️') u.icon = '<i class="fa-solid fa-helmet-safety"></i>';
            if (u.icon === '🏛️') u.icon = '<i class="fa-solid fa-building-columns"></i>';
            localStorage.setItem('rtbd_user', JSON.stringify(u));
        }
        return u;
    } catch { return null; }
}

function logout() {
    localStorage.removeItem('rtbd_token');
    localStorage.removeItem('rtbd_user');
    window.location.href = '/';
}


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


function renderNavAuth() {
    const user = getUser();
    const navRight = document.getElementById('navRight');
    if (!navRight) return;

    if (user) {
        const avatarSrc = user.avatar
            ? `<img src="${user.avatar}" alt="" style="width:100%;height:100%;object-fit:cover;border-radius:50%;">`
            : (user.icon || '<i class="fa-solid fa-user"></i>');
        navRight.innerHTML = `
            <div class="nav-status"><div class="status-dot"></div><span id="liveCount" data-i18n="nav.live">লাইভ</span></div>
            <div class="profile-btn" id="profileNavBtn" title="${user.name}" onclick="openProfileModal()">
                <div class="profile-avatar-mini">${avatarSrc}</div>
                <span class="profile-name-mini">${user.name.split(' ')[0]}</span>
            </div>`;
    } else {
        navRight.innerHTML = `
            <div class="nav-status"><div class="status-dot"></div><span id="liveCount" data-i18n="nav.live">লাইভ</span></div>
            <div class="profile-btn" onclick="openAuthModal()" title="${typeof getLang==='function'&&getLang()==='en'?'Login / Profile':'লগইন / প্রোফাইল'}">
                <div class="profile-avatar-mini" style="font-size:1.1rem; border:none; background:transparent;"><i class="fa-solid fa-user"></i></div>
            </div>`;
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
            <div style="font-size:3.5rem;margin-bottom:15px;animation: pulse 1.5s infinite;"><i class="fa-solid fa-party-horn"></i></div>
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
    <div class="modal-box" style="max-width:650px;">
        <button class="modal-close" onclick="document.getElementById('whiteboxModal').classList.remove('open')"><i class="fa-solid fa-xmark"></i></button>
        <div class="modal-title" style="text-align:center;font-size:1.2rem;margin-bottom:1rem;border-bottom:1px solid var(--green-neon);padding-bottom:10px;">
            ${lang === 'en' ? '<i class="fa-solid fa-magnifying-glass"></i> USER GUIDE & RULES' : '<i class="fa-solid fa-magnifying-glass"></i> প্রকল্প গাইডলাইন ও নিয়মকানুন'}
        </div>
        <div style="font-family:'Noto Sans Bengali',sans-serif; line-height:1.6; color:var(--text-primary); font-size:0.9rem;">
            <div style="margin-bottom:1rem; background:rgba(0,255,136,0.05); padding:12px; border-radius:8px; border-left:4px solid var(--green-neon);">
                <strong style="color:var(--green-neon); display:block;">১. উদ্যোগ ও লক্ষ্য:</strong>
                বাংলাদেশের ১৮ কোটি জনগনের মানুষের কল্যাণে এই উদ্যোগটি গ্রহন করা হয়েছে। আপনার আশেপাশে যত ভাঙা রাস্তায় বড় গর্ত, পানি জমা, ঝুঁকিপূর্ণ, কাঁচা রাস্তা, সংকীর্ণ রাস্তা ইত্যাদি রয়েছে তা এখানে রিপোর্ট করুন।
            </div>
            <div style="margin-bottom:1rem; background:rgba(0,255,136,0.05); padding:12px; border-radius:8px; border-left:4px solid var(--green-neon);">
                <strong style="color:var(--green-neon); display:block;">২. সমস্যার সমাধান পদ্ধতি:</strong>
                এই স্থানে সমস্যার রিপোর্ট করলে, সরকারি কর্মকর্তারা তা যাচাই করে ঠিকাদারদের নির্দেশ দিতে পারবেন, অথবা জনগণ নিজ উদ্যোগে ঠিকাদারদের কন্টাক্ট নিয়ে সমস্যা সমাধান করতে পারবে। স্বেচ্ছাসেবকরা লাইভ লোকেশন মার্ক করে সমস্যাগুলো রিপোর্ট করবেন।
            </div>
            <div style="margin-bottom:1rem; background:rgba(0,255,136,0.05); padding:12px; border-radius:8px; border-left:4px solid var(--green-neon);">
                <strong style="color:var(--green-neon); display:block;">৩. ব্যবহারকারী একাউন্ট ও সুরক্ষা:</strong>
                অ্যাপের উপরে থাকা ইউনিভার্সাল প্রোফাইল আইকনে ক্লিক করে ব্যবহারকারীরা তাদের সঠিক তথ্য দিয়ে একাউন্ট খুলতে পারবেন ও কাজ করতে পারবেন। তাদের তথ্য সম্পূর্ণ সুরক্ষিত থাকবে।
            </div>
            <div style="margin-bottom:1rem; border:1px solid var(--red-neon); padding:10px; border-radius:8px; background:rgba(244,42,65,0.07);">
                <strong style="color:var(--red-neon);"><i class="fa-solid fa-triangle-exclamation"></i> সতর্কতা (নকল রিপোর্ট):</strong> 
                কেউ ফেক বা ভুয়া রিপোর্ট করতে পারবে না। যদি কেউ এমনটা করে, তবে তাদের যাবতীয় তথ্য যাচাই করে আইনগত ব্যবস্থা নেওয়া হবে।
            </div>
        </div>
    </div>`;
    modal.classList.add('open');
};

function openProfileModal() {
    const user = getUser();
    if (!user) { openAuthModal(); return; }
    window.location.href = '/profile';
}


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
        <button class="modal-close" onclick="document.getElementById('authModal').classList.remove('open')"><i class="fa-solid fa-xmark"></i></button>
        <div class="modal-title" data-i18n="auth.title">${lang === 'en' ? '<i class="fa-solid fa-lock"></i> Account Access' : '<i class="fa-solid fa-lock"></i> অ্যাকাউন্টে প্রবেশ'}</div>
        <div class="auth-tabs">
            <button class="auth-tab active" id="tabLogin" onclick="switchAuthTab('login',this)" data-i18n="auth.login">${lang === 'en' ? 'Login' : 'লগইন'}</button>
            <button class="auth-tab" id="tabReg" onclick="switchAuthTab('register',this)" data-i18n="auth.register">${lang === 'en' ? 'New Account' : 'একাউন্ট খুলুন'}</button>
            <button class="auth-tab" id="tabReset" onclick="switchAuthTab('reset',this)" data-i18n="auth.reset">${lang === 'en' ? 'Forgot Pass' : 'পাসওয়ার্ড ভুলে গেছেন?'}</button>
        </div>
        <div id="loginFormModal">
            <div class="form-group"><label data-i18n="auth.phone">${lang === 'en' ? 'Phone' : 'ফোন নম্বর'}</label><input type="tel" id="loginPhone" placeholder="01XXXXXXXXX"></div>
            <div class="form-group"><label data-i18n="auth.password">${lang === 'en' ? 'Password' : 'পাসওয়ার্ড'}</label><input type="password" id="loginPass" placeholder="••••••"></div>
            <button class="submit-btn" onclick="doLogin()" data-i18n="auth.doLogin">${lang === 'en' ? 'Sign In' : 'লগইন করুন'}</button>
        </div>
        <div id="registerFormModal" style="display:none; max-height: 480px; overflow-y: auto; padding-right: 5px;">
            <div class="form-group"><label data-i18n="auth.name">${lang === 'en' ? 'Full Name' : 'পূর্ণ নাম'}</label><input type="text" id="regName" placeholder="${lang === 'en' ? 'Your name' : 'আপনার নাম'}"></div>
            <div class="form-group"><label data-i18n="auth.phone">${lang === 'en' ? 'Phone' : 'ফোন নম্বর'}</label><input type="tel" id="regPhone" placeholder="01XXXXXXXXX"></div>
            <div class="form-group"><label data-i18n="auth.password">${lang === 'en' ? 'Password' : 'পাসওয়ার্ড'}</label><input type="password" id="regPass" placeholder="${lang === 'en' ? 'Min 6 characters' : 'কমপক্ষে ৬ অক্ষর'}"></div>
            <div style="display:flex; gap:10px;">
                <div class="form-group" style="flex:1;"><label data-i18n="auth.nid">${lang === 'en' ? 'National ID (NID)' : 'এনআইডি নাম্বার (NID)'}</label><input type="text" id="regNid" placeholder="10/13/17 Digit NID" maxlength="17"></div>
                <div class="form-group" style="flex:1;"><label data-i18n="auth.dob">${lang === 'en' ? 'Date of Birth' : 'জন্ম তারিখ'}</label><input type="date" id="regDob"></div>
            </div>
            <div style="display:flex; gap:10px;">
                <div class="form-group" style="flex:1;"><label data-i18n="auth.occ">${lang === 'en' ? 'Occupation' : 'পেশা'}</label><input type="text" id="regJob" placeholder="${lang === 'en' ? 'Your Occupation' : 'আপনার পেশা'}"></div>
                <div class="form-group" style="flex:1;"><label data-i18n="auth.address">${lang === 'en' ? 'Address' : 'ঠিকানা'}</label><input type="text" id="regAddress" placeholder="${lang === 'en' ? 'District & Area' : 'জেলা ও এলাকা'}"></div>
            </div>
            <div class="form-group"><label data-i18n="auth.role">${lang === 'en' ? 'Role' : 'ভূমিকা'}</label>
                <select id="regRole" style="background:#020a05;border:1px solid var(--glass-border);border-radius:6px;padding:10px 14px;color:var(--text-primary);font-family:'Noto Sans Bengali',sans-serif;outline:none;width:100%;">
                    <option value="সাধারণ">${lang === 'en' ? 'Citizen' : 'সাধারণ নাগরিক'}</option>
                    <option value="স্বেচ্ছাসেবক">${lang === 'en' ? 'Volunteer' : 'স্বেচ্ছাসেবক'}</option>
                    <option value="ঠিকাদার">${lang === 'en' ? 'Contractor' : 'ঠিকাদার'}</option>
                    <option value="সরকারিকর্মকর্তা">${lang === 'en' ? 'Govt. Official' : 'সরকারি কর্মকর্তা'}</option>
                </select>
            </div>
            <div style="font-size:0.7rem; color:var(--text-muted); margin-bottom:10px; line-height: 1.4;">
                ${lang === 'en' ? 'Note: Fake reports will lead to legal action after verification.' : 'নোট: কোনো ফেক রিপোর্ট করলে তথ্য যাচাই করে আইনগত ব্যবস্থা নেওয়া হবে।'}
            </div>
            <button class="submit-btn" onclick="doRegister()" data-i18n="auth.doRegister">${lang === 'en' ? 'Register' : 'একাউন্ট খুলুন'}</button>
        </div>
        <div id="resetFormModal" style="display:none;">
            <div style="font-size:0.75rem; color:var(--text-muted); margin-bottom:15px; line-height:1.5;">
                ${lang === 'en' ? 'Verify via Phone and NID to reset your password.' : 'আপনার ফোন নম্বর ও NID ব্যবহার করে পাসওয়ার্ড রিসেট করুন।'}
            </div>
            <div class="form-group"><label data-i18n="auth.phone">${lang === 'en' ? 'Phone' : 'ফোন নম্বর'}</label><input type="tel" id="resetPhone" placeholder="01XXXXXXXXX"></div>
            <div class="form-group"><label data-i18n="auth.nid">${lang === 'en' ? 'National ID (NID)' : 'এনআইডি নম্বর'}</label><input type="text" id="resetNid" placeholder="10/13/17 Digit NID" maxlength="17"></div>
            <div class="form-group"><label data-i18n="auth.newPassword">${lang === 'en' ? 'New Password' : 'নতুন পাসওয়ার্ড'}</label><input type="password" id="resetPass" placeholder="••••••"></div>
            <button class="submit-btn" onclick="doResetPassword()" data-i18n="auth.doReset">${lang === 'en' ? 'Reset Password' : 'পাসওয়ার্ড সেট করুন'}</button>
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
    document.getElementById('resetFormModal').style.display = tab === 'reset' ? 'block' : 'none';
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
            showToast('<i class="fa-solid fa-check"></i> লগইন সফল হয়েছে — ' + d.user.name);
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
    const dob = document.getElementById('regDob').value;
    const job = document.getElementById('regJob').value.trim();
    const address = document.getElementById('regAddress').value.trim();
    
    if (!name || !phone || !pass || !nid || !dob) { showToast('নাম, ফোন, পাসওয়ার্ড, NID এবং জন্ম তারিখ দিন', 'error'); return; }
    if (![10, 13, 17].includes(nid.length)) { showToast('NID অবশ্যই ১০, ১৩ বা ১৭ ডিজিটের হতে হবে', 'error'); return; }
    try {
        const d = await apiPost('/api/auth/register', { name, phone, password: pass, role, nid, dob, job, address });
        if (d.success) {
            saveAuth(d.token, d.user);
            document.getElementById('authModal').classList.remove('open');
            showToast('<i class="fa-solid fa-check"></i> একাউন্ট তৈরি সফল হয়েছে!');
            renderNavAuth();
        } else showToast(d.message || 'রেজিস্ট্রেশন ব্যর্থ', 'error');
    } catch (e) { showToast('সার্ভার সমস্যা', 'error'); }
}

async function doResetPassword() {
    const phone = document.getElementById('resetPhone').value.trim();
    const nid = document.getElementById('resetNid').value.trim();
    const newPass = document.getElementById('resetPass').value;

    if (!phone || !nid || !newPass) { showToast('সবগুলো তথ্য পূরণ করুন', 'error'); return; }
    if (![10, 13, 17].includes(nid.length)) { showToast('NID অবশ্যই ১০, ১৩ বা ১৭ ডিজিটের হতে হবে', 'error'); return; }

    try {
        const d = await apiPost('/api/auth/reset-password', { phone, nid, newPassword: newPass });
        if (d.success) {
            showToast('<i class="fa-solid fa-check"></i> পাসওয়ার্ড সফলভাবে আপডেট করা হয়েছে! লগইন করুন');
            switchAuthTab('login', document.getElementById('tabLogin'));
        } else {
            showToast(d.message || 'পাসওয়ার্ড রিসেট ব্যর্থ (তথ্য মেলেনি)', 'error');
        }
    } catch (e) { 
        showToast('UI Demo: Password reset API might not be configured, but UI is ready.', 'error');
    }
}


const _faLink = document.createElement('link');
_faLink.rel = 'stylesheet';
_faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
document.head.appendChild(_faLink);

const _globalStyle = document.createElement('style');
_globalStyle.textContent = `
@keyframes slideUp{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
@keyframes markerPulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.4);opacity:0.6;}}
@keyframes fadeIn{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
i.fa-solid, i.fa-regular { line-height: inherit; }


.lang-toggle{display:flex;align-items:center;gap:4px;padding:4px 8px;border:1px solid var(--glass-border);border-radius:20px;background:rgba(0,255,136,0.04);}
.lt-btn{background:none;border:none;color:var(--text-muted);cursor:pointer;font-size:0.7rem;font-family:'Exo 2',sans-serif;letter-spacing:1px;padding:2px 4px;border-radius:3px;transition:all 0.2s;}
.lt-btn.active{color:var(--green-neon);background:rgba(0,255,136,0.1);}
.lt-sep{color:var(--glass-border);font-size:0.7rem;}


.profile-btn{display:flex;align-items:center;gap:8px;padding:5px 12px;background:rgba(0,255,136,0.06);border:1px solid var(--glass-border);border-radius:20px;cursor:pointer;transition:all 0.25s;color:var(--text-primary);}
.profile-btn:hover{border-color:var(--green-neon);background:rgba(0,255,136,0.12);}
.profile-avatar-mini{width:26px;height:26px;border-radius:50%;background:linear-gradient(135deg,var(--green-dark),#004d38);border:1px solid var(--green-neon);display:flex;align-items:center;justify-content:center;font-size:0.9rem;overflow:hidden;flex-shrink:0;}
.profile-name-mini{font-size:0.75rem;font-family:'Noto Sans Bengali',sans-serif;color:var(--green-neon);max-width:80px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}


.profile-welcome-banner{background:rgba(0,255,136,0.06);border:1px solid rgba(0,255,136,0.2);border-radius:10px;padding:14px;text-align:center;margin-bottom:1rem;animation:fadeIn 0.5s ease;}
.profile-avatar-lg{width:80px;height:80px;border-radius:50%;background:linear-gradient(135deg,var(--green-dark),#004d38);border:2px solid var(--green-neon);display:flex;align-items:center;justify-content:center;margin:0 auto 6px;cursor:pointer;position:relative;overflow:hidden;box-shadow:var(--glow-green);transition:all 0.3s;}
.profile-avatar-lg:hover .profile-avatar-overlay{opacity:1;}
.profile-avatar-overlay{position:absolute;inset:0;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;font-size:1.5rem;opacity:0;transition:opacity 0.2s;}


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


input, select, textarea {
    background: rgba(0, 255, 136, 0.05) !important;
    border: 1px solid var(--glass-border) !important;
    color: var(--text-primary) !important;
    border-radius: 8px;
    padding: 10px;
    outline: none;
    transition: all 0.2s;
}
input:focus, select:focus, textarea:focus {
    border-color: var(--green-neon) !important;
    box-shadow: 0 0 10px rgba(0,255,136,0.2) !important;
}
input[type="date"]::-webkit-calendar-picker-indicator {
    filter: invert(1) brightness(2);
}
select option {
    background: #021008;
    color: var(--text-primary);
}
`;
document.head.appendChild(_globalStyle);