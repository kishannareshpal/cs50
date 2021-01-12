from ._utils import getData
from django.core.files.images import ImageFile
from capstone.models import User
import csv

def importbarbers(self):
    """
    docstring
    """
    self.stdout.write("Preparing to import barbers to your table")

    csvfile = getData("barbers.csv")
    barbers_csv = csv.reader(csvfile)

    barbers_imported = 0
    row_count = 0
    for first_name, last_name, email, password, photo_name in barbers_csv:
        # this skips first line of the file because it contains the csv headers.
        if not (row_count == 0):
            # Check if the user we are adding already exist.
            # If exists, skip.
            try:
                check = User.objects.get(email=email)
                self.stdout.write(self.style.NOTICE(f"x {first_name} {last_name}: Already exists"))

            except User.DoesNotExist:
                # Add
                photofile = getData(photo_name, directory_name="photos", is_photo=True)
                barber = User.objects.create_user(
                    email,
                    password,
                    first_name=first_name,
                    last_name=last_name,
                    is_staff=True,
                    is_barber=True,
                    photo=ImageFile(photofile, photo_name)
                )
                self.stdout.write(self.style.NOTICE(f"+ {first_name} {last_name}"))
                barbers_imported += 1
        row_count += 1

    if barbers_imported > 0:
        self.stdout.write(self.style.SUCCESS(f"Succesfully imported {barbers_imported} barbers."))
    else:
        self.stdout.write(self.style.WARNING(f"No barbers imported."))
