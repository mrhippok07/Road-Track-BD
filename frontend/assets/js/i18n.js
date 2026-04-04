/**
 * Road Track BD — Bilingual i18n System (Bengali / English)
 * Usage: t('key') returns translated string based on current language
 * Toggle: setLang('en') / setLang('bn')
 */

const RTBD_TRANSLATIONS = {
    // ── Navigation ──────────────────────────────────────────────────────────
    'nav.map':           { bn: 'ম্যাপ',          en: 'Map' },
    'nav.report':        { bn: 'রিপোর্ট',         en: 'Report' },
    'nav.feed':          { bn: 'ফিড',             en: 'Feed' },
    'nav.dashboard':     { bn: 'ড্যাশবোর্ড',     en: 'Dashboard' },
    'nav.volunteer':     { bn: 'স্বেচ্ছাসেবক',   en: 'Volunteers' },
    'nav.login':         { bn: 'প্রবেশ করুন',    en: 'Login' },
    'nav.live':          { bn: 'লাইভ',            en: 'Live' },
    'nav.logout':        { bn: 'লগআউট',           en: 'Logout' },
    'nav.profile':       { bn: 'প্রোফাইল',        en: 'Profile' },

    // ── Auth Modal ───────────────────────────────────────────────────────────
    'auth.title':        { bn: '🔐 অ্যাকাউন্টে প্রবেশ', en: '🔐 Account Access' },
    'auth.login':        { bn: 'লগইন',             en: 'Login' },
    'auth.register':     { bn: 'নতুন অ্যাকাউন্ট', en: 'New Account' },
    'auth.phone':        { bn: 'ফোন নম্বর',        en: 'Phone Number' },
    'auth.password':     { bn: 'পাসওয়ার্ড',       en: 'Password' },
    'auth.doLogin':      { bn: 'লগইন করুন',       en: 'Sign In' },
    'auth.name':         { bn: 'পূর্ণ নাম',        en: 'Full Name' },
    'auth.role':         { bn: 'ভূমিকা',           en: 'Role' },
    'auth.doRegister':   { bn: 'নিবন্ধন করুন',    en: 'Register' },
    'auth.minPass':      { bn: 'কমপক্ষে ৬ অক্ষর', en: 'Min 6 characters' },
    'auth.role.vol':     { bn: 'স্বেচ্ছাসেবক',   en: 'Volunteer' },
    'auth.role.con':     { bn: 'ঠিকাদার',          en: 'Contractor' },
    'auth.role.gov':     { bn: 'সরকারি কর্মকর্তা', en: 'Govt. Official' },
    'auth.nid':          { bn: 'জাতীয় পরিচয়পত্র (NID)', en: 'National ID (NID)' },
    'auth.nid_pl':       { bn: 'NID নম্বর', en: 'NID Number' },
    'auth.occ':          { bn: 'পেশা', en: 'Occupation' },
    'auth.occ_pl':       { bn: 'আপনার পেশা', en: 'Your Occupation' },
    'auth.address':      { bn: 'ঠিকানা (জেলা ও এলাকা)', en: 'Address (District & Area)' },

    // ── Profile Modal ────────────────────────────────────────────────────────
    'profile.title':     { bn: '👤 আমার প্রোফাইল', en: '👤 My Profile' },
    'profile.name':      { bn: 'আপনার নাম',         en: 'Your Name' },
    'profile.save':      { bn: 'সংরক্ষণ করুন',     en: 'Save' },
    'profile.reports':   { bn: 'রিপোর্ট সংখ্যা',   en: 'Reports' },
    'profile.changeAvatar': { bn: 'ছবি পরিবর্তন',    en: 'Change Avatar' },
    'profile.welcome':   { bn: '🎉 স্বাগতম! আপনার অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে।', en: '🎉 Welcome! Your account has been created successfully.' },
    'profile.congrats':  { bn: 'ধন্যবাদ Road Track BD পরিবারে যোগ দেওয়ার জন্য!', en: 'Thank you for joining the Road Track BD family!' },
    'profile.settings':  { bn: 'সেটিংস', en: 'Settings' },
    'profile.myReports': { bn: 'আমার রিপোর্ট', en: 'My Reports' },
    'profile.delPost':   { bn: 'রিপোর্ট মুছুন', en: 'Delete Report' },
    'profile.delConf':   { bn: 'আপনি কি নিশ্চিত?', en: 'Are you sure?' },
    'profile.delProf':   { bn: '🚨 প্রোফাইল মুছুন', en: '🚨 Delete Profile' },
    'profile.logout':    { bn: 'লগআউট করুন', en: 'Log Out' },
    'profile.mydata':    { bn: 'প্রোফাইল তথ্য', en: 'My Data' },

    // ── Report Page ──────────────────────────────────────────────────────────
    'report.title':      { bn: '📍 রাস্তার সমস্যা রিপোর্ট করুন', en: '📍 Report a Road Problem' },
    'report.subtitle':   { bn: 'আপনার একটি রিপোর্ট অনেক বড় দুর্ঘটনা রুখে দিতে পারে।', en: 'Your one report can prevent major accidents.' },
    'report.typeLabel':  { bn: '▸ সমস্যার ধরন নির্বাচন করুন', en: '▸ Select Problem Type' },
    'report.statusLabel':{ bn: '▸ অবস্থা নির্বাচন করুন', en: '▸ Select Status' },
    'report.roadInfo':   { bn: '▸ রাস্তার তথ্য', en: '▸ Road Information' },
    'report.locPhoto':   { bn: '▸ লোকেশন ও ছবি', en: '▸ Location & Photo' },
    'report.roadName':   { bn: 'রাস্তার নাম *', en: 'Road Name *' },
    'report.roadNum':    { bn: 'রোড নম্বর', en: 'Road Number' },
    'report.district':   { bn: 'জেলা *', en: 'District *' },
    'report.area':       { bn: 'উপজেলা / এলাকা *', en: 'Upazila / Area *' },
    'report.desc':       { bn: 'বিস্তারিত বিবরণ', en: 'Details / Description' },
    'report.gps':        { bn: '📍 GPS থেকে লোকেশন নিন', en: '📍 Get GPS Location' },
    'report.gpsOk':      { bn: '✅ লোকেশন পাওয়া গেছে', en: '✅ Location captured' },
    'report.photo':      { bn: 'ছবি আপলোড (সর্বোচ্চ ৩টি)', en: 'Upload Photos (max 3)' },
    'report.clickPhoto': { bn: 'ছবি আপলোড করতে ক্লিক করুন', en: 'Click to upload photo' },
    'report.yourName':   { bn: 'আপনার নাম (ঐচ্ছিক)', en: 'Your Name (optional)' },
    'report.mobile':     { bn: 'মোবাইল (ঐচ্ছিক)', en: 'Mobile (optional)' },
    'report.submit':     { bn: '📤 রিপোর্ট জমা দিন', en: '📤 Submit Report' },
    'report.submitting': { bn: 'জমা হচ্ছে...', en: 'Submitting...' },

    // ── Status Labels ────────────────────────────────────────────────────────
    'status.pending':      { bn: 'মেরামত বাকি', en: 'Pending Repair' },
    'status.under_repair': { bn: 'সংস্কার চলছে', en: 'Under Repair' },
    'status.repaired':     { bn: 'সংস্কার সম্পন্ন', en: 'Repaired' },
    'status.rejected':     { bn: 'বাতিল', en: 'Rejected' },
    'status.pending.dot':  { bn: 'মেরামত বাকি (লাল ডট)', en: 'Pending (red dot)' },
    'status.repair.dot':   { bn: 'সংস্কার চলছে (নীল ডট)', en: 'Under Repair (blue dot)' },
    'status.done.dot':     { bn: 'সংস্কার সম্পন্ন হয়েছে (সবুজ ডট)', en: 'Repaired (green dot)' },
    'status.reject.dot':   { bn: 'বাতিল', en: 'Rejected' },

    // ── Problem Type Labels ──────────────────────────────────────────────────
    'type.broken':             { bn: '🚧 ভাঙা রাস্তা', en: '🚧 Broken Road' },
    'type.pothole':            { bn: '🕳️ বড় গর্ত', en: '🕳️ Pothole' },
    'type.waterlogged':        { bn: '🌊 পানি জমা', en: '🌊 Waterlogged' },
    'type.dangerous':          { bn: '⚠️ ঝুঁকিপূর্ণ', en: '⚠️ Dangerous Road' },
    'type.unpaved':            { bn: '🪨 কাঁচা রাস্তা', en: '🪨 Unpaved Road' },
    'type.narrow':             { bn: '↔️ সংকীর্ণ রাস্তা', en: '↔️ Narrow Road' },
    'type.nolight':            { bn: '🔦 আলো নেই', en: '🔦 No Street Light' },
    'type.erosion':            { bn: '🌧️ মাটি ক্ষয়', en: '🌧️ Soil Erosion' },
    'type.bridge_repair':      { bn: '🌉 ব্রিজ সংস্কার প্রয়োজন', en: '🌉 Bridge Repair Needed' },
    'type.bridge_new':         { bn: '🌉 নতুন ব্রিজ প্রয়োজন', en: '🌉 New Bridge Needed' },
    'type.road_bridge_new':    { bn: '🛣️ নতুন রাস্তা ও ব্রিজ', en: '🛣️ New Road & Bridge' },
    'type.culvert_new':        { bn: '🔧 কালভার্ট প্রয়োজন', en: '🔧 Culvert Needed' },
    'type.culvert_repair':     { bn: '🔧 কালভার্ট সংস্কার', en: '🔧 Culvert Repair' },
    'type.embankment_new':     { bn: '🏞️ বেড়িবাঁধ প্রয়োজন', en: '🏞️ Embankment Needed' },
    'type.embankment_repair':  { bn: '🏞️ বেড়িবাঁধ সংস্কার', en: '🏞️ Embankment Repair' },
    'type.canal_small':        { bn: '💧 ছোট খাল খনন', en: '💧 Small Canal Needed' },
    'type.canal_large':        { bn: '💧 বড় খাল খনন', en: '💧 Large Canal Needed' },
    'type.under_repair':       { bn: 'সংস্কার কাজ চলছে', en: 'Repair In Progress' },
    'type.tube_well_needed':   { bn: '🚰 নলকূপ প্রয়োজন', en: '🚰 Tube Well Needed' },
    'type.tube_well_repair':   { bn: '🔧 নলকূপ মেরামত', en: '🔧 Tube Well Repair' },

    // ── Feed Page ────────────────────────────────────────────────────────────
    'feed.title':        { bn: '📰 লাইভ রিপোর্ট ফিড', en: '📰 Live Report Feed' },
    'feed.newReport':    { bn: '➕ নতুন রিপোর্ট', en: '➕ New Report' },
    'feed.all':          { bn: 'সব', en: 'All' },
    'feed.pending':      { bn: 'মেরামত বাকি', en: 'Pending' },
    'feed.repair':       { bn: 'সংস্কার চলছে', en: 'Under Repair' },
    'feed.repaired':     { bn: 'সংস্কার সম্পন্ন', en: 'Repaired' },
    'feed.bridge':       { bn: 'ব্রিজ', en: 'Bridge' },
    'feed.canal':        { bn: 'খাল', en: 'Canal' },
    'feed.tubewell':     { bn: 'নলকূপ', en: 'Tube Well' },
    'feed.loadMore':     { bn: 'আরও দেখুন ↓', en: 'Load More ↓' },
    'feed.noReport':     { bn: 'কোনো রিপোর্ট নেই', en: 'No reports found' },
    'feed.loading':      { bn: 'লোড হচ্ছে...', en: 'Loading...' },
    'feed.comment':      { bn: 'মন্তব্য করুন...', en: 'Write a comment...' },
    'feed.send':         { bn: 'পাঠান', en: 'Send' },
    'feed.update':       { bn: '🔄 অবস্থা আপডেট', en: '🔄 Update Status' },
    'feed.doUpdate':     { bn: '✅ আপডেট করুন', en: '✅ Update' },
    'feed.share':        { bn: '🔗 শেয়ার', en: '🔗 Share' },
    'feed.noComment':    { bn: 'কোনো মন্তব্য নেই', en: 'No comments yet' },

    // ── Dashboard ────────────────────────────────────────────────────────────
    'dash.title':        { bn: '⚡ কেন্দ্রীয় বিশ্লেষণ ড্যাশবোর্ড', en: '⚡ Central Analytics Dashboard' },
    'dash.subtitle':     { bn: 'বাংলাদেশের সড়ক অবস্থার রিয়েল-টাইম পরিসংখ্যান', en: 'Real-time road condition statistics for Bangladesh' },
    'dash.total':        { bn: 'মোট রিপোর্ট', en: 'Total Reports' },
    'dash.pending':      { bn: 'মেরামত বাকি', en: 'Pending Repair' },
    'dash.today':        { bn: 'আজকের রিপোর্ট', en: "Today's Reports" },
    'dash.resolved':     { bn: 'সম্পন্ন মেরামত', en: 'Resolved' },
    'dash.underRepair':  { bn: 'সংস্কার চলছে', en: 'Under Repair' },
    'dash.activeUsers':  { bn: 'সক্রিয় ব্যবহারকারী', en: 'Active Users' },
    'dash.online':       { bn: 'অনলাইন', en: 'Online' },

    // ── Map / Home Page ──────────────────────────────────────────────────────
    'map.liveLabel':     { bn: 'LIVE SATELLITE MAP — BANGLADESH', en: 'LIVE SATELLITE MAP — BANGLADESH' },
    'map.totalRep':      { bn: 'মোট রিপোর্ট', en: 'Total Reports' },
    'map.todayRep':      { bn: 'আজকের রিপোর্ট', en: "Today's Reports" },
    'map.pendingRep':    { bn: 'মেরামত বাকি', en: 'Pending Repair' },
    'map.resolved':      { bn: 'সম্পন্ন মেরামত', en: 'Resolved' },
    'map.allTypes':      { bn: 'সব ধরন', en: 'All Types' },
    'map.myLocation':    { bn: '📍 আমার অবস্থান', en: '📍 My Location' },
    'map.reportBtn':     { bn: '➕ রাস্তার সমস্যা রিপোর্ট করুন', en: '➕ Report a Road Problem' },
    'map.dashBtn':       { bn: '📊 ড্যাশবোর্ড দেখুন', en: '📊 View Dashboard' },
    'map.feedBtn':       { bn: '📰 ফিড দেখুন', en: '📰 View Feed' },
    'map.recentReports': { bn: 'সাম্প্রতিক রিপোর্ট সমূহ', en: 'Recent Reports' },
    'map.seeAll':        { bn: 'সব রিপোর্ট দেখুন →', en: 'View All Reports →' },
    'map.volunteerDir':  { bn: 'স্বেচ্ছাসেবক ও ঠিকাদার ডিরেক্টরি', en: 'Volunteer & Contractor Directory' },
    'map.seeVol':        { bn: 'সব স্বেচ্ছাসেবক দেখুন →', en: 'View All Volunteers →' },
    'map.noReports':     { bn: 'এখনো কোনো রিপোর্ট নেই', en: 'No reports yet' },
    'map.youAreHere':    { bn: '📍 আপনি এখানে আছেন', en: '📍 You are here' },

    // ── Volunteer Page ───────────────────────────────────────────────────────
    'vol.title':         { bn: '🤝 স্বেচ্ছাসেবক ও ঠিকাদার', en: '🤝 Volunteers & Contractors' },
    'vol.contact':       { bn: 'যোগাযোগ করুন', en: 'Contact' },
    'vol.noData':        { bn: 'কোনো স্বেচ্ছাসেবক তথ্য নেই', en: 'No volunteers found' },
    'vol.join':          { bn: '➕ স্বেচ্ছাসেবক হিসেবে যোগ দিন', en: '➕ Join as Volunteer' },

    // ── General UI ───────────────────────────────────────────────────────────
    'ui.loading':        { bn: 'লোড হচ্ছে...', en: 'Loading...' },
    'ui.sysOnline':      { bn: 'SYS: ONLINE', en: 'SYS: ONLINE' },
    'ui.close':          { bn: '✕ বন্ধ করুন', en: '✕ Close' },
    'ui.copy':           { bn: '📋 কপি করুন', en: '📋 Copy Link' },
    'ui.shareTitle':     { bn: '🔗 শেয়ার করুন', en: '🔗 Share' },
    'ui.noComments':     { bn: 'কোনো মন্তব্য নেই', en: 'No comments yet' },
};

// ─── Core Functions ────────────────────────────────────────────────────────────

/** Get the current active language */
function getLang() {
    return localStorage.getItem('rtbd_lang') || 'bn';
}

/** Set language and refresh all translated elements */
function setLang(lang) {
    localStorage.setItem('rtbd_lang', lang);
    applyLang();
    // Update toggle button states
    document.querySelectorAll('.lang-toggle .lt-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

/** Translate a key */
function t(key) {
    const lang = getLang();
    const entry = RTBD_TRANSLATIONS[key];
    if (!entry) return key;
    return entry[lang] || entry['bn'] || key;
}

/** Apply all translations to [data-i18n] elements */
function applyLang() {
    const lang = getLang();
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        const entry = RTBD_TRANSLATIONS[key];
        if (!entry) return;
        const val = entry[lang] || entry['bn'] || key;
        // Preserve child elements if element has children
        if (el.children.length === 0) {
            el.textContent = val;
        } else {
            // Only update text nodes
            el.childNodes.forEach(node => {
                if (node.nodeType === 3) node.textContent = val;
            });
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.dataset.i18nPlaceholder;
        const entry = RTBD_TRANSLATIONS[key];
        if (entry) el.placeholder = entry[lang] || entry['bn'] || key;
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.dataset.i18nTitle;
        const entry = RTBD_TRANSLATIONS[key];
        if (entry) el.title = entry[lang] || entry['bn'] || key;
    });
}

/** Inject the language toggle widget into a nav element */
function injectLangToggle(navSelector) {
    const nav = document.querySelector(navSelector || 'nav');
    if (!nav || nav.querySelector('.lang-toggle')) return;
    const toggle = document.createElement('div');
    toggle.className = 'lang-toggle';
    const lang = getLang();
    toggle.innerHTML = `
        <button class="lt-btn ${lang === 'bn' ? 'active' : ''}" data-lang="bn" onclick="setLang('bn')">বাং</button>
        <span class="lt-sep">|</span>
        <button class="lt-btn ${lang === 'en' ? 'active' : ''}" data-lang="en" onclick="setLang('en')">EN</button>
    `;
    // Insert before the last child (usually auth button group)
    nav.appendChild(toggle);
}

// ─── Apply on load ─────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(applyLang, 10);
});
