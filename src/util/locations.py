import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371  # Radius of Earth in kilometers

    # Convert degrees to radians
    lat1, lon1, lat2, lon2 = map(math.radians, [float(lat1), float(lon1), float(lat2), float(lon2)])

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))

    return R * c  # Distance in kilometers

def create_best_path(selected_countries):
    geocode_array = [{'city': city['name'], 'latitude': city['latitude'], 'longitude': city['longitude']} for city in selected_countries]
    if not geocode_array:
        return {'error': 'Could not geocode all selected countries'}

    best_path, _ = branch_and_bound(geocode_array)
    return best_path

def branch_and_bound(geolocations):
    n = len(geolocations)
    best_path = None
    best_cost = float('inf')

    def search(path, visited, cost):
        nonlocal best_path, best_cost
        if len(path) == n:
            cost += haversine(path[-1]['latitude'], path[-1]['longitude'], path[0]['latitude'], path[0]['longitude'])
            if cost < best_cost:
                best_cost = cost
                best_path = path + [path[0]]
            return

        for i in range(n):
            if i not in visited:
                new_cost = cost + haversine(path[-1]['latitude'], path[-1]['longitude'], geolocations[i]['latitude'], geolocations[i]['longitude'])
                if new_cost < best_cost:
                    search(path + [geolocations[i]], visited | {i}, new_cost)

    search([geolocations[0]], {0}, 0)
    return best_path, best_cost
