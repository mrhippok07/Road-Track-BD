const fs = require("fs");

const files = [
    "frontend/index.html",
    "frontend/pages/dashboard.html",
    "frontend/pages/report.html",
    "frontend/pages/feed.html",
    "frontend/pages/volunteer.html"
];

const mobileCSS = `
/* --- MOBILE RESPONSIVENESS FIXES --- */
@media screen and (max-width: 768px) {
    nav { padding: 0 0.5rem !important; height: auto !important; min-height: 60px; flex-wrap: wrap; }
    .nav-brand span.brand-title { display: none !important; }
    
    .nav-links { 
        width: 100%; 
        overflow-x: auto; 
        white-space: nowrap; 
        -webkit-overflow-scrolling: touch; 
        padding: 5px 0;
        scroll-behavior: smooth;
        justify-content: flex-start !important;
        gap: 5px !important;
    }
    .nav-links::-webkit-scrollbar { height: 2px; }
    .nav-links::-webkit-scrollbar-thumb { background: var(--green-neon); }
    .nav-link { padding: 4px 10px !important; font-size: 0.8rem !important; }
    
    .nav-status { margin-left: auto; margin-right: 10px; }

    .dash-wrap, .main-container { padding: 85px 1rem 2rem !important; }
    
    .kpi-grid, .charts-grid, .form-grid { 
        grid-template-columns: 1fr !important;
        gap: 10px !important;
    }
    
    .hud-panel { min-width: unset !important; padding: 12px !important; }
    #hudLeft { top: 85px !important; left: 10px !important; right: 10px !important; width: auto !important; }
    #hudRight { display: none !important; } 
    .bottom-hud { flex-direction: column !important; bottom: 20px !important; left: 10px !important; right: 10px !important; width: auto !important; align-items: stretch !important; gap: 8px !important; }
    .bottom-hud .btn { width: 100% !important; text-align: center !important; }
    
    .modal-box { width: 95% !important; padding: 1.5rem !important; margin-top: 50% !important; transform: translateY(-50%) !important; position: absolute !important; top: 0 !important; }
    .container { margin: 80px 10px 20px !important; width: auto !important; padding: 1.5rem !important; }
    .auth-bg { align-items: flex-start !important; padding-top: 20px !important; overflow-y: auto !important; }

    input, select, textarea { font-size: 16px !important; }
}
</style>
`;

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes("MOBILE RESPONSIVENESS FIXES")) {
            content = content.replace("</style>", mobileCSS);
            fs.writeFileSync(file, content);
            console.log("Fixed CSS in: " + file);
        }
    }
});