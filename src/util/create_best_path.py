from src.util.logger import setup_logger
from vendor.haversine import haversine

logger = setup_logger()



def total_distance(path):
    """
    Calculate the total distance of a given path by summing up the distances between each pair of consecutive points.

    Parameters:
    path (list): A list of dictionaries representing the cities in the path. Each dictionary should have 'latitude' and 'longitude' keys.

    Returns:
    float: The total distance of the path in kilometers.
    """
    distance = sum(
        haversine(path[i]['latitude'], path[i]['longitude'],
                  path[(i + 1) % len(path)]['latitude'], path[(i + 1) % len(path)]['longitude'])
        for i in range(len(path))
    )
    return distance


def two_opt(path):
    """
    Perform the 2-opt algorithm to improve the given path by swapping pairs of cities.

    The 2-opt algorithm is a local search algorithm used for solving the Traveling Salesman Problem (TSP).
    It iteratively swaps pairs of cities in the current path to find a more optimal solution.

    Parameters:
    path (list): A list of dictionaries representing the cities in the path. Each dictionary should have 'latitude' and 'longitude' keys.

    Returns:
    list: The improved path after applying the 2-opt algorithm.
    """
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
    """
    Perform the branch and bound algorithm to find the optimal solution for the Traveling Salesman Problem (TSP).

    Parameters:
    locations (list): A list of dictionaries representing the cities. Each dictionary should have 'latitude' and 'longitude' keys.

    Returns:
    tuple: A tuple containing the best path and its total cost. The best path is a list of dictionaries representing the cities in the order of visitation.
    """
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
    """
    Create the best path for a traveling salesman problem using either the 2-opt algorithm or the branch and bound algorithm,
    depending on the number of cities.

    Parameters:
    cities (list): A list of dictionaries representing the cities. Each dictionary should have 'latitude' and 'longitude' keys.

    Returns:
    list: A list of dictionaries representing the cities in the order of visitation. If no cities are provided,
    an error dictionary is returned with the key 'error' and value 'No cities provided'.
    """
    if not cities:
        logger.error("No cities provided")
        return {'error': 'No cities provided'}

    if len(cities) > 10:
        best_path = two_opt(cities)
    else:
        best_path, _ = branch_and_bound(cities)

    return best_path
