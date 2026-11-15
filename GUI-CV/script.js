document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');
        
        // Skip fallback empty anchors
        if (targetId === '#' || !targetId) return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            e.preventDefault();
            
            // Softer programmatic scroll with offset calculation
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Hero know me button
const contactBtn = document.getElementById('contact-btn');
if (contactBtn) {
    contactBtn.addEventListener('click', () => {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// TIMELINE manipulator
document.querySelectorAll('.timeline-item').forEach(item => {
    item.addEventListener('click', () => {

        document.querySelectorAll('.timeline-item').forEach(n => n.classList.remove('active'));

        document.querySelectorAll('.timeline-detail-card').forEach(card => card.classList.remove('active'));
        
        item.classList.add('active');

        const targetId = item.getAttribute('data-target');
        const targetCard = document.getElementById(targetId);
        if (targetCard) {
            targetCard.classList.add('active');
        }
        
    });
});

// WORLD MAP manipulator
const languageData = {
    it: {
        name: "Italian",
        countries: ["IT", "CH", "SM", "VA"],
        populationReach: "1%",
        population: 67,
        details: "Official language in 4 countries and widely spoken across Europe."

    },

    es: {
        name: "Spanish",
        countries: ["ES", "MX", "CO", "AR", "PE", "VE", "CL", "EC", "GT", "CU", "BO", "DO", "HN", "PY", "SV", "NI", "CR", "PA", "UY", "GQ", "PR"],
        populationReach: "6.5% - 7%",
        population: 550,
        details: "Official language in over 20 countries. primarily across Latin America and Spain."

    },

    en: {
        name: "English",
        countries: ["GB", "US", "CA", "AU", "NZ", "IE", "ZA", "IN", "SG", "NG", "KE", "JM", "GH", "UG", "PH", "PK", "MT", "GY", "BZ", "TT"],
        population: 1450,
        populationReach: "18% - 20%",
        details: "Global lingua franca, spoken natively and officially across multiple continents."
    },

    fr: {
        name: "French",
        countries: ["FR", "CA", "BE", "CH", "LU", "MC", "SN", "CI", "CM", "CD", "MG", "MA", "DZ", "TN"],
        population: 310,
        populationReach: "3.8%",
        details: "Official language in 29 countries spanning Europe, North America, and Africa."
    },

    pt: {
        name: "Portuguese",
        countries: ["PT", "BR", "AO", "MZ", "CV", "GW", "ST", "TL", "CQ", "MO"],
        population: 260,
        populationReach: "3.25%",
        details: "Official language across 9 countries, spoken in Europe, South America, and Africa."
    }
    
};

let selectedLanguages = new Set();
let mapInstance = null;

// wait for the DOM before initializing the map
document.addEventListener("DOMContentLoaded", () => {

    // initialize the map
    mapInstance = new jsVectorMap({
        selector: "#world-map",
        map: "world",
        draggable: true,
        zoomButtons: true,
        zoomOnScroll: false,
        regionStyle: {
            initial: {
                fill: "#2c2c32",
                stroke: "#16161a",
                strokeWidth: 0.5,
                fillOpacity: 1
            },
            hover: {
                fill: "#a146c9"
            },
            selected: {
                fill: "#D4AF37"
            }
        }
    });

    // Event listener for language buttons
    document.querySelectorAll(".lang-btn").forEach(button => {
        button.addEventListener("click", () => {
            const langKey = button.getAttribute("data-lang");

            // section alter toggle
            if (selectedLanguages.has(langKey)) {
                selectedLanguages.delete(langKey);
                button.classList.remove("active");
            } else {
                selectedLanguages.add(langKey);
                button.classList.add("active");
            }

            updateMapAndStats();
        });
    });
});

// func to update map and infogram
function updateMapAndStats() {
    if (!mapInstance) return;

    // reset signals on the map
    mapInstance.clearSelectedRegions();

    if (selectedLanguages.size === 0) {
        document.getElementById("lang-stats").innerHTML =`
        <h4>Interactive Language Calculator</h4>
        <p>Select one or more languages above to calculate your global reach and highlight speaking regions.</p>
        `;
        return;
    }

    // cobine countries without duplication
    let activeCountries = new Set();
    let totalPopulation = 0;
    let activeNames = [];

    selectedLanguages.forEach(langKey => {
        const langInfo = languageData[langKey];
        if (langInfo) {
            activeNames.push(langInfo.name);
            langInfo.countries.forEach(code => activeCountries.add(code));
            totalPopulation += langInfo.population;
        }
    });

    // light the country in the map
    mapInstance.setSelectedRegions(Array.from(activeCountries));

    const globalPercentage = ((totalPopulation / 8000)* 100).toFixed(1);

    document.getElementById("lang-stats").innerHTML =`
    <h4>Selected: ${activeNames.join(" + ")}</h4>
        <p><strong>Combined Population Reach:</strong> Approx. <strong>${totalPopulation} Million people</strong> (~${globalPercentage}% of the world population).</p>
        <p><strong>Geographic Span:</strong> Covers <strong>${activeCountries.size} unique countries/territories</strong> where these languages hold official or widespread status.</p>
        <p><small style="color: #888888;">*Note: Micro-territories and small island nations (e.g., Cabo Verde, São Tomé and Príncipe, Macau) are included in all calculations, though they may not render visible vector shapes at global map scale.</small></p>
        `;
}


// Toggle para mostrar/ocultar proyectos
const toggleProjectsBtn = document.getElementById('toggle-projects-btn');
const projectGrid = document.querySelector('.project-grid');

if (toggleProjectsBtn && projectGrid) {
    toggleProjectsBtn.addEventListener('click', () => {
        // Alterna la clase 'expanded' en la cuadrícula y en el botón
        const isExpanded = projectGrid.classList.toggle('expanded');
        toggleProjectsBtn.classList.toggle('expanded', isExpanded);
        
        // Cambia el texto según el estado
        const btnText = toggleProjectsBtn.querySelector('.btn-text');
        if (btnText) {
            btnText.textContent = isExpanded ? 'Show Less Projects' : 'Show More Projects';
        }
    });
}