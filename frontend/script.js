// ============================================================
// FOUNDERFLOW
// Production Frontend Controller
// ============================================================

"use strict";

const API_URL = "http://127.0.0.1:8000";


// ============================================================
// DOM
// ============================================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);


// ============================================================
// ELEMENTS
// ============================================================

const sidebar = $("#sidebar");
const mobileOverlay = $("#mobileOverlay");
const openSidebar = $("#openSidebar");
const closeSidebar = $("#closeSidebar");

const apiStatus = $("#apiStatus");
const pageTitle = $("#pageTitle");

const dashboardStatus = $("#dashboardStatus");

const predictionForm = $("#predictionForm");
const resultPanel = $("#resultPanel");

const formCount = $("#formCount");

const importanceList = $("#importanceList");
const dashboardImportance = $("#dashboardImportance");
const predictionImportance = $("#predictionImportance");

const toast = $("#toast");
const toastIcon = $("#toastIcon");
const toastMessage = $("#toastMessage");


// ============================================================
// SECTION TITLES
// ============================================================

const sectionTitles = {
    dashboard: "Overview",
    prediction: "New Prediction",
    importance: "Feature Importance",
    model: "Model Details"
};


// ============================================================
// NAVIGATION
// ============================================================

function showSection(sectionId) {

    const sections = $$(".page-section");
    const links = $$(".nav-link");

    sections.forEach(section => {
        section.classList.remove("active");
    });

    links.forEach(link => {
        link.classList.remove("active");
    });

    const target = document.getElementById(sectionId);

    if (target) {
        target.classList.add("active");
    }

    const activeLink =
        document.querySelector(
            `.nav-link[data-section="${sectionId}"]`
        );

    if (activeLink) {
        activeLink.classList.add("active");
    }

    if (pageTitle) {
        pageTitle.textContent =
            sectionTitles[sectionId] || "FounderFlow";
    }

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });

    closeMobileSidebar();
}


// Navigation buttons
$$("[data-go]").forEach(button => {

    button.addEventListener("click", () => {

        const section =
            button.getAttribute("data-go");

        if (section) {
            showSection(section);
        }

    });

});


// Sidebar navigation
$$(".nav-link[data-section]").forEach(link => {

    link.addEventListener("click", () => {

        showSection(
            link.getAttribute("data-section")
        );

    });

});


// ============================================================
// MOBILE SIDEBAR
// ============================================================

function openMobileSidebar() {

    if (sidebar) {
        sidebar.classList.add("open");
    }

    if (mobileOverlay) {
        mobileOverlay.style.display = "block";
    }
}


function closeMobileSidebar() {

    if (sidebar) {
        sidebar.classList.remove("open");
    }

    if (mobileOverlay) {
        mobileOverlay.style.display = "none";
    }
}


if (openSidebar) {
    openSidebar.addEventListener(
        "click",
        openMobileSidebar
    );
}

if (closeSidebar) {
    closeSidebar.addEventListener(
        "click",
        closeMobileSidebar
    );
}

if (mobileOverlay) {
    mobileOverlay.addEventListener(
        "click",
        closeMobileSidebar
    );
}


// ============================================================
// TOAST
// ============================================================

let toastTimer = null;

function showToast(message, type = "success") {

    if (!toast || !toastMessage) {
        return;
    }

    toastMessage.textContent = message;

    if (toastIcon) {
        toastIcon.textContent =
            type === "error" ? "!" : "✓";

        toastIcon.style.color =
            type === "error"
                ? "var(--red)"
                : "var(--green)";
    }

    toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
        toast.classList.remove("show");
    }, 3500);
}


// ============================================================
// API STATUS
// ============================================================

async function checkAPI() {

    if (!apiStatus) {
        return false;
    }

    const indicator =
        apiStatus.querySelector(
            ".status-indicator"
        );

    const text =
        apiStatus.querySelector(
            "span:last-child"
        );

    try {

        if (indicator) {
            indicator.className =
                "status-indicator checking";
        }

        if (text) {
            text.textContent =
                "Checking API";
        }

        const response = await fetch(
            `${API_URL}/health`,
            {
                method: "GET",
                cache: "no-store"
            }
        );

        if (!response.ok) {
            throw new Error("API offline");
        }

        if (indicator) {
            indicator.className =
                "status-indicator online";
        }

        if (text) {
            text.textContent =
                "API Connected";
        }

        if (dashboardStatus) {
            dashboardStatus.textContent =
                "Online";
        }

        return true;

    } catch (error) {

        console.error(
            "FounderFlow API:",
            error
        );

        if (indicator) {
            indicator.className =
                "status-indicator offline";
        }

        if (text) {
            text.textContent =
                "API Offline";
        }

        if (dashboardStatus) {
            dashboardStatus.textContent =
                "Offline";
        }

        return false;
    }
}


// ============================================================
// FORM COUNT
// ============================================================

const formInputs =
    predictionForm
        ? predictionForm.querySelectorAll(
            "input"
        )
        : [];


function updateFormCount() {

    if (!formCount) {
        return;
    }

    let filled = 0;

    formInputs.forEach(input => {

        if (
            input.value !== "" &&
            Number.isFinite(Number(input.value))
        ) {
            filled++;
        }

    });

    formCount.textContent = filled;
}


formInputs.forEach(input => {

    input.addEventListener(
        "input",
        updateFormCount
    );

});


// ============================================================
// GET STARTUP DATA
// ============================================================

function getStartupData() {

    return {

        founded_year:
            Number($("#founded_year")?.value),

        country:
            Number($("#country")?.value),

        region:
            Number($("#region")?.value),

        industry:
            Number($("#industry")?.value),

        funding_round:
            Number($("#funding_round")?.value),

        funding_amount_usd:
            Number($("#funding_amount_usd")?.value),

        lead_investor:
            Number($("#lead_investor")?.value),

        co_investors:
            Number($("#co_investors")?.value),

        employee_count:
            Number($("#employee_count")?.value),

        estimated_revenue_usd:
            Number($("#estimated_revenue_usd")?.value),

        estimated_valuation_usd:
            Number($("#estimated_valuation_usd")?.value),

        exit_type:
            Number($("#exit_type")?.value),

        tags:
            Number($("#tags")?.value),

        funding_year:
            Number($("#funding_year")?.value),

        funding_month:
            Number($("#funding_month")?.value)
    };
}


// ============================================================
// VALIDATION
// ============================================================

function validateStartupData(data) {

    for (const [key, value] of Object.entries(data)) {

        if (!Number.isFinite(value)) {

            throw new Error(
                `Please enter a valid value for ${key}.`
            );
        }
    }

    if (
        data.funding_month < 1 ||
        data.funding_month > 12
    ) {

        throw new Error(
            "Funding month must be between 1 and 12."
        );
    }

    if (
        data.founded_year < 1800 ||
        data.founded_year > 2100
    ) {

        throw new Error(
            "Please enter a valid founded year."
        );
    }

    if (
        data.funding_year < 1800 ||
        data.funding_year > 2100
    ) {

        throw new Error(
            "Please enter a valid funding year."
        );
    }
}


// ============================================================
// PREDICTION
// ============================================================

if (predictionForm) {

    predictionForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            const button =
                $("#predictButton");

            const originalHTML =
                button
                    ? button.innerHTML
                    : "";

            try {

                const data =
                    getStartupData();

                validateStartupData(data);


                // Button loading state
                if (button) {

                    button.disabled = true;

                    button.innerHTML = `
                        <span class="button-icon">
                            ◌
                        </span>
                        Analyzing...
                        <span>→</span>
                    `;
                }


                // Make sure API exists
                const apiOnline =
                    await checkAPI();

                if (!apiOnline) {

                    throw new Error(
                        "FounderFlow API is offline. Start FastAPI on port 8000."
                    );
                }


                // Small cinematic delay
                await delay(450);


                const response =
                    await fetch(
                        `${API_URL}/predict`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );


                let result;

                try {
                    result =
                        await response.json();
                } catch {
                    throw new Error(
                        "Invalid response from API."
                    );
                }


                if (!response.ok) {

                    throw new Error(
                        result.detail
                            ? JSON.stringify(
                                result.detail
                            )
                            : "Prediction request failed."
                    );
                }


                renderPrediction(result);

                showToast(
                    "Prediction generated successfully."
                );

            } catch (error) {

                console.error(
                    "Prediction error:",
                    error
                );

                showToast(
                    error.message ||
                    "Unable to generate prediction.",
                    "error"
                );

            } finally {

                if (button) {

                    button.disabled = false;

                    button.innerHTML =
                        originalHTML;
                }
            }

        }
    );
}


// ============================================================
// RENDER PREDICTION
// ============================================================

function renderPrediction(result) {

    if (!resultPanel) {
        return;
    }


    const prediction =
        Number(result.prediction);

    const exitedProbability =
        Number(result.probability_exited);

    const notExitedProbability =
        Number(result.probability_not_exited);


    const exitedPercent =
        exitedProbability * 100;

    const notExitedPercent =
        notExitedProbability * 100;


    // Highest probability = confidence
    const confidence =
        Math.max(
            exitedProbability,
            notExitedProbability
        );

    const confidencePercent =
        confidence * 100;


    const isExited =
        prediction === 1;


    resultPanel.innerHTML = `

        <div class="result-success">

            <div class="result-success-header">

                <div>

                    <div class="result-status-label">
                        PREDICTION RESULT
                    </div>

                    <div class="result-status">
                        ${escapeHTML(
                            result.status ||
                            (isExited
                                ? "Exited"
                                : "Not Exited")
                        )}
                    </div>

                </div>

                <div
                    class="result-badge ${isExited ? "danger" : ""}"
                >
                    ${isExited
                        ? "EXIT PREDICTED"
                        : "NO EXIT PREDICTED"}
                </div>

            </div>


            <div
                class="confidence-ring"
                style="--confidence: 0%"
            >

                <div class="confidence-content">

                    <div class="confidence-number">
                        0.0%
                    </div>

                    <div class="confidence-label">
                        Confidence
                    </div>

                </div>

            </div>


            <div class="probability-grid">

                <div
                    class="probability-card ${
                        !isExited ? "active" : ""
                    }"
                >

                    <div class="probability-label">
                        NOT EXITED
                    </div>

                    <div
                        class="probability-value"
                        id="resultNotExited"
                    >
                        0.0%
                    </div>

                </div>


                <div
                    class="probability-card ${
                        isExited ? "active" : ""
                    }"
                >

                    <div class="probability-label">
                        EXITED
                    </div>

                    <div
                        class="probability-value"
                        id="resultExited"
                    >
                        0.0%
                    </div>

                </div>

            </div>

        </div>
    `;


    // Animate result
    requestAnimationFrame(() => {

        const ring =
            resultPanel.querySelector(
                ".confidence-ring"
            );

        if (ring) {

            setTimeout(() => {

                ring.style.transition =
                    "background 1.2s ease";

                ring.style.setProperty(
                    "--confidence",
                    `${confidencePercent}%`
                );

            }, 100);
        }


        animateNumber(
            resultPanel.querySelector(
                ".confidence-number"
            ),
            confidencePercent,
            1000
        );


        animateNumber(
            $("#resultNotExited"),
            notExitedPercent,
            1100
        );


        animateNumber(
            $("#resultExited"),
            exitedPercent,
            1200
        );

    });


    // Smooth reveal
    resultPanel.style.animation =
        "none";

    void resultPanel.offsetWidth;

    resultPanel.style.animation =
        "fadeInUp .6s ease both";
}


// ============================================================
// NUMBER ANIMATION
// ============================================================

function animateNumber(
    element,
    target,
    duration
) {

    if (!element) {
        return;
    }

    const start =
        performance.now();


    function frame(now) {

        const elapsed =
            now - start;

        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        const eased =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const value =
            target * eased;


        element.textContent =
            `${value.toFixed(1)}%`;


        if (progress < 1) {

            requestAnimationFrame(frame);

        } else {

            element.textContent =
                `${target.toFixed(1)}%`;
        }
    }


    requestAnimationFrame(frame);
}


// ============================================================
// FEATURE IMPORTANCE
// ============================================================

const LOCAL_FEATURE_IMPORTANCE = [
    { feature: "exit_type", importance: 0.487240635135 },
    { feature: "estimated_valuation_usd", importance: 0.050770391805 },
    { feature: "estimated_revenue_usd", importance: 0.050671486549 },
    { feature: "tags", importance: 0.050507115602 },
    { feature: "funding_amount_usd", importance: 0.050111598084 },
    { feature: "employee_count", importance: 0.050100828080 },
    { feature: "country", importance: 0.048130314325 },
    { feature: "co_investors", importance: 0.042719777068 },
    { feature: "founded_year", importance: 0.032090010083 },
    { feature: "funding_month", importance: 0.027220092099 },
    { feature: "funding_year", importance: 0.026691491492 },
    { feature: "industry", importance: 0.021724425443 },
    { feature: "funding_round", importance: 0.020893687858 },
    { feature: "region", importance: 0.020678397883 },
    { feature: "lead_investor", importance: 0.020449748495 }
];

async function loadFeatureImportance() {

    let features = null;

    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), 3500);

        const response = await fetch(
            `${API_URL}/feature-importance`,
            {
                method: "GET",
                cache: "no-store",
                signal: controller.signal
            }
        );

        clearTimeout(timer);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();
        features = normalizeFeatureImportance(data);

        if (!features.length) {
            throw new Error("No feature importance data returned.");
        }

    } catch (error) {
        console.warn("Feature importance API unavailable; using local model snapshot.", error);
        features = LOCAL_FEATURE_IMPORTANCE.slice();
    }

    renderMainImportance(features);
    renderMiniImportance(features.slice(0, 5), dashboardImportance);
    renderMiniImportance(features.slice(0, 5), predictionImportance);
}

function normalizeFeatureImportance(data) {
    let raw = [];

    if (Array.isArray(data)) {
        raw = data;
    } else if (data && Array.isArray(data.features)) {
        raw = data.features;
    } else if (data && Array.isArray(data.feature_importance)) {
        raw = data.feature_importance;
    } else if (data && data.feature_importance && typeof data.feature_importance === "object") {
        raw = Object.entries(data.feature_importance).map(([feature, importance]) => ({ feature, importance }));
    } else if (data && data.importance && typeof data.importance === "object") {
        raw = Object.entries(data.importance).map(([feature, importance]) => ({ feature, importance }));
    }

    return raw
        .map(item => ({
            feature: item?.feature ?? item?.name ?? item?.key,
            importance: Number(item?.importance ?? item?.value ?? item?.score)
        }))
        .filter(item => item.feature && Number.isFinite(item.importance))
        .sort((a, b) => b.importance - a.importance);
}


// ============================================================
// MAIN IMPORTANCE TABLE
// ============================================================

function renderMainImportance(features) {

    if (!importanceList) {
        return;
    }


    importanceList.innerHTML = "";


    const max =
        Math.max(
            ...features.map(
                item => Number(item.importance) || 0
            )
        );


    features.forEach((item, index) => {

        const importance =
            Number(item.importance) || 0;


        const width =
            max > 0
                ? (importance / max) * 100
                : 0;


        const row =
            document.createElement("div");


        row.className =
            "importance-row";


        row.style.opacity = "0";
        row.style.transform =
            "translateY(12px)";


        row.innerHTML = `

            <div class="importance-rank">
                ${String(index + 1).padStart(2, "0")}
            </div>

            <div class="importance-feature">
                ${escapeHTML(
                    formatFeature(item.feature)
                )}
            </div>

            <div class="importance-value">
                ${importance.toFixed(4)}
            </div>

            <div class="importance-progress">

                <span
                    style="width:0%"
                ></span>

            </div>
        `;


        importanceList.appendChild(row);


        setTimeout(() => {

            row.style.transition =
                "opacity .45s ease, transform .45s ease";

            row.style.opacity = "1";

            row.style.transform =
                "translateY(0)";


            const bar =
                row.querySelector(
                    ".importance-progress span"
                );


            if (bar) {

                setTimeout(() => {

                    bar.style.transition =
                        "width .8s cubic-bezier(.16,1,.3,1)";

                    bar.style.width =
                        `${width}%`;

                }, 100);
            }

        }, index * 55);

    });
}


// ============================================================
// MINI IMPORTANCE
// ============================================================

function renderMiniImportance(
    features,
    container
) {

    if (!container) {
        return;
    }


    container.innerHTML = "";


    const max =
        Math.max(
            ...features.map(
                item => Number(item.importance) || 0
            )
        );


    features.forEach((item, index) => {

        const importance =
            Number(item.importance) || 0;


        const width =
            max > 0
                ? (importance / max) * 100
                : 0;


        const row =
            document.createElement("div");


        row.className =
            "mini-row";


        row.innerHTML = `

            <div class="mini-top">

                <span>
                    ${escapeHTML(
                        formatFeature(item.feature)
                    )}
                </span>

                <span>
                    ${importance.toFixed(4)}
                </span>

            </div>

            <div class="bar-track">

                <div
                    class="bar-fill"
                    style="
                        width:0%;
                        animation-delay:${index * 80}ms;
                    "
                ></div>

            </div>
        `;


        container.appendChild(row);


        setTimeout(() => {

            const bar =
                row.querySelector(
                    ".bar-fill"
                );

            if (bar) {

                bar.style.transition =
                    "width .8s cubic-bezier(.16,1,.3,1)";

                bar.style.width =
                    `${width}%`;
            }

        }, 150 + index * 100);

    });
}


// ============================================================
// FORMAT FEATURE NAME
// ============================================================

function formatFeature(name) {

    return String(name || "")
        .replaceAll("_", " ")
        .replace(
            /\b\w/g,
            char => char.toUpperCase()
        );
}


// ============================================================
// ESCAPE HTML
// ============================================================

function escapeHTML(value) {

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ============================================================
// DELAY
// ============================================================

function delay(ms) {

    return new Promise(
        resolve => setTimeout(
            resolve,
            ms
        )
    );
}


// ============================================================
// INPUT ENHANCEMENTS
// ============================================================

formInputs.forEach(input => {

    input.addEventListener(
        "focus",
        () => {

            input.parentElement
                ?.classList
                .add("focused");

        }
    );


    input.addEventListener(
        "blur",
        () => {

            input.parentElement
                ?.classList
                .remove("focused");

        }
    );

});


// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================

document.addEventListener(
    "keydown",
    event => {

        // Escape closes mobile sidebar
        if (event.key === "Escape") {
            closeMobileSidebar();
        }

        // Ctrl/Cmd + Enter = prediction
        if (
            (event.ctrlKey || event.metaKey) &&
            event.key === "Enter"
        ) {

            if (
                predictionForm &&
                document.activeElement?.tagName === "INPUT"
            ) {

                predictionForm.requestSubmit();
            }
        }
    }
);




// ============================================================
// ============================================================
// THEME + CINEMATIC INTRO
// ============================================================

const themeToggle = $("#themeToggle");
const themeIcon = $("#themeIcon");
const themeLabel = $("#themeLabel");

function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    if (themeIcon) themeIcon.textContent = theme === "light" ? "☀" : "☾";
    if (themeLabel) themeLabel.textContent = theme === "light" ? "Light" : "Dark";

    if (themeToggle) {
        themeToggle.setAttribute(
            "aria-label",
            theme === "light" ? "Switch to dark mode" : "Switch to light mode"
        );
    }
}

const savedTheme = localStorage.getItem("founderflow-theme") || "dark";
applyTheme(savedTheme);

if (themeToggle) {
    themeToggle.addEventListener("click", () => {
        const nextTheme =
            document.documentElement.getAttribute("data-theme") === "light"
                ? "dark"
                : "light";

        applyTheme(nextTheme);
        localStorage.setItem("founderflow-theme", nextTheme);
    });
}


// ============================================================
// FOUNDERFLOW CINEMATIC INTRO
// Plays automatically EVERY time the site opens.
// No localStorage flag is used.
// ============================================================

(function founderFlowCinematicIntro() {

    function startIntro() {
        if (!document.body || document.getElementById("founderflowCinematicIntro")) {
            return;
        }

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const oldIntro = document.getElementById("introScreen");
            if (oldIntro) oldIntro.remove();
            return;
        }

        const oldIntro = document.getElementById("introScreen");
        if (oldIntro) oldIntro.remove();

        const intro = document.createElement("div");
        intro.id = "founderflowCinematicIntro";

        intro.innerHTML = `
            <div class="ff-bg-grid"></div>
            <div class="ff-particles"></div>
            <div class="ff-scan-line"></div>
            <div class="ff-orbit ff-orbit-one"></div>
            <div class="ff-orbit ff-orbit-two"></div>

            <div class="ff-intro-content">
                <div class="ff-logo" aria-label="FounderFlow"><span class="ff-f-main">F</span><span class="ff-f-mini">F</span></div>
                <div class="ff-title">FounderFlow</div>
                <div class="ff-subtitle">AI STARTUP EXIT INTELLIGENCE</div>

                <div class="ff-status">
                    <span class="ff-status-dot"></span>
                    <span id="ffIntroStatus">Initializing intelligence engine</span>
                </div>

                <div class="ff-progress"><span></span></div>
            </div>
        `;

        const css = document.createElement("style");
        css.id = "founderflow-cinematic-css";
        css.textContent = `
            #founderflowCinematicIntro {
                position: fixed;
                inset: 0;
                z-index: 2147483647;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                background:
                    radial-gradient(circle at 50% 45%, rgba(128,92,255,.28), transparent 24%),
                    radial-gradient(circle at 50% 55%, rgba(65,220,255,.13), transparent 45%),
                    #05060b;
                color: white;
                opacity: 1;
                transform: scale(1);
                transition: opacity .9s cubic-bezier(.77,0,.18,1),
                            transform 1s cubic-bezier(.16,1,.3,1);
            }

            #founderflowCinematicIntro.ff-exit {
                opacity: 0;
                transform: scale(1.08);
                pointer-events: none;
            }

            #founderflowCinematicIntro .ff-bg-grid {
                position: absolute;
                width: 220%;
                height: 220%;
                left: -60%;
                top: -25%;
                background-image:
                    linear-gradient(rgba(128,92,255,.12) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(128,92,255,.12) 1px, transparent 1px);
                background-size: 52px 52px;
                transform: perspective(650px) rotateX(64deg);
                animation: ffGridMove 4s linear infinite;
            }

            #founderflowCinematicIntro .ff-particles {
                position: absolute;
                inset: 0;
                background-image:
                    radial-gradient(circle, rgba(255,255,255,.85) 1px, transparent 1.5px),
                    radial-gradient(circle, rgba(128,92,255,.7) 1px, transparent 1.5px);
                background-size: 83px 83px, 137px 137px;
                animation: ffParticles 7s linear infinite;
                opacity: .8;
            }

            #founderflowCinematicIntro .ff-scan-line {
                position: absolute;
                left: 0;
                right: 0;
                top: -5%;
                height: 2px;
                background: linear-gradient(90deg, transparent, #805cff, #6ee7ff, #64f2b0, transparent);
                box-shadow: 0 0 18px #805cff, 0 0 55px rgba(110,231,255,.9);
                animation: ffScan 2s ease-in-out infinite;
            }

            #founderflowCinematicIntro .ff-orbit {
                position: absolute;
                border: 1px solid rgba(128,92,255,.4);
                border-radius: 50%;
                animation: ffOrbit 6s linear infinite;
            }

            #founderflowCinematicIntro .ff-orbit::after {
                content: "";
                position: absolute;
                width: 8px;
                height: 8px;
                left: 50%;
                top: -4px;
                border-radius: 50%;
                background: #6ee7ff;
                box-shadow: 0 0 15px #6ee7ff, 0 0 35px #6ee7ff;
            }

            #founderflowCinematicIntro .ff-orbit-one {
                width: 270px;
                height: 270px;
                transform: rotateX(66deg) rotateZ(15deg);
            }

            #founderflowCinematicIntro .ff-orbit-two {
                width: 390px;
                height: 390px;
                transform: rotateX(66deg) rotateZ(-35deg);
                animation-duration: 9s;
                animation-direction: reverse;
            }

            #founderflowCinematicIntro .ff-intro-content {
                position: relative;
                z-index: 10;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }

            #founderflowCinematicIntro .ff-logo {
                position: relative;
                width: 112px;
                height: 112px;
                display: grid;
                place-items: center;
                border-radius: 31px;
                background: linear-gradient(135deg, #805cff, #9b7aff 50%, #6ee7ff);
                box-shadow: 0 0 35px rgba(128,92,255,.85),
                            0 0 110px rgba(128,92,255,.42);
                animation: ffLogoIn 1s cubic-bezier(.16,1,.3,1) both,
                           ffPulse 1.7s ease-in-out 1s infinite;
            }

            #founderflowCinematicIntro .ff-logo::before,
            #founderflowCinematicIntro .ff-logo::after {
                content: "";
                position: absolute;
                width: 150px;
                height: 150px;
                border: 1px solid rgba(128,92,255,.55);
                border-radius: 43px;
                animation: ffRing 2s ease-out infinite;
            }

            #founderflowCinematicIntro .ff-logo::after {
                animation-delay: .65s;
            }

            #founderflowCinematicIntro .ff-logo .ff-f-main {
                position: relative;
                z-index: 3;
                font-size: 62px;
                line-height: 1;
                font-weight: 900;
                color: white;
                transform: translateY(-9px);
                text-shadow: 0 0 18px rgba(255,255,255,.28);
            }

            /* Second F sits partially underneath the first F, creating the FF mark. */
            #founderflowCinematicIntro .ff-logo .ff-f-mini {
                position: absolute;
                z-index: 2;
                left: 58%;
                top: 59%;
                font-size: 40px;
                line-height: 1;
                font-weight: 900;
                color: rgba(255,255,255,.72);
                transform: translate(-20%, -4%);
                text-shadow: 0 0 16px rgba(110,231,255,.42);
            }

            #founderflowCinematicIntro .ff-title {
                margin-top: 34px;
                font-size: clamp(44px, 7vw, 80px);
                line-height: 1;
                font-weight: 900;
                letter-spacing: -5px;
                background: linear-gradient(90deg, #fff, #a18aff, #6ee7ff, #64f2b0, #fff);
                background-size: 300% auto;
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                animation: ffTextIn .9s .25s cubic-bezier(.16,1,.3,1) both,
                           ffGradient 3s linear infinite;
            }

            #founderflowCinematicIntro .ff-subtitle {
                margin-top: 12px;
                color: #aaa6b8;
                font-size: 11px;
                font-weight: 800;
                letter-spacing: 5px;
                animation: ffTextIn .8s .5s ease both;
            }

            #founderflowCinematicIntro .ff-status {
                margin-top: 38px;
                display: flex;
                align-items: center;
                gap: 10px;
                color: #c4bfce;
                font-size: 11px;
                font-weight: 700;
                letter-spacing: 2px;
                text-transform: uppercase;
                animation: ffTextIn .8s .75s ease both;
            }

            #founderflowCinematicIntro .ff-status-dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #64f2b0;
                box-shadow: 0 0 15px #64f2b0;
                animation: ffDot .7s ease-in-out infinite alternate;
            }

            #founderflowCinematicIntro .ff-progress {
                width: 260px;
                height: 3px;
                margin-top: 18px;
                overflow: hidden;
                border-radius: 20px;
                background: rgba(255,255,255,.08);
                animation: ffTextIn .8s .9s ease both;
            }

            #founderflowCinematicIntro .ff-progress span {
                display: block;
                width: 40%;
                height: 100%;
                border-radius: inherit;
                background: linear-gradient(90deg, #805cff, #6ee7ff, #64f2b0);
                box-shadow: 0 0 18px #805cff;
                animation: ffProgress 1.35s ease-in-out infinite;
            }

            @keyframes ffGridMove {
                from { transform: perspective(650px) rotateX(64deg) translateY(0); }
                to { transform: perspective(650px) rotateX(64deg) translateY(70px); }
            }

            @keyframes ffParticles {
                to { background-position: 83px 110px, 137px 170px; }
            }

            @keyframes ffScan {
                0% { top: -5%; opacity: 0; }
                15% { opacity: 1; }
                85% { opacity: 1; }
                100% { top: 105%; opacity: 0; }
            }

            @keyframes ffOrbit {
                to { transform: rotateX(66deg) rotateZ(375deg); }
            }

            @keyframes ffLogoIn {
                0% { opacity: 0; transform: scale(.15) rotate(-35deg); filter: blur(18px); }
                65% { transform: scale(1.12) rotate(4deg); }
                100% { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); }
            }

            @keyframes ffPulse {
                0%,100% { box-shadow: 0 0 35px rgba(128,92,255,.8), 0 0 100px rgba(128,92,255,.35); }
                50% { box-shadow: 0 0 70px rgba(128,92,255,1), 0 0 160px rgba(110,231,255,.5); }
            }

            @keyframes ffRing {
                0% { transform: scale(.65); opacity: .9; }
                100% { transform: scale(1.9); opacity: 0; }
            }

            @keyframes ffTextIn {
                from { opacity: 0; transform: translateY(35px); filter: blur(12px); }
                to { opacity: 1; transform: translateY(0); filter: blur(0); }
            }

            @keyframes ffGradient {
                to { background-position: 300% center; }
            }

            @keyframes ffDot {
                from { transform: scale(.7); opacity: .45; }
                to { transform: scale(1.35); opacity: 1; }
            }

            @keyframes ffProgress {
                0% { transform: translateX(-170%); }
                100% { transform: translateX(550%); }
            }
        `;

        document.head.appendChild(css);
        document.body.prepend(intro);
        document.body.style.overflow = "hidden";

        const status = document.getElementById("ffIntroStatus");

        [
            [900, "Loading prediction engine"],
            [1800, "Analyzing startup intelligence"],
            [2700, "Connecting production API"],
            [3400, "Intelligence engine ready"]
        ].forEach(([delay, message]) => {
            setTimeout(() => {
                if (status) status.textContent = message;
            }, delay);
        });

        setTimeout(() => {
            intro.classList.add("ff-exit");
            document.body.style.overflow = "";

            setTimeout(() => {
                intro.remove();
                css.remove();
            }, 950);
        }, 4100);
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", startIntro, { once: true });
    } else {
        startIntro();
    }

})();


// ============================================================
// INITIALIZATION

// ============================================================

async function initializeFounderFlow() {

    updateFormCount();

    // Do not block model explainability on the health-check request.
    // The feature importance page can load from the API or its local model snapshot.
    await Promise.allSettled([
        checkAPI(),
        loadFeatureImportance()
    ]);
}


// Start after DOM is ready
if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeFounderFlow
    );

} else {

    initializeFounderFlow();

}