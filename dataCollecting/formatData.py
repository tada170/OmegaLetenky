import csv
from geopy.distance import geodesic

city_coordinates = {
    'Amsterdam': (52.3676, 4.9041),
    'Andorra la Vella': (42.5078, 1.5211),
    'Athény': (37.9838, 23.7275),
    'Bělehrad': (44.7866, 20.4489),
    'Berlín': (52.5200, 13.4050),
    'Bern': (46.9481, 7.4474),
    'Bratislava': (48.1486, 17.1077),
    'Brusel': (50.8503, 4.3517),
    'Bukurešť': (44.4268, 26.1025),
    'Dublin': (53.3331, -6.2489),
    'Helsinky': (60.1695, 24.9354),
    'Kodaň': (55.6761, 12.5683),
    'Kyjev': (50.4501, 30.5234),
    'Lisabon': (38.7169, -9.1399),
    'Ljubljana': (46.0511, 14.5051),
    'Londýn': (51.5074, -0.1278),
    'Vídeň': (48.2082, 16.3738),
    'Luxembourg': (49.6117, 6.1319),
    'Madrid': (40.4168, -3.7038),
    'Minsk': (53.9006, 27.5590),
    'Monako': (43.7384, 7.4246),
    'Moskva': (55.7558, 37.6173),
    'Oslo': (59.9139, 10.7522),
    'Budapešť': (47.4979, 19.0402),
    'Paříž': (48.8566, 2.3522),
    'Podgorica': (42.4304, 19.2594),
    'Praha': (50.0880, 14.4208),
    'Reykjavík': (64.1355, -21.8954),
    'Riga': (56.9496, 24.1052),
    'Řím': (41.9028, 12.4964),
    'Malta (Valletta)': (35.8997, 14.5146),
    'Mnichov': (48.1351, 11.5820),
    'San Marino': (43.9333, 12.4500),
    'Sarajevo': (43.8563, 18.4131),
    'Skopje': (41.9981, 21.4254),
    'Sofia': (42.6975, 23.3242),
    'Stockholm': (59.3293, 18.0686),
    'Tallinn': (59.4370, 24.7536),
    'Tirana': (41.3275, 19.8189),
    'Vaduz': (47.1416, 9.5215),
    'Valletta': (35.8997, 14.5146),
    'Varšava': (52.2298, 21.0122),
    'Vilnius': (54.6872, 25.2797),
    'Záhřeb': (45.8150, 15.9819),
    'Sofie': (42.6975, 23.3242),
    'Ostrava': (49.8346, 18.2922),
    'Barcelona': (41.3851, 2.1734),
}


def calculate_distance(departure_city, arrival_city):
    if departure_city in city_coordinates and arrival_city in city_coordinates:
        return round(geodesic(city_coordinates[departure_city], city_coordinates[arrival_city]).kilometers)
    return 'N/A'


input_file = 'flights.csv'
output_file = 'flights_updated.csv'

with open(input_file, mode='r', newline='', encoding='utf-8') as infile, \
        open(output_file, mode='w', newline='', encoding='utf-8') as outfile:
    reader = csv.reader(infile)
    writer = csv.writer(outfile)

    header = next(reader)
    if 'Distance' not in header:
        header.append('Distance')
    writer.writerow(header)

    for row in reader:
        row[4] = row[4].replace(" Kč", "").strip()
        row[6] = '0' if row[6] == 'přímý let' else row[6].split()[0]
        distance = calculate_distance(row[1], row[2])
        row.append(distance)
        writer.writerow(row)

print(f"Úprava dat byla dokončena. Upravený soubor byl uložen jako '{output_file}'.")