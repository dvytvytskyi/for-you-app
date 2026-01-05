# Backend API Specification for Property Filtering

## Endpoint: `GET /api/v1/properties`

This endpoint must support the following query parameters to enable full filtering functionality on the mobile app.

### 1. `propertyType` (Listing Type)
*   **Description**: Filters by the primary category of the property (Primary/Off-plan vs Secondary).
*   **Type**: `string`
*   **Values**: `off-plan`, `secondary`
*   **Behavior**: Exact match.

### 2. `type` (Unit Type)
*   **Description**: Filters by the specific type of the unit.
*   **Type**: `string` (comma-separated for multiple values)
*   **Values**: `apartment`, `villa`, `penthouse`, `townhouse`, `duplex`, `loft`, `plot`, `office`
*   **Behavior**:
    *   One value: `type=apartment` -> Returns only apartments.
    *   Multiple values: `type=villa,townhouse` -> Returns properties that are EITHER a villa OR a townhouse (OR logic).
    *   **Crucial**: This must work for both `off-plan` projects (checking unit types within the project) and `secondary` properties (checking the property type itself).

### 3. `location` (Area/District)
*   **Description**: Filters by neighborhood or district name.
*   **Type**: `string`
*   **Example**: `location=Dubai Marina`
*   **Behavior**:
    *   **Text Match**: Should verify if `area.nameEn` OR `city.nameEn` matches the provided string (Case Insensitive).
    *   **Multiple**: Ideally support `location=Dubai Marina,Downtown Dubai` (OR logic).
    *   **Fallback**: If strict ID matching is difficult, please ensure that a text search on the "Area" name works reliably.

### 4. `minPrice` & `maxPrice`
*   **Description**: Price range filtering.
*   **Type**: `number`
*   **Behavior**:
    *   `minPrice=1000000`: Returns properties with `price >= 1,000,000`.
    *   `maxPrice=5000000`: Returns properties with `price <= 5,000,000`.
    *   For **Off-plan**: Check against `priceFrom`.
    *   For **Secondary**: Check against `price`.

### 5. `bedrooms`
*   **Description**: Filters by number of bedrooms.
*   **Type**: `string` (comma-separated)
*   **Format**: `studio`, `1`, `2`, `3`, `4`, `5+`
*   **Behavior**:
    *   `bedrooms=2`: Returns properties with exactly 2 bedrooms.
    *   `bedrooms=studio`: Returns properties with 0 bedrooms.
    *   `bedrooms=1,2`: Returns properties with 1 OR 2 bedrooms.
    *   `bedrooms=5+`: Returns properties with 5 OR MORE bedrooms.
    *   **Off-plan Logic**: A project matches if its range (`bedroomsFrom` to `bedroomsTo`) **overlaps** with the requested filter.
        *   Example: Project has 1-3 beds. Filter is `2`. Match? YES.

### Example Full Request
```http
GET /api/v1/properties?propertyType=off-plan&type=apartment,penthouse&location=Dubai Marina&minPrice=500000&maxPrice=3000000&bedrooms=1,2
```

---

## Endpoint: `GET /api/v1/locations` (New Requirement)

To avoid hardcoding location names on the client, we need an endpoint to fetch available locations.

*   **Response**:
    ```json
    {
      "success": true,
      "data": [
        {
          "id": "uuid-1",
          "name": "Dubai Marina",
          "city": "Dubai"
        },
        {
          "id": "uuid-2",
          "name": "Downtown Dubai",
          "city": "Dubai"
        }
      ]
    }
    ```
*   **Usage**: The mobile app will call this on startup to populate the Location filter. When a user selects a location, we will send its `name` (or `id` if supported) to the `GET /properties` endpoint.
