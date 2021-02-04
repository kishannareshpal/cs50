from ast import Str
from re import match
import random as rr
from django import forms
from django.http.response import Http404, HttpResponse, HttpResponseRedirect
import markdown2
from django.contrib import messages
from django.http import request
from django.urls import reverse
from django.shortcuts import redirect, render

from . import util

def flush(request):
    request.session.flush()
    return redirect(reverse("index"))

def index(request):
    """
        Home page
        - Lists all entries, which are clickable to be viewed.
    """
    all_entries = util.list_entries()
    return render(request, "encyclopedia/index.html", {
        "entries": all_entries,
        "activemenu": "index"
    })


def search(request):
    """
        Search Page
        - When a query is given which matches an a substring of one of the entry, list all matched entries or none, if no match.
        - When a query exactly matches one of the entry, show that entry.
        - When no search query is given, 400!

    """
    # Check if we have a search query string
    query = request.GET.get("q")
    if not query:
        # No search query given
        raise Http404("No search query given")

    else:
        # Lookup the entries for a match!
        all_entries = util.list_entries()
        for entry in all_entries:
            if entry.lower() == query.lower():
                return redirect(reverse("show", args=[entry]))

        else:
            # Check for substring matches
            matched_entries = [entry for entry in all_entries if query.lower() in entry.lower()] # returns a new list of entries with elements that contains the query word; case insensitive
            return render(request, "encyclopedia/searchresult.html", {
                "q": query,
                "matched_entries": matched_entries,
                "num_entries": len(matched_entries)
            })

    pass


def show(request, title):
    # Check if the title exists:
    contentInMarkdown = util.get_entry(title)

    if contentInMarkdown is not None:
        # Show the page with content
        content = markdown2.markdown(contentInMarkdown) # convert the markdown to html
        ctx = {
            "title": title,
            "content": content
        }
        return render(request, "encyclopedia/show.html", ctx)

    else:
        # Show an error page.
        ctx = {
            "error_title": f"`{title}` not found!",
        }
        raise Http404("Page not found")


class SubmitForm(forms.Form):
    error_css_class = 'is-invalid'
    required_css_class = 'is-required'

    title = forms.CharField(
        label="",
        widget=forms.TextInput(attrs={'class': 'form-control'}),
    )
    body = forms.CharField(
        label="",
        widget=forms.Textarea(attrs={'class': 'mt-2 form-control', 'rows': '16'}),
    )
    

def submit(request):
    '''
        [GET] Create a new wiki page
        [POST] Save a new wiki page into a .md (markdown) file inside ./entries/
    '''
    if request.method == "POST":
        # Save the entry into a file
        postdata = request.POST
        print(postdata)
        # Take in the data the user submitted and save it as form
        form = SubmitForm(postdata, initial={
            "title": postdata.get("title", "")
        })
        
        if form.is_valid():
            # Check if form data is valid
            title = form.cleaned_data.get("title", "")
            title = title[:1].upper() + title[1:] # capitalize ONLY the first letter of the title without modifying the subsequent characters (E.g: hTML -> HTML, javaScript -> JavaScript)
            content = form.cleaned_data.get("body", "")

            # Check if we are saving to draft, or submitting the wiki page.
            if "btn_draft" in postdata:
                # Save as draft!
                if "draft_id" in postdata:
                    # Saving as draft an existing draft? Just replace it.
                    draft_id = postdata["draft_id"]
                    util.save_draft_entry(title, content, request, id=draft_id)
                else:
                    util.save_draft_entry(title, content, request)

                # Redirect the user to the list of drafts
                return HttpResponseRedirect(reverse("drafts"))

            elif "btn_delete" in postdata:
                # Delete! but from where?:
                # Check if we are deleting a draft or an actual wiki page.
                # We know that we are dealing with a draft if we have a draft_id in the request.
                if "draft_id" in postdata:
                    # delete from drafts!
                    util.delete_draft_by_id(request, postdata["draft_id"])
                    return HttpResponseRedirect(reverse("drafts"))

                else: 
                    # delete the actual wiki!
                    util.delete_entry(title)
                    return HttpResponseRedirect(reverse("index"))

            else:
                # Submit the .md page into ./entries/{title}.md
                # Don't allow saving a wiki page with the same title

                is_saving_edit = "btn_saveedit" in postdata
                if util.entry_exists(title) and not is_saving_edit:
                    # Entry exists. Abort!
                    form.add_error("title", "An encyclopedia with the same title already exists")
                    # If the form is invalid, re-render the page with existing information, and showing the validation errors.
                    # Append css class to every field that contains errors.
                    for field in form.errors:
                        form[field].field.widget.attrs['class'] += ' is-invalid'

                    return render(request, "encyclopedia/submit.html", {
                        "activemenu": "submit",
                        "form": form
                    })

                if "draft_id" in postdata:
                    # If we are submitting from a draft, delete this draft first
                    util.delete_draft_by_id(request, postdata["draft_id"])

                # Now save the entry.
                util.save_entry(title, content)

                # And finally redirect the user to the newly created page
                return HttpResponseRedirect(reverse("index"))
    
        else:
            # If the form is invalid, re-render the page with existing information, and showing the validation errors.
            # Append css class to every field that contains errors.
            for field in form.errors:
                form[field].field.widget.attrs['class'] += ' is-invalid'

            return render(request, "encyclopedia/submit.html", {
                "activemenu": "submit",
                "form": form
            })
    
    # Show the form to input the details needed for the new wiki page
    return render(request, "encyclopedia/submit.html", {
        "activemenu": "submit",
        "form": SubmitForm()
    })



def drafts(request):
    """
        List all drafts to manage/edit
    """
    drafts = request.session.get("drafts", [])
    return render(request, "encyclopedia/drafts.html", {
        'drafts': drafts,
        'activemenu': 'drafts'
    })
    

def editwiki(request, title):
    """
    Edit a wiki page
    """
    content = util.get_entry(title)
    if content is not None:
        form = SubmitForm(initial={
            "title": title,
            "body": content
        })

        return render(request, "encyclopedia/submit.html", {
            "activemenu": "submit",
            "form": form,
            "is_editing": True
        })
    


def editdraft(request, id):
    """
    Edit a draft
    """
    draft = util.get_draft_by_id(request, id)

    if draft is not None:
        form = SubmitForm(initial={
            "title": draft["title"],
            "body": draft["body"]
        })

        return render(request, "encyclopedia/submit.html", {
            "activemenu": "submit",
            "draft_id": id,
            "form": form
        })


def deletedraft(request, id):
    """
    Delete a draft by its id.
    """
    util.delete_draft_by_id(request, id)
    return HttpResponseRedirect(reverse("drafts"))
    

def deletewiki(request, title):
    """
    Delete a draft by its id.
    """
    util.delete_entry(title)
    return HttpResponseRedirect(reverse("index"))


def random(request):
    '''
    Simply redirect to a random wiki page!
    '''
    all_entries = util.list_entries()
    random_entry_title = rr.choice(all_entries) # pick an arbitrary item
    return redirect(reverse("show", args=[random_entry_title]))


    
