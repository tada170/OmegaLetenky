import math
from src.util.logger import setup_logger

logger = setup_logger()


def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    lat1, lon1, lat2, lon2 = map(math.radians, map(float, [lat1, lon1, lat2, lon2]))
    dlat = lat2 - lat1
    dlon = lon2 - lon1

    a = math.sin(dlat / 2) ** 2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon / 2) ** 2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    distance = R * c
    return distance


def total_distance(path):
    distance = sum(
        haversine(path[i]['latitude'], path[i]['longitude'],
                  path[(i + 1) % len(path)]['latitude'], path[(i + 1) % len(path)]['longitude'])
        for i in range(len(path))
    )
    return distance


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
    best_cost = 1000000

    def search(path, visited, cost):
        nonlocal best_path, best_cost

        if len(path) == n:
            cost += haversine(path[-1]['latitude'], path[-1]['longitude'],
                              path[0]['latitude'], path[0]['longitude'])
            if cost < best_cost:
                best_cost = cost

                best_path = path[:]
                best_path.append(path[0])
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
        logger.error("No cities provided")
        return {'error': 'No cities provided'}

    if len(cities) > 10:
        best_path = two_opt(cities)
    else:
        best_path, _ = branch_and_bound(cities)

    return best_path
