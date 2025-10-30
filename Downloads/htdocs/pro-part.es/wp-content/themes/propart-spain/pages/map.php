<?php get_header(); ?>

<main>

    <div class="wrapperMapPage">
        <div class="mapPageLoader" id="mapPageLoader">
            <!-- 	<div class="mapLoadingSpinner"></div> -->
            <div class="u-loading">
                <div class="u-loading__symbol">
                    <img src="https://pro-part.es/wp-content/themes/propart-spain/icons/shared/logo1.png" width="300px">
                </div>
            </div>
        </div>
        <div class="filterPropertiesWrapper">
            <div class="filterPropertiesWrapper__inputWrapper" id="mapNameFilter">
                <img src="<?php echo get_template_directory_uri(); ?>/icons/search_filter.svg" alt="search" />
                <input class="filterPropertiesWrapper__inputWrapper_input" type="text" placeholder="Search by name"
                    id="mapFilterInputName" />
                <div class="filterPropertiesWrapper__dropDown_body" id="mapNameBody">
                    <div class="filterPropertiesWrapper__dropDown_list" id="mapDropDownList"></div>
                </div>
            </div>
            <div class="wrapperMapPageVisibleProjects">
                <button class="wrapperMapPageVisibleProjects__btn" id="mapOffPlanVisible">
                    Off plan
                </button>
                <button class="wrapperMapPageVisibleProjects__btn" id="mapSecondaryVisible">
                    Secondary
                </button>
                <button class="wrapperMapPageVisibleProjects__btn" id="mapRentVisible">
                    Rent
                </button>
            </div>
            
            <!-- Rent Type Filter: Long term / Short term -->
            <div class="wrapperMapPageVisibleProjects rent-type-toggle-map" id="mapRentTypeToggle" style="display: none;">
                <button class="wrapperMapPageVisibleProjects__btn active" id="mapRentLongTermBtn" data-rent-type="long">
                    Long term
                </button>
                <button class="wrapperMapPageVisibleProjects__btn" id="mapRentShortTermBtn" data-rent-type="short">
                    Short term
                </button>
            </div>
            <div class="filterPropertiesWrapper__dropdownds">
				<div id="secondaryPropertyTypeFilter" class="filterPropertiesWrapper__dropDown">
                    <span class="filterPropertiesWrapper__dropDown_label"></span>
                    <div class="filterPropertiesWrapper__dropDown_header">
                        Type
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </div>
                    <div class="filterPropertiesWrapper__dropDown_body">
                        <div class="filterPropertiesWrapper__dropDown_list"></div>
                    </div>
                </div>
                <div id="mapBedroomsFilter" class="filterPropertiesWrapper__dropDown">
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
                <div id="mapPriceFilter" class="filterPropertiesWrapper__dropDown">
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
                <div id="mapSizeFilter" class="filterPropertiesWrapper__dropDown">
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
				         <div id="mapLocationFilter" class="filterPropertiesWrapper__dropDown">
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
                <div id="mapHandoverFilter" class="filterPropertiesWrapper__dropDown">
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
      
                <button class="filtersMap__clearBtn" id="clearBtnMapFilter">
                    Clear
                </button>
            </div>
            <div class="filtersMap__tablet">
                <button class="filtersMap__tablet-btn" id="filterMobile">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                            d="M2.5 5.8335H5M5 5.8335C5 7.21421 6.11929 8.3335 7.5 8.3335C8.88071 8.3335 10 7.21421 10 5.8335C10 4.45278 8.88071 3.3335 7.5 3.3335C6.11929 3.3335 5 4.45278 5 5.8335ZM2.5 14.1668H7.5M15 14.1668L17.5 14.1668M15 14.1668C15 15.5475 13.8807 16.6668 12.5 16.6668C11.1193 16.6668 10 15.5475 10 14.1668C10 12.7861 11.1193 11.6668 12.5 11.6668C13.8807 11.6668 15 12.7861 15 14.1668ZM12.5 5.8335L17.5 5.8335"
                            stroke="#717171" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    <span>Filter</span>
                    <!--                     <div class="filtersMap__tablet-length" id="filtersLenghMobileMap"></div> -->
                </button>
                <button class="filtersMap__tablet-burgerBtn" id="filterMobileBurgerMenu"></button>
            </div>
        </div>
        <div class="map-wrapper">
            <div class="map-wrapper-selectedFilters">
                <div id="mapSelectedFilters"></div>
            </div>
            <div id="map"></div>
            <div class="zoom-control">
                <div class="zoom-btn" id="zoom-in">+</div>
                <div class="zoom-btn" id="zoom-out">−</div>
            </div>
            <div class="wrapperMapPage__drawWrapper">
                <button class="wrapperMapPage__drawWrapper-btn " id="draw" data-tooltip="Draw a polygon to filter projects">
                    <img src="<?php echo get_template_directory_uri(); ?>/icons/map/draw.svg" alt="draw" />
                    <span>Draw on map</span>
                </button>
                <div class="wrapperMapPage__drawWrapper-btnTrash" id="trash" data-tooltip="Clear polygon and reset filters">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 18 18" fill="none">
                        <path
                            d="M8.2 7.5C8.2 7.1134 7.8866 6.8 7.5 6.8C7.1134 6.8 6.8 7.1134 6.8 7.5H8.2ZM6.8 13.5C6.8 13.8866 7.1134 14.2 7.5 14.2C7.8866 14.2 8.2 13.8866 8.2 13.5H6.8ZM11.2 7.5C11.2 7.1134 10.8866 6.8 10.5 6.8C10.1134 6.8 9.8 7.1134 9.8 7.5H11.2ZM9.8 13.5C9.8 13.8866 10.1134 14.2 10.5 14.2C10.8866 14.2 11.2 13.8866 11.2 13.5H9.8ZM5.31901 15.5865L5.63681 14.9628H5.63681L5.31901 15.5865ZM4.66349 14.931L5.2872 14.6132L5.28719 14.6132L4.66349 14.931ZM13.3365 14.931L12.7128 14.6132L12.7128 14.6132L13.3365 14.931ZM12.681 15.5865L12.3632 14.9628L12.3632 14.9628L12.681 15.5865ZM3.75 4.55C3.3634 4.55 3.05 4.8634 3.05 5.25C3.05 5.6366 3.3634 5.95 3.75 5.95V4.55ZM14.25 5.95C14.6366 5.95 14.95 5.6366 14.95 5.25C14.95 4.8634 14.6366 4.55 14.25 4.55V5.95ZM5.675 5.25C5.675 5.6366 5.9884 5.95 6.375 5.95C6.7616 5.95 7.075 5.6366 7.075 5.25H5.675ZM10.925 5.25C10.925 5.6366 11.2384 5.95 11.625 5.95C12.0116 5.95 12.325 5.6366 12.325 5.25H10.925ZM6.8 7.5V13.5H8.2V7.5H6.8ZM9.8 7.5V13.5H11.2V7.5H9.8ZM12.8 5.25V13.35H14.2V5.25H12.8ZM11.1 15.05H6.9V16.45H11.1V15.05ZM3.8 5.25V13.35H5.2V5.25H3.8ZM6.9 15.05C6.46841 15.05 6.18682 15.0495 5.97181 15.0319C5.76497 15.015 5.68211 14.9859 5.63681 14.9628L5.00122 16.2102C5.27678 16.3506 5.56438 16.4033 5.8578 16.4272C6.14305 16.4505 6.49151 16.45 6.9 16.45V15.05ZM3.8 13.35C3.8 13.7585 3.79946 14.107 3.82276 14.3922C3.84673 14.6856 3.89938 14.9732 4.03979 15.2488L5.28719 14.6132C5.26411 14.5679 5.23501 14.485 5.21811 14.2782C5.20054 14.0632 5.2 13.7816 5.2 13.35H3.8ZM5.63681 14.9628C5.48628 14.8861 5.36389 14.7637 5.2872 14.6132L4.03979 15.2488C4.25071 15.6627 4.58727 15.9993 5.00122 16.2102L5.63681 14.9628ZM12.8 13.35C12.8 13.7816 12.7995 14.0632 12.7819 14.2782C12.765 14.485 12.7359 14.5679 12.7128 14.6132L13.9602 15.2488C14.1006 14.9732 14.1533 14.6856 14.1772 14.3922C14.2005 14.107 14.2 13.7585 14.2 13.35H12.8ZM11.1 16.45C11.5085 16.45 11.857 16.4505 12.1422 16.4272C12.4356 16.4033 12.7232 16.3506 12.9988 16.2102L12.3632 14.9628C12.3179 14.9859 12.235 15.015 12.0282 15.0319C11.8132 15.0495 11.5316 15.05 11.1 15.05V16.45ZM12.7128 14.6132C12.6361 14.7637 12.5137 14.8861 12.3632 14.9628L12.9988 16.2102C13.4127 15.9993 13.7493 15.6627 13.9602 15.2488L12.7128 14.6132ZM3.75 5.95H4.5V4.55H3.75V5.95ZM4.5 5.95H13.5V4.55H4.5V5.95ZM13.5 5.95H14.25V4.55H13.5V5.95ZM7.075 4.65C7.075 3.76884 7.87649 2.95 9 2.95V1.55C7.22402 1.55 5.675 2.8802 5.675 4.65H7.075ZM9 2.95C10.1235 2.95 10.925 3.76884 10.925 4.65H12.325C12.325 2.8802 10.776 1.55 9 1.55V2.95ZM5.675 4.65V5.25H7.075V4.65H5.675ZM10.925 4.65V5.25H12.325V4.65H10.925Z"
                            fill="#313131" />
                    </svg>
                </div>
                <button class="wrapperMapPage__drawWrapper-btn" id="toggleNeighborhoods" data-tooltip="Show/Hide neighborhood boundaries">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="#313131" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                        <path d="M9 22V12H15V22" stroke="#313131" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                    <span>Neighborhoods</span>
                </button>
                <button class="filtersMap__tablet-btn " id="filterMobilePhone">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path
                            d="M2.5 5.8335H5M5 5.8335C5 7.21421 6.11929 8.3335 7.5 8.3335C8.88071 8.3335 10 7.21421 10 5.8335C10 4.45278 8.88071 3.3335 7.5 3.3335C6.11929 3.3335 5 4.45278 5 5.8335ZM2.5 14.1668H7.5M15 14.1668L17.5 14.1668M15 14.1668C15 15.5475 13.8807 16.6668 12.5 16.6668C11.1193 16.6668 10 15.5475 10 14.1668C10 12.7861 11.1193 11.6668 12.5 11.6668C13.8807 11.6668 15 12.7861 15 14.1668ZM12.5 5.8335L17.5 5.8335"
                            stroke="#313131" stroke-width="1.5" stroke-linecap="round" />
                    </svg>
                    <!-- 					<div class="filtersMap__tablet-length" id="filtersLenghMobileMapPhone"></div> -->
                </button>
            </div>
        </div>
        <div class="mapListProjects" id="polygonProjectsList">
            <div class="mapListProjects__header">
                <h3 class="mapListProjects__title">Projects in Polygon</h3>
                <button class="mapListProjects__close" id="closePolygonList">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M14.1667 5.83355L5.83337 14.1668M14.1667 14.1668L5.83337 5.8335" stroke="#313131"
                            stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </button>
            </div>
            <div class="mapListProjects__count" id="polygonProjectsCount">
                Found projects: 0
            </div>
            <div class="mapListProjects__list" id="polygonProjectsListContent">
                <!-- Projects will be added dynamically -->
            </div>
        </div>
        <div class="adapriveFilters__bg" id="modalAdaptiveFilters">
            <div class="adapriveFilters">
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
                    <div>
                        <div class="adapriveFilters__main-buttons map">
                            <div class="adapriveFilters__main-btn active" id="offPlanAdaptiveBtn">
                                Off plan
                            </div>
                            <div class="adapriveFilters__main-btn" id="secondaryAdaptiveBtn">
                                Secondary
                            </div>
                            <div class="adapriveFilters__main-btn" id="rentAdaptiveBtn">
                                Rent
                            </div>
                        </div>
                        
                        <!-- Rent Type Filter for Mobile -->
                        <div class="adapriveFilters__rent-type-mobile" id="mapRentTypeMobile" style="display: none; margin-top: 16px;">
                            <div class="adapriveFilters__main-buttons map">
                                <div class="adapriveFilters__main-btn active" id="rentLongTermMobileBtn" data-rent-type="long">
                                    Long term
                                </div>
                                <div class="adapriveFilters__main-btn" id="rentShortTermMobileBtn" data-rent-type="short">
                                    Short term
                                </div>
                            </div>
                        </div>
                        <div class="adapriveFilters__main-dropdowns map">
                            <div>
                                <div id="mapLocationFilterMobile" class="filterPropertiesWrapper__dropDown">
                                    <span class="filterPropertiesWrapper__dropDown_label">Locations</span>
                                    <div class="filterPropertiesWrapper__dropDown_header mobile">
                                        Locations
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none">
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
                                <div class="propertiesSelectedFilter__list" id="selectValueMapFilterLocation"></div>
                            </div>
                            <div>
                                <div id="mapBedroomsFilterMobile" class="filterPropertiesWrapper__dropDown">
                                    <span class="filterPropertiesWrapper__dropDown_label">Bedrooms</span>
                                    <div class="filterPropertiesWrapper__dropDown_header mobile">
                                        Bedrooms
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none">
                                            <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div class="filterPropertiesWrapper__dropDown_body big">
                                        <div class="filterPropertiesWrapper__dropDown_list"></div>
                                    </div>
                                    <div class="propertiesSelectedFilter__list" id="selectValueMapBedrooms"></div>
                                </div>
                            </div>
                            <div>
                                <div id="mapPriceFilterMobile" class="filterPropertiesWrapper__dropDown">
                                    <span class="filterPropertiesWrapper__dropDown_label">Price</span>
                                    <div class="filterPropertiesWrapper__dropDown_header mobile">
                                        Price
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none">
                                            <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div class="filterPropertiesWrapper__dropDown_body big">
                                        <div class="filterPropertiesWrapper__dropDown_list"></div>
                                    </div>
                                </div>
                                <div class="propertiesSelectedFilter__list" id="selectValueMapPrice"></div>
                            </div>
                            <div>
                                <div id="mapSizeFilterMobile" class="filterPropertiesWrapper__dropDown">
                                    <span class="filterPropertiesWrapper__dropDown_label">Size</span>
                                    <div class="filterPropertiesWrapper__dropDown_header mobile">
                                        Size
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none">
                                            <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div class="filterPropertiesWrapper__dropDown_body big">
                                        <div class="filterPropertiesWrapper__dropDown_list"></div>
                                    </div>
                                </div>
                                <div class="propertiesSelectedFilter__list" id="selectValueMapSize"></div>
                            </div>
                            <div>
                                <div id="mapHandoverFilterMobile" class="filterPropertiesWrapper__dropDown">
                                    <span class="filterPropertiesWrapper__dropDown_label">Handover</span>
                                    <div class="filterPropertiesWrapper__dropDown_header mobile">
                                        Handover
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                            viewBox="0 0 24 24" fill="none">
                                            <path d="M7 10L12 14L17 10" stroke="#717171" stroke-width="1.5"
                                                stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                    </div>
                                    <div class="filterPropertiesWrapper__dropDown_body big">
                                        <div class="filterPropertiesWrapper__dropDown_list"></div>
                                    </div>
                                </div>
                                <div class="propertiesSelectedFilter__list" id="selectValueMapHandover"></div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="adapriveFilters__main-buttonsBottom">
                    <button class="adapriveFilters__main-btnClear" id="clearBtnMapFilterAdaptive">
                        Clear
                    </button>
                    <button class="adapriveFilters__main-btnConfirm" id="btnMapConfrimFilterAdaptive">
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    </div>
</main>

<script>
    const areasData = [
        {
            "value": "Estepona",
            "label": "Estepona",
            "subAreas": [
                {
                    "value": "Benavista",
                    "oldLabel": "Benavista",
                    "newLabel": "Benavista"
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
            "subAreas": [
                {
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
            "subAreas": [
                {
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
                    "value": "San Pedro de Alcántara",
                    "oldLabel": "San Pedro de Alcántara",
                    "newLabel": "San Pedro de Alcántara"
                },
                {
                    "value": "Guadalmina Baja",
                    "oldLabel": "Guadalmina Baja",
                    "newLabel": "Guadalmina Baja"
                },
                {
                    "value": "Cortijo Blanco",
                    "oldLabel": "San Pedro de Alcántara",
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
                    "oldLabel": "San Pedro de Alcántara",
                    "newLabel": "Valle del Sol"
                },
                {
                    "value": "Valle del Sol",
                    "oldLabel": "San Pedro de Alcántara",
                    "newLabel": "Valle del Sol"
                },
            ]
        },
        {
            "value": "Fuengirola",
            "label": "Fuengirola",
            "subAreas": [
                {
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
            "subAreas": [
                {
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
            "subAreas": [
                {
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
            "subAreas": [
                {
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
            "subAreas": [
                {
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
            "subAreas": [
                {
                    "value": "Alhaurin Golf",
                    "oldLabel": "Alhaurin Golf",
                    "newLabel": "Alhaurin Golf"
                }
            ]
        },
        {
            "value": "Benalmádena",
            "label": "Benalmádena",
            "subAreas": [
                {
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
            "subAreas": [
                {
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
            "subAreas": [
                {
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
            "subAreas": [
                {
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
          
        }];

    const path = window.location.pathname.split('/');
    let language = '';

    const allowedLanguages = ['ru', 'es'];

    if (path[1] && allowedLanguages.includes(path[1])) {
        language = path[1];
    }
    
    // Глобальна функція checkPolygon для доступу з будь-якого місця
    window.checkPolygon = function() {
        const trashButton = document.getElementById("trash");
        const btnDraw = document.getElementById('draw');
        const btnFilterMobile = document.getElementById('filterMobilePhone');
        const btnList = document.getElementById('list');
        
        const urlParams = new URLSearchParams(decodeURIComponent(window.location.search));
        if (urlParams.has("polygon")) {
            if (trashButton) trashButton.classList.add("active");
            if (btnList) btnList.classList.remove('hidden');
            if (btnDraw) btnDraw.classList.add('hidden');
            if (btnFilterMobile) btnFilterMobile.classList.add('hidden');
        } else {
            if (trashButton) trashButton.classList.remove("active");
            if (btnList) btnList.classList.add('hidden');
            if (btnDraw) btnDraw.classList.remove("hidden");
            if (btnFilterMobile) btnFilterMobile.classList.remove("hidden");
        }
    };
    
    document.addEventListener("DOMContentLoaded", function () {
        // Первоначальная проверка при загрузке страницы
        checkPolygon();

        // Проверка изменений в параметрах URL каждые 500 мс
        let previousSearch = window.location.search;
        setInterval(() => {
            const currentSearch = window.location.search;
            if (currentSearch !== previousSearch) {
                previousSearch = currentSearch;
                checkPolygon();
            }
        }, 500);
    });

    	document.querySelector('meta[name="viewport"]').setAttribute('content', 'user-scalable=no, width=device-width, initial-scale=1.0');

    	window.addEventListener('touchstart', preventZoom, { passive: false });
    	window.addEventListener('touchmove', preventZoom, { passive: false });

     	window.addEventListener('wheel', preventZoomWheel, { passive: false });
    	window.addEventListener('dblclick', preventDoubleClickZoom, { passive: false });

     	function preventZoom(e) {
    		if (e.touches.length > 1) { 
    			e.preventDefault();
    		}
    	}

    	function preventZoomWheel(e) {
    		if (e.ctrlKey || e.metaKey) { 
    			e.preventDefault(); 
    		}
    	}

    	function preventDoubleClickZoom(e) {
     		e.preventDefault();
    	}

    // 1. Устанавливаем мета-тег viewport для отключения зума на мобильных устройствах
    document.querySelector('meta[name="viewport"]').setAttribute('content', 'user-scalable=no, width=device-width, initial-scale=1.0');

    // 2. Отключаем события touch для предотвращения масштабирования с помощью пальцев
    window.addEventListener('touchstart', preventZoom, { passive: false });
    window.addEventListener('touchmove', preventZoom, { passive: false });

    // 3. Отключаем масштабирование с помощью колесика мыши
    window.addEventListener('wheel', preventZoomWheel, { passive: false });

    // 4. Отключаем увеличение страницы при двойном клике
    window.addEventListener('dblclick', preventDoubleClickZoom, { passive: false });

    // 5. Блокируем прокрутку страницы на мобильных устройствах (особенно Safari)
    window.addEventListener('touchmove', preventScroll, { passive: false });  // Остановить прокрутку на мобильных устройствах
    document.body.style.overflow = 'hidden'; // Принудительное скрытие прокрутки на всей странице

    // 6. Отключаем двойной клик для предотвращения зума
    let lastTouch = 0;
    window.addEventListener('touchend', function (e) {
        let now = new Date().getTime();
        if (now - lastTouch <= 300) {
            e.preventDefault();  // Останавливаем действие двойного клика (масштабирование)
        }
        lastTouch = now;
    }, { passive: false });

    function preventZoom(e) {
        if (e.touches.length > 1) { // Если два или более пальцев касаются экрана
            e.preventDefault(); // Останавливаем действие масштабирования
        }
    }

    function preventZoomWheel(e) {
        if (e.ctrlKey || e.metaKey) { // Прокрутка колесика мыши с зажатым ctrl или meta (обычно используется для зума)
            e.preventDefault(); // Останавливаем действие масштабирования
        }
    }

    function preventDoubleClickZoom(e) {
        e.preventDefault(); // Останавливаем стандартное поведение при двойном клике
    }

    function preventScroll(e) {
        e.preventDefault(); // Блокируем прокрутку страницы
    }


    // header
    const Header = () => {
        const location = window.location;
        document.body.style.overflow = 'hidden';
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
        function headerHide() {
            if (window.innerWidth < 767) {
                headerId.style.height = "0px"
                headerId.style.overflow = "hidden"
            }
            else {
                headerId.style.height = "113px"
                headerId.style.overflow = "visible"
            }
        }
        applyHashStyles();
        headerHide()
        window.addEventListener("resize", headerHide)
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
            if (isMobile && window.scrollY > 100) {
                fixedMenue.style.opacity = 1;
                fixedMenue.style.visibility = "visible";
            } else {
                fixedMenue.style.opacity = 0;
                fixedMenue.style.visibility = "hidden";
            }
        }

        window.addEventListener("scroll", updateFixedMenueVisibility);
        window.addEventListener("resize", updateFixedMenueVisibility);
        window.addEventListener("resize", updateHeaderMap);
        // Инициализируем начальное состояние fixedMenue
        updateFixedMenueVisibility();
        updateHeaderMap();
        const logoContainer = createElement("div");
        logoDiv.appendChild(logoContainer);

        const logoImg = createElement("img");
        logoImg.setAttribute("src", "<?php echo get_template_directory_uri(); ?>/icons/shared/logo.svg");
        logoImg.setAttribute("alt", "pro-part-logo");
        logoImg.className = "logoImg";
        logoContainer.appendChild(logoImg);

        const navItems = [
            { text: "Home", url: `${language && "/" + language}/` },
            { text: "New building", url: `${language && "/" + language}/new-buildings?visible=Off+plan` },
            {
                text: "Secondary",
                url: `${language && "/" + language}/secondaries?page=1&visible=Secondary`,
            },
            {
                text: "Rent",
                url: `${language && "/" + language}/rent?page=1&rent_type=long`,
            },
            { text: "Map", url: `${language && "/" + language}/map?visible=Off+plan` },
            { text: "Areas", url: `${language && "/" + language}/areas` },
            { text: "Consulting", url: `${language && "/" + language}/consulting` },
            { text: "Blog", url: `${language && "/" + language}/blogs` },
        ];
        navItems.forEach(({ text, url }) => {
            navList.appendChild(createNavItem(text, url));
        });

        navItems.forEach(({ text, url }) => {
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
        likeButton.addEventListener("click", function () {
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


        const languages = [
            {
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
            listItem.href = updateLanguage({ code: lang.code })
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
        history.pushState = function (...args) {
            originalPushState.apply(this, args);
            updateActiveNavItem();
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function (...args) {
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

    document.addEventListener("DOMContentLoaded", function () {
        const headerContainer = document.getElementById("header");
        const container = document.getElementById("main-content");

        headerContainer.appendChild(Header());

        let scriptsLoaded = 0;

        function onScriptLoad() {
            scriptsLoaded++;

            if (scriptsLoaded === 3) {
                function renderFiltersFromQueryMap() {
                    const queryString = window.location.search.substring(1); // Получаем строку запроса
                    if (!queryString) return;

                    const queryParams = new URLSearchParams(queryString);
                    const propertiesSelectedFilters = document.getElementById("mapSelectedFilters");

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
                            renderFiltersFromQueryMap(); // Обновляем вид фильтров
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
                renderFiltersFromQueryMap();
                window.addEventListener("popstate", renderFiltersFromQueryMap);

                const subAreasWithLocations = [

                    {
        "oldValue": "Istán",
        "newValue": "Istán",
        "locations": {
            "lat": "36.5700",
            "lng": "-4.9611"
        }
    },
    {
        "oldValue": "Casares",
        "newValue": "Casares",
        "locations": {
            "lat": "36.4455",
            "lng": "-5.2756"
        }
    },
    {
        "oldValue": "San Pedro de Alcántara",
        "newValue": "San Pedro de Alcántara",
        "locations": {
            "lat": "36.486468",
            "lng": "-4.993133"
        }
    },
    {
        "oldValue": "Fuengirola",
        "newValue": "Fuengirola",
        "locations": {
            "lat": "36.5399",
            "lng": "-4.6247"
        }
    },
                    {
        "oldValue": "Manilva",
        "newValue": "Manilva",
        "locations": {
            "lat": "36.375435",
            "lng": "-5.250388"
        }
    },
    {
        "oldValue": "Elviria",
        "newValue": "Elviria",
        "locations": {
            "lat": "36.4936",
            "lng": "-4.7533"
        }
    },
    {
        "oldValue": "Mijas",
        "newValue": "Mijas",
        "locations": {
            "lat": "36.5958",
            "lng": "-4.6373"
        }
    },
    {
        "oldValue": "Málaga",
        "newValue": "Málaga",
        "locations": {
            "lat": "36.7202",
            "lng": "-4.4203"
        }
    },
    {
        "oldValue": "Benalmadena",
        "newValue": "Benalmadena",
        "locations": {
            "lat": "36.5955",
            "lng": "-4.5692"
        }
    },
    {
        "oldValue": "San Roque Club",
        "newValue": "San Roque Club",
        "locations": {
            "lat": "36.266715",
            "lng": "-5.337621"
        }
    },
    {
        "oldValue": "Sotogrande Alto",
        "newValue": "Sotogrande Alto",
        "locations": {
            "lat": "36.278994",
            "lng": "-5.313695"
        }
    },
    {
        "oldValue": "Sotogrande Marina",
        "newValue": "Sotogrande Marina",
        "locations": {
            "lat": "36.288755",
            "lng": "-5.278446"
        }
    },
                    {
        "oldValue": "Estepona",
        "newValue": "Estepona",
        "locations": {
            "lat": "36.424977",
            "lng": "-5.148960"
        }
    },



                    {
        "oldValue": "Fuengirola",
        "newValue": "Fuengirola",
        "locations": {
            "lat": "36.498107",
            "lng": "-4.765940"
        }
    },

                    {
        "oldValue": "Sotogrande Puerto",
        "newValue": "Sotogrande Puerto",
        "locations": {
            "lat": "36.283278",
            "lng": "-5.292943"
        }
    },

                    {
        "oldValue": "Fuengirola",
        "newValue": "Fuengirola",
        "locations": {
            "lat": "36.547949",
            "lng": " -4.625450"
        }
    },

                    {
        "oldValue": "Benahavís",
        "newValue": "Benahavís",
        "locations": {
            "lat": "36.508384",
            "lng": "-5.014961"
        }
    },
                    {
        "oldValue": "Diana Park",
        "newValue": "Diana Park",
        "locations": {
            "lat": "36.468583",
            "lng": "-5.019109"
        }
    },
    {
        "oldValue": "El Padron",
        "newValue": "El Padron",
        "locations": {
            "lat": "36.436920",
            "lng": "-5.110544"
        }
    },
    {
        "oldValue": "Bailen Miraflores",
        "newValue": "Bailen Miraflores",
        "locations": {
            "lat": "36.730388",
            "lng": "-4.447566"
        }
    },
    {
        "oldValue": "EI Coto",
        "newValue": "EI Coto",
        "locations": {
            "lat": "40.701307",
            "lng": "-3.446634"
        }
    },
    {
        "oldValue": "Los Prados",
        "newValue": "Los Prados",
        "locations": {
            "lat": "36.699217",
            "lng": "-4.474857"
        }
    },
    {
        "oldValue": "El Rosario",
        "newValue": "El Rosario",
        "locations": {
            "lat": "36.508468",
            "lng": "-4.805587"
        }
    },
    {
        "oldValue": "Bahia de Marbella",
        "newValue": "Bahia de Marbella",
        "locations": {
            "lat": "36.503849",
            "lng": "-4.828920"
        }
    },
    {
        "oldValue": "Marbella",
        "newValue": "San Diego",
        "locations": {
            "lat": "36.513695",
            "lng": "-4.885155"
        }
    },
    {
        "oldValue": "San Pedro de Alcántara",
        "newValue": "Valle del Sol",
        "locations": {
            "lat": "36.488516",
            "lng": "-5.008782"
        }
    },
    {
        "oldValue": "La Cala",
        "newValue": "La Cala",
        "locations": {
            "lat": "36.508006",
            "lng": "-4.681832"
        }
    },
    {
        "oldValue": "Bajondillo",
        "newValue": "Bajondillo",
        "locations": {
            "lat": "36.625782",
            "lng": "-4.501682"
        }
    },
    {
        "oldValue": "EI Pinillo",
        "newValue": "EI Pinillo",
        "locations": {
            "lat": "36.609426",
            "lng": "-4.515040"
        }
    },
    {
        "oldValue": "El Calvario",
        "newValue": "El Calvario",
        "locations": {
            "lat": "36.622384",
            "lng": "-4.504791"
        }
    },
    {
        "oldValue": "La Colina",
        "newValue": "La Colina",
        "locations": {
            "lat": "36.639066",
            "lng": "-4.494392"
        }
    },
    {
        "oldValue": "La Leala",
        "newValue": "La Leala",
        "locations": {
            "lat": "36.609639",
            "lng": "-4.526222"
        }
    },
    {
        "oldValue": "Playa de los Álamos",
        "newValue": "Playa de los Álamos",
        "locations": {
            "lat": "36.634728",
            "lng": "-4.485582"
        }
    },
    {
        "oldValue": "La Carihuela",
        "newValue": "Montemar",
        "locations": {
            "lat": "36.609214",
            "lng": "-4.508039"
        }
    },
    {
        "oldValue": "Los Alamos",
        "newValue": "Los Alamos",
        "locations": {
            "lat": "36.643870",
            "lng": "-4.481691"
        }
    },
    {
        "oldValue": "La Línea",
        "newValue": "La Línea",
        "locations": {
            "lat": "36.166912",
            "lng": "-5.349135"
        }
    },
    {
        "oldValue": "La Alcaidesa",
        "newValue": "La Alcaidesa",
        "locations": {
            "lat": "36.238110",
            "lng": "-5.318285"
        }
    },
    {
        "oldValue": "Los Barrios",
        "newValue": "Los Barrios",
        "locations": {
            "lat": "36.184361",
            "lng": "-5.492051"
        }
    },
    {
        "oldValue": "Pueblo Nuevo",
        "newValue": "Pueblo Nuevo",
        "locations": {
            "lat": "36.294314",
            "lng": "-5.301679"
        }
    },
    {
        "oldValue": "San Martin de Tesorillo",
        "newValue": "San Martin de Tesorillo",
        "locations": {
            "lat": "36.341226",
            "lng": "-5.320618"
        }
    },
    {
        "oldValue": "San Roque",
        "newValue": "San Roque",
        "locations": {
            "lat": "36.210456",
            "lng": "-5.339672"
        }
    },
    {
        "oldValue": "San Roque",
        "newValue": "San Roque Club",
        "locations": {
            "lat": "36.266715",
            "lng": "-5.337621"
        }
    },
    {
        "oldValue": "San Roque",
        "newValue": "Sotogrande",
        "locations": {
            "lat": "36.277732",
            "lng": "-5.293121"
        }
    },
    {
        "oldValue": "San Roque",
        "newValue": "Sotogrande Alto",
        "locations": {
            "lat": "36.278994",
            "lng": "-5.313695"
        }
    },
    {
        "oldValue": "San Roque",
        "newValue": "Sotogrande Costa",
        "locations": {
            "lat": "36.286195",
            "lng": "-5.289920"
        }
    },
    {
        "oldValue": "San Roque",
        "newValue": "Sotogrande Marina",
        "locations": {
            "lat": "36.288755",
            "lng": "-5.278446"
        }
    },
    {
        "oldValue": "San Roque",
        "newValue": "Sotogrande Playa",
        "locations": {
            "lat": "36.269908",
            "lng": "-5.285661"
        }
    },
    {
        "oldValue": "San Roque",
        "newValue": "Sotogrande Puerto",
        "locations": {
            "lat": "36.292761",
            "lng": "-5.272651"
        }
    },
    {
        "oldValue": "San Roque",
        "newValue": "Torreguadiaro",
        "locations": {
            "lat": "36.294731",
            "lng": "-5.276269"
        }
    },
    {
        "oldValue": "Zahara",
        "newValue": "Zahara",
        "locations": {
            "lat": "36.837623",
            "lng": "-5.436791"
        }
    },
    {
        "oldValue": "Cádiz",
        "newValue": "Cádiz",
        "locations": {
            "lat": "36.514671",
            "lng": "-6.277038"
        }
    },
    {
        "oldValue": "Alameda",
        "newValue": "Alameda",
        "locations": {
            "lat": "37.208882",
            "lng": "-4.657923"
        }
    },
    {
        "oldValue": "Algeciras",
        "newValue": "Algeciras",
        "locations": {
            "lat": "36.137764",
            "lng": "-5.454196"
        }
    },
    {
        "oldValue": "Alhaurin de la Torre",
        "newValue": "Alhaurin de la Torre",
        "locations": {
            "lat": "36.660539",
            "lng": "-4.558822"
        }
    },
    {
        "oldValue": "Alhaurin el Grande",
        "newValue": "Alhaurin el Grande",
        "locations": {
            "lat": "36.642015",
            "lng": "-4.687944"
        }
    },



    {
        "oldValue": "Torrenueva",
        "newValue": "Torrenueva",
        "locations": {
            "lat": "36.702124",
            "lng": "-3.487549"
        }
    },

    {
        "oldValue": "Arriate",
        "newValue": "Arriate",
        "locations": {
            "lat": "36.796661",
            "lng": "-5.138723"
        }},
        {
        "oldValue": "Torremolinos",
        "newValue": "Torremolinos",
        "locations": {
            "lat": "36.6203",
            "lng": "-4.4998"
        }
    },
    {
        "oldValue": "Hacienda del Sol",
        "newValue": "Hacienda del Sol",
        "locations": {
            "lat": "36.4886",
            "lng": "-5.0095"
        }
    },
    {
        "oldValue": "San Martín de Tesorillo",
        "newValue": "San Martín de Tesorillo",
        "locations": {
            "lat": "36.3412",
            "lng": "-5.3206"
        }
    },
    {
        "oldValue": "Sotogrande",
        "newValue": "Sotogrande",
        "locations": {
            "lat": "36.2777",
            "lng": "-5.2931"
        }
    },
                    
                    {
                        "oldValue": "Benavista",
                        "newValue": "Benavista",
                        "locations": {
                            "lat": "36.464858",
                            "lng": "-5.032980"
                        }
                    },


                    {
                        "oldValue": "Benavista",
                        "newValue": "Benavista",
                        "locations": {
                            "lat": "36.464858",
                            "lng": "-5.032980"
                        }
                    },
                    {
                        "oldValue": "Costalita",
                        "newValue": "Costalita",
                        "locations": {
                            "lat": "36.456243",
                            "lng": " -5.050795"
                        }
                    },
                    {
                        "oldValue": "Valle Romano",
                        "newValue": "Valle Romano",
                        "locations": {
                            "lat": "36.425717",
                            "lng": "-5.189846"
                        }
                    },
                    {
                        "oldValue": "El Padrón",
                        "newValue": "El Padrón",
                        "locations": {
                            "lat": "36.436117",
                            "lng": "-5.111105"
                        }
                    },
                    {
                        "oldValue": "El Presidente",
                        "newValue": "Hacienda del Sol",
                        "locations": {
                            "lat": "36.46461",
                            "lng": "-5.018283"
                        }
                    },
                    {
                        "oldValue": "Selwo",
                        "newValue": "Selwo",
                        "locations": {
                            "lat": "36.461255",
                            "lng": "-5.086231"
                        }
                    },
                    {
                        "oldValue": "Atalaya",
                        "newValue": "Atalaya",
                        "locations": {
                            "lat": "36.472195",
                            "lng": "-5.019416"
                        }
                    },
                    {
                        "oldValue": "Benamara",
                        "newValue": "Benamara",
                        "locations": {
                            "lat": "36.463945",
                            "lng": "-5.022870"
                        }
                    },
                    {
                        "oldValue": "El Presidente",
                        "newValue": "El Presidente",
                        "locations": {
                            "lat": "36.466047",
                            "lng": "-5.020769"
                        }
                    },
                    {
                        "oldValue": "Bel Air",
                        "newValue": "Bel Air",
                        "locations": {
                            "lat": "36.467362",
                            "lng": "-5.043082"
                        }
                    },
                    {
                        "oldValue": "Cancelada",
                        "newValue": "Cancelada",
                        "locations": {
                            "lat": "36.460592",
                            "lng": "-5.053213"
                        }
                    },
                    {
                        "oldValue": "New Golden Mile",
                        "newValue": "New Golden Mile",
                        "locations": {
                            "lat": "36.43393",
                            "lng": "-5.112537"
                        }
                    },
                    {
                        "oldValue": "Alhaurín de la Torre",
                        "newValue": "Alhaurín de la Torre",
                        "locations": {
                            "lat": "36.661493",
                            "lng": " -4.558625"
                        }
                    },
                    {
                        "oldValue": "Alhaurín de la Torre",
                        "newValue": "Lauro Golf",
                        "locations": {
                            "lat": "36.653672",
                            "lng": "-4.635157"
                        }
                    },
                    {
                        "oldValue": "Málaga Este",
                        "newValue": "Málaga Este",
                        "locations": {
                            "lat": "36.721353",
                            "lng": "-4.365927"
                        }
                    },
                    {
                        "oldValue": "Málaga Centro",
                        "newValue": "Málaga Centro",
                        "locations": {
                            "lat": "36.722838",
                            "lng": "-4.423730"
                        }
                    },
                    {
                        "oldValue": "Málaga Este",
                        "newValue": "Miraflores",
                        "locations": {
                            "lat": "36.725014",
                            "lng": "-4.349175"
                        }
                    },
                    {
                        "oldValue": "Río Real",
                        "newValue": "Río Real",
                        "locations": {
                            "lat": "36.512154",
                            "lng": "-4.846412"
                        }
                    },
                    {
                        "oldValue": "Hacienda Las Chapas",
                        "newValue": "Las Chapas",
                        "locations": {
                            "lat": "36.50978",
                            "lng": "-4.863763"
                        }
                    },
                    {
                        "oldValue": "Hacienda Las Chapas",
                        "newValue": "Santa Clara",
                        "locations": {
                            "lat": "36.508084",
                            "lng": "-4.815966"
                        }
                    },
                    {
                        "oldValue": "Hacienda Las Chapas",
                        "newValue": "Hacienda Las Chapas",
                        "locations": {
                            "lat": "36.49729",
                            "lng": "-4.753326"
                        }
                    },
                    {
                        "oldValue": "Hacienda Las Chapas",
                        "newValue": "Los Monteros",
                        "locations": {
                            "lat": "36.503671",
                            "lng": "-4.822126"
                        }
                    },
                    {
                        "oldValue": "Carib Playa",
                        "newValue": "Carib Playa",
                        "locations": {
                            "lat": "36.490539",
                            "lng": "-4.753351"
                        }
                    },
                    {
                        "oldValue": "Costabella",
                        "newValue": "Costabella",
                        "locations": {
                            "lat": "36.500554",
                            "lng": "-4.805583"
                        }
                    },
                    {
                        "oldValue": "Torre Real",
                        "newValue": "Torre Real",
                        "locations": {
                            "lat": "36.507218",
                            "lng": "-4.847410"
                        }
                    },
                    {
                        "oldValue": "Altos de los Monteros",
                        "newValue": "Altos de los Monteros",
                        "locations": {
                            "lat": "36.527196",
                            "lng": "-4.835271"
                        }
                    },
                    {
                        "oldValue": "Sierra Blanca",
                        "newValue": "Sierra Blanca",
                        "locations": {
                            "lat": "36.521547",
                            "lng": "-4.918166"
                        }
                    },
                    {
                        "oldValue": "Nagüeles",
                        "newValue": "Nagüeles",
                        "locations": {
                            "lat": "36.513982",
                            "lng": "-4.923137"
                        }
                    },
                    {
                        "oldValue": "Nueva Andalucía",
                        "newValue": "Nueva Andalucía",
                        "locations": {
                            "lat": "36.506788",
                            "lng": "-4.968783"
                        }
                    },
                    {
                        "oldValue": "Hacienda Las Chapas",
                        "newValue": "Elviria",
                        "locations": {
                            "lat": "36.501664",
                            "lng": "-4.783651"
                        }
                    },
                    {
                        "oldValue": "Aloha",
                        "newValue": "Aloha",
                        "locations": {
                            "lat": "36.511157",
                            "lng": "-4.957890"
                        }
                    },
                    {
                        "oldValue": "Puerto de Cabopino",
                        "newValue": "Puerto de Cabopino",
                        "locations": {
                            "lat": "36.486842",
                            "lng": "-4.742248"
                        }
                    },
                    {
                        "oldValue": "The Golden Mile",
                        "newValue": "The Golden Mile",
                        "locations": {
                            "lat": "36.496722",
                            "lng": "-4.943611"
                        }
                    },
                    {
                        "oldValue": "Puerto Banús",
                        "newValue": "Puerto Banús",
                        "locations": {
                            "lat": "36.489447",
                            "lng": "-4.949598"
                        }
                    },
                    {
                        "oldValue": "Artola",
                        "newValue": "Artola",
                        "locations": {
                            "lat": "36.489071",
                            "lng": "-4.747826"
                        }
                    },
                    {
                        "oldValue": "Nueva Andalucía",
                        "newValue": "Los Almendros",
                        "locations": {
                            "lat": "36.73656",
                            "lng": "-4.482690"
                        }
                    },
                    {
                        "oldValue": "Bahía de Marbella",
                        "newValue": "Bahía de Marbella",
                        "locations": {
                            "lat": "36.505513",
                            "lng": "-4.831840"
                        }
                    },
                    {
                        "oldValue": "Hacienda Las Chapas",
                        "newValue": "Marbesa",
                        "locations": {
                            "lat": "36.489033",
                            "lng": "-4.759480"
                        }
                    },
                    {
                        "oldValue": "Cabopino",
                        "newValue": "Cabopino",
                        "locations": {
                            "lat": "36.492811",
                            "lng": "-4.739847"
                        }
                    },
                    {
                        "oldValue": "Hacienda Las Chapas",
                        "newValue": "Reserva de Marbella",
                        "locations": {
                            "lat": "36.498243",
                            "lng": "-4.749173"
                        }
                    },
                    {
                        "oldValue": "Guadalmina Alta",
                        "newValue": "Guadalmina Alta",
                        "locations": {
                            "lat": "36.479943",
                            "lng": "-5.008321"
                        }
                    },
                    {
                        "oldValue": "Hacienda Las Chapas",
                        "newValue": "Las Brisas",
                        "locations": {
                            "lat": "36.608356",
                            "lng": "-4.707276"
                        }
                    },
                    {
                        "oldValue": "San Pedro de Alcántara",
                        "newValue": "San Pedro de Alcántara",
                        "locations": {
                            "lat": "36.486468",
                            "lng": "-4.993133"
                        }
                    },
                    {
                        "oldValue": "Guadalmina Baja",
                        "newValue": "Guadalmina Baja",
                        "locations": {
                            "lat": "36.468169",
                            "lng": "-4.999340"
                        }
                    },
                    {
                        "oldValue": "San Pedro de Alcántara",
                        "newValue": "Cortijo Blanco",
                        "locations": {
                            "lat": "36.480122",
                            "lng": "-4.973628"
                        }
                    },
                    {
                        "oldValue": "Carvajal",
                        "newValue": "Carvajal",
                        "locations": {
                            "lat": "36.567968",
                            "lng": "-4.595705"
                        }
                    },
                    {
                        "oldValue": "Los Boliches",
                        "newValue": "Los Boliches",
                        "locations": {
                            "lat": "36.561216",
                            "lng": "-4.605981"
                        }
                    },
                    {
                        "oldValue": "Los Pacos",
                        "newValue": "Los Pacos",
                        "locations": {
                            "lat": "36.561287",
                            "lng": "-4.616939"
                        }
                    },
                    {
                        "oldValue": "Torreblanca",
                        "newValue": "Torreblanca",
                        "locations": {
                            "lat": "36.568518",
                            "lng": "-4.610100"
                        }
                    },
                    {
                        "oldValue": "Las Lagunas",
                        "newValue": "Las Lagunas",
                        "locations": {
                            "lat": "36.542664",
                            "lng": "-4.637792"
                        }
                    },
                    {
                        "oldValue": "Punta Chullera",
                        "newValue": "Punta Chullera",
                        "locations": {
                            "lat": "36.313676",
                            "lng": "-5.249639"
                        }
                    },
                    {
                        "oldValue": "La Duquesa",
                        "newValue": "La Duquesa",
                        "locations": {
                            "lat": "36.35833",
                            "lng": "-5.230239"
                        }
                    },
                    {
                        "oldValue": "San Luis de Sabinillas",
                        "newValue": "San Luis de Sabinillas",
                        "locations": {
                            "lat": "36.364995",
                            "lng": "-5.226568"
                        }
                    },
                    {
                        "oldValue": "Casares Playa",
                        "newValue": "Casares Playa",
                        "locations": {
                            "lat": "36.378537",
                            "lng": "-5.218148"
                        }
                    },
                    {
                        "oldValue": "Casares Pueblo",
                        "newValue": "Casares Pueblo",
                        "locations": {
                            "lat": "36.443299",
                            "lng": "-5.273100"
                        }
                    },
                    {
                        "oldValue": "Doña Julia",
                        "newValue": "Doña Julia",
                        "locations": {
                            "lat": "36.387047",
                            "lng": "-5.234446"
                        }
                    },
                    {
                        "oldValue": "Campo Mijas",
                        "newValue": "Campo Mijas",
                        "locations": {
                            "lat": "36.556206",
                            "lng": "-4.641865"
                        }
                    },
                    {
                        "oldValue": "La Cala de Mijas",
                        "newValue": "La Cala de Mijas",
                        "locations": {
                            "lat": "36.501225",
                            "lng": "-4.682612"
                        }
                    },
                    {
                        "oldValue": "Valtocado",
                        "newValue": "Valtocado",
                        "locations": {
                            "lat": "36.600542",
                            "lng": "-4.678837"
                        }
                    },
                    {
                        "oldValue": "Riviera del Sol",
                        "newValue": "Riviera del Sol",
                        "locations": {
                            "lat": "36.506914",
                            "lng": "-4.713485"
                        }
                    },
                    {
                        "oldValue": "Sierrezuela",
                        "newValue": "Sierrezuela",
                        "locations": {
                            "lat": "36.554951",
                            "lng": "-4.647750"
                        }
                    },
                    {
                        "oldValue": "Calanova Golf",
                        "newValue": "Calanova Golf",
                        "locations": {
                            "lat": "36.513715",
                            "lng": "-4.712601"
                        }
                    },
                    {
                        "oldValue": "Mijas Costa",
                        "newValue": "Mijas Costa",
                        "locations": {
                            "lat": "36.596691",
                            "lng": "-4.632920"
                        }
                    },
                    {
                        "oldValue": "La Cala Golf",
                        "newValue": "La Cala Golf",
                        "locations": {
                            "lat": "36.540973",
                            "lng": "-4.723249"
                        }
                    },
                    {
                        "oldValue": "La Cala Hills",
                        "newValue": "La Cala Hills",
                        "locations": {
                            "lat": "36.54841",
                            "lng": "-4.684888"
                        }
                    },
                    {
                        "oldValue": "Calypso",
                        "newValue": "Calypso",
                        "locations": {
                            "lat": "36.492117",
                            "lng": "-4.710557"
                        }
                    },
                    {
                        "oldValue": "Mijas Golf",
                        "newValue": "Mijas Golf",
                        "locations": {
                            "lat": "36.548599",
                            "lng": "-4.657123"
                        }
                    },
                    {
                        "oldValue": "Cerros del Aguila",
                        "newValue": "Cerros del Aguila",
                        "locations": {
                            "lat": "36.534039",
                            "lng": "-4.659735"
                        }
                    },
                    {
                        "oldValue": "Calahonda",
                        "newValue": "Calahonda",
                        "locations": {
                            "lat": "36.494151",
                            "lng": "-4.722703"
                        }
                    },
                    {
                        "oldValue": "El Chaparral",
                        "newValue": "El Chaparral",
                        "locations": {
                            "lat": "36.745697",
                            "lng": "-4.476757"
                        }
                    },
                    {
                        "oldValue": "El Faro",
                        "newValue": "El Faro",
                        "locations": {
                            "lat": "36.510821",
                            "lng": "-4.641092"
                        }
                    },
                    {
                        "oldValue": "Torremar",
                        "newValue": "Torremar",
                        "locations": {
                            "lat": "36.738388",
                            "lng": "-4.476264"
                        }
                    },
                    {
                        "oldValue": "La Heredia",
                        "newValue": "La Heredia",
                        "locations": {
                            "lat": "36.521712",
                            "lng": " -5.005841"
                        }
                    },
                    {
                        "oldValue": "Los Arqueros",
                        "newValue": "Los Arqueros",
                        "locations": {
                            "lat": "36.513309",
                            "lng": "-5.015493"
                        }
                    },
                    {
                        "oldValue": "La Zagaleta",
                        "newValue": "La Zagaleta",
                        "locations": {
                            "lat": "36.543609",
                            "lng": "-5.024678"
                        }
                    },
                    {
                        "oldValue": "El Madroñal",
                        "newValue": "El Madroñal",
                        "locations": {
                            "lat": "36.52667",
                            "lng": "-5.005996"
                        }
                    },
                    {
                        "oldValue": "Los Flamingos",
                        "newValue": "Los Flamingos",
                        "locations": {
                            "lat": "36.478463",
                            "lng": "-5.048250"
                        }
                    },
                    {
                        "oldValue": "Monte Halcones",
                        "newValue": "Monte Halcones",
                        "locations": {
                            "lat": "36.514533",
                            "lng": "-5.004186"
                        }
                    },
                    {
                        "oldValue": "El Paraiso",
                        "newValue": "El Paraiso",
                        "locations": {
                            "lat": "36.470465",
                            "lng": "-5.029915"
                        }
                    },
                    {
                        "oldValue": "La Quinta",
                        "newValue": "La Quinta",
                        "locations": {
                            "lat": "36.51929",
                            "lng": "-4.995998"
                        }
                    },
                    {
                        "oldValue": "La Campana",
                        "newValue": "La Campana",
                        "locations": {
                            "lat": "36.500165",
                            "lng": "-4.974385"
                        }
                    },
                    {
                        "oldValue": "Alhaurin Golf",
                        "newValue": "Alhaurin Golf",
                        "locations": {
                            "lat": "36.608264",
                            "lng": "-4.705230"
                        }
                    },
                    {
                        "oldValue": "Benalmadena Pueblo",
                        "newValue": "Benalmadena Pueblo",
                        "locations": {
                            "lat": "36.597063",
                            "lng": "-4.570987"
                        }
                    },
                    {
                        "oldValue": "La Capellania",
                        "newValue": "La Capellania",
                        "locations": {
                            "lat": "36.582302",
                            "lng": "-4.591692"
                        }
                    },
                    {
                        "oldValue": "Arroyo de la Miel",
                        "newValue": "Arroyo de la Miel",
                        "locations": {
                            "lat": "36.60384",
                            "lng": "-4.531815"
                        }
                    },
                    {
                        "oldValue": "Torremuelle",
                        "newValue": "Torremuelle",
                        "locations": {
                            "lat": "36.579295",
                            "lng": "-4.571551"
                        }
                    },
                    {
                        "oldValue": "Benalmadena Costa",
                        "newValue": "Benalmadena Costa",
                        "locations": {
                            "lat": "36.594079",
                            "lng": "-4.525803"
                        }
                    },
                    {
                        "oldValue": "Torrequebrada",
                        "newValue": "Torrequebrada",
                        "locations": {
                            "lat": "36.586655",
                            "lng": "-4.549422"
                        }
                    },
                    {
                        "oldValue": "La Carihuela",
                        "newValue": "La Carihuela",
                        "locations": {
                            "lat": "36.608133",
                            "lng": "-4.505748"
                        }
                    },
                    {
                        "oldValue": "El Pinillo",
                        "newValue": "El Pinillo",
                        "locations": {
                            "lat": "36.61018",
                            "lng": "-4.515768"
                        }
                    },
                    {
                        "oldValue": "Torremolinos Centro",
                        "newValue": "Torremolinos Centro",
                        "locations": {
                            "lat": "36.623585",
                            "lng": "-4.500529"
                        }
                    },
                    {
                        "oldValue": "Playamar",
                        "newValue": "Playamar",
                        "locations": {
                            "lat": "36.633823",
                            "lng": "-4.488554"
                        }
                    },
                    {
                        "oldValue": "Istan",
                        "newValue": "Istan",
                        "locations": {
                            "lat": "36.581746",
                            "lng": "-4.949879"
                        }
                    },
                    {
                        "oldValue": "Cártama",
                        "newValue": "Cártama",
                        "locations": {
                            "lat": "36.712067",
                            "lng": "-4.630833"
                        }
                    },
                    {
                        "oldValue": "Benaoján",
                        "newValue": "Benaoján",
                        "locations": {
                            "lat": "36.721192",
                            "lng": "-5.250713"
                        }
                    },
                    {
                        "oldValue": "Antequera",
                        "newValue": "Antequera",
                        "locations": {
                            "lat": "37.019058",
                            "lng": "-4.555719"
                        }
                    },
                    {
                        "oldValue": "Ojén",
                        "newValue": "Ojén",
                        "locations": {
                            "lat": "36.565195",
                            "lng": "-4.855727"
                        }
                    },
                    {
                        "oldValue": "Fuente de Piedra",
                        "newValue": "Fuente de Piedra",
                        "locations": {
                            "lat": "37.134288",
                            "lng": "-4.730543"
                        }
                    },
                    {
                        "oldValue": "Júzcar",
                        "newValue": "Júzcar",
                        "locations": {
                            "lat": "36.625511",
                            "lng": "-5.170535"
                        }
                    },
                    {
                        "oldValue": "Genalguacil",
                        "newValue": "Genalguacil",
                        "locations": {
                            "lat": "36.545872",
                            "lng": "-5.235623"
                        }
                    },
                    {
                        "oldValue": "Puerto de la Torre",
                        "newValue": "Puerto de la Torre",
                        "locations": {
                            "lat": "36.757227",
                            "lng": "-4.482857"
                        }
                    },
                    {
                        "oldValue": "Arriateg",
                        "newValue": "Arriateg",
                        "locations": {
                            "lat": "36.797372",
                            "lng": "-5.140375"
                        }
                    },
                    {
                        "oldValue": "El Burgo",
                        "newValue": "El Burgo",
                        "locations": {
                            "lat": "36.790748",
                            "lng": "-4.949752"
                        }
                    },
                    {
                        "oldValue": "Gaucín",
                        "newValue": "Gaucín",
                        "locations": {
                            "lat": "36.519420",
                            "lng": "-5.321173"
                        }
                    },
                    {
                        "oldValue": "La Mairena",
                        "newValue": "La Mairena",
                        "locations": {
                            "lat": "36.531100",
                            "lng": "-4.747687"
                        }
                    },
                    {
                        "oldValue": "Archidona",
                        "newValue": "Archidona",
                        "locations": {
                            "lat": "37.095339",
                            "lng": "-4.379504"
                        }
                    },
                    {
                        "oldValue": "Monda",
                        "newValue": "Monda",
                        "locations": {
                            "lat": "36.629817",
                            "lng": "-4.830620"
                        }
                    },
                    {
                        "oldValue": "El Chorro",
                        "newValue": "El Chorro",
                        "locations": {
                            "lat": "36.909298",
                            "lng": "-4.759307"
                        }
                    },
                    {
                        "oldValue": "Carratraca",
                        "newValue": "Carratraca",
                        "locations": {
                            "lat": "36.853165",
                            "lng": "-4.820201"
                        }
                    },
                    {
                        "oldValue": "Ronda",
                        "newValue": "Ronda",
                        "locations": {
                            "lat": "36.746381",
                            "lng": "-5.159208"
                        }
                    },
                    {
                        "oldValue": "Villanueva De La Concepcion",
                        "newValue": "Villanueva De La Concepcion",
                        "locations": {
                            "lat": "36.931155",
                            "lng": "-4.530582"
                        }
                    },
                    {
                        "oldValue": "Mollina",
                        "newValue": "Mollina",
                        "locations": {
                            "lat": "37.122683",
                            "lng": "-4.660480"
                        }
                    },
                    {
                        "oldValue": "Almogia",
                        "newValue": "Almogia",
                        "locations": {
                            "lat": "36.829197",
                            "lng": "-4.541114"
                        }
                    },
                    {
                        "oldValue": "Villanueva del Rosario",
                        "newValue": "Villanueva del Rosario",
                        "locations": {
                            "lat": "36.998585",
                            "lng": "-4.367404"
                        }
                    },
                    {
                        "oldValue": "Cuevas del Becerro",
                        "newValue": "Cuevas del Becerro",
                        "locations": {
                            "lat": "36.874908",
                            "lng": "-5.046634"
                        }
                    },
                    {
                        "oldValue": "Zalea",
                        "newValue": "Zalea",
                        "locations": {
                            "lat": "36.767175",
                            "lng": "-4.746640"
                        }
                    },
                    {
                        "oldValue": "Alhaurín el Grande",
                        "newValue": "Alhaurín el Grande",
                        "locations": {
                            "lat": "36.643876",
                            "lng": "-4.686881"
                        }
                    },
                    {
                        "oldValue": "Ardales",
                        "newValue": "Ardales",
                        "locations": {
                            "lat": "36.878621",
                            "lng": "-4.846131"
                        }
                    },
                    {
                        "oldValue": "Tolox",
                        "newValue": "Tolox",
                        "locations": {
                            "lat": "36.685700",
                            "lng": "-4.904465"
                        }
                    },
                    {
                        "oldValue": "Cortes de la Frontera",
                        "newValue": "Cortes de la Frontera",
                        "locations": {
                            "lat": "36.618150",
                            "lng": "-5.342119"
                        }
                    },
                    {
                        "oldValue": "Campillos",
                        "newValue": "Campillos",
                        "locations": {
                            "lat": "37.048217",
                            "lng": "-4.863387"
                        }
                    },
                    {
                        "oldValue": "Algatocin",
                        "newValue": "Algatocin",
                        "locations": {
                            "lat": "36.573040",
                            "lng": "-5.275907"
                        }
                    },
                    {
                        "oldValue": "Benarrabá",
                        "newValue": "Benarrabá",
                        "locations": {
                            "lat": "36.551073",
                            "lng": "-5.275980"
                        }
                    },
                    {
                        "oldValue": "Valle de Abdalajis",
                        "newValue": "Valle de Abdalajis",
                        "locations": {
                            "lat": "36.931921",
                            "lng": "-4.682568"
                        }
                    },
                    {
                        "oldValue": "Montejaque",
                        "newValue": "Montejaque",
                        "locations": {
                            "lat": "36.735862",
                            "lng": "-5.250765"
                        }
                    },
                    {
                        "oldValue": "Alpandeire",
                        "newValue": "Alpandeire",
                        "locations": {
                            "lat": "36.633667",
                            "lng": "-5.203007"
                        }
                    },
                    {
                        "oldValue": "Guaro",
                        "newValue": "Guaro",
                        "locations": {
                            "lat": "36.656317",
                            "lng": "-4.834945"
                        }
                    },
                    {
                        "oldValue": "Alora",
                        "newValue": "Alora",
                        "locations": {
                            "lat": "36.823846",
                            "lng": "-4.705721"
                        }
                    },
                    {
                        "oldValue": "Coín",
                        "newValue": "Coín",
                        "locations": {
                            "lat": "36.660232",
                            "lng": "-4.757495"
                        }
                    },
                    {
                        "oldValue": "Pizarra",
                        "newValue": "Pizarra",
                        "locations": {
                            "lat": "36.764966",
                            "lng": "-4.708583"
                        }
                    },
                    {
                        "oldValue": "Benalauría",
                        "newValue": "Benalauría",
                        "locations": {
                            "lat": "36.594166",
                            "lng": "-5.261033"
                        }
                    },
                    {
                        "oldValue": "Yunquera",
                        "newValue": "Yunquera",
                        "locations": {
                            "lat": "36.733697",
                            "lng": "-4.919603"
                        }
                    },
                    {
                        "oldValue": "Casabermeja",
                        "newValue": "Casabermeja",
                        "locations": {
                            "lat": "36.895494",
                            "lng": "-4.429808"
                        }
                    },
                    {
                        "oldValue": "Estacion de Cartama",
                        "newValue": "Estacion de Cartama",
                        "locations": {
                            "lat": "36.737151",
                            "lng": "-4.609221"
                        }
                    },
                    {
                        "oldValue": "Jubrique",
                        "newValue": "Jubrique",
                        "locations": {
                            "lat": "36.564710",
                            "lng": "-5.215560"
                        }
                    },
                    {
                        "oldValue": "Alozaina",
                        "newValue": "Alozaina",
                        "locations": {
                            "lat": "36.727318",
                            "lng": "-4.858197"
                        }
                    },
                    {
                        "oldValue": "Cañete la Real",
                        "newValue": "Cañete la Real",
                        "locations": {
                            "lat": "36.952916",
                            "lng": "-5.025344"
                        }
                    },
                    {
                        "oldValue": "Estación de Gaucin",
                        "newValue": "Estación de Gaucin",
                        "locations": {
                            "lat": "36.540420",
                            "lng": "-5.387029"
                        }
                    },
                    {
                        "oldValue": "Villafranco del Guadalhorce",
                        "newValue": "Villafranco del Guadalhorce",
                        "locations": {
                            "lat": "36.701396",
                            "lng": "-4.699149"
                        }
                    },
                    {
                        "oldValue": "Casarabonela",
                        "newValue": "Casarabonela",
                        "locations": {
                            "lat": "36.785261",
                            "lng": "-4.842896"
                        }
                    },
                    {
                        "oldValue": "Jimera de Líbar",
                        "newValue": "Jimera de Líbar",
                        "locations": {
                            "lat": "36.651340",
                            "lng": "-5.274241"
                        }
                    },
                    {
                        "oldValue": "Puerto de la Torre",
                        "newValue": "Puerto de la Torre",
                        "locations": {
                            "lat": "36.748444",
                            "lng": "-4.487786"
                        }
                    }
                ];
//                 const projectIdsInPolygonSecondary = [];
//                 const projectIdsInPolygonOffPlan = [];

                // backend
			async function fetchProjectsData() {
			console.log("📥 fetchProjectsData() ВИКЛИКАНО!");
			console.trace("📍 Call stack fetchProjectsData:");
			console.log("   - URL на момент виклику:", window.location.href);
			
			const loader = document.getElementById("mapPageLoader");
			loader.classList.add("active");

			const queryParams = new URLSearchParams(window.location.search);
			console.log("   - queryParams.has('polygon'):", queryParams.has('polygon'));
			
			// ✅ ВИПРАВЛЕННЯ: Перевіряємо, чи був полігон видалений
			if (sessionStorage.getItem('polygonDeleted') === 'true' && queryParams.has('polygon')) {
				console.log("   🧹 Видаляємо параметр 'polygon' з queryParams, бо полігон було видалено");
				queryParams.delete('polygon');
			}
			
			if (!queryParams.has("visible")) {
				queryParams.set("visible", "Off plan");
				console.log("   📝 Встановлюємо 'visible=Off plan' через history.replaceState");
				window.history.replaceState({}, "", `${window.location.origin}${window.location.pathname}?${queryParams.toString()}`);
				console.log("   - URL після replaceState:", window.location.href);
			}

		const visible = queryParams.get("visible");
		// Використовуємо різні endpoints: /properties для Rent, /properties-map для інших
		const endpoint = visible === 'Rent' 
			? 'https://xf9m-jkaj-lcsq.p7.xano.io/api:v5maUE6u/properties'
			: 'https://xf9m-jkaj-lcsq.p7.xano.io/api:v5maUE6u/properties-map';

            const requestBody = {
				// Значення за замовчуванням
				perPage: visible === 'Rent' ? 10000 : 0,
				curPage: visible === 'Rent' ? 1 : 0,
				type: "",
				town: [],
				property_status: "",
				bedrooms: [],
				min_price: 0,
				max_price: 0,
				pool: "",
				garden: "",
				garage: "",
				property_type: [],
				// Додаємо нові поля, які можуть бути відсутніми
				min_built_area: 0,
				max_built_area: 0,
				min_completion_date: null,
				max_completion_date: null,
				development_name: "",
				rent_type: "" // Для rent проектів
			};

			// 1. Заповнюємо тіло запиту на основі URL-параметрів

			// Фільтр "Off plan" / "Secondary" / "Rent"
			if (visible === 'Off plan') {
				requestBody.property_status = 'New building';
			} else if (visible === 'Secondary') {
				requestBody.property_status = 'Secondary';
			} else if (visible === 'Rent') {
				const rentType = queryParams.get("rent_type") || "long";
				// Backend expects specific property_status for rent types
				requestBody.property_status = rentType === 'short' ? 'Rent Short' : 'Rent Long';
				requestBody.rent_type = rentType;
			}

			// Інші фільтри з URL
			// Bedrooms: support both `bedrooms=1,2` and indexed `bedrooms[0]=1` in page URL
			{
				const bedroomValues = [];
				for (const [k, v] of queryParams.entries()) {
					if (k.startsWith("bedrooms[")) bedroomValues.push(Number(v));
				}
				if (bedroomValues.length === 0 && queryParams.has("bedrooms")) {
					const raw = queryParams.get("bedrooms");
					if (raw) bedroomValues.push(...raw.split(',').map(n => Number(n)));
				}
				requestBody.bedrooms = bedroomValues;
			}
			if (queryParams.has("minPrice")) {
				requestBody.min_price = parseInt(queryParams.get("minPrice"), 10);
			}
			if (queryParams.has("maxPrice")) {
				requestBody.max_price = parseInt(queryParams.get("maxPrice"), 10);
			}
			if (queryParams.has("propertyType")) {
				requestBody.property_type = queryParams.get("propertyType").split(',').map(t => t.trim()).filter(Boolean);
			}
			if (queryParams.has("subAreas")) {
				// API очікує рядок, а не масив. Беремо тільки перше значення.
				requestBody.town = queryParams.get("subAreas").split(',')[0];
			}

			// === ДОДАНО НОВІ ФІЛЬТРИ ===
			if (queryParams.has("minSize")) {
				requestBody.min_built_area = parseInt(queryParams.get("minSize"), 10);
			}
			if (queryParams.has("maxSize")) {
				requestBody.max_built_area = parseInt(queryParams.get("maxSize"), 10);
			}
			if (queryParams.has("handoverMin")) {
				requestBody.min_completion_date = queryParams.get("handoverMin"); // Очікується рядок типу 'YYYY-MM-DD'
			}
			if (queryParams.has("handoverMax")) {
				requestBody.max_completion_date = queryParams.get("handoverMax"); // Очікується рядок типу 'YYYY-MM-DD'
			}
			if (queryParams.has("projectName")) {
				requestBody.development_name = queryParams.get("projectName");
			}
			// === КІНЕЦЬ НОВИХ ФІЛЬТРІВ ===

			// Make projectsData globally accessible
			window.projectsData = window.projectsData || [];
			let projectsData = window.projectsData;
			try {
			// Build URL with query parameters
			const url = new URL(endpoint);
			
			// Add filter parameters to URL
			// Для /properties endpoint завжди передаємо perPage та curPage
			if (visible === 'Rent') {
				url.searchParams.set('perPage', requestBody.perPage);
				url.searchParams.set('curPage', requestBody.curPage);
			} else {
				if (requestBody.perPage !== 0) url.searchParams.set('perPage', requestBody.perPage);
				if (requestBody.curPage !== 0) url.searchParams.set('curPage', requestBody.curPage);
			}
			if (requestBody.type) url.searchParams.set('type', requestBody.type);
				
				// Handle array parameters - send multiple parameters for each value
// 				if (requestBody.town && requestBody.town.length > 0) {
// 					requestBody?.town?.forEach(town => {
// 						url.searchParams.append('town', town);
// 					});
// 				}
// 				
 				if (requestBody.town) {
    const subAreas = queryParams.get("subAreas");
    if (subAreas) { // only split if it exists
        const locations = subAreas.split(",");
        locations.forEach((location, index) => {
            url.searchParams.append(`town[${index}]`, location.trim());
        });
    }
}

				if (requestBody.property_status) url.searchParams.set('property_status', requestBody.property_status);
				
				// Handle bedrooms array - send as indexed parameters
				if (requestBody.bedrooms && requestBody.bedrooms.length > 0) {
					requestBody.bedrooms.forEach((bedroom, idx) => {
						url.searchParams.append(`bedrooms[${idx}]`, bedroom);
					});
				}
				
				if (requestBody.min_price > 0) url.searchParams.set('min_price', requestBody.min_price);
				if (requestBody.max_price > 0) url.searchParams.set('max_price', requestBody.max_price);
				if (requestBody.pool) url.searchParams.set('pool', requestBody.pool);
				if (requestBody.garden) url.searchParams.set('garden', requestBody.garden);
				if (requestBody.garage) url.searchParams.set('garage', requestBody.garage);
				
				// Handle property_type array - send as indexed parameters
				if (requestBody.property_type && requestBody.property_type.length > 0) {
					requestBody.property_type.forEach((ptype, idx) => {
						url.searchParams.append(`property_type[${idx}]`, ptype);
					});
				}
// 				if (requestBody.town) {
// 					// Ensure it's an array
// 					const towns = Array.isArray(requestBody.town)
// 						? requestBody.town
// 						: [requestBody.town]; // wrap single value in an array

// 					towns.forEach((town, index) => {
// 						// append as town[0], town[1], etc.
// 						url.searchParams.append(`town[${index}]`, town);
// 					});
// 				}

				
			if (requestBody.min_built_area > 0) url.searchParams.set('min_built_area', requestBody.min_built_area);
			if (requestBody.max_built_area > 0) url.searchParams.set('max_built_area', requestBody.max_built_area);
			if (requestBody.min_completion_date) url.searchParams.set('min_completion_date', requestBody.min_completion_date);
			if (requestBody.max_completion_date) url.searchParams.set('max_completion_date', requestBody.max_completion_date);
			if (requestBody.development_name) url.searchParams.set('development_name', requestBody.development_name);
			
			// Додаємо rent_type для rent проектів
			if (requestBody.rent_type) {
				url.searchParams.set('rent_type', requestBody.rent_type);
			}

			const response = await fetch(url.toString(), {
					method: "GET",
					headers: { "Content-Type": "application/json" }
				});

				if (!response.ok) {
					throw new Error(`HTTP error! status: ${response.status} - ${await response.text()}`);
				}

			const responseData = await response.json();
			
			// /properties endpoint повертає об'єкт з items, а /properties-map повертає масив
			if (visible === 'Rent' && responseData.items) {
				projectsData = responseData.items;
			} else if (Array.isArray(responseData)) {
				projectsData = responseData;
			} else {
				projectsData = [];
			}
			
			window.projectsData = projectsData; // Update global variable

		} catch (error) {
			console.error("Error loading projects from Xano API:", error);
			projectsData = [];
			} finally {
				loader.classList.remove("active");

				if (projectsData) {
					console.log("Projects data received:", projectsData);
					
					// Update projects with correct coordinates for zero-coordinate projects
					updateProjectsWithNewCoordinates(projectsData);
					
					const geojsonData = convertProjectsToGeoJSON({ items: projectsData });
                    
                    // ЗАВЖДИ оновлюємо нашу "майстер-копію" даних
                    allProjectsGeoJSON = geojsonData;

					const source = map.getSource('projects');
					if (source) {
                        // Перевіряємо, чи намальований полігон.
                        // Якщо так, то ми повинні застосувати фільтрацію полігоном до нових даних.
                        // Якщо ні, просто показуємо всі завантажені дані.
                        const features = draw.getAll().features;
                        if (features.length > 0 && features[0].geometry.type === 'Polygon') {
                            filterProjectsByPolygon(features[0]); // Перефільтровуємо нові дані
                        } else {
                            source.setData(allProjectsGeoJSON); // Встановлюємо нові дані
                        }
                        
                        console.log("Map source updated.");
					} else {
						console.error("Map source 'projects' not found");
					}
				}

				// Викликаємо ваші існуючі функції оновлення UI
				populateSearchDropdownMap(projectsData || []);
				renderFiltersFromQueryMap();
				renderValueFilterFromQueryMapMobile();
				updateFilterButtonStateMap();
			}
		}

                fetchProjectsData();
                window.addEventListener("popstate", () => {
                    console.log("⚠️ POPSTATE EVENT! URL змінився:", window.location.href);
                    fetchProjectsData();
                });

                // 				function updateProjectsWithNewCoordinates(projects) {
                // 					projects && projects[0].forEach(project => {
                // 						const matchingArea = subAreasWithLocations.find(area => area.value === project.province);
                // 						if (matchingArea) {
                // 							project.coordinates.latitude = matchingArea.locations.lat;
                // 							project.coordinates.longitude = matchingArea.locations.lng;
                // 						}
                // 					});
                // 				}

                function updateProjectsWithNewCoordinates(projects) {
                    if (!projects || projects.length === 0) return;

                    console.log(`Processing ${projects.length} projects for coordinate updates`);
                    const maxProjectsPerPoint = 100;
                    const clusterOffsetDistance = 0.0015;

                    let updatedCount = 0;
                    projects.forEach(project => {
                        // Initialize coordinates object if it doesn't exist
                        if (!project.coordinates) {
                            project.coordinates = {};
                        }
                        
                        const townName = project.town || project.province;
                        if (townName) {
                            const matchingArea = subAreasWithLocations.find(area => area.oldValue === townName);
                            if (matchingArea) {
                                project.coordinates.latitude = matchingArea.locations.lat;
                                project.coordinates.longitude = matchingArea.locations.lng;
                                updatedCount++;
                            }
                        }
                    });
                    console.log(`Updated coordinates for ${updatedCount} projects`);

                    const coordinatesMap = new Map();

                    projects.forEach(project => {
                        const key = `${project.coordinates.latitude},${project.coordinates.longitude}`;
                        if (!coordinatesMap.has(key)) {
                            coordinatesMap.set(key, []);
                        }
                        coordinatesMap.get(key).push(project);
                    });

                    coordinatesMap.forEach((projectGroup, key) => {
                        if (projectGroup.length > maxProjectsPerPoint) {
                            const baseCoordinates = key.split(',').map(Number);
                            const baseLatitude = baseCoordinates[0];
                            const baseLongitude = baseCoordinates[1];

                            projectGroup.forEach((project, index) => {
                                const clusterIndex = Math.floor(index / maxProjectsPerPoint);
                                const angle = (clusterIndex * 30) * (Math.PI / 180);
                                const latitudeOffset = clusterOffsetDistance * Math.cos(angle);
                                const longitudeOffset = clusterOffsetDistance * Math.sin(angle);

                                project.coordinates.latitude = baseLatitude + latitudeOffset;
                                project.coordinates.longitude = baseLongitude + longitudeOffset;
                            });
                        }
                    });
                }

                				// Добавляем CSS Swiper
				const swiperStyles = document.createElement('link');
				swiperStyles.rel = 'stylesheet';
				swiperStyles.href = 'https://unpkg.com/swiper/swiper-bundle.min.css';
				document.head.appendChild(swiperStyles);

				// Add custom CSS for multi-project popup
				const customStyles = document.createElement('style');
				customStyles.textContent = `
					.projects-scroll-container::-webkit-scrollbar {
						width: 6px;
					}
					.projects-scroll-container::-webkit-scrollbar-track {
						background: #f1f1f1;
						border-radius: 3px;
					}
					.projects-scroll-container::-webkit-scrollbar-thumb {
						background: #c1c1c1;
						border-radius: 3px;
					}
					.projects-scroll-container::-webkit-scrollbar-thumb:hover {
						background: #a8a8a8;
					}
					.project-item:hover {
						background-color: #f8f8f8;
					}
					.project-item:last-child {
						border-bottom: none !important;
					}
					.popup-close-btn:hover {
						color: #333 !important;
						background-color: #f0f0f0 !important;
						border-radius: 50% !important;
					}
				`;
				document.head.appendChild(customStyles);

                // Добавляем JS Swiper
                const swiperScript = document.createElement('script');
                swiperScript.src = 'https://unpkg.com/swiper/swiper-bundle.min.js';
                swiperScript.onload = () => {
                    console.log('Swiper loaded');
                    // Здесь можно инициализировать слайдер, если требуется
                };
                document.body.appendChild(swiperScript);

					  // ВСТАВИТИ ЦЕЙ БЛОК КОДУ
			// =================================================================
			// --- Секція 2: ЛОГІКА КАРТИ MAPBOX ---
				let map;
				let draw;
				const projectIdsInPolygon = [];
				let polygonDrawn = false;
let allProjectsGeoJSON = null;
				
				// Змінні для полігонів районів
				let neighborhoodsVisible = false;
				let neighborhoodsLoaded = false; 
				function initializeMap() {
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWJpZXNwYW5hIiwiYSI6ImNsb3N4NzllYzAyOWYybWw5ZzNpNXlqaHkifQ.UxlTvUuSq9L5jt0jRtRR-A';
    map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-4.8898, 36.5101],
        zoom: 9,
        maxZoom: 18,
        minZoom: 5,
        scrollZoom: true
    });

    draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {},
        userProperties: true
    });
    map.addControl(draw);
    const drawControls = document.querySelector('.mapboxgl-ctrl-group');
    if (drawControls) drawControls.style.display = 'none';

    // === ПРАВИЛЬНА ПРИВ'ЯЗКА ПОДІЙ ===
    map.on('load', onMapLoad);
    map.on('draw.create', onDrawCreate); // Викликає нашу правильну функцію
    map.on('draw.delete', (e) => {
        console.log("🎯 ПОДІЯ 'draw.delete' ТРИГЕРНУТА!");
        console.log("   - Видалено об'єктів:", e.features.length);
        onDrawDelete(e);
    }); // Викликає нашу правильну функцію
    // ===================================

    // Touch and click events for markers
    // Using both click and touchend for better cross-device compatibility
    map.on('click', 'unclustered-point', onMarkerClick);
    map.on('touchend', 'unclustered-point', (e) => {
        // On mobile, touchend works better than touchstart for preventing conflicts
        onMarkerClick(e);
    });
    map.on('mouseenter', 'unclustered-point', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'unclustered-point', () => { map.getCanvas().style.cursor = ''; });
    
    // Touch and click events for clusters
    const handleClusterClick = (e) => {
        const features = map.queryRenderedFeatures(e.point, { layers: ['clusters'] });
        if (!features || !features.length) return;
        const clusterId = features[0].properties.cluster_id;
        map.getSource('projects').getClusterExpansionZoom(clusterId, (err, zoom) => {
            if (err) return;
            map.easeTo({ center: features[0].geometry.coordinates, zoom: zoom });
        });
    };
    
    map.on('click', 'clusters', handleClusterClick);
    map.on('touchend', 'clusters', handleClusterClick);
    map.on('mouseenter', 'clusters', () => { map.getCanvas().style.cursor = 'pointer'; });
    map.on('mouseleave', 'clusters', () => { map.getCanvas().style.cursor = ''; });

    // Підключаємо кнопки
    document.getElementById('zoom-in').addEventListener('click', () => map.zoomIn());
    document.getElementById('zoom-out').addEventListener('click', () => map.zoomOut());
    
    // Кнопка малювання - з очищенням та анімацією
    const drawButton = document.getElementById('draw');
    drawButton.addEventListener('click', () => {
        draw.deleteAll(); 
        draw.changeMode('draw_polygon');
        
        // Додаємо клас "drawing" для анімації
        drawButton.classList.add('drawing');
        drawButton.querySelector('span').textContent = 'Drawing...';
    });

    // Кнопка кошика - НАПРЯМУ викликаємо onDrawDelete()
    document.getElementById('trash').addEventListener('click', () => {
        console.log("🖱️ КНОПКА TRASH НАТИСНУТА!");
        console.log("   - draw об'єкт існує:", !!draw);
        console.log("   - Поточна кількість полігонів:", draw.getAll().features.length);
        
        // ✅ ВИПРАВЛЕННЯ: Викликаємо onDrawDelete() НАПРЯМУ
        draw.deleteAll();
        console.log("   - draw.deleteAll() викликано");
        
        // Викликаємо onDrawDelete() напряму, не чекаючи події
        console.log("   🔧 Викликаємо onDrawDelete() напряму...");
        onDrawDelete();
    });
    
    // Кнопка показу/приховання полігонів районів
    document.getElementById('toggleNeighborhoods').addEventListener('click', () => {
        console.log("🏘️ КНОПКА NEIGHBORHOODS НАТИСНУТА!");
        toggleNeighborhoods();
    });
    
    // Кнопка закриття модалки з проектами полігону
    const closePolygonListBtn = document.getElementById('closePolygonList');
    if (closePolygonListBtn) {
        closePolygonListBtn.addEventListener('click', () => {
            hidePolygonProjectsList();
        });
    }
    
    // Закриття модалки при кліку на backdrop (тільки на мобільних)
    const polygonProjectsListModal = document.getElementById('polygonProjectsList');
    if (polygonProjectsListModal && window.innerWidth <= 768) {
        polygonProjectsListModal.addEventListener('click', (e) => {
            // Закриваємо тільки якщо клікнули саме на backdrop (::before псевдоелемент)
            if (e.target === polygonProjectsListModal) {
                hidePolygonProjectsList();
            }
        });
    }
}

				function onMapLoad() {
					map.addSource('projects', {
						type: 'geojson',
						data: { type: 'FeatureCollection', features: [] },
						cluster: true,
						clusterMaxZoom: 16,
						clusterRadius: 30
					});
					map.addLayer({
						id: 'clusters', type: 'circle', source: 'projects', filter: ['has', 'point_count'],
						paint: { 'circle-color': '#313131', 'circle-radius': ['step', ['get', 'point_count'], 25, 50, 35, 200, 45, 500, 55], 'circle-stroke-width': 3, 'circle-stroke-color': '#fff', 'circle-opacity': 1 }
					});
					map.addLayer({
						id: 'cluster-count', type: 'symbol', source: 'projects', filter: ['has', 'point_count'],
						layout: { 'text-field': '{point_count_abbreviated}', 'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'], 'text-size': 16 },
						paint: { 'text-color': '#ffffff' }
					});
					map.addLayer({
						id: 'unclustered-point', type: 'circle', source: 'projects', filter: ['!', ['has', 'point_count']],
						paint: { 'circle-color': '#313131', 'circle-radius': 8, 'circle-stroke-width': 2, 'circle-stroke-color': '#fff' }
					});
					
					// Add click events for markers
					map.on('click', 'unclustered-point', onMarkerClick);
					map.on('mouseenter', 'unclustered-point', () => { map.getCanvas().style.cursor = 'pointer'; });
					map.on('mouseleave', 'unclustered-point', () => { map.getCanvas().style.cursor = ''; });
					
					// Ініціалізація полігонів районів
					initNeighborhoodLayers();
					
					fetchProjectsData();
					
					// Initialize polygon from URL after map is loaded
					setTimeout(() => {
						initializePolygonFromUrl();
					}, 1000); // Small delay to ensure data is loaded
				}
				
				// =================================================================
				// --- ФУНКЦІЇ ДЛЯ РОБОТИ З ПОЛІГОНАМИ РАЙОНІВ ---
				// =================================================================
				
				/**
				 * Ініціалізація шарів для полігонів районів
				 */
				function initNeighborhoodLayers() {
					console.log('🏘️ Ініціалізація шарів полігонів районів...');
					
					// Додаємо джерела даних для кожного рівня
					map.addSource('neighborhoods-level-1', {
						type: 'geojson',
						data: { type: 'FeatureCollection', features: [] }
					});
					
					map.addSource('neighborhoods-level-2', {
						type: 'geojson',
						data: { type: 'FeatureCollection', features: [] }
					});
					
					map.addSource('neighborhoods-level-3', {
						type: 'geojson',
						data: { type: 'FeatureCollection', features: [] }
					});
					
					// Шар для Рівня 1 (Costa del Sol - загальний регіон)
					map.addLayer({
						id: 'neighborhoods-fill-1',
						type: 'fill',
						source: 'neighborhoods-level-1',
						layout: { visibility: 'none' },
						paint: {
							'fill-color': '#088',
							'fill-opacity': 0.1
						}
					});
					
					map.addLayer({
						id: 'neighborhoods-outline-1',
						type: 'line',
						source: 'neighborhoods-level-1',
						layout: { visibility: 'none' },
						paint: {
							'line-color': '#088',
							'line-width': 3,
							'line-opacity': 0.6
						}
					});
					
					// Шар для Рівня 2 (Міста)
					map.addLayer({
						id: 'neighborhoods-fill-2',
						type: 'fill',
						source: 'neighborhoods-level-2',
						layout: { visibility: 'none' },
						paint: {
							'fill-color': '#4a90e2',
							'fill-opacity': 0.15
						}
					});
					
					map.addLayer({
						id: 'neighborhoods-outline-2',
						type: 'line',
						source: 'neighborhoods-level-2',
						layout: { visibility: 'none' },
						paint: {
							'line-color': '#4a90e2',
							'line-width': 2,
							'line-opacity': 0.7
						}
					});
					
					map.addLayer({
						id: 'neighborhoods-labels-2',
						type: 'symbol',
						source: 'neighborhoods-level-2',
						layout: {
							visibility: 'none',
							'text-field': ['get', 'name'],
							'text-font': ['Open Sans Bold', 'Arial Unicode MS Bold'],
							'text-size': 14,
							'text-anchor': 'center'
						},
						paint: {
							'text-color': '#2c5aa0',
							'text-halo-color': '#ffffff',
							'text-halo-width': 2
						}
					});
					
					// Шар для Рівня 3 (Райони)
					map.addLayer({
						id: 'neighborhoods-fill-3',
						type: 'fill',
						source: 'neighborhoods-level-3',
						layout: { visibility: 'none' },
						paint: {
							'fill-color': '#ff6b6b',
							'fill-opacity': [
								'case',
								['boolean', ['feature-state', 'hover'], false],
								0.3,
								0.1
							]
						}
					});
					
					map.addLayer({
						id: 'neighborhoods-outline-3',
						type: 'line',
						source: 'neighborhoods-level-3',
						layout: { visibility: 'none' },
						paint: {
							'line-color': '#ff6b6b',
							'line-width': 1.5,
							'line-opacity': 0.8
						}
					});
					
					map.addLayer({
						id: 'neighborhoods-labels-3',
						type: 'symbol',
						source: 'neighborhoods-level-3',
						layout: {
							visibility: 'none',
							'text-field': ['get', 'name'],
							'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
							'text-size': 12,
							'text-anchor': 'center'
						},
						paint: {
							'text-color': '#c92a2a',
							'text-halo-color': '#ffffff',
							'text-halo-width': 1.5
						}
					});
					
					// Додаємо інтерактивність (hover)
					let hoveredNeighborhoodId = null;
					
					map.on('mouseenter', 'neighborhoods-fill-3', (e) => {
						map.getCanvas().style.cursor = 'pointer';
						if (e.features.length > 0) {
							if (hoveredNeighborhoodId !== null) {
								map.setFeatureState(
									{ source: 'neighborhoods-level-3', id: hoveredNeighborhoodId },
									{ hover: false }
								);
							}
							hoveredNeighborhoodId = e.features[0].id;
							map.setFeatureState(
								{ source: 'neighborhoods-level-3', id: hoveredNeighborhoodId },
								{ hover: true }
							);
						}
					});
					
					map.on('mouseleave', 'neighborhoods-fill-3', () => {
						map.getCanvas().style.cursor = '';
						if (hoveredNeighborhoodId !== null) {
							map.setFeatureState(
								{ source: 'neighborhoods-level-3', id: hoveredNeighborhoodId },
								{ hover: false }
							);
						}
						hoveredNeighborhoodId = null;
					});
					
					// Клік на район
					map.on('click', 'neighborhoods-fill-3', (e) => {
						if (e.features.length > 0) {
							const neighborhood = e.features[0];
							const name = neighborhood.properties.name;
							const parent = neighborhood.properties.parent;
							
							console.log('🏘️ Клік на район:', name, '(', parent, ')');
							
							// TODO: Додати фільтрацію проектів по району
							// filterProjectsByNeighborhood(name, parent);
						}
					});
					
					console.log('✅ Шари полігонів ініціалізовано');
				}
				
				/**
				 * Завантаження GeoJSON даних для полігонів
				 */
				async function loadNeighborhoodPolygons() {
					if (neighborhoodsLoaded) {
						console.log('✅ Полігони вже завантажені');
						return;
					}
					
					console.log('📥 Завантаження GeoJSON полігонів...');
					
					const themeUri = '<?php echo get_template_directory_uri(); ?>';
					
					try {
						// Завантажуємо всі 3 рівні
						const [level1, level2, level3] = await Promise.all([
							fetch(`${themeUri}/data/geojson/level-1-region.geojson`).then(r => r.json()),
							fetch(`${themeUri}/data/geojson/level-2-cities.geojson`).then(r => r.json()),
							fetch(`${themeUri}/data/geojson/level-3-neighborhoods.geojson`).then(r => r.json())
						]);
						
						console.log('✅ Завантажено полігонів:', {
							level1: level1.features.length,
							level2: level2.features.length,
							level3: level3.features.length
						});
						
						// Оновлюємо джерела даних
						map.getSource('neighborhoods-level-1').setData(level1);
						map.getSource('neighborhoods-level-2').setData(level2);
						map.getSource('neighborhoods-level-3').setData(level3);
						
						neighborhoodsLoaded = true;
						
					} catch (error) {
						console.error('❌ Помилка завантаження полігонів:', error);
					}
				}
				
				/**
				 * Показати/приховати полігони районів
				 */
				function toggleNeighborhoods() {
					const button = document.getElementById('toggleNeighborhoods');
					
					if (!neighborhoodsLoaded) {
						// Якщо ще не завантажені - завантажуємо
						button.disabled = true;
						button.style.opacity = '0.6';
						
						loadNeighborhoodPolygons().then(() => {
							button.disabled = false;
							button.style.opacity = '1';
							showNeighborhoods();
						});
					} else {
						// Якщо вже завантажені - просто перемикаємо видимість
						if (neighborhoodsVisible) {
							hideNeighborhoods();
						} else {
							showNeighborhoods();
						}
					}
				}
				
				/**
				 * Показати полігони
				 */
				function showNeighborhoods() {
					console.log('👁️ Показуємо полігони районів');
					
					const currentZoom = map.getZoom();
					
					// Рівень 1 (Costa del Sol) - видно завжди при малому zoom
					if (currentZoom < 11) {
						map.setLayoutProperty('neighborhoods-fill-1', 'visibility', 'visible');
						map.setLayoutProperty('neighborhoods-outline-1', 'visibility', 'visible');
					}
					
					// Рівень 2 (Міста) - видно від zoom 9
					if (currentZoom >= 9) {
						map.setLayoutProperty('neighborhoods-fill-2', 'visibility', 'visible');
						map.setLayoutProperty('neighborhoods-outline-2', 'visibility', 'visible');
						map.setLayoutProperty('neighborhoods-labels-2', 'visibility', 'visible');
					}
					
					// Рівень 3 (Райони) - видно від zoom 11
					if (currentZoom >= 11) {
						map.setLayoutProperty('neighborhoods-fill-3', 'visibility', 'visible');
						map.setLayoutProperty('neighborhoods-outline-3', 'visibility', 'visible');
						map.setLayoutProperty('neighborhoods-labels-3', 'visibility', 'visible');
					}
					
					neighborhoodsVisible = true;
					
					// Оновлюємо вигляд кнопки
					const button = document.getElementById('toggleNeighborhoods');
					button.classList.add('active');
					button.style.backgroundColor = '#4a90e2';
					button.style.color = '#ffffff';
					
					// Додаємо слухач зміни zoom для автоматичного перемикання рівнів
					map.on('zoom', updateNeighborhoodVisibilityByZoom);
				}
				
				/**
				 * Приховати полігони
				 */
				function hideNeighborhoods() {
					console.log('🙈 Приховуємо полігони районів');
					
					// Приховуємо всі рівні
					['1', '2', '3'].forEach(level => {
						map.setLayoutProperty(`neighborhoods-fill-${level}`, 'visibility', 'none');
						map.setLayoutProperty(`neighborhoods-outline-${level}`, 'visibility', 'none');
						if (level !== '1') {
							map.setLayoutProperty(`neighborhoods-labels-${level}`, 'visibility', 'none');
						}
					});
					
					neighborhoodsVisible = false;
					
					// Оновлюємо вигляд кнопки
					const button = document.getElementById('toggleNeighborhoods');
					button.classList.remove('active');
					button.style.backgroundColor = '';
					button.style.color = '';
					
					// Видаляємо слухач zoom
					map.off('zoom', updateNeighborhoodVisibilityByZoom);
				}
				
				/**
				 * Оновлення видимості шарів залежно від zoom
				 */
				function updateNeighborhoodVisibilityByZoom() {
					if (!neighborhoodsVisible) return;
					
					const currentZoom = map.getZoom();
					
					// Рівень 1 (Costa del Sol) - тільки при малому zoom
					if (currentZoom < 11) {
						map.setLayoutProperty('neighborhoods-fill-1', 'visibility', 'visible');
						map.setLayoutProperty('neighborhoods-outline-1', 'visibility', 'visible');
					} else {
						map.setLayoutProperty('neighborhoods-fill-1', 'visibility', 'none');
						map.setLayoutProperty('neighborhoods-outline-1', 'visibility', 'none');
					}
					
					// Рівень 2 (Міста) - від zoom 9
					if (currentZoom >= 9 && currentZoom < 13) {
						map.setLayoutProperty('neighborhoods-fill-2', 'visibility', 'visible');
						map.setLayoutProperty('neighborhoods-outline-2', 'visibility', 'visible');
						map.setLayoutProperty('neighborhoods-labels-2', 'visibility', 'visible');
					} else if (currentZoom < 9) {
						map.setLayoutProperty('neighborhoods-fill-2', 'visibility', 'none');
						map.setLayoutProperty('neighborhoods-outline-2', 'visibility', 'none');
						map.setLayoutProperty('neighborhoods-labels-2', 'visibility', 'none');
					} else {
						// При великому zoom залишаємо тільки outline міст
						map.setLayoutProperty('neighborhoods-fill-2', 'visibility', 'none');
						map.setLayoutProperty('neighborhoods-outline-2', 'visibility', 'visible');
						map.setLayoutProperty('neighborhoods-labels-2', 'visibility', 'none');
					}
					
					// Рівень 3 (Райони) - від zoom 11
					if (currentZoom >= 11) {
						map.setLayoutProperty('neighborhoods-fill-3', 'visibility', 'visible');
						map.setLayoutProperty('neighborhoods-outline-3', 'visibility', 'visible');
						map.setLayoutProperty('neighborhoods-labels-3', 'visibility', 'visible');
					} else {
						map.setLayoutProperty('neighborhoods-fill-3', 'visibility', 'none');
						map.setLayoutProperty('neighborhoods-outline-3', 'visibility', 'none');
						map.setLayoutProperty('neighborhoods-labels-3', 'visibility', 'none');
					}
				}
				
				// =================================================================
				// --- КІНЕЦЬ ФУНКЦІЙ ДЛЯ ПОЛІГОНІВ РАЙОНІВ ---
				// =================================================================

				function convertProjectsToGeoJSON(apiResponse) {
					const items = (apiResponse && (apiResponse.projects || apiResponse.items)) ? (apiResponse.projects || apiResponse.items) : [];
					console.log("Converting", items.length, "projects to GeoJSON");
					
					const features = [];
					
					items.forEach(project => {
						// Debug image data
						if (project.images && project.images.length > 0) {
							console.log(`Project ${project.id} has ${project.images.length} images:`, project.images[0]);
						}
						
						let lat = parseFloat(project.latitude || (project.coordinates ? project.coordinates.latitude : null));
						let lon = parseFloat(project.longitude || (project.coordinates ? project.coordinates.longitude : null));
						
						// If coordinates are 0 or invalid, try to find coordinates by town name
						if ((lat === 0 && lon === 0) || isNaN(lat) || isNaN(lon)) {
							const townName = project.town || project.province;
							if (townName) {
								const matchingArea = subAreasWithLocations.find(area => area.oldValue === townName);
								if (matchingArea) {
									lat = parseFloat(matchingArea.locations.lat);
									lon = parseFloat(matchingArea.locations.lng);
									console.log(`Found coordinates for ${townName}: ${lat}, ${lon}`);
								} else {
									return;
								}
							} else {
								console.warn("Invalid coordinates for project and no town/province available:", project);
								return;
							}
						}

						features.push({
							type: 'Feature',
							geometry: { type: 'Point', coordinates: [lon, lat] },
							properties: {
								id: project.id || project._id,
								name: project.development_name || project.name || "Property",
								price: project.price || project.price_to || 0,
								currency: project.currency || "EUR",
								type: project.type || "Property",
								subtype: project.subtype || "",
								size: project.built_area || 0,
								images: JSON.stringify(project.images && project.images.length > 0 ? project.images : (project.image_url ? [{ image_url: project.image_url }] : [])),
								town: project.town || project.province || "",
								hasZeroCoordinates: (parseFloat(project.latitude || 0) === 0 && parseFloat(project.longitude || 0) === 0)
							}
						});
					});
					
					console.log(`Total features: ${features.length} projects`);
					
					const geojson = {
							type: 'FeatureCollection',
							features: features.filter(Boolean)
						};

						if (!allProjectsGeoJSON) { // Зберігаємо лише один раз
							allProjectsGeoJSON = JSON.parse(JSON.stringify(geojson)); // Створюємо глибоку копію
						}

						return geojson;
					}
				function onMarkerClick(e) {
					const properties = e.features[0].properties;
					// Always use the exact clicked coordinates for popup positioning
					const clickedCoordinates = e.features[0].geometry.coordinates.slice();
					let coordinates = clickedCoordinates;
					
					// Only use subAreasWithLocations coordinates for finding projects, not for popup positioning
					const matchingLocation = subAreasWithLocations.find(area => 
						area.oldValue === properties.town || area.newValue === properties.town
					);
					
					const defaultImage = 'https://pro-part.es/wp-content/themes/propart-spain/icons/shared/logo1.png';
					const visible = new URLSearchParams(window.location.search).get('visible') || 'Off plan';

					// Check if there are multiple projects at this location (especially for zero coordinates)
					let projectsAtLocation = [];
					
					if (properties.hasZeroCoordinates && window.projectsData) {
						// Find all projects with the same town that have zero coordinates
						projectsAtLocation = window.projectsData.filter(project => {
							const projectLat = parseFloat(project.latitude || 0);
							const projectLng = parseFloat(project.longitude || 0);
							const isZeroCoords = projectLat === 0 && projectLng === 0;
							const sameTown = project.town === properties.town || project.province === properties.town;
							return isZeroCoords && sameTown;
						});
						console.log(`Found ${projectsAtLocation.length} projects with zero coordinates in ${properties.town}`);
					} else if (window.projectsData) {
						// For non-zero coordinates, find projects with exact same coordinates
						// Use the clicked coordinates for comparison
						const clickedLat = clickedCoordinates[1];
						const clickedLng = clickedCoordinates[0];
						projectsAtLocation = window.projectsData.filter(project => {
							const projectLat = parseFloat(project.latitude || (project.coordinates ? project.coordinates.latitude : 0));
							const projectLng = parseFloat(project.longitude || (project.coordinates ? project.coordinates.longitude : 0));
							return Math.abs(projectLat - clickedLat) < 0.0001 && Math.abs(projectLng - clickedLng) < 0.0001;
						});
						console.log(`Found ${projectsAtLocation.length} projects at clicked coordinates ${clickedLat}, ${clickedLng}`);
					}

					// If multiple projects at this location, show scrollable popup
					if (projectsAtLocation.length > 1) {
						const locationName = properties.town || properties.name || "Multiple Projects";
						
						const projectsList = projectsAtLocation.map(project => {
							// Safely parse images with error handling
							let images = [];
							try {
								images = JSON.parse(project.images ? JSON.stringify(project.images) : '[]');
								if (!Array.isArray(images)) {
									images = project.image_url ? [{ image_url: project.image_url }] : [];
								}
							} catch (error) {
								images = project.image_url ? [{ image_url: project.image_url }] : [];
							}

							const projectImage = project.image_url || defaultImage;
							const projectName = project.development_name || project.name || `Property in ${project.town}`;
							const projectPrice = project.price || project.price_to || 0;
							const projectCurrency = project.currency || "EUR";
							const projectType = project.type || "Property";
							const projectSubtype = project.subtype || "";
							const projectSize = project.built_area || 0;
							const projectId = project.id || project._id;

							return `
								<div class="project-item" style="display: flex; gap: 12px; padding: 12px; border-bottom: 1px solid #eee; align-items: center;">
									<div style="flex-shrink: 0; width: 60px; height: 60px; border-radius: 8px; overflow: hidden;">
										<img src="${projectImage}" alt="${projectName}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='${defaultImage}'" />
									</div>
									<div style="flex: 1; min-width: 0;">
										<h3 style="font-size: 14px; font-weight: bold; margin: 0 0 4px 0; color: #333; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${projectName}</h3>
										<div style="display: flex; align-items: center; gap: 6px; font-size: 11px; color: #666; margin-bottom: 6px;">
											<span>${projectType}</span>
											${projectSubtype ? '<div style="width: 1px; height: 10px; background-color: #ccc;"></div>' : ''}
											<span>${projectSubtype}</span>
											${projectSize ? '<div style="width: 1px; height: 10px; background-color: #ccc;"></div>' : ''}
											<span>${projectSize ? `${projectSize} m²` : ''}</span>
										</div>
										<div style="display: flex; justify-content: space-between; align-items: center;">
											<span style="font-size: 12px; font-weight: bold; color: #333;">${projectCurrency} ${Number(projectPrice).toLocaleString('de-DE')}</span>
											<button class="mapPopupBtnRedirect" data-id="${projectId}" style="background-color: #333333; color: white; border: none; padding: 6px 10px; border-radius: 4px; cursor: pointer; font-size: 11px;">View</button>
										</div>
									</div>
								</div>
							`;
						}).join('');

						const multiProjectPopupContent = `
							<div class="mapPopup" style="max-width: 400px; max-height: 500px;">
								<div style="padding: 16px; position: relative;">
									<button class="popup-close-btn" style="position: absolute; top: 8px; right: 8px; background: none; border: none; font-size: 18px; cursor: pointer; color: #666; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center;">×</button>
									<h2 style="font-size: 18px; font-weight: bold; color: #333; text-align: left; padding-right: 20px;">${locationName}</h2>
									<div style="font-size: 12px; color: #666; text-align: left; margin-bottom: 16px;">${projectsAtLocation.length} projects available</div>
									<div class="projects-scroll-container" style="max-height: 350px; overflow-y: auto; border: 1px solid #eee; border-radius: 8px; background: #fff;">
										${projectsList}
									</div>
								</div>
								<button class="mapPopup__close-mobile">Close</button>
							</div>`;

						const popupNode = document.createElement('div');
						popupNode.innerHTML = multiProjectPopupContent;
						
					// Add event listeners to all "View" buttons
					popupNode.querySelectorAll('.mapPopupBtnRedirect').forEach(button => {
						button.addEventListener('click', (ev) => {
							const projectId = ev.target.dataset.id;
							const urlParams = new URLSearchParams(window.location.search);
							const rentType = urlParams.get("rent_type") || "long";
							
							let redirectUrl;
							if (visible === 'Rent') {
								redirectUrl = `/rent?project=${projectId}&rent_type=${rentType}`;
							} else if (visible === 'Secondary') {
								redirectUrl = `/secondary?project=${projectId}`;
							} else {
								redirectUrl = `/new-building?project=${projectId}`;
							}
							window.open(redirectUrl, '_blank');
						});
					});

						// Add event listener for close button
						const closeBtn = popupNode.querySelector('.popup-close-btn');
						if (closeBtn) {
							closeBtn.addEventListener('click', () => {
								// Find and remove the popup
								const popup = document.querySelector('.mapboxgl-popup');
								if (popup) {
									popup.remove();
								}
							});
						}
						
						// Add event listener for mobile close button
						const mobileCloseBtn = popupNode.querySelector('.mapPopup__close-mobile');
						if (mobileCloseBtn) {
							mobileCloseBtn.addEventListener('click', (ev) => {
								ev.stopPropagation();
								const popup = document.querySelector('.mapboxgl-popup');
								if (popup) {
									popup.remove();
								}
							});
						}

					console.log(`Opening multi-project popup at clicked coordinates: ${clickedCoordinates[0]}, ${clickedCoordinates[1]}`);
					
					// Визначаємо чи це мобільний пристрій
					const isMobile = window.innerWidth <= 768;
					
					// На мобільних центруємо карту на точці, щоб popup з'явився посередині
					if (isMobile) {
						map.easeTo({
							center: clickedCoordinates,
							duration: 300
						});
						
						// Чекаємо завершення анімації
						setTimeout(() => {
							const mapCenter = map.getCenter();
							const popupOptions = {
								closeButton: false,
								className: 'project-popup',
								anchor: 'bottom',
								offset: [0, -10]
							};
							
							new mapboxgl.Popup(popupOptions)
								.setLngLat([mapCenter.lng, mapCenter.lat])
								.setDOMContent(popupNode)
								.addTo(map);
						}, 300);
					} else {
						// Десктопна версія без змін
						const popupOptions = {
							closeButton: false,
							className: 'project-popup',
							anchor: 'left',
							offset: 15
						};
						
						new mapboxgl.Popup(popupOptions)
							.setLngLat(clickedCoordinates)
							.setDOMContent(popupNode)
							.addTo(map);
					}
					
					return;
				}

					// For single projects, show normal popup
					// Safely parse images with error handling
					let images = [];
					try {
						images = JSON.parse(properties.images || '[]');
						// Ensure images is an array
						if (!Array.isArray(images)) {
							images = [];
						}
					} catch (error) {
						console.error('Error parsing images:', error);
						images = [];
					}
					
					// For projects with valid coordinates, show normal popup
					const popupContent = `
					<div class="mapPopup" style="width: 260px;">
						<div>
							<div class="swiper-container" style="border-top-left-radius: 12px; border-top-right-radius: 12px; overflow: hidden; height: 200px; ">
								<div class="swiper-wrapper">
									${(images.length > 0 ? images.slice(0, 5) : [{ image_url: defaultImage }]).map(img => {
										const imageUrl = img.image_url || img.url || defaultImage;
										return `<div class="swiper-slide"><img class="imgMapPopup" src="${imageUrl}" alt="${properties.name}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='${defaultImage}'" /></div>`;
									}).join('')}
								</div>
							</div>
							<div class="mapPopup__texts" style="padding: 12px 16px;">
								<h2 class="mapPopup__info-title" style="font-size: 18px; font-weight: bold; margin: 0 0 8px 0; color: #333;">${properties.name}</h2>
								<div class="mapPopup__info-list" style="display: flex; align-items: center; gap: 8px; font-size: 13px; color: #666; margin-bottom: 12px;">
									<span>${properties.type || ''}</span>
									${properties.subtype ? '<div class="mapPopupLine" style="width: 1px; height: 12px; background-color: #ccc;"></div>' : ''}
									<span>${properties.subtype || ''}</span>
									${properties.size ? '<div class="mapPopupLine" style="width: 1px; height: 12px; background-color: #ccc;"></div>' : ''}
									<span>${properties.size ? `${properties.size} m²` : ''}</span>
								</div>
								<div class="mapPopup__footer" style="display: flex; justify-content: space-between; align-items: center;">
								   <span class="mapPopup__info-price">${properties.currency || '€'} ${Number(properties.price).toLocaleString('de-DE')}</span>
								   <button class="mapPopupBtnRedirect" data-id="${properties.id}" style="background-color: #333333; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">View Project</button>
								</div>
							</div>
						</div>
						<button class="mapPopup__close-mobile">Close</button>
					</div>`;

				const popupNode = document.createElement('div');
				popupNode.innerHTML = popupContent;
				popupNode.querySelector('.mapPopupBtnRedirect').addEventListener('click', (ev) => {
					 const projectId = ev.target.dataset.id;
					 const visible = new URLSearchParams(window.location.search).get('visible') || 'Off plan';
					 const urlParams = new URLSearchParams(window.location.search);
					 const rentType = urlParams.get("rent_type") || "long";
					 
					 let redirectUrl;
					 if (visible === 'Rent') {
						 redirectUrl = `/rent?project=${projectId}&rent_type=${rentType}`;
					 } else if (visible === 'Secondary') {
						 redirectUrl = `/secondary?project=${projectId}`;
					 } else {
						 redirectUrl = `/new-building?project=${projectId}`;
					 }
					 window.open(redirectUrl, '_blank');
				});
				
				// Add event listener for mobile close button
				const mobileCloseBtn = popupNode.querySelector('.mapPopup__close-mobile');
				if (mobileCloseBtn) {
					mobileCloseBtn.addEventListener('click', (ev) => {
						ev.stopPropagation();
						const popup = document.querySelector('.mapboxgl-popup');
						if (popup) {
							popup.remove();
						}
					});
				}

				console.log(`Opening single project popup at clicked coordinates: ${clickedCoordinates[0]}, ${clickedCoordinates[1]}`);
				
				// Визначаємо чи це мобільний пристрій
				const isMobile = window.innerWidth <= 768;
				
				// На мобільних центруємо карту на точці, щоб popup з'явився посередині
				if (isMobile) {
					map.easeTo({
						center: clickedCoordinates,
						duration: 300
					});
					
					// Чекаємо завершення анімації
					setTimeout(() => {
						const mapCenter = map.getCenter();
						const popupOptions = {
							closeButton: false,
							className: 'project-popup',
							anchor: 'bottom',
							offset: [0, -10]
						};
						
						new mapboxgl.Popup(popupOptions)
							.setLngLat([mapCenter.lng, mapCenter.lat])
							.setDOMContent(popupNode)
							.addTo(map);
							
						if (window.Swiper) {
							new Swiper(popupNode.querySelector('.swiper-container'), { loop: true });
						}
					}, 300);
				} else {
					// Десктопна версія без змін
					const popupOptions = {
						closeButton: false,
						className: 'project-popup',
						anchor: 'left',
						offset: 15
					};
					
					new mapboxgl.Popup(popupOptions)
						.setLngLat(clickedCoordinates)
						.setDOMContent(popupNode)
						.addTo(map);
						
					if (window.Swiper) {
						new Swiper(popupNode.querySelector('.swiper-container'), { loop: true });
					}
				}
			}

				// ВСТАВТЕ ЦЮ ВЕРСІЮ
function onDrawCreate(e) {
    const newPolygon = e.features[0];
    const allFeatures = draw.getAll();

    // Перевіряємо, чи є інші полігони, крім щойно намальованого
    if (allFeatures.features.length > 1) {
        // Створюємо масив ID всіх старих полігонів для видалення
        const oldPolygonIds = allFeatures.features
            .map(f => f.id)
            .filter(id => id !== newPolygon.id);
        
        if (oldPolygonIds.length > 0) {
            draw.delete(oldPolygonIds);
        }
    }
    
    // Продовжуємо роботу з новим полігоном
    polygonDrawn = true;
    
    // ✅ Очищаємо прапорець видалення, щоб новий полігон міг зберігатися
    sessionStorage.removeItem('polygonDeleted');
    
    // Анімації для кнопок
    const drawBtn = document.getElementById('draw');
    const trashBtn = document.getElementById('trash');
    const wrapper = document.querySelector('.wrapperMapPage__drawWrapper');
    
    // Прибираємо клас "drawing" з кнопки Draw
    if (drawBtn) {
        drawBtn.classList.remove('drawing');
        drawBtn.querySelector('span').textContent = 'Draw on map';
    }
    
    // Додаємо клас connected для з'єднуючої анімації
    if (wrapper) {
        wrapper.classList.add('connected');
        setTimeout(() => {
            wrapper.classList.remove('connected');
        }, 600);
    }
    
    // Показуємо кнопку Trash з анімацією вилізання з Draw
    if (trashBtn) {
        trashBtn.classList.add('active');
        trashBtn.classList.remove('removing');
    }
    
    updateUrlWithPolygon(newPolygon);
    filterProjectsByPolygon(newPolygon);
}
			// ВСТАВТЕ ЦЮ ВЕРСІЮ
function onDrawDelete() {
    console.log("🗑️ onDrawDelete() ВИКЛИКАНО!");
    console.log("   - polygonDrawn до:", polygonDrawn);
    console.log("   - projectIdsInPolygon до:", projectIdsInPolygon.length);
    console.log("   - URL до:", window.location.href);
    
    polygonDrawn = false;
    projectIdsInPolygon.length = 0;
    
    console.log("   - Викликаємо removePolygonFromUrl()...");
    removePolygonFromUrl();
    
    console.log("   - URL після removePolygonFromUrl():", window.location.href);

    // ✅ ВИПРАВЛЕННЯ: Замість перезавантаження даних, просто відновлюємо всі проєкти з кешу
    // Це гарантує, що ми не застосовуємо фільтр полігону знову
    const source = map.getSource('projects');
    if (source && allProjectsGeoJSON) {
        console.log("   - Відновлюємо всі проєкти з кешу. Кількість:", allProjectsGeoJSON.features?.length);
        source.setData(allProjectsGeoJSON); // Показуємо ВСІ проєкти
        console.log("   ✅ Проєкти відновлено на карті");
    } else {
        console.error("   ❌ ПОМИЛКА: source або allProjectsGeoJSON відсутні!");
        console.log("   - source:", source);
        console.log("   - allProjectsGeoJSON:", allProjectsGeoJSON);
    }

    // ✅ Очищуємо sessionStorage від збережених ID проєктів полігону
    sessionStorage.removeItem("projectIdsBase64OffPlan");
    sessionStorage.removeItem("projectIdsBase64Secondary");
    console.log("   - SessionStorage очищено");

    // Приховуємо модалку з проектами
    hidePolygonProjectsList();
    console.log("   ✅ Модалка з проектами прихована");
    
    // Анімації для кнопок
    const drawBtn = document.getElementById('draw');
    const trashBtn = document.getElementById('trash');
    
    // Скидаємо стан кнопки Draw
    if (drawBtn) {
        drawBtn.classList.remove('drawing');
        drawBtn.querySelector('span').textContent = 'Draw on map';
    }
    
    // Приховуємо кнопку Trash з анімацією зникнення
    if (trashBtn) {
        trashBtn.classList.add('removing');
        trashBtn.removeAttribute('data-count');
        
        // Видаляємо клас active після завершення анімації
        setTimeout(() => {
            trashBtn.classList.remove('active');
            trashBtn.classList.remove('removing');
        }, 400);
    }

    console.log("   - Викликаємо checkPolygon()...");
    checkPolygon(); 
    console.log("🗑️ onDrawDelete() ЗАВЕРШЕНО!");
}

					function filterProjectsByPolygon(polygon) {
    // Перевіряємо, чи є у нас дані для фільтрації
    if (!allProjectsGeoJSON) {
        console.error("Глобальна змінна allProjectsGeoJSON порожня, нічого фільтрувати.");
        return;
    }

    // Знаходимо точки з нашого актуального набору даних, які потрапляють у полігон
    const pointsWithin = turf.pointsWithinPolygon(allProjectsGeoJSON, polygon);

    // Зберігаємо ID знайдених проектів для кнопки "View List"
    projectIdsInPolygon.length = 0; 
    pointsWithin.features.forEach(feature => {
        projectIdsInPolygon.push(feature.properties.id);
    });

    // Оновлюємо джерело даних на карті лише відфільтрованими точками
    const source = map.getSource('projects');
    if (source) {
        source.setData(pointsWithin);
    }

    // Показуємо модалку з проектами
    showPolygonProjectsList(pointsWithin.features);
}

// Функція для відображення модалки з проектами
function showPolygonProjectsList(projects) {
    const modal = document.getElementById('polygonProjectsList');
    const countElement = document.getElementById('polygonProjectsCount');
    const listElement = document.getElementById('polygonProjectsListContent');
    const trashBtn = document.getElementById('trash');
    
    if (!modal || !countElement || !listElement) return;
    
    // Update projects count
    countElement.textContent = `Found projects: ${projects.length}`;
    
    // Оновлюємо badge на кнопці trash з кількістю проектів
    if (trashBtn && projects.length > 0) {
        trashBtn.setAttribute('data-count', projects.length);
    }
    
    // Clear list
    listElement.innerHTML = '';
    
    // If no projects
    if (projects.length === 0) {
        listElement.innerHTML = '<div class="mapListProjects__empty">No projects found in this area</div>';
        modal.classList.add('active');
        if (trashBtn) {
            trashBtn.setAttribute('data-count', '0');
        }
        return;
    }
    
    // Додаємо проекти в список
    projects.forEach(feature => {
        const props = feature.properties;
        const projectCard = createProjectCard(props);
        listElement.appendChild(projectCard);
    });
    
    // Показуємо модалку
    modal.classList.add('active');
}

// Функція для створення картки проекту
function createProjectCard(props) {
    const card = document.createElement('div');
    card.className = 'mapListProjects__card';
    card.style.cursor = 'pointer';
    
    // Парсимо зображення
    let images = [];
    try {
        images = JSON.parse(props.images || '[]');
        if (!Array.isArray(images)) images = [];
    } catch (e) {
        images = [];
    }
    
    const defaultImage = 'https://pro-part.es/wp-content/themes/propart-spain/icons/shared/logo1.png';
    const imageUrl = images.length > 0 ? (images[0].image_url || images[0].url || defaultImage) : defaultImage;
    
    const projectName = props.name || 'Property';
    const projectType = props.type || '';
    const projectSubtype = props.subtype || '';
    const projectSize = props.size || '';
    const projectPrice = props.price || 0;
    const projectCurrency = props.currency || 'EUR';
    const projectId = props.id;
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${projectName}" class="mapListProjects__card-img" onerror="this.src='${defaultImage}'" />
        <div class="mapListProjects__card-info">
            <div class="mapListProjects__card-infoInside">
                <h5 class="mapListProjects__card-title">${projectName}</h5>
                <div class="mapListProjects__card-amenitiesList">
                    ${projectType ? `<span class="mapListProjects__card-amenitie">${projectType}</span>` : ''}
                    ${projectSubtype ? `<span class="mapListProjects__card-amenitie">${projectSubtype}</span>` : ''}
                    ${projectSize ? `<span class="mapListProjects__card-amenitie">${projectSize} m²</span>` : ''}
                </div>
            </div>
            <span class="mapListProjects__card-price">${projectCurrency} ${Number(projectPrice).toLocaleString('de-DE')}</span>
        </div>
    `;
    
    // Додаємо обробник кліку
    card.addEventListener('click', () => {
        const visible = new URLSearchParams(window.location.search).get('visible') || 'Off plan';
        const redirectUrl = `/${visible !== 'Secondary' ? `new-building?project=${projectId}` : `secondary?project=${projectId}`}`;
        window.open(redirectUrl, '_blank');
    });
    
    return card;
}

// Функція для приховання модалки
function hidePolygonProjectsList() {
    const modal = document.getElementById('polygonProjectsList');
    if (modal) {
        modal.classList.remove('active');
    }
}

			function updateUrlWithPolygon(polygon) {
				console.log("📝 updateUrlWithPolygon() ВИКЛИКАНО!");
				console.trace("📍 Call stack:");
				const coords = polygon.geometry.coordinates[0].map(p => p.join(',')).join(';');
				const q = new URLSearchParams(window.location.search);
				q.set('polygon', coords);
				console.log("   - Додаємо параметр 'polygon' до URL");
				window.history.replaceState({}, '', `${window.location.pathname}?${q.toString()}`);
				console.log("   - URL тепер:", window.location.href);
			}

			function removePolygonFromUrl() {
				console.log("   📍 removePolygonFromUrl() почато");
				console.log("      - URL до:", window.location.href);
				
				// Зберігаємо в sessionStorage, що полігон було видалено (ПЕРШЕ!)
				sessionStorage.setItem('polygonDeleted', 'true');
				
				const q = new URLSearchParams(window.location.search);
				console.log("      - Параметр 'polygon' присутній:", q.has('polygon'));
				
				q.delete('polygon');
				console.log("      - Параметр 'polygon' видалено з URLSearchParams");
				
				// ✅ РАДИКАЛЬНЕ ВИПРАВЛЕННЯ: Форсоване очищення URL
				const newUrl = q.toString() ? `${window.location.pathname}?${q.toString()}` : window.location.pathname;
				console.log("      - Новий URL:", newUrl);
				
				// Спроба 1: history.replaceState
				window.history.replaceState({}, '', newUrl);
				console.log("      - history.replaceState() виконано #1");
				
				// Спроба 2: pushState і replaceState (агресивніше)
				window.history.pushState({}, '', newUrl);
				window.history.replaceState({}, '', newUrl);
				console.log("      - pushState + replaceState виконано #2");
				
				// Спроба 3: Через setTimeout (обхід event loop)
				setTimeout(() => {
					const currentUrl = new URL(window.location.href);
					currentUrl.searchParams.delete('polygon');
					window.history.replaceState({}, '', currentUrl.toString());
					console.log("      - history.replaceState() виконано #3 через setTimeout");
					console.log("      - URL після всіх спроб:", window.location.href);
				}, 0);
				
				// Перевіряємо через 150ms чи URL все ще правильний
				setTimeout(() => {
					console.log("      ⏱️ Перевірка URL через 150ms:", window.location.href);
					if (window.location.search.includes('polygon')) {
						console.error("      🚨 УВАГА! Параметр 'polygon' ВСЕ ЩЕ в URL після всіх спроб!");
						console.error("      💡 Спробуємо жорсткий редірект...");
						
						// Останній варіант - жорсткий редірект
						const finalUrl = new URL(window.location.href);
						finalUrl.searchParams.delete('polygon');
						window.location.href = finalUrl.toString();
					} else {
						console.log("      ✅ URL успішно очищено!");
					}
				}, 150);
				
				console.log("   ✅ removePolygonFromUrl() завершено");
			}

				// --- Ініціалізація карти та обробників ---
				initializeMap();
				
			// Initialize polygon state from URL parameters
			function initializePolygonFromUrl() {
				// ✅ ВИПРАВЛЕННЯ: Перевіряємо, чи не було полігон видалено користувачем
				const wasDeleted = sessionStorage.getItem('polygonDeleted');
				if (wasDeleted === 'true') {
					// Полігон було видалено, не відновлюємо його
					sessionStorage.removeItem('polygonDeleted');
					
					// Очищуємо URL на всяк випадок
					const q = new URLSearchParams(window.location.search);
					if (q.has('polygon')) {
						q.delete('polygon');
						const newUrl = q.toString() ? `${window.location.pathname}?${q.toString()}` : window.location.pathname;
						window.history.replaceState({}, '', newUrl);
					}
					return; // Не ініціалізуємо полігон
				}
				
				const urlParams = new URLSearchParams(window.location.search);
				const polygonCoords = urlParams.get('polygon');
				if (polygonCoords) {
					polygonDrawn = true;
					// Parse polygon coordinates and add to draw tool
					const coordinates = polygonCoords.split(';').map(coord => {
						const [lon, lat] = coord.split(',').map(Number);
						return [lon, lat];
					});
					
					if (coordinates.length >= 3) {
						const polygonFeature = {
							type: 'Feature',
							geometry: {
								type: 'Polygon',
								coordinates: [coordinates]
							}
						};
						
						// Add polygon to draw tool
							draw.add(polygonFeature);
							
							// Apply filter
							filterProjectsByPolygon(polygonFeature);
						}
					}
				}

				// Підключаємо ваші кнопки до нового інструменту малювання
			document.getElementById('zoom-in').addEventListener('click', () => map.zoomIn());
			document.getElementById('zoom-out').addEventListener('click', () => map.zoomOut());
			document.getElementById('draw').addEventListener('click', () => draw.changeMode('draw_polygon'));
			document.getElementById('trash').addEventListener('click', () => {
				console.log("🖱️ КНОПКА TRASH #2 НАТИСНУТА!");
				console.log("   - draw об'єкт існує:", !!draw);
				console.log("   - Поточна кількість полігонів:", draw.getAll().features.length);
				
				// ✅ ВИПРАВЛЕННЯ: Викликаємо onDrawDelete() НАПРЯМУ
				draw.deleteAll();
				console.log("   - draw.deleteAll() викликано");
				
				// Викликаємо onDrawDelete() напряму, не чекаючи події
				console.log("   🔧 Викликаємо onDrawDelete() напряму...");
				onDrawDelete();
			});
			// =================================================================
			// КІНЕЦЬ БЛОКУ ДЛЯ ВСТАВКИ


                function setupFilterButtonsMobile() {
                    const offPlanButton = document.getElementById("offPlanAdaptiveBtn");
                    const secondaryButton = document.getElementById("secondaryAdaptiveBtn");
                    const rentButton = document.getElementById("rentAdaptiveBtn");
                    const rentTypeMobile = document.getElementById("mapRentTypeMobile");

                    const updateVisibleFilter = (selectedValue) => {
                        const currentUrl = window.location.href.split("?")[0]; // Remove everything after the ?
                        const urlParams = new URLSearchParams(window.location.search); // Use window.location.search to get query parameters
                        urlParams.set("visible", selectedValue);
                        
                        // Якщо переключаємося на Rent, додаємо rent_type за замовчуванням
                        if (selectedValue === "Rent" && !urlParams.has("rent_type")) {
                            urlParams.set("rent_type", "long");
                        }
                        // Якщо переключаємося на Off plan або Secondary, видаляємо rent_type
                        if (selectedValue !== "Rent") {
                            urlParams.delete("rent_type");
                        }

                        window.history.replaceState(
                            {},
                            "",
                            `${currentUrl}?${urlParams}`
                        );

                        // Update button styles
                        if (selectedValue === "Off plan") {
                            offPlanButton.classList.add("active");
                            secondaryButton.classList.remove("active");
                            rentButton.classList.remove("active");
                            rentTypeMobile.style.display = "none";
                        } else if (selectedValue === "Secondary") {
                            secondaryButton.classList.add("active");
                            offPlanButton.classList.remove("active");
                            rentButton.classList.remove("active");
                            rentTypeMobile.style.display = "none";
                        } else if (selectedValue === "Rent") {
                            rentButton.classList.add("active");
                            offPlanButton.classList.remove("active");
                            secondaryButton.classList.remove("active");
                            rentTypeMobile.style.display = "block";
                        }

                        fetchProjectsData()
                            .then(() => { })
                            .catch(() => { });
                    };

                    if (offPlanButton && secondaryButton && rentButton) {
                        offPlanButton.addEventListener("click", () =>
                            updateVisibleFilter("Off plan")
                        );
                        secondaryButton.addEventListener("click", () =>
                            updateVisibleFilter("Secondary")
                        );
                        rentButton.addEventListener("click", () =>
                            updateVisibleFilter("Rent")
                        );
                    }

                    const urlParams = new URLSearchParams(window.location.search);
                    const initialValue = urlParams.get("visible");

                    offPlanButton.classList.remove("active");
                    secondaryButton.classList.remove("active");
                    rentButton.classList.remove("active");

                    if (initialValue === "Off plan") {
                        offPlanButton.classList.add("active");
                        rentTypeMobile.style.display = "none";
                    } else if (initialValue === "Secondary") {
                        secondaryButton.classList.add("active");
                        rentTypeMobile.style.display = "none";
                    } else if (initialValue === "Rent") {
                        rentButton.classList.add("active");
                        rentTypeMobile.style.display = "block";
                    }
                }
                setupFilterButtonsMobile();
                window.addEventListener("popstate", setupFilterButtonsMobile);

                function populateSearchDropdownMap(projects) {
                    const dropdownList = document.getElementById("mapDropDownList");
                    const dropdownBody = document.getElementById("mapNameBody");
                    const inputField = document.getElementById("mapFilterInputName");
                    dropdownList.innerHTML = ""; // Clear previous values

                    projects && projects?.forEach((project) => {
                        const item = document.createElement("div");
                        item.id = `dropdownItem-map-${project._id}`; // Unique ID for each item
                        item.className = "filterPropertiesWrapper__dropDown_item input";
                        item.textContent = project.name;

                        // Add click handler for each item
                        item.addEventListener("click", function () {
                            inputField.value = project.name;

                            // Update parameters in the URL
                            updateQuery("projectName", project.name);
                            dropdownList.innerHTML = ""; // Clear dropdown menu
                            dropdownBody.classList.remove("active");

                            fetchProjectsData()
                                .then(() => { })
                                .catch(() => { });
                        });

                        dropdownList.appendChild(item);
                    });

                    // Remove all previous input event handlers to prevent accumulation
                    inputField.removeEventListener("focus", openDropdownOnFocus);
                    inputField.removeEventListener("input", filterDropdownItems);

                    // Open dropdown menu on input focus
                    inputField.addEventListener("focus", openDropdownOnFocus);

                    // Open dropdown menu on text input
                    inputField.addEventListener("input", filterDropdownItems);

                    // Function to open the dropdown menu on input focus
                    function openDropdownOnFocus() {
                        if (dropdownList.childElementCount > 0) {
                            dropdownBody.classList.add("active");
                        }
                    }

                    // Function to filter dropdown menu
                    function filterDropdownItems() {
                        const inputValue = inputField.value.toLowerCase();
                        const items = dropdownList.querySelectorAll(
                            ".filterPropertiesWrapper__dropDown_item.input"
                        );

                        let hasMatches = false;

                        items.forEach((item) => {
                            if (item.textContent.toLowerCase().includes(inputValue)) {
                                item.style.display = "block";
                                hasMatches = true;
                            } else {
                                item.style.display = "none";
                            }
                        });

                        // Add active class if there are matches
                        dropdownBody.classList.toggle("active", hasMatches);

                        // Remove active class if input value is empty
                        if (inputValue === "") {
                            dropdownBody.classList.remove("active");
                        }
                    }

                    // Close dropdown menu when clicking outside the input or dropdown
                    document.addEventListener("click", function (event) {
                        const isClickInside =
                            dropdownBody.contains(event.target) || inputField.contains(event.target);
                        if (!isClickInside) {
                            dropdownBody.classList.remove("active");
                        }
                    });

                    // Function to update parameters in the URL
                    function updateQuery(key, value) {
                        const currentUrl = window.location.href.split("?")[0]; // Remove query parameters
                        const queryString = window.location.search.substring(1); // Get query string
                        const params = new URLSearchParams(queryString);

                        if (value) {
                            params.set(key, value);
                        } else {
                            params.delete(key);
                        }

                        const newQueryString = params.toString();
                        const newUrl = `${currentUrl}?${newQueryString}`; // Build new URL
                        history.replaceState(null, "", newUrl); // Update the URL in the browser
                    }
                }

                populateSearchDropdownMap();
                window.addEventListener("popstate", populateSearchDropdownMap);


                function closeAllDropdowns() {
                    document
                        .querySelectorAll(
                            ".filterPropertiesWrapper__dropDown_body.active"
                        )
                        .forEach((body) => body.classList.remove("active"));
                    document
                        .querySelectorAll(
                            ".filterPropertiesWrapper__dropDown_header.active"
                        )
                        .forEach((header) => header.classList.remove("active"));

                    // Сбрасываем стрелку SVG на всех дропдаунах
                    document
                        .querySelectorAll(
                            ".filterPropertiesWrapper__dropDown_header svg path"
                        )
                        .forEach((svgIcon) => {
                            svgIcon.setAttribute("d", "M7 10L12 14L17 10");
                        });
                }

                function mapDropDownSort() {
                    const dropdownContainer = document.getElementById(
                        "mapSortFilter"
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
                            "Price Low to High",
                            "Price High to Low",
                            "New date",
                            "Old date",
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

                            item.addEventListener("click", function (e) {
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

                                fetchProjectsData()
                                    .then(() => { })
                                    .catch(() => { });
                            });
                        });

                        dropdownHeader.addEventListener("click", function (e) {
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

                        document.addEventListener("click", function (event) {
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
                mapDropDownSort();
                window.addEventListener("hashchange", mapDropDownSort);

                function mapDropDownBeddrooms() {
                    const dropdownContainer = document.getElementById(
                        "mapBedroomsFilter"
                    );
                    
                    console.log("mapDropDownBeddrooms - dropdownContainer:", dropdownContainer);
                    
                    if (!dropdownContainer) {
                        console.error("mapBedroomsFilter element not found!");
                        return;
                    }

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

                            item.addEventListener("click", function (e) {
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
                                    bedroomsQuery.length > 0
                                        ? bedroomsQuery.join(",")
                                        : null
                                );

                                fetchProjectsData()
                                    .then(() => { })
                                    .catch(() => { });
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

                        dropdownHeader.addEventListener("click", function (e) {
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

                        document.addEventListener("click", function (event) {
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
                
                // Функція для rent type toggle (Long/Short term) - Desktop
                function setupRentTypeToggle() {
                    const longTermBtn = document.getElementById("mapRentLongTermBtn");
                    const shortTermBtn = document.getElementById("mapRentShortTermBtn");
                    
                    if (!longTermBtn || !shortTermBtn) return;
                    
                    const updateRentType = (rentType) => {
                        const urlParams = new URLSearchParams(window.location.search);
                        urlParams.set("rent_type", rentType);
                        
                        const currentUrl = window.location.href.split("?")[0];
                        window.history.replaceState({}, "", `${currentUrl}?${urlParams}`);
                        
                        // Оновлюємо кнопки
                        longTermBtn.classList.toggle("active", rentType === "long");
                        shortTermBtn.classList.toggle("active", rentType === "short");
                        
                        // Перезавантажуємо дані
                        fetchProjectsData();
                    };
                    
                    longTermBtn.addEventListener("click", () => updateRentType("long"));
                    shortTermBtn.addEventListener("click", () => updateRentType("short"));
                    
                    // Ініціалізація активного стану
                    const urlParams = new URLSearchParams(window.location.search);
                    const currentRentType = urlParams.get("rent_type") || "long";
                    longTermBtn.classList.toggle("active", currentRentType === "long");
                    shortTermBtn.classList.toggle("active", currentRentType === "short");
                }
                
                // Функція для rent type toggle (Long/Short term) - Mobile
                function setupRentTypeToggleMobile() {
                    const longTermMobileBtn = document.getElementById("rentLongTermMobileBtn");
                    const shortTermMobileBtn = document.getElementById("rentShortTermMobileBtn");
                    
                    if (!longTermMobileBtn || !shortTermMobileBtn) return;
                    
                    const updateRentTypeMobile = (rentType) => {
                        const urlParams = new URLSearchParams(window.location.search);
                        urlParams.set("rent_type", rentType);
                        
                        const currentUrl = window.location.href.split("?")[0];
                        window.history.replaceState({}, "", `${currentUrl}?${urlParams}`);
                        
                        // Оновлюємо кнопки
                        longTermMobileBtn.classList.toggle("active", rentType === "long");
                        shortTermMobileBtn.classList.toggle("active", rentType === "short");
                        
                        // Перезавантажуємо дані
                        fetchProjectsData();
                    };
                    
                    longTermMobileBtn.addEventListener("click", () => updateRentTypeMobile("long"));
                    shortTermMobileBtn.addEventListener("click", () => updateRentTypeMobile("short"));
                    
                    // Ініціалізація активного стану
                    const urlParams = new URLSearchParams(window.location.search);
                    const currentRentType = urlParams.get("rent_type") || "long";
                    longTermMobileBtn.classList.toggle("active", currentRentType === "long");
                    shortTermMobileBtn.classList.toggle("active", currentRentType === "short");
                }
                
                // Initialize dropdowns after DOM is ready
                // Єдина функція для налаштування всіх фільтрів
                function initializeAllFilters() {
                    // Ініціалізація десктопних фільтрів
                    if (typeof mapDropDownBeddrooms === 'function') mapDropDownBeddrooms();
                    if (typeof mapDropDownPrice === 'function') mapDropDownPrice();
                    if (typeof mapDropDownSize === 'function') mapDropDownSize();
                    if (typeof mapDropDownHandover === 'function') mapDropDownHandover();
                    if (typeof mapDropDownLocation === 'function') mapDropDownLocation();
                    if (typeof secondaryDropDownPropertyType === 'function') secondaryDropDownPropertyType();
                    
                    // Ініціалізація мобільних фільтрів
                    if (typeof mapDropDownBeddroomsMobile === 'function') mapDropDownBeddroomsMobile();
                    if (typeof mapDropDownPriceMobile === 'function') mapDropDownPriceMobile();
                    if (typeof mapDropDownSizeMobile === 'function') mapDropDownSizeMobile();
                    if (typeof mapDropDownHandoverMobile === 'function') mapDropDownHandoverMobile();
                    if (typeof mapDropDownLocationMobile === 'function') mapDropDownLocationMobile();

                    // Ініціалізація кнопок та інших обробників
                    if (typeof setupFilterButtons === 'function') setupFilterButtons();
                    if (typeof setupRentTypeToggle === 'function') setupRentTypeToggle();
                    if (typeof setupRentTypeToggleMobile === 'function') setupRentTypeToggleMobile();
                    if (typeof setupModalHandlers === 'function') setupModalHandlers();
                    if (typeof clearMapFilters === 'function') clearMapFilters();
                    if (typeof updateFilterButtonStateMap === 'function') updateFilterButtonStateMap();
                }
                
                // Викликаємо ініціалізацію один раз, коли DOM готовий
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', initializeAllFilters);
                } else {
                    initializeAllFilters();
                }

                // ЦЕНТРАЛІЗОВАНИЙ ОБРОБНИК POPSTATE
                window.addEventListener("popstate", () => {
                    // Просто перезавантажуємо дані згідно з новим URL.
                    // Це найпростіший і найнадійніший спосіб.
                    // Він також оновить стан UI фільтрів.
                    fetchProjectsData();
                });

                function mapDropDownPrice() {
                    const mainDropdown = document.querySelector("#mapPriceFilter");
                    
                    if (!mainDropdown) {
                        console.error("mapPriceFilter element not found!");
                        return;
                    }
                    
                    const mainHeader = mainDropdown.querySelector(".filterPropertiesWrapper__dropDown_header");
                    const mainBody = mainDropdown.querySelector(".filterPropertiesWrapper__dropDown_body");

                    const dropdownFromContainer = document.querySelector("#dropdownFrom");
                    const dropdownToContainer = document.querySelector("#dropdownTo");
                    
                    if (!mainHeader || !mainBody || !dropdownFromContainer || !dropdownToContainer) {
                        console.error("Required price dropdown elements not found!");
                        return;
                    }

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
                                checkbox.classList.toggle("active");
                                handlePriceSelection(price, isMin);
                                updateQueryParams();
                        
                        // Reload map data with new filters
                        fetchProjectsData()
                            .then(() => { })
                            .catch(() => { });
                                fetchOffPlanProjects(() => { });

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
                // mapDropDownPrice(); // Moved to initializeDropdowns
                // window.addEventListener("popstate", mapDropDownPrice); // Moved to initializeDropdowns

                function mapDropDownSize() {
                    const dropdownContainer = document.querySelector("#mapSizeFilter");
                    
                    if (!dropdownContainer) {
                        console.error("mapSizeFilter element not found!");
                        return;
                    }
                    
                    const dropdownHeader = dropdownContainer.querySelector(
                        ".filterPropertiesWrapper__dropDown_header"
                    );
                    const dropdownBody = dropdownContainer.querySelector(
                        ".filterPropertiesWrapper__dropDown_body"
                    );
                    const dropdownList = dropdownBody.querySelector(
                        ".filterPropertiesWrapper__dropDown_list"
                    );
                    
                    if (!dropdownHeader || !dropdownBody || !dropdownList) {
                        console.error("Required size dropdown elements not found!");
                        return;
                    }

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

                            sizeItem.addEventListener("click", function (e) {
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

                        fetchProjectsData()
                            .then(() => { })
                            .catch(() => { });
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

                        sizeMin = urlParams.get("minSize")
                            ? parseInt(urlParams.get("minSize"), 10)
                            : null;
                        sizeMax = urlParams.get("maxSize")
                            ? parseInt(urlParams.get("maxSize"), 10)
                            : null;

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

                        dropdownHeader.addEventListener("click", function (e) {
                            e.stopPropagation();

                            if (dropdownBody.classList.contains("active")) {
                                closeMenu();
                            } else {
                                closeAllDropdowns();
                                toggleMenu();
                            }
                        });

                        document.addEventListener("click", function (event) {
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
                // mapDropDownSize(); // Moved to initializeDropdowns
                // window.addEventListener("popstate", mapDropDownSize); // Moved to initializeDropdowns

                function mapDropDownHandover() {
                    const dropdownContainer = document.querySelector("#mapHandoverFilter");
                    
                    if (!dropdownContainer) {
                        console.error("mapHandoverFilter element not found!");
                        return;
                    }
                    
                    const dropdownHeader = dropdownContainer.querySelector(
                        ".filterPropertiesWrapper__dropDown_header"
                    );
                    const dropdownBody = dropdownContainer.querySelector(
                        ".filterPropertiesWrapper__dropDown_body"
                    );
                    const dropdownList = dropdownBody.querySelector(
                        ".filterPropertiesWrapper__dropDown_list"
                    );
                    
                    if (!dropdownHeader || !dropdownBody || !dropdownList) {
                        console.error("Required handover dropdown elements not found!");
                        return;
                    }

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

                            handoverItem.addEventListener("click", function (e) {
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

                        fetchProjectsData()
                            .then(() => { })
                            .catch(() => { });
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
                        }[quarter];
                        return `${year}-${month}-01`;
                    }

                    function compareDates(dateText1, dateText2) {
                        const [quarter1, year1] = dateText1.split(" ");
                        const [quarter2, year2] = dateText2.split(" ");
                        const month1 = { Q1: "01", Q2: "04", Q3: "07", Q4: "10" }[quarter1];
                        const month2 = { Q1: "01", Q2: "04", Q3: "07", Q4: "10" }[quarter2];

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

                        handoverMin = urlParams.get("handoverMin")
                            ? convertFromISODate(urlParams.get("handoverMin"))
                            : null;
                        handoverMax = urlParams.get("handoverMax")
                            ? convertFromISODate(urlParams.get("handoverMax"))
                            : null;

                        updateHandoversStyles();
                    }

                    function convertFromISODate(isoDate) {
                        const [year, month] = isoDate.split("-");
                        const quarter = {
                            "01": "Q1",
                            "04": "Q2",
                            "07": "Q3",
                            10: "Q4",
                        }[month];
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

                        dropdownHeader.addEventListener("click", function (e) {
                            e.stopPropagation();

                            if (dropdownBody.classList.contains("active")) {
                                closeMenu();
                            } else {
                                closeAllDropdowns();
                                toggleMenu();
                            }
                        });

                        document.addEventListener("click", function (event) {
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
                // mapDropDownHandover(); // Moved to initializeDropdowns
                // window.addEventListener("popstate", mapDropDownHandover); // Moved to initializeDropdowns
                
                // Initialize dropdown change handlers after all dropdowns are set up
                setTimeout(() => {
                    setupDropdownChangeHandlers();
                }, 100);

                // Global updateQueryParameter function
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

                // Global filter change handler system
                function setupFilterChangeHandlers() {
                    // Clear filter button handlers
                    const clearBtnMapFilter = document.getElementById("clearBtnMapFilter");
                    const clearBtnMapFilterAdaptive = document.getElementById("clearBtnMapFilterAdaptive");
                    
                    if (clearBtnMapFilter) {
                        clearBtnMapFilter.addEventListener("click", clearAllFilters);
                    }
                    if (clearBtnMapFilterAdaptive) {
                        clearBtnMapFilterAdaptive.addEventListener("click", clearAllFilters);
                    }

                    // Project name search handler
                    const mapFilterInputName = document.getElementById("mapFilterInputName");
                    if (mapFilterInputName) {
                        let searchTimeout;
                        mapFilterInputName.addEventListener("input", (e) => {
                            clearTimeout(searchTimeout);
                            searchTimeout = setTimeout(() => {
                                updateQueryParameter("projectName", e.target.value || null);
                                fetchProjectsData()
                                    .then(() => { })
                                    .catch(() => { });
                            }, 500); // Debounce search
                        });
                    }

                    // Add change handlers to all filter dropdowns
                    // setupDropdownChangeHandlers(); // Moved to after dropdown initialization
                }

                function clearAllFilters() {
                    // Clear URL parameters
                    const params = new URLSearchParams(window.location.search);
                    const visible = params.get("visible"); // Keep the visible parameter
                    
                    // Clear all filter parameters
                    const filterParams = [
                        "bedrooms", "minPrice", "maxPrice", "propertyType", "subAreas",
                        "minSize", "maxSize", "handoverMin", "handoverMax", "projectName"
                    ];
                    
                    filterParams.forEach(param => params.delete(param));
                    
                    // Update URL
                    history.replaceState(null, "", `${window.location.pathname}?${params.toString()}`);
                    
                    // Refresh filters UI
                    resetAllFilterUI();
                    
                    // Reload data
                    fetchProjectsData()
                        .then(() => { })
                        .catch(() => { });
                }

                function resetAllFilterUI() {
                    // Reset project name input
                    const mapFilterInputName = document.getElementById("mapFilterInputName");
                    if (mapFilterInputName) {
                        mapFilterInputName.value = "";
                    }

                    // Reset all checkboxes
                    document.querySelectorAll(".filterPropertiesWrapper__customCheckBox.active").forEach(checkbox => {
                        checkbox.classList.remove("active");
                    });

                    // Reset price inputs
                    const priceMin = document.querySelector("#minPriceList .filterPropertiesWrapper__dropDown_item.isPriceItem");
                    const priceMax = document.querySelector("#maxPriceList .filterPropertiesWrapper__dropDown_item.isPriceItem");
                    if (priceMin) priceMin.classList.remove("active");
                    if (priceMax) priceMax.classList.remove("active");

                    // Reset size inputs
                    document.querySelectorAll("#mapSizeFilter .filterPropertiesWrapper__dropDown_item").forEach(item => {
                        item.style.opacity = "1";
                        const checkbox = item.querySelector(".filterPropertiesWrapper__customCheckBox");
                        if (checkbox) checkbox.classList.remove("active");
                    });

                    // Reset handover inputs
                    document.querySelectorAll("#mapHandoverFilter .filterPropertiesWrapper__dropDown_item").forEach(item => {
                        item.style.opacity = "1";
                        const checkbox = item.querySelector(".filterPropertiesWrapper__customCheckBox");
                        if (checkbox) checkbox.classList.remove("active");
                    });

                    // Update filter headers
                    updateAllFilterHeaders();
                }

                function updateAllFilterHeaders() {
                    // Update price header
                    const priceHeader = document.querySelector("#mapPriceFilter .filterPropertiesWrapper__dropDown_header");
                    if (priceHeader) {
                        priceHeader.textContent = "Price";
                    }

                    // Update size header
                    const sizeHeader = document.querySelector("#mapSizeFilter .filterPropertiesWrapper__dropDown_header");
                    if (sizeHeader) {
                        sizeHeader.textContent = "Size";
                    }

                    // Update handover header
                    const handoverHeader = document.querySelector("#mapHandoverFilter .filterPropertiesWrapper__dropDown_header");
                    if (handoverHeader) {
                        handoverHeader.textContent = "Handover";
                    }

                    // Update bedrooms header
                    const bedroomsHeader = document.querySelector("#mapBedroomsFilter .filterPropertiesWrapper__dropDown_header");
                    if (bedroomsHeader) {
                        bedroomsHeader.textContent = "Bedrooms";
                    }

                    // Update property type header
                    const propertyTypeHeader = document.querySelector("#secondaryPropertyTypeFilter .filterPropertiesWrapper__dropDown_header");
                    if (propertyTypeHeader) {
                        propertyTypeHeader.textContent = "Property Type";
                    }
                }

                function setupDropdownChangeHandlers() {
                    // Add change handlers to existing dropdown functions
                    // This will be called after all dropdowns are initialized
                    
                    // Price filter change handler
                    const priceItems = document.querySelectorAll("#minPriceList .filterPropertiesWrapper__dropDown_item.isPriceItem, #maxPriceList .filterPropertiesWrapper__dropDown_item.isPriceItem");
                    priceItems.forEach(item => {
                        item.addEventListener("click", () => {
                            setTimeout(() => {
                                fetchProjectsData()
                                    .then(() => { })
                                    .catch(() => { });
                            }, 100);
                        });
                    });

                    // Size filter change handler
                    const sizeItems = document.querySelectorAll("#mapSizeFilter .filterPropertiesWrapper__dropDown_item");
                    sizeItems.forEach(item => {
                        item.addEventListener("click", () => {
                            setTimeout(() => {
                                fetchProjectsData()
                                    .then(() => { })
                                    .catch(() => { });
                            }, 100);
                        });
                    });

                    // Handover filter change handler
                    const handoverItems = document.querySelectorAll("#mapHandoverFilter .filterPropertiesWrapper__dropDown_item");
                    handoverItems.forEach(item => {
                        item.addEventListener("click", () => {
                            setTimeout(() => {
                                fetchProjectsData()
                                    .then(() => { })
                                    .catch(() => { });
                            }, 100);
                        });
                    });

                    // Bedrooms filter change handler
                    const bedroomItems = document.querySelectorAll("#mapBedroomsFilter .filterPropertiesWrapper__dropDown_item");
                    bedroomItems.forEach(item => {
                        item.addEventListener("click", () => {
                            setTimeout(() => {
                                fetchProjectsData()
                                    .then(() => { })
                                    .catch(() => { });
                            }, 100);
                        });
                    });

                    // Property type filter change handler
                    const propertyTypeItems = document.querySelectorAll("#secondaryPropertyTypeFilter .filterPropertiesWrapper__dropDown_item");
                    propertyTypeItems.forEach(item => {
                        item.addEventListener("click", () => {
                            setTimeout(() => {
                                fetchProjectsData()
                                    .then(() => { })
                                    .catch(() => { });
                            }, 100);
                        });
                    });

                    // Location filter change handler
                    const locationItems = document.querySelectorAll("#mapLocationFilter .filterPropertiesWrapper__dropDown_item.location, #mapLocationFilter .filterPropertiesWrapper__dropDown_item.selectAll");
                    locationItems.forEach(item => {
                        item.addEventListener("click", () => {
                            setTimeout(() => {
                                fetchProjectsData()
                                    .then(() => { })
                                    .catch(() => { });
                            }, 100);
                        });
                    });

                    // Mobile location filter change handler
                    const mobileLocationItems = document.querySelectorAll("#mapLocationFilterMobile .filterPropertiesWrapper__dropDown_item.location, #mapLocationFilterMobile .filterPropertiesWrapper__dropDown_item.selectAll");
                    mobileLocationItems.forEach(item => {
                        item.addEventListener("click", () => {
                            setTimeout(() => {
                                fetchProjectsData()
                                    .then(() => { })
                                    .catch(() => { });
                            }, 100);
                        });
                    });
                }

                				// Initialize filter change handlers
				setupFilterChangeHandlers();
				
				// Initialize polygon from URL parameters if present
				function initializePolygonFromUrl() {
					// ✅ ВИПРАВЛЕННЯ: Перевіряємо, чи не було полігон видалено користувачем
					const wasDeleted = sessionStorage.getItem('polygonDeleted');
					if (wasDeleted === 'true') {
						// Полігон було видалено, не відновлюємо його
						sessionStorage.removeItem('polygonDeleted');
						
						// Очищуємо URL на всяк випадок
						const q = new URLSearchParams(window.location.search);
						if (q.has('polygon')) {
							q.delete('polygon');
							const newUrl = q.toString() ? `${window.location.pathname}?${q.toString()}` : window.location.pathname;
							window.history.replaceState({}, '', newUrl);
						}
						return; // Не ініціалізуємо полігон
					}
					
					const urlParams = new URLSearchParams(window.location.search);
					const polygonCoords = urlParams.get('polygon');
					if (polygonCoords && draw) {
						polygonDrawn = true;
						// Parse polygon coordinates and add to draw tool
						const coordinates = polygonCoords.split(';').map(coord => {
							const [lon, lat] = coord.split(',').map(Number);
							return [lon, lat];
						});
						
						if (coordinates.length >= 3) {
							const polygonFeature = {
								type: 'Feature',
								geometry: {
									type: 'Polygon',
									coordinates: [coordinates]
								}
							};
							
							// Add polygon to draw tool
							draw.add(polygonFeature);
							
							// Apply filter
							filterProjectsByPolygon(polygonFeature);
						}
					}
				}

                function mapDropDownLocation() {
                    const dropdownContainer = document.querySelector("#mapLocationFilter");
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

                            selectAllItem.addEventListener("click", function (e) {
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

                                subAreaItem.addEventListener("click", function (e) {
                                    e.stopPropagation();
                                    handleSubAreaSelection(subArea.newLabel, area.subAreas);
                                });

                                subAreaList.appendChild(subAreaItem);
                            });

                            // Добавляем обработчик нажатия для главной территории
                            areaItem.addEventListener("click", function (e) {
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
                            selectedLocations.size > 0
                                ? Array.from(selectedLocations).join(",")
                                : null
                        );
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
                            selectedLocations.size > 0
                                ? Array.from(selectedLocations).join(",")
                                : null
                        );
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

                    dropdownHeader.addEventListener("click", function (e) {
                        e.stopPropagation();

                        if (dropdownBody.classList.contains("active")) {
                            closeMenu();
                        } else {
                            closeAllDropdowns();
                            toggleMenu();
                        }
                    });

                    document.addEventListener("click", function (event) {
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
                mapDropDownLocation();
                window.addEventListener("popstate", mapDropDownLocation);

                function clearMapFilters() {
                    const clearBtn = document.querySelector("#clearBtnMapFilter");
                    const clearBtnMobile = document.querySelector("#clearBtnMapFilterAdaptive");

                    if (!clearBtn) {
                        console.warn("Clear button not found!");
                        return;
                    }

                    const clearFilters = (isMobile = false) => {
                        const currentUrl = window.location.href.split("?")[0]; // Remove everything after '?'
                        const urlParams = new URLSearchParams(window.location.search); // Use search params

                        // Retain specific URL parameters
                        const visible = urlParams.get("visible");
                        const page = isMobile ? urlParams.get("page") : null;

                        const newUrlParams = new URLSearchParams();
                        if (page) newUrlParams.set("page", page);
                        if (visible) newUrlParams.set("visible", visible);

                        window.history.replaceState({}, "", `${currentUrl}?${newUrlParams}`); // Updated to remove hash

                        // Reset filter UI elements
                        resetFilterUI();

                        // Fetch projects data
                        window.location.reload();
                    };

                    const resetFilterUI = () => {
                        document.querySelectorAll(".filtersMap__select-body p").forEach((item) => {
                            item.style.opacity = "1";
                        });

                        // Remove all active checkboxes
                        document.querySelectorAll(".filterPropertiesWrapper__customCheckBox.active").forEach((checkBox) => {
                            checkBox.classList.remove("active");
                        });

                        const nameInput = document.querySelector("#offPlanFilterInputName");
                        if (nameInput) {
                            nameInput.value = "";
                        }

                        // Reset global filter variables
                        window.minPrice = null;
                        window.maxPrice = null;
                        window.minSize = null;
                        window.maxSize = null;
                        window.handoverMin = null;
                        window.handoverMax = null;
                        window.selectedBedrooms = null;
                        window.name = null;
                        window.sort = null;
                    };

                    // Event listener for desktop clear button
                    clearBtn.addEventListener("click", () => clearFilters());

                    // Event listener for mobile clear button
                    if (clearBtnMobile) {
                        clearBtnMobile.addEventListener("click", () => clearFilters(true));
                    }
                }
                clearMapFilters();
                window.addEventListener("popstate", clearMapFilters);

                function setupFilterButtons() {
                    const offPlanButton = document.getElementById("mapOffPlanVisible");
                    const secondaryButton = document.getElementById("mapSecondaryVisible");
                    const rentButton = document.getElementById("mapRentVisible");
                    const handoverDropDown = document.getElementById("mapHandoverFilter");
                    const handoverDropDownMobile = document.getElementById("mapHandoverFilterMobile");
                    const rentTypeToggle = document.getElementById("mapRentTypeToggle");

                    if (!offPlanButton || !secondaryButton || !rentButton) {
                        console.warn("Buttons for filtering projects were not found.");
                        return;
                    }

                    const updateVisibleFilter = (selectedValue) => {
                        // Update URL without the hash
                        const currentUrl = window.location.href.split("?")[0];
                        const urlParams = new URLSearchParams(window.location.search);
                        urlParams.set("visible", selectedValue);
                        
                        // Якщо переключаємося на Rent, додаємо rent_type за замовчуванням
                        if (selectedValue === "Rent" && !urlParams.has("rent_type")) {
                            urlParams.set("rent_type", "long");
                        }
                        // Якщо переключаємося на Off plan або Secondary, видаляємо rent_type
                        if (selectedValue !== "Rent") {
                            urlParams.delete("rent_type");
                        }

                        window.history.replaceState({}, "", `${currentUrl}?${urlParams}`);

                        // Update button styles
                        toggleActiveButton(selectedValue);

                        // Fetch new project data
                        fetchProjectsData()
                            .then(() => { })
                            .catch(() => {
                                console.error("Error fetching project data");
                            });
                    };

                    const toggleActiveButton = (selectedValue) => {
                        if (selectedValue === "Off plan") {
                            offPlanButton.classList.add("active");
                            secondaryButton.classList.remove("active");
                            rentButton.classList.remove("active");
                            handoverDropDown.style.display = "flex";
                            handoverDropDownMobile.style.display = "flex";
                            rentTypeToggle.style.display = "none";
                        } else if (selectedValue === "Secondary") {
                            secondaryButton.classList.add("active");
                            offPlanButton.classList.remove("active");
                            rentButton.classList.remove("active");
                            handoverDropDown.style.display = "none";
                            handoverDropDownMobile.style.display = "none";
                            rentTypeToggle.style.display = "none";
                        } else if (selectedValue === "Rent") {
                            rentButton.classList.add("active");
                            offPlanButton.classList.remove("active");
                            secondaryButton.classList.remove("active");
                            handoverDropDown.style.display = "none";
                            handoverDropDownMobile.style.display = "none";
                            rentTypeToggle.style.display = "flex";
                        }
                    };

                    // Event listeners for buttons
                    offPlanButton.addEventListener("click", () => updateVisibleFilter("Off plan"));
                    secondaryButton.addEventListener("click", () => updateVisibleFilter("Secondary"));
                    rentButton.addEventListener("click", () => updateVisibleFilter("Rent"));

                    // Initialize buttons based on the current URL
                    const urlParams = new URLSearchParams(window.location.search);
                    const initialValue = urlParams.get("visible") || "Off plan"; // Default to "Off plan" if not set

                    toggleActiveButton(initialValue);
                }
                // setupFilterButtons(); // Moved to initializeDropdowns
                // window.addEventListener("popstate", setupFilterButtons); // Moved to initializeDropdowns

                // mobile
                function setupModalHandlers() {
                    const filterButton = document.getElementById("filterMobile");
                    const filterButton2 = document.getElementById("filterMobilePhone");
                    const modalAdaptiveFilters = document.getElementById("modalAdaptiveFilters");
                    const closeButton = document.querySelector(".adapriveFilters__header-btnClose");
                    const closeButton2 = document.querySelector("#btnMapConfrimFilterAdaptive");

                    if (!filterButton || !modalAdaptiveFilters || !closeButton || !closeButton2 || !filterButton2) {
                        console.warn("Some elements are missing, please check the HTML structure.");
                        return;
                    }

                    const openModal = () => {
                        if (window.innerWidth < 1409) {
                            modalAdaptiveFilters.classList.add("active");
                            document.body.style.overflow = "hidden"; // Prevent background scroll
                        }
                    };

                    const closeModal = () => {
                        modalAdaptiveFilters.classList.remove("active");
                        document.body.style.overflow = ""; // Restore background scroll
                    };

                    filterButton.addEventListener("click", openModal);
                    filterButton2.addEventListener("click", openModal);
                    closeButton.addEventListener("click", closeModal);
                    closeButton2.addEventListener("click", closeModal);

                    // Close modal if clicking outside of it
                    modalAdaptiveFilters.addEventListener("click", (e) => {
                        if (e.target === modalAdaptiveFilters) {
                            closeModal();
                        }
                    });
                }
                setupModalHandlers();

                function mapDropDownBeddroomsMobile() {
                    const dropdownContainer = document.getElementById(
                        "mapBedroomsFilterMobile"
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

                            item.addEventListener("click", function (e) {
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
                                    bedroomsQuery.length > 0
                                        ? bedroomsQuery.join(",")
                                        : null
                                );

                                fetchProjectsData()
                                    .then(() => { })
                                    .catch(() => { });
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

                        dropdownHeader.addEventListener("click", function (e) {
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

                        document.addEventListener("click", function (event) {
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
                mapDropDownBeddroomsMobile();
                window.addEventListener("popstate", mapDropDownBeddroomsMobile);

                function mapDropDownPriceMobile() {
                    const dropdownContainer = document.querySelector("#mapPriceFilterMobile");
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

                            priceItem.addEventListener("click", function (e) {
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

                        fetchProjectsData()
                            .then(() => { })
                            .catch(() => { });
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

                        priceMin = urlParams.get("minPrice")
                            ? parseInt(urlParams.get("minPrice"), 10)
                            : null;
                        priceMax = urlParams.get("maxPrice")
                            ? parseInt(urlParams.get("maxPrice"), 10)
                            : null;

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

                        dropdownHeader.addEventListener("click", function (e) {
                            e.stopPropagation();

                            if (dropdownBody.classList.contains("active")) {
                                closeMenu();
                            } else {
                                closeAllDropdowns();
                                toggleMenu();
                            }
                        });

                        document.addEventListener("click", function (event) {
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
                mapDropDownPriceMobile();
                window.addEventListener("popstate", mapDropDownPriceMobile);



                // хукй


            function secondaryDropDownPropertyType() {
            const dropdownContainer = document.querySelector("#secondaryPropertyTypeFilter");
            
            if (!dropdownContainer) {
                console.error("secondaryPropertyTypeFilter element not found!");
                return;
            }
            // Prevent duplicate event bindings if this function runs multiple times
            if (dropdownContainer.dataset.initialized === "true") {
                return;
            }
            dropdownContainer.dataset.initialized = "true";
            
            const dropdownHeader = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_header"
            );
            const dropdownBody = dropdownContainer.querySelector(
                ".filterPropertiesWrapper__dropDown_body"
            );
            const dropdownList = dropdownBody.querySelector(
                ".filterPropertiesWrapper__dropDown_list"
            );
            
            if (!dropdownHeader || !dropdownBody || !dropdownList) {
                console.error("Required property type dropdown elements not found!");
                return;
            }

            const typeValues = [
                'Apartment',
                'Villa',
                'House',
                'Townhouse',
                'Office',
                'Plot',
            ];

            // Массив для хранения выбранных типов
            let selectedTypes = [];

            // Создание элементов списка
            function renderTypeOptions() {
                dropdownList.innerHTML = ""; // Очищаем список перед созданием

                typeValues.forEach((type) => {
                    const typeItem = document.createElement("div");
                    typeItem.className = "filterPropertiesWrapper__dropDown_item";
                    typeItem.textContent = type;

                    const checkBox = document.createElement("div");
                    checkBox.className = "filterPropertiesWrapper__customCheckBox";
                    checkBox.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="10px" height="10px">
                    <path d="M 26.980469 5.9902344 A 1.0001 1.0001 0 0 0 26.292969 6.2929688 L 11 21.585938 L 4.7070312 15.292969 A 1.0001 1.0001 0 1 0 3.2929688 16.707031 L 10.292969 23.707031 A 1.0001 1.0001 0 0 0 11.707031 23.707031 L 27.707031 7.7070312 A 1.0001 1.0001 0 0 0 26.980469 5.9902344 z" fill="white"/>
                </svg>
            `;
                    typeItem.appendChild(checkBox);
                    dropdownList.appendChild(typeItem);

                    // Добавляем обработчик клика
                    typeItem.addEventListener("click", function (e) {
                        e.stopPropagation();
                        handleTypeSelection(type);
                    });

                    // Устанавливаем активные элементы из массива выбранных
                    if (selectedTypes.includes(type)) {
                        checkBox.classList.add("active");
                    }
                });
            }

            // Обработка выбора типов
            function handleTypeSelection(type) {
                if (selectedTypes.includes(type)) {
                    // Убираем из выбранных
                    selectedTypes = selectedTypes.filter((selected) => selected !== type);
                } else {
                    // Добавляем в выбранные
                    selectedTypes.push(type);
                }

                // Обновляем стили и строку запроса
                updateTypeStyles();
                updateQueryParameter("propertyType", selectedTypes.length ? selectedTypes.join(",") : null);

                // Обновляем данные через API
                fetchProjectsData()
                    .then(() => { })
                    .catch(() => { });
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

                selectedTypes = typesFromQuery
                    ? typesFromQuery.split(",").map((type) => type.trim())
                    : [];

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

                dropdownHeader.addEventListener("click", function (e) {
                    e.stopPropagation();
                    console.log('clicked')

                    if (dropdownBody.classList.contains("active")) {
                        closeMenu();
                        console.log('close')
                    } else {
                        console.log('open')
                        closeAllDropdowns();
                        toggleMenu();
                    }
                });

                document.addEventListener("click", function (event) {
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

        // Запуск функции
        secondaryDropDownPropertyType();
        window.addEventListener("popstate", secondaryDropDownPropertyType);




                

                function mapDropDownSizeMobile() {
                    const dropdownContainer = document.querySelector("#mapSizeFilterMobile");
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

                            sizeItem.addEventListener("click", function (e) {
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

                        fetchProjectsData()
                            .then(() => { })
                            .catch(() => { });
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

                        sizeMin = urlParams.get("minSize")
                            ? parseInt(urlParams.get("minSize"), 10)
                            : null;
                        sizeMax = urlParams.get("maxSize")
                            ? parseInt(urlParams.get("maxSize"), 10)
                            : null;

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

                        dropdownHeader.addEventListener("click", function (e) {
                            e.stopPropagation();

                            if (dropdownBody.classList.contains("active")) {
                                closeMenu();
                            } else {
                                closeAllDropdowns();
                                toggleMenu();
                            }
                        });

                        document.addEventListener("click", function (event) {
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
                mapDropDownSizeMobile();
                window.addEventListener("popstate", mapDropDownSizeMobile);

                function mapDropDownHandoverMobile() {
                    const dropdownContainer = document.querySelector("#mapHandoverFilterMobile");
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

                            handoverItem.addEventListener("click", function (e) {
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

                        fetchProjectsData()
                            .then(() => { })
                            .catch(() => { });
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
                        }[quarter];
                        return `${year}-${month}-01`;
                    }

                    function compareDates(dateText1, dateText2) {
                        const [quarter1, year1] = dateText1.split(" ");
                        const [quarter2, year2] = dateText2.split(" ");
                        const month1 = { Q1: "01", Q2: "04", Q3: "07", Q4: "10" }[quarter1];
                        const month2 = { Q1: "01", Q2: "04", Q3: "07", Q4: "10" }[quarter2];

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

                        handoverMin = urlParams.get("handoverMin")
                            ? convertFromISODate(urlParams.get("handoverMin"))
                            : null;
                        handoverMax = urlParams.get("handoverMax")
                            ? convertFromISODate(urlParams.get("handoverMax"))
                            : null;

                        updateHandoversStyles();
                    }

                    function convertFromISODate(isoDate) {
                        const [year, month] = isoDate.split("-");
                        const quarter = {
                            "01": "Q1",
                            "04": "Q2",
                            "07": "Q3",
                            10: "Q4",
                        }[month];
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

                        dropdownHeader.addEventListener("click", function (e) {
                            e.stopPropagation();

                            if (dropdownBody.classList.contains("active")) {
                                closeMenu();
                            } else {
                                closeAllDropdowns();
                                toggleMenu();
                            }
                        });

                        document.addEventListener("click", function (event) {
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
                mapDropDownHandoverMobile();
                window.addEventListener("popstate", mapDropDownHandoverMobile);

                function mapDropDownLocationMobile() {
                    const dropdownContainer = document.querySelector("#mapLocationFilterMobile");
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

                            selectAllItem.addEventListener("click", function (e) {
                                e.stopPropagation();
                                handleSelectAll(area.subAreas);
                            });

                            subAreaList.appendChild(selectAllItem);

                            // Добавляем подтерритории
                            area.subAreas.forEach((subArea) => {
                                const subAreaItem = document.createElement("div");
                                subAreaItem.className =
                                    "filterPropertiesWrapper__dropDown_item location";
                                subAreaItem.textContent = subArea.label;

                                const subAreaCheckBox = document.createElement("div");
                                subAreaCheckBox.className =
                                    "filterPropertiesWrapper__customCheckBox";

                                subAreaItem.appendChild(subAreaCheckBox); // Добавляем чекбокс

                                subAreaItem.addEventListener("click", function (e) {
                                    e.stopPropagation();
                                    handleSubAreaSelection(subArea.value, area.subAreas);
                                });

                                subAreaList.appendChild(subAreaItem);
                            });

                            // Добавляем обработчик нажатия для главной территории
                            areaItem.addEventListener("click", function (e) {
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
                            selectedLocations.size > 0
                                ? Array.from(selectedLocations).join(",")
                                : null
                        );
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
                            selectedLocations.size > 0
                                ? Array.from(selectedLocations).join(",")
                                : null
                        );
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

                    dropdownHeader.addEventListener("click", function (e) {
                        e.stopPropagation();

                        if (dropdownBody.classList.contains("active")) {
                            closeMenu();
                        } else {
                            closeAllDropdowns();
                            toggleMenu();
                        }
                    });

                    document.addEventListener("click", function (event) {
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
                mapDropDownLocationMobile();
                window.addEventListener("popstate", mapDropDownLocationMobile);

                function updateFilterButtonStateMap() {
                    const filterButton = document.getElementById("filterMobile");
                    const filterCountCircle = document.getElementById("filtersLenghMobileMap");

                    if (!filterButton || !filterCountCircle) {
                        console.warn("Filter button or count circle not found!");
                        return;
                    }

                    const countActiveFilters = () => {
                        const hash = window.location.hash.substring(1);
                        const queryString = hash.includes("?") ? hash.split("?")[1] : "";
                        const queryParams = new URLSearchParams(queryString);

                        const filterKeys = [
                            "sort", "projectName", "minPrice", "maxPrice",
                            "minSize", "maxSize", "handoverMin",
                            "handoverMax", "bedrooms", "subAreas"
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

                    // Initial update of the filter count display
                    updateFilterCountDisplay();

                    // Update on window resize
                    window.addEventListener("resize", updateFilterCountDisplay);
                }
                updateFilterButtonStateMap();

                function utf8ToBase64(str) {
                    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) =>
                        String.fromCharCode(parseInt(p1, 16))
                    ));
                }

                function renderValueFilterFromQueryMapMobile() {
                    const queryString = window.location.search.substring(1);
                    if (!queryString) {
                        // Очищаем элементы, если queryString пустая
                        clearFilterValues();
                        return;
                    }

                    const queryParams = new URLSearchParams(queryString);

                    // IDs для отображения фильтров
                    const bedroomsContainer = document.getElementById("selectValueMapBedrooms");
                    const priceContainer = document.getElementById("selectValueMapPrice");
                    const sizeContainer = document.getElementById("selectValueMapSize");
                    const handoverContainer = document.getElementById("selectValueMapHandover");
                    const locationContainer = document.getElementById("selectValueMapFilterLocation");

                    // Очистка элементов перед обновлением
                    clearFilterValues();

                    // Bedrooms
                    if (queryParams.has("bedrooms") && bedroomsContainer) {
                        const bedrooms = queryParams.get("bedrooms").split(",");
                        bedroomsContainer.innerHTML = ""; // Очищаем перед добавлением
                        bedrooms.forEach((bedroom) => {
                            addFilterItem(bedroomsContainer, `Bedroom: ${bedroom}`);
                        });
                    }

                    // Price
                    if ((queryParams.has("minPrice") || queryParams.has("maxPrice")) && priceContainer) {
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
                            addFilterItem(priceContainer, priceText);
                        }
                    }

                    // Size
                    if ((queryParams.has("minSize") || queryParams.has("maxSize")) && sizeContainer) {
                        const minSize = queryParams.get("minSize");
                        const maxSize = queryParams.get("maxSize");
                        let sizeText = "";

                        if (minSize && maxSize) {
                            sizeText = `${minSize} - ${maxSize} sq.m`;
                        } else if (minSize) {
                            sizeText = `From ${minSize} sq.m`;
                        }

                        if (sizeText) {
                            addFilterItem(sizeContainer, sizeText);
                        }
                    }

                    // Handover
                    if ((queryParams.has("handoverMin") || queryParams.has("handoverMax")) && handoverContainer) {
                        const handoverMin = queryParams.get("handoverMin");
                        const handoverMax = queryParams.get("handoverMax");
                        let handoverText = "";

                        if (handoverMin && handoverMax) {
                            handoverText = `${formatHandoverDate(handoverMin)} - ${formatHandoverDate(handoverMax)}`;
                        } else if (handoverMin) {
                            handoverText = `From ${formatHandoverDate(handoverMin)}`;
                        }

                        if (handoverText) {
                            addFilterItem(handoverContainer, handoverText);
                        }
                    }

                    // Location (subAreas)
                    if (queryParams.has("subAreas") && locationContainer) {
                        const subAreas = queryParams.get("subAreas").split(",");
                        locationContainer.innerHTML = ""; // Очищаем перед добавлением
                        subAreas.forEach((location) => {
                            addFilterItem(locationContainer, `${location}`);
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
                        if (bedroomsContainer) bedroomsContainer.innerHTML = "";
                        if (priceContainer) priceContainer.innerHTML = "";
                        if (sizeContainer) sizeContainer.innerHTML = "";
                        if (handoverContainer) handoverContainer.innerHTML = "";
                        if (locationContainer) locationContainer.innerHTML = "";
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
                renderValueFilterFromQueryMapMobile();
                window.addEventListener("popstate", renderValueFilterFromQueryMapMobile);
            }
        }

        const mapboxScript = document.createElement('script');
        mapboxScript.src = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.js';
        mapboxScript.onload = onScriptLoad;
        document.body.appendChild(mapboxScript);

        // Создание и добавление тега для Mapbox Draw
        const drawScript = document.createElement('script');
        drawScript.src = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.3.0/mapbox-gl-draw.js';
        drawScript.onload = onScriptLoad;
        document.body.appendChild(drawScript);

        // Создание и добавление тега для Turf.js
        const turfScript = document.createElement('script');
        turfScript.src = 'https://cdn.jsdelivr.net/npm/@turf/turf@6.5.0/turf.min.js';
        turfScript.onload = onScriptLoad;
        document.body.appendChild(turfScript);

        // Подключение CSS для Mapbox
        const mapboxCSS = document.createElement('link');
        mapboxCSS.href = 'https://api.mapbox.com/mapbox-gl-js/v2.14.1/mapbox-gl.css';
        mapboxCSS.rel = 'stylesheet';
        document.head.appendChild(mapboxCSS);

        // Подключение CSS для Mapbox Draw
        const drawCSS = document.createElement('link');
        drawCSS.href = 'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.3.0/mapbox-gl-draw.css';
        drawCSS.rel = 'stylesheet';
        document.head.appendChild(drawCSS);
    });
</script>

</script>

<style>
/* 
  Фінальні, вдосконалені стилі для спливаючих вікон на карті.
*/

/* --- Загальні стилі для попапу --- */
.mapboxgl-popup-content {
    border-radius: 12px !important; 
    padding: 0 !important;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
}

/* --- Вікно для ОДНОГО проекту --- */
.mapboxgl-popup-content .mapPopup {
    width: 380px !important;
}
.mapboxgl-popup-content .swiper-container {
    height: 200px !important;
    border-top-left-radius: 12px !important;
    border-top-right-radius: 12px !important;
    overflow: hidden !important; 
}
.mapboxgl-popup-content .mapPopup__info-title {
    font-size: 17px !important;
    margin-bottom: 4px !important;
}
.mapboxgl-popup-content .mapPopup__info-list {
    margin-bottom: 14px !important;
    min-height: 16px;
}
.mapboxgl-popup-content .mapPopup__footer {
    display: flex !important;
    justify-content: space-between !important;
    align-items: center !important;
}
.mapboxgl-popup-content .mapPopup__info-price {
    font-size: 16px !important;
    font-weight: bold !important;
}
.mapboxgl-popup-content .mapPopupBtnRedirect {
    padding: 7px 14px !important;
    font-size: 13px !important;
}

/* --- Вікно для КІЛЬКОХ проектів (список) - ОСНОВНІ ЗМІНИ ТУТ --- */

/* 1. РОЗШИРЮЄМО ВСЕ ВІКНО */
.mapboxgl-popup-content .mapPopup.multi-project-popup {
    width: 320px !important; /* Було вузьке, робимо ширшим */
}

/* 2. Збільшуємо розмір фотографій */
.mapboxgl-popup-content .project-item > div:first-child { 
    width: 130px !important;  /* Трохи зменшуємо для балансу */
    height: 110px !important;
}

/* 3. Покращуємо верстку тексту */
.mapboxgl-popup-content .project-item-info {
    display: flex !important;
    flex-direction: column !important;
    justify-content: space-between !important; /* Розносимо текст і кнопку по вертикалі */
    height: 80px; /* Вирівнюємо висоту текстового блоку з фото */
}

/* 4. Запобігаємо обрізанню назви */
.mapboxgl-popup-content .project-item-info h3 {
    white-space: normal !important; /* Дозволяємо перенос слів */
}

</style>

<?php get_footer(); ?>