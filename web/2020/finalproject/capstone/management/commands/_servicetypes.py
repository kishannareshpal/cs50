from ._utils import getData
from capstone.models import ServiceType
import csv

def importservicetypes(self):
    """
    Imports service types to database
    """
    self.stdout.write("Preparing to import service types to your table")
    # Check to see if table already contains data!
    count = ServiceType.objects.count();
    if count > 0:
        # Data exists on this table, confirm:
        self.stdout.write(self.style.ERROR(f"Could not import any data."))
        self.stdout.write(self.style.NOTICE(f" - Please empty the ServiceTypes table first, and then import."))
        return
        
    csvfile = getData("servicetypes.csv")
    servicetypes_csv = csv.reader(csvfile)

    servicetypes = []
    row_count = 0
    for row in servicetypes_csv:
        title = row[0]
        # this skips first line of the file because it contains the csv headers.
        if not (row_count == 0):
            st = ServiceType(
                title=title
            )
            servicetypes.append(st)
            self.stdout.write(self.style.NOTICE(f"+ {title}"))
        row_count += 1
    
    # Bulk create
    ServiceType.objects.bulk_create(servicetypes)
    self.stdout.write(self.style.SUCCESS(f"Succesfully imported {len(servicetypes)} service types."))



