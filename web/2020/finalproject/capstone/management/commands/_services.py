from capstone.management.commands._utils import getData
from capstone.models import Service, ServiceType
import csv

def importservices(self):
    """
    Imports services to database
    """
    self.stdout.write("Preparing to import services to your table")

    # Check to see if table already contains data!
    count = Service.objects.count();
    if count > 0:
        # Data exists on this table, confirm:
        self.stdout.write(self.style.ERROR(f"Could not import any data."))
        self.stdout.write(self.style.NOTICE(f" - Please empty the Services table first, and then import."))
        return

    csvfile = getData("services.csv")
    servicetypes_csv = csv.reader(csvfile)

    services = []
    row_count = 0
    for service_type_title, title, description, price_in_gbp, duration_in_mins in servicetypes_csv:
        # this skips first line of the file because it contains the csv headers.
        if not (row_count == 0):

            # grab the service type
            try:
                service_type = ServiceType.objects.get(title=service_type_title)
            
            except ServiceType.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"Service type `{service_type_title}` could not be found."))
                continue
            
            else:
                s = Service(
                    type=service_type,
                    title=title,
                    description=description,
                    price_in_gbp=price_in_gbp,
                    duration_in_mins=duration_in_mins,
                )
                services.append(s)
                self.stdout.write(self.style.NOTICE(f"+ {title}"))
        row_count += 1
    
    # Bulk create
    Service.objects.bulk_create(services)
    self.stdout.write(self.style.SUCCESS(f"Succesfully imported {len(services)} services."))



