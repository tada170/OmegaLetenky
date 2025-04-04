import math

def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    lat1, lon1, lat2, lon2 = map(math.radians, map(float, [lat1, lon1, lat2, lon2]))
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c

def total_distance(path):
    return sum(
        haversine(path[i]['latitude'], path[i]['longitude'],
                  path[(i + 1) % len(path)]['latitude'], path[(i + 1) % len(path)]['longitude'])
        for i in range(len(path))
    )

def two_opt(path):
    best_path = path
    improved = True

    while improved:
        improved = False
        for i in range(1, len(best_path) - 2):
            for j in range(i + 1, len(best_path)):
                if j - i == 1:
                    continue
                new_path = best_path[:i] + best_path[i:j][::-1] + best_path[j:]
                if total_distance(new_path) < total_distance(best_path):
                    best_path = new_path
                    improved = True
        if not improved:
            break

    return best_path

def branch_and_bound(locations):
    n = len(locations)
    best_path = None
    best_cost = float('inf')

    def search(path, visited, cost):
        nonlocal best_path, best_cost

        if len(path) == n:
            cost += haversine(path[-1]['latitude'], path[-1]['longitude'],
                              path[0]['latitude'], path[0]['longitude'])
            if cost < best_cost:
                best_cost = cost
                best_path = path + [path[0]]
            return

        for i in range(n):
            if i not in visited:
                next_city = locations[i]
                next_cost = cost + haversine(path[-1]['latitude'], path[-1]['longitude'],
                                             next_city['latitude'], next_city['longitude'])
                if next_cost < best_cost:
                    search(path + [next_city], visited | {i}, next_cost)

    search([locations[0]], {0}, 0)
    return best_path, best_cost

def create_best_path(cities):
    if not cities:
        return {'error': 'No cities provided'}

    geocoded = [{'country': c['country'], 'city': c['name'], 'latitude': c['latitude'], 'longitude': c['longitude']}for c in cities]

    if len(geocoded) > 10:
        best_path = two_opt(geocoded)
    else:
        best_path, _ = branch_and_bound(geocoded)

    return best_path
