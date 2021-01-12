from ._utils import getData
from capstone.utils import str_to_time
from capstone.models import BusinessHour
import csv

def importbusinesshours(self):
    """
    Imports business hours to database
    """
    self.stdout.write("Preparing to import business hours to your table")

    # Check to see if table already contains data!
    count = BusinessHour.objects.count();
    if count > 0:
        # Data exists on this table, confirm:
        self.stdout.write(self.style.ERROR(f"Could not import any data."))
        self.stdout.write(self.style.NOTICE(f" - Please empty the BusinessHours table first, and then import."))
        return

    csvfile = getData("businesshours.csv")
    businesshours_csv = csv.reader(csvfile)

    businesshours = []
    row_count = 0
    for day, openingtime_str, closingtime_str in businesshours_csv:
        # this skips first line of the file because it contains the csv headers.
        if not (row_count == 0):
            bh = BusinessHour(
                day=day, 
                opening_time=str_to_time(openingtime_str), 
                closing_time=str_to_time(closingtime_str)
            )
            businesshours.append(bh)
            self.stdout.write(self.style.NOTICE(f"+ {BusinessHour.DAYS[int(day)]}"))
        row_count += 1
    
    # Bulk create
    BusinessHour.objects.bulk_create(businesshours)
    self.stdout.write(self.style.SUCCESS(f"Succesfully imported {len(businesshours)} business hours."))



