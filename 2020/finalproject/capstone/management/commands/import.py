from ._utils import getData
from django.core.management.base import BaseCommand
from ._businsesshours import importbusinesshours
from ._services import importservices
from ._barbers import importbarbers
from ._servicetypes import importservicetypes

class Command(BaseCommand):
    help = 'Imports data to database'

    def add_arguments(self, parser):
        parser.add_argument(
            'name',
            help="The name(s) of the data type(s) to be imported.",
            type=str,
            choices=("businesshours", "services", "servicetypes", "barbers",),
            nargs="+"
        )

    def handle(self, *args, **options):
        did_execute = False
        selectedNames = options['name']

        if "businesshours" in selectedNames:
            importbusinesshours(self)
            did_execute = True

        if "services" in selectedNames:
            importservices(self)
            did_execute = True
        
        if "servicetypes" in selectedNames:
            importservicetypes(self)
            did_execute = True
        
        if "barbers" in selectedNames:
            importbarbers(self)
            did_execute = True

        if not did_execute:
            # In case of no option matching the required was found, print help.
            self.stdout.write(self.style.ERROR(f"No data was imported"))
            self.stdout.write(self.style.NOTICE(f" - Invalid command. See --help."))
