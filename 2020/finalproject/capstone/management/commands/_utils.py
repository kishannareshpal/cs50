from pathlib import Path

def getData(filename, is_photo=False, directory_name=None):
    """
    Opens a file located inside the data directory in this folder.
    """
    COMMANDS_DIR = "capstone/management/commands"
    data_dir = f"{COMMANDS_DIR}/data"
    if directory_name is not None:
        data_dir = f"{data_dir}/{directory_name}"
    filepath = Path(f"{data_dir}/{filename}")

    if is_photo: 
       return open(filepath.absolute(), mode="rb")
    else:
       return open(filepath.absolute())
