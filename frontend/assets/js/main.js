




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
    nolight: '<i class="fa-solid fa-lightbulb"></i> আলো নেই', erosion: '<i class="fa-solid fa-cloud-showers-heavy"></i> মাটি ক্ষয়',
    bridge_repair: '<i class="fa-solid fa-bridge"></i> ব্রিজ সংস্কার প্রয়োজন', bridge_new: '<i class="fa-solid fa-bridge"></i> নতুন ব্রিজ প্রয়োজন',
    road_bridge_new: '<i class="fa-solid fa-road"></i> নতুন রাস্তা ও ব্রিজ', culvert_new: '<i class="fa-solid fa-screwdriver-wrench"></i> কালভার্ট প্রয়োজন',
    culvert_repair: '<i class="fa-solid fa-screwdriver-wrench"></i> কালভার্ট সংস্কার', embankment_new: '<i class="fa-solid fa-mountain"></i> বেড়িবাঁধ প্রয়োজন',
    embankment_repair: '<i class="fa-solid fa-mountain"></i> বেড়িবাঁধ সংস্কার', canal_small: '<i class="fa-solid fa-droplet"></i> ছোট খাল খনন',
    canal_large: '<i class="fa-solid fa-droplet"></i> বড় খাল খনন', under_repair: '<i class="fa-solid fa-person-digging"></i> সংস্কার কাজ চলছে',
    tube_well_needed: '<i class="fa-solid fa-faucet"></i> নলকূপ প্রয়োজন',
    tube_well_repair: '<i class="fa-solid fa-screwdriver-wrench"></i> নলকূপ মেরামত',
    railway_repair: '<i class="fa-solid fa-train"></i> রেললাইন মেরামত',
    railway_new: '<i class="fa-solid fa-train"></i> নতুন রেললাইন',
    railway_station_new: '<i class="fa-solid fa-building-shield"></i> নতুন রেল স্টেশন',
    bus_station_repair: '<i class="fa-solid fa-bus"></i> বাস স্টেশন মেরামত',
    bus_station_new: '<i class="fa-solid fa-signs-post"></i> নতুন বাস স্টেশন',
    chor_development: '<i class="fa-solid fa-wheat-awn"></i> চর এলাকায় সংস্কার',
    opinion: '<i class="fa-regular fa-comments"></i> জনমতামত'
};

const PROBLEM_LABELS_EN = {
    broken: '<i class="fa-solid fa-road-circle-exclamation"></i> Broken Road', pothole: '<i class="fa-solid fa-road-spikes"></i> Pothole', waterlogged: '<i class="fa-solid fa-water"></i> Waterlogged',
    dangerous: '<i class="fa-solid fa-triangle-exclamation"></i> Dangerous', unpaved: '<i class="fa-solid fa-road"></i> Unpaved Road', narrow: '<i class="fa-solid fa-compress"></i> Narrow Road',
    nolight: '<i class="fa-solid fa-lightbulb"></i> No Street Light', erosion: '<i class="fa-solid fa-cloud-showers-heavy"></i> Soil Erosion',
    bridge_repair: '<i class="fa-solid fa-bridge"></i> Bridge Repair Needed', bridge_new: '<i class="fa-solid fa-bridge"></i> New Bridge Needed',
    road_bridge_new: '<i class="fa-solid fa-road"></i> New Road & Bridge', culvert_new: '<i class="fa-solid fa-screwdriver-wrench"></i> Culvert Needed',
    culvert_repair: '<i class="fa-solid fa-screwdriver-wrench"></i> Culvert Repair', embankment_new: '<i class="fa-solid fa-mountain"></i> Embankment Needed',
    embankment_repair: '<i class="fa-solid fa-mountain"></i> Embankment Repair', canal_small: '<i class="fa-solid fa-droplet"></i> Small Canal Needed',
    canal_large: '<i class="fa-solid fa-droplet"></i> Large Canal Needed', under_repair: '<i class="fa-solid fa-person-digging"></i> Repair In Progress',
    tube_well_needed: '<i class="fa-solid fa-faucet"></i> Tube Well Needed',
    tube_well_repair: '<i class="fa-solid fa-screwdriver-wrench"></i> Tube Well Repair',
    railway_repair: '<i class="fa-solid fa-train"></i> Railway Repair',
    railway_new: '<i class="fa-solid fa-train"></i> New Railway',
    railway_station_new: '<i class="fa-solid fa-building-shield"></i> New Railway Station',
    bus_station_repair: '<i class="fa-solid fa-bus"></i> Bus Repair',
    bus_station_new: '<i class="fa-solid fa-signs-post"></i> New Bus Station',
    chor_development: '<i class="fa-solid fa-wheat-awn"></i> Char Area Reform',
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
    if (r.status === 'under_repair') return '#2196f3';
    if (r.status === 'repaired') return '#00ff88';
    if (r.status === 'rejected') return '#546e7a';
    return '#ff1744'; // default to red (pending)
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
    if (typeof setupHamburgerMenu === 'function') setupHamburgerMenu();
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
            ${lang === 'en' ? `
            <div style="margin-bottom:1rem; background:rgba(0,255,136,0.05); padding:12px; border-radius:8px; border-left:4px solid var(--green-neon);">
                <strong style="color:var(--green-neon); display:block;">1. Initiative & Goal:</strong>
                This initiative has been taken for the welfare of 180 million people of Bangladesh. Please report any broken roads, potholes, waterlogging, dangerous conditions, unpaved roads, narrow streets, etc. in your area.
            </div>
            <div style="margin-bottom:1rem; background:rgba(0,255,136,0.05); padding:12px; border-radius:8px; border-left:4px solid var(--green-neon);">
                <strong style="color:var(--green-neon); display:block;">2. Problem Solving Method:</strong>
                Once a road problem is reported here, government officials can verify it and instruct contractors, or citizens can take the initiative to contact contractors to resolve the issue. Volunteers will report problems with live location markers.
            </div>
            <div style="margin-bottom:1rem; background:rgba(0,255,136,0.05); padding:12px; border-radius:8px; border-left:4px solid var(--green-neon);">
                <strong style="color:var(--green-neon); display:block;">3. User Account & Security:</strong>
                By clicking on the universal profile icon at the top, users can register an account with accurate details to work. Their information will remain completely secure.
            </div>
            <div style="margin-bottom:1rem; border:1px solid var(--red-neon); padding:10px; border-radius:8px; background:rgba(244,42,65,0.07);">
                <strong style="color:var(--red-neon);"><i class="fa-solid fa-triangle-exclamation"></i> Warning (Fake Reports):</strong> 
                No one can make fake or false reports. If anyone does so, their details will be verified and legal action will be taken.
            </div>
            ` : `
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
            `}
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
        showToast(typeof getLang === 'function' && getLang() === 'en' ? 'Password reset failed. Please try again.' : 'পাসওয়ার্ড রিসেট ব্যর্থ হয়েছে। আবার চেষ্টা করুন।', 'error');
    }
}


const _faLink = document.createElement('link');
_faLink.rel = 'stylesheet';
_faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css';
document.head.appendChild(_faLink);

const _globalStyle = document.createElement('style');
_globalStyle.textContent = `
html { scroll-behavior: smooth; }
body { animation: fadeIn 0.3s ease-in-out; }
@keyframes slideUp{from{transform:translateY(20px);opacity:0;}to{transform:translateY(0);opacity:1;}}
@keyframes markerPulse{0%,100%{transform:scale(1);opacity:1;}50%{transform:scale(1.4);opacity:0.6;}}
@keyframes fadeIn{from{opacity:0;transform:translateY(-8px);}to{opacity:1;transform:translateY(0);}}
i.fa-solid, i.fa-regular { line-height: inherit; }

#navRight .nav-status { order: 1 !important; }
#navRight .lang-toggle { order: 2 !important; }
#navRight .profile-btn { order: 3 !important; }
#navRight .hamburger-btn { order: 4 !important; }


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
.modal-close{position:absolute;top:20px;right:20px;background:none;border:1px solid var(--glass-border);border-radius:4px;color:var(--text-muted);width:28px;height:28px;cursor:pointer;font-size:0.9rem;transition:all 0.2s;display:flex;align-items:center;justify-content:center;}
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

/* Hide scrollbars globally */
* {
    scrollbar-width: none !important;
}
*::-webkit-scrollbar {
    display: none !important;
}
::-webkit-scrollbar {
    width: 0px !important;
    background: transparent !important;
    display: none !important;
}

/* Hamburger button styling */
.hamburger-btn {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 28px;
  height: 20px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  z-index: 1200;
  margin-left: 8px;
}
.hamburger-btn .bar {
  width: 100%;
  height: 2px;
  background: #00ff88;
  border-radius: 2px;
  transition: all 0.3s ease;
}
.hamburger-btn.open .bar:nth-child(1) { transform: translateY(9px) rotate(45deg); }
.hamburger-btn.open .bar:nth-child(2) { opacity: 0; }
.hamburger-btn.open .bar:nth-child(3) { transform: translateY(-9px) rotate(-45deg); }

/* Mobile drawer styling */
.mobile-drawer {
  display: none;
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(2,10,5,0.97);
  z-index: 1100;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  opacity: 0;
  transition: opacity 0.25s ease;
}
.mobile-drawer.open {
  display: flex;
  opacity: 1;
}
.mobile-drawer .drawer-link {
  width: 100%;
  padding: 20px 40px;
  font-size: 1.3rem;
  font-family: 'Noto Sans Bengali', 'Exo 2', sans-serif;
  color: rgba(180,255,210,0.7);
  text-decoration: none;
  border-bottom: 1px solid rgba(0,255,136,0.08);
  text-align: center;
  transition: all 0.2s;
  letter-spacing: 1px;
}
.mobile-drawer .drawer-link:first-child { border-top: 1px solid rgba(0,255,136,0.08); }
.mobile-drawer .drawer-link:hover,
.mobile-drawer .drawer-link.active {
  color: #00ff88;
  background: rgba(0,255,136,0.06);
  text-shadow: 0 0 15px rgba(0,255,136,0.5);
}
.mobile-drawer .drawer-link .link-icon { margin-right: 12px; font-size: 1.1rem; }

.mobile-drawer .drawer-close {
  position: absolute;
  top: 20px; right: 20px;
  background: none; border: none;
  color: rgba(0,255,136,0.6);
  font-size: 1.8rem; cursor: pointer;
  line-height: 1;
}
.mobile-drawer .drawer-close:hover { color: #00ff88; }

/* Responsive navigation rules */
@media screen and (max-width: 768px) {
  nav {
    padding: 0 1rem !important;
    height: 60px !important;
    flex-wrap: nowrap !important;
    align-items: center !important;
    justify-content: space-between !important;
  }
  nav .nav-links {
    display: none !important;
  }
  #navRight {
    display: flex !important;
    align-items: center !important;
    gap: 8px !important;
  }
  #navRight .nav-status { order: 1 !important; }
  #navRight .lang-toggle { order: 2 !important; }
  #navRight .profile-btn { order: 3 !important; }
  #navRight .hamburger-btn { order: 4 !important; }
  .hamburger-btn {
    display: flex !important;
  }
  .brand-title { font-size: 0.9rem !important; letter-spacing: 1px !important; }
  .brand-sub { display: none !important; }
  .brand-logo { height: 30px !important; }
  #whiteboxTrigger span:last-child { display: none !important; }
  #whiteboxTrigger { padding: 6px 8px !important; }
}
`;
document.head.appendChild(_globalStyle);

function setupHamburgerMenu() {
    const nav = document.querySelector('nav');
    if (!nav) return;
    
    let navRight = document.getElementById('navRight') || nav.querySelector('div[style*="display:flex"]') || nav.lastElementChild;
    if (navRight && !navRight.querySelector('.hamburger-btn')) {
        const hamburger = document.createElement('button');
        hamburger.className = 'hamburger-btn';
        hamburger.setAttribute('aria-label', 'Toggle Navigation');
        hamburger.innerHTML = `
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
        `;
        navRight.appendChild(hamburger);
    }

    if (!document.querySelector('.mobile-drawer')) {
        const drawer = document.createElement('div');
        drawer.className = 'mobile-drawer';
        
        const path = window.location.pathname;
        const isMap = path === '/' || path === '/index.html' || path === '';
        const isReport = path.includes('/report');
        const isFeed = path.includes('/feed');
        const isDash = path.includes('/dashboard');
        const isVol = path.includes('/volunteer');

        drawer.innerHTML = `
            <button class="drawer-close"><i class="fa-solid fa-xmark"></i></button>
            <a class="drawer-link ${isMap ? 'active' : ''}" href="/" data-i18n="nav.map"><i class="fa-solid fa-map link-icon"></i><span data-i18n="nav.map">ম্যাপ</span></a>
            <a class="drawer-link ${isReport ? 'active' : ''}" href="/report" data-i18n="nav.report"><i class="fa-solid fa-file-invoice link-icon"></i><span data-i18n="nav.report">রিপোর্ট</span></a>
            <a class="drawer-link ${isFeed ? 'active' : ''}" href="/feed" data-i18n="nav.feed"><i class="fa-solid fa-rss link-icon"></i><span data-i18n="nav.feed">ফিড</span></a>
            <a class="drawer-link ${isDash ? 'active' : ''}" href="/dashboard" data-i18n="nav.dashboard"><i class="fa-solid fa-chart-line link-icon"></i><span data-i18n="nav.dashboard">ড্যাশবোর্ড</span></a>
            <a class="drawer-link ${isVol ? 'active' : ''}" href="/volunteer" data-i18n="nav.volunteer"><i class="fa-solid fa-handshake link-icon"></i><span data-i18n="nav.volunteer">স্বেচ্ছাসেবক</span></a>
        `;
        document.body.appendChild(drawer);

        if (typeof applyLang === 'function') {
            applyLang();
        }
    }

    const btn = document.querySelector('.hamburger-btn');
    const drawer = document.querySelector('.mobile-drawer');
    if (btn && drawer) {
        const newBtn = btn.cloneNode(true);
        btn.parentNode.replaceChild(newBtn, btn);

        newBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            const isOpen = drawer.classList.contains('open');
            if (isOpen) {
                drawer.classList.remove('open');
                newBtn.classList.remove('open');
                document.body.style.overflow = '';
            } else {
                drawer.classList.add('open');
                newBtn.classList.add('open');
                document.body.style.overflow = 'hidden';
            }
        });

        const closeBtn = drawer.querySelector('.drawer-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                drawer.classList.remove('open');
                newBtn.classList.remove('open');
                document.body.style.overflow = '';
            });
        }

        drawer.querySelectorAll('.drawer-link').forEach(function(link) {
            link.addEventListener('click', function() {
                drawer.classList.remove('open');
                newBtn.classList.remove('open');
                document.body.style.overflow = '';
            });
        });

        drawer.addEventListener('click', function(e) {
            if (e.target === drawer) {
                drawer.classList.remove('open');
                newBtn.classList.remove('open');
                document.body.style.overflow = '';
            }
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupHamburgerMenu);
} else {
    setupHamburgerMenu();
}

window.getFuturisticIcon = function(color, problemType) {
    // ── Clean, modern map pin icon generator ──
    // Uses a simple teardrop pin with a clear white-circle center and crisp category icons.
    // Renders perfectly at 40×40px on Google Maps.

    // Inner icon SVG — drawn inside a white circle at center of pin
    let iconPath = '';

    if (problemType) {
        switch (problemType) {
            case 'broken':
                // Road with exclamation
                iconPath = `
                    <path d="M14,12 L18,12 L19,20 L13,20 Z" fill="none" stroke="${color}" stroke-width="1.3" stroke-linecap="round"/>
                    <path d="M16,13 L16,19" fill="none" stroke="${color}" stroke-width="0.9" stroke-dasharray="1.5,1.5"/>
                    <circle cx="22" cy="15" r="3.5" fill="${color}"/>
                    <path d="M22,13 L22,15.5" fill="none" stroke="#fff" stroke-width="1.2" stroke-linecap="round"/>
                    <circle cx="22" cy="17.5" r="0.6" fill="#fff"/>
                `;
                break;
            case 'pothole':
                // Road with holes
                iconPath = `
                    <path d="M14,12 L22,12 L23,20 L13,20 Z" fill="none" stroke="${color}" stroke-width="1.3"/>
                    <ellipse cx="16" cy="15" rx="1.5" ry="1" fill="${color}" opacity="0.8"/>
                    <ellipse cx="20" cy="17" rx="2" ry="1.2" fill="${color}" opacity="0.8"/>
                    <ellipse cx="17" cy="19" rx="1.2" ry="0.7" fill="${color}" opacity="0.6"/>
                `;
                break;
            case 'waterlogged':
                // Three water waves
                iconPath = `
                    <path d="M12,13 Q14,11 16,13 Q18,15 20,13 Q22,11 24,13" fill="none" stroke="${color}" stroke-width="1.3" stroke-linecap="round"/>
                    <path d="M12,16 Q14,14 16,16 Q18,18 20,16 Q22,14 24,16" fill="none" stroke="${color}" stroke-width="1.3" stroke-linecap="round"/>
                    <path d="M12,19 Q14,17 16,19 Q18,21 20,19 Q22,17 24,19" fill="none" stroke="${color}" stroke-width="1.3" stroke-linecap="round"/>
                `;
                break;
            case 'dangerous':
                // Warning triangle
                iconPath = `
                    <path d="M18,10 L25,21 L11,21 Z" fill="${color}" stroke="#fff" stroke-width="1" stroke-linejoin="round"/>
                    <path d="M18,13.5 L18,17" fill="none" stroke="#fff" stroke-width="1.3" stroke-linecap="round"/>
                    <circle cx="18" cy="19" r="0.7" fill="#fff"/>
                `;
                break;
            case 'unpaved':
                // Simple road
                iconPath = `
                    <path d="M14,11 L22,11 L24,21 L12,21 Z" fill="none" stroke="${color}" stroke-width="1.3"/>
                    <path d="M18,12 L18,20" fill="none" stroke="${color}" stroke-width="1" stroke-dasharray="2,2"/>
                `;
                break;
            case 'narrow':
                // Compress arrows
                iconPath = `
                    <path d="M11,16 L15,16" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M14,13.5 L16,16 L14,18.5" fill="none" stroke="${color}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M25,16 L21,16" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M22,13.5 L20,16 L22,18.5" fill="none" stroke="${color}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
                `;
                break;
            case 'nolight':
                // Lightbulb with slash
                iconPath = `
                    <path d="M18,10 C15.8,10 14,11.8 14,14 C14,15.5 15,16.8 15.5,17.5 L20.5,17.5 C21,16.8 22,15.5 22,14 C22,11.8 20.2,10 18,10 Z" fill="none" stroke="${color}" stroke-width="1.2"/>
                    <path d="M16,19 L20,19" fill="none" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
                    <path d="M13,20 L23,10" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                `;
                break;
            case 'erosion':
                // Cloud with rain
                iconPath = `
                    <path d="M14.5,14 C14,14 13.5,13.5 13.5,13 C13.5,12.5 14,12 14.5,12 C14.3,11.5 14.5,10.8 15.2,10.3 C15.9,9.8 16.8,9.8 17.5,10.3 C18,9.7 18.8,9.5 19.5,9.7 C20.5,10 21,10.8 21,11.5 C21.5,11.7 22,12.2 22,13 C22,13.8 21.3,14 20.5,14 Z" fill="${color}"/>
                    <path d="M15,15.5 L14,18.5 M17.5,15.5 L16.5,18.5 M20,15.5 L19,18.5" fill="none" stroke="${color}" stroke-width="1" stroke-linecap="round"/>
                `;
                break;
            case 'bridge_repair':
            case 'bridge_new':
                // Bridge arch
                iconPath = `
                    <path d="M11,18 L25,18" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M12,18 C12,14 15,12 18,12 C21,12 24,14 24,18" fill="none" stroke="${color}" stroke-width="1.3"/>
                    <path d="M14,18 L14,13" fill="none" stroke="${color}" stroke-width="1" stroke-linecap="round"/>
                    <path d="M22,18 L22,13" fill="none" stroke="${color}" stroke-width="1" stroke-linecap="round"/>
                `;
                break;
            case 'road_bridge_new':
                // Road + bridge combined
                iconPath = `
                    <path d="M12,18 C12,15 15,13.5 18,13.5 C21,13.5 24,15 24,18" fill="none" stroke="${color}" stroke-width="1.2"/>
                    <path d="M11,19 L25,19" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M15,10 L21,10 L23,18 L13,18 Z" fill="none" stroke="#fff" stroke-width="1" stroke-linecap="round"/>
                    <path d="M18,11 L18,17" fill="none" stroke="#fff" stroke-width="0.8" stroke-dasharray="1.5,1.5"/>
                `;
                break;
            case 'culvert_new':
            case 'culvert_repair':
            case 'tube_well_repair':
                // Wrench tool
                iconPath = `
                    <path d="M13,19 L18,14" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M14,14 L17,17" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M22,10 C21.3,9.3 20.2,9.3 19.5,10 L17,12.5 L19.5,15 L22,12.5 C22.7,11.8 22.7,10.7 22,10 Z" fill="${color}" stroke="#fff" stroke-width="0.8"/>
                `;
                break;
            case 'embankment_new':
            case 'embankment_repair':
                // Mountain peaks
                iconPath = `
                    <path d="M11,20 L15.5,12 L18,16 L22,10 L25,20 Z" fill="${color}" stroke="#fff" stroke-width="0.8" stroke-linejoin="round"/>
                    <path d="M20,13 L22,10 L24,13" fill="#fff" opacity="0.3"/>
                `;
                break;
            case 'canal_small':
            case 'canal_large':
                // Water droplet
                iconPath = `
                    <path d="M18,9 C15,13.5 13,16 13,18 C13,20.8 15.2,23 18,23 C20.8,23 23,20.8 23,18 C23,16 21,13.5 18,9 Z" fill="${color}" stroke="#fff" stroke-width="0.8"/>
                    <ellipse cx="16" cy="17.5" rx="1.5" ry="2" fill="#fff" opacity="0.3"/>
                `;
                break;
            case 'tube_well_needed':
                // Faucet / tap
                iconPath = `
                    <path d="M14,17 L20,17 M20,15 L20,19" fill="none" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
                    <path d="M20,15 C20,12.5 18,11 16,11 C14.5,11 13.5,12 13.5,13" fill="none" stroke="${color}" stroke-width="1.3" stroke-linecap="round"/>
                    <circle cx="13.5" cy="14.5" r="1" fill="${color}"/>
                    <path d="M17,19 L17,21" fill="none" stroke="${color}" stroke-width="1" stroke-linecap="round" stroke-dasharray="1,1"/>
                `;
                break;
            case 'railway_repair':
            case 'railway_new':
                // Train
                iconPath = `
                    <rect x="13" y="11" width="10" height="8" rx="2" fill="${color}" stroke="#fff" stroke-width="0.8"/>
                    <rect x="15" y="13" width="6" height="3" rx="0.5" fill="#021008" stroke="#fff" stroke-width="0.5"/>
                    <circle cx="15.5" cy="18" r="0.8" fill="#fff"/>
                    <circle cx="20.5" cy="18" r="0.8" fill="#fff"/>
                    <path d="M14,20 L13,21 M22,20 L23,21" fill="none" stroke="${color}" stroke-width="0.8" stroke-linecap="round"/>
                `;
                break;
            case 'railway_station_new':
                // Building with shield
                iconPath = `
                    <rect x="12" y="12" width="8" height="9" fill="none" stroke="${color}" stroke-width="1.2"/>
                    <rect x="14" y="14" width="2" height="2" fill="${color}" opacity="0.5"/>
                    <rect x="14" y="18" width="2" height="3" fill="${color}" opacity="0.5"/>
                    <path d="M20,12 L20,21 C22,20 24,18 24,16 C24,14 22,12 20,12 Z" fill="${color}" stroke="#fff" stroke-width="0.8"/>
                `;
                break;
            case 'bus_station_repair':
            case 'bus_station_new':
                // Bus
                iconPath = `
                    <rect x="13" y="11" width="10" height="8" rx="1.5" fill="${color}" stroke="#fff" stroke-width="0.8"/>
                    <rect x="14.5" y="13" width="7" height="3" rx="0.5" fill="#021008" stroke="#fff" stroke-width="0.5"/>
                    <circle cx="15.5" cy="18.5" r="1" fill="#fff"/>
                    <circle cx="20.5" cy="18.5" r="1" fill="#fff"/>
                `;
                break;
            case 'chor_development':
                // Wheat / plant
                iconPath = `
                    <path d="M18,20 L18,10" fill="none" stroke="${color}" stroke-width="1.3" stroke-linecap="round"/>
                    <path d="M18,12 L15,10 M18,12 L21,10" fill="none" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
                    <path d="M18,15 L15,13 M18,15 L21,13" fill="none" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
                    <path d="M18,18 L15,16 M18,18 L21,16" fill="none" stroke="${color}" stroke-width="1.2" stroke-linecap="round"/>
                `;
                break;
            case 'opinion':
                // Speech bubble
                iconPath = `
                    <rect x="12" y="10" width="12" height="8" rx="2" fill="none" stroke="${color}" stroke-width="1.3"/>
                    <path d="M16,18 L14,21 L18,18" fill="${color}" stroke="${color}" stroke-width="0.8" stroke-linejoin="round"/>
                    <circle cx="15.5" cy="14" r="0.8" fill="${color}"/>
                    <circle cx="18" cy="14" r="0.8" fill="${color}"/>
                    <circle cx="20.5" cy="14" r="0.8" fill="${color}"/>
                `;
                break;
            default:
                break;
        }
    }

    // Build the final SVG marker
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36 44" width="36" height="44">
  <!-- Drop shadow ellipse -->
  <ellipse cx="18" cy="42" rx="6" ry="2" fill="rgba(0,0,0,0.25)"/>
  <!-- Pin body -->
  <path d="M18 0 C8 0 0 8 0 18 C0 28 18 44 18 44 C18 44 36 28 36 18 C36 8 28 0 18 0 Z"
        fill="${color}" stroke="#ffffff" stroke-width="1.5"/>
  <!-- White inner circle -->
  <circle cx="18" cy="16" r="12" fill="#ffffff" stroke="${color}" stroke-width="0.5" opacity="0.95"/>
  <!-- Category icon -->
  ${iconPath || `<circle cx="18" cy="16" r="4" fill="${color}"/><circle cx="18" cy="16" r="1.5" fill="#fff"/>`}
</svg>`;

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
};