from os import name, pathconf
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("wiki/<title>", views.show, name="show"),
    path("wiki/<title>/edit", views.editwiki, name="editwiki"),
    path("wiki/<title>/delete", views.deletewiki, name="deletewiki"),
    path("search", views.search, name="search"),
    path("submit", views.submit, name="submit"),
    path("drafts", views.drafts, name="drafts"),
    path("drafts/<id>/edit", views.editdraft, name="editdraft"),
    path("drafts/<id>/delete", views.deletedraft, name="deletedraft"),
    path("random", views.random, name="random"),


    path("flush", views.flush)
]
