<?php get_header(); ?>
<script src="<?php echo get_template_directory_uri(); ?>/js/simple-likes.js"></script>
<style>
/* Skeleton loader styles */
.image-skeleton {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s ease-in-out infinite;
    z-index: 1;
}

@keyframes skeleton-loading {
    0% {
        background-position: 200% 0;
    }
    100% {
        background-position: -200% 0;
    }
}

.frame-child {
    opacity: 0;
    transition: opacity 0.3s ease-in;
    position: relative;
    z-index: 2;
}

.frame-child.loaded {
    opacity: 1;
}

.swiper-slide {
    position: relative;
    background: #f5f5f5;
}
</style>

<main class="newbuilding">
    <nav id="bottom-navbar" class="bottom-nav">
    </nav>
    <section class="newbuildingblock">
        <div class="filterPropertiesWrapper">
            <div class="filterPropertiesWrapper__inputWrapper" id="offPlanNameFilter">
                <img src="<?php echo get_template_directory_uri(); ?>/icons/search_filter.svg" alt="search" />
                <input class="filterPropertiesWrapper__inputWrapper_input" type="text" placeholder="Search by name"
                    id="offPlanFilterInputName" />
                <button class="search-clear-btn" id="clearSearchBtn" style="display: none;">×</button>
                <div class="filterPropertiesWrapper__dropDown_body" id="offPlanNameBody">
                    <div class="filterPropertiesWrapper__dropDown_list" id="offPlanDropDownList"></div>
                </div>
            </div>
            <div class="filterPropertiesWrapper__adapriveWrapper" id="secondaryFiltetAdaptive">
                <div id="offPlanSortFilterMobile" class="filterPropertiesWrapper__dropDown">
                    <div class="filterPropertiesWrapper__dropDownSort_header">
                        <svg width="24" height="24" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
                            <path d="M24 16 L24 48 M24 48 L20 44 M24 48 L28 44" stroke="#313131" stroke-width="4"
                                stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M40 48 L40 16 M40 16 L36 20 M40 16 L44 20" stroke="#313131" stroke-width="4"
                                stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </div>

                    <div class="filterPropertiesWrapper__dropDown_body adaptive">
                        <div class="filterPropertiesWrapper__dropDown_list"></div>
                    </div>
                </div>
                <button class="filtersMap__tablet-btn" id="offPlanFiltetAdaptive">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"
                        class="filterPropertiesWrapper__adapriveWrapper-svgFullSort">
                        <path
                            d="M2.5 5.8335H5M5 5.8335C5 7.21421 6.11929 8.3335 7.5 8.3335C8.88071 8.3335 10 7.21421 10 5.8335C10 4.45278 8.88071 3.3335 7.5 3.3335C6.11929 3.3335 5 4.45278 5 5.8335ZM2.5 14.1668H7.5M15 14.1668L17.5 14.1668M15 14.1668C15 15.5475 13.8807 16.6668 12.5 16.6668C11.1193 16.6668 10 15.5475 10 14.1668C10 12.7861 11.1193 11.6668 12.5 11.6668C13.8807 11.6668 15 12.7861 15 14.1668ZM12.5 5.8335L17.5 5.8335"
                            stroke="#717171" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    <span>Filter</span>
                    <div class="filtersMap__tablet-length" id="filtersLenghMobileOffPlan"></div>
                </button>
            </div>
            <div class="filterPropertiesWrapper__dropdownds">
                <div id="offPlanPropertyTypeFilter" class="filterPropertiesWrapper__dropDown">
                    <span class="filterPropertiesWrapper__dropDown_label"></span>
                    <div class="filterPropertiesWrapper__dropDown_header">
                        Type
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="filterPropertiesWrapper__dropDown_body">
                        <div class="filterPropertiesWrapper__dropDown_list">
                            <div class="filterPropertiesWrapper__dropDownLocationsWrapper"></div>
                        </div>
                    </div>
                </div>
                <div id="offPlanLocationFilter" class="filterPropertiesWrapper__dropDown">
                    <span class="filterPropertiesWrapper__dropDown_label"></span>
                    <div class="filterPropertiesWrapper__dropDown_header">
                        Location
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="filterPropertiesWrapper__dropDown_body">
                        <div class="filterPropertiesWrapper__dropDown_list">
                            <div class="filterPropertiesWrapper__dropDownLocationsWrapper"></div>
                        </div>
                    </div>
                </div>
                <div id="offPlanBedroomsFilter" class="filterPropertiesWrapper__dropDown">
                    <span class="filterPropertiesWrapper__dropDown_label"></span>
                    <div class="filterPropertiesWrapper__dropDown_header">
                        Bedrooms
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="filterPropertiesWrapper__dropDown_body">
                        <div class="filterPropertiesWrapper__dropDown_list"></div>
                    </div>
                </div>
                <div id="offPlanPriceFilter" class="filterPropertiesWrapper__dropDown">
                    <span class="filterPropertiesWrapper__dropDown_label"></span>
                    <div class="filterPropertiesWrapper__dropDown_header">
                        Price
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="filterPropertiesWrapper__dropDown_body isPrice">
                        <div id="dropdownFrom" class="filterPropertiesWrapper__dropDown_subDropdown">
                            <div class="filterPropertiesWrapper__dropDown_header isPriceDropDownHeader">
                                From
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none">
                                    <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </div>
                            <div class="filterPropertiesWrapper__dropDown_body isPrice2 left-1">
                                <div id="minPriceList" class="filterPropertiesWrapper__dropDown_list isPrice"></div>
                            </div>
                        </div>
                        <div id="dropdownTo" class="filterPropertiesWrapper__dropDown_subDropdown">
                            <div class="filterPropertiesWrapper__dropDown_header isPriceDropDownHeader">
                                To
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                    fill="none">
                                    <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5"
                                        stroke-linecap="round" stroke-linejoin="round"></path>
                                </svg>
                            </div>
                            <div class="filterPropertiesWrapper__dropDown_body isPrice2 left-2">
                                <div id="maxPriceList" class="filterPropertiesWrapper__dropDown_list isPrice"></div>
                            </div>
                        </div>
                    </div>
                </div>


                <div id="offPlanSizeFilter" class="filterPropertiesWrapper__dropDown">
                    <span class="filterPropertiesWrapper__dropDown_label"></span>
                    <div class="filterPropertiesWrapper__dropDown_header">
                        Size
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="filterPropertiesWrapper__dropDown_body">
                        <div class="filterPropertiesWrapper__dropDown_list"></div>
                    </div>
                </div>
                <div id="offPlanHandoverFilter" class="filterPropertiesWrapper__dropDown">
                    <span class="filterPropertiesWrapper__dropDown_label"></span>
                    <div class="filterPropertiesWrapper__dropDown_header">
                        Handover
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="filterPropertiesWrapper__dropDown_body">
                        <div class="filterPropertiesWrapper__dropDown_list"></div>
                    </div>
                </div>
                <div id="offPlanSortFilter" class="filterPropertiesWrapper__dropDown">
                    <span class="filterPropertiesWrapper__dropDown_label"></span>
                    <div class="filterPropertiesWrapper__dropDown_header">
                        Sort
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                            class="filterPropertiesWrapper__sortSvgFull">
                            <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="filterPropertiesWrapper__dropDown_body adaptive">
                        <div class="filterPropertiesWrapper__dropDown_list"></div>
                    </div>
                </div>
                <button class="filtersMap__clearBtn" id="clearBtnOffPlanFilter">
                    Clear
                </button>
            </div>
        </div>
        <div id="propertiesSelectedFilters"></div>
        <div class="total-projects-text">
            <span>Total </span>
            <span class="total-projects-text-dark">off plan</span>
            <span id="totalOffPlan"> projects: 0</span>
        </div>
        <div class="card-parent" id="projectsContainer"></div>
        <div id="pagination-container"></div>
    </section>
    <section class="adapriveFilters__bg" id="offPlanAdaptiveFilters">
        <div class="adapriveFilters properties">
            <div class="adapriveFilters__header">
                <h2 class="adapriveFilters__header-title">Filter</h2>
                <button class="adapriveFilters__header-btnClose">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M14.1667 5.83355L5.83337 14.1668M14.1667 14.1668L5.83337 5.8335" stroke="#313131"
                            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
            <div class="adapriveFilters__main">
                <div class="adapriveFilters__main-drop-buttons">
                    <div class="adapriveFilters__main-buttons">
                        <div class="adapriveFilters__main-btn active" id="offPlanAdaptiveBtnOffPlan">
                            Off plan
                        </div>
                        <div class="adapriveFilters__main-btn" id="secondaryAdaptiveBtnOffPlan">
                            Secondary
                        </div>
                    </div>
                    <div class="adapriveFilters__main-dropdowns">
                        <div>
                            <div id="offPlanLocationFilterMobile" class="filterPropertiesWrapper__dropDown">
                                <span class="filterPropertiesWrapper__dropDown_label">Locations</span>
                                <div class="filterPropertiesWrapper__dropDown_header mobile">
                                    Locations
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none">
                                        <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <div class="filterPropertiesWrapper__dropDown_body big">
                                    <div class="filterPropertiesWrapper__dropDown_list">
                                        <div class="filterPropertiesWrapper__dropDownLocationsWrapper"></div>
                                    </div>
                                </div>
                            </div>
                            <div class="propertiesSelectedFilter__list" id="selectValueOffPlanFilterLocation"></div>
                        </div>
                        <div>
                            <div id="offPlanBedroomsFilterMobile" class="filterPropertiesWrapper__dropDown">
                                <span class="filterPropertiesWrapper__dropDown_label">Bedrooms</span>
                                <div class="filterPropertiesWrapper__dropDown_header mobile">
                                    Bedrooms
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none">
                                        <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <div class="filterPropertiesWrapper__dropDown_body big">
                                    <div class="filterPropertiesWrapper__dropDown_list"></div>
                                </div>
                                <div class="propertiesSelectedFilter__list" id="selectValueOffPlanBedrooms"></div>
                            </div>
                        </div>
                        <div>
                            <div id="offPlanPriceFilterMobile" class="filterPropertiesWrapper__dropDown">
                                <span class="filterPropertiesWrapper__dropDown_label">Price</span>
                                <div class="filterPropertiesWrapper__dropDown_header mobile">
                                    Price
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none">
                                        <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <div class="filterPropertiesWrapper__dropDown_body big">
                                    <div class="filterPropertiesWrapper__dropDown_list"></div>
                                </div>
                            </div>
                            <div class="propertiesSelectedFilter__list" id="selectValueOffPlanPrice"></div>
                        </div>
                        <div>
                            <div id="offPlanSizeFilterMobile" class="filterPropertiesWrapper__dropDown">
                                <span class="filterPropertiesWrapper__dropDown_label">Size</span>
                                <div class="filterPropertiesWrapper__dropDown_header mobile">
                                    Size
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none">
                                        <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <div class="filterPropertiesWrapper__dropDown_body big">
                                    <div class="filterPropertiesWrapper__dropDown_list"></div>
                                </div>
                            </div>
                            <div class="propertiesSelectedFilter__list" id="selectValueOffPlanSize"></div>
                        </div>
                        <div>
                            <div id="offPlanHandoverFilterMobile" class="filterPropertiesWrapper__dropDown">
                                <span class="filterPropertiesWrapper__dropDown_label">Handover</span>
                                <div class="filterPropertiesWrapper__dropDown_header mobile">
                                    Handover
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none">
                                        <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <div class="filterPropertiesWrapper__dropDown_body big">
                                    <div class="filterPropertiesWrapper__dropDown_list"></div>
                                </div>
                            </div>
                            <div class="propertiesSelectedFilter__list" id="selectValueOffPlanHandover"></div>
                        </div>
                        <div>
                            <div id="offPlanPropertyTypeFilterMobile" class="filterPropertiesWrapper__dropDown">
                                <span class="filterPropertiesWrapper__dropDown_label">Property type</span>
                                <div class="filterPropertiesWrapper__dropDown_header mobile">
                                    Property type
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                        fill="none">
                                        <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5"
                                            stroke-linecap="round" stroke-linejoin="round" />
                                    </svg>
                                </div>
                                <div class="filterPropertiesWrapper__dropDown_body big">
                                    <div class="filterPropertiesWrapper__dropDown_list"></div>
                                </div>
                            </div>
                            <div class="propertiesSelectedFilter__list" id="selectValueOffPlanPropertyType"></div>
                        </div>
                    </div>
                </div>
                <div class="adapriveFilters__main-buttonsBottom">
                    <button class="adapriveFilters__main-btnClear" id="clearBtnOffPlanFilterAdaptive">
                        Clear
                    </button>
                    <button class="adapriveFilters__main-btnConfirm" id="redirectBtnOffPlanFilterAdaptiveSecondary">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </section>
</main>

<script>
    document.addEventListener('DOMContentLoaded', function() {
        function FeedbackForm() {
            const formHTML = `
                <form action="" class="feedbackBlock">
                    <div class="feedbackForm">
                        <p class="formHeader">Get help from our expert</p>
                        <p class="formDescription">
                            Our expert will help you with property purchase, management, or
                            consulting in Costa Del Sol.
                        </p>
                        <input
                            type="text"
                            name="name"
                            class="nameInput"
                            placeholder="Your name"
                        />
                        <input
                            type="tel"
                            name="phone"
                            class="phoneInput"
                            placeholder="Phone number"
                        />
                        <button type="submit" class="submitButton">Get a consultation</button>
                        <p class="hint">
                            When you click “Get a Consultation,” you agree to our Terms of Service
                            and Privacy Policy.
                        </p>
                    </div>
                </form>
            `;

            const formElement = document.createElement("div");
            formElement.innerHTML = formHTML;

            // Modal element
            const modalElement = document.createElement("div");
            modalElement.className = "notificationModal";
            modalElement.innerText = "Your message was received!";
            modalElement.style.display = "none"; // Hide initially
            document.body.appendChild(modalElement);

            // Handle form submission
            formElement.querySelector("form").addEventListener("submit", (event) => {
                event.preventDefault(); // Prevent page reload

                // Show the modal
                modalElement.style.display = "block";

                // Hide modal after 3 seconds
                setTimeout(() => {
                    modalElement.style.display = "none";
                }, 3000);
            });

            return formElement;
        }

        const style = document.createElement("style");
        style.innerHTML = `
            .notificationModal {
                position: fixed;
                top: 60px;
                right: 20px;
                padding: 10px 20px;
                background-color: #d3d3d3;
                color: #222222;
                font-weight: 600;
                border-radius: 12px;
                font-size: 16px;
                z-index: 1000;
                display: none;
            }
        `;
        document.head.appendChild(style);

        const feedbackFormContainer = document.getElementById("feedbackBlock");
        feedbackFormContainer.appendChild(FeedbackForm());

        const path = window.location.pathname.split('/');
        let language = '';

        const allowedLanguages = ['ru', 'es'];

        if (path[1] && allowedLanguages.includes(path[1])) {
            language = path[1];
        }

        let redirectData = {
            visible: "Off plan",
            bedrooms: [],
            priceMin: 0,
            priceMax: 0,
            sizeMin: 0,
            sizeMax: 0,
            handoverMin: 0,
            handoverMax: 0,
            areas: []
        }

        // header
        const Header = () => {
            const location = window.location;

            const filterMobileBurgerMenu = document.getElementById(
                "filterMobileBurgerMenu"
            );

            const headerId = document.getElementById("header");

            const header = createElement("header");
            header.className = "header";

            header.className = "header";

            const applyHashStyles = () => {
                if (location.hash === "#main") {
                    header.style.borderBottom = "none";
                } else {
                    header.style.borderBottom = "";
                }
            };

            applyHashStyles();

            window.addEventListener("hashchange", () => {
                applyHashStyles();
            });

            const logoDiv = createElement("a");
            logoDiv.className = "logo";
            logoDiv.href = `${language && "/" + language}/`;
            header.appendChild(logoDiv);

            const nav = createElement("nav");
            nav.className = "nav";
            header.appendChild(nav);

            const navList = createElement("ul");
            navList.className = "navList";
            nav.appendChild(navList);

            const navBtm = createElement("nav");
            navBtm.className = "showNavBottom";
            header.appendChild(navBtm);

            const navListBtm = createElement("ul");
            navListBtm.className = "navListBtm";
            navBtm.appendChild(navListBtm);

            const socialDiv = createElement("div");
            socialDiv.className = "social";
            header.appendChild(socialDiv);

            const fixedMenue = document.createElement("div");
            const fixedBtn = document.createElement("button");
            fixedBtn.className = "button menuButtonWhite";
            fixedBtn.id = "fixedMenue";
            fixedMenue.className = "fixedMenue";
            fixedMenue.innerHTML = `
                <a class="button mapButtonWhite" href="${language && "/" + language}/map"></a>
                <button class="button callUsButtonWhite" onclick="window.location.href='tel:+34695113333';"></button>
            <button class="button filterButtonWhite" id="headerOpenFilterBtn"></button>
            `;
            fixedMenue.prepend(fixedBtn);
            header.appendChild(fixedMenue);

            const adaptiveFiltersContainer = document.createElement("div");
            adaptiveFiltersContainer.className = "adapriveFilters__bg";
            adaptiveFiltersContainer.id = "headerAdaptiveFilters";
            adaptiveFiltersContainer.innerHTML = `
                <div class="adapriveFilters properties">
                <div class="adapriveFilters__header">
                    <h2 class="adapriveFilters__header-title">Filter</h2>
                    <button class="adapriveFilters__header-btnCloseHeader" id="btnCloseHeader">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 20 20"
                            fill="none"
                        >
                            <path
                                d="M14.1667 5.83355L5.83337 14.1668M14.1667 14.1668L5.83337 5.8335"
                                stroke="#313131"
                                stroke-width="1.5"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                            />
                        </svg>
                    </button>
                </div>
                <div class="adapriveFilters__main">
                    <div>
                        <div class="adapriveFilters__main-buttons">
                            <div class="adapriveFilters__main-btn active" id="offPlanAdaptiveBtnHeader">
                                Off plan
                            </div>
                            <div class="adapriveFilters__main-btn" id="secondaryAdaptiveBtnHeader">
                                Secondary
                            </div>
                        </div>
                        <div class="adapriveFilters__main-dropdowns">
                            <div>
                                <div
                                    id="headerLocationFilterMobile"
                                    class="filterPropertiesWrapper__dropDown"
                                >
                                    <span
                                        class="filterPropertiesWrapper__dropDown_label"
                                        >Locations</span
                                    >
                                    <div
                                        class="filterPropertiesWrapper__dropDown_header mobile"
                                    >
                                        Locations
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M7 10L12 14L17 10"
                                                stroke="#717171"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        class="filterPropertiesWrapper__dropDown_body big"
                                    >
                                        <div
                                            class="filterPropertiesWrapper__dropDown_list"
                                        >
                                            <div
                                                class="filterPropertiesWrapper__dropDownLocationsWrapper"
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                <div
                                    class="propertiesSelectedFilter__list"
                                    id="selectValueHeaderFilterLocation"
                                ></div>
                            </div>
                            <div>
                                <div
                                    id="headerBedroomsFilterMobile"
                                    class="filterPropertiesWrapper__dropDown"
                                >
                                    <span
                                        class="filterPropertiesWrapper__dropDown_label"
                                        >Bedrooms</span
                                    >
                                    <div
                                        class="filterPropertiesWrapper__dropDown_header mobile"
                                    >
                                        Bedrooms
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M7 10L12 14L17 10"
                                                stroke="#717171"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        class="filterPropertiesWrapper__dropDown_body big"
                                    >
                                        <div
                                            class="filterPropertiesWrapper__dropDown_list"
                                        ></div>
                                    </div>
                                    <div
                                        class="propertiesSelectedFilter__list"
                                        id="selectValueHeaderBedrooms"
                                    ></div>
                                </div>
                            </div>
                            <div>
                                <div
                                    id="headerPriceFilterMobile"
                                    class="filterPropertiesWrapper__dropDown"
                                >
                                    <span
                                        class="filterPropertiesWrapper__dropDown_label"
                                        >Price</span
                                    >
                                    <div
                                        class="filterPropertiesWrapper__dropDown_header mobile"
                                    >
                                        Price
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M7 10L12 14L17 10"
                                                stroke="#717171"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        class="filterPropertiesWrapper__dropDown_body big"
                                    >
                                        <div
                                            class="filterPropertiesWrapper__dropDown_list"
                                        ></div>
                                    </div>
                                </div>
                                <div
                                    class="propertiesSelectedFilter__list"
                                    id="selectValueHeaderPrice"
                                ></div>
                            </div>
                            <div>
                                <div
                                    id="headerSizeFilterMobile"
                                    class="filterPropertiesWrapper__dropDown"
                                >
                                    <span
                                        class="filterPropertiesWrapper__dropDown_label"
                                        >Size</span
                                    >
                                    <div
                                        class="filterPropertiesWrapper__dropDown_header mobile"
                                    >
                                        Size
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M7 10L12 14L17 10"
                                                stroke="#717171"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        class="filterPropertiesWrapper__dropDown_body big"
                                    >
                                        <div
                                            class="filterPropertiesWrapper__dropDown_list"
                                        ></div>
                                    </div>
                                </div>
                                <div
                                    class="propertiesSelectedFilter__list"
                                    id="selectValueHeaderSize"
                                ></div>
                            </div>
                            <div>
                                <div
                                    id="headerHandoverFilterMobile"
                                    class="filterPropertiesWrapper__dropDown"
                                >
                                    <span
                                        class="filterPropertiesWrapper__dropDown_label"
                                        >Handover</span
                                    >
                                    <div
                                        class="filterPropertiesWrapper__dropDown_header mobile"
                                    >
                                        Handover
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M7 10L12 14L17 10"
                                                stroke="#717171"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        class="filterPropertiesWrapper__dropDown_body big"
                                    >
                                        <div
                                            class="filterPropertiesWrapper__dropDown_list"
                                        ></div>
                                    </div>
                                </div>
                                <div
                                    class="propertiesSelectedFilter__list"
                                    id="selectValueHeaderHandover"
                                ></div>
                            </div>
                        </div>
                        <div>
                                <div
                                    id="headerPropertyTypeFilterMobile"
                                    class="filterPropertiesWrapper__dropDown"
                                >
                                    <span
                                        class="filterPropertiesWrapper__dropDown_label"
                                        >Property type</span
                                    >
                                    <div
                                        class="filterPropertiesWrapper__dropDown_header mobile"
                                    >
                                        Handover
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            viewBox="0 0 24 24"
                                            fill="none"
                                        >
                                            <path
                                                d="M7 10L12 14L17 10"
                                                stroke="#717171"
                                                stroke-width="1.5"
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                            />
                                        </svg>
                                    </div>
                                    <div
                                        class="filterPropertiesWrapper__dropDown_body big"
                                    >
                                        <div
                                            class="filterPropertiesWrapper__dropDown_list"
                                        ></div>
                                    </div>
                                </div>
                                <div
                                    class="propertiesSelectedFilter__list"
                                    id="selectValueHeaderPropertyType"
                                ></div>
                            </div>
                        </div>
                    </div>
                    <div class="adapriveFilters__main-buttonsBottom">
                        <button class="adapriveFilters__main-btnClear" id="clearBtnHeaderFilterAdaptive">
                            Clear
                        </button>
                        <button class="adapriveFilters__main-btnConfirm" id="redirectFilterHeader">
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
            `;
            header.appendChild(adaptiveFiltersContainer);

            // Функция для управления адаптивным меню (открытие/закрытие)
            const adaptiveMenuHandler = () => {
                // Убедимся, что элементы добавлены в DOM
                const openFilterButton = header.querySelector("#headerOpenFilterBtn");
                const closeButton =
                    adaptiveFiltersContainer.querySelector("#btnCloseHeader");

                if (!openFilterButton || !adaptiveFiltersContainer || !closeButton) {
                    console.warn(
                        "Some elements are missing, please check the HTML structure."
                    );
                    return;
                }

                // Открытие меню
                const openAdaptiveMenu = () => {
                    if (window.innerWidth < 767) {
                        adaptiveFiltersContainer.classList.add("active");
                        document.body.style.overflow = "hidden";
                    }
                };

                // Закрытие меню
                const closeAdaptiveMenu = () => {
                    adaptiveFiltersContainer.classList.remove("active");
                    document.body.style.overflow = "";
                };

                // Добавление обработчиков событий
                openFilterButton.addEventListener("click", openAdaptiveMenu);
                closeButton.addEventListener("click", closeAdaptiveMenu);

                // Закрытие при клике вне области меню
                adaptiveFiltersContainer.addEventListener("click", (e) => {
                    if (e.target === adaptiveFiltersContainer) {
                        closeAdaptiveMenu();
                    }
                });

                // Возвращаем функцию закрытия для использования в других частях кода
                return {
                    closeAdaptiveMenu
                };
            };
            const {
                closeAdaptiveMenu
            } = adaptiveMenuHandler();
            setTimeout(adaptiveMenuHandler, 0);

            const headerMapImport = document.getElementById("headerMapImport");

            function updateHeaderMap() {
                const isMobile = window.innerWidth < 767;
                if (isMobile && headerMapImport) {
                    headerMapImport.style.height = "0";
                    headerMapImport.style.overflow = "hidden";
                }
                if (!isMobile && headerMapImport) {
                    headerMapImport.style.height = "113px";
                    headerMapImport.style.overflow = "visible";
                }
            }

            function updateFixedMenueVisibility() {
                const isMobile = window.innerWidth < 767;
                if (isMobile) {
                    // Show filter button on mobile devices regardless of scroll position
                    fixedMenue.style.opacity = 1;
                    fixedMenue.style.visibility = "visible";
                } else {
                    // Hide on desktop
                    fixedMenue.style.opacity = 0;
                    fixedMenue.style.visibility = "hidden";
                }
            }

            const headerSetupFilterButtons = () => {
                const offPlanButton = document.getElementById("offPlanAdaptiveBtnHeader");
                const secondaryButton = document.getElementById("secondaryAdaptiveBtnHeader");

                if (!offPlanButton || !secondaryButton) {
                    console.warn("Filter buttons are missing, please check the HTML structure.");
                    return;
                }

                // Устанавливаем стили кнопок в зависимости от значения visible в redirectData
                const initialValue = redirectData.visible;

                offPlanButton.classList.remove("active");
                secondaryButton.classList.remove("active");

                if (initialValue === "Off plan") {
                    offPlanButton.classList.add("active");
                } else if (initialValue === "Secondary") {
                    secondaryButton.classList.add("active");
                }

                const updateVisibleFilter = (selectedValue) => {
                    // Обновляем значение visible в redirectData
                    redirectData.visible = selectedValue;

                    // Обновляем стили кнопок
                    if (selectedValue === "Off plan") {
                        offPlanButton.classList.add("active");
                        secondaryButton.classList.remove("active");
                    } else if (selectedValue === "Secondary") {
                        secondaryButton.classList.add("active");
                        offPlanButton.classList.remove("active");
                    }

                    console.log(redirectData);
                };

                // Добавляем обработчики событий
                offPlanButton.addEventListener("click", () => {
                    updateVisibleFilter("Off plan");
                });

                secondaryButton.addEventListener("click", () => {
                    updateVisibleFilter("Secondary");
                });
            };
            setInterval(headerSetupFilterButtons, 500);

            function headerDropDownBeddroomsMobile() {
                const dropdownContainer = document.getElementById("headerBedroomsFilterMobile");

                if (dropdownContainer) {
                    const dropdownHeader = dropdownContainer.querySelector(".filterPropertiesWrapper__dropDown_header");
                    const dropdownBody = dropdownContainer.querySelector(".filterPropertiesWrapper__dropDown_body");
                    const dropdownList = dropdownBody.querySelector(".filterPropertiesWrapper__dropDown_list");

                    // Синхронизируем bedrooms из redirectData
                    let bedroomsQuery = [...redirectData.bedrooms];

                    for (let i = 1; i <= 8; i++) {
                        const item = document.createElement("div");
                        item.className = "filterPropertiesWrapper__dropDown_item";
                        item.innerText = `${i} Bedroom`;

                        const checkBox = document.createElement("div");
                        checkBox.className = "filterPropertiesWrapper__customCheckBox";

                        checkBox.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                            <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                                </svg>
                        `;

                        item.appendChild(checkBox);
                        dropdownList.appendChild(item);

                        item.addEventListener("click", function(e) {
                            e.stopPropagation();

                            if (bedroomsQuery.includes(i)) {
                                bedroomsQuery = bedroomsQuery.filter((bedroom) => bedroom !== i);
                                checkBox.classList.remove("active");
                            } else {
                                bedroomsQuery.push(i);
                                checkBox.classList.add("active");
                            }

                            // Обновляем bedrooms в redirectData
                            redirectData.bedrooms = [...bedroomsQuery];
                        });
                    }

                    function toggleMenu() {
                        dropdownBody.classList.toggle("active");
                        dropdownHeader.classList.toggle("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        if (dropdownBody.classList.contains("active")) {
                            svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                        } else {
                            svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                        }
                    }

                    dropdownHeader.addEventListener("click", function(e) {
                        e.stopPropagation();

                        if (dropdownBody.classList.contains("active")) {
                            closeMenu(e);
                        } else {
                            closeAllDropdowns();
                            toggleMenu();
                        }
                    });

                    function closeMenu() {
                        dropdownBody.classList.remove("active");
                        dropdownHeader.classList.remove("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }

                    document.addEventListener("click", function(event) {
                        const isClickInside = dropdownContainer.contains(event.target);

                        if (!isClickInside) {
                            dropdownBody.classList.remove("active");

                            const svgIcon = dropdownHeader.querySelector("svg path");
                            svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                        }
                    });

                    function syncCheckboxesWithData() {
                        bedroomsQuery = [...redirectData.bedrooms];

                        dropdownList.querySelectorAll(".filterPropertiesWrapper__dropDown_item").forEach((item, index) => {
                            const checkBox = item.querySelector(".filterPropertiesWrapper__customCheckBox");
                            if (bedroomsQuery.includes(index + 1)) {
                                checkBox.classList.add("active");
                            } else {
                                checkBox.classList.remove("active");
                            }
                        });
                    }

                    syncCheckboxesWithData();
                }
            }
            setTimeout(headerDropDownBeddroomsMobile, 0);

            function headerDropDownPriceMobile() {
                const dropdownContainer = document.querySelector("#headerPriceFilterMobile");
                const dropdownHeader = dropdownContainer.querySelector(".filterPropertiesWrapper__dropDown_header");
                const dropdownBody = dropdownContainer.querySelector(".filterPropertiesWrapper__dropDown_body");
                const dropdownList = dropdownBody.querySelector(".filterPropertiesWrapper__dropDown_list");

                let priceMin = null;
                let priceMax = null;

                const priceValues = [
                    '€ 150.000', '€ 200.000', '€ 250.000', '€ 300.000', '€ 350.000',
                    '€ 400.000', '€ 450.000', '€ 500.000', '€ 550.000', '€ 600.000',
                    '€ 650.000', '€ 700.000', '€ 750.000', '€ 800.000', '€ 850.000',
                    '€ 900.000', '€ 950.000', '€ 1.000.000', '€ 1.250.000', '€ 1.500.000',
                    '€ 1.750.000', '€ 2.000.000', '€ 2.500.000', '€ 3.000.000', '€ 3.500.000',
                    '€ 4.000.000', '€ 5.000.000', '€ 10.000.000', '€ 15.000.000', '€ 20.000.000'
                ];

                function renderPriceOptions() {
                    priceValues.forEach((price) => {
                        const priceItem = document.createElement("div");
                        priceItem.className = "filterPropertiesWrapper__dropDown_item";
                        priceItem.textContent = price;

                        const checkBox = document.createElement("div");
                        checkBox.className = "filterPropertiesWrapper__customCheckBox";
                        checkBox.innerHTML = `
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                            <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                                </svg>
                        `;
                        priceItem.appendChild(checkBox);
                        dropdownList.appendChild(priceItem);

                        priceItem.addEventListener("click", function(e) {
                            e.stopPropagation();
                            handlePriceSelection(priceItem.textContent.trim());
                        });
                    });
                }

                renderPriceOptions();

                function handlePriceSelection(priceText) {
                    const priceValue = parsePriceToNumber(priceText);

                    if (priceMin === null) {
                        priceMin = priceValue;
                        priceMax = null;
                    } else if (priceValue > priceMin && priceMax === null) {
                        priceMax = priceValue;
                    } else if (priceValue === priceMin) {
                        priceMin = null;
                        priceMax = null;
                    } else if (priceValue === priceMax) {
                        priceMax = null;
                    } else if (priceValue < priceMin) {
                        priceMin = priceValue;
                        priceMax = null;
                    } else if (priceValue > priceMax) {
                        priceMax = priceValue;
                    }

                    updatePricesStyles();

                    // Обновляем значения в redirectData
                    redirectData.priceMin = priceMin !== null ? priceMin : 0;
                    redirectData.priceMax = priceMax !== null ? priceMax : 0;
                }

                function updatePricesStyles() {
                    const priceElements = dropdownList.querySelectorAll(".filterPropertiesWrapper__dropDown_item");

                    priceElements.forEach((item) => {
                        const priceValue = parsePriceToNumber(item.textContent.trim());
                        const checkBox = item.querySelector(".filterPropertiesWrapper__customCheckBox");

                        checkBox.classList.remove("active");
                        item.style.opacity = "1"; // Устанавливаем начальное значение opacity для всех элементов

                        if (priceMin !== null && priceValue === priceMin) {
                            checkBox.classList.add("active");
                        } else if (priceMax !== null && priceValue === priceMax) {
                            checkBox.classList.add("active");
                        } else if (priceMin !== null && priceMax !== null && priceValue > priceMin && priceValue < priceMax) {
                            // Активируем чекбоксы между min и max
                            checkBox.classList.add("active");
                        } else if ((priceMin !== null && priceValue < priceMin) || (priceMax !== null && priceValue > priceMax)) {
                            // Если значение меньше минимального или больше максимального, делаем его прозрачным
                            item.style.opacity = "0.5";
                        }
                    });
                }

                function parsePriceToNumber(priceText) {
                    return parseInt(priceText.replace(/[€,.+]/g, ""), 10);
                }

                function syncPricesWithData() {
                    priceMin = redirectData.priceMin || null;
                    priceMax = redirectData.priceMax || null;

                    updatePricesStyles();
                }

                syncPricesWithData();

                window.addEventListener("popstate", syncPricesWithData);

                if (dropdownHeader && dropdownBody) {
                    function toggleMenu() {
                        dropdownBody.classList.toggle("active");
                        dropdownHeader.classList.toggle("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        if (dropdownBody.classList.contains("active")) {
                            svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                        } else {
                            svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                        }
                    }

                    function closeMenu() {
                        dropdownBody.classList.remove("active");
                        dropdownHeader.classList.remove("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }

                    dropdownHeader.addEventListener("click", function(e) {
                        e.stopPropagation();

                        if (dropdownBody.classList.contains("active")) {
                            closeMenu();
                        } else {
                            closeAllDropdowns();
                            toggleMenu();
                        }
                    });

                    document.addEventListener("click", function(event) {
                        if (!dropdownContainer.contains(event.target) && !dropdownHeader.contains(event.target)) {
                            closeMenu();
                        }
                    });
                } else {
                    console.warn("Menu elements (dropdownHeader or dropdownBody) not found!");
                }
            }
            setTimeout(headerDropDownPriceMobile, 0);

            function headerDropDownSizeMobile() {
                const dropdownContainer = document.querySelector("#headerSizeFilterMobile");
                const dropdownHeader = dropdownContainer.querySelector(".filterPropertiesWrapper__dropDown_header");
                const dropdownBody = dropdownContainer.querySelector(".filterPropertiesWrapper__dropDown_body");
                const dropdownList = dropdownBody.querySelector(".filterPropertiesWrapper__dropDown_list");

                let sizeMin = null;
                let sizeMax = null;

                const sizeValues = [
                    '20 sq.m', '30 sq.m', '40 sq.m', '50 sq.m', '60 sq.m',
                    '70 sq.m', '80 sq.m', '90 sq.m', '100 sq.m', '120 sq.m',
                    '140 sq.m', '160 sq.m', '180 sq.m', '200 sq.m', '220 sq.m',
                    '250 sq.m', '270 sq.m', '300 sq.m', '350 sq.m', '400 sq.m',
                    '450 sq.m', '500 sq.m', '550 sq.m', '600 sq.m', '700 sq.m',
                    '800 sq.m', '900 sq.m', '1.000 sq.m', '1.500 sq.m', '2.000 sq.m',
                    '3.000 sq.m'
                ];

                function renderSizeOptions() {
                    sizeValues.forEach((size) => {
                        const sizeItem = document.createElement("div");
                        sizeItem.className = "filterPropertiesWrapper__dropDown_item";
                        sizeItem.textContent = size;

                        const checkBox = document.createElement("div");
                        checkBox.className = "filterPropertiesWrapper__customCheckBox";
                        checkBox.innerHTML = `
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                        <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                            </svg>
                        `;
                        sizeItem.appendChild(checkBox);
                        dropdownList.appendChild(sizeItem);

                        sizeItem.addEventListener("click", function(e) {
                            e.stopPropagation();
                            handleSizeSelection(sizeItem.textContent.trim());
                        });
                    });
                }

                renderSizeOptions();

                function handleSizeSelection(sizeText) {
                    const sizeValue = parseSizeToNumber(sizeText);

                    if (sizeMin === null) {
                        sizeMin = sizeValue;
                        sizeMax = null;
                    } else if (sizeValue > sizeMin && sizeMax === null) {
                        sizeMax = sizeValue;
                    } else if (sizeValue === sizeMin) {
                        sizeMin = null;
                        sizeMax = null;
                    } else if (sizeValue === sizeMax) {
                        sizeMax = null;
                    } else if (sizeValue < sizeMin) {
                        sizeMin = sizeValue;
                        sizeMax = null;
                    } else if (sizeValue > sizeMax) {
                        sizeMax = sizeValue;
                    }

                    updateSizesStyles();

                    // Обновляем значения в redirectData
                    redirectData.sizeMin = sizeMin !== null ? sizeMin : 0;
                    redirectData.sizeMax = sizeMax !== null ? sizeMax : 0;
                }

                function updateSizesStyles() {
                    const sizeElements = dropdownList.querySelectorAll(".filterPropertiesWrapper__dropDown_item");

                    sizeElements.forEach((item) => {
                        const sizeValue = parseSizeToNumber(item.textContent.trim());
                        const checkBox = item.querySelector(".filterPropertiesWrapper__customCheckBox");

                        checkBox.classList.remove("active");
                        item.style.opacity = "1"; // Устанавливаем начальное значение opacity для всех элементов

                        if (sizeMin !== null && sizeValue === sizeMin) {
                            checkBox.classList.add("active");
                        } else if (sizeMax !== null && sizeValue === sizeMax) {
                            checkBox.classList.add("active");
                        } else if (sizeMin !== null && sizeMax !== null && sizeValue > sizeMin && sizeValue < sizeMax) {
                            // Активируем чекбоксы между sizeMin и sizeMax
                            checkBox.classList.add("active");
                        } else if ((sizeMin !== null && sizeValue < sizeMin) || (sizeMax !== null && sizeValue > sizeMax)) {
                            // Если значение меньше минимального или больше максимального, делаем его прозрачным
                            item.style.opacity = "0.5";
                        }
                    });
                }

                function parseSizeToNumber(sizeText) {
                    return parseInt(sizeText.replace(/[m².,+]/g, "").replace(/\./g, ""), 10);
                }

                function syncSizesWithData() {
                    sizeMin = redirectData.sizeMin || null;
                    sizeMax = redirectData.sizeMax || null;

                    updateSizesStyles();
                }

                syncSizesWithData();

                window.addEventListener("popstate", syncSizesWithData);

                if (dropdownHeader && dropdownBody) {
                    function toggleMenu() {
                        dropdownBody.classList.toggle("active");
                        dropdownHeader.classList.toggle("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        if (dropdownBody.classList.contains("active")) {
                            svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                        } else {
                            svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                        }
                    }

                    function closeMenu() {
                        dropdownBody.classList.remove("active");
                        dropdownHeader.classList.remove("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }

                    dropdownHeader.addEventListener("click", function(e) {
                        e.stopPropagation();

                        if (dropdownBody.classList.contains("active")) {
                            closeMenu();
                        } else {
                            closeAllDropdowns();
                            toggleMenu();
                        }
                    });

                    document.addEventListener("click", function(event) {
                        if (!dropdownContainer.contains(event.target) && !dropdownHeader.contains(event.target)) {
                            closeMenu();
                        }
                    });
                } else {
                    console.warn("Menu elements (dropdownHeader or dropdownBody) not found!");
                }
            }
            setTimeout(headerDropDownSizeMobile, 0);

            function headerDropDownHandoverMobile() {
                const dropdownContainer = document.querySelector("#headerHandoverFilterMobile");
                const dropdownHeader = dropdownContainer.querySelector(".filterPropertiesWrapper__dropDown_header");
                const dropdownBody = dropdownContainer.querySelector(".filterPropertiesWrapper__dropDown_body");
                const dropdownList = dropdownBody.querySelector(".filterPropertiesWrapper__dropDown_list");

                let handoverMin = null;
                let handoverMax = null;

                const handoverValues = [
                    "Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024",
                    "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025",
                    "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"
                ];

                function renderHandoverOptions() {
                    handoverValues.forEach((handover) => {
                        const handoverItem = document.createElement("div");
                        handoverItem.className = "filterPropertiesWrapper__dropDown_item";
                        handoverItem.textContent = handover;

                        const checkBox = document.createElement("div");
                        checkBox.className = "filterPropertiesWrapper__customCheckBox";
                        checkBox.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
<path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
    </svg>
`;
                        handoverItem.appendChild(checkBox);
                        dropdownList.appendChild(handoverItem);

                        handoverItem.addEventListener("click", function(e) {
                            e.stopPropagation();
                            handleHandoverSelection(handoverItem.textContent.trim());
                        });
                    });
                }

                renderHandoverOptions();

                function handleHandoverSelection(handoverText) {
                    const dateValue = handoverText;

                    if (handoverMin === null) {
                        handoverMin = dateValue;
                        handoverMax = null;
                    } else if (compareDates(dateValue, handoverMin) > 0 && handoverMax === null) {
                        handoverMax = dateValue;
                    } else if (dateValue === handoverMin) {
                        handoverMin = null;
                        handoverMax = null;
                    } else if (dateValue === handoverMax) {
                        handoverMax = null;
                    } else if (compareDates(dateValue, handoverMin) < 0) {
                        handoverMin = dateValue;
                        handoverMax = null;
                    } else if (compareDates(dateValue, handoverMax) > 0) {
                        handoverMax = dateValue;
                    }

                    updateHandoversStyles();

                    // Обновляем значения в redirectData
                    redirectData.handoverMin = handoverMin ? convertToISODate(handoverMin) : 0;
                    redirectData.handoverMax = handoverMax ? convertToISODate(handoverMax) : 0;
                }

                function updateHandoversStyles() {
                    const handoverElements = dropdownList.querySelectorAll(".filterPropertiesWrapper__dropDown_item");

                    handoverElements.forEach((item) => {
                        const dateValue = item.textContent.trim();
                        const checkBox = item.querySelector(".filterPropertiesWrapper__customCheckBox");

                        checkBox.classList.remove("active");
                        item.style.opacity = "1"; // Устанавливаем начальное значение opacity для всех элементов

                        if (handoverMin !== null && dateValue === handoverMin) {
                            checkBox.classList.add("active");
                        } else if (handoverMax !== null && dateValue === handoverMax) {
                            checkBox.classList.add("active");
                        } else if (
                            handoverMin !== null && handoverMax !== null &&
                            compareDates(dateValue, handoverMin) >= 0 && compareDates(dateValue, handoverMax) <= 0
                        ) {
                            // Активируем чекбоксы для значений между handoverMin и handoverMax
                            checkBox.classList.add("active");
                        } else if (
                            (handoverMin !== null && compareDates(dateValue, handoverMin) < 0) ||
                            (handoverMax !== null && compareDates(dateValue, handoverMax) > 0)
                        ) {
                            // Если значение меньше минимального или больше максимального, делаем его прозрачным
                            item.style.opacity = "0.5";
                        }
                    });
                }

                function convertToISODate(handoverText) {
                    const [quarter, year] = handoverText.split(" ");
                    const month = {
                        Q1: "01",
                        Q2: "04",
                        Q3: "07",
                        Q4: "10",
                    } [quarter];
                    return `${year}-${month}-01`;
                }

                function compareDates(dateText1, dateText2) {
                    const [quarter1, year1] = dateText1.split(" ");
                    const [quarter2, year2] = dateText2.split(" ");
                    const month1 = {
                        Q1: "01",
                        Q2: "04",
                        Q3: "07",
                        Q4: "10"
                    } [quarter1];
                    const month2 = {
                        Q1: "01",
                        Q2: "04",
                        Q3: "07",
                        Q4: "10"
                    } [quarter2];

                    const date1 = new Date(`${year1}-${month1}-01`);
                    const date2 = new Date(`${year2}-${month2}-01`);

                    if (date1 < date2) return -1;
                    if (date1 > date2) return 1;
                    return 0;
                }

                function syncHandoversWithData() {
                    handoverMin = redirectData.handoverMin ? convertFromISODate(redirectData.handoverMin) : null;
                    handoverMax = redirectData.handoverMax ? convertFromISODate(redirectData.handoverMax) : null;

                    updateHandoversStyles();
                }

                function convertFromISODate(isoDate) {
                    const [year, month] = isoDate.split("-");
                    const quarter = {
                        "01": "Q1",
                        "04": "Q2",
                        "07": "Q3",
                        "10": "Q4",
                    } [month];
                    return `${quarter} ${year}`;
                }

                syncHandoversWithData();

                window.addEventListener("popstate", syncHandoversWithData);

                if (dropdownHeader && dropdownBody) {
                    function toggleMenu() {
                        dropdownBody.classList.toggle("active");
                        dropdownHeader.classList.toggle("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        if (dropdownBody.classList.contains("active")) {
                            svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                        } else {
                            svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                        }
                    }

                    function closeMenu() {
                        dropdownBody.classList.remove("active");
                        dropdownHeader.classList.remove("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }

                    dropdownHeader.addEventListener("click", function(e) {
                        e.stopPropagation();

                        if (dropdownBody.classList.contains("active")) {
                            closeMenu();
                        } else {
                            closeAllDropdowns();
                            toggleMenu();
                        }
                    });

                    document.addEventListener("click", function(event) {
                        if (!dropdownContainer.contains(event.target) && !dropdownHeader.contains(event.target)) {
                            closeMenu();
                        }
                    });
                } else {
                    console.warn("Menu elements (dropdownHeader or dropdownBody) not found!");
                }
            }
            setTimeout(headerDropDownHandoverMobile, 0);

            function headerDropDownLocationMobile() {
                const dropdownContainer = document.querySelector("#headerLocationFilterMobile");
                const dropdownHeader = dropdownContainer.querySelector(".filterPropertiesWrapper__dropDown_header");
                const dropdownBody = dropdownContainer.querySelector(".filterPropertiesWrapper__dropDown_body");
                const dropdownList = dropdownBody.querySelector(".filterPropertiesWrapper__dropDown_list");

                let selectedLocations = new Set(redirectData.areas);

                function renderLocationOptions() {
                    areasData.forEach((area) => {
                        const areaItem = document.createElement("div");
                        areaItem.className = "filterPropertiesWrapper__dropDown_item";

                        // Создаем обертку для основного названия территории
                        const mainListSelectedWrapper = document.createElement("div");
                        mainListSelectedWrapper.className = "mainListSelectedWrapper";

                        // Создаем div для отображения выбранных субтерриторий
                        const mainListSelected = document.createElement("div");
                        mainListSelected.className = "mainListSelected";

                        // Вставляем текст названия территории
                        mainListSelectedWrapper.appendChild(mainListSelected);
                        mainListSelectedWrapper.append(area.label);

                        // Добавляем обертку с названием в основной элемент
                        areaItem.appendChild(mainListSelectedWrapper);

                        // Создаем иконку стрелки и добавляем её
                        const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        icon.setAttribute("width", "24");
                        icon.setAttribute("height", "24");
                        icon.setAttribute("viewBox", "0 0 24 24");
                        icon.setAttribute("fill", "none");
                        icon.innerHTML = `<path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
                        areaItem.appendChild(icon);

                        // Создание списка подтерриторий
                        const subAreaList = document.createElement("div");
                        subAreaList.className =
                            "filterPropertiesWrapper__dropDownLocationsWrapper_list";
                        subAreaList.style.display = "none"; // Скрываем подтерритории изначально

                        // Создаем кнопку "All"
                        const selectAllItem = document.createElement("div");
                        selectAllItem.className = "filterPropertiesWrapper__dropDown_item selectAll";
                        selectAllItem.innerHTML = `All<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px"></svg>`;
                        const selectAllCheckBox = document.createElement("div");
                        selectAllCheckBox.className = "filterPropertiesWrapper__customCheckBox";
                        selectAllItem.appendChild(selectAllCheckBox);

                        selectAllItem.addEventListener("click", function(e) {
                            e.stopPropagation();
                            handleSelectAll(area.subAreas);
                        });

                        subAreaList.appendChild(selectAllItem);

                        // Добавляем подтерритории
                        area.subAreas.forEach((subArea) => {
                            const subAreaItem = document.createElement("div");
                            subAreaItem.className =
                                "filterPropertiesWrapper__dropDown_item location";
                            subAreaItem.textContent = subArea.newLabel;

                            const subAreaCheckBox = document.createElement("div");
                            subAreaCheckBox.className =
                                "filterPropertiesWrapper__customCheckBox";

                            subAreaItem.appendChild(subAreaCheckBox); // Добавляем чекбокс

                            subAreaItem.addEventListener("click", function(e) {
                                e.stopPropagation();
                                handleSubAreaSelection(subArea.value, area.subAreas);
                            });

                            subAreaList.appendChild(subAreaItem);
                        });

                        // Добавляем обработчик нажатия для главной территории
                        areaItem.addEventListener("click", function(e) {
                            e.stopPropagation();
                            const isActive = subAreaList.style.display === "block";
                            subAreaList.style.display = isActive ? "none" : "block";
                            // Устанавливаем класс active у подтерриторий
                            subAreaList.classList.toggle("active", !isActive);
                            areaItem.classList.toggle("active", !isActive); // Устанавливаем класс active у главной территории
                        });

                        dropdownList.appendChild(areaItem);
                        dropdownList.appendChild(subAreaList);
                    });

                    // После рендеринга вызываем обновление стилей, чтобы правильно отобразить состояние чекбокса "All"
                    updateLocationsStyles();
                }

                renderLocationOptions();

                function handleSelectAll(subAreas) {
                    const allSelected = subAreas.every(subArea => selectedLocations.has(subArea.value));
                    if (allSelected) {
                        subAreas.forEach(subArea => selectedLocations.delete(subArea.value));
                    } else {
                        subAreas.forEach(subArea => selectedLocations.add(subArea.value));
                    }
                    updateLocationsStyles();
                    redirectData.areas = Array.from(selectedLocations);
                }

                function handleSubAreaSelection(subAreaValue, subAreas) {
                    if (selectedLocations.has(subAreaValue)) {
                        selectedLocations.delete(subAreaValue);
                    } else {
                        selectedLocations.add(subAreaValue);
                    }
                    updateLocationsStyles(subAreas);
                    redirectData.areas = Array.from(selectedLocations);
                }

                function updateLocationsStyles() {
                    // Обновляем состояния чекбоксов для подтерриторий
                    dropdownList.querySelectorAll(".filterPropertiesWrapper__dropDown_item.location").forEach((item) => {
                        const subAreaValue = item.textContent.trim();
                        const checkBox = item.querySelector(".filterPropertiesWrapper__customCheckBox");

                        if (selectedLocations.has(subAreaValue)) {
                            checkBox.classList.add("active");
                            checkBox.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
<path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
</svg>`;
                        } else {
                            checkBox.classList.remove("active");
                            checkBox.innerHTML = ""; // Удаляем SVG, если не выбрано
                        }
                    });

                    // Обновляем счетчик выбранных подтерриторий и состояние mainListSelected
                    dropdownList.querySelectorAll(".mainListSelectedWrapper").forEach((mainListWrapper) => {
                        const areaLabel = mainListWrapper.textContent.trim().replace(/[0-9]+/g, '').trim(); // Убираем число, если оно добавляется автоматически
                        const area = areasData.find(area => area.label === areaLabel);

                        if (area) {
                            const selectedSubAreasCount = area.subAreas.filter(subArea => selectedLocations.has(subArea.value)).length;
                            const mainListSelected = mainListWrapper.querySelector(".mainListSelected");

                            if (selectedSubAreasCount > 0) {
                                mainListSelected.classList.add("active");
                                mainListSelected.textContent = selectedSubAreasCount;
                            } else {
                                mainListSelected.classList.remove("active");
                                mainListSelected.textContent = ""; // Очищаем текст, если ничего не выбрано
                            }
                        }
                    });

                    // Обновляем состояние кнопки "All" для каждой области
                    dropdownList.querySelectorAll(".filterPropertiesWrapper__dropDown_item.selectAll").forEach((selectAllItem) => {
                        const checkBox = selectAllItem.querySelector(".filterPropertiesWrapper__customCheckBox");

                        // Обнаружение родительской области более точно
                        const areaWrapper = selectAllItem.closest('.filterPropertiesWrapper__dropDownLocationsWrapper_list').previousElementSibling;
                        const areaLabel = areaWrapper ? areaWrapper.textContent.trim().replace(/[0-9]+/g, '').trim() : '';
                        const area = areasData.find(area => area.label === areaLabel);

                        if (area) {
                            const allSelected = area.subAreas.every(subArea => selectedLocations.has(subArea.value));

                            if (allSelected && area.subAreas.length > 0) {
                                checkBox.classList.add("active");
                                checkBox.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
<path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
</svg>`;
                            } else {
                                checkBox.classList.remove("active");
                                checkBox.innerHTML = ""; // Убираем активное состояние, если не все выбрано
                            }
                        }
                    });
                }
                dropdownHeader.addEventListener("click", function(e) {
                    e.stopPropagation();

                    if (dropdownBody.classList.contains("active")) {
                        closeMenu();
                    } else {
                        closeAllDropdowns();
                        toggleMenu();
                    }
                });

                document.addEventListener("click", function(event) {
                    if (!dropdownContainer.contains(event.target)) {
                        closeMenu();
                    }
                });

                function toggleMenu() {
                    dropdownBody.classList.toggle("active");
                    dropdownHeader.classList.toggle("active");

                    const svgPath = dropdownHeader.querySelector("svg path");
                    if (dropdownBody.classList.contains("active")) {
                        svgPath.setAttribute("d", "M7 14L12 10L17 14");
                    } else {
                        svgPath.setAttribute("d", "M7 10L12 14L17 10");
                    }
                }

                function closeMenu() {
                    dropdownBody.classList.remove("active");
                    dropdownHeader.classList.remove("active");

                    const svgPath = dropdownHeader.querySelector("svg path");
                    svgPath.setAttribute("d", "M7 10L12 14L17 10");
                }

                function closeAllDropdowns() {
                    document.querySelectorAll(".filterPropertiesWrapper__dropDown_body.active")
                        .forEach((body) => body.classList.remove("active"));
                    document.querySelectorAll(".filterPropertiesWrapper__dropDown_header.active")
                        .forEach((header) => header.classList.remove("active"));

                    document.querySelectorAll(".filterPropertiesWrapper__dropDown_header svg path")
                        .forEach((svgIcon) => {
                            svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                        });
                }
            }
            setTimeout(headerDropDownLocationMobile, 0);

            function clearHeaderFilters() {
                const clearBtn = document.querySelector("#clearBtnHeaderFilterAdaptive");

                if (!clearBtn) {
                    console.warn("Clear button not found!");
                    return;
                }

                clearBtn.addEventListener("click", function() {
                    // Сбрасываем значения в redirectData
                    redirectData.bedrooms = [];
                    redirectData.priceMin = 0;
                    redirectData.priceMax = 0;
                    redirectData.sizeMin = 0;
                    redirectData.sizeMax = 0;
                    redirectData.handoverMin = 0;
                    redirectData.handoverMax = 0;
                    redirectData.areas = [];
                    redirectData.visible = "Off plan";

                    // Сбрасываем стили и значения фильтров
                    document.querySelectorAll(".header .filtersMap__select-body p").forEach((item) => {
                        item.style.opacity = "1";
                    });

                    // 					// Удаление всех активных чекбоксов только внутри .adaptiveFilters__main
                    document.querySelectorAll(".header .filterPropertiesWrapper__customCheckBox.active").forEach((checkBox) => {
                        checkBox.classList.remove("active");
                    });

                    console.log(redirectData);
                });
            }
            setTimeout(clearHeaderFilters, 0);

            // IDs для отображения фильтров (moved outside function to avoid scope issues)
            const headerBedroomsContainer = document.getElementById("selectValueHeaderBedrooms");
            const headerPriceContainer = document.getElementById("selectValueHeaderPrice");
            const headerSizeContainer = document.getElementById("selectValueHeaderSize");
            const headerPropertyTypeContainer = document.getElementById("selectValueHeaderPropertyType");
            const headerHandoverContainer = document.getElementById("selectValueHeaderHandover");
            const headerLocationContainer = document.getElementById("selectValueHeaderFilterLocation");

            function renderValueFilterFromRedirectData() {

                // Очистка элементов перед обновлением
                clearFilterValues();

                // Bedrooms
                if (redirectData.bedrooms.length > 0 && headerBedroomsContainer) {
                    headerBedroomsContainer.innerHTML = ""; // Очищаем перед добавлением
                    redirectData.bedrooms.forEach((bedroom) => {
                        addFilterItem(headerBedroomsContainer, `Bedroom: ${bedroom}`);
                    });
                }

                // Price
                if ((redirectData.priceMin > 0 || redirectData.priceMax > 0) && headerPriceContainer) {
                    let priceText = "€ ";

                    if (redirectData.priceMin > 0) {
                        priceText += formatPrice(redirectData.priceMin);
                    }
                    if (redirectData.priceMax > 0) {
                        priceText += " - " + formatPrice(redirectData.priceMax);
                    }

                    if (redirectData.priceMin > 0 || redirectData.priceMax > 0) {
                        addFilterItem(headerPriceContainer, priceText);
                    }
                }

                // Size
                if ((redirectData.sizeMin > 0 || redirectData.sizeMax > 0) && headerSizeContainer) {
                    let sizeText = "";

                    if (redirectData.sizeMin > 0 && redirectData.sizeMax > 0) {
                        sizeText = `${redirectData.sizeMin} - ${redirectData.sizeMax} sq.m`;
                    } else if (redirectData.sizeMin > 0) {
                        sizeText = `From ${redirectData.sizeMin} sq.m`;
                    }

                    if (sizeText) {
                        addFilterItem(headerSizeContainer, sizeText);
                    }
                }
                // Property type
                if ((redirectData.typeMin > 0 || redirectData.typeMax > 0) && headerPropertyTypeContainer) {
                    let typeText = "";

                    if (redirectData.typeMin > 0 && redirectData.typeMax > 0) {
                        typeText = `${redirectData.typeMin} - ${redirectData.typeMax} sq.m`;
                    } else if (redirectData.typeMin > 0) {
                        typeText = `${redirectData.typeMin}`;
                    }

                    if (typeText) {
                        addFilterItem(headerPropertyTypeContainer, typeText);
                    }
                }

                // Handover
                if ((redirectData.handoverMin || redirectData.handoverMax) && headerHandoverContainer) {
                    let handoverText = "";

                    if (redirectData.handoverMin && redirectData.handoverMax) {
                        handoverText = `${formatHandoverDate(redirectData.handoverMin)} - ${formatHandoverDate(redirectData.handoverMax)}`;
                    } else if (redirectData.handoverMin) {
                        handoverText = `From ${formatHandoverDate(redirectData.handoverMin)}`;
                    }

                    if (handoverText) {
                        addFilterItem(headerHandoverContainer, handoverText);
                    }
                }

                // Location (areas)
                if (redirectData.areas.length > 0 && headerLocationContainer) {
                    headerLocationContainer.innerHTML = ""; // Очищаем перед добавлением
                    redirectData.areas.forEach((location) => {
                        addFilterItem(headerLocationContainer, `${location}`);
                    });
                }

                // Функция для добавления элемента фильтра
                function addFilterItem(container, text) {
                    const filterItem = document.createElement("div");
                    filterItem.className = "propertiesSelectedFilter__item";

                    const filterTitle = document.createElement("span");
                    filterTitle.className = "propertiesSelectedFilter__item_title";
                    filterTitle.textContent = text;

                    filterItem.appendChild(filterTitle);
                    container.appendChild(filterItem);
                }

                // Функция очистки всех значений фильтров
                function clearFilterValues() {
                    if (headerBedroomsContainer) headerBedroomsContainer.innerHTML = "";
                    if (headerPriceContainer) headerPriceContainer.innerHTML = "";
                    if (headerSizeContainer) headerSizeContainer.innerHTML = "";
                    if (headerHandoverContainer) headerHandoverContainer.innerHTML = "";
                    if (headerLocationContainer) headerLocationContainer.innerHTML = "";
                }

                // Функция форматирования цены
                function formatPrice(price) {
                    const num = parseInt(price, 10);
                    if (num >= 1000000) {
                        return num / 1000000 + "M";
                    } else if (num >= 1000) {
                        return num / 1000 + "K";
                    }
                    return num.toString();
                }

                // Функция форматирования handover даты
                function formatHandoverDate(date) {
                    const [year, month] = date.split("-");
                    const quarter = Math.ceil(parseInt(month, 10) / 3);
                    return `Q${quarter} ${year}`;
                }
            }

            window.addEventListener("DOMContentLoaded", () => {
                renderValueFilterFromRedirectData();

                // Создаем копию redirectData для сравнения изменений
                let previousRedirectData = JSON.stringify(redirectData);

                // Добавляем таймер для проверки изменений в redirectData
                setInterval(() => {
                    const currentRedirectData = JSON.stringify(redirectData);
                    if (currentRedirectData !== previousRedirectData) {
                        previousRedirectData = currentRedirectData;
                        renderValueFilterFromRedirectData(); // Рендерим фильтры при изменении данных
                    }
                }, 500);
            });

            function handleBtnRedirectHeader() {
                const confirmBtn = document.getElementById("redirectFilterHeader");

                confirmBtn.addEventListener("click", () => {
                    // Создаем новый объект URLSearchParams для параметров запроса
                    let urlParams = new URLSearchParams();

                    // Устанавливаем значение "page" всегда на 0
                    urlParams.set("page", "0");

                    // Устанавливаем значение "visible" как "Off plan" по умолчанию
                    const visible = redirectData.visible || "Secondary";
                    urlParams.set("visible", visible)

                    // Добавляем значения из redirectData в параметры URL, если они указаны
                    if (redirectData.bedrooms.length > 0) {
                        urlParams.set("bedrooms", redirectData.bedrooms.join(","));
                    }

                    if (redirectData.priceMin > 0) {
                        urlParams.set("minPrice", redirectData.priceMin.toString());
                    }

                    if (redirectData.priceMax > 0) {
                        urlParams.set("maxPrice", redirectData.priceMax.toString());
                    }

                    if (redirectData.sizeMin > 0) {
                        urlParams.set("minSize", redirectData.sizeMin.toString());
                    }

                    if (redirectData.sizeMax > 0) {
                        urlParams.set("maxSize", redirectData.sizeMax.toString());
                    }

                    if (redirectData.handoverMin) {
                        urlParams.set("handoverMin", redirectData.handoverMin);
                    }

                    if (redirectData.handoverMax) {
                        urlParams.set("handoverMax", redirectData.handoverMax);
                    }

                    if (redirectData.areas.length > 0) {
                        urlParams.set("subAreas", redirectData.areas.map(area => encodeURIComponent(area)).join(","));
                    }

                    // Определяем новый путь в зависимости от значения "visible"
                    let newPath = "";
                    if (visible === "Secondary") {
                        newPath = "secondaries";
                    } else if (visible === "Off plan") {
                        newPath = "new-buildings";
                    } else {
                        // Устанавливаем "new-buildings" по умолчанию, если значение "visible" неизвестно
                        newPath = "new-buildings";
                    }

                    // Формируем полный URL
                    const newFullPath = `${newPath}?${urlParams.toString()}`;

                    // Перенаправляем на новый URL
                    const newUrl = `${window.location.origin}/${newFullPath}`;
                    window.location.replace(newUrl);
                });
            }
            setTimeout(handleBtnRedirectHeader, 0);

            window.addEventListener("scroll", updateFixedMenueVisibility);
            window.addEventListener("resize", updateFixedMenueVisibility);
            window.addEventListener("resize", updateHeaderMap);
            // Инициализируем начальное состояние fixedMenue
            updateFixedMenueVisibility();
            updateHeaderMap();
            const logoContainer = createElement("div");
            logoDiv.appendChild(logoContainer);

            const logoImg = createElement("img");
            logoImg.setAttribute("src", "/icons/shared/logo.svg");
            logoImg.setAttribute("alt", "pro-part-logo");
            logoImg.className = "logoImg";
            logoContainer.appendChild(logoImg);

            const navItems = [{
                    text: "Home",
                    url: `${language && "/" + language}/`
                },
                {
                    text: "New building",
                    url: `${language && "/" + language}/new-buildings?visible=Off+plan`
                },
                {
                    text: "Secondary",
                    url: `${language && "/" + language}/secondaries?page=1&visible=Secondary`,
                },
                {
                    text: "Rent",
                    url: `${language && "/" + language}/rent?page=1&visible=Rent`
                },
                {
                    text: "Map",
                    url: `${language && "/" + language}/map?visible=Off+plan`
                },
                {
                    text: "Areas",
                    url: `${language && "/" + language}/areas`
                },
                {
                    text: "Consulting",
                    url: `${language && "/" + language}/consulting`
                },
                {
                    text: "Blog",
                    url: `${language && "/" + language}/blogs`
                },
            ];

            const navbar = document.getElementById('bottom-navbar');

            // Create and append navigation links
            navItems.forEach(item => {
                const link = document.createElement('a');
                link.href = item.url;
                link.textContent = item.text;
                navbar.appendChild(link);
            });

            const callUsButtonBottom = document.createElement('button');
            callUsButtonBottom.className = 'button callUsButtonWhite';
            callUsButtonBottom.onclick = () => {
                window.location.href = 'tel:+34695113333';
            };

            navbar.appendChild(callUsButtonBottom);

            // Handle scroll event
            let lastScrollY = window.scrollY;

            window.addEventListener('scroll', () => {
                if (window.scrollY > 0) {
                    navbar.classList.add('show');
                } else {
                    navbar.classList.remove('show');
                }
                lastScrollY = window.scrollY;
            });

            navItems.forEach(({
                text,
                url
            }) => {
                navList.appendChild(createNavItem(text, url));
            });

            navItems.forEach(({
                text,
                url
            }) => {
                navListBtm.appendChild(createNavItem(text, url));
            });

            const callUsButton = createElement("button");
            callUsButton.className = "button callUsButton";

            callUsButton.onclick = () => {
                window.location.href = "tel:+34695113333";
            };
            const callUsText = createElement("span");
            callUsText.className = "callUsText";
            callUsText.innerText = "Call Us";
            callUsButton.appendChild(callUsText);
            socialDiv.appendChild(callUsButton);

            const likeButton = createElement("button");
            likeButton.className = "button likeButton";
            likeButton.addEventListener("click", function() {
                window.location.href = `${language && "/" + language}/liked-projects`;
            })
            socialDiv.appendChild(likeButton);

            const shareButton = createElement("button");
            shareButton.className = "button shareButton";
            socialDiv.appendChild(shareButton);

            const menuButton = createElement("button");
            menuButton.className = "button menuButton";
            socialDiv.appendChild(menuButton);

            shareButton.innerText = "EN";

            const languageDropdown = createElement("ul");
            languageDropdown.className = "language-dropdown";
            languageDropdown.style.display = "none";
            socialDiv.appendChild(languageDropdown);


            const languages = [{
                    code: "EN",
                    name: "English",
                    flagUrl: "<?php echo get_template_directory_uri(); ?>/icons/shared/lang-icon/united-kingdom.svg",
                },
                {
                    code: "RU",
                    name: "Russian",
                    flagUrl: "<?php echo get_template_directory_uri(); ?>/icons/shared/lang-icon/russia.svg",
                },
            ];


            let activeLanguageItem = language.toUpperCase();
            const currentPath = window.location.pathname;

            function updateLanguage(lang) {
                const currentPath = window.location.pathname; // Получаем текущий путь
                const currentQuery = window.location.search; // Получаем квери-параметры (например, ?page=1&filter=on)
                let newPath;

                // Если язык — английский, убираем языковой префикс
                if (lang.code === 'EN') {
                    // Убираем языковой префикс, если текущий путь начинается с допустимого языка
                    newPath = currentPath.split('/').filter(segment => !allowedLanguages.includes(segment)).join('/');
                    // Если после удаления префикса путь пустой, перенаправляем на "/"
                    newPath = newPath ? newPath : '/';
                } else {
                    // Если язык не английский, добавляем префикс языка
                    newPath = `/${lang.code.toLowerCase()}${currentPath}`;

                    // Проверяем, нет ли уже префикса в URL, чтобы не дублировать его
                    allowedLanguages.forEach(language => {
                        if (newPath.startsWith(`/${language}`)) {
                            newPath = `/${lang.code.toLowerCase()}${currentPath.replace(`/${language}`, '')}`;
                        }
                    });
                }

                // Добавляем query параметры к новому пути, если они есть
                newPath += currentQuery;

                // Убедимся, что путь всегда начинается с "/"
                return newPath.startsWith('/') ? newPath : `/${newPath}`;
            }

            languages.forEach((lang) => {
                const listItem = createElement("a");
                listItem.className = "language-item";
                listItem.href = updateLanguage({
                    code: lang.code
                })
                const flagImage = createElement("img");
                flagImage.src = lang.flagUrl;
                flagImage.alt = `${lang.name} flag`;
                flagImage.className = "language-flag";
                listItem.appendChild(flagImage);

                const langText = createElement("span");
                langText.innerText = `${lang.code}`;
                listItem.appendChild(langText);

                if (!activeLanguageItem) {
                    flagImage.classList.add("item--active");
                    activeLanguageItem = flagImage;
                    shareButton.innerText = lang.code;
                }

                if (activeLanguageItem === lang.code) {
                    flagImage.classList.add("item--active");
                    activeLanguageItem = flagImage;
                    shareButton.innerText = lang.code;
                }
                listItem.onclick = () => {
                    shareButton.innerText = lang.code;
                    languageDropdown.style.display = "none";

                    if (activeLanguageItem) {
                        activeLanguageItem.classList.remove("item--active");
                    }

                    flagImage.classList.add("item--active");
                    activeLanguageItem = flagImage;
                };

                languageDropdown.appendChild(listItem);
            });
            shareButton.onclick = (event) => {
                event.stopPropagation();
                languageDropdown.style.display =
                    languageDropdown.style.display === "none" ? "grid" : "none";
            };

            document.addEventListener("click", (event) => {
                const isClickInside = socialDiv.contains(event.target);
                if (!isClickInside) {
                    languageDropdown.style.display = "none";
                }
            });

            const currentHash = window.location.hash.slice(1);

            window.addEventListener("popstate", () => {
                if (navBtm.classList.contains("showNavBottom1")) {
                    navBtm.classList.remove("showNavBottom1");
                    navBtm.classList.add("showNavBottom");
                }

                if (!nav.classList.contains("showNav")) {
                    document.body.style.overflow = "";
                }
            });

            const fixedMenueCloseBtn = document.createElement("button");
            fixedMenueCloseBtn.className = "closeNavBottom";
            nav.appendChild(fixedMenueCloseBtn);

            fixedBtn.addEventListener("click", () => {
                nav.classList.toggle("showNav");
                fixedMenue.classList.toggle("close");
                fixedMenueCloseBtn.classList.toggle("visible");
                if (nav.classList.contains("showNav")) {
                    document.body.style.overflow = "hidden";
                } else {
                    document.body.style.overflow = "";
                }

                if (currentHash === "secondary" && window.innerWidth <= 768) {
                    navBtm.classList.toggle("showNavBottom1");
                    navBtm.classList.toggle("showNavBottom");
                }
            });
            fixedMenueCloseBtn.addEventListener("click", () => {
                nav.classList.toggle("showNav");
                fixedMenue.classList.toggle("close");
                fixedMenueCloseBtn.classList.toggle("visible");
                if (nav.classList.contains("showNav")) {
                    document.body.style.overflow = "hidden";
                } else {
                    document.body.style.overflow = "";
                }

                if (currentHash === "secondary" && window.innerWidth <= 768) {
                    navBtm.classList.toggle("showNavBottom1");
                    navBtm.classList.toggle("showNavBottom");
                }
            });
            if (filterMobileBurgerMenu) {
                filterMobileBurgerMenu.addEventListener("click", () => {
                    nav.classList.toggle("showNav");
                    filterMobileBurgerMenu.classList.toggle("showBtn");
                    if (nav.classList.contains("showNav")) {
                        document.body.style.overflow = "hidden";
                    } else {
                        document.body.style.overflow = "";
                    }

                    if (currentHash === "secondary" && window.innerWidth <= 768) {
                        navBtm.classList.toggle("showNavBottom1");
                        navBtm.classList.toggle("showNavBottom");
                    }
                });
            }
            menuButton.addEventListener("click", () => {
                nav.classList.toggle("showNav");
                shareButton.classList.toggle("showNavBtn");
                likeButton.classList.toggle("showNavBtnLike");
                menuButton.classList.toggle("showNavBtnClose");
                if (nav.classList.contains("showNav")) {
                    document.body.style.overflow = "hidden";
                } else {
                    document.body.style.overflow = "";
                }

                if (currentHash === "secondary" && window.innerWidth <= 768) {
                    navBtm.classList.toggle("showNavBottom1");
                    navBtm.classList.toggle("showNavBottom");
                }
            });

            window.addEventListener("popstate", () => {
                if (navBtm.classList.contains("showNavBottom1")) {
                    navBtm.classList.remove("showNavBottom1");
                    navBtm.classList.add("showNavBottom");
                }

                if (!nav.classList.contains("showNav")) {
                    document.body.style.overflow = "";
                }
            });

            const handleScroll = () => {
                const scrollPosition = window.scrollY + window.innerHeight;
                const pageHeight = document.documentElement.scrollHeight;

                if (scrollPosition >= pageHeight) {
                    header.style.transition = "opacity 0.5s";
                    header.style.opacity = "0";
                } else {
                    header.style.opacity = "1";
                }
            };

            window.addEventListener("scroll", handleScroll);

            const updateActiveNavItem = () => {
                const navLinks = document.querySelectorAll(".navLink");
                let currentRoute = window.location.pathname;
                currentRoute = currentRoute.endsWith('/') ? currentRoute.slice(0, -1) : currentRoute;

                navLinks.forEach((link) => {
                    const href = link.getAttribute("href");
                    let linkRoute = href.startsWith('/') ? href : `/${href}`;
                    linkRoute = linkRoute.endsWith('/') ? linkRoute.slice(0, -1) : linkRoute;

                    if (link.classList.contains("active")) {
                        nav.classList.remove("showNav");
                        menuButton.classList.remove("menuActive");
                    }

                    // Используем includes для проверки соответствия маршрутов с query параметрами
                    if (
                        currentRoute.includes("/secondary") ||
                        currentRoute.includes("/secondary-projects")
                    ) {
                        if (window.innerWidth <= 1440) {
                            link.classList.add("navLink-active");
                            link.classList.remove("active");
                        } else {
                            link.classList.remove("navLink-active");
                        }
                    } else {
                        link.classList.remove("navLink-active");
                    }

                    if (linkRoute.includes(currentRoute)) {
                        link.classList.add("active");
                        if (
                            (currentRoute.includes("/secondary") ||
                                currentRoute.includes("/secondary-projects")) &&
                            window.innerWidth <= 1440
                        ) {
                            link.classList.add("active-bottom");
                        }
                    } else {
                        link.classList.remove("active");
                    }
                });

                // Устанавливаем стили nav и header в зависимости от маршрута и ширины окна
                if (
                    (currentRoute.includes("/secondary") || currentRoute.includes("/secondary-projects")) &&
                    window.innerWidth <= 1440
                ) {
                    navLinks.forEach((link) => {
                        nav.style.display = "flex";
                        if (header.classList.contains("header-bottom")) {
                            header.style.justifyContent = "center";
                        } else {
                            header.style.justifyContent = "";
                        }
                    });
                } else {
                    nav.style.display = "";
                    header.style.justifyContent = "";
                }

                if (
                    (currentRoute.includes("/secondary") || currentRoute.includes("/secondary-projects")) &&
                    window.innerWidth <= 1440
                ) {
                    logoDiv.style.display = "none";
                    socialDiv.style.display = "none";

                    header.classList.add("header-bottom");
                    header.classList.remove("header-hidden");
                    nav.classList.add("nav-bottom");
                } else {
                    logoDiv.style.display = "block";
                    socialDiv.style.display = "flex";

                    header.classList.remove("header-bottom");
                    header.classList.remove("header-hidden");
                    nav.classList.remove("nav-bottom");
                }

                if (
                    (currentRoute.includes("/secondary") || currentRoute.includes("/secondary-projects")) &&
                    window.innerWidth <= 768
                ) {
                    nav.classList.remove("nav-bottom");
                    nav.style.display = "none";
                    socialDiv.classList.add("socialBottom");

                    likeButton.classList.remove("likeButton");
                    likeButton.classList.add("settingsButton");

                    callUsButton.classList.remove("callUsButton");
                    callUsButton.classList.add("callUsButtonWhite");

                    shareButton.classList.remove("shareButton");
                    shareButton.classList.add("mapButton");

                    menuButton.classList.remove("menuButton");
                    menuButton.classList.add("menuButtonWhite");

                    socialDiv.style.display = "flex";
                } else {
                    likeButton.classList.add("likeButton");
                    likeButton.classList.remove("settingsButton");

                    shareButton.classList.add("shareButton");
                    shareButton.classList.remove("mapButton");

                    callUsButton.classList.add("callUsButton");
                    callUsButton.classList.remove("callUsButtonWhite");

                    menuButton.classList.add("menuButton");
                    menuButton.classList.remove("menuButtonWhite");

                    socialDiv.classList.remove("socialBottom");
                }
            };

            const originalPushState = history.pushState;
            history.pushState = function(...args) {
                originalPushState.apply(this, args);
                updateActiveNavItem();
            };

            const originalReplaceState = history.replaceState;
            history.replaceState = function(...args) {
                originalReplaceState.apply(this, args);
                updateActiveNavItem();
            };

            // Вызов updateActiveNavItem при изменении маршрута
            updateActiveNavItem();
            window.addEventListener("DOMContentLoaded", updateActiveNavItem);
            window.addEventListener("resize", updateActiveNavItem);

            return header;
        };
        const createNavItem = (text, url = "#") => {
            const navItem = createElement("li");
            navItem.className = "navItem";

            const navLink = createElement("a");
            navLink.className = "navLink";
            navLink.innerText = text;
            navLink.setAttribute("href", url);
            navItem.appendChild(navLink);

            const currentHash = window.location.hash.slice(1);

            if (url.slice(1) === currentHash) {
                navLink.classList.add("active");
            }

            return navItem;
        };
        const createElement = (name) => document.createElement(name);

        // footer
        const createFooterSocialLink = (type, href = "#") => {
            const link = createElement("a");
            link.href = href;
            link.target = "_blank";

            const linkSpan = createElement("span");
            linkSpan.className = "icon";
            linkSpan.classList.add(`${type}-icon`);

            link.appendChild(linkSpan);

            return link;
        };

        const createFooterLink = (text, href = "#") => {
            const item = createElement("li");
            const link = createElement("a");
            link.href = href;
            link.innerText = text;
            link.onclick = () => window.scrollTo(0, 0);

            item.appendChild(link);

            return item;
        };

        const createLinksGroup = (name) => {
            const linksGroup = createElement("div");
            linksGroup.className = "linksGroup";

            const linksGroupHeader = createElement("p");
            linksGroupHeader.className = "groupHeader";
            linksGroupHeader.innerText = name;
            linksGroup.appendChild(linksGroupHeader);

            const list = createElement("ul");
            linksGroup.appendChild(list);

            return linksGroup;
        };

        const Footer = () => {
            const footerDate = new Date().getFullYear();
            const footer = document.createElement("footer");
            footer.className = "footer";

            const footerTop = createElement("div");
            footerTop.className = "footerTop";
            footer.appendChild(footerTop);

            const contactsContainer = createElement("div");
            contactsContainer.className = "contactsContainer";
            footerTop.appendChild(contactsContainer);

            const logoContainer = createElement("div");
            logoContainer.className = "logoContainer";
            contactsContainer.appendChild(logoContainer);

            const logoImg = createElement("img");
            logoImg.setAttribute("src", "/icons/shared/logo.svg");
            logoImg.setAttribute("alt", "pro-part-logo");
            logoImg.className = "logo-image";
            logoContainer.appendChild(logoImg);

            const contactInfoContainer = createElement("div");
            contactInfoContainer.className = "contactInfoContainer";

            const addressElement = createElement("p");
            addressElement.className = "address";
            addressElement.innerText =
                "Pl. de la Iglesia, 3, office 1-D, 29670, San Pedro de Alcantara, Malaga";
            contactsContainer.appendChild(addressElement);

            const phoneElement = createElement("a");
            phoneElement.className = "phone";
            phoneElement.href = "tel:+34695113333";
            phoneElement.innerText = "+34 695 113 333";

            const phoneIconElement = createElement("span");
            phoneIconElement.className = "phoneIcon";
            phoneElement.prepend(phoneIconElement);

            contactInfoContainer.appendChild(addressElement);
            contactInfoContainer.appendChild(phoneElement);

            contactsContainer.appendChild(contactInfoContainer);

            const footerSocial = createElement("div");
            footerSocial.className = "footerSocial";

            const socialLinks = [{
                    platform: "whatsapp",
                    url: "https://api.whatsapp.com/send/?phone=34695113333&text&type=phone_number&app_absent=0"
                },
                {
                    platform: "telegram",
                    url: "https://t.me/ppspain"
                },
                {
                    platform: "facebook",
                    url: "https://facebook.com/your-page"
                },
                {
                    platform: "https://www.facebook.com/people/propartes/61557005454968/?mibextid=LQQJ4d&rdid=gOL7loYQU6x4FIHO&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2FyLdG6VUUZ11gwWkN%2F%3Fmibextid%3DLQQJ4d",
                    url: "https://www.instagram.com/propart.es"
                },
            ];

            contactsContainer.appendChild(footerSocial);
            socialLinks.forEach(({
                platform,
                url
            }) => {
                footerSocial.appendChild(createFooterSocialLink(platform, url));
            });

            const linksContainer = createElement("div");
            linksContainer.className = "linksContainer";
            footerTop.appendChild(linksContainer);

            const areaLinks = createLinksGroup("Area");
            const areaLinksData = [{
                    name: "Marbella",
                    url: `${language && "/" + language}/marbella`
                },
                {
                    name: "Estepona",
                    url: `${language && "/" + language}/estepona`
                },
                {
                    name: "Benahavis",
                    url: `${language && "/" + language}/benahavis`
                },
                {
                    name: "Sotogrande",
                    url: `${language && "/" + language}/sotogrande`
                },
                {
                    name: "Mijas",
                    url: `${language && "/" + language}/mijas`
                },
                {
                    name: "Ojen",
                    url: `${language && "/" + language}/ojen`
                },
            ];

            areaLinksData.forEach(({
                name,
                url
            }) => {
                areaLinks.lastChild.appendChild(createFooterLink(name, url));
            });

            linksContainer.appendChild(areaLinks);

            const consultingLinks = createLinksGroup("Consulting");
            const consultingLinksData = [{
                    name: "Visa",
                    url: `${language && "/" + language}/visa-services`
                },
                {
                    name: "Legal services",
                    url: `${language && "/" + language}/legal-service`
                },
                {
                    name: "Insurance",
                    url: `${language && "/" + language}/insurance-service`
                },
                {
                    name: "Mortgage",
                    url: `${language && "/" + language}/mortgage`
                },
                {
                    name: "Concierge",
                    url: `${language && "/" + language}/concierge-service`
                },
                {
                    name: "Construction",
                    url: `${language && "/" + language}/construction-service`
                },
            ];

            consultingLinksData.forEach(({
                name,
                url
            }) => {
                consultingLinks.lastChild.appendChild(createFooterLink(name, url));
            });

            linksContainer.appendChild(consultingLinks);

            const servicesLinks = createLinksGroup("Services");
            const linksGroupInner = createElement("div");
            linksGroupInner.className = "linksGroupInner";
            servicesLinks.lastChild.appendChild(linksGroupInner);

            const linksGroupInnerRight = createElement("div");
            linksGroupInner.appendChild(linksGroupInnerRight);
            const servicesLinksDataRight = [{
                    name: "Visa",
                    url: `${language && "/" + language}/visa-services`
                },
                {
                    name: "Legal services",
                    url: `${language && "/" + language}/legal-service`
                },
                {
                    name: "Insurance",
                    url: `${language && "/" + language}/insurance-service`
                },
                {
                    name: "Mortgage",
                    url: `${language && "/" + language}/mortgage`
                },
                {
                    name: "Concierge",
                    url: `${language && "/" + language}/concierge-service`
                },
                {
                    name: "Construction",
                    url: `${language && "/" + language}/construction-service`
                },
            ];
            servicesLinksDataRight.forEach(({
                name,
                url
            }) => {
                linksGroupInnerRight.appendChild(createFooterLink(name, url));
            });

            const linksGroupInnerLeft = createElement("div");
            linksGroupInner.appendChild(linksGroupInnerLeft);

            const servicesLinksDataLeft = [{
                    name: "Repairs & Furnishings",
                    url: `${language && "/" + language}/construction-service`
                },
                {
                    name: "Select construction",
                    url: `${language && "/" + language}/construction-service`
                },
                {
                    name: "Digital Nomand Visa",
                    url: `${language && "/" + language}/construction-service`
                },
                {
                    name: "Tourist license",
                    url: `${language && "/" + language}/construction-service`
                },
                {
                    name: "Student visa",
                    url: `${language && "/" + language}/visa-services`
                }
            ]

            servicesLinksDataLeft.forEach(({
                name,
                url
            }) => {
                linksGroupInnerLeft.appendChild(createFooterLink(name, url));
            });

            linksContainer.appendChild(servicesLinks);

            const footerBottom = createElement("div");
            footerBottom.className = "footerBottom";
            footer.appendChild(footerBottom);

            const rightsDiv = createElement("div");
            rightsDiv.className = "rights";
            rightsDiv.innerText = `© ${footerDate}  All rights reserved`;
            footerBottom.appendChild(rightsDiv);

            const policyDiv = createElement("div");
            policyDiv.className = "policy";
            footerBottom.appendChild(policyDiv);

            const policyLink = createElement("a");
            policyLink.href = "#";
            policyLink.innerText = "Privacy policy";
            policyDiv.appendChild(policyLink);

            const termsLink = createElement("a");
            termsLink.href = "#";
            termsLink.innerText = "Terms of use";
            policyDiv.appendChild(termsLink);

            return footer;
        };
        const areasData = [{
                "value": "Estepona",
                "label": "Estepona",
                "subAreas": [{
                        "value": "Benavista",
                        "oldLabel": "Benavista",
                        "newLabel": "Benavista"
                    },
 					{
                        "value": "Estepona",
                        "oldLabel": "Estepona",
                        "newLabel": "Estepona"
                    },
                    {
                        "value": "Costalita",
                        "oldLabel": "Costalita",
                        "newLabel": "Costalita"
                    },
                    {
                        "value": "Valle Romano",
                        "oldLabel": "Valle Romano",
                        "newLabel": "Valle Romano"
                    },
                    {
                        "value": "El Padrón",
                        "oldLabel": "El Padrón",
                        "newLabel": "El Padrón"
                    },
                    {
                        "value": "Hacienda del Sol",
                        "oldLabel": "El Presidente",
                        "newLabel": "Hacienda del Sol"
                    },
                    {
                        "value": "Selwo",
                        "oldLabel": "Selwo",
                        "newLabel": "Selwo"
                    },
                    {
                        "value": "Atalaya",
                        "oldLabel": "Atalaya",
                        "newLabel": "Atalaya"
                    },
                    {
                        "value": "Benamara",
                        "oldLabel": "Benamara",
                        "newLabel": "Benamara"
                    },
                    {
                        "value": "El Presidente",
                        "oldLabel": "El Presidente",
                        "newLabel": "El Presidente"
                    },
                    {
                        "value": "Bel Air",
                        "oldLabel": "Bel Air",
                        "newLabel": "Bel Air"
                    },
                    {
                        "value": "Cancelada",
                        "oldLabel": "Cancelada",
                        "newLabel": "Cancelada"
                    },
                    {
                        "value": "New Golden Mile",
                        "oldLabel": "New Golden Mile",
                        "newLabel": "New Golden Mile"
                    },
                    // new_add
                    {
                        "value": "Diana Park",
                        "oldLabel": "Diana Park",
                        "newLabel": "Diana Park"
                    },
                    {
                        "value": "El Padron",
                        "oldLabel": "El Padron",
                        "newLabel": "El Padron"
                    },
                ]
            },
            {
                "value": "Malaga",
                "label": "Malaga",
                "subAreas": [{
                        "value": "Alhaurín de la Torre",
                        "oldLabel": "Alhaurín de la Torre",
                        "newLabel": "Alhaurín de la Torre"
                    },
                    {
                        "value": "Lauro Golf",
                        "oldLabel": "Alhaurín de la Torre",
                        "newLabel": "Lauro Golf"
                    },
                    {
                        "value": "Málaga Este",
                        "oldLabel": "Málaga Este",
                        "newLabel": "Málaga Este"
                    },
                    {
                        "value": "Málaga Centro",
                        "oldLabel": "Málaga Centro",
                        "newLabel": "Málaga Centro"
                    },
                    {
                        "value": "Miraflores",
                        "oldLabel": "Málaga Este",
                        "newLabel": "Miraflores"
                    }
                ]
            },
            {
                "value": "Marbella:",
                "label": "Marbella",
                "subAreas": [{
                        "value": "Río Real",
                        "oldLabel": "Río Real",
                        "newLabel": "Río Real"
                    },
                    {
                        "value": "Las Chapas",
                        "oldLabel": "Hacienda Las Chapas",
                        "newLabel": "Las Chapas"
                    },
                    {
                        "value": "Santa Clara",
                        "oldLabel": "Hacienda Las Chapas",
                        "newLabel": "Santa Clara"
                    },
                    {
                        "value": "Hacienda Las Chapas",
                        "oldLabel": "Hacienda Las Chapas",
                        "newLabel": "Hacienda Las Chapas"
                    },
                    {
                        "value": "Los Monteros",
                        "oldLabel": "Hacienda Las Chapas",
                        "newLabel": "Los Monteros"
                    },
                    {
                        "value": "Carib Playa",
                        "oldLabel": "Carib Playa",
                        "newLabel": "Carib Playa"
                    },
                    {
                        "value": "Costabella",
                        "oldLabel": "Costabella",
                        "newLabel": "Costabella"
                    },
                    {
                        "value": "Torre Real",
                        "oldLabel": "Torre Real",
                        "newLabel": "Torre Real"
                    },
                    {
                        "value": "Altos de los Monteros",
                        "oldLabel": "Altos de los Monteros",
                        "newLabel": "Altos de los Monteros"
                    },
                    {
                        "value": "Sierra Blanca",
                        "oldLabel": "Sierra Blanca",
                        "newLabel": "Sierra Blanca"
                    },
                    {
                        "value": "Nagüeles",
                        "oldLabel": "Nagüeles",
                        "newLabel": "Nagüeles"
                    },
                    {
                        "value": "Nueva Andalucía",
                        "oldLabel": "Nueva Andalucía",
                        "newLabel": "Nueva Andalucía"
                    },
                    {
                        "value": "Elviria",
                        "oldLabel": "Hacienda Las Chapas",
                        "newLabel": "Elviria"
                    },
                    {
                        "value": "Aloha",
                        "oldLabel": "Aloha",
                        "newLabel": "Aloha"
                    },
                    {
                        "value": "Puerto de Cabopino",
                        "oldLabel": "Puerto de Cabopino",
                        "newLabel": "Puerto de Cabopino"
                    },
                    {
                        "value": "The Golden Mile",
                        "oldLabel": "The Golden Mile",
                        "newLabel": "The Golden Mile"
                    },
                    {
                        "value": "Puerto Banús",
                        "oldLabel": "Puerto Banús",
                        "newLabel": "Puerto Banús"
                    },
                    {
                        "value": "Artola",
                        "oldLabel": "Artola",
                        "newLabel": "Artola"
                    },
                    {
                        "value": "Los Almendros",
                        "oldLabel": "Nueva Andalucía",
                        "newLabel": "Los Almendros"
                    },
                    {
                        "value": "Bahía de Marbella",
                        "oldLabel": "Bahía de Marbella",
                        "newLabel": "Bahía de Marbella"
                    },
                    {
                        "value": "Marbesa",
                        "oldLabel": "Hacienda Las Chapas",
                        "newLabel": "Marbesa"
                    },
                    {
                        "value": "Cabopino",
                        "oldLabel": "Cabopino",
                        "newLabel": "Cabopino"
                    },
                    {
                        "value": "Reserva de Marbella",
                        "oldLabel": "Hacienda Las Chapas",
                        "newLabel": "Reserva de Marbella"
                    },
                    {
                        "value": "Guadalmina Alta",
                        "oldLabel": "Guadalmina Alta",
                        "newLabel": "Guadalmina Alta"
                    },
                    {
                        "value": "Las Brisas",
                        "oldLabel": "Hacienda Las Chapas",
                        "newLabel": "Las Brisas"
                    },
                    {
                        "value": "San Pedro de Alcantara",
                        "oldLabel": "San Pedro de Alcantara",
                        "newLabel": "San Pedro de Alcantara"
                    },
                    {
                        "value": "Guadalmina Baja",
                        "oldLabel": "Guadalmina Baja",
                        "newLabel": "Guadalmina Baja"
                    },
                    {
                        "value": "Cortijo Blanco",
                        "oldLabel": "San Pedro de Alcantara",
                        "newLabel": "Cortijo Blanco"
                    },
                    //new_add
                    {
                        "value": "El Rosario",
                        "oldLabel": "El Rosario",
                        "newLabel": "El Rosario"
                    },
                    {
                        "value": "Bahia de Marbella",
                        "oldLabel": "Bahia de Marbella",
                        "newLabel": "Bahia de Marbella"
                    },
                    {
                        "value": "San Diego",
                        "oldLabel": "Marbella",
                        "newLabel": "San Diego"
                    },
                    {
                        "value": "Valle del Sol",
                        "oldLabel": "San Pedro de Alcantara",
                        "newLabel": "Valle del Sol"
                    },
                    {
                        "value": "Valle del Sol",
                        "oldLabel": "San Pedro de Alcantara",
                        "newLabel": "Valle del Sol"
                    },
                ]
            },
            {
                "value": "Fuengirola",
                "label": "Fuengirola",
                "subAreas": [{
                        "value": "Carvajal",
                        "oldLabel": "Carvajal",
                        "newLabel": "Carvajal"
                    },
                    {
                        "value": "Los Boliches",
                        "oldLabel": "Los Boliches",
                        "newLabel": "Los Boliches"
                    },
                    {
                        "value": "Los Pacos",
                        "oldLabel": "Los Pacos",
                        "newLabel": "Los Pacos"
                    },
                    {
                        "value": "Torreblanca",
                        "oldLabel": "Torreblanca",
                        "newLabel": "Torreblanca"
                    },
                    {
                        "value": "Las Lagunas",
                        "oldLabel": "Las Lagunas",
                        "newLabel": "Las Lagunas"
                    }
                ]
            },
            {
                "value": "Manilva",
                "label": "Manilva",
                "subAreas": [{
                        "value": "Punta Chullera",
                        "oldLabel": "Punta Chullera",
                        "newLabel": "Punta Chullera"
                    },
                    {
                        "value": "La Duquesa",
                        "oldLabel": "La Duquesa",
                        "newLabel": "La Duquesa"
                    },
                    {
                        "value": "San Luis de Sabinillas",
                        "oldLabel": "San Luis de Sabinillas",
                        "newLabel": "San Luis de Sabinillas"
                    }
                ]
            },
            {
                "value": "Casares",
                "label": "Casares",
                "subAreas": [{
                        "value": "Casares Playa",
                        "oldLabel": "Casares Playa",
                        "newLabel": "Casares Playa"
                    },
                    {
                        "value": "Casares Pueblo",
                        "oldLabel": "Casares Pueblo",
                        "newLabel": "Casares Pueblo"
                    },
                    {
                        "value": "Doña Julia",
                        "oldLabel": "Doña Julia",
                        "newLabel": "Doña Julia"
                    }
                ]
            },
            {
                "value": "Mijas",
                "label": "Mijas",
                "subAreas": [{
                        "value": "Campo Mijas",
                        "oldLabel": "Campo Mijas",
                        "newLabel": "Campo Mijas"
                    },
                    {
                        "value": "La Cala de Mijas",
                        "oldLabel": "La Cala de Mijas",
                        "newLabel": "La Cala de Mijas"
                    },
                    {
                        "value": "Valtocado",
                        "oldLabel": "Valtocado",
                        "newLabel": "Valtocado"
                    },
                    {
                        "value": "Riviera del Sol",
                        "oldLabel": "Riviera del Sol",
                        "newLabel": "Riviera del Sol"
                    },
                    {
                        "value": "Sierrezuela",
                        "oldLabel": "Sierrezuela",
                        "newLabel": "Sierrezuela"
                    },
                    {
                        "value": "Calanova Golf",
                        "oldLabel": "Calanova Golf",
                        "newLabel": "Calanova Golf"
                    },
                    {
                        "value": "Mijas Costa",
                        "oldLabel": "Mijas Costa",
                        "newLabel": "Mijas Costa"
                    },
                    {
                        "value": "La Cala Golf",
                        "oldLabel": "La Cala Golf",
                        "newLabel": "La Cala Golf"
                    },
                    {
                        "value": "La Cala Hills",
                        "oldLabel": "La Cala Hills",
                        "newLabel": "La Cala Hills"
                    },
                    {
                        "value": "Calypso",
                        "oldLabel": "Calypso",
                        "newLabel": "Calypso"
                    },
                    {
                        "value": "Mijas Golf",
                        "oldLabel": "Mijas Golf",
                        "newLabel": "Mijas Golf"
                    },
                    {
                        "value": "Cerros del Aguila",
                        "oldLabel": "Cerros del Aguila",
                        "newLabel": "Cerros del Aguila"
                    },
                    {
                        "value": "Calahonda",
                        "oldLabel": "Calahonda",
                        "newLabel": "Calahonda"
                    },
                    {
                        "value": "El Chaparral",
                        "oldLabel": "El Chaparral",
                        "newLabel": "El Chaparral"
                    },
                    {
                        "value": "El Faro",
                        "oldLabel": "El Faro",
                        "newLabel": "El Faro"
                    },
                    {
                        "value": "Torremar",
                        "oldLabel": "Torremar",
                        "newLabel": "Torremar"
                    },
                    //new_add
                    {
                        "value": "La Cala",
                        "oldLabel": "La Cala",
                        "newLabel": "La Cala"
                    }

                ]
            },
            {
                "value": "Benahavis",
                "label": "Benahavis",
                "subAreas": [{
                        "value": "La Heredia",
                        "oldLabel": "La Heredia",
                        "newLabel": "La Heredia"
                    },
                    {
                        "value": "Los Arqueros",
                        "oldLabel": "Los Arqueros",
                        "newLabel": "Los Arqueros"
                    },
                    {
                        "value": "La Zagaleta",
                        "oldLabel": "La Zagaleta",
                        "newLabel": "La Zagaleta"
                    },
                    {
                        "value": "El Madroñal",
                        "oldLabel": "El Madroñal",
                        "newLabel": "El Madroñal"
                    },
                    {
                        "value": "Los Flamingos",
                        "oldLabel": "Los Flamingos",
                        "newLabel": "Los Flamingos"
                    },
                    {
                        "value": "Monte Halcones",
                        "oldLabel": "Monte Halcones",
                        "newLabel": "Monte Halcones"
                    },
                    {
                        "value": "El Paraiso",
                        "oldLabel": "El Paraiso",
                        "newLabel": "El Paraiso"
                    },
                    {
                        "value": "La Quinta",
                        "oldLabel": "La Quinta",
                        "newLabel": "La Quinta"
                    },
                    {
                        "value": "La Campana",
                        "oldLabel": "La Campana",
                        "newLabel": "La Campana"
                    }
                ]
            },
            {
                "value": "Alhaurín el Grande",
                "label": "Alhaurín el Grande",
                "subAreas": [{
                    "value": "Alhaurin Golf",
                    "oldLabel": "Alhaurin Golf",
                    "newLabel": "Alhaurin Golf"
                }]
            },
            {
                "value": "Benalmádena",
                "label": "Benalmádena",
                "subAreas": [{
                        "value": "Benalmadena Pueblo",
                        "oldLabel": "Benalmadena Pueblo",
                        "newLabel": "Benalmadena Pueblo"
                    },
                    {
                        "value": "La Capellania",
                        "oldLabel": "La Capellania",
                        "newLabel": "La Capellania"
                    },
                    {
                        "value": "Arroyo de la Miel",
                        "oldLabel": "Arroyo de la Miel",
                        "newLabel": "Arroyo de la Miel"
                    },
                    {
                        "value": "Torremuelle",
                        "oldLabel": "Torremuelle",
                        "newLabel": "Torremuelle"
                    },
                    {
                        "value": "Benalmadena Costa",
                        "oldLabel": "Benalmadena Costa",
                        "newLabel": "Benalmadena Costa"
                    },
                    {
                        "value": "Torrequebrada",
                        "oldLabel": "Torrequebrada",
                        "newLabel": "Torrequebrada"
                    }
                ]
            },
            {
                "value": "Torremolinos",
                "label": "Torremolinos",
                "subAreas": [{
                        "value": "La Carihuela",
                        "oldLabel": "La Carihuela",
                        "newLabel": "La Carihuela"
                    },
                    {
                        "value": "El Pinillo",
                        "oldLabel": "El Pinillo",
                        "newLabel": "El Pinillo"
                    },
                    {
                        "value": "Torremolinos Centro",
                        "oldLabel": "Torremolinos Centro",
                        "newLabel": "Torremolinos Centro"
                    },
                    {
                        "value": "Playamar",
                        "oldLabel": "Playamar",
                        "newLabel": "Playamar"
                    },
                    //new_add
                    {
                        "value": "Bajondillo",
                        "oldLabel": "Bajondillo",
                        "newLabel": "Bajondillo"
                    },
                    {
                        "value": "EI Pinillo",
                        "oldLabel": "EI Pinillo",
                        "newLabel": "EI Pinillo"
                    },
                    {
                        "value": "El Calvario",
                        "oldLabel": "El Calvario",
                        "newLabel": "El Calvario"
                    },
                    {
                        "value": "La Colina",
                        "oldLabel": "La Colina",
                        "newLabel": "La Colina"
                    },
                    {
                        "value": "La Leala",
                        "oldLabel": "La Leala",
                        "newLabel": "La Leala"
                    },
                    {
                        "value": "Playa de los Álamos",
                        "oldLabel": "Playa de los Álamos",
                        "newLabel": "Playa de los Álamos"
                    },
                    {
                        "value": "La Carihuela",
                        "oldLabel": "La Carihuela",
                        "newLabel": "La Carihuela"
                    },
                    {
                        "value": "Los Alamos",
                        "oldLabel": "Los Alamos",
                        "newLabel": "Los Alamos"
                    },
                    {
                        "value": "Los Alamos",
                        "oldLabel": "Los Alamos",
                        "newLabel": "Los Alamos"
                    },
                ]
            },

            {
                "value": "Cadiz",
                "label": "Cadiz",
                "subAreas": [{
                        "value": "La Línea",
                        "oldLabel": "La Línea",
                        "newLabel": "La Línea"
                    },
                    {
                        "value": "La Alcaidesa",
                        "oldLabel": "La Alcaidesa",
                        "newLabel": "La Alcaidesa"
                    },
                    {
                        "value": "Los Barrios",
                        "oldLabel": "Los Barrios",
                        "newLabel": "Los Barrios"
                    },
                    {
                        "value": "Pueblo Nuevo",
                        "oldLabel": "Pueblo Nuevo",
                        "newLabel": "Pueblo Nuevo"
                    },
                    {
                        "value": "San Martin de Tesorillo",
                        "oldLabel": "San Martin de Tesorillo",
                        "newLabel": "San Martin de Tesorillo"
                    },
                    {
                        "value": "San Roque",
                        "oldLabel": "San Roque",
                        "newLabel": "San Roque"
                    },
                    {
                        "value": "San Roque Club",
                        "oldLabel": "San Roque",
                        "newLabel": "San Roque Club"
                    },
                    {
                        "value": "Sotogrande",
                        "oldLabel": "San Roque",
                        "newLabel": "Sotogrande"
                    },
                    {
                        "value": "Sotogrande Alto",
                        "oldLabel": "San Roque",
                        "newLabel": "Sotogrande Alto"
                    },
                    {
                        "value": "Sotogrande Costa",
                        "oldLabel": "San Roque",
                        "newLabel": "Sotogrande Costa"
                    },
                    {
                        "value": "Sotogrande Marina",
                        "oldLabel": "San Roque",
                        "newLabel": "Sotogrande Marina"
                    },
                    {
                        "value": "Sotogrande Playa",
                        "oldLabel": "San Roque",
                        "newLabel": "Sotogrande Playa"
                    },
                    {
                        "value": "Sotogrande Puerto",
                        "oldLabel": "San Roque",
                        "newLabel": "Sotogrande Puerto"
                    },
                    {
                        "value": "Torreguadiaro",
                        "oldLabel": "San Roque",
                        "newLabel": "Torreguadiaro"
                    },
                    {
                        "value": "Zahara",
                        "oldLabel": "Zahara",
                        "newLabel": "Zahara"
                    }
                ]
            },
            {
                "value": "Other",
                "label": "Other",
                "subAreas": [{
                        "value": "Istan",
                        "oldLabel": "Istan",
                        "newLabel": "Istan"
                    },
                    {
                        "value": "Cártama",
                        "oldLabel": "Cártama",
                        "newLabel": "Cártama"
                    },
                    {
                        "value": "Benaoján",
                        "oldLabel": "Benaoján",
                        "newLabel": "Benaoján"
                    },
                    {
                        "value": "Antequera",
                        "oldLabel": "Antequera",
                        "newLabel": "Antequera"
                    },
                    {
                        "value": "Ojén",
                        "oldLabel": "Ojén",
                        "newLabel": "Ojén"
                    },
                    {
                        "value": "Fuente de Piedra",
                        "oldLabel": "Fuente de Piedra",
                        "newLabel": "Fuente de Piedra"
                    },
                    {
                        "value": "Júzcar",
                        "oldLabel": "Júzcar",
                        "newLabel": "Júzcar"
                    },
                    {
                        "value": "Genalguacil",
                        "oldLabel": "Genalguacil",
                        "newLabel": "Genalguacil"
                    },
                    {
                        "value": "Puerto de la Torre",
                        "oldLabel": "Puerto de la Torre",
                        "newLabel": "Puerto de la Torre"
                    },
                    {
                        "value": "Arriateg",
                        "oldLabel": "Arriateg",
                        "newLabel": "Arriateg"
                    },
                    {
                        "value": "El Burgo",
                        "oldLabel": "El Burgo",
                        "newLabel": "El Burgo"
                    },
                    {
                        "value": "Gaucín",
                        "oldLabel": "Gaucín",
                        "newLabel": "Gaucín"
                    },
                    {
                        "value": "La Mairena",
                        "oldLabel": "La Mairena",
                        "newLabel": "La Mairena"
                    },
                    {
                        "value": "Archidona",
                        "oldLabel": "Archidona",
                        "newLabel": "Archidona"
                    },
                    {
                        "value": "Monda",
                        "oldLabel": "Monda",
                        "newLabel": "Monda"
                    },
                    {
                        "value": "El Chorro",
                        "oldLabel": "El Chorro",
                        "newLabel": "El Chorro"
                    },
                    {
                        "value": "Carratraca",
                        "oldLabel": "Carratraca",
                        "newLabel": "Carratraca"
                    },
                    {
                        "value": "Ronda",
                        "oldLabel": "Ronda",
                        "newLabel": "Ronda"
                    },
                    {
                        "value": "Villanueva De La Concepcion",
                        "oldLabel": "Villanueva De La Concepcion",
                        "newLabel": "Villanueva De La Concepcion"
                    },
                    {
                        "value": "Mollina",
                        "oldLabel": "Mollina",
                        "newLabel": "Mollina"
                    },
                    {
                        "value": "Almogia",
                        "oldLabel": "Almogia",
                        "newLabel": "Almogia"
                    },
                    {
                        "value": "Villanueva del Rosario",
                        "oldLabel": "Villanueva del Rosario",
                        "newLabel": "Villanueva del Rosario"
                    },
                    {
                        "value": "Cuevas del Becerro",
                        "oldLabel": "Cuevas del Becerro",
                        "newLabel": "Cuevas del Becerro"
                    },
                    {
                        "value": "Zalea",
                        "oldLabel": "Zalea",
                        "newLabel": "Zalea"
                    },
                    {
                        "value": "Alhaurín el Grande",
                        "oldLabel": "Alhaurín el Grande",
                        "newLabel": "Alhaurín el Grande"
                    },
                    {
                        "value": "Ardales",
                        "oldLabel": "Ardales",
                        "newLabel": "Ardales"
                    },
                    {
                        "value": "Tolox",
                        "oldLabel": "Tolox",
                        "newLabel": "Tolox"
                    },
                    {
                        "value": "Cortes de la Frontera",
                        "oldLabel": "Cortes de la Frontera",
                        "newLabel": "Cortes de la Frontera"
                    },
                    {
                        "value": "Campillos",
                        "oldLabel": "Campillos",
                        "newLabel": "Campillos"
                    },
                    {
                        "value": "Algatocin",
                        "oldLabel": "Algatocin",
                        "newLabel": "Algatocin"
                    },
                    {
                        "value": "Benarrabá",
                        "oldLabel": "Benarrabá",
                        "newLabel": "Benarrabá"
                    },
                    {
                        "value": "Valle de Abdalajis",
                        "oldLabel": "Valle de Abdalajis",
                        "newLabel": "Valle de Abdalajis"
                    },
                    {
                        "value": "Montejaque",
                        "oldLabel": "Montejaque",
                        "newLabel": "Montejaque"
                    },
                    {
                        "value": "Alpandeire",
                        "oldLabel": "Alpandeire",
                        "newLabel": "Alpandeire"
                    },
                    {
                        "value": "Guaro",
                        "oldLabel": "Guaro",
                        "newLabel": "Guaro"
                    },
                    {
                        "value": "Alora",
                        "oldLabel": "Alora",
                        "newLabel": "Alora"
                    },
                    {
                        "value": "Coín",
                        "oldLabel": "Coín",
                        "newLabel": "Coín"
                    },
                    {
                        "value": "Pizarra",
                        "oldLabel": "Pizarra",
                        "newLabel": "Pizarra"
                    },
                    {
                        "value": "Benalauría",
                        "oldLabel": "Benalauría",
                        "newLabel": "Benalauría"
                    },
                    {
                        "value": "Yunquera",
                        "oldLabel": "Yunquera",
                        "newLabel": "Yunquera"
                    },
                    {
                        "value": "Casabermeja",
                        "oldLabel": "Casabermeja",
                        "newLabel": "Casabermeja"
                    },
                    {
                        "value": "Estacion de Cartama",
                        "oldLabel": "Estacion de Cartama",
                        "newLabel": "Estacion de Cartama"
                    },
                    {
                        "value": "Jubrique",
                        "oldLabel": "Jubrique",
                        "newLabel": "Jubrique"
                    },
                    {
                        "value": "Alozaina",
                        "oldLabel": "Alozaina",
                        "newLabel": "Alozaina"
                    },
                    {
                        "value": "Cañete la Real",
                        "oldLabel": "Cañete la Real",
                        "newLabel": "Cañete la Real"
                    },
                    {
                        "value": "Estación de Gaucin",
                        "oldLabel": "Estación de Gaucin",
                        "newLabel": "Estación de Gaucin"
                    },
                    {
                        "value": "Villafranco del Guadalhorce",
                        "oldLabel": "Villafranco del Guadalhorce",
                        "newLabel": "Villafranco del Guadalhorce"
                    },
                    {
                        "value": "Casarabonela",
                        "oldLabel": "Casarabonela",
                        "newLabel": "Casarabonela"
                    },
                    {
                        "value": "Jimera de Líbar",
                        "oldLabel": "Jimera de Líbar",
                        "newLabel": "Jimera de Líbar"
                    },
                    {
                        "value": "Puerto de la Torre",
                        "oldLabel": "Puerto de la Torre",
                        "newLabel": "Puerto de la Torre"
                    },
                    {
                        "value": "Alameda",
                        "oldLabel": "Alameda",
                        "newLabel": "Alameda"
                    },
                    {
                        "value": "Algeciras",
                        "oldLabel": "Algeciras",
                        "newLabel": "Algeciras"
                    },
                    {
                        "value": "Alhaurin de la Torre",
                        "oldLabel": "Alhaurin de la Torre",
                        "newLabel": "Alhaurin de la Torre"
                    },
                    {
                        "value": "Alhaurin el Grande",
                        "oldLabel": "Alhaurin el Grande",
                        "newLabel": "Alhaurin el Grande"
                    },
                    {
                        "value": "Arriate",
                        "oldLabel": "Arriate",
                        "newLabel": "Arriate"
                    },
                    {
                        "value": "Benadalid",
                        "oldLabel": "Benadalid",
                        "newLabel": "Benadalid"
                    },
                    {
                        "value": "Benalauria",
                        "oldLabel": "Benalauria",
                        "newLabel": "Benalauria"
                    },
                    {
                        "value": "Benaojan",
                        "oldLabel": "Benaojan",
                        "newLabel": "Benaojan"
                    },
                    {
                        "value": "Benarrabá",
                        "oldLabel": "Benarrabá",
                        "newLabel": "Benarrabá"
                    },
                    {
                        "value": "Cartajima",
                        "oldLabel": "Cartajima",
                        "newLabel": "Cartajima"
                    },
                    {
                        "value": "Cártama",
                        "oldLabel": "Cártama",
                        "newLabel": "Cártama"
                    },
                    {
                        "value": "Coin",
                        "oldLabel": "Coin",
                        "newLabel": "Coin"
                    },
                    {
                        "value": "Cuevas Bajas",
                        "oldLabel": "Cuevas Bajas",
                        "newLabel": "Cuevas Bajas"
                    },
                    {
                        "value": "Cuevas de San Marcos",
                        "oldLabel": "Cuevas de San Marcos",
                        "newLabel": "Cuevas de San Marcos"
                    },
                    {
                        "value": "Estacién Archidona",
                        "oldLabel": "Estacién Archidona",
                        "newLabel": "Estacién Archidona"
                    },
                    {
                        "value": "Gaucin",
                        "oldLabel": "Gaucin",
                        "newLabel": "Gaucin"
                    },
                    {
                        "value": "Farajan",
                        "oldLabel": "Farajan",
                        "newLabel": "Farajan"
                    },
                    {
                        "value": "Gibralgalia",
                        "oldLabel": "Gibralgalia",
                        "newLabel": "Gibralgalia"
                    },
                    {
                        "value": "Gobantes",
                        "oldLabel": "Gobantes",
                        "newLabel": "Gobantes"
                    },
                    {
                        "value": "Guadiaro",
                        "oldLabel": "Guadiaro",
                        "newLabel": "Guadiaro"
                    },
                    {
                        "value": "Jimera de Libar",
                        "oldLabel": "Jimera de Libar",
                        "newLabel": "Jimera de Libar"
                    },
                    {
                        "value": "La Atalaya",
                        "oldLabel": "La Atalaya",
                        "newLabel": "La Atalaya"
                    },
                    {
                        "value": "Teba",
                        "oldLabel": "Teba",
                        "newLabel": "Teba"
                    },
                    {
                        "value": "Torrenueva",
                        "oldLabel": "Torrenueva",
                        "newLabel": "Torrenueva"
                    },
                    {
                        "value": "Villanueva de Algaidas",
                        "oldLabel": "Villanueva de Algaidas",
                        "newLabel": "Villanueva de Algaidas"
                    },
                    {
                        "value": "Villanueva del Trabuco",
                        "oldLabel": "Villanueva del Trabuco",
                        "newLabel": "Villanueva del Trabuco"
                    },
                    {
                        "value": "Cañete la Real",
                        "oldLabel": "Cañete la Real",
                        "newLabel": "Cañete la Real"
                    },
                    {
                        "value": "La Parrilla",
                        "oldLabel": "La Parrilla",
                        "newLabel": "La Parrilla"
                    },
                    {
                        "value": "San Enrique de Guadiaro",
                        "oldLabel": "San Enrique de Guadiaro",
                        "newLabel": "San Enrique de Guadiaro"
                    }
                ]

            }
        ];


        const headerContainer = document.getElementById("header");
        const mainContent = document.getElementById("main-content");
        const footerContainer = document.getElementById("footer");

        headerContainer.appendChild(Header());
        footerContainer.appendChild(Footer());

        function renderFiltersFromQuery() {
            const queryString = window.location.search.substring(1); // Получаем строку запроса
            if (!queryString) return;

            const queryParams = new URLSearchParams(queryString);
            const propertiesSelectedFilters = document.getElementById("propertiesSelectedFilters");

            if (!propertiesSelectedFilters) return;

            propertiesSelectedFilters.innerHTML = "";

            if (queryParams.has("sort")) {
                addFilterItem("Sort: " + queryParams.get("sort"), "sort");
            }

            if (queryParams.has("bedrooms")) {
                const bedrooms = queryParams.get("bedrooms").split(",");
                bedrooms.forEach((bedroom) => {
                    addFilterItem("Bedrooms: " + bedroom, "bedrooms", bedroom);
                });
            }

            if (queryParams.has("minPrice") || queryParams.has("maxPrice")) {
                const minPrice = queryParams.get("minPrice");
                const maxPrice = queryParams.get("maxPrice");
                let priceText = "€ ";

                if (minPrice) {
                    priceText += formatPrice(minPrice);
                }
                if (maxPrice) {
                    priceText += " - " + formatPrice(maxPrice);
                }

                addFilterItem(priceText, "minPrice", "maxPrice");
            }

            if (queryParams.has("minSize") || queryParams.has("maxSize")) {
                const minSize = queryParams.get("minSize");
                const maxSize = queryParams.get("maxSize");
                let sizeText = "";

                if (minSize && maxSize) {
                    sizeText = `${minSize} - ${maxSize} sq.m`;
                } else if (minSize) {
                    sizeText = `From ${minSize} sq.m`;
                } else if (maxSize) {
                    sizeText = `To ${maxSize} sq.m`;
                }

                addFilterItem(sizeText, "minSize", "maxSize");
            }

            if (queryParams.has("handoverMin") || queryParams.has("handoverMax")) {
                const handoverMin = queryParams.get("handoverMin");
                const handoverMax = queryParams.get("handoverMax");
                let handoverText = "";

                if (handoverMin && handoverMax) {
                    handoverText = `${formatHandoverDate(handoverMin)} - ${formatHandoverDate(handoverMax)}`;
                } else if (handoverMin) {
                    handoverText = `From ${formatHandoverDate(handoverMin)}`;
                } else if (handoverMax) {
                    handoverText = `To ${formatHandoverDate(handoverMax)}`;
                }

                addFilterItem(handoverText, "handoverMin", "handoverMax");
            }

            if (queryParams.has("subAreas")) {
                const subAreas = queryParams.get("subAreas").split(",");
                subAreas.forEach((subArea) => {
                    addFilterItem(subArea, "subAreas", subArea);
                });
            }

            function addFilterItem(text, paramName, value) {
                const filterItem = document.createElement("div");
                filterItem.className = "propertiesSelectedFilter__item";

                const filterTitle = document.createElement("span");
                filterTitle.className = "propertiesSelectedFilter__item_title";
                filterTitle.textContent = text;

                // Создаем кнопку для удаления
                const deleteButton = document.createElement("button");
                deleteButton.className = "propertiesSelectedFilter__delete_button";
                deleteButton.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
<path d="M13 5L5 13M13 13L5 5.00001" stroke="#717171" stroke-width="1.2" stroke-linecap="round"/>
    </svg>`;
                deleteButton.addEventListener("click", () => {
                    if (paramName === "bedrooms") {
                        const bedroomsArray = queryParams.get("bedrooms").split(",");
                        const updatedBedrooms = bedroomsArray.filter(bedroom => bedroom !== value);
                        if (updatedBedrooms.length > 0) {
                            queryParams.set("bedrooms", updatedBedrooms.join(","));
                        } else {
                            queryParams.delete("bedrooms");
                        }
                    } else if (paramName === "subAreas") {
                        const subAreasArray = queryParams.get("subAreas").split(",");
                        const updatedSubAreas = subAreasArray.filter(area => area !== value);
                        if (updatedSubAreas.length > 0) {
                            queryParams.set("subAreas", updatedSubAreas.join(","));
                        } else {
                            queryParams.delete("subAreas");
                        }
                    } else {
                        // Удаляем основной параметр
                        queryParams.delete(paramName);
                        // Удаляем дополнительный параметр, если он существует
                        if (value && queryParams.has(value)) {
                            queryParams.delete(value);
                        }
                    }

                    const newQueryString = queryParams.toString();
                    const newUrl = window.location.pathname + (newQueryString ? `?${newQueryString}` : "");
                    window.history.pushState(null, "", newUrl);

                    window.location.reload();
                    renderFiltersFromQuery(); // Обновляем вид фильтров
                });

                filterItem.appendChild(filterTitle);
                filterItem.appendChild(deleteButton);
                propertiesSelectedFilters.appendChild(filterItem);
            }

            function formatPrice(price) {
                const num = parseInt(price, 10);
                if (num >= 1000000) {
                    return num / 1000000 + "M";
                } else if (num >= 1000) {
                    return num / 1000 + "K";
                }
                return num.toString();
            }

            function formatHandoverDate(date) {
                const [year, month] = date.split("-");
                const quarter = Math.ceil(parseInt(month, 10) / 3);
                return `Q${quarter} ${year}`;
            }
        }
        renderFiltersFromQuery();
        window.addEventListener("popstate", renderFiltersFromQuery);

        function paginationOffPlan(totalPages, currentPage) {
            const pagination = document.createElement("div");
            pagination.className = "pagination";
            // Преобразование currentPage с 0-базовой на 1-базовую для отображения
            const getPageForDisplay = (page) => page + 1;

            const onPageChange = (page) => {
                if (page < 0 || page >= totalPages) return;
                const currentUrl = window.location.href.split("?")[0];
                const urlParams = new URLSearchParams(window.location.search);
                urlParams.set("page", page + 1); // Convert 0-based to 1-based for URL

                window.history.replaceState({},
                    "",
                    `${currentUrl}?${urlParams.toString()}`
                );

                pagination.innerHTML = "";
                currentPage = page;
                renderPagination();

                fetchOffPlanProjects()
                    .then(() => {
                        window.scrollTo({
                            top: 0,
                        });
                    })
                    .catch(() => {});
            };

            const createPageItem = (page) => {
                const pageItem = document.createElement("span");
                pageItem.className = "page-number";
                pageItem.innerText = getPageForDisplay(page);
                if (page === currentPage) {
                    pageItem.classList.add("active");
                }
                pageItem.addEventListener("click", () => {
                    onPageChange(page);
                });
                return pageItem;
            };

            const createButton = (label, disabled, onClick) => {
                const button = document.createElement("button");
                button.className = `pagination-button pagination-button-${label}`;
                button.innerHTML = `<img src="<?php echo get_template_directory_uri(); ?>/icons/newbuilding/${label}.svg" alt="${label}" />`;
                if (disabled) {
                    button.disabled = true;
                    button.classList.add("disabled");
                }
                button.addEventListener("click", onClick);
                return button;
            };

            const createDots = () => {
                const dots = document.createElement("span");
                dots.className = "dots";
                dots.innerText = "...";
                return dots;
            };

            const renderPagination = () => {
                pagination.appendChild(
                    createButton("prev", currentPage === 0, () =>
                        onPageChange(currentPage - 1)
                    )
                );

                const maxVisiblePages = 3; // Максимальное количество видимых страниц
                let startPage = Math.max(0, currentPage - 1);
                let endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 1);

                if (endPage - startPage < maxVisiblePages - 1) {
                    startPage = Math.max(0, endPage - maxVisiblePages + 1);
                }

                if (startPage > 0) {
                    pagination.appendChild(createPageItem(0));
                    if (startPage > 1) {
                        pagination.appendChild(createDots());
                    }
                }

                for (let page = startPage; page <= endPage; page++) {
                    pagination.appendChild(createPageItem(page));
                }

                if (endPage < totalPages - 1) {
                    if (endPage < totalPages - 2) {
                        pagination.appendChild(createDots());
                    }
                    pagination.appendChild(createPageItem(totalPages - 1));
                }

                pagination.appendChild(
                    createButton("next", currentPage === totalPages - 1, () =>
                        onPageChange(currentPage + 1)
                    )
                );
            };

            renderPagination();
            return pagination;
        }

        async function fetchOffPlanProjects(retryCount = 0) {
            const queryString = window.location.search.substring(1); // Use search instead of hash
            try {
                    // Show loading state
                    const projectsContainer = document.getElementById("projectsContainer");
                    if (projectsContainer) {
                        projectsContainer.innerHTML = `
                    <div style="text-align: center; padding: 40px; color: #666;">
                        <h3>Loading projects...</h3>
                        <div style="margin-top: 20px;">Please wait while we fetch the latest properties.</div>
                    </div>
                `;
                    }

                    const urlParams = new URLSearchParams(queryString);
                    const page = Number(urlParams.get("page")) || 1; // Default to page 1 if not specified
                    // Send 1-based page directly to backend (no conversion needed)
                    const apiPage = page;

                    // Base URL for your Xano endpoint
                    const baseUrl = 'https://xf9m-jkaj-lcsq.p7.xano.io/api:v5maUE6u/properties';

                    // Create request parameters
                    let params = new URLSearchParams({
                        perPage: "12", // Changed to match your response structure
                        curPage: apiPage.toString(), // Use 0-based page for API
                        property_status: "New building", // Filter for off-plan projects (capital N!)
                    });

                    if (urlParams.has("propertyType")) {
                        const propertyTypes = urlParams.get("propertyType").split(",");
                        propertyTypes.forEach((type, index) => {
                            params.append(`property_type[${index}]`, type.trim());
                        });
                    }
                    if (urlParams.has("minPrice")) {
                        params.append("min_price", urlParams.get("minPrice")); // Renamed to price_from
                    }
                    if (urlParams.has("maxPrice")) {
                        params.append("max_price", urlParams.get("maxPrice")); // Renamed to price_to
                    }
                    if (urlParams.has("minSize")) {
                        params.append("min_built_area", urlParams.get("minSize")); // Assuming built_area_from
                    }
                    if (urlParams.has("maxSize")) {
                        params.append("max_built_area", urlParams.get("maxSize")); // Assuming built_area_to
                    }
                    // Bedrooms: accept `bedrooms=1,2` in page URL, send to API as `bedrooms[0]=...`
                    {
                        const bedroomValues = [];
                        for (const [k, v] of urlParams.entries()) {
                            if (k.startsWith("bedrooms[")) bedroomValues.push(v);
                        }
                        if (bedroomValues.length === 0 && urlParams.has("bedrooms")) {
                            const raw = urlParams.get("bedrooms");
                            if (raw) raw.split(",").forEach(val => {
                                const t = val.trim();
                                if (t) bedroomValues.push(t);
                            });
                        }
                        bedroomValues.forEach((val, idx) => params.append(`bedrooms[${idx}]`, val));
                    }
                    if (urlParams.has("handoverMin")) {
                        // Assuming 'start_date' or 'completion_date' for handover
                        params.append("min_complition_date", urlParams.get("handoverMin"));
                    }
                    if (urlParams.has("handoverMax")) {
                        params.append("max_complition_date", urlParams.get("handoverMax"));
                    }
                    if (urlParams.has("developers")) {
                        // Your Xano API response does not directly have a 'developer' field.
                        // You might need to map this to 'development_name' or ignore if not applicable.
                        params.append("development_name", urlParams.get("developers"));
                    }
                    if (urlParams.has("projectName")) {
                        params.append("development_name", urlParams.get("projectName")); // Assuming 'development_name' for project name
                    }

                    // Add location filter if present
                    if (urlParams.has("subAreas")) {
                        const locations = urlParams.get("subAreas").split(",");
                        locations.forEach(location => {
                            params.append("town", location.trim());
                        });
                    }

                    // Handle sorting with sort_by and sort_order parameters
                    if (urlParams.has("sort_by") && urlParams.has("sort_order")) {
                        const sortBy = urlParams.get("sort_by");
                        const sortOrder = urlParams.get("sort_order");

                        // Validate sort_by values
                        const validSortBy = ["built_area", "completion_date", "listed_date", "price", "development_name"];
                        if (validSortBy.includes(sortBy)) {
                            params.append("sort_by", sortBy);
                        } else {
                            console.warn("Invalid sort_by value: " + sortBy);
                        }

                        // Validate sort_order values
                        const validSortOrder = ["asc", "desc"];
                        if (validSortOrder.includes(sortOrder)) {
                            params.append("sort_order", sortOrder);
                        } else {
                            console.warn("Invalid sort_order value: " + sortOrder);
                        }
                    } else if (urlParams.has("sort")) {
                        // Fallback for legacy sort parameter
                        const sortValue = urlParams.get("sort");

                        switch (sortValue) {
                            case "Size Smaller":
                                params.append("sort_by", "built_area");
                                params.append("sort_order", "asc"); // Smallest first
                                break;
                            case "Size Bigger":
                                params.append("sort_by", "built_area");
                                params.append("sort_order", "desc"); // Biggest first
                                break;
                            case "By Handover":
                                params.append("sort_by", "completion_date");
                                params.append("sort_order", "asc");
                                break;
                            case "Newly added":
                                params.append("sort_by", "listed_date"); // Assuming 'listed_date' for newly added
                                params.append("sort_order", "desc");
                                break;
                            default:
                                console.warn("Unknown sort value: " + sortValue);
                        }
                    }

                    // Debug: Log the URL being fetched
                    const fullUrl = `${baseUrl}?${params.toString()}`;
                    console.log('🚀 Fetching off-plan projects from:', fullUrl);
                    console.log('📋 Request params:', Object.fromEntries(params));

                    let response;
                    try {
                        // Add timeout to prevent hanging requests
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

                        response = await fetch(fullUrl, {
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                "Accept": "application/json",
                            },
                            mode: 'cors', // Explicitly set CORS mode
                            signal: controller.signal
                        });

                        clearTimeout(timeoutId);
                    } catch (fetchError) {
                        console.error('Fetch Error:', fetchError);

                        // More specific error handling
                        if (fetchError.name === 'AbortError') {
                            throw new Error("Request timed out. Please try again.");
                        } else if (fetchError.name === 'TypeError' && fetchError.message.includes('Failed to fetch')) {
                            // Check if it's a network connectivity issue
                            if (!navigator.onLine) {
                                throw new Error("No internet connection. Please check your network and try again.");
                            } else {
                                throw new Error("Unable to reach the server. The API might be temporarily unavailable. Please try again later.");
                            }
                        }
                        throw fetchError;
                    }

                    if (!response.ok) {
                        console.error('API Response Error:', response.status, response.statusText);
                        if (response.status === 503) {
                            throw new Error("Service temporarily unavailable. Please try again later.");
                        } else if (response.status === 0) {
                            throw new Error("Network error. Please check your connection.");
                        } else {
                            throw new Error(`Failed to fetch projects: ${response.status} ${response.statusText}`);
                        }
                    }

                    const data = await response.json();
                    console.log('✅ Data received:', data);
                    console.log(`📊 Total projects: ${data.itemsTotal}, Items on page: ${data.items?.length || 0}`);
                    
                    // populateSearchDropdown();
                    renderFiltersFromQuery();
                    updateFilterButtonStateOffPlan();
                    renderValueFilterFromQueryOffPlan();
                    const newbuilding = document.querySelector(".newbuilding");
                    const paginationContainer = newbuilding.querySelector(
                        "#pagination-container"
                    );
                    const totalOffPlan =
                        document.getElementById("totalOffPlan");

                    // Update total projects based on Xano response
                    totalOffPlan.textContent = `projects: ${data.itemsTotal}`; // Changed to itemsReceived

                    if (paginationContainer) {
                        paginationContainer.innerHTML = "";
                        // Calculate total pages based on Xano response structure
                        const totalPages = Math.ceil(data.itemsTotal / data.perPage);
                        if (totalPages > 0) {
                            const pagination = paginationOffPlan(
                                totalPages,
                                apiPage - 1 // Convert 1-based page to 0-based for internal pagination logic
                            );
                            paginationContainer.appendChild(pagination);
                        }
                    }

                    projectsContainer.innerHTML = "";

                    // Iterate over 'items' array from Xano response
                    data.items?.forEach((project) => {
                        const projectCard = createProjectCard(project);
                        projectsContainer.appendChild(projectCard);
                    });
                } catch (error) {
                    console.error("Error fetching projects:", error);

                    // Display user-friendly error message
                    if (projectsContainer) {
                        projectsContainer.innerHTML = `
                        <div style="text-align: center; padding: 40px; color: #666;">
                            <h3>Unable to load projects</h3>
                            <p>${error.message}</p>
                            <div style="margin-top: 20px;">
                                <button onclick="fetchOffPlanProjects()" style="margin-right: 10px; padding: 10px 20px; background: #333; color: white; border: none; border-radius: 5px; cursor: pointer;">
                                    Try Again
                                </button>
                                <button onclick="location.reload()" style="padding: 10px 20px; background: #666; color: white; border: none; border-radius: 5px; cursor: pointer;">
                                    Reload Page
                                </button>
                            </div>
                            ${retryCount < 2 ? `<p style="margin-top: 10px; font-size: 12px; color: #999;">Attempt ${retryCount + 1} of 3</p>` : ''}
                        </div>
                    `;
                    }

                    // Auto-retry logic (up to 2 retries)
                    if (retryCount < 2 && (error.message.includes('timed out') || error.message.includes('temporarily unavailable'))) {
                        console.log(`Retrying in 3 seconds... (attempt ${retryCount + 1})`);
                        setTimeout(() => {
                            fetchOffPlanProjects(retryCount + 1);
                        }, 3000);
                    }
                }
        }
        fetchOffPlanProjects();
        window.addEventListener("popstate", fetchOffPlanProjects);

        // Add network status monitoring
        window.addEventListener('online', () => {
            console.log('Network connection restored');
            // Optionally retry failed requests when connection is restored
            const projectsContainer = document.getElementById("projectsContainer");
            if (projectsContainer && projectsContainer.innerHTML.includes('Unable to load projects')) {
                console.log('Retrying after network restoration...');
                fetchOffPlanProjects();
            }
        });

        window.addEventListener('offline', () => {
            console.log('Network connection lost');
        });

        function formatHandoverDate(timestamp) {
            if (!timestamp) return 'N/A';
            const date = new Date(timestamp); // Assuming timestamp is in milliseconds
            const year = date.getFullYear();
            const month = date.getMonth() + 1; // Month is 0-indexed

            if (1 <= month && month <= 3) {
                return `Q1 ${year}`;
            } else if (4 <= month && month <= 6) {
                return `Q2 ${year}`;
            } else if (7 <= month && month <= 9) {
                return `Q3 ${year}`;
            } else if (10 <= month && month <= 12) {
                return `Q4 ${year}`;
            }
            return `${year}`;
        }

        let currentScrollPosition = 0;

        function updateScrollPosition() {
            currentScrollPosition = window.scrollY;
        }

        window.addEventListener('scroll', updateScrollPosition);

        function createProjectCard(project) {
            // Adjusted to match your Xano API response structure
            const {
                id,
                development_name,
                province,
                price,
                price_to,
                currency,
                built_area,
                built_area_to,
                completion_date,
                type,
                images,
                beds,
                baths,
				town
            } = project;

            const handover = formatHandoverDate(project.completion_date); // Using completion_date for handover

            const card = document.createElement("a");
            card.className = "card";
            card.addEventListener('click', function(event) {
                const clickedElement = event.target;
                // Link to new-building detail page with 'project' parameter
                card.href = `${language && "/" + language}/new-building?project=${id}`;
            });

            // Use simple like system if available
            let isFavorite = false;
            if (window.isLiked) {
                isFavorite = window.isLiked(project.id);
            } else {
                // Fallback to old system
                const savedProjects = JSON.parse(localStorage.getItem('favoriteProjects')) || [];
                isFavorite = savedProjects.some(p => p.id === project.id);
            }

            card.innerHTML = `
    <div>
      <div class="rectangle-parent">
        <div class="swiper-container">
          <div class="swiper-wrapper">
            ${(images && Array.isArray(images) ? images.slice(0, 3) : []).map(image => `
              <div class="swiper-slide">
                <div class="image-skeleton"></div>
                <img class="frame-child" src="${image.image_url}" alt="${development_name}" onload="this.classList.add('loaded'); this.previousElementSibling.style.display='none';" onerror="this.previousElementSibling.style.display='none';" />
              </div>`).join('')}
          </div>
          <button class="card-buttons-swiper-btn-left">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M10.5 5L7.18352 8.5286C6.93883 8.78894 6.93883 9.21106 7.18352 9.4714L10.5 13" stroke="#717171" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
          </button>
          <button class="card-buttons-swiper-btn-right">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M10.5 5L7.18352 8.5286C6.93883 8.78894 6.93883 9.21106 7.18352 9.4714L10.5 13" stroke="#717171" stroke-width="1.2" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="instance-parent">
          <div class="heart-wrapper">
            <svg
              class="heart-icon"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="${isFavorite ? '#313131' : 'none'}"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div class="call-us-wrapper"><div class="off-plan">Call us</div></div>
        </div>
      </div>
      <div class="frame-container">
        <div class="frame-div">
          <div class="marein-natura-parent">
            <div class="marein-natura">${development_name}</div>
            <div class="marbella-spain">${town}</div>
          </div>
          <div class="parent">
            <div class="marein-natura">${currency} ${price.toLocaleString()}</div>
            <div class="m21">${currency} ${Math.round(price / built_area).toLocaleString()} m²</div>
          </div>
        </div>
        <div class="frame-item"></div>
        <div class="developer-name-parent">
          <div class="off-plan">${type}</div>
          <div class="off-plan">${handover}</div>
        </div>
      </div>
    </div>
  `;

            card.querySelector('.card-buttons-swiper-btn-left').addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
            });

            card.querySelector('.card-buttons-swiper-btn-right').addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
            });

            card.querySelector('.heart-wrapper').addEventListener('click', function(event) {
                event.preventDefault(); // Prevent navigating to the project page on heart click

                // Use simple like system
                if (window.toggleLike) {
                    const isLiked = window.toggleLike(project.id);
                    this.querySelector('.heart-icon').setAttribute('fill', isLiked ? '#313131' : 'none');
                } else {
                    // Fallback to old system
                    let savedProjects = JSON.parse(localStorage.getItem('favoriteProjects')) || [];
                    const projectIndex = savedProjects.findIndex(p => p.id === project.id);

                    if (projectIndex > -1) {
                        savedProjects.splice(projectIndex, 1);
                        this.querySelector('.heart-icon').setAttribute('fill', 'none');
                    } else {
                        savedProjects.push(project);
                        this.querySelector('.heart-icon').setAttribute('fill', '#313131');
                    }

                    localStorage.setItem('favoriteProjects', JSON.stringify(savedProjects));
                    
                    // Dispatch event to update badge
                    if (window.dispatchLikesUpdateEvent) {
                        window.dispatchLikesUpdateEvent();
                    }
                }
            });

            // Disable jump to the top when buttons are clicked
            card.querySelector('.card-buttons-swiper-btn-left').addEventListener('click', function(event) {
                event.preventDefault();
            });
            card.querySelector('.card-buttons-swiper-btn-right').addEventListener('click', function(event) {
                event.preventDefault();
            });

            // Initialize Swiper after the card is added to the DOM
            setTimeout(() => {
                const swiperContainer = card.querySelector('.swiper-container');
                if (swiperContainer) {
                    new Swiper(swiperContainer, {
                        navigation: {
                            nextEl: card.querySelector('.card-buttons-swiper-btn-right'),
                            prevEl: card.querySelector('.card-buttons-swiper-btn-left'),
                        },
                        loop: true,
                        slidesPerView: 1, // Show only one slide at a time
                        spaceBetween: 10, // Space between slides if needed
                    });
                } else {
                    console.error('Swiper container not found.');
                }
            }, 0);

            return card;
        }



        async function populateSearchDropdown() {
            try {
                const inputField = document.getElementById("offPlanNameFilter");
                const queryValue = inputField ? inputField.value : "";

                console.log("Input field:", inputField);
                console.log("Query value:", queryValue);

                // Determine property_status based on current page
                const currentPath = window.location.pathname;
                let propertyStatus;

                if (currentPath.includes('new-building') || currentPath.includes('new-buildings') || currentPath.includes('off-plan')) {
                    propertyStatus = ["New building", "Rent"];
                } else {
                    propertyStatus = ["Secondary"];
                }

                console.log("Property status:", propertyStatus);

                const params = new URLSearchParams({
                    query: queryValue,
                    property_status: propertyStatus
                });

                let response;

                if (!response.ok) {
                    console.error('API Response Error:', response.status, response.statusText);
                    if (response.status === 503) {
                        throw new Error("Service temporarily unavailable. Please try again later.");
                    } else if (response.status === 0) {
                        throw new Error("Network error. Please check your connection.");
                    } else {
                        throw new Error(`Failed to fetch search data: ${response.status} ${response.statusText}`);
                    }
                }

                const data = await response.json();
                const projects = data.items || [];

                const dropdownList = document.getElementById("offPlanDropDownList");
                const dropdownBody = document.getElementById("offPlanNameBody");

                dropdownList.innerHTML = "";

                projects?.forEach((project) => {
                    const item = document.createElement("div");
                    item.id = `dropdownItem-${project.id}`;
                    item.className = "filterPropertiesWrapper__dropDown_item input";
                    item.textContent = project.development_name || project.name || "N/A";

                    item.addEventListener("click", function() {
                        inputField.value = project.development_name || project.name;

                        updateQueryParameter("projectName", project.development_name || project.name);
                        dropdownList.innerHTML = "";
                        dropdownBody.classList.remove("active");

                        fetchOffPlanProjects()
                            .then(() => {})
                            .catch(() => {});
                    });

                    dropdownList.appendChild(item);
                });

                inputField.addEventListener("focus", function() {
                    if (dropdownList.childElementCount > 0) {
                        dropdownBody.classList.add("active");
                    }
                });

                document.addEventListener("click", function(event) {
                    const isClickInside = dropdownBody.contains(event.target) || inputField.contains(event.target);
                    if (!isClickInside) {
                        dropdownBody.classList.remove("active");
                    }
                });

            } catch (error) {
                console.error("Error populating search dropdown:", error);
                // Show user-friendly error message
                const dropdownList = document.getElementById("offPlanDropDownList");
                if (dropdownList) {
                    dropdownList.innerHTML = '<div class="filterPropertiesWrapper__dropDown_item">Search temporarily unavailable</div>';
                }
            }

            // Add CSS for better search dropdown visibility
            const style = document.createElement('style');
            style.textContent = `
            .search-clear-btn {
                position: absolute;
                right: 10px;
                top: 50%;
                transform: translateY(-50%);
                background: none;
                border: none;
                font-size: 18px;
                cursor: pointer;
                color: #999;
                padding: 5px;
                border-radius: 50%;
                width: 24px;
                height: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .search-clear-btn:hover {
                background-color: #f0f0f0;
                color: #666;
            }
        `;
            document.head.appendChild(style);

            // Add clear button functionality
            const clearSearchBtn = document.getElementById('clearSearchBtn');
            const searchInput = document.getElementById('offPlanFilterInputName');

            if (clearSearchBtn && searchInput) {
                // Show/hide clear button based on input value
                searchInput.addEventListener('input', function() {
                    if (this.value.length > 0) {
                        clearSearchBtn.style.display = 'flex';
                    } else {
                        clearSearchBtn.style.display = 'none';
                    }
                });

                // Clear button click handler
                clearSearchBtn.addEventListener('click', function() {
                    searchInput.value = '';
                    clearSearchBtn.style.display = 'none';
                    updateQueryParameter("projectName", "");
                    fetchOffPlanProjects()
                        .then(() => {})
                        .catch(() => {});
                });
            }

            function updateQueryParameter(key, value) {
                const queryString = window.location.search.substring(1);
                const params = new URLSearchParams(queryString);

                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }

                const newQueryString = `?${params.toString()}`;
                history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
            }
        }

        function closeAllDropdowns() {
            document
                .querySelectorAll(".filterPropertiesWrapper__dropDown_body.active")
                .forEach((body) => body.classList.remove("active"));
            document
                .querySelectorAll(
                    ".filterPropertiesWrapper__dropDown_header.active"
                )
                .forEach((header) => header.classList.remove("active"));

            document
                .querySelectorAll(
                    ".filterPropertiesWrapper__dropDown_header svg path"
                )
                .forEach((svgIcon) => {
                    svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                });
        }

        function offPlanDropDownBeddrooms() {
            const dropdownContainer = document.getElementById(
                "offPlanBedroomsFilter"
            );

            if (dropdownContainer) {
                const dropdownHeader = dropdownContainer.querySelector(
                    ".filterPropertiesWrapper__dropDown_header"
                );
                const dropdownBody = dropdownContainer.querySelector(
                    ".filterPropertiesWrapper__dropDown_body"
                );
                const dropdownList = dropdownBody.querySelector(
                    ".filterPropertiesWrapper__dropDown_list"
                );
                let bedroomsQuery = [];

                for (let i = 1; i <= 8; i++) {
                    const item = document.createElement("div");
                    item.className = "filterPropertiesWrapper__dropDown_item";
                    item.innerText = `${i} Bedroom`;

                    const checkBox = document.createElement("div");
                    checkBox.className = "filterPropertiesWrapper__customCheckBox";

                    checkBox.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                </svg>
            `;

                    item.appendChild(checkBox);
                    dropdownList.appendChild(item);

                    item.addEventListener("click", function(e) {
                        e.stopPropagation();

                        if (bedroomsQuery.includes(i)) {
                            bedroomsQuery = bedroomsQuery.filter(
                                (bedroom) => bedroom !== i
                            );
                            checkBox.classList.remove("active");
                        } else {
                            bedroomsQuery.push(i);
                            checkBox.classList.add("active");
                        }

                        updateQueryParameter(
                            "bedrooms",
                            bedroomsQuery.length > 0 ?
                            bedroomsQuery.join(",") :
                            null
                        );

                        fetchOffPlanProjects()
                            .then(() => {})
                            .catch(() => {});
                    });
                }

                function toggleMenu() {
                    dropdownBody.classList.toggle("active");
                    dropdownHeader.classList.toggle("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    if (dropdownBody.classList.contains("active")) {
                        svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                    } else {
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }
                }

                dropdownHeader.addEventListener("click", function(e) {
                    e.stopPropagation();

                    if (dropdownBody.classList.contains("active")) {
                        closeMenu(e);
                    } else {
                        closeAllDropdowns();
                        toggleMenu();
                    }
                });

                function closeMenu() {
                    dropdownBody.classList.remove("active");
                    dropdownHeader.classList.remove("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                }

                document.addEventListener("click", function(event) {
                    const isClickInside = dropdownContainer.contains(event.target);

                    if (!isClickInside) {
                        dropdownBody.classList.remove("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }
                });

                function syncCheckboxesWithQuery() {
                    const params = new URLSearchParams(window.location.search);
                    const bedroomsParam = params.get("bedrooms");

                    if (bedroomsParam) {
                        bedroomsQuery = bedroomsParam.split(",").map(Number);
                    } else {
                        bedroomsQuery = [];
                    }

                    dropdownList
                        .querySelectorAll(".filterPropertiesWrapper__dropDown_item")
                        .forEach((item, index) => {
                            const checkBox = item.querySelector(
                                ".filterPropertiesWrapper__customCheckBox"
                            );
                            if (bedroomsQuery.includes(index + 1)) {
                                checkBox.classList.add("active");
                            } else {
                                checkBox.classList.remove("active");
                            }
                        });
                }

                syncCheckboxesWithQuery();

                window.addEventListener("popstate", syncCheckboxesWithQuery);
            }

            function updateQueryParameter(key, value) {
                const queryString = window.location.search.substring(1);
                const params = new URLSearchParams(queryString);

                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }

                const newQueryString = `?${params.toString()}`;
                history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
            }
        }
        offPlanDropDownBeddrooms();
        window.addEventListener("popstate", offPlanDropDownBeddrooms);

        function offPlanDropDownHandover() {
            const dropdownContainer = document.querySelector("#offPlanHandoverFilter");
            const dropdownHeader = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_header"
            );
            const dropdownBody = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_body"
            );
            const dropdownList = dropdownBody.querySelector(
                ".filterPropertiesWrapper__dropDown_list"
            );

            let handoverMin = null;
            let handoverMax = null;

            const handoverValues = [
                "Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024",
                "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025",
                "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"
            ];

            function renderHandoverOptions() {
                handoverValues.forEach((handover) => {
                    const handoverItem = document.createElement("div");
                    handoverItem.className = "filterPropertiesWrapper__dropDown_item";
                    handoverItem.textContent = handover;

                    const checkBox = document.createElement("div");
                    checkBox.className = "filterPropertiesWrapper__customCheckBox";
                    checkBox.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                </svg>
            `;
                    handoverItem.appendChild(checkBox);
                    dropdownList.appendChild(handoverItem);

                    handoverItem.addEventListener("click", function(e) {
                        e.stopPropagation();
                        handleHandoverSelection(handoverItem.textContent.trim());
                    });
                });
            }

            renderHandoverOptions();

            function handleHandoverSelection(handoverText) {
                const dateValue = handoverText;

                if (handoverMin === null) {
                    handoverMin = dateValue;
                    handoverMax = null;
                } else if (compareDates(dateValue, handoverMin) > 0 && handoverMax === null) {
                    handoverMax = dateValue;
                } else if (dateValue === handoverMin) {
                    handoverMin = null;
                    handoverMax = null;
                } else if (dateValue === handoverMax) {
                    handoverMax = null;
                } else if (compareDates(dateValue, handoverMin) < 0) {
                    handoverMin = dateValue;
                    handoverMax = null;
                } else if (compareDates(dateValue, handoverMax) > 0) {
                    handoverMax = dateValue;
                }

                updateHandoversStyles();

                updateQueryParameter(
                    "handoverMin",
                    handoverMin ? convertToISODate(handoverMin) : null
                );
                updateQueryParameter(
                    "handoverMax",
                    handoverMax ? convertToISODate(handoverMax) : null
                );

                fetchOffPlanProjects()
                    .then(() => {})
                    .catch(() => {});
            }

            function updateHandoversStyles() {
                const handoverElements = dropdownList.querySelectorAll(
                    ".filterPropertiesWrapper__dropDown_item"
                );

                handoverElements.forEach((item) => {
                    const dateValue = item.textContent.trim();
                    const checkBox = item.querySelector(
                        ".filterPropertiesWrapper__customCheckBox"
                    );

                    checkBox.classList.remove("active");
                    item.style.opacity = "1"; // Устанавливаем начальное значение opacity для всех элементов

                    if (handoverMin !== null && dateValue === handoverMin) {
                        checkBox.classList.add("active");
                    } else if (handoverMax !== null && dateValue === handoverMax) {
                        checkBox.classList.add("active");
                    } else if (
                        handoverMin !== null && handoverMax !== null &&
                        compareDates(dateValue, handoverMin) >= 0 && compareDates(dateValue, handoverMax) <= 0
                    ) {
                        // Активируем чекбоксы для значений между handoverMin и handoverMax
                        checkBox.classList.add("active");
                    } else if (
                        (handoverMin !== null && compareDates(dateValue, handoverMin) < 0) ||
                        (handoverMax !== null && compareDates(dateValue, handoverMax) > 0)
                    ) {
                        // Если значение меньше минимального или больше максимального, делаем его прозрачным
                        item.style.opacity = "0.5";
                    }
                });
            }

            function convertToISODate(handoverText) {
                const [quarter, year] = handoverText.split(" ");
                const month = {
                    Q1: "01",
                    Q2: "04",
                    Q3: "07",
                    Q4: "10",
                } [quarter];
                return `${year}-${month}-01`;
            }

            function compareDates(dateText1, dateText2) {
                const [quarter1, year1] = dateText1.split(" ");
                const [quarter2, year2] = dateText2.split(" ");
                const month1 = {
                    Q1: "01",
                    Q2: "04",
                    Q3: "07",
                    Q4: "10"
                } [quarter1];
                const month2 = {
                    Q1: "01",
                    Q2: "04",
                    Q3: "07",
                    Q4: "10"
                } [quarter2];

                const date1 = new Date(`${year1}-${month1}-01`);
                const date2 = new Date(`${year2}-${month2}-01`);

                if (date1 < date2) return -1;
                if (date1 > date2) return 1;
                return 0;
            }

            function updateQueryParameter(key, value) {
                const queryString = window.location.search.substring(1);
                const params = new URLSearchParams(queryString);

                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }

                const newQueryString = `?${params.toString()}`;
                history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
            }

            function syncHandoversWithQuery() {
                const urlParams = new URLSearchParams(window.location.search);

                handoverMin = urlParams.get("handoverMin") ?
                    convertFromISODate(urlParams.get("handoverMin")) :
                    null;
                handoverMax = urlParams.get("handoverMax") ?
                    convertFromISODate(urlParams.get("handoverMax")) :
                    null;

                updateHandoversStyles();
            }

            function convertFromISODate(isoDate) {
                const [year, month] = isoDate.split("-");
                const quarter = {
                    "01": "Q1",
                    "04": "Q2",
                    "07": "Q3",
                    10: "Q4",
                } [month];
                return `${quarter} ${year}`;
            }

            syncHandoversWithQuery();

            window.addEventListener("popstate", syncHandoversWithQuery);

            if (dropdownHeader && dropdownBody) {
                function toggleMenu() {
                    dropdownBody.classList.toggle("active");
                    dropdownHeader.classList.toggle("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    if (dropdownBody.classList.contains("active")) {
                        svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                    } else {
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }
                }

                function closeMenu() {
                    dropdownBody.classList.remove("active");
                    dropdownHeader.classList.remove("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                }

                dropdownHeader.addEventListener("click", function(e) {
                    e.stopPropagation();

                    if (dropdownBody.classList.contains("active")) {
                        closeMenu();
                    } else {
                        closeAllDropdowns();
                        toggleMenu();
                    }
                });

                document.addEventListener("click", function(event) {
                    if (
                        !dropdownContainer.contains(event.target) &&
                        !dropdownHeader.contains(event.target)
                    ) {
                        closeMenu();
                    }
                });
            } else {
                console.warn("Menu elements (dropdownHeader or dropdownBody) not found!");
            }
        }
        offPlanDropDownHandover();
        window.addEventListener("popstate", offPlanDropDownHandover);

        function offPlanDropDownPrice() {
            const mainDropdown = document.querySelector("#offPlanPriceFilter");
            const mainHeader = mainDropdown.querySelector(".filterPropertiesWrapper__dropDown_header");
            const mainBody = mainDropdown.querySelector(".filterPropertiesWrapper__dropDown_body");

            const dropdownFromContainer = document.querySelector("#dropdownFrom");
            const dropdownToContainer = document.querySelector("#dropdownTo");

            let priceMin = null;
            let priceMax = null;

            const priceValues = [
                "€ 150.000",
                "€ 200.000",
                "€ 250.000",
                "€ 300.000",
                "€ 350.000",
                "€ 400.000",
                "€ 450.000",
                "€ 500.000",
                "€ 550.000",
                "€ 600.000",
                "€ 650.000",
                "€ 700.000",
                "€ 750.000",
                "€ 800.000",
                "€ 850.000",
                "€ 900.000",
                "€ 950.000",
                "€ 1.000.000",
                "€ 1.500.000",
                "€ 2.000.000",
                "€ 2.500.000",
                "€ 3.000.000",
                "€ 4.000.000",
                "€ 5.000.000",
                "€ 8.000.000",
                "€ 10.000.000",
                "€ 12.000.000",
                "€ 15.000.000",
                "€ 30.000.000",
            ];

            function isLargeScreen() {
                return window.innerWidth > 1024; // Проверяем ширину экрана
            }

            function formatPrice(priceText) {
                const numericValue = parsePriceToNumber(priceText);

                if (numericValue >= 1000000) {
                    const millions = numericValue / 1000000;
                    return millions % 1 === 0 ? `€ ${millions}M` : `€ ${millions.toFixed(1)}M`;
                }

                if (numericValue >= 1000) {
                    return `€ ${Math.floor(numericValue / 1000)}K`;
                }

                return priceText;
            }


            function renderPriceOptions(list, isMin) {
                list.innerHTML = ""; // Очистка перед рендерингом
                priceValues.forEach((price) => {
                    const priceItem = document.createElement("div");
                    priceItem.className = "filterPropertiesWrapper__dropDown_item isPriceItem";

                    // Создание чекбокса с SVG
                    const checkbox = document.createElement("div");
                    checkbox.className = "filterPropertiesWrapper__customCheckBox";

                    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
                    svgIcon.setAttribute("viewBox", "0 0 30 30");
                    svgIcon.setAttribute("width", "10px");
                    svgIcon.setAttribute("height", "10px");

                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", "M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z");
                    path.setAttribute("fill", "white");

                    svgIcon.appendChild(path);
                    checkbox.appendChild(svgIcon);

                    const label = document.createElement("label");
                    label.textContent = formatPrice(price);

                    priceItem.appendChild(label);
                    priceItem.appendChild(checkbox);

                    priceItem.addEventListener("click", () => {
                        const isCurrentlyActive = checkbox.classList.contains("active");

                        if (isCurrentlyActive) {
                            // If already selected, deselect it
                            checkbox.classList.remove("active");
                            if (isMin) {
                                priceMin = null;
                            } else {
                                priceMax = null;
                            }
                        } else {
                            // If not selected, select it
                            checkbox.classList.add("active");
                            handlePriceSelection(price, isMin);
                        }

                        updateQueryParams();
                        fetchOffPlanProjects(() => {});

                        // Закрыть список From или To после выбора
                        const parentBody = list.closest(".filterPropertiesWrapper__dropDown_body");
                        parentBody.classList.remove("active");
                    });

                    list.appendChild(priceItem);
                });
            }
            renderPriceOptions(document.querySelector("#minPriceList"), true);
            renderPriceOptions(document.querySelector("#maxPriceList"), false);

            function handlePriceSelection(priceText, isMin) {
                const priceValue = parsePriceToNumber(priceText);
                if (isMin) {
                    priceMin = priceValue;
                    if (priceMax !== null && priceValue > priceMax) priceMax = null;
                } else {
                    priceMax = priceValue;
                    if (priceMin !== null && priceValue < priceMin) priceMin = null;
                }

                updatePricesStyles();
            }

            function updatePricesStyles() {
                const minItems = document.querySelectorAll("#minPriceList .filterPropertiesWrapper__dropDown_item.isPriceItem");
                const maxItems = document.querySelectorAll("#maxPriceList .filterPropertiesWrapper__dropDown_item.isPriceItem");


                minItems.forEach((item) => {
                    const value = parsePriceToNumber(item.textContent.trim());
                    const checkbox = item.querySelector(".filterPropertiesWrapper__customCheckBox");




                    checkbox.classList.toggle("active", priceMin === (value * 1000));

                });

                maxItems.forEach((item) => {
                    const value = parsePriceToNumber(item.textContent.trim());
                    const checkbox = item.querySelector(".filterPropertiesWrapper__customCheckBox");

                    checkbox.classList.toggle("active", priceMax === (value * 1000));

                });

                updateHeaderValue();
            }

            function updateHeaderValue() {
                const minValue = priceMin !== null ? formatPrice(`€ ${priceMin}`) : "From";
                const maxValue = priceMax !== null ? formatPrice(`€ ${priceMax}`) : "To";

                const fromHeader = dropdownFromContainer.querySelector(".filterPropertiesWrapper__dropDown_header");
                const toHeader = dropdownToContainer.querySelector(".filterPropertiesWrapper__dropDown_header");

                fromHeader.textContent = minValue;
                toHeader.textContent = maxValue;
            }

            function parsePriceToNumber(priceText) {
                return parseInt(priceText.replace(/[€,.]/g, ""), 10);
            }

            function updateQueryParams() {
                // Создаем новый объект URLSearchParams
                const params = new URLSearchParams(window.location.search);

                // Обновляем или удаляем параметры minPrice и maxPrice
                if (priceMin !== null) {
                    params.set("minPrice", priceMin);
                } else {
                    params.delete("minPrice");
                }

                if (priceMax !== null) {
                    params.set("maxPrice", priceMax);
                } else {
                    params.delete("maxPrice");
                }

                // Обновляем URL с новыми параметрами
                history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
            }

            function setupDropdown(container, isMain = false) {
                const header = container.querySelector(".filterPropertiesWrapper__dropDown_header");
                const body = container.querySelector(".filterPropertiesWrapper__dropDown_body");

                header.addEventListener("click", (e) => {
                    e.stopPropagation();

                    // Если это основной dropdown, закрыть все остальные
                    if (isMain) closeAllBodies();

                    body.classList.toggle("active");
                    header.classList.toggle("active");
                });

                document.addEventListener("click", (e) => {
                    if (!container.contains(e.target)) {
                        body.classList.remove("active");
                        header.classList.remove("active");
                    }
                });
            }

            function closeAllBodies(exclude = null) {
                document.querySelectorAll(".filterPropertiesWrapper__dropDown_body.active").forEach((activeBody) => {
                    if (activeBody !== exclude) activeBody.classList.remove("active");
                });
                document.querySelectorAll(".filterPropertiesWrapper__dropDown_header.active").forEach((activeHeader) => {
                    if (!exclude || !exclude.contains(activeHeader)) activeHeader.classList.remove("active");
                });
            }

            // Настройка основного dropdown Price
            setupDropdown(mainDropdown, true);

            // Настройка вложенных dropdown для From и To
            setupDropdown(dropdownFromContainer);
            setupDropdown(dropdownToContainer);

            // Ререндеринг списка при изменении ширины экрана
            window.addEventListener("resize", () => {
                renderPriceOptions(document.querySelector("#minPriceList"), true);
                renderPriceOptions(document.querySelector("#maxPriceList"), false);
                updateHeaderValue();
            });
        }
        offPlanDropDownPrice();
        window.addEventListener("popstate", offPlanDropDownPrice);

        function offPlanDropDownSize() {
            const dropdownContainer = document.querySelector("#offPlanSizeFilter");
            const dropdownHeader = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_header"
            );
            const dropdownBody = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_body"
            );
            const dropdownList = dropdownBody.querySelector(
                ".filterPropertiesWrapper__dropDown_list"
            );

            let sizeMin = null;
            let sizeMax = null;

            const sizeValues = [
                '20 sq.m',
                '30 sq.m',
                '40 sq.m',
                '50 sq.m',
                '60 sq.m',
                '70 sq.m',
                '80 sq.m',
                '90 sq.m',
                '100 sq.m',
                '120 sq.m',
                '140 sq.m',
                '160 sq.m',
                '180 sq.m',
                '200 sq.m',
                '220 sq.m',
                '250 sq.m',
                '270 sq.m',
                '300 sq.m',
                '350 sq.m',
                '400 sq.m',
                '450 sq.m',
                '500 sq.m',
                '550 sq.m',
                '600 sq.m',
                '700 sq.m',
                '800 sq.m',
                '900 sq.m',
                '1.000 sq.m',
                '1.500 sq.m',
                '2.000 sq.m',
                '3.000 sq.m',
            ];

            function renderSizeOptions() {
                sizeValues.forEach((size) => {
                    const sizeItem = document.createElement("div");
                    sizeItem.className = "filterPropertiesWrapper__dropDown_item";
                    sizeItem.textContent = size;

                    const checkBox = document.createElement("div");
                    checkBox.className = "filterPropertiesWrapper__customCheckBox";
                    checkBox.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                </svg>
            `;
                    sizeItem.appendChild(checkBox);
                    dropdownList.appendChild(sizeItem);

                    sizeItem.addEventListener("click", function(e) {
                        e.stopPropagation();
                        handleSizeSelection(sizeItem.textContent.trim());
                    });
                });
            }

            renderSizeOptions();

            function handleSizeSelection(sizeText) {
                const sizeValue = parseSizeToNumber(sizeText);

                if (sizeMin === null) {
                    sizeMin = sizeValue;
                    sizeMax = null;
                } else if (sizeValue > sizeMin && sizeMax === null) {
                    sizeMax = sizeValue;
                } else if (sizeValue === sizeMin) {
                    sizeMin = null;
                    sizeMax = null;
                } else if (sizeValue === sizeMax) {
                    sizeMax = null;
                } else if (sizeValue < sizeMin) {
                    sizeMin = sizeValue;
                    sizeMax = null;
                } else if (sizeValue > sizeMax) {
                    sizeMax = sizeValue;
                }

                updateSizesStyles();

                updateQueryParameter("minSize", sizeMin !== null ? sizeMin.toString() : null);
                updateQueryParameter("maxSize", sizeMax !== null ? sizeMax.toString() : null);

                fetchOffPlanProjects()
                    .then(() => {})
                    .catch(() => {});
            }

            function updateSizesStyles() {
                const sizeElements = dropdownList.querySelectorAll(
                    ".filterPropertiesWrapper__dropDown_item"
                );

                sizeElements.forEach((item) => {
                    const sizeValue = parseSizeToNumber(item.textContent.trim());
                    const checkBox = item.querySelector(
                        ".filterPropertiesWrapper__customCheckBox"
                    );

                    checkBox.classList.remove("active");
                    item.style.opacity = "1"; // Устанавливаем начальное значение opacity для всех элементов

                    if (sizeMin !== null && sizeValue === sizeMin) {
                        checkBox.classList.add("active");
                    } else if (sizeMax !== null && sizeValue === sizeMax) {
                        checkBox.classList.add("active");
                    } else if (
                        sizeMin !== null && sizeMax !== null &&
                        sizeValue > sizeMin && sizeValue < sizeMax
                    ) {
                        // Активируем чекбоксы между sizeMin и sizeMax
                        checkBox.classList.add("active");
                    } else if (
                        (sizeMin !== null && sizeValue < sizeMin) ||
                        (sizeMax !== null && sizeValue > sizeMax)
                    ) {
                        // Если значение меньше минимального или больше максимального, делаем его прозрачным
                        item.style.opacity = "0.5";
                    }
                });
            }

            function parseSizeToNumber(sizeText) {
                return parseInt(
                    sizeText.replace(/[m².,+]/g, "").replace(/\./g, ""),
                    10
                );
            }

            function updateQueryParameter(key, value) {
                const queryString = window.location.search.substring(1);
                const params = new URLSearchParams(queryString);

                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }

                const newQueryString = `?${params.toString()}`;
                history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
            }

            function syncSizesWithQuery() {
                const urlParams = new URLSearchParams(window.location.search);

                sizeMin = urlParams.get("minSize") ?
                    parseInt(urlParams.get("minSize"), 10) :
                    null;
                sizeMax = urlParams.get("maxSize") ?
                    parseInt(urlParams.get("maxSize"), 10) :
                    null;

                updateSizesStyles();
            }

            syncSizesWithQuery();

            window.addEventListener("popstate", syncSizesWithQuery);

            if (dropdownHeader && dropdownBody) {
                function toggleMenu() {
                    dropdownBody.classList.toggle("active");
                    dropdownHeader.classList.toggle("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    if (dropdownBody.classList.contains("active")) {
                        svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                    } else {
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }
                }

                function closeMenu() {
                    dropdownBody.classList.remove("active");
                    dropdownHeader.classList.remove("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                }

                dropdownHeader.addEventListener("click", function(e) {
                    e.stopPropagation();

                    if (dropdownBody.classList.contains("active")) {
                        closeMenu();
                    } else {
                        closeAllDropdowns();
                        toggleMenu();
                    }
                });

                document.addEventListener("click", function(event) {
                    if (
                        !dropdownContainer.contains(event.target) &&
                        !dropdownHeader.contains(event.target)
                    ) {
                        closeMenu();
                    }
                });
            } else {
                console.warn("Menu elements (dropdownHeader or dropdownBody) not found!");
            }
        }
        offPlanDropDownSize();
        window.addEventListener("popstate", offPlanDropDownSize);

        function offPlanDropDownPropertyType() {
            const dropdownContainer = document.querySelector("#offPlanPropertyTypeFilter");
            const dropdownHeader = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_header"
            );
            const dropdownBody = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_body"
            );
            const dropdownList = dropdownBody.querySelector(
                ".filterPropertiesWrapper__dropDown_list"
            );

            const typeValues = [
                'Apartment',
//                 'Villa',
                'House',
//                 'Townhouse',
//                 'Office',
//                 'Plot',
            ];

            // Массив выбранных типов
            let selectedTypes = [];

            // Создание элементов списка
            function renderPropertyTypeOptions() {
                dropdownList.innerHTML = ""; // Очищаем список перед созданием

                typeValues.forEach((typeV) => {
                    const typeItem = document.createElement("div");
                    typeItem.className = "filterPropertiesWrapper__dropDown_item";
                    typeItem.textContent = typeV;

                    const checkBox = document.createElement("div");
                    checkBox.className = "filterPropertiesWrapper__customCheckBox";

                    // SVG для чекбокса
                    checkBox.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                </svg>
            `;
                    typeItem.appendChild(checkBox);
                    dropdownList.appendChild(typeItem);

                    // Обработчик клика
                    typeItem.addEventListener("click", function(e) {
                        e.stopPropagation();
                        handlePropertyTypeSelection(typeV);
                    });

                    // Проверяем, должен ли элемент быть активным
                    if (selectedTypes.includes(typeV)) {
                        checkBox.classList.add("active");
                    }
                });
            }

            // Обработка выбора типов
            function handlePropertyTypeSelection(typeText) {
                if (selectedTypes.includes(typeText)) {
                    // Убираем из выбранных
                    selectedTypes = selectedTypes.filter((type) => type !== typeText);
                } else {
                    // Добавляем в выбранные
                    selectedTypes.push(typeText);
                }

                // Обновляем стили и строку запроса
                updatePropertyTypesStyles();
                updateQueryParameter("propertyType", selectedTypes.length ? selectedTypes.join(",") : null);

                // Обновляем данные через API
                fetchOffPlanProjects()
                    .then(() => {})
                    .catch(() => {});
            }

            // Обновление стилей для выбранных типов
            function updatePropertyTypesStyles() {
                const typeElements = dropdownList.querySelectorAll(
                    ".filterPropertiesWrapper__dropDown_item"
                );

                typeElements.forEach((item) => {
                    const typeValue = item.textContent.trim(); // Убираем возможные лишние пробелы
                    const checkBox = item.querySelector(".filterPropertiesWrapper__customCheckBox");

                    if (!checkBox) {
                        console.warn(`Чекбокс для элемента ${typeValue} не найден`);
                        return;
                    }

                    // Сбрасываем класс active
                    checkBox.classList.remove("active");

                    // Устанавливаем active, если элемент выбран
                    if (selectedTypes.includes(typeValue)) {
                        checkBox.classList.add("active");
                    }
                });
            }

            // Обновление параметров строки запроса
            function updateQueryParameter(key, value) {
                const params = new URLSearchParams(window.location.search);

                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }

                const newQueryString = `?${params.toString()}`;
                history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
            }

            // Синхронизация с URL
            function syncPropertyTypesWithQuery() {
                const urlParams = new URLSearchParams(window.location.search);
                const typesFromQuery = urlParams.get("propertyType");

                selectedTypes = typesFromQuery ?
                    typesFromQuery.split(",").map((type) => type.trim()) : [];

                // Перерисовываем элементы с учетом активных
                renderPropertyTypeOptions();
            }

            // Инициализация
            renderPropertyTypeOptions();
            syncPropertyTypesWithQuery();

            window.addEventListener("popstate", syncPropertyTypesWithQuery);

            // Открытие/закрытие меню
            if (dropdownHeader && dropdownBody) {
                function toggleMenu() {
                    dropdownBody.classList.toggle("active");
                    dropdownHeader.classList.toggle("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    if (dropdownBody.classList.contains("active")) {
                        svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                    } else {
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }
                }

                function closeMenu() {
                    dropdownBody.classList.remove("active");
                    dropdownHeader.classList.remove("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                }

                dropdownHeader.addEventListener("click", function(e) {
                    e.stopPropagation();

                    if (dropdownBody.classList.contains("active")) {
                        closeMenu();
                    } else {
                        closeAllDropdowns();
                        toggleMenu();
                    }
                });

                document.addEventListener("click", function(event) {
                    if (
                        !dropdownContainer.contains(event.target) &&
                        !dropdownHeader.contains(event.target)
                    ) {
                        closeMenu();
                    }
                });
            } else {
                console.warn("Menu elements (dropdownHeader or dropdownBody) not found!");
            }
        }
        offPlanDropDownPropertyType();
        window.addEventListener("popstate", offPlanDropDownPropertyType);

        function offPlanDropDownLocation() {
            const dropdownContainer = document.querySelector("#offPlanLocationFilter");
            const dropdownHeader = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_header"
            );
            const dropdownBody = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_body"
            );
            const dropdownList = dropdownBody.querySelector(
                ".filterPropertiesWrapper__dropDown_list"
            );

            let selectedLocations = new Set();

            function renderLocationOptions() {
                areasData.forEach((area) => {
                    const areaItem = document.createElement("div");
                    areaItem.className = "filterPropertiesWrapper__dropDown_item";

                    // Создаем обертку для основного названия территории
                    const mainListSelectedWrapper = document.createElement("div");
                    mainListSelectedWrapper.className = "mainListSelectedWrapper";

                    // Создаем div для отображения выбранных субтерриторий
                    const mainListSelected = document.createElement("div");
                    mainListSelected.className = "mainListSelected";

                    // Вставляем текст названия территории
                    mainListSelectedWrapper.appendChild(mainListSelected);
                    mainListSelectedWrapper.append(area.label);

                    // Добавляем обертку с названием в основной элемент
                    areaItem.appendChild(mainListSelectedWrapper);

                    // Создаем иконку стрелки и добавляем её
                    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    icon.setAttribute("width", "24");
                    icon.setAttribute("height", "24");
                    icon.setAttribute("viewBox", "0 0 24 24");
                    icon.setAttribute("fill", "none");
                    icon.innerHTML = `<path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
                    areaItem.appendChild(icon);

                    // Создание списка подтерриторий
                    const subAreaList = document.createElement("div");
                    subAreaList.className =
                        "filterPropertiesWrapper__dropDownLocationsWrapper_list";
                    subAreaList.style.display = "none"; // Скрываем подтерритории изначально

                    // Создаем кнопку "All"
                    const selectAllItem = document.createElement("div");
                    selectAllItem.className = "filterPropertiesWrapper__dropDown_item selectAll";
                    selectAllItem.innerHTML = `All<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px"></svg>`;
                    const selectAllCheckBox = document.createElement("div");
                    selectAllCheckBox.className = "filterPropertiesWrapper__customCheckBox";
                    selectAllItem.appendChild(selectAllCheckBox);

                    selectAllItem.addEventListener("click", function(e) {
                        e.stopPropagation();
                        handleSelectAll(area.subAreas);
                    });

                    subAreaList.appendChild(selectAllItem);

                    // Добавляем подтерритории
                    area.subAreas.forEach((subArea) => {
                        const subAreaItem = document.createElement("div");
                        subAreaItem.className =
                            "filterPropertiesWrapper__dropDown_item location";
                        subAreaItem.textContent = subArea.newLabel;

                        const subAreaCheckBox = document.createElement("div");
                        subAreaCheckBox.className =
                            "filterPropertiesWrapper__customCheckBox";

                        subAreaItem.appendChild(subAreaCheckBox); // Добавляем чекбокс

                        subAreaItem.addEventListener("click", function(e) {
                            e.stopPropagation();
                            handleSubAreaSelection(subArea.value, area.subAreas);
                        });

                        subAreaList.appendChild(subAreaItem);
                    });

                    // Добавляем обработчик нажатия для главной территории
                    areaItem.addEventListener("click", function(e) {
                        e.stopPropagation();
                        const isActive = subAreaList.style.display === "block";
                        subAreaList.style.display = isActive ? "none" : "block";
                        // Устанавливаем класс active у подтерриторий
                        subAreaList.classList.toggle("active", !isActive);
                        areaItem.classList.toggle("active", !isActive); // Устанавливаем класс active у главной территории
                    });

                    dropdownList.appendChild(areaItem);
                    dropdownList.appendChild(subAreaList);
                });

                // После рендеринга вызываем обновление стилей, чтобы правильно отобразить состояние чекбокса "All"
                updateLocationsStyles();
            }


            renderLocationOptions();

            function handleSelectAll(subAreas) {
                const allSelected = subAreas.every(subArea => selectedLocations.has(subArea.value));
                if (allSelected) {
                    subAreas.forEach(subArea => selectedLocations.delete(subArea.value));
                } else {
                    subAreas.forEach(subArea => selectedLocations.add(subArea.value));
                }
                updateLocationsStyles();
                updateQueryParameter(
                    "subAreas",
                    selectedLocations.size > 0 ?
                    Array.from(selectedLocations).join(",") :
                    null
                );
                fetchOffPlanProjects();
            }

            function handleSubAreaSelection(subAreaValue, subAreas) {
                if (selectedLocations.has(subAreaValue)) {
                    selectedLocations.delete(subAreaValue);
                } else {
                    selectedLocations.add(subAreaValue);
                }
                updateLocationsStyles(subAreas);
                updateQueryParameter(
                    "subAreas",
                    selectedLocations.size > 0 ?
                    Array.from(selectedLocations).join(",") :
                    null
                );
                fetchOffPlanProjects();
            }

            function updateLocationsStyles() {
                // Обновляем состояния чекбоксов для подтерриторий
                dropdownList.querySelectorAll(".filterPropertiesWrapper__dropDown_item.location").forEach((item) => {
                    const subAreaValue = item.textContent.trim();
                    const checkBox = item.querySelector(".filterPropertiesWrapper__customCheckBox");

                    if (selectedLocations.has(subAreaValue)) {
                        checkBox.classList.add("active");
                        checkBox.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
<path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
</svg>`;
                    } else {
                        checkBox.classList.remove("active");
                        checkBox.innerHTML = ""; // Удаляем SVG, если не выбрано
                    }
                });

                // Обновляем счетчик выбранных подтерриторий и состояние mainListSelected
                dropdownList.querySelectorAll(".mainListSelectedWrapper").forEach((mainListWrapper) => {
                    const areaLabel = mainListWrapper.textContent.trim().replace(/[0-9]+/g, '').trim(); // Убираем число, если оно добавляется автоматически
                    const area = areasData.find(area => area.label === areaLabel);

                    if (area) {
                        const selectedSubAreasCount = area.subAreas.filter(subArea => selectedLocations.has(subArea.value)).length;
                        const mainListSelected = mainListWrapper.querySelector(".mainListSelected");

                        if (selectedSubAreasCount > 0) {
                            mainListSelected.classList.add("active");
                            mainListSelected.textContent = selectedSubAreasCount;
                        } else {
                            mainListSelected.classList.remove("active");
                            mainListSelected.textContent = ""; // Очищаем текст, если ничего не выбрано
                        }
                    }
                });

                // Обновляем состояние кнопки "All" для каждой области
                dropdownList.querySelectorAll(".filterPropertiesWrapper__dropDown_item.selectAll").forEach((selectAllItem) => {
                    const checkBox = selectAllItem.querySelector(".filterPropertiesWrapper__customCheckBox");

                    // Обнаружение родительской области более точно
                    const areaWrapper = selectAllItem.closest('.filterPropertiesWrapper__dropDownLocationsWrapper_list').previousElementSibling;
                    const areaLabel = areaWrapper ? areaWrapper.textContent.trim().replace(/[0-9]+/g, '').trim() : '';
                    const area = areasData.find(area => area.label === areaLabel);

                    if (area) {
                        const allSelected = area.subAreas.every(subArea => selectedLocations.has(subArea.value));

                        if (allSelected && area.subAreas.length > 0) {
                            checkBox.classList.add("active");
                            checkBox.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
<path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
</svg>`;
                        } else {
                            checkBox.classList.remove("active");
                            checkBox.innerHTML = ""; // Убираем активное состояние, если не все выбрано
                        }
                    }
                });
            }

            function updateQueryParameter(key, value) {
                const queryString = window.location.search.substring(1);
                const params = new URLSearchParams(queryString);

                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }

                const newQueryString = `?${params.toString()}`;
                history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
            }

            function syncLocationsWithQuery() {
                const urlParams = new URLSearchParams(window.location.search);
                const subAreasParam = urlParams.get("subAreas");

                if (subAreasParam) {
                    selectedLocations = new Set(subAreasParam.split(","));
                } else {
                    selectedLocations.clear();
                }

                updateLocationsStyles();
            }

            syncLocationsWithQuery();

            window.addEventListener("popstate", syncLocationsWithQuery);

            dropdownHeader.addEventListener("click", function(e) {
                e.stopPropagation();

                if (dropdownBody.classList.contains("active")) {
                    closeMenu();
                } else {
                    closeAllDropdowns();
                    toggleMenu();
                }
            });

            document.addEventListener("click", function(event) {
                if (!dropdownContainer.contains(event.target)) {
                    closeMenu();
                }
            });

            function toggleMenu() {
                dropdownBody.classList.toggle("active");
                dropdownHeader.classList.toggle("active");

                const svgPath = dropdownHeader.querySelector("svg path");
                if (dropdownBody.classList.contains("active")) {
                    svgPath.setAttribute("d", "M7 14L12 10L17 14");
                } else {
                    svgPath.setAttribute("d", "M7 10L12 14L17 10");
                }
            }

            function closeMenu() {
                dropdownBody.classList.remove("active");
                dropdownHeader.classList.remove("active");

                const svgPath = dropdownHeader.querySelector("svg path");
                svgPath.setAttribute("d", "M7 10L12 14L17 10");
            }

            function closeAllDropdowns() {
                document
                    .querySelectorAll(".filterPropertiesWrapper__dropDown_body.active")
                    .forEach((body) => body.classList.remove("active"));
                document
                    .querySelectorAll(".filterPropertiesWrapper__dropDown_header.active")
                    .forEach((header) => header.classList.remove("active"));

                document
                    .querySelectorAll(".filterPropertiesWrapper__dropDown_header svg path")
                    .forEach((svgIcon) => {
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    });
            }
        }
        offPlanDropDownLocation();
        window.addEventListener("popstate", offPlanDropDownLocation);

        function offPlanDropDownSort() {
            const dropdownContainer = document.getElementById(
                "offPlanSortFilter"
            );

            if (dropdownContainer) {
                const dropdownHeader = dropdownContainer.querySelector(
                    ".filterPropertiesWrapper__dropDown_header"
                );
                const dropdownBody = dropdownContainer.querySelector(
                    ".filterPropertiesWrapper__dropDown_body"
                );
                const dropdownList = dropdownBody.querySelector(
                    ".filterPropertiesWrapper__dropDown_list"
                );
                let sortQuery = null;

                const sortValues = [
                    "Size Smaller",
                    "Size Bigger",
                    "By Handover",
                    "Newly added",
                ];

                function getSortQueryFromURL() {
                    const urlParams = new URLSearchParams(window.location.search);
                    return urlParams.get("sort");
                }

                sortQuery = getSortQueryFromURL();

                sortValues.forEach((value) => {
                    const item = document.createElement("div");
                    item.className = "filterPropertiesWrapper__dropDown_item";
                    item.innerText = value;

                    const checkBox = document.createElement("div");
                    checkBox.className = "filterPropertiesWrapper__customCheckBox";

                    checkBox.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                </svg>
            `;

                    item.appendChild(checkBox);
                    dropdownList.appendChild(item);

                    if (sortQuery === value) {
                        checkBox.classList.add("active");
                    }

                    item.addEventListener("click", function(e) {
                        e.stopPropagation();

                        if (sortQuery === value) {
                            sortQuery = null;
                            checkBox.classList.remove("active");
                        } else {
                            sortQuery = value;
                            dropdownList
                                .querySelectorAll(
                                    ".filterPropertiesWrapper__customCheckBox"
                                )
                                .forEach((box) => box.classList.remove("active"));
                            checkBox.classList.add("active");
                        }

                        updateQueryParameter("sort", sortQuery);

                        fetchOffPlanProjects()
                            .then(() => {})
                            .catch(() => {});
                    });
                });

                dropdownHeader.addEventListener("click", function(e) {
                    e.stopPropagation();

                    if (dropdownBody.classList.contains("active")) {
                        closeMenu(e);
                    } else {
                        closeAllDropdowns();
                        toggleMenu();
                    }
                });

                function toggleMenu() {
                    dropdownBody.classList.toggle("active");
                    dropdownHeader.classList.toggle("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    if (dropdownBody.classList.contains("active")) {
                        svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                    } else {
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }
                }

                function closeMenu() {
                    dropdownBody.classList.remove("active");
                    dropdownHeader.classList.remove("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                }

                document.addEventListener("click", function(event) {
                    const isClickInside = dropdownContainer.contains(event.target);

                    if (!isClickInside) {
                        dropdownBody.classList.remove("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }
                });

                window.addEventListener("popstate", () => {
                    sortQuery = getSortQueryFromURL();

                    dropdownList
                        .querySelectorAll(".filterPropertiesWrapper__dropDown_item")
                        .forEach((item) => {
                            const checkBox = item.querySelector(
                                ".filterPropertiesWrapper__customCheckBox"
                            );
                            if (item.innerText === sortQuery) {
                                checkBox.classList.add("active");
                            } else {
                                checkBox.classList.remove("active");
                            }
                        });
                });
            }

            function updateQueryParameter(key, value) {
                const urlParams = new URLSearchParams(window.location.search);

                if (value) {
                    urlParams.set(key, value);
                } else {
                    urlParams.delete(key);
                }

                const newQueryString = `?${urlParams.toString()}`;
                history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
            }
        }
        offPlanDropDownSort();
        window.addEventListener("hashchange", offPlanDropDownSort);

        function clearOffPlanFilters() {
            const clearBtn = document.querySelector("#clearBtnOffPlanFilter");
            const clearBtnMobile = document.querySelector(
                "#clearBtnOffPlanFilterAdaptive"
            );

            if (!clearBtn) {
                console.warn("Clear button not found!");
                return;
            }

            clearBtn.addEventListener("click", function() {
                clearFilters();
            });

            if (clearBtnMobile) {
                clearBtnMobile.addEventListener("click", function() {
                    clearFilters();
                });
            }

            function clearFilters() {
                const currentUrl = window.location.pathname;
                const urlParams = new URLSearchParams(window.location.search);

                const page = urlParams.get("page");
                const visible = urlParams.get("visible");

                const newUrlParams = new URLSearchParams();
                if (page) {
                    newUrlParams.set("page", page);
                }
                if (visible) {
                    newUrlParams.set("visible", visible);
                }

                history.replaceState({}, "", `${currentUrl}?${newUrlParams.toString()}`);

                document
                    .querySelectorAll(".filtersMap__select-body p")
                    .forEach((item) => {
                        item.style.opacity = "1";
                    });

                // Удаление всех активных чекбоксов
                document
                    .querySelectorAll(".filterPropertiesWrapper__customCheckBox.active")
                    .forEach((checkBox) => {
                        checkBox.classList.remove("active");
                    });

                const nameInput = document.querySelector("#secondaryFilterInputName");
                if (nameInput) {
                    nameInput.value = "";
                }

                window.minPrice = null;
                window.maxPrice = null;
                window.minSize = null;
                window.maxSize = null;
                window.handoverMin = null;
                window.handoverMax = null;
                window.selectedBedrooms = null;
                window.name = null;
                window.sort = null;

                window.location.reload();
            }

            window.addEventListener("popstate", clearOffPlanFilters);
        }
        clearOffPlanFilters();

        function offPlanModalAdaptiveHandlers() {
            const filterButton = document.getElementById("offPlanFiltetAdaptive");
            const modalAdaptiveFilters = document.getElementById("offPlanAdaptiveFilters");
            const closeButton = document.querySelector(".adapriveFilters__header-btnClose");
            const redirectBtn = document.getElementById("redirectBtnOffPlanFilterAdaptiveSecondary");

            console.log("offPlanModalAdaptiveHandlers called");
            console.log("filterButton:", filterButton);
            console.log("modalAdaptiveFilters:", modalAdaptiveFilters);
            console.log("closeButton:", closeButton);

            if (!filterButton) {
                console.warn("Filter button (offPlanFiltetAdaptive) not found!");
                return;
            }

            if (!modalAdaptiveFilters) {
                console.warn("Modal (offPlanAdaptiveFilters) not found!");
                return;
            }

            if (!closeButton) {
                console.warn("Close button not found!");
                return;
            }

            // Use URLSearchParams to get query parameters
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            const visible = urlParams.get("visible");

            if (visible === "Off plan" && redirectBtn) {
                redirectBtn.addEventListener("click", () => {
                    closeModal();
                });
            }

            const openModal = () => {
                console.log("openModal called, window width:", window.innerWidth);
                // Remove the width restriction to allow modal to open on all screen sizes
                console.log("Adding active class to modal");
                modalAdaptiveFilters.classList.add("active");
                document.body.style.overflow = "hidden";
            };

            const closeModal = () => {
                modalAdaptiveFilters.classList.remove("active");
                document.body.style.overflow = "";
            };

            filterButton.addEventListener("click", (e) => {
                console.log("Filter button clicked!");
                openModal();
            });
            closeButton.addEventListener("click", closeModal);

            modalAdaptiveFilters.addEventListener("click", (e) => {
                if (e.target === modalAdaptiveFilters) {
                    closeModal();
                }
            });
        }

        offPlanModalAdaptiveHandlers();
        window.addEventListener("popstate", offPlanModalAdaptiveHandlers);

        // Additional test to ensure the button works
        document.addEventListener('DOMContentLoaded', function() {
            const testButton = document.getElementById("offPlanFiltetAdaptive");
            if (testButton) {
                console.log("Test button found, adding test click handler");
                testButton.addEventListener("click", function() {
                    console.log("Test click handler triggered!");
                    const modal = document.getElementById("offPlanAdaptiveFilters");
                    if (modal) {
                        console.log("Modal found, adding active class");
                        modal.classList.add("active");
                        document.body.style.overflow = "hidden";
                    } else {
                        console.log("Modal not found!");
                    }
                });
            } else {
                console.log("Test button not found!");
            }
        });

        // // mobile

        function offPlanDropDownBeddroomsMobile() {
            const dropdownContainer = document.getElementById(
                "offPlanBedroomsFilterMobile"
            );

            if (dropdownContainer) {
                const dropdownHeader = dropdownContainer.querySelector(
                    ".filterPropertiesWrapper__dropDown_header"
                );
                const dropdownBody = dropdownContainer.querySelector(
                    ".filterPropertiesWrapper__dropDown_body"
                );
                const dropdownList = dropdownBody.querySelector(
                    ".filterPropertiesWrapper__dropDown_list"
                );
                let bedroomsQuery = [];

                for (let i = 1; i <= 8; i++) {
                    const item = document.createElement("div");
                    item.className = "filterPropertiesWrapper__dropDown_item";
                    item.innerText = `${i} Bedroom`;

                    const checkBox = document.createElement("div");
                    checkBox.className = "filterPropertiesWrapper__customCheckBox";

                    checkBox.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                </svg>
            `;

                    item.appendChild(checkBox);
                    dropdownList.appendChild(item);

                    item.addEventListener("click", function(e) {
                        e.stopPropagation();

                        if (bedroomsQuery.includes(i)) {
                            bedroomsQuery = bedroomsQuery.filter(
                                (bedroom) => bedroom !== i
                            );
                            checkBox.classList.remove("active");
                        } else {
                            bedroomsQuery.push(i);
                            checkBox.classList.add("active");
                        }

                        updateQueryParameter(
                            "bedrooms",
                            bedroomsQuery.length > 0 ?
                            bedroomsQuery.join(",") :
                            null
                        );

                        fetchOffPlanProjects()
                            .then(() => {})
                            .catch(() => {});
                    });
                }

                function toggleMenu() {
                    dropdownBody.classList.toggle("active");
                    dropdownHeader.classList.toggle("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    if (dropdownBody.classList.contains("active")) {
                        svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                    } else {
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }
                }

                dropdownHeader.addEventListener("click", function(e) {
                    e.stopPropagation();

                    if (dropdownBody.classList.contains("active")) {
                        closeMenu(e);
                    } else {
                        closeAllDropdowns();
                        toggleMenu();
                    }
                });

                function closeMenu() {
                    dropdownBody.classList.remove("active");
                    dropdownHeader.classList.remove("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                }

                document.addEventListener("click", function(event) {
                    const isClickInside = dropdownContainer.contains(event.target);

                    if (!isClickInside) {
                        dropdownBody.classList.remove("active");

                        const svgIcon = dropdownHeader.querySelector("svg path");
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }
                });

                function syncCheckboxesWithQuery() {
                    const params = new URLSearchParams(window.location.search);
                    const bedroomsParam = params.get("bedrooms");

                    if (bedroomsParam) {
                        bedroomsQuery = bedroomsParam.split(",").map(Number);
                    } else {
                        bedroomsQuery = [];
                    }

                    dropdownList
                        .querySelectorAll(".filterPropertiesWrapper__dropDown_item")
                        .forEach((item, index) => {
                            const checkBox = item.querySelector(
                                ".filterPropertiesWrapper__customCheckBox"
                            );
                            if (bedroomsQuery.includes(index + 1)) {
                                checkBox.classList.add("active");
                            } else {
                                checkBox.classList.remove("active");
                            }
                        });
                }

                syncCheckboxesWithQuery();

                window.addEventListener("popstate", syncCheckboxesWithQuery);
            }

            function updateQueryParameter(key, value) {
                const queryString = window.location.search.substring(1);
                const params = new URLSearchParams(queryString);

                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }

                const newQueryString = `?${params.toString()}`;
                history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
            }
        }
        offPlanDropDownBeddroomsMobile();
        window.addEventListener("popstate", offPlanDropDownBeddroomsMobile);

        function offPlanDropDownPriceMobile() {
            const dropdownContainer = document.querySelector("#offPlanPriceFilterMobile");
            const dropdownHeader = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_header"
            );
            const dropdownBody = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_body"
            );
            const dropdownList = dropdownBody.querySelector(
                ".filterPropertiesWrapper__dropDown_list"
            );

            let priceMin = null;
            let priceMax = null;

            const priceValues = [
                '€ 150.000',
                '€ 200.000',
                '€ 250.000',
                '€ 300.000',
                '€ 350.000',
                '€ 400.000',
                '€ 450.000',
                '€ 500.000',
                '€ 550.000',
                '€ 600.000',
                '€ 650.000',
                '€ 700.000',
                '€ 750.000',
                '€ 800.000',
                '€ 850.000',
                '€ 900.000',
                '€ 950.000',
                '€ 1.000.000',
                '€ 1.250.000',
                '€ 1.500.000',
                '€ 1.750.000',
                '€ 2.000.000',
                '€ 2.500.000',
                '€ 3.000.000',
                '€ 3.500.000',
                '€ 4.000.000',
                '€ 5.000.000',
                '€ 10.000.000',
                '€ 15.000.000',
                '€ 20.000.000',
            ];

            function renderPriceOptions() {
                priceValues.forEach((price) => {
                    const priceItem = document.createElement("div");
                    priceItem.className = "filterPropertiesWrapper__dropDown_item";
                    priceItem.textContent = price;

                    const checkBox = document.createElement("div");
                    checkBox.className = "filterPropertiesWrapper__customCheckBox";
                    checkBox.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
            </svg>
        `;
                    priceItem.appendChild(checkBox);
                    dropdownList.appendChild(priceItem);

                    priceItem.addEventListener("click", function(e) {
                        e.stopPropagation();
                        handlePriceSelection(priceItem.textContent.trim());
                    });
                });
            }

            renderPriceOptions();

            function handlePriceSelection(priceText) {
                const priceValue = parsePriceToNumber(priceText);

                if (priceMin === null) {
                    priceMin = priceValue;
                    priceMax = null;
                } else if (priceValue > priceMin && priceMax === null) {
                    priceMax = priceValue;
                } else if (priceValue === priceMin) {
                    priceMin = null;
                    priceMax = null;
                } else if (priceValue === priceMax) {
                    priceMax = null;
                } else if (priceValue < priceMin) {
                    priceMin = priceValue;
                    priceMax = null;
                } else if (priceValue > priceMax) {
                    priceMax = priceValue;
                }

                updatePricesStyles();

                updateQueryParameter("minPrice", priceMin !== null ? priceMin.toString() : null);
                updateQueryParameter("maxPrice", priceMax !== null ? priceMax.toString() : null);

                fetchOffPlanProjects()
                    .then(() => {})
                    .catch(() => {});
            }

            function updatePricesStyles() {
                const priceElements = dropdownList.querySelectorAll(
                    ".filterPropertiesWrapper__dropDown_item"
                );

                priceElements.forEach((item) => {
                    const priceValue = parsePriceToNumber(item.textContent.trim());
                    const checkBox = item.querySelector(
                        ".filterPropertiesWrapper__customCheckBox"
                    );

                    checkBox.classList.remove("active");
                    item.style.opacity = "1"; // Устанавливаем начальное значение opacity для всех элементов

                    if (priceMin !== null && priceValue === priceMin) {
                        checkBox.classList.add("active");
                    } else if (priceMax !== null && priceValue === priceMax) {
                        checkBox.classList.add("active");
                    } else if (
                        priceMin !== null && priceMax !== null &&
                        priceValue > priceMin && priceValue < priceMax
                    ) {
                        // Активируем чекбоксы между min и max
                        checkBox.classList.add("active");
                    } else if (
                        (priceMin !== null && priceValue < priceMin) ||
                        (priceMax !== null && priceValue > priceMax)
                    ) {
                        // Если значение меньше минимального или больше максимального, делаем его прозрачным
                        item.style.opacity = "0.5";
                    }
                });
            }

            function parsePriceToNumber(priceText) {
                return parseInt(priceText.replace(/[€,.+]/g, ""), 10);
            }

            function updateQueryParameter(key, value) {
                const queryString = window.location.search.substring(1);
                const params = new URLSearchParams(queryString);

                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }

                const newQueryString = `?${params.toString()}`;
                history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
            }

            function syncPricesWithQuery() {
                const urlParams = new URLSearchParams(window.location.search);

                priceMin = urlParams.get("minPrice") ?
                    parseInt(urlParams.get("minPrice"), 10) :
                    null;
                priceMax = urlParams.get("maxPrice") ?
                    parseInt(urlParams.get("maxPrice"), 10) :
                    null;

                updatePricesStyles();
            }

            syncPricesWithQuery();

            window.addEventListener("popstate", syncPricesWithQuery);

            if (dropdownHeader && dropdownBody) {
                function toggleMenu() {
                    dropdownBody.classList.toggle("active");
                    dropdownHeader.classList.toggle("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    if (dropdownBody.classList.contains("active")) {
                        svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                    } else {
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }
                }

                function closeMenu() {
                    dropdownBody.classList.remove("active");
                    dropdownHeader.classList.remove("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                }

                dropdownHeader.addEventListener("click", function(e) {
                    e.stopPropagation();

                    if (dropdownBody.classList.contains("active")) {
                        closeMenu();
                    } else {
                        closeAllDropdowns();
                        toggleMenu();
                    }
                });

                document.addEventListener("click", function(event) {
                    if (
                        !dropdownContainer.contains(event.target) &&
                        !dropdownHeader.contains(event.target)
                    ) {
                        closeMenu();
                    }
                });
            } else {
                console.warn("Menu elements (dropdownHeader or dropdownBody) not found!");
            }
        }
        offPlanDropDownPriceMobile();
        window.addEventListener("popstate", offPlanDropDownPriceMobile);

        function offPlanDropDownSizeMobile() {
            const dropdownContainer = document.querySelector("#offPlanSizeFilterMobile");
            const dropdownHeader = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_header"
            );
            const dropdownBody = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_body"
            );
            const dropdownList = dropdownBody.querySelector(
                ".filterPropertiesWrapper__dropDown_list"
            );

            let sizeMin = null;
            let sizeMax = null;

            const sizeValues = [
                '20 sq.m',
                '30 sq.m',
                '40 sq.m',
                '50 sq.m',
                '60 sq.m',
                '70 sq.m',
                '80 sq.m',
                '90 sq.m',
                '100 sq.m',
                '120 sq.m',
                '140 sq.m',
                '160 sq.m',
                '180 sq.m',
                '200 sq.m',
                '220 sq.m',
                '250 sq.m',
                '270 sq.m',
                '300 sq.m',
                '350 sq.m',
                '400 sq.m',
                '450 sq.m',
                '500 sq.m',
                '550 sq.m',
                '600 sq.m',
                '700 sq.m',
                '800 sq.m',
                '900 sq.m',
                '1.000 sq.m',
                '1.500 sq.m',
                '2.000 sq.m',
                '3.000 sq.m',
            ];

            function renderSizeOptions() {
                sizeValues.forEach((size) => {
                    const sizeItem = document.createElement("div");
                    sizeItem.className = "filterPropertiesWrapper__dropDown_item";
                    sizeItem.textContent = size;

                    const checkBox = document.createElement("div");
                    checkBox.className = "filterPropertiesWrapper__customCheckBox";
                    checkBox.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                </svg>
            `;
                    sizeItem.appendChild(checkBox);
                    dropdownList.appendChild(sizeItem);

                    sizeItem.addEventListener("click", function(e) {
                        e.stopPropagation();
                        handleSizeSelection(sizeItem.textContent.trim());
                    });
                });
            }

            renderSizeOptions();

            function handleSizeSelection(sizeText) {
                const sizeValue = parseSizeToNumber(sizeText);

                if (sizeMin === null) {
                    sizeMin = sizeValue;
                    sizeMax = null;
                } else if (sizeValue > sizeMin && sizeMax === null) {
                    sizeMax = sizeValue;
                } else if (sizeValue === sizeMin) {
                    sizeMin = null;
                    sizeMax = null;
                } else if (sizeValue === sizeMax) {
                    sizeMax = null;
                } else if (sizeValue < sizeMin) {
                    sizeMin = sizeValue;
                    sizeMax = null;
                } else if (sizeValue > sizeMax) {
                    sizeMax = sizeValue;
                }

                updateSizesStyles();

                updateQueryParameter("minSize", sizeMin !== null ? sizeMin.toString() : null);
                updateQueryParameter("maxSize", sizeMax !== null ? sizeMax.toString() : null);

                fetchOffPlanProjects()
                    .then(() => {})
                    .catch(() => {});
            }

            function updateSizesStyles() {
                const sizeElements = dropdownList.querySelectorAll(
                    ".filterPropertiesWrapper__dropDown_item"
                );

                sizeElements.forEach((item) => {
                    const sizeValue = parseSizeToNumber(item.textContent.trim());
                    const checkBox = item.querySelector(
                        ".filterPropertiesWrapper__customCheckBox"
                    );

                    checkBox.classList.remove("active");
                    item.style.opacity = "1"; // Устанавливаем начальное значение opacity для всех элементов

                    if (sizeMin !== null && sizeValue === sizeMin) {
                        checkBox.classList.add("active");
                    } else if (sizeMax !== null && sizeValue === sizeMax) {
                        checkBox.classList.add("active");
                    } else if (
                        sizeMin !== null && sizeMax !== null &&
                        sizeValue > sizeMin && sizeValue < sizeMax
                    ) {
                        // Активируем чекбоксы между sizeMin и sizeMax
                        checkBox.classList.add("active");
                    } else if (
                        (sizeMin !== null && sizeValue < sizeMin) ||
                        (sizeMax !== null && sizeValue > sizeMax)
                    ) {
                        // Если значение меньше минимального или больше максимального, делаем его прозрачным
                        item.style.opacity = "0.5";
                    }
                });
            }

            function parseSizeToNumber(sizeText) {
                return parseInt(
                    sizeText.replace(/[m².,+]/g, "").replace(/\./g, ""),
                    10
                );
            }

            function updateQueryParameter(key, value) {
                const queryString = window.location.search.substring(1);
                const params = new URLSearchParams(queryString);

                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }

                const newQueryString = `?${params.toString()}`;
                history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
            }

            function syncSizesWithQuery() {
                const urlParams = new URLSearchParams(window.location.search);

                sizeMin = urlParams.get("minSize") ?
                    parseInt(urlParams.get("minSize"), 10) :
                    null;
                sizeMax = urlParams.get("maxSize") ?
                    parseInt(urlParams.get("maxSize"), 10) :
                    null;

                updateSizesStyles();
            }

            syncSizesWithQuery();

            window.addEventListener("popstate", syncSizesWithQuery);

            if (dropdownHeader && dropdownBody) {
                function toggleMenu() {
                    dropdownBody.classList.toggle("active");
                    dropdownHeader.classList.toggle("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    if (dropdownBody.classList.contains("active")) {
                        svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                    } else {
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }
                }

                function closeMenu() {
                    dropdownBody.classList.remove("active");
                    dropdownHeader.classList.remove("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                }

                dropdownHeader.addEventListener("click", function(e) {
                    e.stopPropagation();

                    if (dropdownBody.classList.contains("active")) {
                        closeMenu();
                    } else {
                        closeAllDropdowns();
                        toggleMenu();
                    }
                });

                document.addEventListener("click", function(event) {
                    if (
                        !dropdownContainer.contains(event.target) &&
                        !dropdownHeader.contains(event.target)
                    ) {
                        closeMenu();
                    }
                });
            } else {
                console.warn("Menu elements (dropdownHeader or dropdownBody) not found!");
            }
        }
        offPlanDropDownSizeMobile();
        window.addEventListener("popstate", offPlanDropDownSizeMobile);

        function offPlanDropDownPropertyTypeMobile() {
            const dropdownContainer = document.querySelector("#offPlanPropertyTypeFilterMobile");
            const dropdownHeader = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_header"
            );
            const dropdownBody = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_body"
            );
            const dropdownList = dropdownBody.querySelector(
                ".filterPropertiesWrapper__dropDown_list"
            );

            const typeValues = [
                'Apartment',
//                 'Villa',
                'Villa',
//                 'Townhouse',
//                 'Office',
//                 'Plot',
            ];

            // Массив выбранных типов
            let selectedTypes = [];

            // Создание элементов списка
            function renderTypeOptions() {
                dropdownList.innerHTML = ""; // Очищаем список перед созданием

                typeValues.forEach((typeV) => {
                    const typeItem = document.createElement("div");
                    typeItem.className = "filterPropertiesWrapper__dropDown_item";
                    typeItem.textContent = typeV;

                    const checkBox = document.createElement("div");
                    checkBox.className = "filterPropertiesWrapper__customCheckBox";

                    checkBox.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                </svg>
            `;
                    typeItem.appendChild(checkBox);
                    dropdownList.appendChild(typeItem);

                    // Обработчик клика
                    typeItem.addEventListener("click", function(e) {
                        e.stopPropagation();
                        handleTypeSelection(typeV);
                    });

                    // Устанавливаем активные элементы из массива выбранных
                    if (selectedTypes.includes(typeV)) {
                        checkBox.classList.add("active");
                    }
                });
            }

            // Обработка выбора типов
            function handleTypeSelection(typeText) {
                if (selectedTypes.includes(typeText)) {
                    // Убираем из выбранных
                    selectedTypes = selectedTypes.filter((type) => type !== typeText);
                } else {
                    // Добавляем в выбранные
                    selectedTypes.push(typeText);
                }

                // Обновляем стили и строку запроса
                updateTypeStyles();
                updateQueryParameter("propertyType", selectedTypes.length ? selectedTypes.join(",") : null);

                // Обновляем данные через API
                fetchOffPlanProjects()
                    .then(() => {})
                    .catch(() => {});
            }

            // Обновление стилей выбранных типов
            function updateTypeStyles() {
                const typeElements = dropdownList.querySelectorAll(
                    ".filterPropertiesWrapper__dropDown_item"
                );

                typeElements.forEach((item) => {
                    const typeValue = item.textContent.trim(); // Убираем лишние пробелы
                    const checkBox = item.querySelector(".filterPropertiesWrapper__customCheckBox");

                    // Сбрасываем класс active
                    checkBox.classList.remove("active");

                    // Добавляем active, если элемент выбран
                    if (selectedTypes.includes(typeValue)) {
                        checkBox.classList.add("active");
                    }
                });
            }

            // Обновление параметров строки запроса
            function updateQueryParameter(key, value) {
                const params = new URLSearchParams(window.location.search);

                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }

                const newQueryString = `?${params.toString()}`;
                history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
            }

            // Синхронизация выбранных типов с URL
            function syncTypesWithQuery() {
                const urlParams = new URLSearchParams(window.location.search);
                const typesFromQuery = urlParams.get("propertyType");

                selectedTypes = typesFromQuery ?
                    typesFromQuery.split(",").map((type) => type.trim()) : [];

                // Перерисовываем элементы с учетом активных
                renderTypeOptions();
            }

            // Инициализация
            renderTypeOptions();
            syncTypesWithQuery();

            window.addEventListener("popstate", syncTypesWithQuery);

            // Открытие/закрытие меню
            if (dropdownHeader && dropdownBody) {
                function toggleMenu() {
                    dropdownBody.classList.toggle("active");
                    dropdownHeader.classList.toggle("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    if (dropdownBody.classList.contains("active")) {
                        svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                    } else {
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }
                }

                function closeMenu() {
                    dropdownBody.classList.remove("active");
                    dropdownHeader.classList.remove("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                }

                dropdownHeader.addEventListener("click", function(e) {
                    e.stopPropagation();

                    if (dropdownBody.classList.contains("active")) {
                        closeMenu();
                    } else {
                        closeAllDropdowns();
                        toggleMenu();
                    }
                });

                document.addEventListener("click", function(event) {
                    if (
                        !dropdownContainer.contains(event.target) &&
                        !dropdownHeader.contains(event.target)
                    ) {
                        closeMenu();
                    }
                });
            } else {
                console.warn("Menu elements (dropdownHeader or dropdownBody) not found!");
            }
        }
        offPlanDropDownPropertyTypeMobile();
        window.addEventListener("popstate", offPlanDropDownPropertyTypeMobile);

        function offPlanDropDownHandoverMobile() {
            const dropdownContainer = document.querySelector("#offPlanHandoverFilterMobile");
            const dropdownHeader = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_header"
            );
            const dropdownBody = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_body"
            );
            const dropdownList = dropdownBody.querySelector(
                ".filterPropertiesWrapper__dropDown_list"
            );

            let handoverMin = null;
            let handoverMax = null;

            const handoverValues = [
                "Q1 2024", "Q2 2024", "Q3 2024", "Q4 2024",
                "Q1 2025", "Q2 2025", "Q3 2025", "Q4 2025",
                "Q1 2026", "Q2 2026", "Q3 2026", "Q4 2026"
            ];

            function renderHandoverOptions() {
                handoverValues.forEach((handover) => {
                    const handoverItem = document.createElement("div");
                    handoverItem.className = "filterPropertiesWrapper__dropDown_item";
                    handoverItem.textContent = handover;

                    const checkBox = document.createElement("div");
                    checkBox.className = "filterPropertiesWrapper__customCheckBox";
                    checkBox.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                </svg>
            `;
                    handoverItem.appendChild(checkBox);
                    dropdownList.appendChild(handoverItem);

                    handoverItem.addEventListener("click", function(e) {
                        e.stopPropagation();
                        handleHandoverSelection(handoverItem.textContent.trim());
                    });
                });
            }

            renderHandoverOptions();

            function handleHandoverSelection(handoverText) {
                const dateValue = handoverText;

                if (handoverMin === null) {
                    handoverMin = dateValue;
                    handoverMax = null;
                } else if (compareDates(dateValue, handoverMin) > 0 && handoverMax === null) {
                    handoverMax = dateValue;
                } else if (dateValue === handoverMin) {
                    handoverMin = null;
                    handoverMax = null;
                } else if (dateValue === handoverMax) {
                    handoverMax = null;
                } else if (compareDates(dateValue, handoverMin) < 0) {
                    handoverMin = dateValue;
                    handoverMax = null;
                } else if (compareDates(dateValue, handoverMax) > 0) {
                    handoverMax = dateValue;
                }

                updateHandoversStyles();

                updateQueryParameter(
                    "handoverMin",
                    handoverMin ? convertToISODate(handoverMin) : null
                );
                updateQueryParameter(
                    "handoverMax",
                    handoverMax ? convertToISODate(handoverMax) : null
                );

                fetchOffPlanProjects()
                    .then(() => {})
                    .catch(() => {});
            }

            function updateHandoversStyles() {
                const handoverElements = dropdownList.querySelectorAll(
                    ".filterPropertiesWrapper__dropDown_item"
                );

                handoverElements.forEach((item) => {
                    const dateValue = item.textContent.trim();
                    const checkBox = item.querySelector(
                        ".filterPropertiesWrapper__customCheckBox"
                    );

                    checkBox.classList.remove("active");
                    item.style.opacity = "1"; // Устанавливаем начальное значение opacity для всех элементов

                    if (handoverMin !== null && dateValue === handoverMin) {
                        checkBox.classList.add("active");
                    } else if (handoverMax !== null && dateValue === handoverMax) {
                        checkBox.classList.add("active");
                    } else if (
                        handoverMin !== null && handoverMax !== null &&
                        compareDates(dateValue, handoverMin) >= 0 && compareDates(dateValue, handoverMax) <= 0
                    ) {
                        // Активируем чекбоксы для значений между handoverMin и handoverMax
                        checkBox.classList.add("active");
                    } else if (
                        (handoverMin !== null && compareDates(dateValue, handoverMin) < 0) ||
                        (handoverMax !== null && compareDates(dateValue, handoverMax) > 0)
                    ) {
                        // Если значение меньше минимального или больше максимального, делаем его прозрачным
                        item.style.opacity = "0.5";
                    }
                });
            }

            function convertToISODate(handoverText) {
                const [quarter, year] = handoverText.split(" ");
                const month = {
                    Q1: "01",
                    Q2: "04",
                    Q3: "07",
                    Q4: "10",
                } [quarter];
                return `${year}-${month}-01`;
            }

            function compareDates(dateText1, dateText2) {
                const [quarter1, year1] = dateText1.split(" ");
                const [quarter2, year2] = dateText2.split(" ");
                const month1 = {
                    Q1: "01",
                    Q2: "04",
                    Q3: "07",
                    Q4: "10"
                } [quarter1];
                const month2 = {
                    Q1: "01",
                    Q2: "04",
                    Q3: "07",
                    Q4: "10"
                } [quarter2];

                const date1 = new Date(`${year1}-${month1}-01`);
                const date2 = new Date(`${year2}-${month2}-01`);

                if (date1 < date2) return -1;
                if (date1 > date2) return 1;
                return 0;
            }

            function updateQueryParameter(key, value) {
                const queryString = window.location.search.substring(1);
                const params = new URLSearchParams(queryString);

                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }

                const newQueryString = `?${params.toString()}`;
                history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
            }

            function syncHandoversWithQuery() {
                const urlParams = new URLSearchParams(window.location.search);

                handoverMin = urlParams.get("handoverMin") ?
                    convertFromISODate(urlParams.get("handoverMin")) :
                    null;
                handoverMax = urlParams.get("handoverMax") ?
                    convertFromISODate(urlParams.get("handoverMax")) :
                    null;

                updateHandoversStyles();
            }

            function convertFromISODate(isoDate) {
                const [year, month] = isoDate.split("-");
                const quarter = {
                    "01": "Q1",
                    "04": "Q2",
                    "07": "Q3",
                    10: "Q4",
                } [month];
                return `${quarter} ${year}`;
            }

            syncHandoversWithQuery();

            window.addEventListener("popstate", syncHandoversWithQuery);

            if (dropdownHeader && dropdownBody) {
                function toggleMenu() {
                    dropdownBody.classList.toggle("active");
                    dropdownHeader.classList.toggle("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    if (dropdownBody.classList.contains("active")) {
                        svgIcon.setAttribute("d", "M7 14L12 10L17 14");
                    } else {
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    }
                }

                function closeMenu() {
                    dropdownBody.classList.remove("active");
                    dropdownHeader.classList.remove("active");

                    const svgIcon = dropdownHeader.querySelector("svg path");
                    svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                }

                dropdownHeader.addEventListener("click", function(e) {
                    e.stopPropagation();

                    if (dropdownBody.classList.contains("active")) {
                        closeMenu();
                    } else {
                        closeAllDropdowns();
                        toggleMenu();
                    }
                });

                document.addEventListener("click", function(event) {
                    if (
                        !dropdownContainer.contains(event.target) &&
                        !dropdownHeader.contains(event.target)
                    ) {
                        closeMenu();
                    }
                });
            } else {
                console.warn("Menu elements (dropdownHeader or dropdownBody) not found!");
            }
        }
        offPlanDropDownHandoverMobile();
        window.addEventListener("popstate", offPlanDropDownHandoverMobile);

        function offPlanDropDownLocationMobile() {
            const dropdownContainer = document.querySelector("#offPlanLocationFilterMobile");
            const dropdownHeader = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_header"
            );
            const dropdownBody = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_body"
            );
            const dropdownList = dropdownBody.querySelector(
                ".filterPropertiesWrapper__dropDown_list"
            );

            let selectedLocations = new Set();

            function renderLocationOptions() {
                areasData.forEach((area) => {
                    const areaItem = document.createElement("div");
                    areaItem.className = "filterPropertiesWrapper__dropDown_item";

                    // Создаем обертку для основного названия территории
                    const mainListSelectedWrapper = document.createElement("div");
                    mainListSelectedWrapper.className = "mainListSelectedWrapper";

                    // Создаем div для отображения выбранных субтерриторий
                    const mainListSelected = document.createElement("div");
                    mainListSelected.className = "mainListSelected";

                    // Вставляем текст названия территории
                    mainListSelectedWrapper.appendChild(mainListSelected);
                    mainListSelectedWrapper.append(area.label);

                    // Добавляем обертку с названием в основной элемент
                    areaItem.appendChild(mainListSelectedWrapper);

                    // Создаем иконку стрелки и добавляем её
                    const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                    icon.setAttribute("width", "24");
                    icon.setAttribute("height", "24");
                    icon.setAttribute("viewBox", "0 0 24 24");
                    icon.setAttribute("fill", "none");
                    icon.innerHTML = `<path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`;
                    areaItem.appendChild(icon);

                    // Создание списка подтерриторий
                    const subAreaList = document.createElement("div");
                    subAreaList.className =
                        "filterPropertiesWrapper__dropDownLocationsWrapper_list";
                    subAreaList.style.display = "none"; // Скрываем подтерритории изначально

                    // Создаем кнопку "All"
                    const selectAllItem = document.createElement("div");
                    selectAllItem.className = "filterPropertiesWrapper__dropDown_item selectAll";
                    selectAllItem.innerHTML = `All<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px"></svg>`;
                    const selectAllCheckBox = document.createElement("div");
                    selectAllCheckBox.className = "filterPropertiesWrapper__customCheckBox";
                    selectAllItem.appendChild(selectAllCheckBox);

                    selectAllItem.addEventListener("click", function(e) {
                        e.stopPropagation();
                        handleSelectAll(area.subAreas);
                    });

                    subAreaList.appendChild(selectAllItem);

                    // Добавляем подтерритории
                    area.subAreas.forEach((subArea) => {
                        const subAreaItem = document.createElement("div");
                        subAreaItem.className =
                            "filterPropertiesWrapper__dropDown_item location";
                        subAreaItem.textContent = subArea.newLabel;

                        const subAreaCheckBox = document.createElement("div");
                        subAreaCheckBox.className =
                            "filterPropertiesWrapper__customCheckBox";

                        subAreaItem.appendChild(subAreaCheckBox); // Добавляем чекбокс

                        subAreaItem.addEventListener("click", function(e) {
                            e.stopPropagation();
                            handleSubAreaSelection(subArea.value, area.subAreas);
                        });

                        subAreaList.appendChild(subAreaItem);
                    });

                    // Добавляем обработчик нажатия для главной территории
                    areaItem.addEventListener("click", function(e) {
                        e.stopPropagation();
                        const isActive = subAreaList.style.display === "block";
                        subAreaList.style.display = isActive ? "none" : "block";
                        // Устанавливаем класс active у подтерриторий
                        subAreaList.classList.toggle("active", !isActive);
                        areaItem.classList.toggle("active", !isActive); // Устанавливаем класс active у главной территории
                    });

                    dropdownList.appendChild(areaItem);
                    dropdownList.appendChild(subAreaList);
                });

                // После рендеринга вызываем обновление стилей, чтобы правильно отобразить состояние чекбокса "All"
                updateLocationsStyles();
            }


            renderLocationOptions();

            function handleSelectAll(subAreas) {
                const allSelected = subAreas.every(subArea => selectedLocations.has(subArea.value));
                if (allSelected) {
                    subAreas.forEach(subArea => selectedLocations.delete(subArea.value));
                } else {
                    subAreas.forEach(subArea => selectedLocations.add(subArea.value));
                }
                updateLocationsStyles();
                updateQueryParameter(
                    "subAreas",
                    selectedLocations.size > 0 ?
                    Array.from(selectedLocations).join(",") :
                    null
                );
                fetchOffPlanProjects();
            }

            function handleSubAreaSelection(subAreaValue, subAreas) {
                if (selectedLocations.has(subAreaValue)) {
                    selectedLocations.delete(subAreaValue);
                } else {
                    selectedLocations.add(subAreaValue);
                }
                updateLocationsStyles(subAreas);
                updateQueryParameter(
                    "subAreas",
                    selectedLocations.size > 0 ?
                    Array.from(selectedLocations).join(",") :
                    null
                );
                fetchOffPlanProjects();
            }

            function updateLocationsStyles() {
                // Обновляем состояния чекбоксов для подтерриторий
                dropdownList.querySelectorAll(".filterPropertiesWrapper__dropDown_item.location").forEach((item) => {
                    const subAreaValue = item.textContent.trim();
                    const checkBox = item.querySelector(".filterPropertiesWrapper__customCheckBox");

                    if (selectedLocations.has(subAreaValue)) {
                        checkBox.classList.add("active");
                        checkBox.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
<path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
</svg>`;
                    } else {
                        checkBox.classList.remove("active");
                        checkBox.innerHTML = ""; // Удаляем SVG, если не выбрано
                    }
                });

                // Обновляем счетчик выбранных подтерриторий и состояние mainListSelected
                dropdownList.querySelectorAll(".mainListSelectedWrapper").forEach((mainListWrapper) => {
                    const areaLabel = mainListWrapper.textContent.trim().replace(/[0-9]+/g, '').trim(); // Убираем число, если оно добавляется автоматически
                    const area = areasData.find(area => area.label === areaLabel);

                    if (area) {
                        const selectedSubAreasCount = area.subAreas.filter(subArea => selectedLocations.has(subArea.value)).length;
                        const mainListSelected = mainListWrapper.querySelector(".mainListSelected");

                        if (selectedSubAreasCount > 0) {
                            mainListSelected.classList.add("active");
                            mainListSelected.textContent = selectedSubAreasCount;
                        } else {
                            mainListSelected.classList.remove("active");
                            mainListSelected.textContent = ""; // Очищаем текст, если ничего не выбрано
                        }
                    }
                });

                // Обновляем состояние кнопки "All" для каждой области
                dropdownList.querySelectorAll(".filterPropertiesWrapper__dropDown_item.selectAll").forEach((selectAllItem) => {
                    const checkBox = selectAllItem.querySelector(".filterPropertiesWrapper__customCheckBox");

                    // Обнаружение родительской области более точно
                    const areaWrapper = selectAllItem.closest('.filterPropertiesWrapper__dropDownLocationsWrapper_list').previousElementSibling;
                    const areaLabel = areaWrapper ? areaWrapper.textContent.trim().replace(/[0-9]+/g, '').trim() : '';
                    const area = areasData.find(area => area.label === areaLabel);

                    if (area) {
                        const allSelected = area.subAreas.every(subArea => selectedLocations.has(subArea.value));

                        if (allSelected && area.subAreas.length > 0) {
                            checkBox.classList.add("active");
                            checkBox.innerHTML = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
<path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
</svg>`;
                        } else {
                            checkBox.classList.remove("active");
                            checkBox.innerHTML = ""; // Убираем активное состояние, если не все выбрано
                        }
                    }
                });
            }

            function updateQueryParameter(key, value) {
                const queryString = window.location.search.substring(1);
                const params = new URLSearchParams(queryString);

                if (value) {
                    params.set(key, value);
                } else {
                    params.delete(key);
                }

                const newQueryString = `?${params.toString()}`;
                history.replaceState(null, "", `${window.location.pathname}${newQueryString}`);
            }

            function syncLocationsWithQuery() {
                const urlParams = new URLSearchParams(window.location.search);
                const subAreasParam = urlParams.get("subAreas");

                if (subAreasParam) {
                    selectedLocations = new Set(subAreasParam.split(","));
                } else {
                    selectedLocations.clear();
                }

                updateLocationsStyles();
            }

            syncLocationsWithQuery();

            window.addEventListener("popstate", syncLocationsWithQuery);

            dropdownHeader.addEventListener("click", function(e) {
                e.stopPropagation();

                if (dropdownBody.classList.contains("active")) {
                    closeMenu();
                } else {
                    closeAllDropdowns();
                    toggleMenu();
                }
            });

            document.addEventListener("click", function(event) {
                if (!dropdownContainer.contains(event.target)) {
                    closeMenu();
                }
            });

            function toggleMenu() {
                dropdownBody.classList.toggle("active");
                dropdownHeader.classList.toggle("active");

                const svgPath = dropdownHeader.querySelector("svg path");
                if (dropdownBody.classList.contains("active")) {
                    svgPath.setAttribute("d", "M7 14L12 10L17 14");
                } else {
                    svgPath.setAttribute("d", "M7 10L12 14L17 10");
                }
            }

            function closeMenu() {
                dropdownBody.classList.remove("active");
                dropdownHeader.classList.remove("active");

                const svgPath = dropdownHeader.querySelector("svg path");
                svgPath.setAttribute("d", "M7 10L12 14L17 10");
            }

            function closeAllDropdowns() {
                document
                    .querySelectorAll(".filterPropertiesWrapper__dropDown_body.active")
                    .forEach((body) => body.classList.remove("active"));
                document
                    .querySelectorAll(".filterPropertiesWrapper__dropDown_header.active")
                    .forEach((header) => header.classList.remove("active"));

                document
                    .querySelectorAll(".filterPropertiesWrapper__dropDown_header svg path")
                    .forEach((svgIcon) => {
                        svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                    });
            }
        }
        offPlanDropDownLocationMobile();
        window.addEventListener("popstate", offPlanDropDownLocationMobile);

        function handleBtnRedirectOffPlan() {
            const redirectBtn = document.getElementById("redirectBtnOffPlanFilterAdaptiveSecondary");
            if (!redirectBtn) {
                console.warn("Redirect button not found, please check the HTML structure.");
                return;
            }

            redirectBtn.addEventListener("click", () => {
                const urlParams = new URLSearchParams(window.location.search);

                const visible = urlParams.get("visible");

                if (!visible) return;

                urlParams.set("page", "0");

                let newPath = window.location.pathname;
                if (visible === "Secondary") {
                    newPath = "/secondaries";
                    urlParams.set("visible", "Off plan");
                } else if (visible === "Off plan") {
                    newPath = "/new-buildings";
                }

                window.history.replaceState({}, "", `${newPath}?${urlParams.toString()}`);
            });
        }
        handleBtnRedirectOffPlan();
        window.addEventListener("popstate", handleBtnRedirectOffPlan);

        function offPlanSetupFilterButtons() {
            const offPlanButton = document.getElementById("offPlanAdaptiveBtnOffPlan");
            const secondaryButton = document.getElementById("secondaryAdaptiveBtnOffPlan");

            const updateVisibleFilter = (selectedValue) => {
                const currentUrl = window.location.href.split("?")[0]; // Get the base URL without any query parameters
                const urlParams = new URLSearchParams(window.location.search); // Use search instead of hash

                urlParams.set("visible", selectedValue); // Update the visible parameter

                // Construct the new URL
                const newUrl = `${currentUrl}?${urlParams.toString()}`;

                window.history.replaceState({}, "", newUrl); // Update the URL in the browser

                // Update button styles
                const offPlanHandoverFilter = document.getElementById("offPlanHandoverFilterMobile");
                const parentDiv = offPlanHandoverFilter.parentElement; // Отримуємо батьківський елемент

                if (selectedValue === "Off plan") {
                    parentDiv.style.display = "flex"; // Повертаємо батьківський div
                    offPlanHandoverFilter.style.display = "flex";
                    offPlanButton.classList.add("active");
                    secondaryButton.classList.remove("active");
                } else if (selectedValue === "Secondary") {
                    parentDiv.style.display = "none"; // Приховуємо батьківський div
                    offPlanHandoverFilter.style.display = "none";
                    secondaryButton.classList.add("active");
                    offPlanButton.classList.remove("active");
                }


                // Fetch projects based on the updated filter
                fetchOffPlanProjects()
                    .then(() => {})
                    .catch(() => {});
            };

            if (offPlanButton && secondaryButton) {
                offPlanButton.addEventListener("click", () => updateVisibleFilter("Off plan"));
                secondaryButton.addEventListener("click", () => updateVisibleFilter("Secondary"));
            }

            const urlParams = new URLSearchParams(window.location.search); // Use search instead of hash
            const initialValue = urlParams.get("visible");

            // Clear active classes
            offPlanButton.classList.remove("active");
            secondaryButton.classList.remove("active");

            // Set initial button state based on URL parameter
            if (initialValue === "Off plan") {
                offPlanButton.classList.add("active");
            } else if (initialValue === "Secondary") {
                secondaryButton.classList.add("active");
            }
        }
        offPlanSetupFilterButtons();
        window.addEventListener("popstate", offPlanSetupFilterButtons);

        function offPlanDropDownSortMobile() {
            const dropdownContainer = document.getElementById("offPlanSortFilterMobile");

            if (dropdownContainer) {
                const dropdownHeader = dropdownContainer.querySelector(
                    ".filterPropertiesWrapper__dropDownSort_header"
                );
                const dropdownBody = dropdownContainer.querySelector(
                    ".filterPropertiesWrapper__dropDown_body"
                );
                const dropdownList = dropdownBody.querySelector(
                    ".filterPropertiesWrapper__dropDown_list"
                );
                let sortQuery = null;

                const sortValues = [
                    "Size Smaller",
                    "Size Bigger",
                    "By Handover",
                    "Newly added",
                ];

                function getSortQueryFromURL() {
                    const urlParams = new URLSearchParams(window.location.search); // Use search instead of hash
                    return urlParams.get("sort");
                }

                sortQuery = getSortQueryFromURL();

                sortValues.forEach((value) => {
                    const item = document.createElement("div");
                    item.className = "filterPropertiesWrapper__dropDown_item";
                    item.innerText = value;

                    const checkBox = document.createElement("div");
                    checkBox.className = "filterPropertiesWrapper__customCheckBox";

                    checkBox.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                </svg>
            `;

                    item.appendChild(checkBox);
                    dropdownList.appendChild(item);

                    if (sortQuery === value) {
                        checkBox.classList.add("active");
                    }

                    item.addEventListener("click", function(e) {
                        e.stopPropagation();

                        if (sortQuery === value) {
                            sortQuery = null;
                            checkBox.classList.remove("active");
                        } else {
                            sortQuery = value;
                            dropdownList
                                .querySelectorAll(".filterPropertiesWrapper__customCheckBox")
                                .forEach((box) => box.classList.remove("active"));
                            checkBox.classList.add("active");
                        }

                        updateURLQuery("sort", sortQuery);

                        fetchOffPlanProjects()
                            .then(() => {})
                            .catch(() => {});
                    });
                });

                dropdownHeader.addEventListener("click", function(e) {
                    e.stopPropagation();

                    if (dropdownBody.classList.contains("active")) {
                        closeMenu(e);
                    } else {
                        closeAllDropdowns();
                        toggleMenu();
                    }
                });

                function toggleMenu() {
                    dropdownBody.classList.toggle("active");
                    dropdownHeader.classList.toggle("active");
                }

                function closeMenu() {
                    dropdownBody.classList.remove("active");
                    dropdownHeader.classList.remove("active");
                }

                document.addEventListener("click", function(event) {
                    const isClickInside = dropdownContainer.contains(event.target);

                    if (!isClickInside) {
                        dropdownBody.classList.remove("active");
                    }
                });

                window.addEventListener("popstate", () => {
                    sortQuery = getSortQueryFromURL();

                    dropdownList
                        .querySelectorAll(".filterPropertiesWrapper__dropDown_item")
                        .forEach((item) => {
                            const checkBox = item.querySelector(
                                ".filterPropertiesWrapper__customCheckBox"
                            );
                            if (item.innerText === sortQuery) {
                                checkBox.classList.add("active");
                            } else {
                                checkBox.classList.remove("active");
                            }
                        });
                });
            }

            function updateURLQuery(key, value) {
                const currentUrl = window.location.href.split("?")[0]; // Get base URL
                const urlParams = new URLSearchParams(window.location.search); // Use search instead of hash

                if (value) {
                    urlParams.set(key, value);
                } else {
                    urlParams.delete(key);
                }

                const newUrl = `${currentUrl}?${urlParams.toString()}`;
                history.replaceState(null, "", newUrl);
            }
        }
        offPlanDropDownSortMobile();
        window.addEventListener("popstate", offPlanDropDownSortMobile);

        function updateFilterButtonStateOffPlan() {
            const filterButton = document.getElementById("offPlanFiltetAdaptive");
            const filterCountCircle = document.getElementById("filtersLenghMobileOffPlan");

            if (!filterButton || !filterCountCircle) {
                console.warn("Filter button or count circle not found!");
                return;
            }

            const countActiveFilters = () => {
                const queryString = window.location.search; // Use search instead of hash
                const queryParams = new URLSearchParams(queryString);

                const filterKeys = [
                    "sort",
                    "name",
                    "minPrice",
                    "maxPrice",
                    "minSize",
                    "maxSize",
                    "handoverMin",
                    "handoverMax",
                    "bedrooms",
                    "subAreas",
                ];

                let filterCount = 0;

                filterKeys.forEach((key) => {
                    if (queryParams.has(key)) {
                        const value = queryParams.get(key);
                        if (value && value.trim() !== "") {
                            filterCount++;
                        }
                    }
                });

                return filterCount;
            };

            const updateFilterCountDisplay = () => {
                if (window.innerWidth > 767) {
                    filterCountCircle.classList.remove("active");
                    filterCountCircle.textContent = "";
                    return;
                }

                const activeFilterCount = countActiveFilters();

                if (activeFilterCount > 0) {
                    filterCountCircle.classList.add("active");
                    filterCountCircle.textContent = activeFilterCount.toString();
                } else {
                    filterCountCircle.classList.remove("active");
                    filterCountCircle.textContent = "";
                }
            };

            updateFilterCountDisplay();

            // Change the event listeners to listen for "popstate" and "resize"
            window.addEventListener("popstate", updateFilterCountDisplay);
            window.addEventListener("resize", updateFilterCountDisplay);
        }
        updateFilterButtonStateOffPlan();
        window.addEventListener("popstate", updateFilterButtonStateOffPlan);

        // IDs for displaying filters (moved outside function to avoid scope issues)
        const offPlanBedroomsContainer = document.getElementById("selectValueOffPlanBedrooms");
        const offPlanPriceContainer = document.getElementById("selectValueOffPlanPrice");
        const offPlanSizeContainer = document.getElementById("selectValueOffPlanSize");
        const offPlanPropertyTypeContainer = document.getElementById("selectValueOffPlanPropertyType");
        const offPlanHandoverContainer = document.getElementById("selectValueOffPlanHandover");
        const offPlanLocationContainer = document.getElementById("selectValueOffPlanFilterLocation");

        // Function to clear off-plan filter values
        function clearFilterValuesOffPlan() {
            if (offPlanBedroomsContainer) offPlanBedroomsContainer.innerHTML = "";
            if (offPlanPriceContainer) offPlanPriceContainer.innerHTML = "";
            if (offPlanSizeContainer) offPlanSizeContainer.innerHTML = "";
            if (offPlanPropertyTypeContainer) offPlanPropertyTypeContainer.innerHTML = "";
            if (offPlanHandoverContainer) offPlanHandoverContainer.innerHTML = "";
            if (offPlanLocationContainer) offPlanLocationContainer.innerHTML = "";
        }

        function renderValueFilterFromQueryOffPlan() {
            const queryString = window.location.search; // Use search instead of hash
            if (!queryString) {
                // Clear elements if queryString is empty
                clearFilterValuesOffPlan();
                return;
            }

            const queryParams = new URLSearchParams(queryString);

            // Clear elements before updating
            clearFilterValuesOffPlan();

            // Bedrooms
            if (queryParams.has("bedrooms") && offPlanBedroomsContainer) {
                const bedrooms = queryParams.get("bedrooms").split(",");
                bedrooms.forEach((bedroom) => {
                    addFilterItem(offPlanBedroomsContainer, `Bedroom: ${bedroom}`);
                });
            }

            // Price
            if ((queryParams.has("minPrice") || queryParams.has("maxPrice")) && offPlanPriceContainer) {
                const minPrice = queryParams.get("minPrice");
                const maxPrice = queryParams.get("maxPrice");
                let priceText = "€ ";

                if (minPrice) {
                    priceText += formatPrice(minPrice);
                }
                if (maxPrice) {
                    priceText += " - " + formatPrice(maxPrice);
                }

                if (minPrice || maxPrice) {
                    addFilterItem(offPlanPriceContainer, priceText);
                }
            }

            // Size
            if ((queryParams.has("minSize") || queryParams.has("maxSize")) && offPlanSizeContainer) {
                const minSize = queryParams.get("minSize");
                const maxSize = queryParams.get("maxSize");
                let sizeText = "";

                if (minSize && maxSize) {
                    sizeText = `${minSize} - ${maxSize} sq.m`;
                } else if (minSize) {
                    sizeText = `From ${minSize} sq.m`;
                }

                if (sizeText) {
                    addFilterItem(offPlanSizeContainer, sizeText);
                }
            }
            // Property type
            if ((queryParams.has("minType") || queryParams.has("maxType")) && offPlanPropertyTypeContainer) {
                const minType = queryParams.get("minType");
                const maxType = queryParams.get("maxType");
                let TypeText = "";

                if (minType && maxType) {
                    TypeText = `${minType} - ${maxType}`;
                } else if (minType) {
                    TypeText = `${minType}`;
                }

                if (TypeText) {
                    addFilterItem(offPlanPropertyTypeContainer, TypeText);
                }
            }


            // Handover
            if ((queryParams.has("handoverMin") || queryParams.has("handoverMax")) && offPlanHandoverContainer) {
                const handoverMin = queryParams.get("handoverMin");
                const handoverMax = queryParams.get("handoverMax");
                let handoverText = "";

                if (handoverMin && handoverMax) {
                    handoverText = `${formatHandoverDate(handoverMin)} - ${formatHandoverDate(handoverMax)}`;
                } else if (handoverMin) {
                    handoverText = `From ${formatHandoverDate(handoverMin)}`;
                }

                if (handoverText) {
                    addFilterItem(offPlanHandoverContainer, handoverText);
                }
            }

            // Location (subAreas)
            if (queryParams.has("subAreas") && offPlanLocationContainer) {
                const subAreas = queryParams.get("subAreas").split(",");
                subAreas.forEach((location) => {
                    addFilterItem(offPlanLocationContainer, `${location}`);
                });
            }

            // Function to add a filter item
            function addFilterItem(container, text) {
                const filterItem = document.createElement("div");
                filterItem.className = "propertiesSelectedFilter__item";

                const filterTitle = document.createElement("span");
                filterTitle.className = "propertiesSelectedFilter__item_title";
                filterTitle.textContent = text;

                // Add delete button
                const deleteButton = document.createElement("button");
                deleteButton.className = "propertiesSelectedFilter__item_delete";
                deleteButton.innerHTML = "×";
                deleteButton.style.cssText = `
                    background: none;
                    border: none;
                    color: #666;
                    cursor: pointer;
                    font-size: 16px;
                    margin-left: 8px;
                    padding: 0;
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                `;

                // Add click handler to remove the filter
                deleteButton.addEventListener("click", (e) => {
                    e.stopPropagation();
                    removeFilterItem(container, text);
                });

                filterItem.appendChild(filterTitle);
                filterItem.appendChild(deleteButton);
                container.appendChild(filterItem);
            }

            // Function to remove a filter item
            function removeFilterItem(container, text) {
                // Remove the filter item from display
                const items = container.querySelectorAll(".propertiesSelectedFilter__item");
                items.forEach(item => {
                    const title = item.querySelector(".propertiesSelectedFilter__item_title");
                    if (title && title.textContent === text) {
                        item.remove();
                    }
                });

                // Update URL parameters based on the filter type
                const params = new URLSearchParams(window.location.search);

                if (text.includes("€")) {
                    // Price filter
                    if (text.includes("From")) {
                        params.delete("minPrice");
                    } else if (text.includes(" - ")) {
                        params.delete("minPrice");
                        params.delete("maxPrice");
                    } else {
                        params.delete("maxPrice");
                    }
                } else if (text.includes("sq.m")) {
                    // Size filter
                    if (text.includes("From")) {
                        params.delete("minSize");
                    } else if (text.includes(" - ")) {
                        params.delete("minSize");
                        params.delete("maxSize");
                    } else {
                        params.delete("maxSize");
                    }
                } else if (text.includes("Q")) {
                    // Handover filter
                    if (text.includes("From")) {
                        params.delete("handoverMin");
                    } else if (text.includes(" - ")) {
                        params.delete("handoverMin");
                        params.delete("handoverMax");
                    } else {
                        params.delete("handoverMax");
                    }
                } else if (text.includes("Bedroom:")) {
                    // Bedroom filter
                    const bedroomValue = text.replace("Bedroom: ", "");
                    const currentBedrooms = params.get("bedrooms");
                    if (currentBedrooms) {
                        const bedrooms = currentBedrooms.split(",");
                        const newBedrooms = bedrooms.filter(b => b !== bedroomValue);
                        if (newBedrooms.length > 0) {
                            params.set("bedrooms", newBedrooms.join(","));
                        } else {
                            params.delete("bedrooms");
                        }
                    }
                } else {
                    // Location or other filter
                    const currentSubAreas = params.get("subAreas");
                    if (currentSubAreas) {
                        const subAreas = currentSubAreas.split(",");
                        const newSubAreas = subAreas.filter(area => area !== text);
                        if (newSubAreas.length > 0) {
                            params.set("subAreas", newSubAreas.join(","));
                        } else {
                            params.delete("subAreas");
                        }
                    }
                }

                // Update URL and refresh
                history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
                fetchOffPlanProjects();
            }

            // Function to clear all filter values
            function clearFilterValues() {
                if (offPlanBedroomsContainer) offPlanBedroomsContainer.innerHTML = "";
                if (offPlanPriceContainer) offPlanPriceContainer.innerHTML = "";
                if (offPlanSizeContainer) offPlanSizeContainer.innerHTML = "";
                if (offPlanHandoverContainer) offPlanHandoverContainer.innerHTML = "";
                if (offPlanLocationContainer) offPlanLocationContainer.innerHTML = "";
                if (offPlanPropertyTypeContainer) offPlanPropertyTypeContainer.innerHTML = "";
            }

            // Function to format price
            function formatPrice(price) {
                const num = parseInt(price, 10);
                if (num >= 1000000) {
                    return (num / 1000000).toFixed(1) + "M"; // Fixed to 1 decimal for better readability
                } else if (num >= 1000) {
                    return (num / 1000).toFixed(1) + "K"; // Fixed to 1 decimal for better readability
                }
                return num.toString();
            }

            // Function to format handover date
            function formatHandoverDate(date) {
                const [year, month] = date.split("-");
                const quarter = Math.ceil(parseInt(month, 10) / 3);
                return `Q${quarter} ${year}`;
            }
        }
        renderValueFilterFromQueryOffPlan();
        window.addEventListener("popstate", renderValueFilterFromQueryOffPlan);

    });

    function saveScrollPosition() {
        sessionStorage.setItem('scrollPosition', window.scrollY);
    }

    // Функция для восстановления позиции прокрутки
    function restoreScrollPosition() {
        const scrollPosition = sessionStorage.getItem('scrollPosition');
        if (scrollPosition) {
            window.scrollTo(0, parseInt(scrollPosition));
        }
    }

    // Восстановление позиции при загрузке страницы
    window.addEventListener('load', restoreScrollPosition);

    // Сохранение позиции при уходе со страницы
    window.addEventListener('beforeunload', saveScrollPosition);
</script>


<script>
    document.addEventListener('DOMContentLoaded', function() {
        const searchInput = document.getElementById('offPlanFilterInputName');
        const dropdownList = document.getElementById('offPlanDropDownList');
        const clearSearchBtn = document.getElementById('clearSearchBtn');
        const apiURL = 'https://xf9m-jkaj-lcsq.p7.xano.io/api:v5maUE6u/search';

        // Function to display the search results
        function displayResults(results) {
            dropdownList.innerHTML = ''; // Clear previous results

            // Take only the first 5 results
            const firstFiveResults = results.slice(0, 5);

            firstFiveResults.forEach(item => {
                const div = document.createElement('div');
                div.textContent = item.name; // Assuming 'name' is the property you want to display
                div.classList.add('filterPropertiesWrapper__dropDown_item'); // Optional: for styling
                dropdownList.appendChild(div);
            });
        }

        // Listen for input in the search field
        searchInput.addEventListener('input', function() {
            const queryValue = searchInput.value;

            if (queryValue.length > 0) {
                clearSearchBtn.style.display = 'block';

                const currentPath = window.location.pathname;
                let propertyStatus;

                if (currentPath.includes('new-building') || currentPath.includes('new-buildings') || currentPath.includes('off-plan')) {
                    propertyStatus = ["New building", "Rent"];
                } else {
                    propertyStatus = ["Secondary"];
                }

                const params = new URLSearchParams({
                    query: queryValue,
                    property_status: propertyStatus
                });

                // Fetch new data from the API on each input
                fetch(`${apiURL}?${params.toString()}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        displayResults(data);
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                    });
            } else {
                dropdownList.innerHTML = ''; // Clear results if the input is empty
                clearSearchBtn.style.display = 'none';
            }
        });

        // Clear search button functionality
        clearSearchBtn.addEventListener('click', function() {
            searchInput.value = '';
            dropdownList.innerHTML = '';
            clearSearchBtn.style.display = 'none';
        });
    });
</script>

<?php get_footer(); ?>