import csv
import os
from bs4 import BeautifulSoup

csv_file = 'flights.csv'
file_exists = os.path.isfile(csv_file)

with open(csv_file, mode='a', newline='', encoding='utf-8') as file:
    writer = csv.writer(file)

    if not file_exists:
        writer.writerow(
            ['Flight Number', 'Departure City', 'Arrival City', 'Duration', 'Price', 'Airline', 'Changes', "Adult"])

    html_dir = './html'

    for filename in os.listdir(html_dir):
        if filename.endswith('.html'):
            filepath = os.path.join(html_dir, filename)
            with open(filepath, 'r', encoding='utf-8') as html_file:
                soup = BeautifulSoup(html_file.read(), 'html.parser')
                flights = soup.find_all('div', class_='airticketOfferItem')
                for i in range(2):
                    for flight in flights:

                        flight_number = flight.find('a', class_='flight-number')
                        flight_number = flight_number.text.strip() if flight_number else 'N/A'

                        departure_city = flight.find('div', class_='city')
                        departure_city = departure_city.text.strip() if departure_city else 'N/A'

                        arrival_cities = flight.find_all('div', class_='city')
                        arrival_city = arrival_cities[-1].text.strip() if len(arrival_cities) > 1 else 'N/A'

                        duration = flight.find('div', class_='duration')
                        duration = duration.text.strip() if duration else 'N/A'

                        changes = flight.find('div', class_='changes')
                        changes = changes.text.strip() if changes else 'N/A'

                        price = flight.find('strong', class_='d-md-block') or flight.find('strong',
                                                                                          class_='d-inline-block') or flight.find(
                            'strong', class_='text-nowrap')
                        price = price.text.strip().replace("\xa0", "") if price else 'N/A'
                        price = price.replace("Kč", "") if price else 'N/A'

                        airline = flight.find('img', class_='aeroline-logo')
                        airline = airline.get('alt') if airline else 'N/A'

                        adult = 1

                        writer.writerow(
                            [flight_number, departure_city, arrival_city, duration, price, airline, changes, adult])

        print("Všechna data byla přidána do CSV.")
