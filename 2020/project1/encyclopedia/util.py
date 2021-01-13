import re
import uuid

from django import forms
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage




def list_entries():
    """
    Returns a list of all names of encyclopedia entries.
    """
    _, filenames = default_storage.listdir("entries")
    return list(sorted(re.sub(r"\.md$", "", filename) for filename in filenames if filename.endswith(".md")))


def save_entry(title, content):
    """
    Saves an encyclopedia entry, given its title and Markdown
    content. If an existing entry with the same title already exists,
    it is replaced.
    """
    filename = f"entries/{title}.md"
    if default_storage.exists(filename):
        default_storage.delete(filename)
    default_storage.save(filename, ContentFile(content))


def entry_exists(title):
    """
    Check if an encyclopedia with the title exists or not.
    
    :returns: true if exists, otherwise false
    """
    try:
        f = default_storage.open(f"entries/{title}.md")
        return True

    except FileNotFoundError:
        return False


def get_entry(title):
    """
    Retrieves an encyclopedia entry by its title. If no such
    entry exists, the function returns None.
    """
    try:
        f = default_storage.open(f"entries/{title}.md")
        return f.read().decode("utf-8")

    except FileNotFoundError:
        return None


def delete_entry(title):
    """
    Delete an encyclopedia entry by its title.
    """
    filename = f"entries/{title}.md"
    if default_storage.exists(filename):
        default_storage.delete(filename)




def list_drafts_ids(request):
    """
    Returns ids of all saved drafts
    """
    if "drafts" not in request.session:
        request.session["drafts"] = []

    drafts = request.session["drafts"]
    return [draft["id"] for draft in drafts]


def delete_draft_by_id(request, id):
    print(f'{request.session["drafts"]}')
    print("1. Deleting ID: " + id)
    all_drafts = request.session["drafts"]
    for i in range(len(all_drafts)):
        print("Looping")
        if all_drafts[i]['id'] == id:
            print("Found")
            del all_drafts[i]
            request.session["drafts"] = all_drafts
            print("Deleted!")
            break


def save_draft_entry(title, content, request, id=None):
    """
    Saves draft for an encyclopedia entry, given its title and Markdown
    content. If an existing draft entry with the same title already exists,
    it is replaced.
    
    Pass the id to replace the old draft.
    """
    if "drafts" not in request.session:
        request.session["drafts"] = []

    if id is None:
        id = uuid.uuid4()

    else:
        # we are deleting the old one as an alternative to "replacing".
        delete_draft_by_id(request, id)

    wiki = {
        "id": f"{id}",
        "title": title,
        "body": content
    }
    request.session['drafts'] += [wiki]


def get_draft_by_id(request, draft_id):
    """
    Retrieves a saved draft by its id. If no such
    draft exists, the function returns None.
    """

    for draft in request.session["drafts"]:
        if draft["id"] == draft_id:
            # Found a valid draft, return it
            return draft

    return None # Otherwise return None.

