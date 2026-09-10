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

async function loadFeatureImportance() {

    try {

        const response =
            await fetch(
                `${API_URL}/feature-importance`,
                {
                    method: "GET",
                    cache: "no-store"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Feature importance request failed."
            );
        }


        const data =
            await response.json();


        /*
         * Your backend returns:
         *
         * [
         *   {
         *      feature: "exit_type",
         *      importance: 0.487241
         *   }
         * ]
         */


        const features =
            Array.isArray(data)
                ? data
                : Array.isArray(data.features)
                    ? data.features
                    : [];


        if (!features.length) {

            throw new Error(
                "No feature importance data."
            );
        }


        renderMainImportance(
            features
        );


        renderMiniImportance(
            features.slice(0, 5),
            dashboardImportance
        );


        renderMiniImportance(
            features.slice(0, 5),
            predictionImportance
        );


    } catch (error) {

        console.error(
            "Feature importance:",
            error
        );


        if (importanceList) {

            importanceList.innerHTML = `
                <div style="
                    padding:20px;
                    color:var(--muted);
                ">
                    Unable to load model signals.
                </div>
            `;
        }
    }
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
// INITIALIZATION
// ============================================================

async function initializeFounderFlow() {

    updateFormCount();

    await checkAPI();

    await loadFeatureImportance();

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